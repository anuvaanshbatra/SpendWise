(()=>{
/* ===== AI CONFIG — leave empty until you are ready (the app works without it) =====
   ENDPOINT   : RECOMMENDED. URL of your own proxy (see ai-proxy-worker.js). Your key stays on the server.
   MODEL      : exact OpenRouter model id, e.g. 'xiaomi/mimo-v2.6-flash'. Optional if the proxy sets the model.
   DIRECT_KEY : TESTING ONLY. A key placed here is visible to everyone who opens the site. Never publish it. */
const AI_CONFIG={ENDPOINT:'https://ai-proxy-worker.spendwise-main.workers.dev',MODEL:'nvidia/nemotron-3-ultra-550b-a55b:free',DIRECT_KEY:''};
const aiReady=()=>!!AI_CONFIG.ENDPOINT||!!(AI_CONFIG.DIRECT_KEY&&AI_CONFIG.MODEL);
/* Where the Copilot waitlist is posted. Change it if the route lives on another worker. */
if(window.SW)SW.waitlistUrl=AI_CONFIG.ENDPOINT?AI_CONFIG.ENDPOINT.replace(/\/$/,'')+'/waitlist':'';

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
.h3s{font-size:12.5px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:#8391a7;margin:28px 0 10px}
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
.rw .dl{position:absolute;top:4px;right:4px;width:44px;height:44px;border-radius:10px;color:var(--mu);font-size:20px}.rw .dl:hover{color:var(--rd)}
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
.rr{display:flex;align-items:center;gap:6px}.rr button{width:44px;height:44px;border-radius:10px;color:#8391a7;font-size:20px;line-height:1}.rr button:hover{color:var(--rd)}
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
.s2{color:var(--mu);font-size:14px;margin-top:2px}.fn{font-size:12.5px;color:#8391a7;margin-top:12px;line-height:1.5}
.sb{display:flex;height:12px;border-radius:12px;overflow:hidden;background:#1e293b;margin:6px 0 12px;gap:2px}.sb i{display:block;height:100%;transition:width .3s}
.lg2{display:grid;gap:8px;font-size:14px}.lg2 div{display:flex;justify-content:space-between;gap:10px;font-variant-numeric:tabular-nums}
.lg2 span:first-child{display:flex;align-items:center;gap:8px;color:var(--mu)}.lg2 em{width:10px;height:10px;border-radius:50%;flex:none}.lg2 .un{color:#8391a7;font-weight:500}
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
@media(max-width:380px){.tl{gap:6px}.tl button{font-size:11.5px}.nv button{font-size:10.5px;padding:10px 2px 12px}}`;
document.head.append(css);

/* ===== state ===== */
let root,st,tab='home',cat='',nw='',invSec='ready',invH='',spendBusy=false,vamt=0,scur='INR',fxBusy=false,game=null,aiBusy=false,aiErr='',chatBusy=false,chatErr='';
const landChat={msgs:[],busy:false,err:'',n:0};
const $=id=>document.getElementById(id);
const sum=(a,f)=>a.reduce((x,y)=>x+f(y),0);
const mk=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')};
const mname=()=>new Date().toLocaleString('en-IN',{month:'long',year:'numeric'});
const blank=()=>({v:4,step:0,income:0,savings:0,debt:0,dependents:0,fixed:[],goals:[],done:false,rules:{e:null,i:null,em:null},cycles:[],spends:[],sug:null,pf:{},learn:{xp:0,jars:{s:0,v:0,d:0}},inv:{sip:{},fd:{},tx:{},loan:{}},fx:{rates:{}}});

/* ===== profile helpers (content lives in profiles.js) ===== */
const SP=()=>window.SW_PROFILES||{order:[]},SL=()=>window.SW_LEARN||{dreams:[],levels:['Saver'],jars:{},whys:[],items:[]};
const prof=()=>(SW.data&&SW.data.profile)||'',pd=()=>SP()[prof()]||{},isL=()=>prof()==='Learner',isT=()=>prof()==='Teen',isW=()=>prof()==='Working professional',isO=()=>prof()==='OCI';
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
 if(st.chat&&st.chat.length>40)st.chat=st.chat.slice(-40); /* keep the vault small */
 SW.data.setup=st;
 try{await SW.save()}catch{toast('Could not save on this device. Storage may be full or blocked.',1)}};
const dlabel=t=>{const d=new Date(t),n=new Date(),a=new Date(d.getFullYear(),d.getMonth(),d.getDate()),b=new Date(n.getFullYear(),n.getMonth(),n.getDate()),df=Math.round((b-a)/864e5);return df===0?'Today':df===1?'Yesterday':d.toLocaleDateString('en-IN',{day:'numeric',month:'short'})};
function toast(t,bad){let x=$('tst');if(!x){x=document.createElement('div');x.id='tst';x.setAttribute('role','status');x.setAttribute('aria-live','polite');document.body.append(x)}
 x.setAttribute('role',bad?'alert':'status');x.textContent=t;x.className=bad?'bad':'';clearTimeout(toast.t);toast.t=setTimeout(()=>x.remove(),bad?7000:3200)}

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
/* ===== F8: verdict before you buy ===== */
const GOAL_LIMIT=2,CURS=['USD','GBP','EUR','CAD','AUD','AED','SGD','NZD','CHF','JPY'];
const daysLeft=()=>{const d=new Date();return Math.max(1,new Date(d.getFullYear(),d.getMonth()+1,0).getDate()-d.getDate()+1)};
function verdictHTML(){
 const a=Math.round(vamt||0),m=money(),L=isL(),p=m.p;
 if(!(a>0))return'<p class="fn" style="margin:0">Type a price to see the verdict.</p>';
 if(m.safeNow==null)return`<div class="verd a"><span class="ic">!</span><div><strong>Set your plan first</strong><p>${L?'Fill your jars first':'Set your allocation rules in Plan first'}, so SpendWise knows what is safe to spend.</p></div></div>`;
 const left=m.safeNow,after=left-a,days=daysLeft(),jar=L?'Spend jar':'safe-to-spend money',note=m.cy?'':' This uses your plan. Allocate the month to lock it in.';
 let c,i,t,d;
 if(left<=0){c='r';i='✕';t='Not this month.';d=`Your ${jar} is already used up.`}
 else if(a<=left*.35){c='g';i='✓';t='Go ahead.';d=`You would still have ${R(after)} left, about ${R(after/days)} a day for ${days} more day${days>1?'s':''}.`}
 else if(a<=left){c='a';i='!';t='Think twice.';d=`It fits, but only ${R(after)} would be left, about ${R(after/days)} a day for the rest of the month.`}
 else{c='r';i='✕';t='Not this month.';const over=a-left;d=`That is ${R(over)} more than your ${jar}.`+(p.rq>0?` Paying it from goal money would delay your goals by about ${Math.ceil(over/(p.rq/30))} days.`:' It would have to come out of your savings.')}
 const btn=c!=='r'?'<button class="btn gho sm" style="margin-top:10px" data-a="vlog">Log it as a spend</button>':'';
 return`<div class="verd ${c}"><span class="ic">${i}</span><div><strong>${t}</strong><p>${d}${note}</p>${btn}</div></div>`}
const verdictTile=()=>`<div class="tl" style="margin-top:10px;grid-template-columns:1fr"><button data-a="go" data-t="spends" data-v="1"><span class="ti">🤔</span>${isL()?'Can I buy it? Check your Spend jar':'Can I afford it? Check before you buy'}</button></div>`;
const fxTile=()=>`<div class="tl" style="margin-top:10px;grid-template-columns:1fr"><button data-a="go" data-t="fx"><span class="ti">💱</span>Currency calculator</button></div>`;
/* ===== F13: foreign currency for OCI, and the currency calculator ===== */
const fxCur=()=>st.fx.cur||((st.pf||{}).cur)||'USD';
const fxRate=c=>((st.fx.rates||{})[c]||{}).r||0;
const fnum=(n,d=2)=>Number(n).toLocaleString('en-IN',{maximumFractionDigits:d});
async function getRate(c){
 if(fxBusy)return;fxBusy=true;
 try{const ctl=new AbortController(),to=setTimeout(()=>ctl.abort(),8000);
  const r=await fetch('https://open.er-api.com/v6/latest/'+encodeURIComponent(c),{signal:ctl.signal});clearTimeout(to);
  const j=await r.json(),v=j&&j.rates&&+j.rates.INR;if(!(v>0))throw 0;
  st.fx.rates[c]={r:Math.round(v*100)/100,at:Date.now(),live:1};await save();toast('Rate updated: 1 '+c+' = ₹'+st.fx.rates[c].r);
  if(tab==='fx')rr();else{const e=$('sr');if(e)e.value=st.fx.rates[c].r}}
 catch{toast('Could not fetch the rate. Type it in yourself.',1)}
 fxBusy=false}
function fxRes(){
 const c=fxCur(),r=fxRate(c),a=+st.fx.amt||0,dir=st.fx.dir||'toinr',sup=+((st.pf||{}).sup)||0;
 if(!(r>0))return'<p class="fn">Enter the rate, or tap Get today\'s rate.</p>';
 if(!(a>0))return'<p class="fn">Enter an amount.</p>';
 const row=(l,v,cls)=>`<div><span>${l}</span><b class="${cls||''}">${v}</b></div>`;
 const out=[[-3,'If the rate falls 3%'],[0,'At today\'s rate'],[3,'If the rate rises 3%']].map(([pc,l])=>{const q=r*(1+pc/100);
  return dir==='toinr'?row(l+' (₹'+fnum(q)+')','₹'+fnum(a*q,0),pc===0?'pos':''):row(l+' (₹'+fnum(q)+')',c+' '+fnum(a/q),pc===0?'pos':'')}).join('');
 return`<div class="fl">${out}</div>`+(sup>0?`<div class="fp" style="margin-top:12px"><b>Your monthly family support</b><p>${R(sup)} a month costs about ${c} ${fnum(sup/r)} at this rate.</p></div>`:'')+
 '<p class="fn">A lower rate means each unit of your currency buys fewer rupees. Your bank or transfer service uses its own rate and adds fees, so treat this as a guide.</p>'}
function tabFx(){
 const c=fxCur(),r=st.fx.rates[c]||{},dir=st.fx.dir||'toinr',ctry=(st.pf||{}).ctry;
 const opts=[...new Set([...CURS,c])];
 return`<button class="btn gho sm" data-a="go" data-t="home">← Back</button><h2 style="margin-top:16px">Currency calculator</h2><p class="sub">Convert between rupees and ${E(c)}${ctry?' for life in '+E(ctry):''}. Rates move every day, so check before you send money.</p>
 <div class="cd"><label for="fcur">Currency</label><select id="fcur" data-fx="cur">${opts.map(x=>`<option${x===c?' selected':''}>${x}</option>`).join('')}</select>
 <label for="fr">Rupees per 1 ${E(c)}</label><input id="fr" data-fx="rate" type="number" inputmode="decimal" min="0" step="0.01" value="${r.r||''}" placeholder="e.g. 105">
 <div class="row" style="margin:-4px 0 14px;align-items:center"><button class="btn gho sm" type="button" data-a="getrate">Get today's rate</button><span class="fn" style="margin:0">${r.at?(r.live?'Live rate from ':'Typed in on ')+new Date(r.at).toLocaleDateString('en-IN'):'No rate yet'}</span></div>
 <div class="cats" role="group" aria-label="Direction"><button type="button" class="chip" data-a="fxdir" data-v="toinr" aria-pressed="${dir==='toinr'}">${E(c)} → ₹</button><button type="button" class="chip" data-a="fxdir" data-v="frominr" aria-pressed="${dir==='frominr'}">₹ → ${E(c)}</button></div>
 <label for="fa">Amount in ${dir==='toinr'?E(c):'₹'}</label><input id="fa" data-fx="amt" type="number" inputmode="decimal" min="0" value="${st.fx.amt||''}" placeholder="0">
 <div id="fres" style="margin-top:6px">${fxRes()}</div></div>
 <p class="fn">Live rates by <a href="https://www.exchangerate-api.com" target="_blank" rel="noopener" style="text-decoration:underline">ExchangeRate-API</a>. If the live rate cannot load, type the rate in yourself.</p>`}
function curRow(){return`<label for="sc">Currency</label><select id="sc">${['INR',...CURS].map(x=>`<option${scur===x?' selected':''}>${x}</option>`).join('')}</select>
 <div id="srw"${scur==='INR'?' hidden':''}><label for="sr" id="srl">Rupees per 1 ${E(scur)}</label><input id="sr" type="number" inputmode="decimal" min="0" step="0.01" value="${fxRate(scur)||''}" placeholder="e.g. 105">
 <div class="row" style="margin:-4px 0 14px"><button class="btn gho sm" type="button" data-a="getrate">Get today's rate</button></div></div>`}
/* ===== F14: use the profile answers that were only being collected ===== */
const mdiff=ym=>{const[y,m]=String(ym).split('-').map(Number);if(!y||!m)return null;const n=new Date();return(y-n.getFullYear())*12+m-(n.getMonth()+1)};
function loanRes(){
 const l=st.inv.loan||{},P=+(st.pf||{}).eduloan||0,y=+l.y,r=+l.r;
 if(!(P>0))return'';
 if(!(y>0)||l.r===''||l.r==null||!(r>=0))return'<p class="fn">Enter the interest rate and how many years you will take to repay.</p>';
 const n=Math.round(y*12),i=r/1200,emi=i>0?P*i/(1-Math.pow(1+i,-n)):P/n,tot=emi*n;
 return`<div class="fl"><div><span>Monthly EMI</span><b class="pos">${R(emi)}</b></div><div><span>You repay in total</span><b>${R(tot)}</b></div><div><span>Of which interest</span><b>${R(tot-P)}</b></div>${st.income>0?`<div><span>EMI as a share of income</span><b>${Math.round(emi/st.income*100)}%</b></div>`:''}</div><p class="fn">An estimate that starts from the amount you owe today. Interest can build up before repayment starts, so check your lender's terms.</p>`}
function insightCards(){
 const pf=st.pf||{},p=plan(),m=money(),P=prof(),out=[],card=(t,b)=>`<div class="fp"><b>${E(t)}</b><p>${b}</p></div>`;
 const plural=n=>n+' month'+(n===1?'':'s');
 if(P==='Young adult'&&+pf.eduloan>0){
  const n=pf.repay?mdiff(pf.repay):null,l=st.inv.loan||{};
  out.push(`<div class="cd" style="margin-bottom:10px"><b>Your education loan</b><p class="s2" style="margin:6px 0 14px">You owe ${R(+pf.eduloan)}. ${n==null?'Add the month repayment starts in Edit setup to see a countdown.':n>0?'Repayment starts in about '+plural(n)+'.':'Repayment has started, or starts this month.'}</p>
  <label for="ln-r">Interest rate (% a year)</label><input id="ln-r" data-c="loan.r" type="number" inputmode="decimal" min="0" max="30" step="0.1" value="${l.r??''}" placeholder="From your loan papers">
  <label for="ln-y">Years to repay</label><input id="ln-y" data-c="loan.y" type="number" inputmode="decimal" min="0" max="30" value="${l.y??''}" placeholder="e.g. 10">
  <div id="ires">${loanRes()}</div></div>`)}
 const k=P==='Armed forces'?'post':P==='All India Services'?'transfer':null;
 if(k&&pf[k]){const n=mdiff(pf[k]),what=k==='post'?'posting':'transfer';
  out.push(card('Your next '+what,n==null?'':n>0?`Expected in about ${plural(n)}. A move often means paying for two homes for a few weeks. ${p.fx>0?`Setting aside ${R(Math.ceil(p.fx/n))} a month would build one month of fixed costs (${R(p.fx)}) by then.`:'Add your fixed costs in Edit setup to size a buffer.'}`:`That month has arrived or passed. Update the date in Edit setup so your buffer plan stays current.`))}
 if(P==='OCI'){const sup=+pf.sup||0,c=fxCur(),r=fxRate(c);
  if(sup>0)out.push(card('Family support in India',`${R(sup)} a month${st.income>0?`, about ${Math.round(sup/st.income*100)}% of your India income`:''}.${r>0?` At today's rate that is about ${c} ${fnum(sup/r)}.`:' Set a rate in the currency calculator to see it in '+E(c)+'.'}`))}
 if(P==='BPL family'){const hh=+pf.hh||0,sch=Array.isArray(pf.sch)?pf.sch:[],q=((pd().q||[]).find(x=>x.k==='sch')||{}).o||[],miss=q.filter(x=>!sch.includes(x));
  if(hh>0&&st.income>0)out.push(card('Income per person',`Your household income works out to about ${R(st.income/hh)} per person a month, or ${R(st.income/hh/30)} a day.`));
  if(miss.length)out.push(card('Support you may not be claiming',`You did not tick: ${miss.map(E).join(', ')}. Eligibility depends on your state and your family, so ask at your nearest Common Service Centre. Never pay anyone to approve a benefit.`))}
 if(P==='Senior citizen'&&+pf.med>0){const med=+pf.med;
  out.push(card('Medical money',`You spend about ${R(med)} a month on medicines and doctors${st.income>0?', '+Math.round(med/st.income*100)+'% of your income':''}. A year of that is ${R(med*12)}, and many families keep about that much in a separate medical reserve.${m.emerg>0?` Your savings and emergency fund stand at ${R(m.emerg)}.`:''}`))}
 return out.length?'<div class="h3s">Your numbers</div>'+out.join(''):''}
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
 <div class="tl"><button data-a="go" data-t="spends" data-f="1"><span class="ti">${I.plus}</span>Add spend</button><button data-a="go" data-t="plan"><span class="ti">${I.plan}</span>Allocate</button><button data-a="go" data-t="plan"><span class="ti">${I.spark}</span>AI plan</button><button data-a="go" data-t="goals"><span class="ti">${I.goals}</span>Goals</button></div>
 <div class="tl" style="margin-top:10px;grid-template-columns:1fr"><button data-a="go" data-t="ask"><span class="ti">${I.ask}</span>Ask the advisor how to plan ahead</button></div>${verdictTile()}${isO()?fxTile():''}${isW()?invTile():''}
 <div class="h3s">This month</div>
 <div class="st3"><div><small>Income</small><b>${R(st.income)}</b></div><div><small>Committed</small><b>${R(p.fx+p.rq)}</b></div><div><small>Spent</small><b>${R(m.spentM)}</b></div></div>
 <div class="h3s">Recent</div>${ev.length?rows(ev)+'<div style="margin-top:12px"><button class="btn gho sm" data-a="go" data-t="spends">See all spends</button></div>':'<div class="em">Nothing yet. Add your first spend and it will show up here.</div>'}
${insightCards()}
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
 ${verdictTile()}<div class="h3s">Your jars</div>${jar3()}
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
 <div class="tt3"><button data-a="go" data-t="spends" data-f="1"><span>➕</span>Spend</button><button data-a="go" data-t="plan"><span>💰</span>Save</button><button data-a="go" data-t="goals"><span>🎯</span>Goals</button></div>${verdictTile()}
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
const invTile=()=>`<div class="tl" style="margin-top:10px;grid-template-columns:1fr"><button data-a="go" data-t="invest"><span class="ti">📈</span>Invest and tax: SIP, FD, ITR</button></div>`;
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
function tabInvest(){
 const V=INV(),secs=[['ready','Ready?'],['sip','SIP'],['fd','FD'],['when','What suits'],['compare','Compare'],['itr','ITR']],p=plan(),iv=st.inv;
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
 <div class="cd" style="margin-bottom:14px"><label for="va">${isL()?'Want to buy something? Check your Spend jar first':'Thinking of buying something? Check first'}</label><input id="va" type="number" inputmode="numeric" min="0" placeholder="Price in ₹" value="${vamt||''}"><div id="vres">${verdictHTML()}</div></div>
 <div class="cd">${isO()?curRow():''}<label for="sa">Amount (<span id="sal">${scur==='INR'?'₹':scur}</span>)</label><input id="sa" type="number" inputmode="numeric" min="0" placeholder="0">
 <div class="cats" role="group" aria-label="Category">${catP().map(c=>`<button type="button" class="chip" data-a="cat" data-c="${c}" aria-pressed="${cat===c}">${c}</button>`).join('')}</div>
 ${isL()?nwHTML():''}<input id="sn" type="text" maxlength="60" placeholder="Note (optional)" aria-label="Note">
 <button class="btn pri" style="width:100%" data-a="spend">Add spend</button></div>
 ${groups.length?groups.map(g=>`<div class="dh"><span>${g.l}</span><span>${R(sum(g.items,x=>x.a))}</span></div><div class="fl">${g.items.map(s=>`<div><span>${E(s.n||s.c||'Spend')}<small>${s.c?E(s.c):'Uncategorised'}${s.w?' · '+(s.w==='n'?'Need':'Want'):''}${s.fx?' · '+E(s.fx.c)+' '+fnum(s.fx.amt)+' at ₹'+fnum(s.fx.rate):''}</small></span><span class="rr"><b class="neg2">-${R(s.a)}</b><button data-a="delspend" data-id="${E(s.id)}" aria-label="Delete this spend">×</button></span></div>`).join('')}</div>`).join(''):'<div class="em" style="margin-top:18px">No spends yet. Add your first one above.</div>'}`;
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
 ${st.goals.length>=GOAL_LIMIT&&SW.data.tier!=='paid'?'<p class="fn">Core includes 2 goal vaults. Copilot, coming soon, adds unlimited vaults.</p>':''}<div style="margin-top:16px"><button class="btn gho" data-a="edit" data-s="goals">${st.goals.length?'Edit goals':'Add a goal'}</button></div>`;
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
  return{profile:SW.data.profile||'unspecified',monthly_income:st.income,existing_savings:st.savings,debts_owed:st.debt||0,about_you:pfSafe(),dependents:st.dependents||0,
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
    if(tab==='ask'&&$('alog')){drawChat($('alog'),$('aqs'),st.chat||[],chatBusy,pd().ask||APP_QS,chatErr);const b=$('aform')&&$('aform').querySelector('button');if(b)b.disabled=chatBusy}
    return}
  drawChat($('lclog'),$('lcqs'),landChat.msgs,landChat.busy,LAND_QS,landChat.err);
  const b=$('lcsend');if(b)b.disabled=!!landChat.busy;
}
async function sendChat(store,text,app){
  const q=String(text||'').trim().slice(0,800);if(!q||store.busy)return;
  if(!aiReady()){toast('AI is not connected yet. You can still explore SpendWise without it.',1);return}
  if(!app&&landChat.n>=8){landChat.err='That is the end of the preview. Open the app to keep chatting with your own numbers.';paintChat(false);return}
  store.err='';store.msgs.push({role:'user',content:q});store.busy=true;if(!app)landChat.n++;
  if(app)await save();
  paintChat(app);
  try{
    const sys=app?CHAT_SYS_APP+(pd().sys?'\n\nAbout this person: '+pd().sys:''):CHAT_SYS_PUBLIC;
    const snap=app?chatSnap():null;
    const history=store.msgs.filter(m=>!m.local).slice(-10);
    while(history.length&&history[0].role!=='user')history.shift();
    const messages=[{role:'system',content:sys+(snap?'\n\nNumbers snapshot (no identity):\n'+JSON.stringify(snap):'')},...history];
    const reply=(await aiAsk(messages,{temperature:.45,max_tokens:900})).trim();
    if(!reply)throw new Error('The advisor sent an empty reply. Please try again.');
    store.msgs.push({role:'assistant',content:reply.slice(0,4000)});
  }catch(e){
    /* errors are shown, never stored in the history. The question goes back in the box so nothing is lost. */
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
  <form class="chatin" id="aform"><textarea id="ainput" rows="1" maxlength="800" placeholder="Ask about your plan, a tight month, or the next few years…" aria-label="Message the SpendWise advisor"></textarea>
  <button class="btn pri" type="submit"${chatBusy?' disabled':''}>Send</button></form></div>
  <p class="fn">The advisor sees your numbers only — never your name or email. General guidance, not regulated financial advice.</p>`;
}
/* ===== Weekly AI statement ===== */
let statementBusy=false;
const weekRange=()=>{const end=new Date(),start=new Date(end);start.setDate(start.getDate()-6);start.setHours(0,0,0,0);return{start,end,from:start.toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}),to:end.toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}};
function weeklySnapshot(){
 const {start,end}=weekRange(),items=st.spends.filter(x=>{const d=new Date(x.t);return d>=start&&d<=end}).sort((a,b)=>a.t-b.t);
 const cycles=st.cycles.filter(x=>{const d=new Date(x.t);return d>=start&&d<=end}).sort((a,b)=>a.t-b.t);
 const categories={};for(const x of items){const k=x.c||'Uncategorised';categories[k]=(categories[k]||0)+(+x.a||0)}
 const daily={};for(const x of items){const k=new Date(x.t).toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short'});daily[k]=(daily[k]||0)+(+x.a||0)}
 const total=sum(items,x=>+x.a||0),m=money(),p=plan();
 return{period:{from:start.toISOString().slice(0,10),to:end.toISOString().slice(0,10)},currency:'INR',spend_count:items.length,total_spent:total,average_per_record:items.length?Math.round(total/items.length):0,category_totals:categories,daily_totals:daily,transactions:items.map(x=>({date:new Date(x.t).toISOString().slice(0,10),amount:+x.a||0,category:x.c||'Uncategorised',need_or_want:x.w==='n'?'Need':x.w==='w'?'Want':null})),income_allocations_recorded:cycles.map(x=>({date:new Date(x.t).toISOString().slice(0,10),income:+x.income||0,fixed_commitments:+x.b||0,goals:+x.g||0,emergency:+x.e||0,investments:+x.i||0,safe_to_spend:+x.s||0})),current_context:{monthly_income:+st.income||0,monthly_fixed_commitments:p.fx,goals:st.goals.map(g=>({name:String(g.n||'Goal').slice(0,40),target:+g.t||0,saved:+g.s||0})),safe_to_spend_now:m.safeNow,emergency_savings:m.emerg,invested_so_far:m.invest},data_notes:items.length<3?'Very little transaction data is available; avoid strong conclusions.':''};
}
async function makeWeeklyStatement(){
 if(statementBusy)return;
 if(!aiReady())return toast('AI is not connected yet. Connect the existing AI proxy to generate the overview.',1);
 if(!window.jspdf?.jsPDF)return toast('PDF generator did not load. Check your connection and reload SpendWise.',1);
 statementBusy=true;const btn=root.querySelector('[data-a="weekly-statement"]');if(btn){btn.disabled=true;btn.textContent='Generating your statement…'}
 try{
  const snap=weeklySnapshot(),range=weekRange();
  const system=`You are SpendWise, a careful personal-finance habit analyst. Write a concise, useful weekly financial habits overview for a PDF report. Use only the supplied data. Never invent transactions, trends, comparisons, motives, or financial facts. If data is sparse, say so plainly. Distinguish recorded spending from monthly plan context. Do not present yourself as a regulated financial adviser. Return plain text only with these exact section headings: WEEK AT A GLANCE; WHERE THE MONEY WENT; HABITS AND PATTERNS; ONE THING TO IMPROVE; NEXT WEEK'S PLAN. Use short paragraphs and bullets with ASCII characters, no markdown tables. Mention currency as INR / rupees. Keep it under 550 words.`;
  const overview=(await aiAsk([{role:'system',content:system},{role:'user',content:'Create the weekly overview for '+range.from+' to '+range.to+'. Here is the financial data (JSON):\n'+JSON.stringify(snap)}],{temperature:.25,max_tokens:900,timeout:60000})).trim();
  if(!overview)throw new Error('The AI returned an empty overview. Try again.');
  const {jsPDF}=window.jspdf,doc=new jsPDF({unit:'mm',format:'a4'});const W=210,H=297,left=18,right=18;
  doc.setFillColor(3,7,18);doc.rect(0,0,W,H,'F');
  doc.setTextColor(52,211,153);doc.setFont('helvetica','bold');doc.setFontSize(23);doc.text('SpendWise',left,22);
  doc.setTextColor(226,232,240);doc.setFontSize(15);doc.text('Weekly financial statement',left,32);
  doc.setTextColor(148,163,184);doc.setFont('helvetica','normal');doc.setFontSize(10);doc.text(range.from+' - '+range.to,left,39);
  const total=snap.total_spent, tx=snap.spend_count;
  doc.setFillColor(11,18,32);doc.roundedRect(left,47,W-left-right,29,4,4,'F');
  doc.setTextColor(148,163,184);doc.setFontSize(9);doc.text('TOTAL RECORDED SPENDING',left+6,56);doc.text('TRANSACTIONS',left+104,56);
  doc.setTextColor(52,211,153);doc.setFont('helvetica','bold');doc.setFontSize(18);doc.text('Rs '+Math.round(total).toLocaleString('en-IN'),left+6,68);doc.text(String(tx),left+104,68);
  let y=87;doc.setFont('helvetica','normal');doc.setFontSize(10);doc.setTextColor(226,232,240);
  const clean=overview.replace(/[₹]/g,'Rs ').replace(/[–—]/g,'-').replace(/[•●]/g,'-').replace(/[^\x09\x0A\x0D\x20-\x7E]/g,'');
  const lines=doc.splitTextToSize(clean,W-left-right);
  for(const line of lines){if(y>H-18){doc.addPage();doc.setFillColor(3,7,18);doc.rect(0,0,W,H,'F');y=20;doc.setTextColor(226,232,240);doc.setFont('helvetica','normal');doc.setFontSize(10)}doc.text(line,left,y);y+=5.1}
  const pages=doc.getNumberOfPages();for(let i=1;i<=pages;i++){doc.setPage(i);doc.setFontSize(8);doc.setTextColor(100,116,139);doc.text('Generated from your SpendWise records. AI insights may be imperfect.',left,H-9);doc.text(i+' / '+pages,W-right,H-9,{align:'right'})}
  const file='SpendWise-Weekly-Statement-'+range.start.toISOString().slice(0,10)+'.pdf';doc.save(file);toast('Your weekly statement PDF is ready.');
 }catch(e){toast(e?.message||'Could not generate the statement. Try again.',1)}
 finally{statementBusy=false;if(tab==='more')render()}
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
 <div class="fl"><div><span>Plan</span><b>${SW.data.tier==='paid'?'Copilot':'Core (free)'}</b></div><div><span>${E(incLabel())}</span><b>${R(st.income)}</b></div><div><span>Existing savings</span><b>${R(st.savings)}</b></div>${L?`<div><span>Quest XP</span><b>⭐ ${st.learn.xp}</b></div>`:`<div><span>Debts you owe</span><b>${R(st.debt||0)}</b></div><div><span>Dependents</span><b>${st.dependents||0}</b></div><div><span>Fixed commitments</span><b>${R(p.fx)}</b></div>`}${ans}</div>
 ${!L&&st.fixed.length?'<div class="fl" style="margin-top:10px">'+st.fixed.map(x=>`<div><span>${E(x.n||'Item')}</span><b>${R(+x.a||0)}</b></div>`).join('')+'</div>':''}
 <div style="margin-top:12px"><button class="btn gho" data-a="edit" data-s="${L?'money':'basics'}">Edit setup</button></div>
 <div class="h3s">Weekly statement</div>
 <div class="cd"><b>Your money habits, reviewed weekly.</b><p class="s2" style="margin-top:6px">Generate a PDF with your last 7 days of recorded spending, category breakdown, AI observations, and a practical plan for next week. The report only uses data available in SpendWise.</p>
 <button class="btn pri" style="width:100%;margin-top:14px" data-a="weekly-statement" ${statementBusy?'disabled':''}>${statementBusy?'Generating your statement…':'✦ Generate weekly PDF'}</button>
 <p class="fn">AI observations are based on recorded data and may be imperfect. This is general guidance, not regulated financial advice.</p></div>
 <div class="h3s">AI and privacy</div>
 <div class="cd"><b>${aiReady()?'AI is connected':'AI is not connected yet'}</b><p class="s2" style="margin-top:6px">When it is on, the AI only receives your numbers and choices: income, costs, goals and the multiple-choice answers in your profile. It never receives your name, email or anything you typed as free text. You choose whether to apply what it suggests.</p></div>
 ${SW.data.tier==='paid'?'':'<div class="h3s">Copilot</div><div class="cd"><b>'+(SW.data.waitlisted?'You are on the Copilot waitlist':'Copilot is coming soon')+'</b><p class="s2" style="margin-top:6px">Copilot adds unlimited goal vaults, and is planned to add automatic UPI and bank sync, predictive AI verdicts and deeper insights. Payments are not open yet, so nothing is charged.</p>'+(SW.data.waitlisted?'':'<button class="btn gho" style="margin-top:14px" data-a="upgrade">Join the waitlist</button>')+'</div>'}
 <div class="h3s">Your data</div>
 <div class="cd"><b>Back up your data</b><p class="s2" style="margin-top:6px">Your data lives only on this device. Download an encrypted backup file and keep it safe, so clearing your browser or changing phones never wipes your plan. ${SW.data.lastBackup?'Last backup: '+new Date(SW.data.lastBackup).toLocaleDateString('en-IN')+'.':'You have not made a backup yet.'}</p>
 <div class="row" style="margin-top:14px"><button class="btn pri" data-a="backup">Download backup</button><button class="btn gho" data-a="restore">Restore from backup</button></div><input type="file" id="rfile" accept=".json,application/json" hidden></div>
 ${u.google?'':'<div class="cd" style="margin-top:12px"><b>Recovery code</b><p class="s2" style="margin-top:6px">'+(SW.hasRecovery()?'A recovery code is set up. If you forget your password, use Forgot your password on the sign-in screen.':'Without a recovery code, a forgotten password means your data is gone for good. Set one up now.')+'</p><button class="btn gho" style="margin-top:14px" data-a="recov">'+(SW.hasRecovery()?'Create a new code':'Set up a recovery code')+'</button></div>'}
 <div class="h3s">Account</div><div class="row"><button class="btn gho" data-a="logout">Sign out</button><button class="btn gho" data-a="delacct" style="color:var(--rd)">Delete account</button></div>
 <p class="fn" style="margin-top:22px">SpendWise plans and tracks your money. It does not move real money between accounts. Your data is encrypted on this device.</p>`;
}
const navItems=()=>{const L=isL();return[['home','Home',I.home],['spends','Spends',I.spends],['plan',L?'Jars':'Plan',I.plan],['goals',L?'Dream':'Goals',I.goals],['ask','Ask',I.ask],['more','More',I.more]]};
function render(){
 if(!st.done){wizard();return}
 root.classList.toggle('big',!!pd().big);
 const body={home:tabHome,spends:tabSpends,plan:tabPlan,goals:tabGoals,ask:tabAsk,more:tabMore,invest:tabInvest,fx:tabFx}[tab]();
 if(SW.setTab)SW.setTab(tab); /* remember the current tab so a reload returns here */
 root.innerHTML=`<div class="pg">${body}${tab==='home'?nudge():''}</div><nav class="nv" aria-label="App"><div>${navItems().map(n=>`<button data-a="go" data-t="${n[0]}" ${({invest:'plan',fx:'home'}[tab]||tab)===n[0]?'aria-current="page"':''}>${n[2]}${n[1]}</button>`).join('')}</div></nav>`;
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
 const raw=+($('sa').value)||0,n=$('sn').value.trim().slice(0,60);let a=Math.min(1e9,Math.round(raw)),fx=null;
 if(isO()&&scur!=='INR'&&raw>0){const r=fxRate(scur);if(!(r>0)){toast('Enter the rate for '+scur+' first.',1);return false}a=Math.min(1e9,Math.round(raw*r));fx={c:scur,amt:raw,rate:r}}
 if(a<=0){toast('Enter the amount you spent.',1);$('sa').focus();return false}
 st.spends.push({id:Date.now()+'-'+Math.random().toString(36).slice(2,6),t:Date.now(),k:mk(),a,n,c:cat,w:isL()?nw:'',...(fx?{fx}:{})});
 let xp='';if(isL()){const td=new Date().toDateString();if(st.learn.logged!==td){st.learn.logged=td;st.learn.xp+=5;xp=' +5 XP ⭐'}}
 toast('Added '+R(a)+(cat?' · '+cat:'')+xp);cat='';nw='';return true;
}

/* ===== AI (optional) =====
   Sends only numbers. Never the name or email. The answer is validated and shown to the user, who decides to apply it. */
async function aiAsk(messages,opt={}){
  const direct=!AI_CONFIG.ENDPOINT,headers={'Content-Type':'application/json'};
  if(direct){headers.Authorization='Bearer '+AI_CONFIG.DIRECT_KEY;headers['X-Title']='SpendWise'}
  const body={messages,temperature:opt.temperature??.2,max_tokens:opt.max_tokens??700};if(AI_CONFIG.MODEL)body.model=AI_CONFIG.MODEL;
  const ctl=new AbortController(),to=setTimeout(()=>ctl.abort(),opt.timeout||45000);
 let r;try{r=await fetch(direct?'https://openrouter.ai/api/v1/chat/completions':AI_CONFIG.ENDPOINT,{method:'POST',headers,body:JSON.stringify(body),signal:ctl.signal})}
 catch{throw new Error('Could not reach the AI service. Check your connection and try again.')}finally{clearTimeout(to)}
 if(!r.ok)throw new Error(r.status===402?'The AI service is out of credits.':r.status===429?'The free AI is at its usage limit right now. Wait a minute and try again, or come back later.':'The AI request failed ('+r.status+').');
 const j=await r.json(),content=j.choices?.[0]?.message?.content;
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
 aiBusy=true;aiErr='';render();
 try{st.sug=await aiAllocate();await save()}catch(e){aiErr=e.message||'Something went wrong.'}
 aiBusy=false;render();
}

/* ===== backup nudge, restore, and cross-tab refresh ===== */
function nudge(){const L=SW.data.lastBackup||0;
 if(!st.done||(!st.spends.length&&!st.cycles.length)||Date.now()-L<30*864e5)return'';
 return`<div class="al" style="margin-top:22px"><b>Back up your data</b><span>${L?'Your last backup is over a month old.':'Your data lives only on this device. A backup file protects it if you clear your browser or change phones.'}</span><button class="btn pri" data-a="backup">Download backup</button></div>`}
async function doRestore(file){
 const r=await SW.restore(file);
 if(r==='cancel')return;
 if(r==='bad')return toast('That is not a SpendWise backup file.',1);
 if(r==='pw')return toast('Wrong backup password.',1);
 if(!confirm('Replace your current data with the backup from '+new Date(r.at).toLocaleDateString('en-IN')+'? This cannot be undone.'))return;
 const tier=SW.data.tier;SW.data=Object.assign(r.data,{tier});delete SW.data.acct;
 try{await SW.save()}catch{return toast('Could not save the restored data on this device.',1)}
 SW.resume={tab:'more'};start(root);toast('Backup restored.')}
SW.refresh=(d,t)=>{if(!root||!st||!st.done||!d||!d.setup||!d.setup.done)return false;SW.data=d;SW.resume={tab:t};start(root);toast('Updated from another tab.');return true};
/* re-draw the current screen without jumping the scroll position */
function rr(m){const y=scrollY;if(st.done){render();if(m)toast(m,1)}else wizard(m||'');scrollTo(0,y)}
/* ===== start ===== */
function start(r){
 root=r;st=Object.assign(blank(),SW.data.setup||{});
 /* a page reload restores the tab the person was on (SW.resume is set by restoreSession in index.html) */
 tab=['home','spends','plan','goals','ask','more','invest','fx'].includes(SW.resume&&SW.resume.tab)?SW.resume.tab:'home';SW.resume=null;
 cat='';nw='';scur='INR';vamt=0;game=null;aiBusy=false;aiErr='';chatBusy=false;chatErr='';
 if(!Array.isArray(st.chat)||!st.chat.length)st.chat=[{role:'assistant',content:CHAT_HELLO,local:true}];
 if(!st.v||st.v<3){ /* earlier builds pre-filled percentages; clear them so nothing is a default */
  st.rules={e:null,i:null,em:null};st.v=3;delete st.bal;save()}
 st.rules=Object.assign({e:null,i:null,em:null},st.rules);
 st.pf=st.pf&&typeof st.pf==='object'&&!Array.isArray(st.pf)?st.pf:{};
 st.inv=Object.assign({sip:{},fd:{},tx:{},loan:{}},st.inv);['sip','fd','tx','loan'].forEach(k=>st.inv[k]=Object.assign({},st.inv[k]));fixTeen();
 st.fx=Object.assign({rates:{}},st.fx);st.fx.rates=Object.assign({},st.fx.rates);
 st.learn=Object.assign({xp:0},st.learn);st.learn.jars=Object.assign({s:0,v:0,d:0},st.learn.jars);
 /* nobody reaches the dashboard without a profile (Google sign-in starts with none) */
 if(!SW.data.profile){st.done=false;st.step=0}
 else if(isL()&&st.done&&!(st.learn.jars.s+st.learn.jars.v+st.learn.jars.d)){st.done=false;st.step=1}
 st.spends.forEach((s,i)=>{if(!s.id)s.id=s.t+'-'+i});
 if(!window.__swFlush){window.__swFlush=1; /* save unsaved setup answers when the tab is hidden or closed */
  const flush=()=>{if(st&&SW.data&&SW.key&&SW.user){SW.data.setup=st;SW.localWrite().catch(()=>{})}};
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')flush()});addEventListener('pagehide',flush)}
 if(window.SW_MEM)setTimeout(()=>toast('Your browser is blocking storage, so your data will be lost when you close this tab.',1),600);
 if(!root.dataset.b){root.dataset.b=1;
  root.addEventListener('input',e=>{const t=e.target;
   if(t.id==='va'){vamt=Math.min(1e9,Math.max(0,+t.value||0));const o=$('vres');if(o)o.innerHTML=verdictHTML();return}
   if(t.id==='sr'){st.fx.rates[scur]={r:Math.max(0,+t.value||0),at:Date.now()};return}
   if(t.dataset.fx){const k=t.dataset.fx;if(k==='rate')st.fx.rates[fxCur()]={r:Math.max(0,+t.value||0),at:Date.now()};else if(k==='amt')st.fx.amt=Math.max(0,+t.value||0);const o=$('fres');if(o)o.innerHTML=fxRes();return}
   if(t.dataset.c){const[g,k]=t.dataset.c.split('.');st.inv[g][k]=t.value===''?'':+t.value;const o=$('ires');if(o)o.innerHTML=g==='sip'?sipRes():g==='loan'?loanRes():fdRes();return}
   if(t.dataset.r){const k=t.dataset.r,mx=k==='em'?24:50;st.rules[k]=t.value===''?null:Math.max(0,Math.min(mx,+t.value||0));fixTeen();refreshPlan();return}
   const f=t.dataset.f;if(!f)return;const v=t.type==='number'?Math.min(1e9,Math.max(0,+t.value||0)):t.value;
   if(f.includes('.')){const[l,k]=f.split('.');if(t.dataset.i==null||t.dataset.i==='')st[l][k]=v;else st[l][+t.dataset.i][k]=v}else st[f]=v});
  root.addEventListener('change',e=>{const t=e.target;if(t.id==='rfile'){const f=t.files&&t.files[0];t.value='';if(f)doRestore(f);return}
   if(t.id==='sc'){scur=t.value;const w=$('srw');if(w){w.hidden=scur==='INR';const l=$('srl');if(l)l.textContent='Rupees per 1 '+scur;const r=$('sr');if(r)r.value=fxRate(scur)||''}const s=$('sal');if(s)s.textContent=scur==='INR'?'₹':scur;return}
   if(t.id==='sr'){save();return}
   if(t.dataset.fx){if(t.dataset.fx==='cur'){st.fx.cur=t.value;save();rr()}else save();return}
   if(t.dataset.c)save();if(t.dataset.r){const v=st.rules[t.dataset.r];if(v!=null)t.value=v;save()}});
  root.addEventListener('keydown',async e=>{if(e.key==='Enter'&&(e.target.id==='sa'||e.target.id==='sn')){e.preventDefault();if(spendBusy)return;spendBusy=true;try{if(addSpend()){await save();render()}}finally{spendBusy=false}}});
  root.addEventListener('click',async e=>{const b=e.target.closest('[data-a]');if(!b)return;const a=b.dataset.a;
   if(a==='go'){tab=b.dataset.t;render();scrollTo(0,0);if(b.dataset.f&&$('sa'))$('sa').focus();if(b.dataset.v&&$('va'))$('va').focus()}
   else if(a==='cat'){cat=cat===b.dataset.c?'':b.dataset.c;root.querySelectorAll('[data-a=cat]').forEach(x=>x.setAttribute('aria-pressed',x.dataset.c===cat))}
   else if(a==='spend'){if(spendBusy)return;spendBusy=true;try{if(addSpend()){await save();render()}}finally{spendBusy=false}}
   else if(a==='delspend'){if(!confirm('Delete this spend?'))return;st.spends=st.spends.filter(s=>s.id!==b.dataset.id);await save();render();toast('Spend removed.')}
   else if(a==='alloc'){allocate();await save();render()}
   else if(a==='ai')runAI();
   else if(a==='aiapply'){const s=st.sug;st.rules={e:s.e,i:s.i,em:s.em};st.sug=null;await save();render();toast('Rules updated. Review them, then allocate.')}
   else if(a==='aidismiss'){st.sug=null;await save();render()}
   else if(a==='weekly-statement'){makeWeeklyStatement()}
   else if(a==='logout')SW.logout();
   else if(a==='delacct'){if(!confirm('Delete your account and all your SpendWise data? This cannot be undone.'))return;const ok=await SW.deleteAccount();if(!ok)toast('Could not delete the account right now. Check your connection and try again.',1)}
   else if(a==='backup'){SW.data.setup=st;const r=await SW.backup();if(r===true){toast('Backup downloaded. Keep it somewhere safe.');rr()}else if(r==='short')toast('Use at least 8 characters for the backup password.',1)}
   else if(a==='restore'){const f=$('rfile');if(f)f.click()}
   else if(a==='recov'){const r=await SW.recovery();if(r==='bad')toast('That password is not right.',1);else if(r==='ok')toast('Recovery code saved. Keep it somewhere safe.');rr()}
   else if(a==='getrate')getRate(tab==='fx'?fxCur():scur);
   else if(a==='fxdir'){st.fx.dir=b.dataset.v;await save();rr()}
   else if(a==='vlog'){const sc=$('sc');if(sc&&sc.value!=='INR'){sc.value='INR';sc.dispatchEvent(new Event('change',{bubbles:true}))}const e=$('sa');if(e){e.value=Math.round(vamt);e.focus()}}
   else if(a==='upgrade')SW.upgrade();
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
   else if(a==='ag'){if(st.goals.length>=GOAL_LIMIT&&SW.data.tier!=='paid')return wizard('Core includes 2 goal vaults. Copilot, coming soon, adds unlimited vaults.');st.goals.push({n:b.dataset.p,t:0,s:0,d:''});wizard()}
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
     st.done=true;await save();render();scrollTo(0,0);if(L)toast('Quest complete! +50 XP ⭐')}}});}
 render();
}
SW.start=start;
bindChatBox($('lclog'),$('lcqs'),$('lcform'),$('lcinput'),landChat,false,LAND_QS);
})();
