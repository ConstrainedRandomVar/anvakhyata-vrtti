# Audit of PIS 119 बाधकान्येव निपातनानि credits (vṛtti generator)

Generated 2026-11-20. Input: `audit/PIS 119-firings.json` (176 ✔ credits in 11 groups). Machine-readable result: `audit/PIS 119-audit.json`.

## Totals

| | licensed | not licensed | unsure | mixed |
|---|---|---|---|---|
| by credit (176) | 164 | 2 | 10 | — |
| by group (11) | 8 | 0 | 1 | 2 |

Not licensed, by what should be credited instead: `none` 2.

All quotations are copied from `~/Projects/ashtadhyayi-data/sutraani/<file>.txt` (id = adhyāya+pāda+3-digit sūtra) or `paribhashendushekhar/data.txt` (id = paribhāṣā number) and were checked by `audit/verify_quotes.js`. Digitisation slips are quoted as they stand.

## Main findings

- 164 of 176 credits are on real, obligatory nipātanas and are licensed.
- Not licensed (2): **3.3.3** is a rule fixing the time sense of suffixes, not a nipātana. At **6.1.60** the Kāśikā itself says the nipātana does not block: शिरस् is also used in the Veda.
- Unsure (10): 9 optional nipātanas (the sūtra keeps the regular form by वा/अन्यतरस्याम्, so whether a nipātana blocks makes no difference), plus 1.4.20, where the Kāśikā makes the forms correct through a saṃjñā.
- Missed: about 15 sūtras where the Kāśikā says part of the sūtra is nipātita (3.2.59, 5.2.12, 4.1.32, 6.3.109 …). The engine credits only pages whose kind is "nipātana".

## 1. What PIS 119 requires, from the sources

C1. Content: a nipātana is undertaken only where some general rule would otherwise apply, so within its own scope it blocks that rule (the regular form is not also correct there). The rival view, that nipātanas need not block, is rejected as against the Bhāṣya.

> तत्तत्कायें नाप्राप्ते निपातनारम्भात्  
> — paribhashendushekhar 119

> अबाधकान्यपि निपातनानीति तु भाष्यविरुद्धम्  
> — paribhashendushekhar 119

> बाधकान्येव हि निपातनानि भवन्ति  
> — bhashya 11027

> अत्र भाष्यानुसाराद्बाधकान्येव निपातनानि भवन्तीति पक्ष आश्रितः  
> — tattvabodhini 11027

C2. Scope: the sūtra must state a form ready-made (Kāśikā “निपात्यते/निपात्यन्ते”, or a list of forms valid exactly as spoken). A time rule or a saṃjñā that makes listed words correct by another route is not a nipātana.

> भविष्यति काले गम्यादयः शब्दाः साधवो भवन्ति। प्रत्ययस्यैव भविष्यत्कालता विधीयते न प्रकृतेः।  
> — kashika 33003

> भपदसंज्ञाधिकारे विधानात् तेन मुखेन साधुत्वमयस्मयादीनां विधीयते।  
> — kashika 14020

C3. What blocking means, in a commentator's words; and its absence: where the text says the regular form is also used, PIS 119 does no work.

> समुदायपाठस्य च प्रयोजनं विषयनियमः — स्त्रियामेव, तत्र ङीप्प्रत्यय एव, नान्यदा।  
> — kashika 54139

> न पुनरयमादेशः शिरःशब्दस्य, सोऽपि हि छन्दसि प्रयुज्यत एव  
> — kashika 61060

C4. Optional nipātanas: where the sūtra itself keeps the regular form as an option, blocking and not blocking give the same forms (see the “unsure” members). Where commentators invoke the rival maxim “अबाधकान्यपि निपातनानि” it is on sūtras that are not in this firing list.

> वावचनात् पक्षे सोऽपि भवति  
> — kashika 51060

> विकल्पार्थं निपातनम्  
> — kashika 72027

> अबाधकान्यपि निपातनानि भवन्ति  
> — padamanjari 42004

## 2. Groups

### G1 — carried / not a sūtra word | nipātana | X (129) — **mixed**

*How checked:* Every member read: sūtra, our vṛtti, and the Kāśikā sentence that says what is nipātita (pulled by script for all 176); every member checked by script for a Kāśikā/Kaumudī “निपात” word (171 have it in the Kāśikā; the 5 that do not were read in full).

