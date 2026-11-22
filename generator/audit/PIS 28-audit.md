# Audit of PIS 28 credits (vṛtti generator)

Generated 2026-11-20. Input: `audit/PIS 28-firings.json` (4 ✔ credits in 4 groups). Machine-readable: `audit/PIS 28-audit.json`. Every quotation was checked by `node audit/verify_quotes.js "PIS 28"` to be verbatim in the vendored source at the id given.

## Totals

| licensed | not licensed | unsure |
|---|---|---|
| 2 | 2 | 0 |

Not licensed by `should_be`: **none** 1 · **1.1.72** 1  
By reason: COMMENTATOR_DENIES 2

Groups: G1 licensed (1/0/0) · G2 licensed (1/0/0) · G3 not licensed (0/1/0) · G4 not licensed (0/1/0) — licensed/not/unsure.

**Label note.** The brief calls "PIS 28" गतिकारकोपपदानां कृद्भिः सह समासवचनं प्राक् सुबुत्पत्तेः; in the vendored Paribhāṣenduśekhara that is no. 76. No. 28 is कृद्ग्रहणे गतिकारकपूर्वस्यापि ग्रहणम्, and that is what the engine's effect describes. The audit is of the engine's PIS 28 = कृद्ग्रहणे….

## 1. Conditions, from the sources

**C1 — The vendored Śekhara's no. 28 is कृद्ग्रहणे गतिकारकपूर्वस्यापि ग्रहणम् ("where a kṛt is named, the kṛdanta with a gati/kāraka before it is meant too") — which is what the engine's effect text describes. गतिकारकोपपदानां कृद्भिः सह समासवचनं प्राक् सुबुत्पत्तेः is no. 76, a different maxim (the label in the audit brief is off). It holds for a kṛt in general and for a particular kṛt.**

> कृद्ग्रहणे गतिकारकपूर्वस्यापि ग्रहणम्  
> — paribhashendushekhar 28

> इयं च कृत्सामान्यग्रहणे कृद्विशेषग्रहणे च  
> — paribhashendushekhar 28

> गतिकारकोपपदानां कृद्भिः सह समासवचनं प्राक् सुबुत्पत्तेः  
> — paribhashendushekhar 76

**C2 — Its jñāpaka is the word अनन्तरः in 6.2.49; there (and in 7.1.37) the commentators say it is NOT applied.**

> <<गतिरनन्तरः>> [[6.2.49]] इति सूत्रेऽनन्तरग्रहणं ज्ञापकम्  
> — paribhashendushekhar 28

> अनन्तरग्रहणसामर्थ्यादेव <<कृद्ग्रहणे गतिकारकपूर्वस्यापि०>> (परि० २८) इत्येतद् नाश्रीयते।  
> — kashika 62049

## 2. Groups

### G1 — licensed

*carried / not a sūtra word | samāsa | X*  
How checked: SK/BM/Kāśikā on 2.1.32.  
licensed 1 · not licensed 0 · unsure 0 — Licensed: SK cites the maxim for नखनिर्भिन्नः; BM confirms ("परिभाषेयम् … भाष्ये स्थिता").

Licensed: 2.1.32


### G2 — licensed

*carried / not a sūtra word | vidhi | X*  
How checked: Kāśikā on 4.2.58.  
licensed 1 · not licensed 0 · unsure 0 — Licensed: "घञ इति कृद्ग्रहणम्, तत्र गतिकारकपूर्वमपि गृह्यते" (श्यैनंपाता).

Licensed: 4.2.58


### G3 — not licensed

*carried / not a sūtra word | svara | X*  
How checked: Kāśikā and Śekhara on 6.2.49 — the very quotation the engine cites.  
licensed 0 · not licensed 1 · unsure 0

- **6.2.49 where a kṛt suffix is named, the word with a gati or kāraka before it is meant too** — not licensed → `none` (COMMENTATOR_DENIES). The engine's own quotation is a denial: by the force of अनन्तर the maxim is not resorted to here; the Śekhara adds that in 6.2.49 the bare क्तान्त is taken. 6.2.49 is the jñāpaka site, not an application.
  - «अनन्तरग्रहणसामर्थ्यादेव <<कृद्ग्रहणे गतिकारकपूर्वस्यापि०>> (परि० २८) इत्येतद् नाश्रीयते।» — kashika 62049
  - «<<गतिरनन्तरः>> [[6.2.49]] इत्यत्र तु गतेः पूर्वपदस्य क्तान्त उत्तरपदे परे कार्यविधानात्तत्समवधानेऽपि केवलस्य क्तान्तत्वेन ग्रहणं बोध्यम्» — paribhashendushekhar 28

### G4 — not licensed

*carried / not a sūtra word | ādeśa | X*  
How checked: Kāśikā and Nyāsa on 7.1.37 — the engine's quotation.  
licensed 0 · not licensed 1 · unsure 0

- **7.1.37 where a kṛt suffix is named, the word with a gati or kāraka before it is meant too** — not licensed → `1.1.72` (COMMENTATOR_DENIES). Again a denial: the क्त्वान्त samāsa is reached by tadantavidhi (1.1.72), "not by" this maxim (with it a नञ्-compound could never arise, so अनञ्पूर्वे would be idle). 1.1.72 is already credited here (layer 1, Kāśikā).
  - «स च <<येन विधिस्तदन्तस्य>> [[१.१.७२]] इत्यनेन तदन्तविधिना, न तु <<कृद्ग्रहणे गतिकारकपूर्वस्यापि०>> इति।» — kashika 71037
  - «कृद्ग्रहणे गतिकारकपूर्वस्यापि ग्रहणेन (व्या।प।126) वा प्रत्ययग्रहणपरिभाषया (भो।प।सू।7) तदन्तग्रहणं न शक्यते वक्तुम्।» — nyaas 71037

## 3. Missed credits

- **2.1.25** (PIS 28) — स्वयं क्तेन: Nyāsa applies the maxim so that a gati-preceded क्तान्त (स्वयंविलीनम्) compounds with स्वयम्; no credit. Rare otherwise (the engine's 4 credits are the only ones).
  - «इति गतिपूर्वस्यापि समासो भवति।» — nyaas 21025
