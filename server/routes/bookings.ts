import express from 'express';
import { readData, writeData } from '../db.js';
import { authenticateAdmin } from './admin.js';
import { sendEmail } from './emailSender.js';

const router = express.Router();

const MOCK_BOOKINGS = [
  {
    id: "BK-101",
    name: "John Harrison",
    email: "john@techcorp.com",
    phone: "+1 (555) 014-9922",
    date: "2026-06-01",
    time: "10:00 AM",
    service_type: "wordpress-design",
    status: "CONFIRMED",
    message: "Need a high-performance WordPress site for B2S SaaS company.",
    timestamp: new Date().toISOString()
  },
  {
    id: "BK-102",
    name: "Alice Montgomery",
    email: "alice@boutique-ecom.co",
    phone: "+1 (555) 123-4567",
    date: "2026-06-05",
    time: "2:30 PM",
    service_type: "shopify-development",
    status: "PENDING",
    message: "Looking for Shopify store optimization to boost AOV and speed.",
    timestamp: new Date().toISOString()
  }
];

// GET /api/bookings
router.get("/", authenticateAdmin, async (req, res) => {
  let list = await readData<any>('bookings');
  if (list.length === 0) {
    list = MOCK_BOOKINGS;
    await writeData('bookings', list);
  }
  res.json(list);
});

