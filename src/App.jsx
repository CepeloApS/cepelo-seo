import { useState, useEffect, useCallback } from "react";

// ─── CEPELO BRAND COLORS ────────────────────────────────────────────────────
const C = {
  navy: "#173454", blue: "#0868B2", lblue: "#35b6ea",
  bg: "#0d1e2e", bg2: "#142030", bg3: "#1a2a3d", bg4: "#1f3145",
  card: "#162234", border: "rgba(53,182,234,0.12)",
  text: "#e8f0f8", textsub: "#7a9ab5", muted: "#4a6a85",
};

// ─── SHOPIFY API ─────────────────────────────────────────────────────────────
async function shopifyRequest(token, store, method, path, body = null) {
  const url = `https://${store}.myshopify.com/admin/api/2024-01${path}`;
  const opts = {
    method,
    headers: {
      "X-Shopify-Access-Token": token,
      "Content-Type": "application/json",
    },
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(url, opts);
  if (!res.ok) throw new Error(`Shopify fejl: ${res.status} ${res.statusText}`);
  return res.json();
}

async function publishToShopify(token, store, article) {
  const data = await shopifyRequest(token, store, "GET", "/blogs.json");
  let blogId = data.blogs?.[0]?.id;
  if (!blogId) throw new Error("Ingen blog fundet på Shopify-butikken");
  return shopifyRequest(token, store, "POST", `/blogs/${blogId}/articles.json`, {
    article: {
      title: article.title,
      body_html: article.html,
      published: false,
      tags: "SEO, EV, Elbil, CEPELO",
      metafields: [
        { key: "description_tag", value: article.meta, type: "single_line_text_field", namespace: "global" },
      ],
    },
  });
}

// ─── CLAUDE API ──────────────────────────────────────────────────────────────
async function generateArticle(topic) {
  const res = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 4000,
      system: `Du er en dansk SEO-tekstforfatter for CEPELO, en dansk leverandør af værkstedsløsninger til autobranchen.
Skriv på professionelt dansk. Tone: klar, teknisk kompetent, løsningsorienteret, menneskelig.
Returner KUN JSON uden markdown eller backticks:
{
  "title": "...",
  "meta": "...",
  "html": "<h2>...</h2><p>...</p>..."
}
Artiklen skal have: fængende H2-overskrift, intro-afsnit, 4 sektioner med H3, bullet-liste, konklusion og CTA.`,
      messages: [{ role: "user", content: `Skriv en SEO-artikel (700+ ord) om: ${topic}` }],
    }),
  });
  const d = await res.json();
  console.log("RAW API RESPONSE:", JSON.stringify(d));
  const text = d.content?.[0]?.text || "{}";
  console.log("TEXT FROM API:", text);
  try {
    const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
    console.log("PARSED ARTICLE:", parsed);
    return parsed;
  } catch (parseErr) {
    console.log("JSON PARSE FAILED:", parseErr.message);
    return { title: topic, meta: "", html: `<p>${text}</p>` };
  }
}

// ─── TOPICS DATA ─────────────────────────────────────────────────────────────
const TOPICS = [
  { cat: "SOH & Batteridiagnostik", title: "EV-batteriets State of Health — hvad er det?", vol: 320, diff: "low" },
  { cat: "SOH & Batteridiagnostik", title: "Sådan måler du SOH på en elbil korrekt", vol: 280, diff: "low" },
  { cat: "SOH & Batteridiagnostik", title: "Batteridegradation: årsager og forebyggelse", vol: 210, diff: "med" },
  { cat: "SOH & Batteridiagnostik", title: "BMS-fejlkoder forklaret til værkstedsmekanikere", vol: 190, diff: "med" },
  { cat: "SOH & Batteridiagnostik", title: "EV-batteriets levetid: hvad workshop-teknikere bør vide", vol: 170, diff: "med" },
  { cat: "ADAS-kalibrering", title: "Hvad er ADAS og hvorfor kræver det kalibrering?", vol: 440, diff: "low" },
  { cat: "ADAS-kalibrering", title: "Kalibrering af frontkamera efter windscreen udskiftning", vol: 310, diff: "med" },
  { cat: "ADAS-kalibrering", title: "Radarsensor kalibrering — trin for trin", vol: 260, diff: "med" },
  { cat: "ADAS-kalibrering", title: "ADAS ved karosseriarbejde: hvornår skal du kalibrere?", vol: 220, diff: "high" },
  { cat: "ADAS-kalibrering", title: "Dynamisk vs. statisk ADAS-kalibrering", vol: 180, diff: "high" },
  { cat: "Batteritjenester", title: "EV-batteripakke udskiftning: hvad koster det?", vol: 520, diff: "low" },
  { cat: "Batteritjenester", title: "Reparation vs. udskiftning af elbil-batteri", vol: 380, diff: "low" },
  { cat: "Batteritjenester", title: "Cellenivelleringstjenester for elbiler", vol: 240, diff: "med" },
  { cat: "Batteritjenester", title: "Garantipolitik for EV-batterier i Danmark", vol: 200, diff: "med" },
  { cat: "EV-opladning", title: "AC vs. DC opladning — hvad betyder det for værkstedet", vol: 490, diff: "low" },
  { cat: "EV-opladning", title: "Opladerhastigheder og køretøjskompatibilitet", vol: 330, diff: "low" },
  { cat: "EV-opladning", title: "Fejlsøgning af opladningsproblemer på elbiler", vol: 280, diff: "med" },
  { cat: "EV-opladning", title: "CCS vs. CHAdeMO: opladningsstandarder forklaret", vol: 170, diff: "low" },
  { cat: "Fremtidens værksted", title: "Sådan forbereder dit værksted sig på elbiler", vol: 600, diff: "low" },
  { cat: "Fremtidens værksted", title: "EV-certificeringer for mekanikere i Danmark", vol: 420, diff: "low" },
  { cat: "Fremtidens værksted", title: "Nødvendigt udstyr til elbilservice 2024", vol: 360, diff: "med" },
  { cat: "Fremtidens værksted", title: "ROI ved investering i EV-diagnoseudstyr", vol: 250, diff: "med" },
  { cat: "Fremtidens værksted", title: "Fremtidens værksted: EV-service som vækstmulighed", vol: 190, diff: "high" },
];

