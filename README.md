# अन्वाख्यातवृत्तिः — a vṛtti for every sūtra of the Aṣṭādhyāyī, built step by step

**Status: beta.** The vṛttis are machine-built (a rule engine, with AI help in places) and are still under review — there are mistakes.
Live tool: https://constrainedrandomvar.github.io/adhyayana-sahakari/tool-vrtti.html (part of the reading site *adhyayana-sahakārī*).

This repository is a contribution to **[ashtadhyayi.com](https://ashtadhyayi.com/)**, whose open data
([github.com/ashtadhyayi-com/data](https://github.com/ashtadhyayi-com/data)) the whole tool is built on. It holds:

| Folder | What |
|---|---|
| `generator/` | The vṛtti generator (Node.js, no dependencies): reads the ashtadhyayi.com data and writes a vṛtti, its steps and its paribhāṣās for all 3,983 sūtras, plus the browsable page. `generator/README.md` |
| `vrtti/` | Its output: for each sūtra, the vṛtti (Kāśikā-style, Kaumudī-style, unsandhied), the anuvṛtti it carries, the step-by-step build, every paribhāṣā considered (✔ applies / ✖ not applicable, with the reason / ↪ applies later, in the derivation / ? open), and the student "why" view. `vrtti/README.md` |
| `errata/` | Corrections to the ashtadhyayi.com data found while building — each with what the data says now, the suggestion, the reason, and verbatim citations. `errata/ERRATA.md` |
| `prathamavritti/` | A digital text of the **अष्टाध्यायी (भाष्य) प्रथमावृत्तिः** of Pt. Brahmadatta Jijñāsu (Ramlal Kapoor Trust): पदच्छेदः, समासः, अर्थः and the अनुवृत्ति note for 3,972 sūtras, keyed to the usual sūtra numbers. `prathamavritti/README.md` |

## How the generator works (short)

A sūtra's words, their cases (from the data's `pc` field), and the words it carries (`an`, plus the adhikāra ranges in `type`) are
read into **roles** — what is replaced, what replaces it, what follows, what precedes, the base, the suffix, the meaning … Each role is
then voiced the way the paribhāṣā-sūtras say it must be read: a 6th names the place (षष्ठी स्थानेयोगा 1.1.49), a 7th what follows
(तस्मिन्निति निर्दिष्टे पूर्वस्य 1.1.66), a 5th what precedes (तस्मादित्युत्तरस्य 1.1.67), a qualifier stands for what ends in it
(येन विधिस्तदन्तस्य 1.1.72), a suffix is placed after (परश्च 3.1.2), and so on. Every such reading is recorded as a **step**, with the
paribhāṣā that licenses it, so the vṛtti is not just produced but *explained*.

The result is checked against the reference vṛttis — the prathamāvṛtti, the नैलेश-वृत्तिः (ashtadhyayi.com's sūtrārtha), the Kāśikā,
the Siddhānta-kaumudī and the Laghu-kaumudī — and against the paribhāṣās those vṛttis rely on (a wording check: every paribhāṣā a
reference vṛtti uses must be a step in ours, or be listed as read-and-not-a-use with the reason). Where the authorities disagree, the
later muni settles it: Pāṇini < Kātyāyana < Patañjali (*yathottaraṃ munīnāṃ prāmāṇyam*); later commentaries rank below all three.

Every use of 44 of the paribhāṣās across the 3,983 sūtras was audited (by blind reviewers with every quote verified by
script against the commentaries), and two-clause sūtras the role template cannot express ("X does not happen, but Y does") have
hand-written vṛttis resting on quoted references (`generator/handwritten.json`).

## Licence

- **Code** (`generator/`): MIT — `LICENSE`.
- **Our data** (`vrtti/`, `errata/`, the transcription in `prathamavritti/`, the hand-curated inputs in `generator/`):
  **CC BY 4.0** — `LICENSE-DATA`. Please credit **adhyayana-sahakārī**, with a link to this repository.
- **Not ours:** the ashtadhyayi.com data (sūtra text, padaccheda, anuvṛtti, dhātupāṭha, the commentaries and the sūtrārtha) — used
  with credit as its README asks; it is not copied here except where a quotation is the evidence for a step or an erratum. The
  prathamāvṛtti is Pt. Brahmadatta Jijñāsu's work (Ramlal Kapoor Trust); we release our digital transcription with full credit.

## Caveats

The vṛttis are generated, not printed: they read correctly in most sūtras and differ in style from the Kāśikā in many; some are wrong.
Average shared-word overlap with the prathamāvṛtti's अर्थः is 44.6% (3,970 sūtras) and with the Kāśikā 40.7% — a style measure, not
an accuracy one. The prathamāvṛtti text was read from a scan by OCR + an independent model reading, compared field by field; it has not
been proofread line by line against the book. Reports are welcome: open an issue here, or use ⚑ report on any sūtra in the live tool.
