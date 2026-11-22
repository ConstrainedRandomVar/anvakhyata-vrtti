# Errata for the ashtadhyayi.com data (github.com/ashtadhyayi-com/data)

67 corrections, each checked against the current data on 2026-11-22. Every quotation is verbatim from the files named (checked by `check_quotes.js`).

- `sutraani/data.txt` and `sutraani/laghukaumudi.txt`: identical to upstream master on 2026-11-22, so every item below is still in the data.
- Quotations from the commentaries come from the copy of the repository at commit 24109f7b (2026-08-18). Upstream `kashika.txt` and `sutrartha.txt` have changed since; `check_quotes.js` also checks each Kāśikā quote against the current upstream file and reports any that no longer match.
- “prathamāvṛtti” = the Aṣṭādhyāyī-prathamāvṛtti of Brahmadatta Jijñāsu (our digitisation; padaccheda / artha / anuvṛtti sections).
- Where sources disagree, the later muni decides: Pāṇini < Kātyāyana < Patañjali (Mahābhāṣya); later commentaries rank below all three. Each item says which source settled it.
- Format: sūtra 1.1.1, data id as in the file (11001). “now” is the exact value in data.txt; “suggested” is the same value corrected.

## Field `an` (anuvṛtti list) (16)

### 3.2.94 दृशेः क्वनिप् (id 32094)

- **now:** `कृत्$31093`
- **suggested:** `कृत्$31093##कर्मणि$32093   (add कर्मणि$32093)`
- **why:** कर्मणि (the upapada) runs on into 3.2.94: “कर्मणीत्येव” (Kāśikā); मेरुदृश्वा = one who has seen Meru.
- **settled by:** Kāśikā (“कर्मणीत्येव”) with the Siddhānta-kaumudī and the prathamāvṛtti; the Mahābhāṣya has no comment on 3.2.94.
- **citations:**
  - Kāśikā on 3.2.94: “कर्मणीत्येव। दृशेर्धातोःकर्मण्युपपदे क्वनिप् प्रत्ययो भवति”
  - Siddhānta-kaumudī on 3.2.94: “कर्मणि भूत इत्येव”
  - prathamāvṛtti (Brahmadatta Jijñāsu), artha on 3.2.94: “कर्मण्युपपदे दृश्धातोः भूते काले क्वनिप् प्रत्ययो भवति”

### 3.3.128 आतो युच् (id 33128)

- **now:** `कृत्$31093##कृच्छ्र-अकृच्छ्र-अर्थेषु$33126`
- **suggested:** `कृत्$31093##कृच्छ्र-अकृच्छ्र-अर्थेषु$33126##ईषत्-दुस्-सुषु$33126   (add ईषत्-दुस्-सुषु$33126)`
- **why:** the upapadas ईषत्/दुस्/सु (3.3.126) run on; the list carries कृच्छ्र-अकृच्छ्र-अर्थेषु from the same sūtra but not them (ईषत्पानः, दुष्पानः, सुपानः).
- **settled by:** Kāśikā (“ईषदादयोऽनुवर्तन्ते”) and prathamāvṛtti; the Mahābhāṣya has no comment on 3.3.128.
- **citations:**
  - Kāśikā on 3.3.128: “ईषदादयोऽनुवर्तन्ते”
  - prathamāvṛtti (Brahmadatta Jijñāsu), artha on 3.3.128: “आकारान्तेभ्यो धातुभ्यः कृच्छ्राकृच्छ्रार्थेष्वीषदादिषूपपदेषु युच् प्रत्ययो भवति”

### 3.3.129 छन्दसि गत्यर्थेभ्यः (id 33129)

- **now:** `कृत्$31093##युच्$33128`
- **suggested:** `कृत्$31093##ईषत्-दुस्-सुषु$33126##कृच्छ्र-अकृच्छ्र-अर्थेषु$33126##युच्$33128   (add ईषत्-दुस्-सुषु$33126; add कृच्छ्र-अकृच्छ्र-अर्थेषु$33126)`
- **why:** both conditions of 3.3.126 run on into 3.3.129 (युच् replaces खल् there: सूपसदनः); the list carries only कृत् and युच्.
- **settled by:** Kāśikā and prathamāvṛtti agree; the Mahābhāṣya has no comment on 3.3.129.
- **citations:**
  - Kāśikā on 3.3.129: “ईषदादिषु कृच्छ्राकृच्छ्रार्थेषूपपदेषु गत्यर्थेभ्यो धातुभ्यश्छन्दसि विषये युच् प्रत्ययो भवति। खलोऽपवादः”
  - prathamāvṛtti (Brahmadatta Jijñāsu), artha on 3.3.129: “कृच्छ्राकृच्छ्रार्थेष्वीषदादिषूपपदेषु गत्यर्थेभ्यो धातुभ्यश्छन्दसि विषये युच् प्रत्ययो भवति”

### 4.1.20 वयसि प्रथमे (id 41020)

- **now:** `ङीप्$41005##अनुपसर्जनात्$41014`
- **suggested:** `अतः$41004##ङीप्$41005##अनुपसर्जनात्$41014   (add अतः$41004)`
- **why:** अतः (4.1.4 अजाद्यतष्टाप्) runs on: the base must end in अ. The Kāśikā says so in as many words (“अत इत्येव — शिशुः”), and the Siddhānta-kaumudī reads “अदन्तात्”.
- **settled by:** Kāśikā (“अत इत्येव”); the Mahābhāṣya on 4.1.20 discusses वयस् only.
- **citations:**
  - Kāśikā on 4.1.20: “अत इत्येव — शिशुः”
  - Siddhānta-kaumudī on 4.1.20: “प्रथमवयोवाचिनोऽदन्तात् स्त्रियां ङीप् स्यात्”
  - Siddhānta-kaumudī on 4.1.20: “अतः किम् ? शिशुः”
  - prathamāvṛtti (Brahmadatta Jijñāsu), artha on 4.1.20: “वर्त्तमानेभ्योऽनुपसर्जनेभ्यो ऽदन्तेभ्यः प्रातिपदिकेभ्यः स्त्रियां ङीप् प्रत्ययो भवति”

### 4.1.21 द्विगोः (id 41021)

- **now:** `ङीप्$41005##अनुपसर्जनात्$41014`
- **suggested:** `अतः$41004##ङीप्$41005##अनुपसर्जनात्$41014   (add अतः$41004)`
- **why:** as 4.1.20 (अतः carried on from 4.1.4 through 4.1.20): the dvigu must end in अ.
- **settled by:** Siddhānta-kaumudī and prathamāvṛtti (no muni speaks: the Mahābhāṣya has no comment on 4.1.21; the Kāśikā on 4.1.21 does not mention it either way).
- **citations:**
  - Siddhānta-kaumudī on 4.1.21: “अदन्तात् द्विगोर्ङीप् स्यात्”
  - prathamāvṛtti (Brahmadatta Jijñāsu), artha on 4.1.21: “द्विगुसंज्ञकादनुपसर्जनाददन्तात् प्रातिपदिकात् स्त्रियां ङीप् प्रत्ययो भवति”
  - Kāśikā on 4.1.20: “अत इत्येव — शिशुः”

### 6.4.120 अत एकहल्मध्येऽनादेशादेर्लिटि (id 64120)

- **now:** `क्ङिति$64098##एत्$64119##हौ$64119##अभ्यासलोपः$64119`
- **suggested:** `क्ङिति$64098##एत्$64119##अभ्यासलोपः$64119   (drop हौ$64119)`
- **why:** हौ (“before the ending हि”) belongs to 6.4.119 only. 6.4.120 applies before a kit/ṅit लिट्, and no source carries हौ into it; the prathamāvṛtti says only एत् and अभ्यासलोपः run on from 6.4.119.
- **settled by:** Kāśikā and prathamāvṛtti agree; the Mahābhāṣya on 6.4.120 does not mention हौ.
- **citations:**
  - Kāśikā on 6.4.120: “योऽकारस्तस्यैकारादेशो भवति, अभ्यासलोपश्च लिटि क्ङिति परतः”
  - prathamāvṛtti (Brahmadatta Jijñāsu), artha on 6.4.120: “योऽकारस्तस्य एकारादेशो भवति, अभ्यासलोपश्च लिटि किङति परतः”
  - Kāśikā on 6.4.119: “घुसंज्ञकानामङ्गानामस्तेश्च एकारादेशो भवति हौ परतोऽभ्यासलोपश्च”
  - prathamāvṛtti (Brahmadatta Jijñāsu), anuvṛtti on 6.4.119: “यहाँ से ‹एत् अभ्यासलोपश्च› की अनुवृत्ति ६।४।१२६ तक जायेगी”

### 6.4.121 थलि च सेटि (id 64121)

- **now:** `एत्$64119##हौ$64119##अभ्यासलोपः$64119##एकहल्मध्ये$64120##अनादेशादेः$64120##लिटि$64120##अतः$64120`
- **suggested:** `एत्$64119##अभ्यासलोपः$64119##एकहल्मध्ये$64120##अनादेशादेः$64120##लिटि$64120##अतः$64120   (drop हौ$64119)`
- **why:** as 6.4.120: हौ belongs to 6.4.119 only; 6.4.121 applies before थल् with इट्.
- **settled by:** Kāśikā and prathamāvṛtti agree; the Mahābhāṣya on 6.4.121 discusses थल्/सेट् only.
- **citations:**
  - Kāśikā on 6.4.121: “थलि च सेटि परतोऽनादेशादेरङ्गस्यैकहल्मध्यगतस्यातः स्थान एकारादेशो भवति, अभ्यासलोपश्च”
  - prathamāvṛtti (Brahmadatta Jijñāsu), artha on 6.4.121: “थलि च सेटि परतोऽनादेशादेरङ्गस्यासहाययोर्हलोर्मध्ये वर्त्तमानस्याकारस्य स्थाने एकारादेशो भवत्यभ्यासलोपश्च”
  - prathamāvṛtti (Brahmadatta Jijñāsu), anuvṛtti on 6.4.119: “यहाँ से ‹एत् अभ्यासलोपश्च› की अनुवृत्ति ६।४।१२६ तक जायेगी”

