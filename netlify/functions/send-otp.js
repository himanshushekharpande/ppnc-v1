// netlify/functions/send-otp.js
exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return json({ error: "Method not allowed" }, 405);
    }

    const { phone } = JSON.parse(event.body || "{}");
    if (!/^[6-9]\d{9}$/.test(String(phone || "").trim())) {
      return json({ error: "Invalid Indian mobile" }, 400);
    }

    const mobile = `91${phone.trim()}`;
    const authkey = process.env.MSG91_AUTHKEY;
    const templateId = process.env.MSG91_TEMPLATE_ID;
    if (!authkey || !templateId) {
      return json({ error: "Server not configured" }, 500);
    }

    const url = `https://control.msg91.com/api/v5/otp?template_id=${encodeURIComponent(templateId)}&mobile=${encodeURIComponent(mobile)}`;

    const r = await fetch(url, {
      method: "POST",
      headers: {
        "authkey": authkey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ otp_length: 6, otp_expiry: 5 })
    });

    const data = await r.json().catch(() => ({}));
    if (!r.ok) return json({ error: "Failed to send OTP", details: data }, r.status);

    return json({ ok: true, ...data }, 200);
  } catch (e) {
    return json({ error: "Unexpected error", details: String(e) }, 500);
  }
};

function json(body, status = 200) {
  return {
    statusCode: status,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  };
}