// POST /api/bookings (Public)
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, date, time, service_type, message, google_link } = req.body;
    if (!name || !email || !date || !time) {
      return res.status(400).json({ error: "Missing required booking details" });
    }

    const list = await readData<any>('bookings');
    const newBooking = {
      id: `BK-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
      name,
      email,
      phone: phone || "",
      date,
      time,
      service_type: service_type || "discovery-call",
      status: "PENDING",
      message: message || "",
      google_link: google_link || "",
      timestamp: new Date().toISOString()
    };

    list.unshift(newBooking);
    await writeData('bookings', list);

    // 1. Write booking to administrative emails folder mailbox database so the admin gets an instant notification card
    try {
      const emailList = await readData<any>('emails');
      const serviceLabel = String(service_type).toUpperCase().replace('-', ' ');
      const mailboxSubject = `[Calendar Appointment] ${serviceLabel} requested on ${date}`;
      const mailboxBody = `Scheduled Session: ${date} at ${time}\nPhone target: ${phone || 'Not Specified'}\nMeeting Video Link: ${google_link || 'Not Generated'}\n\nRemarks:\n${message}`;
      const mailboxHtml = `
        <div style="font-family: sans-serif; max-width: 600px; color: #1e293b;">
          <h3 style="color: #4f46e5; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px;">New Calendar Appointment Logged</h3>
          <p><strong>Visitor Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Phone:</strong> ${phone || 'Not Specified'}</p>
          <p><strong>Requested Service Type:</strong> <span style="background-color: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-weight: bold;">${serviceLabel}</span></p>
          <p><strong>Date & Time Slot:</strong> <span style="font-weight: bold; color: #6366f1;">${date} at ${time}</span></p>
          ${google_link ? `<p><strong>Meeting Integration Link:</strong> <a href="${google_link}" target="_blank" style="color: #6366f1; font-weight: bold;">Join Video Room</a></p>` : ''}
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; margin-top: 15px;">
            <p style="margin-top: 0; font-weight: bold; color: #475569;">Meeting Goals / Message:</p>
            <p style="white-space: pre-wrap; line-height: 1.6; margin-bottom: 0;">${message || 'No additional notes provided.'}</p>
          </div>
        </div>
      `;

      emailList.unshift({
        id: `EM-BOOK-${Date.now()}`,
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
      console.error("[Bookings] Failed to auto-log appointment inside administrative inbox data", err);
    }

    // 2. Fetch system settings to dispatch real calendar invitation alert copy to developer/admin inbox
    let adminNotified = false;
    let clientNotified = false;
    try {
      const settingsList = await readData<any>('settings');
      const settings = settingsList && settingsList.length > 0 ? settingsList[0] : {};
      const adminEmail = settings.contact_email || "preetwebvision@gmail.com";

      const adminSubj = `[Preet Web Booking] Session Request from ${name} on ${date} (${time})`;
      const adminBody = `Hello Admin,\n\nYou have received a new consultation appointment booking request on your portal.\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\nSession: ${date} at ${time}\nService Type: ${service_type}\nJoin Link: ${google_link || 'N/A'}\nMessage:\n${message}\n\nPlease review and confirm this calendar invite in your admin panel.`;
      
      const adminHtml = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
          <h2 style="color: #4f46e5; margin-top: 0; display: flex; align-items: center; gap: 8px;">🗓️ Project Appointment Requested</h2>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-bottom: 20px;" />
          <p>A user has booked a technical consultation slot on your services portal. Summary details below:</p>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; width: 140px; border-bottom: 1px solid #f3f4f6;">Visitor Name:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f3f4f6;">Email Address:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f3f4f6;">Requested Date:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; color: #4f46e5; font-weight: bold;">${date}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f3f4f6;">Timeslot Requested:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; color: #4f46e5; font-weight: bold;">${time}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f3f4f6;">Service Topic:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">${String(service_type).toUpperCase().replace('-', ' ')}</td>
            </tr>
            ${phone ? `
            <tr>
              <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f3f4f6;">Contact Phone:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">${phone}</td>
            </tr>` : ''}
            ${google_link ? `
            <tr>
              <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f3f4f6;">Meeting Link:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;"><a href="${google_link}" target="_blank" style="color: #6366f1; font-weight: bold;">Launch Google Meet</a></td>
            </tr>` : ''}
          </table>
          ${message ? `
          <div style="margin-top: 20px; padding: 15px; background-color: #f9fafb; border-radius: 8px; border: 1px solid #eaeaea;">
            <p style="margin-top: 0; font-weight: bold; color: #4b5563;">User remarks / message:</p>
            <p style="margin-bottom: 0; white-space: pre-wrap;">${message}</p>
          </div>` : ''}
          <p style="font-size: 11px; color: #9ca3af; margin-top: 30px;">Sent securely from your website's integrated SMTP mail server.</p>
        </div>
      `;

      // Dispatch booking notice email to admin
      const sendResult = await sendEmail({
        to: adminEmail,
        subject: adminSubj,
        text: adminBody,
        html: adminHtml
      });
      adminNotified = sendResult.success;

      // 3. Dispatch invitation confirmation email to customer
      const customerSubj = `Confirmed: Consultation Booking Request with ${settings.website_name || 'Preet Web Vision'}`;
      const customerBody = `Hi ${name},\n\nWe have successfully received your request for a project consultation appointment slot.\n\nSummary:\nService Topic: ${service_type}\nDate: ${date}\nTime: ${time}\n\nOur administrator is reviewing your slot for conflicts. We look forward to speaking with you!\n\nBest regards,\nCalendar Services Team`;
      
      const customerHtml = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; padding: 25px; border-radius: 12px; border: 1px solid #eaeaea;">
          <h3 style="color: #10b981; margin-top: 0;">🗓️ Booking Confirmation Registered</h3>
          <p>Hello <strong>${name}</strong>,</p>
          <p>Your technical session booking request with <strong>${settings.website_name || 'Preet Web Vision'}</strong> has been successfully received and added to our system calendar schedule.</p>
          
          <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <p style="margin: 0 0 8px 0; font-weight: bold; color: #166534; font-size: 15px;">Appointment Details Scheduled</p>
            <p style="margin: 0; font-size: 13px; color: #1e3a1e;"><strong>Topic:</strong> ${String(service_type).toUpperCase().replace('-', ' ')}</p>
            <p style="margin: 4px 0; font-size: 13px; color: #1e3a1e;"><strong>Date:</strong> ${date}</p>
            <p style="margin: 4px 0; font-size: 13px; color: #1e3a1e;"><strong>Timeslot:</strong> ${time}</p>
          </div>

          ${google_link ? `
          <p>Our scheduling system has pre-generated a dedicated virtual conferencing room for you:</p>
          <p style="margin: 18px 0;">
            <a href="${google_link}" target="_blank" style="background-color: #4f46e5; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 13px; display: inline-block;">Join Video Meeting Room</a>
          </p>
          <p style="font-size: 12px; color: #6b7280; font-style: italic;">Alternatively, copy and paste this meeting URL: <a href="${google_link}">${google_link}</a></p>
          ` : ''}

          <p>Our team is reviewing the slot, and we will send a notification if we need to reschedule. Otherwise, please bookmark the slot on your calendar.</p>
          <br/>
          <hr style="border: 0; border-top: 1px solid #f3f4f6;" />
          <p style="font-size: 12px; color: #6b7280; font-weight: bold; margin-bottom: 2px;">${settings.website_name || 'Preet Web Vision'}</p>
          <p style="font-size: 11px; color: #9ca3af; margin-top: 0;">Digital Presence Architecture & Design Services</p>
        </div>
      `;

      const custSendResult = await sendEmail({
        to: email,
        subject: customerSubj,
        text: customerBody,
        html: customerHtml
      });
      clientNotified = custSendResult.success;

    } catch (smtpErr) {
      console.error("[Bookings] Failed to dispatch calendar alert email:", smtpErr);
    }

    res.status(201).json({ 
      success: true, 
      booking: newBooking, 
      message: "Booking requested and SMTP pipeline triggered" + (adminNotified ? " (Developer alert sent)" : "") + (clientNotified ? " (Customer confirmation dispatched)" : ""),
      admin_notified: adminNotified,
      client_notified: clientNotified
    });
  } catch (error) {
    res.status(500).json({ error: "Booking submission failed" });
  }
});

// PATCH /api/bookings/:id/status
router.patch("/:id/status", authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  if (!status) {
    return res.status(400).json({ error: "Booking status is required" });
  }

  const list = await readData<any>('bookings');
  const index = list.findIndex((b: any) => b.id === id);
  if (index !== -1) {
    list[index].status = status;
    await writeData('bookings', list);
    return res.json(list[index]);
  }

  res.status(404).json({ error: "Booking not found" });
});

// PUT /api/bookings/:id
router.put("/:id", authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  
  const list = await readData<any>('bookings');
  const index = list.findIndex((b: any) => b.id === id);
  if (index !== -1) {
    list[index] = { ...list[index], ...updatedData };
    await writeData('bookings', list);
    return res.json(list[index]);
  }

  res.status(404).json({ error: "Booking not found" });
});

export default router;