### 6.4.122 तॄफलभजत्रपश्च (id 64122)

- **now:** `क्ङिति$64098##अभ्यासलोपः$64119##अतः$64120##थलि$64121##सेटि$64121`
- **suggested:** `क्ङिति$64098##अभ्यासलोपः$64119##एत्$64119##अतः$64120##लिटि$64120##थलि$64121##सेटि$64121   (add एत्$64119; add लिटि$64120)`
- **why:** the replacement एत् (6.4.119) and the condition लिटि (6.4.120) run on into 6.4.122–126. The list already carries अभ्यासलोपः, अतः, थलि and सेटि, but not these two.
- **settled by:** Kāśikā and prathamāvṛtti agree (the prathamāvṛtti states both ranges, to 6.4.126); the Mahābhāṣya does not speak to these two words.
- **citations:**
  - Kāśikā on 6.4.122: “तृ फल भज त्रप इत्येतेषामङ्गानामत एकारादेशो भवति, अभ्यासलोपश्च लिटि क्ङिति परतस्थलि च सेटि”
  - prathamāvṛtti (Brahmadatta Jijñāsu), anuvṛtti on 6.4.119: “यहाँ से ‹एत् अभ्यासलोपश्च› की अनुवृत्ति ६।४।१२६ तक जायेगी”
  - prathamāvṛtti (Brahmadatta Jijñāsu), anuvṛtti on 6.4.120: “यहाँ से 'अतः लिटि' की अनुवृत्ति ६।४।१२६ तक”

### 6.4.123 राधो हिंसायाम् (id 64123)

- **now:** `क्ङिति$64098##अभ्यासलोपः$64119##अतः$64120##थलि$64121##सेटि$64121`
- **suggested:** `क्ङिति$64098##अभ्यासलोपः$64119##एत्$64119##अतः$64120##लिटि$64120##थलि$64121##सेटि$64121   (add एत्$64119; add लिटि$64120)`
- **why:** the replacement एत् (6.4.119) and the condition लिटि (6.4.120) run on into 6.4.122–126. The list already carries अभ्यासलोपः, अतः, थलि and सेटि, but not these two.
- **settled by:** Kāśikā and prathamāvṛtti agree (the prathamāvṛtti states both ranges, to 6.4.126); the Mahābhāṣya does not speak to these two words.
- **citations:**
  - Kāśikā on 6.4.123: “राधो हिंसायामर्थेऽवर्णस्यैकार आदेशो भवति, अभ्यासलोपश्च लिटि क्ङिति परतस्थलि च सेटि”
  - prathamāvṛtti (Brahmadatta Jijñāsu), anuvṛtti on 6.4.119: “यहाँ से ‹एत् अभ्यासलोपश्च› की अनुवृत्ति ६।४।१२६ तक जायेगी”
  - prathamāvṛtti (Brahmadatta Jijñāsu), anuvṛtti on 6.4.120: “यहाँ से 'अतः लिटि' की अनुवृत्ति ६।४।१२६ तक”

### 6.4.124 वा जॄभ्रमुत्रसाम् (id 64124)

- **now:** `क्ङिति$64098##अभ्यासलोपः$64119##अतः$64120##थलि$64121##सेटि$64121`
- **suggested:** `क्ङिति$64098##अभ्यासलोपः$64119##एत्$64119##अतः$64120##लिटि$64120##थलि$64121##सेटि$64121   (add एत्$64119; add लिटि$64120)`
- **why:** the replacement एत् (6.4.119) and the condition लिटि (6.4.120) run on into 6.4.122–126. The list already carries अभ्यासलोपः, अतः, थलि and सेटि, but not these two.
- **settled by:** Kāśikā and prathamāvṛtti agree (the prathamāvṛtti states both ranges, to 6.4.126); the Mahābhāṣya does not speak to these two words.
- **citations:**
  - Kāśikā on 6.4.124: “जृ भ्रमु त्रस इत्येतेषामङ्गानामतः स्थाने वा एकार आदेशो भवति, अभ्यासलोपश्च लिटि क्ङिति परतस्थलि च सेटि”
  - prathamāvṛtti (Brahmadatta Jijñāsu), anuvṛtti on 6.4.119: “यहाँ से ‹एत् अभ्यासलोपश्च› की अनुवृत्ति ६।४।१२६ तक जायेगी”
  - prathamāvṛtti (Brahmadatta Jijñāsu), anuvṛtti on 6.4.120: “यहाँ से 'अतः लिटि' की अनुवृत्ति ६।४।१२६ तक”

### 6.4.125 फणां च सप्तानाम् (id 64125)

- **now:** `क्ङिति$64098##अभ्यासलोपः$64119##अतः$64120##थलि$64121##सेटि$64121##वा$64124`
- **suggested:** `क्ङिति$64098##अभ्यासलोपः$64119##एत्$64119##अतः$64120##लिटि$64120##थलि$64121##सेटि$64121##वा$64124   (add एत्$64119; add लिटि$64120)`
- **why:** the replacement एत् (6.4.119) and the condition लिटि (6.4.120) run on into 6.4.122–126. The list already carries अभ्यासलोपः, अतः, थलि and सेटि, but not these two.
- **settled by:** Kāśikā and prathamāvṛtti agree (the prathamāvṛtti states both ranges, to 6.4.126); the Mahābhāṣya does not speak to these two words.
- **citations:**
  - Kāśikā on 6.4.125: “फणादीनां सप्तानां धातूनामवर्णस्य स्थाने वैकार आदेशो भवति, अभ्यासलोपश्च लिटि क्ङिति परतस्थलि च सेटि”
  - prathamāvṛtti (Brahmadatta Jijñāsu), anuvṛtti on 6.4.119: “यहाँ से ‹एत् अभ्यासलोपश्च› की अनुवृत्ति ६।४।१२६ तक जायेगी”
  - prathamāvṛtti (Brahmadatta Jijñāsu), anuvṛtti on 6.4.120: “यहाँ से 'अतः लिटि' की अनुवृत्ति ६।४।१२६ तक”

### 6.4.126 न शसददवादिगुणानाम् (id 64126)

- **now:** `क्ङिति$64098##अभ्यासलोपः$64119##अतः$64120##थलि$64121##सेटि$64121`
- **suggested:** `क्ङिति$64098##अभ्यासलोपः$64119##एत्$64119##अतः$64120##लिटि$64120##थलि$64121##सेटि$64121   (add एत्$64119; add लिटि$64120)`
- **why:** the replacement एत् (6.4.119) and the condition लिटि (6.4.120) run on into 6.4.122–126. The list already carries अभ्यासलोपः, अतः, थलि and सेटि, but not these two (here the rule denies them).
- **settled by:** Kāśikā and prathamāvṛtti agree (the prathamāvṛtti states both ranges, to 6.4.126); the Mahābhāṣya does not speak to these two words.
- **citations:**
  - Kāśikā on 6.4.126: “योऽकारस्तस्य स्थान एकारादेशो न भवति, अभ्यासलोपश्च”
  - prathamāvṛtti (Brahmadatta Jijñāsu), artha on 6.4.126: “एकारादेशोऽभ्यासलोपश्च न भवति, लिटि किङति थलि च सेटि परतः”
  - prathamāvṛtti (Brahmadatta Jijñāsu), anuvṛtti on 6.4.119: “यहाँ से ‹एत् अभ्यासलोपश्च› की अनुवृत्ति ६।४।१२६ तक जायेगी”
  - prathamāvṛtti (Brahmadatta Jijñāsu), anuvṛtti on 6.4.120: “यहाँ से 'अतः लिटि' की अनुवृत्ति ६।४।१२६ तक”

### 7.1.75 अस्थिदधिसक्थ्यक्ष्णामनङुदात्तः (id 71075)

- **now:** `नुम्$71058##नपुंसकस्य$71072##विभक्तौ$71073##तृतीया-आदिषु$71074`
- **suggested:** `नुम्$71058##नपुंसकस्य$71072##विभक्तौ$71073##अचि$71073##तृतीया-आदिषु$71074   (add अचि$71073)`
- **why:** the list carries विभक्तौ from 7.1.73 but not अचि from the same sūtra; the अनङ् comes only before a vowel-initial ending (अस्थ्ना, but अस्थिभ्याम्).
- **settled by:** Kāśikā (“अचीत्येव”) and prathamāvṛtti; the Mahābhāṣya has no comment on 7.1.75. (7.1.74 already carries अचि$71073 in the data.)
- **citations:**
  - Kāśikā on 7.1.75: “अचीत्येव — अस्थिभ्याम्”
  - prathamāvṛtti (Brahmadatta Jijñāsu), anuvṛtti on 7.1.73: “‹अचि विभक्तौ› की ७।१।७५ तक जायेगी”
  - Siddhānta-kaumudī on 7.1.75: “एषामनङ् स्याट्टादावचि स चोदात्तः”

### 7.2.86 युष्मदस्मदोरनादेशे (id 72086)

- **now:** `आः$72084##विभक्तौ$72084`
- **suggested:** `आः$72084##विभक्तौ$72084##हलि$72085   (add हलि$72085)`
- **why:** हलि (7.2.85) runs on: the आ replaces only before a consonant-initial ending. The Mahābhāṣya says so in so many words.
- **settled by:** Mahābhāṣya on 7.2.86 (“हलीत्यनुवर्तते”).
- **citations:**
  - Mahābhāṣya on 7.2.86: “हलीत्यनुवर्तते”
  - Kāśikā on 7.2.86: “हलीत्यधिकारादप्यत्र न स्यात्”
  - Siddhānta-kaumudī on 7.2.86: “अनयोराकारः स्यादनादेशे हलादौ परे”

