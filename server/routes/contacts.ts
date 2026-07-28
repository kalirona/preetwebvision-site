import express from 'express';
import { readData, writeData } from '../db.js';
import { authenticateAdmin } from './admin.js';
import { sendEmail } from './emailSender.js';

const router = express.Router();

router.get("/", authenticateAdmin, async (req, res) => {
  try {
    const contacts = await readData('contacts');
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: "Failed to load contact submissions" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, email, phone, subject, message, budget, company } = req.body;
    
    if (!email || !name) {
      return res.status(400).json({ error: "Name and Email are required properties" });
    }

    const contacts = await readData<any>('contacts');
    const contactEntry = {
      id: `SUB-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      name,
      email,
      phone,
      subject: subject || "General Contact Inquiry",
      message,
      budget: budget || "Not specified",
      company: company || "Not specified",
      timestamp: new Date().toISOString(),
      status: 'NEW'
    };

    contacts.unshift(contactEntry);
    if (contacts.length > 1000) contacts.pop();
    await writeData('contacts', contacts);

    // 1. Instantly log contact form to local emails folder database so it appears in the Inbox system immediately!
    try {
      const emailList = await readData<any>('emails');
      const mailboxSubject = `[Web Inquiry] ${subject || "General Contact Inquiry"}`;
      const mailboxBody = `Sender Company: ${company || 'Not Specified'}\nTarget Budget: ${budget || 'Not Specified'}\nPhone Number: ${phone || 'Not Specified'}\n\nClient Correspondence:\n${message}`;
      const mailboxHtml = `
        <div style="font-family: sans-serif; max-width: 600px; color: #1e293b;">
          <h3 style="color: #6366f1; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px;">Incoming Contact Form Lead</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email Address:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Contact Phone:</strong> ${phone || 'Not Specified'}</p>
          <p><strong>Company Name:</strong> ${company || 'Not Specified'}</p>
          <p><strong>Estimated Budget:</strong> <span style="font-weight: bold; color: #0f172a; background-color: #f1f5f9; padding: 2px 6px; border-radius: 4px;">${budget || 'Not Specified'}</span></p>
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; margin-top: 15px;">
            <p style="margin-top: 0; font-weight: bold; color: #475569;">Client Message:</p>
            <p style="white-space: pre-wrap; line-height: 1.6; margin-bottom: 0;">${message}</p>
          </div>
        </div>
      `;

      emailList.unshift({
        id: `EM-CONT-${Date.now()}`,
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
      console.error("[Contacts] Failed to auto-log submission inside system emails database:", err);
    }

    // 2. Load configured SMTP information and send real email notification to the administrator
    let adminEmailSentStatus = false;
    let autoreplySentStatus = false;
    try {
      const settingsList = await readData<any>('settings');
      const settings = settingsList && settingsList.length > 0 ? settingsList[0] : {};
      const targetAdminEmail = settings.contact_email || "preetwebvision@gmail.com";

      const adminEmailSubject = `[Preet Web] New Form Submission from ${name}: "${subject || 'General Inquiry'}"`;
      const adminEmailBody = `Hello Admin,\n\nYou have received a new contact inquiry form submission on your website.\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\nSubject: ${subject || 'General inquiry'}\nCompany: ${company || 'N/A'}\nBudget: ${budget || 'N/A'}\nMessage:\n${message}\n\nYou can reply directly to the email or check your admin dashboard inbox.`;
      const adminEmailHtml = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h2 style="color: #4f46e5; margin-top: 0;">New Portal Lead Captured</h2>
          <hr style="border: 0; border-top: 1px solid #e5e7eb;" />
          <p>We recorded a contact submission. Here are the core details:</p>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 6px 0; font-weight: bold; width: 120px;">Name:</td>
              <td style="padding: 6px 0;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold;">Email:</td>
              <td style="padding: 6px 0;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold;">Phone:</td>
              <td style="padding: 6px 0;">${phone || 'Not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold;">Company:</td>
              <td style="padding: 6px 0;">${company || 'Not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold;">Budget Goal:</td>
              <td style="padding: 6px 0; color: #0284c7; font-weight: bold;">${budget || 'Not specified'}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold;">Subject:</td>
              <td style="padding: 6px 0;">${subject || 'General Inquiry'}</td>
            </tr>
          </table>
          <div style="margin-top: 20px; padding: 15px; background: #f9fafb; border-radius: 8px; border: 1px solid #f3f4f6;">
            <p style="margin-top: 0; font-weight: bold; color: #374151;">Client Inquiry Message:</p>
            <p style="margin-bottom: 0; white-space: pre-wrap;">${message}</p>
          </div>
          <p style="font-size: 11px; color: #9ca3af; margin-top: 30px;">Sent securely from your website's integrated SMTP mail server.</p>
        </div>
      `;

      // Dispatch real alert copy to administrator
      const sendResult = await sendEmail({
        to: targetAdminEmail,
        subject: adminEmailSubject,
        text: adminEmailBody,
        html: adminEmailHtml
      });
      adminEmailSentStatus = sendResult.success;

      // 3. Dispatch auto-reply support notification email copy to visitor
      const autoreplySubject = `We have received your message - ${settings.website_name || 'Preet Web Vision'}`;
      const autoreplyBody = `Hi ${name},\n\nThank you for reaching out to us. We have received your inquiry about "${subject || 'General Inquiry'}" and our specialized consultants are reviewing your details now.\n\nWe will get back to you within 24 business hours.\n\nBest regards,\nSupport Services Team\n${settings.website_name || 'Preet Web Vision'}`;
      const autoreplyHtml = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; padding: 25px; border-radius: 12px; border: 1px solid #eaeaea;">
          <h3 style="color: #4f46e5; margin-top: 0;">Inquiry Logged Successfully</h3>
          <p>Hello <strong>${name}</strong>,</p>
          <p>Thank you for reaching out to us. We have received your message regarding "<strong>${subject || 'General Inquiry'}</strong>" and our specialized development and design teams have been notified of your project.</p>
          <p>One of our account managers will contact you within the next 24 hours to discuss details or arrange a quick scoping session.</p>
          
          <div style="margin: 25px 0; padding: 15px; border-left: 4px solid #6366f1; background-color: #f9fbfd;">
            <p style="margin: 0; font-size: 13px; color: #475569; font-style: italic;">"Supporting digital visions with expert design, WordPress development, and bespoke software solutions."</p>
          </div>

          <p>If you have any urgent requests, feel free to reply directly to this message or schedule a live video call via our booking calendar.</p>
          <hr style="border: 0; border-top: 1px solid #f3f4f6; margin-top: 30px;" />
          <p style="font-size: 12px; color: #6b7280; font-weight: bold; margin-bottom: 4px;">${settings.website_name || 'Preet Web Vision'}</p>
          <p style="font-size: 11px; color: #9ca3af; margin-top: 0;">Digital Presence Architecture & Design Services</p>
        </div>
      `;

      const autoreplyResult = await sendEmail({
        to: email,
        subject: autoreplySubject,
        text: autoreplyBody,
        html: autoreplyHtml
      });
      autoreplySentStatus = autoreplyResult.success;

    } catch (smtpErr) {
      console.error("[Contacts] Failed during SMTP email dispatch phase:", smtpErr);
    }

    res.status(201).json({ 
      success: true, 
      message: "Form submission verified and logged successfully" + (adminEmailSentStatus ? " (SMTP forward sent)" : " (Local queue saved)") + (autoreplySentStatus ? " (Auto-reply dispatched)" : ""),
      submission_id: contactEntry.id,
      admin_notified: adminEmailSentStatus,
      client_notified: autoreplySentStatus
    });
  } catch (error) {
    res.status(500).json({ error: "Form submission saving failed" });
  }
});

router.patch("/:id/status", authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const contacts = await readData<any>('contacts');
    const index = contacts.findIndex(c => c.id === id);
    if (index !== -1) {
      contacts[index].status = status;
      await writeData('contacts', contacts);
      return res.json(contacts[index]);
    }
    res.status(404).json({ error: "Submission log not found" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update submission state" });
  }
});

router.delete("/:id", authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const contacts = await readData<any>('contacts');
    const filtered = contacts.filter(c => c.id !== id);
    await writeData('contacts', filtered);
    res.json({ success: true, message: "Submission evicted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to evict submission" });
  }
});

export default router;
