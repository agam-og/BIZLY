const path = require('path');

require('dotenv').config({
  path: path.resolve(__dirname, '.env')
});

const express = require('express');
const cors = require('cors');

const {
  loadDesignSourcesFromExcel,
  buildMultiDesignPrompt,
  retrieveDesignSources
} = require('./ragEngine');
const {
  analyzeGitHubRepository
} = require('./githubIntelligence');
const {
  buildCodeIntelligence
} = require('./codeIntelligence');
const {
  collectBrandEvidence
} = require('./brandIntelligenceEngine');
const {
  discoverCompetitors,
  researchTopCompetitors
} = require('./competitorIntelligence');


const app = express();
app.use(cors());
app.use(express.json());

// Load Excel RAG Sources
const excelPath = path.resolve(
  __dirname,
  '../data/design/AI_Website_Design_and_Prompt_Sources.xlsx'
);
const designKnowledgeBase = loadDesignSourcesFromExcel(excelPath);

console.log(`[RAG INIT] Loaded ${designKnowledgeBase.length} design sources from Excel.`);

// API Endpoint to generate 3 distinct website designs
app.post('/api/rag/generate-three-designs', async (req, res) => {
  const { query, provider = 'omniroute', model } = req.body;
  
  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required.' });
  }

  // 1. Retrieve top matching sources from BIZLY Design Intelligence
  

  const topSources = retrieveDesignSources(query, 8);

   // 2. Build rich AI design-generation prompt
  const systemPrompt = buildMultiDesignPrompt(query, topSources);
  console.log(`[RAG ENGINE] Processing request: "${query}" using provider: ${provider}`);

  // 2. Call LLM Router (OmniRoute, Jan AI, Claude, Gemini) or return synthesized 3-design payload
  try {
    if (provider === 'jan')
     {
      console.log("[JAN URL]", process.env.JAN_AI_URL);
      console.log("[JAN KEY EXISTS]", !!process.env.JAN_API_KEY);
      const response = await fetch(process.env.JAN_AI_URL || 'http://localhost:1337/v1/chat/completions', {
        method: 'POST',
        headers: {
         'Content-Type': 'application/json',
         'Authorization': `Bearer ${process.env.JAN_API_KEY}`
        },
          body: JSON.stringify({
          model: model || 'qwen2_5-coder-7b-instruct-q4_k_m',
          messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: query }]
        })
      });
      const rawText = await response.text();
      console.log("[JAN STATUS]", response.status);
      console.log("[JAN RAW TEXT]", rawText);
      const data = JSON.parse(rawText);
      console.log("[JAN FULL RESPONSE]", JSON.stringify(data, null, 2));

      const content = data.choices?.[0]?.message?.content;
      console.log("[JAN CONTENT]", content);  
      
      
      
    
      if (content) {
        const cleaned = content.replace(/^```json\s*|\s*```$/g, "").trim();
        const parsed = JSON.parse(cleaned);
        return res.json({ query, provider, sourcesUsed: topSources, ...parsed });
      }
    }
  } catch (e) {
    console.error("[JAN ERROR]", e);
    console.warn(`[LLM ROUTER FALLBACK] Defaulting to built-in 3-design generator.`);
  }
  
  
  

  // Fallback Engine returning 3 Best Designs directly
  return res.json({
    query,
    provider,
    sourcesUsed: topSources,
    designs: [
      {
        option: "A",
        styleName: "Ultra-Minimal Modern Grid",
        description: "Monochromatic dark design with sharp grid layouts and high contrast text elements.",
        html: `<div style="background:#080d1a; color:#e2e8f0; padding:2rem; font-family:sans-serif; border-radius:1rem;">
          <h1 style="color:#38bdf8; font-size:2rem; margin-bottom:1rem;">${query.toUpperCase()} - OPTION A</h1>
          <p style="color:#94a3b8; margin-bottom:1.5rem;">Minimalist typography layout derived from Godly & Minimal Gallery patterns.</p>
          <div style="background:#0f172a; padding:1.5rem; border-radius:0.5rem; border:1px solid #334155;">
            <h3 style="color:#34d399;">Core Architecture</h3>
            <p style="font-size:0.9rem; color:#cbd5e1;">Structured component layout optimized for clean UX.</p>
          </div>
        </div>`
      },
      {
        option: "B",
        "styleName": "Cinematic Particle & Motion Glass",
        "description": "Interactive neon gradients with glassmorphic cards and audio visualizer accents.",
        html: `<div style="background:linear-gradient(135deg, #090d16, #1e1b4b); color:#ffffff; padding:2rem; font-family:sans-serif; border-radius:1rem;">
          <h1 style="color:#a855f7; font-size:2rem; margin-bottom:1rem;">${query.toUpperCase()} - OPTION B</h1>
          <p style="color:#cbd5e1; margin-bottom:1.5rem;">Cinematic aesthetic inspired by BrandMotion & Awwwards Award Winners.</p>
          <div style="background:rgba(255,255,255,0.05); backdrop-filter:blur(10px); padding:1.5rem; border-radius:0.5rem; border:1px solid rgba(255,255,255,0.1);">
            <h3 style="color:#38bdf8;">Interactive Visualizer</h3>
            <p style="font-size:0.9rem; color:#e2e8f0;">Dynamic canvas animation frame integration ready.</p>
          </div>
        </div>`
      },
      {
        option: "C",
        "styleName": "High-Conversion SaaS Grid",
        "description": "Multi-column feature blocks, badge pricing, and conversion-focused call-to-action sections.",
        html: `<div style="background:#020617; color:#f8fafc; padding:2rem; font-family:sans-serif; border-radius:1rem;">
          <h1 style="color:#10b981; font-size:2rem; margin-bottom:1rem;">${query.toUpperCase()} - OPTION C</h1>
          <p style="color:#94a3b8; margin-bottom:1.5rem;">SaaS conversion layout built using patterns from Linear & SaaSFrame.</p>
          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap:1rem;">
            <div style="background:#0f172a; padding:1rem; border-radius:0.5rem; border:1px solid #1e293b;">
              <h4 style="color:#10b981;">Feature 01</h4>
              <p style="font-size:0.8rem; color:#94a3b8;">High speed performance.</p>
            </div>
            <div style="background:#0f172a; padding:1rem; border-radius:0.5rem; border:1px solid #1e293b;">
              <h4 style="color:#38bdf8;">Feature 02</h4>
              <p style="font-size:0.8rem; color:#94a3b8;">Real-time sync.</p>
            </div>
          </div>
        </div>`
      }
    ]
  });
});

