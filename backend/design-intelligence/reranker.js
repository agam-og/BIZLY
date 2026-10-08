function normalize(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function flattenValues(value) {
  if (value === null || value === undefined) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.flatMap(flattenValues);
  }

  if (typeof value === 'object') {
    return Object.values(value).flatMap(flattenValues);
  }

  return [String(value)];
}

function tokensFrom(value) {
  return normalize(
    flattenValues(value).join(' ')
  );
}

function countMatches(tokens, keywords) {
  return keywords.filter(keyword =>
    tokens.includes(keyword)
  ).length;
}

function hasMatch(tokens, keywords) {
  return countMatches(tokens, keywords) > 0;
}

/*
|--------------------------------------------------------------------------
| Query intent definitions
|--------------------------------------------------------------------------
*/

const INTENTS = {
  threeD: {
    queryKeywords: [
      '3d',
      'threejs',
      'webgl',
      'spatial',
      'immersive'
    ],

    strongEvidence: [
      '3d',
      'threejs',
      'webgl',
      'spatial'
    ],

    supportingEvidence: [
      'immersive',
      'canvas'
    ],

    weight: 14
  },

  motion: {
    queryKeywords: [
      'motion',
      'animation',
      'animated',
      'scroll',
      'parallax',
      'transition',
      'micro-interaction',
      'microinteraction'
    ],

    strongEvidence: [
      'motion',
      'animation',
      'animated',
      'parallax',
      'transition'
    ],

    supportingEvidence: [
      'scroll',
      'micro-interaction',
      'microinteraction'
    ],

    weight: 12
  },

  conversion: {
    queryKeywords: [
      'conversion',
      'convert',
      'cta',
      'sales',
      'lead',
      'signup',
      'purchase',
      'pricing',
      'subscribe'
    ],

    strongEvidence: [
      'conversion',
      'cta',
      'sales',
      'lead',
      'signup',
      'purchase'
    ],

    supportingEvidence: [
      'pricing',
      'subscribe'
    ],

    weight: 12
  },

  premium: {
    queryKeywords: [
      'premium',
      'luxury',
      'cinematic',
      'editorial',
      'high-end',
      'sophisticated'
    ],

    strongEvidence: [
      'premium',
      'luxury',
      'cinematic',
      'high-end',
      'sophisticated'
    ],

    supportingEvidence: [
      'editorial',
      'minimal',
      'dark'
    ],

    weight: 8
  },

  ux: {
    queryKeywords: [
      'ux',
      'user',
      'flow',
      'interface',
      'responsive',
      'accessibility',
      'navigation',
      'hierarchy',
      'components'
    ],

    strongEvidence: [
      'ux',
      'user',
      'responsive',
      'accessibility',
      'navigation',
      'hierarchy'
    ],

    supportingEvidence: [
      'interface',
      'flow',
      'components'
    ],

    weight: 7
  },

  technology: {
    queryKeywords: [
      'react',
      'nextjs',
      'threejs',
      'webgl',
      'gsap',
      'framer',
      'javascript'
    ],

    strongEvidence: [
      'react',
      'nextjs',
      'threejs',
      'webgl',
      'gsap'
    ],

    supportingEvidence: [
      'framer',
      'javascript'
    ],

    weight: 5
  },

  ai: {
    queryKeywords: [
      'ai',
      'artificial',
      'intelligence',
      'machine',
      'learning',
      'generation',
      'generative',
      'code-generation'
    ],

    strongEvidence: [
      'ai',
      'artificial',
      'intelligence',
      'generative',
      'code-generation'
    ],

    supportingEvidence: [
      'generation',
      'machine',
      'learning'
    ],

    weight: 6
  }
};

/*
|--------------------------------------------------------------------------
| Extract query intents
|--------------------------------------------------------------------------
*/

function detectIntents(query) {
  const queryTokens = normalize(query);

  return Object.entries(INTENTS)
    .filter(([, intent]) =>
      intent.queryKeywords.some(keyword =>
        queryTokens.includes(keyword)
      )
    )
    .map(([name]) => name);
}

