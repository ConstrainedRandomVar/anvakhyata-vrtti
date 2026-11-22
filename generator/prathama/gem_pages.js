#!/usr/bin/env node
// Read prathamāvṛtti page scans with Gemini (image + the Google Vision text as a hint) → structured entries per sūtra.
// Usage: node gem_pages.js <pagesDir> <visionOcrDir> <outDir> [--budget 5] [--conc 5] [--only p-007]
// Approved by Harsha 2026-11-15 (Vision OCR + Gemini check + USD 20 discretionary). Resumable: skips pages already done.
'use strict';
const fs = require('fs'), path = require('path');
const G = require(path.join(__dirname, '../../../searchtool/khan/vc-karaka/gemini.js'));
const [pagesDir, ocrDir, outDir] = process.argv.slice(2);
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const BUDGET = +arg('--budget', 5), CONC = +arg('--conc', 5), ONLY = arg('--only', null);
fs.mkdirSync(outDir, { recursive: true });

const PROMPT = (vision) => `You are transcribing ONE scanned page of "अष्टाध्यायी प्रथमावृत्तिः" (a printed Sanskrit-Hindi commentary on Pāṇini's sūtras).
Each sūtra entry on the page looks like:
  <sūtra text> ॥अध्याय।पाद।संख्या॥
  पदच्छेदः, विभक्तिः (or पद० वि०) — …   समासः (or स०) — …   [sometimes a sūtra-type label such as संज्ञासूत्रमिदम्]
  अर्थः — <a short Sanskrit gloss> ॥
  उदाहरणानि (or उदा०) — …
  भाषार्थः — <Hindi gloss; often includes a sentence like "यहाँ से '…' की अनुवृत्ति … तक जाती है">

TASK: return a JSON object {"entries":[...], "lead":{...}}.
- "entries": one object per sūtra whose HEADER (sūtra text + number) is printed on this page, in page order, with keys:
  "num" (the printed number converted to ASCII "a.p.n", e.g. "1.1.1"), "sutra", "padaccheda", "samasa", "type",
  "artha" (the Sanskrit अर्थः line only), "anuvritti" (only the Hindi sentence(s) about अनुवृत्ति, else ""),
  "complete" (false if the entry continues on the next page).
- "lead": fields of an entry that STARTED ON THE PREVIOUS PAGE and continues at the top of this page (keys as above, only those present; {} if none).
RULES:
- Copy the PRINTED text exactly as printed — same spelling, same punctuation (। ॥), no corrections, no normalisation.
- The old typeface writes the vowel अ in an old form; transcribe it as अ (never as श्र), and आ as आ.
- IGNORE handwriting (pen notes in margins or between lines), bleed-through from the other side, page numbers, running heads, and footnotes.
- Omit a key's value ("") if that field is not printed for the entry. Do not invent or fill in anything.
${process.env.PV_HINT === '1' ? 'A machine OCR of this page is given below ONLY as a hint (it has errors). Trust the image.\n--- OCR hint ---\n' + vision + '\n--- end ---\n' : 'Read the image carefully, letter by letter; your reading will be checked against an independent OCR.\n'}${G.JSON_PROMPT_RULES || ''}`;

async function one(name) {
  const out = path.join(outDir, name.replace(/\.jpe?g$/, '.json'));
  if (fs.existsSync(out)) return { skipped: true, cost: 0 };
  const img = fs.readFileSync(path.join(pagesDir, name)).toString('base64');
  let vision = '';
  try { vision = JSON.parse(fs.readFileSync(path.join(ocrDir, name.replace(/\.jpe?g$/, '.json')), 'utf8')).fullTextAnnotation.text; } catch (e) { }
  const r = await G.callAsync(PROMPT(vision), { images: [{ mimeType: 'image/jpeg', data: img }], maxOutputTokens: 8192, thinkingLevel: 'low' });
  if (r.error) return { error: r.error, cost: 0 };
  let parsed; try { parsed = G.parseJSON(r.text); } catch (e) { parsed = null; }
  fs.writeFileSync(out, JSON.stringify({ page: name, parsed, raw: parsed ? undefined : r.text, usage: r.usage, cost: r.cost }, null, 1));
  return { cost: r.cost || 0, ok: !!parsed };
}
(async () => {
  let names = fs.readdirSync(pagesDir).filter(n => /\.jpe?g$/i.test(n)).sort();
  if (ONLY) names = names.filter(n => n.includes(ONLY));
  let spent = 0, i = 0, done = 0, bad = 0;
  const worker = async () => { while (i < names.length && spent < BUDGET) { const n = names[i++]; const r = await one(n); spent += r.cost || 0; if (!r.skipped) { done++; if (r.error || r.ok === false) { bad++; console.log('FAIL', n, r.error || 'unparsed'); } } if (done % 20 === 0 && done) console.log(`${done} pages · $${spent.toFixed(3)}`); } };
  await Promise.all(Array.from({ length: CONC }, worker));
  console.log(`done ${done} pages, failed ${bad}, spent $${spent.toFixed(3)}${spent >= BUDGET ? ' — BUDGET STOP' : ''}`);
})();
