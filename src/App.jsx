import { useState } from "react";

// ─── Brand colors from Cepelo brand guide ─────────────────────────────────────
const BRAND = {
  navy:    "#173454",
  blue:    "#0868B2",
  lightBlue: "#35b6ea",
  lightGray: "#F0F0F0",
  midGray: "#D8D8D8",
  darkGray: "#585C60",
};

// ─── Constants ────────────────────────────────────────────────────────────────
const PUBLISH_DAYS_EN = ["Monday", "Wednesday", "Friday"];

const TOPIC_CATEGORIES = [
  { label: "SOH & Batteridiagnostik", icon: "🔋", accent: BRAND.lightBlue, topics: [
    { title: "Hvad er State of Health (SOH) – og hvorfor er det afgørende for dit EV-flådeprogram?", difficulty: 3, volume: 320 },
    { title: "SOH-test af elbilsbatterier: Sådan forlænger du batteriets levetid og sparer penge", difficulty: 4, volume: 210 },
    { title: "Batterikapacitet over tid: Hvad enhver autoforhandler og flådeansvarlig bør vide", difficulty: 3, volume: 180 },
    { title: "Brugte elbiler og SOH: Sådan evaluerer du batteriets reelle tilstand før køb", difficulty: 2, volume: 540 },
    { title: "SOH-rapport som salgsargument: Øg tillid og værdi ved videresalg af elbiler", difficulty: 2, volume: 90 },
  ]},
  { label: "ADAS-kalibrering", icon: "🎯", accent: BRAND.blue, topics: [
    { title: "ADAS-kalibrering: Hvornår er det nødvendigt – og hvad sker der hvis du springer det over?", difficulty: 3, volume: 480 },
    { title: "Statisk vs. dynamisk ADAS-kalibrering: Hvad er forskellen og hvad kræver din bil?", difficulty: 4, volume: 260 },
    { title: "Forrude og ADAS: Hvorfor kamerakalibrering er obligatorisk efter glasskifte", difficulty: 2, volume: 390 },
    { title: "ADAS på værkstedet i 2025: Investering, udstyr og ROI for fremsynede autoværksteder", difficulty: 5, volume: 140 },
    { title: "Fejl i ADAS-systemer: De mest almindelige årsager og hvordan du undgår dem", difficulty: 3, volume: 220 },
  ]},
  { label: "Batteritjenester & EV-service", icon: "⚡", accent: "#60a5fa", topics: [
    { title: "Fremtidens værksted: Sådan forbereder du din virksomhed på EV-servicemarkedet", difficulty: 2, volume: 610 },
    { title: "Batterireparation vs. batteriskift: Hvad giver mest mening for din kunde og din forretning?", difficulty: 3, volume: 290 },
    { title: "Termisk styring af elbilsbatterier: Hvad værkstedet skal vide om køling og opvarmning", difficulty: 5, volume: 110 },
    { title: "Højtspændingssikkerhed på EV-værkstedet: Krav, uddannelse og best practice i Danmark", difficulty: 4, volume: 170 },
    { title: "Batterimoduler og celleskift: Ny teknologi der ændrer værkstedsservicen markant", difficulty: 5, volume: 80 },
  ]},
  { label: "EV-opladning & infrastruktur", icon: "🔌", accent: "#a78bfa", topics: [
    { title: "AC vs. DC opladning: Hvad enhver virksomhed med EV-flåde bør forstå", difficulty: 2, volume: 720 },
    { title: "Ladeinfrastruktur til virksomheder: Sådan vælger du den rigtige løsning i 2025", difficulty: 3, volume: 430 },
    { title: "Smart charging og lastbalancering: Reducer elomkostningerne i din virksomheds ladepark", difficulty: 4, volume: 190 },
    { title: "Fejlfinding på ladere og EVSE: Typiske problemer og hvad værkstedet kan gøre", difficulty: 3, volume: 160 },
  ]},
  { label: "Fremtidens værksted & B2B", icon: "🏭", accent: BRAND.lightBlue, topics: [
    { title: "Fra traditionelt til fremtidens værksted: En trin-for-trin guide til EV-omstillingen", difficulty: 2, volume: 830 },
    { title: "Certificering og uddannelse til EV-service: Hvad kræver det i Danmark?", difficulty: 3, volume: 370 },
    { title: "Flådestyring og EV-service: Sådan tilbyder du en komplet løsning til erhvervskunder", difficulty: 4, volume: 250 },
    { title: "Forretningsmodeller for EV-værksteder: Abonnement, servicepakker og mere", difficulty: 3, volume: 310 },
  ]},
];

const NEWSLETTER_TOPICS = [
  { label: "Produktnyheder", icon: "📦", topics: [
    "Nyt SOH-diagnostikudstyr: Mød vores nyeste batteritest-løsning",
    "ADAS-kalibreringspakke opdateret: Understøtter nu 40+ nye bilmodeller",
    "Cepelo lancerer komplet EV-servicepakke til danske værksteder",
  ]},
  { label: "Branchenyheder & guides", icon: "📰", topics: [
    "EV-markedet i Danmark: Hvad betyder de nye registreringstal for dit værksted?",
    "5 ting du skal vide om ADAS-lovgivning i 2025",
    "Sådan kommer du i gang med SOH-service – en praktisk guide",
  ]},
  { label: "Tilbud & kampagner", icon: "🎯", topics: [
    "Forårstilbud: 15% rabat på ADAS-kalibreringsudstyr hele maj",
    "Bundle-pakke: SOH + ADAS starter-kit til fast pris",
    "Gratis demo: Book din personlige gennemgang af Cepelo's EV-udstyr",
  ]},
];

const BACKLINKS_RECEIVED = [
  { date: "13. maj 2026", source: "https://evnews.dk/blogs/fremtidens-vaerksted", site: "evnews.dk", dr: 52, value: 340 },
  { date: "11. maj 2026", source: "https://autobranchen.dk/adas-guide", site: "autobranchen.dk", dr: 61, value: 420 },
  { date: "9. maj 2026", source: "https://elbilforum.dk/soh-forklaret", site: "elbilforum.dk", dr: 38, value: 250 },
  { date: "7. maj 2026", source: "https://vaerktoejsnyt.dk/ev-service", site: "vaerktoejsnyt.dk", dr: 29, value: 190 },
  { date: "4. maj 2026", source: "https://motordk.dk/elbil-batteri", site: "motordk.dk", dr: 44, value: 290 },
];

const AUDIT_PAGES = [
  { url: "https://cepelo.dk", score: 61, issues: 14 },
  { url: "https://cepelo.dk/blogs/news", score: 74, issues: 6 },
  { url: "https://cepelo.dk/blogs/news/soh-guide", score: 79, issues: 5 },
  { url: "https://cepelo.dk/blogs/news/adas-kalibrering", score: 81, issues: 4 },
  { url: "https://cepelo.dk/products/ev-service", score: 72, issues: 7 },
];

// ─── Claude API ───────────────────────────────────────────────────────────────
async function callClaude(prompt) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!response.ok) throw new Error(`API fejl: ${response.status}`);
  const data = await response.json();
  return data.content?.[0]?.text || "";
}

async function generateArticleWithClaude(topic, categoryLabel) {
  const slug = topic.toLowerCase()
    .replace(/[æ]/g,"ae").replace(/[ø]/g,"oe").replace(/[å]/g,"aa")
    .replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").substring(0,60);

  const text = await callClaude(`Du er SEO-skribent for Cepelo (cepelo.dk) – dansk B2B-virksomhed: SOH-batteridiagnostik, ADAS-kalibrering, EV-batteritjenester og ladeinfrastruktur.

Skriv SEO-artikel på DANSK om: "${topic}" (Kategori: ${categoryLabel})
700-900 ord · B2B målgruppe: autoværksteder, flådeoperatører, forhandlere i Danmark

Svar KUN med JSON (ingen markdown):
{"metaDesc":"max 155 tegn","intro":"2-3 sætninger","sections":[{"h":"Overskrift","p":"min 100 ord","bullets":["punkt"]},{"h":"Overskrift","p":"min 100 ord"},{"h":"Overskrift","p":"min 100 ord","bullets":["punkt"]},{"h":"Overskrift","p":"min 100 ord"}],"outro":"CTA 2-3 sætninger med cepelo.dk"}`);

  const parsed = JSON.parse(text.replace(/```json|```/g,"").trim());
  const wordCount = [parsed.intro,...parsed.sections.map(s=>s.p+(s.bullets||[]).join(" ")),parsed.outro].join(" ").split(/\s+/).length;
  return { tag: categoryLabel.split(" ")[0], slug, ...parsed, wordCount, readTime: Math.max(3,Math.ceil(wordCount/200)) };
}

async function generateNewsletterWithClaude(topic, newsletterType) {
  const text = await callClaude(`Du er email marketing-specialist for Cepelo (cepelo.dk) – dansk B2B EV-udstyrsleverandør.

Skriv en professionel nyhedsmail på DANSK om: "${topic}"
Type: ${newsletterType}
Målgruppe: Danske autoværksteder og flådeoperatører

Svar KUN med JSON (ingen markdown):
{"subject":"Emnelinjen (max 60 tegn, engagerende)","previewText":"Preview tekst til email-klient (max 90 tegn)","headline":"Overskrift i emailen (Montserrat ExtraBold stil – kort og slagkraftig)","intro":"Intro-afsnit 2-3 sætninger der fanger læseren","sections":[{"h":"Sektion 1 overskrift","p":"Indhold 60-100 ord"},{"h":"Sektion 2 overskrift","p":"Indhold 60-100 ord"}],"cta":"Knaptekst til CTA (max 5 ord)","ctaUrl":"https://cepelo.dk","outro":"Afsluttende linje 1 sætning"}`);

  return JSON.parse(text.replace(/```json|```/g,"").trim());
}

