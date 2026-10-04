function parsePackageJson(files) {
  const packageFile = files.find(
    file => file.path.toLowerCase() === 'package.json'
  );

  if (!packageFile) {
    return {
      framework: null,
      libraries: [],
      devTools: []
    };
  }

  try {
    const pkg = JSON.parse(packageFile.content);

    const dependencies = Object.keys(pkg.dependencies || {});
    const devDependencies = Object.keys(pkg.devDependencies || {});

    const allDependencies = [
      ...dependencies,
      ...devDependencies
    ];

    let framework = null;

    if (allDependencies.includes('next')) {
      framework = 'Next.js';
    } else if (allDependencies.includes('react')) {
      framework = 'React';
    } else if (allDependencies.includes('vue')) {
      framework = 'Vue';
    } else if (allDependencies.includes('svelte')) {
      framework = 'Svelte';
    } else if (allDependencies.includes('angular')) {
      framework = 'Angular';
    }

    return {
      framework,
      libraries: dependencies,
      devTools: devDependencies
    };
  } catch (error) {
    return {
      framework: null,
      libraries: [],
      devTools: [],
      error: 'Could not parse package.json'
    };
  }
}

function classifyFile(path) {
  const lower = path.toLowerCase();

  if (
    lower.includes('hero') ||
    lower.includes('landing')
  ) {
    return 'hero';
  }

  if (
    lower.includes('navbar') ||
    lower.includes('navigation') ||
    lower.includes('header')
  ) {
    return 'navigation';
  }

  if (
    lower.includes('animation') ||
    lower.includes('motion') ||
    lower.includes('transition')
  ) {
    return 'animation';
  }

  if (
    lower.includes('three') ||
    lower.includes('scene') ||
    lower.includes('canvas') ||
    lower.includes('3d')
  ) {
    return '3d';
  }

  if (
    lower.includes('card') ||
    lower.includes('grid') ||
    lower.includes('gallery')
  ) {
    return 'components';
  }

  if (
    lower.includes('layout') ||
    lower.includes('page')
  ) {
    return 'layout';
  }

  if (
    lower.endsWith('.css') ||
    lower.endsWith('.scss')
  ) {
    return 'styling';
  }

  return 'other';
}

function analyzeCodeStructure(files) {
  const patterns = {
    hero: [],
    navigation: [],
    animation: [],
    '3d': [],
    components: [],
    layout: [],
    styling: [],
    other: []
  };

  for (const file of files) {
    const category = classifyFile(file.path);

    patterns[category].push({
      path: file.path
    });
  }

  return patterns;
}

function extractImplementationPatterns(files) {
  const patterns = [];

  for (const file of files) {
    const content = file.content || '';
    const lower = content.toLowerCase();

    if (
      lower.includes('framer-motion') ||
      lower.includes('motion.')
    ) {
      patterns.push({
        type: 'motion',
        file: file.path,
        technology: 'Framer Motion'
      });
    }

    if (
      lower.includes('three.js') ||
      lower.includes('@react-three/fiber') ||
      lower.includes('react-three')
    ) {
      patterns.push({
        type: '3d',
        file: file.path,
        technology: 'Three.js ecosystem'
      });
    }

    if (
      lower.includes('gsap')
    ) {
      patterns.push({
        type: 'animation',
        file: file.path,
        technology: 'GSAP'
      });
    }

    if (
      lower.includes('tailwind')
    ) {
      patterns.push({
        type: 'styling',
        file: file.path,
        technology: 'Tailwind CSS'
      });
    }
  }

  return patterns;
}

function buildCodeIntelligence(githubIntelligence) {
  const files = githubIntelligence.code || [];

  const technology = parsePackageJson(files);

  const structure = analyzeCodeStructure(files);

  const implementationPatterns =
    extractImplementationPatterns(files);

  return {
    repository: githubIntelligence.repository,

    technology,

    architecture: {
      totalFiles: githubIntelligence.structure?.totalFiles || 0,
      analyzedFiles: files.length,
      patterns: structure
    },

    implementationPatterns,

    knowledgeSummary: {
      frameworks: technology.framework
        ? [technology.framework]
        : [],

      libraries: technology.libraries,

      capabilities: [
        ...new Set(
          implementationPatterns.map(
            pattern => pattern.type
          )
        )
      ]
    }
  };
}

module.exports = {
  buildCodeIntelligence,
  parsePackageJson,
  classifyFile,
  analyzeCodeStructure,
  extractImplementationPatterns
};