### 7.2.118 किति च (id 72118)

- **now:** `वृद्धिः$72114##अचः$72115##ञ्णिति$72115##तद्धितेषु$72117##आदेः$72117`
- **suggested:** `वृद्धिः$72114##अचः$72115##ञ्णिति$72115##तद्धितेषु$72117##आदेः$72117##अचाम्$72117   (add अचाम्$72117)`
- **why:** the list carries आदेः from 7.2.117 but not अचाम् from the same sūtra; the rule is about the first vowel (अचाम् आदेः अचः), and the prathamāvṛtti says the whole of 7.2.117 runs on.
- **settled by:** Kāśikā and prathamāvṛtti agree; the Mahābhāṣya has no comment on 7.2.118.
- **citations:**
  - Kāśikā on 7.2.118: “किति च तद्धिते परतोऽङ्गस्याचामादेरचः स्थाने वृद्धिर्भवति”
  - prathamāvṛtti (Brahmadatta Jijñāsu), artha on 7.2.118: “तद्धिते परतोऽङ्गस्याचामादेरचः स्थाने वृद्धिर्भवति”
  - prathamāvṛtti (Brahmadatta Jijñāsu), anuvṛtti on 7.2.117: “सम्पूर्ण सूत्र की अनुवृत्ति ७।३।३१ तक जायेगी”

### 7.4.12 शॄदॄप्रां ह्रस्वो वा (id 74012)

- **now:** `गुणः$74010`
- **suggested:** `लिटि$74009##गुणः$74010   (add लिटि$74009)`
- **why:** लिटि (7.4.9) runs on (7.4.10 and 7.4.11 carry it in the data; 7.4.12 drops it): the shortening is before लिट् (विशश्रतुः).
- **settled by:** Kāśikā and prathamāvṛtti agree; the Mahābhāṣya on 7.4.12 discusses ह्रस्व vs गुण only.
- **citations:**
  - Kāśikā on 7.4.12: “शॄ पॄ दॄ इत्येतेषां अङ्गानां लिटि परतो वा ह्रस्वो भवति”
  - prathamāvṛtti (Brahmadatta Jijñāsu), artha on 7.4.12: “इत्येतेषामङ्गानां लिटि परतो वा ह्रस्वो भवति”

## Field `pc`: case code (7)

### 3.1.118 प्रत्यपिभ्यां ग्रहेश्छन्दसि (id 31118)

- **now:** `ग्रहेः$S$7$1$`
- **suggested:** `ग्रहेः$S$5$1$`
- **why:** ग्रहेः is the 5th/6th singular of ग्रहि and cannot be a 7th (that would be ग्रहौ); here it is the 5th (क्यप् after ग्रह्).
- **settled by:** Kāśikā and prathamāvṛtti agree; the Mahābhāṣya on 3.1.118 does not discuss the case.
- **citations:**
  - Kāśikā on 3.1.118: “प्रति अपि इत्येवंपूर्वाद् ग्रहेः क्यप् प्रत्ययो भवति”
  - prathamāvṛtti (Brahmadatta Jijñāsu), padaccheda on 3.1.118: “ग्रहेः ५।१”

### 4.1.64 पाककर्णपर्णपुष्पफलमूलवालोत्तरपदाच्च (id 41064)

- **now:** `पाक-कर्ण-पर्ण-पुष्प-फल-मूल-वाल-उत्तरपदात्$S$1$1$`
- **suggested:** `पाक-कर्ण-पर्ण-पुष्प-फल-मूल-वाल-उत्तरपदात्$S$5$1$`
- **why:** a word ending in -आत् is a 5th (“from a base whose last member is पाक …”), not a 1st.
- **settled by:** Kāśikā and prathamāvṛtti agree.
- **citations:**
  - Kāśikā on 4.1.64: “पाकाद्युत्तरपदाज् जातिवाचिनः प्रातिपदिकात् स्त्रियां ङीष् प्रत्ययो भवति”
  - prathamāvṛtti (Brahmadatta Jijñāsu), padaccheda on 4.1.64: “पदात् ५।१”

### 5.1.8 अजाविभ्यां थ्यन् (id 51008)

- **now:** `अज-अविभ्याम्$S$7$1$`
- **suggested:** `अज-अविभ्याम्$S$5$2$`
- **why:** the ending -भ्याम् is dual (3rd/4th/5th) and can never be a 7th singular; as the base of a taddhita it is the 5th dual.
- **settled by:** prathamāvṛtti (5th dual); Kāśikā agrees on the reading.
- **citations:**
  - Kāśikā on 5.1.8: “अज अवि इत्येताभ्यां थ्यन् प्रत्ययो भवति”
  - prathamāvṛtti (Brahmadatta Jijñāsu), padaccheda on 5.1.8: “अजाविभ्याम् ५।२”

### 5.2.137 संज्ञायां मन्माभ्याम् (id 52137)

- **now:** `मन्-माभ्याम्$S$7$1$`
- **suggested:** `मन्-माभ्याम्$S$5$2$`
- **why:** as 5.1.8: -भ्याम् is dual and cannot be a 7th singular; it is the 5th dual (“after a base ending in मन् or म”).
- **settled by:** Kāśikā and Siddhānta-kaumudī agree.
- **citations:**
  - Kāśikā on 5.2.137: “मन्नन्तात् प्रातिपदिकाद् मशब्दान्तात् चेनिः प्रत्ययो भवति”
  - Siddhānta-kaumudī on 5.2.137: “मन्नन्तान्मान्ताच्चेनिर्मत्वर्थे”

### 5.4.152 इनः स्त्रियाम् (id 54152)

- **now:** `इनः$S$1$1$`
- **suggested:** `इनः$S$5$1$`
- **why:** इनः here is the 5th of इन् (“after a bahuvrīhi ending in इन्”), not the 1st.
- **settled by:** Kāśikā and prathamāvṛtti agree.
- **citations:**
  - Kāśikā on 5.4.152: “इन्नन्ताद् बहुव्रीहेः कप् प्रत्ययो भवति”
  - prathamāvṛtti (Brahmadatta Jijñāsu), padaccheda on 5.4.152: “इनः ५।१”

### 6.1.62 अचि शीर्षः (id 61062)

- **now:** `अचि$S$6$1$`
- **suggested:** `अचि$S$7$1$`
- **why:** अचि is the 7th singular of अच् (a vowel), not the 6th (that would be अचः). The Kāśikā reads it as “before a vowel-initial taddhita”.
- **settled by:** Kāśikā (the Mahābhāṣya has no comment on 6.1.62).
- **citations:**
  - Kāśikā on 6.1.62: “आजादौ तद्धिते शिरसः शीर्षशब्द आदेशो भवति”

### 6.1.166 तिसृभ्यो जसः (id 61166)

- **now:** `तिसृभ्यः$S$6$3$`
- **suggested:** `तिसृभ्यः$S$5$3$`
- **why:** the ending -भ्यः is 4th/5th plural and can never be a 6th; here it is the 5th (“the जस् after तिसृ”).
- **settled by:** Kāśikā and prathamāvṛtti agree; the Mahābhāṣya on 6.1.166 discusses जस् only.
- **citations:**
  - Kāśikā on 6.1.166: “तिसृभ्य उत्तरस्य जसोऽन्त उदात्तो भवति”
  - prathamāvṛtti (Brahmadatta Jijñāsu), padaccheda on 6.1.166: “तिसृभ्यः ५।३”

## Field `pc`: the pada itself (36)

### 1.3.71 मिथ्योपपदात् कृञोऽभ्यासे (id 13071)

- **now:** `मिथ्या$S$0$0$##उपपदात्$S$5$1$`
- **suggested:** `मिथ्या-उपपदात्$S$5$1$`
- **why:** the sūtra pada is the one compound मिथ्योपपदात् (“having मिथ्या as upapada”). The data splits it into two padas, मिथ्या (an indeclinable) and उपपदात्; it should be one pada with the members hyphenated, as elsewhere in the data.
- **settled by:** Kāśikā and prathamāvṛtti agree; the Mahābhāṣya has no comment on 1.3.71.
- **citations:**
  - Kāśikā on 1.3.71: “मिथ्योपपदादिति किम्? पदं सुष्ठु कारयति”
  - prathamāvṛtti (Brahmadatta Jijñāsu), padaccheda on 1.3.71: “मिथ्योपपदात् ५।१”
  - prathamāvṛtti (Brahmadatta Jijñāsu), artha on 1.3.71: “मिथ्याशब्दोपपदादभ्यासे”

### 1.4.106 प्रहासे च मन्योपपदे मन्यतेरुत्तम एकवच्च (id 14106)

- **now:** `उत्तम$S$1$1$`
- **suggested:** `उत्तमः$S$1$1$`
- **why:** the pada is written with its last sound as changed by sandhi in the sūtra; the padaccheda should give the pada itself (the case code already says so).
- **settled by:** the sūtra text and the prathamāvṛtti padaccheda; no source differs.
- **citations:**
  - prathamāvṛtti (Brahmadatta Jijñāsu), padaccheda on 1.4.106: “उत्तमः १।१”
  - ashtadhyayi.com data.txt, field s (the sūtra text) on 1.4.106: “प्रहासे च मन्योपपदे मन्यतेरुत्तम एकवच्च”

### 2.2.27 तत्र तेनेदमिति सरूपे (id 22027)

