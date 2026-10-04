const GITHUB_API = 'https://api.github.com';

async function githubRequest(url) {
  const headers = {
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2026-03-10',
    'User-Agent': 'BIZLY-Intelligence-Engine'
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization =
      `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const response = await fetch(url, {
    headers
  });

  if (!response.ok) {
    const text = await response.text();

    throw new Error(
      `GitHub API ${response.status}: ${text.slice(0, 300)}`
    );
  }

  return response.json();
}


// ------------------------------------------------------------
// Parse a GitHub repository URL
// ------------------------------------------------------------

function parseGitHubUrl(repoUrl) {
  const url = new URL(repoUrl);

  if (url.hostname !== 'github.com') {
    throw new Error('Only github.com repository URLs are supported.');
  }

  const parts = url.pathname
    .split('/')
    .filter(Boolean);

  if (parts.length < 2) {
    throw new Error('Invalid GitHub repository URL.');
  }

  return {
    owner: parts[0],
    repo: parts[1].replace(/\.git$/, '')
  };
}


// ------------------------------------------------------------
// Get repository metadata
// ------------------------------------------------------------

async function getRepositoryMetadata(owner, repo) {

  return githubRequest(
    `${GITHUB_API}/repos/${owner}/${repo}`
  );
}


// ------------------------------------------------------------
// Get complete repository file tree
// ------------------------------------------------------------

async function getRepositoryTree(owner, repo, branch) {

  const data = await githubRequest(
    `${GITHUB_API}/repos/${owner}/${repo}/git/trees/${encodeURIComponent(branch)}?recursive=1`
  );

  return data.tree || [];
}


// ------------------------------------------------------------
// Pick files that contain useful engineering intelligence
// ------------------------------------------------------------
function selectRelevantFiles(tree) {
  const allowedExtensions = [
    '.js',
    '.jsx',
    '.ts',
    '.tsx',
    '.css',
    '.scss',
    '.html',
    '.json',
    '.md'
  ];

  const ignoredFolders = [
    'node_modules/',
    'dist/',
    'build/',
    '.next/',
    '.git/',
    'coverage/',
    'vendor/',
    'test/',
    'tests/',
    '__tests__/',
    'fixtures/',
    'benchmarks/'
  ];

  function scoreFile(file) {
    const path = file.path.toLowerCase();
    const name = path.split('/').pop();

    let score = 0;

    // Highest priority: core repository intelligence
    if (name === 'package.json') score += 100;
    if (name === 'readme.md') score += 95;

    // Main application entry points
    if (
      name === 'app.js' ||
      name === 'app.jsx' ||
      name === 'app.ts' ||
      name === 'app.tsx'
    ) {
      score += 80;
    }

    if (
      name === 'main.js' ||
      name === 'main.jsx' ||
      name === 'main.ts' ||
      name === 'main.tsx'
    ) {
      score += 75;
    }

    // Framework/configuration files
    if (
      name.includes('config') ||
      name.includes('vite') ||
      name.includes('next.config') ||
      name.includes('tailwind')
    ) {
      score += 65;
    }

    // Important UI architecture
    if (
      path.includes('/components/') ||
      path.includes('/component/')
    ) {
      score += 50;
    }

    if (
      path.includes('/layouts/') ||
      path.includes('/layout/')
    ) {
      score += 55;
    }

    // High-value visual implementation
    if (
      path.includes('hero') ||
      path.includes('landing')
    ) {
      score += 60;
    }

    if (
      path.includes('animation') ||
      path.includes('motion') ||
      path.includes('transition')
    ) {
      score += 60;
    }

    if (
      path.includes('three') ||
      path.includes('scene') ||
      path.includes('canvas') ||
      path.includes('3d')
    ) {
      score += 60;
    }

    // Navigation
    if (
      path.includes('navbar') ||
      path.includes('navigation') ||
      path.includes('header')
    ) {
      score += 45;
    }

    // Styling
    if (
      path.endsWith('.css') ||
      path.endsWith('.scss')
    ) {
      score += 30;
    }

    // Documentation
    if (
      path.includes('/docs/') ||
      path.includes('/documentation/')
    ) {
      score += 20;
    }

    // Penalize obvious examples
    if (
      path.includes('/examples/') ||
      path.startsWith('examples/')
    ) {
      score -= 15;
    }
    if (name === 'package.json') score += 50;
    if (name === 'readme.md') score += 45;
    return score;
  }

  return tree
    .filter(item => item.type === 'blob')
    .filter(item => {
      const path = item.path.toLowerCase();

      if (
        ignoredFolders.some(folder =>
          path.includes(folder)
        )
      ) {
        return false;
      }

      return allowedExtensions.some(ext =>
        path.endsWith(ext)
      );
    })
    .sort((a, b) => {
      return scoreFile(b) - scoreFile(a);
    });
}

// ------------------------------------------------------------
// Retrieve a single file
// ------------------------------------------------------------

async function getFileContent(owner, repo, filePath) {

  const encodedPath = filePath
    .split('/')
    .map(encodeURIComponent)
    .join('/');

  const data = await githubRequest(
    `${GITHUB_API}/repos/${owner}/${repo}/contents/${encodedPath}`
  );

  if (data.type !== 'file' || !data.content) {
    return null;
  }

  const content = Buffer
    .from(data.content, 'base64')
    .toString('utf8');

  return {
    path: filePath,
    content
  };
}


// ------------------------------------------------------------
// Analyze a public GitHub repository
// ------------------------------------------------------------

async function analyzeGitHubRepository(repoUrl) {

  const { owner, repo } = parseGitHubUrl(repoUrl);

  console.log(
    `[GITHUB INTELLIGENCE] Analyzing ${owner}/${repo}`
  );

  const metadata =
    await getRepositoryMetadata(owner, repo);

  const tree =
    await getRepositoryTree(
      owner,
      repo,
      metadata.default_branch
    );
    const rankedFiles = selectRelevantFiles(tree);

const selectedFiles = [];

const categories = [
  'package.json',
  'README.md',
  'config',
  'architecture',
  'hero',
  'animation',
  '3d',
  'component',
  'layout',
  'styling'
];

for (const category of categories) {
  const match = rankedFiles.find(file => {
    const path = file.path.toLowerCase();
    const name = path.split('/').pop();
    const isRootFile = !path.includes('/');
    let score=0;
    if (isRootFile) {
    return 1000;
}

    if (category === 'package.json') {
      return name === 'package.json';
    }

    if (category === 'README.md') {
      return name === 'readme.md';
    }

    if (category === 'config') {
      return (
        name.includes('config') ||
        name.includes('vite') ||
        name.includes('tailwind')
      );
    }

    if (category === 'architecture') {
      return (
        name.includes('app.') ||
        name.includes('main.') ||
        path.includes('/lib/') ||
        path.includes('/utils/')
      );
    }

    if (category === 'hero') {
      return path.includes('hero') ||
             path.includes('landing');
    }

    if (category === 'animation') {
      return path.includes('animation') ||
             path.includes('motion') ||
             path.includes('transition');
    }

    if (category === '3d') {
      return path.includes('three') ||
             path.includes('scene') ||
             path.includes('canvas') ||
             path.includes('3d');
    }

    if (category === 'component') {
      return path.includes('component');
    }

    if (category === 'layout') {
      return path.includes('layout');
    }

    if (category === 'styling') {
      return path.endsWith('.css') ||
             path.endsWith('.scss');
    }

    return false;
  });

  if (
    match &&
    !selectedFiles.some(file => file.path === match.path)
  ) {
    selectedFiles.push(match);
  }
}

const remaining = rankedFiles.filter(
  file =>
    !selectedFiles.some(
      selected => selected.path === file.path
    )
);

selectedFiles.push(
  ...remaining.slice(0, 10 - selectedFiles.length)
);
    
    
    
    
    
    

  const files = [];

  for (const file of selectedFiles) {

    try {

      const result =
        await getFileContent(
          owner,
          repo,
          file.path
        );

      if (result) {
        files.push(result);
      }

    } catch (error) {

      console.warn(
        `[GITHUB] Could not read ${file.path}:`,
        error.message
      );
    }
  }

  return {

    repository: {
      name: metadata.name,
      fullName: metadata.full_name,
      description: metadata.description,
      url: metadata.html_url,
      language: metadata.language,
      topics: metadata.topics || [],
      stars: metadata.stargazers_count,
      defaultBranch: metadata.default_branch
    },

    structure: {
      totalFiles: tree.length,
      analyzedFiles: files.length,
      paths: tree
        .filter(item => item.type === 'blob')
        .map(item => item.path)
        .slice(0, 500)
    },

    code: files
  };
}


module.exports = {
  analyzeGitHubRepository,
  parseGitHubUrl,
  selectRelevantFiles
};