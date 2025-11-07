// netlify/functions/verify-otp.js
const UPSTASH_BASE = process.env.UPSTASH_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REST_TOKEN;

function okJson(body) { return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }; }
function err(status, body) { return { statusCode: status, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }; }

async function upstash(path, method = 'GET', body = null) {
  const url = `${UPSTASH_BASE}/${path}`;
  const headers = { 'Authorization': `Bearer ${UPSTASH_TOKEN}` };
  if (body !== null) headers['Content-Type'] = 'application/json';
  const res = await fetch(url, { method, headers, body: body !== null ? JSON.stringify(body) : undefined });
  const txt = await res.text();
  try { return JSON.parse(txt); } catch(e) { return txt; }
}

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') return err(405, { error: 'Method Not Allowed' });

    const { tx, otp } = JSON.parse(event.body || '{}');
    if (!tx || !otp) return err(400, { error: 'tx and otp required' });

    const otpKey = `otp:${tx}`;

    // GET key: Upstash GET endpoint: /get/{key}
    const getRes = await upstash(`get/${encodeURIComponent(otpKey)}`, 'GET');
    // Upstash returns { result: "<value>" } for get; or null/{} if missing
    let storedRaw = getRes?.result ?? getRes;
    if (!storedRaw) {
      return err(400, { ok: false, error: 'transaction not found or expired' });
    }

    // storedRaw may be string like '{"phone":"919...","otp":"123456"}'
    let stored;
    try { stored = JSON.parse(storedRaw); } catch(e) { return err(500, { error: 'corrupt store' }); }

    if (stored.otp !== String(otp)) {
      return err(400, { ok: false, error: 'invalid otp' });
    }

    // success -> delete otp and phone_tx mapping
    await upstash(`del/${encodeURIComponent(otpKey)}`, 'POST');
    const phoneTxKey = `phone_tx:${stored.phone}`;
    await upstash(`del/${encodeURIComponent(phoneTxKey)}`, 'POST');

    // Return verified phone in E.164 (we stored as 91XXXXXXXXXX)
    const phoneE164 = `+${stored.phone}`;

    return okJson({ ok: true, phone: phoneE164 });
  } catch (err) {
    console.error(err);
    return err(500, { ok: false, error: 'server error', detail: String(err) });
  }
};