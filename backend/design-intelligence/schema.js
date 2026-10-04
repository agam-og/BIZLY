const EMPTY_DESIGN_INTELLIGENCE = {
  source: {
    name: "",
    url: "",
    category: "",
    subcategory: ""
  },

  visual: {
    style: [],
    mood: [],
    visualLanguage: [],
    density: "",
    originality: ""
  },

  layout: {
    structure: [],
    grid: [],
    alignment: [],
    whitespace: "",
    sections: []
  },

  hero: {
    type: "",
    composition: [],
    headlineStyle: "",
    media: [],
    cta: []
  },

  navigation: {
    type: "",
    behavior: [],
    mobilePattern: ""
  },

  typography: {
    style: [],
    hierarchy: "",
    displayTreatment: [],
    bodyTreatment: []
  },

  color: {
    palette: [],
    background: [],
    accent: [],
    contrast: ""
  },

  components: {
    cards: [],
    buttons: [],
    forms: [],
    sections: [],
    other: []
  },

  interaction: {
    hover: [],
    cursor: [],
    scroll: [],
    transitions: [],
    microInteractions: []
  },

  motion: {
    intensity: "",
    techniques: [],
    pageTransitions: [],
    textMotion: [],
    imageMotion: []
  },

  threeD: {
    used: false,
    techniques: [],
    objects: [],
    rendering: [],
    interaction: []
  },

  ux: {
    patterns: [],
    hierarchy: [],
    accessibility: [],
    responsive: []
  },

  conversion: {
    goals: [],
    ctaStrategy: [],
    trustSignals: [],
    socialProof: []
  },

  technology: {
    frameworks: [],
    libraries: [],
    rendering: [],
    cms: [],
    hosting: []
  },

  designPrinciples: [],

  reusablePatterns: [],

  extractedAt: ""
};

function createEmptyDesignIntelligence() {
  return JSON.parse(JSON.stringify(EMPTY_DESIGN_INTELLIGENCE));
}

module.exports = {
  EMPTY_DESIGN_INTELLIGENCE,
  createEmptyDesignIntelligence
};
