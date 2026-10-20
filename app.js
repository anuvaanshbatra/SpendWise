(()=>{
/* ===== AI CONFIG ===== */
const AI_CONFIG={ENDPOINT:'https://ai-proxy-worker.spendwise-main.workers.dev',MODEL:'nvidia/nemotron-3-ultra-550b-a55b:free',DIRECT_KEY:''};
/* Free-tier AI limits (display and soft enforcement). Real per-user enforcement belongs in the worker once the database is live. */
/* reply = max tokens per answer. Models that think first spend part of it on thinking, so keep generous headroom. */
const AI_LIMITS={free:{chat:10,plan:3,reply:1200,hist:6,chars:500},paid:{chat:60,plan:20,reply:1600,hist:12,chars:800},learner:{chat:15,reply:900},landing:3};
const aiPaid=()=>!!(SW.data&&SW.data.tier==='paid');
function aiLim(){const l=Object.assign({},aiPaid()?AI_LIMITS.paid:AI_LIMITS.free);if(isL()){l.reply=Math.min(l.reply,AI_LIMITS.learner.reply);if(!aiPaid())l.chat=AI_LIMITS.learner.chat}return l}
const dayKey=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
function aiUse(){if(!st.ai||st.ai.d!==dayKey())st.ai={d:dayKey(),c:0,p:0};return st.ai}
const aiLeft=k=>Math.max(0,aiLim()[k==='c'?'chat':'plan']-aiUse()[k]);
function aiLeftHTML(){const n=aiLeft('c'),L=aiLim().chat;return`${n} of ${L} AI messages left today.${n===0?' They reset tomorrow.':''}${aiPaid()?'':` <button type="button" class="lk" data-a="upgrade">${n===0?'Upgrade for more':'Get more with Copilot'}</button>`}`}
const aiReady=()=>!!AI_CONFIG.ENDPOINT||!!(AI_CONFIG.DIRECT_KEY&&AI_CONFIG.MODEL);

const R=n=>(n<0?'-':'')+'₹'+Math.abs(Math.round(n)).toLocaleString('en-IN');
const E=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const IN={Learner:'Monthly pocket money',Teen:'Allowance + side-hustle income','Young adult':'Monthly income or stipend','Working professional':'Monthly take-home income','Senior citizen':'Monthly pension and other income','Armed forces':'Monthly pay and allowances','All India Services':'Monthly take-home pay',OCI:'Monthly income in India','BPL family':'Monthly household income'};
const FX=['Rent','EMI / loan','School or college fees','Insurance','Subscriptions'],GP=['Trip','Festival','Bike or gadget','Emergency fund'];
const CAT=['Food','Travel','Shopping','Bills','Fun','Other'];
const CL={e:'#34d399',f:'#60a5fa',i:'#c084fc',s:'#fbbf24'};
const ic=(d,w)=>`<svg class="i" viewBox="0 0 24 24"${w?` style="stroke-width:${w}"`:''}><path d="${d}"/></svg>`;
const I={home:ic('M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z'),spends:ic('M6 2h12v20l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6'),plan:ic('M21.2 15.9A10 10 0 1 1 8 2.8M22 12A10 10 0 0 0 12 2v10z'),goals:ic('M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z'),more:ic('M5 12h.01M12 12h.01M19 12h.01',3),plus:ic('M12 5v14M5 12h14'),spark:ic('M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z'),ask:ic('M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z')};

const css=document.createElement('style');css.textContent=`
#appRoot{max-width:760px;padding-bottom:104px}#app .atop{max-width:760px}
.pg h2{font-size:clamp(26px,4.4vw,32px);font-weight:800;letter-spacing:-.03em;line-height:1.15}
.pg .sub{color:var(--mu);margin:6px 0 20px;font-size:15px}
.h3s{font-size:12.5px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:#64748b;margin:28px 0 10px}
.cd{padding:20px;border-radius:20px;background:var(--panel);border:1px solid var(--line)}
.w{max-width:680px;margin:0 auto}.w h2{font-size:clamp(28px,5vw,40px);font-weight:800;letter-spacing:-.03em;line-height:1.1}
.dots{display:flex;gap:8px;margin:0 0 28px}.dots i{flex:1;height:5px;border-radius:5px;background:var(--line)}.dots i.on{background:var(--em)}
.w .sub{color:var(--mu);margin:8px 0 26px}.w label,.cd label{display:block;font-size:13px;font-weight:600;color:var(--mu);margin:0 0 6px}
.w input,.cd input[type=number],.cd input[type=text]{width:100%;padding:14px;border-radius:12px;background:var(--panel);border:1px solid var(--line);color:#fff;font:inherit;margin-bottom:14px}
.cd input[type=number],.cd input[type=text]{background:var(--bg)}
.w input:focus,.cd input:focus{outline:0;border-color:var(--em)}
.pre{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:18px}.pre button{padding:8px 14px;border-radius:999px;border:1px solid var(--line);font-size:13px;font-weight:500;color:var(--mu)}.pre button:hover{color:#fff;border-color:var(--em)}
.rw{position:relative;padding:16px 16px 4px;border:1px solid var(--line);border-radius:16px;background:var(--panel);margin-bottom:12px}
.rw .gr{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:0 12px}
.rw .dl{position:absolute;top:8px;right:8px;width:36px;height:36px;border-radius:10px;color:var(--mu);font-size:20px}.rw .dl:hover{color:var(--rd)}
.wn{display:flex;gap:12px;margin-top:26px}.wn .btn{flex:1}
.wm{color:var(--rd);font-size:14px;margin:-6px 0 14px;min-height:1px}
.hc{padding:24px;border-radius:26px;background:linear-gradient(160deg,#0f172a,#06251e);border:1px solid rgba(52,211,153,.38);box-shadow:0 20px 60px rgba(16,185,129,.08)}
.hc.neg{background:linear-gradient(160deg,#0f172a,#2a0f12);border-color:rgba(248,113,113,.45)}
.hc small{color:var(--mu);font-size:14px;font-weight:500}
.hc b{display:block;font-size:clamp(42px,9vw,58px);font-weight:900;letter-spacing:-.04em;line-height:1.1;margin:4px 0 12px;font-variant-numeric:tabular-nums;color:var(--em)}
.hc.neg b{color:var(--rd)}.hc p{color:var(--mu);font-size:14px;margin-top:10px}
.hb{margin-top:18px;display:flex;gap:10px}.hb .btn{flex:1}
.pb{height:8px;border-radius:8px;background:#1e293b;margin:12px 0 8px;overflow:hidden}.pb i{display:block;height:100%;background:var(--c,var(--em));border-radius:8px;transition:width .4s}
.tl{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:14px}
.tl button{display:flex;flex-direction:column;align-items:center;gap:8px;padding:14px 4px;border-radius:18px;background:var(--panel);border:1px solid var(--line);font-size:12.5px;font-weight:600;color:var(--tx);transition:.2s}
.tl button:hover{border-color:#334155;transform:translateY(-2px)}
.tl .ti{width:42px;height:42px;border-radius:14px;display:grid;place-items:center;background:rgba(52,211,153,.1);color:var(--em);font-size:20px}
.st3{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.st3 div{padding:14px;border-radius:16px;background:var(--panel);border:1px solid var(--line);min-width:0}
.st3 small{display:block;color:var(--mu);font-size:12px}.st3 b{font-size:clamp(15px,3.6vw,19px);font-weight:800;font-variant-numeric:tabular-nums}
.fl{border:1px solid var(--line);border-radius:18px;overflow:hidden;background:var(--panel)}
.fl>div{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:14px 18px;border-bottom:1px solid var(--line)}.fl>div:last-child{border:0}
.fl small{display:block;color:var(--mu);font-size:12.5px}
.rr{display:flex;align-items:center;gap:6px}.rr button{width:32px;height:32px;border-radius:10px;color:#64748b;font-size:20px;line-height:1}.rr button:hover{color:var(--rd)}
.pos{color:var(--em)}.neg2{color:var(--rd)}
.dh{display:flex;justify-content:space-between;font-size:13px;font-weight:600;color:var(--mu);margin:22px 4px 8px}
.em{padding:26px;text-align:center;color:var(--mu);border:1px dashed var(--line);border-radius:18px;font-size:14px}
.cats{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 14px}
.al{padding:18px 20px;border-radius:18px;background:rgba(251,191,36,.08);border:1px solid rgba(251,191,36,.35)}
.al b{display:block;font-size:16px}.al span{display:block;color:var(--mu);font-size:14px;margin-top:2px}.al.ok{background:rgba(52,211,153,.08);border-color:rgba(52,211,153,.35)}.al .btn{margin-top:12px;width:100%}
.bk{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.bc{padding:16px;border-radius:18px;background:var(--panel);border:1px solid var(--line);border-top:3px solid var(--c);min-width:0}
.bc small{color:var(--mu);font-size:12.5px;font-weight:600}.bc b{display:block;font-size:clamp(20px,4.6vw,26px);font-weight:800;letter-spacing:-.03em;font-variant-numeric:tabular-nums;margin:2px 0}
.bc p{font-size:12.5px;color:var(--mu);margin-top:4px;line-height:1.4}.bc .pb{margin:10px 0 6px}
.ac2{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:16px}.ac2 h4{font-size:18px;font-weight:700}
.s2{color:var(--mu);font-size:14px;margin-top:2px}.fn{font-size:12.5px;color:#64748b;margin-top:12px;line-height:1.5}
.sb{display:flex;height:12px;border-radius:12px;overflow:hidden;background:#1e293b;margin:6px 0 12px;gap:2px}.sb i{display:block;height:100%;transition:width .3s}
.lg2{display:grid;gap:8px;font-size:14px}.lg2 div{display:flex;justify-content:space-between;gap:10px;font-variant-numeric:tabular-nums}
.lg2 span:first-child{display:flex;align-items:center;gap:8px;color:var(--mu)}.lg2 em{width:10px;height:10px;border-radius:50%;flex:none}.lg2 .un{color:#64748b;font-weight:500}
.sug{padding:16px;border-radius:16px;background:rgba(192,132,252,.08);border:1px solid rgba(192,132,252,.35);margin-bottom:16px;font-size:14px}
.sug>b{display:block;margin-bottom:6px}.sug .vals{font-weight:700;margin-bottom:6px}
.sug summary{padding:8px 0;font-size:14px;font-weight:600;color:#d8b4fe}.sug details{border:0}.sug details p{padding:0 0 8px;font-size:14px;color:var(--mu);max-width:none}
.sug .row2{display:flex;gap:8px;margin-top:10px}.sug .row2 .btn{flex:1}
.er2{padding:12px 14px;border-radius:12px;background:rgba(248,113,113,.1);border:1px solid rgba(248,113,113,.4);color:#fca5a5;font-size:14px;margin-bottom:14px}
.prof{display:flex;gap:14px;align-items:center}.av{width:52px;height:52px;border-radius:50%;background:linear-gradient(135deg,#10b981,#06b6d4);color:#021;display:grid;place-items:center;font-weight:800;font-size:20px;flex:none}
.prof b{display:block;font-size:17px}.prof small{color:var(--mu);font-size:13px;word-break:break-all}
.gc{padding:18px;border-radius:20px;background:var(--panel);border:1px solid var(--line);margin-bottom:12px}
.gc h4{font-size:17px;font-weight:700;display:flex;justify-content:space-between;gap:10px;align-items:center}
.ch{font-size:12px;font-weight:600;padding:3px 10px;border-radius:999px;background:rgba(52,211,153,.12);color:var(--em);white-space:nowrap}.ch.w2{background:rgba(251,191,36,.12);color:var(--am)}
.gc p{font-size:13.5px;color:var(--mu);display:flex;justify-content:space-between}
.nv{position:fixed;left:0;right:0;bottom:0;z-index:60;display:flex;justify-content:center;padding-bottom:env(safe-area-inset-bottom);background:rgba(3,7,18,.92);backdrop-filter:blur(16px);border-top:1px solid var(--line)}
.nv>div{width:min(760px,100%);display:grid;grid-template-columns:repeat(6,1fr)}
.nv button{display:flex;flex-direction:column;align-items:center;gap:4px;padding:10px 4px 12px;min-height:60px;font-size:11.5px;font-weight:600;color:var(--mu)}
.nv button svg{width:22px;height:22px}.nv button[aria-current=page]{color:var(--em)}
#tst{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(84px + env(safe-area-inset-bottom));z-index:70;padding:12px 18px;border-radius:14px;background:#0f172a;border:1px solid rgba(52,211,153,.5);color:#fff;font-size:14px;box-shadow:0 12px 40px rgba(0,0,0,.6);max-width:calc(100% - 32px);text-align:center}
#tst.bad{border-color:rgba(251,191,36,.6)}
#appRoot .chatbox{min-height:0;padding:0;border:0;background:none;box-shadow:none;border-radius:0}
#appRoot .chatlog{max-height:min(390px,48vh)}

.pk{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:8px}
@media(min-width:560px){.pk{grid-template-columns:repeat(3,1fr)}}
.pk button{position:relative;display:flex;flex-direction:column;align-items:center;text-align:center;gap:6px;padding:20px 10px 16px;border-radius:20px;background:var(--panel);border:1.5px solid var(--line);color:var(--tx);transition:.2s;min-height:158px}
.pk button:hover{border-color:#334155;transform:translateY(-2px)}
.pk button[aria-pressed=true]{border-color:var(--em);background:rgba(52,211,153,.09);box-shadow:0 0 0 3px rgba(52,211,153,.14)}
.pk .pa{width:60px;height:60px;border-radius:50%;display:grid;place-items:center;font-size:30px;background:#0f172a;border:1px solid var(--line);margin-bottom:2px}
.pk b{font-size:15px;font-weight:700;line-height:1.2}.pk small{color:var(--mu);font-size:12.5px;line-height:1.35}
.pk .ck{position:absolute;top:10px;right:10px;width:22px;height:22px;border-radius:50%;background:var(--em);color:#021;display:none;place-items:center;font-size:12px;font-weight:900}
.pk button[aria-pressed=true] .ck{display:grid}
.w select,.cd select{width:100%;padding:14px;border-radius:12px;background:var(--panel);border:1px solid var(--line);color:#fff;font:inherit;margin-bottom:14px}
.w select:focus{outline:0;border-color:var(--em)}
.pre button[aria-pressed=true]{background:rgba(52,211,153,.12);border-color:var(--em);color:var(--em)}
.w .h3s{margin-top:22px}
.qh{display:flex;align-items:center;gap:10px;margin:0 0 22px}
.qh .xp{flex:1;height:10px;border-radius:10px;background:#1e293b;overflow:hidden}.qh .xp i{display:block;height:100%;background:linear-gradient(90deg,#fbbf24,#34d399);border-radius:10px;transition:width .4s}
.qh span{font-size:13px;font-weight:700;color:var(--am);white-space:nowrap}
.bub{display:flex;gap:12px;align-items:flex-start;padding:14px 16px;border-radius:18px;background:rgba(251,191,36,.08);border:1px solid rgba(251,191,36,.3);margin:0 0 18px;font-size:15px;line-height:1.5}
.bub .mo{font-size:30px;line-height:1;flex:none}
.coins{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin:4px 0 8px}
.coin{width:34px;height:34px;border-radius:50%;background:radial-gradient(circle at 30% 30%,#fde68a,#f59e0b);display:grid;place-items:center;font-size:15px;font-weight:900;color:#78350f;box-shadow:0 3px 0 #b45309}
.coin.o{background:none;box-shadow:none;border:2px dashed #334155;color:#334155}
.jr{display:grid;gap:12px;margin:14px 0}
.jc{padding:16px;border-radius:20px;background:var(--panel);border:1.5px solid var(--line);border-left:5px solid var(--c);margin-bottom:12px}
.jc .jt{display:flex;align-items:center;gap:12px}.jc .ji{font-size:30px;width:52px;height:52px;border-radius:16px;background:rgba(255,255,255,.04);display:grid;place-items:center;flex:none}
.jc .jt>div:nth-child(2){min-width:0}.jc .jt b{display:block;font-size:17px}.jc small{color:var(--mu);font-size:13px}
.jc .ctl{margin-left:auto;display:flex;align-items:center;gap:8px}
.jc .ctl button{width:44px;height:44px;border-radius:14px;border:1px solid var(--line);font-size:22px;font-weight:700;background:#0f172a;line-height:1}
.jc .ctl button:hover{border-color:var(--c)}.jc .ctl b{min-width:24px;text-align:center;font-size:22px}
.jc .fill{display:flex;gap:4px;margin:12px 0 4px;height:12px}.jc .fill i{flex:1;border-radius:4px;background:#1e293b;transition:background .2s}.jc .fill i.on{background:var(--c)}
.jc p{font-size:13.5px;color:var(--mu);margin-top:8px;line-height:1.5}
.gm{padding:20px;border-radius:22px;background:linear-gradient(160deg,#1e1b4b,#0f172a);border:1px solid rgba(192,132,252,.4)}
.gm h4{font-size:18px;display:flex;justify-content:space-between;gap:10px;align-items:center}
.gm .it{font-size:clamp(20px,5vw,26px);font-weight:800;margin:16px 0;text-align:center;letter-spacing:-.02em}
.gm .two{display:grid;grid-template-columns:1fr 1fr;gap:10px}.gm .two .btn{padding:16px}.gm .two .btn[disabled]{opacity:.5}
.gm .fb{margin-top:14px;padding:12px 14px;border-radius:14px;font-size:14px;line-height:1.5}.gm .fb.y{background:rgba(52,211,153,.12);border:1px solid rgba(52,211,153,.4)}.gm .fb.n{background:rgba(251,191,36,.1);border:1px solid rgba(251,191,36,.4)}
.jar3{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.jar3>div{padding:14px 6px;border-radius:18px;background:var(--panel);border:1px solid var(--line);text-align:center;border-top:3px solid var(--c);min-width:0}
.jar3 .e{display:block;font-size:28px}.jar3 small{display:block;color:var(--mu);font-size:12px}.jar3 b{display:block;font-size:clamp(15px,3.8vw,19px);font-weight:800;font-variant-numeric:tabular-nums}
.fp{padding:16px 18px;border-radius:18px;background:var(--panel);border:1px solid var(--line);margin-bottom:10px}.fp b{display:block;margin-bottom:4px}.fp p{font-size:14px;color:var(--mu);line-height:1.5}
.pbadge{display:inline-flex;gap:6px;align-items:center;font-size:13px;font-weight:600;padding:4px 12px;border-radius:999px;background:rgba(52,211,153,.1);color:var(--em);margin-left:6px}
#appRoot.big .pg,#appRoot.big .w{zoom:1.12}#appRoot.big .btn{min-height:54px}
.cmsg ul,.cmsg ol{margin:6px 0 0;padding-left:20px}.cmsg li{margin:3px 0}.cmsg.err{border-color:rgba(248,113,113,.5)}

.tt3{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:14px}
.tt3 button{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding:22px 6px;border-radius:24px;background:var(--panel);border:1px solid var(--line);font-size:14px;font-weight:700;color:var(--tx);transition:.2s;min-height:116px}
.tt3 button span{font-size:36px;line-height:1}.tt3 button:hover{transform:translateY(-3px);border-color:var(--em)}
.stk{display:inline-flex;align-items:center;gap:6px;padding:6px 14px;border-radius:999px;background:rgba(251,191,36,.12);color:var(--am);font-weight:700;font-size:13.5px;margin:0 0 16px}
.tp details{border:1px solid var(--line);border-radius:16px;background:var(--panel);padding:0 16px;margin-bottom:8px}.tp summary{padding:14px 0;font-size:16px}.tp details p{padding:0 0 14px;font-size:14px}
.rk{font-size:12px;font-weight:700;padding:3px 10px;border-radius:999px;background:rgba(251,191,36,.12);color:var(--am);white-space:nowrap}.rk.lo{background:rgba(52,211,153,.12);color:var(--em)}.rk.hi{background:rgba(248,113,113,.12);color:var(--rd)}
.cm details{border:1px solid var(--line);border-radius:16px;background:var(--panel);padding:0 16px;margin-bottom:8px}.cm summary{padding:14px 0;font-size:16px;gap:10px}.cm summary>span:first-child{display:flex;align-items:center;gap:10px;flex:1;min-width:0}.cm details p{padding:0 0 10px;font-size:14px}.cm details p b{color:var(--tx)}
.hz{padding:16px 18px;border-radius:18px;background:rgba(52,211,153,.07);border:1px solid rgba(52,211,153,.3);margin-top:4px}.hz ul{margin:8px 0 8px 18px;font-size:15px}.hz p{color:var(--mu);font-size:14px}
.fl .chip{padding:6px 14px}
button.sc{display:flex;align-items:center;gap:14px;width:100%;margin:12px 0 0;padding:12px 16px;border:1px solid var(--line);border-radius:18px;background:var(--panel);color:inherit;font:inherit;text-align:left;cursor:pointer}button.sc>div{flex:1;min-width:0}button.sc b{display:block;font-size:16px}button.sc small{color:var(--mu);font-size:13px}button.sc>span{font-size:22px;color:var(--mu)}button.sc.off{border-style:dashed}
.gg{width:120px;flex:none}.gg.big{width:100%;max-width:280px;display:block;margin:0 auto}.gg .gn{font-size:40px;font-weight:800;fill:#f1f5f9}.gg .gl{font-size:11px;font-weight:600;fill:#94a3b8}.scd{text-align:center}.scd p{margin-top:8px}
.lk{background:none;border:0;padding:0;color:var(--em);font:inherit;font-weight:600;text-decoration:underline;text-underline-offset:3px;cursor:pointer;margin-left:4px}
@media(max-width:380px){.tl{gap:6px}.tl button{font-size:11.5px}.nv button{font-size:10.5px;padding:10px 2px 12px}}`;
document.head.append(css);

/* ===== state ===== */
let root,st,tab='home',cat='',nw='',invSec='ready',invH='',game=null,aiBusy=false,aiErr='',chatBusy=false,chatErr='';
const landChat={msgs:[],busy:false,err:'',n:0};
const $=id=>document.getElementById(id);
const sum=(a,f)=>a.reduce((x,y)=>x+f(y),0);
const mk=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')};
const mname=()=>new Date().toLocaleString('en-IN',{month:'long',year:'numeric'});
const blank=()=>({v:4,step:0,income:0,savings:0,debt:0,dependents:0,fixed:[],goals:[],done:false,rules:{e:null,i:null,em:null},cycles:[],spends:[],sug:null,pf:{},learn:{xp:0,jars:{s:0,v:0,d:0}},inv:{sip:{},fd:{},tx:{}}});

/* ===== profile helpers (content lives in profiles.js) ===== */
const SP=()=>window.SW_PROFILES||{order:[]},SL=()=>window.SW_LEARN||{dreams:[],levels:['Saver'],jars:{},whys:[],items:[]};
const prof=()=>(SW.data&&SW.data.profile)||'',pd=()=>SP()[prof()]||{},isL=()=>prof()==='Learner',isT=()=>prof()==='Teen',isW=()=>prof()==='Working professional';
/* Teens have no investing bucket, so it is fixed at 0 (not a default split: the Save % stays theirs to type) */
const fixTeen=()=>{if(isT())st.rules.i=0};
const fxP=()=>pd().fx||FX,gpP=()=>pd().gp||GP,catP=()=>pd().cats||CAT,incLabel=()=>pd().inc||IN[prof()]||'Monthly income';
const STEPS=()=>isL()?['profile','money','dream','jars']:['profile','basics','fixed','goals'];
const addMonths=n=>{const d=new Date();d.setDate(1);d.setMonth(d.getMonth()+n);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')};
const jleft=()=>{const j=st.learn.jars;return 10-j.s-j.v-j.d};
function dreamMonths(dj){const g=st.goals[0];if(!g)return null;const left=Math.max(0,g.t-g.s);if(!left)return 0;const per=st.income*(dj==null?st.learn.jars.d:dj)/10;return per>0?Math.ceil(left/per):null}
/* Learner jars drive the same engine as everyone else: Save coins become the emergency %, Dream coins set the goal date. */
function syncLearn(){const j=st.learn.jars,g=st.goals[0];st.rules.e=j.v*10;st.rules.i=0;if(g){const n=dreamMonths();g.d=addMonths(Math.min(120,(n||1)+(thisCycle()?1:0)))}}
function pfSafe(){const o={};(pd().q||[]).forEach(q=>{if(q.t==='text')return;const v=(st.pf||{})[q.k];if(v===undefined||v===''||(Array.isArray(v)&&!v.length))return;o[q.k]=v});return o}
const months=d=>{if(!d)return 1;const[y,m]=d.split('-').map(Number),n=new Date();return Math.max(1,(y-n.getFullYear())*12+m-(n.getMonth()+1))};
const thisCycle=()=>st.cycles.find(c=>c.k===mk());
const need=g=>g.s>=g.t?0:Math.round((g.t-g.s)/Math.max(1,months(g.d)-(thisCycle()?1:0)));
const save=async()=>{
 SW.data.setup=st;
 await SW.save();
 
 if(SW.user&&SW.user.email&&SW.key){
   try{
     // 1. Encrypt the full raw data (spends, history, everything)
     const sealed=await SW.seal(SW.key,SW.data);
     const ciphertext=JSON.stringify({iv:sealed.iv,d:sealed.d});
     
     // 2. Extract plain-text aggregates for the admin hub
     const p = plan(); // your existing plan calculator
     const m = money(); // your existing money calculator
     
     // Extract sub-category based on their specific profile questions
     let subCat = '';
     if(st.pf) {
       if(isT()) subCat = st.pf.src === 'Side hustle' ? 'side_hustle' : 'allowance';
       if(isW()) subCat = st.pf.emp || 'unknown'; // Salaried, Self-employed, etc.
       if(prof()==='Young adult') subCat = st.pf.status || 'student';
     }

     // Format their commitments and goals into clean JSON
     const commitments = JSON.stringify(st.fixed.map(f => ({ name: f.n, amount: Number(f.a) })));
     const goals = JSON.stringify(st.goals.map(g => ({ name: g.n, target: Number(g.t), saved: Number(g.s) })));
     const buckets = JSON.stringify({ emergency: p.e, invest: p.i, safe: p.safe });

     // Get the last AI message they received as a summary
     const lastAiMsg = st.chat && st.chat.length > 0 ? st.chat[st.chat.length - 1].content.slice(0, 150) + '...' : '';

     // 3. Send to Cloudflare
     fetch(AI_CONFIG.ENDPOINT.replace(/\/$/,'')+'/profile-sync',{
       method:'POST',
       headers:{'Content-Type':'application/json'},
       body:JSON.stringify({
         email: SW.user.email,
         profile: SW.data.profile || 'None',
         sub_category: subCat,
         monthly_income: st.income || 0,
         existing_savings: st.savings || 0,
         total_debt: st.debt || 0,
         dependents: st.dependents || 0,
         buckets: buckets,
         commitments: commitments,
         goals: goals,
         ai_chat_summary: lastAiMsg,
         ciphertext: ciphertext
       })
     }).catch(e=>console.warn('DB sync failed',e));
     
   }catch(e){console.warn('Sync encrypt failed',e)}
 }
};
const dlabel=t=>{const d=new Date(t),n=new Date(),a=new Date(d.getFullYear(),d.getMonth(),d.getDate()),b=new Date(n.getFullYear(),n.getMonth(),n.getDate()),df=Math.round((b-a)/864e5);return df===0?'Today':df===1?'Yesterday':d.toLocaleDateString('en-IN',{day:'numeric',month:'short'})};
function toast(t,bad){let x=$('tst');if(!x){x=document.createElement('div');x.id='tst';x.setAttribute('role','status');x.setAttribute('aria-live','polite');document.body.append(x)}
 x.textContent=t;x.className=bad?'bad':'';clearTimeout(toast.t);toast.t=setTimeout(()=>x.remove(),3200)}

/* Plan numbers come only from what the user typed (rules) and what is calculated (bills, goals). */
function plan(){
 const r=st.rules,fx=sum(st.fixed,x=>+x.a||0),rq=sum(st.goals,need);
 const eSet=r.e!=null,iSet=r.i!=null,ready=eSet&&iSet;
 const e=eSet?Math.round(st.income*r.e/100):0,i=iSet?Math.round(st.income*r.i/100):0;
 return{fx,rq,e,i,eSet,iSet,ready,safe:ready?st.income-fx-rq-e-i:null};
}
/* Balances are derived from the records, so they can never drift out of sync. */
function money(){
 const p=plan(),k=mk(),cy=thisCycle();
 const prior=sum(st.cycles.filter(c=>c.k<k),c=>c.s)-sum(st.spends.filter(x=>x.k<k),x=>x.a);
 const spentM=sum(st.spends.filter(x=>x.k===k),x=>x.a);
 const base=cy?cy.s:(p.ready?p.safe:null),pool=base==null?null:prior+base;
 return{p,cy,spentM,pool,safeNow:pool==null?null:pool-spentM,
  emerg:st.savings+sum(st.cycles,c=>c.e),invest:sum(st.cycles,c=>c.i)};
}

/* ===== Financial Health Score (0 to 1000) =====
   Calculated only from the user's own entries. Checks without data are left out and the rest are scaled to 1000.
   Benchmarks (6 months of costs, 20% saved) are common rules of thumb, shown as such, never applied as allocations. */
function healthScore(){
 if(!st||!st.done||!(st.income>0))return null;
 const m=money(),p=m.p;if(!p.ready)return null;
 const L=isL(),T=isT(),inc=st.income,ins=(st.pf||{}).ins,j=st.learn.jars;
 if(L){const S=SL(),xp=st.learn.xp,lv=Math.floor(xp/100),top=S.levels.length,mx=top*100,nm=S.levels[Math.min(lv,top-1)];
  const ways=[['Fill your jars each month','+20 XP',!!m.cy],['Log what you spend, once a day','+5 XP',st.learn.logged===new Date().toDateString()],['Play Want or Need','+10 XP per right answer',false],['Finish your Quest setup','+50 XP',!!st.learn.setupXp]];
  return{L:true,total:Math.round(Math.min(1,xp/mx)*1000),disp:'Lv '+Math.min(lv+1,top),band:nm,xp,lv:lv+1,top,toNext:lv>=top?0:100-xp%100,nextName:S.levels[Math.min(lv+1,top-1)],ways,col:'var(--em)',C:[],best:null}}
 const C=[],add=(id,n,ic,max,f,why,tip)=>{if(f!=null)C.push({id,n,ic,max,f:Math.max(0,Math.min(1,f)),why,tip})};
 /* cushion */
 const useFx=!L&&p.fx>0,basis=useFx?p.fx:inc,tm=useFx?(st.rules.em>0?st.rules.em:6):3,mo=m.emerg/basis,gap=Math.max(0,tm*basis-m.emerg);
 add('cush',L?'Save jar':T?'Safety money':'Emergency cushion',L?'🫙':'🛟',250,mo/tm,
  `You have ${R(m.emerg)} saved. That covers about ${mo.toFixed(1)} month${mo.toFixed(1)==='1.0'?'':'s'} of ${useFx?'your fixed costs':'your income'}. The goal here is ${tm} month${tm>1?'s':''}${useFx&&!(st.rules.em>0)?' (a common rule of thumb)':st.rules.em>0?' (your own target)':''}.`,
  gap<=0?'You have reached this goal. Keep it safe and separate from spending money.':`About ${R(gap)} more reaches ${tm} months.${p.e>0?` Your plan puts away ${R(p.e)} a month, so that is about ${Math.ceil(gap/p.e)} month${Math.ceil(gap/p.e)>1?'s':''}.`:' Set a saving % in Plan to start.'}`);
 /* debt */
 if(!L&&!T){const d=st.debt||0,ratio=d/(inc*12);
  add('debt','Debt load','💳',150,1-Math.min(1,ratio/0.5),d>0?`You owe ${R(d)}, which is about ${Math.round(ratio*100)}% of a year's income. Less debt means more freedom each month.`:'You listed no debts. That keeps this part at full marks.',
   d>0?'Pay down the most expensive debt first (usually credit cards or small loans). Every rupee of interest you avoid is guaranteed.':'Keep it that way. Borrow only for things you can clearly afford to repay.')}
 /* saving rate */
 const rate=L?(j.v+j.d)*10:(+st.rules.e||0)+(+st.rules.i||0),tr=L?30:T?10:20;
 add('save',L?'Saving habit':'Saving rate','🌱',200,rate/tr,
  `Your plan sets aside ${rate}% of your ${L?'pocket money':'income'}${L?' in the Save and Dream jars':''}. A common rule of thumb is about ${tr}%.`,
  rate>=tr?'You are at or above the benchmark. Keep it steady rather than chasing a higher number.':`Moving up by ${Math.min(5,tr-rate)} point${Math.min(5,tr-rate)>1?'s':''} would help. Try it only if your safe-to-spend still covers your needs.`);
 /* budget */
 if(m.cy&&m.pool>0){const over=m.safeNow<0;
  add('bud',L?'Spend jar':'Staying in budget','🧾',150,over?1+2*m.safeNow/m.pool:1,
   over?`You have spent ${R(m.spentM)} against ${R(m.pool)} for ${mname()}. That is ${R(-m.safeNow)} over.`:`You have spent ${R(m.spentM)} of ${R(m.pool)} so far. ${R(m.safeNow)} is left.`,
   over?'Pause wants for the rest of the month, or move a goal date so next month is lighter.':'You are inside your safe-to-spend. Logging every spend keeps this accurate.')}
 /* goals */
 if(st.goals.length){const prog=sum(st.goals,g=>g.t>0?Math.min(1,g.s/g.t):0)/st.goals.length,fit=p.safe>=0?1:0.2;
  add('goal',L?'Dream':'Goals','🎯',100,0.6*fit+0.4*prog,
   `${st.goals.length} goal${st.goals.length>1?'s':''} need${st.goals.length>1?'':'s'} ${R(p.rq)} a month. ${p.safe>=0?'That fits inside your plan.':'That does not fit your plan yet.'} Average progress is ${Math.round(prog*100)}%.`,
   p.safe>=0?'Contribute each month and progress will follow.':'Lower a percentage or move a goal date until your plan fits.')}
 /* cover */
 if(!L&&!T&&(ins==='Yes'||ins==='No'))add('cov','Health cover','🏥',100,ins==='Yes'?1:0,
  ins==='Yes'?'You said you have health insurance.':'You said you do not have health insurance. One hospital bill can wipe out savings.',
  ins==='Yes'?'Check the cover amount still fits your city and family size.':'Look at cover options with a licensed adviser or insurer. Compare, then decide.');
 /* habit */
 const recent=st.spends.some(x=>Date.now()-new Date(x.t)<14*864e5);
 add('hab','Money habit','🔥',50,(m.cy?0.6:0)+(recent?0.4:0),
  `${m.cy?'You have allocated '+mname()+'.':'You have not allocated '+mname()+' yet.'} ${recent?'You logged a spend in the last two weeks.':'No spends logged in the last two weeks.'}`,
  !m.cy?'Allocate this month so your plan starts working.':!recent?'Log your next spend. It takes seconds.':'Nice routine. Keep going.');
 const mx=sum(C,c=>c.max),total=Math.round(sum(C,c=>c.f*c.max)/mx*1000);
 C.forEach(c=>{c.pts=Math.round(c.f*c.max/mx*1000);c.cap=Math.round(c.max/mx*1000);c.lost=c.cap-c.pts});
 const bands=L?[[800,'Money Hero'],[650,'Super Saver'],[500,'Rising Star'],[350,'Getting Going'],[0,'Just Starting']]:[[800,'Excellent'],[650,'Good'],[500,'Fair'],[350,'Needs work'],[0,'Just starting']];
 return{total,band:bands.find(b=>total>=b[0])[1],col:total>=650?'var(--em)':total>=400?'var(--am)':L||T?'var(--am)':'var(--rd)',C,best:C.slice().sort((a,b)=>b.lost-a.lost)[0]};
}
function gauge(s,big){return`<svg class="gg${big?' big':''}" viewBox="0 0 200 112" role="img" aria-label="${s.L?'Level '+s.lv+', '+s.band+', '+s.xp+' XP':'Score '+s.total+' out of 1000, '+s.band}"><path d="M10 102A90 90 0 0 1 190 102" pathLength="100" fill="none" stroke="#1e293b" stroke-width="14" stroke-linecap="round"/><path d="M10 102A90 90 0 0 1 190 102" pathLength="100" fill="none" stroke="${s.col}" stroke-width="14" stroke-linecap="round" stroke-dasharray="${s.total/10} 100"/><text x="100" y="86" text-anchor="middle" class="gn">${s.disp||s.total}</text><text x="100" y="106" text-anchor="middle" class="gl">${E(s.band)}</text></svg>`}
function scoreCard(){
 const s=healthScore(),t=isL()?'Money Power':isT()?'Money score':'Financial health score';
 if(!s)return`<button class="sc off" data-a="go" data-t="${plan().ready?'score':'plan'}"><div><b>${t}</b><small>${plan().ready?'Add your income to see it.':isL()?'Fill your jars to unlock it.':'Set your plan to unlock it.'}</small></div><span>›</span></button>`;
 return`<button class="sc" data-a="go" data-t="score">${gauge(s)}<div><b>${t}</b><small>${s.L?(s.toNext?s.toNext+' XP to '+E(s.nextName):'Top level reached! 🏆'):s.best&&s.best.lost>0?'Biggest boost: '+E(s.best.n):'All areas look strong'}</small></div><span>›</span></button>`;
}
function tabScore(){
 const s=healthScore(),L=isL(),t=L?'Money Power':isT()?'Money score':'Financial health score';
 if(!s)return`<h2>${t}</h2><p class="sub">Your numbers, scored out of 1000.</p><div class="em">${plan().ready?'Add your income in setup to see your score.':L?'Fill your jars first. Then your score appears here.':'Set your allocation rules in Plan first. Then your score appears here.'}</div><div class="hb" style="margin-top:16px"><button class="btn pri" data-a="go" data-t="${plan().ready?'more':'plan'}">${plan().ready?'Open setup':L?'Go to Jars':'Go to Plan'}</button></div>`;
 if(s.L)return`<h2>${t}</h2><p class="sub">Your level grows with XP. Every smart money move earns some.</p><div class="cd scd">${gauge(s,1)}<p class="s2">⭐ ${s.xp} XP · ${s.toNext?s.toNext+' more to reach '+E(s.nextName):'You have reached the top level!'}</p></div><div class="h3s">How to earn XP</div><div class="fl">${s.ways.map(w=>`<div><span>${w[2]?'✅':'⭐'} ${E(w[0])}<small>${E(w[1])}</small></span></div>`).join('')}</div><div class="h3s">Why levels?</div><div class="fp"><p>Good money habits are built by doing small things again and again. XP shows you are doing them. Levels are just for fun and are not a real score.</p></div><div class="hb"><button class="btn gho" data-a="go" data-t="home">Back to home</button></div>`;
 const sorted=s.C.slice().sort((a,b)=>b.lost-a.lost);
 return`<h2>${t}</h2><p class="sub">Your numbers, scored out of 1000.</p>
 <div class="cd scd">${gauge(s,1)}<p class="s2">${L?'This shows how well you are using your jars.':'Built from '+s.C.length+' checks on your own entries.'}</p></div>
 ${s.best&&s.best.lost>0?`<div class="bub" style="margin-top:14px"><span class="mo">💡</span><div><b>Biggest boost: ${E(s.best.n)}.</b> ${E(s.best.tip)}</div></div>`:''}
 <div class="h3s">What makes up your score</div><div class="cm">${sorted.map(c=>`<details><summary><span>${c.ic} ${E(c.n)}</span><span class="rk ${c.f>=.8?'lo':c.f<.4?'hi':''}">${c.pts}/${c.cap}</span><svg class="i"><use href="#pl"/></svg></summary><div class="pb" style="--c:${c.f>=.8?'var(--em)':c.f<.4?'var(--rd)':'var(--am)'};margin:0 0 10px"><i style="width:${Math.round(c.f*100)}%"></i></div><p><b>Why am I seeing this?</b> ${E(c.why)}</p><p><b>What can help:</b> ${E(c.tip)}</p></details>`).join('')}</div>
 <div class="h3s">How this is worked out</div>
 <div class="fp"><p>Each check looks at something you entered in SpendWise, such as savings, bills, goals and spends. Checks with no data yet are skipped, and the rest are scaled to 1000. Benchmarks like 6 months of costs or saving 20% are common rules of thumb, not rules for you.</p></div>
 <p class="fn">This is not a credit score and is not connected to CIBIL or any bank. It is general guidance, not regulated financial advice.</p>
 <div class="hb"><button class="btn gho" data-a="go" data-t="ask">Ask the advisor about my score</button></div>`;
}

/* ===== setup wizard ===== */
function field(l,f,v,ph,i,type='number'){return`<label>${l}</label><input data-f="${f}" ${i!=null?`data-i="${i}"`:''} type="${type}" ${type==='number'?'inputmode="numeric" min="0"':''} value="${v||''}" placeholder="${ph||''}">`}
function qField(q){
 const v=(st.pf||{})[q.k];
 if(q.t==='select')return`<label>${E(q.l)}</label><select data-f="pf.${q.k}"><option value="">Choose one</option>${q.o.map(o=>`<option${v===o?' selected':''}>${E(o)}</option>`).join('')}</select>`;
 if(q.t==='chips'){const a=Array.isArray(v)?v:[];return`<label>${E(q.l)}</label><div class="pre">${q.o.map(o=>`<button type="button" data-a="pfchip" data-k="${q.k}" data-v="${E(o)}" aria-pressed="${a.includes(o)}">${E(o)}</button>`).join('')}</div>`}
 const tx=q.t==='text'||q.t==='month';
 return field(q.l,'pf.'+q.k,tx?E(v||''):v,q.ph,null,q.t==='text'?'text':q.t==='month'?'month':'number');
}
function coinPool(){const left=jleft(),per=st.income/10;
 return`<div class="coins" role="img" aria-label="${left} coins left to place">${Array.from({length:10},(_,i)=>`<span class="coin${i<left?'':' o'}">${i<left?'₹':'·'}</span>`).join('')}</div><p class="fn" style="text-align:center;margin:0 0 14px">${left?`${left} coin${left>1?'s':''} left to place. Each coin is ${R(per)}.`:`All coins placed 🎉 Each coin is ${R(per)}.`}</p>`}
function jarCard(k){
 const j=st.learn.jars,J=SL().jars[k];
 return`<div class="jc" style="--c:${J.c}"><div class="jt"><span class="ji">${J.ic}</span><div><b>${E(J.n)}</b><small>${R(j[k]*st.income/10)} a month</small></div><div class="ctl"><button type="button" data-a="coin" data-k="${k}" data-d="-1" aria-label="Take a coin out of ${E(J.n)}">−</button><b>${j[k]}</b><button type="button" data-a="coin" data-k="${k}" data-d="1" aria-label="Put a coin in ${E(J.n)}">+</button></div></div><div class="fill" aria-hidden="true">${Array.from({length:10},(_,i)=>`<i class="${i<j[k]?'on':''}"></i>`).join('')}</div><p>${E(J.why)}</p></div>`;
}
function dreamNote(){const g=st.goals[0],n=dreamMonths();
 if(!g||!(g.t>0))return'';
 const body=n===0?'🎉 You already have enough for it!':n==null?'Put at least one coin in the Dream jar to see when you get it.':`At this speed you get your <b>${E(g.n||'dream')}</b> in <b>${n} month${n>1?'s':''}</b>.${n>36?' That is a long wait. Try more coins in the Dream jar, or a smaller dream.':''}`;
 return`<div class="bub"><span class="mo">⭐</span><div>${body}</div></div>`}
function wizard(m=''){
 const S=st.step,K=STEPS()[S],P=SP(),pp=pd(),L=isL();
 const head=L&&S>0?`<div class="qh"><span>Quest ${S} of 3</span><div class="xp"><i style="width:${S/3*100}%"></i></div><span>⭐ ${st.learn.xp} XP</span></div>`
  :'<div class="dots">'+[0,1,2,3].map(i=>`<i class="${i<=S?'on':''}"></i>`).join('')+'</div>';
 let b='';
 if(K==='profile')b=`<h2>Choose your profile.</h2><p class="sub">Pick the one that fits you best. SpendWise changes its questions, goals and tips to match. You can change it later in More.</p>
 <div class="pk" role="group" aria-label="Profile">${(P.order||[]).map(n=>{const x=P[n];return`<button type="button" data-a="pick" data-p="${E(n)}" aria-pressed="${prof()===n}"><span class="ck">✓</span><span class="pa">${x.ic}</span><b>${E(n)}</b><small>${E(x.tag)}</small></button>`}).join('')}</div>`;
 if(K==='basics')b=`<h2>Your money, in numbers.</h2><p class="sub">This is the only time we ask. After this, SpendWise does the work.</p>
 ${field(incLabel(),'income',st.income,'e.g. 25000')}${field((pp.lbl&&pp.lbl.savings)||'Existing savings (₹)','savings',st.savings,'e.g. 10000')}${field((pp.lbl&&pp.lbl.debt)||'Debts you owe (₹, loans and credit cards)','debt',st.debt,'0 if none')}${(pp.hide||[]).includes('dependents')?'':field('People who depend on you','dependents',st.dependents,'0')}
 ${pp.compact?'':'<p class="fn" style="margin:-4px 0 0">Monthly EMIs and bills go in the next step.</p>'}
 ${(pp.q||[]).length?`<div class="h3s">${pp.compact?'About you':'About you · '+E(prof())}</div>${pp.q.map(qField).join('')}`:''}`;
 if(K==='fixed')b=`<h2>What goes out every month?</h2><p class="sub">Regular commitments that are not up for debate: rent, EMIs, fees.</p>
 <div class="pre">${fxP().map(x=>`<button data-a="af" data-p="${E(x)}">+ ${E(x)}</button>`).join('')}<button data-a="af" data-p="">+ Other</button></div>
 ${st.fixed.length?st.fixed.map((x,i)=>`<div class="rw"><button class="dl" data-a="del" data-l="fixed" data-i="${i}" aria-label="Remove">×</button><div class="gr"><div>${field('Name','fixed.n',E(x.n),'',i,'text')}</div><div>${field('Amount per month (₹)','fixed.a',x.a,'',i)}</div></div></div>`).join(''):'<div class="em">Nothing added yet. You can skip this if you have no fixed costs.</div>'}`;
 if(K==='goals')b=`<h2>What are you saving for?</h2><p class="sub">Optional. Give us the goal and the deadline. We work out the monthly amount.</p>
 <div class="pre">${gpP().map(x=>`<button data-a="ag" data-p="${E(x)}">+ ${E(x)}</button>`).join('')}<button data-a="ag" data-p="">+ Other</button></div>
 ${st.goals.length?st.goals.map((x,i)=>`<div class="rw"><button class="dl" data-a="del" data-l="goals" data-i="${i}" aria-label="Remove">×</button>${field('Goal','goals.n',E(x.n),'',i,'text')}<div class="gr"><div>${field('Target (₹)','goals.t',x.t,'',i)}</div><div>${field('Saved so far (₹)','goals.s',x.s,'',i)}</div><div>${field('Needed by','goals.d',x.d,'',i,'month')}</div></div></div>`).join(''):'<div class="em">No goals yet. Add one above, or skip and add later.</div>'}`;
 if(K==='money')b=`<div class="bub"><span class="mo">🧑‍🚀</span><div><b>Welcome to Money Quest!</b> We will make a plan for your pocket money, so you always know what is safe to spend, what is for surprises and what builds your dream. Three quick quests. Let us go!</div></div>
 <h2>Quest 1: Your pocket money</h2><p class="sub">How much do you get in a month? Ask a parent if you are not sure. A guess is fine.</p>
 ${field(incLabel()+' (₹)','income',st.income,'e.g. 500')}${field('Money you have saved so far (₹)','savings',st.savings,'0 if nothing yet')}`;
 if(K==='dream'){if(!st.goals[0])st.goals[0]={n:'',t:0,s:0,d:''};const g=st.goals[0];
  b=`<div class="bub"><span class="mo">🧑‍🚀</span><div><b>Quest 2: Pick your dream.</b> Every hero saves for something they really want. A dream turns “I want it” into a plan.</div></div>
 <div class="pre">${SL().dreams.map(x=>`<button type="button" data-a="dr" data-p="${E(x)}">${E(x)}</button>`).join('')}</div>
 ${field('My dream is','goals.n',E(g.n||''),'e.g. Bicycle',0,'text')}${field('It costs (₹)','goals.t',g.t,'Ask a parent or check a shop',0)}${field('I have already saved for it (₹)','goals.s',g.s,'0 if nothing yet',0)}`}
 if(K==='jars')b=`<div class="bub"><span class="mo">🧑‍🚀</span><div><b>Quest 3: Fill your jars.</b> You have 10 coins. Each coin is one tenth of your pocket money (${R(st.income/10)}). Put every coin in a jar with the + buttons. There is no wrong answer, but every jar needs at least one coin.</div></div>
 ${coinPool()}${['s','v','d'].map(jarCard).join('')}${dreamNote()}`;
 if(pp.copy&&pp.copy[K])b=b.replace(/<h2>[\s\S]*?<\/h2><p class="sub">[\s\S]*?<\/p>/,()=>`<h2>${pp.copy[K][0]}</h2><p class="sub">${pp.copy[K][1]}</p>`);
 const last=S===3;
 root.innerHTML=`<div class="w">${head}${b}<div class="wm" role="alert">${m}</div><div class="wn">${S?'<button class="btn gho" data-a="back">Back</button>':''}<button class="btn pri" data-a="next">${last?(L?'Start my quest 🚀':'Finish setup'):'Continue'}</button></div></div>`;
 root.classList.toggle('big',!!pp.big);
}

/* ===== shared pieces ===== */
function prevHTML(){
 const p=plan(),inc=st.income||1;
 const seg=[['Emergency fund',p.e,CL.e,p.eSet],['Bills and goals',p.fx+p.rq,CL.f,true],['Investments',p.i,CL.i,p.iSet],['Safe to spend',Math.max(0,p.safe||0),CL.s,p.ready]];
 return`<div class="sb" aria-hidden="true">${seg.map(s=>`<i style="width:${s[3]?Math.min(100,s[1]/inc*100):0}%;background:${s[2]}"></i>`).join('')}</div>
 <div class="lg2">${seg.map(s=>`<div><span><em style="background:${s[2]}"></em>${s[0]}</span>${s[3]?`<b>${R(s[1])}</b>`:'<span class="un">Not set</span>'}</div>`).join('')}</div>
 ${p.ready&&p.safe<0?`<p class="fn" style="color:var(--rd)">This split is ${R(-p.safe)} more than your income. Lower a percentage or move a goal deadline.</p>`:''}`;
}
function bucket(c,title,amt,pct,l1){
 return`<div class="bc" style="--c:${c}"><small>${title}</small><b>${amt==null?'—':R(amt)}</b>${pct==null?'':`<div class="pb" style="--c:${c}"><i style="width:${Math.max(0,Math.min(100,pct))}%"></i></div>`}<p>${l1}</p></div>`;
}
function buckets(){
 const m=money(),p=m.p,r=st.rules;
 const tgt=r.em>0&&p.fx>0?r.em*p.fx:null,gs=sum(st.goals,g=>g.s),gt=sum(st.goals,g=>g.t);
 const eTxt=tgt?`${(m.emerg/p.fx).toFixed(1)} of ${r.em} months of fixed costs`:r.em>0?'Add fixed costs to work out your target':'Set a target in Plan';
 return'<div class="bk">'+
  bucket(CL.e,'Emergency reserve',m.emerg,tgt?m.emerg/tgt*100:null,eTxt)+
  bucket(CL.f,'Future expenses',gs,gt?gs/gt*100:null,p.fx||p.rq?`${R(p.fx)} bills + ${R(p.rq)} goals a month`:'Add bills or goals in More')+
  bucket(CL.i,'Auto-investments',m.invest,null,p.iSet?`${R(p.i)} a month`:'Set a percentage in Plan')+
  bucket(CL.s,'Safe to spend',m.safeNow,m.pool>0&&m.safeNow!=null?m.safeNow/m.pool*100:null,m.cy?`${R(m.spentM)} spent this month`:p.ready?'Planned. Allocate to unlock it.':'Set your rules first')+'</div>';
}
function allocCard(){
 const m=money(),p=m.p,cy=m.cy;
 if(isT()){
  if(cy)return`<div class="al ok"><b>✅ Done for ${E(cy.m)}</b><span>${R(cy.e)} saved · ${R(cy.b+cy.g)} bills + goals · ${R(cy.s)} to spend</span></div>`;
  if(!p.ready)return`<div class="al"><b>Pick your save %</b><span>Type it below. Then tap Money in.</span></div>`;
  if(p.safe<0)return`<div class="al"><b>Doesn't fit yet</b><span>${R(-p.safe)} too much. Save less or move a goal date.</span></div>`;
  return`<div class="al"><b>Money landed?</b><span>Split ${R(st.income)} for ${mname()}.</span><button class="btn pri" data-a="alloc">Money in 💸</button></div>`;
 }
 if(isL()){
  if(cy)return`<div class="al ok"><b>✅ Jars filled for ${E(cy.m)}</b><span>${R(cy.s)} Spend · ${R(cy.e)} Save · ${R(cy.g)} Dream</span></div>`;
  if(p.safe<0)return`<div class="al"><b>The jars do not fit yet</b><span>Your Save and Dream jars take more than your pocket money. Check your numbers.</span></div>`;
  return`<div class="al"><b>Pocket money arrived?</b><span>Fill your three jars for ${mname()} and see what is safe to spend.</span><button class="btn pri" data-a="alloc">Fill my jars</button></div>`;
 }
 if(cy)return`<div class="al ok"><b>✅ ${E(cy.m)} is allocated</b><span>${R(cy.e)} emergency · ${R(cy.b+cy.g)} bills and goals · ${R(cy.i)} investments · ${R(cy.s)} to spend</span></div>`;
 if(!p.ready)return`<div class="al"><b>Set your rules first</b><span>Enter the emergency and investment percentages below, or calculate them with AI. Nothing is pre-filled.</span></div>`;
 if(p.safe<0)return`<div class="al"><b>This month does not fit yet</b><span>The split is ${R(-p.safe)} over your income. Lower a percentage below or move a goal deadline.</span></div>`;
 return`<div class="al"><b>Income arrived?</b><span>Split ${R(st.income)} into your buckets for ${mname()}.</span><button class="btn pri" data-a="alloc">Allocate now</button></div>`;
}
function events(n){
 return[...st.cycles.map(c=>({t:c.t,x:'Allocated '+c.m,s:'Income split',v:c.income})),...st.spends.map(s=>({t:s.t,x:s.n||s.c||'Spend',s:s.c||'Uncategorised',v:-s.a}))].sort((a,b)=>b.t-a.t).slice(0,n);
}
function rows(ev){return'<div class="fl">'+ev.map(e=>`<div><span>${E(e.x)}<small>${dlabel(e.t)} · ${E(e.s)}</small></span><b class="${e.v>0?'pos':'neg2'}">${e.v>0?'+':''}${R(e.v)}</b></div>`).join('')+'</div>'}

/* ===== tabs ===== */
function tabHome(){return isL()?tabHomeL():isT()?tabHomeT():tabHomeG()}
function tabHomeG(){
 const m=money(),p=m.p,cy=m.cy,first=(SW.user.name||'there').split(' ')[0],neg=m.safeNow!=null&&m.safeNow<0;
 const left=m.pool>0&&m.safeNow!=null?Math.max(0,m.safeNow/m.pool*100):0;
 const cta=!p.ready?'<button class="btn pri" data-a="go" data-t="plan">Set up your plan</button>':!cy?'<button class="btn pri" data-a="alloc">Allocate now</button>':'<button class="btn pri" data-a="go" data-t="spends" data-f="1">Add a spend</button>';
 const ev=events(3);
 return`<h2>Hi ${E(first)} 👋</h2><p class="sub">${mname()}<span class="pbadge">${pd().ic||''} ${E(prof())}</span></p>
 <div class="hc ${neg?'neg':''}"><small>Safe to spend ${cy?'now':'(planned)'}</small><b>${m.safeNow==null?'₹ —':R(m.safeNow)}</b>
 ${m.pool>0&&m.safeNow!=null?`<div class="pb" style="--c:${neg?'var(--rd)':left<25?'var(--am)':'var(--em)'}"><i style="width:${left}%"></i></div>`:''}
 <p>${cy?`${R(m.spentM)} spent of ${R(m.pool)} this month`:p.ready?'Planned for '+mname()+'. Allocate when your income arrives.':'Enter your allocation rules to see how much you can spend.'}</p>
 <div class="hb">${cta}</div></div>
 ${scoreCard()}
 <div class="tl"><button data-a="go" data-t="spends" data-f="1"><span class="ti">${I.plus}</span>Add spend</button><button data-a="go" data-t="plan"><span class="ti">${I.plan}</span>Allocate</button><button data-a="go" data-t="plan"><span class="ti">${I.spark}</span>AI plan</button><button data-a="go" data-t="goals"><span class="ti">${I.goals}</span>Goals</button></div>
 <div class="tl" style="margin-top:10px;grid-template-columns:1fr"><button data-a="go" data-t="ask"><span class="ti">${I.ask}</span>Ask the advisor how to plan ahead</button></div>${invTile()}
 <div class="h3s">This month</div>
 <div class="st3"><div><small>Income</small><b>${R(st.income)}</b></div><div><small>Committed</small><b>${R(p.fx+p.rq)}</b></div><div><small>Spent</small><b>${R(m.spentM)}</b></div></div>
 <div class="h3s">Recent</div>${ev.length?rows(ev)+'<div style="margin-top:12px"><button class="btn gho sm" data-a="go" data-t="spends">See all spends</button></div>':'<div class="em">Nothing yet. Add your first spend and it will show up here.</div>'}
 ${tipsHTML()}`;
}

function tipsHTML(){const t=pd().tips;if(!t||!t.length)return'';if(pd().compact)return`<div class="h3s">Tips</div><div class="tp">`+t.map(x=>`<details><summary>${x.e||''} ${E(x.t)}<svg class="i"><use href="#pl"/></svg></summary><p>${E(x.b)}</p></details>`).join('')+'</div>';return`<div class="h3s">For you · ${E(prof())}</div>`+t.map(x=>`<div class="fp"><b>${E(x.t)}</b><p>${E(x.b)}</p></div>`).join('')+'<p class="fn">General guidance, not regulated financial advice.</p>'}
/* ----- Learner (Money Quest) ----- */
function xpBar(){const L=st.learn,lv=Math.floor(L.xp/100),S=SL();return`<div class="qh" style="margin-bottom:18px"><span>⭐ Level ${lv+1} · ${E(S.levels[Math.min(lv,S.levels.length-1)])}</span><div class="xp"><i style="width:${L.xp%100}%"></i></div><span>${L.xp%100}/100</span></div>`}
function jar3(){const m=money(),g=st.goals[0],J=SL().jars;
 const cell=(k,val,sub)=>`<div style="--c:${J[k].c}"><span class="e">${J[k].ic}</span><small>${E(J[k].n)}</small><b>${val}</b><small>${sub}</small></div>`;
 return'<div class="jar3">'+cell('s',m.safeNow==null?'—':R(m.safeNow),'to spend')+cell('v',R(m.emerg),'saved')+cell('d',R(g?g.s:0),g?'of '+R(g.t):'')+'</div>'}
function dreamCard(){const g=st.goals[0];if(!g)return'';
 const pct=Math.min(100,g.t?g.s/g.t*100:0),n=Math.max(1,months(g.d)-(thisCycle()?1:0)),nd=need(g);
 return`<div class="gc"><h4>⭐ ${E(g.n||'My dream')}<span class="ch">${g.s>=g.t?'Got it! 🎉':n+' month'+(n>1?'s':'')+' to go'}</span></h4><div class="pb"><i style="width:${pct}%"></i></div><p><span>${R(g.s)} of ${R(g.t)}</span><span>${nd?R(nd)+' a month':''}</span></p></div>`}
function gameHTML(){
 const it=SL().items;
 if(!game)return`<div class="gm"><h4>🎮 Want or Need?</h4><p class="s2" style="margin-top:6px">Five quick rounds. Is it something you must have, or something nice to have? Every right answer earns 10 XP.</p><button class="btn pri" style="width:100%;margin-top:14px" data-a="gstart">Play now</button></div>`;
 if(game.i>=game.q.length)return`<div class="gm"><h4>${game.score>=4?'🏆 Superstar!':game.score>=2?'👍 Nice one!':'💪 Keep practising!'}</h4><p class="s2" style="margin-top:6px">You got ${game.score} of ${game.q.length} right and earned ${game.score*10} XP. Remember: needs come first, and wants come from your Spend jar.</p><button class="btn pri" style="width:100%;margin-top:14px" data-a="gstart">Play again</button></div>`;
 const c=it[game.q[game.i]],ok=game.a===c.k;
 const fb=game.a?`<div class="fb ${ok?'y':'n'}"><b>${ok?'Right! +10 XP':'Not quite.'}</b> It is a ${c.k}. ${E(c.w)}</div><button class="btn pri" style="width:100%;margin-top:12px" data-a="gnext">${game.i+1>=game.q.length?'See my score':'Next'}</button>`:'';
 return`<div class="gm"><h4>🎮 Want or Need? <span class="ch">Round ${game.i+1} of ${game.q.length}</span></h4><div class="it">${E(c.t)}</div><div class="two"><button class="btn gho" data-a="gans" data-v="need"${game.a?' disabled':''}>✅ Need</button><button class="btn gho" data-a="gans" data-v="want"${game.a?' disabled':''}>🎈 Want</button></div>${fb}</div>`;
}
function whysHTML(){return SL().whys.map(w=>`<details><summary>${E(w.q)}<svg class="i"><use href="#pl"/></svg></summary><p>${E(w.a)}</p></details>`).join('')}
function tabHomeL(){
 const m=money(),cy=m.cy,first=(SW.user.name||'friend').split(' ')[0],sp=m.safeNow,J=SL().jars;
 const left=m.pool>0&&sp!=null?Math.max(0,sp/m.pool*100):0;
 const cta=!cy?'<button class="btn pri" data-a="alloc">Fill my jars</button>':'<button class="btn pri" data-a="go" data-t="spends" data-f="1">I spent something</button>';
 return`<h2>Hey ${E(first)}! 🎒</h2><p class="sub">${mname()}</p>${xpBar()}
 <div class="hc ${sp!=null&&sp<0?'neg':''}"><small>${J.s.ic} Spend jar ${cy?'right now':'(planned)'}</small><b>${sp==null?'₹ —':R(sp)}</b>
 ${sp!=null&&m.pool>0?`<div class="pb" style="--c:${left<25?'var(--am)':'var(--em)'}"><i style="width:${left}%"></i></div>`:''}
 <p>${cy?`${R(m.spentM)} spent so far. When this jar is empty, you wait until next month!`:'Your pocket money is not split yet. Fill your jars to start.'}</p><div class="hb">${cta}</div></div>
 ${scoreCard()}
 <div class="h3s">Your jars</div>${jar3()}
 <div class="h3s">Your dream</div>${dreamCard()||'<div class="em">No dream yet.</div>'}
 <div class="h3s">Today’s game</div><div id="gm">${gameHTML()}</div>
 <div class="h3s">Why are we doing this?</div>${whysHTML()}`;
}
function tabJars(){
 return`<h2>Jars</h2><p class="sub">Your pocket money, split into three jars.</p>
 <div id="alc">${allocCard()}</div>
 <div class="h3s">Your coins</div>${coinPool()}${['s','v','d'].map(jarCard).join('')}
 ${thisCycle()?'<p class="fn">This month is already filled, so changes start next month.</p>':'<p class="fn">Want a different split? Take a coin out of one jar, then drop it into another.</p>'}
 ${dreamNote()}
 <div class="h3s">Where your jars stand</div>${jar3()}
 <div class="h3s">Why jars?</div>${whysHTML()}`;
}
function tabDream(){
 const g=st.goals[0],j=st.learn.jars;
 if(!g)return`<h2>Dream</h2><p class="sub">Pick something to save for.</p><button class="btn pri" data-a="edit" data-s="dream">Pick my dream</button>`;
 const n=dreamMonths(),n2=j.s>1?dreamMonths(j.d+1):null;
 return`<h2>Dream</h2><p class="sub">The big thing you are saving for.</p>${dreamCard()}
 ${n&&n2!=null&&n2<n?`<div class="bub" style="margin-top:14px"><span class="mo">💡</span><div><b>Speed-up trick.</b> Move one coin from the Spend jar to the Dream jar and you get it about ${n-n2} month${n-n2>1?'s':''} sooner. You will have less to spend, so it is your choice!</div></div>`:''}
 <div class="hb" style="margin-top:16px"><button class="btn gho" data-a="go" data-t="plan">Change my jars</button><button class="btn gho" data-a="edit" data-s="dream">Change my dream</button></div>`;
}
const nwHTML=()=>`<label style="margin-top:2px">Was it a need or a want?</label><div class="cats" role="group" aria-label="Need or want">${[['n','✅ Need'],['w','🎈 Want']].map(x=>`<button type="button" class="chip" data-a="nw" data-v="${x[0]}" aria-pressed="${nw===x[0]}">${x[1]}</button>`).join('')}</div>`;
function nwSummary(){const k=mk(),a=sum(st.spends.filter(x=>x.k===k&&x.w==='n'),x=>x.a),w=sum(st.spends.filter(x=>x.k===k&&x.w==='w'),x=>x.a);
 return a||w?`<div class="bub" style="margin:-8px 0 16px"><span class="mo">⚖️</span><div>This month: <b>${R(a)}</b> on needs and <b>${R(w)}</b> on wants.</div></div>`:''}

/* ----- Teen: light, few words ----- */
function streak(){const days=new Set(st.spends.map(x=>new Date(x.t).toDateString()));let n=0;const d=new Date();if(!days.has(d.toDateString()))d.setDate(d.getDate()-1);while(days.has(d.toDateString())){n++;d.setDate(d.getDate()-1)}return n}
function prevT(){const p=plan(),inc=st.income||1;
 const seg=[['💰 Save',p.e,CL.e,p.eSet],['🎯 Bills + goals',p.fx+p.rq,CL.f,true],['🛍️ Spend',Math.max(0,p.safe||0),CL.s,p.ready]];
 return`<div class="sb" aria-hidden="true">${seg.map(x=>`<i style="width:${x[3]?Math.min(100,x[1]/inc*100):0}%;background:${x[2]}"></i>`).join('')}</div>
 <div class="lg2">${seg.map(x=>`<div><span><em style="background:${x[2]}"></em>${x[0]}</span>${x[3]?`<b>${R(x[1])}</b>`:'<span class="un">—</span>'}</div>`).join('')}</div>
 ${p.ready&&p.safe<0?`<p class="fn" style="color:var(--rd)">${R(-p.safe)} too much. Save less or move a goal date.</p>`:''}`}
function tabHomeT(){
 const m=money(),p=m.p,cy=m.cy,first=(SW.user.name||'you').split(' ')[0],neg=m.safeNow!=null&&m.safeNow<0,sk=streak();
 const left=m.pool>0&&m.safeNow!=null?Math.max(0,m.safeNow/m.pool*100):0,ev=events(3);
 const cta=!p.ready?'<button class="btn pri" data-a="go" data-t="plan">Set save %</button>':!cy?'<button class="btn pri" data-a="alloc">Money in 💸</button>':'<button class="btn pri" data-a="go" data-t="spends" data-f="1">Add spend</button>';
 return`<h2>Yo ${E(first)} 🎧</h2><p class="sub">${mname()}</p>
 <div class="stk">${sk?'🔥 '+sk+' day'+(sk>1?'s':'')+' streak':'🔥 Log a spend to start a streak'}</div>
 <div class="hc ${neg?'neg':''}"><small>Left to spend</small><b>${m.safeNow==null?'₹ —':R(m.safeNow)}</b>
 ${m.pool>0&&m.safeNow!=null?`<div class="pb" style="--c:${neg?'var(--rd)':left<25?'var(--am)':'var(--em)'}"><i style="width:${left}%"></i></div>`:''}
 <p>${cy?R(m.spentM)+' spent this month':p.ready?'Tap Money in when it lands.':'Pick how much to save.'}</p><div class="hb">${cta}</div></div>
 ${scoreCard()}
 <div class="tt3"><button data-a="go" data-t="spends" data-f="1"><span>➕</span>Spend</button><button data-a="go" data-t="plan"><span>💰</span>Save</button><button data-a="go" data-t="goals"><span>🎯</span>Goals</button></div>
 ${invTile()}
 <div class="h3s">Recent</div>${ev.length?rows(ev):'<div class="em">Nothing yet.</div>'}
 ${tipsHTML()}`;
}
function tabPlanT(){
 const r=st.rules,v=r.e==null?'':r.e;
 return`<h2>Plan</h2><p class="sub">Your money, split.</p>
 <div id="alc">${allocCard()}</div>
 <div class="h3s">Save</div>
 <div class="cd"><label for="r-e">Save how much? (% of your money)</label><input id="r-e" data-r="e" type="number" inputmode="decimal" min="0" max="50" step="0.5" placeholder="e.g. 10" value="${v}">
 <div id="pv">${prevT()}</div></div>`;
}

/* ----- Working professional: Invest and tax hub ----- */
const INV=()=>window.SW_INVEST||{horizons:[],options:[],itr:[]};
const invTile=()=>{const b=pd().bank||'';if(!b)return'';
 const label=b==='minor'?'Money guide: what you can do now':b==='schemes'?'Schemes and staying safe':b==='basic'?'Investing basics: the four pillars':b==='nri'?'Money in India: investing and transfers':'Invest and tax: SIP, FD, ITR';
 return`<div class="tl" style="margin-top:10px;grid-template-columns:1fr"><button data-a="go" data-t="invest"><span class="ti">${b==='schemes'?'🏛️':b==='minor'?'🎓':'📈'}</span>${label}</button></div>`};
const invLink=()=>`<div class="h3s">Go deeper</div><button class="btn gho" style="width:100%" data-a="go" data-t="invest">📈 Invest and tax: SIP, FD, mutual funds, ITR</button>`;
function sipRes(){
 const s=st.inv.sip,m=+s.m,y=+s.y;
 if(!(m>0&&y>0))return'<p class="fn">Enter a monthly amount and the number of years.</p>';
 if(s.r===''||s.r==null||!Number.isFinite(+s.r))return'<p class="fn">Enter a yearly return to test. Nobody can promise one.</p>';
 const r=+s.r,n=Math.round(y*12),f=x=>{const i=Math.max(0,x)/1200;return i>0?m*((Math.pow(1+i,n)-1)/i)*(1+i):m*n};
 return`<div class="fl"><div><span>You put in<small>${R(m)} for ${n} months</small></span><b>${R(m*n)}</b></div>
 <div><span>If returns are ${Math.max(0,r-3)}% a year</span><b>${R(f(r-3))}</b></div>
 <div><span>If returns are ${r}% a year</span><b class="pos">${R(f(r))}</b></div>
 <div><span>If returns are ${r+3}% a year</span><b>${R(f(r+3))}</b></div></div>
 <p class="fn">An illustration, not a forecast. Real returns change every year and can be negative. Inflation also reduces what the money buys.</p>`}
function fdRes(){
 const d=st.inv.fd,P=+d.p,y=+d.y;
 if(!(P>0&&y>0))return'<p class="fn">Enter the amount and the years.</p>';
 if(d.r===''||d.r==null||!Number.isFinite(+d.r))return'<p class="fn">Enter the interest rate your bank offers.</p>';
 const A=P*Math.pow(1+(+d.r)/400,4*y);
 return`<div class="fl"><div><span>You deposit</span><b>${R(P)}</b></div><div><span>Interest earned</span><b>${R(A-P)}</b></div><div><span>You get at the end</span><b class="pos">${R(A)}</b></div></div>
 <p class="fn">Worked out with interest added every quarter, as most banks do. Interest is taxed at your slab and the bank may deduct TDS above a yearly limit. Check your bank's exact terms.</p>`}
function readyHTML(){
 const m=money(),p=m.p,mo=p.fx>0?m.emerg/p.fx:null,ins=(st.pf||{}).ins,debt=st.debt||0;
 const row=(ok,t,d)=>`<div><span>${ok===true?'✅':ok===false?'⚠️':'➖'} ${E(t)}<small>${E(d)}</small></span></div>`;
 return`<p class="s2" style="margin-bottom:12px">Check the basics before you invest. This uses your own numbers.</p><div class="fl">`+
  row(mo==null?null:mo>=3,'Emergency cushion',mo==null?'Add your fixed costs to measure it.':`You have about ${mo.toFixed(1)} months of fixed costs saved. Many planners suggest 3 to 6 months first.`)+
  row(ins==='Yes'?true:ins==='No'?false:null,'Health cover',ins==='Yes'?'You said you have cover. Good.':ins==='No'?'One hospital bill can undo years of investing. Sort cover first.':'Not sure? Check, because it matters before you invest.')+
  row(debt>0?false:true,'Costly debt',debt>0?`You owe ${R(debt)}. Paying off costly debt, such as credit cards, often beats any investment return.`:'No debts listed.')+
  row(p.iSet?p.i>0:null,'A monthly amount to invest',p.iSet?(p.i>0?`Your plan sets aside ${R(p.i)} a month.`:'Your investing % is 0 right now.'):'Set an investing % in Plan.')+
  `</div><div style="margin-top:14px"><button class="btn gho sm" data-a="go" data-t="ask">Ask the advisor about this</button></div>`}
/* Education content from profiles.js (window.SW_BANK). `kind` comes from the profile's bank field. */
function bankHTML(kind){
 const B=window.SW_BANK||{};
 const card=(x,i)=>`<details${i===0?' open':''}><summary><span>${E(x.t||x.n)}${x.ic?' '+x.ic:''}</span><svg class="i"><use href="#pl"/></svg></summary><p>${E(x.b||x.what)}</p>${x.why?`<p><b>Why it matters:</b> ${E(x.why)}</p>`:''}</details>`;
 const list=a=>a&&a.length?`<div class="cm">${a.map(card).join('')}</div>`:'';
 const trans=`<div class="fl" style="margin-bottom:14px">${B.transfers.map(x=>`<div><span>${E(x.k)}<small>${E(x.full)} · ${E(x.settle)}</small></span><b style="font-size:13px;font-weight:600;color:var(--mu);text-align:right;max-width:45%">${E(x.use)}</b></div>`).join('')}</div>`;
 if(kind==='minor')return`<p class="s2" style="margin-bottom:12px">What you can do yourself, and what needs a parent or guardian. SpendWise does not open anything for you. This is so you know what is real.</p>${list(B.minor)}<div class="h3s">Staying safe</div>${list(B.security)}`;
 if(kind==='schemes')return`<p class="s2" style="margin-bottom:12px">Support your household may be able to claim. Rules and amounts differ by state and change over time, so confirm at a Common Service Centre, your panchayat, or the official government portal. Never pay anyone to receive a benefit.</p>${list(B.schemes)}<div class="h3s">Keeping your money safe</div>${list(B.security)}`;
 if(kind==='basic')return`<p class="s2" style="margin-bottom:12px">The ideas behind every investing decision. Read these once and the rest makes more sense.</p>${list(B.pillars)}<div class="h3s">Staying safe</div>${list(B.security)}`;
 if(kind==='simple')return`<p class="s2" style="margin-bottom:12px">Plain explanations. One idea at a time.</p>${list(B.pillars)}<div class="h3s">Your bank account</div>${list(B.netbanking)}<div class="h3s">Staying safe</div>${list(B.security)}`;
 if(kind==='nri')return`<p class="s2" style="margin-bottom:12px">How money moves in India, and the ideas behind investing here.</p>${list(B.pillars)}<div class="h3s">Moving money in India</div>${trans}<div class="h3s">Your bank account</div>${list(B.netbanking)}<div class="h3s">Staying safe</div>${list(B.security)}`;
 return`<p class="s2" style="margin-bottom:12px">The ideas behind investing, how money moves in India, and how to stay safe.</p>${list(B.pillars)}<div class="h3s">Moving money</div>${trans}<div class="h3s">Your bank account</div>${list(B.netbanking)}<div class="h3s">Staying safe</div>${list(B.security)}`;
}
function tabInvest(){
 const V=INV(),bk=pd().bank||'',p=plan(),iv=st.inv;
 const secs=[['ready','Ready?'],['sip','SIP'],['fd','FD'],['when','What suits'],['compare','Compare']];
 if(bk==='full'||bk==='simple')secs.push(['itr','ITR']);
 if(bk)secs.push(['banking','Money guide']);
 let b='';
 if(invSec==='ready')b=readyHTML();
 if(invSec==='sip')b=`<div class="cd"><label for="c-sm">Monthly SIP (₹)</label><input id="c-sm" data-c="sip.m" type="number" inputmode="numeric" min="0" value="${iv.sip.m??''}" placeholder="e.g. 5000">
  <label for="c-sy">For how many years</label><input id="c-sy" data-c="sip.y" type="number" inputmode="decimal" min="0" max="50" value="${iv.sip.y??''}" placeholder="e.g. 10">
  <label for="c-sr">Yearly return to test (%)</label><input id="c-sr" data-c="sip.r" type="number" inputmode="decimal" min="0" max="40" step="0.5" value="${iv.sip.r??''}" placeholder="Try a low and a high number">
  ${p.iSet&&p.i>0?`<button class="btn gho sm" data-a="sipuse">Use my plan: ${R(p.i)} a month</button>`:''}
  <div id="ires" style="margin-top:16px">${sipRes()}</div></div>
  <div class="fp" style="margin-top:12px"><b>What is a SIP?</b><p>A SIP is a way to invest a fixed amount every month, usually in a mutual fund. It builds a habit. It does not guarantee a profit.</p></div>`;
 if(invSec==='fd')b=`<div class="cd"><label for="c-fp">Amount to deposit (₹)</label><input id="c-fp" data-c="fd.p" type="number" inputmode="numeric" min="0" value="${iv.fd.p??''}" placeholder="e.g. 100000">
  <label for="c-fy">For how many years</label><input id="c-fy" data-c="fd.y" type="number" inputmode="decimal" min="0" max="30" value="${iv.fd.y??''}" placeholder="e.g. 3">
  <label for="c-fr">Interest rate offered (% a year)</label><input id="c-fr" data-c="fd.r" type="number" inputmode="decimal" min="0" max="20" step="0.05" value="${iv.fd.r??''}" placeholder="From your bank">
  <div id="ires" style="margin-top:16px">${fdRes()}</div></div>`;
 if(invSec==='when')b=`<p class="s2" style="margin-bottom:12px">When do you need the money? The answer changes what suits.</p>
  <div class="cats" role="group" aria-label="When you need the money">${V.horizons.map(h=>`<button type="button" class="chip" data-a="hz" data-k="${E(h.k)}" aria-pressed="${invH===h.k}">${E(h.k)}</button>`).join('')}</div>
  ${(()=>{const h=V.horizons.find(x=>x.k===invH);return h?`<div class="hz"><b>Options people look at</b><ul>${h.pick.map(x=>`<li>${E(x)}</li>`).join('')}</ul><p>${E(h.why)}</p></div>`:'<div class="em">Pick a time above.</div>'})()}`;
 if(invSec==='compare')b=`<p class="s2" style="margin-bottom:12px">Tap one to open it. These are categories, not recommendations.</p><div class="cm">${V.options.map(o=>`<details><summary><span>${o.ic} ${E(o.n)}</span><span class="rk ${o.risk==='Low'?'lo':o.risk==='High'?'hi':''}">${E(o.risk)}</span><svg class="i"><use href="#pl"/></svg></summary><p><b>Lock-in:</b> ${E(o.lock)}</p><p><b>Good for:</b> ${E(o.good)}</p><p><b>Watch out:</b> ${E(o.watch)}</p></details>`).join('')}</div>`;
 if(invSec==='banking')b=bankHTML(bk);
 if(invSec==='itr'){const tx=iv.tx||{},done=V.itr.filter((_,i)=>tx[i]).length;
  b=`<div class="al ${done===V.itr.length?'ok':''}"><b>${done} of ${V.itr.length} ready</b><span>${E(V.itrDue||'')}</span></div>
  <div class="fl" style="margin-top:12px">${V.itr.map((x,i)=>`<div><span>${E(x.t)}<small>${E(x.d)}</small></span><button type="button" class="chip" data-a="itrck" data-k="${i}" aria-pressed="${!!tx[i]}">${tx[i]?'Done':'To do'}</button></div>`).join('')}</div>
  ${(st.pf||{}).emp&&st.pf.emp!=='Salaried'?`<div class="fp" style="margin-top:12px"><b>Advance tax</b><p>${E(V.advance||'')}</p></div>`:''}
  <p class="fn">The official income tax portal is the source of truth for forms, dates and rules. For complex income, ask a qualified CA.</p>`}
 return`<button class="btn gho sm" data-a="go" data-t="plan">← Back</button><h2 style="margin-top:16px">Invest and tax</h2><p class="sub">Learn the options and test the numbers. No product picks.</p>
 <div class="cats" role="tablist" aria-label="Sections">${secs.map(x=>`<button type="button" class="chip" role="tab" data-a="isec" data-s="${x[0]}" aria-pressed="${invSec===x[0]}">${x[1]}</button>`).join('')}</div>${b}
 <p class="fn" style="margin-top:18px">${E(V.note||'')}</p>`;
}
function tabSpends(){
 const m=money(),list=[...st.spends].sort((a,b)=>b.t-a.t).slice(0,60),groups=[];
 list.forEach(s=>{const l=dlabel(s.t);let g=groups[groups.length-1];if(!g||g.l!==l){g={l,items:[]};groups.push(g)}g.items.push(s)});
 return`<h2>Spends</h2><p class="sub">${R(m.spentM)} spent in ${mname()}</p>${isL()?nwSummary():''}
 <div class="cd"><label for="sa">Amount (₹)</label><input id="sa" type="number" inputmode="numeric" min="0" placeholder="0">
 <div class="cats" role="group" aria-label="Category">${catP().map(c=>`<button type="button" class="chip" data-a="cat" data-c="${c}" aria-pressed="${cat===c}">${c}</button>`).join('')}</div>
 ${isL()?nwHTML():''}<input id="sn" type="text" maxlength="60" placeholder="Note (optional)" aria-label="Note">
 <button class="btn pri" style="width:100%" data-a="spend">Add spend</button></div>
 ${groups.length?groups.map(g=>`<div class="dh"><span>${g.l}</span><span>${R(sum(g.items,x=>x.a))}</span></div><div class="fl">${g.items.map(s=>`<div><span>${E(s.n||s.c||'Spend')}<small>${s.c?E(s.c):'Uncategorised'}${s.w?' · '+(s.w==='n'?'Need':'Want'):''}</small></span><span class="rr"><b class="neg2">-${R(s.a)}</b><button data-a="delspend" data-id="${E(s.id)}" aria-label="Delete this spend">×</button></span></div>`).join('')}</div>`).join(''):'<div class="em" style="margin-top:18px">No spends yet. Add your first one above.</div>'}`;
}
function sugPanel(){
 const s=st.sug;if(!s)return'';
 return`<div class="sug"><b>${I.spark} AI suggestion</b><div class="vals">Emergency ${s.e}% · Investments ${s.i}% · Target ${s.em} months</div>
 <details><summary>Why am I seeing this?</summary><p>${E(s.why.overall)}</p><p>${E(s.why.emergency)}</p><p>${E(s.why.invest)}</p></details>
 <div class="row2"><button class="btn pri sm" data-a="aiapply">Apply these numbers</button><button class="btn gho sm" data-a="aidismiss">Dismiss</button></div>
 <p class="fn">General guidance from an AI model, not regulated financial advice. Check it against your own situation before you apply it.</p></div>`;
}
function tabPlan(){return isL()?tabJars():isT()?tabPlanT():tabPlanG()}
function tabPlanG(){
 const r=st.rules,v=x=>x==null?'':x;
 return`<h2>Plan</h2><p class="sub">How ${mname()}'s income gets split.</p>
 <div id="alc">${allocCard()}</div>
 <div class="h3s">Allocation rules</div>
 <div class="cd"><div class="ac2"><div><h4>Your split</h4><p class="s2">Type your own numbers, or let AI calculate them.</p></div>
  <button class="btn gho sm" data-a="ai" ${aiBusy?'disabled':''}>${I.spark} ${aiBusy?'Calculating…':'Calculate with AI'}</button></div>
  ${aiErr?`<div class="er2" role="alert">${E(aiErr)}</div>`:''}${!aiReady()&&!st.sug?'<p class="fn" style="margin:-6px 0 14px">AI is not connected yet, so enter the numbers yourself for now.</p>':''}
  ${sugPanel()}
  <label for="r-e">Emergency fund (% of income)</label><input id="r-e" data-r="e" type="number" inputmode="decimal" min="0" max="50" step="0.5" placeholder="e.g. 10" value="${v(r.e)}">
  <label for="r-i">Investments (% of income)</label><input id="r-i" data-r="i" type="number" inputmode="decimal" min="0" max="50" step="0.5" placeholder="e.g. 5" value="${v(r.i)}">
  <label for="r-m">Emergency target (months of fixed costs)</label><input id="r-m" data-r="em" type="number" inputmode="decimal" min="1" max="24" step="1" placeholder="e.g. 6" value="${v(r.em)}">
  <div id="pv">${prevHTML()}</div>
  <p class="fn">Bills and goals are not a setting. They are worked out from your fixed commitments and goal deadlines.</p></div>
 <div class="h3s">Your buckets</div><div id="bk">${buckets()}</div>${isW()?invLink():''}`;
}
function tabGoals(){return isL()?tabDream():tabGoalsG()}
function tabGoalsG(){
 const p=plan(),now=new Date().getFullYear()*12+new Date().getMonth()+1;
 return`<h2>Goals</h2><p class="sub">${st.goals.length?`${st.goals.length} goal${st.goals.length>1?'s':''} · ${R(p.rq)} a month needed`:'Save for what matters, one month at a time.'}</p>
 ${st.goals.length?st.goals.map(g=>{
  const pct=Math.min(100,g.t?g.s/g.t*100:0),n=need(g),late=g.d&&g.s<g.t&&((+g.d.slice(0,4))*12+ +g.d.slice(5))<now;
  const chip=g.s>=g.t?'Funded ✅':late?'Past deadline':p.ready?(p.safe<0?'Needs attention':'On track ✅'):'';
  return`<div class="gc"><h4>${E(g.n||'Goal')}${chip?`<span class="ch ${late||(p.ready&&p.safe<0)?'w2':''}">${chip}</span>`:''}</h4><div class="pb"><i style="width:${pct}%"></i></div><p><span>${R(g.s)} of ${R(g.t)}</span><span>${n?R(n)+' a month':''}</span></p></div>`}).join(''):'<div class="em">No goals yet.</div>'}
 <div style="margin-top:16px"><button class="btn gho" data-a="edit" data-s="goals">${st.goals.length?'Edit goals':'Add a goal'}</button></div>`;
}
const CHAT_HELLO='Hi. I am the SpendWise advisor. Ask how to plan ahead, fix a tight month, or choose the next money step. I give general guidance for people in India — not regulated financial advice.';
const CHAT_SYS_PUBLIC=`You are SpendWise Advisor, a calm, plain-spoken money coach for people in India using the SpendWise app.

Your job is to help the person plan their future and untangle their financial situation. Typical questions: tight months, where to start, emergency funds, goals, EMIs vs saving, how to think about the next 1–5 years, and what to do before a purchase.

Voice: short paragraphs, concrete next steps, India and rupees, no jargon unless you explain it in one line. Ask at most one clarifying question when a number is missing. Prefer a simple order of actions (for example: essentials, then a small emergency buffer, then goals, then extra spending).

Hard limits: this is general guidance, not regulated financial advice and not a recommendation to buy or sell anything. Never name specific banks, mutual funds, stocks, insurance products, schemes-as-products, or apps other than SpendWise. Never promise returns. Never ask for name, email, PAN, Aadhaar, account numbers or OTP. If they paste secrets, tell them to remove them and continue with round numbers.

If they have not given numbers, still give a useful starting plan they can apply with their own figures. End with one practical thing they can do this week.`;
const CHAT_SYS_APP=`You are SpendWise Advisor, a calm, plain-spoken money coach inside the SpendWise app, for people in India.

You receive a JSON snapshot of this person's numbers only — never their name or email. Use those numbers. Quote rupee amounts from the snapshot when you do arithmetic. Help them plan the future and solve the current situation: safe-to-spend, a tight month, goals vs EMIs, emergency vs investing, and what to change first.

Voice: short paragraphs, concrete next steps, no jargon unless you explain it in one line. If a split does not fit (safe_to_spend_planned is negative, or goals need more than leftover income), say so clearly and suggest what to lower or delay. Do not invent income, bills or goals that are not in the snapshot.

Hard limits: general guidance only, not regulated financial advice. Never name specific banks, funds, stocks or insurance products. Never promise returns. Never ask for identity or account details.

End with one practical thing they can do in SpendWise this week (for example: set rules, allocate, add a spend, or move a goal deadline).`;
const LAND_QS=['How do I plan the next 5 years?','My money disappears every month. Where do I start?','How big should an emergency fund be?','I have EMIs and still want to save. Is that possible?'];
const APP_QS=['Can I afford my goals on this income?','What should I do with this month\'s leftover?','How do I get out of a tight month?','What should I change first?'];
function chatFmt(t){
 const out=[];let para=[],list=null;
 const bd=x=>x.replace(/\*\*(.+?)\*\*/g,'<b>$1</b>');
 const fp=()=>{if(para.length){out.push('<p>'+para.join('<br>')+'</p>');para=[]}};
 const fl=()=>{if(list){out.push('<'+list.t+'>'+list.i.map(x=>'<li>'+x+'</li>').join('')+'</'+list.t+'>');list=null}};
 E(t).split('\n').forEach(raw=>{
  const l=raw.trim(),ul=l.match(/^[-*•]\s+(.*)/),ol=l.match(/^\d+[.)]\s+(.*)/);
  if(!l){fp();fl();return}
  if(ul||ol){fp();const tt=ul?'ul':'ol';if(list&&list.t!==tt)fl();list=list||{t:tt,i:[]};list.i.push(bd((ul||ol)[1]));return}
  fl();para.push(bd(l.replace(/^#{1,4}\s+/,'')));
 });
 fp();fl();return out.join('')||'<p></p>';
}
function chatSnap(){
  if(!st)return null;
  const p=plan(),m=money();
  return{profile:SW.data.profile||'unspecified',health_score_out_of_1000:isL()?null:(healthScore()||{}).total??null,monthly_income:st.income,existing_savings:st.savings,debts_owed:st.debt||0,about_you:pfSafe(),dependents:st.dependents||0,
    fixed_monthly_total:p.fx,emergency_pct:st.rules.e,invest_pct:st.rules.i,emergency_target_months:st.rules.em,
    goals:st.goals.map(g=>({name:String(g.n||'Goal').slice(0,40),target:g.t,saved:g.s,months_left:months(g.d),monthly_needed:need(g)})),
    spent_this_month:m.spentM,safe_to_spend_now:m.safeNow,safe_to_spend_planned:p.safe,month_allocated:!!m.cy,
    emergency_saved:m.emerg,invested_so_far:m.invest};
}
function drawChat(log,qs,msgs,busy,prompts,err){
  if(!log)return;
  const typing=busy?'<div class="cmsg bot" aria-label="Advisor is typing"><span class="who">Advisor</span><span class="dots3" aria-hidden="true"><i></i><i></i><i></i></span></div>':'';
  const eh=err&&!busy?`<div class="cmsg bot err" role="alert"><span class="who">Advisor</span><p>${E(err)}</p></div>`:'';
  log.innerHTML=msgs.map(m=>`<div class="cmsg ${m.role==='user'?'me':'bot'}"><span class="who">${m.role==='user'?'You':'Advisor'}</span>${chatFmt(m.content)}</div>`).join('')+typing+eh;
  log.scrollTop=log.scrollHeight;
  if(qs)qs.innerHTML=(!msgs.some(m=>m.role==='user')?prompts:[]).map(p=>`<button type="button" class="chip" data-chatq="${E(p)}">${E(p)}</button>`).join('');
}
function paintChat(app){
  if(app){
    if(tab==='ask'&&$('alog')){drawChat($('alog'),$('aqs'),st.chat||[],chatBusy,pd().ask||APP_QS,chatErr);const b=$('aform')&&$('aform').querySelector('button');if(b)b.disabled=chatBusy;if($('aleft'))$('aleft').innerHTML=aiLeftHTML()}
    return}
  drawChat($('lclog'),$('lcqs'),landChat.msgs,landChat.busy,LAND_QS,landChat.err);
  const b=$('lcsend');if(b)b.disabled=!!landChat.busy;
}
async function sendChat(store,text,app){
  const q=String(text||'').trim().slice(0,app?aiLim().chars:500);if(!q||store.busy)return;
  if(!aiReady()){toast('AI is not connected yet. You can still explore SpendWise without it.',1);return}
  if(app&&aiLeft('c')<=0){store.err=aiPaid()?'You have used today\'s AI messages. They reset tomorrow.':'You have used today\'s free AI messages. They reset tomorrow, or upgrade to Copilot for more.';paintChat(true);return}
  if(!app&&landChat.n>=AI_LIMITS.landing){landChat.err='That is the end of the preview. Open the app to keep chatting with your own numbers.';paintChat(false);return}
  store.err='';store.msgs.push({role:'user',content:q});store.busy=true;if(!app)landChat.n++;
  if(app)await save();
  paintChat(app);
  try{
    const sys=app?CHAT_SYS_APP+(pd().sys?'\n\nAbout this person: '+pd().sys:''):CHAT_SYS_PUBLIC;
    const snap=app?chatSnap():null;
    const history=store.msgs.filter(m=>!m.local).slice(-(app?aiLim().hist:6));
    while(history.length&&history[0].role!=='user')history.shift();
    const messages=[{role:'system',content:sys+(snap?'\n\nNumbers snapshot (no identity):\n'+JSON.stringify(snap):'')},...history];
    const reply=(await aiAsk(messages,{temperature:.45,max_tokens:app?aiLim().reply:400})).trim();
    if(!reply)throw new Error('The advisor sent an empty reply. Please try again.');
    store.msgs.push({role:'assistant',content:reply.slice(0,4000)});
    if(app)aiUse().c++;
  }catch(e){
    store.msgs.pop();if(!app)landChat.n--;
    store.err=(e&&e.message)||'Something went wrong. Please try again.';
    const inp=$(app?'ainput':'lcinput');if(inp&&!inp.value)inp.value=q;
  }
  store.busy=false;
  if(app)await save();
  paintChat(app);
}
function bindChatBox(log,qs,form,input,store,app,prompts){
  if(!log||!form||form.dataset.bound)return;
  form.dataset.bound='1';
  if(!store.msgs.length)store.msgs.push({role:'assistant',content:CHAT_HELLO,local:true});
  drawChat(log,qs,store.msgs,store.busy,prompts,store.err);
  const b=form.querySelector('button');if(b)b.disabled=!!store.busy;
  form.addEventListener('submit',e=>{e.preventDefault();const v=input.value;input.value='';input.style.height='auto';sendChat(store,v,app)});
  input.addEventListener('input',()=>{input.style.height='auto';input.style.height=Math.min(120,input.scrollHeight)+'px'});
  input.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();form.requestSubmit()}});
  if(qs)qs.addEventListener('click',e=>{const bt=e.target.closest('[data-chatq]');if(bt)sendChat(store,bt.dataset.chatq,app)});
}
function tabAsk(){
  if(!st.chat)st.chat=[{role:'assistant',content:CHAT_HELLO,local:true}];
  return`<h2>Ask</h2><p class="sub">${isL()?'Ask anything about money. You will get simple answers.':'Plan your future and work through this month, using your SpendWise numbers.'}</p>
  ${!aiReady()?'<p class="fn" style="margin-top:-8px">AI is not connected yet, so the advisor cannot reply until it is.</p>':''}
  <div class="chatbox"><div class="chatlog" id="alog" aria-live="polite"></div><div class="chatqs" id="aqs"></div>
  <form class="chatin" id="aform"><textarea id="ainput" rows="1" maxlength="${aiLim().chars}" placeholder="Ask about your plan, a tight month, or the next few years…" aria-label="Message the SpendWise advisor"></textarea>
  <button class="btn pri" type="submit"${chatBusy?' disabled':''}>Send</button></form></div>
  <p class="fn" id="aleft">${aiLeftHTML()}</p>
  <p class="fn">The advisor sees your numbers only — never your name or email. General guidance, not regulated financial advice.</p>`;
}
function tabMore(){
 const p=plan(),u=SW.user,pr=prof(),P=pd(),L=isL();
 const ans=(P.q||[]).map(q=>{let v=(st.pf||{})[q.k];if(Array.isArray(v))v=v.join(', ');return v?`<div><span>${E(q.l)}</span><b style="text-align:right">${E(String(v))}</b></div>`:''}).join('');
 return`<h2>More</h2><p class="sub">Your account and setup.</p>
 <div class="cd prof"><div class="av">${E((u.name||'?').trim().charAt(0).toUpperCase())}</div><div><b>${E(u.name||'You')}</b><small>${E(u.email)}</small></div></div>
 <div class="h3s">Your profile</div>
 <div class="cd prof"><div class="av" style="font-size:26px;background:#0f172a;border:1px solid var(--line)">${P.ic||'👤'}</div><div><b>${E(pr||'None chosen')}</b><small>${E(P.tag||'')}</small></div></div>
 <div style="margin-top:12px"><button class="btn gho" data-a="edit" data-s="profile">Change profile</button></div>
 <div class="h3s">Your setup</div>
 <div class="fl"><div><span>${E(incLabel())}</span><b>${R(st.income)}</b></div><div><span>Existing savings</span><b>${R(st.savings)}</b></div>${L?`<div><span>Quest XP</span><b>⭐ ${st.learn.xp}</b></div>`:`<div><span>Debts you owe</span><b>${R(st.debt||0)}</b></div><div><span>Dependents</span><b>${st.dependents||0}</b></div><div><span>Fixed commitments</span><b>${R(p.fx)}</b></div>`}${ans}</div>
 ${!L&&st.fixed.length?'<div class="fl" style="margin-top:10px">'+st.fixed.map(x=>`<div><span>${E(x.n||'Item')}</span><b>${R(+x.a||0)}</b></div>`).join('')+'</div>':''}
 <div style="margin-top:12px"><button class="btn gho" data-a="edit" data-s="${L?'money':'basics'}">Edit setup</button></div>
 <div class="h3s">AI and privacy</div>
 <div class="cd"><b>${aiReady()?'AI is connected':'AI is not connected yet'}</b><p class="s2" style="margin-top:6px">When it is on, the AI only receives your numbers and choices: income, costs, goals and the multiple-choice answers in your profile. It never receives your name, email or anything you typed as free text. You choose whether to apply what it suggests.</p></div>
 <div class="h3s">Account</div><button class="btn gho" data-a="logout">Sign out</button>
 <p class="fn" style="margin-top:22px">SpendWise plans and tracks your money. It does not move real money between accounts. Your data is encrypted on this device.</p>`;
}
const navItems=()=>{const L=isL();return[['home','Home',I.home],['spends','Spends',I.spends],['plan',L?'Jars':'Plan',I.plan],['goals',L?'Dream':'Goals',I.goals],['ask','Ask',I.ask],['more','More',I.more]]};
function render(){
 if(!st.done){wizard();return}
 root.classList.toggle('big',!!pd().big);
 const body={home:tabHome,spends:tabSpends,plan:tabPlan,goals:tabGoals,ask:tabAsk,more:tabMore,invest:tabInvest,score:tabScore}[tab]();
 root.innerHTML=`<div class="pg">${body}</div><nav class="nv" aria-label="App"><div>${navItems().map(n=>`<button data-a="go" data-t="${n[0]}" ${(tab==='invest'?'plan':tab==='score'?'home':tab)===n[0]?'aria-current="page"':''}>${n[2]}${n[1]}</button>`).join('')}</div></nav>`;
 if(tab==='ask'){
  if(!st.chat)st.chat=[{role:'assistant',content:CHAT_HELLO,local:true}];
  const store={get msgs(){return st.chat},get busy(){return chatBusy},set busy(v){chatBusy=v},get err(){return chatErr},set err(v){chatErr=v}};
  bindChatBox($('alog'),$('aqs'),$('aform'),$('ainput'),store,true,pd().ask||APP_QS);
 }
}
function refreshPlan(){if($('pv'))$('pv').innerHTML=isT()?prevT():prevHTML();if($('alc'))$('alc').innerHTML=allocCard();if($('bk'))$('bk').innerHTML=buckets()}

/* ===== actions ===== */
function allocate(){
 const p=plan();
 if(thisCycle())return toast('Already allocated for '+mname()+'.',1);
 if(!p.ready)return toast(isT()?'Pick your save % first.':'Enter your emergency and investment percentages first.',1);
 if(p.safe<0)return toast('This month does not fit yet. Lower a percentage or move a goal deadline.',1);
 st.goals.forEach(g=>{g.s=Math.min(g.t,g.s+need(g))});
 st.cycles.push({id:Date.now()+'',k:mk(),m:mname(),t:Date.now(),income:st.income,e:p.e,b:p.fx,g:p.rq,i:p.i,s:p.safe});
 if(isL()){st.learn.xp+=20;toast('Jars filled! +20 XP ⭐ You can spend '+R(p.safe)+' freely.')}else toast(mname()+' allocated. You can spend '+R(p.safe)+' freely.');
}
function addSpend(){
 const a=Math.round(+($('sa').value)||0),n=$('sn').value.trim().slice(0,60);
 if(a<=0){toast('Enter the amount you spent.',1);$('sa').focus();return false}
 st.spends.push({id:Date.now()+'-'+Math.random().toString(36).slice(2,6),t:Date.now(),k:mk(),a,n,c:cat,w:isL()?nw:''});
 let xp='';if(isL()){const td=new Date().toDateString();if(st.learn.logged!==td){st.learn.logged=td;st.learn.xp+=5;xp=' +5 XP ⭐'}}
 toast('Added '+R(a)+(cat?' · '+cat:'')+xp);cat='';nw='';return true;
}

/* ===== AI (optional) ===== */
async function aiAsk(messages,opt={}){
  const direct=!AI_CONFIG.ENDPOINT,headers={'Content-Type':'application/json'};
  if(direct){headers.Authorization='Bearer '+AI_CONFIG.DIRECT_KEY;headers['X-Title']='SpendWise'}
  const body={messages,temperature:opt.temperature??.2,max_tokens:opt.max_tokens??700};if(AI_CONFIG.MODEL)body.model=AI_CONFIG.MODEL;
  const ctl=new AbortController();let timedOut=false;const to=setTimeout(()=>{timedOut=true;ctl.abort()},opt.timeout||90000);
 let r;try{r=await fetch(direct?'https://openrouter.ai/api/v1/chat/completions':AI_CONFIG.ENDPOINT,{method:'POST',headers,body:JSON.stringify(body),signal:ctl.signal})}
 catch(err){console.warn('AI request failed',err);throw new Error(timedOut?'The AI took too long to answer. Try a shorter question, or try again in a moment.':'The request was blocked or the connection dropped before the AI replied. If this keeps happening, the proxy may be rejecting browser requests (CORS).')}
 if(!r.ok){clearTimeout(to)}
 if(!r.ok)throw new Error(r.status===402?'The AI service is out of credits.':r.status===429?'The free AI is at its usage limit right now. Wait a minute and try again, or come back later.':r.status===502||r.status===504?'The AI had trouble answering that. Please try again in a moment.':r.status===404?'The AI model is not available right now. Please try again later.':'The AI request failed ('+r.status+').');
 let j;try{j=await r.json()}catch(err){console.warn('AI body failed',err);throw new Error(timedOut?'The AI took too long to answer. Try again in a moment.':'The AI reply was cut off. Please try again.')}finally{clearTimeout(to)}
 const content=j.choices?.[0]?.message?.content;
 const strip=x=>String(x).replace(/<think>[\s\S]*?<\/think>/gi,'').replace(/<\/?think>/gi,'').trim();
 if(typeof content==='string')return strip(content);
 if(Array.isArray(content))return strip(content.map(part=>typeof part==='string'?part:part?.text||'').join(''));
 return'';
}
function parseAiJson(text){
 const source=String(text||'');
 for(let start=0;start<source.length;start++){
  if(source[start]!=='{')continue;
  let depth=0,quoted=false,escaped=false;
  for(let end=start;end<source.length;end++){
   const ch=source[end];
   if(quoted){if(escaped)escaped=false;else if(ch==='\\')escaped=true;else if(ch==='"')quoted=false;continue}
   if(ch==='"')quoted=true;
   else if(ch==='{')depth++;
   else if(ch==='}'&&--depth===0){
    try{const value=JSON.parse(source.slice(start,end+1));if(value&&typeof value==='object'&&!Array.isArray(value))return value}catch{}
    break;
   }
  }
 }
 throw new Error('Invalid AI JSON');
}
async function aiAllocate(){
 const p=plan();
 const snap={profile:SW.data.profile||'unspecified',monthly_income:st.income,existing_savings:st.savings,debts_owed:st.debt||0,about_you:pfSafe(),dependents:st.dependents||0,fixed_monthly_total:p.fx,
  goals:st.goals.map(g=>({target:g.t,saved:g.s,months_left:months(g.d),monthly_needed:need(g)}))};
 const sys='You are a careful, plain-spoken personal-finance planning assistant for people in India. You receive one person\'s monthly numbers and suggest how to split their income. Reply with ONLY a JSON object, no markdown, in exactly this shape: {"emergency_pct":number,"invest_pct":number,"emergency_target_months":number,"why":{"emergency":string,"invest":string,"overall":string}}. Rules: percentages are of monthly income and between 0 and 30. emergency_target_months is between 1 and 12. fixed_monthly_total and the goals\' monthly_needed are already committed, so emergency_pct + invest_pct + ((fixed_monthly_total + sum of monthly_needed) / monthly_income * 100) must stay below 100, leaving money to spend. Adapt to the profile and dependents (for example a bigger cushion with dependents, simpler for children and seniors). Never name specific funds, stocks or products. Each "why" is at most two short sentences and shows the arithmetic. This is general guidance, not regulated advice.';
 const txt=await aiAsk([{role:'system',content:sys},{role:'user',content:JSON.stringify(snap)}]);
 let o;try{o=parseAiJson(txt)}catch{throw new Error('The AI gave an answer we could not read. Please try again.')}
 const e=+o.emergency_pct,i=+o.invest_pct,em=+o.emergency_target_months,w=o.why||{};
 const ok=Number.isFinite(e)&&Number.isFinite(i)&&Number.isFinite(em)&&e>=0&&e<=30&&i>=0&&i<=30&&em>=1&&em<=12;
 if(!ok)throw new Error('The AI suggested numbers outside the allowed range. Please try again.');
 if(st.income-p.fx-p.rq-st.income*(e+i)/100<=0)throw new Error('The AI suggestion would leave nothing to spend. Please try again.');
 const t=x=>String(x||'').slice(0,320);
 return{e:Math.round(e*10)/10,i:Math.round(i*10)/10,em:Math.round(em),why:{overall:t(w.overall),emergency:t(w.emergency),invest:t(w.invest)}};
}
async function runAI(){
 if(!aiReady())return toast('AI is not connected yet. Enter the numbers yourself for now.',1);
 if(!(st.income>0))return toast('Add your income in setup first.',1);
 if(aiLeft('p')<=0){aiErr=aiPaid()?'You have used today\'s AI plans. They reset tomorrow. You can still enter the numbers yourself.':'You have used today\'s '+aiLim().plan+' free AI plans. They reset tomorrow, or upgrade to Copilot for more. You can still enter the numbers yourself.';return render()}
 aiBusy=true;aiErr='';render();
 try{st.sug=await aiAllocate();aiUse().p++;await save()}catch(e){aiErr=e.message||'Something went wrong.'}
 aiBusy=false;render();
}

/* re-draw the current screen without jumping the scroll position */
function rr(m){const y=scrollY;if(st.done){render();if(m)toast(m,1)}else wizard(m||'');scrollTo(0,y)}
/* ===== start ===== */
function start(r){
 root=r;st=Object.assign(blank(),SW.data.setup||{});tab='home';cat='';nw='';game=null;aiBusy=false;aiErr='';chatBusy=false;chatErr='';
 if(!Array.isArray(st.chat)||!st.chat.length)st.chat=[{role:'assistant',content:CHAT_HELLO,local:true}];
 if(!st.v||st.v<3){ /* earlier builds pre-filled percentages; clear them so nothing is a default */
  st.rules={e:null,i:null,em:null};st.v=3;delete st.bal;save()}
 st.rules=Object.assign({e:null,i:null,em:null},st.rules);
 st.pf=st.pf&&typeof st.pf==='object'&&!Array.isArray(st.pf)?st.pf:{};
 st.inv=Object.assign({sip:{},fd:{},tx:{}},st.inv);['sip','fd','tx'].forEach(k=>st.inv[k]=Object.assign({},st.inv[k]));fixTeen();
 st.learn=Object.assign({xp:0},st.learn);st.learn.jars=Object.assign({s:0,v:0,d:0},st.learn.jars);
 /* nobody reaches the dashboard without a profile (Google sign-in starts with none) */
 if(!SW.data.profile){st.done=false;st.step=0}
 else if(isL()&&st.done&&!(st.learn.jars.s+st.learn.jars.v+st.learn.jars.d)){st.done=false;st.step=1}
 st.spends.forEach((s,i)=>{if(!s.id)s.id=s.t+'-'+i});
 if(!root.dataset.b){root.dataset.b=1;
  root.addEventListener('input',e=>{const t=e.target;
   if(t.dataset.c){const[g,k]=t.dataset.c.split('.');st.inv[g][k]=t.value===''?'':+t.value;const o=$('ires');if(o)o.innerHTML=g==='sip'?sipRes():fdRes();return}
   if(t.dataset.r){const k=t.dataset.r,mx=k==='em'?24:50;st.rules[k]=t.value===''?null:Math.max(0,Math.min(mx,+t.value||0));fixTeen();refreshPlan();return}
   const f=t.dataset.f;if(!f)return;const v=t.type==='number'?Math.max(0,+t.value||0):t.value;
   if(f.includes('.')){const[l,k]=f.split('.');if(t.dataset.i==null||t.dataset.i==='')st[l][k]=v;else st[l][+t.dataset.i][k]=v}else st[f]=v});
  root.addEventListener('change',e=>{const t=e.target;if(t.dataset.c)save();if(t.dataset.r){const v=st.rules[t.dataset.r];if(v!=null)t.value=v;save()}});
  root.addEventListener('keydown',async e=>{if(e.key==='Enter'&&(e.target.id==='sa'||e.target.id==='sn')){e.preventDefault();if(addSpend()){await save();render()}}});
  root.addEventListener('click',async e=>{const b=e.target.closest('[data-a]');if(!b)return;const a=b.dataset.a;
   if(a==='go'){tab=b.dataset.t;render();scrollTo(0,0);if(b.dataset.f&&$('sa'))$('sa').focus()}
   else if(a==='cat'){cat=cat===b.dataset.c?'':b.dataset.c;root.querySelectorAll('[data-a=cat]').forEach(x=>x.setAttribute('aria-pressed',x.dataset.c===cat))}
   else if(a==='spend'){if(addSpend()){await save();render()}}
   else if(a==='delspend'){st.spends=st.spends.filter(s=>s.id!==b.dataset.id);await save();render();toast('Spend removed.')}
   else if(a==='alloc'){allocate();await save();render()}
   else if(a==='ai')runAI();
   else if(a==='aiapply'){const s=st.sug;st.rules={e:s.e,i:s.i,em:s.em};st.sug=null;await save();render();toast('Rules updated. Review them, then allocate.')}
   else if(a==='aidismiss'){st.sug=null;await save();render()}
   else if(a==='logout')SW.logout();
   else if(a==='upgrade'){if(SW.upgrade)SW.upgrade()}
   else if(a==='isec'){invSec=b.dataset.s;rr()}
   else if(a==='hz'){invH=invH===b.dataset.k?'':b.dataset.k;rr()}
   else if(a==='sipuse'){st.inv.sip.m=plan().i;await save();rr()}
   else if(a==='itrck'){const k=b.dataset.k;st.inv.tx[k]=!st.inv.tx[k];await save();rr()}
   else if(a==='nw'){nw=nw===b.dataset.v?'':b.dataset.v;root.querySelectorAll('[data-a=nw]').forEach(x=>x.setAttribute('aria-pressed',x.dataset.v===nw))}
   else if(a==='edit'){st.done=false;const i=STEPS().indexOf(b.dataset.s);st.step=i<0?1:i;wizard();scrollTo(0,0)}
   else if(a==='pick'){const n=b.dataset.p;if(SW.data.profile!==n){SW.data.profile=n;st.pf={};st.rules={e:null,i:null,em:null};st.sug=null;fixTeen();await save()}wizard()}
   else if(a==='pfchip'){const k=b.dataset.k,v=b.dataset.v,arr=Array.isArray(st.pf[k])?st.pf[k]:[];st.pf[k]=arr.includes(v)?arr.filter(x=>x!==v):[...arr,v];b.setAttribute('aria-pressed',st.pf[k].includes(v))}
   else if(a==='dr'){if(!st.goals[0])st.goals[0]={n:'',t:0,s:0,d:''};st.goals[0].n=b.dataset.p;rr()}
   else if(a==='coin'){const j=st.learn.jars,k=b.dataset.k,d=+b.dataset.d;
    if(d>0&&jleft()<=0)return rr('All 10 coins are placed. Take one out of another jar first.');
    if(d<0&&(j[k]<=0||(st.done&&j[k]<=1)))return rr(j[k]<=0?'':'Each jar keeps at least one coin.');
    j[k]+=d;syncLearn();if(st.done)await save();rr()}
   else if(a==='gstart'){const idx=SL().items.map((_,i)=>i);for(let i=idx.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[idx[i],idx[j]]=[idx[j],idx[i]]}game={q:idx.slice(0,5),i:0,score:0,a:''};rr()}
   else if(a==='gans'){if(!game||game.a)return;const c=SL().items[game.q[game.i]];game.a=b.dataset.v;if(game.a===c.k){game.score++;st.learn.xp+=10}await save();rr()}
   else if(a==='gnext'){if(game){game.i++;game.a=''}rr()}
   else if(a==='af'){st.fixed.push({n:b.dataset.p,a:0});wizard()}
   else if(a==='ag'){st.goals.push({n:b.dataset.p,t:0,s:0,d:''});wizard()}
   else if(a==='del'){st[b.dataset.l].splice(+b.dataset.i,1);wizard()}
   else if(a==='back'){st.step--;wizard();scrollTo(0,0)}
   else if(a==='next'){
    const K=STEPS()[st.step],L=isL();
    if(K==='profile'&&!prof())return wizard('Pick the profile that fits you best to continue.');
    if(K==='basics'&&!(st.income>0))return wizard('Enter your monthly income to continue.');
    if(K==='money'&&!(st.income>0))return wizard('Tell us your pocket money to start. A guess is fine.');
    if(K==='goals'&&st.goals.some(g=>!g.n||!(g.t>0)))return wizard('Give each goal a name and a target amount, or remove it.');
    if(K==='dream'){const g=st.goals[0];if(!g||!String(g.n||'').trim()||!(g.t>0))return wizard('Name your dream and tell us what it costs.')}
    if(K==='jars'){const j=st.learn.jars;if(jleft()>0)return wizard('Place all 10 coins to continue. '+jleft()+' left.');if(!(j.s>0&&j.v>0&&j.d>0))return wizard('Every jar needs at least one coin. That is how good habits start.')}
    if(st.step<3){st.step++;wizard();scrollTo(0,0)}
    else{if(L){syncLearn();if(!st.learn.setupXp){st.learn.setupXp=1;st.learn.xp+=50}}
     st.done=true;await save();render();scrollTo(0,0);if(L)toast('Quest complete! +50 XP ⭐')}}});
 }
 render();
}
SW.start=start;
bindChatBox($('lclog'),$('lcqs'),$('lcform'),$('lcinput'),landChat,false,LAND_QS);
})();
