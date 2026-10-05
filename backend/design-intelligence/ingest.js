const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");

const {
  sources,
  getHighPrioritySources
} = require("./sourceRegistry");

const {
  createEmptyDesignIntelligence
} = require("./schema");

const KNOWLEDGE_FILE = path.join(
  __dirname,
  "../../data/design/knowledgeStore.json"
);

const FETCH_TIMEOUT = 15000;

/*
========================================================
FETCH WEBSITE
========================================================
*/

async function fetchWebsite(url) {
  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, FETCH_TIMEOUT);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; BIZLY-Design-Research/1.0)",
        "Accept":
          "text/html,application/xhtml+xml"
      },
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status} ${response.statusText}`
      );
    }

    const html = await response.text();

    return {
      success: true,
      html
    };

  } catch (error) {
    return {
      success: false,
      error: error.message
    };

  } finally {
    clearTimeout(timeout);
  }
}

/*
========================================================
HELPERS
========================================================
*/

function unique(values) {
  return [...new Set(
    values
      .map(value => String(value || "").trim())
      .filter(Boolean)
  )];
}

function getText($, selector) {
  return $(selector)
    .map((_, el) => $(el).text().replace(/\s+/g, " ").trim())
    .get()
    .filter(Boolean);
}

function hasAny(text, keywords) {
  const lower = text.toLowerCase();

  return keywords.some(keyword =>
    lower.includes(keyword.toLowerCase())
  );
}

/*
========================================================
DESIGN INTELLIGENCE EXTRACTION
========================================================
*/

function extractDesignIntelligenceFromHtml(
  source,
  html
) {
  const $ = cheerio.load(html);

  const record = createEmptyDesignIntelligence();

  /*
  SOURCE
  */

  record.source.name = source.name;
  record.source.url = source.url;
  record.source.category =
    source.categories[0] || "";

  record.source.subcategory =
    source.categories.slice(1);
  /*
   BIZLY KNOWLEDGE CLASSIFICATION
*/

  record.knowledgeType =
  source.knowledgeType || [];

  record.specialties =
  source.specialties || [];

  record.tier =
  source.tier || "secondary";

  /*
  BASIC PAGE INFORMATION
  */

  const title = $("title")
    .first()
    .text()
    .trim();

  const description =
    $('meta[name="description"]')
      .attr("content") || "";

  /*
  PAGE STRUCTURE
  */

  const headings = getText(
    $,
    "h1, h2, h3"
  );

  const navItems = getText(
    $,
    "nav a, header a"
  );
  const buttons = unique
  (
  $("button, a[role='button'], .btn, [class*='button']")
    .map((_, el) => {
      const text = $(el)
        .clone()
        .find("svg, img, script, style")
        .remove()
        .end()
        .text()
        .replace(/\s+/g, " ")
        .trim();

      return text;
    })
    .get()
    .filter(text => {
      if (!text) return false;
      if (text.length > 80) return false;
      if (text.includes("@")) return false;

      return true;
    })
    .map(text => text.replace(/[→←↑↓]+$/g, "").trim())
  ).slice(0, 20);
  const sections = $(
    "main > section, main section, body > section"
  )
    .map((_, el) => {
      const heading = $(el)
        .find("h1,h2,h3")
        .first()
        .text()
        .replace(/\s+/g, " ")
        .trim();

      return heading || "Unnamed section";
    })
    .get();

  /*
  TEXT / CLASS / HTML SIGNALS
  */

  const bodyText = $("body")
    .text()
    .replace(/\s+/g, " ")
    .toLowerCase();

  const classText = $("[class]")
    .map((_, el) => $(el).attr("class"))
    .get()
    .join(" ")
    .toLowerCase();

  const idText = $("[id]")
    .map((_, el) => $(el).attr("id"))
    .get()
    .join(" ")
    .toLowerCase();

  const scriptText = $("script")
    .map((_, el) => $(el).html() || "")
    .get()
    .join(" ")
    .toLowerCase();

  const stylesheetText = $("link[rel='stylesheet']")
    .map((_, el) => $(el).attr("href") || "")
    .get()
    .join(" ")
    .toLowerCase();

  const allSignals = `
    ${bodyText}
    ${classText}
    ${idText}
    ${scriptText}
    ${stylesheetText}
  `;

  /*
  ======================================================
  VISUAL
  ======================================================
  */

  const visualStyle = [];

  if (
    hasAny(allSignals, [
      "minimal",
      "minimalist",
      "clean"
    ])
  ) {
    visualStyle.push("minimal");
  }

  if (
    hasAny(allSignals, [
      "dark",
      "black",
      "midnight"
    ])
  ) {
    visualStyle.push("dark");
  }

  if (
    hasAny(allSignals, [
      "gradient",
      "mesh-gradient"
    ])
  ) {
    visualStyle.push("gradient");
  }

  if (
    hasAny(allSignals, [
      "glass",
      "glassmorphism",
      "backdrop-blur"
    ])
  ) {
    visualStyle.push("glassmorphism");
  }

  if (
    hasAny(allSignals, [
      "brutalism",
      "brutalist"
    ])
  ) {
    visualStyle.push("brutalist");
  }

  if (
    hasAny(allSignals, [
      "editorial",
      "magazine"
    ])
  ) {
    visualStyle.push("editorial");
  }

  if (
    hasAny(allSignals, [
      "luxury",
      "premium"
    ])
  ) {
    visualStyle.push("premium");
  }

  record.visual.style = unique(
    visualStyle
  );

  /*
  ======================================================
  LAYOUT
  ======================================================
  */

  const layoutPatterns = [];

  if (
    hasAny(classText, [
      "grid",
      "grid-cols",
      "columns"
    ])
  ) {
    layoutPatterns.push("grid");
  }

  if (
    hasAny(classText, [
      "flex",
      "flex-row",
      "flex-col"
    ])
  ) {
    layoutPatterns.push("flex-layout");
  }

  if (
    hasAny(allSignals, [
      "full-screen",
      "fullscreen",
      "100vh",
      "min-h-screen"
    ])
  ) {
    layoutPatterns.push("full-screen");
  }

  if (
    hasAny(allSignals, [
      "center",
      "centered"
    ])
  ) {
    layoutPatterns.push("centered-composition");
  }

  record.layout.structure =
    unique(layoutPatterns);

  record.layout.sections =
    unique(sections).slice(0, 30);

  /*
  ======================================================
  HERO
  ======================================================
  */

  const heroSignals = [
    "hero",
    "hero-section",
    "hero-content",
    "hero-container"
  ];

  const hasHero =
    hasAny(classText, heroSignals) ||
    $("main h1").length > 0;

  if (hasHero) {
    record.hero.type = "primary-hero";

    record.hero.composition =
      unique([
        $("main h1").length
          ? "large headline"
          : "",
        buttons.length
          ? "primary CTA"
          : "",
        $("main img, main video, main canvas").length
          ? "visual media"
          : ""
      ]);
  }

  record.hero.headlineStyle =
    headings.length
      ? "heading-led hierarchy"
      : "";

  record.hero.cta =
    unique(buttons).slice(0, 10);

  /*
  ======================================================
  NAVIGATION
  ======================================================
  */

  if ($("nav").length) {
    record.navigation.type =
      "navigation-bar";
  }

  if (
    navItems.length > 0
  ) {
    record.navigation.behavior.push(
      "link-based navigation"
    );
  }

  /*
  ======================================================
  TYPOGRAPHY
  ======================================================
  */

  const fontLinks = $("link")
    .map((_, el) =>
      $(el).attr("href") || ""
    )
    .get()
    .filter(Boolean);

  const fontSignals = fontLinks.filter(
    link =>
      /font|typekit|googleapis/i.test(link)
  );

  if (fontSignals.length) {
    record.typography.style.push(
      "custom/web font"
    );
  }

  if (
    headings.some(text => text.length > 40)
  ) {
    record.typography.displayTreatment.push(
      "large editorial headlines"
    );
  }

  /*
  ======================================================
  COLOR
  ======================================================
  */

  const colorSignals = [];

  if (
    hasAny(allSignals, [
      "gradient",
      "linear-gradient",
      "radial-gradient"
    ])
  ) {
    colorSignals.push("gradient palette");
  }

  if (
    hasAny(allSignals, [
      "black",
      "dark",
      "midnight"
    ])
  ) {
    record.color.background.push(
      "dark background"
    );
  }

  if (
    hasAny(allSignals, [
      "white",
      "light"
    ])
  ) {
    record.color.contrast = "light/dark contrast signals";
  }

  record.color.palette =
    unique(colorSignals);

  /*
  ======================================================
  COMPONENTS
  ======================================================
  */

  const componentSignals = [];

  if (
    hasAny(classText, [
      "card",
      "card-grid",
      "card-container"
    ])
  ) {
    record.components.cards.push(
      "card-based content"
    );
  }

  if (buttons.length) {
    record.components.buttons =
      unique(buttons).slice(0, 15);
  }

  if (
    $("form").length
  ) {
    record.components.forms.push(
      "form"
    );
  }

  record.components.sections =
    unique(sections).slice(0, 20);

  /*
  ======================================================
  INTERACTION
  ======================================================
  */

  if (
    hasAny(allSignals, [
      "hover",
      "hover:",
      ":hover"
    ])
  ) {
    record.interaction.hover.push(
      "hover interactions detected"
    );
  }

  if (
    hasAny(allSignals, [
      "cursor",
      "custom-cursor"
    ])
  ) {
    record.interaction.cursor.push(
      "custom cursor signals"
    );
  }

  if (
    hasAny(allSignals, [
      "scroll",
      "scrolltrigger",
      "smooth-scroll"
    ])
  ) {
    record.interaction.scroll.push(
      "scroll interaction signals"
    );
  }

  /*
  ======================================================
  MOTION
  ======================================================
  */

  const motionSignals = [];

  if (
    hasAny(allSignals, [
      "gsap",
      "framer-motion",
      "motion",
      "animation",
      "animate"
    ])
  ) {
    motionSignals.push(
      "animation library or animation signals"
    );
  }

  if (
    hasAny(allSignals, [
      "scrolltrigger"
    ])
  ) {
    motionSignals.push(
      "scroll-triggered animation"
    );
  }

  if (
    hasAny(allSignals, [
      "parallax"
    ])
  ) {
    motionSignals.push(
      "parallax"
    );
  }

  record.motion.techniques =
    unique(motionSignals);

  if (motionSignals.length) {
    record.motion.intensity =
      motionSignals.length >= 2
        ? "medium-high"
        : "medium";
  }

  /*
  ======================================================
  THREE.JS / WEBGL / 3D
  ======================================================
  */

  const threeDSignals = [];

  const canvasCount =
    $("canvas").length;

  if (canvasCount > 0) {
    threeDSignals.push(
      "canvas rendering"
    );
  }

  if (
    hasAny(allSignals, [
      "three.js",
      "threejs",
      "webgl",
      "spline",
      "babylon",
      "react-three-fiber",
      "r3f"
    ])
  ) {
    threeDSignals.push(
      "3D/WebGL technology signals"
    );
  }

  if (threeDSignals.length) {
    record.threeD.used = true;

    record.threeD.techniques =
      unique(threeDSignals);
  }

  /*
  ======================================================
  UX
  ======================================================
  */

  if ($("meta[name='viewport']").length) {
    record.ux.responsive.push(
      "viewport configured"
    );
  }

  if (
    hasAny(classText, [
      "responsive",
      "mobile",
      "md:",
      "lg:",
      "sm:"
    ])
  ) {
    record.ux.responsive.push(
      "responsive class signals"
    );
  }

  /*
  ======================================================
  TECHNOLOGY DETECTION
  ======================================================
  */

  const technologies = [];

  if (
    hasAny(allSignals, [
      "next.js",
      "__next",
      "_next/"
    ])
  ) {
    technologies.push("Next.js");
  }

  if (
    hasAny(allSignals, [
      "react",
      "react-dom"
    ])
  ) {
    technologies.push("React");
  }

  if (
    hasAny(allSignals, [
      "vue"
    ])
  ) {
    technologies.push("Vue");
  }

  if (
    hasAny(allSignals, [
      "webflow"
    ])
  ) {
    technologies.push("Webflow");
  }

  if (
    hasAny(allSignals, [
      "framer"
    ])
  ) {
    technologies.push("Framer");
  }

  if (
    hasAny(allSignals, [
      "three.js",
      "threejs"
    ])
  ) {
    technologies.push("Three.js");
  }

  if (
    hasAny(allSignals, [
      "gsap"
    ])
  ) {
    technologies.push("GSAP");
  }

  record.technology.frameworks =
    unique(technologies);

  /*
  ======================================================
  DESIGN PRINCIPLES
  ======================================================
  */

  const principles = [];

  if (record.layout.structure.includes("grid")) {
    principles.push(
      "structured grid-based composition"
    );
  }

  if (record.hero.type) {
    principles.push(
      "clear hero-first hierarchy"
    );
  }

  if (record.motion.techniques.length) {
    principles.push(
      "motion used as an interaction layer"
    );
  }

  if (record.threeD.used) {
    principles.push(
      "immersive visual rendering"
    );
  }

  if (record.navigation.type) {
    principles.push(
      "persistent navigation structure"
    );
  }

  if (record.components.cards.length) {
    principles.push(
      "modular card-based information architecture"
    );
  }

  record.designPrinciples =
    unique(principles);

  /*
  ======================================================
  REUSABLE PATTERNS
  ======================================================
  */

  const reusablePatterns = [];

  if (record.hero.type) {
    reusablePatterns.push(
      "hero + primary CTA"
    );
  }

  if (record.layout.structure.includes("grid")) {
    reusablePatterns.push(
      "responsive content grid"
    );
  }

  if (record.components.cards.length) {
    reusablePatterns.push(
      "modular cards"
    );
  }

  if (record.motion.techniques.length) {
    reusablePatterns.push(
      "motion-enhanced interactions"
    );
  }

  if (record.threeD.used) {
    reusablePatterns.push(
      "3D/WebGL visual layer"
    );
  }

  record.reusablePatterns =
    unique(reusablePatterns);

  /*
  ======================================================
  EXTRACTION METADATA
  ======================================================
  */

  record.extractedAt =
    new Date().toISOString();

  record._extraction = {
    title,
    description,
    headings: headings.slice(0, 20),
    navigationItems: navItems.slice(0, 20),
    buttonLabels: buttons.slice(0, 20),
    imageCount: $("img").length,
    videoCount: $("video").length,
    canvasCount,
    iframeCount: $("iframe").length,
    linkCount: $("a").length,
    scriptCount: $("script").length,
    stylesheetCount: $("link[rel='stylesheet']").length
  };

  return record;
}

/*
========================================================
CREATE KNOWLEDGE RECORD
========================================================
*/

async function ingestSource(source) {
  console.log(
    `[INGEST] Fetching ${source.name}...`
  );

  const result =
    await fetchWebsite(source.url);

  if (!result.success) {
    console.warn(
      `[INGEST WARN] ${source.name}: ${result.error}`
    );

    const fallback =
      createEmptyDesignIntelligence();

    fallback.source.name = source.name;
    fallback.source.url = source.url;
    fallback.source.category =
      source.categories[0] || "";
    fallback.source.subcategory =
      source.categories.slice(1);

    fallback.designPrinciples =
      source.categories.map(
        category =>
          `Registry category: ${category}`
      );

    fallback.extractedAt =
      new Date().toISOString();

    return fallback;
  }

  try {
    const record =
      extractDesignIntelligenceFromHtml(
        source,
        result.html
      );

    console.log(
      `[INGEST OK] ${source.name}`
    );

    return record;

  } catch (error) {
    console.warn(
      `[INGEST PARSE ERROR] ${source.name}: ${error.message}`
    );

    return createEmptyDesignIntelligence();
  }
}

/*
========================================================
BUILD KNOWLEDGE STORE
========================================================
*/

async function buildKnowledgeStore(
  sourceList = sources
) {
  const records = [];

  for (const source of sourceList) {
    const record =
      await ingestSource(source);

    records.push(record);
  }

  fs.writeFileSync(
    KNOWLEDGE_FILE,
    JSON.stringify(records, null, 2),
    "utf8"
  );

  console.log(
    `\n[KNOWLEDGE STORE] Saved ${records.length} records.`
  );

  return records;
}

/*
========================================================
HIGH PRIORITY STORE
========================================================
*/

async function buildHighPriorityKnowledgeStore() {
  return buildKnowledgeStore(
    getHighPrioritySources()
  );
}

/*
========================================================
LOAD KNOWLEDGE STORE
========================================================
*/

function loadKnowledgeStore() {
  if (!fs.existsSync(KNOWLEDGE_FILE)) {
    return [];
  }

  try {
    return JSON.parse(
      fs.readFileSync(
        KNOWLEDGE_FILE,
        "utf8"
      )
    );

  } catch (error) {
    console.error(
      "[KNOWLEDGE STORE] Failed to read knowledgeStore.json:",
      error.message
    );

    return [];
  }
}

/*
========================================================
EXPORTS
========================================================
*/

module.exports = {
  fetchWebsite,
  extractDesignIntelligenceFromHtml,
  ingestSource,
  buildKnowledgeStore,
  buildHighPriorityKnowledgeStore,
  loadKnowledgeStore
};





































