/*
|--------------------------------------------------------------------------
| Structured evidence
|
| Different fields have different evidentiary value.
|--------------------------------------------------------------------------
*/

function buildEvidence(record) {
  return {
    source: tokensFrom(record.source),

    visual: tokensFrom(record.visual),

    layout: tokensFrom(record.layout),

    hero: tokensFrom(record.hero),

    navigation: tokensFrom(record.navigation),

    typography: tokensFrom(record.typography),

    color: tokensFrom(record.color),

    components: tokensFrom(record.components),

    interaction: tokensFrom(record.interaction),

    motion: tokensFrom(record.motion),

    threeD: tokensFrom(record.threeD),

    ux: tokensFrom(record.ux),

    conversion: tokensFrom(record.conversion),

    technology: tokensFrom(record.technology),

    principles: tokensFrom(record.designPrinciples),

    patterns: tokensFrom(record.reusablePatterns),

    knowledgeType: tokensFrom(record.knowledgeType),

    specialties: tokensFrom(record.specialties),

    categories: tokensFrom(record.categories),

    extraction: tokensFrom(record._extraction)
  };
}

/*
|--------------------------------------------------------------------------
| Dimension-specific evidence scoring
|--------------------------------------------------------------------------
*/

function scoreThreeD(evidence) {
  let score = 0;

  const strong = countMatches(
    [
      ...evidence.threeD,
      ...evidence.technology
    ],
    INTENTS.threeD.strongEvidence
  );

  const supporting = countMatches(
    [
      ...evidence.threeD,
      ...evidence.visual,
      ...evidence.principles,
      ...evidence.patterns
    ],
    INTENTS.threeD.supportingEvidence
  );

  score += Math.min(strong, 3) * 5;
  score += Math.min(supporting, 2) * 2;

  if (
    evidence.threeD.includes('true') ||
    evidence.threeD.includes('used')
  ) {
    score += 4;
  }

  return Math.min(score, 18);
}

function scoreMotion(evidence) {
  let score = 0;

  const strong = countMatches(
    [
      ...evidence.motion,
      ...evidence.interaction,
      ...evidence.principles
    ],
    INTENTS.motion.strongEvidence
  );

  const supporting = countMatches(
    [
      ...evidence.motion,
      ...evidence.interaction,
      ...evidence.principles,
      ...evidence.patterns
    ],
    INTENTS.motion.supportingEvidence
  );

  score += Math.min(strong, 3) * 5;
  score += Math.min(supporting, 2) * 2;

  return Math.min(score, 18);
}

function scoreConversion(evidence) {
  let score = 0;

  const strong = countMatches(
    [
      ...evidence.conversion,
      ...evidence.hero,
      ...evidence.components,
      ...evidence.extraction
    ],
    INTENTS.conversion.strongEvidence
  );

  const supporting = countMatches(
    [
      ...evidence.conversion,
      ...evidence.components,
      ...evidence.extraction
    ],
    INTENTS.conversion.supportingEvidence
  );

  score += Math.min(strong, 3) * 5;
  score += Math.min(supporting, 2) * 2;

  return Math.min(score, 18);
}

function scorePremium(evidence) {
  let score = 0;

  const strong = countMatches(
    [
      ...evidence.visual,
      ...evidence.typography,
      ...evidence.color
    ],
    INTENTS.premium.strongEvidence
  );

  const supporting = countMatches(
    [
      ...evidence.visual,
      ...evidence.layout,
      ...evidence.typography
    ],
    INTENTS.premium.supportingEvidence
  );

  score += Math.min(strong, 3) * 4;
  score += Math.min(supporting, 2) * 2;

  return Math.min(score, 14);
}

function scoreUX(evidence) {
  let score = 0;

  const strong = countMatches(
    [
      ...evidence.ux,
      ...evidence.navigation,
      ...evidence.components,
      ...evidence.principles
    ],
    INTENTS.ux.strongEvidence
  );

  const supporting = countMatches(
    [
      ...evidence.ux,
      ...evidence.components,
      ...evidence.patterns
    ],
    INTENTS.ux.supportingEvidence
  );

  score += Math.min(strong, 3) * 4;
  score += Math.min(supporting, 2) * 2;

  return Math.min(score, 14);
}

