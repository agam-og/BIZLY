const { pipeline } = require('@huggingface/transformers');

let extractorPromise = null;

function getExtractor() {
  if (!extractorPromise) {
    console.log('[SEMANTIC RAG] Loading local embedding model...');

    extractorPromise = pipeline(
      'feature-extraction',
      'Xenova/all-MiniLM-L6-v2'
    );
  }

  return extractorPromise;
}

function meanPooling(output) {
  const data = output.data;
  const dims = output.dims;

  const tokenCount = dims[dims.length - 2];
  const embeddingSize = dims[dims.length - 1];

  const embedding = new Array(embeddingSize).fill(0);

  for (let token = 0; token < tokenCount; token++) {
    for (let i = 0; i < embeddingSize; i++) {
      embedding[i] += data[token * embeddingSize + i];
    }
  }

  for (let i = 0; i < embeddingSize; i++) {
    embedding[i] /= tokenCount;
  }

  return embedding;
}

function normalize(vector) {
  const magnitude = Math.sqrt(
    vector.reduce((sum, value) => sum + value * value, 0)
  );

  if (!magnitude) return vector;

  return vector.map(value => value / magnitude);
}

async function embedText(text) {
  const extractor = await getExtractor();

  const output = await extractor(text, {
    pooling: 'mean',
    normalize: true
  });

  return Array.from(output.data);
}

function cosineSimilarity(a, b) {
  let dot = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
  }

  return dot;
}

async function semanticSearch(query, documents, limit = 3) {
  const queryEmbedding = await embedText(query);

  const results = documents.map(document => {
    const embedding = document.embedding || [];

    return {
      ...document,
      semanticScore: embedding.length
        ? cosineSimilarity(queryEmbedding, embedding)
        : 0
    };
  });

  return results
    .sort((a, b) => b.semanticScore - a.semanticScore)
    .slice(0, limit);
}

module.exports = {
  getExtractor,
  embedText,
  normalize,
  cosineSimilarity,
  semanticSearch
};