6.1.27 (शृतं पाके) is licensed: the Kāśikā makes its विभाषा a fixed one (quoted below), so the nipātana does block श्राण/श्रपित for milk and oblation. 3.3.78 (अन्तर्घनः) is licensed although the Kāśikā words it as a vidhi: the irregular घन stands against अन्तर्घात, which the Kāśikā gives only outside the meaning. 7.2.18 is licensed; note the Kāśikā on 7.2.28 lets a later option override its स्वान्त — a nipātana can itself be overridden; that does not touch the credit here.

> व्यवस्थितविभाषा चेयम्, तेन क्षीरहविषोर्नित्यं शृभावो भवति — kashika 61027  
> अन्तःपूर्वाद् हन्तेरप् प्रत्ययो भवति, घनादेशश्च भवति देशेऽभिधेये। — kashika 33078  
> देश इति किम्? अन्तर्घातोऽन्यः — kashika 33078  
> परत्वादयं विकल्पः <<क्षुब्धस्वान्त०>> [[७.२.१८]] इति निपातनं बाधते — kashika 72028

Licensed (120): 3.1.101, 3.1.102, 3.1.103, 3.1.104, 3.1.105, 3.1.114, 3.1.115, 3.1.116, 3.1.117, 3.1.121, 3.1.123, 3.1.127, 3.1.128, 3.1.129, 3.1.130, 3.1.131, 3.1.132, 3.2.26, 3.2.37, 3.2.55, 3.2.109, 3.2.164, 3.2.169, 3.3.68, 3.3.70, 3.3.78, 3.3.79, 3.3.80, 3.3.81, 3.3.85, 3.3.86, 3.3.101, 3.3.119, 3.3.122, 3.3.123, 3.3.124, 3.4.73, 3.4.74, 4.1.62, 5.2.14, 5.2.20, 5.2.22, 5.2.23, 5.2.71, 5.2.73, 5.2.74, 5.2.80, 5.2.84, 5.2.89, 5.2.90, 5.2.92, 5.2.93, 5.2.114, 5.2.126, 5.3.17, 5.3.104, 5.4.77, 5.4.83, 5.4.84, 5.4.120, 5.4.123, 5.4.126, 5.4.160, 6.1.12, 6.1.27, 6.1.36, 6.1.81, 6.1.82, 6.1.83, 6.1.143, 6.1.144, 6.1.145, 6.1.146, 6.1.147, 6.1.148, 6.1.149, 6.1.152, 6.1.153, 6.1.154, 6.1.155, 6.1.156, 6.1.157, 6.3.33, 6.3.69, 6.3.113, 6.4.28, 6.4.29, 6.4.53, 6.4.54, 6.4.171, 6.4.172, 6.4.173, 6.4.174, 6.4.175, 7.1.43, 7.1.48, 7.2.18, 7.2.20, 7.2.21, 7.2.26, 7.2.32, 7.2.33, 7.2.34, 7.2.69, 7.3.61, 7.3.62, 7.3.68, 7.3.69, 7.4.34, 7.4.36, 8.1.14, 8.1.15, 8.2.13, 8.2.50, 8.2.55, 8.2.58, 8.2.59, 8.2.60, 8.2.61, 8.2.67

Not licensed (2):

- **3.3.3** a nipātana stands against the general rules that would give another form — should be `none` (NOT_A_NIPATANA). Not a nipātana: the sūtra fixes the time sense (future) of the suffixes in गमी, आगामी, भावी …; no form is stated against a general rule (C2). The engine took the nipātana label from the page kind.
  > भविष्यति काले गम्यादयः शब्दाः साधवो भवन्ति। प्रत्ययस्यैव भविष्यत्कालता विधीयते न प्रकृतेः। — kashika 33003
- **6.1.60** a nipātana stands against the general rules that would give another form — should be `none` (NIPATANA_DOES_NOT_BLOCK). The Kāśikā makes शीर्षन् a separate word, explicitly not a substitute for शिरस्, because शिरस् is also used in the Veda — so nothing is blocked (C3). (The Kaumudī instead reads it as a substitute, “शिरःशब्दस्य शीर्षन् स्यात्”, which is an ādeśa rule, not a nipātana — PIS 119 is not needed on either reading.)
  > शीर्षन्निति शब्दान्तरं शिरःशब्देन समानार्थं छन्दसि विषये निपात्यते, न पुनरयमादेशः शिरःशब्दस्य, सोऽपि हि छन्दसि प्रयुज्यत एव — kashika 61060
  > शिरःशब्दस्य शीर्षन् स्यात् — kaumudi 61060