const CAL_ARTICLES = {
  3: { title: "EV-batteriets levetid", status: "klar" },
  5: { title: "ADAS-kalibrering guide", status: "klar" },
  8: { title: "Hvad er State of Health?", status: "pub" },
  10: { title: "AC vs DC opladning", status: "pub" },
  12: { title: "Fremtidens værksted", status: "pub" },
  15: { title: "Batteripakke udskiftning", status: "kladde" },
  17: { title: "ADAS ved karosseri", status: "kladde" },
  22: { title: "Certifikationer mekanikere", status: "klar" },
  24: { title: "BMS fejlkoder", status: "klar" },
  26: { title: "SOH måling korrekt", status: "klar" },
};

// ─── STYLES ──────────────────────────────────────────────────────────────────
const S = {
  app: { fontFamily: "'Open Sans', sans-serif", fontWeight: 300, background: C.bg, color: C.text, minHeight: "100vh", display: "flex", flexDirection: "column" },
  topbar: { background: C.navy, borderBottom: "1px solid rgba(8,104,178,0.4)", display: "flex", alignItems: "center", position: "sticky", top: 0, zIndex: 100, flexWrap: "wrap" },
  logoArea: { display: "flex", alignItems: "center", gap: 10, padding: "10px 18px", borderRight: "1px solid rgba(53,182,234,0.15)", flexShrink: 0 },
  logoMark: { width: 36, height: 36, background: `linear-gradient(135deg,${C.blue},${C.lblue})`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 18, color: "white" },
  nav: { display: "flex", overflowX: "auto", flex: 1 },
  content: { flex: 1, padding: 20 },
  card: { background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 18, marginBottom: 16 },
  cardTitle: { fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: C.lblue, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 },
  kpi: { background: "rgba(8,104,178,0.12)", border: "1px solid rgba(8,104,178,0.25)", borderRadius: 8, padding: "12px 14px" },
  btn: (variant = "primary") => ({
    padding: "7px 14px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none", fontFamily: "'Open Sans',sans-serif", transition: "all .15s",
    background: variant === "primary" ? C.blue : "transparent",
    color: variant === "primary" ? "white" : C.lblue,
    ...(variant === "outline" ? { border: "1px solid rgba(53,182,234,0.4)" } : {}),
  }),
  input: { background: C.bg3, border: "1px solid rgba(53,182,234,0.2)", borderRadius: 6, color: C.text, fontFamily: "'Open Sans',sans-serif", fontWeight: 300, fontSize: 12, padding: "8px 10px", width: "100%", outline: "none" },
  badge: (type) => {
    const map = { green: ["rgba(53,182,234,0.15)", C.lblue], warn: ["rgba(255,180,50,0.15)", "#f5a623"], red: ["rgba(220,50,50,0.15)", "#e05050"], blue: ["rgba(8,104,178,0.2)", "#5ab4f0"], gray: ["rgba(100,130,160,0.2)", C.textsub] };
    const [bg, color] = map[type] || map.gray;
    return { display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600, background: bg, color };
  },
  divider: { height: 1, background: C.border, margin: "14px 0" },
  settingsRow: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 0", borderBottom: `1px solid ${C.border}` },
  topicRow: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${C.border}` },
};

// ─── SMALL COMPONENTS ────────────────────────────────────────────────────────
function Heading({ children }) {
  return <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em" }}>{children}</div>;
}

function NavTab({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} style={{ padding: "0 12px", height: 52, display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 600, color: active ? C.lblue : C.textsub, cursor: "pointer", border: "none", background: "none", borderBottom: `2px solid ${active ? C.lblue : "transparent"}`, transition: "all .15s", whiteSpace: "nowrap", letterSpacing: "0.03em", fontFamily: "'Open Sans',sans-serif" }}>
      <span style={{ fontSize: 14 }}>{icon}</span> {label}
    </button>
  );
}

function Kpi({ label, value, sub }) {
  return (
    <div style={S.kpi}>
      <div style={{ fontSize: 10, color: C.textsub, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
      <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 20, color: C.text }}>{value}</div>
      {sub && <div style={{ fontSize: 10, color: C.lblue, marginTop: 3 }}>{sub}</div>}
    </div>
  );
}

function Badge({ type, children }) { return <span style={S.badge(type)}>{children}</span>; }

// ─── TABS ─────────────────────────────────────────────────────────────────────
function Overview({ settings }) {
  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 16 }}>
        <Kpi label="Artikler publiceret" value="47" sub="+3 denne uge" />
        <Kpi label="Organiske sessioner" value="2.840" sub="+18% vs. forrige måned" />
        <Kpi label="Søgeord i top 10" value="134" sub="+12 nye denne måned" />
        <Kpi label="LLM-synlighed" value="62%" sub="ChatGPT · Perplexity" />
      </div>
      <div style={S.card}>
        <div style={S.cardTitle}>📈 Vækstfase</div>
        <div style={{ display: "flex", gap: 0, borderRadius: 8, overflow: "hidden" }}>
          {[["01 · FOUNDATION", "Uge 1–8", "Færdig ✓", 100, "rgba(8,104,178,0.15)"], ["02 · VÆKST", "Uge 9–24", "Aktiv — uge 15/24", 58, "rgba(8,104,178,0.25)"], ["03 · SKALERING", "Uge 25+", "Starter snart", 0, "rgba(8,104,178,0.1)"]].map(([label, uge, status, pct, bg]) => (
            <div key={label} style={{ flex: 1, padding: "10px 12px", background: bg, borderRight: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 10, color: C.textsub, marginBottom: 2 }}>{label}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: pct > 0 ? C.lblue : C.muted }}>{uge}</div>
              <div style={{ height: 8, borderRadius: 4, background: C.bg3, overflow: "hidden", margin: "6px 0" }}><div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg,${C.blue},${C.lblue})`, borderRadius: 4 }} /></div>
              <div style={{ fontSize: 10, color: pct > 0 ? C.textsub : C.muted }}>{status}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={S.card}>
          <div style={S.cardTitle}>📅 Kommende artikler</div>
          {[["SOH & Batteri", "EV-batteriets levetid: hvad workshop-teknikere bør vide", "warn", "Mandag"],
            ["ADAS", "Kalibrering af Advanced Driver Assistance Systems", "gray", "Onsdag"],
            ["Opladning", "AC vs. DC opladning — hvad betyder det for værkstedet", "gray", "Fredag"]].map(([cat, title, b, day]) => (
            <div key={title} style={S.topicRow}>
              <div><div style={{ fontSize: 10, color: C.textsub }}>{cat}</div><div style={{ fontSize: 12 }}>{title}</div></div>
              <Badge type={b}>{day}</Badge>
            </div>
          ))}
        </div>
        <div style={S.card}>
          <div style={S.cardTitle}>🔌 Integrationsstatus</div>
          {[["Shopify", "cepelotools.myshopify.com", settings.shopifyToken ? "green" : "warn", settings.shopifyToken ? "Aktiv" : "Token mangler"],
            ["HubSpot", "Email-drafts integration", settings.hubspotToken ? "green" : "warn", settings.hubspotToken ? "Aktiv" : "Token mangler"],
            ["Meta Graph API", "v19.0 · Ad data", settings.metaToken ? "green" : "red", settings.metaToken ? "Aktiv" : "Ikke tilsluttet"],
            ["Google Search Console", "cepelo.dk", "green", "Klar"],
            ["Vercel / GitHub", "CepeloApS/cepelo-seo", "green", "Live"]].map(([name, sub, b, status]) => (
            <div key={name} style={{ ...S.settingsRow, borderBottom: `1px solid ${C.border}` }}>
              <div><div style={{ fontSize: 12 }}>{name}</div><div style={{ fontSize: 10, color: C.textsub }}>{sub}</div></div>
              <Badge type={b}>{status}</Badge>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function ContentPlan() {
  const [selectedDay, setSelectedDay] = useState(null);
  const days = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"];
  return (
    <>
      <div style={S.card}>
        <div style={{ ...S.cardTitle, justifyContent: "space-between" }}>
          <span>📅 Juni 2026</span>
          <div style={{ display: "flex", gap: 6 }}>
            <button style={S.btn("outline")}>← Maj</button>
            <button style={S.btn("outline")}>Juli →</button>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4, marginBottom: 8 }}>
          {days.map(d => <div key={d} style={{ fontSize: 10, color: C.textsub, textAlign: "center", padding: 4, textTransform: "uppercase" }}>{d}</div>)}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4 }}>
          {Array.from({ length: 30 }, (_, i) => i + 1).map(d => {
            const a = CAL_ARTICLES[d];
            const chipColor = { pub: ["rgba(0,180,100,0.2)", "#5ddba0"], klar: ["rgba(53,182,234,0.2)", C.lblue], kladde: ["rgba(245,166,35,0.2)", "#f5c842"] };
            const [chipBg, chipText] = a ? (chipColor[a.status] || chipColor.kladde) : [];
            return (
              <div key={d} onClick={() => setSelectedDay(d)} style={{ background: selectedDay === d ? "rgba(8,104,178,0.25)" : C.bg3, borderRadius: 5, padding: 5, minHeight: 50, fontSize: 10, cursor: "pointer", border: `1px solid ${a ? "rgba(8,104,178,0.4)" : "transparent"}`, transition: "all .15s" }}>
                <div style={{ fontSize: 9, color: C.textsub, marginBottom: 3 }}>{d}</div>
                {a && <span style={{ background: chipBg, color: chipText, borderRadius: 3, padding: "2px 4px", fontSize: 9, display: "block", lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.title}</span>}
              </div>
            );
          })}
        </div>
      </div>
      {selectedDay && (
        <div style={S.card}>
          <div style={S.cardTitle}>📌 {selectedDay}. juni 2026</div>
          {CAL_ARTICLES[selectedDay] ? (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>{CAL_ARTICLES[selectedDay].title}</div>
                <Badge type={CAL_ARTICLES[selectedDay].status === "pub" ? "green" : CAL_ARTICLES[selectedDay].status === "klar" ? "green" : "warn"}>{CAL_ARTICLES[selectedDay].status}</Badge>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button style={S.btn("primary")}>Generer artikel</button>
                <button style={S.btn("outline")}>Se preview</button>
              </div>
            </div>
          ) : (
            <div style={{ fontSize: 12, color: C.textsub }}>Ingen artikel planlagt denne dag.</div>
          )}
        </div>
      )}
    </>
  );
}