- **now:** `तेन्$S$3$1$`
- **suggested:** `तेन$S$3$1$`
- **why:** typo: a stray virāma on the pronoun तेन (3rd singular).
- **settled by:** the sūtra text and the prathamāvṛtti padaccheda (and the Kāśikā where quoted); no source differs.
- **citations:**
  - prathamāvṛtti (Brahmadatta Jijñāsu), padaccheda on 2.2.27: “तेन ३।१”
  - Kāśikā on 2.2.27: “तेनेति तृतीयान्तम्”

### 3.1.8 सुप आत्मनः क्यच् (id 31008)

- **now:** `सुप$S$5$1$`
- **suggested:** `सुपः$S$5$1$`
- **why:** the pada is written with its last sound as changed by sandhi in the sūtra; the padaccheda should give the pada itself (the case code already says so).
- **settled by:** the sūtra text and the prathamāvṛtti padaccheda; no source differs.
- **citations:**
  - prathamāvṛtti (Brahmadatta Jijñāsu), padaccheda on 3.1.8: “सुपः ५।१”
  - ashtadhyayi.com data.txt, field s (the sūtra text) on 3.1.8: “सुप आत्मनः क्यच्”

### 3.2.66 हव्येऽनन्तः पादम् (id 32066)

- **now:** `हव्येः$S$7$1$`
- **suggested:** `हव्ये$S$7$1$`
- **why:** the sūtra is हव्येऽनन्तःपादम् = हव्ये (7th singular of हव्य, the upapada) + अनन्तःपादम्; the case code already says 7th, but the form has a stray visarga.
- **settled by:** the sūtra text and the prathamāvṛtti padaccheda (and the Kāśikā where quoted); no source differs.
- **citations:**
  - prathamāvṛtti (Brahmadatta Jijñāsu), padaccheda on 3.2.66: “हव्ये ७।१”
  - Kāśikā on 3.2.66: “हव्यशब्द उपपदे छन्दसि विषये वहेर्धातोर्ञ्युट् प्रत्ययो भवति”

### 3.2.83 आत्ममाने खश्च (id 32083)

- **now:** `खः$S$1$1$`
- **suggested:** `खश्$S$1$1$`
- **why:** the sūtra खश्च is the suffix खश् + च. (खः + च would give the same string by sandhi, but no suffix ख is meant here: the rule teaches खश्, as in पण्डितंमन्यः.)
- **settled by:** Kāśikā and prathamāvṛtti agree; the Mahābhāṣya on 3.2.83 discusses आत्मग्रहण only.
- **citations:**
  - Kāśikā on 3.2.83: “सुप्युपपदे खश् प्रत्ययो भवति”
  - prathamāvṛtti (Brahmadatta Jijñāsu), padaccheda on 3.2.83: “खश् १।१”

### 3.2.134 आक्वेस्तच्छीलतद्धर्मतत्साधुकारिषु (id 32134)

- **now:** `क्वे$S$5$1$`
- **suggested:** `क्वेः$S$5$1$`
- **why:** the pada is written with its last sound as changed by sandhi in the sūtra; the padaccheda should give the pada itself (the case code already says so).
- **settled by:** the sūtra text and the prathamāvṛtti padaccheda; no source differs.
- **citations:**
  - prathamāvṛtti (Brahmadatta Jijñāsu), padaccheda on 3.2.134: “क्वेः ५।१”
  - ashtadhyayi.com data.txt, field s (the sūtra text) on 3.2.134: “आक्वेस्तच्छीलतद्धर्मतत्साधुकारिषु”

### 3.2.154 लषपतपदस्थाभूवृषहनकमगमशॄभ्य उकञ् (id 32154)

- **now:** `लष-पत-पद-स्था-भू-वृष-हन-कम-गम-शॄभ्य$S$5$3$`
- **suggested:** `लष-पत-पद-स्था-भू-वृष-हन-कम-गम-शॄभ्यः$S$5$3$`
- **why:** the pada is written with its last sound as changed by sandhi in the sūtra; the padaccheda should give the pada itself (the case code already says so).
- **settled by:** the sūtra text and the prathamāvṛtti padaccheda; no source differs.
- **citations:**
  - prathamāvṛtti (Brahmadatta Jijñāsu), padaccheda on 3.2.154: “शॄभ्यः ५।३”
  - ashtadhyayi.com data.txt, field s (the sūtra text) on 3.2.154: “लषपतपदस्थाभूवृषहनकमगमशॄभ्य उकञ्”

### 3.3.37 परिन्योर्नीणोर्द्यूताभ्रेषयोः (id 33037)

- **now:** `द्युत-अभ्रेषयोः$S$7$2$`
- **suggested:** `द्यूत-अभ्रेषयोः$S$7$2$`
- **why:** the sūtra has द्यूताभ्रेषयोः: the member is द्यूत (“gambling”), with a long ū.
- **settled by:** the sūtra text and the prathamāvṛtti padaccheda (and the Kāśikā where quoted); no source differs.
- **citations:**
  - Kāśikā on 3.3.37: “द्यूतविषयश्चेन्नयतेरर्थः”
  - prathamāvṛtti (Brahmadatta Jijñāsu), padaccheda on 3.3.37: “द्यूताभ्रेषयोः ७।२”

### 3.3.122 अध्यायन्यायोद्यावसंहाराधारावायाश्च (id 33122)

- **now:** `अध्याय-न्याय-उद्याव-संहार-आधार-आवयाः$S$1$3$`
- **suggested:** `अध्याय-न्याय-उद्याव-संहार-आधार-आवायाः$S$1$3$`
- **why:** the last member is आवाय (…संहाराधारावायाश्च), not आवय.
- **settled by:** the sūtra text and the prathamāvṛtti padaccheda (and the Kāśikā where quoted); no source differs.
- **citations:**
  - Kāśikā on 3.3.122: “आवयन्त्यस्मिन्नित्यावायः”
  - ashtadhyayi.com data.txt, field s (the sūtra text) on 3.3.122: “अध्यायन्यायोद्यावसंहाराधारावायाश्च”

### 3.3.160 इच्छार्थेभ्यो विभाषा वर्तमाने (id 33160)

- **now:** `इच्छार्थेभ्यो$S$5$3$`
- **suggested:** `इच्छार्थेभ्यः$S$5$3$`
- **why:** the pada is written with its last sound as changed by sandhi in the sūtra; the padaccheda should give the pada itself (the case code already says so).
- **settled by:** the sūtra text and the prathamāvṛtti padaccheda; no source differs.
- **citations:**
  - prathamāvṛtti (Brahmadatta Jijñāsu), padaccheda on 3.3.160: “इच्छार्थेभ्यः ५।३”
  - ashtadhyayi.com data.txt, field s (the sūtra text) on 3.3.160: “इच्छार्थेभ्यो विभाषा वर्तमाने”

### 4.2.89 शिखाया वलच् (id 42089)

- **now:** `शिखाया$S$5$1$`
- **suggested:** `शिखायाः$S$5$1$`
- **why:** the pada is written with its last sound as changed by sandhi in the sūtra; the padaccheda should give the pada itself (the case code already says so).
- **settled by:** the sūtra text and the prathamāvṛtti padaccheda; no source differs.
- **citations:**
  - prathamāvṛtti (Brahmadatta Jijñāsu), padaccheda on 4.2.89: “शिखायाः ५।१”
  - ashtadhyayi.com data.txt, field s (the sūtra text) on 4.2.89: “शिखाया वलच्”

### 5.1.22 संख्याया अतिशदन्तायाः कन् (id 51022)

- **now:** `संख्याया$S$5$1$`
- **suggested:** `संख्यायाः$S$5$1$`
- **why:** the pada is written with its last sound as changed by sandhi in the sūtra; the padaccheda should give the pada itself (the case code already says so).
- **settled by:** the sūtra text and the prathamāvṛtti padaccheda; no source differs.
- **citations:**
  - prathamāvṛtti (Brahmadatta Jijñāsu), padaccheda on 5.1.22: “सङ्ख्यायाः ५।१”
  - ashtadhyayi.com data.txt, field s (the sūtra text) on 5.1.22: “संख्याया अतिशदन्तायाः कन्”

### 5.3.54 षष्ठ्या रूप्य च (id 53054)

- **now:** `षष्ठ्या$S$5$1$`
- **suggested:** `षष्ठ्याः$S$5$1$`
- **why:** the pada is written with its last sound as changed by sandhi in the sūtra; the padaccheda should give the pada itself (the case code already says so).
- **settled by:** the sūtra text and the prathamāvṛtti padaccheda; no source differs.
- **citations:**
  - prathamāvṛtti (Brahmadatta Jijñāsu), padaccheda on 5.3.54: “षष्ठ्याः ५।१”
  - ashtadhyayi.com data.txt, field s (the sūtra text) on 5.3.54: “षष्ठ्या रूप्य च”

### 5.4.74 ऋक्पूरब्धूःपथामानक्षे (id 54074)

- **now:** `ऋक्पूरप्धूःपथाम्$S$6$3$`
- **suggested:** `ऋक्-पुर्-अप्-धुर्-पथाम्$S$6$3$`
- **why:** the sūtra has ऋक्पूरब्धूःपथाम् (members ऋच्, पुर्, अप्, धुर्, पथिन्); the pc form has अप् unvoiced (प् for ब्) and matches neither the sūtra nor a split. If you prefer an unsplit form, at least ऋक्पूरब्धूःपथाम् as the sūtra writes it.
- **settled by:** the sūtra text and the prathamāvṛtti padaccheda (and the Kāśikā where quoted); no source differs.
- **citations:**
  - Kāśikā on 5.4.74: “ऋक्  पुर् अप् धुर् पथिन् इत्येवमन्तानां समासानामकारः प्रत्ययो भवति”
  - prathamāvṛtti (Brahmadatta Jijñāsu), padaccheda on 5.4.74: “ऋक्पूरब्धूःपथाम् ६।३”

