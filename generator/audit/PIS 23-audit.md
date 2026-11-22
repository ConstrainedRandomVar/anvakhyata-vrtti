# Audit of PIS 23 (प्रत्ययग्रहणे यस्मात् स विहितस्तदादेस्तदन्तस्य ग्रहणम्) firings

Generated 2026-11-20. Input: `audit/PIS 23-firings.json` (562 ✔ firings, 100 groups). Machine-readable result: `audit/PIS 23-audit.json`.
Every quotation was checked by script to be a verbatim substring of `~/Projects/ashtadhyayi-data/sutraani/<file>.txt` (id = adhyāya+pāda+3-digit sūtra) or `paribhashendushekhar/data.txt` (id = paribhāṣā number; paribhāṣā line + text). Digitisation slips are quoted as they stand (e.g. `प्रत्यग्रहणे`, `तद्न्तविधिं`, `गृह्रते`, `भविति`).

## Totals

| | licensed | not licensed | unsure |
|---|---|---|---|
| by firing (562) | 362 | 175 | 25 |

By group (100): mixed 18 · not licensed 14 · licensed 58 · unsure 10.

Not-licensed by `should_be`: **none** 173 · **1.1.72** 1 · **PIS 28** 1.

Not-licensed by reason: VIDHEYA 65 · NOT_IN_FORCE 35 · CASE_OF_SUTRA_WORD 23 · HOMONYM 14 · NO_TADANTA_IN_EFFECT 13 · STHANI_SUFFIX 10 · NIPATANA 3 · BAHUVRIHI 3 · COMMENTATOR_DENIES 3 · OTHER 1 · ANARTHAKA 1 · OWN_ANTA 1 · PIS25 1 · WRONG_PARIBHASHA 1 · SUTRA_FORM 1.

The 204 credits re-pointed today from 1.1.72 ("not 1.1.72 — paribhāṣā audit") were audited like the rest; of the 90 members whose own trigger carries that marker (26 groups, mostly G9, G10, G14, G16, G18–G20, G23, G26, G30, G36), 82 are licensed, 4 not licensed (4.4.127, 6.3.66, 6.2.51, 4.4.125) and 4 unsure (6.3.14, 6.3.122, 6.3.72, 1.4.61).

### Reason codes

| code | meaning |
|---|---|
| VIDHEYA | the suffix is the one prescribed, or part of a ready-made (nipātana) form — 'the forms end in X' describes output, not a pratyaya-grahaṇa |
| NOT_IN_FORCE | the carried suffix word is not connected in this rule (commentator says so, or the rule cannot use it) |
| NO_TADANTA_IN_EFFECT | the rule forms nothing the suffix could qualify (adhikāra, pūrvanipāta, gender, a later ādeśa); our vṛtti has no X-अन्त |
| NIPATANA | whole compounds listed ready-made |
| CASE_OF_SUTRA_WORD | the case of a sūtra word (or a samartha-vibhakti) read as a suffix |
| HOMONYM | root, pronoun, particle, ordinal, sound or noun that looks like a suffix |
| STHANI_SUFFIX | the suffix itself is changed (luk, lopa, ādeśa, its own accent) |
| BAHUVRIHI | 'X-प्रत्यये' is a bahuvrīhi qualifier, read so by the commentators |
| PIS25 | uttarapada adhikāra; the tadanta comes from another argument |
| COMMENTATOR_DENIES | the cited/relevant commentator says PIS 23 does not apply |
| SUTRA_FORM / OWN_ANTA | the tadanta comes from the sūtra's own form / its own '-अन्त' |
| ANARTHAKA | sound-sequence (इन्) → 1.1.72 + PIS 16 |
| WRONG_PARIBHASHA | a different paribhāṣā is the operative one (7.1.37 → PIS 28) |

## 1. What PIS 23 requires, from the sources

### C1

Definition: a suffix (or suffix class) named in a rule stands for the word that begins with what it was added to and ends in it. The tadādi part comes from splitting 1.4.13; the tadanta part rests on 1.1.72.

> प्रत्ययग्रहणे यस्मात्स विहितस्तदादेस्तदन्तस्य ग्रहणम्  
> — paribhashendushekhar 23

> तदन्तांशस्तु <<येन विधिः>> [[1.1.72]] इत्यनेन सिद्धः  
> — paribhashendushekhar 23

### C2

Only when suffixes alone are named, not a term covering both suffix and non-suffix items.

> प्रत्ययमात्रग्रहणे एषा न तु प्रत्ययाप्रत्ययग्रहण इति  
> — paribhashendushekhar 23

### C3

Suffix used as the nimitta (7th, 'when X follows'): only the tadādi part applies. A suffix after a 5th-case word: tadādi part, with the 5th-case word read as ending in it (6.1.69).

> यत्र प्रत्ययो निमित्तत्वेनाश्रीयते तत्र तदादीत्यन्तांशमात्रोपस्थितिरिति  
> — paribhashendushekhar 23

> एवं यत्रापि पञ्चम्यन्तात्परः प्रत्यय आश्रीयते तत्रापि तदादीत्यन्तांशोपस्थितिः, परन्तु तत्र पञ्चम्यन्तता  
> — paribhashendushekhar 23

### C4

PIS 24: a suffix that follows a 5th-case word, taken up to prescribe some other operation, gets no tadanta (8.2.42); 6.1.68 is not such a case.

> यत्र पञ्चम्यन्तात्परः प्रत्ययः कार्यान्तरविधानाय परिगृह्यते, तत्र तदन्तविधिर्नेत्यर्थः  
> — paribhashendushekhar 24

> <<हल्ङ्याब्भ्यः>> [[6.1.68]] इत्यादौ तु न दोषः, तत्र कस्मादिति नियतावध्याकाङ्क्षाया अभावेन पञ्चम्यन्तस्य प्रत्ययविशेषणत्वाभावात्  
> — paribhashendushekhar 24

### C5

PIS 25: in the uttarapada adhikāra a suffix named means only itself (jñāpaka: लेख in 6.3.50). The Bhāṣya reaches खिदन्त at 6.3.66 by a separate argument. The Nyāsa applies PIS 25 to suffixes naming the following element (घ etc.); the Kāśikā still reads ङीप्रत्ययान्त for a pūrvapada (6.3.43).

> उत्तरपदाधिकारे प्रत्ययग्रहणे न तदन्तग्रहणम्  
> — paribhashendushekhar 25

> तत्र लेखेति न घञन्तमनभिधानात्  
> — paribhashendushekhar 25

> सर्वत्रैवोत्तरपदाधिकारे प्रत्ययग्रहणे रूपग्रहणं द्रष्टव्यम्  
> — bhashya 63050

> खित्यनन्तरो ह्रस्वभावी नास्तीति कृत्वा खिदन्ते उत्तरपदे भविष्यति  
> — bhashya 63050

> घादिप्रत्ययग्रहणे प्रत्ययमात्रं गृह्रते, न तदन्तविधिरिति भावः  
> — nyaas 63050

> परो यो ङीप्रत्ययस्तदन्तस्यानेकाचो ह्रस्वो भवति  
> — kashika 63043

> But in this chapter, so far as the jurisdiction of उत्तरपदे goes, an affix does not denote a word-form ending in that affix  
> — vasu_english 63017

### C6

PIS 26: an anupasarjana strī suffix is not bound by the tadādi restriction; the tadanta reading itself stays.

> यः स्त्रीप्रत्ययः स्त्रियं प्राधान्येनाऽऽह तत्र तदादिनियमो न, यस्त्वप्राधान्येनाऽऽह तत्र तदादिनियमोऽस्त्येवेत्यर्थः  
> — paribhashendushekhar 26

### C7

PIS 27: no tadanta for a suffix named in a saṃjñā rule (jñāpaka: सुप्तिङन्तम्). Where commentators still read tadanta (1.1.23, 1.1.38, 1.2.46) they justify it by sāmarthya or by the carried अर्थवत्.

> संज्ञाविधौ प्रत्ययग्रहणे तदन्तग्रहणं नास्ति  
> — paribhashendushekhar 27

> सुप्तिङन्तम् [[1.4.14]] इत्यन्तग्रहणमस्यां ज्ञापकम्  
> — paribhashendushekhar 27

> पदसंज्ञायामन्तग्रहणमन्यत्र संज्ञाविधौ प्रत्ययग्रहणे तदन्तविधिप्रतिषेधार्थम्  
> — bhashya 14014

> अर्थवदिति वर्तते। कृत्तद्धितान्तं चैवार्थवन्न केवलाः कृतस्तद्धिता वा  
> — bhashya 14014

> यद्यपि संज्ञाविधौ प्रत्यग्रहणे तदन्तग्रहणं नास्ति तथापीह वतुडत्योः केवलयोः संज्ञाविधौ फलाऽभावादन्वर्थताबलाच्च तदन्तयोरेव संज्ञा प्रवर्तते  
> — tattvabodhini 11023

> इह यद्यपि संज्ञाविधौ प्रत्ययग्रहणे तदन्तविधिप्रतिषेधस्तथापि केवलस्य तद्धितस्य संज्ञायाः प्रयोजनाभावात् तदन्तविधिर्विज्ञायत इत्याह-तद्धितान्तः शब्द इति  
> — padamanjari 11038

### C8

PIS 28: a kṛt suffix named also covers a gati/kāraka before it — explicit at 7.1.37.

> कृद्ग्रहणे गतिकारकपूर्वस्यापि ग्रहणम्  
> — paribhashendushekhar 28

> स्पष्टं चेदं सर्वं <<समासेऽनञ्पूर्वे>> [[7.1.37]] इति सूत्रे भाष्यकैयटयोः  
> — paribhashendushekhar 28

### C9

A suffix must be NAMED as a known element: a suffix that is prescribed, or part of a ready-made (nipātana) form, is not a pratyaya-grahaṇa; a 'X-प्रत्यये' bahuvrīhi qualifies by its own meaning; when the operation changes the suffix itself (luk, ādeśa, its own accent) there is no tadanta; homonyms (roots, pronouns, particles, ordinals, sounds) are not suffixes; an upasarga is not covered by सुप्.