async function sendToHubSpot(newsletter, hubspotToken) {
  // HubSpot Marketing Email API
  const emailPayload = {
    name: `[UDKAST] ${newsletter.subject}`,
    subject: newsletter.subject,
    previewText: newsletter.previewText,
    content: {
      body: `
        <div style="font-family:'Open Sans',sans-serif;max-width:600px;margin:0 auto;background:#fff">
          <div style="background:${BRAND.navy};padding:28px 32px;text-align:center">
            <h1 style="font-family:'Montserrat',sans-serif;font-weight:800;font-size:24px;color:#fff;text-transform:uppercase;margin:0;letter-spacing:1px">CEPELO</h1>
            <p style="color:${BRAND.lightBlue};font-size:12px;margin:4px 0 0;font-family:'Open Sans',sans-serif">FREMTIDENS VÆRKSTED</p>
          </div>
          <div style="padding:32px;background:${BRAND.navy}">
            <div style="background:rgba(255,255,255,0.05);border-left:3px solid ${BRAND.lightBlue};padding:20px 24px;border-radius:4px;margin-bottom:24px">
              <h2 style="font-family:'Montserrat',sans-serif;font-weight:800;font-size:22px;color:#fff;text-transform:uppercase;margin:0 0 12px;line-height:1.2">${newsletter.headline}</h2>
              <p style="font-family:'Open Sans',sans-serif;font-weight:300;color:${BRAND.lightGray};font-size:14px;line-height:1.7;margin:0">${newsletter.intro}</p>
            </div>
            ${newsletter.sections.map(s=>`
            <div style="margin-bottom:20px">
              <h3 style="font-family:'Montserrat',sans-serif;font-weight:800;font-size:15px;color:${BRAND.lightBlue};text-transform:uppercase;margin:0 0 8px;letter-spacing:.5px">${s.h}</h3>
              <p style="font-family:'Open Sans',sans-serif;font-weight:300;color:${BRAND.lightGray};font-size:14px;line-height:1.7;margin:0">${s.p}</p>
            </div>`).join('')}
            <div style="text-align:center;margin:28px 0 20px">
              <a href="${newsletter.ctaUrl}" style="display:inline-block;background:${BRAND.blue};color:#fff;font-family:'Montserrat',sans-serif;font-weight:800;font-size:14px;text-transform:uppercase;padding:14px 32px;border-radius:4px;text-decoration:none;letter-spacing:.5px">${newsletter.cta}</a>
            </div>
            <p style="font-family:'Open Sans',sans-serif;font-weight:300;color:${BRAND.darkGray};font-size:12px;text-align:center;margin:0">${newsletter.outro}</p>
          </div>
          <div style="background:#0f1f2e;padding:16px 32px;text-align:center;border-top:1px solid rgba(255,255,255,.06)">
            <p style="font-family:'Open Sans',sans-serif;color:${BRAND.darkGray};font-size:11px;margin:0">© 2026 Cepelo · cepelo.dk · Fremtidens Værksted</p>
          </div>
        </div>`,
    },
    status: "DRAFT",
  };

  const response = await fetch("https://api.hubapi.com/marketing/v3/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${hubspotToken}`,
    },
    body: JSON.stringify(emailPayload),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || `HubSpot fejl: ${response.status}`);
  }
  return await response.json();
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getNextPublishDates(n=3) {
  const dates=[],d=new Date();
  while(dates.length<n){d.setDate(d.getDate()+1);if(PUBLISH_DAYS_EN.includes(d.toLocaleDateString("en-US",{weekday:"long"})))dates.push(new Date(d));}
  return dates;
}
function fmtDate(d){return d.toLocaleDateString("da-DK",{weekday:"long",day:"numeric",month:"long",year:"numeric"});}
function fmtShort(d){return new Date(d).toLocaleDateString("da-DK",{day:"numeric",month:"short"});}

function seedArticles() {
  const now=new Date(2026,4,13);
  const seeds=[
    ["Fra traditionelt til fremtidens værksted: En trin-for-trin guide til EV-omstillingen","published","Fremtidens værksted & B2B",-18],
    ["AC vs. DC opladning: Hvad enhver virksomhed med EV-flåde bør forstå","published","EV-opladning & infrastruktur",-15],
    ["Brugte elbiler og SOH: Sådan evaluerer du batteriets reelle tilstand før køb","published","SOH & Batteridiagnostik",-13],
    ["ADAS-kalibrering: Hvornår er det nødvendigt – og hvad sker der hvis du springer det over?","published","ADAS-kalibrering",-11],
    ["Ladeinfrastruktur til virksomheder: Sådan vælger du den rigtige løsning i 2025","published","EV-opladning & infrastruktur",-8],
    ["Fremtidens værksted: Sådan forbereder du din virksomhed på EV-servicemarkedet","published","Batteritjenester & EV-service",-6],
    ["Forrude og ADAS: Hvorfor kamerakalibrering er obligatorisk efter glasskifte","published","ADAS-kalibrering",-4],
    ["Hvad er State of Health (SOH) – og hvorfor er det afgørende for dit EV-flådeprogram?","published","SOH & Batteridiagnostik",-2],
    ["Certificering og uddannelse til EV-service: Hvad kræver det i Danmark?","published","Fremtidens værksted & B2B",0],
    ["Batterireparation vs. batteriskift: Hvad giver mest mening for din kunde og din forretning?","queued","Batteritjenester & EV-service",2],
    ["Smart charging og lastbalancering: Reducer elomkostningerne i din virksomheds ladepark","queued","EV-opladning & infrastruktur",4],
    ["SOH-test af elbilsbatterier: Sådan forlænger du batteriets levetid og sparer penge","queued","SOH & Batteridiagnostik",6],
  ];
  return seeds.map(([title,status,category,offset],i)=>{
    const d=new Date(now);d.setDate(d.getDate()+offset);
    const slug=title.toLowerCase().replace(/[æ]/g,"ae").replace(/[ø]/g,"oe").replace(/[å]/g,"aa").replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").substring(0,55);
    return {id:`seed-${i}`,topic:title,status,category,date:d,scheduledFor:fmtDate(d),wordCount:Math.floor(Math.random()*200)+700,readTime:Math.floor(Math.random()*2)+4,difficulty:3,volume:200,content:{tag:category.split(" ")[0],slug,intro:`Planlagt artikel: "${title}". Klik "Generer med AI" for fuldt indhold.`,sections:[{h:"Indhold ikke genereret endnu",p:"Brug knappen nedenfor for at generere fuldt SEO-indhold med Claude AI."}],outro:"Kontakt Cepelo på cepelo.dk.",metaDesc:"",wordCount:0,readTime:0,isPlaceholder:true}};
  });
}

// ─── Charts ───────────────────────────────────────────────────────────────────
function MiniLineChart({data,color=BRAND.lightBlue,height=50}){
  if(!data||data.length<2)return null;
  const min=Math.min(...data),max=Math.max(...data),range=max-min||1;
  const w=260,h=height;
  const pts=data.map((v,i)=>[i*(w/(data.length-1)),h-((v-min)/range)*(h-8)+4]);
  const path=pts.map((p,i)=>(i===0?`M${p[0]},${p[1]}`:`L${p[0]},${p[1]}`)).join(" ");
  const area=`${path} L${pts[pts.length-1][0]},${h} L0,${h} Z`;
  return(<svg viewBox={`0 0 ${w} ${h}`} style={{width:"100%",height,overflow:"visible"}}><path d={area} fill={color} fillOpacity=".1"/><path d={path} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><circle cx={pts[pts.length-1][0]} cy={pts[pts.length-1][1]} r="3" fill={color}/></svg>);
}

