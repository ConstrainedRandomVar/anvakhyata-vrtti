# ashtadhyayi.com data — errata (for the maintainer)

67 suggested corrections to `sutraani/data.txt` and `sutraani/laghukaumudi.txt`, each with the reason and verbatim citations; 7 more left for your judgement; and earlier claims of ours that we checked and withdrew (the data was right). These are suggestions only — nothing has been changed in the ashtadhyayi.com repository.

Files:
- `ERRATA.md` — readable list, grouped by field: now / suggested / why / settled by / citations. Also lists items left for the maintainer's judgement and earlier claims that were checked and withdrawn.
- `errata.json` — the main list: `{id, sutra_no, sutra, field, now, suggested, reason, citations:[{source, on, quote}], settled_by, status}`.
- `judgement.json` — `for_your_judgement` (not clearly errors) and `withdrawn` (the data is right).
- `errata.tsv` — one row per main item.
- `check_quotes.js` — checks that every quote is a verbatim substring of the cited source for the cited sūtra (ignoring only whitespace, daṇḍas and hyphens), and that every "now" value is still in `data.txt`.

Currency of the sources:
- `sutraani/data.txt` and `sutraani/laghukaumudi.txt`: the vendored copy (commit 24109f7b, 2026-08-18) is byte-identical to upstream master as of 2026-11-22, so every item is still in the data.
- Other commentary quotes come from the same vendored commit 24109f7b and may differ slightly from the current site. Upstream `kashika.txt` and `sutrartha.txt` have changed since. `check_quotes.js` also checks each Kāśikā quote against a copy of the current upstream `kashika.txt` (`UPSTREAM_KASHIKA`, default `/tmp/adup/sutraani/kashika.txt`). On 2026-11-22 all of them matched. No citation uses `sutrartha.txt`.
- The prathamāvṛtti (Brahmadatta Jijñāsu) quotes come from our digitisation (`../prathamavritti/prathamavritti.json`).

Check: `node check_quotes.js` (set `ASHTADHYAYI_DATA` if the data is not at `~/Projects/ashtadhyayi-data`).
