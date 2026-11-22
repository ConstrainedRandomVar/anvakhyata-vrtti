# Teaching review — what the student is taught about each paribhāṣā / saṃjñā

Input: `TEACHING-input.json` (44 rules). Per rule: the current gloss and general explanation, each established condition marked taught / partly / not taught / contradicted (deciding conditions first), card/step texts the sources contradict, and proposed wording (gloss ≤ 130 chars, explanation ≤ 320 chars; every quote checked verbatim against the vendored sources by script).

**37 of 44 rules have at least one deciding condition not taught or contradicted.** Rules where the deciding content is at least partly taught: 1.1.3, 1.1.48, 1.1.51, 1.1.60, 6.1.158, PIS 18, PIS 8.

## Systemic findings

1. **Sound counting ignores the it-letter rule (1.1.55 / PIS 6).** Step texts call उत्, अङ्, चङ्, सिच्, चिण्, कु, रु 'more than one sound', and णल् 'a single sound' — wrong in dozens of sūtras (3.1.44–66, 6.1.113/114/131, 6.4.110, 7.1.102/103, 7.2.104, 7.3.52–58, 7.4.88/89, 8.2.62, 8.2.66ff, 3.4.82/83).
2. **Augments treated as substitutes.** The 6th of an augment rule is printed as 'the thing replaced' (6.4.63, 6.1.58/59, 6.3.67/70, 3.4.94); augments get 'replaces the WHOLE / LAST sound' (मुम्, ईट्, अम्, रुट् 7.1.6/7) and 'treated like what it replaced' (≈ 20 sūtras). Also ṅit substitutes इयङ्/उवङ् are called a 'ṭit augment' (6.4.77–80).
3. **1.1.70 length errors.** 'only the short आ' at 16 sūtras and 'only the short ए/ओ/औ' at 8 — आत् is long आ; एत्/ओत् are two-mora. The audit corrections are appended to some steps, but the cards still show the wrong text (7.1.51, 7.1.52, 7.3.71 carry no correction at all).
4. **3.1.94 wrong utsarga.** 144 sūtras in 3.2–3.4 name a kṛtya (तव्यत्/तव्य/अनीयर्, ण्यत्, यत्) as the utsarga of kartari and other suffixes; the audit's real utsargas are अण्, ल्युट्, निष्ठा, लट्, ण्वुल्/तृच् etc.
5. **1.1.52 'last sound' where the place is named otherwise** — उपधा (6.4.34), टि (6.4.144), लुक् of the whole suffix (6.4.104), first sound after a 5th (8.2.9–15).
6. **Placeholder glosses**: 1.1.61 and 1.2.28 show 'cited by the paribhāṣā audit'. **No gloss and no explanation**: 1.1.48, 1.1.62, 1.3.2, 2.1.1, 6.1.158, 8.2.1, PIS 119, PIS 123, PIS 18, PIS 28. **Gloss but no explanation**: 1.1.60, 1.1.61, 1.1.64, 1.1.65, 1.1.72 vt.2, 1.2.28, 3.1.94, 3.3.108 vt.2, PIS 122, PIS 8.
7. **Over-broad explanations** on the highest-traffic cards: 1.1.49 ('a 6th names what is replaced', 624+ cards) and 1.1.66 ('a 7th names what must follow', 891 cards) state the effect without the niyama limits the sources give.
8. Quote fidelity note: the current 1.1.72 explanation quotes the Nyāsa as “विशेषणेन च तदन्तविधिः, न विशेष्येण” — the vendored text reads “विशेषणेन चतदन्तविधिः, न विशेष्येण।” (a source misprint silently corrected). The proposal uses a Bhāṣya quote instead.

Counts after a contradicted text are of that text *pattern* (the input groups texts with the Devanāgarī masked), so a pattern count includes correct instances; the sūtra lists given were found by scanning the built records (`tools/recs.js`).

## 1.1.3 इको गुणवृद्धी

- Current gloss: guṇa/vṛddhi named without a sound to replace → supply इकः
- Current explanation: guṇa or vṛddhi named without a target replaces an इक् vowel

**Conditions**

- [partly] Not where the rule itself names the place (e.g. अत उपधायाः): such guṇa/vṛddhi is not इग्लक्षण (Nyāsa). — Implied by 'named without a target', but never said; the card at 7.2.1 ('taught by those words, fall on an इक्') drops the condition entirely.
- [taught] Guṇa/vṛddhi taught by its own name replaces an इक्; इकः (6th) is supplied. — Gloss, explanation and the 6.4.156 step all say it.
- [not taught] Kāśikā's list of sūtras where the supplied इक् qualifies the aṅga (मिदि-मृजि-पुगन्त-लघूपध …). — Background; matters only for the listed sūtras.

**Proposed**

- Gloss (119): guṇa/vṛddhi taught by name, with no sound named to replace → supply इकः (not where the rule names the place, e.g. उपधा)
- Explanation (263): When a rule teaches guṇa or vṛddhi by those words and names no sound to replace, इकः is supplied: an इक् vowel is replaced. Where the rule names the place itself (अत उपधायाः), 1.1.3 is not used. (Kāśikā: “वृद्धिगुणौ स्वसंज्ञया शिष्यमाणौ इकः एव स्थाने वेदितव्यौ।”)
- Quote source: kashika 11003

## 1.1.44 न वेति विभाषा

- Current gloss: विभाषा = option
- Current explanation: वा / विभाषा / अन्यतरस्याम् = OPTIONALLY

**Conditions**