Unsure (7):

- **3.1.42** a nipātana stands against the general rules that would give another form — Optional nipātana: the sūtra itself (वा / अन्यतरस्याम् / उदीचाम्) keeps the regular form beside the nipātana, so the question PIS 119 settles — does a nipātana shut out the regular form? — gets the same answer (both forms) whether nipātanas block or not. In the nipātana's own option the regular rule is set aside, so a credit is defensible; it is not needed to read the sūtra. Policy call for Harsha.
  > अभ्युत्सादयामित्येवमादयश्छन्दसि विषयेऽन्यतरस्यां निपात्यन्ते — kashika 31042
- **3.1.122** a nipātana stands against the general rules that would give another form — Optional nipātana: the sūtra itself (वा / अन्यतरस्याम् / उदीचाम्) keeps the regular form beside the nipātana, so the question PIS 119 settles — does a nipātana shut out the regular form? — gets the same answer (both forms) whether nipātanas block or not. In the nipātana's own option the regular rule is set aside, so a credit is defensible; it is not needed to read the sūtra. Policy call for Harsha.
  > तत्रान्यतरस्यां वृद्ध्यभावो निपात्यते — kashika 31122
- **3.4.68** a nipātana stands against the general rules that would give another form — Optional nipātana: the sūtra itself (वा / अन्यतरस्याम् / उदीचाम्) keeps the regular form beside the nipātana, so the question PIS 119 settles — does a nipātana shut out the regular form? — gets the same answer (both forms) whether nipātanas block or not. In the nipātana's own option the regular rule is set aside, so a credit is defensible; it is not needed to read the sūtra. Policy call for Harsha.
  > भव्यादयः शब्दाः कर्तरि वा निपात्यन्ते — kashika 34068
  > भावकर्मणोः प्राप्तयोः कर्ता च वाच्यः पक्ष उच्यते — kashika 34068
- **6.1.150** a nipātana stands against the general rules that would give another form — Optional nipātana: the sūtra itself (वा / अन्यतरस्याम् / उदीचाम्) keeps the regular form beside the nipātana, so the question PIS 119 settles — does a nipātana shut out the regular form? — gets the same answer (both forms) whether nipātanas block or not. In the nipātana's own option the regular rule is set aside, so a credit is defensible; it is not needed to read the sūtra. Policy call for Harsha.
  > विकिरशब्दाभिधेयो वा शकुनिर्भवति — kashika 61150
- **6.3.32** a nipātana stands against the general rules that would give another form — Optional nipātana: the sūtra itself (वा / अन्यतरस्याम् / उदीचाम्) keeps the regular form beside the nipātana, so the question PIS 119 settles — does a nipātana shut out the regular form? — gets the same answer (both forms) whether nipātanas block or not. In the nipātana's own option the regular rule is set aside, so a credit is defensible; it is not needed to read the sūtra. Policy call for Harsha.
  > उदीचामिति किम्? मातापितरौ — kashika 63032
- **7.2.27** a nipātana stands against the general rules that would give another form — Optional nipātana: the sūtra itself (वा / अन्यतरस्याम् / उदीचाम्) keeps the regular form beside the nipātana, so the question PIS 119 settles — does a nipātana shut out the regular form? — gets the same answer (both forms) whether nipātanas block or not. In the nipātana's own option the regular rule is set aside, so a credit is defensible; it is not needed to read the sūtra. Policy call for Harsha.
  > विकल्पार्थं निपातनम् — kashika 72027
- **7.2.30** a nipātana stands against the general rules that would give another form — Optional nipātana: the sūtra itself (वा / अन्यतरस्याम् / उदीचाम्) keeps the regular form beside the nipātana, so the question PIS 119 settles — does a nipātana shut out the regular form? — gets the same answer (both forms) whether nipātanas block or not. In the nipātana's own option the regular rule is set aside, so a credit is defensible; it is not needed to read the sūtra. Policy call for Harsha.
  > अपचितोऽनेन गुरुः, अपचायितोऽनेन गुरुः — kashika 72030

### G2 — carried / not a sūtra word | vidhi | X (19) — **mixed**

*How checked:* Every member read: sūtra, our vṛtti, and the Kāśikā sentence that says what is nipātita (pulled by script for all 176); every member checked by script for a Kāśikā/Kaumudī “निपात” word (171 have it in the Kāśikā; the 5 that do not were read in full).

5.4.139 is licensed with the clearest statement of what PIS 119 does: the listed forms fix the domain and shut out the 4.1.8 option (quoted below).

