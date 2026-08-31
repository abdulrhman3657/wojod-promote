export const ACCENT = '#2b72ee';

export const WAITLIST_ENDPOINT = import.meta.env.VITE_WAITLIST_ENDPOINT || '';

export const SERVICE_ICONS = {
  email: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  domain: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a13 13 0 0 1 0 18"/><path d="M12 3a13 13 0 0 0 0 18"/>',
  website: '<rect x="3" y="4" width="18" height="15" rx="2"/><path d="M3 9h18"/>',
};

export const SERVICES = [
  { key: 'email' },
  { key: 'domain' },
  { key: 'website' },
];

export const COUNTRIES = [
  { code: 'SA', name: 'Saudi Arabia', dial: '966', flag: '🇸🇦' },
  { code: 'AE', name: 'United Arab Emirates', dial: '971', flag: '🇦🇪' },
  { code: 'KW', name: 'Kuwait', dial: '965', flag: '🇰🇼' },
  { code: 'QA', name: 'Qatar', dial: '974', flag: '🇶🇦' },
  { code: 'BH', name: 'Bahrain', dial: '973', flag: '🇧🇭' },
  { code: 'OM', name: 'Oman', dial: '968', flag: '🇴🇲' },
  { code: 'EG', name: 'Egypt', dial: '20', flag: '🇪🇬' },
  { code: 'JO', name: 'Jordan', dial: '962', flag: '🇯🇴' },
  { code: 'LB', name: 'Lebanon', dial: '961', flag: '🇱🇧' },
  { code: 'IQ', name: 'Iraq', dial: '964', flag: '🇮🇶' },
  { code: 'YE', name: 'Yemen', dial: '967', flag: '🇾🇪' },
  { code: 'SY', name: 'Syria', dial: '963', flag: '🇸🇾' },
  { code: 'PS', name: 'Palestine', dial: '970', flag: '🇵🇸' },
  { code: 'MA', name: 'Morocco', dial: '212', flag: '🇲🇦' },
  { code: 'DZ', name: 'Algeria', dial: '213', flag: '🇩🇿' },
  { code: 'TN', name: 'Tunisia', dial: '216', flag: '🇹🇳' },
  { code: 'LY', name: 'Libya', dial: '218', flag: '🇱🇾' },
  { code: 'SD', name: 'Sudan', dial: '249', flag: '🇸🇩' },
  { code: 'US', name: 'United States', dial: '1', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', dial: '44', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', dial: '1', flag: '🇨🇦' },
  { code: 'FR', name: 'France', dial: '33', flag: '🇫🇷' },
  { code: 'DE', name: 'Germany', dial: '49', flag: '🇩🇪' },
  { code: 'ES', name: 'Spain', dial: '34', flag: '🇪🇸' },
  { code: 'IT', name: 'Italy', dial: '39', flag: '🇮🇹' },
  { code: 'TR', name: 'Turkey', dial: '90', flag: '🇹🇷' },
  { code: 'IN', name: 'India', dial: '91', flag: '🇮🇳' },
  { code: 'PK', name: 'Pakistan', dial: '92', flag: '🇵🇰' },
  { code: 'BD', name: 'Bangladesh', dial: '880', flag: '🇧🇩' },
  { code: 'PH', name: 'Philippines', dial: '63', flag: '🇵🇭' },
  { code: 'ID', name: 'Indonesia', dial: '62', flag: '🇮🇩' },
  { code: 'MY', name: 'Malaysia', dial: '60', flag: '🇲🇾' },
  { code: 'CN', name: 'China', dial: '86', flag: '🇨🇳' },
  { code: 'JP', name: 'Japan', dial: '81', flag: '🇯🇵' },
  { code: 'KR', name: 'South Korea', dial: '82', flag: '🇰🇷' },
  { code: 'AU', name: 'Australia', dial: '61', flag: '🇦🇺' },
  { code: 'ZA', name: 'South Africa', dial: '27', flag: '🇿🇦' },
  { code: 'NG', name: 'Nigeria', dial: '234', flag: '🇳🇬' },
  { code: 'BR', name: 'Brazil', dial: '55', flag: '🇧🇷' },
];

// Early-access capacity. `baseline` is a starting offset the counter begins
// from — real sign-ups read from the sheet are added on top of it, so the
// displayed figure is baseline + actual registrations, not the raw row count.
export const SPOTS = { baseline: 175, total: 1000 };

// WhatsApp contact. Stored in international form (no +, no leading zero):
// 0530482170 -> 966530482170. wa.me requires exactly this shape.
export const WHATSAPP = '966530482170';

