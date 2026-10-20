/* ===== PROFILE HUB (D1) ===== */
if (path === '/profile-sync' && req.method === 'POST') {
  if (!env.DB) return text('Database not bound', 500);
  try {
    const d = await req.json();
    if (!d.email) return text('Missing email', 400);
    
    await env.DB.prepare(
      `INSERT INTO sw_profiles (
        email, profile, sub_category, monthly_income, existing_savings, 
        total_debt, dependents, buckets, commitments, goals, 
        ai_chat_summary, ciphertext, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) 
      ON CONFLICT(email) DO UPDATE SET 
        profile = excluded.profile,
        sub_category = excluded.sub_category,
        monthly_income = excluded.monthly_income,
        existing_savings = excluded.existing_savings,
        total_debt = excluded.total_debt,
        dependents = excluded.dependents,
        buckets = excluded.buckets,
        commitments = excluded.commitments,
        goals = excluded.goals,
        ai_chat_summary = excluded.ai_chat_summary,
        ciphertext = excluded.ciphertext,
        updated_at = excluded.updated_at`
    ).bind(
      d.email, d.profile, d.sub_category, d.monthly_income, 
      d.existing_savings, d.total_debt, d.dependents, 
      d.buckets, d.commitments, d.goals, 
      d.ai_chat_summary, d.ciphertext, Date.now(), Date.now()
    ).run();
    
    return json({ ok: true });
  } catch (err) { return text('DB Error: ' + err.message, 500); }
}

/* ===== SYNC (D1) ===== */
if (path === '/sync' && req.method === 'POST') {
  if (!env.DB) return text('Database not bound', 500);
  try {
    const data = await req.json();
    if (!data.email) return text('Missing email', 400);
    
    // Handle daily limit reset
    const today = new Date().toISOString().split('T')[0];
    let chatCount = data.chat_count || 0;
    let planCount = data.plan_count || 0;

    // Check if it's a new day, reset counts if so
    const existing = await env.DB.prepare(`SELECT last_active_date, chat_count, plan_count FROM sw_users WHERE email = ?`).bind(data.email).first();
    if (existing) {
      if (existing.last_active_date !== today) {
        chatCount = 0;
        planCount = 0;
      } else {
        // Use DB values if they exist to prevent client bypass
        chatCount = Math.max(existing.chat_count, chatCount);
        planCount = Math.max(existing.plan_count, planCount);
      }
    }

    await env.DB.prepare(
      `INSERT INTO sw_users (email, full_name, profile, tier, ciphertext, chat_count, plan_count, last_active_date, created_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) 
        ON CONFLICT(email) DO UPDATE SET 
        full_name = excluded.full_name,
        profile = excluded.profile, 
        tier = excluded.tier,
        ciphertext = excluded.ciphertext, 
        chat_count = excluded.chat_count,
        plan_count = excluded.plan_count,
        last_active_date = excluded.last_active_date`
    ).bind(
      data.email, 
      data.full_name || '', 
      data.profile || '', 
      data.tier || 'free', 
      data.ciphertext || '', 
      chatCount, 
      planCount, 
      today, 
      Date.now()
    ).run();
    
    return json({ ok: true, chat_count: chatCount, plan_count: planCount });
  } catch (err) { return text('DB Error: ' + err.message, 500); }
}

if (path === '/load' && req.method === 'GET') {
  if (!env.DB) return text('Database not bound', 500);
  const email = url.searchParams.get('email');
  if (!email) return text('Missing email', 400);
  try {
    const record = await env.DB.prepare(`SELECT * FROM sw_users WHERE email = ?`).bind(email).first();
    if (!record) return json({ ok: false, error: 'Not found' }, 404);
    return json({ ok: true, user: record });
  } catch (err) { return text('DB Error: ' + err.message, 500); }
}

