const fs = require('fs');
const path = require('path');

const { loadKnowledgeStore } = require('../backend/design-intelligence/ingest');
const { embedText } = require('../backend/semanticRetriever');

const OUTPUT_FILE = path.join(
  __dirname,
  '../data/design/embeddings.json'
);

async function main() {
  console.log('[EMBEDDINGS] Loading knowledge store...');

  const documents = loadKnowledgeStore();

  console.log(
    `[EMBEDDINGS] Found ${documents.length} design sources.`
  );

  const embeddings = [];

  for (let i = 0; i < documents.length; i++) {
    const document = documents[i];

    const text = [
      document.source?.name,
      document.source?.category,
      document.source?.subcategory,
      document.visual,
      document.layout,
      document.hero,
      document.navigation,
      document.typography,
      document.color,
      document.components,
      document.interaction,
      document.motion,
      document.threeD,
      document.ux,
      document.conversion,
      document.technology,
      ...(document.designPrinciples || []),
      ...(document.reusablePatterns || [])
    ]
      .filter(Boolean)
      .join(' ');

    console.log(
      `[EMBEDDINGS] ${i + 1}/${documents.length} → ${
        document.source?.name || 'Unknown'
      }`
    );

    const embedding = await embedText(text);

    embeddings.push({
      id: document.id || i,
      name: document.source?.name || 'Unknown',
      url: document.source?.url || null,
      embedding
    });
  }

  fs.writeFileSync(
    OUTPUT_FILE,
    JSON.stringify(embeddings)
  );

  console.log(
    `[EMBEDDINGS] Saved ${embeddings.length} embeddings.`
  );

  console.log(
    `[EMBEDDINGS] Output: ${OUTPUT_FILE}`
  );
}

main().catch(error => {
  console.error('[EMBEDDINGS] Failed:', error);
  process.exit(1);
});