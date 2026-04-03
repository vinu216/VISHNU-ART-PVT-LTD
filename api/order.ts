type JsonRecord = Record<string, unknown>;
const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Content-Type", "Access-Control-Allow-Methods": "POST, OPTIONS" };
const res = (code: number, body: JsonRecord) => ({ statusCode: code, headers: { "Content-Type": "application/json", ...cors }, body: JSON.stringify(body) });

export const handler = async (event: { httpMethod?: string; body?: string | null }) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: cors, body: "" };
  if (event.httpMethod !== "POST") return res(405, { success: false, error: "Method not allowed" });
  try {
    const payload = event.body ? JSON.parse(event.body) : {};
    const customer = payload.customer ?? {};
    const name = String(customer.fullName ?? payload.name ?? "").trim();
    const email = String(customer.email ?? payload.email ?? "").trim();
    if (!name || !email) return res(400, { success: false, error: "Name and email required" });
    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.ORDER_EMAIL_TO;
    const from = process.env.ORDER_EMAIL_FROM;
    if (!apiKey || !to || !from) return res(500, { success: false, error: "Missing email config" });
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [to], subject: `New Order - ${name} - VISHNU ART PVT. LTD.`, reply_to: email, text: `New order:\n\n${JSON.stringify(payload, null, 2)}` }),
    });
    if (!r.ok) return res(502, { success: false, error: "Email failed", details: await r.text() });
    return res(200, { success: true, message: "Order submitted successfully" });
  } catch (e) {
    return res(500, { success: false, error: e instanceof Error ? e.message : "Unexpected error" });
  }
};
