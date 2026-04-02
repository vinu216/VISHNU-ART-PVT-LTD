import nodemailer from "nodemailer";

type OrderPayload = {
  orderType?: "quick" | "standard";
  customer: {
    fullName: string;
    companyName: string;
    email: string;
    phone: string;
    country?: string;
    address?: string;
    message?: string;
  };
  rows: Array<{
    woodType: string;
    size: string;
    pcs: string;
    cft: string;
  }>;
  totals: {
    totalPcs: number;
    totalCft: number;
  };
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const isPositiveNumberString = (value: string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0;
};

function normalizeBody(body: unknown): OrderPayload | null {
  try {
    if (typeof body === "string") return JSON.parse(body) as OrderPayload;
    if (body && typeof body === "object") return body as OrderPayload;
    return null;
  } catch {
    return null;
  }
}

function buildRowsHtml(rows: OrderPayload["rows"]) {
  return rows
    .map(
      (row, index) => `
        <tr>
          <td style="padding:8px;border:1px solid #ddd;">${index + 1}</td>
          <td style="padding:8px;border:1px solid #ddd;">${escapeHtml(row.woodType)}</td>
          <td style="padding:8px;border:1px solid #ddd;">${escapeHtml(row.size)}</td>
          <td style="padding:8px;border:1px solid #ddd;">${escapeHtml(row.pcs)}</td>
          <td style="padding:8px;border:1px solid #ddd;">${escapeHtml(row.cft)}</td>
        </tr>
      `
    )
    .join("");
}

function getMailConfig() {
  const user = process.env.EMAIL_USER || process.env.SMTP_USER;
  const pass = process.env.EMAIL_PASS || process.env.SMTP_PASS;
  const to = process.env.EMAIL_TO || "vishnuartprivatelimited@gmail.com";

  return { user, pass, to };
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const payload = normalizeBody(req.body);
  if (!payload?.customer?.fullName || !payload?.customer?.email || !payload?.rows?.length) {
    return res.status(400).json({ success: false, message: "Invalid request payload" });
  }

  if (!isValidEmail(payload.customer.email)) {
    return res.status(400).json({ success: false, message: "Invalid customer email" });
  }

  const invalidRow = payload.rows.some((row) => {
    const hasPcs = row.pcs.trim().length > 0;
    const hasCft = row.cft.trim().length > 0;

    if (!row.woodType.trim() || !row.size.trim()) return true;
    if (!hasPcs && !hasCft) return true;
    if (hasPcs && !isPositiveNumberString(row.pcs)) return true;
    if (hasCft && !isPositiveNumberString(row.cft)) return true;

    return false;
  });
  if (invalidRow) {
    return res.status(400).json({ success: false, message: "One or more order rows are invalid" });
  }

  const { user, pass, to } = getMailConfig();
  if (!user || !pass || !to) {
    return res.status(500).json({ success: false, message: "Email service is not configured" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });

    const rowsHtml = buildRowsHtml(payload.rows);
    const subject = "New Order - VISHNU ART PVT. LTD.";
    const html = `
      <div style="font-family:Arial,sans-serif;color:#1f1f1f;">
        <h2>${subject}</h2>
        <h3>Customer Details</h3>
        <table style="border-collapse:collapse;width:100%;margin-bottom:18px;">
          <tr><td style="padding:8px;border:1px solid #ddd;"><strong>Full Name</strong></td><td style="padding:8px;border:1px solid #ddd;">${escapeHtml(payload.customer.fullName)}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;"><strong>Company Name</strong></td><td style="padding:8px;border:1px solid #ddd;">${escapeHtml(payload.customer.companyName)}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;"><strong>Email</strong></td><td style="padding:8px;border:1px solid #ddd;">${escapeHtml(payload.customer.email)}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;"><strong>Phone</strong></td><td style="padding:8px;border:1px solid #ddd;">${escapeHtml(payload.customer.phone)}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;"><strong>Country</strong></td><td style="padding:8px;border:1px solid #ddd;">${escapeHtml(payload.customer.country || "-")}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;"><strong>Address</strong></td><td style="padding:8px;border:1px solid #ddd;">${escapeHtml(payload.customer.address || "-")}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;"><strong>Message</strong></td><td style="padding:8px;border:1px solid #ddd;">${escapeHtml(payload.customer.message || "-")}</td></tr>
        </table>

        <h3>Order Rows</h3>
        <table style="border-collapse:collapse;width:100%;margin-bottom:18px;">
          <thead>
            <tr>
              <th style="padding:8px;border:1px solid #ddd;">#</th>
              <th style="padding:8px;border:1px solid #ddd;">Wood Type</th>
              <th style="padding:8px;border:1px solid #ddd;">Size</th>
              <th style="padding:8px;border:1px solid #ddd;">PCS</th>
              <th style="padding:8px;border:1px solid #ddd;">CFT</th>
            </tr>
          </thead>
          <tbody>${rowsHtml}</tbody>
        </table>

        <p><strong>Total PCS:</strong> ${payload.totals.totalPcs}</p>
        <p><strong>Total CFT:</strong> ${payload.totals.totalCft}</p>
      </div>
    `;

    await transporter.sendMail({
      from: user,
      to,
      subject,
      html,
      replyTo: payload.customer.email,
    });

    return res.status(200).json({ success: true, message: "Order submitted successfully" });
  } catch (error) {
    console.error("Order email failure", error);
    return res.status(500).json({ success: false, message: "Failed to send order email" });
  }
}