/* ===== AI PROXY ===== */
if (path === '/' && req.method === 'POST') {
  if (!env.OPENROUTER_API_KEY || !env.MODEL) return text('AI not configured', 500);
  
  try {
    const body = await req.json();
    const msgs = Array.isArray(body.messages) ? body.messages.slice(0, 16) : [];
    
    const upstream = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + env.OPENROUTER_API_KEY,
        'Content-Type': 'application/json',
        'X-Title': 'SpendWise'
      },
      body: JSON.stringify({
        model: env.MODEL,
        messages: msgs.map(m => ({ role: m.role, content: String(m.content).slice(0, 4000) })),
        temperature: Number.isFinite(body.temperature) ? Math.min(0.7, Math.max(0.1, body.temperature)) : 0.2,
        max_tokens: Number.isFinite(body.max_tokens) ? Math.min(1600, Math.max(200, body.max_tokens)) : 1200,
        reasoning: { effort: 'low' }
      })
    });

    return new Response(upstream.body, {
      status: upstream.status,
      headers: { ...CORS, 'Content-Type': 'application/json' }
    });
  } catch (err) { return text('AI request failed', 502); }
}

return text('Not found', 404);
 
/* ===== SYNC (D1) ===== */
if (path === '/sync' && req.method === 'POST') {
if (!env.DB) return text('Database not bound', 500);
try {
const data = await req.json();
if (!data.email) return text('Missing email', 400);

// Handle daily limit reset
const today = new Date().toISOString().split('T')[0];
let chatCount = data.chat_count || 0;
let planCount = data.plan_count || 0;

// Check if it's a new day, reset counts if so
const existing = await env.DB.prepare(`SELECT last_active_date, chat_count, plan_count FROM sw_users WHERE email = ?`).bind(data.email).first();
if (existing) {
if (existing.last_active_date !== today) {
  chatCount = 0;
  planCount = 0;
} else {
  // Use DB values if they exist to prevent client bypass
  chatCount = Math.max(existing.chat_count, chatCount);
  planCount = Math.max(existing.plan_count, planCount);
}
}

await env.DB.prepare(
`INSERT INTO sw_users (email, full_name, profile, tier, ciphertext, chat_count, plan_count, last_active_date, created_at) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) 
  ON CONFLICT(email) DO UPDATE SET 
  full_name = excluded.full_name,
  profile = excluded.profile, 
  tier = excluded.tier,
  ciphertext = excluded.ciphertext, 
  chat_count = excluded.chat_count,
  plan_count = excluded.plan_count,
  last_active_date = excluded.last_active_date`
).bind(
data.email, 
data.full_name || '', 
data.profile || '', 
data.tier || 'free', 
data.ciphertext || '', 
chatCount, 
planCount, 
today, 
Date.now()
).run();

return json({ ok: true, chat_count: chatCount, plan_count: planCount });
} catch (err) { return text('DB Error: ' + err.message, 500); }
}

if (path === '/load' && req.method === 'GET') {
if (!env.DB) return text('Database not bound', 500);
const email = url.searchParams.get('email');
if (!email) return text('Missing email', 400);
try {
const record = await env.DB.prepare(`SELECT * FROM sw_users WHERE email = ?`).bind(email).first();
if (!record) return json({ ok: false, error: 'Not found' }, 404);
return json({ ok: true, user: record });
} catch (err) { return text('DB Error: ' + err.message, 500); }
}

/* ===== AI PROXY ===== */
if (path === '/' && req.method === 'POST') {
if (!env.OPENROUTER_API_KEY || !env.MODEL) return text('AI not configured', 500);

try {
const body = await req.json();
const msgs = Array.isArray(body.messages) ? body.messages.slice(0, 16) : [];

const upstream = await fetch('https://openrouter.ai/api/v1/chat/completions', {
method: 'POST',
headers: {
  'Authorization': 'Bearer ' + env.OPENROUTER_API_KEY,
  'Content-Type': 'application/json',
  'X-Title': 'SpendWise'
},
body: JSON.stringify({
  model: env.MODEL,
  messages: msgs.map(m => ({ role: m.role, content: String(m.content).slice(0, 4000) })),
  temperature: Number.isFinite(body.temperature) ? Math.min(0.7, Math.max(0.1, body.temperature)) : 0.2,
  max_tokens: Number.isFinite(body.max_tokens) ? Math.min(1600, Math.max(200, body.max_tokens)) : 1200,
  reasoning: { effort: 'low' }
})
});

return new Response(upstream.body, {
status: upstream.status,
headers: { ...CORS, 'Content-Type': 'application/json' }
});
} catch (err) { return text('AI request failed', 502); }
}

return text('Not found', 404);