> वहेर्धातोः करणे यत् प्रत्ययो निपात्यते  
> — kashika 31102

> द्विदण्ड्यादयः शब्दा इच्प्रत्ययान्ताः साधवो भवन्ति  
> — kashika 54128

> तस् प्रत्ययो यतः स्वाङ्गात् तदेवमुच्यते  
> — kashika 34061

> वकारः प्रत्ययो यस्य स तथोक्तः  
> — padamanjari 62052

> क्यस्य हल उत्तरस्य विभाषा लोपो भवत्यार्धधातुके  
> — kashika 64050

> फक् फिञोर्युवप्रत्यययोः प्राग्दीव्यतीयेऽजादौ प्रत्यये विवक्षितेऽन्यतरस्यां लुग् भवति  
> — kashika 41091

> उपसर्गग्रहणं ज्ञापकमन्यत्र सुब्ग्रहणे उपसर्गग्रहणं न भवतीति  
> — padamanjari 31106

### C10

Anarthaka sequences अन्/इन्/अस्/मन् get tadanta under 1.1.72 (PIS 16), not PIS 23.

> अनिनस्मन्ग्रहणान्यर्थवता चानर्थकेन च तद्न्तविधिं प्रयोजयन्ति।  
> — bhashya 11072

> येन विधिः' [[1.1.72]] इत्यत्र भाष्ये वचनरूपेण पठितैषा  
> — paribhashendushekhar 16

## 2. Groups

