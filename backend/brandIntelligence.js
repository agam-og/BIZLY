function createEmptyBrandProfile(query) {
  return {
    query,

    identity: {
      name: query,
      description: null,
      category: null,
      location: null
    },

    audience: [],

    positioning: {
      statement: null,
      keywords: [],
      differentiators: []
    },

    contentThemes: [],

    tone: [],

    visualPatterns: {
      colors: [],
      typography: [],
      imagery: [],
      layoutPatterns: []
    },

    products: [],

    socialSignals: {
      platforms: [],
      postingPatterns: [],
      recurringTopics: [],
      contentFormats: []
    },

    trends: [],

    uxOpportunities: [],

    sources: [],

    evidence: []
  };
}


// --------------------------------------------------
// EVIDENCE
// --------------------------------------------------

function addEvidence(profile, evidence) {
  if (!evidence) return;

  profile.evidence.push({
    source: evidence.source || 'unknown',
    url: evidence.url || null,
    type: evidence.type || 'unknown',
    content: evidence.content || '',
    collectedAt:
      evidence.collectedAt ||
      new Date().toISOString()
  });
}


// --------------------------------------------------
// HELPERS
// --------------------------------------------------

function cleanText(text) {
  return String(text || '')
    .replace(/\s+/g, ' ')
    .trim();
}


function unique(items) {
  return [
    ...new Set(
      items
        .filter(Boolean)
        .map(item => cleanText(item))
    )
  ];
}


function getAllText(profile) {
  return profile.evidence
    .map(item => item.content || '')
    .join(' ');
}


function getLowerText(profile) {
  return getAllText(profile).toLowerCase();
}


function containsAny(text, keywords) {
  return keywords.some(keyword =>
    text.includes(keyword)
  );
}


// --------------------------------------------------
// IDENTITY
// --------------------------------------------------

function extractIdentity(profile) {
  const text = getAllText(profile);
  const lower = text.toLowerCase();

  const descriptionPatterns = [
    /is an? ([^.]{20,180})\./i,
    /is a ([^.]{20,180})\./i,
    /description:\s*([^.\n]{20,180})/i,
    /mission is to ([^.]{20,180})\./i
  ];

  for (const pattern of descriptionPatterns) {
    const match = text.match(pattern);

    if (match) {
      profile.identity.description =
        cleanText(match[0]);

      break;
    }
  }

  const categories = [
    {
      name: 'AI / Artificial Intelligence',
      keywords: [
        'artificial intelligence',
        'machine learning',
        'ai research',
        'ai company',
        'artificial general intelligence',
        'generative ai'
      ]
    },

    {
      name: 'Software / Technology',
      keywords: [
        'software',
        'technology company',
        'software company',
        'technology platform',
        'developer platform'
      ]
    },

    {
      name: 'Design / Creative',
      keywords: [
        'design studio',
        'creative studio',
        'branding agency',
        'creative agency'
      ]
    },

    {
      name: 'Education',
      keywords: [
        'education',
        'university',
        'learning platform',
        'online courses',
        'education platform'
      ]
    },

    {
      name: 'E-commerce / Retail',
      keywords: [
        'ecommerce',
        'e-commerce',
        'online store',
        'retail brand'
      ]
    }
  ];

  const matchedCategory =
    categories.find(category =>
      containsAny(
        lower,
        category.keywords
      )
    );

  if (matchedCategory) {
    profile.identity.category =
      matchedCategory.name;
  }

  const locationPatterns = [
    /based in ([A-Z][A-Za-z ,.-]{2,60})/i,
    /headquartered in ([A-Z][A-Za-z ,.-]{2,60})/i,
    /located in ([A-Z][A-Za-z ,.-]{2,60})/i
  ];

  for (const pattern of locationPatterns) {
    const match = text.match(pattern);

    if (match) {
      profile.identity.location =
        cleanText(match[1]);

      break;
    }
  }
}


// --------------------------------------------------
// AUDIENCE
// --------------------------------------------------

function extractAudience(profile) {
  const text = getLowerText(profile);

  const audienceGroups = [
    {
      name: 'Developers',
      keywords: [
        'developer',
        'developers',
        'programmers',
        'coding'
      ]
    },

    {
      name: 'Researchers',
      keywords: [
        'researcher',
        'researchers',
        'research community',
        'scientists'
      ]
    },

    {
      name: 'Businesses',
      keywords: [
        'businesses',
        'enterprise',
        'companies',
        'organizations',
        'business'
      ]
    },

    {
      name: 'Creators',
      keywords: [
        'creator',
        'creators',
        'artists',
        'creative professionals'
      ]
    },

    {
      name: 'Students',
      keywords: [
        'student',
        'students',
        'learners'
      ]
    },

    {
      name: 'Consumers',
      keywords: [
        'consumers',
        'users',
        'customers',
        'individual users'
      ]
    }
  ];

  profile.audience =
    audienceGroups
      .filter(group =>
        containsAny(
          text,
          group.keywords
        )
      )
      .map(group => group.name);
}


