# Paribhāṣā audit — open rulings for Harsha (2026-11-20)

Everything below is **left as built** until ruled. Details and quotes: `audit/<pid>-audit.md`. Recompute the unsure lists: `node audit/make_verdicts.js`.

## Rulings
1. ~~iṭ rules under 1.1.66~~ — **RULED 11-20: dropped** where no reference (KV, prathamāvṛtti, SK, LSK) reads the 7th as what follows: 33 credits; 20 credits on 16 sūtras keep the credit with a “commentaries differ” note (7.2.43 moved there: LSK “परयोः”).
2. **1.1.44 and बहुलम् / ācārya names** — does बहुलम् (and a teacher's name like आपिशलेः) earn a vibhāṣā credit? The engine credits them inconsistently (3.1.34, 5.2.122 yes; ~35 others no).
3. **1.1.49** — (a) samprasāraṇa rules (26): is the 6th in “X-स्य सम्प्रसारणम्” the place or the whole? (b) places no sūtra word names, supplied by the commentary (~20): credit 1.1.49?
4. **1.1.68** — nipātana pages (20) where the only “X-शब्द” is the base the vṛtti supplies (आगवीन from गो): own-form reading or not? *(auditor leans: not)*
5. ~~3.1.94 bars~~ — **RULED 11-20: done** — PIS 68/69/70 credited ✔ where they bar 3.1.94 (37 sūtras), 3.1.94 shown ✖ “barred by …”. Was: PIS 68 (tācchīlika section, 31 credits), PIS 69 (क्त, ल्युट्, तुमुन्, खल्), PIS 70 (lādeśas, e.g. 3.2.108)?
6. **PIS 23** — (a) saṃjñā rules where the suffix itself takes the name (1.1.23/25/38/40, 1.4.61; PIS 27 bars PIS 23 there); (b) 6.3.x rules where the Kāśikā reads tadanta against PIS 25; (c) credits that change nothing (vṛtti and Kāśikā read the bare suffix: 3.4.109, 6.4.23, 6.4.104, 7.3.94 …).
7. **1.1.70** — 13 sūtras where a commentator says the त् is only for pronunciation (मुखसुखार्थ): the auditor counted them not licensed; the Kāśikā on 1.1.70 counts every tapara. Which?
8. **1.2.28** — 20 credits where the place is already a vowel (इकः, अतः …): keep ✔ (Kaumudī supplies अचः everywhere) or make them ↪ notes?
9. **PIS 119** — 9 optional nipātanas (वा / अन्यतरस्याम्): credit “a nipātana blocks the general rules” where the regular form survives?
10. **1.1.72 / 1.1.72 vt.2** — strī-section words (4.1.19 … 75); named aṅgas whose final is replaced (6.4.67, 7.2.100, 7.4.50–52, 8.3.10–12); mixed sound+suffix credits (6.1.68, 7.1.54, 7.3.116); vt.2 in dhātu suffix rules (15; Śekhara limits vt.1 to sūtras naming a word).
11. **1.3.10 at 3.3.127** — Kāśikā applies yathāsaṅkhya; the Mahābhāṣya on 1.3.10 lists it as unwanted, SK/TB deny.

## Done 2026-11-20 (after the audit)
- Rulings: 1.1.44 only where विभाषा is read (Bhāṣya on 1.1.44 “… अन्यैरपि शब्दैरेतमर्थं सम्प्रत्याययति — बहुलमन्यतरस्यामुभयथा वा एकेषामिति”; 353 → ✖); Bhāṣya-settled unsure sets (overrides.json); iṭ doubtful dropped (33); PIS 68/69/70 bars (37).
- Engine: re-pointed credits get the target rule's effect text; NOT_DHATU consonant-final roots; 6.1.158 on आद्युदात्त/अन्तोदात्त (46); 1.1.68 on X-शब्दान्त (52); verified missed credits from `audit/make_candidates.js` → blind verifier → `audit/ENGINEFIX-verdicts.json`: 1.1.71 +154, 1.1.60 +11, 2.1.1 +39 (2.1.1's 8 word-order rules 2.2.30–38 and 1.1.60 at 6.1.68 left unsure); 1.1.50 +111 (316 candidates → verifier: 111 licensed — दीर्घ/ह्रस्व/वृद्धि/अनुनासिक/कु-चु/प्लुत; 2.4.85 by the Bhāṣya “स्थानेन्तरतमेन व्यवस्था भविष्यति”; 6.1.102 NOT, Bhāṣya “तस्मात्सवर्णग्रहणं कर्तव्यम्”; 24 positive samprasāraṇa rules left unsure — BM nearness vs KV/Nyāsa yathāsaṅkhya, the Bhāṣya does not decide). Credit texts corrected from the audits (336); 3.1.94 wrong-utsarga → ‘?’ (79). **अङ्गस्य apposition: APPROVED + applied 11-20** (`audit/APPOSITION-review.md`; 98 vṛttis, P1 82 + P2 16; baseline 6.4.51 + 7.2.35 re-blessed).

## Fixes still queued (no ruling needed unless noted)
- **Effect / trigger wording** kept on 125 licensed credits (`effectDefects` in verdicts.json): 1.1.49-→1.1.46/1.1.47 re-points still say “स्थाने”; 3.1.94's 79 wrong-utsarga texts; PIS 8's 27 re-pointed credits (wrong comparison); 4.1.82's wrong case word (110); 1.1.72's 38.
- **Vṛtti wording**: 1.4.13 — 98 vṛttis put अङ्गस्य in apposition to the suffix (7.2.35 “वलादेः आर्धधातुकस्य अङ्गस्य इट्”, the reading the Bhāṣya rejects); 5.3.72/83/84 add अङ्गस्य where the Kāśikā has प्रकृतेः/प्रातिपदिकस्य.
- **Engine bugs found by auditors**: commentator-name matcher catches shared strings and counts denials/counterfactuals (ङिच्च, नानुबन्धकृतम्, “आदेः परस्य”) and trusts the Nyāsa's off-by-one numbers; 6.1.158 regex misses आद्युदात्तम्/अन्तोदात्तम् (46 rules incl. 3.1.3); 1.1.68 misses “X-शब्दान्त” (52); NOT_DHATU never matches consonant-final roots; a final -इ read as an it marker picks the wrong root; conditional credits (1.1.50, 1.1.51, 1.1.3) fire on prohibitions; 2.1.1 only where the vṛtti writes “समर्थेन” (~70 samāsa sūtras uncredited); 1.1.71 missing on ~84 sūtras that name a pratyāhāra; 1.1.60 missing ~95.

## Teaching review — applied 2026-11-20 (Harsha approved)
`audit/TEACHING-review.md`: 37 of 44 rules had a deciding condition not taught or contradicted. Applied: the reviewed gloss on all 44 rules
(9 newly registered) and the reviewed general explanation on 4,354 cards; 1,991 contradicted clauses replaced by “not so (<rule>) — <the
auditor's reason for that sūtra>” (1.1.55 counting markers, augments read as substitutes, 1.1.52 on उपधा/टि/लुक्, 1.1.53 ṅit, 3.1.94 kṛtya
utsarga …); tapara wording by length (आत् “only the long आ”, एत्/ओत् “only ए itself (two morae, not its pluta)”).

