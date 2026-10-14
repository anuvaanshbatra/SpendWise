/* SpendWise profiles — the ONE place to edit per-profile content.
   app.js reads window.SW_PROFILES. To change a profile, edit its block here; no other file needs touching.

   Every profile can define:
     ic, tag, blurb   shown on the profile picker box
     inc              label for the main income field
     fx, gp           quick-add buttons for fixed commitments and goals (names only, never amounts)
     cats             spend categories shown when logging a spend
     q                extra setup questions. Types: number, text, month, select (with o:[...]), chips (with o:[...])
                      Answers are saved in your encrypted vault. Only numbers and choices are sent to the AI, never free text.
     tips             cards shown on Home under "For you". Keep them general guidance, never named products.
     ask              quick questions shown in the Ask tab
     sys              one extra paragraph added to the AI advisor's instructions for this profile
     big              true = larger text and buttons (used for senior citizens)
     bank             which education sections to show. Values: minor, schemes, basic, simple, nri, full. Omit for none.
   Learner has its own game-style flow in app.js and uses the SW_LEARN data below. */
window.SW_PROFILES={
order:['Learner','Teen','Young adult','Working professional','Senior citizen','Armed forces','All India Services','OCI','BPL family'],

'Learner':{ic:'🎒',tag:'New to money',blurb:'Play, learn and save for a dream.',
 inc:'Monthly pocket money',cats:['Snacks','Games','Toys','Books','Gifts','Other'],
 ask:['What is saving?','Why can I not spend it all?','How do I get my dream faster?','What is a budget?'],
 sys:'The person is a child learning money basics. Use very short sentences and simple words, and use examples like snacks, games and toys. Be friendly and encouraging. Explain the idea behind any word like budget or saving. For big money decisions, tell them to talk with a parent or guardian. Never discuss investing products or loans.'},

'Teen':{ic:'🎧',tag:'Allowance and side hustles',blurb:'Treat your first income like a pro.',compact:true,
 bank:'minor',
 inc:'Money in a month (allowance + hustle)',lbl:{savings:'Saved so far (₹)',debt:'Owe anyone? (₹)'},hide:['dependents'],
 copy:{basics:['Your money 💸','Takes a minute.'],fixed:['Regular costs','Phone, subscriptions, fees. Skip if none.'],goals:['Saving for? 🎯','Pick one and a date.']},
 fx:['Phone recharge','Subscriptions','Class fees','Transport'],gp:['Phone or gadget','Trip with friends','A course','Emergency fund'],
 cats:['🍔 Food','🚌 Travel','🛍️ Shopping','🎮 Games','🎉 Fun','➕ Other'],
 q:[{k:'src',l:'Money mostly from',t:'select',o:['Pocket money','Side hustle','Both']},
    {k:'hustle',l:'Hustle income a month (₹)',t:'number',ph:'0 if none'},
    {k:'inv',l:'Saving or investing right now?',t:'chips',o:['Nothing yet','Have a savings account','Have a fixed or recurring deposit','A parent invests for me','Want to start learning']}],
 tips:[{e:'💸',t:'Pay yourself first',b:'Save a bit before you spend.'},
       {e:'📉',t:'Plan for your low month',b:'Hustle money goes up and down. Plan on the worst month.'},
       {e:'⏳',t:'Wait 24 hours',b:'Most wants fade by tomorrow.'}],
 ask:['How do I save from irregular income?','Should I buy this now or wait?','I am in 10th. How do I choose a stream?','What does JEE coaching cost and how do I plan for it?'],
 sys:'The person is a teenager with an allowance and maybe a side hustle. Keep replies short, light and non-preachy. Suggest talking to a parent or guardian before any loan, credit or investing decision. They may ask about choosing a stream after 10th, PCM, JEE or IIT preparation and what coaching costs. For these, ask at most two clarifying questions, give ordered steps with rough timelines and a Plan B, label every cost range as an estimate, tell them to confirm dates, fees and eligibility on official sources, and if they sound stressed or pressured, be kind and suggest talking to a trusted adult.'},

'Young adult':{ic:'🎓',tag:'College, fees and first jobs',blurb:'Fees, loans and a part-time salary, planned.',
 bank:'basic',
 inc:'Monthly income or stipend',
 fx:['Hostel or rent','College fees','Education loan EMI','Phone and internet','Subscriptions'],gp:['Laptop','Trip','Fee reserve','Emergency fund'],
 cats:['Food','Travel','Shopping','Bills','Fun','Other'],
 q:[{k:'status',l:'What best describes you?',t:'select',o:['Full-time student','Student with a job','Recently graduated']},
    {k:'eduloan',l:'Education loan still owed (₹, if any)',t:'number',ph:'0 if none'},
    {k:'repay',l:'Repayment starts (if known)',t:'month'}],
 tips:[{t:'Map fee dates first',b:'Add each fee as a fixed commitment. SpendWise then sets money aside every month, so a due date never becomes a scramble.'},
       {t:'Know your loan’s real cost',b:'Note the interest rate and when repayment starts. Interest often keeps adding up while you study, so check your loan terms.'},
       {t:'Keep a small buffer',b:'Even one month of basic costs set aside helps if a stipend or salary arrives late.'}],
 ask:['How do I plan my fees and loan?','What will my repayments feel like after graduation?','How much buffer should I keep?','Can I save while studying?'],
 sys:'The person is a college student or recent graduate in India, possibly with an education loan such as a medical student loan. Help them plan fees, living costs and how repayments will look after graduation.'},

'Working professional':{ic:'💼',tag:'Ages 30 to 60',blurb:'Your salary, split before you spend it.',
 bank:'full',
 inc:'Monthly take-home income',
 fx:['Rent','EMI / loan','Children’s school fees','Insurance','Subscriptions'],gp:['Home down payment','Child education','Vacation','Emergency fund','Retirement top-up'],
 cats:['Food','Travel','Shopping','Bills','Fun','Other'],
 q:[{k:'emp',l:'How do you earn?',t:'select',o:['Salaried','Self-employed','Business owner']},
    {k:'ins',l:'Health insurance',t:'select',o:['Yes','No','Not sure']}],
 tips:[{t:'Build the cushion first',b:'Many planners suggest three to six months of fixed costs set aside for emergencies. The Plan tab tracks yours.'},
       {t:'Watch your EMIs',b:'A common rule of thumb is to keep all EMIs well under half of take-home pay. More than that leaves little room for surprises.'},
       {t:'Check your cover',b:'Make sure you and your dependents have health cover that does not depend only on your employer.'}],
 ask:['SIP or FD for a 5-year goal?','How should I think about mutual funds?','How do I get ready for ITR?','How big should my emergency fund be?'],
 sys:'The person is a working professional in India, possibly with EMIs and dependents. Help them balance commitments, an emergency fund and long-term goals. You may explain categories such as savings accounts, FDs, RDs, PPF, NPS, debt and equity mutual funds, SIPs and how ITR works, including risk, lock-in and time horizon. Never name or recommend a specific fund, scheme, stock or bank, never promise or predict returns, and say clearly that returns can be negative. For personal investment advice point to a SEBI-registered adviser, and for tax filing to the official income tax portal or a qualified CA. Rules and dates change, so tell them to check current ones.'},

'Senior citizen':{ic:'🌿',tag:'Ages 60 and above',blurb:'Calm, clear, built around a fixed income.',big:true,
 bank:'simple',
 inc:'Monthly pension and other income',
 fx:['Medicines and doctor','Rent or maintenance','Insurance premium','Electricity and water','Help at home'],gp:['Health reserve','Family gathering','Home repair','A trip'],
 cats:['Medicines','Groceries','Bills','Family','Travel','Other'],
 q:[{k:'pension',l:'Your main income',t:'select',o:['Government pension','Private pension','Savings and interest','Family support']},
    {k:'med',l:'Medical costs in a month (₹)',t:'number',ph:'0 if none'}],
 tips:[{t:'Keep medical money apart',b:'Set aside a fixed amount for health every month, so a doctor’s visit never has to come from household money.'},
       {t:'Never share OTPs',b:'No bank, officer or helpline will ask for your OTP, PIN or card number. If someone asks, hang up and call the number on your own card.'},
       {t:'Match steady income to steady costs',b:'List the bills that come every month first. What is left is what you can spend freely.'}],
 ask:['How do I make my pension last?','How much should I keep for medical costs?','How do I spot a money scam?','How do I plan for my family’s needs?'],
 sys:'The person is a senior citizen on a fixed income in India. Use clear, calm, short sentences, no jargon, and warn gently about scams where relevant.'},

'Armed forces':{ic:'🎖️',tag:'Navy, Army and Air Force',blurb:'Built around pay, postings and life after service.',
 bank:'full',
 inc:'Monthly pay and allowances',
 fx:['Family housing','Children’s school fees','Home loan EMI','Insurance','Mess and other dues'],gp:['Relocation fund','Home after service','Child education','Emergency fund'],
 cats:['Food','Travel','Family','Bills','Shopping','Other'],
 q:[{k:'branch',l:'Branch',t:'select',o:['Navy','Army','Air Force']},
    {k:'post',l:'Next expected posting change',t:'month'}],
 tips:[{t:'Plan for the move',b:'A new posting often means travel, setting up a home and a few weeks of double costs. Add a relocation goal with the month of your next posting.'},
       {t:'Keep a posting buffer',b:'A small reserve makes a transfer or a delayed allowance easy to handle.'},
       {t:'Think past service',b:'Add a goal for life after service. A small monthly amount over many years goes a long way.'}],
 ask:['How do I plan for my next posting?','How do I prepare for life after service?','How do I keep family costs steady across postings?','How big should my buffer be?'],
 sys:'The person serves in the Indian Navy, Army or Air Force. Help with postings, relocation costs, family expenses across stations and planning for life after service.'},

'All India Services':{ic:'🏛️',tag:'IAS, IPS and IFoS',blurb:'Plan through every transfer.',
 bank:'full',
 inc:'Monthly take-home pay',
 fx:['Housing','Children’s school fees','Loan EMI','Insurance','Staff and help'],gp:['Relocation fund','Home of your own','Child education','Emergency fund'],
 cats:['Food','Travel','Family','Bills','Shopping','Other'],
 q:[{k:'svc',l:'Service',t:'select',o:['IAS','IPS','IFoS']},
    {k:'transfer',l:'Next expected transfer',t:'month'}],
 tips:[{t:'Budget that moves with you',b:'Transfers change rent, school and travel costs. Keep your fixed commitments up to date after every move.'},
       {t:'Cover the overlap',b:'A transfer can mean paying for two homes for a short time. A relocation goal covers that gap.'},
       {t:'Plan beyond one posting',b:'Set long-term goals that stay the same wherever you are posted.'}],
 ask:['How do I plan for a transfer?','How do I cover two homes for a while?','How do I plan long term across postings?','How much should I save for children’s education?'],
 sys:'The person is an All India Services officer (IAS, IPS or IFoS). Help with transfers, housing and family costs across stations and long-term goals.'},

'OCI':{ic:'🌏',tag:'Overseas Citizens of India',blurb:'Your money in India, in one view.',
 bank:'nri',
 inc:'Monthly income in India',
 fx:['Family support','Property expenses','Insurance','Loan EMI','Subscriptions'],gp:['India trip','Property','Family event','Emergency fund'],
 cats:['Food','Travel','Family','Bills','Shopping','Other'],
 q:[{k:'ctry',l:'Country you live in',t:'text',ph:'e.g. United States'},
    {k:'sup',l:'Family support in India (₹ a month)',t:'number',ph:'0 if none'}],
 tips:[{t:'Plan India costs in rupees',b:'List what you pay in India each month: family, property, bills. SpendWise keeps them in rupees so the plan is clear.'},
       {t:'Leave room for exchange rates',b:'Rates move. A small buffer means a weak month does not upset your plan.'},
       {t:'Ask before you move money',b:'Rules for sending money and taxes depend on your country. Check with a qualified professional.'}],
 ask:['How do I plan my India costs?','How big should my India buffer be?','How do I save for a property in India?','How do I plan for family support?'],
 sys:'The person is an Overseas Citizen of India managing money in India. Think in rupees, include a buffer for exchange rates, and remind them to check cross-border rules with a professional.'},

'BPL family':{ic:'🏡',tag:'Schemes and subsidies',blurb:'Know what support you can claim.',
 bank:'schemes',
 inc:'Monthly household income',
 fx:['Rent','Electricity and gas','School fees','Medicines','Loan repayment'],gp:['Health emergency','Festival','Child education','Home repair'],
 cats:['Food','Health','Bills','School','Travel','Other'],
 q:[{k:'hh',l:'People in your household',t:'number',ph:'e.g. 4'},
    {k:'sch',l:'Support you already receive (tap all that apply)',t:'chips',o:['Ration (PDS)','LPG subsidy','Health cover','Pension','Work scheme (MGNREGA)','Scholarship']}],
 tips:[{t:'Ask about what you can claim',b:'Ration, cooking gas, health cover, pensions and scholarships exist for eligible families. Ask at your nearest Common Service Centre or on the official government portal.'},
       {t:'Keep your papers ready',b:'Aadhaar, ration card and a bank passbook are asked for most often. Keep copies in one safe place.'},
       {t:'Save a little for lean months',b:'Even a very small amount set aside each month helps when work or income dips.'}],
 ask:['How do I find schemes I may qualify for?','How do I save a little every month?','How do I manage a month with less work?','How do I plan for a medical emergency?'],
 sys:'The person is from a low-income household in India. Use plain, short sentences. Mention that scheme eligibility varies and that they should confirm at a Common Service Centre or the official portal. Never promise a benefit.'}
};

