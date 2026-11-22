#!/usr/bin/env node
// Word-level tie-break for the समासः and अर्थः of the prathamāvṛtti: where our Gemini transcription and the Vision OCR of the
// same page disagree by one letter, Gemini looks at the page image again with BOTH readings and gives the field as printed.
// A change is kept only if every changed word is one of the two readings (or the image's own reading of a disputed word).
// Usage: node arbitrate.js [--only 1.1.1,1.1.2] [--limit 20] [--budget 0.2] [--conc 5]   → ../prathama-arb.json (build.js applies it)
'use strict';
const fs = require('fs'), path = require('path');
const G = require(path.join(__dirname, '../../../searchtool/khan/vc-karaka/gemini.js'));
const ROOT = process.env.PV_ROOT || path.join(process.env.HOME, 'Projects/sanskrit-texts/prathamavritti');
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const BUDGET = +arg('--budget', 0.2), CONC = +arg('--conc', 5), LIMIT = +arg('--limit', 1e9), ONLY = (arg('--only', '') || '').split(',').filter(Boolean);
const PV = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'prathama.json'), 'utf8'));
const OUTF = path.join(__dirname, '..', 'prathama-arb.json');
const OUT = fs.existsSync(OUTF) ? JSON.parse(fs.readFileSync(OUTF, 'utf8')) : {};
const SPL = /[\s,।॥=|:;\-–—()‹›'"‘’]+/;
// the old typeface's अ is read by Vision as श्र (श्रात् = आत्)
const vNorm = t => t.replace(/श्रा/g, 'आ').replace(/श्रो/g, 'ओ').replace(/श्रौ/g, 'औ').replace(/श्र/g, 'अ');
const vCache = {};
const vision = pg => { if (vCache[pg]) return vCache[pg]; let t = ''; try { const j = JSON.parse(fs.readFileSync(path.join(ROOT, pg.replace('/', '/ocr/')), 'utf8')); t = j.responses ? j.responses[0].fullTextAnnotation.text : (j.text || JSON.stringify(j)); } catch (e) { }
  return (vCache[pg] = new Set(vNorm(t.replace(/\\n/g, ' ')).split(SPL).filter(x => x.length > 1))); };
const ed = (a, b) => { if (Math.abs(a.length - b.length) > 2) return 9; const d = [...Array(b.length + 1).keys()]; for (let i = 1; i <= a.length; i++) { let p = d[0]; d[0] = i; for (let j = 1; j <= b.length; j++) { const t = d[j]; d[j] = Math.min(d[j] + 1, d[j - 1] + 1, p + (a[i - 1] === b[j - 1] ? 0 : 1)); p = t; } } return d[b.length]; };
const FIELDS = { samasa: 'समासः', arthaCore: 'अर्थः' };   // Harsha 2026-11-15: samāsa + artha only
const disputes = (e, f) => { const vs = new Set(); e.pages.forEach(p => vision(p).forEach(x => vs.add(x))); const out = [];
  for (const tok of (e[f] || '').split(SPL).filter(x => x.length > 2)) { if (vs.has(tok)) continue; for (const v of vs) if (v.length > 2 && ed(tok, v) === 1) { out.push([tok, v]); break; } }
  return out; };
const todo = [];
for (const e of Object.values(PV)) {
  if (e.manual || (ONLY.length && !ONLY.includes(e.num))) continue;
  for (const f of Object.keys(FIELDS)) { if (OUT[e.num] && OUT[e.num][f]) continue; const d = disputes(e, f); if (d.length) todo.push({ e, f, d }); }
}
// BLIND reading (the pilot showed that offering both candidates makes the pick unstable): the disputed words are masked
const ESC = x => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const B = `[\\s,।॥=|:;\\-–—()‹›'"‘’]`;
const mask = t => { let line = t.e[t.f]; t.d.forEach(([g], i) => { line = line.replace(new RegExp(`(^|${B})${ESC(g)}(?=$|${B})`), (m, p1) => p1 + `⟨${i + 1}⟩`); }); return line; };
const prompt = t => `This is a scanned page of "अष्टाध्यायी प्रथमावृत्तिः". Find the entry for the sūtra "${t.e.sutra}" (this edition may number it ${t.e.raw || t.e.num}) and its ${FIELDS[t.f]} line${t.f === 'samasa' ? ' (after the first sūtra the book prints the label as "स०")' : ''}.
Here is that line with some words masked as ⟨1⟩, ⟨2⟩ …:
${mask(t)}
Read the print and give the word printed at each masked place, EXACTLY as printed (same sandhi, spelling and any misprint — never correct the book). The old typeface's अ is अ (not श्र). Ignore handwriting and bleed-through.
Return JSON: {"words": ["<printed word at ⟨1⟩>", "<at ⟨2⟩>", …]}
${G.JSON_PROMPT_RULES || ''}`;
(async () => {
  let spent = 0, i = 0, done = 0, changed = 0, rejected = 0;
  const work = todo.slice(0, LIMIT);
  await Promise.all(Array.from({ length: CONC }, async () => {
    while (i < work.length && spent < BUDGET) {
      const t = work[i++];
      const images = [...new Set(t.e.pages)].slice(0, 2).map(p => { const [a, f] = p.split('/'); return { mimeType: 'image/jpeg', data: fs.readFileSync(path.join(ROOT, a, 'pages', f.replace('.json', '.jpg'))).toString('base64') }; });
      const r = await G.callAsync(prompt(t), { images, maxOutputTokens: 4096, thinkingLevel: 'low' });
      spent += r.cost || 0;
      let j = null; try { j = G.parseJSON(r.text); } catch (er) { }
      if (!j || !Array.isArray(j.words)) continue;
      // apply only the per-word choices, and only a choice that is one of the two readings; the rest of the line stays as transcribed
      const before = t.e[t.f]; let after = before; const applied = [], skipped = [];
      const ch = Array.isArray(j.words) ? j.words : [];
      t.d.forEach(([g, v], x) => { const c = String(ch[x] || '').trim();
        if (c === g) return; if (c !== v) { skipped.push(`${g}/${v} → ${c || '—'}`); return; }
        const re = new RegExp(`(^|${B})${ESC(g)}(?=$|${B})`, 'g');
        const n0 = after; after = after.replace(re, (m, p1) => p1 + v); if (after !== n0) applied.push(`${g} → ${v}`); });
      const bad = skipped;
      (OUT[t.e.num] = OUT[t.e.num] || {})[t.f] = { before, after, disputes: t.d, choices: ch, applied, skipped, ok: after !== before };
      done++; if (after !== before) changed++; if (bad.length) rejected++;
    }
  }));
  fs.writeFileSync(OUTF, JSON.stringify(OUT, null, 1));
  console.log(`fields ${done} of ${work.length} (of ${todo.length} in all) · changed ${changed} · rejected ${rejected} · $${spent.toFixed(3)}`);
})();
