const https = require('https');
const http = require('http');

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https://')
      ? https
      : http;

    const request = client.get(
      url,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 BIZLY-Brand-Intelligence'
        }
      },
      response => {
        let data = '';

        response.on('data', chunk => {
          data += chunk;
        });

        response.on('end', () => {
          resolve({
            statusCode: response.statusCode,
            contentType:
              response.headers['content-type'] || '',
            body: data
          });
        });
      }
    );

    request.on('error', reject);

    request.setTimeout(15000, () => {
      request.destroy();
      reject(
        new Error('Website request timed out.')
      );
    });
  });
}


function extractText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}


function extractMetadata(html) {
  const titleMatch =
    html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);

  const descriptionMatch =
    html.match(
      /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i
    );

  const keywordsMatch =
    html.match(
      /<meta[^>]+name=["']keywords["'][^>]+content=["']([^"']*)["']/i
    );

  return {
    title: titleMatch
      ? titleMatch[1].trim()
      : null,

    description: descriptionMatch
      ? descriptionMatch[1].trim()
      : null,

    keywords: keywordsMatch
      ? keywordsMatch[1]
          .split(',')
          .map(item => item.trim())
          .filter(Boolean)
      : []
  };
}


function extractHeadings(html) {
  const headings = [];

  const matches = html.matchAll(
    /<h([1-3])[^>]*>([\s\S]*?)<\/h\1>/gi
  );

  for (const match of matches) {
    const text = extractText(match[2]);

    if (text) {
      headings.push({
        level: Number(match[1]),
        text
      });
    }
  }

  return headings.slice(0, 50);
}


async function analyzeWebsite(url) {
  if (!url) {
    throw new Error('Website URL is required.');
  }

  if (
    !url.startsWith('http://') &&
    !url.startsWith('https://')
  ) {
    throw new Error(
      'Website URL must start with http:// or https://'
    );
  }

  console.log(
    `[WEBSITE INTELLIGENCE] Analyzing ${url}`
  );

  const page = await fetchPage(url);

  if (
    !page.statusCode ||
    page.statusCode >= 400
  ) {
    throw new Error(
      `Website returned HTTP ${page.statusCode || 'unknown'}`
    );
  }

  const metadata =
    extractMetadata(page.body);

  const headings =
    extractHeadings(page.body);

  const text =
    extractText(page.body);

  return {
    source: 'website',

    url,

    statusCode: page.statusCode,

    metadata,

    headings,

    text: text.slice(0, 30000),

    evidence: {
      title: metadata.title,
      description: metadata.description,
      headings
    }
  };
}


module.exports = {
  analyzeWebsite,
  extractText,
  extractMetadata,
  extractHeadings
};