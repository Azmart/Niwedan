// All site copy lives here so it's easy to tweak without touching components.
// EN = English · NE = नेपाली (Nepali). Edit freely.

export const meta = {
  requestId: 'ART-001',
  filing: 'Filing No. 02',
  filingNe: 'निवेदन — संशोधित संस्करण',
  // Indirect signature: she knows exactly who; strangers don't. A callback to
  // her own verdict ("chitta bujhena"). Put your real name back here for a
  // private send if you ever want to.
  petitioner: 'उ — जसको निवेदन चित्त बुझेको थिएन',
  petitionerEn: 'The petitioner whose first appeal you weren’t convinced by',
  filedOn: 'Filed for one specific masterpiece',
}

// First-visit screen: pick music or silence before entering.
export const intro = {
  eyebrow: 'निवेदन · Request ART-001',
  titleEn: 'Shall we begin with a little music?',
  titleNe: 'अलिकति सङ्गीतसहित सुरु गरौँ?',
  subEn: 'This little page comes with a song. Entirely your call.',
  subNe: 'यो सानो पृष्ठसँग एउटा गीत छ। पूरै तपाईंकै इच्छा।',
  withMusicEn: 'Enter with music',
  withMusicNe: 'सङ्गीतसहित',
  silentEn: 'Enter in silence',
  silentNe: 'सङ्गीतबिना',
  noteEn: 'You can mute or unmute anytime, from the corner.',
  noteNe: 'कुनामा भएको बटनबाट जहिले पनि बन्द/खुला गर्न सकिन्छ।',
}

export const hero = {
  eyebrow: 'Request ID: ART-001 · निवेदन दर्ता',
  titleEn: 'Official Gallery Access Request',
  titleNe: 'आधिकारिक ग्यालरी पहुँच निवेदन',
  subtitleEn:
    'A respectful, slightly dramatic, fully documented request to save one masterpiece — safely.',
  subtitleNe:
    'एउटा उत्कृष्ट कलाकृति सुरक्षित राख्नका लागि गरिएको आदरपूर्ण, अलिकति नाटकीय, तर पूरै इमान्दार निवेदन।',
  ctaPrimary: 'Read the case',
  ctaSecondary: 'Skip to the request',
  scrollHint: 'Scroll, Your Honour · तल हेर्नुहोस्',
}

export const theCase = {
  label: 'Section I · The Case',
  headingEn: 'Temporary stories are not enough for permanent art.',
  headingNe: 'क्षणिक स्टोरीहरू स्थायी कलाका लागि पर्याप्त छैनन्।',
  points: [
    {
      no: '01',
      en: 'A story appeared — and, for a moment, the timeline held its breath.',
      ne: 'एउटा तस्बिर स्टोरीमा देखियो — र एकैछिन, समयले सास रोक्यो।',
    },
    {
      no: '02',
      en: 'A story disappears in 24 hours. Good art should not expire on a timer.',
      ne: 'स्टोरी २४ घण्टामा हराउँछ। राम्रो कला घडीको भरमा सकिनु हुँदैन।',
    },
    {
      no: '03',
      en: 'Screenshots feel like theft — legally questionable, emotionally suspicious.',
      ne: 'स्क्रिनसट चोरीजस्तो लाग्छ — कानुनी हिसाबले शंकास्पद, भावनात्मक हिसाबले अप्ठ्यारो।',
    },
    {
      no: '04',
      en: 'An HD version, sent to the inbox, is simply the honest path.',
      ne: 'इनबक्समा पठाइएको HD संस्करण नै सबैभन्दा इमान्दार बाटो हो।',
    },
  ],
}

