# Audit of PIS 123 योगविभागादिष्टसिद्धिः credits (vṛtti generator)

Generated 2026-11-20. Input: `audit/PIS 123-firings.json` (95 ✔ credits in 12 groups). Machine-readable result: `audit/PIS 123-audit.json`.

## Totals

| | licensed | not licensed | unsure | mixed |
|---|---|---|---|---|
| by credit (95) | 24 | 61 | 10 | — |
| by group (12) | 1 | 2 | 1 | 8 |

Not licensed, by what should be credited instead: `none` 61.

All quotations are copied from `~/Projects/ashtadhyayi-data/sutraani/<file>.txt` (id = adhyāya+pāda+3-digit sūtra) or `paribhashendushekhar/data.txt` (id = paribhāṣā number) and were checked by `audit/verify_quotes.js`. Digitisation slips are quoted as they stand.

## Main findings

- Only 24 of 95 credits are licensed: places where the Kāśikā really splits the sūtra being read to get a desired form (3.2.4, 4.1.94, 6.3.84 “इष्टप्रसिद्ध्यर्थः”, 4.4.78 “इष्टसंग्रहार्थः”, 8.2.3, 2.1.4 …).
- 46 are remarks on why Pāṇini wrote two sūtras ("उत्तरार्थः", against yathāsaṅkhya, "प्रदर्शनार्थः"). That is not PIS 123, and the engine's own wording ("the sūtra is stated separately for a purpose") describes exactly this wrong reading. Should be: none.
- 13 are derivation only: the split is of another sūtra (mostly 2.1.30/2.1.40) and only explains an example compound. 2 are jñāpakas for other principles.
- 10 unsure: reported views (केचित्), alternative explanations (अथ वा), a hypothetical split (7.2.3), and two jñāpakas of anityatva (1.3.7, 6.1.32) that are close to Nāgeśa's bīja.
- Missed: at least 6 sūtras where the Kaumudī splits the sūtra itself (2.3.25, where Nyāsa also names the maxim; 1.4.9, 2.1.6, 2.3.71, 6.3.46, 8.2.86). The engine reads only the Kāśikā.

## 1. What PIS 123 requires, from the sources

C1. Content: when a commentator splits one sūtra into two (योगविभाग), the split may be used only to get desired forms, never to produce wrong ones. Bīja: a rule that Pāṇini stated as a separate second yoga with the same operation is indicated to be anitya.

> इष्टसिद्धिरेव न त्वनिष्टापादनं कार्यमित्यर्थः  
> — paribhashendushekhar 123

> तत्तत्समानविधिकद्वितीययोगेन विभक्तस्यानित्यत्वज्ञापनमेतद्बीजम्  
> — paribhashendushekhar 123

C2. What the paribhāṣā covers: a split made by the commentators (कर्तव्यः / क्रियते / करिष्यते / योगं विभज्य) of the sūtra being read, to get a form or meaning the undivided sūtra does not give. Nyāsa states the maxim in these words at 2.3.25.

> यत्रेष्यते तत्रय योगविभागादिष्टसिद्धिरिति स्त्रियामपि भवत्येव  
> — nyaas 23025

> समानस्येति योगविभाग इष्टप्रसिद्ध्यर्थः  क्रियते  
> — kashika 63084

> ख इति योगविभागः कर्तव्य इष्टसंग्रहार्थः  
> — kashika 44078

