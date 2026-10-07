require('dotenv').config();

const { analyzeSearch } = require('./connectors/searchConnector');

function cleanText(value) {
  if (!value) return '';
  return String(value)
    .replace(/\s+/g, ' ')
    .trim();
}

function unique(values) {
  return [...new Set(
    values
      .filter(Boolean)
      .map(value => cleanText(value))
      .filter(Boolean)
  )];
}

function buildCompetitorQueries(brand, brandProfile = {}) {
  const identity = brandProfile.identity || {};
  const positioning = brandProfile.positioning || {};
  const products = brandProfile.products || [];
  const audience = brandProfile.audience || [];

  const category = identity.category || '';
  const keywords = positioning.keywords || [];

  const queries = [
    `"${brand}" competitors`,
    `"${brand}" alternatives`,
    `${brand} competitors ${category}`,
    `${category} companies similar to ${brand}`,
    `${keywords.slice(0, 3).join(' ')} companies competitors`
  ];

  if (products.length) {
    queries.push(
      `${products.slice(0, 3).join(' ')} competitors`
    );
  }

  if (audience.length) {
    queries.push(
      `${category} companies for ${audience.slice(0, 3).join(' ')}`
    );
  }

  return unique(queries).slice(0, 8);
}
function extractCandidates(results, originalBrand) {
  const candidates = [];

  if (!Array.isArray(results)) {
    return candidates;
  }

  const original =
    normalizeCompanyName(originalBrand);

  const ignoredDomains = new Set([
    'google.com',
    'bing.com',
    'youtube.com',
    'wikipedia.org',
    'reddit.com',
    'linkedin.com',
    'medium.com',
    'forbes.com',
    'techcrunch.com',
    'reuters.com',
    'bloomberg.com',
    'businessinsider.com',
    'cnbc.com',
    'venturebeat.com',
    'thebusinessdive.com'
  ]);

  const genericNames = new Set([
    'artificial intelligence',
    'machine learning',
    'machine learning framework',
    'ai companies',
    'ai company',
    'ai tools',
    'ai platforms',
    'software companies',
    'technology companies',
    'technology',
    'software',
    'platform',
    'framework',
    'tools',
    'solutions',
    'developers',
    'businesses',
    'creators',
    'consumers',
    'product manager',
    'customer support manager',
    'data engineering',
    'data analytics',
    'business intelligence',
    'natural language processing',
    'cloud computing',
    'middle east',
    'latin america'
  ].map(normalizeCompanyName));

  const invalidNamePatterns = [
    /^when\b/i,
    /^how\b/i,
    /^why\b/i,
    /^what\b/i,
    /^which\b/i,
    /^top\b/i,
    /^best\b/i,
    /^\d+\b/i,
    /^the top\b/i,
    /^the best\b/i,
    /\bcompanies\b/i,
    /\bcompetitors\b/i,
    /\balternatives\b/i,
    /\bframeworks\b/i,
    /\bplatforms\b/i,
    /\btools\b/i,
    /\bsolutions\b/i,
    /\bservices\b/i,
    /\bdevelopers\b/i,
    /\bdesigners\b/i,
    /\bdeveloper\b/i,
    /\bguide\b/i,
    /\breview\b/i,
    /\bcomparison\b/i,
    /\branking\b/i,
    /\bquick look\b/i,
    /\bsummary\b/i,
    /\bview profile\b/i,
    /\bfounded\b/i,
    /\bjobs\b/i,
    /\bhire\b/i,
    /\bwhat is\b/i,
    /\bhow to\b/i,
    /\bfor\b/i,
    /###/,
    /\[/,
    /\]/
  ];

  const seen = new Set();

  function isValidName(name) {
    const cleaned =
      cleanText(name);

    if (!cleaned) {
      return false;
    }

    if (
      cleaned.length < 2 ||
      cleaned.length > 50
    ) {
      return false;
    }

    if (
      invalidNamePatterns.some(pattern =>
        pattern.test(cleaned)
      )
    ) {
      return false;
    }

    const wordCount =
      cleaned.split(/\s+/).length;

    if (wordCount > 5) {
      return false;
    }

    if (
      /[.!?]{2,}/.test(cleaned) ||
      cleaned.includes('###') ||
      cleaned.includes('[') ||
      cleaned.includes(']')
    ) {
      return false;
    }

    const normalized =
      normalizeCompanyName(cleaned);

    if (genericNames.has(normalized)) {
      return false;
    }

    if (
      normalized === original ||
      normalized.includes(original) ||
      original.includes(normalized)
    ) {
      return false;
    }

    return true;
  }

  function addCandidate({
    name,
    domain,
    url,
    content,
    score,
    source
  }) {
    if (!isValidName(name)) {
      return;
    }

    const normalizedName =
      normalizeCompanyName(name);

    if (seen.has(normalizedName)) {
      return;
    }

    seen.add(normalizedName);

    candidates.push({
      name: cleanText(name),
      domain: domain || null,
      url,
      description:
        cleanText(content).slice(0, 800),
      evidence:
        cleanText(content),
      searchScore:
        score ?? null,
      source:
        source || 'tavily'
    });
  }

  /*
   * Main strategy:
   *
   * Trust the search result title only when
   * the title has a strong relationship with
   * the result's domain.
   *
   * Do NOT scan arbitrary article text for
   * capitalized phrases.
   */

  for (const result of results) {
    if (candidates.length >= 20) {
      break;
    }

    const title =
      cleanText(result.title);

    const url =
      cleanText(result.url);

    const content =
      cleanText(result.content);

    if (!title || !url) {
      continue;
    }

    let domain = null;

    try {
      domain = getDomain(url);
    } catch {
      domain = null;
    }

    if (!domain) {
      continue;
    }

    const normalizedDomain =
      domain
        .toLowerCase()
        .replace(/^www\./, '');

    if (
      ignoredDomains.has(normalizedDomain)
    ) {
      continue;
    }

    /*
     * Remove common title suffixes.
     */
    let titleName =
      title
        .split('|')[0]
        .split(' — ')[0]
        .split(' – ')[0]
        .split(' - ')[0]
        .trim();

    titleName =
      titleName
        .replace(
          /\b(official website|official site|homepage)\b/gi,
          ''
        )
        .trim();

    if (!isValidName(titleName)) {
      continue;
    }

    /*
     * Compare the title with the domain.
     *
     * Example:
     *
     * Anthropic → anthropic.com
     * Cerebras → cerebras.ai
     * Perplexity → perplexity.ai
     *
     * These are strong direct-entity signals.
     */

    const domainCore =
      normalizedDomain
        .split('.')[0]
        .replace(/[-_]/g, ' ')
        .trim();

    const normalizedTitle =
      normalizeCompanyName(titleName);

    const normalizedDomainCore =
      normalizeCompanyName(domainCore);

    const domainMatches =
      normalizedDomainCore.length >= 4 &&
      (
        normalizedTitle.includes(
          normalizedDomainCore
        ) ||
        normalizedDomainCore.includes(
          normalizedTitle
        )
      );

    /*
     * Also accept obvious official-company
     * titles when the title is very short and
     * the domain looks brand-like.
     */
    const shortBrand =
      titleName.split(/\s+/).length <= 3 &&
      titleName.length <= 35;

    if (
      domainMatches ||
      (
        shortBrand &&
        normalizedDomainCore.length >= 5 &&
        !normalizedDomainCore.includes('blog') &&
        !normalizedDomainCore.includes('news')
      )
    ) {
      addCandidate({
        name: titleName,
        domain,
        url,
        content,
        score: result.score,
        source: result.source
      });
    }
  }

  /*
   * Highest search scores first.
   */
  candidates.sort(
    (a, b) =>
      (b.searchScore || 0) -
      (a.searchScore || 0)
  );

  /*
   * Hard safety limit.
   */
  return candidates.slice(0, 20);
}

