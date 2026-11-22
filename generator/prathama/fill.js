#!/usr/bin/env node
// For each sūtra still missing after merge.js, ask Gemini to find its entry on the pages between its neighbours.
// Usage: node fill.js [--budget 0.3]   → ../prathama-fill.json  (merge.js uses it for numbers it could not fill itself)
'use strict';
const fs = require('fs'), path = require('path');
const G = require(path.join(__dirname, '../../../searchtool/khan/vc-karaka/gemini.js'));
const ROOT = process.env.PV_ROOT || path.join(process.env.HOME, 'Projects/sanskrit-texts/prathamavritti');
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const BUDGET = +arg('--budget', 0.3);
const PV = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'prathama.json'), 'utf8'));
const OUTF = path.join(__dirname, '..', 'prathama-fill.json');
const OUT = fs.existsSync(OUTF) ? JSON.parse(fs.readFileSync(OUTF, 'utf8')) : {};
const S = JSON.parse(fs.readFileSync(path.join(process.env.HOME, 'Projects/ashtadhyayi-data/sutraani/data.txt'), 'utf8')).data.map(x => ({ n: `${+x.a}.${+x.p}.${+x.n}`, s: x.s }));
const pageList = A => fs.readdirSync(path.join(ROOT, `a${A}`, 'pages')).filter(f => f.endsWith('.jpg')).sort();
const todo = [];
S.forEach((x, i) => {
  if (PV[x.n] || OUT[x.n]) return;
  const A = x.n.split('.')[0];
  let p = i - 1; while (p >= 0 && !PV[S[p].n]) p--;
  let q = i + 1; while (q < S.length && !PV[S[q].n]) q++;
  const pages = pageList(A);
  const pg = r => r && r.pages[0].startsWith(`a${A}/`) ? pages.indexOf(r.pages[r.pages.length - 1].split('/')[1].replace('.json', '.jpg')) : -1;
  let a = p >= 0 ? pg(PV[S[p].n]) : -1, b = q < S.length ? pg(PV[S[q].n]) : -1;
  if (a < 0) a = b; if (b < 0) b = a; if (a < 0) return;
  if (b < a) [a, b] = [b, a];
  const cand = pages.slice(a, Math.min(b, a + 2) + 1);   // at most 3 pages
  todo.push({ num: x.n, sutra: x.s, A, cand });
});
const prompt = t => `These are consecutive scanned pages of "अष्टाध्यायी प्रथमावृत्तिः". Find the entry for the sūtra "${t.sutra}" (our number ${t.num}; this edition's printed number may differ by a few, and its spelling of the sūtra may differ slightly).
If its header (sūtra text + number) is printed on these pages, return JSON {"found": true, "page": <1-based index of the image with the header>, "num": "<printed number as a.p.n>", "sutra": "...", "padaccheda": "...", "samasa": "...", "type": "...", "artha": "<the Sanskrit अर्थः line only>", "anuvritti": "<only the Hindi sentence(s) about अनुवृत्ति, else empty>"}.
If it is not on these pages, return {"found": false}. If this edition prints it together with the neighbouring sūtra as one entry, return that entry and add "combined": true.
Copy the PRINTED text exactly — same spelling, sandhi and punctuation; the old typeface's अ is अ (not श्र). Ignore handwriting and bleed-through.
${G.JSON_PROMPT_RULES || ''}`;
(async () => {
  let spent = 0, found = 0;
  await Promise.all(Array.from({ length: 5 }, async () => {
    while (todo.length && spent < BUDGET) {
      const t = todo.shift();
      const images = t.cand.map(f => ({ mimeType: 'image/jpeg', data: fs.readFileSync(path.join(ROOT, `a${t.A}`, 'pages', f)).toString('base64') }));
      const r = await G.callAsync(prompt(t), { images, maxOutputTokens: 4096, thinkingLevel: 'low' });
      spent += r.cost || 0;
      let j = null; try { j = G.parseJSON(r.text); } catch (e) { }
      if (!j) continue;
      if (j.found) { found++; j.pageFile = `a${t.A}/${(t.cand[(j.page || 1) - 1] || t.cand[0]).replace('.jpg', '.json')}`; }
      OUT[t.num] = Object.assign({ asked: t.cand }, j);
      console.log(t.num, j.found ? `found ${j.pageFile} | ${j.sutra} | ${(j.artha || '').slice(0, 60)}` : 'not on the pages', t.cand.join(','));
    }
  }));
  fs.writeFileSync(OUTF, JSON.stringify(OUT, null, 1));
  console.log(`found ${found} · $${spent.toFixed(3)}`);
})();
