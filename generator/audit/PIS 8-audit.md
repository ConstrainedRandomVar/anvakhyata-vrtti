# Audit of PIS 8 credits (vṛtti generator)

Generated 2026-11-20. Input: `audit/PIS 8-firings.json` (54 ✔ credits in 7 groups). Machine-readable: `audit/PIS 8-audit.json`. Every quotation was checked by `node audit/verify_quotes.js "PIS 8"` to be verbatim in the vendored source at the id given.

## Totals

| licensed | not licensed | unsure |
|---|---|---|
| 16 | 38 | 0 |

Not licensed by `should_be`: **PIS 8 (re-target)** 27 · **none** 11  
By reason: WRONG_UTSARGA 28 · SISTER_MAXIM 9 · NAMED_NOT_APPLIED 1

Groups: G1 not licensed (0/27/0) · G2 mixed (14/1/0) · G3 not licensed (0/6/0) · G4 mixed (2/1/0) · G5 not licensed (0/1/0) · G6 not licensed (0/1/0) · G7 not licensed (0/1/0) — licensed/not/unsure.

**Main finding.** 38 of 54 not licensed. (a) G1, 27: the 3.1.94 re-pointing moved the pid but kept the wrong comparison (with the kṛtyas) and the wrong conclusion ("they stay available"); each has a real sarūpa utsarga (ण/अच्/अप्/घञ्/घ), so PIS 8 belongs there with a corrected trigger/effect. (b) 10 of the 12 layer-1 credits are the sister maxims PIS 6 नानुबन्धकृतमनेकाल्त्वम् / PIS 7 …मनेजन्तत्वम् matched on the shared opening "नानुबन्धकृतम्".

## 1. Conditions, from the sources

**C1 — PIS 8 नानुबन्धकृतमसारूप्यम्: in the sarūpa test of 3.1.94 वाऽसरूपोऽस्त्रियाम्, suffixes are compared without their anubandhas; two suffixes that differ only in markers (अण्/क; यत्/ण्यत्; घञ्/अच्/अप्/घ/ण/श — all "अ" or all "य") are sarūpa, so the apavāda blocks the utsarga outright. Jñāpaka: the explicit विभाषा of 3.1.139.**

> नानुबन्धकृतमसारूप्यम्  
> — paribhashendushekhar 8

> ददातिदधात्योर्विभाषा' [[3.1.139]] इति ण-बाधकशस्य विकल्पविधायकमस्यां ज्ञापकम्  
> — paribhashendushekhar 8

> <<नानुबन्धकृतमसारूप्यम्>>  
> — kashika 31094

> प्रकृते च यण्ण्यतोरनुबन्दरहितयोः सारूप्याद्वासरूपविधेरप्रवृत्तेः  
> — balamanorama 31098

**C2 — PIS 8 only ever DENIES asārūpya; it has nothing to say where the two suffixes differ even without markers (e.g. अ vs तव्य). It also presupposes a real utsarga–apavāda pair in the dhātu section; kṛtyas are bhāva/karman suffixes of 3.1.95–3.1.132 only, and the strī section (3.3.94ff) is outside 3.1.94.**

> तयोरेव भावकर्मणोः कृत्यसंज्ञकाः क्तखलर्थाश्च प्रत्यया भवन्ति।  
> — kashika 34070

> प्रागेतस्माण् ण्वुल्संशब्दनाद् यानित ऊर्ध्वमनुक्रमिष्यामः, कृत्यसंज्ञकास्ते वेदितव्याः।  
> — kashika 31095

> अस्त्रियामिति किम्? <<स्त्रियां क्ति न्>> (३.३.९४) इत्युत्सर्गः, <<अ प्रत्ययात्>> (३.३.१०२) इत्यपवादः, स बाधक एव भवति।  
> — kashika 31094

**C3 — Two sister maxims share the opening "नानुबन्धकृतम्…": PIS 6 नानुबन्धकृतमनेकाल्त्वम् (counting sounds for 1.1.55) and PIS 7 नानुबन्धकृतमनेजन्तत्वम् (ejanta-ness for ātva etc.). Neither is an engine pid; a passage naming them is not PIS 8.**

> नानुबन्धकृतमनेकाल्त्वम्  
> — paribhashendushekhar 6

> नानुबन्धकृतमनेजन्तत्वम्  
> — paribhashendushekhar 7

## 2. Groups

### G1 — not licensed