/* Learner game content (used by the quest flow and the Want-or-Need game) */
window.SW_LEARN={
 dreams:['Bicycle','Video game','Books','Football','Art kit','Gift for someone'],
 levels:['Saver Seed','Coin Collector','Jar Keeper','Smart Spender','Money Hero'],
 jars:{
  s:{n:'Spend jar',ic:'🎈',c:'#fbbf24',why:'This is for fun things now: snacks, games, stickers. When the jar is empty you wait for next month. That is the whole lesson of a budget.'},
  v:{n:'Save jar',ic:'🛟',c:'#34d399',why:'This is your safety jar. It is for surprises, like a broken toy or a friend’s birthday. It is not for things you just want.'},
  d:{n:'Dream jar',ic:'⭐',c:'#c084fc',why:'This jar grows your big dream. A little every month beats one big wish. More coins here means you get your dream sooner.'}},
 whys:[
  {q:'What is pocket money for?',a:'It is your practice money. You decide where it goes, and you learn what happens when you choose. Smart choices now make big choices easier later.'},
  {q:'Why not spend it all?',a:'If you spend it all, a surprise has no money to land on. And a big dream needs many small savings. Keeping some is like giving your future self a gift.'},
  {q:'What is a budget?',a:'A budget is a plan for your money before you spend it. Our three jars are a budget: some for now, some for surprises, some for a dream.'},
  {q:'What is the difference between a need and a want?',a:'A need is something you must have, like food or school books. A want is something nice to have, like a new game. Needs come first, wants come from the Spend jar.'}],
 items:[
  {t:'School notebooks',k:'need',w:'You need notebooks to learn at school.'},
  {t:'A new video game skin',k:'want',w:'Fun, but your game works fine without it.'},
  {t:'Water bottle for school',k:'need',w:'Drinking water keeps you healthy.'},
  {t:'Ice cream with friends',k:'want',w:'A lovely treat, and a good use of the Spend jar.'},
  {t:'Medicine when you are sick',k:'need',w:'Staying well always comes first.'},
  {t:'A third pair of sneakers',k:'want',w:'You already have shoes you can wear.'},
  {t:'Warm clothes in winter',k:'need',w:'Staying warm is a need.'},
  {t:'Extra-large candy box',k:'want',w:'Tasty, but you can live happily without it.'},
  {t:'Bus fare to school',k:'need',w:'You must get to school.'},
  {t:'A fancy pencil case',k:'want',w:'Your old one still works, so this is a want.'},
  {t:'Lunch when you are hungry',k:'need',w:'Food is a need. Eating out at a fancy place is a want.'},
  {t:'A new toy because your friend has one',k:'want',w:'Wanting what friends have is normal. It is still a want.'},
  {t:'School shoes when yours are torn',k:'need',w:'Torn school shoes need replacing.'},
  {t:'Movie outing with friends',k:'want',w:'Great fun, so plan it from your Spend jar.'},
  {t:'A school textbook',k:'need',w:'You need it to study.'},
  {t:'Stickers and trading cards',k:'want',w:'Fun to collect, but not something you must have.'}]
};


