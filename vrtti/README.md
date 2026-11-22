# The generated vṛttis

`adhyaya-1.json` … `adhyaya-8.json` — one JSON array per adhyāya, one object per sūtra (3,983 in all), as built by `../generator`
from ashtadhyayi-data commit `24109f7b`. Machine-built: read them as a draft.

| Field | What |
|---|---|
| `sutra_no`, `id`, `sutra` | 1.1.1, ashtadhyayi.com id `11001`, the sūtra text. |
| `kind` | Rule kind the engine assigned: vidhi (suffix), ādeśa, operation (guṇa/vṛddhi/lopa …), svara, saṃjñā, nipātana, āgama, samāsa, pada, vibhakti, atideśa, ṣatva, ṇatva, paribhāṣā, adhikāra, ekādeśa … |
| `padaccheda` | The sūtra's words with case·number codes (`61` = 6th singular). |
| `with_anuvritti` | The sūtra with what it carries, in brackets. |
| `carried` | Each carried word: where from, by anuvṛtti or adhikāra, its role, whether the vṛtti voices it, and whether a word of the sūtra itself supersedes it. |
| `vrtti.kashika_style` | The vṛtti with sandhi, in the Kāśikā's manner (… भवति). |
| `vrtti.kaumudi_style` | The same, Kaumudī-style (… स्यात्). |
| `vrtti.no_sandhi` | Unsandhied. |
| `source_of_vrtti` | `roles` (built from the role table), `hand` (hand-written final vṛtti, see `generator/handwritten.json`), or empty (the definitional sūtras written in full by hand). |
| `steps` | The build, one step per reading: `pids` = the paribhāṣās that license it, `what` = the reading and its evidence, `now` = the text after the step. |
| `paribhashas` | Every paribhāṣā considered: `pid`, `status` (✔ applies · ✖ considered, not applicable — `why` says why · ↪ applies later, in the derivation, not in reading the sūtra · ? open), `layer` (2 = fired by the sūtra's own wording, 1 = named by a commentator here, with `quote`), `trigger`, `effect`. |
| `paribhashas_the_references_rely_on` | The paribhāṣās the reference vṛttis use (wording cues/citations) and which reference uses each; all are covered by our steps or listed as not a use. |
| `teaching_view` | The student view: one card per question the vṛtti answers (किम् आदेशः? कस्य स्थाने? कस्मिन् परे? …) with the answer, the case reading and the paribhāṣā behind it. |
| `notes` | Engine notes (data fixes applied, cautions). |

Totals in this build: 18,981 paribhāṣā considerations over 58 paribhāṣās — 15,105 ✔, 2,984 ✖, 476 ↪, 416 ?.
(Recompute: count `paribhashas[].status` over the eight files.)
