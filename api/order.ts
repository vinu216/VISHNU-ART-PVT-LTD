type JsonRecord = Record<string, unknown>;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const jsonResponse = (statusCode: number, payload: JsonRecord) => ({
  statusCode,
  headers: {
    "Content-Type": "application/json",
    ...corsHeaders,
  },
  body: JSON.stringify(payload),
});

export const handler = async (event: { httpMethod?: string; body?: string | null }) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { success: false, error: "Method not allowed" });
  }

  try {
    const payload = event.body ? (JSON.parse(event.body) as JsonRecord) : {};
    const name = String(payload.name ?? "").trim();
    const email = String(payload.email ?? "").trim();

    if (!name || !email) {
      return jsonResponse(400, { success: false, error: "name and email are required" });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.ORDER_EMAIL_TO;
    const from = process.env.ORDER_EMAIL_FROM;

    if (!apiKey || !to || !from) {
      return jsonResponse(500, {
        success: false,
        error: "Missing RESEND_API_KEY, ORDER_EMAIL_TO, or ORDER_EMAIL_FROM",
      });
    }

    const safePayload = JSON.stringify(payload, null, 2);

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `New order from ${name}`,
        reply_to: email,
        text: `New order submitted from website:\n\n${safePayload}`,
      }),
    });

    if (!resendResponse.ok) {
      const errorText = await resendResponse.text();
      return jsonResponse(502, {
        success: false,
        error: "Email provider rejected request",
        details: errorText,
      });
    }

    return jsonResponse(200, { success: true, message: "Order submitted" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return jsonResponse(500, { success: false, error: message });
  }
};