function scoreTechnology(evidence) {
  const matches = countMatches(
    [
      ...evidence.technology,
      ...evidence.extraction
    ],
    INTENTS.technology.strongEvidence
  );

  const supporting = countMatches(
    evidence.technology,
    INTENTS.technology.supportingEvidence
  );

  return (
    Math.min(matches, 3) * 3 +
    Math.min(supporting, 2)
  );
}

function scoreAI(evidence) {
  const strong = countMatches(
    [
      ...evidence.knowledgeType,
      ...evidence.specialties,
      ...evidence.categories,
      ...evidence.source,
      ...evidence.extraction
    ],
    INTENTS.ai.strongEvidence
  );

  const supporting = countMatches(
    [
      ...evidence.knowledgeType,
      ...evidence.specialties,
      ...evidence.categories,
      ...evidence.extraction
    ],
    INTENTS.ai.supportingEvidence
  );

  return (
    Math.min(strong, 3) * 4 +
    Math.min(supporting, 2) * 2
  );
}

/*
|--------------------------------------------------------------------------
| Context relevance
|
| Context should help ranking, but never overpower actual design evidence.
|--------------------------------------------------------------------------
*/

function scoreContext(query, evidence) {
  const queryTokens = normalize(query);

  const contextGroups = {
    ai: [
      'ai',
      'artificial',
      'intelligence',
      'generative',
      'generation',
      'code-generation'
    ],

    startup: [
      'startup',
      'startups'
    ],

    saas: [
      'saas',
      'software',
      'dashboard'
    ],

    product: [
      'product',
      'app',
      'web-apps'
    ],

    agency: [
      'agency',
      'studio',
      'creative'
    ],

    ecommerce: [
      'ecommerce',
      'commerce',
      'shop',
      'store',
      'checkout'
    ]
  };

  let score = 0;

  for (const [context, keywords] of Object.entries(
    contextGroups
  )) {
    const requested = keywords.filter(keyword =>
      queryTokens.includes(keyword)
    );

    if (!requested.length) {
      continue;
    }

    const contextEvidence = [
      ...evidence.source,
      ...evidence.categories,
      ...evidence.knowledgeType,
      ...evidence.specialties
    ];

    const matched = countMatches(
      contextEvidence,
      requested
    );

    if (matched) {
      score += Math.min(matched, 2) * 3;
    }
  }

  return Math.min(score, 12);
}

/*
|--------------------------------------------------------------------------
| Main reranking score
|--------------------------------------------------------------------------
*/

function rerankScore(query, record) {
  const intents = detectIntents(query);
  const evidence = buildEvidence(record);

  let score = 0;

  for (const intent of intents) {
    switch (intent) {
      case 'threeD':
        score += scoreThreeD(evidence);
        break;

      case 'motion':
        score += scoreMotion(evidence);
        break;

      case 'conversion':
        score += scoreConversion(evidence);
        break;

      case 'premium':
        score += scorePremium(evidence);
        break;

      case 'ux':
        score += scoreUX(evidence);
        break;

      case 'technology':
        score += scoreTechnology(evidence);
        break;

      case 'ai':
        score += scoreAI(evidence);
        break;

      default:
        break;
    }
  }

  score += scoreContext(
    query,
    evidence
  );

  if (record.tier === 'core') {
    score += 2;
  }

  return score;
}

/*
|--------------------------------------------------------------------------
| Rerank candidates
|--------------------------------------------------------------------------
*/

function rerank(query, results, limit = 3) {
  return results
    .map(item => {
      const record =
        item.record || item;

      return {
        ...item,

        rerankScore:
          rerankScore(query, record)
      };
    })
    .sort((a, b) => {
      if (
        b.rerankScore !==
        a.rerankScore
      ) {
        return (
          b.rerankScore -
          a.rerankScore
        );
      }

      return (
        (b.relevanceScore || 0) -
        (a.relevanceScore || 0)
      );
    })
    .slice(0, limit);
}

module.exports = {
  rerank,
  rerankScore,
  detectIntents,
  buildEvidence
};