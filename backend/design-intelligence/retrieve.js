const { loadKnowledgeStore } = require("./ingest");

const KNOWLEDGE_CACHE = loadKnowledgeStore();

console.log(
  `[RAG CACHE] Loaded ${KNOWLEDGE_CACHE.length} knowledge records into memory.`
);

function normalize(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function scoreRecord(query, record) {
  const queryWords = normalize(query);

  const searchableText = [
    record.source.name,
    record.source.category,
    ...(record.source.subcategory || []),
    ...(record.designPrinciples || [])
  ].join(" ");

  const sourceWords = normalize(searchableText);

  let score = 0;

  for (const word of queryWords) {
    if (sourceWords.includes(word)) {
      score += 1;
    }
  }

  // Stronger signals for important design concepts
  const concepts = {
    "3d": ["3d", "three", "webgl"],
    motion: ["motion", "animation", "animated"],
    saas: ["saas", "product"],
    ecommerce: ["ecommerce", "commerce"],
    portfolio: ["portfolio", "creative"],
    landing: ["landing", "marketing"],
    minimal: ["minimal", "clean"],
    experimental: ["experimental", "creative"],
    ui: ["ui", "interface"],
    ux: ["ux", "user", "flow"],
    typography: ["typography", "type"],
    branding: ["branding", "brand"]
  };

  for (const [concept, keywords] of Object.entries(concepts)) {
    if (
      queryWords.includes(concept) &&
      keywords.some(keyword => sourceWords.includes(keyword))
    ) {
      score += 5;
    }
  }

  return score;
}

function retrieve(query, limit = 3) {
  const knowledge = KNOWLEDGE_CACHE;

  const q = query.toLowerCase();

  const intentMap = {
    "3d": ["3d", "webgl", "threejs", "spatial", "immersive"],
    "motion": ["motion", "animation", "animated", "scroll", "transition", "micro-interaction"],
    "saas": ["saas", "dashboard", "product", "app", "software"],
    "ecommerce": ["ecommerce", "e-commerce", "shop", "store", "product cards", "checkout"],
    "creative": ["creative", "experimental", "art direction", "portfolio", "agency", "studio"],
    "landing": ["landing", "marketing", "conversion", "cta", "hero"],
    "ui": ["ui", "ux", "interface", "components", "patterns"],
    "design-system": ["design system", "tokens", "accessibility", "component library"],
    "typography": ["typography", "fonts", "font", "type system"],
    "branding": ["branding", "brand", "identity", "visual identity"]
  };

  const detectedIntents = [];

  for (const [intent, keywords] of Object.entries(intentMap)) {
    if (keywords.some(keyword => q.includes(keyword))) {
      detectedIntents.push(intent);
    }
  }

  const ranked = knowledge
    .map(record => {
      let score = scoreRecord(query, record);
      // Prevent technically related libraries from outranking
      // authoritative sources for specialized intents.
      if (
      detectedIntents.includes("design-system") &&
      !((record.knowledgeType || []).includes("design-system"))
       )
      {
        score -= 20;
      }
      const knowledgeTypes = record.knowledgeType || [];
      const specialties = record.specialties || [];
      const categories = record.categories || [];

    for (const intent of detectedIntents) {
  if (knowledgeTypes.includes(intent)) {
    score += 10;
  }

  if (
    specialties.some(specialty =>
      specialty.toLowerCase().includes(intent)
    )
  ) {
    score += 6;
  }

  if (
    categories.some(category =>
      category.toLowerCase().includes(intent)
    )
  ) {
    score += 4;
  }

  /*
   * DESIGN-SYSTEM PRECISION
   *
   * Only give the strong design-system boost when
   * the source is actually classified as a design system.
   */
  if (intent === "design-system") {
    if (knowledgeTypes.includes("design-system")) {
      score += 8;
    }

    if (
      categories.includes("design-systems") ||
      categories.includes("components")
    ) {
      score += 3;
    }

    /*
     * 3D libraries/tools should not outrank actual
     * enterprise design systems.
     */
    if (
      knowledgeTypes.includes("3d") &&
      !knowledgeTypes.includes("design-system")
    ) {
      score -= 8;
    }
  }
}
      
      
    if (record.tier === "core") {
        score += 2;
      }

      return {
        record,
        score
      };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score);

  /*
   * REMOVE DUPLICATE SOURCES
   */
  const unique = [];
  const seen = new Set();

  for (const item of ranked) {
    const sourceName = item.record.source?.name;

    if (!sourceName) continue;

    const key = sourceName.toLowerCase().trim();

    if (seen.has(key)) continue;

    seen.add(key);
    unique.push(item);
  }

  /*
   * DIVERSITY FILTER
   *
   * Avoid returning a Top 10 made entirely
   * from one knowledge family.
   */
  const selected = [];
  const typeCounts = {};

  for (const item of unique) {
    const types = item.record.knowledgeType || [];

    const dominantType =
      types.find(type => detectedIntents.includes(type)) ||
      types[0] ||
      "general";

    typeCounts[dominantType] =
      (typeCounts[dominantType] || 0) + 1;

    /*
     * Don't allow one knowledge type to dominate
     * the entire retrieval set.
     */
    if (typeCounts[dominantType] > 4) {
      continue;
    }

    selected.push(item);

    if (selected.length >= limit) {
      break;
    }
  }

  return selected.map(item => ({
    ...item.record,
    relevanceScore: item.score
  }));
}
function buildRetrievalContext(query, limit = 3) {
  const results = retrieve(query, limit);

  return {
    query,
    count: results.length,

    sources: results.map(result => ({
      name: result.source.name,
      url: result.source.url,
      category: result.source.category,
      subcategory: result.source.subcategory,
      relevanceScore: result.relevanceScore,

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
      conversion: result.conversion,
      technology: result.technology,

      designPrinciples: result.designPrinciples,
      reusablePatterns: result.reusablePatterns
    }))
  };
}
module.exports = {
  retrieve,
  buildRetrievalContext,
  scoreRecord
};