### 5.4.81 अन्ववतप्ताद्रहसः (id 54081)

- **now:** `अनु्-अव-तप्तात्$S$5$1$`
- **suggested:** `अनु-अव-तप्तात्$S$5$1$`
- **why:** typo: a stray virāma on अनु.
- **settled by:** the sūtra text and the prathamāvṛtti padaccheda (and the Kāśikā where quoted); no source differs.
- **citations:**
  - Kāśikā on 5.4.81: “अनु अव तप्त इत्येतेभ्यः परो यो रहश्शब्दस्तदन्तात् समासादच् प्रत्ययो भवति”
  - ashtadhyayi.com data.txt, field s (the sūtra text) on 5.4.81: “अन्ववतप्ताद्रहसः”

### 5.4.130 ऊर्ध्वाद्विभाषा (id 54130)

- **now:** `ऊर्ध्वाद्$S$5$1$`
- **suggested:** `ऊर्ध्वात्$S$5$1$`
- **why:** the pada is written with its last sound as changed by sandhi in the sūtra; the padaccheda should give the pada itself (the case code already says so).
- **settled by:** the sūtra text and the prathamāvṛtti padaccheda; no source differs.
- **citations:**
  - prathamāvṛtti (Brahmadatta Jijñāsu), padaccheda on 5.4.130: “ऊर्ध्वात् ५।१”
  - ashtadhyayi.com data.txt, field s (the sūtra text) on 5.4.130: “ऊर्ध्वाद्विभाषा”

### 6.1.188 स्वपादिहिंसामच्यनिटि (id 61188)

- **now:** `स्वपादिः-हिंसाम्$S$6$3$`
- **suggested:** `स्वपादि-हिंसाम्$S$6$3$`
- **why:** a stray visarga inside the compound (the member is स्वपादि).
- **settled by:** the sūtra text and the prathamāvṛtti padaccheda (and the Kāśikā where quoted); no source differs.
- **citations:**
  - Kāśikā on 6.1.188: “स्वपादीनां हिंसेश्चाजादावनिटि लसार्वधातुके परतोऽन्यतरस्यामादिरुदात्तो भवति”
  - prathamāvṛtti (Brahmadatta Jijñāsu), padaccheda on 6.1.188: “स्वपादिहिंसाम् ६।३”

### 6.2.21 आशङ्काबाधनेदीयस्सु संभावने (id 62021)

- **now:** `आशङ्क-आबाध-नेदियस्सु$S$7$3$`
- **suggested:** `आशङ्क-आबाध-नेदीयस्सु$S$7$3$`
- **why:** typo: नेदियस् for नेदीयस् (comparative of अन्तिक, 5.3.63). (आशङ्क is right as it stands: the Kāśikā and the prathamāvṛtti read आशङ्क.)
- **settled by:** the sūtra text and the prathamāvṛtti padaccheda (and the Kāśikā where quoted); no source differs.
- **citations:**
  - Kāśikā on 6.2.21: “आशङ्क आबाध नेदीयस् इत्येतेषूत्तरपदेषु”
  - prathamāvṛtti (Brahmadatta Jijñāsu), artha on 6.2.21: “आशङ्क, अबाध, नेदीयस् इत्येतेषूत्तरपदेषु”
  - ashtadhyayi.com data.txt, field s (the sūtra text) on 6.2.21: “आशङ्काबाधनेदीयस्सु संभावने”

### 6.2.138 शितेर्नित्याबह्वज्बहुव्रीहावभसत् (id 62138)

- **now:** `नित्य-अबह्वव्च्$S$1$1$`
- **suggested:** `नित्य-अबह्वच्$S$1$1$`
- **why:** typo: अबह्वव्च् for अबह्वच् (“not having many vowels”).
- **settled by:** the sūtra text and the prathamāvṛtti padaccheda (and the Kāśikā where quoted); no source differs.
- **citations:**
  - Kāśikā on 6.2.138: “शितेरुत्तरपदं नित्यं यदबह्वज्”
  - prathamāvṛtti (Brahmadatta Jijñāsu), padaccheda on 6.2.138: “नित्याबह्वच् १।१”

### 6.2.144 थाथघञ्क्ताजबित्रकाणाम् (id 62144)

- **now:** `थ-अथ-घञ्-क्त-अचपित्र-काणाम्$S$6$3$`
- **suggested:** `थ-अथ-घञ्-क्त-अच्-अप्-इत्र-काणाम्$S$6$3$`
- **why:** the sūtra थाथघञ्क्ताजबित्रकाणाम् has eight members (थ, अथ, घञ्, क्त, अच्, अप्, इत्र, क); the pc runs अच्-अप्-इत्र together as अचपित्र.
- **settled by:** Kāśikā (the Mahābhāṣya has no comment on 6.2.144).
- **citations:**
  - Kāśikā on 6.2.144: “थ अथ घञ् क्त  अज् अप् इत्र क इत्येवमन्तानामुत्तरपदानां”

### 6.3.21 षष्ठ्या आक्रोशे (id 63021)

- **now:** `षष्ठ्या$S$6$1$`
- **suggested:** `षष्ठ्याः$S$6$1$`
- **why:** the pada is written with its last sound as changed by sandhi in the sūtra; the padaccheda should give the pada itself (the case code already says so).
- **settled by:** the sūtra text and the prathamāvṛtti padaccheda; no source differs.
- **citations:**
  - prathamāvṛtti (Brahmadatta Jijñāsu), padaccheda on 6.3.21: “षष्ठ्याः ६।१”
  - ashtadhyayi.com data.txt, field s (the sūtra text) on 6.3.21: “षष्ठ्या आक्रोशे”

### 6.3.65 इष्टकेषीकामालानां चिततूलभारिषु (id 63065)

- **now:** `इष्टका-इषिका-मालानाम्$S$6$3$`
- **suggested:** `इष्टका-इषीका-मालानाम्$S$6$3$`
- **why:** the member is इषीका (long ī), as in the sūtra इष्टकेषीकामालानाम् and the example इषीकतूलम्.
- **settled by:** the sūtra text and the prathamāvṛtti padaccheda (and the Kāśikā where quoted); no source differs.
- **citations:**
  - Kāśikā on 6.3.65: “इष्टकेषीकामालानां चित तूल भारिन् इत्येतेषूत्तरपदेषु यथासंख्यं ह्रस्वो भवति। इष्टकचितम्। इषीकतूलम्”
  - prathamāvṛtti (Brahmadatta Jijñāsu), padaccheda on 6.3.65: “इष्टकेषीकामालानाम् ६।३”

### 6.3.73 नलोपो नञः (id 63073)

- **now:** `न$S$$$6##लोपः$S$1$1$`
- **suggested:** `न-लोपः$S$1$1$`
- **why:** the sūtra pada is the one compound नलोपः (“deletion of न”). The data splits it into न (coded as a caseless 6th) and लोपः; it should be one pada.
- **settled by:** prathamāvṛtti padaccheda; the Kāśikā (and the vārttika it quotes) use नलोप as one word; the Mahābhāṣya on 6.3.73 discusses नञ्/न only.
- **citations:**
  - prathamāvṛtti (Brahmadatta Jijñāsu), padaccheda on 6.3.73: “नलोपः १।१”
  - Kāśikā on 6.3.73: “नञो नकारस्य लोपो भवत्युत्तरपदे”
  - Kāśikā on 6.3.73: “नञो नलोपोऽवक्षेपे तिङ्युपसंख्यानम्”

### 6.3.92 विष्वग्देवयोश्च टेरद्र्यञ्चतावप्रत्यये (id 63092)

- **now:** `अप्रत्यये$S$7$1$`
- **suggested:** `वप्रत्यये$S$7$1$`
- **why:** the sūtra is …अञ्चतौ वप्रत्यये (“before अञ्चु ending in the suffix व्”, i.e. क्विन्), not अप्रत्यये. The Mahābhāṣya quotes the sūtra so; the Kāśikā explains वप्रत्यय with a counter-example. (The Siddhānta-kaumudī reads अप्रत्ययान्ते, but the Bhāṣya outranks it.)
- **settled by:** Mahābhāṣya on 6.3.92 (it reads “वप्रत्यये”); Kāśikā and prathamāvṛtti agree; the Siddhānta-kaumudī differs and is outranked.
- **citations:**
  - Mahābhāṣya on 6.3.92: “विष्वग्देवयोश्च टेरद्र्यञ्चतौ वप्रत्यये”
  - Kāśikā on 6.3.92: “वप्रत्यय इति किम्? विष्वगञ्चनम्”
  - prathamāvṛtti (Brahmadatta Jijñāsu), padaccheda on 6.3.92: “वप्रत्यये ७।१”
  - Siddhānta-kaumudī on 6.3.92: “स्यादप्रत्ययान्तेऽञ्चतौ परे”

### 6.4.93 चिण्णमुलोर्दीर्घोऽन्यतरस्याम् (id 64093)

- **now:** `चित्-णमुलोः$S$7$2$`
- **suggested:** `चिण्-णमुलोः$S$7$2$`
- **why:** the suffix is चिण् (चिण्णमुलोः = चिण् + णमुलोः), not चित्.
- **settled by:** the sūtra text and the prathamāvṛtti padaccheda (and the Kāśikā where quoted); no source differs.
- **citations:**
  - Kāśikā on 6.4.93: “चिण्परे णमुल्परे च णौ परतो”
  - prathamāvṛtti (Brahmadatta Jijñāsu), padaccheda on 6.4.93: “चिण्णमुलोः ७।२”

### 7.1.9 अतो भिस ऐस् (id 71009)