app.post('/api/intelligence/brand', async (req, res) => {
  const {
    query,
    website,
    youtube,
    linkedin,
    instagram,
    x
  } = req.body;

  if (!query) {
    return res.status(400).json({
      success: false,
      error: 'query is required.'
    });
  }

  try {
    console.log(
      `[BRAND INTELLIGENCE API] Request received: ${query}`
    );

    const intelligence =
      await collectBrandEvidence({
        query,
        website,
        youtube,
        linkedin,
        instagram,
        x
      });

    return res.json(intelligence);

  } catch (error) {
    console.error(
      '[BRAND INTELLIGENCE API] Error:',
      error.message
    );

    return res.status(500).json({
      success: false,
      error: 'Brand intelligence analysis failed.',
      details: error.message
    });
  }
});




app.post('/api/intelligence/competitors', async (req, res) => {
  const {
    brand,
    brandProfile = {}
  } = req.body;

  if (!brand) {
    return res.status(400).json({
      success: false,
      error: 'brand is required.'
    });
  }

  try {
    console.log(
      `[COMPETITOR INTELLIGENCE API] Request received: ${brand}`
    );

    // If no brand profile was supplied,
    // automatically build one first.
    let resolvedBrandProfile = brandProfile;

    const profileIsEmpty =
      !resolvedBrandProfile ||
      Object.keys(resolvedBrandProfile).length === 0;

    if (profileIsEmpty) {
      console.log(
        `[COMPETITOR INTELLIGENCE API] No brand profile supplied. Building one first...`
      );

      const brandIntelligence =
        await collectBrandEvidence({
          query: brand
        });

      resolvedBrandProfile =
        brandIntelligence.brandProfile || {};

      console.log(
        `[COMPETITOR INTELLIGENCE API] Brand profile created.`
      );
    }

    // Phase 1:
    // Discover possible competitors using
    // the brand intelligence profile.
    const discovery =
      await discoverCompetitors({
        brand,
        brandProfile: resolvedBrandProfile
      });

    // Phase 2:
    // Deep-research the strongest candidates.
    const competitors =
      await researchTopCompetitors({
        candidates: discovery.candidates,
        limit: 5
      });

    return res.json({
      success: true,

      brand,

      brandProfile:
        resolvedBrandProfile,

      discovery: {
        queryCount:
          discovery.queryCount,

        resultCount:
          discovery.resultCount,

        candidateCount:
          discovery.candidates.length
      },

      competitors
    });

  } catch (error) {
    console.error(
      '[COMPETITOR INTELLIGENCE API] Error:',
      error.message
    );

    return res.status(500).json({
      success: false,
      error:
        'Competitor intelligence analysis failed.',

      details:
        error.message
    });
  }
});

app.post('/api/intelligence/github', async (req, res) => {
  const { repoUrl } = req.body;

  if (!repoUrl) {
    return res.status(400).json({
      success: false,
      error: 'repoUrl is required.'
    });
  }

  try {
    console.log(
      `[GITHUB INTELLIGENCE] Request received: ${repoUrl}`
    );

    const intelligence =
      await analyzeGitHubRepository(repoUrl);

    const codeIntelligence =
      buildCodeIntelligence(intelligence);

    return res.json({
      success: true,
      repository: codeIntelligence.repository,
      technology: codeIntelligence.technology,
      architecture: codeIntelligence.architecture,
      implementationPatterns:
        codeIntelligence.implementationPatterns,
      knowledgeSummary:
        codeIntelligence.knowledgeSummary
    });

  } catch (error) {
    console.error(
      '[GITHUB INTELLIGENCE] Error:',
      error.message
    );

    return res.status(500).json({
      success: false,
      error: 'GitHub repository analysis failed.',
      details: error.message
    });
  }
});
const { buildIntelligence } = require('./intelligenceCore');

app.post('/api/intelligence', async (req, res) => {
  const {
    query,
    website,
    youtube,
    linkedin,
    instagram,
    x,
    repoUrl
  } = req.body;

  if (!query) {
    return res.status(400).json({
      success: false,
      error: 'query is required.'
    });
  }

  try {
    console.log(
      `[INTELLIGENCE CORE API] Request received: ${query}`
    );

    const intelligence = await buildIntelligence({
      query,
      website,
      youtube,
      linkedin,
      instagram,
      x,
      repoUrl
    });

    return res.json(intelligence);

  } catch (error) {
    console.error(
      '[INTELLIGENCE CORE API] Error:',
      error.message
    );

    return res.status(500).json({
      success: false,
      error: 'Unified intelligence analysis failed.',
      details: error.message
    });
  }
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`BIZLY backend running on http://localhost:${PORT}`);
});