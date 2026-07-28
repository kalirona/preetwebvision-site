import React from 'react';
import { motion } from 'motion/react';
import { Shield, ShieldAlert, CheckCircle, AlertTriangle, Key, Clock, Globe, RefreshCcw, Landmark, Cpu, Database, Eye, ShieldCheck, X } from 'lucide-react';

interface SecuritySetting {
  twoFactorEnabled: boolean;
  twoFactorMethod: string;
  backupCodesRemaining: number;
  enforceIpWhitelist: boolean;
}

interface SecurityLog {
  id: string;
  timestamp: string;
  event: string;
  username: string;
  ip: string;
  status: 'SUCCESS' | 'FAIL' | string;
}

export const SecurityModule = () => {
  const [settings, setSettings] = React.useState<SecuritySetting>({
    twoFactorEnabled: false,
    twoFactorMethod: "authenticator_app",
    backupCodesRemaining: 8,
    enforceIpWhitelist: false
  });
  const [logs, setLogs] = React.useState<SecurityLog[]>([]);
  const [vulnScan, setVulnScan] = React.useState<any>(null);
  const [scanning, setScanning] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [updating, setUpdating] = React.useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = React.useState<string | null>(null);

  // Real 2FA State Variables
  const [showSetupModal, setShowSetupModal] = React.useState(false);
  const [setupSecret, setSetupSecret] = React.useState('');
  const [setupQrUrl, setSetupQrUrl] = React.useState('');
  const [verificationCode, setVerificationCode] = React.useState('');
  const [verificationError, setVerificationError] = React.useState<string | null>(null);

  // Inspect Active Secret state
  const [showInspectModal, setShowInspectModal] = React.useState(false);
  const [inspectData, setInspectData] = React.useState<any>(null);

  // Backup codes state
  const [showBackupModal, setShowBackupModal] = React.useState(false);
  const [backupCodes, setBackupCodes] = React.useState<string[]>([]);

  // Load status and logs from administrative endpoints
  const fetchSecurityState = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const [res, resVuln] = await Promise.all([
        fetch('/api/admin/security/status', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/admin/security/vulnerability-data', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (res.ok) {
        const data = await res.json();
        setSettings(data.settings);
        setLogs(data.logs);
      }
      if (resVuln.ok) {
        const data = await resVuln.json();
        setVulnScan(data);
      }
    } catch (err) {
      console.error("[Security] Connection failed", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchSecurityState();
  }, []);

  const handleRunVulnScan = async () => {
    setScanning(true);
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch('/api/admin/security/vulnerability-scan', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setVulnScan(data.scan);
        setLogs(data.logs);
        setFeedbackSuccess(`Vulnerability score evaluated to ${data.scan.threatScore}/100 with Overall Grade '${data.scan.overallGrade}'`);
        setTimeout(() => setFeedbackSuccess(null), 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setScanning(false);
    }
  };

  const handleGenerateSecret = async () => {
    const token = localStorage.getItem('adminToken');
    setUpdating(true);
    try {
      const res = await fetch('/api/admin/security/generate-2fa-secret', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSetupSecret(data.secret);
        setSetupQrUrl(data.qrCodeUrl);
        setVerificationCode('');
        setVerificationError(null);
        setShowSetupModal(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const handleVerifyAndEnable = async () => {
    setUpdating(true);
    setVerificationError(null);
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch('/api/admin/security/verify-and-enable-2fa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ code: verificationCode, secret: setupSecret })
      });

      if (res.ok) {
        const data = await res.json();
        setSettings(data.settings);
        setLogs(data.logs);
        setShowSetupModal(false);
        setVerificationCode('');
        setFeedbackSuccess("Multi-Factor authentication (MFA) has been successfully activated using standard TOTP credentials.");
        setTimeout(() => setFeedbackSuccess(null), 4000);
      } else {
        const errData = await res.json();
        setVerificationError(errData.error || "Failed to verify authenticator token.");
      }
    } catch (err) {
      setVerificationError("Network verification failed.");
    } finally {
      setUpdating(false);
    }
  };

  const handleDisable2FA = async () => {
    const token = localStorage.getItem('adminToken');
    setUpdating(true);
    try {
      const res = await fetch('/api/admin/security/disable-2fa', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSettings(data.settings);
        setLogs(data.logs);
        setFeedbackSuccess("Multi-Factor authentication has been deactivated.");
        setTimeout(() => setFeedbackSuccess(null), 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const handleToggle2FA = () => {
    if (settings.twoFactorEnabled) {
      if (confirm("Are you sure you want to deactivate secure multi-factor authentication? This reduces account defense rating.")) {
        handleDisable2FA();
      }
    } else {
      handleGenerateSecret();
    }
  };

  const handleInspectSecret = async () => {
    if (!settings.twoFactorEnabled) {
      alert("Multi-Factor authentication must be activated first to inspect computed state.");
      return;
    }
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch('/api/admin/security/inspect-secret', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setInspectData(data);
        setShowInspectModal(true);
      } else {
        const err = await res.json();
        alert(err.error || "Failed to retrieve active credentials.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerateBackupCodes = async () => {
    if (confirm("Regenerate disaster recovery backup codes? Any previously saved recovery codes will immediately expire.")) {
      const token = localStorage.getItem('adminToken');
      try {
        const res = await fetch('/api/admin/security/generate-backup-codes', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setSettings(data.settings);
          setLogs(data.logs);
          setBackupCodes(data.codes);
          setShowBackupModal(true);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12"
    >
      {/* KPI Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 border border-slate-100 rounded-3xl shadow-sm flex items-center gap-5">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
            settings.twoFactorEnabled ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
          }`}>
            <Shield size={20} className={settings.twoFactorEnabled ? 'animate-pulse' : ''} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-0.5">MFA Compliance Status</p>
            <p className="text-xl font-extrabold text-slate-900 tracking-tight">
              {settings.twoFactorEnabled ? 'Secured (2FA Active)' : 'Unconfigured (Risk)'}
            </p>
            <p className="text-[11px] text-slate-400 font-normal mt-0.5 uppercase">2-Step verification protocol enforcement</p>
          </div>
        </div>

        <div className="bg-white p-6 border border-slate-100 rounded-3xl shadow-sm flex items-center gap-5">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
            <Key size={18} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-0.5">Backup Bypass Keys</p>
            <p className="text-xl font-extrabold text-slate-900 tracking-tight">{settings.backupCodesRemaining} Codes Left</p>
            <p className="text-[11px] text-slate-400 font-normal mt-0.5 uppercase">8-character emergency recovery codes</p>
          </div>
        </div>

        <div className="bg-white p-6 border border-slate-100 rounded-3xl shadow-sm flex items-center gap-5">
          <div className="w-12 h-12 bg-slate-50 text-slate-650 text-slate-600 rounded-2xl flex items-center justify-center shrink-0">
            <Database size={18} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-0.5">Total Monitored Log Nodes</p>
            <p className="text-xl font-extrabold text-slate-900 tracking-tight">{logs.length} Log Entries</p>
            <p className="text-[11px] text-slate-400 font-normal mt-0.5 uppercase">Logged auth challenges and failures</p>
          </div>
        </div>
      </div>

      {feedbackSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-700 font-bold text-xs flex items-center gap-2 select-none animate-in fade-in">
          <CheckCircle size={14} /> {feedbackSuccess}
        </div>
      )}

      {/* Main Panel Controls layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Toggle Panel Section */}
        <div className="lg:col-span-1 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm h-fit space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">2FA Security Status</h3>
            <p className="text-xs text-slate-500 font-normal mt-1">Configure multi-factor credentials</p>
          </div>

          <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-xs font-semibold text-slate-800 uppercase tracking-wider">Toggle 2FA Switch</p>
              <p className="text-[10px] text-slate-500 font-medium uppercase leading-tight">Enforce secure logins</p>
            </div>
            
            <button
              onClick={handleToggle2FA}
              disabled={updating}
              className={`w-14 h-7 rounded-full transition-colors relative flex items-center px-1 shrink-0 ${
                settings.twoFactorEnabled ? 'bg-emerald-500' : 'bg-slate-300'
              }`}
            >
              <motion.span 
                layout
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="w-5 h-5 bg-white rounded-full shadow-md"
                style={{
                  marginLeft: settings.twoFactorEnabled ? '1.75rem' : '0'
                }}
              />
            </button>
          </div>

          <div className="space-y-4">
             <div className="flex gap-3 items-start">
               <div className="w-2 h-2 rounded-full bg-indigo-600 mt-1" />
               <p className="text-xs text-slate-600 font-medium leading-relaxed">
                 When 2FA is active, administrators must verify logins with a 16-character time-based authenticator (TOTP) seed generated on a cell device.
               </p>
             </div>
             <div className="flex gap-3 items-start">
               <div className="w-2 h-2 rounded-full bg-indigo-600 mt-1" />
               <p className="text-xs text-slate-600 font-medium leading-relaxed">
                 Enforcing 2FA prevents password spray, credential leaks, and brute-force intrusion spikes on agency server nodes.
               </p>
             </div>
          </div>

          <div className="pt-6 border-t border-slate-100 space-y-4">
             <span className="text-xs font-semibold tracking-wider uppercase text-slate-500 block pb-1">MFA Audit Tools</span>
             <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleInspectSecret}
                  className="px-3 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-100 hover:border-indigo-300 text-[11px] font-semibold uppercase rounded-lg transition-all text-center cursor-pointer flex items-center justify-center gap-1.5"
                >
                   <Clock size={12} /> Inspect Live Code
                </button>
                <button
                  onClick={handleGenerateBackupCodes}
                  className="px-3 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-100 hover:border-rose-200 text-[11px] font-semibold uppercase rounded-lg transition-all text-center cursor-pointer flex items-center justify-center gap-1.5"
                >
                   <Key size={12} /> Regenerate Keys
                </button>
             </div>
          </div>
        </div>

        {/* Real-time Authentication Event Log Timeline */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col min-h-[480px]">
          <div className="flex justify-between items-center border-b border-slate-100 pb-6 mb-6 select-none">
            <div>
              <h3 className="text-base font-bold text-slate-900">Authentication Sign-In Logs</h3>
              <p className="text-xs text-slate-500 font-normal mt-1">Security logs and administrative login history</p>
            </div>
            
            <button
              onClick={fetchSecurityState}
              className="p-3 border border-slate-100 hover:border-indigo-600 rounded-xl bg-slate-50 hover:bg-white text-slate-500 hover:text-indigo-650 transition-all cursor-pointer"
              title="Refresh logs"
            >
              <RefreshCcw size={13} />
            </button>
          </div>

          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-400 border-b border-slate-100 leading-none">
                  <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest">Time</th>
                  <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest">User Context</th>
                  <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest">Security Event</th>
                  <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest">IP Address</th>
                  <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-slate-500 font-medium">Loading log events...</td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-slate-500 font-medium">No login events found.</td>
                  </tr>
                ) : logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-[10px] text-slate-400">
                      {new Date(log.timestamp).toLocaleDateString()} {new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-slate-900">
                      {log.username}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-700">
                      {log.event}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-[10px] text-slate-400">
                      {log.ip}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className={`px-2 py-1 text-[8px] tracking-wider font-extrabold rounded font-mono ${
                        log.status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Vulnerability Audit & Compliance Assessment Section */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-slate-100">
           <div>
              <span className="text-xs font-semibold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full">Vulnerability Scanner</span>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight mt-1.5">Platform Safety & Header Auditing</h3>
              <p className="text-xs text-slate-500 font-normal mt-1">Live configuration analysis on SSL certificates, database journaling and server compliance rules</p>
           </div>
           
           <button
             onClick={handleRunVulnScan}
             disabled={scanning}
             className="px-5 py-3 bg-indigo-600 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl shadow-md cursor-pointer transition-all shrink-0 flex items-center gap-2"
           >
              <Cpu size={14} className={scanning ? 'animate-spin' : ''} />
              {scanning ? "Running Audit Scans..." : "Analyze Platform Security"}
           </button>
        </div>

        {vulnScan ? (
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Score Assessment Card */}
              <div className="lg:col-span-1 bg-slate-50 border border-slate-100 p-8 rounded-2xl flex flex-col justify-between space-y-6">
                 <div className="space-y-4">
                    <p className="text-[9px] font-black tracking-widest text-slate-450 uppercase">Secured Platform Rating</p>
                    <div className="flex items-baseline gap-2">
                       <span className="text-5xl font-extrabold tracking-tight text-slate-900">{vulnScan.overallGrade}</span>
                       <span className="text-xs font-bold text-indigo-650 uppercase">Safety Grade</span>
                    </div>

                    <div className="space-y-1">
                       <p className="text-xs font-black text-slate-800 uppercase">Compliance Index: {vulnScan.threatScore}%</p>
                       <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                          <div style={{ width: `${vulnScan.threatScore}%` }} className="bg-indigo-600 h-full rounded-full transition-all" />
                       </div>
                    </div>
                 </div>

                 <div className="space-y-3.5 pt-4 border-t border-slate-200/60">
                    <div className="flex items-center gap-3">
                       <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-[8px]">✓</div>
                       <div className="text-[11px]">
                          <p className="font-extrabold text-slate-800 uppercase tracking-tight">SSL TLS encryption</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase leading-none">{vulnScan.sslCertStatus}</p>
                       </div>
                    </div>

                    <div className="flex items-center gap-3">
                       <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-[8px]">✓</div>
                       <div className="text-[11px]">
                          <p className="font-extrabold text-slate-800 uppercase tracking-tight">Express Rate Enforcer</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase leading-none">{vulnScan.rateLimiterState}</p>
                       </div>
                    </div>

                    <div className="flex items-center gap-3">
                       <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-[8px]">✓</div>
                       <div className="text-[11px]">
                          <p className="font-extrabold text-slate-800 uppercase tracking-tight">Automated db backup</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase leading-none">{vulnScan.databaseBackup}</p>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Headers auditor bento */}
              <div className="lg:col-span-2 space-y-4">
                 <p className="text-[9px] font-black tracking-widest text-slate-400 uppercase">Audit of HTTP Response Security Headers</p>

                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white border border-slate-100 p-5 rounded-2xl flex justify-between items-center hover:border-slate-200 transition-colors">
                       <div>
                          <p className="font-extrabold text-slate-850 text-xs">Content Security Policy (CSP)</p>
                          <p className="text-[9px] text-slate-400 font-semibold font-mono truncate max-w-[200px] mt-0.5">{vulnScan.headers.contentSecurityPolicy.value}</p>
                       </div>
                       <span className="px-2.5 py-1 text-[9px] font-black bg-emerald-50 text-emerald-700 rounded-md font-mono">{vulnScan.headers.contentSecurityPolicy.grade}</span>
                    </div>

                    <div className="bg-white border border-slate-100 p-5 rounded-2xl flex justify-between items-center hover:border-slate-200 transition-colors">
                       <div>
                          <p className="font-extrabold text-slate-850 text-xs">Strict-Transport-Security (HSTS)</p>
                          <p className="text-[9px] text-slate-400 font-semibold font-mono truncate max-w-[200px] mt-0.5">{vulnScan.headers.hsts.value}</p>
                       </div>
                       <span className="px-2.5 py-1 text-[9px] font-black bg-emerald-50 text-emerald-700 rounded-md font-mono">{vulnScan.headers.hsts.grade}</span>
                    </div>

                    <div className="bg-white border border-slate-100 p-5 rounded-2xl flex justify-between items-center hover:border-slate-200 transition-colors">
                       <div>
                          <p className="font-extrabold text-slate-850 text-xs">X-Frame-Options (Clickjack Protection)</p>
                          <p className="text-[9px] text-slate-400 font-semibold font-mono truncate max-w-[200px] mt-0.5">{vulnScan.headers.xFrameOptions.value}</p>
                       </div>
                       <span className="px-2.5 py-1 text-[9px] font-black bg-emerald-50 text-emerald-700 rounded-md font-mono">{vulnScan.headers.xFrameOptions.grade}</span>
                    </div>

                    <div className="bg-white border border-slate-100 p-5 rounded-2xl flex justify-between items-center hover:border-slate-200 transition-colors">
                       <div>
                          <p className="font-extrabold text-slate-850 text-xs">Cross-Origin Policy (CORS)</p>
                          <p className="text-[9px] text-slate-400 font-semibold font-mono truncate max-w-[200px] mt-0.5">{vulnScan.headers.corsSettings.value}</p>
                       </div>
                       <span className={`px-2.5 py-1 text-[9px] font-black rounded-md font-mono ${
                         vulnScan.headers.corsSettings.grade === 'F' ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'
                       }`}>{vulnScan.headers.corsSettings.grade}</span>
                    </div>
                 </div>

                 {/* Explanations instructions */}
                 <div className="p-4 bg-indigo-50/50 border border-indigo-100/30 rounded-2xl flex gap-3 items-start select-none">
                    <ShieldCheck size={16} className="text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                       <p className="text-[9px] font-black text-indigo-900 uppercase tracking-widest block mb-0.5">Recommendations from Security Audit</p>
                       <p className="text-[11px] text-slate-600 leading-normal font-medium">
                          {vulnScan.overallGrade === 'A+' ? 
                            "Configuration satisfies peak military-grade specifications. Continue to enforce TOTP access on credentials." : 
                            "Vulnerabilities found: Set explicit CORS configuration in backend security filters to prevent unauthorized cross-origin requests."
                          }
                       </p>
                    </div>
                 </div>
              </div>

           </div>
        ) : (
           <div className="text-center p-12 text-slate-400 italic text-xs">
              No previous security vulnerability scanner logs found. Trigger a scan above to start compliance analysis.
           </div>
        )}
      </div>

      {/* MODAL 1: 2FA Setup Dialog */}
      {showSetupModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white border border-slate-100 rounded-[2.5rem] w-full max-w-md p-10 shadow-2xl relative"
          >
            <button 
              onClick={() => setShowSetupModal(false)}
              className="absolute right-6 top-6 p-2 text-slate-400 hover:text-slate-900 rounded-full transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 mb-6">
              <ShieldAlert className="text-indigo-600" size={20} />
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-indigo-600">Secure MFA Onboarding</span>
            </div>

            <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-2">Configure Authenticator</h3>
            <p className="text-xs text-slate-500 mb-6 font-medium">Scan the secure matrix code with Google Authenticator or type the seed token manually.</p>

            <div className="space-y-6">
              <div className="flex justify-center p-2 bg-slate-50 border border-slate-100 rounded-2xl">
                {setupQrUrl ? (
                  <img src={setupQrUrl} alt="MFA QR Code" className="w-[180px] h-[180px]" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-[180px] h-[180px] flex items-center justify-center text-slate-400">Generating QR...</div>
                )}
              </div>

              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                <span className="text-[9px] font-black tracking-widest text-slate-500 block uppercase mb-1">Backup Key (Manual Entry)</span>
                <code className="text-xs font-mono font-bold text-indigo-600 tracking-wider select-all block break-all">
                  {setupSecret || 'Generating...'}
                </code>
              </div>

              <div className="space-y-2">
                <span className="text-[9px] font-black tracking-widest text-slate-500 block uppercase">Verify Authenticator Response</span>
                <input
                  required
                  type="text"
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  className="w-full text-center tracking-[0.4em] text-xl font-mono font-black bg-slate-50 border border-slate-200 rounded-2xl py-4 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-indigo-600 transition-all font-bold"
                />
              </div>

              {verificationError && (
                <div className="p-3 bg-rose-50 border border-rose-100 text-rose-700 text-xs font-bold rounded-xl text-center">
                  {verificationError}
                </div>
              )}

              <button
                onClick={handleVerifyAndEnable}
                disabled={verificationCode.length !== 6 || updating}
                className="w-full py-4 bg-indigo-600 hover:bg-slate-900 text-white rounded-2xl text-xs font-bold uppercase tracking-widest cursor-pointer transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {updating ? 'Verifying Seed...' : 'Verify and Activate'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* MODAL 2: Inspect Live Clock Dynamic Token */}
      {showInspectModal && inspectData && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white border border-slate-100 rounded-[2.5rem] w-full max-w-sm p-10 shadow-2xl relative"
          >
            <button 
              onClick={() => setShowInspectModal(false)}
              className="absolute right-6 top-6 p-2 text-slate-450 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 mb-6">
              <Clock className="text-emerald-500" size={20} />
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-500">MFA Registry Audit</span>
            </div>

            <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-2">Live Token Audit</h3>
            <p className="text-xs text-slate-500 mb-6 font-medium leading-relaxed font-semibold">Verify system clock synchronization against the currently calculated standard rolling One-Time Password.</p>

            <div className="space-y-6">
              <div className="p-6 bg-emerald-50/50 border border-emerald-100 rounded-2xl text-center space-y-2">
                <span className="text-[10px] font-black tracking-widest text-emerald-700 uppercase block">Active Interval Passcode</span>
                <p className="text-4xl font-black tracking-[0.2em] font-mono text-slate-900 pl-[0.2em]">
                  {inspectData.currentCode}
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-[11px] space-y-1.5 font-semibold">
                <div className="flex justify-between">
                  <span className="text-slate-400">Database Secret Map:</span>
                  <span className="font-mono text-slate-700">{inspectData.secret}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Rotation Countdown:</span>
                  <span className="text-indigo-650">{inspectData.secondsRemaining}s remaining</span>
                </div>
              </div>

              <div className="w-full bg-slate-100 rounded-full h-1 overflow-hidden font-bold">
                <motion.div 
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: inspectData.secondsRemaining, ease: "linear" }}
                  className="bg-emerald-500 h-full rounded-full"
                />
              </div>

              <button
                onClick={() => setShowInspectModal(false)}
                className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold uppercase tracking-widest cursor-pointer transition-all"
              >
                Close Audit
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* MODAL 3: Emergency Backup Codes Dialog */}
      {showBackupModal && backupCodes.length > 0 && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white border border-slate-100 rounded-[2.5rem] w-full max-w-md p-10 shadow-2xl relative"
          >
            <button 
              onClick={() => setShowBackupModal(false)}
              className="absolute right-6 top-6 p-2 text-slate-450 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 mb-6">
              <Key className="text-amber-500" size={20} />
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-500">Bypass Security Codes</span>
            </div>

            <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-2">Backups Keys Created</h3>
            <p className="text-xs text-slate-500 mb-6 font-medium leading-relaxed">Store these keys down in a secure notes file. Each code can be utilized exactly once in case of phone loss recovery.</p>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-3">
                {backupCodes.map((code, idx) => (
                  <div key={idx} className="p-3 bg-amber-50/40 border border-amber-100 rounded-xl text-center font-mono font-bold text-amber-900 select-all tracking-wider text-xs">
                    {code}
                  </div>
                ))}
              </div>

              <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-xl flex gap-3 text-amber-850">
                <AlertTriangle size={18} className="shrink-0 mt-0.5 text-amber-600" />
                <p className="text-[11px] leading-relaxed font-semibold">
                  Do not share recovery codes. Downloading or printing these keys acts as the primary bypass pathway on credentials.
                </p>
              </div>

              <button
                onClick={() => setShowBackupModal(false)}
                className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold uppercase tracking-widest cursor-pointer transition-all"
              >
                Saved & Finished
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </motion.div>
  );
};