async function discoverCompetitors({
  brand,
  brandProfile = {}
}) {
  if (!brand) {
    throw new Error('Brand is required.');
  }

  console.log(
    `[COMPETITOR DISCOVERY] Starting analysis for: ${brand}`
  );

  const queries = buildCompetitorQueries(
    brand,
    brandProfile
  );

  console.log(
    `[COMPETITOR DISCOVERY] Queries: ${queries.length}`
  );

  const allResults = [];

  for (const query of queries) {
    try {
      console.log(
        `[COMPETITOR DISCOVERY] Searching: ${query}`
      );

      const result =
        await analyzeSearch(query);

      if (result?.results) {
        allResults.push(...result.results);
      }

    } catch (error) {
      console.error(
        `[COMPETITOR DISCOVERY] Search failed: ${error.message}`
      );
    }
  }

  /*
   * Phase 1:
   * Extract plausible entities.
   */
  const candidates =
    extractCandidates(
      allResults,
      brand
    );

  console.log(
    `[COMPETITOR DISCOVERY] Candidates extracted: ${candidates.length}`
  );

  /*
   * Phase 2:
   * Resolve only plausible candidates.
   */
  const resolvedCandidates = [];

  for (const candidate of candidates) {
    const resolved =
      await resolveCompetitorEntity(
        candidate
      );

    if (
      resolved &&
      resolved.entityVerified &&
      resolved.officialDomain
    ) {
      resolvedCandidates.push(resolved);
    }
  }

  console.log(
    `[COMPETITOR DISCOVERY] Verified entities: ${resolvedCandidates.length}`
  );

  /*
   * Phase 3:
   * Rank ONLY verified entities.
   */
  const rankedCandidates =
    rankCompetitors({
      candidates: resolvedCandidates,
      brandProfile
    });

  /*
   * Phase 4:
   * Remove duplicate domains/entities.
   */
  const uniqueCompetitors =
    deduplicateCompetitors(
      rankedCandidates
    );

  /*
   * Phase 5:
   * Return the actual ranked competitor set.
   */
  return {
    success: true,
    brand,
    queryCount: queries.length,
    resultCount: allResults.length,
    candidates: uniqueCompetitors
  };
}