C3. Not covered: a remark explaining why Pāṇini himself wrote two sūtras instead of one — so that only part runs on by anuvṛtti (“उत्तरार्थः”), so that yathāsaṅkhya (1.3.10) does not apply, or for illustration. Nothing is split and no extra form results; the sūtra is read as it stands. (This is also what the engine's wording “the sūtra is stated separately for a purpose” describes, so the wording itself misreads the paribhāṣā.)

> योगविभाग उत्तरत्र क्यचोऽनुवृत्त्यर्थः  
> — kashika 31009

> योगविभागो यथासंख्यनिरासार्थः  
> — kashika 43082

> किमर्थो योगविभागः? प्रदर्शनार्थः  
> — kashika 12057

C4. Derivation only: where the Kāśikā splits ANOTHER sūtra to account for an example compound or an extra form (“तृतीयेति योगविभागात् समासः”), PIS 123 explains how the example is made, not how this sūtra is read. That is a derivation note (↪), not a credit.

> तृतीयेति योगविभागात् समासः  
> — kashika 63006

> अनित्योऽयं प्रतिषेध इति योगविभागाद् विज्ञायते  
> — kashika 32153

C5. A jñāpaka drawn from Pāṇini's separate statement is not a split; it may point to another principle.

> एतद् ज्ञापयति — यदुपाधेर्विभाषा तदुपाधेः प्रतिषेध इति  
> — kashika 72016

> पृथग्योगकरणमस्य विधेरनित्यत्वज्ञापनार्थम्  
> — kashika 13007

## 2. Groups

### G1 — carried / not a sūtra word | vidhi | X (33) — **mixed**

*How checked:* Every member read: the Kāśikā sentence with योगविभाग/पृथग्योग pulled by script for all 95, with ±300 characters of context read for every member not of the formula “योगविभाग उत्तरार्थः / पृथग्योगकरणमुत्तरार्थम् / …यथासंख्य…”; our vṛtti checked for whether the split shows in it.

Our vṛttis give the literal reading even where the Kāśikā splits the sūtra (e.g. 3.2.4, 4.4.78, 4.4.101, 5.1.24: the extra forms the split yields are not in the vṛtti). The credit is still licensed — the Kāśikā reads this very sūtra as two — but the vṛtti does not show the result.

Licensed (7): 3.2.4, 4.1.94, 4.4.78, 4.4.101, 5.1.24, 5.1.96, 5.4.75

Not licensed (24):

- **3.1.9** the sūtra is stated separately for a purpose — should be `none` (PANINI_OWN_SPLIT). The Kāśikā only explains why Pāṇini wrote this as a separate sūtra (for the following sūtras' anuvṛtti, or a similar purpose of the sūtra division); no split is made and no extra form results (C3). Reading the sūtra as written does not need PIS 123.
  > योगविभाग उत्तरत्र क्यचोऽनुवृत्त्यर्थः — kashika 31009
- **3.1.147** the sūtra is stated separately for a purpose — should be `none` (PANINI_OWN_SPLIT). The Kāśikā only explains why Pāṇini wrote this as a separate sūtra (for the following sūtras' anuvṛtti, or a similar purpose of the sūtra division); no split is made and no extra form results (C3). Reading the sūtra as written does not need PIS 123.
  > योगविभाग उत्तरार्थः — kashika 31147
- **3.2.47** the sūtra is stated separately for a purpose — should be `none` (PANINI_OWN_SPLIT). The Kāśikā only explains why Pāṇini wrote this as a separate sūtra (for the following sūtras' anuvṛtti, or a similar purpose of the sūtra division); no split is made and no extra form results (C3). Reading the sūtra as written does not need PIS 123.
  > योगविभाग उत्तरार्थः — kashika 32047
- **3.2.64** the sūtra is stated separately for a purpose — should be `none` (PANINI_OWN_SPLIT). The Kāśikā only explains why Pāṇini wrote this as a separate sūtra (for the following sūtras' anuvṛtti, or a similar purpose of the sūtra division); no split is made and no extra form results (C3). Reading the sūtra as written does not need PIS 123.
  > योगविभाग उत्तरार्थः — kashika 32064
- **3.2.72** the sūtra is stated separately for a purpose — should be `none` (PANINI_OWN_SPLIT). The Kāśikā only explains why Pāṇini wrote this as a separate sūtra (for the following sūtras' anuvṛtti, or a similar purpose of the sūtra division); no split is made and no extra form results (C3). Reading the sūtra as written does not need PIS 123.
  > योगविभाग उत्तरार्थः — kashika 32072
- **3.2.138** the sūtra is stated separately for a purpose — should be `none` (PANINI_OWN_SPLIT). The Kāśikā only explains why Pāṇini wrote this as a separate sūtra (for the following sūtras' anuvṛtti, or a similar purpose of the sūtra division); no split is made and no extra form results (C3). Reading the sūtra as written does not need PIS 123.
  > योगविभाग उत्तरार्थः — kashika 32138
- **3.2.153** the sūtra is stated separately for a purpose — should be `none` (DERIVATION_ONLY). The split is of another sūtra — (the jñāpaka of anityatva drawn from Pāṇini's split) — and only accounts for an example form or compound. Reading 3.2.153 itself does not need it (C4). At most a ↪ derivation note.
  > सूदेर्युचि प्रतिषिद्धे कथं मधुसूदनो रिपुसूदन इति? अनित्योऽयं प्रतिषेध इति योगविभागाद् विज्ञायते — kashika 32153
- **3.3.115** the sūtra is stated separately for a purpose — should be `none` (PANINI_OWN_SPLIT). The Kāśikā only explains why Pāṇini wrote this as a separate sūtra (for the following sūtras' anuvṛtti, or a similar purpose of the sūtra division); no split is made and no extra form results (C3). Reading the sūtra as written does not need PIS 123.
  > योगविभाग उत्तरार्थः — kashika 33115
- **3.3.137** the sūtra is stated separately for a purpose — should be `none` (PANINI_OWN_SPLIT). The Kāśikā only explains why Pāṇini wrote this as a separate sūtra (for the following sūtras' anuvṛtti, or a similar purpose of the sūtra division); no split is made and no extra form results (C3). Reading the sūtra as written does not need PIS 123.
  > योगविभाग उत्तरार्थः — kashika 33137
- **3.3.148** the sūtra is stated separately for a purpose — should be `none` (PANINI_OWN_SPLIT). The Kāśikā only explains why Pāṇini wrote this as a separate sūtra (for the following sūtras' anuvṛtti, or a similar purpose of the sūtra division); no split is made and no extra form results (C3). Reading the sūtra as written does not need PIS 123.
  > योगविभाग उत्तरार्थः — kashika 33148
- **3.3.159** the sūtra is stated separately for a purpose — should be `none` (PANINI_OWN_SPLIT). The Kāśikā only explains why Pāṇini wrote this as a separate sūtra (for the following sūtras' anuvṛtti, or a similar purpose of the sūtra division); no split is made and no extra form results (C3). Reading the sūtra as written does not need PIS 123.
  > योगविभागः उत्तरार्थः — kashika 33159
- **3.3.162** the sūtra is stated separately for a purpose — should be `none` (PANINI_OWN_SPLIT). The Kāśikā only explains why Pāṇini wrote this as a separate sūtra (for the following sūtras' anuvṛtti, or a similar purpose of the sūtra division); no split is made and no extra form results (C3). Reading the sūtra as written does not need PIS 123.
  > योगविभाग उत्तरार्थः — kashika 33162
- **4.1.16** the sūtra is stated separately for a purpose — should be `none` (PANINI_OWN_SPLIT). The Kāśikā only explains why Pāṇini wrote this as a separate sūtra (for the following sūtras' anuvṛtti, or a similar purpose of the sūtra division); no split is made and no extra form results (C3). Reading the sūtra as written does not need PIS 123.
  > योगविभाग उत्तरार्थः — kashika 41016
- **4.2.28** the sūtra is stated separately for a purpose — should be `none` (PANINI_SPLIT_AGAINST_YATHASANKHYA). Pāṇini's separate sūtra keeps yathāsaṅkhya (1.3.10) from pairing the items; that is a remark on the sūtra division, not a split for a desired form (C3).
  > योगविभागः सङ्ख्यातानुदेशपरिहारार्थः — kashika 42028
- **4.2.45** the sūtra is stated separately for a purpose — should be `none` (JNAPAKA_NOT_SPLIT). A jñāpaka: the separate listing of क्षुद्रकमालव indicates pūrvavipratiṣedha and tadantavidhi. No split is made to get a form. (C5)
  > न च गोत्रसमुदायो गोत्रम्, न च तदन्तविधिरत्रास्ति? एवं तर्ह्येतज् ज्ञापयति — वुञि पूर्वविप्रतिषेधः, सामूहिकेषु च तदन्तविधिरस्तीति — kashika 42045
- **4.3.21** the sūtra is stated separately for a purpose — should be `none` (PANINI_OWN_SPLIT). The Kāśikā only explains why Pāṇini wrote this as a separate sūtra (for the following sūtras' anuvṛtti, or a similar purpose of the sūtra division); no split is made and no extra form results (C3). Reading the sūtra as written does not need PIS 123.
  > योगविभाग उत्तरार्थः — kashika 43021
- **4.3.44** the sūtra is stated separately for a purpose — should be `none` (PANINI_OWN_SPLIT). The Kāśikā only explains why Pāṇini wrote this as a separate sūtra (for the following sūtras' anuvṛtti, or a similar purpose of the sūtra division); no split is made and no extra form results (C3). Reading the sūtra as written does not need PIS 123.
  > योगविभाग उत्तरार्थः — kashika 43044
- **4.3.82** the sūtra is stated separately for a purpose — should be `none` (PANINI_SPLIT_AGAINST_YATHASANKHYA). Pāṇini's separate sūtra keeps yathāsaṅkhya (1.3.10) from pairing the items; that is a remark on the sūtra division, not a split for a desired form (C3).
  > योगविभागो यथासंख्यनिरासार्थः — kashika 43082
- **4.3.90** the sūtra is stated separately for a purpose — should be `none` (PANINI_OWN_SPLIT). The Kāśikā only explains why Pāṇini wrote this as a separate sūtra (for the following sūtras' anuvṛtti, or a similar purpose of the sūtra division); no split is made and no extra form results (C3). Reading the sūtra as written does not need PIS 123.
  > योगविभाग उत्तरार्थः — kashika 43090
- **4.4.3** the sūtra is stated separately for a purpose — should be `none` (PANINI_OWN_SPLIT). The Kāśikā only explains why Pāṇini wrote this as a separate sūtra (for the following sūtras' anuvṛtti, or a similar purpose of the sūtra division); no split is made and no extra form results (C3). Reading the sūtra as written does not need PIS 123.
  > योगविभाग उत्तरार्थः — kashika 44003
- **4.4.132** the sūtra is stated separately for a purpose — should be `none` (PANINI_SPLIT_AGAINST_YATHASANKHYA). Pāṇini's separate sūtra keeps yathāsaṅkhya (1.3.10) from pairing the items; that is a remark on the sūtra division, not a split for a desired form (C3).
  > योगविभागो यथासंख्यनिरासार्थ उत्तरार्थश्च — kashika 44132
- **5.2.103** the sūtra is stated separately for a purpose — should be `none` (PANINI_SPLIT_AGAINST_YATHASANKHYA). Pāṇini's separate sūtra keeps yathāsaṅkhya (1.3.10) from pairing the items; that is a remark on the sūtra division, not a split for a desired form (C3).
  > योगविभाग उत्तरार्थो यथासंख्यार्थश्च — kashika 52103
- **5.3.25** the sūtra is stated separately for a purpose — should be `none` (PANINI_OWN_SPLIT). The Kāśikā only explains why Pāṇini wrote this as a separate sūtra (for the following sūtras' anuvṛtti, or a similar purpose of the sūtra division); no split is made and no extra form results (C3). Reading the sūtra as written does not need PIS 123.
  > योगविभाग उत्तरार्थः — kashika 53025
- **5.4.104** the sūtra is stated separately for a purpose — should be `none` (DERIVATION_ONLY). The split is of another sūtra — 2.1.40 (सप्तमी शौण्डैः) — and only accounts for an example form or compound. Reading 5.4.104 itself does not need it (C4). At most a ↪ derivation note.
  > योगविभागात् सप्तमीसमासः — kashika 54104

Unsure (2):

- **5.2.40** the sūtra is stated separately for a purpose — The split is the Kāśikā's second explanation (अथ वा); its first is a jñāpaka (एतदेव चादेशविधानं ज्ञापकम्). Licensed only if the second is the one adopted.
  > अथ वा योगविभागेन वतुपं विधाय पश्चाद् वो घो विधीयते — kashika 52040
- **5.3.102** the sūtra is stated separately for a purpose — The split is proposed only for a reported view (केचित् … इच्छन्ति: some want ढञ् too). If that view is adopted, PIS 123 fits; the Kāśikā does not adopt it.
  > केचिदत्र ढञमपीच्छन्ति, तदर्थं योगविभागःकर्तव्यः — kashika 53102

### G2 — carried / not a sūtra word | ādeśa | X (17) — **mixed**

*How checked:* Every member read: the Kāśikā sentence with योगविभाग/पृथग्योग pulled by script for all 95, with ±300 characters of context read for every member not of the formula “योगविभाग उत्तरार्थः / पृथग्योगकरणमुत्तरार्थम् / …यथासंख्य…”; our vṛtti checked for whether the split shows in it.

3.4.2 and 2.3.32 (G7) are the two places where our vṛtti does show the split (3.4.2 is printed split; 2.3.32's vṛtti adds द्वितीया).

Licensed (7): 1.2.50, 3.4.2, 4.3.2, 5.3.5, 6.3.84, 7.1.26, 8.2.3

Not licensed (9):

- **1.2.57** the sūtra is stated separately for a purpose — should be `none` (PANINI_OWN_SPLIT). The Kāśikā only explains why Pāṇini wrote this as a separate sūtra (for the following sūtras' anuvṛtti, or a similar purpose of the sūtra division); no split is made and no extra form results (C3). Reading the sūtra as written does not need PIS 123.
  > यद्येवं पूर्वसूत्र एव कालोपसर्जनग्रहणं कस्माद् न क्रियते? किमर्थो योगविभागः? प्रदर्शनार्थः — kashika 12057
- **2.4.43** the sūtra is stated separately for a purpose — should be `none` (PANINI_OWN_SPLIT). The Kāśikā only explains why Pāṇini wrote this as a separate sūtra (for the following sūtras' anuvṛtti, or a similar purpose of the sūtra division); no split is made and no extra form results (C3). Reading the sūtra as written does not need PIS 123.
  > योगविभाग उत्तरार्थः — kashika 24043
- **2.4.47** the sūtra is stated separately for a purpose — should be `none` (PANINI_OWN_SPLIT). The Kāśikā only explains why Pāṇini wrote this as a separate sūtra (for the following sūtras' anuvṛtti, or a similar purpose of the sūtra division); no split is made and no extra form results (C3). Reading the sūtra as written does not need PIS 123.
  > योगविभाग उत्तरार्थः — kashika 24047
- **3.1.53** the sūtra is stated separately for a purpose — should be `none` (PANINI_OWN_SPLIT). The Kāśikā only explains why Pāṇini wrote this as a separate sūtra (for the following sūtras' anuvṛtti, or a similar purpose of the sūtra division); no split is made and no extra form results (C3). Reading the sūtra as written does not need PIS 123.
  > पृथग्योग उत्तरार्थः — kashika 31053
- **3.1.56** the sūtra is stated separately for a purpose — should be `none` (PANINI_OWN_SPLIT). The Kāśikā only explains why Pāṇini wrote this as a separate sūtra (for the following sūtras' anuvṛtti, or a similar purpose of the sūtra division); no split is made and no extra form results (C3). Reading the sūtra as written does not need PIS 123.
  > पृथग्योगकरणमात्मनेपदार्थम् — kashika 31056
- **3.2.107** the sūtra is stated separately for a purpose — should be `none` (PANINI_OWN_SPLIT). The Kāśikā only explains why Pāṇini wrote this as a separate sūtra (for the following sūtras' anuvṛtti, or a similar purpose of the sūtra division); no split is made and no extra form results (C3). Reading the sūtra as written does not need PIS 123.
  > योगविभाग उत्तरार्थः — kashika 32107
- **6.3.76** the sūtra is stated separately for a purpose — should be `none` (DERIVATION_ONLY). The split is of another sūtra — 2.1.30 (तृतीया …) — and only accounts for an example form or compound. Reading 6.3.76 itself does not need it (C4). At most a ↪ derivation note.
  > तृतीयेति योगविभागात् समासः — kashika 63076
- **6.4.116** the sūtra is stated separately for a purpose — should be `none` (PANINI_OWN_SPLIT). The Kāśikā only explains why Pāṇini wrote this as a separate sūtra (for the following sūtras' anuvṛtti, or a similar purpose of the sūtra division); no split is made and no extra form results (C3). Reading the sūtra as written does not need PIS 123.
  > पृथग्योगकरणमुत्तरार्थम् — kashika 64116
- **7.4.33** the sūtra is stated separately for a purpose — should be `none` (PANINI_OWN_SPLIT). The Kāśikā only explains why Pāṇini wrote this as a separate sūtra (for the following sūtras' anuvṛtti, or a similar purpose of the sūtra division); no split is made and no extra form results (C3). Reading the sūtra as written does not need PIS 123.
  > पृथग्योगकरणमुत्तरार्थम् — kashika 74033

Unsure (1):

- **8.3.37** the sūtra is stated separately for a purpose — Reported view (केचित् … कुर्वन्ति); the Kāśikā does not adopt it.
  > केचित् तु एतदर्थं योगविभागं कुर्वन्ति — kashika 83037

### G3 — carried / not a sūtra word | operation | X (16) — **mixed**

*How checked:* Every member read: the Kāśikā sentence with योगविभाग/पृथग्योग pulled by script for all 95, with ±300 characters of context read for every member not of the formula “योगविभाग उत्तरार्थः / पृथग्योगकरणमुत्तरार्थम् / …यथासंख्य…”; our vṛtti checked for whether the split shows in it.

Licensed (4): 6.4.12, 6.4.95, 6.4.133, 6.4.140

Not licensed (9):

- **6.1.41** the sūtra is stated separately for a purpose — should be `none` (PANINI_OWN_SPLIT). The Kāśikā only explains why Pāṇini wrote this as a separate sūtra (for the following sūtras' anuvṛtti, or a similar purpose of the sūtra division); no split is made and no extra form results (C3). Reading the sūtra as written does not need PIS 123.
  > पृथग्योगकरणमुत्तरार्थम् — kashika 61041
- **6.1.43** the sūtra is stated separately for a purpose — should be `none` (PANINI_OWN_SPLIT). The Kāśikā only explains why Pāṇini wrote this as a separate sūtra (for the following sūtras' anuvṛtti, or a similar purpose of the sūtra division); no split is made and no extra form results (C3). Reading the sūtra as written does not need PIS 123.
  > योगविभाग उत्तरार्थः — kashika 61043
- **6.3.6** the sūtra is stated separately for a purpose — should be `none` (DERIVATION_ONLY). The split is of another sūtra — 2.1.30 — and only accounts for an example form or compound. Reading 6.3.6 itself does not need it (C4). At most a ↪ derivation note.
  > तृतीयेति योगविभागात् समासः — kashika 63006
- **6.3.7** the sūtra is stated separately for a purpose — should be `none` (DERIVATION_ONLY). The split is of another sūtra — 2.1.36 (चतुर्थी …) — and only accounts for an example form or compound. Reading 6.3.7 itself does not need it (C4). At most a ↪ derivation note.
  > चतुर्थीति योगविभागात् समासः — kashika 63007
- **6.3.11** the sūtra is stated separately for a purpose — should be `none` (DERIVATION_ONLY). The split is of another sūtra — 2.1.40 — and only accounts for an example form or compound. Reading 6.3.11 itself does not need it (C4). At most a ↪ derivation note.
  > सप्तमीति योगविभागात् समासः — kashika 63011
- **6.3.18** the sūtra is stated separately for a purpose — should be `none` (DERIVATION_ONLY). The split is of another sūtra — 2.1.40 — and only accounts for an example form or compound. Reading 6.3.18 itself does not need it (C4). At most a ↪ derivation note.
  > सर्वत्र सप्तमीति योगविभागात् समासः — kashika 63018
- **6.3.19** the sūtra is stated separately for a purpose — should be `none` (DERIVATION_ONLY). The split is of another sūtra — 2.1.40 — and only accounts for an example form or compound. Reading 6.3.19 itself does not need it (C4). At most a ↪ derivation note.
  > सप्तमीति योगविभागात् समासः — kashika 63019
- **6.4.26** the sūtra is stated separately for a purpose — should be `none` (PANINI_OWN_SPLIT). The Kāśikā only explains why Pāṇini wrote this as a separate sūtra (for the following sūtras' anuvṛtti, or a similar purpose of the sūtra division); no split is made and no extra form results (C3). Reading the sūtra as written does not need PIS 123.
  > पृथग्योगकरणमुत्तरार्थम् — kashika 64026
- **7.3.17** the sūtra is stated separately for a purpose — should be `none` (DERIVATION_ONLY). The split is of another sūtra — 5.1.57 (तदस्य परिमाणम्) — and only accounts for an example form or compound. Reading 7.3.17 itself does not need it (C4). At most a ↪ derivation note.
  > पञ्च लोहिन्यः परिमाणमस्य, पञ्च कलापानि परिमाणमस्येति विगृह्य <<तदस्य परिमाणम्>> [[५.१.५७]] इति योगविभागात् प्रत्ययः, तद्धितान्तश्चायं समुदायः संज्ञा — kashika 73017

Unsure (3):

- **5.1.125** the sūtra is stated separately for a purpose — Reported view (केचित् … कुर्वन्ति); the Kāśikā does not adopt it.
  > स्तेनादिति केचिद् योगविभागं कुर्वन्ति — kashika 51125
- **6.1.32** the sūtra is stated separately for a purpose — A jñāpaka from Pāṇini's separate statement (no संप्रसारण when a suffix that is not the reduplication's condition intervenes). Close to the PIS 123 bīja, but not a split made for a desired form. Policy call.
  > ह्वः संप्रसारणमभ्यस्तस्येत्येकयोगेन सिद्धे पृथग्योगकरणमनभ्यस्तनिमित्तप्रत्ययव्यवधाने संप्रसारणाभावज्ञापनार्थम् — kashika 61032
- **7.2.3** the sūtra is stated separately for a purpose — Hypothetical: “if the sūtra were split, हलन्त would be unnecessary” — and the Kāśikā then defends the हल् of the sūtra as written (हल्समुदायपरिग्रहार्थम्). Naming a split is not doing one; it is unclear whether the split is adopted.
  > अत्र योगविभागे सति हलन्तग्रहणमन्तरेणापि सिध्यति — kashika 72003

### G4 — carried / not a sūtra word | svara | X (9) — **mixed**

*How checked:* Every member read: the Kāśikā sentence with योगविभाग/पृथग्योग pulled by script for all 95, with ±300 characters of context read for every member not of the formula “योगविभाग उत्तरार्थः / पृथग्योगकरणमुत्तरार्थम् / …यथासंख्य…”; our vṛtti checked for whether the split shows in it.

Licensed (1): 3.3.100

Not licensed (7):

- **6.1.212** the sūtra is stated separately for a purpose — should be `none` (PANINI_SPLIT_AGAINST_YATHASANKHYA). Pāṇini's separate sūtra keeps yathāsaṅkhya (1.3.10) from pairing the items; that is a remark on the sūtra division, not a split for a desired form (C3).
  > पृथग्योगकरणं यथासंख्यशङ्कानिवृत्त्यर्थम् — kashika 61212
- **6.2.59** the sūtra is stated separately for a purpose — should be `none` (PANINI_OWN_SPLIT). The Kāśikā only explains why Pāṇini wrote this as a separate sūtra (for the following sūtras' anuvṛtti, or a similar purpose of the sūtra division); no split is made and no extra form results (C3). Reading the sūtra as written does not need PIS 123.
  > पृथग्योगकरणमुत्तरार्थम् — kashika 62059
- **6.2.152** the sūtra is stated separately for a purpose — should be `none` (DERIVATION_ONLY). The split is of another sūtra — 2.1.40 — and only accounts for an example form or compound. Reading 6.2.152 itself does not need it (C4). At most a ↪ derivation note.
  > <<सप्तमी०>>[[२.१.४०]] इति योगविभागात् समासः — kashika 62152
- **6.2.162** the sūtra is stated separately for a purpose — should be `none` (DERIVATION_ONLY). The split is of another sūtra — 2.1.30 — and only accounts for an example form or compound. Reading 6.2.162 itself does not need it (C4). At most a ↪ derivation note.
  > तृतीयेति योगविभागात् समासः — kashika 62162
- **6.2.186** the sūtra is stated separately for a purpose — should be `none` (PANINI_OWN_SPLIT). The Kāśikā only explains why Pāṇini wrote this as a separate sūtra (for the following sūtras' anuvṛtti, or a similar purpose of the sūtra division); no split is made and no extra form results (C3). Reading the sūtra as written does not need PIS 123.
  > योगविभाग उत्तरार्थः — kashika 62186
- **8.1.40** the sūtra is stated separately for a purpose — should be `none` (PANINI_OWN_SPLIT). The Kāśikā only explains why Pāṇini wrote this as a separate sūtra (for the following sūtras' anuvṛtti, or a similar purpose of the sūtra division); no split is made and no extra form results (C3). Reading the sūtra as written does not need PIS 123.
  > पृथग्योगकरणमुत्तरार्थम् — kashika 81040
- **8.1.52** the sūtra is stated separately for a purpose — should be `none` (PANINI_OWN_SPLIT). The Kāśikā only explains why Pāṇini wrote this as a separate sūtra (for the following sūtras' anuvṛtti, or a similar purpose of the sūtra division); no split is made and no extra form results (C3). Reading the sūtra as written does not need PIS 123.
  > पृथग्योगकरणमुत्तरार्थम् — kashika 81052

Unsure (1):

- **5.2.44** the sūtra is stated separately for a purpose — The split is needed only on one of two analyses (if उभ is not a number); on the other, the sūtra just replaces the तयप् of 5.2.42. Licensed only on the second analysis.
  > अथ न संख्या, ततो योगविभागेन तयपं विधाय तस्य नित्यमयजादेशो विधीयते — kashika 52044

### G5 — carried / not a sūtra word | āgama | X (4) — **not licensed**

*How checked:* Every member read: the Kāśikā sentence with योगविभाग/पृथग्योग pulled by script for all 95, with ±300 characters of context read for every member not of the formula “योगविभाग उत्तरार्थः / पृथग्योगकरणमुत्तरार्थम् / …यथासंख्य…”; our vṛtti checked for whether the split shows in it.

Licensed (0): —

Not licensed (4):

- **6.4.79** the sūtra is stated separately for a purpose — should be `none` (PANINI_OWN_SPLIT). The Kāśikā only explains why Pāṇini wrote this as a separate sūtra (for the following sūtras' anuvṛtti, or a similar purpose of the sūtra division); no split is made and no extra form results (C3). Reading the sūtra as written does not need PIS 123.
  > पृथग्योगकरणमुत्तरार्थम् — kashika 64079
- **7.1.64** the sūtra is stated separately for a purpose — should be `none` (PANINI_OWN_SPLIT). The Kāśikā only explains why Pāṇini wrote this as a separate sūtra (for the following sūtras' anuvṛtti, or a similar purpose of the sūtra division); no split is made and no extra form results (C3). Reading the sūtra as written does not need PIS 123.
  > लभेश्च पृथग्योगकरणमुत्तरार्थम् — kashika 71064
- **7.2.16** the sūtra is stated separately for a purpose — should be `none` (JNAPAKA_NOT_SPLIT). A jñāpaka for a different maxim (“यदुपाधेर्विभाषा तदुपाधेः प्रतिषेधः”), drawn from Pāṇini's separate statement; PIS 123 is not involved. (C5)
  > योगविभागकरणं किमर्थम्, आदितश्च विभाषा भावादिकर्मणोरित्येवं पठितव्यम्, अन्यत्र हि भावादिकर्मभ्यां <<यस्य विभाषा>> [[७.२.१५]] इति प्रतिषेधो भविष्यति? ज्ञापनार्थम्, एतद् ज्ञापयति — यदुपाधेर्विभाषा तदुपाधेः प्रतिषेध इति — kashika 72016
- **8.3.31** the sūtra is stated separately for a purpose — should be `none` (DERIVATION_ONLY). The split is of another sūtra — 8.4.40 (स्तोः श्चुना श्चुः) — and only accounts for an example form or compound. Reading 8.3.31 itself does not need it (C4). At most a ↪ derivation note.
  > तत्र समाधिमाहुः — <<स्तोः श्चुना श्चुः>> [[८.४.४०]] इत्यत्र योगविभागः क्रियते णत्वप्रतिषेधार्थम्, स्तोः श्चुना णकारो न भवतीति, ततः श्चुरिति — kashika 83031

### G6 — carried / not a sūtra word | saṃjñā | X (3) — **mixed**

*How checked:* Every member read: the Kāśikā sentence with योगविभाग/पृथग्योग pulled by script for all 95, with ±300 characters of context read for every member not of the formula “योगविभाग उत्तरार्थः / पृथग्योगकरणमुत्तरार्थम् / …यथासंख्य…”; our vṛtti checked for whether the split shows in it.

Licensed (0): —

Not licensed (2):

- **1.4.58** the sūtra is stated separately for a purpose — should be `none` (PANINI_OWN_SPLIT). The Kāśikā only explains why Pāṇini wrote this as a separate sūtra (for the following sūtras' anuvṛtti, or a similar purpose of the sūtra division); no split is made and no extra form results (C3). Reading the sūtra as written does not need PIS 123.
  > पृथग्योगकरणमुत्तरसंज्ञाविशेषणार्थम् — kashika 14058
- **1.4.60** the sūtra is stated separately for a purpose — should be `none` (PANINI_OWN_SPLIT). The Kāśikā only explains why Pāṇini wrote this as a separate sūtra (for the following sūtras' anuvṛtti, or a similar purpose of the sūtra division); no split is made and no extra form results (C3). Reading the sūtra as written does not need PIS 123.
  > योगविभाग उत्तरार्थः — kashika 14060

Unsure (1):

- **1.3.7** the sūtra is stated separately for a purpose — The Kāśikā draws from Pāṇini's separate statement the jñāpaka that this rule is anitya. That is exactly the bīja Nāgeśa gives for PIS 123 (“विभक्तस्यानित्यत्वज्ञापनम्”), but it is a jñāpaka about Pāṇini's own sūtra division, not a split made to get a form; our vṛtti does not use it. Policy call.
  > पृथग्योगकरणमस्य विधेरनित्यत्वज्ञापनार्थम् — kashika 13007

### G7 — carried / not a sūtra word | vibhakti | X (3) — **mixed**

*How checked:* Every member read: the Kāśikā sentence with योगविभाग/पृथग्योग pulled by script for all 95, with ±300 characters of context read for every member not of the formula “योगविभाग उत्तरार्थः / पृथग्योगकरणमुत्तरार्थम् / …यथासंख्य…”; our vṛtti checked for whether the split shows in it.

Licensed (2): 2.3.31, 2.3.32

Not licensed (1):

- **2.3.58** the sūtra is stated separately for a purpose — should be `none` (PANINI_OWN_SPLIT). The Kāśikā only explains why Pāṇini wrote this as a separate sūtra (for the following sūtras' anuvṛtti, or a similar purpose of the sūtra division); no split is made and no extra form results (C3). Reading the sūtra as written does not need PIS 123.
  > योगविभाग उत्तरार्थः — kashika 23058

### G8 — carried / not a sūtra word | nipātana | X (3) — **mixed**

*How checked:* Every member read: the Kāśikā sentence with योगविभाग/पृथग्योग pulled by script for all 95, with ±300 characters of context read for every member not of the formula “योगविभाग उत्तरार्थः / पृथग्योगकरणमुत्तरार्थम् / …यथासंख्य…”; our vṛtti checked for whether the split shows in it.

Licensed (2): 6.4.171, 8.1.15

Not licensed (1):

- **2.4.28** the sūtra is stated separately for a purpose — should be `none` (PANINI_SPLIT_AGAINST_YATHASANKHYA). Pāṇini's separate sūtra keeps yathāsaṅkhya (1.3.10) from pairing the items; that is a remark on the sūtra division, not a split for a desired form (C3).
  > योगविभागः संख्यातानुदेशपरिहारार्थः — kashika 24028

### G9 — carried / not a sūtra word | ṣatva | X (3) — **mixed**

*How checked:* Every member read: the Kāśikā sentence with योगविभाग/पृथग्योग pulled by script for all 95, with ±300 characters of context read for every member not of the formula “योगविभाग उत्तरार्थः / पृथग्योगकरणमुत्तरार्थम् / …यथासंख्य…”; our vṛtti checked for whether the split shows in it.

Licensed (0): —

Not licensed (2):

- **8.3.74** the sūtra is stated separately for a purpose — should be `none` (PANINI_OWN_SPLIT). The Kāśikā only explains why Pāṇini wrote this as a separate sūtra (for the following sūtras' anuvṛtti, or a similar purpose of the sūtra division); no split is made and no extra form results (C3). Reading the sūtra as written does not need PIS 123.
  > पृथग्योगकरणसामर्थ्यादनिष्ठायामित्येतद् नानुवर्तते — kashika 83074
- **8.3.89** the sūtra is stated separately for a purpose — should be `none` (DERIVATION_ONLY). The split is of another sūtra — 3.2.4 (सुपि स्थः) — and only accounts for an example form or compound. Reading 8.3.89 itself does not need it (C4). At most a ↪ derivation note.
  > <<सुपि स्थः>> [[३.२.४]] इत्यत्र सुपीति योगविभागात् कप्रत्ययः — kashika 83089

Unsure (1):

- **8.3.109** the sūtra is stated separately for a purpose — Reported view (केचित् … कुर्वन्ति); the Kāśikā does not adopt it.
  > केचित् सहेः इति योगविभागं कुर्वन्ति — kashika 83109

### G10 — carried / not a sūtra word | pada | X (2) — **not licensed**

*How checked:* Every member read: the Kāśikā sentence with योगविभाग/पृथग्योग pulled by script for all 95, with ±300 characters of context read for every member not of the formula “योगविभाग उत्तरार्थः / पृथग्योगकरणमुत्तरार्थम् / …यथासंख्य…”; our vṛtti checked for whether the split shows in it.

Licensed (0): —

Not licensed (2):

- **1.3.33** the sūtra is stated separately for a purpose — should be `none` (PANINI_OWN_SPLIT). The Kāśikā only explains why Pāṇini wrote this as a separate sūtra (for the following sūtras' anuvṛtti, or a similar purpose of the sūtra division); no split is made and no extra form results (C3). Reading the sūtra as written does not need PIS 123.
  > पृथग्योगकरणमुपसर्गविशेषणार्थम् — kashika 13033
- **1.3.84** the sūtra is stated separately for a purpose — should be `none` (PANINI_OWN_SPLIT). The Kāśikā only explains why Pāṇini wrote this as a separate sūtra (for the following sūtras' anuvṛtti, or a similar purpose of the sūtra division); no split is made and no extra form results (C3). Reading the sūtra as written does not need PIS 123.
  > पृथग्योगकरणमुत्तरार्थम् — kashika 13084

### G11 — carried / not a sūtra word | adhikāra | X (1) — **licensed**

*How checked:* Every member read: the Kāśikā sentence with योगविभाग/पृथग्योग pulled by script for all 95, with ±300 characters of context read for every member not of the formula “योगविभाग उत्तरार्थः / पृथग्योगकरणमुत्तरार्थम् / …यथासंख्य…”; our vṛtti checked for whether the split shows in it.

Licensed (1): 2.1.4

### G12 — carried / not a sūtra word | ṇatva | X (1) — **unsure**

*How checked:* Every member read: the Kāśikā sentence with योगविभाग/पृथग्योग pulled by script for all 95, with ±300 characters of context read for every member not of the formula “योगविभाग उत्तरार्थः / पृथग्योगकरणमुत्तरार्थम् / …यथासंख्य…”; our vṛtti checked for whether the split shows in it.

Licensed (0): —

Unsure (1):

- **8.4.3** the sūtra is stated separately for a purpose — The split “अगः” is part of the view that 8.4.3 is a niyama (केचिदेतद् नियमार्थं वर्णयन्ति); the Kāśikā then gives another view (अपरे तु …) with no split. Fits only on the first view.
  > अग इति योगविभागेन णत्वप्रतिषेधः, न नियमप्रतिषेध इति — kashika 84003

## 3. Missed credits

- **2.3.25** (PIS 123) — The Kaumudī splits विभाषा off this sūtra to get the 5th outside guṇa and in the feminine, and Nyāsa names the maxim itself here. The Kāśikā text has no योगविभाग word, so the engine misses it.
  > विभाषेति योगविभागादगुणे स्त्रियां च क्वचित् — kaumudi 23025
  > यत्रेष्यते तत्रय योगविभागादिष्टसिद्धिरिति स्त्रियामपि भवत्येव — nyaas 23025
- **2.1.6** (PIS 123) — The Kaumudī splits अव्ययम् off to give the general avyayībhāva rule.
  > अव्ययमिति योगो विभज्यते — kaumudi 21006
- **1.4.9** (PIS 123) — The Kaumudī splits वा off (all Vedic rules optional).
  > इह वेति योगं विभज्य छन्दसीत्यनुवर्तते — kaumudi 14009
- **2.3.71** (PIS 123) — The Kaumudī splits the sūtra.
  > अत्र योगो विभज्यते — kaumudi 23071
- **6.3.46** (PIS 123) — The Kaumudī splits आत् off.
  > आदिति योगविभागादात्वम् — kaumudi 63046
- **8.2.86** (PIS 123) — The Kaumudī splits प्राचाम् off.
  > इह प्राचाम् इति योगो विभज्यते — kaumudi 82086

How common: a script scanned every Kāśikā and Kaumudī passage for योगविभाग / पृथग्योग / “योगो विभज्यते” / “योगं विभज्य” on sūtras with no PIS 123 credit. The Kāśikā side finds nothing (the engine already reads it); the Kaumudī side finds the 6 above as real splits of the sūtra itself. It also finds 1.3.82 (a केचित् view), several “उत्तरार्थः” remarks (7.3.13, 8.3.67 — correctly not credited), and splits of another sūtra (3.3.94, 4.1.92 — derivation only).
