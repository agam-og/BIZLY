const fs = require('fs');
const path = require('path');
const { buildRetrievalContext } = require('./design-intelligence/retrieve');

// ============================================================
// LEGACY EXCEL SOURCE LOADER
// Kept so server.js does not break during the transition.
// The actual design intelligence now comes from knowledgeStore.json.
// ============================================================

const knowledgePath = path.resolve(
  __dirname,
  '../data/design/knowledgeStore.json'
);
  function loadDesignSourcesFromExcel() {
  if (!fs.existsSync(knowledgePath)) {
    console.warn('[RAG WARN] knowledgeStore.json not found.');
    return [];
  }

  try {
    const knowledge = JSON.parse(
      fs.readFileSync(knowledgePath, 'utf8')
    );

    return knowledge.map((record, index) => ({
      id: index + 1,
      name: record.source?.name || 'Unknown Source',
      url: record.source?.url || '',
      purpose: record.source?.purpose || '',
      category: record.source?.category || '',
      designPrinciples: record.designPrinciples || []
    }));
  } catch (error) {
    console.error('[RAG ERROR] Failed to load knowledgeStore:', error);
    return [];
  }
}
// ============================================================
// RELEVANCE SCORING
// ============================================================

function scoreSource(query, source) {
  const words = String(query || '')
    .toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 2);

  const searchableText = [
    source.name,
    source.purpose,
    source.category,
    ...(source.designPrinciples || [])
  ]
    .join(' ')
    .toLowerCase();

  let score = 0;

  for (const word of words) {
    if (searchableText.includes(word)) {
      score++;
    }
  }

  return score;
}


