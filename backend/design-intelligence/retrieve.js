const fs = require('fs');
const path = require('path');

const { loadKnowledgeStore } = require('./ingest');

const {
  semanticSearch
} = require('../semanticRetriever');

const {
  rerank
} = require('./reranker');

const KNOWLEDGE_CACHE = loadKnowledgeStore();

const EMBEDDINGS_FILE = path.join(
  __dirname,
  '../../data/design/embeddings.json'
);

const EMBEDDING_CACHE = JSON.parse(
  fs.readFileSync(EMBEDDINGS_FILE, 'utf8')
);

console.log(
  `[RAG CACHE] Loaded ${KNOWLEDGE_CACHE.length} knowledge records into memory.`
);

console.log(
  `[SEMANTIC CACHE] Loaded ${EMBEDDING_CACHE.length} embeddings into memory.`
);

function normalize(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function scoreRecord(query, record) {
  const queryWords = normalize(query);

  const searchableText = [
    record.source?.name,
    record.source?.category,
    ...(record.source?.subcategory || []),
    ...(record.designPrinciples || [])
  ].join(' ');

  const sourceWords = normalize(searchableText);

  let score = 0;

  for (const word of queryWords) {
    if (sourceWords.includes(word)) {
      score += 1;
    }
  }

  const concepts = {
    '3d': ['3d', 'three', 'webgl'],
    motion: ['motion', 'animation', 'animated'],
    saas: ['saas', 'product'],
    ecommerce: ['ecommerce', 'commerce'],
    portfolio: ['portfolio', 'creative'],
    landing: ['landing', 'marketing'],
    minimal: ['minimal', 'clean'],
    experimental: ['experimental', 'creative'],
    ui: ['ui', 'interface'],
    ux: ['ux', 'user', 'flow'],
    typography: ['typography', 'type'],
    branding: ['branding', 'brand']
  };

  for (const [concept, keywords] of Object.entries(concepts)) {
    if (
      queryWords.includes(concept) &&
      keywords.some(keyword =>
        sourceWords.includes(keyword)
      )
    ) {
      score += 5;
    }
  }

  return score;
}

async function retrieve(query, limit = 3) {
  const knowledge = KNOWLEDGE_CACHE;
  const q = query.toLowerCase();

  const intentMap = {
    '3d': [
      '3d',
      'webgl',
      'threejs',
      'spatial',
      'immersive'
    ],

    motion: [
      'motion',
      'animation',
      'animated',
      'scroll',
      'transition',
      'micro-interaction'
    ],

    saas: [
      'saas',
      'dashboard',
      'product',
      'app',
      'software'
    ],

    ecommerce: [
      'ecommerce',
      'e-commerce',
      'shop',
      'store',
      'product cards',
      'checkout'
    ],

    creative: [
      'creative',
      'experimental',
      'art direction',
      'portfolio',
      'agency',
      'studio'
    ],

    landing: [
      'landing',
      'marketing',
      'conversion',
      'cta',
      'hero'
    ],

    ui: [
      'ui',
      'ux',
      'interface',
      'components',
      'patterns'
    ],

    'design-system': [
      'design system',
      'tokens',
      'accessibility',
      'component library'
    ],

    typography: [
      'typography',
      'fonts',
      'font',
      'type system'
    ],

    branding: [
      'branding',
      'brand',
      'identity',
      'visual identity'
    ]
  };

  const detectedIntents = [];

  for (const [intent, keywords] of Object.entries(intentMap)) {
    if (
      keywords.some(keyword =>
        q.includes(keyword)
      )
    ) {
      detectedIntents.push(intent);
    }
  }

  const ranked = knowledge.map(record => {
    let score = scoreRecord(query, record);

    if (
      detectedIntents.includes('design-system') &&
      !(record.knowledgeType || []).includes(
        'design-system'
      )
    ) {
      score -= 20;
    }

    const knowledgeTypes =
      record.knowledgeType || [];

    const specialties =
      record.specialties || [];

    const categories =
      record.categories || [];

    for (const intent of detectedIntents) {
      if (knowledgeTypes.includes(intent)) {
        score += 10;
      }

      if (
        specialties.some(specialty =>
          specialty
            .toLowerCase()
            .includes(intent)
        )
      ) {
        score += 6;
      }

      if (
        categories.some(category =>
          category
            .toLowerCase()
            .includes(intent)
        )
      ) {
        score += 4;
      }

      if (intent === 'design-system') {
        if (
          knowledgeTypes.includes(
            'design-system'
          )
        ) {
          score += 8;
        }

        if (
          categories.includes(
            'design-systems'
          ) ||
          categories.includes(
            'components'
          )
        ) {
          score += 3;
        }

        if (
          knowledgeTypes.includes('3d') &&
          !knowledgeTypes.includes(
            'design-system'
          )
        ) {
          score -= 8;
        }
      }
    }

    if (record.tier === 'core') {
      score += 2;
    }

    return {
      record,
      lexicalScore: score
    };
  });

  const unique = [];
  const seen = new Set();

  for (const item of ranked) {
    const sourceName =
      item.record.source?.name;

    if (!sourceName) {
      continue;
    }

    const key =
      sourceName.toLowerCase().trim();

    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    unique.push(item);
  }

  const lexicalSelected = [];
  const typeCounts = {};

  for (const item of unique) {
    if (item.lexicalScore <= 0) {
      continue;
    }

    const types =
      item.record.knowledgeType || [];

    const dominantType =
      types.find(type =>
        detectedIntents.includes(type)
      ) ||
      types[0] ||
      'general';

    typeCounts[dominantType] =
      (typeCounts[dominantType] || 0) + 1;

    if (typeCounts[dominantType] > 4) {
      continue;
    }

    lexicalSelected.push(item);

    if (lexicalSelected.length >= 10) {
      break;
    }
  }

  const semanticDocuments =
    EMBEDDING_CACHE
      .map(item => {
        const record =
          KNOWLEDGE_CACHE.find(
            doc =>
              doc.source?.name
                ?.toLowerCase()
                .trim() ===
              item.name
                ?.toLowerCase()
                .trim()
          );

        if (!record) {
          return null;
        }

        return {
          ...record,
          embedding: item.embedding
        };
      })
      .filter(Boolean);

  const semanticResults =
    await semanticSearch(
      query,
      semanticDocuments,
      15
    );

    const maxLexicalScore = Math.max(
    ...lexicalSelected.map(item =>
      Number(item.lexicalScore) || 0
    ),
    1
  );

  const lexicalScores =
    new Map(
      lexicalSelected.map(item => [
        item.record.source?.name
          ?.toLowerCase()
          .trim(),

        (Number(item.lexicalScore) || 0) /
          maxLexicalScore
      ])
    );
  const candidateMap = new Map();

  for (const item of semanticResults) {
    const key =
      item.source?.name
        ?.toLowerCase()
        .trim();

    if (!key) {
      continue;
    }

    candidateMap.set(key, {
      record: item,

      semanticScore:
        Number(item.semanticScore) || 0,

      lexicalScore:
        lexicalScores.get(key) || 0
    });
  }

  for (
    const item of lexicalSelected.slice(0, 10)
  ) {
    const key =
      item.record.source?.name
        ?.toLowerCase()
        .trim();

    if (!key) {
      continue;
    }

    if (!candidateMap.has(key)) {
  candidateMap.set(key, {
    record: item.record,
    semanticScore: 0,
    lexicalScore:
      lexicalScores.get(key) || 0
  });
}
  }

  const candidates =
    Array.from(
      candidateMap.values()
    ).map(item => ({
      ...item.record,

      relevanceScore:
        (item.semanticScore * 0.80) +
        (item.lexicalScore * 0.20),

      lexicalScore:
        item.lexicalScore,

      semanticScore:
        item.semanticScore
    }));
  return rerank(
    query,
    candidates,
    limit
  );
}

async function buildRetrievalContext(
  query,
  limit = 3
) {
  const results =
    await retrieve(query, limit);

  return {
    query,

    count: results.length,

    sources: results.map(result => ({
      name: result.source.name,
      url: result.source.url,
      category: result.source.category,

      relevanceScore:
        result.relevanceScore,

      rerankScore:
        result.rerankScore,

      design: {
        visual: result.visual,
        layout: result.layout,
        hero: result.hero,
        navigation: result.navigation,
        typography: result.typography,
        color: result.color,
        components: result.components,
        interaction: result.interaction,
        motion: result.motion,
        threeD: result.threeD,
        ux: result.ux,
        conversion: result.conversion
      },

      principles:
        result.designPrinciples,

      reusablePatterns:
        result.reusablePatterns
    }))
  };
}

module.exports = {
  retrieve,
  buildRetrievalContext,
  scoreRecord
};