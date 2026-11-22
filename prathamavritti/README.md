# अष्टाध्यायी (भाष्य) प्रथमावृत्तिः — digital text

**The work:** Pt. Brahmadatta Jijñāsu, *Aṣṭādhyāyī-bhāṣya Prathamāvṛtti* (Ramlal Kapoor Trust). Each sūtra's entry in the book has
पदच्छेदः · विभक्तिः · समासः · अर्थः (a simple Sanskrit vṛtti) · उदाहरणानि · भाषार्थः (Hindi, ending with where the anuvṛtti runs).
**This text has:** पदच्छेदः (with the book's case·number marks), समासः, the rule type where printed, अर्थः, and the Hindi
अनुवृत्ति note (“… की अनुवृत्ति … तक जाती है”) — for 3,972 of the 3,983 sūtras. **It does not have** the उदाहरणानि or the rest of
the Hindi भाषार्थः.

Released as our transcription under CC BY 4.0 with full credit to the author and publisher (see `../README.md`).

## Files

- `prathamavritti.json` — `entries` keyed by the usual (ashtadhyayi.com) sūtra number; `not_in_this_edition` = the 11 sūtras the
  edition does not print (its own numbering runs on: 4.1.166–167, 4.2.8, 4.3.132–133, 5.1.36, 6.1.62, 6.1.100, 6.1.136, 6.1.156, 8.4.20).
- `prathamavritti.tsv` — the same, one row per sūtra.

| Field | What |
|---|---|
| `sutra_no` | Usual number. The book's own numbering differs in places (e.g. its 1.1.18 is the usual 1.1.19); entries were placed by sūtra **text**, not number. |
| `printed_no` | The book's printed number, where it is shown separately (only where it differs by more than the edition's ordinary offset or was confirmed from a printed copy). |
| `sutra_as_printed` | The sūtra as the book prints it. |
| `padaccheda`, `samasa`, `type`, `artha`, `anuvritti_note` | As printed. `artha_full` is the longer form where the book's अर्थः runs on (empty in this release). |
| `printed_together_with` | Two sūtras the book prints as one entry. |
| `transcribed_from_later_printing` | `true` for the 8 entries on pages missing from our scan (adhyāya 6: the printed p. 131 replaced by a copy of p. 135; pp. 284–285 absent), transcribed by hand from a later printing. |
| `misprints` | Printer's errors: the text stays **as printed**; each is listed here (`printed` → `for`). |
| `scan_pages` | Page file(s) in our scan, e.g. `a1/p-048` = adhyāya 1 volume, page image 48 (not the printed page number). |
| `agreement_with_ocr` | Per field, the similarity (0–1) between the accepted reading and an independent OCR of the same page — a rough confidence. |

## How it was made

1,814 page images. Each page was read twice, independently: Google Cloud Vision OCR, and a Gemini model reading the page image
**without** the OCR text. The model's structured reading was taken as the base; each field was compared with the OCR. Where they
disagreed, the page was read again (a second reading, and a third to break ties), and single disputed words in समासः/अर्थः were
re-read blind (without showing either candidate). Entries were aligned to the sūtra list by text (order-preserving), which also found
pairs printed as one, pages scanned twice, and pages bound out of order. Entries broken across a page were joined by re-reading both
pages. Book misprints were checked on the scan and are kept as printed.

**Accuracy:** not proofread line by line against the book. The commonest OCR confusions of this typeface (अ / श्र, आ / प्रा) were
the reason for the independent second reading; residual errors remain, especially in long समासः notes. Corrections are welcome.