// ============================================================
// BUILD RICH AI DESIGN CONTEXT
// ============================================================
function buildMultiDesignPrompt(query, retrievedSources) {

  const contextStr = retrievedSources
    .map((source, index) => {
      return `
━━━━━━━━ SOURCE ${index + 1} ━━━━━━━━
NAME: ${source.name}
URL: ${source.url}
CATEGORY: ${source.category || 'Unknown'}

VISUAL:
${JSON.stringify(source.visual || {}, null, 2)}

LAYOUT:
${JSON.stringify(source.layout || {}, null, 2)}

HERO:
${JSON.stringify(source.hero || {}, null, 2)}

NAVIGATION:
${JSON.stringify(source.navigation || {}, null, 2)}

TYPOGRAPHY:
${JSON.stringify(source.typography || {}, null, 2)}

COLOR:
${JSON.stringify(source.color || {}, null, 2)}

COMPONENTS:
${JSON.stringify(source.components || {}, null, 2)}

INTERACTION:
${JSON.stringify(source.interaction || {}, null, 2)}

MOTION:
${JSON.stringify(source.motion || {}, null, 2)}

3D:
${JSON.stringify(source.threeD || {}, null, 2)}

UX:
${JSON.stringify(source.ux || {}, null, 2)}

CONVERSION:
${JSON.stringify(source.conversion || {}, null, 2)}

TECHNOLOGY:
${JSON.stringify(source.technology || {}, null, 2)}

DESIGN PRINCIPLES:
${JSON.stringify(source.designPrinciples || [], null, 2)}

REUSABLE PATTERNS:
${JSON.stringify(source.reusablePatterns || [], null, 2)}
`;
    })
    .join('\n');

  return `
You are BIZLY's Elite AI Web Design Architect.

Your job is NOT to generate HTML.

Your job is to design the visual and UX blueprint for an exceptional website.

The website must feel intentionally designed by a senior creative team,
not generated from a generic AI template.

============================================================
USER REQUEST
============================================================

${query}

============================================================
BIZLY DESIGN INTELLIGENCE
============================================================

${contextStr}

============================================================
YOUR ROLE
============================================================

Study the retrieved design intelligence.

Extract principles rather than copying websites.

Do NOT reproduce:
- exact layouts
- exact section sequences
- exact copy
- exact visual identities
- recognizable combinations of components

Instead, synthesize the strongest relevant principles into an ORIGINAL
creative direction for this specific user request.

============================================================
THREE CREATIVE DIRECTIONS
============================================================

Create exactly three substantially different concepts.

DESIGN A — ARCHITECTURAL

Focus on:
- strong information architecture
- grid systems
- hierarchy
- spacing
- modular components
- navigation
- clarity
- usability

DESIGN B — EXPERIENTIAL

Focus on:
- art direction
- atmosphere
- expressive typography
- depth
- motion
- visual storytelling
- immersive interaction
- 3D/spatial design when appropriate

DESIGN C — PRODUCT / CONVERSION

Focus on:
- user journey
- product storytelling
- CTA hierarchy
- trust
- usability
- component systems
- conversion
- accessibility

These must NOT be three variations of the same website.

Changing only colors, fonts or backgrounds is NOT differentiation.

Each concept should feel like a different senior creative team designed it.

============================================================
DESIGN THINKING
============================================================

For every concept determine:

1. Core creative idea
2. Target audience
3. Emotional response
4. Visual identity
5. Layout strategy
6. Hero strategy
7. Section architecture
8. Typography system
9. Color system
10. Interaction strategy
11. Motion strategy
12. Responsive strategy
13. CTA strategy
14. Technical implementation direction

Make concrete decisions.

Avoid vague language such as:

"modern"
"clean"
"beautiful"
"professional"
"nice animations"

Explain WHAT creates the visual effect.

============================================================
WEBSITE STRUCTURE
============================================================

Every concept must define:

- navigation
- hero
- primary sections
- supporting sections
- CTA
- footer
- user journey
- responsive behavior

Every section must have a reason to exist.

The website should have a beginning, middle and end.

The visual story should evolve as the user scrolls.

============================================================
VISUAL QUALITY
============================================================

Avoid generic AI website patterns.

Do NOT automatically create:

- centered hero
- gradient background
- three feature cards
- testimonial cards
- pricing cards
- generic SaaS layout

unless the user's request actually requires them.

Use composition intentionally.

Consider:

- asymmetry
- scale
- whitespace
- visual rhythm
- typography
- layering
- depth
- contrast
- editorial composition
- unusual navigation
- immersive hero treatments
- visual transitions between sections

============================================================
MOTION
============================================================

Motion must have a purpose.

Define:

- entrance behavior
- hover behavior
- scroll behavior
- section transitions
- micro-interactions
- loading behavior

Do not animate everything.

Premium interfaces use controlled motion.

============================================================
TECHNICAL REALISM
============================================================

The blueprint must be realistically implementable.

When appropriate, consider:

- HTML
- CSS
- JavaScript
- CSS transforms
- Canvas
- WebGL
- Three.js
- GSAP
- SVG
- responsive CSS
- accessibility

Do not add technology simply for the sake of complexity.

============================================================
SOURCE FIDELITY
============================================================

The inspiration array MUST contain ONLY exact names from the retrieved
sources.

Never invent source names.

Use retrieved sources as design intelligence, not templates.

============================================================
OUTPUT
============================================================

Return ONLY valid JSON.

Return exactly three designs.

Schema:

{
  "designs": [
    {
      "option": "A",
      "styleName": "",
      "creativeConcept": "",
      "targetAudience": "",
      "emotionalGoal": "",

      "inspiration": [],

      "designSystem": {
        "layout": "",
        "grid": "",
        "spacing": "",
        "typography": "",
        "color": "",
        "visualLanguage": "",
        "components": ""
      },

      "architecture": {
        "navigation": "",
        "hero": "",
        "sections": [],
        "ctaStrategy": "",
        "footer": "",
        "userFlow": ""
      },

      "interaction": {
        "hover": "",
        "scroll": "",
        "transitions": "",
        "microInteractions": ""
      },

      "motion": {
        "strategy": "",
        "entrance": "",
        "scrollChoreography": ""
      },

      "responsive": {
        "desktop": "",
        "tablet": "",
        "mobile": ""
      },

      "technology": [],
      "implementationNotes": []
    },

    {
      "option": "B"
    },

    {
      "option": "C"
    }
  ]
}

============================================================
FINAL QUALITY CHECK
============================================================

Before returning the JSON verify:

1. Exactly three designs exist.
2. Options are A, B and C.
3. The three concepts are genuinely different.
4. The concepts are specific to the user's request.
5. The designs are original.
6. Retrieved sources are used as principles.
7. Every inspiration name exists in the retrieved source list.
8. No HTML is generated.
9. No placeholder language is used.
10. Every section has a meaningful purpose.
11. The design could realistically be implemented by a frontend engineer.
12. The result feels premium rather than like a generic AI template.

Return ONLY JSON.
`;
}
function retrieveDesignSources(query, limit = 8) {
  const scored = KnowledgeBase
    .map(source => ({
      ...source,
      score: scoreSource(query, source)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  console.log(
    `[RAG RETRIEVAL] Query: "${query}" | Sources: ${scored.length}`
  );

  return scored;
}

module.exports = {
  loadDesignSourcesFromExcel,
  scoreSource,
  buildMultiDesignPrompt,
  retrieveDesignSources
};



