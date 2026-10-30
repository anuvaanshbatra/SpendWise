/* Copilot waitlist route for the Cloudflare Worker.
   1. Bind your D1 database to the worker as DB (wrangler.toml: [[d1_databases]] binding = "DB").
   2. Run waitlist/schema.sql once.
   3. Paste handleWaitlist and its helpers into the worker, and call it from the fetch handler
      before the "Not found" response:
        if (url.pathname === '/waitlist') return handleWaitlist(request, env);
   The site posts { email, plan: 'copilot', consent: true } here (see waitlistPage in index.html). */

const ALLOWED_ORIGINS = ['https://YOUR-SITE.vercel.app']; // set to your real site origin(s)

const corsHeaders = (request) => {
  const origin = request.headers.get('Origin') || '';
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin',
  };
};
const reply = (body, status, headers) =>
  new Response(JSON.stringify(body), { status, headers: { ...headers, 'Content-Type': 'application/json' } });

export async function handleWaitlist(request, env) {
  const cors = corsHeaders(request);
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
  if (request.method !== 'POST') return reply({ error: 'method_not_allowed' }, 405, cors);

  let body;
  try { body = await request.json(); } catch { return reply({ error: 'bad_json' }, 400, cors); }

  const email = String(body.email || '').trim().toLowerCase();
  const valid = email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  if (!valid || body.consent !== true) return reply({ error: 'invalid' }, 400, cors);

  try {
    // INSERT OR IGNORE: signing up twice with the same email is harmless
    const r = await env.DB
      .prepare('INSERT OR IGNORE INTO waitlist (email, plan, created_at) VALUES (?, ?, ?)')
      .bind(email, 'copilot', Date.now())
      .run();
    return reply({ ok: true, duplicate: !(r.meta && r.meta.changes) }, 200, cors);
  } catch {
    return reply({ error: 'server' }, 500, cors); // never return raw DB errors to the client
  }
}
