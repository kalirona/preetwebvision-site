import express from 'express';
import { readData, writeData } from '../db.js';
import { authenticateAdmin } from './admin.js';
import { sendEmail } from './emailSender.js';

const router = express.Router();

router.get("/", authenticateAdmin, async (req, res) => {
  const leads = await readData('leads');
  res.json(leads);
});

router.post("/", async (req, res) => {
  try {
    const { name, email, phone, service_interest, message, website_url, source } = req.body;
    
    if (!email || !name) {
      return res.status(400).json({ error: "Name and Email are required" });
    }

    const leads = await readData<any>('leads');
    const leadEntry = {
      id: `LD-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      name,
      email,
      phone,
      service_interest,
      message,
      website_url,
      source: source || req.headers['referer'] || 'direct',
      timestamp: new Date().toISOString(),
      status: 'NEW'
    };

    leads.unshift(leadEntry);
    if (leads.length > 1000) leads.pop();
    await writeData('leads', leads);

    // 1. Instantly write lead to local emails database so it appears in the Dashboard Inbox CRM immediately
    try {
      const emailList = await readData<any>('emails');
      const serviceLabel = String(service_interest || 'General Custom Lead').toUpperCase().replace('-', ' ');
      const mailboxSubject = `[Inbound Lead] ${serviceLabel} requested by ${name}`;
      const mailboxBody = `Service Interest: ${serviceLabel}\nSite URL: ${website_url || 'None Supplied'}\nPhone target: ${phone || 'Not Specified'}\nReferrer: ${source || 'Direct Link'}\n\nRemarks:\n${message || 'No additional text'}`;
      const mailboxHtml = `
        <div style="font-family: sans-serif; max-width: 600px; color: #1e293b;">
          <h3 style="color: #0f766e; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px;">New Service Lead Acquired</h3>
          <p><strong>Lead Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Phone:</strong> ${phone || 'Not Specified'}</p>
          <p><strong>Requested Service Branch:</strong> <span style="background-color: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-weight: bold;">${serviceLabel}</span></p>
          ${website_url ? `<p><strong>Target Audit Website:</strong> <a href="${website_url}" target="_blank" style="color: #0f766e; font-weight: bold;">${website_url}</a></p>` : ''}
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; margin-top: 15px;">
            <p style="margin-top: 0; font-weight: bold; color: #475569;">Requirements & Project Scope:</p>
            <p style="white-space: pre-wrap; line-height: 1.6; margin-bottom: 0;">${message || 'No remarks provided.'}</p>
          </div>
        </div>
      `;

      emailList.unshift({
        id: `EM-LEAD-${Date.now()}`,
        sender_name: name,
        sender_email: email,
        subject: mailboxSubject,
        body: mailboxBody,
        html: mailboxHtml,
        timestamp: new Date().toISOString(),
        is_read: false,
        folder: "inbox"
      });

      if (emailList.length > 500) emailList.pop();
      await writeData('emails', emailList);
    } catch (err) {
      console.error("[Leads] Failed to auto-write lead to administrative email records", err);
    }

    // 2. Load configured SMTP details and notify admin with email copy
    let adminNotified = false;
    let clientNotified = false;
    try {
      const settingsList = await readData<any>('settings');
      const settings = settingsList && settingsList.length > 0 ? settingsList[0] : {};
      const adminEmailAddress = settings.contact_email || "preetwebvision@gmail.com";

      const adminSubj = `[Preet Web Lead] Service Audit Request: ${name} (${service_interest || 'General'})`;
      const adminBody = `Hello Admin,\n\nYou have received a new service/tech lead audit inquiry.\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\nService: ${service_interest}\nWebsite URL: ${website_url || 'N/A'}\nMessage:\n${message || 'N/A'}`;
      
      const adminHtml = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
          <h2 style="color: #0f766e; margin-top: 0;">🎯 New Custom Lead Acquired</h2>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-bottom: 20px;" />
          <p>A client has requested a service consultation or audit proposal on your services portal. Summary below:</p>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; width: 140px; border-bottom: 1px solid #f3f4f6;">Client Name:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f3f4f6;">Email:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f3f4f6;">Contact Phone:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">${phone || 'Not Specified'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f3f4f6;">Service Interest:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; color: #0f766e; font-weight: bold;">${String(service_interest).toUpperCase()}</td>
            </tr>
            ${website_url ? `
            <tr>
              <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f3f4f6;">Target URL:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;"><a href="${website_url}" target="_blank">${website_url}</a></td>
            </tr>` : ''}
          </table>
          ${message ? `
          <div style="margin-top: 20px; padding: 15px; background-color: #f9fafb; border-radius: 8px; border: 1px solid #eaeaea;">
            <p style="margin-top: 0; font-weight: bold; color: #475569;">Requirements Details:</p>
            <p style="margin-bottom: 0; white-space: pre-wrap;">${message}</p>
          </div>` : ''}
          <p style="font-size: 11px; color: #9ca3af; margin-top: 30px;">Sent securely from your website's integrated SMTP mail server.</p>
        </div>
      `;

      const sendResult = await sendEmail({
        to: adminEmailAddress,
        subject: adminSubj,
        text: adminBody,
        html: adminHtml
      });
      adminNotified = sendResult.success;

      // 3. Dispatch auto-reply support letter to customer
      const clientSubj = `Your Audit Request at ${settings.website_name || 'Preet Web Vision'} is Registered`;
      const clientBody = `Hi ${name},\n\nWe have successfully received your proposal request for professional ${service_interest || 'custom services'}.\n\nOur service manager is preparing a scoping questionnaire for your review. We look forward to speaking soon!\n\nBest regards,\nAudit Services Team`;
      
      const clientHtml = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; padding: 25px; border-radius: 12px; border: 1px solid #eaeaea;">
          <h3 style="color: #0f766e; margin-top: 0;">🚀 Project Service Proposal Initiated</h3>
          <p>Hello <strong>${name}</strong>,</p>
          <p>Your request for a professional website audit / service alignment on <strong>"${String(service_interest || 'custom project').toUpperCase()}"</strong> has been safely recorded by our administration team.</p>
          
          <p>We are analyzing your preferences and preparing a preliminary diagnostic outline tailored to your goals.</p>

          <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <p style="margin: 0 0 8px 0; font-weight: bold; color: #166534; font-size: 14px;">Next Steps under our Action Plan:</p>
            <ul style="margin: 0; padding-left: 18px; font-size: 13px; color: #14532d;">
              <li>Preliminary diagnostic scoping of details and website metrics</li>
              <li>Creation of a custom strategy outline and quote timeline</li>
              <li>Settle a project launch date during a quick video call</li>
            </ul>
          </div>

          <p>If you have any instant questions, reply directly to this message to speak with a dedicated service expert.</p>
          <br/>
          <hr style="border: 0; border-top: 1px solid #f3f4f6;" />
          <p style="font-size: 12px; color: #6b7280; font-weight: bold; margin-bottom: 2px;">${settings.website_name || 'Preet Web Vision'}</p>
          <p style="font-size: 11px; color: #9ca3af; margin-top: 0;">Digital Presence Architecture & Design Services</p>
        </div>
      `;

      const clientSendRes = await sendEmail({
        to: email,
        subject: clientSubj,
        text: clientBody,
        html: clientHtml
      });
      clientNotified = clientSendRes.success;

    } catch (smtpErr) {
      console.error("[Leads] Failed to dispatch CRM alert copy:", smtpErr);
    }

    res.status(201).json({ 
      success: true, 
      message: "Lead processed and queued in pipeline successfully" + (adminNotified ? " (Alert copy sent)" : "") + (clientNotified ? " (Client copy sent)" : ""),
      lead_id: leadEntry.id,
      admin_notified: adminNotified,
      client_notified: clientNotified
    });
  } catch (error) {
    res.status(500).json({ error: "Lead processing failed" });
  }
});

// POST /api/lead/bulk -> Bulk insert imported leads
router.post("/bulk", authenticateAdmin, async (req, res) => {
  try {
    const list = req.body;
    if (!Array.isArray(list)) {
      return res.status(400).json({ error: "Invalid payload: expected an array of leads" });
    }

    const leads = await readData<any>('leads');
    const importedLeads: any[] = [];
    const nowStr = new Date().toISOString();

    for (const lead of list) {
      if (!lead.name || !lead.email) {
        continue; // skip rows with missing critical tags
      }

      const emailDomain = lead.email.split('@')[1] || '';
      const domainScore = ['gmail.com', 'yahoo.com', 'hotmail.com'].includes(emailDomain.toLowerCase()) ? 30 : 65;
      const messageLengthScore = Math.min((lead.message || '').length / 5, 35);
      const computedScore = Math.round(domainScore + messageLengthScore);

      const leadEntry = {
        id: `LD-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        name: lead.name,
        email: lead.email,
        phone: lead.phone || '',
        service_interest: lead.service_interest || 'General Consultation',
        message: lead.message || 'Bulk Imported prospective lead.',
        website_url: lead.website_url || '',
        source: lead.source || 'bulk_import',
        timestamp: lead.timestamp || nowStr,
        status: lead.status || 'NEW',
        score: lead.score || computedScore,
        tags: lead.tags || ['Bulk Imported'],
        notes: lead.notes || [
          { text: "Lead registered via bulk client list import system.", date: nowStr, author: "System CRM" }
        ],
      };

      leads.unshift(leadEntry);
      importedLeads.push(leadEntry);
    }

    if (leads.length > 1500) {
      leads.splice(1500); // hard cap data bounds
    }

    await writeData('leads', leads);

    res.status(201).json({
      success: true,
      message: `Successfully imported ${importedLeads.length} leads into the database pipeline`,
      imported: importedLeads
    });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Bulk lead processing skipped due to internal failure" });
  }
});

router.patch("/:id/status", authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const leads = await readData<any>('leads');
  const index = leads.findIndex(l => l.id === id);
  if (index !== -1) {
    leads[index].status = status;
    await writeData('leads', leads);
    return res.json(leads[index]);
  }
  res.status(404).json({ error: "Lead not found" });
});

export default router;