> समुदायपाठस्य च प्रयोजनं विषयनियमः — स्त्रियामेव, तत्र ङीप्प्रत्यय एव, नान्यदा। — kashika 54139  
> <<पादोऽन्यतरस्याम्>> [[४.१.८]] इति विकल्पो न भवति — kashika 54139

Licensed (17): 3.2.71, 3.3.87, 3.4.10, 3.4.11, 3.4.15, 4.2.13, 4.2.36, 4.4.89, 5.1.59, 5.1.90, 5.1.113, 5.1.114, 5.2.13, 5.3.22, 5.4.125, 5.4.128, 5.4.139

Unsure (2):

- **3.1.41** a nipātana stands against the general rules that would give another form — Optional nipātana: the sūtra itself (वा / अन्यतरस्याम् / उदीचाम्) keeps the regular form beside the nipātana, so the question PIS 119 settles — does a nipātana shut out the regular form? — gets the same answer (both forms) whether nipātanas block or not. In the nipātana's own option the regular rule is set aside, so a credit is defensible; it is not needed to read the sūtra. Policy call for Harsha.
  > विदाङ्कुर्वन्त्वित्येतदन्यतरस्यां निपात्यते — kashika 31041
- **5.1.60** a nipātana stands against the general rules that would give another form — Optional nipātana: the sūtra itself (वा / अन्यतरस्याम् / उदीचाम्) keeps the regular form beside the nipātana, so the question PIS 119 settles — does a nipātana shut out the regular form? — gets the same answer (both forms) whether nipātanas block or not. In the nipātana's own option the regular rule is set aside, so a credit is defensible; it is not needed to read the sūtra. Policy call for Harsha.
  > वावचनात् पक्षे सोऽपि भवति — kashika 51060

### G3 — carried / not a sūtra word | ādeśa | X (7) — **licensed**

*How checked:* Every member read: sūtra, our vṛtti, and the Kāśikā sentence that says what is nipātita (pulled by script for all 176); every member checked by script for a Kāśikā/Kaumudī “निपात” word (171 have it in the Kāśikā; the 5 that do not were read in full).

Licensed (7): 7.1.49, 7.3.64, 7.4.45, 7.4.65, 7.4.74, 8.2.12, 8.2.14

### G4 — carried / not a sūtra word | ṣatva | X (7) — **licensed**

*How checked:* Every member read: sūtra, our vṛtti, and the Kāśikā sentence that says what is nipātita (pulled by script for all 176); every member checked by script for a Kāśikā/Kaumudī “निपात” word (171 have it in the Kāśikā; the 5 that do not were read in full).

Licensed (7): 8.3.75, 8.3.90, 8.3.91, 8.3.92, 8.3.93, 8.3.94, 8.3.114

### G5 — carried / not a sūtra word | operation | X (4) — **licensed**

*How checked:* Every member read: sūtra, our vṛtti, and the Kāśikā sentence that says what is nipātita (pulled by script for all 176); every member checked by script for a Kāśikā/Kaumudī “निपात” word (171 have it in the Kāśikā; the 5 that do not were read in full).

Licensed (4): 3.3.74, 4.1.59, 5.4.147, 5.4.150

### G6 — carried / not a sūtra word | samāsa | X (3) — **licensed**

*How checked:* Every member read: sūtra, our vṛtti, and the Kāśikā sentence that says what is nipātita (pulled by script for all 176); every member checked by script for a Kāśikā/Kaumudī “निपात” word (171 have it in the Kāśikā; the 5 that do not were read in full).

Licensed (3): 2.1.17, 2.1.48, 2.1.72

### G7 — carried / not a sūtra word | vibhakti | X (3) — **licensed**

*How checked:* Every member read: sūtra, our vṛtti, and the Kāśikā sentence that says what is nipātita (pulled by script for all 176); every member checked by script for a Kāśikā/Kaumudī “निपात” word (171 have it in the Kāśikā; the 5 that do not were read in full).

Licensed (3): 5.3.31, 5.3.32, 5.3.33

### G8 — carried / not a sūtra word | saṃjñā | X (1) — **unsure**

*How checked:* Every member read: sūtra, our vṛtti, and the Kāśikā sentence that says what is nipātita (pulled by script for all 176); every member checked by script for a Kāśikā/Kaumudī “निपात” word (171 have it in the Kāśikā; the 5 that do not were read in full).

Licensed (0): —

