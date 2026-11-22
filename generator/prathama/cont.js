#!/usr/bin/env node
// The अर्थः of an entry that runs over a page break was cut at the break. Read it again from BOTH pages.
// Usage: node cont.js [--budget 0.8] [--conc 6]   (reads ../prathama.json; writes ../prathama-cont.json; merge.js applies it)
'use strict';
const fs = require('fs'), path = require('path');
const G = require(path.join(__dirname, '../../../searchtool/khan/vc-karaka/gemini.js'));
const ROOT = process.env.PV_ROOT || path.join(process.env.HOME, 'Projects/sanskrit-texts/prathamavritti');
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const BUDGET = +arg('--budget', 0.8), CONC = +arg('--conc', 6);
const PV = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'prathama.json'), 'utf8'));
const OUTF = path.join(__dirname, '..', 'prathama-cont.json');
const OUT = fs.existsSync(OUTF) ? JSON.parse(fs.readFileSync(OUTF, 'utf8')) : {};
const todo = Object.values(PV).filter(e => !e.manual && !OUT[e.num] && !/[॥।|]\s*$/.test((e.arthaCore || '').trim()) && e.pages[0].includes('/'));
const pageImgs = e => {
  const [a, f] = e.pages[e.pages.length - 1].split('/');
  const list = fs.readdirSync(path.join(ROOT, a, 'pages')).filter(x => x.endsWith('.jpg')).sort();
  const i = list.indexOf(f.replace('.json', '.jpg')); const first = e.pages[0].split('/')[1].replace('.json', '.jpg');
  const pick = [...new Set([first, list[i], list[i + 1]].filter(Boolean))].slice(0, 3);
  return pick.map(x => ({ mimeType: 'image/jpeg', data: fs.readFileSync(path.join(ROOT, a, 'pages', x)).toString('base64') }));
};
const prompt = e => `These are consecutive scanned pages of "अष्टाध्यायी प्रथमावृत्तिः". Find the entry for the sūtra "${e.sutra}" (this edition may number it ${e.raw || e.num}) and transcribe its COMPLETE अर्थः — the Sanskrit gloss after "अर्थः—", up to its closing ॥. It may run over onto the next page (the top of the next image continues it); include that continuation.
Copy it EXACTLY as printed: keep every sandhi as printed; a word broken across a line or page with a hyphen is ONE word (join it, drop the hyphen); the old typeface's अ is अ (not श्र). Stop at the closing ॥ of the अर्थः (do not include the उदाहरणम्/भाषार्थः). Ignore handwriting and bleed-through. If the sūtra has no अर्थः line, return "".
Return JSON: {"artha": "<the text>"}
${G.JSON_PROMPT_RULES || ''}`;
(async () => {
  let spent = 0, i = 0, done = 0;
  await Promise.all(Array.from({ length: CONC }, async () => {
    while (i < todo.length && spent < BUDGET) {
      const e = todo[i++];
      const r = await G.callAsync(prompt(e), { images: pageImgs(e), maxOutputTokens: 2048, thinkingLevel: 'low' });
      spent += r.cost || 0;
      let t = null; try { t = G.parseJSON(r.text).artha; } catch (er) { }
      if (t == null) continue;
      OUT[e.num] = { before: e.arthaCore, artha: t }; done++;
    }
  }));
  fs.writeFileSync(OUTF, JSON.stringify(OUT, null, 1));
  console.log(`read ${done} of ${todo.length} · $${spent.toFixed(3)}`);
})();
