#!/usr/bin/env node
// पद split of the REFERENCE vṛttis (prathamāvṛtti अर्थः, sūtrārtha, Kāśikā/SK/LSK first sentence) by Gemini, every split
// verified by rejoining it (search-engine sandhiJoin, work/anandagiri-en/check_split.js) to the printed word.
// Usage: node tools/padsplit.js --pada 1.1 [--budget 0.3] [--conc 5]   → padsplit.json (merged; failures kept with ok:false)
'use strict';
const fs = require('fs'), path = require('path');
const G = require(path.join(__dirname, '../../../searchtool/khan/vc-karaka/gemini.js'));
const { check: check0 } = require(path.join(__dirname, '../../anandagiri-en/check_split.js'));
// the printed word may itself carry hyphens (इक्-वर्णस्य, sūtrārtha style): check each printed segment against its split segment
const check = (p, s, next) => {
  if (s.replace(/ \+ /g, '') === p) return [];
  if (/-/.test(p)) { const ps = p.split('-'), ss = s.split('-'); if (ps.length === ss.length && ps.every((x, i) => x === ss[i] || !check0(x, ss[i]).length)) return []; }
  return check0(p, s, next);
};
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const PADA = arg('--pada', '1.1'), BUDGET = +arg('--budget', 0.3), CONC = +arg('--conc', 5);
const R = require('./recs.js')();
const OUTF = path.join(__dirname, '..', 'padsplit.json');
const OUT = fs.existsSync(OUTF) ? JSON.parse(fs.readFileSync(OUTF, 'utf8')) : {};
const first = t => (t || '').replace(/<<[^>]*>>/g, ' ').replace(/\[\[[^\]]*\]\]/g, ' ').split(/[।॥]/)[0];
const toks = t => (t || '').replace(/[।॥,;()‹›“”"'‘’=—–]/g, ' ').split(/\s+/).filter(x => /[ऀ-ॿ]/.test(x));
const jobs = [];
for (const r of Object.values(R)) {
  if (PADA !== 'all' && !r.n.startsWith(PADA + '.')) continue;
  const T = { pv: r.pv && r.pv.artha, sa: r.sa, kv: first(r.kv), sk: first(r.sk), lsk: r.lsk && r.lsk !== r.sk ? first(r.lsk) : '' };
  for (const [k, t] of Object.entries(T)) { const w = toks(t); if (w.length && !(OUT[r.n] && OUT[r.n][k])) jobs.push({ n: r.n, k, w }); }
}
const prompt = batch => `Split each printed Sanskrit word below into its padas (undo sandhi), the way a teacher writes the पदच्छेद.
Rules: keep the printed word's sounds — a pada split must rejoin by sandhi to EXACTLY the printed word (misprints included; never correct the text).
Separate independent words inside one printed word with " + " (इत्येतेषां → "इति + एतेषाम्"). Mark the members of a compound with "-" (वृद्धिसंज्ञा → "वृद्धि-संज्ञा"; शलन्तात् → "शल्-अन्तात्"); a compound member is written in its stem form, the last member keeps its ending.
A word that needs no split is returned as it is. Do not add, drop or reorder words.
Return JSON: {"items": [{"id": "<id>", "split": ["<split of word 1>", "<split of word 2>", …]}]} — one split per printed word, same count and order.
${batch.map(j => `id ${j.id}: ${j.w.join(' | ')}`).join('\n')}
${G.JSON_PROMPT_RULES || ''}`;
if (process.argv.includes('--recheck')) { let f = 0, w = 0; for (const o of Object.values(OUT)) for (const rows of Object.values(o)) rows.forEach((r, x) => { w++; const bad = check(r[0], r[1], (rows[x + 1] || [])[0]).length; if (bad) { f++; r[2] = 0; } else r.length = 2; }); fs.writeFileSync(OUTF, JSON.stringify(OUT)); console.log(`rechecked ${w} words · failures ${f}`); process.exit(0); }
(async () => {
  let spent = 0, i = 0, done = 0, words = 0, fail = 0;
  const B = 10; const batches = []; for (let a = 0; a < jobs.length; a += B) batches.push(jobs.slice(a, a + B).map((j, x) => Object.assign(j, { id: `${a + x}` })));
  await Promise.all(Array.from({ length: CONC }, async () => {
    while (i < batches.length && spent < BUDGET) {
      const b = batches[i++];
      const r = await G.callAsync(prompt(b), { maxOutputTokens: 8192, thinkingLevel: 'low' });
      spent += r.cost || 0;
      let j = null; try { j = G.parseJSON(r.text); } catch (e) { }
      if (!j || !j.items) continue;
      for (const it of j.items) {
        const job = b.find(x => x.id === String(it.id)); if (!job || !Array.isArray(it.split) || it.split.length !== job.w.length) continue;
        const rows = job.w.map((p, x) => { const s = String(it.split[x] || '').trim(); const f = check(p, s, job.w[x + 1]); words++; if (f.length) fail++; return f.length ? [p, s, 0] : [p, s]; });
        (OUT[job.n] = OUT[job.n] || {})[job.k] = rows; done++;
      }
    }
  }));
  fs.writeFileSync(OUTF, JSON.stringify(OUT));
  console.log(`texts ${done}/${jobs.length} · words ${words} · rejoin failures ${fail} · $${spent.toFixed(3)}`);
})();