Unsure (1):

- **1.4.20** a nipātana stands against the general rules that would give another form — Probably not licensed: the Kāśikā says these forms are made correct through the bha/pada saṃjñā, not by nipātana (C2), and a vārttika lets both saṃjñās apply together. But the list is read as ready-made Vedic forms (an ākṛtigaṇa), and the Kaumudī's wording is “एतानि छन्दसि साधूनि”, as with nipātana lists. Left for Harsha.
  > भपदसंज्ञाधिकारे विधानात् तेन मुखेन साधुत्वमयस्मयादीनां विधीयते। — kashika 14020
  > उभयसंज्ञान्यपीति वक्तव्यमिति — kaumudi 14020

### G9 — carried / not a sūtra word | ekavat | X (1) — **licensed**

*How checked:* Every member read: sūtra, our vṛtti, and the Kāśikā sentence that says what is nipātita (pulled by script for all 176); every member checked by script for a Kāśikā/Kaumudī “निपात” word (171 have it in the Kāśikā; the 5 that do not were read in full).

2.4.11 is licensed: the Kāśikā treats the list as forms taken exactly as spoken, and the regular option comes back only for other forms (quoted below).

> गवाश्वप्रभृतिषु यथोच्चारितं द्वन्द्ववृत्तम् — kashika 24011  
> रूपान्तरे तु नायं विधिर्भवति — kashika 24011

Licensed (1): 2.4.11

### G10 — carried / not a sūtra word | svara | X (1) — **licensed**

*How checked:* Every member read: sūtra, our vṛtti, and the Kāśikā sentence that says what is nipātita (pulled by script for all 176); every member checked by script for a Kāśikā/Kaumudī “निपात” word (171 have it in the Kāśikā; the 5 that do not were read in full).

Licensed (1): 3.3.97

### G11 — carried / not a sūtra word | āgama | X (1) — **licensed**

*How checked:* Every member read: sūtra, our vṛtti, and the Kāśikā sentence that says what is nipātita (pulled by script for all 176); every member checked by script for a Kāśikā/Kaumudī “निपात” word (171 have it in the Kāśikā; the 5 that do not were read in full).

Licensed (1): 7.2.64

## 3. Missed credits

- **3.2.59** (PIS 119) — The Kāśikā says the five forms are nipātita with क्विन्; the page kind is "suffix rule", so no credit.
  > ऋत्विगादयः पञ्चशब्दाः क्विन्प्रत्ययान्ता निपात्यन्ते — kashika 32059
- **6.3.109** (PIS 119) — पृषोदरादीनि — the paradigm list of forms valid as spoken (the PIS 119 text itself treats पुराण as पृषोदरादि). No credit.
  > तानि यथोपदिष्टानि साधूनि भवन्ति — kashika 63109
  > पृषोदरादित्वान्नेति बोध्यम् — paribhashendushekhar 119
- **5.2.12** (PIS 119) — Partly a nipātana (य-lopa in the first member).
  > तेषां पूर्वपदे यलोपमात्रं निपात्यते — kashika 52012
- **4.1.32** (PIS 119) — The base forms अन्तर्वत्/पतिवत् are nipātita (the augment is taught separately).
  > प्रकृतिर्निपात्यते, नुगागमस्तु विधीयते — kashika 41032
- **5.1.65** (PIS 119) — शीर्ष for शिरस् is nipātita along with the suffix.
  > प्रत्ययसन्नियोगेन शिरसः शीर्षभावो निपात्यते — kashika 51065

How common: a script listed every sūtra whose Kāśikā says “निपात्यते/निपात्यन्ते/निपातनात्/निपातनम्” and that has no PIS 119 credit: 67 sūtras. Most only point to a nipātana in another sūtra (e.g. 2.4.36 “अन्नाण्णः इति निपातनात्”), and some deny one (2.4.27 “अर्थातिदेशश्चायम् न निपातनम्”). About 15 have a nipātana in the sūtra itself: 1.4.74, 2.1.18, 2.2.31, 3.2.59, 3.2.158, 3.2.177, 4.1.32, 4.1.155, 4.2.27, 4.3.23, 5.1.65, 5.2.10, 5.2.12, 6.3.26, 6.3.75, plus 6.3.109 (पृषोदरादि) and the accent nipātanas 6.3.78 and 6.1.120. Cause: the credit is keyed to the page kind (“निपातनम्”), so a mixed sūtra (a suffix or augment rule with a nipātita base) never gets it.
