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
    const email = String(payload.email ?? "").trim();
    const name = String(payload.name ?? "Subscriber").trim();

    if (!email) {
      return jsonResponse(400, { success: false, error: "email is required" });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.SUBSCRIBE_EMAIL_TO ?? process.env.ORDER_EMAIL_TO;
    const from = process.env.SUBSCRIBE_EMAIL_FROM ?? process.env.ORDER_EMAIL_FROM;

    if (!apiKey || !to || !from) {
      return jsonResponse(500, {
        success: false,
        error: "Missing RESEND_API_KEY, SUBSCRIBE_EMAIL_TO/ORDER_EMAIL_TO, or SUBSCRIBE_EMAIL_FROM/ORDER_EMAIL_FROM",
      });
    }

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: "New newsletter subscription",
        reply_to: email,
        text: `${name} subscribed with email: ${email}`,
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

    return jsonResponse(200, { success: true, message: "Subscription submitted" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return jsonResponse(500, { success: false, error: message });
  }
};