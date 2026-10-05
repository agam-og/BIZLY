const { collectBrandEvidence } = require('./brandIntelligenceEngine');
const {
  discoverCompetitors,
  researchTopCompetitors
} = require('./competitorIntelligence');
const { analyzeGitHubRepository } = require('./githubIntelligence');
const { buildCodeIntelligence } = require('./codeIntelligence');

/**
 * BIZLY Intelligence Core
 *
 * Orchestrates the existing intelligence engines into
 * one unified research object.
 */
async function buildIntelligence({
  query,
  website,
  youtube,
  linkedin,
  instagram,
  x,
  repoUrl
}) {
  if (!query) {
    throw new Error('query is required.');
  }

  console.log(`[INTELLIGENCE CORE] Starting analysis: ${query}`);

  // Phase 1 — Brand Intelligence
  const brandIntelligence = await collectBrandEvidence({
    query,
    website,
    youtube,
    linkedin,
    instagram,
    x
  });

  const brandProfile =
    brandIntelligence?.brandProfile || {};

  // Phase 2 — Competitor Intelligence
  const discovery = await discoverCompetitors({
    brand: query,
    brandProfile
  });

  const competitors = await researchTopCompetitors({
    candidates: discovery?.candidates || [],
    limit: 5
  });

  // Phase 3 — Optional GitHub / Code Intelligence
  let codeIntelligence = null;

  if (repoUrl) {
    const githubData =
      await analyzeGitHubRepository(repoUrl);

    codeIntelligence =
      buildCodeIntelligence(githubData);
  }

  return {
    success: true,

    query,

    brand: brandIntelligence,

    competitors: {
      discovery: {
        queryCount: discovery?.queryCount || 0,
        resultCount: discovery?.resultCount || 0,
        candidateCount:
          discovery?.candidates?.length || 0
      },
      results: competitors
    },

    code: codeIntelligence
  };
}

module.exports = {
  buildIntelligence
};