- **now:** `भिस$S$6$1$`
- **suggested:** `भिसः$S$6$1$`
- **why:** the pada is written with its last sound as changed by sandhi in the sūtra; the padaccheda should give the pada itself (the case code already says so).
- **settled by:** the sūtra text and the prathamāvṛtti padaccheda; no source differs.
- **citations:**
  - prathamāvṛtti (Brahmadatta Jijñāsu), padaccheda on 7.1.9: “भिसः ६।१”
  - ashtadhyayi.com data.txt, field s (the sūtra text) on 7.1.9: “अतो भिस ऐस्”

### 7.1.69 विभाषा चिण्णमुलोः (id 71069)

- **now:** `चित्-णमुलोः$S$7$2$`
- **suggested:** `चिण्-णमुलोः$S$7$2$`
- **why:** as 6.4.93: the suffix is चिण्, not चित्.
- **settled by:** the sūtra text and the prathamāvṛtti padaccheda (and the Kāśikā where quoted); no source differs.
- **citations:**
  - Kāśikā on 7.1.69: “चिण् णमुल् इत्येतयोर्विभाषा लभेर्नुम् भवति”
  - ashtadhyayi.com data.txt, field s (the sūtra text) on 7.1.69: “विभाषा चिण्णमुलोः”

### 7.2.101 जराया जरसन्यतरस्याम् (id 72101)

- **now:** `जराया$S$6$1$`
- **suggested:** `जरायाः$S$6$1$`
- **why:** the pada is written with its last sound as changed by sandhi in the sūtra; the padaccheda should give the pada itself (the case code already says so).
- **settled by:** the sūtra text and the prathamāvṛtti padaccheda; no source differs.
- **citations:**
  - prathamāvṛtti (Brahmadatta Jijñāsu), padaccheda on 7.2.101: “जरायाः ६।१”
  - ashtadhyayi.com data.txt, field s (the sūtra text) on 7.2.101: “जराया जरसन्यतरस्याम्”

### 7.4.34 अशनायोदन्यधनाया बुभुक्षापिपासागर्द्धेषु (id 74034)

- **now:** `अशनायोदन्यधनाया$S$1$3$`
- **suggested:** `अशनायोदन्यधनायाः$S$1$3$`
- **why:** the pada is written with its last sound as changed by sandhi in the sūtra; the padaccheda should give the pada itself (the case code already says so).
- **settled by:** the sūtra text and the prathamāvṛtti padaccheda; no source differs.
- **citations:**
  - prathamāvṛtti (Brahmadatta Jijñāsu), padaccheda on 7.4.34: “अशनायोदन्यधनायाः १।३”
  - ashtadhyayi.com data.txt, field s (the sūtra text) on 7.4.34: “अशनायोदन्यधनाया बुभुक्षापिपासागर्द्धेषु”

### 8.1.55 आम एकान्तरमामन्त्रितमनन्तिके (id 81055)

- **now:** `आम$S$5$1$`
- **suggested:** `आमः$S$5$1$`
- **why:** the pada is written with its last sound as changed by sandhi in the sūtra; the padaccheda should give the pada itself (the case code already says so).
- **settled by:** the sūtra text and the prathamāvṛtti padaccheda; no source differs.
- **citations:**
  - prathamāvṛtti (Brahmadatta Jijñāsu), padaccheda on 8.1.55: “आमः ५।१”
  - ashtadhyayi.com data.txt, field s (the sūtra text) on 8.1.55: “आम एकान्तरमामन्त्रितमनन्तिके”

### 8.1.57 चनचिदिवगोत्रादितद्धिताम्रेडितेष्वगतेः (id 81057)

- **now:** `आगतेः$S$5$1$`
- **suggested:** `अगतेः$S$5$1$`
- **why:** the sūtra ends …आम्रेडितेष्वगतेः = अगतेः (“after a word that is not a gati”), with a short अ.
- **settled by:** the sūtra text and the prathamāvṛtti padaccheda (and the Kāśikā where quoted); no source differs.
- **citations:**
  - Kāśikā on 8.1.57: “परतोऽगतेरुत्तरं तिङन्तं नानुदात्तं भवति”
  - prathamāvṛtti (Brahmadatta Jijñāsu), padaccheda on 8.1.57: “अगतेः ५।१”

### 8.1.62 चाहलोप एवेत्यवधारणम् (id 81062)

- **now:** `चाहलोप$S$7$1$`
- **suggested:** `चाहलोपे$S$7$1$`
- **why:** the pada is written with its last sound as changed by sandhi in the sūtra; the padaccheda should give the pada itself (the case code already says so).
- **settled by:** the sūtra text and the prathamāvṛtti padaccheda; no source differs.
- **citations:**
  - prathamāvṛtti (Brahmadatta Jijñāsu), padaccheda on 8.1.62: “चाहलोपे ७।१”
  - ashtadhyayi.com data.txt, field s (the sūtra text) on 8.1.62: “चाहलोप एवेत्यवधारणम्”

### 8.1.66 यद्वृत्तान्नित्यम् (id 81066)

- **now:** `यद्वृतात्$S$5$1$`
- **suggested:** `यद्वृत्तात्$S$5$1$`
- **why:** the sūtra is यद्वृत्तान्नित्यम्: the word is वृत्त (double त्).
- **settled by:** the sūtra text and the prathamāvṛtti padaccheda (and the Kāśikā where quoted); no source differs.
- **citations:**
  - Kāśikā on 8.1.66: “यदो वृत्तं यद्वृत्तम्”
  - prathamāvṛtti (Brahmadatta Jijñāsu), padaccheda on 8.1.66: “यद्वृत्तात् ५।१”

### 8.2.76 र्वोरुपधाया दीर्घ इकः (id 82076)

- **now:** `दीर्घ$S$1$1$`
- **suggested:** `दीर्घः$S$1$1$`
- **why:** the pada is written with its last sound as changed by sandhi in the sūtra; the padaccheda should give the pada itself (the case code already says so).
- **settled by:** the sūtra text and the prathamāvṛtti padaccheda; no source differs.
- **citations:**
  - prathamāvṛtti (Brahmadatta Jijñāsu), padaccheda on 8.2.76: “दीर्घः १।१”
  - ashtadhyayi.com data.txt, field s (the sūtra text) on 8.2.76: “र्वोरुपधाया दीर्घ इकः”

### 8.2.94 निगृह्यानुयोगे च (id 82094)

- **now:** `निगृह्य$S$0$0$##अनुयोगे$S$7$1$`
- **suggested:** `निगृह्य-अनुयोगे$S$7$1$`
- **why:** the sūtra pada is the one compound निगृह्यानुयोगे (“in questioning after refuting”). The data splits it into the gerund निगृह्य and अनुयोगे; it should be one pada.
- **settled by:** Kāśikā and prathamāvṛtti agree; the Mahābhāṣya has no comment on 8.2.94.
- **citations:**
  - Kāśikā on 8.2.94: “तत्र निगृह्यानुयोगे यद् वाक्यं वर्तते तस्य टेः प्लुतो भवति विभाषा”
  - prathamāvṛtti (Brahmadatta Jijñāsu), padaccheda on 8.2.94: “निगृह्यानुयोगे ७।१”

## Commentary file `sutraani/laghukaumudi.txt`: text filed under a wrong id (8)

### 1.2.62 विशाखयोश्च (id 12062)

- **now:** `laghukaumudi.txt["12062"] = «सनः पूर्वो यो धातुस्तेन तुल्यं सन्नन्तादप्यात्मनेपदं स्यात्। एदिधिष्यते॥»`
- **suggested:** `empty string at "12062" (1.2.62 is not in the Laghukaumudī: data.txt lskn = 0). The text is the Laghukaumudī on 1.3.62 पूर्ववत् सनः (id 13062, lskn 738), where it already stands. The stray copy also has a typo (एदिधिष्यते for एदिधिषते).`
- **why:** a second, slightly different copy of the Laghukaumudī text on 1.3.62 is filed under 12062 (1.2.62 विशाखयोश्च); the two ids differ by a digit slip.
- **settled by:** the data itself (lskn) and the Siddhānta-kaumudī on 1.3.62; no muni involved.
- **citations:**
  - Laghu-kaumudī on 1.2.62: “सनः पूर्वो यो धातुस्तेन तुल्यं सन्नन्तादप्यात्मनेपदं स्यात्। एदिधिष्यते॥”
  - Laghu-kaumudī on 1.3.62: “सनः पूर्वो यो धातुस्तेन तुल्यं सन्नन्तादप्यात्मनेपदं स्यात् । एदिधिषते”
  - Siddhānta-kaumudī on 1.3.62: “एदिधिषते”

### 1.3.47 भासनोपसम्भाषाज्ञानयत्नविमत्युपमन्त्रणेषु वदः (id 13047)

- **now:** `laghukaumudi.txt["13047"] = «अजन्तस्येत्येव। श्रीपं ज्ञानवत्॥»`
- **suggested:** `empty string at "13047" (1.3.47 is not in the Laghukaumudī: data.txt lskn = 0). The text is the Laghukaumudī on 1.2.47 ह्रस्वो नपुंसके प्रातिपदिकस्य (id 12047, lskn 242), where it already stands.`
- **why:** a second, slightly different copy of the Laghukaumudī text on 1.2.47 is filed under 13047 (1.3.47 भासनोपसम्भाषाज्ञानयत्नविमत्युपमन्त्रणेषु वदः); the two ids differ by a digit slip.
- **settled by:** the data itself (lskn) and the Siddhānta-kaumudī on 1.2.47; no muni involved.
- **citations:**
  - Laghu-kaumudī on 1.3.47: “अजन्तस्येत्येव। श्रीपं ज्ञानवत्॥”
  - Laghu-kaumudī on 1.2.47: “अजन्तस्येत्येव । श्रीपं ज्ञानवत्”
  - Siddhānta-kaumudī on 1.2.47: “श्रीपम् । ज्ञानवत्”