// --------------------------------------------------
// POSITIONING
// --------------------------------------------------

function extractPositioning(profile) {
  const text = getAllText(profile);
  const lower = text.toLowerCase();

  const positioningPatterns = [
    /our mission is to ([^.]{20,200})/i,
    /mission is to ([^.]{20,200})/i,
    /dedicated to ([^.]{20,200})/i,
    /focused on ([^.]{20,200})/i,
    /committed to ([^.]{20,200})/i
  ];

  for (const pattern of positioningPatterns) {
    const match = text.match(pattern);

    if (match) {
      profile.positioning.statement =
        cleanText(match[1]);

      break;
    }
  }

  const keywordGroups = {
    ai: [
      'artificial intelligence',
      'ai',
      'machine learning',
      'deep learning',
      'generative ai'
    ],

    research: [
      'research',
      'researcher',
      'scientific',
      'science'
    ],

    safety: [
      'safety',
      'alignment',
      'responsible ai',
      'ethical'
    ],

    technology: [
      'technology',
      'software',
      'platform',
      'developer'
    ],

    innovation: [
      'innovation',
      'advancement',
      'breakthrough',
      'future'
    ]
  };

  const keywords = [];

  for (const [group, terms] of Object.entries(
    keywordGroups
  )) {
    if (
      containsAny(
        lower,
        terms
      )
    ) {
      keywords.push(group);
    }
  }

  profile.positioning.keywords =
    unique(keywords);

  const differentiatorSignals = [
    {
      label: 'Research-driven',
      keywords: [
        'research',
        'research lab',
        'scientific'
      ]
    },

    {
      label: 'Developer-focused',
      keywords: [
        'developers',
        'api',
        'developer platform'
      ]
    },

    {
      label: 'Safety-focused',
      keywords: [
        'safety',
        'alignment',
        'responsible'
      ]
    },

    {
      label: 'Product-focused',
      keywords: [
        'products',
        'product',
        'services'
      ]
    },

    {
      label: 'Open collaboration',
      keywords: [
        'open source',
        'collaboration',
        'publish',
        'community'
      ]
    }
  ];

  profile.positioning.differentiators =
    differentiatorSignals
      .filter(signal =>
        containsAny(
          lower,
          signal.keywords
        )
      )
      .map(signal => signal.label);
}


// --------------------------------------------------
// CONTENT THEMES
// --------------------------------------------------

function extractContentThemes(profile) {
  const text = getLowerText(profile);

  const themes = [
    {
      category: 'Artificial Intelligence',
      signals: [
        'artificial intelligence',
        'ai',
        'machine learning',
        'generative ai'
      ]
    },

    {
      category: 'Research',
      signals: [
        'research',
        'research paper',
        'scientific',
        'researchers'
      ]
    },

    {
      category: 'Developer Technology',
      signals: [
        'developer',
        'api',
        'coding',
        'software'
      ]
    },

    {
      category: 'AI Safety',
      signals: [
        'safety',
        'alignment',
        'responsible ai'
      ]
    },

    {
      category: 'Products',
      signals: [
        'product',
        'products',
        'services',
        'platform'
      ]
    },

    {
      category: 'Education',
      signals: [
        'education',
        'learning',
        'course',
        'students'
      ]
    }
  ];

  profile.contentThemes =
    themes
      .map(theme => ({
        category: theme.category,
        signals: theme.signals.filter(
          signal =>
            text.includes(signal)
        )
      }))
      .filter(theme =>
        theme.signals.length > 0
      );
}


// --------------------------------------------------
// TONE
// --------------------------------------------------

function extractTone(profile) {
  const text = getLowerText(profile);

  const tones = [
    {
      name: 'Technical',
      keywords: [
        'technology',
        'engineering',
        'developer',
        'technical',
        'software'
      ]
    },

    {
      name: 'Research-oriented',
      keywords: [
        'research',
        'scientific',
        'researchers',
        'study'
      ]
    },

    {
      name: 'Forward-looking',
      keywords: [
        'future',
        'advancement',
        'next generation',
        'innovation'
      ]
    },

    {
      name: 'Mission-driven',
      keywords: [
        'mission',
        'benefit humanity',
        'impact'
      ]
    },

    {
      name: 'Educational',
      keywords: [
        'learn',
        'learning',
        'education',
        'explained'
      ]
    }
  ];

  profile.tone =
    tones
      .filter(tone =>
        containsAny(
          text,
          tone.keywords
        )
      )
      .map(tone => tone.name);
}