| group | n | verdict | L/N/U | label |
|---|---|---|---|---|
| G1 | 102 | mixed | 80/18/4 | carried / not a sūtra word / samāsa / X: a suffix (or case ending) named |
| G2 | 57 | not licensed | 0/57/0 | carried / not a sūtra word / nipātana / X (carried): the suffix the forms are ma |
| G3 | 50 | mixed | 22/26/2 | carried / not a sūtra word / vidhi / X |
| G4 | 31 | mixed | 20/11/0 | own word, data case 5 / vidhi / X: a suffix named as the base |
| G5 | 25 | licensed | 25/0/0 | carried / not a sūtra word / svara / X: sthani |
| G6 | 24 | mixed | 5/19/0 | carried / not a sūtra word / vidhi / X (carried)): a suffix / case ending des |
| G7 | 23 | mixed | 18/5/0 | carried / not a sūtra word / vidhi / X (carried): a suffix / case ending desc |
| G8 | 18 | mixed | 11/7/0 | carried / not a sūtra word / vidhi / X (carried): a suffix named as the base |
| G9 | 14 | mixed | 13/1/0 | carried / not a sūtra word / vidhi / X: PIS 23 … … … … (not 1.1.72 — paribhāṣ |
| G10 | 11 | licensed | 11/0/0 | own word, data case 1 / svara / X: PIS 23 … … … … (not 1.1.72 — paribhāṣ |
| G11 | 9 | licensed | 9/0/0 | carried / not a sūtra word / pada / X (carried): a suffix in the 5th |
| G12 | 9 | mixed | 1/8/0 | carried / not a sūtra word / operation / X |
| G13 | 7 | mixed | 6/1/0 | own word, data case 5 / vidhi / X: a case named |
| G14 | 7 | licensed | 7/0/0 | carried / not a sūtra word / svara / X: PIS 23 … … … … (not 1.1.72 — paribhāṣ |
| G15 | 6 | mixed | 5/1/0 | own word, data case 5 / pada / X: a suffix named in the 5th |
| G16 | 6 | licensed | 6/0/0 | carried / not a sūtra word / operation / X: PIS 23 … … … … (not 1.1.72 — paribhāṣ |
| G17 | 6 | licensed | 6/0/0 | carried / not a sūtra word / svara / X: qualifier |
| G18 | 6 | licensed | 6/0/0 | own word, data case 5 / vidhi / X: PIS 23 … … … … (not 1.1.72 — paribhāṣ |
| G19 | 5 | licensed | 5/0/0 | own word, data case 7 / vidhi / X: PIS 23 … … … … (not 1.1.72 — paribhāṣ |
| G20 | 5 | licensed | 5/0/0 | carried / not a sūtra word / nipātana / X: PIS 23 … … … … (not 1.1.72 — paribhāṣ |
| G21 | 5 | licensed | 5/0/0 | own word, data case 7 / svara / X: nimitta |
| G22 | 5 | licensed | 5/0/0 | own word, data case 1 / svara / X: qualifier |
| G23 | 4 | licensed | 4/0/0 | carried / not a sūtra word / vibhakti / X: PIS 23 … … … … (not 1.1.72 — paribhāṣ |
| G24 | 4 | licensed | 4/0/0 | own word, data case 5 / svara / X: a suffix named in the 5th |
| G25 | 4 | licensed | 4/0/0 | own word, data case 6 / svara / X: a suffix named in the 6th |
| G26 | 4 | licensed | 4/0/0 | own word, data case 7 / svara / X: PIS 23 … … … … (not 1.1.72 — paribhāṣ |
| G27 | 4 | licensed | 4/0/0 | own word, data case 5 / svara / X: a case named in the 5th |
| G28 | 4 | licensed | 4/0/0 | own word, data case 1 / svara / X: sthani |
| G29 | 4 | licensed | 4/0/0 | own word, data case 6 / operation / X: describes the pūrvapada (uttarapada s |
| G30 | 4 | licensed | 4/0/0 | carried / not a sūtra word / ādeśa / X: PIS 23 … … … … (not 1.1.72 — paribhāṣ |
| G31 | 3 | mixed | 1/1/1 | own word, data case 5 / ādeśa / X: a suffix (…) among the members in the |
| G32 | 3 | mixed | 2/1/0 | own word, data case 6 / vidhi / X: a suffix named as the base |
| G33 | 3 | licensed | 3/0/0 | carried / not a sūtra word / svara / X: nimitta |
| G34 | 3 | mixed | 0/1/2 | own word, data case 7 / operation / X: PIS 23 … … … … (not 1.1.72 — paribhāṣ |
| G35 | 3 | mixed | 0/1/2 | own word, data case 5 / operation / X: a suffix in the 5th describing the aṅ |
| G36 | 3 | licensed | 3/0/0 | own word, data case 5 / ādeśa / X: PIS 23 … … … … (not 1.1.72 — paribhāṣ |
| G37 | 2 | unsure | 0/0/2 | own word, data case 1 / saṃjñā / X: samjni |
| G38 | 2 | licensed | 2/0/0 | own word, data case 6 / operation / X: qualifier |
| G39 | 2 | mixed | 1/0/1 | carried / not a sūtra word / saṃjñā / X: PIS 23 … … … … (not 1.1.72 — paribhāṣ |
| G40 | 2 | licensed | 2/0/0 | own word, data case 6 / vibhakti / X: a suffix named in the 6th |
| G41 | 2 | licensed | 2/0/0 | own word, data case 5 / operation / X: 5th case |
| G42 | 2 | not licensed | 0/2/0 | own word, data case 7 / vidhi / X: upapada |
| G43 | 2 | licensed | 2/0/0 | carried / not a sūtra word / vidhi / X: prakriti |
| G44 | 2 | licensed | 2/0/0 | own word, data case 6 / svara / X: 6th case |
| G45 | 2 | mixed | 1/1/0 | own word, data case 6 / svara / X: sthani |
| G46 | 2 | mixed | 1/1/0 | own word, data case 0 / svara / X: PIS 23 … … … … (not 1.1.72 — paribhāṣ |
| G47 | 2 | licensed | 2/0/0 | carried / not a sūtra word / svara / X (carried): a case named in the 5th |
| G48 | 2 | licensed | 2/0/0 | own word, data case 5 / svara / X: PIS 23 … … … … (not 1.1.72 — paribhāṣ |
| G49 | 2 | unsure | 0/0/2 | own word, data case 7 / operation / X: qualifier |
| G50 | 2 | not licensed | 0/2/0 | named by a commentator / ādeśa / X (English) |
| G51 | 2 | mixed | 1/0/1 | carried / not a sūtra word / āgama / X: describes the aṅga |
| G52 | 2 | licensed | 2/0/0 | own word, data case 6 / svara / X: PIS 23 … … … … (not 1.1.72 — paribhāṣ |
| G53 | 2 | licensed | 2/0/0 | carried / not a sūtra word / ādeśa / X: a suffix qualifying … |
| G54 | 1 | unsure | 0/0/1 | own word, data case 1 / saṃjñā / X: qualifier |
| G55 | 1 | unsure | 0/0/1 | own word, data case 1 / saṃjñā / X: suffixes named |
| G56 | 1 | not licensed | 0/1/0 | carried / not a sūtra word / saṃjñā / X: samjni |
| G57 | 1 | not licensed | 0/1/0 | own word, data case 1 / atideśa / X: sthani |
| G58 | 1 | licensed | 1/0/0 | own word, data case 5 / atideśa / X: 5th case |
| G59 | 1 | licensed | 1/0/0 | own word, data case 1 / atideśa / X: PIS 23 … … … … (not 1.1.72 — paribhāṣ |
| G60 | 1 | licensed | 1/0/0 | carried / not a sūtra word / adhikāra / X: sthani |
| G61 | 1 | licensed | 1/0/0 | carried / not a sūtra word / saṃjñā / X (carried) is a suffix named: it stands |
| G62 | 1 | licensed | 1/0/0 | own word, data case 5 / vibhakti / X: PIS 23 … … … … (not 1.1.72 — paribhāṣ |
| G63 | 1 | licensed | 1/0/0 | own word, data case 3 / vibhakti / X: nimitta |
| G64 | 1 | licensed | 1/0/0 | carried / not a sūtra word / vibhakti / X (carried): a suffix in the 6th |
| G65 | 1 | licensed | 1/0/0 | own word, data case 6 / vibhakti / X: PIS 23 … … … … (not 1.1.72 — paribhāṣ |
| G66 | 1 | not licensed | 0/1/0 | carried / not a sūtra word / vidhi / X (SK: …) |
| G67 | 1 | licensed | 1/0/0 | own word, data case 5 / vidhi / X: prakriti |
| G68 | 1 | licensed | 1/0/0 | own word, data case 5 / vidhi / X (carried): a suffix / case ending desc |
| G69 | 1 | licensed | 1/0/0 | own word, data case 5 / vidhi / X: qualifier |
| G70 | 1 | licensed | 1/0/0 | carried / not a sūtra word / vidhi / X: qualifier |
| G71 | 1 | not licensed | 0/1/0 | own word, data case 1 / nipātana / X: nipatana |
| G72 | 1 | licensed | 1/0/0 | carried / not a sūtra word / adhikāra / X: PIS 23 … … … … (not 1.1.72 — paribhāṣ |
| G73 | 1 | licensed | 1/0/0 | named by a commentator / vidhi / X |
| G74 | 1 | licensed | 1/0/0 | own word, data case 7 / vidhi / X: qualifier |
| G75 | 1 | not licensed | 0/1/0 | own word, data case 1 / ādeśa / X: PIS 23 … … … … (not 1.1.72 — paribhāṣ |
| G76 | 1 | licensed | 1/0/0 | own word, data case 5 / āgama / X: 5th case |
| G77 | 1 | unsure | 0/0/1 | own word, data case 6 / āgama / X: 6th case |
| G78 | 1 | unsure | 0/0/1 | own word, data case 1 / vidhi / X: prakriti |
| G79 | 1 | not licensed | 0/1/0 | carried / not a sūtra word / vibhakti / X (PV: …) |
| G80 | 1 | not licensed | 0/1/0 | carried / not a sūtra word / vidhi / X: pratyaya |
| G81 | 1 | not licensed | 0/1/0 | carried / not a sūtra word / vidhi / X: a suffix named stands for the word en |
| G82 | 1 | licensed | 1/0/0 | own word, data case 6 / operation / X: suffixes named in the 6th qualify the |
| G83 | 1 | licensed | 1/0/0 | own word, data case 6 / operation / X: 6th case |
| G84 | 1 | licensed | 1/0/0 | own word, data case 5 / operation / X: a suffix in the 5th describing the wo |
| G85 | 1 | not licensed | 0/1/0 | own word, data case 7 / svara / X: qualifier |
| G86 | 1 | licensed | 1/0/0 | own word, data case 6 / svara / X: qualifier |
| G87 | 1 | not licensed | 0/1/0 | named by a commentator / operation / X (English) |
| G88 | 1 | licensed | 1/0/0 | own word, data case 6 / atideśa / X: qualifier |
| G89 | 1 | unsure | 0/0/1 | own word, data case 7 / ādeśa / X: PIS 23 … … … … (not 1.1.72 — paribhāṣ |
| G90 | 1 | licensed | 1/0/0 | carried / not a sūtra word / āgama / X: PIS 23 … … … … (not 1.1.72 — paribhāṣ |
| G91 | 1 | licensed | 1/0/0 | own word, data case 6 / ādeśa / X: PIS 23 … … … … (not 1.1.72 — paribhāṣ |
| G92 | 1 | not licensed | 0/1/0 | carried / not a sūtra word / operation / X: a suffix (or case ending) named |
| G93 | 1 | licensed | 1/0/0 | own word, data case 5 / āgama / X: a suffix in the 5th describing the aṅ |
| G94 | 1 | unsure | 0/0/1 | carried / not a sūtra word / āgama / X |
| G95 | 1 | unsure | 0/0/1 | own word, data case 6 / āgama / X: describes the aṅga |
| G96 | 1 | licensed | 1/0/0 | carried / not a sūtra word / ādeśa / X: 6th case |
| G97 | 1 | licensed | 1/0/0 | own word, data case 6 / nipātana / X: PIS 23 … … … … (not 1.1.72 — paribhāṣ |
| G98 | 1 | unsure | 0/0/1 | own word, data case 5 / ādeśa / X: a suffix named as what precedes |
| G99 | 1 | licensed | 1/0/0 | own word, data case 7 / ādeśa / X: qualifier |
| G100 | 1 | licensed | 1/0/0 | own word, data case 5 / ṇatva / X: PIS 23 … … … … (not 1.1.72 — paribhāṣ |

### Group notes

**G1** (mixed). How checked: All 102 members read (sūtra, our vṛtti, Kāśikā first line); scripted check that the vṛtti contains the X-अन्त stem (30 do not); Kāśikā/SK/BM read for every exception and for 2.1.4 (the anuvṛtti source). सुप् carried from 2.1.2/2.1.4 into samāsa-vidhi rules is read as सुबन्त — Bālamanoramā on 2.1.4 cites pratyaya-grahaṇa explicitly. Formally samāsa rules are saṃjñā rules (PIS 27), but no commentator raises that here. Exceptions: rules that form no compound (adhikāra, nipātana lists, pūrvanipāta, gender), the द्वितीया that does not connect with avyayas (2.1.25/27), and the upapada/gati split (2.2.18–22). Also: in many samāsa rules a second suffix word (क्तेन, निष्ठा, पञ्चम्या, षष्ठ्या …) is read tadanta but not credited (see missed).

> प्रत्ययग्रहणपरिभाषया तदन्तग्रहणम् — balamanorama 21004

> द्वितीयान्तं श्रितादिभिः सह समस्यते — kashika 21004

**G2** (not licensed). How checked: All 57 members read; nipātana/vidhi status checked in sūtra + vṛtti; Kāśikā for samples and for the factual errors. Whole group: the suffix is prescribed or part of a ready-made form — an output description, not a pratyaya-grahaṇa.

> प्रत्ययग्रहणे यस्मात्स विहितस्तदादेस्तदन्तस्य ग्रहणम् — paribhashendushekhar 23

**G3** (mixed). How checked: All 50 read; Kāśikā checked for every सुप् member (whether सुपि/सुबन्त is carried); the 22 'base word' members checked against their vṛtti. Kāśikā on 3.2.4: सुपि and कर्मणि both carry on; transitive roots take कर्मणि. The 22 'base word in the X case' credits are a separate defect class (sūtra word's own case read as a suffix).

> सुबन्त उपपदे तिष्ठतेः कप्रत्ययो भवति — kashika 32004

> तत्र सकर्मकेषु धातुषु कर्मणीत्येतदुपतिष्ठते, अन्यत्र सुपीति — kashika 32004

> भवतेर्धातोः सुबन्त उपपदेऽनुपसर्गे भावे क्यप् प्रत्ययो भवति — kashika 31107

> अञ्चतेः सुबन्तमात्र उपपदे क्विन् प्रत्ययो भवति — kashika 32059

**G4** (mixed). How checked: All 31 read; Kāśikā checked for each.

> टिदादिभ्यः प्रातिपदिकेभ्यः स्त्रियां ङीप् प्रत्ययो भवति — kashika 41015

**G5** (licensed). How checked: All 25 read; Kāśikā on 8.1.28 and 8.1.30 checked. तिङ् carried from 8.1.28; the Kāśikā reads तिङन्तं (pada).

> तिङन्तं पदमतिङन्तात् पदात् परमनुदात्तं भवति — kashika 81028

> इत्येतैर्निपातैर्युक्तं तिङन्तं नानुदात्तं भवति — kashika 81030

**G6** (mixed). How checked: All 24 read; Kāśikā of 5.3.56–5.3.96 searched for तिङ्/तिङन्त. Carried तिङः is in force only where the Kāśikā gives तिङन्त examples (5.3.73, 74, 76, 77, 85).

> अज्ञातत्वोपाधिकेऽर्थे वर्तमानात् प्रातिपदिकात् तिङन्तात् च स्वार्थे यथाविहितं प्रत्ययो भवति — kashika 53073

> विश्वके पचतकि — kashika 53074

> तस्यां गम्यमानायां सुबन्तात् तिङन्तात् च यथाविहितं प्रत्ययो भवति — kashika 53076

> एहकि। अद्धकि। — kashika 53077

> पचतकि। जल्पतकि॥ — kashika 53085

> <<तिङश्च>> [[५.३.५६]] इति प्रकृतमत्र संबध्यते। — kashika 53071

**G7** (mixed). How checked: All 23 read; Kāśikā/Padamañjarī checked for each.

> किंसर्वनामबहुभ्यः सप्तम्यन्तेभ्यः त्रल् प्रत्ययो भवति — kashika 53010

> सप्तम्या इति काल इति च वर्तते — kashika 53022

> प्रोक्तग्रहणमनुवर्तते — kashika 42066

> <<तिङश्च>> [[५.३.५६]] इति प्रकृतमत्र संबध्यते। — kashika 53071

**G8** (mixed). How checked: All 18 read; Kāśikā/Nyāsa checked. 3.1.13: Nyāsa confirms अच्वेः carries (abhūtatadbhāva).

> `अच्वेरित्यनुवृत्तेरभूततद्भावे क्यष्विज्ञायते` इति — nyaas 31013

> प्रोक्तग्रहणमनुवर्तते — kashika 42066

> <<तिङश्च>> [[५.३.५६]] इति प्रकृतमत्र संबध्यते। — kashika 53071

**G9** (mixed). How checked: All 14 read; Kāśikā checked. Licensed, but effect text wrong: 5.3.59 effect says 'तवर्गान्तात्' (तु = तृन्/तृच्, our vṛtti says तृन्तात्); 5.4.11 effect says 'तिङन्तात्' (the tadanta is of घ: Kāśikā 'तदन्तात्').

> तुरिति तृन्तृचोः सामान्येन ग्रहणम् — kashika 53059

> किम एकारान्तात् तिङन्तादव्ययेभ्यश्च यो विहितो घः स किमेत्तिङव्ययघः, तदन्तात् प्रातिपदिकादद्रव्यप्रकर्ष आमुप्रत्ययो भवति — kashika 54011

**G10** (licensed). How checked: All 11 read; Kāśikā checked for 6.2.43-type and 8.1 rules. 6.2 is outside the uttarapada adhikāra (Vasu on 6.3.17 gives 6.2.144 as a tadanta case).

> चतुर्थ्यन्तं पूर्वपदं तदर्थ उत्तरपदे — kashika 62043

> Thus the word थ, अथ &c in [[6.2.144]] means a word ending in थ affix &c. — vasu_english 63017

**G12** (mixed). How checked: All 9 read; Kāśikā checked. Only 6.4.131 is a suffix qualifying the aṅga; the rest are homonyms or the suffix itself is changed.

> वस्वन्तस्य भस्य संप्रसारणं भवति — kashika 64131

**G13** (mixed). How checked: All 7 read; Kāśikā checked.

> किंसर्वनामबहुभ्यः सप्तम्यन्तेभ्यः त्रल् प्रत्ययो भवति — kashika 53010

**G14** (licensed). How checked: All 7 read; Kāśikā checked. 6.1.197: suffix in the 7th as nimitta — the Śekhara says only the tadādi part applies, which is what gives the word's first vowel; licensed.

> यत्र प्रत्ययो निमित्तत्वेनाश्रीयते तत्र तदादीत्यन्तांशमात्रोपस्थितिरिति — paribhashendushekhar 23

> ञिति निति च नित्यमादिरुदात्तो भवति — kashika 61197

**G15** (mixed). How checked: All 6 read (sūtra, vṛtti, trigger); Kāśikā checked.

**G16** (licensed). How checked: All 6 read; Kāśikā checked. 6.3.44 is in the uttarapada adhikāra but ङी qualifies the pūrvapada; the Kāśikā reads ङ्यन्त (cf. 6.3.43).

> अङी च या नदी,ङ्यन्तं च यदेकाच् — kashika 63044

> परो यो ङीप्रत्ययस्तदन्तस्यानेकाचो ह्रस्वो भवति — kashika 63043

**G29** (licensed). How checked: All 4 read; Kāśikā checked. Uttarapada adhikāra, but the suffix names the pūrvapada; PIS 25 targets suffixes that name the following member (Nyāsa on 6.3.50), and the Kāśikā reads ङीप्रत्ययान्त.

> परो यो ङीप्रत्ययस्तदन्तस्यानेकाचो ह्रस्वो भवति — kashika 63043

> घादिप्रत्ययग्रहणे प्रत्ययमात्रं गृह्रते, न तदन्तविधिरिति भावः — nyaas 63050

**G31** (mixed). How checked: All 3 read (sūtra, vṛtti, trigger); Kāśikā checked.

**G32** (mixed). How checked: All 3 read (sūtra, vṛtti, trigger); Kāśikā checked.

**G34** (mixed). How checked: All 3 read (sūtra, vṛtti, trigger); Kāśikā checked.

**G35** (mixed). How checked: All 3 read (sūtra, vṛtti, trigger); Kāśikā checked.

**G37** (unsure). How checked: All 2 read (sūtra, vṛtti, trigger); Kāśikā checked.

**G39** (mixed). How checked: All 2 read (sūtra, vṛtti, trigger); Kāśikā checked.

**G42** (not licensed). How checked: All 2 read (sūtra, vṛtti, trigger); Kāśikā checked.

**G45** (mixed). How checked: All 2 read (sūtra, vṛtti, trigger); Kāśikā checked.

**G46** (mixed). How checked: All 2 read (sūtra, vṛtti, trigger); Kāśikā checked.

**G49** (unsure). How checked: All 2 read (sūtra, vṛtti, trigger); Kāśikā checked.

**G50** (not licensed). How checked: All 2 read (sūtra, vṛtti, trigger); Kāśikā checked.

**G51** (mixed). How checked: Both read; Kāśikā checked.

> अभ्यस्तादङ्गादुत्तरो यः शतृप्रत्ययस्तदन्तस्य नपुंसकस्य वा नुमागमो भवति — kashika 71079

**G54** (unsure). How checked: All 1 read (sūtra, vṛtti, trigger); Kāśikā checked.

**G55** (unsure). How checked: All 1 read (sūtra, vṛtti, trigger); Kāśikā checked.

**G56** (not licensed). How checked: All 1 read (sūtra, vṛtti, trigger); Kāśikā checked.

**G57** (not licensed). How checked: All 1 read (sūtra, vṛtti, trigger); Kāśikā checked.

**G66** (not licensed). How checked: All 1 read (sūtra, vṛtti, trigger); Kāśikā checked.

**G71** (not licensed). How checked: All 1 read (sūtra, vṛtti, trigger); Kāśikā checked.

**G75** (not licensed). How checked: All 1 read (sūtra, vṛtti, trigger); Kāśikā checked.

**G77** (unsure). How checked: All 1 read (sūtra, vṛtti, trigger); Kāśikā checked.

**G78** (unsure). How checked: All 1 read (sūtra, vṛtti, trigger); Kāśikā checked.

**G79** (not licensed). How checked: All 1 read (sūtra, vṛtti, trigger); Kāśikā checked.

**G80** (not licensed). How checked: All 1 read (sūtra, vṛtti, trigger); Kāśikā checked.

**G81** (not licensed). How checked: All 1 read (sūtra, vṛtti, trigger); Kāśikā checked.

**G85** (not licensed). How checked: All 1 read (sūtra, vṛtti, trigger); Kāśikā checked.

**G87** (not licensed). How checked: All 1 read (sūtra, vṛtti, trigger); Kāśikā checked.

**G89** (unsure). How checked: All 1 read (sūtra, vṛtti, trigger); Kāśikā checked.

**G92** (not licensed). How checked: All 1 read (sūtra, vṛtti, trigger); Kāśikā checked.

**G94** (unsure). How checked: All 1 read (sūtra, vṛtti, trigger); Kāśikā checked.

**G95** (unsure). How checked: All 1 read (sūtra, vṛtti, trigger); Kāśikā checked.

**G98** (unsure). How checked: All 1 read (sūtra, vṛtti, trigger); Kāśikā checked.

## 3. Every not-licensed credit

### VIDHEYA (65)

- G2 **3.1.23** `यङ्` → should_be **none**: The suffix is the thing prescribed (or part of the ready-made form). It is not named as a known element whose words the rule refers to, so 'prathyaya-grahaṇa' does not arise; 'the forms end in X' only describes the output.
  > प्रत्ययग्रहणे यस्मात्स विहितस्तदादेस्तदन्तस्य ग्रहणम् — paribhashendushekhar 23
  > वहेर्धातोः करणे यत् प्रत्ययो निपात्यते — kashika 31102
  > नित्यं यङ् प्रत्ययो भवति — kashika 31023
- G2 **3.1.101** `यत्` → should_be **none** (same reason)
- G2 **3.1.102** `यत्` → should_be **none** (same reason)
- G2 **3.1.103** `यत्` → should_be **none** (same reason)
- G2 **3.1.104** `यत्` → should_be **none** (same reason)
- G2 **3.1.105** `यत्` → should_be **none** (same reason)
- G2 **3.1.114** `क्यप्` → should_be **none** (same reason)
- G2 **3.1.115** `क्यप्` → should_be **none** (same reason)
- G2 **3.1.116** `क्यप्` → should_be **none** (same reason)
- G2 **3.1.117** `क्यप्` → should_be **none** (same reason)
- G2 **3.1.121** `क्यप्` → should_be **none** (same reason)
- G2 **3.1.127** `ण्यत्` → should_be **none** (same reason)
- G2 **3.1.128** `ण्यत्` → should_be **none** (same reason)
- G2 **3.1.129** `ण्यत्` → should_be **none** (same reason)
- G2 **3.1.130** `ण्यत्` → should_be **none** (same reason)
- G2 **3.1.131** `ण्यत्` → should_be **none** (same reason)
- G2 **3.2.26** `इन्` → should_be **none** (same reason)
- G2 **3.2.37** `खश्` → should_be **none** (same reason)
- G2 **3.2.109** `क्वसु` → should_be **none** (same reason)
- G2 **3.2.164** `क्वरप्` → should_be **none** (same reason)
- G2 **3.2.169** `उ` → should_be **none** (same reason)
- G2 **3.3.68** `अप्` → should_be **none** (same reason)
- G2 **3.3.70** `अप्` → should_be **none** (same reason)
- G2 **3.3.78** `अप्` → should_be **none** (same reason)
- G2 **3.3.79** `अप्` → should_be **none** (same reason)
- G2 **3.3.80** `अप्` → should_be **none** (same reason)
- G2 **3.3.81** `अप्` → should_be **none** (same reason)
- G2 **3.3.85** `अप्` → should_be **none** (same reason)
- G2 **3.3.86** `अप्` → should_be **none** (same reason)
- G2 **3.3.122** `घञ्` → should_be **none** (same reason)
- G2 **3.3.123** `घञ्` → should_be **none** (same reason)
- G2 **3.3.124** `घञ्` → should_be **none** (same reason)
- G2 **3.4.46** `णमुल्` → should_be **none** (same reason)
- G2 **4.1.46** `ङीष्` → should_be **none** (same reason)
- G2 **4.1.62** `ङीष्` → should_be **none** (same reason)
- G2 **5.2.14** `ख` → should_be **none** (same reason)
- G2 **5.2.20** `खञ्` → should_be **none** (same reason)
- G2 **5.2.22** `खञ्` → should_be **none** (same reason)
- G2 **5.2.23** `खञ्` → should_be **none** (same reason)
- G2 **5.2.71** `कन्` → should_be **none** (same reason)
- G2 **5.2.73** `कन्` → should_be **none** (same reason)
- G2 **5.2.74** `कन्` → should_be **none** (same reason)
- G2 **5.2.80** `कन्` → should_be **none** (same reason)
- G2 **5.2.89** `इनि` → should_be **none** (same reason)
- G2 **5.2.90** `इनि` → should_be **none** (same reason)
- G2 **5.2.105** `अण्` → should_be **none** (same reason)
- G2 **5.2.114** `मतुप्` → should_be **none** (same reason)
- G2 **5.2.126** `मतुप्` → should_be **none** (same reason)
- G2 **5.4.77** `अच्` → should_be **none** (same reason)
- G2 **5.4.83** `अच्` → should_be **none** (same reason)
- G2 **5.4.84** `अच्` → should_be **none** (same reason)
- G2 **5.4.120** `अच्` → should_be **none** (same reason)
- G2 **5.4.123** `असिच्` → should_be **none** (same reason)
- G2 **5.4.126** `अनिच्` → should_be **none** (same reason)
- G2 **5.4.160** `कप्` → should_be **none** (same reason)
- G2 **7.1.48** `क्त्वा` → should_be **none** (same reason)
- G2 **8.2.13** `मतुप्` → should_be **none** (same reason)
- G4 **3.2.56** `ख्युन्` → should_be **none**: ख्युन् is the suffix prescribed, not a base.
  > करोतेर्धातोः करणे कारके ख्युन् प्रत्ययो भवति — kashika 32056
- G4 **3.3.114** `क्तः` → should_be **none**: क्तः is the suffix prescribed, not a base.
  > नपुंसकलिङ्गे भावे धातोः क्तः प्रत्ययो भवति — kashika 33114
- G4 **4.3.67** `ठञ्` → should_be **none**: ठञ् is the suffix prescribed, not a base.
  > भवव्याख्यानयोष्ठञ् प्रत्ययो भवति — kashika 43067
- G4 **4.3.82** `मयट्` → should_be **none**: मयट् is the suffix prescribed, not a base.
  > हेतुभ्यो मनुष्येभ्यश्च मयट् प्रत्ययो भवति — kashika 43082
- G9 **4.4.127** `मतुबन्तात् → मूर्धन् ending in मतुप्` → should_be **none**: मतुप् is the suffix prescribed after मूर्धन्; the base is not 'मतुबन्त'.
  > तास्वभिधेयासु मूर्ध्नो मतुप् प्रत्ययो भवति — kashika 44127
- G71 **3.4.68** `भव्य-गेय-प्रवचनीय-उपस्थानीय-जन्य-आप्लाव्य-आपात्याः` → should_be **none**: Ready-made kṛtya forms whose meaning is allotted; no suffix is named as a referent.
  > भव्यादयः शब्दाः कर्तरि वा निपात्यन्ते — kashika 34068
- G80 **5.4.125** `अनिच्` → should_be **none**: जम्भा is a ready-made form (nipātana); अनिच् is part of it, not a referent.
  > जम्भेति कृतसमासान्तमुत्तरपदं निपात्यते — kashika 54125
- G81 **5.4.128** `the nipātana forms end in the suffix इच्` → should_be **none**: The द्विदण्डि forms are declared correct as इच्-forms; no referent.
  > द्विदण्ड्यादयः शब्दा इच्प्रत्ययान्ताः साधवो भवन्ति — kashika 54128

### NOT_IN_FORCE (35)

- G1 **2.1.25** `द्वितीयान्तम्` → should_be **none**: The carried द्वितीया does not connect with स्वयम् (an avyaya); the Kāśikā and SK say so. The real tadanta words here are सुप् (सुबन्तम्) and क्तेन (क्तान्तेन) — see missed.
  > तस्य द्वितीयया सह संबन्धो नोपपद्यत इति द्वितीयाग्रहणमुत्तरार्थमनुवर्त्तते — kashika 21025
  > द्वितीया - <{SK686}> इति न संबद्ध्यते अयोग्यत्वात् — kaumudi 21025
- G1 **2.1.27** `द्वितीयान्तम्` → should_be **none**: The carried द्वितीया does not connect with सामि (an avyaya meaning 'half'). Credit the सुप्/क्त tadanta instead.
  > तस्यासत्त्ववाचित्वाद् द्वितीयया नास्ति संबन्धः — kashika 21027
- G1 **2.2.18** `सुबन्ताः` → should_be **none**: The Kāśikā says सुप् and सुपा are not connected in 2.2.18–19 (gati/kāraka/upapada compound with a kṛt before the case ending is added); SK also drops सुपा. Our vṛtti's 'समर्थेन सुबन्तेन सह' contradicts both.
  > ज्ञापयत्येतयोर्योगयोः सुप् सुपेति न संबध्यत इति — kashika 22019
  > गतिकारकोपपदानां कृद्भिः सह समासवचनं प्राक् सुबुत्पत्तेः — kashika 22019
  > सुपेति च निवृत्तम् — kaumudi 22019
- G3 **3.2.28** `सुप् is a suffix group` → should_be **none**: एज् (causative) is transitive, so per the Kāśikā on 3.2.4 'कर्मणि', not 'सुपि', applies; the Kāśikā and our vṛtti have कर्मण्युपपदे.
  > तत्र सकर्मकेषु धातुषु कर्मणीत्येतदुपतिष्ठते, अन्यत्र सुपीति — kashika 32004
  > कर्मण्युपपदे खश् प्रत्ययो भवति — kashika 32028
- G3 **3.2.72** `सुप् is a suffix group` → should_be **none**: The upapada is the upasarga अव / उप, and the Padamañjarī says an upasarga is not covered by a सुप्-grahaṇa.
  > उपसर्गग्रहणं ज्ञापकमन्यत्र सुब्ग्रहणे उपसर्गग्रहणं न भवतीति — padamanjari 31106
  > अव उपपदे यजेर्धातोर्ण्विन् प्रत्ययो भवति — kashika 32072
- G3 **3.2.73** `सुप् is a suffix group` → should_be **none** (same reason)
- G3 **3.2.76** `सुप् is a suffix group` → should_be **none**: क्विप् is prescribed after every root, with or without an upapada; no सुबन्त upapada is required.
  > सर्वधातुभ्यः सोपपदेभ्यो निरुपपदेभ्यश्च — kashika 32076
- G6 **5.3.72** `तिङः` → should_be **none**: The carried तिङः is not in force here: the Kāśikā gives only prātipadika bases (names, specific words, lopa/ādeśa rules), and our vṛtti has no तिङन्त. Contrast 5.3.73/74/76/77/85, where the Kāśikā gives तिङन्त examples.
  > कुत्सितत्वोपाधिकेऽर्थे वर्तमानात् प्रातिपदिकात् कन् प्रत्ययो भवति — kashika 53075
  > ह्रस्वत्वविशिष्टेऽर्थे वर्तमानात् प्रातिपदिकाद् यथाविहितं प्रत्ययो भवति — kashika 53086
  > तस्मिन् वर्तमानात् प्रातिपदिकात् कन् प्रत्ययो भवति — kashika 53095
- G6 **5.3.75** `तिङः` → should_be **none** (same reason)
- G6 **5.3.78** `तिङः` → should_be **none** (same reason)
- G6 **5.3.79** `तिङः` → should_be **none** (same reason)
- G6 **5.3.80** `तिङः` → should_be **none** (same reason)
- G6 **5.3.81** `तिङः` → should_be **none** (same reason)
- G6 **5.3.82** `तिङः` → should_be **none** (same reason)
- G6 **5.3.83** `तिङः` → should_be **none** (same reason)
- G6 **5.3.84** `तिङः` → should_be **none** (same reason)
- G6 **5.3.86** `तिङः` → should_be **none** (same reason)
- G6 **5.3.87** `तिङः` → should_be **none** (same reason)
- G6 **5.3.88** `तिङः` → should_be **none** (same reason)
- G6 **5.3.89** `तिङः` → should_be **none** (same reason)
- G6 **5.3.90** `तिङः` → should_be **none** (same reason)
- G6 **5.3.91** `तिङः` → should_be **none** (same reason)
- G6 **5.3.92** `तिङः` → should_be **none** (same reason)
- G6 **5.3.93** `तिङः` → should_be **none** (same reason)
- G6 **5.3.94** `तिङः` → should_be **none** (same reason)
- G6 **5.3.95** `तिङः` → should_be **none** (same reason)
- G7 **5.3.14** `सप्तम्याः` → should_be **none**: The rule is for the OTHER case endings (इतराभ्यः = not 5th/7th), so the carried सप्तम्याः is excluded, not read. The real vibhakti-grahaṇa is इतराभ्यः.
  > इतराभ्यो विभक्तिभ्यस्तसिलादयो दृश्यन्ते — kashika 53014
- G7 **5.3.58** `तिङः` → should_be **none**: Niyama: इष्ठन्/ईयसुन् only from guṇavacana words; tiṅanta is excluded, not read. Our vṛtti has no तिङन्त.
  > गुणवचनादेव भवतस्तौ, नान्यस्मादिति — kashika 53058
- G7 **5.3.69** `तिङः` → should_be **none**: Padamañjarī: सुपः is carried here precisely to stop तिङ्.
  > अत्रापि तिङ्निवृत्यर्थम्'सुपः' इत्यनुवर्तते इति दर्शयति। — padamanjari 53069
- G7 **5.3.70** `तिङः` → should_be **none**: Kāśikā: क is not wanted after a tiṅanta (अकच् is); the carried तिङश्च connects only with 5.3.71.
  > तिङन्तादयं प्रत्ययो नेष्यते, अकजिष्यते। — kashika 53070
  > इत्यनुवृत्तमुत्तरसूत्रेणैव संबन्धनीयम् — kashika 53070
- G8 **4.2.65** `प्रोक्तात्` → should_be **none**: Kāśikā: the rule is for sūtra names that are NOT prokta-derivatives, so प्रोक्तात् is not in force.
  > अप्रोक्तार्थ आरम्भः — kashika 42065
- G8 **5.3.58** `तिङः` → should_be **none** (same reason)
- G8 **5.3.69** `तिङः` → should_be **none** (same reason)
- G8 **5.3.70** `तिङः` → should_be **none** (same reason)
- G8 **5.4.16** `इनुणः` → should_be **none**: विसारिन् is a णिनि form, not इनुण्; the Kāśikā carries nothing; our vṛtti has no इनुणन्त.
  > विसारिन्शब्दात् स्वार्थेऽण् प्रत्ययो भवति मत्स्येऽभिधेये — kashika 54016

### CASE_OF_SUTRA_WORD (23)

- G3 **5.3.72** `the base word in the षष्ठी` → should_be **none**: The 'base word in the X case' is the grammatical case of a sūtra word (or a samartha-vibhakti), not a suffix named in the rule. In several the case is wrong (5.4.21 is prathamā-samartha; 5.3.72/5.4.131 have कस्य/ऊधसः as sthānin). The vṛtti does not use the claimed X-अन्त.
  > तद्वानिति निर्देशादेव समर्थविभक्तिः — kashika 44125
- G3 **5.3.82** `the base word in the षष्ठी` → should_be **none** (same reason)
- G3 **5.3.92** `the base word in the पञ्चमी` → should_be **none** (same reason)
- G3 **5.3.93** `the base word in the षष्ठी` → should_be **none** (same reason)
- G3 **5.3.113** `the base word in the षष्ठी` → should_be **none** (same reason)
- G3 **5.4.1** `the base word in the षष्ठी` → should_be **none** (same reason)
- G3 **5.4.12** `the base word in the पञ्चमी` → should_be **none** (same reason)
- G3 **5.4.21** `the base word in the द्वितीया` → should_be **none** (same reason)
- G3 **5.4.23** `the base word in the प्रथमा` → should_be **none** (same reason)
- G3 **5.4.24** `the base word in the प्रथमा` → should_be **none** (same reason)
- G3 **5.4.25** `the base word in the प्रथमा` → should_be **none** (same reason)
- G3 **5.4.53** `the base word in the तृतीया` → should_be **none** (same reason)
- G3 **5.4.74** `the base word in the षष्ठी` → should_be **none** (same reason)
- G3 **5.4.86** `the base word in the षष्ठी` → should_be **none** (same reason)
- G3 **5.4.89** `the base word in the षष्ठी` → should_be **none** (same reason)
- G3 **5.4.94** `the base word in the षष्ठी` → should_be **none** (same reason)
- G3 **5.4.116** `the base word in the षष्ठी` → should_be **none** (same reason)
- G3 **5.4.122** `the base word in the षष्ठी` → should_be **none** (same reason)
- G3 **5.4.131** `the base word in the षष्ठी` → should_be **none** (same reason)
- G3 **5.4.132** `the base word in the षष्ठी` → should_be **none** (same reason)
- G3 **5.4.140** `the base word in the षष्ठी` → should_be **none** (same reason)
- G3 **5.4.159** `the base word in the षष्ठी` → should_be **none** (same reason)
- G66 **3.1.14** `कष्टाय is in the 4th case → from a word ending in the 4th-case ending` → should_be **none**: कष्टाय is the sūtra word in the 4th case (samartha-vibhakti), not a suffix named.
  > कष्टशब्दाच् चतुर्थीसमर्थात् — kashika 31014

### HOMONYM (14)

- G4 **3.3.22** `रुवः` → should_be **none**: रुवः is the root रु, not a suffix.
  > उपसर्ग उपपदे रौतेर्धातोर्घञ् प्रत्ययो भवति — kashika 33022
- G4 **3.4.75** `ताभ्याम्` → should_be **none**: ताभ्याम् is the pronoun तद् referring back to सम्प्रदान/अपादान, not a suffix.
  > ताभ्यामिति संप्रदानप्रत्यवमर्शार्थम् — kashika 34075
- G4 **4.4.140** `वसोः` → should_be **none**: वसु here is the noun वसु, not the suffix वसु.
  > वसुशब्दात् समूहे वाच्ये यत् प्रत्ययो भवति — kashika 44140
- G4 **5.3.19** `तदः` → should_be **none**: तदः is the pronoun तद्, not a suffix.
  > तदः सप्तम्यन्तात् काले वर्तमानाद् दा प्रत्ययो भवति — kashika 53019
- G4 **5.4.71** `नञः` → should_be **none**: नञ् is the negative particle (preceding member), not a suffix; the Kāśikā reads 'नञः परे'.
  > नञः परे वक्ष्यमाणा ये राजादयस्तदन्तात् तत्पुरुषात् — kashika 54071
- G8 **5.4.72** `नञः` → should_be **none**: नञ् is the negative particle, not a suffix.
  > नञः परो यः पथिन्शब्दः — kashika 54072
- G12 **6.4.45** `सनः qualifies अङ्गस्य` → should_be **none**: सनः is the root सन् (षणु दाने), not the suffix सन्.
  > सनोतेरङ्गस्य क्ति चि प्रत्यये परत आकार आदेशो भवति — kashika 64045
- G12 **7.3.22** `परस्य qualifies अङ्गस्य` → should_be **none**: परस्य means 'the second (word)', not a suffix.
  > इन्द्रशब्दस्य परस्य यदुक्तंतद् न भवति — kashika 73022
- G12 **7.3.27** `परस्य qualifies अङ्गस्य` → should_be **none**: परस्य means 'following', not a suffix.
  > अर्धात् परस्य परिमाणाकारस्य वृद्धिर्न भवति — kashika 73027
- G12 **8.2.24** `सस्य qualifies पदस्य` → should_be **none**: सस्य is the sound स्, not a suffix.
  > संयोगान्तस्य पदस्य यो रेफस्तस्मादुत्तरस्यान्त्यस्य सकारस्य लोपो भवति — kashika 82024
- G13 **5.3.84** `तृतीयात्` → should_be **none**: तृतीयात् is 'the third (vowel)', not the case ending तृतीया.
  > तृतीयादच ऊर्ध्वस्य लोपो भवति — kashika 53084
- G15 **1.3.81** `वहः` → should_be **none**: वहः is the root वह्, not a suffix.
  > प्रपूर्वाद्वहतेः परस्मैपदं भवति — kashika 13081
- G35 **7.3.30** `नञः` → should_be **none** (same reason)
- G57 **1.2.66** `स्त्री` → should_be **none**: स्त्री here is 'the female (gotra word)', not the strī suffix.
  > स्त्री वृद्धा यूना सहवचने शिष्यते — kashika 12066

### NO_TADANTA_IN_EFFECT (13)

- G1 **2.1.11** `सुबन्तम्` → should_be **none**: विभाषा is an adhikāra sūtra; it forms no compound, so the carried सुप् does nothing here (our vṛtti has no सुबन्त).
  > विभाषेत्ययमधिकारो वेदितव्यः — kashika 21011
- G1 **2.1.52** `सुबन्तम्` → should_be **none**: संख्यापूर्वो द्विगुः names a compound already formed by 2.1.51; it does not compound subantas, and our vṛtti has no सुबन्त.
  > तद्धितार्थोत्तरपदसमाहारे चेत्यत्र यः संख्यापूर्वः समासः स द्विगुसंज्ञो भवति — kashika 21052
- G1 **2.2.30** `सुबन्तम्` → should_be **none**: Pūrvanipāta rule: it orders the members of a compound already made. The carried सुप् plays no part; neither our vṛtti nor the Kāśikā uses सुबन्त.
  > उपसर्जनसंज्ञकं समासे पूर्वं प्रयोक्तव्यम् — kashika 22030
- G1 **2.2.32** `सुबन्तम्` → should_be **none** (same reason)
- G1 **2.2.33** `सुबन्ताः` → should_be **none** (same reason)
- G1 **2.2.34** `सुबन्ताः` → should_be **none** (same reason)
- G1 **2.2.35** `सुबन्तम्` → should_be **none** (same reason)
- G1 **2.2.36** `सुबन्तम्` → should_be **none**: Pūrvanipāta rule; सुप् plays no part. The real PIS 23 word is the sūtra's own निष्ठा → निष्ठान्तम्, which is not credited (see missed).
  > उपसर्जनसंज्ञकं समासे पूर्वं प्रयोक्तव्यम् — kashika 22030
  > निष्ठान्तं च बहुव्रीहिसमासे पूर्वं प्रयोक्तव्यम् — kashika 22036
- G1 **2.2.37** `सुबन्तम्` → should_be **none** (same reason)
- G1 **2.2.38** `सुबन्ताः` → should_be **none** (same reason)
- G1 **2.4.18** `सुबन्तम्` → should_be **none**: Gender rule for a compound already formed; the carried सुप् plays no part and our vṛtti has no सुबन्त.
  > अव्ययीभावश्च समासो नपुंसकलिङ्गो भवति — kashika 24018
  > नञ्समासं कर्मधारयं च वर्जयित्वान्यस्तत्पुरुषो नपुंसकलिङ्गो भवतीत्येतदधिकृतं वेदितव्यं — kashika 24019
- G1 **2.4.19** `सुबन्तम्` → should_be **none** (same reason)
- G79 **5.3.40** `from bases ending in the 7th-, 5th- and 1st-case endings` → should_be **none**: The rule replaces पूर्व etc. before अस्ताति; the carried case-ending words play no part (our vṛtti has none).
  > अस्तातिप्रत्यये परतः पूर्वादीनां यथासंख्यं पुरादय आदेशा भवन्ति — kashika 53040

### STHANI_SUFFIX (10)

- G7 **4.4.126** `मतोः` → should_be **none**: मतोः is the suffix whose luk is meant (मतुप् itself is deleted); the base अश्विमत् is named by the sūtra itself.
  > तत्र मतुपो लुकि कृत — kashika 44126
- G8 **4.4.126** `मतोः` → should_be **none** (same reason)
- G12 **6.4.50** `क्यस्य qualifies अङ्गस्य` → should_be **none**: The क्य suffix itself is deleted; no tadanta.
  > क्यस्य हल उत्तरस्य विभाषा लोपो भवत्यार्धधातुके — kashika 64050
- G12 **6.4.105** `हेः qualifies अङ्गस्य` → should_be **none**: हि itself is deleted (luk) after an a-final aṅga.
  > अकारान्तादङ्गादुत्तरस्य हेर्लुग् भवति — kashika 64105
- G12 **6.4.153** `छस्य qualifies अङ्गस्य` → should_be **none**: छ itself is deleted.
  > तेभ्य उत्तरस्य छस्य भस्य तद्धिते परतो लुग् भवति — kashika 64153
- G12 **7.3.72** `क्सस्य qualifies अङ्गस्य` → should_be **none**: The क्स suffix's own vowel is deleted; no tadanta.
  > क्सस्याजादौ प्रत्यये लोपो भवति — kashika 73072
- G32 **4.1.91** `फक्-फिञोः` → should_be **none**: फक्/फिञ् are themselves deleted (luk of the yuvan suffixes); our vṛtti says so too.
  > फक् फिञोर्युवप्रत्यययोः प्राग्दीव्यतीयेऽजादौ प्रत्यये विवक्षितेऽन्यतरस्यां लुग् भवति — kashika 41091
- G45 **6.1.164** `तद्धितस्य` → should_be **none**: The accent falls on the end of the taddhita itself; the Kāśikā reads 'तद्धितस्यान्तः' and our effect is 'तद्धितस्य' — no tadanta.
  > चितस्तद्धितस्यान्त उदात्तो भवति — kashika 61164
- G46 **6.2.51** `तवै` → should_be **none**: The Kāśikā reads 'तवैप्रत्ययस्यान्तः' (the suffix's own end) here, unlike 6.1.200 'तवैप्रत्ययान्तस्य'.
  > तवैप्रत्ययस्यान्त उदात्तो भवति — kashika 62051
  > तवैप्रत्ययान्तस्यान्तश्चशब्दादादिश्च युगपदुदात्तौ भवतः — kashika 61200
- G92 **7.1.39** `सुबन्तस्य` → should_be **none**: The sup endings themselves are replaced; no tadanta.
  > सुपां स्थाने सु लुक् पूर्वसवर्ण आ आत् शे या डा ड्या याच् आल् इत्येत आदेशा भवन्ति — kashika 71039

### NIPATANA (3)

- G1 **2.1.17** `सुबन्ताः` → should_be **none**: The whole compounds तिष्ठद्गु etc. are listed ready-made (nipātana); no सुप्+सुप् compounding is read, and our vṛtti has no सुबन्त.
  > तिष्ठद्ग्वादयः समुदाया एव निपात्यन्ते — kashika 21017
- G1 **2.1.48** `सप्तम्यन्ताः` → should_be **none**: पात्रेसमित etc. are listed ready-made; no सुबन्त reading in the rule or in our vṛtti.
  > समुदाया एव निपात्यन्ते — kashika 21048
- G1 **2.1.72** `सुबन्ताः` → should_be **none**: मयूरव्यंसक etc. are listed ready-made; no सुबन्त reading.
  > समुदाया एव निपात्यन्ते — kashika 21072

### BAHUVRIHI (3)

- G42 **3.4.61** `तस्-प्रत्यये` → should_be **none**: 'X-प्रत्यये' is a bahuvrīhi ('the word after which X is added'); the Kāśikā reads it so. The suffix is not itself the qualifier, so PIS 23 is not needed.
  > तस् प्रत्ययो यतः स्वाङ्गात् तदेवमुच्यते — kashika 34061
- G42 **3.4.62** `ना-धा-अर्थप्रत्यये` → should_be **none** (same reason)
- G85 **6.2.52** `वप्रत्यये` → should_be **none**: वप्रत्यये is a bahuvrīhi qualifying अञ्चतौ ('having व as suffix').
  > वकारः प्रत्ययो यस्य स तथोक्तः — padamanjari 62052

### COMMENTATOR_DENIES (3)

- G50 **8.3.45** `named by Vasu` → should_be **none**: Vasu (the cited commentator) says the sūtra's अनुत्तरपदस्थस्य shows PIS 23's restriction does NOT apply to इस्/उस्.
  > is an indicator (<i>jnapaka</i>), that the restriction of the following maxim does not apply with regard to the affixes इस् and उस् — vasu_english 83045
- G56 **1.2.46** `कृत्तद्धितसमासाः` → should_be **none**: The Bhāṣya on 1.4.14 says कृत्तद्धितान्त here comes from the carried अर्थवत् (a bare kṛt/taddhita has no meaning), not from pratyaya-grahaṇa, which PIS 27 bars in saṃjñā rules.
  > पदसंज्ञायामन्तग्रहणमन्यत्र संज्ञाविधौ प्रत्ययग्रहणे तदन्तविधिप्रतिषेधार्थम् — bhashya 14014
  > अर्थवदिति वर्तते। कृत्तद्धितान्तं चैवार्थवन्न केवलाः कृतस्तद्धिता वा — bhashya 14014
  > कथं तर्हि प्रातिपदिकसंज्ञायां कृतद्धिताभ्यां तदन्तग्रहणमिति चेत् — tattvabodhini 14014
- G87 **6.3.17** `named by Vasu` → should_be **none**: Vasu (the cited commentator) names PIS 23 only to say PIS 25 overrides it here: घ/तन mean the suffixes themselves. The Kāśikā reads the bare suffixes.
  > But in this chapter, so far as the jurisdiction of उत्तरपदे goes, an affix does not denote a word-form ending in that affix — vasu_english 63017
  > घसंज्ञके प्रत्यये कालशब्दे तनप्रत्यये च परतः कालनाम्न उत्तरस्याः सप्तम्या विभाषालुग् भवति — kashika 63017
  > उत्तरपदाधिकारे प्रत्ययग्रहणे न तदन्तग्रहणम् — paribhashendushekhar 25

### OTHER (1)

- G4 **5.1.18** `वतेः` → should_be **none**: वतेः marks the limit 'before (the sūtra naming) वति'; nothing ends in it.
  > प्रागेतस्माद् वतिसंशब्दनाद् — kashika 51018

### ANARTHAKA (1)

- G4 **5.4.152** `इनः` → should_be **1.1.72**: इन् is a sound-sequence covering इनि/ग्मिनि/आमिन् words (दण्डिन्, वाग्ग्मिन्, स्वामिन्), not one suffix; tadanta of इन् is the Bhāṣya's अन्/इन्/अस्/मन् list under 1.1.72 (PIS 16).
  > इन्नन्ताद् बहुव्रीहेः कप् प्रत्ययो भवति स्त्रियां विषये — kashika 54152
  > अनिनस्मन्ग्रहणान्यर्थवता चानर्थकेन च तद्न्तविधिं प्रयोजयन्ति। — bhashya 11072
  > येन विधिः' [[1.1.72]] इत्यत्र भाष्ये वचनरूपेण पठितैषा — paribhashendushekhar 16

### OWN_ANTA (1)

- G31 **7.3.51** `इस्-उस्-उक्-त-अन्तात्` → should_be **none**: The sūtra itself says '-अन्तात्', and इस्/उस्/उक्/त are sound-sequences, not suffixes.
  > इस् उस् इत्येवमन्तानामुगन्तानां तान्तानां चाङ्गानामुत्तरस्य ठस्य क इत्ययमादेशो भवति — kashika 73051

### PIS25 (1)

- G34 **6.3.66** `खिति` → should_be **none**: In the uttarapada adhikāra a suffix named means only itself (PIS 25). The Bhāṣya gets खिदन्ते here by a separate argument (nothing immediately before a खित् can be shortened; अनव्ययस्य as jñāpaka), not by PIS 23. Keep the खिदन्त reading; the credit should cite that, not PIS 23.
  > उत्तरपदाधिकारे प्रत्ययग्रहणे न तदन्तग्रहणम् — paribhashendushekhar 25
  > सर्वत्रैवोत्तरपदाधिकारे प्रत्ययग्रहणे रूपग्रहणं द्रष्टव्यम् — bhashya 63050
  > खित्यनन्तरो ह्रस्वभावी नास्तीति कृत्वा खिदन्ते उत्तरपदे भविष्यति — bhashya 63050
  > अनव्ययस्येत्येतदेव ज्ञापकमिह खिदन्तग्रहणस्य — kashika 63066

### WRONG_PARIBHASHA (1)

- G50 **7.1.37** `named by Vasu` → should_be **PIS 28**: ल्यप् replaces क्त्वा itself. Vasu names PIS 23 only to say it would NOT extend क्त्वा to compounds; that extension comes from PIS 28 (कृद्ग्रहणे गतिकारकपूर्वस्यापि), which the Śekhara says is explicit at this sūtra.
  > But the affix <i>ktva</i> is never ordained after a compound. Therefore, the case of compounds ending in <i>ktva</i>, would not be covered by the mere employment of <i>ktva</i>. — vasu_english 71037
  > कृद्ग्रहणे गतिकारकपूर्वस्यापि ग्रहणम् — paribhashendushekhar 28
  > स्पष्टं चेदं सर्वं <<समासेऽनञ्पूर्वे>> [[7.1.37]] इति सूत्रे भाष्यकैयटयोः — paribhashendushekhar 28

### SUTRA_FORM (1)

- G75 **4.4.125** `तद्वान्` → should_be **none**: The मतुबन्त reading comes from the form तद्वान् itself (Kāśikā: 'निर्देशादेव').
  > तद्वानिति निर्देशादेव समर्थविभक्तिः — kashika 44125

## 4. Unsure (left as built; need a ruling)

- G1 **2.2.19** `सुबन्तम्`: Commentators split. Kāśikā: सुप्/सुपा are not connected here (upapada compounds are made before the case ending). SK/Bālamanoramā: the upapada is सुबन्त by anuvṛtti from 2.1.2. Our vṛtti does not use सुबन्त (2.2.19–20) — a ruling is needed.
  > ज्ञापयत्येतयोर्योगयोः सुप् सुपेति न संबध्यत इति — kashika 22019
  > गतिकारकोपपदानां कृद्भिः सह समासवचनं प्राक् सुबुत्पत्तेः — kashika 22019
  > उपपदं सुबन्तं समर्थेन नित्यं समस्यते — kaumudi 22019
  > सुबन्तमिति । 'सुबामन्त्रिते' इत्यतस्तदनुवृत्तेरिति भावः — balamanorama 22019
- G1 **2.2.20** `सुबन्तम्` (same as above)
- G1 **2.2.21** `सुबन्तम्` (same as above)
- G1 **2.2.22** `सुबन्तम्` (same as above)
- G3 **3.2.71** `सुप् is a suffix group`: The Kāśikā lists the root+upapada groups as nipātana; it does not say whether the carried सुपि is in force. Our vṛtti has no सुबन्त.
  > धातूपपदसमुदाया निपात्यन्ते अलाक्षणिककार्यसिद्ध्यर्थम् — kashika 32071
- G3 **3.2.75** `सुप् is a suffix group`: The Kāśikā on 3.2.75 neither carries nor drops सुपि (its examples सुशर्मा etc. have upasarga-like prefixes); our vṛtti has no सुबन्त.
- G31 **3.4.109** `सिच्-अभ्यस्त-विदिभ्यः`: Suffix in the 5th used only as the left boundary of what is changed. Our vṛtti and the Kāśikā read the bare suffix ('सिचः परस्य', 'चिण उत्तरस्य', 'यङ उत्तरस्य'), so the credit is idle; elsewhere in the same pattern the Kāśikā does read tadanta (7.3.96 सिजन्तात्, 7.1.18 आबन्तात्). Keep or drop is a ruling.
  > सिचः परस्य, अभ्यस्तसंज्ञकेभ्यो वेत्तेश्चोत्तरस्य झेर्जुसादेशो भवति — kashika 34109
  > यङ उत्तरस्य हलादेः पितः सार्वधातुकस्येडागमो भवति वा — kashika 73094
  > अस्तेरङ्गात् सिजन्तात् च परस्यापृक्तस्य सार्वधातुकस्य ईडागमो भवति — kashika 73096
  > आबन्तादङ्गादुत्तरस्यौङः शीत्ययमादेशो भवति — kashika 71018
- G34 **6.3.14** `कृति`: Uttarapada adhikāra: PIS 25 (Bhāṣya on 6.3.50, Vasu on 6.3.17) says a suffix named here means only itself, yet the Kāśikā reads 'X-अन्ते उत्तरपदे'. The Bhāṣya justifies such a reading for 6.3.66 by a separate argument; no source found that does the same here. Ruling needed.
  > उत्तरपदाधिकारे प्रत्ययग्रहणे न तदन्तग्रहणम् — paribhashendushekhar 25
  > सर्वत्रैवोत्तरपदाधिकारे प्रत्ययग्रहणे रूपग्रहणं द्रष्टव्यम् — bhashya 63050
  > But in this chapter, so far as the jurisdiction of उत्तरपदे goes, an affix does not denote a word-form ending in that affix — vasu_english 63017
  > तत्पुरुषे समासे कृदन्त उत्तरपदे सप्तम्या बहुलमलुग् भवति — kashika 63014
- G34 **6.3.122** `घञि` (same as above)
- G35 **6.4.23** `श्नात्` (same as above)
- G35 **6.4.104** `चिणः` (same as above)
- G37 **1.1.23** `बहु-गण-वतु-डति`: Saṃjñā rule with a suffix as the saṃjñin: PIS 27 says no tadanta in saṃjñā rules. The tadanta is real (all commentators read it), but they derive it by sāmarthya — the bare suffix would be useless (Tattvabodhinī, Bālamanoramā on 1.1.23; Padamañjarī on 1.1.38) — while the Nyāsa on 1.1.38 and Bālamanoramā on 1.1.25 attribute it to pratyaya-grahaṇa. Ruling needed on which to credit.
  > संज्ञाविधौ प्रत्ययग्रहणे तदन्तग्रहणं नास्ति — paribhashendushekhar 27
  > पदसंज्ञायामन्तग्रहणमन्यत्र संज्ञाविधौ प्रत्ययग्रहणे तदन्तविधिप्रतिषेधार्थम् — bhashya 14014
  > यद्यपि संज्ञाविधौ प्रत्यग्रहणे तदन्तग्रहणं नास्ति तथापीह वतुडत्योः केवलयोः संज्ञाविधौ फलाऽभावादन्वर्थताबलाच्च तदन्तयोरेव संज्ञा प्रवर्तते — tattvabodhini 11023
  > संज्ञाविधावपीह तदन्तग्रहणं, केवलयोः प्रयोगानर्हत्वात् — balamanorama 11023
  > इह यद्यपि संज्ञाविधौ प्रत्ययग्रहणे तदन्तविधिप्रतिषेधस्तथापि केवलस्य तद्धितस्य संज्ञायाः प्रयोजनाभावात् तदन्तविधिर्विज्ञायत इत्याह-तद्धितान्तः शब्द इति — padamanjari 11038
  > तद्धितान्तस्य संज्ञा विज्ञायत इत्याह — nyaas 11038
  > प्रत्ययत्वात्तदन्तग्रहणम् — balamanorama 11025
- G37 **1.1.38** `तद्धितः` (same as above)
- G39 **1.4.61** `ऊर्यादिच्विडाचः` (same as above)
- G49 **6.3.6** `पूरणे` (same as above)
- G49 **6.3.116** `क्वौ` (same as above)
- G51 **7.1.80** `शतुः`: नुम् is inserted into शतृ; the Kāśikā and our vṛtti read the bare 'शतुः' here, but the Kāśikā on 7.1.79 and SK on 7.1.81 read tadanta in the same group. Idle either way; ruling.
  > अभ्यस्तादङ्गादुत्तरस्य शतुर्नुम् न भवति — kashika 71078
  > अवर्णान्तादङ्गादुत्तरस्य शतुर्वा नुमागमो भवति शीनद्योः परतः — kashika 71080
  > अभ्यस्तादङ्गादुत्तरो यः शतृप्रत्ययस्तदन्तस्य नपुंसकस्य वा नुमागमो भवति — kashika 71079
  > शप्श्यनोरात्परो यः शतुरवयवस्तदन्तस्य नित्यं नुम् स्याच्छीनद्योः परतः — kaumudi 71081
- G54 **1.1.25** `डति` (same as above)
- G55 **1.1.40** `क्त्वा-तोसुन्-कसुनः` (same as above)
- G77 **5.2.53** `वतोः`: इथुक् is added to वतु itself (Kāśikā 'वतोर्डटि परत इथुगागमः'); tadanta is idle. Ruling.
  > वतोर्डटि परत इथुगागमो भवति — kashika 52053
- G78 **5.2.77** `तावतिथम्`: The Kāśikā reads 'पूरणप्रत्ययान्तात्', but the sūtra word is the form तावतिथम् used as an example of a pūraṇa form, not a suffix name; whether PIS 23 or the example itself gives the tadanta is unclear.
  > तावतां पूरणं तावतिथम् — kashika 52077
  > पूरणप्रत्ययान्तात् प्रातिपदिकाद् ग्रहणोपाधिकात् स्वार्थे कन् प्रत्ययो भवति — kashika 52077
- G89 **6.3.72** `कृति` (same as above)
- G94 **7.1.78** `शतुः qualifies अङ्गस्य` (same as above)
- G95 **7.1.78** `शतुः` (same as above)
- G98 **7.3.94** `यङः` (same as above)

## 5. Missed credits

- **2.2.36** (PIS 23): Own word निष्ठा is read निष्ठान्तम् (Kāśikā); only an idle सुबन्त credit exists. Same at 2.2.35: own सप्तमी → सप्तम्यन्तं in our vṛtti, uncredited.
  > निष्ठान्तं च बहुव्रीहिसमासे पूर्वं प्रयोक्तव्यम् — kashika 22036
- **2.1.25** (PIS 23): क्तेन → क्तान्तेन in our vṛtti, uncredited (same in 2.1.26–28, 2.1.39, 2.1.47, 2.1.60). Likewise a second case-ending word read tadanta but uncredited: पञ्चम्या 2.1.12, षष्ठ्या 2.1.18, द्वितीयया 2.2.4; and सुपि → सुबन्ते at 8.1.69. About 30 such misses in all (script: X-अन्त in our vṛtti not covered by any PIS 23/1.1.72/PIS 28 trigger).
  > तस्य द्वितीयया सह संबन्धो नोपपद्यत इति द्वितीयाग्रहणमुत्तरार्थमनुवर्त्तते — kashika 21025
- **6.2.65** (PIS 23): Own word सप्तमी → सप्तम्यन्तम् in our vṛtti, no PIS 23 credit at all.
- **3.4.54** (PIS 23): द्वितीयायाम् carried from 3.4.53 → द्वितीयान्ते उपपदे in our vṛtti (also 3.4.55, 3.4.56; likewise तृतीयान्त/सप्तम्यन्त in 3.4.50, 3.4.51), uncredited while 3.4.53 is credited.
- **3.2.13** (PIS 23): सुबन्त upapada in our vṛtti, uncredited (also 3.2.45, 3.2.58, 3.2.60, 3.2.61), while the parallel 3.2.4 ff. are credited.
  > तत्र सकर्मकेषु धातुषु कर्मणीत्येतदुपतिष्ठते, अन्यत्र सुपीति — kashika 32004
- **8.3.61** (PIS 23): Own word णि (स्तौतिण्योः) → ण्यन्त in our vṛtti, uncredited.
- **6.2.46** (PIS 23): क्ते carried from 6.2.45 → क्तान्ते उत्तरपदे in our vṛtti (also 6.2.47, 6.2.48), only the vibhakti word is credited.
- **7.3.116** (PIS 23): आप् → आबन्त is credited to 1.1.72 only; it is a suffix (cf. 7.3.113 याडापः, credited PIS 23).

## 6. Open questions for a ruling

1. Saṃjñā rules with a suffix as saṃjñin (1.1.23, 1.1.25, 1.1.38, 1.1.40, 1.4.61): PIS 27 bars PIS 23; commentators reach tadanta by sāmarthya, some still cite pratyaya-grahaṇa. Credit PIS 23 (✔) or record PIS 27 + sāmarthya?
2. Uttarapada adhikāra (6.3.6, 6.3.14, 6.3.72, 6.3.116, 6.3.122): Kāśikā reads X-अन्ते उत्तरपदे against PIS 25. Same treatment as 6.3.66 (tadanta by a separate argument, not PIS 23)?
3. Upapada samāsa 2.2.19–22: Kāśikā (no सुप् here) vs SK/Bālamanoramā (upapada is सुबन्त).
4. Idle credits where the vṛtti and Kāśikā read the bare suffix and tadanta changes nothing (3.4.109, 6.4.23, 6.4.104, 7.3.94, 5.2.53, 7.1.78, 7.1.80): keep or drop?
5. Samāsa-vidhi rules are formally saṃjñā rules too; this audit follows Bālamanoramā on 2.1.4 (pratyaya-grahaṇa) and keeps them licensed.