export const evidence = {
  label: 'Section II · Exhibits',
  headingEn: 'Submitted into evidence',
  headingNe: 'प्रमाणका रूपमा पेस गरिएको',
  exhibits: [
    {
      tag: 'Exhibit A',
      titleEn: 'Story quality',
      titleNe: 'स्टोरी गुणस्तर',
      verdictEn: 'Temporary',
      verdictNe: 'अस्थायी',
      noteEn: 'Beautiful, but self-destructs in 24 hours.',
      noteNe: 'सुन्दर छ, तर २४ घण्टामै आफैं हराउँछ।',
      score: 28,
      tone: 'rose',
    },
    {
      tag: 'Exhibit B',
      titleEn: 'Screenshot quality',
      titleNe: 'स्क्रिनसट गुणस्तर',
      verdictEn: 'Unacceptable',
      verdictNe: 'अस्वीकार्य',
      noteEn: 'Compressed, cropped, and morally suspicious.',
      noteNe: 'थिचिएको, काटिएको — र नैतिक हिसाबले शंकास्पद।',
      score: 14,
      tone: 'rose',
    },
    {
      tag: 'Exhibit C',
      titleEn: 'Gallery preservation',
      titleNe: 'ग्यालरी संरक्षण',
      verdictEn: 'Safe',
      verdictNe: 'सुरक्षित',
      noteEn: 'Archived with care, admired responsibly.',
      noteNe: 'मायाका साथ सुरक्षित, जिम्मेवारीपूर्वक प्रशंसा।',
      score: 92,
      tone: 'sky',
    },
    {
      tag: 'Exhibit D',
      titleEn: 'HD inbox version',
      titleNe: 'HD इनबक्स संस्करण',
      verdictEn: 'Ideal',
      verdictNe: 'आदर्श',
      noteEn: 'Original quality, delivered with consent.',
      noteNe: 'मौलिक गुणस्तर, अनुमतिसहित प्राप्त।',
      score: 100,
      tone: 'sky',
    },
  ],
}

export const petition = {
  label: 'Section III · The Petition',
  headingEn: 'The Petition',
  headingNe: 'निवेदन-पत्र',
  // The polished, formal-but-warm English request.
  bodyEn:
    'I hereby request your kind permission to save the aforementioned piece of art in my phone gallery — strictly for admiration, safekeeping, and occasional smiling purposes. Upon approval, I also humbly request the HD version in the inbox, because screenshotting a story feels both illegal and disrespectful to the quality of the masterpiece.',
  // A clearer, warmer Nepali petition (the "this time it lands" version).
  bodyNe: [
    'महोदया,',
    'तपाईंले स्टोरीमा हालेको त्यो तस्बिर हेर्दा लाग्यो — यो त २४ घण्टामा हराउनलाई बनेकै होइन।',
    'त्यसैले अलिकति औपचारिक, अलिकति हाँसो उठ्दो, तर पूरै इमान्दारीसाथ यो निवेदन गर्दैछु — के त्यो तस्बिर मेरो फोनको ग्यालरीमा सुरक्षित राख्न अनुमति पाउँला? केवल हेर्न, सम्हालेर राख्न, र बेला-बेला मुस्कुराउनका लागि।',
    'अनुमति भयो भने, स्क्रिनसटले गुणस्तर बिगार्ने हुनाले, इनबक्समै HD मा पठाइदिनुभए हुन्थ्यो।',
    'अनि — तपाईंले "हुँदैन" भन्नुभयो भने पनि केही फरक पर्दैन। ग्यालरी खाली रहला, तर तारिफ भने सधैं रहन्छ।',
  ],
  signoffNe: 'सादर,',
  // The very first message that was actually sent — kept on record.
  firstDraft: {
    label: 'Exhibit Ø · The first dispatch',
    noteEn:
      'For the record: the original message, filed earlier. The verdict was — "message alik chitta bujhena." This site is the appeal.',
    noteNe: 'अभिलेखका लागि — पहिले पठाइएको मूल सन्देश। यो वेबसाइट त्यसैको पुनरावेदन हो।',
    text: [
      'महोदय,',
      'तपाईंका सुन्दर सुन्दर तस्बिरहरू मेरो फोनको ग्यालरीमा सुरक्षित रुपमा राख्न यही मेसेज मार्फत निवेदन गर्न चाहन्छु। यदि तपाईंलाई कुनै प्रकारको आपत्ति छैन भने अनुमति स्वीकृत गरिदिनुहुन हार्दिक अपिल गर्दछु। अनुमतिका साथसाथै स्टोरीमा हालेको तस्बिर स्क्रीनशट हान्नुपर्दा चोरी गरेको जस्तो अनुभूति हुने र राम्ररी नआउने भएकाले सिधै इनबक्समा HD मा पठाइदिनुहुन पनि आग्रह गर्दछु।',
      'तपाईँको,',
      '— [ signature redacted ]',
    ],
  },
}