- [not taught] Limit: a carried option word licenses an option only where it is still in force — the commentary may call a rule nitya inside a vibhāṣā heading, or नित्यम् / a prohibition overrides it. — Nothing tells the student that a carried वा/विभाषा can be out of force; steps simply print 'option' wherever the word is carried (e.g. 2.1.12, 2.1.13).
- [not taught] बहुलम् is wider than an option; an ācārya/region word is an option only where the commentary says so (not when it only restricts, Kāśikā 2.4.60). — The explanation equates only वा/विभाषा/अन्यतरस्याम् with 'optionally'; nothing on बहुलम् or ācārya names.
- [not taught] विभाषा names the two senses ‘not’ and ‘optionally’ together (pratiṣedha + vikalpa), not the words न/वा. — Gloss 'विभाषा = option' gives only the second sense.
- [not taught] Mechanism: the ‘not’ levels the domain, then the option works — needed for ubhayatra-vibhāṣā (prāpta/aprāpta). — Background; explains why one word covers both prāpta- and aprāpta-vibhāṣā.
- [taught] वा / अन्यतरस्याम् convey the same sense (Bhāṣya's survey). — Explanation lists them.

**Proposed**

- Gloss (127): विभाषा = ‘not, or optionally’: the operation may or may not apply (so too वा, अन्यतरस्याम्) — only where the option is in force
- Explanation (300): विभाषा names ‘not’ and ‘optionally’ together, so the rule's operation is optional; वा and अन्यतरस्याम् work the same way. A carried option word counts only where it is still in force (the commentary may call a rule nitya). बहुलम् is wider than an option. (Kāśikā: “विभाषाधिकारेऽपि नित्यसमास एवायम्।”)
- Quote source: kashika 21021

## 1.1.46 आद्यन्तौ टकितौ

- Current gloss: a ṭit augment goes at the BEGINNING, a kit augment at the END
- Current explanation: a टित् augment goes at the BEGINNING, a कित् one at the END

**Conditions**

- [not taught] The host is the item named in the 6th case; with a 5th case the augment goes on what FOLLOWS (युट् after दीङ् goes to the vowel-initial suffix; तुक् after a long vowel to that vowel). — Never said; the cards say 'the BEGINNING of the place', and 'place' (sthāna) is the 1.1.49 word for what is replaced.
- [partly] Only augments: a ṭ/k marker on a suffix or a substitute does not bring in 1.1.46. — Gloss says 'augment', but steps at 6.4.77–6.4.80 call the ṅit substitutes इयङ्/उवङ् a 'ṭit augment'.
- [taught] ṭit → first part, kit → last part of the host. — Gloss, explanation and cards.
- [not taught] A sūtra that forbids the augment places nothing. — Minor.
- [not taught] सुट् (6.1.135ff) is disputed: Kāśikā abhakta vs Bhāṣya/SK by 1.1.46. — Background.

**Contradicted texts**

- “इयङ्-उवङौ: ṭit augment → it goes at the BEGINNING of the place” (6.4.77, 6.4.78, 6.4.79, 6.4.80) — इयङ्/उवङ् are ṅit substitutes (ādeśa) for इ/उ, placed by 1.1.53, not augments; 1.1.46 applies only to augments (Nyāsa 3.2.8, 3.4.78).
- “उत्तरस्य: 6th case → names the place — the thing replaced (“स्थाने”)” (6.4.63 (7 shown)) — युट् is an augment: the 6th names the host, nothing is replaced (Nyāsa 1.1.46: 1.1.46 is an apavāda of 1.1.49; Kāśikā 6.4.63: “दीङ इति पञ्चमीनिर्देशादजादेर्युडागमो भवति”).
- “the place is a whole aṅga/dhātu and the replacement is one sound → it replaces the LAST sound → अन्त्यस्य अलः” (7.1.6, 7.1.7) — रुट् is an augment (Kāśikā 7.1.6 “रुडागमो भवति”); 1.1.52 covers substitutes only (Bhāṣya 1.1.52: “टित्किन्मितोऽप्यन्त्यस्य स्युः”).
- “लेटः → what is replaced: “लेटः”” (3.4.94 (5)) — अट्/आट् are augments of लेट्; लेट् is the host, not replaced.

**Proposed**

- Gloss (111): an augment marked ṭ goes at the BEGINNING, one marked k at the END, of the item in the 6th case (augments only)
- Explanation (318): An augment (āgama) marked ṭ is joined as the first part, one marked k as the last part, of the item named in the 6th case; with a 5th case it goes on what follows. It replaces nothing, and a ṭ/k marker on a suffix or a substitute does not bring in this rule. (Kāśikā: “आदिष्टिद् भवति अन्तःकिद् भवति षष्ठीनिर्दिष्टस्य”)
- Quote source: kashika 11046

## 1.1.47 मिदचोऽन्त्यात्परः

- Current gloss: a mit augment goes after the last vowel
- Current explanation: a मित् augment goes after the LAST vowel

**Conditions**

- [not taught] A mit element is an augment: it replaces nothing; this overrides both the ‘in place of’ reading (1.1.49) and the ‘suffix follows’ rule. — Not said; steps at 6.1.58, 6.1.59, 6.3.67, 6.3.70 call the 6th-case host 'the thing replaced' and treat मुम् as a substitute.
- [taught] It goes after the last vowel of what it is added to, as its final part. — Gloss, explanation, cards.
- [not taught] Exception: for मस्ज् the नुम् is wanted before the last sound (Bhāṣya). — Minor.

**Contradicted texts**

- “सृजि-दृशोः: 6th case → names the place — the thing replaced (“स्थाने”) [same step also says ‘1.1.49 not applicable’]” (6.1.58; likewise 6.1.59) — अम् is a mit augment; the 6th names the host (Kāśikā 1.1.47: “स्थानेयोगप्रत्ययपरत्वस्य ([[३.१.१]], [[३.१.२]]) अयमपवादः।”). The step contradicts itself.
- “अरुस्-द्विषस्-अजन्तस्य: 6th case → names the place … — मुम् replaces अरुस्-द्विषस्-अजन्तस्य → the replacement is treated like what it replaced; मुम्: more than one sound → it replaces the WHOLE” (6.3.67, 6.3.70, 6.3.71, 6.3.72) — मुम् is an augment placed by 1.1.47 (the step's own prathamāvṛtti at 6.3.70: “मुमागमो भवति”); it replaces nothing, is not sthānivat, and 1.1.55 does not apply.

**Proposed**

- Gloss (110): a mit element (marked म्) goes right after the LAST vowel of its base, as its final part — it replaces nothing
- Explanation (289): An element marked with म् (नुम्, मुम्, श्नम्, अम्) goes right after the last vowel of what it is added to and becomes its final part. It replaces nothing: it overrides both the ‘in place of’ reading and the rule that a suffix follows. (Kāśikā: “अचां संनिविष्टानामन्त्यादचः परो मिद् भवति।”)
- Quote source: kashika 11047

## 1.1.48

- Current gloss: (none)
- Current explanation: (none)

**Conditions**

- [partly] A short vowel replacing ए/ऐ/ओ/औ is an इक् (इ for ए/ऐ, उ for ओ/औ), never अ. — No gloss or explanation; only the cards at 1.2.47/1.2.48 say it.

**Proposed**

- Gloss (73): a short vowel replacing ए/ऐ/ओ/औ is an इक्: इ for ए/ऐ, उ for ओ/औ — never अ
- Explanation (204): When a rule makes ए, ऐ, ओ or औ short, the short vowel is always an इक् — इ for ए/ऐ, उ for ओ/औ — never अ (रै → अतिरि, नौ → अतिनु, गो → उपगु). (Kāśikā: “एचो ह्रस्वादेशे कर्त्तव्य इगेव ह्रस्वो भवति नान्यः।”)
- Quote source: kashika 11048

## 1.1.49 षष्ठी स्थानेयोगा

- Current gloss: 6th case = the thing replaced
- Current explanation: a word in the 6th case in a rule names WHAT IS REPLACED — so we read “… स्थाने”

**Conditions**

- [not taught] It is a niyama: if another word (in the sūtra or carried) names the part actually replaced — उपधा, एच्, अच्, अभ्यास, a visarga — the 6th of the whole is a part/qualifier 6th, not the place. — The explanation says every 6th names what is replaced; steps print 'अङ्गस्य → what is replaced' at 6.4.47, 6.4.49, 6.4.63 where the part replaced is named separately (or nothing is replaced).
- [not taught] There must be a substitute: no work in saṃjñā, atideśa, prakṛtibhāva, prohibition, suffix or gender rules. — Not said; the step at 3.1.47 (a prohibition) prints 'names the place — the thing replaced'.
- [not taught] Augments (1.1.46, 1.1.47) are apavādas: the 6th in an augment rule names the host. — Not said; contradicted at 6.4.63, 6.1.58/59, 6.3.67, 6.3.70, 3.4.94.
- [partly] Scope: a 6th uttered in the śāstra whose relation is not otherwise fixed is read ‘in place of’. — Explanation gives the effect but drops 'not otherwise fixed'.
- [not taught] Only what is actually uttered in the 6th is bound (PIS 12). — Minor.
- [not taught] Anuvāda: disputed (Nyāsa/PM/BM vs Śekhara). — Background.
- [not taught] Doubling: 6.1 dvitva is repetition, 8.1/8.4 is substitution. — Background.
- [not taught] Tripādī: asiddhatva does not block 1.1.49; पदस्य a place-6th only where the pada itself is replaced. — Background.

**Contradicted texts**

- “अङ्गस्य (carried from 6.4.1) → what is replaced: “अङ्गस्य”” (6.4.63 (27 steps of this pattern, e.g. 6.4.47, 6.4.49)) — At 6.4.63 युट् is an augment (host, not place); at 6.4.49 the य् is what goes. अङ्गस्य is a 6th of general relation re-cast per rule (Kāśikā 6.4.1: “संबन्धसामान्य एषा षष्ठी यथायोगं विशेषेष्ववतिष्ठते”); when another word names the part replaced, the niyama does not apply (Bhāṣya 1.1.49: “सन्देहे नियमः”).
- “उत्तरस्य: 6th case → names the place — the thing replaced (“स्थाने”)” (3.1.47 (15)) — 3.1.47 न दृशः is a prohibition (Kāśikā: “क्सादेशो न भवति”): no substitute is taught, so 1.1.49 has no work (Nyāsa 1.1.49: “योगः पुनरिह स्थान्यादेशभावलक्षणः।”).

**Proposed**

- Gloss (118): a 6th-case word names WHAT IS REPLACED (… स्थाने) — only where a substitute is taught and no other word names the part
- Explanation (288): Where a rule teaches a substitute, a 6th-case word whose link is otherwise unclear names what is replaced (“… स्थाने”). Not in augment rules (the 6th is the host), not where another word names the part replaced (उपधायाः, एचः), not where no substitute is taught. (Bhāṣya: “सन्देहे नियमः।”)
- Quote source: bhashya 11049

## 1.1.50 स्थानेऽन्तरतमः

- Current gloss: the replacement is the NEAREST in kind
- Current explanation: the substitute chosen is the NEAREST in articulation

**Conditions**

- [not taught] It works only where one original could get several substitutes; it picks among them — not for a prohibition or a single named substitute. — Not said anywhere; the explanation reads as if every substitute were chosen by nearness.
- [partly] Nearness is by place, meaning, quality (effort) and measure; place is strongest. — Explanation says 'nearest in articulation' — place only; meaning (puṃvat 6.3.34) and measure (two अs → आ) are left out.
- [taught] The most similar substitute comes. — Gloss and explanation.
- [not taught] Commentators use 1.1.50, not 1.3.10, to pair lists whose counts or classes do not match. — Background (cross-reference to 1.3.10).

**Proposed**

- Gloss (111): when several substitutes could come, the one MOST LIKE the original comes — by place, effort, length or meaning
- Explanation (317): Where a rule allows several substitutes for one original (guṇa = अ/ए/ओ; a class like जश्), the one most like it is chosen — by place of articulation first, then effort, length or meaning (चेता, स्तोता). It does nothing where only one substitute is possible. (Kāśikā: “स्थाने प्राप्यमाणानामन्तरतम आदेशो भवति सदृशतमः।”)
- Quote source: kashika 11050

## 1.1.51 उरण् रपरः

- Current gloss: an aṇ replacing ऋ/ऌ comes with र्/ल् (अर्, आर्, अल्)
- Current explanation: ऋ replaced by a / i / u comes with र्

**Conditions**

- [partly] An अण् (अ इ उ) in place of ऋ comes with र्; in place of ऌ, with ल् — at the moment it is taught. — Gloss has ल्; the explanation drops ऌ/ल् and the ‘at once’ point.
- [taught] The original must be ऋ (खेयम्, गेयम् get nothing). — Implied by both texts.
- [taught] अण् here is अ इ उ only (the earlier ण्); a yaṇ र् or ऋ itself takes nothing. — Explanation: 'a / i / u'.

**Proposed**

- Gloss (81): an अ, इ or उ replacing ऋ comes with र् (अर्, आर्, इर्, उर्); replacing ऌ, with ल्
- Explanation (256): When अ, इ or उ comes in place of ऋ/ॠ, it comes with र् after it (कर्ता, किरति); in place of ऌ, with ल्. The र् is there from the moment the substitute is taught. Other substitutes (a yaṇ) take nothing. (Kāśikā: “उः स्थानेऽण् प्रसज्यमान एव रपरो वेदितव्यः।”)
- Quote source: kashika 11051

## 1.1.52 अलोऽन्त्यस्य

- Current gloss: a replacement replaces the LAST sound
- Current explanation: a substitute replaces only the LAST sound

**Conditions**

- [not taught] The substitute must be ONE sound (counted without it-letters); a multi-sound or śit substitute replaces the whole (1.1.55), a ṅit one the last sound (1.1.53). — Gloss 'a replacement replaces the LAST sound' and the explanation omit it; only some step texts ('a single sound → LAST') carry it.
- [not taught] If the place is already one sound, or a position word (उपधायाः, टेः, आदेः), 1.1.52 decides nothing. — Not said; contradicted at 6.4.34 (उपधा), 6.4.144 (टि), 8.2.9 (म of मतुप्).
- [not taught] Only substitutes for a 6th-case place: augments are outside it. — Not said; contradicted at 7.1.6/7.1.7 (रुट्).
- [not taught] लुक् removes the WHOLE suffix (1.1.61); लोप does take 1.1.52. — Not said; contradicted at 6.4.104 (चिणो लुक्).
- [partly] What it does: picks the last sound of a longer 6th-case item. — Said, but without the deciding limits.
- [not taught] After a 5th-case word, the first sound (1.1.54). — Cross-reference only.
- [not taught] PIS 105: a meaningless named piece goes whole (except abhyāsa). — Background.
- [not taught] ह्रस्व/दीर्घ/प्लुत via 1.2.28: tadanta qualifiers → last vowel; a medial vowel is 'the ac of X'. — Background.

**Contradicted texts**

- “इ: a single sound → it replaces the LAST sound” (6.4.34 (9)) — इ replaces the उपधा of शास् (Kāśikā 6.4.34: “शास उपधाया इकारादेशो भवति”); Bhāṣya 1.1.49 names शास इदङ्हलोः as a case where the part is named.
- “the place is a whole aṅga/dhātu and the replacement is one sound → it replaces the LAST sound → अन्त्यस्य अलः” (6.4.104) — लुक् removes the whole suffix after चिण् (Kāśikā: “चिण उत्तरस्य प्रत्ययस्य लुग् भवति”).
- “the place is a whole aṅga/dhātu and the replacement is one sound → it replaces the LAST sound → अन्त्यस्य अलः” (6.4.144) — The lopa is of the whole टि (Kāśikā: “नकारान्तस्य भस्य टेर्लोपो भवति”); a position word leaves 1.1.52 nothing to decide.
- “व्: a single sound → it replaces the LAST sound” (8.2.9 (also 8.2.10, 8.2.11, 8.2.14, 8.2.15)) — व replaces the म of मतुप् after a 5th-case condition (मात्) — the first sound, by 1.1.54 (Kāśikā 8.2.9: “मतोर्व इत्ययमादेशो भवति”).
- “कु: more than one sound → it replaces the WHOLE of the place” (8.2.62 (and कु at 17 sūtras incl. 7.2.104, 7.3.52–58)) — कु is an उदित् = one sound of the k-class; Kāśikā 8.2.62: “तस्य पदस्यालोऽन्त्यस्य कवर्गादेशो भवति”.
- “उत्: more than one sound → it replaces the WHOLE of the place” (6.1.131 (and 6.1.113, 6.1.114, 6.4.110, 7.1.102, 7.1.103, 7.4.88, 7.4.89)) — उत् is one sound (त् only marks tapara); Kāśikā 6.1.131 “दिवः पदस्योकारादेशो भवति” — the audit records 6.1.131 as a place with no sarvādeśa.

**Proposed**

- Gloss (118): a one-sound substitute replaces only the LAST sound of the 6th-case item (a multi-sound one: 1.1.55; augments: 1.1.46)
- Explanation (276): When one sound is taught in place of a longer item named in the 6th case, it replaces only that item's last sound. Not when the place is itself one sound or a position (उपधा, टि), not for augments, and not for लुक् — the whole suffix goes. (Nyāsa: “आदेशः पुनरत्रैकाल्लभ्यते।”)
- Quote source: nyaas 11052

## 1.1.53 ङिच्च

- Current gloss: a ङित् replacement replaces only the last sound, even if it has several sounds
- Current explanation: a ङित् substitute replaces only the last sound

**Conditions**

- [not taught] Where the ङ् has another job (तातङ् 7.1.35: it blocks guṇa/vṛddhi), 1.1.55 wins and the substitute replaces the whole. — Not said.
- [taught] A ṅit substitute, even of several sounds, replaces only the last sound; apavāda of 1.1.55. — Gloss, explanation, cards at 4.1.97, 6.4.77 — but several steps contradict it (below).
- [not taught] The string ङिच्च in other texts (ङिच्च पिन्न; 3.4.103) is not 1.1.53. — Engine-side only.

**Contradicted texts**

- “अवङ्: more than one sound → it replaces the WHOLE of the place” (6.1.123) — अवङ् is ṅit: it replaces only the ओ of गो (Kāśikā 1.1.53: “ङिच्च य आदेशः, सोऽनेकालपि अलोऽन्त्यस्य स्थाने भवति।”).
- “रीङ्: more than one sound → it replaces the WHOLE of the place” (7.4.27) — रीङ् is ṅit and replaces the final ऋ (Kāśikā 7.4.27: “रीङित्ययमादेशो भवति”).
- “आनङ् / अनङ्: more than one sound → it replaces the WHOLE of the place” (6.3.25, 6.3.26; 7.1.93, 7.1.94) — Both are ṅit substitutes → last sound only, by 1.1.53.
- “the place is a whole aṅga/dhātu and the replacement is one sound → it replaces the LAST sound” (6.4.77) — Right result, wrong reason: इयङ्/उवङ् have several sounds; it is 1.1.53 (the card on the same sūtra says so).

**Proposed**

- Gloss (119): a ङित् substitute replaces only the last sound, even with several sounds (not where the ङ् has another job, e.g. तातङ्)
- Explanation (299): A substitute marked with ङ् (अनङ्, इयङ्, अवङ्, रीङ्) replaces only the last sound of the 6th-case item, even though it has several sounds — overriding 1.1.55. Where the ङ् has another job (तातङ्: it blocks guṇa), it replaces the whole. (Kāśikā: “ङिच्च य आदेशः, सोऽनेकालपि अलोऽन्त्यस्य स्थाने भवति।”)
- Quote source: kashika 11053

## 1.1.54 आदेः परस्य

- Current gloss: after a 5th-case condition the replacement replaces the FIRST sound
- Current explanation: a substitute for what follows replaces its FIRST sound

**Conditions**

- [not taught] 1.1.55 overrides it: a multi-sound or śit substitute replaces the whole even after a 5th-case word (अतो भिस ऐस्); लुक् removes the whole suffix. — Not said.
- [partly] Applies to what FOLLOWS a 5th-case word (via 1.1.67): its first sound. — Gloss ties it to the 5th case; the explanation says only 'a substitute for what follows'.
- [not taught] Commentators often name 1.1.54 counterfactually — not an application. — Engine-side only.

**Contradicted texts**

- “व्: a single sound → it replaces the LAST sound” (8.2.9 (4)) — After मात् (5th) the व replaces the FIRST sound of मतुप् — this rule, not 1.1.52.

**Proposed**

- Gloss (123): after a 5th-case word, the operation on what follows hits its FIRST sound (a multi-sound or śit substitute still takes all)
- Explanation (316): When a rule operates on what comes after a 5th-case word (1.1.67), a one-sound substitute or elision hits only the first sound of that item. A substitute of several sounds, or a śit one, still replaces the whole (अतो भिस ऐस्), and लुक् removes the whole suffix. (Kāśikā: “परस्य कार्यं शिष्यमाणमादेरलः प्रत्येतव्यम्”)
- Quote source: kashika 11054

## 1.1.55 अनेकाल्शित्सर्वस्य

- Current gloss: a multi-sound / śit replacement replaces the whole
- Current explanation: a substitute of more than one sound (or शित्) replaces the WHOLE

**Conditions**

- [contradicted] Sounds are counted AFTER the it-letters are removed (नानुबन्धकृतमनेकाल्त्वम्): उत्, अङ्, चङ्, सिच्, तृ, कु, रु, चिण् are one sound each. — Not taught, and the step texts count markers as sounds across dozens of sūtras (below).
- [contradicted] Only a substitution of a 6th-case item: an augment, a new suffix, a nipātana, an atideśa, a prohibition, or a number/gender/case rule is outside it. — Not taught; steps apply 'more than one sound → WHOLE' to augments (मुम्, ईट्, अम्) and to non-substitutes (बहुवचन, तृतीया, नपुंसकम्, लोपः).
- [contradicted] An initial it-letter that is an it only because the substitute is a pratyaya still counts when it is taught (डा, णल्) → whole. — Not taught; the 3.4.82/3.4.83 steps say 'णल्: a single sound → LAST'.
- [not taught] Beats 1.1.54 by paratva (अतो भिस ऐस्). — Not said here or at 1.1.54.
- [partly] ṅit exception (1.1.53) and its own exception (तातङ्). — Taught under 1.1.53 only.
- [taught] A multi-sound or śit substitute replaces the whole. — Gloss, explanation, the 2.4.37 card.

**Contradicted texts**

- “उत्: more than one sound → it replaces the WHOLE of the place” (6.1.113, 6.1.114, 6.1.131, 6.4.110, 7.1.102, 7.1.103, 7.4.88, 7.4.89) — उत् is one sound; markers do not count (Bhāṣya 1.1.55: “नानुबन्धकृतमनेकाल्त्वं”); Śekhara PIS 6 names अर्वणस्तृ as not sarvādeśa for the same reason.
- “अङ् / चङ् / सिच् / चिण्: more than one sound → it replaces the WHOLE of the place” (3.1.44, 3.1.48–3.1.59, 3.1.60–3.1.66) — अङ्/चङ्/चिण् are one vowel, सिच् is स्; the original च्लि is itself one sound, so 'the whole' is trivially right but the stated reason is false.
- “कु / रु / चु / श्चु / ष्टु: more than one sound → it replaces the WHOLE of the place” (कु 17 sūtras (7.2.104, 7.3.52–58 …), रु 11 (8.2.66 …), चु 7.4.62–64, श्चु 8.4.40/44, ष्टु 8.4.42/43) — These name one sound of a class (उदित्, 1.1.69) or a class sound-for-sound; each substitute is a single sound.
- “विसर्जनीय / अनुस्वार / अनुनासिक / परसवर्ण: more than one sound → it replaces the WHOLE of the place” (8.3.15, 8.3.16, 8.3.35, 8.3.36; 8.3.23/24; 8.3.2, 8.4.45, 8.4.57; 8.4.58–62) — Each is the name of a single sound, not a multi-sound substitute.
- “बहुवचन / द्विवचन / तृतीया / नपुंसकम् / तुल्यम् / एक-शेष / लोपः: more than one sound → it replaces the WHOLE of the place” (1.2.56–1.2.64, 2.3.3, 2.4.25, 3.4.97, 3.4.99, 7.4.4) — Not substitutes (number/case/gender/atideśa rules) or not sounds (लोप); 1.1.55 is outside its scope.
- “मुम् / ईट् / अम्: more than one sound → it replaces the WHOLE of the place” (6.3.67, 6.3.70–72; 7.3.94–98; 6.1.58, 6.1.59) — Augments: placed by 1.1.46/1.1.47, they replace nothing.
- “णल्: a single sound → it replaces the LAST sound” (3.4.82, 3.4.83) — णल् is anekāl when taught (its ण् is not yet an it) and replaces the whole (Padamañjarī 3.4.82: “णकारस्यानेकालत्वात्सर्वादेशः”).

**Proposed**

- Gloss (100): a substitute of more than one sound (not counting it-letters), or a śit one, replaces the WHOLE item
- Explanation (307): A substitute of more than one real sound, or one marked श्, replaces the whole 6th-case item (अस्तेर्भूः). Count without it-letters: उत्, अङ्, सिच्, कु, रु are one sound (→ 1.1.52); डा and णल् count their first letter. Augments and case/number rules are outside it. (Bhāṣya: “नानुबन्धकृतमनेकाल्त्वं भवतीति”)
- Quote source: bhashya 11055

## 1.1.56 स्थानिवदादेशोऽनल्विधौ

- Current gloss: the replacement is treated like the replaced (sthānivat), except in single-sound rules
- Current explanation: a substitute behaves like the original (except in a rule about single sounds)

**Conditions**

- [contradicted] Only a real substitute counts: an augment, a newly introduced suffix, a nipātana, a prakṛtibhāva, a number/gender/case rule or an atideśa introduces nothing to be sthānivat. — Not taught; the step note 'X replaces Y → the replacement is treated like what it replaced' is attached to augments (ईट्, मुम्, अम्, युट्, वुक्, दुक्, नुम्, याट् …), to non-substitutes (नपुंसकम्, तुल्यम्, भाषितपुंस्कम्) and to prohibitions.
- [partly] What is inherited is the status later rules depend on (dhātu, aṅga, kṛt, taddhita, avyaya, sup, tiṅ, pada), so a later rule applies to the substitute. — The step example 'a तिङ् replacing a तिङ् is still तिङ्' shows it; gloss/explanation say only 'treated like the replaced'.
- [partly] Anal-vidhi: not for an operation that depends on a SOUND of the original (द्यौः, पन्थाः, सः). — Gloss says 'except in single-sound rules' — ambiguous (it is about rules conditioned by a sound of the original, not rules teaching one sound).
- [not taught] It is an atideśa used where a later operation is done ('… कर्तव्ये'), not in stating the substitution. — Engine-side mainly.
- [not taught] 1.1.57–1.1.59 extend and limit it for vowel substitutes. — Background.

**Contradicted texts**

- “ईट् / मुम् / अम् / युट् / वुक् / नुम् … replaces X → the replacement is treated like what it replaced” (7.3.94–98, 6.3.67, 6.3.70–72, 6.1.58, 6.1.59, 6.4.63, 6.4.88, 6.3.99, 6.4.159, 7.1.81, 7.3.38, 7.3.113, 7.4.17, 7.4.84, 7.4.90, 8.3.28) — Augments are not substitutes (BM 1.1.56: “यस्य स्थानेऽन्यद्विधीयते तत्स्थानि । येन विधीयमानेन अन्यत्प्रसक्तं निवर्तते स आदेशः ।”). These texts are not tagged with pid 1.1.56 in the input but teach its content.
- “नपुंसकम् / तुल्यम् / प्रधान-प्रत्यय-अर्थवचनम् / भाषितपुंस्कम् … replaces X → the replacement is treated like what it replaced” (2.4.25, 1.2.57, 1.2.56, 7.1.74, 3.3.116, 7.3.25) — Gender, number and atideśa rules introduce no substitute.
- “… आदेशो न भवति … → the replacement is treated like what it replaced” (3.1.51, 6.4.85, 7.1.11, 7.3.59, 7.3.60) — Prohibitions: nothing is substituted.

**Proposed**

- Gloss (127): a substitute keeps the original's status (dhātu, aṅga, sup, tiṅ …) — but not for a rule that depends on a sound of the original
- Explanation (319): A substitute counts as the original for later rules that depend on its status (dhātu, aṅga, kṛt, sup, tiṅ, pada), not for a rule that depends on one of its sounds (द्यौः, पन्थाः). Only a real substitute — not an augment, a new suffix or a prohibition. (Kāśikā: “अनल्विधाविति किम्? द्युपथित्यदादेशा न स्थानिवद् भवन्ति।”)
- Quote source: kashika 11056

## 1.1.60 अदर्शनं लोपः

- Current gloss: लोप = non-appearance (and it counts as a replacement)
- Current explanation: (none)

**Conditions**

- [partly] लोप is the non-appearance of what was DUE (प्रसक्तस्य), a saṃjñā needed to read every vṛtti using the word. — Gloss says 'non-appearance' without 'of what was due'; no explanation.
- [taught] स्थाने is carried in: lopa takes the place of what it removes (so it 'counts as a replacement'). — Gloss and the 1.3.9 card.

**Proposed**

- Gloss (98): लोप = the non-appearance of what would otherwise appear; it stands in the place of what it removes
- Explanation (277): लोप names the disappearance of an element that was due to appear. It stands in the place of what it removes, so it is treated as a substitute: on a longer item it removes only the last sound (1.1.52) unless the rule says otherwise. (Kāśikā: “प्रसक्तस्यादर्शनं लोपसंज्ञं भवति।”)
- Quote source: kashika 11060

## 1.1.61 प्रत्ययस्य लुक्श्लुलुपः

- Current gloss: cited by the paribhāṣā audit
- Current explanation: (none)

**Conditions**

- [contradicted] लुक्, श्लु, लुप् name the disappearance of a whole SUFFIX; a sūtra says लुक् precisely to remove the whole suffix. — The gloss shown is the placeholder 'cited by the paribhāṣā audit' — nothing is taught — and the 6.4.104 step says the replacement 'replaces the LAST sound'.

**Contradicted texts**

- “cited by the paribhāṣā audit  [the gloss itself]” ((every page showing 1.1.61)) — A placeholder, not a gloss.
- “the place is a whole aṅga/dhātu and the replacement is one sound → it replaces the LAST sound → अन्त्यस्य अलः” (6.4.104 (7)) — चिणो लुक् removes the whole suffix (Kāśikā 6.4.104: “चिण उत्तरस्य प्रत्ययस्य लुग् भवति”).

**Proposed**

- Gloss (64): लुक्, श्लु, लुप् = names for the disappearance of a whole SUFFIX
- Explanation (315): लुक्, श्लु and लुप् name the disappearance of a suffix. A rule ordering one of them removes the whole suffix, not just its last sound, and the name matters later (1.1.63: after a लु-elision the aṅga undergoes no operation caused by that suffix). (Kāśikā: “प्रत्ययादर्शनस्य लुक्, श्लु, लुप् इत्येताः संज्ञा भवन्ति।”)
- Quote source: kashika 11061

## 1.1.62

- Current gloss: (none)
- Current explanation: (none)

**Conditions**

- [not taught] After a suffix is elided, operations conditioned by it still take place. — No gloss, no explanation.
- [not taught] 1.1.63 prohibits it for the aṅga when the elision is by a लु-word. — Only the 1.1.63 card hints at it.

**Proposed**

- Gloss (109): after a suffix is elided, the operations it causes still apply (not on the aṅga after लुक्/श्लु/लुप्, 1.1.63)
- Explanation (306): When a suffix has been elided by लोप, the operations it would cause still take place, as if it were present. 1.1.63 limits this: if the elision is by a word containing लु (लुक्, श्लु, लुप्), the aṅga undergoes no operation caused by it. (Kāśikā: “प्रत्ययलोपे कृते प्रत्ययलक्षणं प्रत्ययहेतुकं कार्यं भवति।”)
- Quote source: kashika 11062

## 1.1.64 अचोऽन्त्यादि टि

- Current gloss: टि = from the last vowel to the end
- Current explanation: (none)

**Conditions**

- [taught] टि = the part from the last vowel to the end. — Gloss.
- [contradicted] A rule on the टि (टेः) affects that whole piece; 1.1.52 does not narrow it. — No explanation; the 6.4.144 step says 'replaces the LAST sound'.

**Contradicted texts**

- “the place is a whole aṅga/dhātu and the replacement is one sound → it replaces the LAST sound → अन्त्यस्य अलः” (6.4.144 (2)) — The lopa is of the whole टि (Kāśikā 6.4.144: “नकारान्तस्य भस्य टेर्लोपो भवति”).

**Proposed**

- Gloss (53): टि = the last vowel together with everything after it
- Explanation (269): टि names the last vowel of a word together with everything after it. A rule that operates on the टि (टेः) affects that whole piece: टित आत्मनेपदानां टेरे replaces it with ए, नस्तद्धिते drops it. (Kāśikā: “अचां संनिविष्टानां योऽन्त्योऽच्, तदादि शब्दरूपं टिसंज्ञं भवति।”)
- Quote source: kashika 11064

## 1.1.65 अलोऽन्त्यात् पूर्व उपधा

- Current gloss: उपधा = the sound before the last
- Current explanation: (none)

**Conditions**

- [partly] उपधा = the ONE sound just before the last; never a group (शिष्टः). — Gloss 'the sound before the last' implies one sound; no explanation.
- [contradicted] A rule on the उपधा changes that sound, not the last one. — The 6.4.34 step says the इ 'replaces the LAST sound'.

**Contradicted texts**

- “इ: a single sound → it replaces the LAST sound” (6.4.34 (9)) — इ replaces the उपधा of शास् (Kāśikā 6.4.34: “शास उपधाया इकारादेशो भवति”).

**Proposed**

- Gloss (47): उपधा = the ONE sound just before the last sound
- Explanation (250): उपधा names the single sound just before the final sound of a word or root — one sound only, never a group. A rule on the उपधा changes that sound, not the last one (शास् → शिष्टः: the आ becomes इ). (Kaumudī: “अन्त्यादलः पूर्वो वर्ण उपधासंज्ञः स्यात्”)
- Quote source: kaumudi 11065

## 1.1.66 तस्मिन्निति निर्दिष्टे पूर्वस्य

- Current gloss: 7th-case trigger → operation on what precedes
- Current explanation: a word in the 7th case names what must FOLLOW — so we read “… परे”

**Conditions**

- [contradicted] Only a 7th naming a WORD-FORM that follows (a sound, suffix or word) — never a 7th naming a meaning, circumstance or domain (जनपदे, अतिशायने), a viṣaya-saptamī (आर्धधातुके 2.4.35) or a bhāva-lakṣaṇa 7th (क्ङिति 1.1.5). — The explanation says every 7th-case word 'names what must FOLLOW' — the sources deny this for meaning, viṣaya and nimitta 7ths.
- [not taught] Immediacy: the operation falls on what IMMEDIATELY precedes, with no sound between (अग्निचिदत्र). — Not said.
- [not taught] When a sūtra has both a 5th and a 7th, the 5th wins and the operation falls on the 7th-named element itself (तास्यादिभ्यः …). — Not said.
- [taught] The operation is on the element BEFORE the 7th-named one (niyama). — Gloss.
- [not taught] Where the 7th-named item is itself the recipient (iṭ), 1.1.66 does not decide. — Background.
- [not taught] By lakṣya it does not apply in कर्तृकर्मणोः कृति; ekādeśa rules take both neighbours. — Background.

**Contradicted texts**

- “a word in the 7th case names what must FOLLOW — so we read “… परे”  [the general explanation]” (1.1.16 (891 cards of this pattern)) — Over-broad: Bhāṣya 1.1.66 “अर्थे मा भूत्”, Kāśikā 2.4.35 “विषयसप्तमी चेयं न परसप्तमी”. Correct on most cards, wrong wherever the 7th names a meaning or domain.

**Proposed**

- Gloss (103): a 7th-case word naming a following sound/suffix/word → the operation is on what IMMEDIATELY precedes it
- Explanation (315): A 7th-case word naming a following sound, suffix or word (“… परे”) puts the operation on what comes immediately before it. Not a 7th naming a meaning or domain (आर्धधातुके as ‘in its sphere’); if the rule also has a 5th, the 5th wins. (Bhāṣya: “शब्दे सप्तम्या निर्दिष्टे पूर्वस्य कार्यं यथा स्यात्। अर्थे मा भूत्।”)
- Quote source: bhashya 11066

## 1.1.67 तस्मादित्युत्तरस्य

- Current gloss: 5th case → the operation falls on what FOLLOWS it, an element already there (not the placing of a new suffix — that is 3.1.2 परश्च)
- Current explanation: a word in the 5th case: the operation falls on what comes AFTER it — so we read “… उत्तरस्य / परस्य”

**Conditions**

- [not taught] Immediacy (from 1.1.66): the operation falls on what IMMEDIATELY follows; a sūtra that allows an intervener overrides only that part. — Not said.
- [taught] The element must already be there; placing a NEW suffix is 3.1.2 परश्च, not 1.1.67. — Gloss.
- [not taught] Only a 5th of direction: not a 5th of cause, distance, ‘other than’, or where the sūtra itself says पूर्व / प्राक् / आङ्. — Not said.
- [not taught] Both 5th and 7th: the 5th wins, except where the 7th has no other use (7.2.82 आने मुक्; 6.1.75–76 tuk on the long vowel). — Not said.
- [not taught] Two equivalent readings (niyama / ṣaṣṭhī-prakḷpti); it works in the tripādī too. — Background.

**Proposed**

- Gloss (117): 5th-case word → the operation falls on what IMMEDIATELY follows, an element already there (placing a suffix is 3.1.2)
- Explanation (316): A 5th-case word of direction (‘after X’) puts the operation on what comes immediately after it — something already there (substitute, augment, elision, accent). Placing a new suffix is 3.1.2; a 5th of cause or ‘other than’, or an explicit पूर्व, is not this rule. (Kāśikā: “पञ्चम्यर्थनिर्देश उत्तरस्यैव कार्यं भवति”)
- Quote source: kashika 11067

## 1.1.68 स्वं रूपं शब्दस्याशब्दसंज्ञा

- Current gloss: a word stands for its own form, unless it is a technical term
- Current explanation: a word in a rule means ITSELF (its own form), not its meaning — unless it is a technical name

**Conditions**

- [contradicted] Where the rule word is meant for its SENSE (अर्थपरो निर्देशः) — signalled by a plural, पद, नाम, आख्या, -अर्थ, -वाचिन्, or a word naming a class of words — it does not stand for its own form. — Not taught; the per-word card '<X> here means the word X itself' is printed for the 5.4.87 list including एकदेश, which the Kāśikā reads by sense (पूर्वरात्रः, अपररात्रः).
- [taught] A word stands for its own form, not its meaning or synonyms. — Gloss, explanation, cards.
- [taught] A technical term names its members (घु, घ; also कर्म, करण). — 'unless it is a technical name'.
- [not taught] Marked words: sit → species; pit → synonyms + species + own; jit → synonyms only; jhit → own + species (vārttikas 5–8). — Matters only at the few marked sūtras (2.4.12, 3.4.40, 2.4.23, 4.4.35).
- [not taught] Scope: words of the rule (own or carried); a word the commentator adds for a nipātana is not one. — Engine-side.
- [not taught] The Bhāṣya at one point drops the sūtra (pratyākhyāta). — Background.

**Contradicted texts**

- “अहन्-सर्व-एकदेश-सङ्ख्यात-पुण्य here means the word अहन्-सर्व-एकदेश-सङ्ख्यात-पुण्य itself, not its meaning or its synonyms” (5.4.87 (2)) — एकदेश is read by sense — words for a part of the night (Kāśikā 5.4.87: “एकदेशे — पूर्वं रात्रेः पूर्वरात्रः। अपररात्रः।”). Also the card hyphen-joins the whole list as one 'word'.
- “(कुण्ड here means the word (कुण्ड itself …” (3.1.130 (13), 6.4.175) — Display defect: a stray '(' is taken into the word.

**Proposed**

- Gloss (124): a word in a rule stands for its own form, not its meaning or synonyms — unless it is a technical term or meant for its sense
- Explanation (306): A word quoted in a rule stands for that word-form, not its meaning or synonyms (अग्नि → only the word अग्नि). Not so for a technical term (घु names its members), nor where the rule plainly means the sense — e.g. a plural, or -अर्थ, -वाचिन्. (Kāśikā: “शास्त्रे स्वमेव रूपं शब्दस्य ग्राह्यं … न बाह्योऽर्थः”)
- Quote source: kashika 11068

## 1.1.69 अणुदित् सवर्णस्य चाप्रत्ययः

- Current gloss: aṇ / an udit sound denotes its savarṇas (उदित् = the whole varga)
- Current explanation: a vowel/अण् (or an उदित्) also stands for its savarṇas

**Conditions**

- [not taught] Not for a sound that is itself being taught (भाव्यमान, अप्रत्यय) — a substitute or suffix stands only for itself. — Not said; the rule text's अप्रत्ययः is never explained.
- [not taught] Not for a tapara sound: only 1.1.70 governs those. — Not said.
- [taught] An अण् (later ण्) or an उदित् stands for its savarṇas too (उ = उवर्ण, कु = कवर्ग). — Gloss, explanation, steps.
- [not taught] Not yet in force for the अच् of 1.1.10. — Background.

**Proposed**

- Gloss (120): an अण् or an उदित् also stands for its savarṇas (कु = the k-class) — not when it is what is taught, nor with त् (1.1.70)
- Explanation (295): An अण् (vowels, semivowels, ह) or an उदित् (कु = the k-class) in a rule also stands for its savarṇas: उ = उवर्ण, short, long and pluta. Not when that sound is itself what the rule introduces, and not when त् follows it — then only 1.1.70. (Kaumudī: “अविधीयमानोऽण् उदिच्च सवर्णस्य संज्ञा स्यात्”)
- Quote source: kaumudi 11069

## 1.1.70 तपरस्तत्कालस्य

- Current gloss: a sound with त् after it denotes only its own length
- Current explanation: a vowel with त् after it (तपर) means only that one length

**Conditions**

- [contradicted] Length is the sound's OWN: अत् = short अ, but आत् = long आ, ईत्/ऊत् = long, एत्/ऐत्/ओत्/औत् = the two-mora vowel (pluta excluded). — Not taught; 24 sūtras print 'only the short आ' (16) or 'only the short ए/ओ/औ' (8) — some steps carry an audit correction, but the cards still show the wrong text.
- [not taught] Not a tapara at all: आत् as the 5th case of अ (आद्गुणः), a त् that belongs to the form (वृक्षात्, ददति), a त् that is a suffix's marker, ऋतोः = ‘season’. — Not said.
- [not taught] A त् said to be only for ease of pronunciation does no 1.1.70 work at that sūtra. — Not said.
- [not taught] A vowel AFTER त् is also tapara (तादपि परस्तपरः). — Minor.
- [taught] A tapara stands only for sounds of its own length. — Gloss and explanation.
- [not taught] Covers every tapara, incl. substitutes (6.4.41 example). — Background.

**Contradicted texts**

- “a vowel with त् after it (तपर) means only that one length — only the short आ” (3.1.136 (43 cards of this pattern); 'only the short आ' at 16 sūtras: 3.1.136, 3.1.141, 3.2.3, 3.2.74, 3.3.106, 3.3.128, 5.2.96, 6.4.42, 6.4.43, 6.4.45, 6.4.64, 6.4.112, 6.4.140, 7.1.51, 7.1.52, 7.3.33) — आत् is long आ only (Kāśikā 3.1.136: “आकारान्तेभ्यो धातुभ्य”; Kāśikā 1.1.70: “तत्कालस्यात्मना तुल्यकालस्य”).
- “… (तपर) → only the short ए / ओ / औ” (1.1.15, 3.4.96, 5.4.11, 6.3.112, 6.4.119, 7.3.71, 7.3.103, 7.3.118) — ए/ओ/ऐ/औ have no short; एत्/ओत् etc. mean the two-mora vowel, excluding pluta. 7.1.51, 7.1.52, 7.3.71 have no audit correction at all.

**Proposed**

- Gloss (102): a vowel with त् (तपर) stands only for its own length: अत् = short अ, आत् = long आ, एत् = ए (not pluta)
- Explanation (296): A vowel with त् after it stands only for vowels of its own length: अत् = short अ, आत् = long आ, एत्/ओत् = two-mora ए/ओ, not pluta. Check it is a real tapara: आत् may be the 5th case of अ (आद्गुणः), and a त् may belong to the form. (Kāśikā: “तपरो वर्णस्तत्कालस्यात्मना तुल्यकालस्य … ग्राहको भवति”)
- Quote source: kashika 11070

## 1.1.71 आदिरन्त्येन सहेता

- Current gloss: a sound group: first sound + final marker = all in between
- Current explanation: a pratyāhāra (first sound + an इत् letter) means every sound from the first up to the one before that इत्

**Conditions**

- [not taught] Look-alikes are not pratyāhāras: the feminine आप् (टाप्/डाप्/चाप्), a root (इण्, आप्ऌ), a noun (हल, शर), a taddhita (यञ्, अण्). — Not said.
- [taught] First element + a final इत् = all between, and itself. — Gloss, explanation, cards.
- [partly] Covers suffix pratyāhāras (सुप्, तिङ्, सुट्), not only sounds. — Explanation says 'every sound'; steps say 'sound/suffix group'.
- [not taught] इक् via 1.1.3 only where no other place is named. — Background (see 1.1.3).

**Proposed**

- Gloss (111): a pratyāhāra: first item + a final इत् marker = everything from that item up to the marker (sounds or suffixes)
- Explanation (320): A first element said with a later इत् letter names everything from it up to that marker: अच् = the vowels, सुप् = the case endings, तिङ् = the verb endings. Look-alikes are not pratyāhāras: feminine आप् (टाप्, डाप्), a root like इण्, a suffix like अण्. (Kaumudī: “अन्त्येनेता सहित आदिर्मध्यगानां स्वस्य च संज्ञा स्यात्”)
- Quote source: kaumudi 11071

## 1.1.72 येन विधिस्तदन्तस्य

- Current gloss: a qualifier (viśeṣaṇa), agreeing with the word it qualifies (viśeṣya), stands for whatever ENDS in it (tadanta) — only the qualifier, never the qualified word
- Current explanation: a qualifier (viśeṣaṇa), agreeing with the word it qualifies (viśeṣya), stands for whatever ENDS in it — so we read “…-अन्त”; only the qualifier, never the qualified word (Nyāsa: “विशेषणेन च तदन्तविधिः, न विशेष्येण”)

**Conditions**

- [not taught] Vārttika 1: no tadanta in rules that prescribe a samāsa or a suffix after a named word (नडादिभ्यः फक् does not reach सूत्रनड) — unless the qualifier is a sound or an ugit (vt.2) or a lift applies (strī section, compounds, listed prayojanas). — The deciding limit of 1.1.72 in suffix/compound rules is never stated on 1.1.72's own cards; only the vt.2 cards ('…so the block is lifted') presuppose it.
- [not taught] A 7th-case sound naming the condition gives tadādi (what BEGINS with it) — PIS 33, an apavāda of tadanta. — Not said.
- [not taught] In the pada and aṅga headings a NAMED word also gets tadanta (परममहान्); a sound qualifier gets it everywhere. — Not said.
- [taught] A viśeṣya must be present (direct, by heading, or implied); none in एचोऽयवायावः, आद्गुणः. — 'agreeing with the word it qualifies'; cards name the viśeṣya.
- [taught] Only the qualifier, never the viśeṣya; a qualifier of the sound (असंयोगपूर्व) qualifies the sound. — Gloss and explanation.
- [not taught] A meaningless qualifier gives tadanta only if one sound, plus अन्/इन्/अस्/मन् (PIS 16). — Background.
- [not taught] A named suffix → PIS 23; explicit -अन्त needs no paribhāṣā. — Cross-reference.

**Proposed**

- Gloss (129): a qualifier agreeing with the word it qualifies stands for what ENDS in it — never the qualified word; not in samāsa/suffix rules
- Explanation (320): A qualifier (viśeṣaṇa) agreeing with the word it qualifies stands for whatever ends in it (“…-अन्त”), never for the qualified word. But in rules that form a samāsa or add a suffix, a named word is not extended (नडादिभ्यः फक् does not reach सूत्रनड) unless it is a sound or an ugit. (Bhāṣya: “समासप्रत्ययविधौ प्रतिषेधः।”)
- Quote source: bhashya 11072

## 1.1.72 vt.2 उगिद्वर्णग्रहणवर्जम्

- Current gloss: …except an ugit or a SOUND as qualifier
- Current explanation: (none)

**Conditions**

- [not taught] The bar it lifts: vārttika 1 — no tadanta in a samāsa- or suffix-rule after a named base. — No explanation; the gloss '…except an ugit or a SOUND as qualifier' starts mid-sentence.
- [taught] The exception: the qualifier is an ugit (उगितश्च → भवती, अतिभवती) or a sound (अत इञ् → दाक्षिः). — Gloss and cards.
- [partly] The 'sound' must really be a sound: not a homonymous root/noun/saṃjñā, not a suffix name (PIS 23), not an उपधा/आदि qualifier, not a बह्वच्/द्व्यच् bahuvrīhi. — The steps at 4.2.123 and 4.3.72 carry audit corrections making exactly this point; the general text does not.
- [not taught] Kṛt rules with a sound-qualified dhātu: Śekhara says vt.1 never arises there. — Background (credits kept, flagged).

**Proposed**

- Gloss (114): in samāsa/suffix rules a named base is not read as ‘ending in it’ (vt.1) — except an ugit or a single sound (vt.2)
- Explanation (286): Vārttika 1 stops 1.1.72 in rules that form a samāsa or add a suffix after a named base (नडादिभ्यः फक् does not reach सूत्रनड). Vārttika 2 lifts the bar when the qualifier is an ugit (उगितश्च → अतिभवती) or a real sound (अत इञ् → दाक्षिः). (Bhāṣya: “उगिद्ग्रहणं वर्णग्रहणं च वर्जयित्वा।”)
- Quote source: bhashya 11072

## 1.2.28 अचश्च

- Current gloss: cited by the paribhāṣā audit
- Current explanation: (none)

**Conditions**

- [contradicted] ह्रस्व, दीर्घ, प्लुत taught by those names replace only a vowel; अचः (6th) is supplied. — The gloss shown is the placeholder 'cited by the paribhāṣā audit'; only the 1.2.47 / 7.4.25 cards teach it.
- [partly] Only when taught by these NAMES: a vowel named by its own form, or a substitute for the whole टि (8.2.89), is outside it. — The 1.2.47 card says 'taught by its own name'; the rest is not said.
- [not taught] Its visible work is where the named place could end in a consonant (सुवाग्, अग्निचि३त्). — Not said.
- [not taught] A prohibition of the long/short teaches nothing to restrict. — Minor.

**Contradicted texts**

- “cited by the paribhāṣā audit  [the gloss itself]” ((every page showing 1.2.28)) — A placeholder, not a gloss.

**Proposed**

- Gloss (81): ह्रस्व, दीर्घ, प्लुत taught by those names replace only a VOWEL (अचः is supplied)
- Explanation (318): When a rule teaches ह्रस्व, दीर्घ or प्लुत by those names, only a vowel is replaced: अचः is supplied, so in an item ending in a consonant its vowel changes, never the consonant (सुवाग्, अग्निचि३त्). Not when a vowel is named by its own form. (Kāśikā: “ह्रस्वदीर्घप्लुताः स्वसंज्ञया शिष्यमाणा अच एव स्थाने वेदितव्याः।”)
- Quote source: kashika 12028

## 1.3.10 यथासंख्यमनुदेशः समानाम्

- Current gloss: equal lists pair up in order (yathāsaṅkhya)
- Current explanation: when two lists have the same number of members they pair up IN ORDER (yathāsaṅkhya)

**Conditions**

- [not taught] Only where intended: where the tradition says yathāsaṅkhya is not wanted (frequent: “यथासंख्यमत्र नेष्यते”, a yogavibhāga to avoid it), it does not apply. — Not said; the student is never warned that two equal lists may not pair.
- [not taught] Where a class name (इ, उ = 18 sounds) or nearness decides the match, it is 1.1.50, not 1.3.10. — Not said.
- [taught] Equal lists pair in order. — Gloss, explanation, cards.
- [partly] Unequal lists do not pair (1.4.90: all with all). — Implied by 'same number'.
- [partly] The lists may be two lists of conditions with one thing taught (समूलाकृतजीवेषु हन्कृञ्ग्रहः). — Cards at 3.2.186 and 4.1.87 show such pairings.

**Proposed**

- Gloss (114): two lists of the same length pair up in order (yathāsaṅkhya) — unless the commentary says the pairing is not meant
- Explanation (320): When a rule has two lists with the same number of members, first goes with first, second with second. Unequal lists do not pair; where the commentators say the pairing is not meant, it does not apply; where nearness decides, it is 1.1.50. (Kāśikā: “स्वरितेन लिङ्गेन यथासंख्यम्, यत्र नेष्यते तत्र स्वरितत्वं न प्रतिज्ञा”)
- Quote source: kashika 13010

## 1.3.2

- Current gloss: (none)
- Current explanation: (none)

**Conditions**

- [not taught] In upadeśa a nasalised vowel is an इत्; such a vowel can also close a pratyāhāra (र = र्, ल् with the अँ of लँण्). — No gloss or explanation; only the 1.1.71 card refers to 1.3.2–3.

**Proposed**

- Gloss (80): in the grammar's own statements (upadeśa) a nasalised vowel is an इत् (a marker)
- Explanation (216): In the grammar's own statements (upadeśa) a nasalised vowel is an इत्, a marker letter. It can also close a pratyāhāra: र (= र्, ल्) is formed with the nasal अँ of लँण्. (Kāśikā: “तत्र योऽनुनासिकः स इत्संज्ञो भवति।”)
- Quote source: kashika 13002

## 1.4.13 यस्मात् प्रत्ययविधिस्तदादि प्रत्ययेऽङ्गम्

- Current gloss: the aṅga = what a suffix is introduced after (with whatever begins it), when that suffix follows
- Current explanation: what a suffix is added after is the AṄGA of that suffix

**Conditions**

- [not taught] Where the term works: the अङ्गस्य heading 6.4.1 runs to the end of book 7, not into book 8 (there a rule says अङ्ग itself if it needs it). — Not said.
- [contradicted] अङ्गस्य is a 6th of general relation, re-cast per rule — it names the base, not necessarily what is replaced, and is not in apposition to the suffix. — Not taught; steps print 'अङ्गस्य (carried from 6.4.1) → what is replaced' (6.4.47, 6.4.49, 6.4.63).
- [taught] Only a suffix enjoined after the base makes it an aṅga (स्त्री इयती: merely standing before is not enough); the aṅga is relative to that suffix. — Gloss: 'what a suffix is introduced after … when that suffix follows'.
- [partly] तदादि: whatever begins with the base counts — vikaraṇa (स्य, शप्), augment (नुम्). — Gloss 'with whatever begins it' is opaque.
- [taught] It stops before that suffix. — Implied.
- [not taught] Distinct from ordinary aṅga 'limb'; coexists with bha/pada. — Background.

**Contradicted texts**

- “अङ्गस्य (carried from 6.4.1) → what is replaced: “अङ्गस्य”” (6.4.63 (27; also 6.4.47 (28), 6.4.49 (30))) — See 1.1.49: at 6.4.63 nothing is replaced (युट् augment); at 6.4.49 the य् is what goes. Kāśikā 6.4.1: “संबन्धसामान्य एषा षष्ठी यथायोगं विशेषेष्ववतिष्ठते”.

**Proposed**

- Gloss (118): aṅga = the base a suffix was introduced after, with anything added to it (vikaraṇa, augment), when that suffix follows
- Explanation (313): What a suffix was introduced after — a dhātu or prātipadika, with any vikaraṇa or augment added to it — is the aṅga of that suffix. The अङ्गस्य heading (6.4.1) runs to the end of book 7; it names the base, not necessarily the part that changes. (Kāśikā: “यस्मात् प्रत्ययो विधीयते … प्रत्यये परतोऽङ्गसंज्ञं भवति।”)
- Quote source: kashika 14013

## 2.1.1 समर्थः पदविधिः

- Current gloss: (none)
- Current explanation: (none)

**Conditions**

- [not taught] Every padavidhi (samāsa etc.) applies only to words that are समर्थ — connected in meaning. — No gloss or explanation; steps only echo “समर्थेन सुबन्तेन सह”.
- [not taught] Scope: samāsa first, but also taddhita (BM 4.1.82). — Not said.

**Proposed**

- Gloss (93): a rule that joins words (samāsa, taddhita) applies only to words connected in meaning (समर्थ)
- Explanation (293): Every rule that operates on words together — samāsa first, also taddhita — applies only to words that are समर्थ, connected in meaning so as to give the analysed sense; words merely standing side by side do not combine. (Kāśikā: “यः कश्चिदिह शास्त्रे पदविधिः श्रूयते स सर्वः समर्थो वेदितव्यः।”)
- Quote source: kashika 21001

## 3.1.92 तत्रोपपदं सप्तमीस्थम्

- Current gloss: in the dhātu section a 7th-case word is an upapada
- Current explanation: in the kṛt section a word in the 7th case is the UPAPADA, the word used alongside the dhātu

**Conditions**

- [not taught] A 7th-case word that states a MEANING (the suffix's kāraka sense, a time, a circumstance — धः कर्मणि ष्ट्रन्, भुवो भावे) is not an upapada. — Not said; the explanation calls every 7th in the section an upapada.
- [partly] Range: only the third dhātu-heading, 3.1.91–3.4.117 (not च्लि लुङि 3.1.43). — 'In the kṛt section' — approximately right.
- [not taught] An optional co-occurrence (उपसर्गेऽपि) is not an upapada: the upapada must be present for the suffix. — Not said.
- [taught] Definition: what a 7th names in the section is the upapada; the suffix comes only when it is present. — Gloss, explanation, cards.
- [not taught] 1.3.77's उपपद is non-technical. — Background.

**Proposed**

- Gloss (121): in the dhātu section (3.1.91–3.4.117) a 7th-case word naming a co-occurring word is an upapada — not one naming a meaning
- Explanation (316): In the dhātu section (3.1.91 to the end of book 3) what a sūtra names in the 7th case is the upapada, the word used with the dhātu; the suffix comes only when it is there. A 7th stating the suffix's meaning (कर्मणि in धः कर्मणि ष्ट्रन्) is not an upapada. (Bālamanoramā: “सप्तम्यन्तमर्थनिर्देशपरमेव, व्याख्यानादिति”)
- Quote source: balamanorama 31092

## 3.1.94 वाऽसरूपोऽस्त्रियाम्

- Current gloss: a dissimilar apavāda blocks the utsarga only optionally (not in the strī section)
- Current explanation: (none)

**Conditions**

- [contradicted] The utsarga is the rule the apavāda actually narrows in its own domain; suffixes for different senses (kartari vs bhāva/karman) do not block each other — the kṛtyas (3.1.95–3.1.132) are bhāva/karman only. — Not taught; cards/steps at 144 sūtras of 3.2–3.4 name a kṛtya (तव्यत्/तव्य/अनीयर्, ण्यत्, यत्) as the utsarga of kartari or other suffixes (विट्, खच्, अतृन्, शानन् …).
- [not taught] Not for lādeśas (PIS 70: सद्/वस्/श्रु take only क्वसु), not among tācchīlikas (PIS 68), not with a kriyārtha upapada, and after the strī section not for क्त, ल्युट्, तुमुन्, खल् and their senses (PIS 69). — Not said; e.g. 3.2.108 (क्वसु, a lādeśa) still gets a kṛtya-utsarga card.
- [partly] Only inside the dhātu heading (3.1.91–3.4.117). — Gloss says 'not in the strī section' but not the range.
- [not taught] Sarūpa test without markers (PIS 8): a sarūpa apavāda blocks outright. — Not said here (only on the PIS 8 card).
- [partly] Strī exception: only when both suffixes are from 3.3.94ff. — Gloss: 'not in the strī section'.
- [taught] A dissimilar apavāda blocks only optionally. — Gloss; cards 'they stay available as options'.
- [taught] Kṛtya generals तव्यत्/तव्य/अनीयर् survive beside यत् etc. — 3.1.97 card (Bhāṣya 3.1.97).
- [not taught] णमुल् section: क्त्वा comes too, except where both are taught together. — Background.

**Contradicted texts**

- “विट् is an apavāda of ण्यत् (3.1.124; अद्: ends in a consonant) → … they stay available as options” (3.2.68 (7)) — विट् is kartari; ण्यत् is a kṛtya (bhāva/karman). The audit's real utsarga is अण् (Prakriyāsarvasva: अण् beside विट्).
- “खच् is an apavāda of यत् (3.1.97; भू: ends in a vowel) → …” (3.2.45 (5)) — The audit's real utsarga is ल्युट् (Nyāsa/Tattvabodhinī: ल्युट् also beside खच्).
- “अतृन् is an apavāda of ण्यत् (3.1.124; जॄ) → …” (3.2.104 (2)) — Real utsarga: निष्ठा (Kāśikā/SK: जीर्णः beside अतृन्).
- “शानन् is an apavāda of ण्यत् (3.1.124; पू, यज्) → …” (3.2.128 (1)) — Real utsarga: लट् (Nyāsa).
- “X is an apavāda of तव्यत्, तव्य, अनीयर् / ण्यत् / यत् → they stay available as options” (144 sūtras in 3.2–3.4 (3.2.2, 3.2.4, 3.2.6 …)) — Same defect throughout: Kāśikā 3.1.94's own example pairs क with the kartari ण्वुल्/तृच्, not with a kṛtya.

**Proposed**

- Gloss (120): in the dhātu section a suffix-exception of different form leaves its general suffix optional — same sense only; not strī
- Explanation (313): In 3.1.91–3.4.117 an exception suffix whose form differs (markers ignored) from the general suffix it narrows, in the same sense, leaves the general one optional (क beside ण्वुल्/तृच्: विक्षेपकः). Not in the strī section, nor for lādeśas or tācchīlikas. (Kāśikā: “धात्वधिकारेऽसमानरूपोऽपवादप्रत्ययो वा बाधको भवति”)
- Quote source: kashika 31094

## 3.3.108 vt.2 इक्श्तिपौ धातुनिर्देशे

- Current gloss: a dhātu is cited with इक् or श्तिप् (मृजि, अस्ति, जहाति…)
- Current explanation: (none)

**Conditions**

- [not taught] Optional: a root may be cited bare (दृशः, यजः, खनः) — not an instance of इक्/श्तिप्. — Not said.
- [not taught] Not every final -इ is इक्: an इ for pronunciation (वयि, गमि), an incidental इ, a ṇyanta stem (पूरि). — Not said.
- [taught] The श्तिप् form carries the vikaraṇa and so picks out one of several homonymous roots (कवतेः, दयतेः). — The 7.3.63 card names 'the Kāśikā's choice among 2 roots'.
- [taught] Two suffixes for CITING a dhātu by name. — Gloss and cards.
- [partly] Names dhātus only. — Implied by 'a dhātu is cited'.

**Proposed**

- Gloss (112): a dhātu may be cited by name with इक् (भिदि) or श्तिप् (पचति); a bare root or an इ for pronunciation is not this
- Explanation (314): A vārttika lets a dhātu be cited by name with इक् (भिदि, छिदि) or श्तिप् (पचति — with its vikaraṇa, which picks the root: दयतेः = दीङ्). It is optional: a bare root (दृशः) is not an instance, and an इ added only for pronunciation (वयि, गमि) is not इक्. (Bhāṣya: “इक्श्तिपावित्येतौ प्रत्ययौ धातुनिर्देशे वक्तव्यौ।”)
- Quote source: bhashya 33108

## 4.1.82 समर्थानां प्रथमाद्वा

- Current gloss: a taddhita suffix comes after the first of the semantically connected words, in the case the sūtra names (samartha)
- Current explanation: a taddhita suffix goes after the first of the words able to take it, standing in the case the rule names

**Conditions**

- [not taught] Range: a heading over 4.1.83 up to 5.2.140; from 5.3.1 समर्थ and प्रथम stop and only वा continues. — Not said.
- [not taught] वा: every taddhita here is optional against the plain phrase (उपगोरपत्यम्). — The gloss and explanation leave out वा entirely.
- [partly] प्रथम = the word in the case the defining sentence uses (तस्य, तेन, तत्र …), not the word naming the suffix's meaning (अस्य, अपत्यम्). — 'In the case the sūtra names' — the pratyayārtha exclusion is not said.
- [not taught] Svārthika suffixes: समर्थ/प्रथम have nothing to work on; some are obligatory. — Background.
- [not taught] Rules that only elide, substitute or prohibit get nothing from it unless a commentator reads it in. — Engine-side.
- [not taught] Nipātanas: case, suffix and meaning come from the form. — Background.

**Proposed**

- Gloss (113): a taddhita comes, optionally, after the FIRST-named word, in the case its defining sentence uses (4.1.83–5.2.140)
- Explanation (304): From 4.1.83 to 5.2.140 a taddhita comes, optionally (the phrase stays possible: उपगोरपत्यम्), after the first-named word — the one in the case its defining sentence uses (तस्य in तस्यापत्यम्), not the word for the meaning. From 5.3.1 only the option goes on. (Kāśikā: “वेति किम्? वाक्यमपि हि यथा स्यात्”)
- Quote source: kashika 41082

## 6.1.158

- Current gloss: (none)
- Current explanation: (none)

**Conditions**

- [partly] Wherever a rule gives one vowel udātta/svarita, the rest of the pada is anudātta; the one excepted is the vowel the rule accents. — No gloss or explanation; the 3.1.3 and 6.2.27 cards say it.
- [not taught] Kāryakāla: present at every such accent rule in the whole text. — Not said.
- [not taught] Domain is the pada, not the sentence. — Not said.
- [not taught] A tripādī accent is asiddha for it (8.4.66), except the ekādeśa-svara (8.2.5 vārttika). — Background.
- [not taught] Rules teaching two udāttas at once override it. — Background.

**Proposed**

- Gloss (90): where a rule gives one vowel udātta or svarita, every other vowel of that pada is anudātta
- Explanation (297): Wherever a rule makes one vowel udātta or svarita, every other vowel of that pada becomes anudātta — the one kept is the vowel the rule accents. It is read into every such rule, works within one pada, and tripādī accents are asiddha for it. (Kāśikā: “कः पुनरेको वर्ज्यते ? यस्यासौ स्वरो विधीयते।”)
- Quote source: kashika 61158

## 8.2.1

- Current gloss: (none)
- Current explanation: (none)

**Conditions**

- [not taught] A heading to the end of the text: each later rule is asiddha for every earlier one (the first 7¼ books, and within the tripādī). — No gloss, explanation or card.
- [not taught] It runs into every tripādī sūtra and forms one sentence with it. — Not said (only 'पूर्वत्रासिद्धम् → carried in' in step lists).
- [not taught] Limits on its effect: नलोप is asiddha only for sup/svara/saṃjñā/kṛt-tuk (8.2.2); some vārttikas make operations siddha. — Background.

**Proposed**

- Gloss (96): from here to the end, each later rule counts as not yet applied (asiddha) for every earlier rule
- Explanation (287): पूर्वत्रासिद्धम् heads 8.2.1 to the end of the Aṣṭādhyāyī: each later rule counts as not having applied for all earlier rules — the first seven and a quarter books and the earlier tripādī rules alike. It runs into every tripādī sūtra. (Kāśikā: “उत्तरो योगः पूर्वत्रपूर्वत्रासिद्धो भवति”)
- Quote source: kashika 82001

## PIS 119

- Current gloss: (none)
- Current explanation: (none)

**Conditions**

- [not taught] A nipātana is taught only where a general rule would apply, so in its own domain it blocks that rule (the regular form is not also right); the rival view is against the Bhāṣya. — No gloss, explanation or card.
- [not taught] Scope: the sūtra must state a ready-made form (निपात्यते); a time rule or saṃjñā that validates words another way is not a nipātana. — Not said.
- [not taught] Not where the text says the regular form is also used; with an optional nipātana blocking makes no difference. — Not said.

**Proposed**

- Gloss (113): a ready-made form (nipātana) blocks the general rule in its own domain — the regular form is not also right there
- Explanation (310): A sūtra gives a ready-made form (निपात्यते) only where some general rule would otherwise apply, so in its own domain it blocks that rule: the regular form is not also correct. Not where the text says the regular form is used too, or keeps it as an option. (Śekhara: “अबाधकान्यपि निपातनानीति तु भाष्यविरुद्धम्”)
- Quote source: paribhashendushekhar 119

## PIS 122 अनिर्दिष्टार्थाः प्रत्ययाः स्वार्थे

- Current gloss: a suffix with no stated meaning has the base’s own meaning
- Current explanation: (none)

**Conditions**

- [taught] A suffix taught with no meaning has the meaning of its own base (स्वीयप्रकृत्यर्थ). — Gloss and the 4.4.141 card.
- [not taught] Where a sūtra names a meaning (कारके, कर्तरि), the maxim does not apply to that suffix — it is the reason such a sūtra is needed. — Not said.
- [not taught] Bhāṣya examples: गुप्तिज्किद्भ्यः सन्, यावादिभ्यः कन्. — Background.

**Proposed**

- Gloss (70): a suffix taught with no meaning has the meaning of its base (स्वार्थे)
- Explanation (293): When a sūtra teaches a suffix without stating a meaning for it (यावादिभ्यः कन्), the suffix adds no meaning of its own: it carries the meaning of its base. Where a sūtra names a meaning for the suffix (कर्तरि, कारके), this does not apply. (Śekhara: “स्वार्थ इत्यस्य स्वीयप्रकृत्यर्थ इत्यर्थः”)
- Quote source: paribhashendushekhar 122

## PIS 123

- Current gloss: (none)
- Current explanation: (none)

**Conditions**

- [not taught] A commentator's split of one sūtra into two (योगविभाग) may be used only to get desired forms, never wrong ones. — No gloss, explanation or card. The audit reports the engine's wording 'the sūtra is stated separately for a purpose' — which misreads the maxim — check wherever it is shown.
- [not taught] Covers only a split made by commentators of the sūtra being read (कर्तव्यः / क्रियते / योगं विभज्य). — Not said.
- [not taught] Not a remark on why Pāṇini himself wrote two sūtras (उत्तरार्थः, यथासंख्यनिरासार्थः); not a split of ANOTHER sūtra for an example; not a jñāpaka. — Not said.

**Proposed**

- Gloss (105): a commentator's split of one sūtra into two (yogavibhāga) may only yield accepted forms, never wrong ones
- Explanation (314): When commentators divide one sūtra into two (योगविभाग) to account for a form the whole sūtra does not give, the split may be used only to reach accepted forms, never to produce wrong ones. A remark on why Pāṇini himself wrote two sūtras is not this maxim. (Śekhara: “इष्टसिद्धिरेव न त्वनिष्टापादनं कार्यमित्यर्थः”)
- Quote source: paribhashendushekhar 123

## PIS 18

- Current gloss: (none)
- Current explanation: (none)

**Conditions**

- [partly] Sometimes only part of an earlier word runs on by anuvṛtti (Bhāṣya at 4.1.27, 6.1.93; Kāśikā 6.1.131: पद of पदान्तात्). — No gloss or explanation; the 6.1.131 card says it.

**Proposed**

- Gloss (71): sometimes only PART of an earlier word runs on (e.g. पद from पदान्तात्)
- Explanation (225): Occasionally only part of a word in an earlier sūtra continues by anuvṛtti, not the whole word: at 6.1.131 only पद of पदान्तात् (6.1.109) runs on. The commentators say where this happens. (Śekhara: “क्वचिदेकदेशोऽप्यनुवर्तते”)
- Quote source: paribhashendushekhar 18

## PIS 23 प्रत्ययग्रहणे यस्मात्स विहितस्तदादेस्तदन्तस्य ग्रहणम्

- Current gloss: a suffix named = the word from its base up to the suffix
- Current explanation: a suffix named in a rule stands for the word that ENDS in that suffix (starting from what it was added to)

**Conditions**

- [contradicted] Not in saṃjñā rules (PIS 27; jñāpaka सुप्तिङन्तम्) — where commentators still read tadanta (1.1.23, 1.1.38, 1.2.46) they justify it by sāmarthya or अर्थवत्. — Not taught; the generic card is printed at 1.1.23 (and the step at 1.1.25) crediting PIS 23 in saṃjñā rules.
- [not taught] When the suffix is the condition (a 7th, ‘when X follows’), only the tadādi part applies. — Not said.
- [not taught] A suffix must be NAMED as a known element: not one being prescribed or changed (luk, ādeśa, its own accent), not part of a nipātana, not a homonym. — Not said.
- [not taught] In the uttarapada heading a suffix means only itself (PIS 25). — Not said.
- [not taught] Only where suffixes alone are named (not a term covering suffix and non-suffix). — Minor.
- [taught] Definition: a named suffix = the word from its base up to the suffix. — Gloss, explanation, cards.
- [not taught] PIS 24, 26, 28; anarthaka अन्/इन्/अस्/मन् go under 1.1.72. — Background.

**Contradicted texts**

- “a suffix named in a rule stands for the word that ENDS in that suffix (starting from what it was added to)” (1.1.23 (118 cards of this pattern); step 1.1.25) — Result right, reason contradicted: in a saṃjñā rule PIS 23 does not apply (Śekhara PIS 27: “संज्ञाविधौ प्रत्ययग्रहणे तदन्तग्रहणं नास्ति”); the tadanta there rests on sāmarthya.

**Proposed**

- Gloss (121): a suffix named stands for the word from its base up to that suffix — not in saṃjñā rules, nor for the suffix being taught
- Explanation (316): A suffix named as a known element stands for the word from the base it was added to up to that suffix (सन् → सन्नन्त). Not in saṃjñā rules or the uttarapada section, nor when the rule teaches or changes that suffix; as a 7th-case condition it means ‘what begins with it’. (Śekhara: “संज्ञाविधौ … तदन्तग्रहणं नास्ति”)
- Quote source: paribhashendushekhar 27

## PIS 28

- Current gloss: (none)
- Current explanation: (none)

**Conditions**

- [not taught] Where a kṛt suffix is named (in general or a particular one), the kṛdanta with a gati or kāraka before it is meant too. — No gloss, explanation or card.
- [not taught] Jñāpaka: अनन्तरः in 6.2.49, where it is set aside. — Background.

**Proposed**

- Gloss (74): a kṛt suffix named also covers the kṛdanta with a gati or kāraka before it
- Explanation (263): Where a rule names a kṛt suffix — kṛt in general or a particular one — the word with a gati or kāraka before the kṛdanta is meant too. Pāṇini's अनन्तरः in 6.2.49 shows the maxim exists, and there it is set aside. (Śekhara: “कृद्ग्रहणे गतिकारकपूर्वस्यापि ग्रहणम्”)
- Quote source: paribhashendushekhar 28

## PIS 8 नानुबन्धकृतमसारूप्यम्

- Current gloss: marker letters do not make suffixes dissimilar
- Current explanation: (none)

**Conditions**

- [partly] Scope: the sarūpa test of 3.1.94 — it only ever DENIES dissimilarity; it says nothing where suffixes differ in real sounds, and needs a real utsarga–apavāda pair in the dhātu section. — Gloss says markers do not make suffixes dissimilar, but not that this is for 3.1.94; no explanation.
- [partly] Suffixes differing only in markers (अण्/क; यत्/ण्यत्; घञ्/अच्/अप्) are sarūpa, so the apavāda blocks outright (jñāpaka: विभाषा in 3.1.139). — The 3.1.99 card says 'markers removed before comparing'; the outcome (no option) is not said.
- [not taught] PIS 6/7 share the opening नानुबन्धकृतम्… but are different maxims. — Engine-side.

**Contradicted texts**

- “श is an apavāda of तव्यत्, तव्य, अनीयर् (3.1.96; all dhātus) → श (अ) ≠ तव्यत् … → they stay available as options” (3.1.139 (2)) — The audit correction is appended but the wrong claim is still shown: Kāśikā names ण as the utsarga (“णस्यापवादः”), sarūpa with श once markers go — which is why 3.1.139 needs its own विभाषा (Śekhara PIS 8).

**Proposed**

- Gloss (115): in the sarūpa test of 3.1.94, marker letters are ignored: suffixes differing only in markers count as the same form
- Explanation (319): For 3.1.94 (an exception of different form blocks only optionally), suffixes are compared without their it-letters: अण्/क, यत्/ण्यत्, घञ्/अच्/अप् count as the same form, so such an exception blocks the general suffix outright. It never makes suffixes with different real sounds alike. (Śekhara: “नानुबन्धकृतमसारूप्यम्”)
- Quote source: paribhashendushekhar 8