function calculateCompetitorScore({
  candidate,
  brandProfile = {}
}) {
  const text = `${candidate?.name || ''} ${candidate?.evidence || ''}`
    .toLowerCase();

  const identity = brandProfile.identity || {};
  const positioning = brandProfile.positioning || {};

  const category = cleanText(identity.category).toLowerCase();

  const keywords = [
    ...(positioning.keywords || []),
    ...(brandProfile.contentThemes || [])
  ]
    .map(item => cleanText(item).toLowerCase())
    .filter(Boolean);

  let score = 0;
  const reasons = [];

  // Industry relevance
  if (category && text.includes(category)) {
    score += 25;
    reasons.push('Industry/category overlap');
  }

  // Positioning relevance
  const matchedKeywords = keywords.filter(keyword =>
    keyword.length > 2 && text.includes(keyword)
  );

  if (matchedKeywords.length >= 3) {
    score += 25;
    reasons.push('Strong positioning overlap');
  } else if (matchedKeywords.length >= 1) {
    score += 10;
    reasons.push('Some positioning overlap');
  }

  // Product relevance
  const products = (brandProfile.products || [])
    .map(product => cleanText(product).toLowerCase())
    .filter(Boolean);

  const matchedProducts = products.filter(product =>
    text.includes(product)
  );

  if (matchedProducts.length >= 2) {
    score += 25;
    reasons.push('Strong product overlap');
  } else if (matchedProducts.length === 1) {
    score += 12;
    reasons.push('Product overlap');
  }

  // Evidence quality
  if (candidate?.url) {
    score += 10;
    reasons.push('Verifiable web source');
  }

  if ((candidate?.evidence || '').length > 300) {
    score += 10;
    reasons.push('Substantial supporting evidence');
  }

  // Explicit competitive relationship
  if (
    text.includes('competitor') ||
    text.includes('alternative') ||
    text.includes('similar')
  ) {
    score += 5;
    reasons.push('Explicit competitive relationship found');
  }

  return {
    ...candidate,
    competitorScore: Math.min(score, 100),
    reasons
  };
}

