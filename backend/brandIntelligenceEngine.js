const {
  analyzeWebsite
} = require('./connectors/websiteConnector');

const {
  analyzeSearch
} = require('./connectors/searchConnector');

const {
  analyzeYouTube
} = require('./connectors/youtubeConnector');

const {
  analyzeLinkedIn
} = require('./connectors/linkedinConnector');

const {
  analyzeInstagram
} = require('./connectors/instagramConnector');

const {
  analyzeX
} = require('./connectors/xConnector');

const {
  buildBrandIntelligence
} = require('./brandIntelligence');


async function collectBrandEvidence({
  query,
  website = null,
  youtube = null,
  linkedin = null,
  instagram = null,
  x = null
}) {
  if (!query) {
    throw new Error(
      'Brand query is required.'
    );
  }

  console.log(
    `[BRAND INTELLIGENCE] Starting analysis for: ${query}`
  );

  const evidence = [];


  // WEBSITE
  if (website) {
    try {
      const result =
        await analyzeWebsite(website);

      evidence.push({
        source: 'website',
        type: 'website',
        url: website,
        content: [
          result.metadata?.title,
          result.metadata?.description,
          ...(result.headings || [])
            .map(item => item.text),
          result.text
        ]
          .filter(Boolean)
          .join(' ')
      });

    } catch (error) {
      console.error(
        '[BRAND INTELLIGENCE] Website failed:',
        error.message
      );
    }
  }


  // SEARCH
  try {
    const result =
      await analyzeSearch(query);

    evidence.push(
      ...(result.evidence || [])
    );

  } catch (error) {
    console.error(
      '[BRAND INTELLIGENCE] Search failed:',
      error.message
    );
  }


  // YOUTUBE
  if (youtube) {
    try {
      const result =
        await analyzeYouTube(youtube);

      evidence.push(
        ...(result.evidence || [])
      );

    } catch (error) {
      console.error(
        '[BRAND INTELLIGENCE] YouTube failed:',
        error.message
      );
    }
  }


  // LINKEDIN
  if (linkedin) {
    try {
      const result =
        await analyzeLinkedIn(linkedin);

      evidence.push(
        ...(result.evidence || [])
      );

    } catch (error) {
      console.error(
        '[BRAND INTELLIGENCE] LinkedIn failed:',
        error.message
      );
    }
  }


  // INSTAGRAM
  if (instagram) {
    try {
      const result =
        await analyzeInstagram(instagram);

      evidence.push(
        ...(result.evidence || [])
      );

    } catch (error) {
      console.error(
        '[BRAND INTELLIGENCE] Instagram failed:',
        error.message
      );
    }
  }


  // X
  if (x) {
    try {
      const result =
        await analyzeX(x);

      evidence.push(
        ...(result.evidence || [])
      );

    } catch (error) {
      console.error(
        '[BRAND INTELLIGENCE] X failed:',
        error.message
      );
    }
  }


  // BUILD BRAND PROFILE
  const brandProfile =
    buildBrandIntelligence(
      query,
      evidence
    );


  return {
    success: true,

    query,

    evidenceCount:
      evidence.length,

    sources: [
      ...new Set(
        evidence.map(
          item => item.source
        )
      )
    ],

    brandProfile
  };
}


module.exports = {
  collectBrandEvidence
};