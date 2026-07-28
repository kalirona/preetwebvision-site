import nodemailer from 'nodemailer';
import { readData } from '../db.js';

interface SendEmailParams {
  to: string;
  subject: string;
  text: string;
  html?: string;
  fromName?: string;
  fromEmail?: string;
}

const DEFAULT_SETTINGS = {
  website_name: "Preet Web Vision",
  contact_email: "preetwebvision@gmail.com",
  smtp_host: "smtp.mailgun.org",
  smtp_port: "587",
  smtp_user: "postmaster@preetwebvision.com"
};

export async function sendEmail({
  to,
  subject,
  text,
  html,
  fromName,
  fromEmail
}: SendEmailParams): Promise<{ success: boolean; messageId?: string; error?: string }> {
  let host = "";
  let user = "";
  try {
    // 1. Load current settings from DB
    const list = await readData<any>('settings');
    const settings = list && list.length > 0 ? list[0] : DEFAULT_SETTINGS;

    host = settings.smtp_host || process.env.SMTP_HOST || DEFAULT_SETTINGS.smtp_host;
    const port = parseInt(settings.smtp_port || process.env.SMTP_PORT || DEFAULT_SETTINGS.smtp_port);
    user = settings.smtp_user || process.env.SMTP_USER || DEFAULT_SETTINGS.smtp_user;
    
    // We can support smtp_pass from db setting, or fallback variables
    const pass = settings.smtp_pass || process.env.SMTP_PASSWORD || process.env.SMTP_PASS || '';

    const finalFromName = fromName || settings.website_name || DEFAULT_SETTINGS.website_name;
    const finalFromEmail = fromEmail || settings.contact_email || DEFAULT_SETTINGS.contact_email;

    console.log(`[EmailSender] Instantiating connection to SMTP: ${host}:${port} as ${user} (with pass length: ${pass ? pass.length : 0})`);

    // 2. Configure NodeMailer Transport
    const isGmail = host.toLowerCase().includes('gmail.com') || host.toLowerCase().includes('googlemail.com');
    let mailConfig: any = {};

    if (isGmail) {
      mailConfig = {
        service: 'gmail',
        auth: {
          user,
          pass
        }
      };
    } else {
      mailConfig = {
        host,
        port,
        secure: port === 465,
        auth: {
          user,
          pass
        }
      };
    }

    // Apply robust connection timeouts and SSL settings
    const transporter = nodemailer.createTransport({
      ...mailConfig,
      connectionTimeout: 15000, // 15s timeout
      greetingTimeout: 15000,
      socketTimeout: 20000,
      tls: {
        rejectUnauthorized: false, // Bypass self-signed cert issues for higher success rate
        ciphers: 'SSLv3'
      }
    });

    // Determine clean sender address: Google SMTP requires envelope sender matching authenticated user
    const senderAddress = user && user.includes('@') ? user : finalFromEmail;

    // 3. Send email message
    const info = await transporter.sendMail({
      from: `"${finalFromName}" <${senderAddress}>`,
      to,
      subject,
      text,
      html: html || text.replace(/\n/g, '<br/>')
    });

    console.log(`[EmailSender] Success! Email message dispatched. MessageId: ${info.messageId}`);
    return { success: true, messageId: info.messageId };

  } catch (error: any) {
    let errMsg = error?.message || String(error);
    const hostRaw = String(host || error?.host || '');
    const userRaw = String(user || '');
    const isGmail = hostRaw.toLowerCase().includes('gmail') || hostRaw.toLowerCase().includes('google') || userRaw.toLowerCase().includes('@gmail.com');
    const isAuthFailed = error?.code === 'EAUTH' ||
                         errMsg.includes('535') ||
                         errMsg.toLowerCase().includes('username and password') ||
                         errMsg.toLowerCase().includes('login') ||
                         errMsg.toLowerCase().includes('credential') ||
                         errMsg.toLowerCase().includes('auth') ||
                         error?.authenticationFailed === true;

    if (isGmail && isAuthFailed) {
      errMsg = "Gmail SMTP Authentication Failed. Google requires you to enable '2-Step Verification' in your Google Account Security settings and generate a 16-character 'App Password' from myaccount.google.com/apppasswords. Direct passwords are disabled. Use the generated App Password (without spaces) in both your SMTP and IMAP password fields in system settings.";
      console.warn(`[EmailSender] Gmail SMTP Auth failure caught: ${errMsg}`);
    } else if (isAuthFailed) {
      errMsg = `SMTP Connection / Authentication Failed: ${errMsg}. Please verify your SMTP Host, Username, Port, and Password in system settings, and ensure SMTP/third-party app access is permitted.`;
      console.warn(`[EmailSender] SMTP Auth failure caught: ${errMsg}`);
    } else {
      errMsg = `SMTP Connection Error: ${errMsg}`;
      console.error('[EmailSender] Error sending SMTP email:', error);
    }
    
    return {
      success: false,
      error: errMsg
    };
  }
}