// Social profiles shown in the footer. `key` picks the icon path in App.jsx.
export const SOCIALS = [
  { key: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/wojod.sa/' },
  { key: 'x', label: 'X', href: 'https://x.com/Wojod_sa' },
  { key: 'tiktok', label: 'TikTok', href: 'https://www.tiktok.com/@wojod.sa' },
  { key: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/company/wojod-%D9%88%D8%AC%D9%88%D8%AF' },
];

export const T = {
  en: {
    errors: {
      name: 'Please enter your name.',
      emailRequired: 'Please enter your email address.',
      email: 'Please enter a valid email address.',
      phoneRequired: 'Please enter your mobile number.',
      phone: 'Please enter a valid mobile number.',
      businessType: 'Please select your business type.',
      services: 'Please select at least one service.',
      generic: 'Something went wrong. Please try again.',
    },
    countrySearchPlaceholder: 'Search country or code',
    businessSearchPlaceholder: 'Search business type',
    businessNoResults: 'No business types found',
    hero: {
      headline: 'Your digital presence starts here',
      desc: 'Build and manage your online presence in one place, without the technical hassle',
      cta1: 'Join the Waitlist',
    },
    problem: {
      heading1: 'Why ',
      heading2: 'Wojod',
      heading3: '?',
      body: 'Wojod is built around one goal: improving your digital presence and making it easy to manage as your business grows.',
    },
    offer: {
      eyebrow: 'What we offer',
      cards: {
        domain: {
          title: 'Domain',
          body: 'Find and register the .sa domain your business will be known by',
          alt: 'A .sa domain search bar',
        },
        email: {
          title: 'Professional Email',
          body: 'Get a professional email that matches your domain name',
          alt: 'Gmail and Outlook app tiles',
        },
        landing: {
          title: 'Live Landing Page',
          body: 'Get a professional landing page live without the technical hassle',
          alt: 'Landing page wireframe',
        },
      },
    },
    early: {
      headline: 'Join early access',
      desc: 'Join Wojod waiting list and get a free live landing page with 1 month of hosting, early access, plus closer support from our team.',
      spots: '{taken} of {total} spots taken',
      fullName: 'Full name',
      email: 'Email address',
      phone: 'Mobile number',
      businessTypeLabel: 'Your business type',
      businessTypePlaceholder: 'Select your business type',
      servicesLabel: 'What services are you interested in?',
      servicesSub: 'Select all that apply',
      ctaIdle: 'Join the waitlist',
      ctaSubmitting: 'Joining...',
      ctaSuccess: "✓ You're in",
      success: "You're on the list.",
      successSub: "We'll keep you updated when Wojod is ready.",
      duplicate: "You're already on the list.",
      genericError: 'Something went wrong. Please try again.',
      services: { email: 'Email', domain: 'Domain', website: 'Live landing page' },
      modal: {
        successTitle: "You're on the list",
        successBody: "Your place has been reserved for early access to Wojod. We'll be in touch when there's something worth sharing.",
        successBtn: 'Got it ✓',
        duplicateTitle: "You're already on the list",
        duplicateBody: 'Your interest has already been registered, and your place is reserved for early access to Wojod.',
        duplicateBtn: 'Got it ✓',
        errorTitle: 'Something went wrong',
        errorBody: "We couldn't complete your registration this time. Please try again.",
        errorBtn: 'Try again',
      },
    },
    footer: { contact: 'Contact us' },
  },
  ar: {
    errors: {
      name: 'يرجى إدخال اسمك.',
      emailRequired: 'يرجى إدخال بريدك الإلكتروني.',
      email: 'يرجى إدخال بريد إلكتروني صحيح.',
      phoneRequired: 'يرجى إدخال رقم جوالك.',
      phone: 'يرجى إدخال رقم جوال صحيح.',
      businessType: 'يرجى اختيار نوع نشاطك.',
      services: 'يرجى اختيار خدمة واحدة على الأقل.',
      generic: 'حدث خطأ ما. يرجى المحاولة مرة أخرى.',
    },
    countrySearchPlaceholder: 'ابحث عن دولة أو رمز',
    businessSearchPlaceholder: 'ابحث عن نوع نشاطك',
    businessNoResults: 'لم نجد نوع نشاط مطابق',
    hero: {
      headline: 'وجودك الرقمي يبدأ هنا',
      desc: 'وجود يساعدك في بناء وجودك الرقمي وإدارته بسهولة، بدون تعقيدات تقنية',
      cta1: 'انضم إلى قائمة الانتظار',
    },
    problem: {
      heading1: 'ليش ',
      heading2: 'وجود',
      heading3: '؟',
      body: 'لأن سبب وجودنا بسيط: نأسس ونطوّر وجودك الرقمي ونخلي إدارته أسهل مع نمو مشروعك.',
    },
    offer: {
      eyebrow: 'خدماتنا',
      cards: {
        domain: {
          title: 'النطاق (الدومين)',
          body: 'وجود يساعدك تختار النطاق المناسب لك ويسهّل عليك تسجيله',
          alt: 'شريط البحث عن نطاق .sa',
        },
        email: {
          title: 'البريد الإلكتروني',
          body: 'بريد باسم نطاقك يعطي تواصلك شكل أكثر احترافية',
          alt: 'أيقونات تطبيقات Gmail و Outlook',
        },
        landing: {
          title: 'موقع تعريفي',
          body: 'موقع يعرّف الناس على مشروعك، وتنشره بضغطة زر بدون أي تعقيد تقني',
          alt: 'مخطط أولي لموقع تعريفي',
        },
      },
    },
    early: {
      headline: 'احجز مكانك',
      desc: 'سجّل في قائمة انتظار وجود وخذ موقع تعريفي لمشروعك مجانًا لأول شهر، مع وصول مبكر لخدمات النطاق والبريد الإلكتروني.',
      spots: '{taken} من {total} مقعد محجوز',
      fullName: 'الاسم الكامل',
      email: 'البريد الإلكتروني',
      phone: 'رقم الجوال',
      businessTypeLabel: 'نوع نشاطك',
      businessTypePlaceholder: 'اختر نوع نشاطك',
      servicesLabel: 'ما الخدمات التي تهمك؟',
      servicesSub: 'اختر كل ما ينطبق عليك',
      ctaIdle: 'انضم إلى قائمة الانتظار',
      ctaSubmitting: 'جارٍ الانضمام...',
      ctaSuccess: '✓ تم الانضمام',
      success: 'تم تسجيل اهتمامك.',
      successSub: 'سنوافيك بكل جديد عند اقتراب إطلاق Wojod.',
      duplicate: 'أنت مسجل بالفعل.',
      genericError: 'حدث خطأ. حاول مرة أخرى.',
      services: { email: 'البريد الإلكتروني', domain: 'النطاق', website: 'موقع تعريفي' },
      modal: {
        successTitle: 'تم تسجيل اهتمامك',
        successBody: 'تم حجز مكانك ضمن الوصول المبكر إلى Wojod. سنكون على تواصل معك قريبًا بكل جديد.',
        successBtn: 'رائع، شكرًا لك',
        duplicateTitle: 'أنت مسجل بالفعل',
        duplicateBody: 'تم تسجيل اهتمامك مسبقًا، ومكانك محفوظ ضمن الوصول المبكر إلى Wojod.',
        duplicateBtn: 'ممتاز ✓',
        errorTitle: 'لم نتمكن من تسجيل طلبك',
        errorBody: 'حدث خطأ بسيط أثناء التسجيل. حاول مرة أخرى، وسنكون بانتظارك.',
        errorBtn: 'حاول مرة أخرى',
      },
    },
    footer: { contact: 'تواصل معنا' },
  },
};

export const BUSINESS_TYPES_EN = {
  health: 'Health & Wellness',
  tech: 'Technology & Software',
  retail: 'Retail & E-commerce',
  hospitality: 'Hospitality & Food',
  finance: 'Finance & Banking',
  law: 'Law & Legal Services',
  education: 'Education & Training',
  'real-estate': 'Real Estate & Construction',
  beauty: 'Beauty & Personal Care',
  fitness: 'Fitness & Sports',
  'professional-services': 'Professional Services & Consulting',
  creative: 'Creative, Media & Marketing',
  manufacturing: 'Manufacturing & Industrial',
  logistics: 'Logistics & Transportation',
  automotive: 'Automotive',
  agriculture: 'Agriculture & Food Production',
  energy: 'Energy & Utilities',
  travel: 'Travel & Tourism',
  nonprofit: 'Nonprofit & Government',
  events: 'Events & Entertainment',
  other: 'Other',
};

export const BUSINESS_TYPES_AR = {
  health: 'الصحة والعافية',
  tech: 'التقنية والبرمجيات',
  retail: 'التجزئة والتجارة الإلكترونية',
  hospitality: 'الضيافة والأغذية',
  finance: 'المالية والمصرفية',
  law: 'القانون والخدمات القانونية',
  education: 'التعليم والتدريب',
  'real-estate': 'العقارات والإنشاءات',
  beauty: 'التجميل والعناية الشخصية',
  fitness: 'اللياقة والرياضة',
  'professional-services': 'الخدمات المهنية والاستشارات',
  creative: 'الإبداع والإعلام والتسويق',
  manufacturing: 'التصنيع والصناعة',
  logistics: 'الخدمات اللوجستية والنقل',
  automotive: 'السيارات',
  agriculture: 'الزراعة والإنتاج الغذائي',
  energy: 'الطاقة والمرافق',
  travel: 'السفر والسياحة',
  nonprofit: 'القطاع غير الربحي والحكومي',
  events: 'الفعاليات والترفيه',
  other: 'أخرى',
};
