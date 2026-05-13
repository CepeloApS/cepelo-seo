# Cepelo SEO Manager

AI-drevet SEO content platform til cepelo.dk — bygget med Claude AI.

---

## 🚀 Deploy til Vercel (trin-for-trin)

### Trin 1 — Upload til GitHub

1. Gå til **github.com** og opret en gratis konto (hvis du ikke har en)
2. Klik på **"New repository"** (grøn knap øverst til højre)
3. Navngiv den `cepelo-seo` → klik **"Create repository"**
4. Klik på **"uploading an existing file"**
5. Træk og slip **hele denne mappe** ind på siden
6. Klik **"Commit changes"**

### Trin 2 — Deploy med Vercel

1. Gå til **vercel.com** og opret en gratis konto
2. Klik **"Add New Project"**
3. Vælg **"Import Git Repository"** → vælg `cepelo-seo`
4. Vercel opdager automatisk at det er React → klik bare **"Deploy"**
5. Efter 1-2 minutter får du en live URL fx `cepelo-seo.vercel.app`

### Trin 3 — Eget domæne (valgfrit)

I Vercel dashboard → **Domains** → tilføj fx `seo.cepelo.dk`

---

## ⚙️ Miljøvariabler (ikke nødvendigt — API-nøgle håndteres af Claude.ai)

Appen bruger Claude API via claude.ai's artifact-system.
Shopify API-token indtastes direkte i appen under Indstillinger.

---

## 📁 Projektstruktur

```
cepelo-seo/
├── public/
│   └── index.html
├── src/
│   ├── App.jsx        ← Hele appen
│   └── index.js       ← Entry point
├── package.json
└── README.md
```