function rankCompetitors({
  candidates,
  brandProfile = {}
}) {
  return candidates
    .map(candidate =>
      calculateCompetitorScore({
        candidate,
        brandProfile
      })
    )
    .sort(
      (a, b) =>
        b.competitorScore - a.competitorScore
    );
}
function normalizeCompanyName(name) {
  return cleanText(name)
    .toLowerCase()
    .replace(/\|.*$/g, '')
    .replace(/\s*[-–—:]\s*(official|website|homepage|company).*$/i, '')
    .replace(/\b(official website|official site|homepage)\b/gi, '')
    .replace(/[^\w\s.-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function getDomain(url) {
  if (!url) return null;

  try {
    const parsed = new URL(url);

    return parsed.hostname
      .replace(/^www\./, '')
      .toLowerCase();
  } catch {
    return null;
  }
}

function deduplicateCompetitors(candidates) {
  const groups = new Map();

  for (const candidate of candidates || []) {
    const normalizedName =
      normalizeCompanyName(candidate.name);

    const domain =
      getDomain(candidate.url);

    const key =
      domain ||
      normalizedName;

    if (!key) continue;

    if (!groups.has(key)) {
      groups.set(key, {
        ...candidate,
        name: cleanText(candidate.name),
        domain,
        occurrences: 1,
        evidenceSources: candidate.url
          ? [candidate.url]
          : []
      });
      continue;
    }

    const existing = groups.get(key);

    existing.occurrences += 1;

    if (candidate.url) {
      existing.evidenceSources.push(candidate.url);
    }

    if (
      candidate.evidence &&
      candidate.evidence.length >
        existing.evidence.length
    ) {
      existing.evidence =
        candidate.evidence;
    }

    if (
      candidate.competitorScore >
      existing.competitorScore
    ) {
      existing.competitorScore =
        candidate.competitorScore;

      existing.reasons =
        candidate.reasons;
    }
  }

  return [...groups.values()]
    .map(candidate => ({
      ...candidate,
      evidenceSources:
        unique(candidate.evidenceSources)
    }))
    .sort(
      (a, b) =>
        b.competitorScore -
        a.competitorScore
    );
}
async function researchCompetitor(candidate) {
  if (!candidate?.name) {
    return null;
  }

  const company = candidate.name;

  const queries = [
    `"${company}" official website`,
    `"${company}" products services`,
    `"${company}" target customers audience`,
    `"${company}" positioning strategy`,
    `"${company}" website design UX`,
    `"${company}" content marketing strategy`,
    `"${company}" industry news`,
    `"${company}" technology`
  ];

  const evidence = [];

  for (const query of queries) {
    try {
      console.log(
        `[COMPETITOR RESEARCH] ${query}`
      );

      const result =
        await analyzeSearch(query);

      for (const item of result.results || []) {
        evidence.push({
          title: cleanText(item.title),
          url: cleanText(item.url),
          content: cleanText(item.content),
          score: item.score ?? null,
          query
        });
      }

    } catch (error) {
      console.error(
        `[COMPETITOR RESEARCH] Failed: ${error.message}`
      );
    }
  }

  const evidenceAnalysis =
    scoreEvidence(evidence);

  const verifiedClaims =
    buildVerifiedClaims(
      evidenceAnalysis.evidence
    );

  return {
    name: company,

    domain:
      candidate.domain || null,

    competitorScore:
      candidate.competitorScore || 0,

    evidenceCount:
      evidenceAnalysis.evidence.length,

    researchScore:
      evidenceAnalysis.score,

    researchConfidence:
      evidenceAnalysis.confidence,

    verifiedClaims,

    evidence:
      evidenceAnalysis.evidence
  };
}
async function researchTopCompetitors({
  candidates,
  limit = 5
}) {
  const selected =
    (candidates || [])
      .filter(candidate =>
        candidate.competitorScore >= 30
      )
      .slice(0, limit);

  console.log(
    `[COMPETITOR RESEARCH] Selected ${selected.length} competitors`
  );

  const researched = [];

  for (const candidate of selected) {
    const result =
      await researchCompetitor(candidate);

    if (result) {
      researched.push(result);
    }
  }

  return researched;
}
function classifySourceQuality(url) {
  if (!url) {
    return {
      tier: 5,
      label: 'Unknown',
      score: 0.2
    };
  }

  const domain = getDomain(url);

  if (!domain) {
    return {
      tier: 5,
      label: 'Unknown',
      score: 0.2
    };
  }

  const highAuthorityPatterns = [
    '.gov',
    '.edu',
    '.ac.',
    'who.int',
    'worldbank.org',
    'oecd.org'
  ];

  const primaryPatterns = [
    'linkedin.com',
    'youtube.com',
    'github.com'
  ];

  const establishedPatterns = [
    'reuters.com',
    'bloomberg.com',
    'forbes.com',
    'techcrunch.com',
    'wired.com',
    'ft.com'
  ];

  if (
    highAuthorityPatterns.some(
      pattern => domain.includes(pattern)
    )
  ) {
    return {
      tier: 1,
      label: 'Institutional / Primary',
      score: 1.0
    };
  }

  if (
    primaryPatterns.some(
      pattern => domain.includes(pattern)
    )
  ) {
    return {
      tier: 1,
      label: 'Platform / Primary',
      score: 0.95
    };
  }

  if (
    establishedPatterns.some(
      pattern => domain.includes(pattern)
    )
  ) {
    return {
      tier: 2,
      label: 'Established Publication',
      score: 0.8
    };
  }

  return {
    tier: 3,
    label: 'Web Source',
    score: 0.55
  };
}

function scoreEvidence(evidence) {
  if (!evidence?.length) {
    return {
      score: 0,
      confidence: 'low'
    };
  }

  const scored = evidence.map(item => {
    const sourceQuality =
      classifySourceQuality(item.url);

    const searchScore =
      typeof item.score === 'number'
        ? Math.max(0, Math.min(1, item.score))
        : 0.5;

    const contentStrength =
      item.content &&
      item.content.length > 300
        ? 1
        : 0.5;

    const combined =
      (
        sourceQuality.score * 0.5 +
        searchScore * 0.3 +
        contentStrength * 0.2
      );

    return {
      ...item,
      sourceQuality,
      evidenceScore:
        Number(combined.toFixed(3))
    };
  });

  const average =
    scored.reduce(
      (sum, item) =>
        sum + item.evidenceScore,
      0
    ) / scored.length;

  let confidence = 'low';

  if (average >= 0.8) {
    confidence = 'high';
  } else if (average >= 0.6) {
    confidence = 'medium';
  }

  return {
    score: Number(average.toFixed(3)),
    confidence,
    evidence: scored
  };
}
function normalizeClaimText(text) {
  return cleanText(text)
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractResearchClaims(evidence) {
  const claims = [];

  for (const item of evidence || []) {
    const content = cleanText(item.content);

    if (!content) continue;

    // Split long search evidence into meaningful sentences.
    const sentences = content
      .split(/[.!?]+/)
      .map(sentence => cleanText(sentence))
      .filter(sentence =>
        sentence.length >= 40 &&
        sentence.length <= 400
      );

    for (const sentence of sentences) {
      claims.push({
        text: sentence,
        normalized:
          normalizeClaimText(sentence),

        source: item.url || null,

        sourceQuality:
          item.sourceQuality || null,

        evidenceScore:
          item.evidenceScore || 0
      });
    }
  }

  return claims;
}

function calculateClaimSimilarity(a, b) {
  const wordsA = new Set(
    normalizeClaimText(a)
      .split(' ')
      .filter(word => word.length > 3)
  );

  const wordsB = new Set(
    normalizeClaimText(b)
      .split(' ')
      .filter(word => word.length > 3)
  );

  if (!wordsA.size || !wordsB.size) {
    return 0;
  }

  const intersection =
    [...wordsA].filter(word =>
      wordsB.has(word)
    ).length;

  const union =
    new Set([
      ...wordsA,
      ...wordsB
    ]).size;

  return intersection / union;
}

function buildVerifiedClaims(evidence) {
  const rawClaims =
    extractResearchClaims(evidence);

  const groups = [];

  for (const claim of rawClaims) {
    let matchedGroup = null;

    for (const group of groups) {
      const similarity =
        calculateClaimSimilarity(
          claim.text,
          group.representative.text
        );

      if (similarity >= 0.55) {
        matchedGroup = group;
        break;
      }
    }

    if (!matchedGroup) {
      groups.push({
        representative: claim,
        claims: [claim]
      });
    } else {
      matchedGroup.claims.push(claim);
    }
  }

  return groups.map(group => {
    const uniqueSources =
      unique(
        group.claims.map(
          claim => claim.source
        )
      );

    const strongestEvidence =
      Math.max(
        ...group.claims.map(
          claim => claim.evidenceScore || 0
        )
      );

    const independentSourceCount =
      uniqueSources.length;

    let confidence = 'low';

    if (
      independentSourceCount >= 3 &&
      strongestEvidence >= 0.7
    ) {
      confidence = 'high';
    } else if (
      independentSourceCount >= 2 &&
      strongestEvidence >= 0.55
    ) {
      confidence = 'medium';
    }

    return {
      claim: group.representative.text,

      confidence,

      independentSourceCount,

      sources: uniqueSources,

      supportingEvidence:
        group.claims.map(item => ({
          text: item.text,
          source: item.source,
          evidenceScore:
            item.evidenceScore
        }))
    };
  });
}
function normalizeClaimText(text) {
  return cleanText(text)
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractResearchClaims(evidence) {
  const claims = [];

  for (const item of evidence || []) {
    const content = cleanText(item.content);

    if (!content) continue;

    const sentences = content
      .split(/[.!?]+/)
      .map(sentence => cleanText(sentence))
      .filter(sentence =>
        sentence.length >= 40 &&
        sentence.length <= 400
      );

    for (const sentence of sentences) {
      claims.push({
        text: sentence,

        normalized:
          normalizeClaimText(sentence),

        source:
          item.url || null,

        sourceQuality:
          item.sourceQuality || null,

        evidenceScore:
          item.evidenceScore || 0
      });
    }
  }

  return claims;
}

function calculateClaimSimilarity(a, b) {
  const wordsA = new Set(
    normalizeClaimText(a)
      .split(' ')
      .filter(word => word.length > 3)
  );

  const wordsB = new Set(
    normalizeClaimText(b)
      .split(' ')
      .filter(word => word.length > 3)
  );

  if (!wordsA.size || !wordsB.size) {
    return 0;
  }

  const intersection =
    [...wordsA].filter(word =>
      wordsB.has(word)
    ).length;

  const union =
    new Set([
      ...wordsA,
      ...wordsB
    ]).size;

  return intersection / union;
}

function buildVerifiedClaims(evidence) {
  const rawClaims =
    extractResearchClaims(evidence);

  const groups = [];

  for (const claim of rawClaims) {
    let matchedGroup = null;

    for (const group of groups) {
      const similarity =
        calculateClaimSimilarity(
          claim.text,
          group.representative.text
        );

      if (similarity >= 0.55) {
        matchedGroup = group;
        break;
      }
    }

    if (!matchedGroup) {
      groups.push({
        representative: claim,
        claims: [claim]
      });
    } else {
      matchedGroup.claims.push(claim);
    }
  }

  return groups.map(group => {
    const uniqueSources =
      unique(
        group.claims.map(
          claim => claim.source
        )
      );

    const strongestEvidence =
      Math.max(
        ...group.claims.map(
          claim => claim.evidenceScore || 0
        )
      );

    const independentSourceCount =
      uniqueSources.length;

    let confidence = 'low';

    if (
      independentSourceCount >= 3 &&
      strongestEvidence >= 0.7
    ) {
      confidence = 'high';
    } else if (
      independentSourceCount >= 2 &&
      strongestEvidence >= 0.55
    ) {
      confidence = 'medium';
    }

    return {
      claim:
        group.representative.text,

      confidence,

      independentSourceCount,

      sources:
        uniqueSources,

      supportingEvidence:
        group.claims.map(item => ({
          text: item.text,
          source: item.source,
          evidenceScore:
            item.evidenceScore
        }))
    };
  });
}

async function resolveCompetitorEntity(candidate) {
  if (!candidate?.name) {
    return null;
  }

  const company = cleanText(candidate.name);

  console.log(
    `[ENTITY RESOLUTION] Resolving: ${company}`
  );

  try {
    const result = await analyzeSearch(
      `"${company}" official website company`
    );

    const results = result?.results || [];

    const normalizedCompany = company
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');

    const validResults = results
      .map(item => {
        const url = cleanText(item.url);
        const title = cleanText(item.title);

        if (!url || !title) {
          return null;
        }

        const domain = getDomain(url);

        if (!domain) {
          return null;
        }

        const normalizedDomain = domain
          .toLowerCase()
          .replace(/^www\./, '')
          .split('.')[0]
          .replace(/[^a-z0-9]/g, '');

        const normalizedTitle = title
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '');

        let score = Number(item.score || 0);

        // Strong signal: company name matches the domain.
        if (
          normalizedDomain === normalizedCompany ||
          normalizedDomain.includes(normalizedCompany) ||
          normalizedCompany.includes(normalizedDomain)
        ) {
          score += 1.0;
        }

        // Secondary signal: company name appears in title.
        if (normalizedTitle.includes(normalizedCompany)) {
          score += 0.5;
        }

        return {
          ...item,
          domain,
          resolutionScore: score
        };
      })
      .filter(Boolean)
      .sort(
        (a, b) =>
          b.resolutionScore - a.resolutionScore
      );

    if (validResults.length === 0) {
      console.log(
        `[ENTITY RESOLUTION] No reliable domain found for ${company}`
      );

      return {
        ...candidate,
        entityVerified: false,
        officialDomain: null,
        entityConfidence: 0
      };
    }

    const best = validResults[0];

    const officialDomain = best.domain;

    const confidence = Math.min(
      1,
      0.5 + (best.resolutionScore * 0.2)
    );

    console.log(
      `[ENTITY RESOLUTION] ${company} → ${officialDomain}`
    );

    return {
      ...candidate,

      entityVerified: true,

      officialDomain,

      officialUrl: best.url,

      entityConfidence: confidence,

      entityEvidence: {
        title: cleanText(best.title),
        url: cleanText(best.url),
        content: cleanText(best.content)
      }
    };

  } catch (error) {
    console.error(
      `[ENTITY RESOLUTION] Failed for ${company}:`,
      error.message
    );

    return {
      ...candidate,
      entityVerified: false,
      officialDomain: null,
      entityConfidence: 0
    };
  }
}
module.exports = {
  discoverCompetitors,
  buildCompetitorQueries,
  calculateCompetitorScore,
  rankCompetitors,
  deduplicateCompetitors,
  researchCompetitor,
  researchTopCompetitors,
  classifySourceQuality,
  scoreEvidence,
  normalizeClaimText,
  extractResearchClaims,
  calculateClaimSimilarity,
  buildVerifiedClaims,
  resolveCompetitorEntity
};





































