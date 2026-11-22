# The generator

Node.js (v18+), no packages. Reads the ashtadhyayi.com data and writes `vrtti.html` (the browsable page) + `data/r-<pāda>.js`
(one record per sūtra) + `data/c-<id>.js` (the commentaries shown beside each sūtra).

```sh
git clone https://github.com/ashtadhyayi-com/data ~/Projects/ashtadhyayi-data     # or set ASHTADHYAYI_DATA=/path/to/it
node build.js           # ~20 s; prints coverage and checks
open vrtti.html          # serve the folder (python3 -m http.server) if the browser blocks file:// scripts
sh tools/check.sh        # rebuild + regression check against tools/baseline100.json; read the final "CHECK:" line
```

The outputs in this repository's `vrtti/` were produced from ashtadhyayi-data commit `24109f7b` (2026-08-18). A newer data
checkout may change some vṛttis (the Kāśikā and sūtrārtha files have changed upstream since; the sūtra file has not).

## Files

| File | Role |
|---|---|
| `build.js` | The engine: word analysis → roles → paribhāṣā-licensed steps → vṛtti (Kāśikā-style, Kaumudī-style, unsandhied) → checks against the reference vṛttis → the page. |
| `lexicon.js` → `lexicon.json` | Automatic analysis of the sūtra words (stem, kind: suffix / sound / pratyāhāra / dhātu / term …), per occurrence. Hand entries in `build.js` (`LEX`) win. |
| `pbneed.js` | The wording check: which paribhāṣās the reference vṛttis rely on (cue words + explicit citations), compared with our steps. `tools/pbneed-reviewed.json` lists cues read and found not to be a use, with the reason. |
| `template.html` | The page. |
| `handwritten.json` | Hand-written vṛttis: the definitional sūtras (paribhāṣās, some saṃjñās) in full; `"keep": true` entries replace only the final vṛtti of two-clause sūtras. Every quote is checked: `node tools/check_hand.js`. |
| `rolepilot/` | The role tables (what each word of a sūtra does), their rendering into a vṛtti (`render.js`), hand roles for nipātanas (`hand-roles.json`), the opened compounds and the sourced "supplied" words. Some of these tables were drafted by a language model and then checked — the `.js` scripts that called the model are kept for the record; they need your own Gemini client and project and are not needed to build. |
| `audit/` | The paribhāṣā applicability audit: per paribhāṣā, every credit grouped (`*-firings.json`), the reviewer's verdicts (`*-audit.json/.md`), the rulings (`DECISIONS.md`), and `verdicts.json`, which `build.js` applies. Card/step corrections from the teaching reviews: `CARD-fixes.json`, `TEACHING-review.json`. |
| `prathama*.json`, `prathama/` | The prathamāvṛtti digitisation (see `../prathamavritti/README.md`): `prathama.json` is the merged text; the others are the re-reads, arbitrations, hand transcriptions, misprints and the book's printed numbers; `prathama/` holds the scripts. |
| `padsplit.json` | पद splits of the reference texts (model-made, kept only where they rejoin to the printed word) — used to highlight shared words. |
| `ashtadhyayi-errata.json`, `ASHTADHYAYI-COM-ERRATA.md` | The engine's working errata list (it applies the `an` entries and most `pc` ones). **Superseded by `../errata/`**, the checked list: a few working entries were withdrawn there after checking (e.g. 7.4.46 दथ् is right per the Mahābhāṣya; 6.2.21 आशङ्क is right). |
| `lib/sanskrit-search.js` | Sandhi- and orthography-tolerant matching (used for the overlap measures and the page's search). |
| `tools/` | check / snapshot / bless scripts, the regression baseline, the hand-fix batches. |

Not included: class-note material used during development (private teaching notes) — the build runs without it and produces the
same vṛttis.
