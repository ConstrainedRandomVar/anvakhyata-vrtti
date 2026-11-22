#!/usr/bin/env node
// Second, focused Gemini reading of the अर्थः of every entry whose first reading disagrees with the Vision OCR.
// Two Gemini readings agreeing → accepted; otherwise both kept and the entry is listed for review.
// Usage: node reread.js [--budget 1] [--conc 6]   (reads ../prathama.json + ../prathama-issues.json; writes ../prathama-reread.json)
'use strict';
const fs = require('fs'), path = require('path');
const G = require(path.join(__dirname, '../../../searchtool/khan/vc-karaka/gemini.js'));
const ROOT = process.env.PV_ROOT || path.join(process.env.HOME, 'Projects/sanskrit-texts/prathamavritti');
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const BUDGET = +arg('--budget', 1), CONC = +arg('--conc', 6);
const PV = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'prathama.json'), 'utf8'));
const OUTF = path.join(__dirname, '..', 'prathama-reread.json');
const OUT = fs.existsSync(OUTF) ? JSON.parse(fs.readFileSync(OUTF, 'utf8')) : {};
const norm = t => (t || '').replace(/[\s।॥|,.;:—\-–=()\[\]'"‘’`*ऽ]/g, '');
const THIRD = process.argv.includes('--third');   // tie-break: a third reading where the first two differ and only closeness to the OCR decided
const todo = THIRD ? Object.values(PV).filter(e => OUT[e.num] && !OUT[e.num].agree && /^closer/.test(e.arthaWhy || '') && !OUT[e.num].third)
  : Object.values(PV).filter(e => e.artha && e.check && e.check.artha != null && e.check.artha < 0.95 && !OUT[e.num]);
const prompt = e => `This is a scanned page of "अष्टाध्यायी प्रथमावृत्तिः". Find the entry for the sūtra "${e.sutra}" (${e.num.replace(/\./g, '।')} in this edition's numbering may differ) and transcribe ONLY its अर्थः (the short Sanskrit gloss after "अर्थः—", up to its closing ॥).
Copy it EXACTLY as printed: keep every sandhi as printed (e.g. if the print has "कमुधातोर्णिङ्" write exactly that — never split it into "कमुधातोः णिङ्"); a word broken across a line with a hyphen is ONE word (join it, drop the hyphen); the old typeface's अ is अ (not श्र). Ignore handwriting and bleed-through.
Return JSON: {"artha": "<the text>"}
${G.JSON_PROMPT_RULES || ''}`;
(async () => {
  let spent = 0, i = 0, agree = 0, differ = 0;
  const worker = async () => {
    while (i < todo.length && spent < BUDGET) {
      const e = todo[i++]; const [a, f] = e.pages[0].split('/');
      const img = fs.readFileSync(path.join(ROOT, a, 'pages', f.replace('.json', '.jpg'))).toString('base64');
      const r = await G.callAsync(prompt(e), { images: [{ mimeType: 'image/jpeg', data: img }], maxOutputTokens: 2048, thinkingLevel: 'low' });
      spent += r.cost || 0;
      let t = null; try { t = G.parseJSON(r.text).artha; } catch (er) { }
      if (!t) continue;
      if (THIRD) { OUT[e.num].third = t; agree++; continue; }
      const same = norm(t) === norm(e.artha);
      OUT[e.num] = { first: e.artha, second: t, agree: same, vision: e.check.artha };
      same ? agree++ : differ++;
    }
  };
  await Promise.all(Array.from({ length: CONC }, worker));
  fs.writeFileSync(OUTF, JSON.stringify(OUT, null, 1));
  console.log(`re-read ${agree + differ} of ${todo.length}: the two Gemini readings agree ${agree}, differ ${differ} · $${spent.toFixed(3)}`);
})();