### 2.2.26 दिङ्नामान्यन्तराले (id 22026)

- **now:** `laghukaumudi.txt["22026"] = «इवर्णोवर्णोपधाद्धलादेः रलन्तात्परौ क्त्वासनौ सेटौ वा कितौ स्तः। द्युतित्वा, द्योतित्वा। लिखित्वा, लेखित्वा। व्युपधात्किम्? वर्तित्वा। रलः किम्? एषित्वा। सेट् किम्? भुक्त्वा॥»`
- **suggested:** `empty string at "22026" (2.2.26 is not in the Laghukaumudī: data.txt lskn = 0). The text is the Laghukaumudī on 1.2.26 रलो व्युपधाद्धलादेः संश्च (id 12026, lskn 877), where it already stands. (The stray copy has lost the words “सेवित्वा । हलादेः किम्?”, so it reads “रलः किम्? एषित्वा”.)`
- **why:** a second, slightly different copy of the Laghukaumudī text on 1.2.26 is filed under 22026 (2.2.26 दिङ्नामान्यन्तराले); the two ids differ by a digit slip.
- **settled by:** the data itself (lskn) and the Siddhānta-kaumudī on 1.2.26; no muni involved.
- **citations:**
  - Laghu-kaumudī on 2.2.26: “इवर्णोवर्णोपधाद्धलादेः रलन्तात्परौ क्त्वासनौ सेटौ वा कितौ स्तः। द्युतित्वा, द्योतित्वा। लिखित्वा, लेखित्वा। व्युपधात्किम्? वर्तित्वा। रलः किम्? एषित्वा। सेट् किम्? भुक्त्वा॥”
  - Laghu-kaumudī on 1.2.26: “रलः किम् ? सेवित्वा । हलादेः किम् ? एषित्वा”
  - Siddhānta-kaumudī on 1.2.26: “क्त्वासनौ सेटौ वा कितौ स्तः”

### 3.3.46 प्रे लिप्सायाम् (id 33046)

- **now:** `laghukaumudi.txt["33046"] = «इवर्णान्तादच्। चयः। जयः॥»`
- **suggested:** `empty string at "33046" (3.3.46 is not in the Laghukaumudī: data.txt lskn = 0). The text is the Laghukaumudī on 3.3.56 एरच् (id 33056, lskn 851), where it already stands.`
- **why:** a second, slightly different copy of the Laghukaumudī text on 3.3.56 is filed under 33046 (3.3.46 प्रे लिप्सायाम्); the two ids differ by a digit slip.
- **settled by:** the data itself (lskn) and the Siddhānta-kaumudī on 3.3.56; no muni involved.
- **citations:**
  - Laghu-kaumudī on 3.3.46: “इवर्णान्तादच्। चयः। जयः॥”
  - Laghu-kaumudī on 3.3.56: “इवर्णान्तादच् । चयः । जयः”
  - Siddhānta-kaumudī on 3.3.56: “चयः । जयः”

### 6.1.133 स्यश्छन्दसि बहुलम् (id 61133)

- **now:** `laghukaumudi.txt["61133"] = «पदान्ते एङन्तस्य गोरवङ् वाचि। गवाग्रम्, गोऽग्रम्। पदान्ते किम्? गवि॥»`
- **suggested:** `empty string at "61133" (6.1.133 is not in the Laghukaumudī: data.txt lskn = 0). The text is the Laghukaumudī on 6.1.123 अवङ् स्फोटायनस्य (id 61123, lskn 47), where it already stands.`
- **why:** a second, slightly different copy of the Laghukaumudī text on 6.1.123 is filed under 61133 (6.1.133 स्यश्छन्दसि बहुलम्); the two ids differ by a digit slip.
- **settled by:** the data itself (lskn) and the Siddhānta-kaumudī on 6.1.123; no muni involved.
- **citations:**
  - Laghu-kaumudī on 6.1.133: “पदान्ते एङन्तस्य गोरवङ् वाचि। गवाग्रम्, गोऽग्रम्। पदान्ते किम्? गवि॥”
  - Laghu-kaumudī on 6.1.123: “पदान्ते एङन्तस्य गोरवङ् वाऽचि । गवाग्रम्, गोऽग्रम्”
  - Siddhānta-kaumudī on 6.1.123: “अचि परे पदान्ते गोरवङ् वा स्यात्”

### 6.2.184 निरुदकादीनि च (id 62184)

- **now:** `laghukaumudi.txt["62184"] = «अरित्रम्। लवित्रम्। धुवित्रम्। सवित्रम्। खनित्रम्। सहित्रम्। चरित्रम्॥»`
- **suggested:** `empty string at "62184" (6.2.184 is not in the Laghukaumudī: data.txt lskn = 0). The text is the Laghukaumudī on 3.2.184 अर्तिलूधूसूखनसहचर इत्रः (id 32184, lskn 842), where it already stands.`
- **why:** a second, slightly different copy of the Laghukaumudī text on 3.2.184 is filed under 62184 (6.2.184 निरुदकादीनि च); the two ids differ by a digit slip.
- **settled by:** the data itself (lskn) and the Siddhānta-kaumudī on 3.2.184; no muni involved.
- **citations:**
  - Laghu-kaumudī on 6.2.184: “अरित्रम्। लवित्रम्। धुवित्रम्। सवित्रम्। खनित्रम्। सहित्रम्। चरित्रम्॥”
  - Laghu-kaumudī on 3.2.184: “अरित्रम् । लवित्रम् । धुवित्रम्”
  - Siddhānta-kaumudī on 3.2.184: “अरित्रम् । लवित्रम्”

### 6.4.70 मयतेरिदन्यतरस्याम् (id 64070)

- **now:** `laghukaumudi.txt["64070"] = «अभ्यासस्यादेरतो दीर्घः स्यात्। आत। आततुः। आतुः। आतिथ। आतथुः। आत। आत। आतिव। आतिम। अतिता। अतिष्यति। अततु॥»`
- **suggested:** `empty string at "64070" (6.4.70 is not in the Laghukaumudī: data.txt lskn = 0). The text is the Laghukaumudī on 7.4.70 अत आदेः (id 74070, lskn 441), where it already stands.`
- **why:** a second, slightly different copy of the Laghukaumudī text on 7.4.70 is filed under 64070 (6.4.70 मयतेरिदन्यतरस्याम्); the two ids differ by a digit slip.
- **settled by:** the data itself (lskn) and the Siddhānta-kaumudī on 7.4.70; no muni involved.
- **citations:**
  - Laghu-kaumudī on 6.4.70: “अभ्यासस्यादेरतो दीर्घः स्यात्। आत। आततुः। आतुः। आतिथ। आतथुः। आत। आत। आतिव। आतिम। अतिता। अतिष्यति। अततु॥”
  - Laghu-kaumudī on 7.4.70: “अभ्यासस्यादेरतो दीर्घः स्यात्”
  - Siddhānta-kaumudī on 7.4.70: “अभ्यासस्यादेरतो दीर्घः स्यात्”

### 7.4.57 मुचोऽकर्मकस्य गुणो वा (id 74057)

- **now:** `laghukaumudi.txt["74057"] = «णिज्विज्विषामभ्यासस्य गुणः स्यात् श्लौ। नेनेक्ति। नेनिक्तः। नेनिजति। नेनिक्ते। निनेज, निनिजे। नेक्ता। नेक्ष्यति, नेक्ष्यते। नेनेक्तु। नेनिग्धि॥»`
- **suggested:** `empty string at "74057" (7.4.57 is not in the Laghukaumudī: data.txt lskn = 0). The text is the Laghukaumudī on 7.4.75 निजां त्रयाणां गुणः श्लौ (id 74075, lskn 625), where it already stands. Note the other way round: the entry at 74075 lacks the first example नेनेक्ति, which the stray copy and the Siddhānta-kaumudī have — please keep it when you delete the stray copy.`
- **why:** a second, slightly different copy of the Laghukaumudī text on 7.4.75 is filed under 74057 (7.4.57 मुचोऽकर्मकस्य गुणो वा); the two ids differ by a digit slip.
- **settled by:** the data itself (lskn) and the Siddhānta-kaumudī on 7.4.75; no muni involved.
- **citations:**
  - Laghu-kaumudī on 7.4.57: “णिज्विज्विषामभ्यासस्य गुणः स्यात् श्लौ। नेनेक्ति। नेनिक्तः। नेनिजति। नेनिक्ते। निनेज, निनिजे। नेक्ता। नेक्ष्यति, नेक्ष्यते। नेनेक्तु। नेनिग्धि॥”
  - Laghu-kaumudī on 7.4.75: “णिज्विज्विषामभ्यासस्य गुणः स्यात् श्लौ । नेनिक्तः”
  - Siddhānta-kaumudī on 7.4.75: “णिज्विज्विषामभ्यासस्य गुणः स्यात श्लौ । नेनेक्ति । नेनिक्तः”

## For your judgement

Not clearly errors: a question of style or of how far an anuvṛtti is listed. Evidence given; your call.

### 3.3.130 अन्येभ्योऽपि दृश्यते (id 33130) — `an`

- **now:** `कृत्$31093##युच्$33128##छन्दसि$33129`
- **possible change:** `कृत्$31093##ईषत्-दुस्-सुषु$33126##कृच्छ्र-अकृच्छ्र-अर्थेषु$33126##युच्$33128##छन्दसि$33129   (add ईषत्-दुस्-सुषु$33126; add कृच्छ्र-अकृच्छ्र-अर्थेषु$33126)`
- **why:** as 3.3.129 (main list): the prathamāvṛtti reads both conditions of 3.3.126 into 3.3.130 too; the Kāśikā on 3.3.130 does not repeat them.
- **citations:**
  - prathamāvṛtti (Brahmadatta Jijñāsu), artha on 3.3.130: “कृच्छ्राकृच्छ्रार्थेष्वीषदादिषूपपदेषु युच् प्रत्ययो भवति”