/* Working professional: Invest and tax hub (education only, no product picks). Edit freely. */
window.SW_INVEST={
 note:'Education only. This is not investment, tax or legal advice, and SpendWise is not a SEBI-registered adviser. Rules, rates and dates change, so check official sources or a qualified professional before you act.',
 horizons:[
  {k:'Under 1 year',pick:['Savings account','Short FD','Liquid funds (a type of debt fund)'],why:'You cannot afford a dip when you need the money soon. Keep it safe and easy to reach.'},
  {k:'1 to 3 years',pick:['FD or RD','Short-term debt funds'],why:'Steady beats exciting here. A fall just before you need the money hurts most.'},
  {k:'3 to 5 years',pick:['Debt funds or FDs for most of it','A small share of equity funds, only if you can sit through dips'],why:'A middle path. The nearer the goal, the more it should lean to the safe side.'},
  {k:'5 years or more',pick:['Equity mutual funds through a SIP','PPF or NPS for retirement'],why:'Time helps you ride out the ups and downs. Expect some bad years along the way.'}],
 options:[
  {n:'Savings account',ic:'🏦',risk:'Low',lock:'None. You can withdraw any time.',good:'Money you may need any day.',watch:'Interest is low and counts as income for tax.'},
  {n:'Fixed deposit (FD)',ic:'🔒',risk:'Low',lock:'Fixed term. Leaving early usually costs a penalty.',good:'Money you need in 1 to 5 years.',watch:'Interest is taxed at your slab. Bank deposits are insured only up to a limit per depositor per bank (₹5 lakh when last checked).'},
  {n:'Recurring deposit (RD)',ic:'📅',risk:'Low',lock:'Fixed term with a fixed monthly amount.',good:'Building a lump sum with a steady monthly habit.',watch:'Interest is taxed like FD interest. Missing instalments can attract charges.'},
  {n:'PPF',ic:'🏛️',risk:'Low',lock:'Long term (15 years), with partial withdrawals only after some years.',good:'Steady, government-backed long-term saving.',watch:'The rate is set by the government and can change. Check current rules.'},
  {n:'NPS',ic:'🌅',risk:'Medium',lock:'Locked until retirement age, with limited early withdrawal.',good:'Saving for retirement.',watch:'Part of the money must buy a pension when you exit. Check current withdrawal rules.'},
  {n:'Debt mutual funds',ic:'📄',risk:'Medium',lock:'Usually none.',good:'1 to 3 year goals when you want something steadier than shares.',watch:'Returns are not guaranteed and can dip when interest rates move. Read the risk label (riskometer).'},
  {n:'Equity mutual funds',ic:'📈',risk:'High',lock:'Usually none. Tax-saving ELSS funds have a 3-year lock-in.',good:'Goals 5 or more years away.',watch:'Can fall sharply in a bad year. Index funds are simpler. Check costs (expense ratio) and invest through a SIP.'},
  {n:'SIP',ic:'🔁',risk:'Varies',lock:'It is a method, not a product. You can usually stop it any time.',good:'Investing a fixed amount every month without timing the market.',watch:'It builds a habit. It does not guarantee a profit.'}],
 itrDue:'For most salaried people who do not need an audit, the due date is usually 31 July. The official income tax portal shows the date for the current year.',
 itr:[
  {t:'Form 16 from your employer',d:'Shows your salary and the tax already deducted.'},
  {t:'Tax credit statement (AIS and Form 26AS)',d:'Download from the portal. Check it matches what you know.'},
  {t:'Bank interest certificates',d:'Savings and FD interest counts as income.'},
  {t:'Capital gains statements',d:'From your mutual fund or broker, if you sold anything.'},
  {t:'Proofs for what you want to claim',d:'Rent receipts, insurance premiums and investment proofs, where your tax regime allows them.'},
  {t:'Choose your tax regime',d:'Compare the old and new regime for your own numbers.'},
  {t:'File on the official portal and e-verify',d:'Verify soon after filing. The portal shows the time limit. An unverified return is not complete.'},
  {t:'Keep the acknowledgement',d:'Save a copy of the return and the acknowledgement.'}],
 advance:'Self-employed or a business owner? Advance tax may apply in instalments, usually by 15 June, 15 September, 15 December and 15 March. Check the current rules.'
};

