require('dotenv').config();

async function analyzeSearch(query) {
  if (!query) {
    throw new Error('Search query is required.');
  }

  if (!process.env.TAVILY_API_KEY) {
    throw new Error('TAVILY_API_KEY is missing from .env');
  }

  console.log(
    `[SEARCH INTELLIGENCE] Searching: ${query}`
  );

  const response = await fetch(
    'https://api.tavily.com/search',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        api_key: process.env.TAVILY_API_KEY,
        query,
        search_depth: 'advanced',
        max_results: 10,
        include_answer: true,
        include_raw_content: false
      })
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `Tavily API ${response.status}: ${errorText.slice(0, 500)}`
    );
  }

  const data = await response.json();

  const results = data.results || [];

  console.log(
    `[SEARCH INTELLIGENCE] Results: ${results.length}`
  );

  return {
    source: 'tavily',
    query,

    answer: data.answer || null,

    results: results.map(result => ({
      title: result.title || '',
      url: result.url || '',
      content: result.content || '',
      score: result.score ?? null
    })),

    evidence: results.map(result => ({
      source: 'tavily',
      url: result.url || null,
      type: 'web-result',
      content: [
        result.title,
        result.content
      ]
        .filter(Boolean)
        .join(' ')
    }))
  };
}

module.exports = {
  analyzeSearch
};