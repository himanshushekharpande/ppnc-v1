// netlify/functions/send-otp.js
const FAST2SMS_URL = 'https://www.fast2sms.com/dev/bulkV2';
const UPSTASH_BASE = process.env.UPSTASH_REST_URL; // required
const UPSTASH_TOKEN = process.env.UPSTASH_REST_TOKEN; // required
const FAST2SMS_KEY = process.env.FAST2SMS_KEY; // required
const SENDER_ID = process.env.SENDER_ID || 'PPNCPT';
const FAST2SMS_MESSAGE_ID = process.env.FAST2SMS_MESSAGE_ID || process.env.TEMPLATE_ID || '201725'; // prefer Excel message id
const ENTITY_ID = process.env.ENTITY_ID || null; // optional
const OTP_TTL = Number(process.env.OTP_TTL_SECONDS || 300); // seconds
const RATE_LIMIT_MAX = Number(process.env.RATE_LIMIT_MAX || 5); // max sends per phone per window
const RATE_LIMIT_WINDOW = Number(process.env.RATE_LIMIT_WINDOW || 3600); // seconds (1 hour)

function okJson(body) { return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }; }
function errJson(status, body) { return { statusCode: status, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }; }

function phoneNormalize(p) {
  let s = String(p || '').trim();
  s = s.replace(/\D/g, '');
  if (s.length === 10) s = '91' + s;
  if (s.length === 12 && s.startsWith('91')) return s;
  return null;
}

async function upstash(path, method = 'GET', body = null) {
  if (!UPSTASH_BASE) throw new Error('UPSTASH_REST_URL is not set');
  const url = `${UPSTASH_BASE}/${path}`;
  const headers = { 'Authorization': `Bearer ${UPSTASH_TOKEN}` };
  if (body !== null) headers['Content-Type'] = 'application/json';
  const res = await fetch(url, { method, headers, body: body !== null ? JSON.stringify(body) : undefined });
  const txt = await res.text();
  try { return JSON.parse(txt); } catch (e) { return txt; }
}

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') return errJson(405, { error: 'Method Not Allowed' });

    // basic env checks
    if (!FAST2SMS_KEY) return errJson(500, { error: 'FAST2SMS_KEY not configured' });
    if (!UPSTASH_BASE || !UPSTASH_TOKEN) return errJson(500, { error: 'Upstash configuration missing' });
    if (!FAST2SMS_MESSAGE_ID) return errJson(500, { error: 'FAST2SMS_MESSAGE_ID not configured' });

    const payload = JSON.parse(event.body || '{}');
    const phoneRaw = payload.phone;
    const phone = phoneNormalize(phoneRaw);
    if (!phone) return errJson(400, { error: 'Invalid phone. Provide 10-digit Indian number.' });

    // Rate limit key: rl:<phone>
    const rlKey = `rl:${phone}`;

    // INCR rl counter (Upstash incr)
    const incrRes = await upstash(`incr/${rlKey}`, 'POST');
    // upstash incr result can be JSON or plain; try to read .result
    const count = Number(incrRes?.result ?? incrRes ?? 0);

    // If first time, set expiry
    if (count === 1) {
      await upstash(`expire/${rlKey}/${RATE_LIMIT_WINDOW}`, 'POST');
    }

    if (count > RATE_LIMIT_MAX) {
      return errJson(429, { error: 'Rate limit exceeded. Try after some time.' });
    }

    // generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Build DLT payload — IMPORTANT: use `message` = Fast2SMS Message ID (from Excel)
    const body = {
      route: "dlt",
      sender_id: SENDER_ID,
      message: String(FAST2SMS_MESSAGE_ID), // numeric message id from Excel (e.g., "201725")
      variables_values: otp,
      numbers: phone // e.g., "919812345678"
    };

    // include entity_id if provided (harmless)
    if (ENTITY_ID) body.entity_id = String(ENTITY_ID);

    // call Fast2SMS
    const res = await fetch(FAST2SMS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization': FAST2SMS_KEY
      },
      body: JSON.stringify(body)
    });

    // parse provider response (keep raw for debugging)
    let providerJson;
    try { providerJson = await res.json(); } catch(e) {
      const txt = await res.text().catch(() => '');
      providerJson = { ok:false, raw: txt };
    }

    // Log provider response for debugging (Netlify dev logs)
    console.log('FAST2SMS request body:', body);
    console.log('FAST2SMS response status:', res.status);
    console.log('FAST2SMS response json:', providerJson);

    // check errors
    if (!res.ok || providerJson?.return === false || providerJson?.success === false || providerJson?.return === 'error') {
      return errJson(502, { error: 'Failed to send SMS', provider: providerJson, status: res.status });
    }

    // Save OTP in Upstash with TTL
    const tx = `tx_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;
    const otpKey = `otp:${tx}`;
    const value = JSON.stringify({ phone, otp });

    await upstash(`set/${encodeURIComponent(otpKey)}/${encodeURIComponent(value)}?EX=${OTP_TTL}`, 'POST');

    // Reverse mapping phone->tx (same TTL)
    const phoneTxKey = `phone_tx:${phone}`;
    await upstash(`set/${encodeURIComponent(phoneTxKey)}/${encodeURIComponent(tx)}?EX=${OTP_TTL}`, 'POST');

    return okJson({ ok: true, tx, provider: providerJson });
  } catch (err) {
    console.error('send-otp error:', err);
    return errJson(500, { error: 'server error', detail: String(err) });
  }
};