function GaugeArc({score}){
  const r=54,cx=64,cy=68,sw=10,pct=score/100,startA=-Math.PI*.75,endA=Math.PI*.75,arc=endA-startA;
  const a=startA+arc*pct,x1=cx+r*Math.cos(startA),y1=cy+r*Math.sin(startA),x2=cx+r*Math.cos(endA),y2=cy+r*Math.sin(endA),px=cx+r*Math.cos(a),py=cy+r*Math.sin(a);
  const color=score>=70?BRAND.lightBlue:score>=50?"#fbbf24":"#f87171";
  return(<svg viewBox="0 0 128 80" style={{width:128,height:80}}><path d={`M${x1},${y1} A${r},${r} 0 1 1 ${x2},${y2}`} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth={sw} strokeLinecap="round"/><path d={`M${x1},${y1} A${r},${r} 0 ${pct>.5?1:0} 1 ${px},${py}`} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round"/><text x={cx} y={cy+4} textAnchor="middle" fill={color} fontSize="18" fontWeight="700" fontFamily="monospace">{score}</text><text x={cx} y={cy+18} textAnchor="middle" fill="#6b7280" fontSize="9" fontFamily="sans-serif">/ 100</text></svg>);
}

// ─── Shopify Preview ──────────────────────────────────────────────────────────
function ShopifyPreview({article,onClose,onApprove}){
  if(!article)return null;
  const{intro,sections,outro,tag,metaDesc,wordCount,readTime,slug}=article.content;
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.93)",zIndex:2000,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <div style={{background:BRAND.navy,borderBottom:`2px solid ${BRAND.blue}`,padding:"9px 16px",display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
        <div style={{display:"flex",gap:5}}>{["#ff5f57","#ffbd2e","#28c840"].map(c=><div key={c} style={{width:11,height:11,borderRadius:"50%",background:c}}/>)}</div>
        <div style={{flex:1,background:"rgba(255,255,255,.06)",border:`1px solid ${BRAND.blue}40`,borderRadius:5,padding:"4px 12px",fontSize:11,color:"#6b7280",fontFamily:"monospace"}}>cepelo.dk/blogs/news/{slug}</div>
        <span style={{fontSize:10,color:BRAND.lightBlue,background:`${BRAND.blue}20`,border:`1px solid ${BRAND.blue}40`,borderRadius:4,padding:"3px 9px",fontWeight:700}}>Shopify Preview</span>
        <button onClick={onClose} style={{background:"none",border:"none",color:"#6b7280",fontSize:18,cursor:"pointer"}}>✕</button>
      </div>
      <div style={{flex:1,overflowY:"auto",background:"#f8f8f6"}}>
        <div style={{background:BRAND.navy,borderBottom:`3px solid ${BRAND.blue}`,padding:"0 40px"}}>
          <div style={{maxWidth:1100,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:56}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:28,height:28,borderRadius:6,background:BRAND.blue,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:13,color:"#fff",fontFamily:"Montserrat,sans-serif"}}>C</div>
              <span style={{color:"#fff",fontWeight:800,fontSize:15,fontFamily:"Montserrat,sans-serif",textTransform:"uppercase",letterSpacing:1}}>CEPELO</span>
            </div>
            <div style={{display:"flex",gap:24}}>{["Produkter","Services","Om os","Blog","Kontakt"].map(n=><span key={n} style={{color:n==="Blog"?BRAND.lightBlue:"#9ca3af",fontSize:13}}>{n}</span>)}</div>
          </div>
        </div>
        <div style={{maxWidth:740,margin:"0 auto",padding:"48px 24px 80px",fontFamily:"'Open Sans',Georgia,serif"}}>
          <p style={{fontSize:12,color:"#9ca3af",marginBottom:22,fontFamily:"system-ui"}}><span style={{color:BRAND.blue}}>Hjem</span> / <span style={{color:BRAND.blue}}>Blog</span> / {tag}</p>
          <span style={{background:`${BRAND.blue}15`,color:BRAND.blue,border:`1px solid ${BRAND.blue}30`,borderRadius:4,padding:"3px 10px",fontSize:11,fontWeight:700,fontFamily:"Montserrat,sans-serif",textTransform:"uppercase"}}>{tag}</span>
          <h1 style={{fontSize:30,fontWeight:800,color:BRAND.navy,lineHeight:1.25,margin:"14px 0 18px",fontFamily:"Montserrat,sans-serif",textTransform:"uppercase"}}>{article.topic}</h1>
          <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:26,paddingBottom:22,borderBottom:"1px solid #e5e7eb",fontFamily:"system-ui"}}>
            <div style={{width:32,height:32,borderRadius:"50%",background:BRAND.blue,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:12,fontFamily:"Montserrat,sans-serif"}}>C</div>
            <div><p style={{fontSize:13,fontWeight:600,color:"#374151",margin:0}}>Cepelo Redaktion</p><p style={{fontSize:11,color:"#9ca3af",margin:"2px 0 0"}}>{article.scheduledFor} · {readTime} min · {wordCount} ord</p></div>
          </div>
          {metaDesc&&<div style={{background:`${BRAND.navy}08`,border:`1px solid ${BRAND.blue}20`,borderLeft:`3px solid ${BRAND.blue}`,borderRadius:4,padding:"12px 16px",marginBottom:26,fontFamily:"system-ui"}}><p style={{fontSize:11,fontWeight:700,color:BRAND.blue,textTransform:"uppercase",letterSpacing:".06em",margin:"0 0 4px"}}>Resumé</p><p style={{fontSize:13,color:"#374151",lineHeight:1.55,margin:0}}>{metaDesc}</p></div>}
          <p style={{fontSize:17,color:"#374151",lineHeight:1.8,marginBottom:26,fontFamily:"'Open Sans',sans-serif",fontWeight:300}}>{intro}</p>
          {sections.map((s,i)=>(
            <div key={i} style={{marginBottom:28}}>
              <h2 style={{fontSize:18,fontWeight:800,color:BRAND.navy,marginBottom:10,fontFamily:"Montserrat,sans-serif",textTransform:"uppercase",letterSpacing:".3px"}}>{s.h}</h2>
              <p style={{fontSize:14,color:"#4b5563",lineHeight:1.8,marginBottom:s.bullets?12:0,fontFamily:"'Open Sans',sans-serif",fontWeight:300}}>{s.p}</p>
              {s.bullets&&<ul style={{margin:0,paddingLeft:0,listStyle:"none",display:"flex",flexDirection:"column",gap:7}}>{s.bullets.map((b,j)=><li key={j} style={{display:"flex",gap:8,alignItems:"flex-start",fontSize:13,color:"#374151",fontFamily:"system-ui"}}><span style={{color:BRAND.blue,fontWeight:700,flexShrink:0}}>✓</span>{b}</li>)}</ul>}
            </div>
          ))}
          <div style={{background:BRAND.navy,borderRadius:8,padding:"28px",margin:"30px 0",textAlign:"center"}}>
            <p style={{fontSize:10,fontWeight:800,color:BRAND.lightBlue,textTransform:"uppercase",letterSpacing:".1em",margin:"0 0 8px",fontFamily:"Montserrat,sans-serif"}}>FREMTIDENS VÆRKSTED</p>
            <p style={{fontSize:18,fontWeight:800,color:"#fff",margin:"0 0 10px",fontFamily:"Montserrat,sans-serif",textTransform:"uppercase"}}>{outro.substring(0,60)}…</p>
            <button style={{background:BRAND.blue,border:"none",borderRadius:4,padding:"12px 24px",fontSize:13,fontWeight:800,color:"#fff",cursor:"pointer",fontFamily:"Montserrat,sans-serif",textTransform:"uppercase",letterSpacing:".5px"}}>KONTAKT CEPELO →</button>
          </div>
        </div>
        <div style={{background:BRAND.navy,padding:"20px 40px"}}><div style={{maxWidth:1100,margin:"0 auto",display:"flex",justifyContent:"space-between"}}><span style={{color:"#374151",fontSize:11}}>© 2026 Cepelo · Fremtidens Værksted</span><span style={{color:BRAND.lightBlue,fontSize:11}}>cepelo.dk</span></div></div>
      </div>
      <div style={{background:BRAND.navy,borderTop:`1px solid ${BRAND.blue}30`,padding:"12px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
        <div><p style={{fontSize:11,color:"#4b5563",margin:0}}>Planlagt: <span style={{color:"#9ca3af"}}>{article.scheduledFor}</span></p></div>
        <div style={{display:"flex",gap:9}}>
          <button onClick={onClose} style={{background:"transparent",border:`1px solid ${BRAND.blue}40`,borderRadius:6,padding:"8px 16px",color:"#9ca3af",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Luk</button>
          {article.status!=="published"&&!article.content?.isPlaceholder&&<button onClick={()=>{onApprove(article.id);onClose();}} style={{background:BRAND.blue,border:"none",borderRadius:6,padding:"8px 18px",color:"#fff",fontSize:12,fontWeight:800,cursor:"pointer",fontFamily:"Montserrat,sans-serif",textTransform:"uppercase",letterSpacing:".3px"}}>✓ SEND TIL SHOPIFY</button>}
        </div>
      </div>
    </div>
  );
}

// ─── Newsletter Preview ───────────────────────────────────────────────────────
function NewsletterPreview({newsletter,onClose,onSendToHubSpot,sending}){
  if(!newsletter)return null;
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.93)",zIndex:2000,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <div style={{background:BRAND.navy,borderBottom:`2px solid ${BRAND.blue}`,padding:"9px 16px",display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
        <div style={{display:"flex",gap:5}}>{["#ff5f57","#ffbd2e","#28c840"].map(c=><div key={c} style={{width:11,height:11,borderRadius:"50%",background:c}}/>)}</div>
        <div style={{flex:1}}>
          <span style={{fontSize:11,color:BRAND.lightBlue,fontWeight:700}}>HubSpot Email Preview</span>
          <span style={{fontSize:11,color:"#4b5563",marginLeft:12}}>Emne: {newsletter.subject}</span>
        </div>
        <button onClick={onClose} style={{background:"none",border:"none",color:"#6b7280",fontSize:18,cursor:"pointer"}}>✕</button>
      </div>
      <div style={{flex:1,overflowY:"auto",background:"#e8e8e8",padding:"24px"}}>
        <div style={{maxWidth:600,margin:"0 auto",fontFamily:"'Open Sans',sans-serif"}}>
          <div style={{background:"#fff",borderRadius:6,overflow:"hidden",boxShadow:"0 2px 12px rgba(0,0,0,.1)"}}>
            <div style={{background:BRAND.navy,padding:"24px 32px",textAlign:"center"}}>
              <h1 style={{fontFamily:"Montserrat,sans-serif",fontWeight:800,fontSize:22,color:"#fff",textTransform:"uppercase",margin:0,letterSpacing:1}}>CEPELO</h1>
              <p style={{color:BRAND.lightBlue,fontSize:11,margin:"4px 0 0",fontFamily:"'Open Sans',sans-serif"}}>FREMTIDENS VÆRKSTED</p>
            </div>
            <div style={{padding:"28px 32px",background:BRAND.navy}}>
              <div style={{background:"rgba(255,255,255,.05)",borderLeft:`3px solid ${BRAND.lightBlue}`,padding:"18px 20px",borderRadius:4,marginBottom:22}}>
                <h2 style={{fontFamily:"Montserrat,sans-serif",fontWeight:800,fontSize:20,color:"#fff",textTransform:"uppercase",margin:"0 0 10px",lineHeight:1.2}}>{newsletter.headline}</h2>
                <p style={{fontFamily:"'Open Sans',sans-serif",fontWeight:300,color:BRAND.lightGray,fontSize:14,lineHeight:1.7,margin:0}}>{newsletter.intro}</p>
              </div>
              {newsletter.sections.map((s,i)=>(
                <div key={i} style={{marginBottom:18}}>
                  <h3 style={{fontFamily:"Montserrat,sans-serif",fontWeight:800,fontSize:13,color:BRAND.lightBlue,textTransform:"uppercase",margin:"0 0 7px",letterSpacing:".5px"}}>{s.h}</h3>
                  <p style={{fontFamily:"'Open Sans',sans-serif",fontWeight:300,color:BRAND.lightGray,fontSize:13,lineHeight:1.7,margin:0}}>{s.p}</p>
                </div>
              ))}
              <div style={{textAlign:"center",margin:"24px 0 18px"}}>
                <a href={newsletter.ctaUrl} style={{display:"inline-block",background:BRAND.blue,color:"#fff",fontFamily:"Montserrat,sans-serif",fontWeight:800,fontSize:13,textTransform:"uppercase",padding:"13px 28px",borderRadius:4,textDecoration:"none",letterSpacing:".5px"}}>{newsletter.cta}</a>
              </div>
              <p style={{fontFamily:"'Open Sans',sans-serif",fontWeight:300,color:BRAND.darkGray,fontSize:11,textAlign:"center",margin:0}}>{newsletter.outro}</p>
            </div>
            <div style={{background:"#0f1f2e",padding:"14px 24px",textAlign:"center",borderTop:`1px solid ${BRAND.navy}`}}>
              <p style={{fontFamily:"'Open Sans',sans-serif",color:"#4b5563",fontSize:10,margin:0}}>© 2026 Cepelo · cepelo.dk · Fremtidens Værksted</p>
            </div>
          </div>
          <div style={{background:"rgba(255,255,255,.05)",border:`1px solid ${BRAND.blue}20`,borderRadius:6,padding:"12px 16px",marginTop:14}}>
            <p style={{fontSize:11,color:"#6b7280",margin:"0 0 4px",fontWeight:600}}>Preview tekst (email-klient):</p>
            <p style={{fontSize:12,color:"#9ca3af",margin:0}}>{newsletter.previewText}</p>
          </div>
        </div>
      </div>
      <div style={{background:BRAND.navy,borderTop:`1px solid ${BRAND.blue}30`,padding:"12px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
        <div><p style={{fontSize:11,color:"#4b5563",margin:0}}>Klar til HubSpot · Sendes som <span style={{color:BRAND.lightBlue,fontWeight:700}}>UDKAST</span></p></div>
        <div style={{display:"flex",gap:9}}>
          <button onClick={onClose} style={{background:"transparent",border:`1px solid ${BRAND.blue}40`,borderRadius:6,padding:"8px 16px",color:"#9ca3af",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Luk</button>
          <button onClick={onSendToHubSpot} disabled={sending} style={{background:sending?"rgba(8,104,178,.4)":BRAND.blue,border:"none",borderRadius:6,padding:"8px 18px",color:"#fff",fontSize:12,fontWeight:800,cursor:sending?"not-allowed":"pointer",fontFamily:"Montserrat,sans-serif",textTransform:"uppercase",letterSpacing:".3px",display:"flex",alignItems:"center",gap:6}}>
            {sending?<><div style={{width:8,height:8,borderRadius:"50%",background:BRAND.lightBlue,animation:"pulse 1.4s infinite"}}/>Sender til HubSpot…</>:"→ SEND TIL HUBSPOT DRAFT"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function CepeloGrowth() {
  const [nav, setNav] = useState("overview");
  const [articles, setArticles] = useState(()=>seedArticles());
  const [selected, setSelected] = useState([]);
  const [preview, setPreview] = useState(null);
  const [custom, setCustom] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatingIds, setGeneratingIds] = useState(new Set());
  const [toast, setToast] = useState(null);
  const [openCat, setOpenCat] = useState(null);
  const [shopifyDomain, setShopifyDomain] = useState("cepelo.dk");
  const [shopifyToken, setShopifyToken] = useState("");
  const [hubspotToken, setHubspotToken] = useState("");
  const [calMonth, setCalMonth] = useState(new Date(2026,4,1));
  const [calSelected, setCalSelected] = useState(null);

  // Newsletter state
  const [nlSelectedTopic, setNlSelectedTopic] = useState(null);
  const [nlCustomTopic, setNlCustomTopic] = useState("");
  const [nlType, setNlType] = useState("Produktnyheder");
  const [nlGenerating, setNlGenerating] = useState(false);
  const [newsletters, setNewsletters] = useState([]);
  const [nlPreview, setNlPreview] = useState(null);
  const [nlSending, setNlSending] = useState(false);
  const [openNlCat, setOpenNlCat] = useState(null);

  const notify=(msg,type="success")=>{setToast({msg,type});setTimeout(()=>setToast(null),3500);};

  const stats={
    published:articles.filter(a=>a.status==="published").length,
    queued:articles.filter(a=>["queued","ready","draft"].includes(a.status)).length,
  };

  const growthData=[0,20,60,120,210,340,510,720,980,1250,1580,1890,2300,2780,3200,3800,4500,5300,6200,7100];

  // Calendar
  function getDaysInMonth(y,m){return new Date(y,m+1,0).getDate();}
  function getFirstDayOfMonth(y,m){return new Date(y,m,1).getDay()||7;}
  function getArticlesForDay(day){return articles.filter(a=>{const d=new Date(a.date);return d.getFullYear()===calMonth.getFullYear()&&d.getMonth()===calMonth.getMonth()&&d.getDate()===day;});}

  // Generate blog article
  const handleGenerate=async()=>{
    const topics=selected.length>0?selected:custom?[{title:custom,difficulty:3,volume:100,category:"Fremtidens værksted & B2B",accent:BRAND.lightBlue,icon:"🏭"}]:[];
    if(!topics.length){notify("Vælg mindst ét emne","error");return;}
    setGenerating(true);
    const dates=getNextPublishDates(topics.length);
    const drafts=topics.map((t,i)=>({id:`art-${Date.now()}-${i}`,topic:t.title,status:"generating",category:t.category,date:dates[i],scheduledFor:fmtDate(dates[i]),wordCount:0,readTime:0,difficulty:t.difficulty,volume:t.volume,content:null}));
    setArticles(prev=>[...drafts,...prev]);
    setGeneratingIds(new Set(drafts.map(d=>d.id)));
    setSelected([]);setCustom("");setNav("content");
    for(let i=0;i<drafts.length;i++){
      try{
        notify(`⚡ Genererer "${drafts[i].topic.substring(0,45)}…"`);
        const content=await generateArticleWithClaude(drafts[i].topic,drafts[i].category);
        setArticles(prev=>prev.map(a=>a.id===drafts[i].id?{...a,status:"ready",...content}:a));
        notify(`✓ Klar til preview`);
      }catch(err){
        setArticles(prev=>prev.map(a=>a.id===drafts[i].id?{...a,status:"error"}:a));
        notify(`Fejl: ${err.message}`,"error");
      }
      setGeneratingIds(prev=>{const n=new Set(prev);n.delete(drafts[i].id);return n;});
    }
    setGenerating(false);
  };

  const handleRegenerate=async(id)=>{
    const a=articles.find(x=>x.id===id);if(!a)return;
    setGeneratingIds(prev=>new Set([...prev,id]));
    setArticles(prev=>prev.map(x=>x.id===id?{...x,status:"generating"}:x));
    try{
      const content=await generateArticleWithClaude(a.topic,a.category);
      setArticles(prev=>prev.map(x=>x.id===id?{...x,status:"ready",...content}:x));
      notify("✓ Artikel regenereret med AI");
    }catch(err){
      setArticles(prev=>prev.map(x=>x.id===id?{...x,status:"queued"}:x));
      notify(`Fejl: ${err.message}`,"error");
    }
    setGeneratingIds(prev=>{const n=new Set(prev);n.delete(id);return n;});
  };

  // Generate newsletter
  const handleGenerateNewsletter=async()=>{
    const topic=nlSelectedTopic||nlCustomTopic;
    if(!topic){notify("Vælg et emne til nyhedsbrevet","error");return;}
    setNlGenerating(true);
    try{
      notify("⚡ Genererer nyhedsbrev med Claude AI…");
      const nl=await generateNewsletterWithClaude(topic,nlType);
      const newNl={id:`nl-${Date.now()}`,topic,type:nlType,status:"draft",createdAt:new Date(),...nl};
      setNewsletters(prev=>[newNl,...prev]);
      setNlSelectedTopic(null);setNlCustomTopic("");
      notify("✓ Nyhedsbrev genereret — klar til preview");
    }catch(err){notify(`Fejl: ${err.message}`,"error");}
    setNlGenerating(false);
  };

  const handleSendToHubSpot=async(nl)=>{
    if(!hubspotToken){notify("Tilføj HubSpot API-nøgle i Indstillinger","error");setNlPreview(null);setNav("settings");return;}
    setNlSending(true);
    try{
      await sendToHubSpot(nl,hubspotToken);
      setNewsletters(prev=>prev.map(n=>n.id===nl.id?{...n,status:"sent_to_hubspot"}:n));
      setNlPreview(null);
      notify("✓ Nyhedsbrev sendt til HubSpot som udkast");
    }catch(err){notify(`HubSpot fejl: ${err.message}`,"error");}
    setNlSending(false);
  };

  const handleApprove=(id)=>{setArticles(prev=>prev.map(a=>a.id===id?{...a,status:"published"}:a));notify("✓ Sendt til Shopify blog");};
  const handleDelete=(id)=>setArticles(prev=>prev.filter(a=>a.id!==id));
  const toggleTopic=(t)=>setSelected(prev=>prev.find(x=>x.title===t.title)?prev.filter(x=>x.title!==t.title):prev.length<3?[...prev,t]:prev);

  // Shared styles
  const card=(extra={})=>({background:`${BRAND.navy}cc`,border:`1px solid ${BRAND.blue}25`,borderRadius:10,padding:"18px",...extra});
  const sLabel={fontSize:10,fontWeight:700,color:BRAND.darkGray,textTransform:"uppercase",letterSpacing:".08em",marginBottom:12};

  const statusBadge=(status,isGen)=>{
    if(isGen||status==="generating")return<span style={{background:`${BRAND.lightBlue}15`,color:BRAND.lightBlue,border:`1px solid ${BRAND.lightBlue}30`,borderRadius:20,padding:"2px 8px",fontSize:10,fontWeight:700,display:"inline-flex",alignItems:"center",gap:5}}><span style={{width:5,height:5,borderRadius:"50%",background:BRAND.lightBlue,display:"inline-block",animation:"pulse 1.4s infinite"}}/>AI GENERERER…</span>;
    const map={published:{bg:`${BRAND.blue}20`,color:BRAND.lightBlue,border:`${BRAND.blue}40`,label:"PUBLICERET"},queued:{bg:"rgba(251,191,36,.1)",color:"#fbbf24",border:"rgba(251,191,36,.25)",label:"I KØ"},ready:{bg:`${BRAND.lightBlue}15`,color:BRAND.lightBlue,border:`${BRAND.lightBlue}30`,label:"KLAR"},error:{bg:"rgba(248,113,113,.1)",color:"#f87171",border:"rgba(248,113,113,.25)",label:"FEJL"}};
    const s=map[status]||map.queued;
    return<span style={{background:s.bg,color:s.color,border:`1px solid ${s.border}`,borderRadius:20,padding:"2px 8px",fontSize:10,fontWeight:700,letterSpacing:".05em"}}>{s.label}</span>;
  };

  const NavItem=({id,icon,label,badge})=>(
    <button onClick={()=>setNav(id)} style={{width:"100%",display:"flex",alignItems:"center",gap:9,padding:"8px 10px",borderRadius:7,background:nav===id?`${BRAND.blue}20`:"transparent",border:nav===id?`1px solid ${BRAND.blue}40`:"1px solid transparent",color:nav===id?BRAND.lightBlue:BRAND.darkGray,fontSize:12,fontWeight:nav===id?700:600,cursor:"pointer",fontFamily:"inherit",textAlign:"left",transition:"all .15s"}}>
      <span style={{fontSize:14}}>{icon}</span>{label}
      {badge&&<span style={{marginLeft:"auto",background:`${BRAND.blue}20`,color:BRAND.lightBlue,fontSize:10,fontWeight:700,borderRadius:10,padding:"1px 6px"}}>{badge}</span>}
    </button>
  );

  // ── OVERVIEW ──────────────────────────────────────────────────────────────
  const OverviewPage=()=>(
    <div style={{display:"flex",flexDirection:"column",gap:16,animation:"fadeUp .3s ease"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <h1 style={{fontSize:22,fontWeight:800,margin:0,color:"#fff",fontFamily:"Montserrat,sans-serif",textTransform:"uppercase",letterSpacing:1}}>VELKOMMEN, CEPELO</h1>
          <p style={{color:BRAND.darkGray,fontSize:12,margin:"4px 0 0",fontFamily:"'Open Sans',sans-serif"}}>cepelo.dk · Fremtidens Værksted · Claude AI</p>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:6,background:`${BRAND.blue}15`,border:`1px solid ${BRAND.blue}30`,borderRadius:20,padding:"5px 12px"}}>
          <div style={{width:6,height:6,borderRadius:"50%",background:BRAND.lightBlue,animation:"pulse 1.5s infinite"}}/>
          <span style={{color:BRAND.lightBlue,fontSize:11,fontWeight:700,fontFamily:"Montserrat,sans-serif"}}>LIVE</span>
        </div>
      </div>
      {/* AI banner */}
      <div style={{background:`linear-gradient(135deg,${BRAND.navy},${BRAND.blue}30)`,border:`1px solid ${BRAND.blue}40`,borderRadius:10,padding:"13px 18px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <span style={{fontSize:20}}>✨</span>
          <div>
            <p style={{fontSize:12,fontWeight:700,color:"#fff",margin:0,fontFamily:"Montserrat,sans-serif",textTransform:"uppercase",letterSpacing:".3px"}}>CLAUDE AI AKTIVERET</p>
            <p style={{fontSize:11,color:BRAND.darkGray,margin:"2px 0 0",fontFamily:"'Open Sans',sans-serif"}}>Blog-artikler + Nyhedsmail · Dansk SEO-optimeret · Brand guide implementeret</p>
          </div>
        </div>
        <button onClick={()=>setNav("generate")} style={{background:BRAND.blue,border:"none",borderRadius:6,padding:"8px 16px",color:"#fff",fontSize:11,fontWeight:800,cursor:"pointer",fontFamily:"Montserrat,sans-serif",textTransform:"uppercase",letterSpacing:".3px"}}>GENERER →</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <div style={card()}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <p style={sLabel}>Content Plan</p>
            <div style={{display:"flex",gap:6}}>
              <span style={{background:`${BRAND.blue}20`,color:BRAND.lightBlue,border:`1px solid ${BRAND.blue}30`,borderRadius:4,padding:"2px 7px",fontSize:10,fontWeight:700}}>{stats.published} PUB</span>
              <span style={{background:"rgba(251,191,36,.1)",color:"#fbbf24",border:"1px solid rgba(251,191,36,.2)",borderRadius:4,padding:"2px 7px",fontSize:10,fontWeight:700}}>{stats.queued} KØ</span>
            </div>
          </div>
          {articles.slice(0,2).map(a=>(
            <div key={a.id} style={{padding:"8px 0",borderBottom:`1px solid ${BRAND.blue}15`}}>
              {statusBadge(a.status,generatingIds.has(a.id))}
              <p style={{color:"#e5e7eb",fontSize:12,fontWeight:500,margin:"5px 0 2px",lineHeight:1.35,fontFamily:"'Open Sans',sans-serif"}}>{a.topic.substring(0,65)}…</p>
            </div>
          ))}
          <button onClick={()=>setNav("content")} style={{marginTop:10,background:"none",border:"none",color:BRAND.lightBlue,fontSize:11,fontWeight:700,cursor:"pointer",padding:0,fontFamily:"Montserrat,sans-serif",textTransform:"uppercase",letterSpacing:".3px"}}>SE ALLE →</button>
        </div>
        <div style={card()}>
          <p style={sLabel}>Nyhedsmail → HubSpot</p>
          <div style={{display:"flex",gap:14,marginBottom:12}}>
            <div><p style={{fontSize:26,fontWeight:700,color:"#fff",lineHeight:1,fontFamily:"monospace",margin:0}}>{newsletters.length}</p><p style={{fontSize:10,color:BRAND.darkGray,marginTop:4}}>Genererede</p></div>
            <div><p style={{fontSize:26,fontWeight:700,color:"#fff",lineHeight:1,fontFamily:"monospace",margin:0}}>{newsletters.filter(n=>n.status==="sent_to_hubspot").length}</p><p style={{fontSize:10,color:BRAND.darkGray,marginTop:4}}>Sendt til HubSpot</p></div>
          </div>
          <button onClick={()=>setNav("newsletter")} style={{background:BRAND.blue,border:"none",borderRadius:6,padding:"8px 14px",color:"#fff",fontSize:11,fontWeight:800,cursor:"pointer",fontFamily:"Montserrat,sans-serif",textTransform:"uppercase",letterSpacing:".3px",width:"100%"}}>✉ GENERER NYHEDSMAIL</button>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <div style={card()}>
          <p style={sLabel}>LLM Synlighedsscore</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div style={{background:`${BRAND.blue}10`,borderRadius:7,padding:"12px"}}>
              <p style={{fontSize:10,color:BRAND.darkGray,marginBottom:5,fontFamily:"'Open Sans',sans-serif"}}>AI Synlighed</p>
              <p style={{fontSize:34,fontWeight:700,color:BRAND.lightBlue,lineHeight:1,fontFamily:"monospace",margin:0}}>42<span style={{fontSize:14}}>%</span></p>
            </div>
            <div style={{background:`${BRAND.blue}10`,borderRadius:7,padding:"12px"}}>
              <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:7}}><div style={{width:5,height:5,borderRadius:"50%",background:BRAND.lightBlue,animation:"pulse 1.4s infinite"}}/><span style={{fontSize:9,color:BRAND.lightBlue,fontWeight:700}}>RUNNING</span></div>
              <p style={{fontSize:11,color:"#9ca3af",lineHeight:1.4,margin:0,fontFamily:"'Open Sans',sans-serif"}}>Fremtidens EV-værksted i Danmark?</p>
            </div>
          </div>
        </div>
        <div style={card()}>
          <p style={sLabel}>Technical Audit</p>
          <div style={{display:"flex",alignItems:"center",gap:16}}>
            <GaugeArc score={61}/>
            <div style={{flex:1,display:"flex",flexDirection:"column",gap:7}}>
              {[["Page Speed",38,"#f87171"],["LLM Optim.",82,BRAND.lightBlue],["SEO Optim.",51,"#fbbf24"]].map(([l,v,c])=>(
                <div key={l} style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontSize:10,color:BRAND.darkGray,fontFamily:"'Open Sans',sans-serif"}}>{l}</span>
                  <span style={{fontSize:11,fontWeight:700,color:c,fontFamily:"monospace"}}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div style={card()}>
        <p style={sLabel}>Vækstprognose</p>
        <div style={{display:"flex",gap:28,marginBottom:14}}>
          <div><p style={{fontSize:26,fontWeight:700,color:"#fff",fontFamily:"monospace",lineHeight:1,margin:0}}>840K</p><p style={{fontSize:10,color:BRAND.darkGray,marginTop:3,fontFamily:"'Open Sans',sans-serif"}}>søgevolumen</p></div>
          <div><p style={{fontSize:26,fontWeight:700,color:"#fff",fontFamily:"monospace",lineHeight:1,margin:0}}>312</p><p style={{fontSize:10,color:BRAND.darkGray,marginTop:3,fontFamily:"'Open Sans',sans-serif"}}>keywords</p></div>
        </div>
        <div style={{position:"relative",height:80}}>
          <svg viewBox="0 0 560 80" style={{width:"100%",height:80,overflow:"visible"}}>
            <rect x="0" y="0" width="140" height="80" fill={`${BRAND.blue}08`} rx="2"/>
            <rect x="140" y="0" width="140" height="80" fill={`${BRAND.lightBlue}05`} rx="2"/>
            <rect x="280" y="0" width="280" height="80" fill={`${BRAND.blue}05`} rx="2"/>
            {["Fundament","Vækst","Skalering"].map((t,i)=><text key={t} x={70+i*140} y="12" textAnchor="middle" fill={BRAND.darkGray} fontSize="8" fontFamily="Montserrat,sans-serif">{t.toUpperCase()}</text>)}
            <line x1="196" y1="0" x2="196" y2="80" stroke="#fbbf24" strokeWidth=".8" strokeDasharray="3,3"/>
            {(()=>{const pts=growthData.map((v,i)=>[i*(560/19),76-(v/7100)*65]);const path=pts.map((p,i)=>i===0?`M${p[0]},${p[1]}`:`L${p[0]},${p[1]}`).join(" ");const area=`${path} L${pts[pts.length-1][0]},80 L0,80 Z`;return(<><path d={area} fill={BRAND.blue} fillOpacity=".12"/><path d={path} fill="none" stroke={BRAND.lightBlue} strokeWidth="2" strokeLinecap="round"/><circle cx={pts[7][0]} cy={pts[7][1]} r="4" fill="#fbbf24"/></>);})()}
          </svg>
        </div>
        <div style={{display:"flex",marginTop:10}}>
          {[["Fundament","Mnd 1-3",BRAND.blue],["Vækst","Mnd 3-6",BRAND.lightBlue],["Skalering","Mnd 6-12","#60a5fa"]].map(([p,m,c])=>(
            <div key={p} style={{flex:1,borderTop:`2px solid ${c}`,paddingTop:8,paddingRight:14}}>
              <p style={{fontSize:11,fontWeight:700,color:c,margin:"0 0 2px",fontFamily:"Montserrat,sans-serif"}}>{p}</p>
              <p style={{fontSize:10,color:BRAND.darkGray,margin:0,fontFamily:"'Open Sans',sans-serif"}}>{m}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── NEWSLETTER ────────────────────────────────────────────────────────────
  const NewsletterPage=()=>(
    <div style={{display:"flex",flexDirection:"column",gap:16,animation:"fadeUp .3s ease"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <h2 style={{fontSize:18,fontWeight:800,margin:0,color:"#fff",fontFamily:"Montserrat,sans-serif",textTransform:"uppercase",letterSpacing:.5}}>NYHEDSMAIL → HUBSPOT</h2>
          <p style={{color:BRAND.darkGray,fontSize:12,margin:"3px 0 0",fontFamily:"'Open Sans',sans-serif"}}>Generer email med Claude AI · Send direkte til HubSpot som udkast</p>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:6,background:`${BRAND.blue}15`,border:`1px solid ${BRAND.blue}30`,borderRadius:10,padding:"5px 11px"}}><div style={{width:5,height:5,borderRadius:"50%",background:BRAND.lightBlue,animation:"pulse 1.4s infinite"}}/><span style={{fontSize:10,color:BRAND.lightBlue,fontWeight:700,fontFamily:"Montserrat,sans-serif"}}>CLAUDE AI</span></div>
      </div>
      {/* Type selector */}
      <div style={card()}>
        <p style={sLabel}>Type nyhedsmail</p>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {["Produktnyheder","Branchenyheder & guides","Tilbud & kampagner"].map(t=>(
            <button key={t} onClick={()=>setNlType(t)} style={{background:nlType===t?`${BRAND.blue}25`:"rgba(255,255,255,.03)",border:`1px solid ${nlType===t?BRAND.blue+"50":"rgba(255,255,255,.08)"}`,borderRadius:7,padding:"7px 14px",color:nlType===t?BRAND.lightBlue:"#9ca3af",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"Montserrat,sans-serif",textTransform:"uppercase",letterSpacing:".3px"}}>{t}</button>
          ))}
        </div>
      </div>
      {/* Topic categories */}
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {NEWSLETTER_TOPICS.map(cat=>{
          const isOpen=openNlCat===cat.label;
          return(
            <div key={cat.label} style={{background:"rgba(255,255,255,.025)",border:`1px solid ${isOpen?BRAND.blue+"50":"rgba(255,255,255,.07)"}`,borderRadius:10,overflow:"hidden"}}>
              <button onClick={()=>setOpenNlCat(isOpen?null:cat.label)} style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 16px",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit"}}>
                <div style={{display:"flex",alignItems:"center",gap:9}}><span style={{fontSize:14}}>{cat.icon}</span><span style={{fontSize:12,fontWeight:700,color:isOpen?BRAND.lightBlue:"#9ca3af",fontFamily:"Montserrat,sans-serif",textTransform:"uppercase",letterSpacing:".3px"}}>{cat.label}</span></div>
                <span style={{color:BRAND.darkGray,fontSize:12,display:"inline-block",transform:isOpen?"rotate(180deg)":"none",transition:"transform .2s"}}>▾</span>
              </button>
              {isOpen&&(
                <div style={{padding:"0 16px 14px",display:"flex",flexDirection:"column",gap:6}}>
                  {cat.topics.map(t=>{
                    const sel=nlSelectedTopic===t;
                    return(
                      <button key={t} onClick={()=>setNlSelectedTopic(sel?null:t)} style={{background:sel?`${BRAND.blue}15`:"rgba(255,255,255,.03)",border:`1px solid ${sel?BRAND.blue+"50":"rgba(255,255,255,.07)"}`,borderRadius:7,padding:"9px 12px",color:sel?BRAND.lightBlue:"#d1d5db",fontSize:12,cursor:"pointer",textAlign:"left",lineHeight:1.4,fontFamily:"'Open Sans',sans-serif"}}>
                        {sel&&"✓ "}{t}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {/* Custom */}
      <div style={card()}>
        <p style={sLabel}>Eget emne</p>
        <input value={nlCustomTopic} onChange={e=>setNlCustomTopic(e.target.value)} placeholder="f.eks. Forårstilbud på ADAS-udstyr – 15% rabat i maj..." style={{width:"100%",background:`${BRAND.blue}10`,border:`1px solid ${BRAND.blue}25`,borderRadius:7,padding:"10px 13px",color:"#f9fafb",fontSize:12,fontFamily:"'Open Sans',sans-serif"}}/>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <p style={{color:BRAND.darkGray,fontSize:12,fontFamily:"'Open Sans',sans-serif"}}>{nlSelectedTopic?`Valgt: "${nlSelectedTopic.substring(0,45)}…"`:nlCustomTopic?"Eget emne klar":"Vælg et emne ovenfor"}</p>
        <button disabled={nlGenerating||(!nlSelectedTopic&&!nlCustomTopic)} onClick={handleGenerateNewsletter} style={{background:nlGenerating||(!nlSelectedTopic&&!nlCustomTopic)?`${BRAND.blue}30`:BRAND.blue,border:"none",borderRadius:7,padding:"10px 24px",color:nlGenerating||(!nlSelectedTopic&&!nlCustomTopic)?BRAND.darkGray:"#fff",fontSize:12,fontWeight:800,cursor:"pointer",fontFamily:"Montserrat,sans-serif",textTransform:"uppercase",letterSpacing:".3px",display:"flex",alignItems:"center",gap:7}}>
          {nlGenerating?<><div style={{width:8,height:8,borderRadius:"50%",background:BRAND.lightBlue,animation:"pulse 1.4s infinite"}}/>GENERERER…</>:"✉ GENERER NYHEDSMAIL"}
        </button>
      </div>
      {/* Generated newsletters */}
      {newsletters.length>0&&(
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <p style={sLabel}>Genererede nyhedsmail</p>
          {newsletters.map(nl=>(
            <div key={nl.id} style={card({display:"flex",justifyContent:"space-between",alignItems:"center",gap:12})}>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:5}}>
                  <span style={{background:nl.status==="sent_to_hubspot"?`${BRAND.blue}20`:"rgba(251,191,36,.1)",color:nl.status==="sent_to_hubspot"?BRAND.lightBlue:"#fbbf24",border:`1px solid ${nl.status==="sent_to_hubspot"?BRAND.blue+"30":"rgba(251,191,36,.25)"}`,borderRadius:20,padding:"2px 8px",fontSize:10,fontWeight:700}}>{nl.status==="sent_to_hubspot"?"I HUBSPOT":"UDKAST"}</span>
                  <span style={{fontSize:10,color:BRAND.darkGray,fontFamily:"Montserrat,sans-serif",textTransform:"uppercase",letterSpacing:".3px"}}>{nl.type}</span>
                </div>
                <p style={{color:"#e5e7eb",fontSize:13,fontWeight:600,margin:"0 0 3px",fontFamily:"Montserrat,sans-serif"}}>{nl.subject}</p>
                <p style={{color:BRAND.darkGray,fontSize:11,margin:0,fontFamily:"'Open Sans',sans-serif"}}>{nl.headline?.substring(0,60)}</p>
              </div>
              <div style={{display:"flex",gap:7,flexShrink:0}}>
                <button onClick={()=>setNlPreview(nl)} style={{background:`${BRAND.blue}20`,border:`1px solid ${BRAND.blue}40`,borderRadius:7,padding:"6px 12px",color:BRAND.lightBlue,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"Montserrat,sans-serif",textTransform:"uppercase",letterSpacing:".2px"}}>Preview</button>
                {nl.status!=="sent_to_hubspot"&&<button onClick={()=>{setNlPreview(nl);}} style={{background:BRAND.blue,border:"none",borderRadius:7,padding:"6px 12px",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"Montserrat,sans-serif",textTransform:"uppercase",letterSpacing:".2px"}}>→ HubSpot</button>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ── CONTENT PLAN ──────────────────────────────────────────────────────────
  const ContentPage=()=>{
    const year=calMonth.getFullYear(),month=calMonth.getMonth();
    const days=getDaysInMonth(year,month),firstDay=getFirstDayOfMonth(year,month);
    const dayNames=["Man","Tir","Ons","Tor","Fre","Lør","Søn"];
    const monthNames=["Januar","Februar","Marts","April","Maj","Juni","Juli","August","September","Oktober","November","December"];
    const cells=[...Array(firstDay-1).fill(null),...Array(days).fill(0).map((_,i)=>i+1)];
    while(cells.length%7!==0)cells.push(null);
    return(
      <div style={{animation:"fadeUp .3s ease"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <div><h2 style={{fontSize:18,fontWeight:800,margin:0,color:"#fff",fontFamily:"Montserrat,sans-serif",textTransform:"uppercase",letterSpacing:.5}}>CONTENT PLAN</h2><p style={{color:BRAND.darkGray,fontSize:11,margin:"3px 0 0",fontFamily:"'Open Sans',sans-serif"}}>3 SEO-artikler pr. uge · Claude AI</p></div>
          <div style={{display:"flex",alignItems:"center",gap:9}}>
            <span style={{background:`${BRAND.blue}20`,color:BRAND.lightBlue,border:`1px solid ${BRAND.blue}30`,borderRadius:4,padding:"2px 8px",fontSize:10,fontWeight:700}}>{stats.published} PUB</span>
            <span style={{background:"rgba(251,191,36,.1)",color:"#fbbf24",border:"1px solid rgba(251,191,36,.2)",borderRadius:4,padding:"2px 8px",fontSize:10,fontWeight:700}}>{stats.queued} KØ</span>
            <button onClick={()=>setNav("generate")} style={{background:BRAND.blue,border:"none",borderRadius:7,padding:"7px 14px",color:"#fff",fontSize:11,fontWeight:800,cursor:"pointer",fontFamily:"Montserrat,sans-serif",textTransform:"uppercase",letterSpacing:".3px"}}>+ NY</button>
            <div style={{display:"flex",gap:3,alignItems:"center"}}>
              <button onClick={()=>setCalMonth(new Date(year,month-1,1))} style={{background:`${BRAND.blue}15`,border:`1px solid ${BRAND.blue}25`,borderRadius:5,width:26,height:26,color:"#9ca3af",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit"}}>‹</button>
              <span style={{fontSize:12,fontWeight:700,color:"#f9fafb",minWidth:100,textAlign:"center",fontFamily:"Montserrat,sans-serif"}}>{monthNames[month].toUpperCase()}</span>
              <button onClick={()=>setCalMonth(new Date(year,month+1,1))} style={{background:`${BRAND.blue}15`,border:`1px solid ${BRAND.blue}25`,borderRadius:5,width:26,height:26,color:"#9ca3af",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit"}}>›</button>
            </div>
          </div>
        </div>
        <div style={{background:`${BRAND.blue}08`,border:`1px solid ${BRAND.blue}20`,borderRadius:8,padding:"7px 14px",marginBottom:12,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:7}}><div style={{width:5,height:5,borderRadius:"50%",background:BRAND.lightBlue,animation:"pulse 1.4s infinite"}}/><span style={{fontSize:11,color:"#9ca3af",fontFamily:"'Open Sans',sans-serif"}}>Claude AI genererer SEO-artikler tilpasset Cepelo's EV-produkter og målgruppe</span></div>
          <div style={{display:"flex",alignItems:"center",gap:5,background:`${BRAND.blue}15`,border:`1px solid ${BRAND.blue}25`,borderRadius:10,padding:"2px 8px"}}><div style={{width:4,height:4,borderRadius:"50%",background:BRAND.lightBlue,animation:"pulse 1.4s infinite"}}/><span style={{fontSize:9,color:BRAND.lightBlue,fontWeight:700,fontFamily:"Montserrat,sans-serif"}}>RUNNING</span></div>
        </div>
        <div style={{background:"rgba(255,255,255,.02)",border:`1px solid ${BRAND.blue}15`,borderRadius:10,overflow:"hidden",marginBottom:14}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",borderBottom:`1px solid ${BRAND.blue}15`}}>
            {dayNames.map(d=><div key={d} style={{padding:"9px 0",textAlign:"center",fontSize:10,fontWeight:700,color:BRAND.darkGray,textTransform:"uppercase",letterSpacing:".06em",fontFamily:"Montserrat,sans-serif"}}>{d}</div>)}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)"}}>
            {cells.map((day,i)=>{
              const dayArts=day?getArticlesForDay(day):[];
              const isToday=day===13&&month===4&&year===2026;
              return(
                <div key={i} onClick={()=>day&&dayArts.length>0&&setCalSelected(calSelected?.day===day?null:{day,arts:dayArts})} style={{minHeight:84,borderRight:`1px solid ${BRAND.blue}10`,borderBottom:`1px solid ${BRAND.blue}10`,padding:"6px 5px",background:isToday?`${BRAND.blue}10`:"transparent",cursor:day&&dayArts.length>0?"pointer":"default"}}>
                  {day&&<p style={{fontSize:11,fontWeight:isToday?700:400,color:isToday?BRAND.lightBlue:BRAND.darkGray,margin:"0 0 4px"}}>{day}</p>}
                  {dayArts.slice(0,2).map(a=>(
                    <div key={a.id} style={{background:a.status==="published"?`${BRAND.blue}20`:`rgba(251,191,36,.12)`,border:`1px solid ${a.status==="published"?BRAND.blue+"30":"rgba(251,191,36,.2)"}`,borderRadius:3,padding:"2px 5px",marginBottom:3}}>
                      <p style={{fontSize:9,fontWeight:700,color:a.status==="published"?BRAND.lightBlue:"#fbbf24",margin:0,lineHeight:1.2,fontFamily:"Montserrat,sans-serif"}}>{a.topic.substring(0,30)}…</p>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
        {calSelected&&(
          <div style={card()}>
            <p style={{...sLabel,marginBottom:10}}>Artikler — {calSelected.day}. {["jan","feb","mar","apr","maj","jun","jul","aug","sep","okt","nov","dec"][month]}</p>
            <div style={{display:"flex",flexDirection:"column",gap:9}}>
              {calSelected.arts.map(a=>(
                <div key={a.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px",background:`${BRAND.blue}08`,border:`1px solid ${BRAND.blue}15`,borderRadius:8}}>
                  <div style={{flex:1}}>
                    {statusBadge(a.status,generatingIds.has(a.id))}
                    <p style={{color:"#e5e7eb",fontSize:12,fontWeight:600,margin:"5px 0 2px",lineHeight:1.35,fontFamily:"'Open Sans',sans-serif"}}>{a.topic}</p>
                    {a.wordCount>0&&<p style={{color:BRAND.darkGray,fontSize:10,margin:0,fontFamily:"'Open Sans',sans-serif"}}>{a.wordCount} ord · Claude AI ✨</p>}
                  </div>
                  <div style={{display:"flex",gap:6}}>
                    {a.content&&!a.content.isPlaceholder&&<button onClick={()=>setPreview(a)} style={{background:`${BRAND.blue}20`,border:`1px solid ${BRAND.blue}40`,borderRadius:6,padding:"5px 10px",color:BRAND.lightBlue,fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"Montserrat,sans-serif",textTransform:"uppercase"}}>Preview</button>}
                    {(a.content?.isPlaceholder||a.status==="error")&&!generatingIds.has(a.id)&&<button onClick={()=>handleRegenerate(a.id)} style={{background:`${BRAND.blue}15`,border:`1px solid ${BRAND.blue}30`,borderRadius:6,padding:"5px 10px",color:BRAND.lightBlue,fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"Montserrat,sans-serif",textTransform:"uppercase"}}>✨ Generer</button>}
                    {a.status==="ready"&&!a.content?.isPlaceholder&&<button onClick={()=>{handleApprove(a.id);setCalSelected(null);}} style={{background:BRAND.blue,border:"none",borderRadius:6,padding:"5px 10px",color:"#fff",fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"Montserrat,sans-serif",textTransform:"uppercase"}}>✓ Upload</button>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // ── GENERATE ──────────────────────────────────────────────────────────────
  const GeneratePage=()=>(
    <div style={{animation:"fadeUp .3s ease"}}>
      <div style={{marginBottom:18}}>
        <h2 style={{fontSize:18,fontWeight:800,margin:0,color:"#fff",fontFamily:"Montserrat,sans-serif",textTransform:"uppercase",letterSpacing:.5}}>GENERER SEO-ARTIKEL</h2>
        <p style={{color:BRAND.darkGray,fontSize:12,margin:"4px 0 0",fontFamily:"'Open Sans',sans-serif"}}>Vælg op til 3 emner · Claude AI skriver 700+ ord dansk SEO-indhold</p>
      </div>
      <div style={{background:`linear-gradient(135deg,${BRAND.navy},${BRAND.blue}25)`,border:`1px solid ${BRAND.blue}35`,borderRadius:9,padding:"11px 16px",marginBottom:16,display:"flex",alignItems:"center",gap:10}}>
        <span style={{fontSize:18}}>✨</span>
        <div><p style={{fontSize:12,fontWeight:800,color:"#fff",margin:0,fontFamily:"Montserrat,sans-serif",textTransform:"uppercase",letterSpacing:".3px"}}>POWERED BY CLAUDE AI</p><p style={{fontSize:11,color:BRAND.darkGray,margin:"2px 0 0",fontFamily:"'Open Sans',sans-serif"}}>Intro · 4 sektioner · Bullets · Meta-beskrivelse · CTA · Montserrat/Open Sans styling</p></div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:9,marginBottom:16}}>
        {TOPIC_CATEGORIES.map(cat=>{
          const isOpen=openCat===cat.label;
          const selCount=cat.topics.filter(t=>selected.find(s=>s.title===t.title)).length;
          return(
            <div key={cat.label} style={{background:"rgba(255,255,255,.025)",border:`1px solid ${isOpen?BRAND.blue+"50":"rgba(255,255,255,.07)"}`,borderRadius:10,overflow:"hidden"}}>
              <button onClick={()=>setOpenCat(isOpen?null:cat.label)} style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 15px",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit"}}>
                <div style={{display:"flex",alignItems:"center",gap:9}}>
                  <span style={{fontSize:14}}>{cat.icon}</span>
                  <span style={{fontSize:11,fontWeight:700,color:isOpen?BRAND.lightBlue:"#9ca3af",fontFamily:"Montserrat,sans-serif",textTransform:"uppercase",letterSpacing:".3px"}}>{cat.label}</span>
                  {selCount>0&&<span style={{background:`${BRAND.blue}20`,color:BRAND.lightBlue,border:`1px solid ${BRAND.blue}40`,borderRadius:20,padding:"1px 7px",fontSize:10,fontWeight:700}}>{selCount}</span>}
                </div>
                <span style={{color:BRAND.darkGray,fontSize:12,display:"inline-block",transform:isOpen?"rotate(180deg)":"none",transition:"transform .2s"}}>▾</span>
              </button>
              {isOpen&&(
                <div style={{padding:"0 15px 14px",display:"flex",flexDirection:"column",gap:6}}>
                  {cat.topics.map(t=>{
                    const sel=!!selected.find(s=>s.title===t.title);
                    const maxed=selected.length>=3&&!sel;
                    return(
                      <button key={t.title} onClick={()=>!maxed&&toggleTopic({...t,category:cat.label,accent:cat.accent,icon:cat.icon})} style={{background:sel?`${BRAND.blue}15`:"rgba(255,255,255,.03)",border:`1px solid ${sel?BRAND.blue+"50":"rgba(255,255,255,.07)"}`,borderRadius:7,padding:"9px 12px",color:maxed?BRAND.darkGray:sel?BRAND.lightBlue:"#d1d5db",fontSize:12,cursor:maxed?"not-allowed":"pointer",textAlign:"left",lineHeight:1.4,fontFamily:"'Open Sans',sans-serif"}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10}}>
                          <span>{sel&&"✓ "}{t.title}</span>
                          <div style={{display:"flex",gap:5,flexShrink:0}}>
                            <span style={{fontSize:10,color:BRAND.darkGray,background:`${BRAND.blue}15`,borderRadius:3,padding:"1px 5px",whiteSpace:"nowrap"}}>Vol: {t.volume}</span>
                            <span style={{fontSize:10,color:BRAND.darkGray,background:`${BRAND.blue}15`,borderRadius:3,padding:"1px 5px",whiteSpace:"nowrap"}}>Sv: {t.difficulty}/5</span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div style={{...card({marginBottom:16})}}>
        <p style={sLabel}>Eget emne</p>
        <input value={custom} onChange={e=>setCustom(e.target.value)} placeholder="f.eks. Cepelo's løsning til batteriskift på kommercielle køretøjer..." style={{width:"100%",background:`${BRAND.blue}10`,border:`1px solid ${BRAND.blue}25`,borderRadius:7,padding:"10px 13px",color:"#f9fafb",fontSize:12,fontFamily:"'Open Sans',sans-serif"}}/>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <p style={{color:BRAND.darkGray,fontSize:12,fontFamily:"'Open Sans',sans-serif"}}>{selected.length}/3 valgt{selected.length>0&&<span style={{color:BRAND.darkGray}}>{" · "}{getNextPublishDates(selected.length).map(d=>d.toLocaleDateString("da-DK",{weekday:"short",day:"numeric",month:"short"})).join(" · ")}</span>}</p>
        <button disabled={generating||(selected.length===0&&!custom)} onClick={handleGenerate} style={{background:generating||(selected.length===0&&!custom)?`${BRAND.blue}25`:BRAND.blue,border:"none",borderRadius:7,padding:"10px 24px",color:generating||(selected.length===0&&!custom)?BRAND.darkGray:"#fff",fontSize:12,fontWeight:800,cursor:"pointer",fontFamily:"Montserrat,sans-serif",textTransform:"uppercase",letterSpacing:".3px",display:"flex",alignItems:"center",gap:7}}>
          {generating?<><div style={{width:9,height:9,borderRadius:"50%",background:BRAND.lightBlue,animation:"pulse 1.4s infinite"}}/>GENERERER…</>:"✨ GENERER MED CLAUDE AI →"}
        </button>
      </div>
    </div>
  );

  // ── SETTINGS ──────────────────────────────────────────────────────────────
  const SettingsPage=()=>(
    <div style={{animation:"fadeUp .3s ease",display:"flex",flexDirection:"column",gap:14}}>
      <h2 style={{fontSize:18,fontWeight:800,margin:0,color:"#fff",fontFamily:"Montserrat,sans-serif",textTransform:"uppercase",letterSpacing:.5}}>INDSTILLINGER</h2>
      <div style={card()}>
        <p style={{fontSize:12,fontWeight:700,color:BRAND.darkGray,marginBottom:14,fontFamily:"Montserrat,sans-serif",textTransform:"uppercase",letterSpacing:".3px"}}>Shopify Blog API</p>
        {[{label:"Shopify domæne",val:shopifyDomain,set:setShopifyDomain,ph:"cepelo.dk",pw:false},{label:"Admin API Access Token",val:shopifyToken,set:setShopifyToken,ph:"shpat_xxxxxxxxxxxxxxxxxxxx",pw:true}].map(({label,val,set,ph,pw})=>(
          <div key={label} style={{marginBottom:13}}>
            <p style={{fontSize:11,fontWeight:600,color:BRAND.darkGray,marginBottom:5,fontFamily:"'Open Sans',sans-serif"}}>{label}</p>
            <input type={pw?"password":"text"} value={val} onChange={e=>set(e.target.value)} placeholder={ph} style={{width:"100%",background:`${BRAND.blue}10`,border:`1px solid ${BRAND.blue}25`,borderRadius:7,padding:"9px 12px",color:"#f9fafb",fontSize:12,fontFamily:pw?"monospace":"'Open Sans',sans-serif"}}/>
          </div>
        ))}
        <button onClick={()=>notify("Shopify-indstillinger gemt ✓")} style={{background:BRAND.blue,border:"none",borderRadius:7,padding:"8px 18px",color:"#fff",fontSize:11,fontWeight:800,cursor:"pointer",fontFamily:"Montserrat,sans-serif",textTransform:"uppercase",letterSpacing:".3px",marginTop:4}}>GEM SHOPIFY</button>
      </div>
      <div style={card()}>
        <p style={{fontSize:12,fontWeight:700,color:BRAND.darkGray,marginBottom:14,fontFamily:"Montserrat,sans-serif",textTransform:"uppercase",letterSpacing:".3px"}}>HubSpot API</p>
        <div style={{marginBottom:13}}>
          <p style={{fontSize:11,fontWeight:600,color:BRAND.darkGray,marginBottom:5,fontFamily:"'Open Sans',sans-serif"}}>HubSpot Private App Access Token</p>
          <input type="password" value={hubspotToken} onChange={e=>setHubspotToken(e.target.value)} placeholder="pat-eu1-xxxxxxxxxxxxxxxxxxxx" style={{width:"100%",background:`${BRAND.blue}10`,border:`1px solid ${BRAND.blue}25`,borderRadius:7,padding:"9px 12px",color:"#f9fafb",fontSize:12,fontFamily:"monospace"}}/>
        </div>
        <button onClick={()=>notify("HubSpot-indstillinger gemt ✓")} style={{background:BRAND.blue,border:"none",borderRadius:7,padding:"8px 18px",color:"#fff",fontSize:11,fontWeight:800,cursor:"pointer",fontFamily:"Montserrat,sans-serif",textTransform:"uppercase",letterSpacing:".3px"}}>GEM HUBSPOT</button>
        <div style={{background:`${BRAND.blue}08`,border:`1px solid ${BRAND.blue}20`,borderRadius:8,padding:"14px",marginTop:14}}>
          <p style={{fontSize:11,fontWeight:700,color:BRAND.lightBlue,marginBottom:7,fontFamily:"Montserrat,sans-serif",textTransform:"uppercase",letterSpacing:".3px"}}>Sådan finder du HubSpot API-nøglen</p>
          {["HubSpot → Indstillinger → Integrationer → Private Apps","Klik 'Opret en privat app'","Under Scopes: aktivér content (email read/write)","Opret app → kopiér Access Token"].map((s,i)=>(
            <p key={i} style={{color:BRAND.darkGray,fontSize:11,lineHeight:1.6,margin:"2px 0",fontFamily:"'Open Sans',sans-serif"}}><span style={{color:BRAND.lightBlue,fontWeight:700}}>{i+1}.</span> {s}</p>
          ))}
        </div>
      </div>
      <div style={{background:"rgba(251,191,36,.04)",border:"1px solid rgba(251,191,36,.12)",borderRadius:10,padding:"16px"}}>
        <p style={{fontSize:11,fontWeight:700,color:"#b45309",marginBottom:7,fontFamily:"Montserrat,sans-serif",textTransform:"uppercase",letterSpacing:".3px"}}>Shopify API — Kvik-guide</p>
        {["Shopify Admin → Indstillinger → Apps og salgskanaler","Klik 'Udvikl apps' → 'Opret en app'","Konfigurér Admin API scopes: write_content, read_content","Installer app → kopiér Access Token"].map((s,i)=>(
          <p key={i} style={{color:"#92400e",fontSize:11,lineHeight:1.6,margin:"2px 0",fontFamily:"'Open Sans',sans-serif"}}><span style={{color:"#b45309",fontWeight:700}}>{i+1}.</span> {s}</p>
        ))}
      </div>
      <div style={card()}>
        <p style={{fontSize:12,fontWeight:700,color:BRAND.darkGray,marginBottom:10,fontFamily:"Montserrat,sans-serif",textTransform:"uppercase",letterSpacing:".3px"}}>Publiceringsplan</p>
        <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
          {[["Mandag",true],["Tirsdag",false],["Onsdag",true],["Torsdag",false],["Fredag",true],["Lørdag",false],["Søndag",false]].map(([d,a])=>(
            <div key={d} style={{padding:"6px 12px",borderRadius:7,fontSize:11,fontWeight:700,background:a?`${BRAND.blue}15`:"rgba(255,255,255,.03)",border:a?`1px solid ${BRAND.blue}30`:"1px solid rgba(255,255,255,.06)",color:a?BRAND.lightBlue:BRAND.darkGray,fontFamily:"Montserrat,sans-serif",textTransform:"uppercase",letterSpacing:".2px"}}>{d}</div>
          ))}
        </div>
      </div>
    </div>
  );

  const AnalyticsPage=()=>(
    <div style={{animation:"fadeUp .3s ease",display:"flex",flexDirection:"column",gap:14}}>
      <h2 style={{fontSize:18,fontWeight:800,margin:0,color:"#fff",fontFamily:"Montserrat,sans-serif",textTransform:"uppercase",letterSpacing:.5}}>ANALYTICS</h2>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        {[["Google Search Console","📊"],["Google Analytics","📈"]].map(([t,i])=>(
          <div key={t} style={card()}><p style={sLabel}>{t}</p><div style={{textAlign:"center",padding:"20px 0"}}><div style={{fontSize:28,marginBottom:8}}>{i}</div><p style={{color:BRAND.darkGray,fontSize:12,marginBottom:12,fontFamily:"'Open Sans',sans-serif"}}>Ikke forbundet endnu</p><button style={{background:`${BRAND.blue}20`,border:`1px solid ${BRAND.blue}40`,borderRadius:7,padding:"8px 18px",color:BRAND.lightBlue,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"Montserrat,sans-serif",textTransform:"uppercase",letterSpacing:".3px"}}>TILSLUT SITE</button></div></div>
        ))}
      </div>
      <div style={card()}>
        <p style={sLabel}>LLM Synlighed</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <div style={{background:`${BRAND.blue}10`,borderRadius:9,padding:14}}><p style={{fontSize:11,color:BRAND.darkGray,margin:"0 0 7px",fontFamily:"'Open Sans',sans-serif"}}>Score</p><p style={{fontSize:44,fontWeight:700,color:BRAND.lightBlue,lineHeight:1,fontFamily:"monospace",margin:0}}>42<span style={{fontSize:18}}>%</span></p><p style={{fontSize:10,color:BRAND.darkGray,margin:"5px 0 0",fontFamily:"'Open Sans',sans-serif"}}>2 af 5 prompts nævner Cepelo</p></div>
          <div style={{background:`${BRAND.blue}10`,borderRadius:9,padding:14}}><p style={{fontSize:11,color:BRAND.darkGray,margin:"0 0 9px",fontFamily:"'Open Sans',sans-serif"}}>Aktive prompts</p>{["Bedste EV-værksted i DK?","ADAS kalibrering pris?","SOH-test elbil?","Fremtidens autoværksted?","EV-opladning erhverv?"].map((p,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:`1px solid ${BRAND.blue}10`}}><span style={{fontSize:10,color:"#9ca3af",fontFamily:"'Open Sans',sans-serif"}}>{p}</span><span style={{fontSize:9,color:i<2?BRAND.lightBlue:BRAND.darkGray,fontWeight:700}}>{i<2?"✓":"–"}</span></div>)}</div>
        </div>
      </div>
    </div>
  );

  const BacklinksPage=()=>(
    <div style={{animation:"fadeUp .3s ease",display:"flex",flexDirection:"column",gap:14}}>
      <h2 style={{fontSize:18,fontWeight:800,margin:0,color:"#fff",fontFamily:"Montserrat,sans-serif",textTransform:"uppercase",letterSpacing:.5}}>BACKLINKS</h2>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
        {[["Backlink kreditter","-4","rgba(248,113,113,.1)","#f87171"],["Backlinks modtaget","90",`${BRAND.blue}15`,BRAND.lightBlue],["Backlinks værdi","kr. 68.400","rgba(96,165,250,.1)","#60a5fa"]].map(([l,v,bg,c])=>(
          <div key={l} style={{background:bg,border:`1px solid ${c}30`,borderRadius:10,padding:"16px"}}><p style={{fontSize:26,fontWeight:700,color:c,lineHeight:1,fontFamily:"monospace",margin:0}}>{v}</p><p style={{fontSize:10,color:BRAND.darkGray,marginTop:5,fontWeight:700,textTransform:"uppercase",letterSpacing:".06em",fontFamily:"Montserrat,sans-serif"}}>{l}</p></div>
        ))}
      </div>
      <div style={card()}>
        <p style={sLabel}>Modtagne backlinks</p>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
          <thead><tr style={{borderBottom:`1px solid ${BRAND.blue}15`}}>{["Dato","Kilde","Site","DR","Værdi"].map(h=><th key={h} style={{padding:"7px 8px",textAlign:"left",color:BRAND.darkGray,fontWeight:700,fontSize:10,fontFamily:"Montserrat,sans-serif",textTransform:"uppercase",letterSpacing:".06em"}}>{h}</th>)}</tr></thead>
          <tbody>{BACKLINKS_RECEIVED.map((b,i)=>(
            <tr key={i} style={{borderBottom:`1px solid ${BRAND.blue}10`}}>
              <td style={{padding:"8px",color:BRAND.darkGray,whiteSpace:"nowrap",fontFamily:"'Open Sans',sans-serif"}}>{b.date}</td>
              <td style={{padding:"8px"}}><span style={{color:BRAND.lightBlue,fontSize:10,fontFamily:"'Open Sans',sans-serif"}}>{b.source.substring(0,40)}…</span></td>
              <td style={{padding:"8px"}}><span style={{color:BRAND.lightBlue,fontFamily:"'Open Sans',sans-serif"}}>{b.site}</span></td>
              <td style={{padding:"8px",textAlign:"center",fontWeight:700,color:"#f9fafb",fontFamily:"monospace"}}>{b.dr}</td>
              <td style={{padding:"8px",textAlign:"right",color:BRAND.lightBlue,fontWeight:700,fontFamily:"monospace"}}>kr. {b.value}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );

  const AuditPage=()=>(
    <div style={{animation:"fadeUp .3s ease",display:"flex",flexDirection:"column",gap:14}}>
      <h2 style={{fontSize:18,fontWeight:800,margin:0,color:"#fff",fontFamily:"Montserrat,sans-serif",textTransform:"uppercase",letterSpacing:.5}}>TECHNICAL AUDIT</h2>
      <div style={card()}>
        <p style={sLabel}>Health Score</p>
        <div style={{display:"flex",alignItems:"center",gap:24,flexWrap:"wrap"}}>
          <GaugeArc score={61}/>
          <div style={{flex:1,minWidth:180}}>
            {[["Page Speed Score",38,"#f87171"],["LLM Optimization Score",82,BRAND.lightBlue],["SEO Optimization Score",51,"#fbbf24"]].map(([l,v,c])=>(
              <div key={l} style={{marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:11,color:BRAND.darkGray,fontFamily:"'Open Sans',sans-serif"}}>{l}</span><span style={{fontSize:12,fontWeight:700,color:c,fontFamily:"monospace"}}>{v}</span></div>
                <div style={{height:3,background:`${BRAND.blue}15`,borderRadius:2}}><div style={{height:3,width:`${v}%`,background:c,borderRadius:2}}/></div>
              </div>
            ))}
          </div>
          <div>{[["Sitemap.xml","OK"],["Robots.txt","OK"],["LLMs.txt","OK"]].map(([f,s])=><div key={f} style={{display:"flex",justifyContent:"space-between",gap:16,padding:"4px 9px",background:`${BRAND.blue}08`,borderRadius:5,marginBottom:4}}><span style={{fontSize:11,color:"#9ca3af",fontFamily:"'Open Sans',sans-serif"}}>{f}</span><span style={{fontSize:10,color:BRAND.lightBlue,fontWeight:700,fontFamily:"Montserrat,sans-serif"}}>{s}</span></div>)}</div>
        </div>
      </div>
      <div style={card()}>
        <p style={sLabel}>Opdagede problemer</p>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
          <thead><tr style={{borderBottom:`1px solid ${BRAND.blue}15`}}>{["Side","Score","Problemer"].map(h=><th key={h} style={{padding:"7px 8px",textAlign:"left",color:BRAND.darkGray,fontWeight:700,fontSize:10,fontFamily:"Montserrat,sans-serif",textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
          <tbody>{AUDIT_PAGES.map((p,i)=><tr key={i} style={{borderBottom:`1px solid ${BRAND.blue}10`}}><td style={{padding:"8px",color:BRAND.lightBlue,fontSize:10,fontFamily:"'Open Sans',sans-serif"}}>{p.url}</td><td style={{padding:"8px"}}><span style={{fontFamily:"monospace",fontWeight:700,color:p.score>=80?BRAND.lightBlue:p.score>=70?"#fbbf24":"#f87171"}}>{p.score}/100</span></td><td style={{padding:"8px",color:BRAND.darkGray,fontFamily:"'Open Sans',sans-serif"}}>{p.issues}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );

  const pages={overview:<OverviewPage/>,content:<ContentPage/>,newsletter:<NewsletterPage/>,analytics:<AnalyticsPage/>,backlinks:<BacklinksPage/>,audit:<AuditPage/>,generate:<GeneratePage/>,settings:<SettingsPage/>};

  return(
    <div style={{display:"flex",minHeight:"100vh",background:"#0a0f1a",color:"#f9fafb",fontFamily:"'Open Sans','DM Sans',sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@800&family=Open+Sans:wght@300;400;600&display=swap');
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        *{box-sizing:border-box;margin:0;padding:0}
        button:hover{filter:brightness(1.1)}
        input:focus{outline:none;border-color:${BRAND.blue} !important}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:#0a0f1a}
        ::-webkit-scrollbar-thumb{background:${BRAND.blue}40;border-radius:3px}
      `}</style>

      {toast&&<div style={{position:"fixed",top:20,right:20,zIndex:3000,background:toast.type==="error"?"#450a0a":BRAND.navy,border:`1px solid ${toast.type==="error"?"#b91c1c":BRAND.blue}`,borderRadius:8,padding:"11px 16px",color:toast.type==="error"?"#fca5a5":BRAND.lightBlue,fontSize:12,fontWeight:600,animation:"fadeUp .25s ease",boxShadow:"0 12px 40px rgba(0,0,0,.5)",maxWidth:360,fontFamily:"'Open Sans',sans-serif"}}>{toast.msg}</div>}

      {preview&&<ShopifyPreview article={preview} onClose={()=>setPreview(null)} onApprove={handleApprove}/>}
      {nlPreview&&<NewsletterPreview newsletter={nlPreview} onClose={()=>setNlPreview(null)} onSendToHubSpot={()=>handleSendToHubSpot(nlPreview)} sending={nlSending}/>}

      {/* Sidebar */}
      <div style={{width:215,background:BRAND.navy,borderRight:`1px solid ${BRAND.blue}25`,padding:"18px 11px",display:"flex",flexDirection:"column",gap:2,flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:10,padding:"6px 6px 18px"}}>
          <div style={{width:32,height:32,borderRadius:7,background:BRAND.blue,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:14,color:"#fff",fontFamily:"Montserrat,sans-serif"}}>C</div>
          <div><p style={{fontSize:13,fontWeight:800,lineHeight:1,fontFamily:"Montserrat,sans-serif",textTransform:"uppercase",letterSpacing:.5,color:"#fff"}}>CEPELO</p><p style={{fontSize:9,color:BRAND.darkGray,marginTop:2,fontFamily:"'Open Sans',sans-serif"}}>cepelo.dk</p></div>
        </div>
        <NavItem id="overview" icon="🏠" label="Overblik"/>
        <NavItem id="content" icon="📅" label="Content Plan" badge={stats.queued>0?stats.queued:null}/>
        <NavItem id="newsletter" icon="✉️" label="Nyhedsmail → HubSpot"/>
        <NavItem id="analytics" icon="📊" label="Analytics"/>
        <NavItem id="backlinks" icon="🔗" label="Backlinks"/>
        <NavItem id="audit" icon="🔍" label="Technical Audit"/>
        <NavItem id="generate" icon="✨" label="Generer artikel"/>
        <div style={{flex:1}}/>
        <div style={{borderTop:`1px solid ${BRAND.blue}20`,paddingTop:10}}>
          <NavItem id="settings" icon="⚙️" label="Indstillinger"/>
        </div>
      </div>

      {/* Main */}
      <div style={{flex:1,padding:"26px 30px",overflowY:"auto",maxHeight:"100vh",background:"#0a0f1a"}}>
        {pages[nav]||<OverviewPage/>}
      </div>
    </div>
  );
}