/* SpendWise banking & investing education — one place, keyed by content type.
   app.js reads window.SW_BANK. Profiles opt in with their `bank` field (see above).
   All content is generic education. No product names, no promised returns, no eligibility rules. */
window.SW_BANK={

/* Everyone with a bank account. Fraud protection, so it is shown even where investing is not. */
security:[
 {t:'Two-factor authentication',b:'When you log in or pay, the bank asks for your password or PIN and then a one-time code (OTP) sent to your registered phone or email. Someone who only knows your password still cannot get in. Never share that OTP with anyone, not even someone claiming to be from the bank.'},
 {t:'Encryption',b:'Your browser talks to the bank over an encrypted connection (you will see a padlock and https in the address bar). This stops anyone on the network from reading your data in transit.'},
 {t:'Cool-off period',b:'When you add a new person or account to send money to, many banks wait a few hours or a day before allowing large transfers. That pause is a safety feature. It gives you time to notice if someone added a payee without your knowledge.'},
 {t:'If something looks wrong',b:'If you spot a transaction you did not make, call the number printed on your own card or bank passbook. Do not use a number from a message or a search result. Report it fast: the sooner the bank knows, the better the chance of stopping it.'}
],

/* The four pillars from the guide. Shown for adults managing their own money. */
pillars:[
 {n:'Asset allocation',ic:'⚖️',what:'Dividing your money across different kinds of assets: cash, fixed income like FDs, and equity like mutual funds.',why:'How you split your money matters more than which single thing you pick. The right split depends on when you need the money and how much movement you can sit through.'},
 {n:'Diversification',ic:'🧺',what:'Spreading money within each kind of asset, for example across many companies or sectors instead of just one.',why:'If one investment does badly, it does not sink everything. This is the "do not put all your eggs in one basket" idea, applied inside each category.'},
 {n:'Power of compounding',ic:'🌱',what:'Earning returns on your returns, not just on what you first put in.',why:'Time matters more than the amount. Money left alone for many years can grow far more than the same money moved around often. This is why starting early, even with a small amount, helps.'},
 {n:'Risk and return',ic:'🎢',what:'Higher possible returns generally come with higher possible losses. Risk is not only the chance of losing money, but also how you would feel and act if it happened.',why:'Before choosing anything, work out how much movement you can handle without panicking and selling at the worst time. Your comfort matters as much as the numbers.'}
],

/* The four transfer systems. Shown where the person sends money regularly. */
transfers:[
 {k:'UPI',full:'Unified Payments Interface',avail:'24 hours, all days',settle:'Instant',use:'Everyday payments to people and shops, using a virtual ID or a QR code.'},
 {k:'IMPS',full:'Immediate Payment Service',avail:'24 hours, all days',settle:'Instant',use:'Urgent transfers, usually up to a few lakh rupees.'},
 {k:'NEFT',full:'National Electronic Funds Transfer',avail:'24 hours, all days',settle:'In batches, roughly every half hour',use:'Routine transfers. No minimum, and no set maximum.'},
 {k:'RTGS',full:'Real Time Gross Settlement',avail:'24 hours, all days',settle:'Instant, one transaction at a time',use:'Large transfers. There is a minimum amount, currently two lakh rupees.'}
],

/* What a net banking account can do beyond sending money. */
netbanking:[
 {t:'See your balance and statements',b:'Check your balance in real time and download a statement of past transactions. Useful when you are working out where your money went.'},
 {t:'Open an FD or RD',b:'You can usually open a fixed deposit or a recurring deposit from net banking without visiting a branch.'},
 {t:'Pay bills',b:'Many banks let you pay electricity, water, gas and other bills through a common system, and set up automatic payments.'},
 {t:'File your income tax return',b:'Salaried people usually file on the official income tax portal. Your bank statement and Form 16 are the starting documents. The portal is the source of truth for forms, dates and rules.'},
 {t:'Manage cards and limits',b:'You can block a lost card, set spending limits, and turn international use on or off.'}
],

/* Legal options for a person under 18 in India. Teen profile only.
   SpendWise does not open anything. This is orientation, not a product list. */
minor:[
 {t:'A savings account in your name',b:'Many banks let a teenager open a savings account, often from around age 10, with a parent or guardian. You can deposit, withdraw small amounts, and get a debit card with limits. Ask a parent to help you open one if you do not have it yet.'},
 {t:'A fixed deposit or recurring deposit',b:'With a guardian, you can put money into an FD for a fixed time, or an RD where you add a little every month. These are simple and steady. They are not exciting, and that is the point for money you will need soon.'},
 {t:'PPF in your name',b:'A parent or guardian can open a Public Provident Fund account for a minor. It is a long-term, government-backed savings account. When you turn 18, it becomes yours to operate. The rules and the interest rate are set by the government and can change.'},
 {t:'Sukanya Samriddhi',b:'For a girl child, a guardian can open a Sukanya Samriddhi account. It is a long-term savings scheme with its own rules. Ask at a post office or bank for the current terms.'},
 {t:'What you cannot do yet',b:'You cannot get a credit card, take a loan, or trade shares directly in your own name. A minor demat account can be opened only through a guardian, and the guardian operates it. Anyone promising otherwise is not being straight with you.'},
 {t:'The one habit that matters now',b:'The amount matters less than the habit. Saving a fixed part of whatever you get, every single month, is the thing that will still be working for you at 30. Everything else is detail.'}
],

/* Schemes and support. BPL profile only. No eligibility rules or amounts, because both vary by state and change over time. */
schemes:[
 {t:'Ration through the PDS',b:'The Public Distribution System provides food grain at subsidised prices to eligible households through ration shops. If your family has a ration card, check what your card entitles you to at your local shop or a Common Service Centre.'},
 {t:'Cooking gas support',b:'Some households get a subsidy or a fixed number of subsidised cylinders. The rules differ by state and change. Your gas agency or a Common Service Centre can tell you what applies to you now.'},
 {t:'Health cover',b:'Government health schemes can cover hospital costs for eligible families. If someone in the family is unwell, ask at the nearest government hospital or health centre about what cover you can use. Do this before the bill, not after.'},
 {t:'Pension',b:'There are pension schemes for older people, widows and people with disabilities, run by the central and state governments. Ask at your gram panchayat, municipal office or a Common Service Centre.'},
 {t:'Work and wages',b:'MGNREGA guarantees a number of days of wage work a year to rural households that ask for it. Wages go into a bank or post office account. Ask at your panchayat for the current process.'},
 {t:'Education support',b:'Scholarships and fee support exist for students from lower-income households, at central and state level. A school or college office can usually tell you what to apply for and when.'},
 {t:'Where to ask',b:'A Common Service Centre is a local office that helps with many government forms and schemes in one place. Take your Aadhaar, ration card and bank passbook when you go. If a young person in the family can come with you, forms are often easier with help.'},
 {t:'Keeping your money safe',b:'No government office will ask you to pay to receive a benefit, and no bank will ask for your OTP or PIN. If someone calls saying a scheme is approved and asks for money or a code, it is a scam. Hang up and ask at your panchayat or bank in person.'}
]
};