// --------------------------------------------------
// PRODUCTS
// --------------------------------------------------

function extractProducts(profile) {
  const text = getLowerText(profile);

  const knownProducts = [
    'ChatGPT',
    'API',
    'Codex',
    'Whisper',
    'DALL-E',
    'GPT',
    'Sora'
  ];

  profile.products =
    knownProducts.filter(product =>
      text.includes(
        product.toLowerCase()
      )
    );
}


// --------------------------------------------------
// VISUAL SIGNALS
// --------------------------------------------------

function extractVisualPatterns(profile) {
  const text = getLowerText(profile);

  const visualSignals = {
    colors: [
      'blue',
      'black',
      'white',
      'green',
      'red',
      'yellow',
      'purple'
    ],

    typography: [
      'large typography',
      'bold typography',
      'sans serif',
      'serif',
      'minimal typography'
    ],

    imagery: [
      'abstract imagery',
      'illustration',
      'generative art',
      'photography',
      '3d',
      'animation'
    ],

    layoutPatterns: [
      'minimal',
      'editorial',
      'grid',
      'cards',
      'large whitespace',
      'hero'
    ]
  };

  for (const [category, signals] of Object.entries(
    visualSignals
  )) {
    profile.visualPatterns[category] =
      signals.filter(signal =>
        text.includes(signal)
      );
  }
}


// --------------------------------------------------
// SOCIAL SIGNALS
// --------------------------------------------------

function extractSocialSignals(profile) {
  const platforms = [];

  for (const evidence of profile.evidence) {
    const url = (
      evidence.url || ''
    ).toLowerCase();

    if (url.includes('youtube.com')) {
      platforms.push('YouTube');
    }

    if (url.includes('linkedin.com')) {
      platforms.push('LinkedIn');
    }

    if (url.includes('instagram.com')) {
      platforms.push('Instagram');
    }

    if (
      url.includes('x.com') ||
      url.includes('twitter.com')
    ) {
      platforms.push('X');
    }

    if (url.includes('tiktok.com')) {
      platforms.push('TikTok');
    }
  }

  profile.socialSignals.platforms =
    unique(platforms);

  const text = getLowerText(profile);

  const formats = [
    'video',
    'podcast',
    'blog',
    'article',
    'research paper',
    'livestream',
    'announcement'
  ];

  profile.socialSignals.contentFormats =
    formats.filter(format =>
      text.includes(format)
    );

  profile.socialSignals.recurringTopics =
    profile.contentThemes
      .map(theme => theme.category);
}


// --------------------------------------------------
// UX OPPORTUNITIES
// --------------------------------------------------

function extractUXOpportunities(profile) {
  const opportunities = [];

  if (
    profile.products.length >= 2
  ) {
    opportunities.push(
      'Create clear navigation between major products and services.'
    );
  }

  if (
    profile.audience.length >= 3
  ) {
    opportunities.push(
      'Provide audience-specific entry points for different user groups.'
    );
  }

  if (
    profile.contentThemes.some(
      theme =>
        theme.category === 'Research'
    )
  ) {
    opportunities.push(
      'Use strong editorial structure for research and knowledge content.'
    );
  }

  if (
    profile.contentThemes.some(
      theme =>
        theme.category ===
        'Developer Technology'
    )
  ) {
    opportunities.push(
      'Provide a prominent developer-oriented pathway.'
    );
  }

  profile.uxOpportunities =
    unique(opportunities);
}


// --------------------------------------------------
// MAIN ANALYZER
// --------------------------------------------------

function normalizeBrandEvidence(profile) {
  extractIdentity(profile);
  extractAudience(profile);
  extractPositioning(profile);
  extractContentThemes(profile);
  extractTone(profile);
  extractProducts(profile);
  extractVisualPatterns(profile);
  extractSocialSignals(profile);
  extractUXOpportunities(profile);

  profile.sources =
    unique(
      profile.evidence.map(
        item => item.url
      )
    );

  return profile;
}


function buildBrandIntelligence(
  query,
  evidence = []
) {
  const profile =
    createEmptyBrandProfile(query);

  for (const item of evidence) {
    addEvidence(
      profile,
      item
    );
  }

  return normalizeBrandEvidence(
    profile
  );
}


module.exports = {
  createEmptyBrandProfile,
  addEvidence,
  normalizeBrandEvidence,
  buildBrandIntelligence
};