export const choice = {
  label: 'Section IV · The Verdict',
  headingEn: 'The decision rests entirely with you.',
  headingNe: 'अन्तिम निर्णय पूरै तपाईंकै हातमा छ।',
  subEn: 'Three options. No wrong answers. Consent required, always.',
  subNe: 'तीन विकल्प। कुनै गलत उत्तर छैन। अनुमति सधैं अनिवार्य।',
  options: {
    granted: {
      labelEn: 'Permission Granted',
      labelNe: 'अनुमति स्वीकृत',
      modalTitleEn: 'Permission recorded.',
      modalTitleNe: 'अनुमति दर्ता भयो।',
      modalBodyEn:
        'The Gallery Department is now emotionally prepared. One frame has been reserved, dusted, and lit perfectly. Thank you, Your Honour.',
      modalBodyNe:
        'ग्यालरी विभाग अब भावनात्मक रूपमा तयार छ। एउटा फ्रेम छुट्याइयो, सफा गरियो, र राम्ररी उज्यालो पारियो। धन्यवाद।',
    },
    hd: {
      labelEn: 'Send HD Version First',
      labelNe: 'पहिले HD पठाउनुहोस्',
      modalTitleEn: 'Excellent choice.',
      modalTitleNe: 'उत्कृष्ट निर्णय।',
      modalBodyEn:
        'The Screenshot Department has been officially shut down. Archival accuracy is now guaranteed. The inbox awaits, with great anticipation and decent storage space.',
      modalBodyNe:
        'स्क्रिनसट विभाग आधिकारिक रूपमा बन्द गरियो। अब मौलिक गुणस्तरको ग्यारेन्टी। इनबक्स पर्खिरहेको छ।',
    },
    convince: {
      labelEn: 'Needs More Convincing',
      labelNe: 'अझै मन परेन',
    },
  },
}

export const appeal = {
  label: 'Closing Argument · पुनरावेदन',
  headingEn: 'Permission to approach the bench?',
  headingNe: 'एउटा अन्तिम कुरा राख्न पाऊँ?',
  bodyEn:
    'If the evidence so far has not convinced the court, allow one last argument. I am not asking to keep the photo merely because it is a good picture. I am asking because, for exactly twenty-four hours, the day looked a little brighter — and I would simply like permission to keep a small piece of that brightness for the days that need it. No pressure, no deadline. The request stays open for as long as you like, and "no" is a complete, respected, and perfectly fine answer.',
  bodyNe:
    'यदि अहिलेसम्मका प्रमाणले अदालतलाई विश्वस्त पारेनन् भने, अन्तिम एउटा कुरा राख्न चाहन्छु। म त्यो तस्बिर राख्न खोजेको राम्रो तस्बिर भएर मात्र होइन — चौबीस घण्टासम्म दिन अलिकति उज्यालो भएको थियो, र त्यही उज्यालोको सानो टुक्रा साँचेर राख्ने अनुमति मात्र मागेको हुँ। कुनै हतार छैन, कुनै दबाब छैन। "हुँदैन" भन्नु पनि पूरै ठिक, र पूरै सम्मानित उत्तर हो।',
}

export const finalNote = {
  label: 'Section V · On the Record',
  headingEn: 'Jokes aside — only with your permission.',
  headingNe: 'ठट्टा बाहेक — सबै कुरा तपाईंकै अनुमतिमा।',
  bodyEn:
    'If you say no, the gallery stays empty and that is completely okay. The compliment is permanent either way. Your comfort matters more than any photo, and "no" will always be respected — no follow-up filings, promise.',
  bodyNe:
    'तपाईंले "हुँदैन" भन्नुभयो भने ग्यालरी खाली रहन्छ — र त्यो पूरै ठिक छ। तारिफ भने जे भए पनि सधैं रहन्छ। कुनै तस्बिरभन्दा तपाईंको सहजता ठूलो कुरा हो।',
  sealEn: 'Drafted with respect',
  sealNe: 'आदरसहित',
}

export const footer = {
  lineEn: 'Consent required. The law of respect remains undefeated.',
  lineNe: 'अनुमति अनिवार्य। आदरको नियम सधैं अपराजित।',
  privacyEn:
    'The only thing ever shared is which option you picked — never anything personal.',
  privacyNe:
    'साझा हुने एउटै कुरा भनेको तपाईंले छानेको विकल्प मात्र हो — व्यक्तिगत केही पनि होइन।',
}
