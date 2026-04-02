import nodemailer from "nodemailer";
import { addSubscriber, isValidSubscriberEmail } from "./_subscriberStore";

type SubscribePayload = {
  email?: string;
  source?: string;
};

function normalizeBody(body: unknown): SubscribePayload {
  try {
    if (typeof body === "string") return JSON.parse(body) as SubscribePayload;
    if (body && typeof body === "object") return body as SubscribePayload;
  } catch {
    return {};
  }
  return {};
}

async function notifyCompany(email: string, source: string, createdAt: string) {
  const user = process.env.EMAIL_USER || process.env.SMTP_USER;
  const pass = process.env.EMAIL_PASS || process.env.SMTP_PASS;
  const to = process.env.EMAIL_TO || "vishnuartprivatelimited@gmail.com";

  if (!user || !pass) return;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  await transporter.sendMail({
    from: user,
    to,
    subject: "New Newsletter Subscriber - VISHNU ART PVT. LTD.",
    html: `
      <div style="font-family:Arial,sans-serif;color:#1f1f1f;">
        <h2>New Newsletter Subscriber - VISHNU ART PVT. LTD.</h2>
        <table style="border-collapse:collapse;width:100%;max-width:680px;">
          <tr>
            <td style="padding:8px;border:1px solid #ddd;"><strong>Email</strong></td>
            <td style="padding:8px;border:1px solid #ddd;">${email}</td>
          </tr>
          <tr>
            <td style="padding:8px;border:1px solid #ddd;"><strong>Source</strong></td>
            <td style="padding:8px;border:1px solid #ddd;">${source}</td>
          </tr>
          <tr>
            <td style="padding:8px;border:1px solid #ddd;"><strong>Joined At</strong></td>
            <td style="padding:8px;border:1px solid #ddd;">${new Date(createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</td>
          </tr>
        </table>
      </div>
    `,
  });
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const payload = normalizeBody(req.body);
  const email = String(payload.email || "").trim().toLowerCase();
  const source = String(payload.source || "footer-newsletter").trim() || "footer-newsletter";

  if (!isValidSubscriberEmail(email)) {
    return res.status(400).json({ success: false, message: "Please enter a valid email" });
  }

  try {
    const result = await addSubscriber(email, source);

    if (result.status === "duplicate") {
      return res.status(409).json({ success: false, message: "You are already subscribed" });
    }

    try {
      await notifyCompany(result.entry.email, result.entry.source, result.entry.createdAt);
    } catch (notificationError) {
      console.error("Subscriber notification failed", notificationError);
    }

    return res.status(200).json({ success: true, message: "Thank you for joining" });
  } catch (error) {
    console.error("Subscription storage failed", error);
    return res.status(500).json({ success: false, message: "Something went wrong, please try again" });
  }
}