*carried / not a sūtra word | vidhi | X: PIS 8 … (not 3.1.94 — paribhāṣā audit*  
How checked: All 27 members: Kāśikā at each sūtra read for its "…पवादः" statement (script); where Kāśikā names none, the utsarga inferred from the domains of 3.3.18 घञ्, 3.3.56 एरच्, 3.3.57 ॠदोरप्, 3.3.58. Compared with the engine's stated kṛtya comparison.  
licensed 0 · not licensed 27 · unsure 0 — All not licensed as stated; all 27 have a real sarūpa utsarga, so PIS 8 does belong at each — but with a correct trigger/effect (e.g. 3.3.21: "घञ् (अ) = अच् (अ) once markers go → अच् blocked, no 3.1.94 option"). This is the same finding the 3.1.94 audit made (should_be PIS 8, "sarupa-real-utsarga"); the re-pointing moved the pid but kept the wrong kṛtya comparison and the wrong conclusion ("they stay available").

- **3.1.139 श is an apavāda of तव्यत्, तव्य, अनीयर्** — not licensed → `PIS 8 (re-target)` (WRONG_UTSARGA). The stated comparison is with the kṛtya suffixes तव्यत्/तव्य/अनीयर्, which are taught only in bhāva/karman inside 3.1.95–3.1.132 and are not the utsarga here; and PIS 8 can only deny asārūpya (अ vs तव्य differ anyway), so it decides nothing as stated. Kāśikā names the real utsarga: ण ("णस्यापवादः"), which is sarūpa with the apavāda once markers go — that is where PIS 8 really works (3.1.139 is the very jñāpaka of PIS 8 in the Śekhara: its विभाषा would be pointless if श/ण were asarūpa). Keep PIS 8 but restate trigger/effect against ण.
  - «णस्यापवादः» — kashika 31139
  - «तयोरेव भावकर्मणोः कृत्यसंज्ञकाः क्तखलर्थाश्च प्रत्यया भवन्ति।» — kashika 34070
  - «प्रागेतस्माण् ण्वुल्संशब्दनाद् यानित ऊर्ध्वमनुक्रमिष्यामः, कृत्यसंज्ञकास्ते वेदितव्याः।» — kashika 31095
  - «ददातिदधात्योर्विभाषा' [[3.1.139]] इति ण-बाधकशस्य विकल्पविधायकमस्यां ज्ञापकम्» — paribhashendushekhar 8
- **3.1.143 ण is an apavāda of तव्यत्, तव्य, अनीयर्** — not licensed → `PIS 8 (re-target)` (WRONG_UTSARGA). The stated comparison is with the kṛtya suffixes तव्यत्/तव्य/अनीयर्, which are taught only in bhāva/karman inside 3.1.95–3.1.132 and are not the utsarga here; and PIS 8 can only deny asārūpya (अ vs तव्य differ anyway), so it decides nothing as stated. Kāśikā names the real utsarga: अच् ("अचोऽपवादः"), which is sarūpa with the apavāda once markers go — that is where PIS 8 really works (the sūtra's own विभाषा supplies the option that 3.1.94 cannot). Keep PIS 8 but restate trigger/effect against अच्.
  - «अचोऽपवादः» — kashika 31143
  - «तयोरेव भावकर्मणोः कृत्यसंज्ञकाः क्तखलर्थाश्च प्रत्यया भवन्ति।» — kashika 34070
  - «प्रागेतस्माण् ण्वुल्संशब्दनाद् यानित ऊर्ध्वमनुक्रमिष्यामः, कृत्यसंज्ञकास्ते वेदितव्याः।» — kashika 31095
- **3.3.21 घञ् is an apavāda of तव्यत्, तव्य, अनीयर्** — not licensed → `PIS 8 (re-target)` (WRONG_UTSARGA). The stated comparison is with the kṛtya suffixes तव्यत्/तव्य/अनीयर्, which are taught only in bhāva/karman inside 3.1.95–3.1.132 and are not the utsarga here; and PIS 8 can only deny asārūpya (अ vs तव्य differ anyway), so it decides nothing as stated. Kāśikā names the real utsarga: अच् ("अचोऽपवादः"), which is sarūpa with the apavāda once markers go — that is where PIS 8 really works (nitya bādha, no 3.1.94 option). Keep PIS 8 but restate trigger/effect against अच्.
  - «अचोऽपवादः» — kashika 33021
  - «तयोरेव भावकर्मणोः कृत्यसंज्ञकाः क्तखलर्थाश्च प्रत्यया भवन्ति।» — kashika 34070
  - «प्रागेतस्माण् ण्वुल्संशब्दनाद् यानित ऊर्ध्वमनुक्रमिष्यामः, कृत्यसंज्ञकास्ते वेदितव्याः।» — kashika 31095
- **3.3.23 घञ् is an apavāda of तव्यत्, तव्य, अनीयर्** — not licensed → `PIS 8 (re-target)` (WRONG_UTSARGA). The stated comparison is with the kṛtya suffixes (not the utsarga here; PIS 8 decides nothing between अ and तव्य). Kāśikā names no utsarga at this sūtra; from the domains of the general rules the utsarga is अप् (3.3.57; यु, द्रु, दु are उवर्णान्त), sarūpa with the apavāda (all "अ") — inferred, not quoted at this sūtra. Restate against that.
  - «ॠकारान्तेभ्य उवर्णान्तेभ्यश्च अप् प्रत्ययो भवति। घञोऽपवादः।» — kashika 33057
  - «तयोरेव भावकर्मणोः कृत्यसंज्ञकाः क्तखलर्थाश्च प्रत्यया भवन्ति।» — kashika 34070
  - «प्रागेतस्माण् ण्वुल्संशब्दनाद् यानित ऊर्ध्वमनुक्रमिष्यामः, कृत्यसंज्ञकास्ते वेदितव्याः।» — kashika 31095
- **3.3.24 घञ् is an apavāda of तव्यत्, तव्य, अनीयर्** — not licensed → `PIS 8 (re-target)` (WRONG_UTSARGA). The stated comparison is with the kṛtya suffixes तव्यत्/तव्य/अनीयर्, which are taught only in bhāva/karman inside 3.1.95–3.1.132 and are not the utsarga here; and PIS 8 can only deny asārūpya (अ vs तव्य differ anyway), so it decides nothing as stated. Kāśikā names the real utsarga: अच्/अप् ("अजपोरपवादः"), which is sarūpa with the apavāda once markers go — that is where PIS 8 really works (nitya bādha, no 3.1.94 option). Keep PIS 8 but restate trigger/effect against अच्/अप्.
  - «अजपोरपवादः» — kashika 33024
  - «तयोरेव भावकर्मणोः कृत्यसंज्ञकाः क्तखलर्थाश्च प्रत्यया भवन्ति।» — kashika 34070
  - «प्रागेतस्माण् ण्वुल्संशब्दनाद् यानित ऊर्ध्वमनुक्रमिष्यामः, कृत्यसंज्ञकास्ते वेदितव्याः।» — kashika 31095
- **3.3.25 घञ् is an apavāda of तव्यत्, तव्य, अनीयर्** — not licensed → `PIS 8 (re-target)` (WRONG_UTSARGA). The stated comparison is with the kṛtya suffixes तव्यत्/तव्य/अनीयर्, which are taught only in bhāva/karman inside 3.1.95–3.1.132 and are not the utsarga here; and PIS 8 can only deny asārūpya (अ vs तव्य differ anyway), so it decides nothing as stated. Kāśikā names the real utsarga: अप् ("अपोऽपवादः"), which is sarūpa with the apavāda once markers go — that is where PIS 8 really works (nitya bādha, no 3.1.94 option). Keep PIS 8 but restate trigger/effect against अप्.
  - «अपोऽपवादः» — kashika 33025
  - «तयोरेव भावकर्मणोः कृत्यसंज्ञकाः क्तखलर्थाश्च प्रत्यया भवन्ति।» — kashika 34070
  - «प्रागेतस्माण् ण्वुल्संशब्दनाद् यानित ऊर्ध्वमनुक्रमिष्यामः, कृत्यसंज्ञकास्ते वेदितव्याः।» — kashika 31095
- **3.3.27 घञ् is an apavāda of तव्यत्, तव्य, अनीयर्** — not licensed → `PIS 8 (re-target)` (WRONG_UTSARGA). The stated comparison is with the kṛtya suffixes (not the utsarga here; PIS 8 decides nothing between अ and तव्य). Kāśikā names no utsarga at this sūtra; from the domains of the general rules the utsarga is अप् (3.3.57; द्रु, स्तु, स्रु), sarūpa with the apavāda (all "अ") — inferred, not quoted at this sūtra. Restate against that.
  - «ॠकारान्तेभ्य उवर्णान्तेभ्यश्च अप् प्रत्ययो भवति। घञोऽपवादः।» — kashika 33057
  - «तयोरेव भावकर्मणोः कृत्यसंज्ञकाः क्तखलर्थाश्च प्रत्यया भवन्ति।» — kashika 34070
  - «प्रागेतस्माण् ण्वुल्संशब्दनाद् यानित ऊर्ध्वमनुक्रमिष्यामः, कृत्यसंज्ञकास्ते वेदितव्याः।» — kashika 31095
- **3.3.28 घञ् is an apavāda of तव्यत्, तव्य, अनीयर्** — not licensed → `PIS 8 (re-target)` (WRONG_UTSARGA). The stated comparison is with the kṛtya suffixes (not the utsarga here; PIS 8 decides nothing between अ and तव्य). Kāśikā names no utsarga at this sūtra; from the domains of the general rules the utsarga is अप् (3.3.57; पू, लू), sarūpa with the apavāda (all "अ") — inferred, not quoted at this sūtra. Restate against that.
  - «ॠकारान्तेभ्य उवर्णान्तेभ्यश्च अप् प्रत्ययो भवति। घञोऽपवादः।» — kashika 33057
  - «तयोरेव भावकर्मणोः कृत्यसंज्ञकाः क्तखलर्थाश्च प्रत्यया भवन्ति।» — kashika 34070
  - «प्रागेतस्माण् ण्वुल्संशब्दनाद् यानित ऊर्ध्वमनुक्रमिष्यामः, कृत्यसंज्ञकास्ते वेदितव्याः।» — kashika 31095
- **3.3.31 घञ् is an apavāda of तव्यत्, तव्य, अनीयर्** — not licensed → `PIS 8 (re-target)` (WRONG_UTSARGA). The stated comparison is with the kṛtya suffixes (not the utsarga here; PIS 8 decides nothing between अ and तव्य). Kāśikā names no utsarga at this sūtra; from the domains of the general rules the utsarga is अप् (3.3.57; स्तु), sarūpa with the apavāda (all "अ") — inferred, not quoted at this sūtra. Restate against that.
  - «ॠकारान्तेभ्य उवर्णान्तेभ्यश्च अप् प्रत्ययो भवति। घञोऽपवादः।» — kashika 33057
  - «तयोरेव भावकर्मणोः कृत्यसंज्ञकाः क्तखलर्थाश्च प्रत्यया भवन्ति।» — kashika 34070
  - «प्रागेतस्माण् ण्वुल्संशब्दनाद् यानित ऊर्ध्वमनुक्रमिष्यामः, कृत्यसंज्ञकास्ते वेदितव्याः।» — kashika 31095
- **3.3.35 घञ् is an apavāda of तव्यत्, तव्य, अनीयर्** — not licensed → `PIS 8 (re-target)` (WRONG_UTSARGA). The stated comparison is with the kṛtya suffixes तव्यत्/तव्य/अनीयर्, which are taught only in bhāva/karman inside 3.1.95–3.1.132 and are not the utsarga here; and PIS 8 can only deny asārūpya (अ vs तव्य differ anyway), so it decides nothing as stated. Kāśikā names the real utsarga: अप् ("अपोऽपवादः"), which is sarūpa with the apavāda once markers go — that is where PIS 8 really works (nitya bādha, no 3.1.94 option). Keep PIS 8 but restate trigger/effect against अप्.
  - «अपोऽपवादः» — kashika 33035
  - «तयोरेव भावकर्मणोः कृत्यसंज्ञकाः क्तखलर्थाश्च प्रत्यया भवन्ति।» — kashika 34070
  - «प्रागेतस्माण् ण्वुल्संशब्दनाद् यानित ऊर्ध्वमनुक्रमिष्यामः, कृत्यसंज्ञकास्ते वेदितव्याः।» — kashika 31095
- **3.3.37 घञ् is an apavāda of तव्यत्, तव्य, अनीयर्** — not licensed → `PIS 8 (re-target)` (WRONG_UTSARGA). The stated comparison is with the kṛtya suffixes तव्यत्/तव्य/अनीयर्, which are taught only in bhāva/karman inside 3.1.95–3.1.132 and are not the utsarga here; and PIS 8 can only deny asārūpya (अ vs तव्य differ anyway), so it decides nothing as stated. Kāśikā names the real utsarga: अच् ("अचोऽपवादः"), which is sarūpa with the apavāda once markers go — that is where PIS 8 really works (nitya bādha, no 3.1.94 option). Keep PIS 8 but restate trigger/effect against अच्.
  - «अचोऽपवादः» — kashika 33037
  - «तयोरेव भावकर्मणोः कृत्यसंज्ञकाः क्तखलर्थाश्च प्रत्यया भवन्ति।» — kashika 34070
  - «प्रागेतस्माण् ण्वुल्संशब्दनाद् यानित ऊर्ध्वमनुक्रमिष्यामः, कृत्यसंज्ञकास्ते वेदितव्याः।» — kashika 31095
- **3.3.39 घञ् is an apavāda of तव्यत्, तव्य, अनीयर्** — not licensed → `PIS 8 (re-target)` (WRONG_UTSARGA). The stated comparison is with the kṛtya suffixes (not the utsarga here; PIS 8 decides nothing between अ and तव्य). Kāśikā names no utsarga at this sūtra; from the domains of the general rules the utsarga is अच् (3.3.56; शी is इवर्णान्त), sarūpa with the apavāda (all "अ") — inferred, not quoted at this sūtra. Restate against that.
  - «इवर्णान्ताद् धातोर्भावे, अकर्तरि च कारके संज्ञायामच् प्रत्ययो भवति। घञोऽपवादः।» — kashika 33056
  - «तयोरेव भावकर्मणोः कृत्यसंज्ञकाः क्तखलर्थाश्च प्रत्यया भवन्ति।» — kashika 34070
  - «प्रागेतस्माण् ण्वुल्संशब्दनाद् यानित ऊर्ध्वमनुक्रमिष्यामः, कृत्यसंज्ञकास्ते वेदितव्याः।» — kashika 31095
- **3.3.40 घञ् is an apavāda of तव्यत्, तव्य, अनीयर्** — not licensed → `PIS 8 (re-target)` (WRONG_UTSARGA). The stated comparison is with the kṛtya suffixes (not the utsarga here; PIS 8 decides nothing between अ and तव्य). Kāśikā names no utsarga at this sūtra; from the domains of the general rules the utsarga is अच् (3.3.56; चि), sarūpa with the apavāda (all "अ") — inferred, not quoted at this sūtra. Restate against that.
  - «इवर्णान्ताद् धातोर्भावे, अकर्तरि च कारके संज्ञायामच् प्रत्ययो भवति। घञोऽपवादः।» — kashika 33056
  - «तयोरेव भावकर्मणोः कृत्यसंज्ञकाः क्तखलर्थाश्च प्रत्यया भवन्ति।» — kashika 34070
  - «प्रागेतस्माण् ण्वुल्संशब्दनाद् यानित ऊर्ध्वमनुक्रमिष्यामः, कृत्यसंज्ञकास्ते वेदितव्याः।» — kashika 31095
- **3.3.45 घञ् is an apavāda of तव्यत्, तव्य, अनीयर्** — not licensed → `PIS 8 (re-target)` (WRONG_UTSARGA). The stated comparison is with the kṛtya suffixes (not the utsarga here; PIS 8 decides nothing between अ and तव्य). Kāśikā names no utsarga at this sūtra; from the domains of the general rules the utsarga is अप् (3.3.58 ग्रह), sarūpa with the apavāda (all "अ") — inferred, not quoted at this sūtra. Restate against that.
  - «ग्रहादिभ्यो धातुभ्योऽप् प्रत्ययो भवति। घञोऽपवादः।» — kashika 33058
  - «तयोरेव भावकर्मणोः कृत्यसंज्ञकाः क्तखलर्थाश्च प्रत्यया भवन्ति।» — kashika 34070
  - «प्रागेतस्माण् ण्वुल्संशब्दनाद् यानित ऊर्ध्वमनुक्रमिष्यामः, कृत्यसंज्ञकास्ते वेदितव्याः।» — kashika 31095
- **3.3.49 घञ् is an apavāda of तव्यत्, तव्य, अनीयर्** — not licensed → `PIS 8 (re-target)` (WRONG_UTSARGA). The stated comparison is with the kṛtya suffixes तव्यत्/तव्य/अनीयर्, which are taught only in bhāva/karman inside 3.1.95–3.1.132 and are not the utsarga here; and PIS 8 can only deny asārūpya (अ vs तव्य differ anyway), so it decides nothing as stated. Kāśikā names the real utsarga: अच्/अप् ("अजपोरपवादः"), which is sarūpa with the apavāda once markers go — that is where PIS 8 really works (nitya bādha, no 3.1.94 option). Keep PIS 8 but restate trigger/effect against अच्/अप्.
  - «अजपोरपवादः» — kashika 33049
  - «तयोरेव भावकर्मणोः कृत्यसंज्ञकाः क्तखलर्थाश्च प्रत्यया भवन्ति।» — kashika 34070
  - «प्रागेतस्माण् ण्वुल्संशब्दनाद् यानित ऊर्ध्वमनुक्रमिष्यामः, कृत्यसंज्ञकास्ते वेदितव्याः।» — kashika 31095
- **3.3.58 अप् is an apavāda of तव्यत्, तव्य, अनीयर्** — not licensed → `PIS 8 (re-target)` (WRONG_UTSARGA). The stated comparison is with the kṛtya suffixes तव्यत्/तव्य/अनीयर्, which are taught only in bhāva/karman inside 3.1.95–3.1.132 and are not the utsarga here; and PIS 8 can only deny asārūpya (अ vs तव्य differ anyway), so it decides nothing as stated. Kāśikā names the real utsarga: घञ् ("घञोऽपवादः"), which is sarūpa with the apavāda once markers go — that is where PIS 8 really works (nitya bādha, no 3.1.94 option). Keep PIS 8 but restate trigger/effect against घञ्.
  - «घञोऽपवादः» — kashika 33058
  - «तयोरेव भावकर्मणोः कृत्यसंज्ञकाः क्तखलर्थाश्च प्रत्यया भवन्ति।» — kashika 34070
  - «प्रागेतस्माण् ण्वुल्संशब्दनाद् यानित ऊर्ध्वमनुक्रमिष्यामः, कृत्यसंज्ञकास्ते वेदितव्याः।» — kashika 31095
- **3.3.59 अप् is an apavāda of तव्यत्, तव्य, अनीयर्** — not licensed → `PIS 8 (re-target)` (WRONG_UTSARGA). The stated comparison is with the kṛtya suffixes (not the utsarga here; PIS 8 decides nothing between अ and तव्य). Kāśikā names no utsarga at this sūtra; from the domains of the general rules the utsarga is घञ् (3.3.18; अद्), sarūpa with the apavāda (all "अ") — inferred, not quoted at this sūtra. Restate against that.
  - «भावे वाच्ये धातोर्घञ् प्रत्ययो भवति।» — kashika 33018
  - «तयोरेव भावकर्मणोः कृत्यसंज्ञकाः क्तखलर्थाश्च प्रत्यया भवन्ति।» — kashika 34070
  - «प्रागेतस्माण् ण्वुल्संशब्दनाद् यानित ऊर्ध्वमनुक्रमिष्यामः, कृत्यसंज्ञकास्ते वेदितव्याः।» — kashika 31095
- **3.3.61 अप् is an apavāda of तव्यत्, तव्य, अनीयर्** — not licensed → `PIS 8 (re-target)` (WRONG_UTSARGA). The stated comparison is with the kṛtya suffixes तव्यत्/तव्य/अनीयर्, which are taught only in bhāva/karman inside 3.1.95–3.1.132 and are not the utsarga here; and PIS 8 can only deny asārūpya (अ vs तव्य differ anyway), so it decides nothing as stated. Kāśikā names the real utsarga: घञ् ("घञोऽपवादः"), which is sarūpa with the apavāda once markers go — that is where PIS 8 really works (nitya bādha, no 3.1.94 option). Keep PIS 8 but restate trigger/effect against घञ्.
  - «घञोऽपवादः» — kashika 33061
  - «तयोरेव भावकर्मणोः कृत्यसंज्ञकाः क्तखलर्थाश्च प्रत्यया भवन्ति।» — kashika 34070
  - «प्रागेतस्माण् ण्वुल्संशब्दनाद् यानित ऊर्ध्वमनुक्रमिष्यामः, कृत्यसंज्ञकास्ते वेदितव्याः।» — kashika 31095
- **3.3.62 अप् is an apavāda of तव्यत्, तव्य, अनीयर्** — not licensed → `PIS 8 (re-target)` (WRONG_UTSARGA). The stated comparison is with the kṛtya suffixes (not the utsarga here; PIS 8 decides nothing between अ and तव्य). Kāśikā names no utsarga at this sūtra; from the domains of the general rules the utsarga is घञ् (3.3.18; स्वन्, हस्), sarūpa with the apavāda (all "अ") — inferred, not quoted at this sūtra. Restate against that.
  - «भावे वाच्ये धातोर्घञ् प्रत्ययो भवति।» — kashika 33018
  - «तयोरेव भावकर्मणोः कृत्यसंज्ञकाः क्तखलर्थाश्च प्रत्यया भवन्ति।» — kashika 34070
  - «प्रागेतस्माण् ण्वुल्संशब्दनाद् यानित ऊर्ध्वमनुक्रमिष्यामः, कृत्यसंज्ञकास्ते वेदितव्याः।» — kashika 31095
- **3.3.63 अप् is an apavāda of तव्यत्, तव्य, अनीयर्** — not licensed → `PIS 8 (re-target)` (WRONG_UTSARGA). The stated comparison is with the kṛtya suffixes तव्यत्/तव्य/अनीयर्, which are taught only in bhāva/karman inside 3.1.95–3.1.132 and are not the utsarga here; and PIS 8 can only deny asārūpya (अ vs तव्य differ anyway), so it decides nothing as stated. Kāśikā names the real utsarga: घञ् ("घञोऽपवादः"), which is sarūpa with the apavāda once markers go — that is where PIS 8 really works (nitya bādha, no 3.1.94 option). Keep PIS 8 but restate trigger/effect against घञ्.
  - «घञोऽपवादः» — kashika 33063
  - «तयोरेव भावकर्मणोः कृत्यसंज्ञकाः क्तखलर्थाश्च प्रत्यया भवन्ति।» — kashika 34070
  - «प्रागेतस्माण् ण्वुल्संशब्दनाद् यानित ऊर्ध्वमनुक्रमिष्यामः, कृत्यसंज्ञकास्ते वेदितव्याः।» — kashika 31095
- **3.3.64 अप् is an apavāda of तव्यत्, तव्य, अनीयर्** — not licensed → `PIS 8 (re-target)` (WRONG_UTSARGA). The stated comparison is with the kṛtya suffixes तव्यत्/तव्य/अनीयर्, which are taught only in bhāva/karman inside 3.1.95–3.1.132 and are not the utsarga here; and PIS 8 can only deny asārūpya (अ vs तव्य differ anyway), so it decides nothing as stated. Kāśikā names the real utsarga: घञ् ("घञोऽपवादः"), which is sarūpa with the apavāda once markers go — that is where PIS 8 really works (nitya bādha, no 3.1.94 option). Keep PIS 8 but restate trigger/effect against घञ्.
  - «घञोऽपवादः» — kashika 33064
  - «तयोरेव भावकर्मणोः कृत्यसंज्ञकाः क्तखलर्थाश्च प्रत्यया भवन्ति।» — kashika 34070
  - «प्रागेतस्माण् ण्वुल्संशब्दनाद् यानित ऊर्ध्वमनुक्रमिष्यामः, कृत्यसंज्ञकास्ते वेदितव्याः।» — kashika 31095
- **3.3.65 अप् is an apavāda of तव्यत्, तव्य, अनीयर्** — not licensed → `PIS 8 (re-target)` (WRONG_UTSARGA). The stated comparison is with the kṛtya suffixes तव्यत्/तव्य/अनीयर्, which are taught only in bhāva/karman inside 3.1.95–3.1.132 and are not the utsarga here; and PIS 8 can only deny asārūpya (अ vs तव्य differ anyway), so it decides nothing as stated. Kāśikā names the real utsarga: घञ् ("घञोऽपवादः"), which is sarūpa with the apavāda once markers go — that is where PIS 8 really works (nitya bādha, no 3.1.94 option). Keep PIS 8 but restate trigger/effect against घञ्.
  - «घञोऽपवादः» — kashika 33065
  - «तयोरेव भावकर्मणोः कृत्यसंज्ञकाः क्तखलर्थाश्च प्रत्यया भवन्ति।» — kashika 34070
  - «प्रागेतस्माण् ण्वुल्संशब्दनाद् यानित ऊर्ध्वमनुक्रमिष्यामः, कृत्यसंज्ञकास्ते वेदितव्याः।» — kashika 31095
- **3.3.66 अप् is an apavāda of तव्यत्, तव्य, अनीयर्** — not licensed → `PIS 8 (re-target)` (WRONG_UTSARGA). The stated comparison is with the kṛtya suffixes (not the utsarga here; PIS 8 decides nothing between अ and तव्य). Kāśikā names no utsarga at this sūtra; from the domains of the general rules the utsarga is घञ् (3.3.18; पण्), sarūpa with the apavāda (all "अ") — inferred, not quoted at this sūtra. Restate against that.
  - «भावे वाच्ये धातोर्घञ् प्रत्ययो भवति।» — kashika 33018
  - «तयोरेव भावकर्मणोः कृत्यसंज्ञकाः क्तखलर्थाश्च प्रत्यया भवन्ति।» — kashika 34070
  - «प्रागेतस्माण् ण्वुल्संशब्दनाद् यानित ऊर्ध्वमनुक्रमिष्यामः, कृत्यसंज्ञकास्ते वेदितव्याः।» — kashika 31095
- **3.3.67 अप् is an apavāda of तव्यत्, तव्य, अनीयर्** — not licensed → `PIS 8 (re-target)` (WRONG_UTSARGA). The stated comparison is with the kṛtya suffixes तव्यत्/तव्य/अनीयर्, which are taught only in bhāva/karman inside 3.1.95–3.1.132 and are not the utsarga here; and PIS 8 can only deny asārūpya (अ vs तव्य differ anyway), so it decides nothing as stated. Kāśikā names the real utsarga: घञ् ("घञोऽपवादः"), which is sarūpa with the apavāda once markers go — that is where PIS 8 really works (nitya bādha, no 3.1.94 option). Keep PIS 8 but restate trigger/effect against घञ्.
  - «घञोऽपवादः» — kashika 33067
  - «तयोरेव भावकर्मणोः कृत्यसंज्ञकाः क्तखलर्थाश्च प्रत्यया भवन्ति।» — kashika 34070
  - «प्रागेतस्माण् ण्वुल्संशब्दनाद् यानित ऊर्ध्वमनुक्रमिष्यामः, कृत्यसंज्ञकास्ते वेदितव्याः।» — kashika 31095
- **3.3.69 अप् is an apavāda of तव्यत्, तव्य, अनीयर्** — not licensed → `PIS 8 (re-target)` (WRONG_UTSARGA). The stated comparison is with the kṛtya suffixes तव्यत्/तव्य/अनीयर्, which are taught only in bhāva/karman inside 3.1.95–3.1.132 and are not the utsarga here; and PIS 8 can only deny asārūpya (अ vs तव्य differ anyway), so it decides nothing as stated. Kāśikā names the real utsarga: घञ् ("घञोऽपवादः"), which is sarūpa with the apavāda once markers go — that is where PIS 8 really works (nitya bādha, no 3.1.94 option). Keep PIS 8 but restate trigger/effect against घञ्.
  - «घञोऽपवादः» — kashika 33069
  - «तयोरेव भावकर्मणोः कृत्यसंज्ञकाः क्तखलर्थाश्च प्रत्यया भवन्ति।» — kashika 34070
  - «प्रागेतस्माण् ण्वुल्संशब्दनाद् यानित ऊर्ध्वमनुक्रमिष्यामः, कृत्यसंज्ञकास्ते वेदितव्याः।» — kashika 31095
- **3.3.120 घञ् is an apavāda of तव्यत्, तव्य, अनीयर्** — not licensed → `PIS 8 (re-target)` (WRONG_UTSARGA). The stated comparison is with the kṛtya suffixes तव्यत्/तव्य/अनीयर्, which are taught only in bhāva/karman inside 3.1.95–3.1.132 and are not the utsarga here; and PIS 8 can only deny asārūpya (अ vs तव्य differ anyway), so it decides nothing as stated. Kāśikā names the real utsarga: घ ("घस्यापवादः"), which is sarūpa with the apavāda once markers go — that is where PIS 8 really works (nitya bādha, no 3.1.94 option). Keep PIS 8 but restate trigger/effect against घ.
  - «घस्यापवादः» — kashika 33120
  - «तयोरेव भावकर्मणोः कृत्यसंज्ञकाः क्तखलर्थाश्च प्रत्यया भवन्ति।» — kashika 34070
  - «प्रागेतस्माण् ण्वुल्संशब्दनाद् यानित ऊर्ध्वमनुक्रमिष्यामः, कृत्यसंज्ञकास्ते वेदितव्याः।» — kashika 31095
- **3.3.121 घञ् is an apavāda of तव्यत्, तव्य, अनीयर्** — not licensed → `PIS 8 (re-target)` (WRONG_UTSARGA). The stated comparison is with the kṛtya suffixes तव्यत्/तव्य/अनीयर्, which are taught only in bhāva/karman inside 3.1.95–3.1.132 and are not the utsarga here; and PIS 8 can only deny asārūpya (अ vs तव्य differ anyway), so it decides nothing as stated. Kāśikā names the real utsarga: घ ("घस्यापवादः"), which is sarūpa with the apavāda once markers go — that is where PIS 8 really works (nitya bādha, no 3.1.94 option). Keep PIS 8 but restate trigger/effect against घ.
  - «घस्यापवादः» — kashika 33121
  - «तयोरेव भावकर्मणोः कृत्यसंज्ञकाः क्तखलर्थाश्च प्रत्यया भवन्ति।» — kashika 34070
  - «प्रागेतस्माण् ण्वुल्संशब्दनाद् यानित ऊर्ध्वमनुक्रमिष्यामः, कृत्यसंज्ञकास्ते वेदितव्याः।» — kashika 31095

### G2 — mixed

*carried / not a sūtra word | vidhi | X*  
How checked: Each member: is the named utsarga right (Kāśikā / domain of 3.1.97 यत् for ajanta, 3.1.124 ण्यत् for ṛvarṇānta/halanta)? Both suffixes reduce to "य" → sarūpa → PIS 8 applies.  
licensed 14 · not licensed 1 · unsure 0 — Licensed 14 (Kāśikā 3.1.125/3.1.126 "यतोऽपवादः"; 3.1.113 "ऋदुपधत्वात् प्राप्तविभाषेयम्"; 3.1.120 "करोतेर्ण्यति प्राप्ते"). At 3.1.109 the engine names only यत्; for शास्/जुष् (and वृ, दृ) the utsarga is ण्यत् — also sarūpa, so the credit stands.

Licensed: 3.1.99, 3.1.100, 3.1.106, 3.1.107, 3.1.108, 3.1.109, 3.1.110, 3.1.111, 3.1.112, 3.1.113, 3.1.118, 3.1.120, 3.1.125, 3.1.126

- **3.3.98 क्यप् vs ण्यत्** — not licensed → `none` (WRONG_UTSARGA). 3.3.98 is in the strī section: क्यप् (व्रज्या, इज्या) is the apavāda of क्तिन् (3.3.94), not of ण्यत्; and 3.1.94 is barred among strī-section suffixes anyway, so no sārūpya test arises.
  - «व्रजयजोर्धात्वोः स्त्रीलिङ्गे भावे क्यप् प्रत्ययो भवत्युदात्तः» — kashika 33098
  - «क्तिनोऽपवादः» — kashika 33098
  - «अस्त्रियामिति किम्? <<स्त्रियां क्ति न्>> (३.३.९४) इत्युत्सर्गः, <<अ प्रत्ययात्>> (३.३.१०२) इत्यपवादः, स बाधक एव भवति।» — kashika 31094

### G3 — not licensed

*named by a commentator | ādeśa | X*  
How checked: Commentator passages located and read; checked which of PIS 6/7/8 is named and whether applied.  
licensed 0 · not licensed 6 · unsure 0

- **2.4.85 named by न्यासः** — not licensed → `none` (SISTER_MAXIM). Nyāsa names PIS 6 (अनेकाल्त्वम्), not PIS 8, and sets it aside: डा counts its ड् because it is not yet an it when the substitute is enjoined, so डा replaces the whole.
  - «डकारश्चानुबन्धः,तत् कुतोऽनेकाल्त्वं यतः सर्वादेशः स्यात्? नैष दोषः;» — nyaas 24085
  - «इत्संज्ञाया अभावे चानुबन्धो न भवतीत्यनेकाल्त्वात् सर्वादेशो भवति।» — nyaas 24085
- **3.4.82 named by पदमञ्जरी** — not licensed → `none` (SISTER_MAXIM). Padamañjarī names PIS 6 and answers that णल् replaces the whole because its ण् is not yet an it — PIS 6 is set aside; PIS 8 is not involved.
  - «कथमयं सर्वादशः, यावता'नानुबन्धकृतमनेकाल्त्वम्'» — padamanjari 34082
  - «न ह्ययं णल्विधानसमये प्रत्यय इत्यनित्वाद् णकारस्यानेकालत्वात्सर्वादेशः» — padamanjari 34082
- **6.1.45 named by बालमनोरमा** — not licensed → `none` (SISTER_MAXIM). BM names PIS 7 (अनेजन्तत्वम्, made known by उदीचां माङः) to justify ātva for मेङ् etc. Not PIS 8; PIS 7 is not an engine pid.
  - «इति निर्देशेननानुबन्धकृतमनेजन्तत्व» — balamanorama 61045
- **6.4.127 named by न्यासः** — not licensed → `none` (SISTER_MAXIM). Nyāsa applies PIS 6: तृ is one sound once its ऋ goes, so it replaces only the न् (1.1.52, already credited). Not PIS 8.
  - «इत्यन्तस्य भवति; एकाल्त्वात्, कारस्यानुबन्धत्वात्।» — nyaas 64127
- **6.4.128 named by बालमनोरमा** — not licensed → `none` (SISTER_MAXIM). BM: तृ replaces only the न् of मघवन् because of PIS 6 — not PIS 8.
  - «अलोऽन्त्यस्येति नकारस्य तकारः । सर्वादेशस्तु न» — balamanorama 64128
- **7.1.17 named by सिद्धान्तकौमुदी** — not licensed → `none` (SISTER_MAXIM). SK raises PIS 6 for शी and rejects it (शी is sarvādeśa because its श् is not yet an it). Not PIS 8.
  - «सर्वादेशत्वात्प्रागित्संज्ञायां एवाऽभावात्» — kaumudi 71017
  - «अनेकाल्त्वात्सर्वादेशः ।» — kaumudi 71017

### G4 — mixed

*named by a commentator | vidhi | X*  
How checked: Passages located and read.  
licensed 2 · not licensed 1 · unsure 0 — 3.1.98 (SK/BM: यत् blocks ण्यत् because यत्/ण्यत् are sarūpa) and 3.2.53 (TB: टक् and अण् sarūpa, so no 3.1.94 option) are real PIS 8 applications.

Licensed: 3.1.98, 3.2.53

- **3.4.19 named by काशिका** — not licensed → `none` (SISTER_MAXIM). Kāśikā: the form माङः (मेङ् with ātva) is a jñāpaka of PIS 7 नानुबन्धकृतमनेजन्तत्वम्, not of PIS 8.
  - «मेङः कृतात्वस्यायं निर्देशः कृतो ज्ञापनार्थः — <<नानुबन्धकृतमनेजन्तत्वम्>> इति» — kashika 34019

### G5 — not licensed

*named by a commentator | saṃjñā | X*  
How checked: Passage read.  
licensed 0 · not licensed 1 · unsure 0

- **1.1.20 named by न्यासः** — not licensed → `none` (SISTER_MAXIM). Nyāsa/Bhāṣya invoke PIS 7 (अनेजन्तत्वम्) for दैप् in अदाप्; not PIS 8.
  - «अथवाचार्यप्रवृत्तिर्ज्ञापयति नानुबन्धकृतमनेजन्तत्वमिति।» — bhashya 11020

### G6 — not licensed

*named by a commentator | operation | X*  
How checked: Passage read.  
licensed 0 · not licensed 1 · unsure 0

- **1.3.9 named by महाभाष्यम्** — not licensed → `none` (NAMED_NOT_APPLIED). The Bhāṣya on 1.3.9 (तस्य लोपः) names PIS 8 (and its jñāpaka 3.1.139) while answering objections to the anubandha theory; nothing in 1.3.9 is read through it.
  - «नानुबन्धकृतमसारूप्यं भवतीति, यदयं ददातिदधात्योर्विभाषा» — bhashya 13009
  - «तस्य इत्संज्ञकस्य लोपो भवति।» — kashika 13009

### G7 — not licensed

*named by a commentator | pada | X*  
How checked: Passage read.  
licensed 0 · not licensed 1 · unsure 0

- **2.4.78 named by पदमञ्जरी** — not licensed → `none` (SISTER_MAXIM). Padamañjarī raises PIS 7 for धेट् and says this very wording shows ātva is not obligatory in a quotation with markers — PIS 7, set aside; not PIS 8.
  - «अयमेव निर्देशो ज्ञापयति - सानुबन्धानुकरणे नावश्यकमात्वमिति।» — padamanjari 24078

## 3. Missed credits

- **3.2.3** (PIS 8) — आतोऽनुपसर्गे कः vs कर्मण्यण्: Kāśikā's own example of PIS 8 under 3.1.94 (क blocks अण् nityam: गोदः); no PIS 8 credit at 3.2.3.
  - «<<नानुबन्धकृतमसारूप्यम्>>» — kashika 31094
  - «अणोऽपवादः। गोदः।» — kashika 32003
- **3.3.56** (PIS 8) — एरच्: अच् is the apavāda of घञ् (both "अ") — sarūpa, nitya bādha; no PIS 8 credit. Same pattern for the other sarūpa apavādas in 3.2–3.3 whose engine credit (if any) names the wrong utsarga; common.
  - «इवर्णान्ताद् धातोर्भावे, अकर्तरि च कारके संज्ञायामच् प्रत्ययो भवति। घञोऽपवादः।» — kashika 33056