### 3.3.144 किंवृत्ते लिङ्लृटौ (id 33144) — `pc (pada)`

- **now:** `लिङ्लृटौ$S$1$2$`
- **possible change:** `लिङ्-लृटौ$S$1$2$`
- **why:** style, not an error: a compound left unhyphenated, where most compounds in the pc field are hyphenated (ऋ-हलोः, यञ्-इञोः). But the data also leaves many compounds unhyphenated (e.g. 7.2.86 युष्मदस्मदोः, 5.3.71 अव्ययसर्वनाम्नाम्), so this is your call. A dvandva of the lakāras लिङ् and लृट्.
- **citations:**
  - Kāśikā on 3.3.144: “धातोर्लिङ्लृटौ प्रत्ययौ भवतः”

### 5.3.73 अज्ञाते (id 53073) — `an`

- **now:** ``
- **possible change:** `तिङः$53056   (add तिङः$53056)`
- **why:** the data carries तिङः (5.3.56 तिङश्च) only at 5.3.71. The Kāśikā on 5.3.71 says तिङश्च is “in force here”, and the Kāśikā / prathamāvṛtti read “and after a tiṅanta” in 5.3.73 and 5.3.76 (the prathamāvṛtti also in 5.3.74, 5.3.77, 5.3.85). Whether to list it on each of these sūtras is a question of how far you list a section-wide anuvṛtti, so we leave it to you.
- **citations:**
  - Kāśikā on 5.3.71: “तिङश्च>> [[५.३.५६]] इति प्रकृतमत्र संबध्यते”
  - Kāśikā on 5.3.73: “वर्तमानात् प्रातिपदिकात् तिङन्तात् च स्वार्थे यथाविहितं प्रत्ययो भवति”
  - Kāśikā on 5.3.76: “सुबन्तात् तिङन्तात् च यथाविहितं प्रत्ययो भवति”
  - prathamāvṛtti (Brahmadatta Jijñāsu), artha on 5.3.74: “कुत्सितेऽर्थे वर्त्तमानात् प्रातिपदिकात् तिङन्ताच्च यथाविहितं प्रत्ययो भवति”
  - prathamāvṛtti (Brahmadatta Jijñāsu), artha on 5.3.85: “अल्पेऽर्थे वर्त्तमानात् प्रातिपदिकात् तिङन्ताच यथाविहितं प्रत्ययो भवति”

### 6.4.123 राधो हिंसायाम् (id 64123) — `an`

- **now:** `क्ङिति$64098##अभ्यासलोपः$64119##अतः$64120##थलि$64121##सेटि$64121`
- **possible change:** `क्ङिति$64098##अभ्यासलोपः$64119##अतः$64120##एकहल्मध्ये$64120##थलि$64121##सेटि$64121   (add एकहल्मध्ये$64120)`
- **why:** not found by our tool, noticed while checking 6.4.122–126: the Mahābhāṣya on 6.4.123 says एकहल्मध्ये runs on into 6.4.123 (and, as an alternative, अतः). The prathamāvṛtti stops एकहल्मध्ये at 6.4.121. The Bhāṣya outranks it, but it offers this as one of two answers.
- **citations:**
  - Mahābhāṣya on 6.4.123: “एकहल्मध्ये इति वर्तते”
  - Mahābhāṣya on 6.4.123: “अथवा -  अत इति वर्तते”
  - prathamāvṛtti (Brahmadatta Jijñāsu), anuvṛtti on 6.4.120: “'एकहल्मध्ये अनादेशादेः' की ६।४।१२१ तक जायेगी”

### 8.2.66 ससजुषो रुः (id 82066) — `pc (pada)`

- **now:** `ससजुषोः$S$6$2$`
- **possible change:** `स-सजुषोः$S$6$2$`
- **why:** style, not an error: a compound left unhyphenated, where most compounds in the pc field are hyphenated (ऋ-हलोः, यञ्-इञोः). But the data also leaves many compounds unhyphenated (e.g. 7.2.86 युष्मदस्मदोः, 5.3.71 अव्ययसर्वनाम्नाम्), so this is your call. A dvandva of the sound स् and the word सजुष्.
- **citations:**
  - Kāśikā on 8.2.66: “सकारान्तस्य पदस्य सजुष् इत्येतस्य च रुर्भवति”

### 8.2.72 वसुस्रंसुध्वंस्वनडुहां दः (id 82072) — `pc (pada)`

- **now:** `वसुस्रंसुध्वंस्वनडुहाम्$S$6$3$`
- **possible change:** `वसु-स्रंसु-ध्वंसु-अनडुहाम्$S$6$3$`
- **why:** style, not an error: a compound left unhyphenated, where most compounds in the pc field are hyphenated (ऋ-हलोः, यञ्-इञोः). But the data also leaves many compounds unhyphenated (e.g. 7.2.86 युष्मदस्मदोः, 5.3.71 अव्ययसर्वनाम्नाम्), so this is your call. Four members (the suffix वसु and three words); the form also keeps the internal sandhi ध्वंस्व-.
- **citations:**
  - Kāśikā on 8.2.72: “वस्वन्तस्य पदस्य सकारान्तस्य, स्रंसु, ध्वंसु, अनडुह् इत्येतेषां च दकारादेशो भवति”

### 8.3.1 मतुवसो रु सम्बुद्धौ छन्दसि (id 83001) — `pc (pada)`

- **now:** `मतुवसोः$S$6$2$`
- **possible change:** `मतु-वसोः$S$6$2$`
- **why:** style, not an error: a compound left unhyphenated, where most compounds in the pc field are hyphenated (ऋ-हलोः, यञ्-इञोः). But the data also leaves many compounds unhyphenated (e.g. 7.2.86 युष्मदस्मदोः, 5.3.71 अव्ययसर्वनाम्नाम्), so this is your call. A dvandva of the suffixes मतुप् and वसु.
- **citations:**
  - Kāśikā on 8.3.1: “मत्वन्तस्य वस्वन्तस्य च पदस्य रुरित्ययमादेशो भवति”

## Checked and withdrawn (the data is right)

Earlier notes on our side claimed these were errors; the sources say otherwise. Listed so nobody re-raises them.

### 6.2.21 आशङ्काबाधनेदीयस्सु संभावने (id 62021)

- **data:** `आशङ्क-आबाध-नेदियस्सु$S$7$3$`
- **earlier claim:** आशङ्क → आशङ्का (in ashtadhyayi-errata.json)
- **why withdrawn:** the stem आशङ्क is what the Kāśikā and the prathamāvṛtti read; only the नेदियस्→नेदीयस् typo stands (kept in the main list).
- **citations:**
  - Kāśikā on 6.2.21: “आशङ्क आबाध नेदीयस् इत्येतेषूत्तरपदेषु”
  - prathamāvṛtti (Brahmadatta Jijñāsu), artha on 6.2.21: “आशङ्क, अबाध, नेदीयस् इत्येतेषूत्तरपदेषु”

### 6.4.7 नोपधायाः (id 64007)

- **data:** `न$S$$$6`
- **earlier claim:** न is read as the negation; it should be नः, 6th (build.js PC_FIX)
- **why withdrawn:** the data does not code न as the negation (that would be न$S$0$0$): it uses its convention for a pada written without a case ending, “$S$$$<case>” (166 uses, e.g. 2.4.36 ल्यप्$S$$$7), here with case 6. The prathamāvṛtti also calls न a pada without a case ending; the Nyāsa calls it a 6th singular. Both mean “of a stem ending in न्”, which is what the data says.
- **citations:**
  - prathamāvṛtti (Brahmadatta Jijñāsu), padaccheda on 6.4.7: “न अविभक्त्यन्तं पदम्”
  - Nyāsa on 6.4.7: “न इति षष्ठएकवचनान्तम्”
  - Kāśikā on 6.4.7: “नान्तस्याङ्गस्योपधाया नामि परतो दीर्घो भवति”

### 7.4.46 दो दद् घोः (id 74046)

- **data:** `दथ्$S$1$1$`
- **earlier claim:** दथ् → दद् (in ashtadhyayi-errata.json)
- **why withdrawn:** the data is right: the Mahābhāṣya asks whether the replacement ends in त्, द्, ध् or थ् and concludes थ् (दथ्); the Kāśikā and the Siddhānta-kaumudī follow it. Only the prathamāvṛtti writes दद्.
- **citations:**
  - Mahābhāṣya on 7.4.46: “थान्तेऽदोषस्तस्मात्थान्तः”
  - Kāśikā on 7.4.46: “अयमादेशः थान्तः इष्यते”
  - Siddhānta-kaumudī on 7.4.46: “घुसंज्ञकस्य दा इत्यस्य दथ् स्यात्तादौ किति”

### 8.4.48 नादिन्याक्रोशे पुत्रस्य (id 84048)

- **data:** `आदिनी$S$$$7`
- **earlier claim:** the data gives आदिनी no case; it is the 7th (build.js PC_FIX)
- **why withdrawn:** the data codes आदिनी$S$$$7, i.e. a pada without a case ending used as a 7th — exactly what the prathamāvṛtti says (लुप्तसप्तम्यन्तनिर्देशः) and what the Kāśikā reads (आदिनी परतः).
- **citations:**
  - prathamāvṛtti (Brahmadatta Jijñāsu), padaccheda on 8.4.48: “आदिनि लुप्तसप्तम्यन्तनिर्देशः”
  - Kāśikā on 8.4.48: “आदिनी परत आक्रोशे गम्यमाने पुत्रशब्दस्य न द्वे भवतः”