function ArticleGenerator({ settings }) {
  const [search, setSearch] = useState("");
  const [generating, setGenerating] = useState(null);
  const [article, setArticle] = useState(null);
  const [publishing, setPublishing] = useState(false);
  const [publishMsg, setPublishMsg] = useState(null);

  const filtered = TOPICS.filter(t => t.title.toLowerCase().includes(search.toLowerCase()) || t.cat.toLowerCase().includes(search.toLowerCase()));
  const cats = [...new Set(filtered.map(t => t.cat))];

  const handleGenerate = useCallback(async (topic) => {
    setGenerating(topic);
    setArticle(null);
    setPublishMsg(null);
    try {
      const result = await generateArticle(topic);
      setArticle(result);
    } catch (e) {
      setArticle({ title: topic, meta: "", html: `<p style="color:#e05050">Fejl: ${e.message}</p>` });
    } finally {
      setGenerating(null);
    }
  }, []);

  const handlePublish = useCallback(async () => {
    if (!settings.shopifyToken) { setPublishMsg({ ok: false, msg: "Mangler Shopify token — gå til Indstillinger" }); return; }
    setPublishing(true);
    try {
      await publishToShopify(settings.shopifyToken, settings.shopifyStore || "cepelotools", article);
      setPublishMsg({ ok: true, msg: "Artikel oprettet som kladde i Shopify! ✓" });
    } catch (e) {
      setPublishMsg({ ok: false, msg: e.message });
    } finally {
      setPublishing(false);
    }
  }, [article, settings]);

  const diffColor = { low: C.lblue, med: "#f5a623", high: "#e05050" };

  return (
    <>
      <div style={S.card}>
        <div style={S.cardTitle}>🤖 AI Artikelgenerator — {TOPICS.length} emner</div>
        <input style={{ ...S.input, marginBottom: 12 }} value={search} onChange={e => setSearch(e.target.value)} placeholder="Søg emner..." />
        {cats.map(cat => (
          <div key={cat}>
            <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: C.blue, padding: "10px 0 4px" }}>{cat}</div>
            {filtered.filter(t => t.cat === cat).map(t => (
              <div key={t.title} style={S.topicRow}>
                <div>
                  <div style={{ fontSize: 12 }}>{t.title}</div>
                  <div style={{ display: "flex", gap: 8, marginTop: 4, alignItems: "center" }}>
                    <span style={S.badge("gray")}>{t.vol} søgn/md</span>
                    <div style={{ width: 28, height: 6, borderRadius: 3, background: diffColor[t.diff] + "99" }} title={t.diff} />
                  </div>
                </div>
                <button onClick={() => handleGenerate(t.title)} disabled={!!generating} style={{ ...S.btn("outline"), padding: "4px 10px", fontSize: 11, flexShrink: 0, opacity: generating ? 0.6 : 1 }}>
                  {generating === t.title ? "Genererer..." : "Generer →"}
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>

      {(generating || article) && (
        <div style={S.card}>
          <div style={S.cardTitle}>📄 Artikel preview</div>
          {generating ? (
            <div style={{ textAlign: "center", padding: 30, color: C.textsub }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>⏳</div>
              <div>Genererer artikel med Claude AI...</div>
            </div>
          ) : (
            <>
              <div style={{ fontSize: 12, lineHeight: 1.8, color: C.text }} dangerouslySetInnerHTML={{ __html: article.html }} />
              {article.meta && <div style={{ marginTop: 12, padding: "8px 12px", background: C.bg3, borderRadius: 6, fontSize: 11, color: C.textsub }}><strong style={{ color: C.text }}>Meta: </strong>{article.meta}</div>}
              <div style={{ display: "flex", gap: 8, marginTop: 14, alignItems: "center", flexWrap: "wrap" }}>
                <button onClick={handlePublish} disabled={publishing} style={{ ...S.btn("primary"), opacity: publishing ? 0.7 : 1 }}>
                  {publishing ? "Sender til Shopify..." : "📤 Send til Shopify"}
                </button>
                <button onClick={() => handleGenerate(article.title)} style={S.btn("outline")}>Regenerer</button>
                {publishMsg && <span style={{ fontSize: 11, color: publishMsg.ok ? "#5ddba0" : "#e05050" }}>{publishMsg.msg}</span>}
              </div>
              {!settings.shopifyToken && <div style={{ marginTop: 8, fontSize: 11, color: "#f5a623" }}>⚠️ Ingen Shopify token — gå til Indstillinger for at tilslutte</div>}
            </>
          )}
        </div>
      )}
    </>
  );
}

function Analytics() {
  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 16 }}>
        <Kpi label="Klik (30 dage)" value="1.247" sub="+22% vs. forrige" />
        <Kpi label="Impressioner" value="18.430" sub="+34% vækst" />
        <Kpi label="CTR" value="6,8%" sub="Branchegennemsnit: 4,2%" />
        <Kpi label="Gns. position" value="14,3" sub="↓ fra 18,7" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        {[["Google Search Console", "Tilslut GSC"], ["Google Analytics 4", "Tilslut GA4"]].map(([label, btn]) => (
          <div key={label} style={S.card}>
            <div style={S.cardTitle}>📊 {label}</div>
            <div style={{ background: "rgba(53,182,234,0.06)", border: `1px solid ${C.border}`, borderRadius: 6, padding: 14, textAlign: "center" }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>🔌</div>
              <div style={{ fontSize: 12, marginBottom: 8 }}>Tilslut for live data</div>
              <button style={S.btn("primary")}>{btn}</button>
            </div>
          </div>
        ))}
      </div>
      <div style={S.card}>
        <div style={S.cardTitle}>🔑 Top søgeord (demo)</div>
        {[["elbil batteri levetid", 3, 1840, 142], ["ADAS kalibrering Danmark", 5, 1230, 98], ["SOH elbil", 7, 980, 64], ["EV værksted fremtiden", 4, 870, 87], ["batteridiagnostik elbil", 9, 760, 41]].map(([kw, pos, imp, klik]) => (
          <div key={kw} style={S.topicRow}>
            <div>
              <div style={{ fontSize: 12 }}>{kw}</div>
              <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                <Badge type="blue">Pos. {pos}</Badge>
                <Badge type="gray">{imp} imp.</Badge>
                <Badge type="green">{klik} klik</Badge>
              </div>
            </div>
            <div style={{ width: 80, height: 6, borderRadius: 3, background: C.bg3, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${Math.round(klik / imp * 1000)}%`, background: `linear-gradient(90deg,${C.blue},${C.lblue})`, borderRadius: 3 }} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function Backlinks() {
  const data = [
    ["motormagasinet.dk", 52, 8, "3.200 kr."], ["elbilsiden.dk", 61, 14, "5.800 kr."],
    ["autofronten.dk", 44, 5, "2.100 kr."], ["teknikeren.dk", 38, 3, "1.400 kr."],
    ["evcenter.dk", 55, 11, "4.600 kr."], ["vaerkstedsnyt.dk", 47, 7, "2.900 kr."],
  ];
  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 16 }}>
        <Kpi label="Totale backlinks" value="284" sub="+12 denne måned" />
        <Kpi label="Referring domains" value="47" sub="DK-autoritet: stærk" />
        <Kpi label="Estimeret DKK-værdi" value="38.400" sub="kr. pr. måned" />
      </div>
      <div style={S.card}>
        <div style={S.cardTitle}>🔗 Backlink tracker</div>
        {data.map(([domain, da, links, val]) => (
          <div key={domain} style={{ ...S.topicRow, alignItems: "center" }}>
            <div><div style={{ fontSize: 12, fontWeight: 600 }}>{domain}</div><div style={{ fontSize: 10, color: C.textsub }}>DA: {da} · {links} links</div></div>
            <div style={{ textAlign: "right" }}><div style={{ fontSize: 12, fontWeight: 600, color: C.lblue }}>{val}</div><div style={{ fontSize: 10, color: C.textsub }}>estimeret</div></div>
          </div>
        ))}
      </div>
    </>
  );
}

function Audit() {
  const gauges = [["Teknisk SEO", 82, C.lblue], ["Content Score", 69, C.blue], ["Core Web Vitals", 77, C.lblue], ["Backlinks", 47, "#f5a623"]];
  const r = 28; const circ = 2 * Math.PI * r;
  return (
    <>
      <div style={S.card}>
        <div style={S.cardTitle}>🎯 SEO Health Score</div>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          {gauges.map(([label, val, color]) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ position: "relative", width: 70, height: 70 }}>
                <svg viewBox="0 0 70 70" style={{ width: 70, height: 70 }}>
                  <circle cx="35" cy="35" r={r} fill="none" stroke="rgba(53,182,234,0.1)" strokeWidth="8" />
                  <circle cx="35" cy="35" r={r} fill="none" stroke={color} strokeWidth="8" strokeDasharray={`${circ * val / 100} ${circ}`} strokeDashoffset={circ * 0.2} strokeLinecap="round" transform="rotate(-90 35 35)" />
                </svg>
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 16 }}>{val}</div>
              </div>
              <div><div style={{ fontSize: 12, fontWeight: 600 }}>{label}</div><div style={{ fontSize: 10, color: C.textsub }}>{val >= 75 ? "God" : val >= 60 ? "Kan forbedres" : "Svag"}</div></div>
            </div>
          ))}
        </div>
      </div>
      <div style={S.card}>
        <div style={S.cardTitle}>⚠️ Problemer</div>
        {[["Manglende meta-beskrivelser (14 sider)", "red"], ["Billeder uden alt-tekst (23 billeder)", "warn"], ["Duplikat H1-tags (3 sider)", "warn"], ["LCP over 2,5s (mobil)", "warn"], ["Schema markup mangler på produktsider", "blue"]].map(([issue, b]) => (
          <div key={issue} style={{ ...S.topicRow, alignItems: "center" }}>
            <span style={{ fontSize: 11 }}>{issue}</span><Badge type={b}>{b === "red" ? "Kritisk" : b === "warn" ? "Advarsel" : "Info"}</Badge>
          </div>
        ))}
      </div>
    </>
  );
}

function Reddit() {
  const posts = [
    ["Kan min mekaniker kalibrere ADAS efter stenslag i forruden?", "r/Denmark", 47, 23, "green"],
    ["Hvad koster det at udskifte batteri i Tesla Model 3 i DK?", "r/elbil", 89, 41, "green"],
    ["SOH nede på 71% — hvornår er det et problem?", "r/Denmark", 34, 18, "warn"],
    ["Bedste EV-værksted i Aarhus?", "r/Denmark", 62, 37, "warn"],
    ["CHAdeMO vs CCS — hvad bruger I?", "r/elbil", 28, 15, "gray"],
  ];
  return (
    <div style={S.card}>
      <div style={S.cardTitle}>👾 Reddit AI Agent — Dansk EV & ADAS</div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <select style={{ ...S.input, flex: 1 }}><option>r/Denmark</option><option>r/elbil</option><option>r/evs</option></select>
        <button style={S.btn("primary")}>Scan nu</button>
      </div>
      {posts.map(([title, sub, ups, cmts, opp]) => (
        <div key={title} style={{ padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 12, marginBottom: 4 }}>{title}</div>
          <div style={{ display: "flex", gap: 10, fontSize: 10, color: C.textsub, alignItems: "center" }}>
            <span>{sub}</span><span>↑ {ups}</span><span>{cmts} kommentarer</span>
            <Badge type={opp}>{opp === "green" ? "Høj SEO" : opp === "warn" ? "Medium" : "Lav"}</Badge>
          </div>
        </div>
      ))}
    </div>
  );
}

function HubSpot({ settings }) {
  const [subject, setSubject] = useState("EV-batteridiagnostik til moderne værksteder");
  const [audience, setAudience] = useState("Værkstedsejere, DK");
  const [generating, setGenerating] = useState(false);
  const [draft, setDraft] = useState(null);
  const [sendMsg, setSendMsg] = useState(null);

  const handleGenerate = async () => {
    setGenerating(true);
    setSendMsg(null);
    try {
      const res = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
<<<<<<< HEAD
          model: "claude-sonnet-4-5",
          max_tokens: 1000,
=======
          model: "claude-sonnet-4-6",
          max_tokens: 2000,
>>>>>>> 34db8fa (Fix article generator: increase max_tokens from 1000 to 4000)
          system: "Du er en dansk email-skribent for CEPELO. Returner KUN JSON: {\"subject\":\"...\",\"preview\":\"...\",\"html\":\"...\"}",
          messages: [{ role: "user", content: `Skriv en professionel nyhedsmail til ${audience} om: ${subject}. CEPELO brand, dansk, professionel og teknisk kompetent.` }],
        }),
      });
      const d = await res.json();
      const text = d.content?.[0]?.text || "{}";
      setDraft(JSON.parse(text.replace(/```json|```/g, "").trim()));
    } catch (e) {
      setDraft({ subject, preview: "Fejl ved generering", html: `<p>${e.message}</p>` });
    } finally {
      setGenerating(false);
    }
  };

  const handleSendToHubSpot = async () => {
    if (!settings.hubspotToken) { setSendMsg({ ok: false, msg: "Mangler HubSpot token — gå til Indstillinger" }); return; }
    setSendMsg({ ok: true, msg: "Sender til HubSpot..." });
    try {
      const res = await fetch("https://api.hubapi.com/marketing-emails/v1/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${settings.hubspotToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({ name: draft.subject, subject: draft.subject, type: "BATCH_EMAIL", content: { html: draft.html } }),
      });
      if (!res.ok) throw new Error(`HubSpot fejl: ${res.status}`);
      setSendMsg({ ok: true, msg: "✓ Email oprettet som draft i HubSpot!" });
    } catch (e) {
      setSendMsg({ ok: false, msg: e.message });
    }
  };

  return (
    <div style={S.card}>
      <div style={S.cardTitle}>✉️ HubSpot Nyhedsmail</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
        <div><div style={{ fontSize: 10, color: C.textsub, marginBottom: 4 }}>Emne</div><input style={S.input} value={subject} onChange={e => setSubject(e.target.value)} /></div>
        <div><div style={{ fontSize: 10, color: C.textsub, marginBottom: 4 }}>Målgruppe</div><input style={S.input} value={audience} onChange={e => setAudience(e.target.value)} /></div>
      </div>
      <button onClick={handleGenerate} disabled={generating} style={S.btn("primary")}>{generating ? "Genererer..." : "Generer nyhedsmail →"}</button>
      {draft && (
        <>
          <div style={S.divider} />
          <div style={{ fontSize: 11, color: C.textsub, marginBottom: 8 }}>Preview</div>
          <div style={{ background: C.bg3, borderRadius: 8, overflow: "hidden" }}>
            <div style={{ background: C.blue, color: "white", padding: "10px 14px", fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.06em" }}>CEPELO NYHEDSBREV</div>
            <div style={{ padding: 12, fontSize: 12, lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: draft.html }} />
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 10, alignItems: "center" }}>
            <button onClick={handleSendToHubSpot} style={S.btn("primary")}>📤 Send til HubSpot</button>
            <button onClick={() => navigator.clipboard?.writeText(draft.html)} style={S.btn("outline")}>Kopiér HTML</button>
            {sendMsg && <span style={{ fontSize: 11, color: sendMsg.ok ? "#5ddba0" : "#e05050" }}>{sendMsg.msg}</span>}
          </div>
          {!settings.hubspotToken && <div style={{ marginTop: 8, fontSize: 11, color: "#f5a623" }}>⚠️ Ingen HubSpot token — gå til Indstillinger</div>}
        </>
      )}
    </div>
  );
}

function MetaAds({ settings }) {
  const [connected, setConnected] = useState(false);
  const campaigns = [
    ["EV Værksted DK", "Aktiv", "4.820 kr.", 142], ["SOH Diagnostik", "Aktiv", "3.140 kr.", 87],
    ["ADAS Kalibrering", "Pause", "2.680 kr.", 63], ["Batteri Retargeting", "Aktiv", "1.840 kr.", 55],
  ];
  const audiences = [["Værkstedsejere 35-54", 38], ["Mekanikere 25-44", 27], ["Autobranchen DK", 19], ["EV-entusiaster", 16]];

  if (!connected) return (
    <div style={S.card}>
      <div style={S.cardTitle}>📣 Meta Graph API — Opsætning</div>
      <div style={{ fontSize: 12, color: C.textsub, marginBottom: 12 }}>Indsæt dit Meta Access Token for at aktivere live kampagnedata</div>
      <input type="password" style={{ ...S.input, marginBottom: 10 }} placeholder="EAAxxxxxxxxxxxxxxxx (Meta Access Token)" />
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button onClick={() => setConnected(true)} style={S.btn("primary")}>Tilslut Meta →</button>
        <button onClick={() => setConnected(true)} style={S.btn("outline")}>Demo data</button>
      </div>
      <div style={S.divider} />
      <div style={{ fontSize: 11, color: C.textsub, lineHeight: 1.8 }}>
        <strong style={{ color: C.text }}>Sådan opretter du token:</strong><br />
        1. Gå til business.facebook.com → Systembrugere<br />
        2. Giv adgang til Ad Account med rollen Analyst<br />
        3. Generer token med scopes: ads_read, ads_management, business_management
      </div>
    </div>
  );

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 16 }}>
        <Kpi label="Forbrug (30 dage)" value="12.480" sub="kr." />
        <Kpi label="Leads" value="347" sub="CPL: 35,96 kr." />
        <Kpi label="Rækkevidde" value="84.200" sub="unikke brugere" />
        <Kpi label="ROAS" value="3,4×" sub="over benchmark" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={S.card}>
          <div style={S.cardTitle}>👥 Målgruppe fordeling</div>
          {audiences.map(([label, pct]) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, fontSize: 11 }}>
              <span style={{ minWidth: 140, color: C.textsub }}>{label}</span>
              <div style={{ flex: 1, height: 6, borderRadius: 3, background: C.bg3, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pct * 2.5}%`, background: `linear-gradient(90deg,${C.blue},${C.lblue})`, borderRadius: 3 }} />
              </div>
              <span style={{ minWidth: 28, textAlign: "right" }}>{pct}%</span>
            </div>
          ))}
        </div>
        <div style={S.card}>
          <div style={S.cardTitle}>📢 Kampagner</div>
          {campaigns.map(([name, status, spend, leads]) => (
            <div key={name} style={S.topicRow}>
              <div><div style={{ fontSize: 12 }}>{name}</div><div style={{ fontSize: 10, color: C.textsub, marginTop: 2 }}>{spend} · {leads} leads</div></div>
              <Badge type={status === "Aktiv" ? "green" : "warn"}>{status}</Badge>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function Settings({ settings, setSettings }) {
  const [local, setLocal] = useState(settings);
  const [saved, setSaved] = useState(false);

  const save = () => {
    setSettings(local);
    localStorage.setItem("cepelo_settings", JSON.stringify(local));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <>
      <div style={S.card}>
        <div style={S.cardTitle}>🔌 API-integrationer</div>
        {[
          ["Shopify Access Token", "shopifyToken", "shpat_xxxxxxxx eller atkn_xxxxxxxx", settings.shopifyToken],
          ["Shopify Store navn", "shopifyStore", "cepelotools (uden .myshopify.com)", settings.shopifyStore],
          ["HubSpot Private App Token", "hubspotToken", "pat-eu1-xxxxxxxx", settings.hubspotToken],
          ["Meta Access Token", "metaToken", "EAAxxxxxxxxxxxxxxxx", settings.metaToken],
        ].map(([label, key, placeholder, current]) => (
          <div key={key}>
            <div style={{ ...S.settingsRow }}>
              <div>
                <div style={{ fontSize: 12 }}>{label}</div>
                <div style={{ fontSize: 10, color: C.textsub }}>{current ? "✓ Sat op" : "Mangler"}</div>
              </div>
              <Badge type={current ? "green" : "warn"}>{current ? "Aktiv" : "Mangler"}</Badge>
            </div>
            <div style={{ padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
              <input type="password" style={S.input} placeholder={placeholder} value={local[key] || ""} onChange={e => setLocal({ ...local, [key]: e.target.value })} />
            </div>
          </div>
        ))}
        <div style={{ marginTop: 14, display: "flex", gap: 8, alignItems: "center" }}>
          <button onClick={save} style={S.btn("primary")}>💾 Gem indstillinger</button>
          {saved && <span style={{ fontSize: 11, color: "#5ddba0" }}>✓ Gemt!</span>}
        </div>
      </div>
      <div style={S.card}>
        <div style={S.cardTitle}>🚀 Deployment</div>
        {[["GitHub repo", "CepeloApS/cepelo-seo", "green", "Aktiv"], ["Vercel deployment", "Auto-deploy ved push til main", "green", "Live"], ["Claude API model", "claude-sonnet-4-20250514", "blue", "Aktiv"]].map(([label, sub, b, status]) => (
          <div key={label} style={S.settingsRow}>
            <div><div style={{ fontSize: 12 }}>{label}</div><div style={{ fontSize: 10, color: C.textsub }}>{sub}</div></div>
            <Badge type={b}>{status}</Badge>
          </div>
        ))}
      </div>
    </>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
const TABS = [
  { id: "overview", icon: "📊", label: "Overblik" },
  { id: "plan", icon: "📅", label: "Content Plan" },
  { id: "generator", icon: "🤖", label: "Artikler" },
  { id: "analytics", icon: "📈", label: "Analytics" },
  { id: "backlinks", icon: "🔗", label: "Backlinks" },
  { id: "audit", icon: "🛡️", label: "Audit" },
  { id: "reddit", icon: "👾", label: "Reddit" },
  { id: "hubspot", icon: "✉️", label: "HubSpot" },
  { id: "meta", icon: "📣", label: "Meta Ads" },
  { id: "settings", icon: "⚙️", label: "Indstillinger" },
];

export default function App() {
  const [tab, setTab] = useState("overview");
  const [settings, setSettings] = useState(() => {
    try { return JSON.parse(localStorage.getItem("cepelo_settings") || "{}"); } catch { return {}; }
  });

  useEffect(() => {
    document.title = "Cepelo SEO Engine";
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Montserrat:wght@800&family=Open+Sans:wght@300;400;600&display=swap";
    document.head.appendChild(link);
  }, []);

  return (
    <div style={S.app}>
      <div style={S.topbar}>
        <div style={S.logoArea}>
          <div style={S.logoMark}>C</div>
          <div>
            <Heading><span style={{ fontSize: 12, color: "white", letterSpacing: "0.1em" }}>Cepelo</span></Heading>
            <div style={{ fontSize: 9, color: C.lblue, fontWeight: 300, marginTop: 1 }}>SEO Engine</div>
          </div>
        </div>
        <div style={S.nav}>
          {TABS.map(t => <NavTab key={t.id} icon={t.icon} label={t.label} active={tab === t.id} onClick={() => setTab(t.id)} />)}
        </div>
      </div>
      <div style={S.content}>
        {tab === "overview" && <Overview settings={settings} />}
        {tab === "plan" && <ContentPlan />}
        {tab === "generator" && <ArticleGenerator settings={settings} />}
        {tab === "analytics" && <Analytics />}
        {tab === "backlinks" && <Backlinks />}
        {tab === "audit" && <Audit />}
        {tab === "reddit" && <Reddit />}
        {tab === "hubspot" && <HubSpot settings={settings} />}
        {tab === "meta" && <MetaAds settings={settings} />}
        {tab === "settings" && <Settings settings={settings} setSettings={setSettings} />}
      </div>
    </div>
  );
}
