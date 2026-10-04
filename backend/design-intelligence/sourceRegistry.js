const sources = [
  // ─────────────────────────────────────────
  // CREATIVE / PROMPT SOURCES
  // ─────────────────────────────────────────

  {
    name: "BrandMotion",
    url: "https://brandmotion.in/",
    categories: ["creative", "prompts", "branding"],
    priority: "high"
  },
  {
    name: "WebsitePrompts.ai",
    url: "https://websiteprompts.ai/",
    categories: ["prompts", "ai-generation"],
    priority: "medium"
  },
  {
    name: "WebsitePrompts.com",
    url: "https://websiteprompts.com/",
    categories: ["prompts", "landing-pages", "saas", "ecommerce"],
    priority: "medium"
  },
  {
    name: "CloneWeb AI",
    url: "https://cloneweb.ai/website-prompts",
    categories: ["prompts", "3d", "saas", "portfolio"],
    priority: "medium"
  },
  {
    name: "Promptheus",
    url: "https://design.promptheus.dev/",
    categories: ["prompts", "creative", "ai-generation"],
    priority: "medium"
  },
  {
    name: "SitePrompts",
    url: "https://siteprompts.dev/",
    categories: ["prompts", "design-tokens", "animation"],
    priority: "high"
  },
  {
    name: "WebsitePrompt.ai",
    url: "https://websiteprompt.ai/",
    categories: ["prompts", "ai-generation"],
    priority: "medium"
  },
  {
    name: "Prompt Station",
    url: "https://www.promptstation.online/en/blog/ai-website-prompt-examples",
    categories: ["prompts", "ai-generation"],
    priority: "medium"
  },

  // ─────────────────────────────────────────
  // CREATIVE / EXPERIMENTAL WEB
  // ─────────────────────────────────────────

  {
    name: "Godly",
    url: "https://godly.design/",
    categories: ["creative", "experimental", "interaction", "motion"],
    priority: "high"
  },
  {
    name: "Framer Gallery",
    url: "https://www.framer.com/gallery/",
    categories: ["creative", "landing-pages", "portfolio"],
    priority: "high"
  },
  {
    name: "Landing.Gallery",
    url: "https://www.landing.gallery/",
    categories: ["landing-pages", "marketing"],
    priority: "high"
  },
  {
    name: "Landing Love",
    url: "https://www.landing.love/",
    categories: ["landing-pages", "marketing"],
    priority: "high"
  },
  {
    name: "The FWA",
    url: "https://thefwa.com/",
    categories: ["creative", "experimental", "interaction", "motion"],
    priority: "high"
  },

  // ─────────────────────────────────────────
  // AI / WEBSITE GENERATION
  // ─────────────────────────────────────────

  {
    name: "Lovable",
    url: "https://lovable.dev/",
    categories: ["ai-generation", "web-apps", "code-generation"],
    priority: "medium"
  },
  {
    name: "Bolt.new",
    url: "https://bolt.new/",
    categories: ["ai-generation", "web-apps", "code-generation"],
    priority: "medium"
  },
  {
    name: "v0",
    url: "https://v0.dev/",
    categories: ["ai-generation", "ui", "code-generation"],
    priority: "medium"
  },
  {
    name: "Replit",
    url: "https://replit.com/",
    categories: ["ai-generation", "code-generation", "web-apps"],
    priority: "medium"
  },
  {
    name: "Framer",
    url: "https://www.framer.com/",
    categories: ["website-builder", "interaction", "animation"],
    priority: "high"
  },
  {
    name: "Webflow",
    url: "https://webflow.com/",
    categories: ["website-builder", "interaction", "animation"],
    priority: "high"
  },
  {
    name: "Cursor",
    url: "https://www.cursor.com/",
    categories: ["code-generation", "ai-development"],
    priority: "low"
  },
  {
    name: "Claude",
    url: "https://claude.ai/",
    categories: ["ai-generation", "reasoning", "code-generation"],
    priority: "low"
  },

  // ─────────────────────────────────────────
  // PROMPT / MOTION RESOURCES
  // ─────────────────────────────────────────

  {
    name: "Meez",
    url: "https://meez.design/",
    categories: ["prompts", "motion", "creative"],
    priority: "high"
  },
  {
    name: "CopyLayers",
    url: "https://copylayers.com/",
    categories: ["prompts", "components", "animation"],
    priority: "high"
  },

  // ─────────────────────────────────────────
  // AWARD / DESIGN GALLERIES
  // ─────────────────────────────────────────

  {
    name: "Awwwards",
    url: "https://www.awwwards.com/",
    categories: ["creative", "award-winning", "interaction", "ux"],
    priority: "high"
  },
  {
    name: "Awwwards Inspiration",
    url: "https://www.awwwards.com/inspiration/",
    categories: ["creative", "interaction", "ux"],
    priority: "high"
  },
  {
    name: "CSS Design Awards",
    url: "https://www.cssdesignawards.com/",
    categories: ["creative", "award-winning", "ux", "innovation"],
    priority: "high"
  },
  {
    name: "SiteInspire",
    url: "https://www.siteinspire.com/",
    categories: ["web-design", "layout", "visual"],
    priority: "high"
  },
  {
    name: "Httpster",
    url: "https://httpster.net/",
    categories: ["web-design", "creative", "visual"],
    priority: "high"
  },
  {
    name: "CSS Nectar",
    url: "https://cssnectar.com/",
    categories: ["web-design", "creative", "visual"],
    priority: "medium"
  },
  {
    name: "Best Website Gallery",
    url: "https://bestwebsite.gallery/",
    categories: ["web-design", "visual", "creative"],
    priority: "high"
  },
  {
    name: "Webdesign Inspiration",
    url: "https://www.webdesign-inspiration.com/",
    categories: ["web-design", "layout", "visual"],
    priority: "high"
  },
  {
    name: "Design Vault",
    url: "https://designvault.io/",
    categories: ["web-design", "product-design", "visual"],
    priority: "high"
  },

  // ─────────────────────────────────────────
  // LANDING PAGE SOURCES
  // ─────────────────────────────────────────

  {
    name: "Lapa Ninja",
    url: "https://www.lapa.ninja/",
    categories: ["landing-pages", "marketing", "layout"],
    priority: "high"
  },
  {
    name: "One Page Love",
    url: "https://onepagelove.com/",
    categories: ["landing-pages", "one-page", "layout"],
    priority: "high"
  },
  {
    name: "Land-book",
    url: "https://land-book.com/",
    categories: ["landing-pages", "visual", "layout"],
    priority: "high"
  },
  {
    name: "Minimal Gallery",
    url: "https://minimal.gallery/",
    categories: ["minimal", "layout", "typography"],
    priority: "high"
  },

  // ─────────────────────────────────────────
  // UI / UX / PRODUCT DESIGN
  // ─────────────────────────────────────────

  {
    name: "Mobbin",
    url: "https://mobbin.com/",
    categories: ["ui", "ux", "product-design", "patterns"],
    priority: "high"
  },
  {
    name: "Figma Community",
    url: "https://www.figma.com/community/",
    categories: ["ui", "design-systems", "components", "templates"],
    priority: "high"
  },
  {
    name: "Dribbble",
    url: "https://dribbble.com/",
    categories: ["ui", "visual", "concepts"],
    priority: "medium"
  },
  {
    name: "Behance",
    url: "https://www.behance.net/",
    categories: ["case-studies", "branding", "visual"],
    priority: "medium"
  },
  {
    name: "UI Jar",
    url: "https://uijar.com/",
    categories: ["ui", "ux", "patterns"],
    priority: "medium"
  },
  {
    name: "Collect UI",
    url: "https://collectui.com/",
    categories: ["ui", "components", "patterns"],
    priority: "medium"
  },
  {
    name: "UI Garage",
    url: "https://uigarage.net/",
    categories: ["ui", "ux", "patterns"],
    priority: "high"
  },

  // ─────────────────────────────────────────
  // SAAS / PRODUCT / USER FLOWS
  // ─────────────────────────────────────────

  {
    name: "SaaSFrame",
    url: "https://www.saasframe.io/",
    categories: ["saas", "product-design", "ux"],
    priority: "high"
  },
  {
    name: "Page Flows",
    url: "https://pageflows.com/",
    categories: ["ux", "user-flows", "interaction"],
    priority: "high"
  },

  // ─────────────────────────────────────────
  // SHOWCASES / TEMPLATES
  // ─────────────────────────────────────────

  {
    name: "Webflow Showcase",
    url: "https://webflow.com/made-in-webflow/popular",
    categories: ["web-design", "interaction", "animation", "webflow"],
    priority: "high"
  },
  {
    name: "Framer Templates",
    url: "https://www.framer.com/marketplace/templates/",
    categories: ["templates", "layout", "components"],
    priority: "high"
  },
  {
    name: "Muzli",
    url: "https://muz.li/",
    categories: ["design", "visual", "ui", "inspiration"],
    priority: "medium"
  },
  // ============================================================
// BIZLY CORPUS — DESIGN SYSTEMS & UI STRUCTURE
// ============================================================

{
  name: "Material Design",
  url: "https://m3.material.io/",
  categories: ["design-systems", "ui", "components", "accessibility"],
  priority: "high"
},
{
  name: "Apple Human Interface Guidelines",
  url: "https://developer.apple.com/design/human-interface-guidelines/",
  categories: ["design-systems", "ui", "ux", "accessibility"],
  priority: "high"
},
{
  name: "IBM Carbon Design System",
  url: "https://carbondesignsystem.com/",
  categories: ["design-systems", "ui", "components", "accessibility"],
  priority: "high"
},
{
  name: "Microsoft Fluent",
  url: "https://fluent2.microsoft.design/",
  categories: ["design-systems", "ui", "components", "accessibility"],
  priority: "high"
},
{
  name: "Shopify Polaris",
  url: "https://polaris.shopify.com/",
  categories: ["design-systems", "ecommerce", "ui", "components"],
  priority: "high"
},
{
  name: "Adobe Spectrum",
  url: "https://spectrum.adobe.com/",
  categories: ["design-systems", "ui", "components", "accessibility"],
  priority: "high"
},
{
  name: "Atlassian Design System",
  url: "https://atlassian.design/",
  categories: ["design-systems", "saas", "ui", "components"],
  priority: "high"
},
{
  name: "USWDS",
  url: "https://designsystem.digital.gov/",
  categories: ["design-systems", "ui", "accessibility", "components"],
  priority: "high"
},
{
  name: "Ant Design",
  url: "https://ant.design/",
  categories: ["design-systems", "ui", "components", "saas"],
  priority: "high"
},
{
  name: "Chakra UI",
  url: "https://chakra-ui.com/",
  categories: ["ui", "components", "accessibility", "design-systems"],
  priority: "medium"
},
{
  name: "Radix UI",
  url: "https://www.radix-ui.com/",
  categories: ["ui", "components", "accessibility", "design-systems"],
  priority: "high"
},
{
  name: "shadcn/ui",
  url: "https://ui.shadcn.com/",
  categories: ["ui", "components", "design-systems", "saas"],
  priority: "high"
},
{
  name: "Mantine",
  url: "https://mantine.dev/",
  categories: ["ui", "components", "saas"],
  priority: "medium"
},
{
  name: "Primer",
  url: "https://primer.style/",
  categories: ["design-systems", "ui", "components", "accessibility"],
  priority: "high"
},
{
  name: "GOV.UK Design System",
  url: "https://design-system.service.gov.uk/",
  categories: ["design-systems", "accessibility", "ui", "components"],
  priority: "high"
},
{
  name: "Salesforce Lightning",
  url: "https://www.lightningdesignsystem.com/",
  categories: ["design-systems", "saas", "ui", "components"],
  priority: "high"
},
{
  name: "Spectrum Web Components",
  url: "https://opensource.adobe.com/spectrum-web-components/",
  categories: ["design-systems", "components", "accessibility"],
  priority: "medium"
},
{
  name: "Polaris Web Components",
  url: "https://shopify.dev/docs/api/app-home/polaris-web-components",
  categories: ["design-systems", "ecommerce", "components"],
  priority: "medium"
},
{
  name: "Elastic UI",
  url: "https://eui.elastic.co/",
  categories: ["design-systems", "saas", "ui", "components"],
  priority: "medium"
},
{
  name: "GitLab Pajamas",
  url: "https://design.gitlab.com/",
  categories: ["design-systems", "saas", "ui", "components"],
  priority: "medium"
},
{
  name: "Codrops",
  url: "https://tympanus.net/codrops/",
  categories: ["3d", "webgl", "interaction", "motion", "creative"],
  priority: "high"
},
{
  name: "Three.js",
  url: "https://threejs.org/",
  categories: ["3d", "webgl", "threejs", "interaction"],
  priority: "high"
},
{
  name: "Three.js Examples",
  url: "https://threejs.org/examples/",
  categories: ["3d", "webgl", "threejs", "interaction", "motion"],
  priority: "high"
},
{
  name: "React Three Fiber",
  url: "https://r3f.docs.pmnd.rs/",
  categories: ["3d", "webgl", "threejs", "react", "interaction"],
  priority: "high"
},
{
  name: "Drei",
  url: "https://drei.docs.pmnd.rs/",
  categories: ["3d", "threejs", "react", "interactions"],
  priority: "high"
},
{
  name: "Spline",
  url: "https://spline.design/",
  categories: ["3d", "webgl", "creative", "interaction"],
  priority: "high"
},
{
  name: "GSAP",
  url: "https://gsap.com/",
  categories: ["motion", "animation", "interaction", "scroll"],
  priority: "high"
},
{
  name: "Motion",
  url: "https://motion.dev/",
  categories: ["motion", "animation", "interaction", "react"],
  priority: "high"
},
{
  name: "Barba.js",
  url: "https://barba.js.org/",
  categories: ["motion", "interaction", "transitions"],
  priority: "medium"
},
{
  name: "Lenis",
  url: "https://lenis.darkroom.engineering/",
  categories: ["motion", "interaction", "scroll"],
  priority: "high"
},
{
  name: "Locomotive Scroll",
  url: "https://locomotivemtl.github.io/locomotive-scroll/",
  categories: ["motion", "interaction", "scroll"],
  priority: "medium"
},
{
  name: "Awwwards Collections",
  url: "https://www.awwwards.com/websites/collections/",
  categories: ["creative", "award-winning", "interaction", "motion"],
  priority: "high"
},
{
  name: "Bruno Simon",
  url: "https://bruno-simon.com/",
  categories: ["3d", "webgl", "creative", "portfolio", "interaction"],
  priority: "high"
},
{
  name: "Active Theory",
  url: "https://activetheory.net/",
  categories: ["3d", "webgl", "creative", "interaction", "motion"],
  priority: "high"
},
{
  name: "Immersive Garden",
  url: "https://immersive-g.com/",
  categories: ["3d", "webgl", "creative", "interaction", "motion"],
  priority: "high"
},
{
  name: "Resn",
  url: "https://resn.co.nz/",
  categories: ["creative", "3d", "webgl", "interaction", "motion"],
  priority: "high"
},
{
  name: "Locomotive",
  url: "https://locomotive.ca/",
  categories: ["creative", "interaction", "motion", "webgl"],
  priority: "high"
},
{
  name: "Hello Monday",
  url: "https://www.hellomonday.com/",
  categories: ["creative", "interaction", "motion", "3d"],
  priority: "high"
},
{
  name: "Active Theory Lab",
  url: "https://activetheory.net/lab",
  categories: ["3d", "webgl", "experiments", "interaction"],
  priority: "medium"
},
{
  name: "Brutalist Websites",
  url: "https://brutalistwebsites.com/",
  categories: ["creative", "experimental", "visual", "web-design"],
  priority: "medium"
},
{
  name: "Linear",
  url: "https://linear.app/",
  categories: ["saas", "product-design", "ui", "ux", "conversion"],
  priority: "high"
},
{
  name: "Stripe",
  url: "https://stripe.com/",
  categories: ["saas", "product-design", "conversion", "landing-pages"],
  priority: "high"
},
{
  name: "Notion",
  url: "https://www.notion.com/",
  categories: ["saas", "product-design", "ui", "ux"],
  priority: "high"
},
{
  name: "Vercel",
  url: "https://vercel.com/",
  categories: ["saas", "product-design", "developer-tools", "landing-pages"],
  priority: "high"
},
{
  name: "Framer",
  url: "https://www.framer.com/",
  categories: ["saas", "product-design", "interaction", "landing-pages"],
  priority: "high"
},
{
  name: "Webflow",
  url: "https://webflow.com/",
  categories: ["saas", "product-design", "interaction", "landing-pages"],
  priority: "high"
},
{
  name: "Raycast",
  url: "https://www.raycast.com/",
  categories: ["saas", "product-design", "ui", "interaction"],
  priority: "high"
},
{
  name: "Arc",
  url: "https://arc.net/",
  categories: ["product-design", "ui", "ux", "interaction"],
  priority: "medium"
},
{
  name: "Superhuman",
  url: "https://superhuman.com/",
  categories: ["saas", "product-design", "conversion", "ui"],
  priority: "high"
},
{
  name: "Loom",
  url: "https://www.loom.com/",
  categories: ["saas", "product-design", "conversion", "ui"],
  priority: "medium"
},
{
  name: "Dropbox",
  url: "https://www.dropbox.com/",
  categories: ["saas", "product-design", "conversion", "ux"],
  priority: "medium"
},
{
  name: "Slack",
  url: "https://slack.com/",
  categories: ["saas", "product-design", "ui", "ux"],
  priority: "medium"
},
{
  name: "HubSpot",
  url: "https://www.hubspot.com/",
  categories: ["saas", "conversion", "marketing", "landing-pages"],
  priority: "medium"
},
{
  name: "Intercom",
  url: "https://www.intercom.com/",
  categories: ["saas", "product-design", "conversion", "ux"],
  priority: "high"
},
{
  name: "Figma",
  url: "https://www.figma.com/",
  categories: ["saas", "product-design", "ui", "design-systems"],
  priority: "high"
},

{
  name: "Nike",
  url: "https://www.nike.com/",
  categories: ["ecommerce", "branding", "conversion", "product-storytelling"],
  priority: "high"
},
{
  name: "Apple",
  url: "https://www.apple.com/",
  categories: ["ecommerce", "branding", "product-storytelling", "conversion"],
  priority: "high"
},
{
  name: "Samsung",
  url: "https://www.samsung.com/",
  categories: ["ecommerce", "product-storytelling", "conversion", "branding"],
  priority: "medium"
},
{
  name: "Airbnb",
  url: "https://www.airbnb.com/",
  categories: ["ecommerce", "product-design", "ux", "conversion"],
  priority: "high"
},
{
  name: "Patagonia",
  url: "https://www.patagonia.com/",
  categories: ["ecommerce", "branding", "storytelling", "conversion"],
  priority: "high"
},
{
  name: "Aesop",
  url: "https://www.aesop.com/",
  categories: ["ecommerce", "branding", "typography", "visual"],
  priority: "high"
},
{
  name: "Glossier",
  url: "https://www.glossier.com/",
  categories: ["ecommerce", "branding", "conversion", "visual"],
  priority: "medium"
},
{
  name: "Allbirds",
  url: "https://www.allbirds.com/",
  categories: ["ecommerce", "branding", "product-storytelling", "conversion"],
  priority: "medium"
},
{
  name: "Lego",
  url: "https://www.lego.com/",
  categories: ["ecommerce", "branding", "interactive", "visual"],
  priority: "medium"
},
{
  name: "Dyson",
  url: "https://www.dyson.com/",
  categories: ["ecommerce", "product-storytelling", "3d", "conversion"],
  priority: "high"
},
{
  name: "CSS Winner",
  url: "https://www.csswinner.com/",
  categories: ["award-winning", "web-design", "creative", "visual"],
  priority: "high"
},
{
  name: "CSS Light",
  url: "https://csslight.com/",
  categories: ["award-winning", "web-design", "visual", "creative"],
  priority: "medium"
},
{
  name: "Web Design Ledger",
  url: "https://webdesignledger.com/",
  categories: ["web-design", "ui", "ux", "visual"],
  priority: "medium"
},
{
  name: "Web Design Inspiration",
  url: "https://www.webdesign-inspiration.com/",
  categories: ["web-design", "layout", "visual", "creative"],
  priority: "high"
},
{
  name: "Land-book",
  url: "https://land-book.com/",
  categories: ["landing-pages", "visual", "layout", "marketing"],
  priority: "high"
},
{
  name: "Lapa Ninja",
  url: "https://www.lapa.ninja/",
  categories: ["landing-pages", "marketing", "layout", "conversion"],
  priority: "high"
},
{
  name: "One Page Love",
  url: "https://onepagelove.com/",
  categories: ["landing-pages", "one-page", "layout", "visual"],
  priority: "high"
},
{
  name: "SiteInspire",
  url: "https://www.siteinspire.com/",
  categories: ["web-design", "layout", "visual", "creative"],
  priority: "high"
},
{
  name: "CSS Design Awards",
  url: "https://www.cssdesignawards.com/",
  categories: ["award-winning", "creative", "ux", "innovation"],
  priority: "high"
},
{
  name: "The FWA",
  url: "https://thefwa.com/",
  categories: ["award-winning", "creative", "interaction", "motion"],
  priority: "high"
},
{
  name: "CSS Nectar",
  url: "https://cssnectar.com/",
  categories: ["web-design", "creative", "visual", "layout"],
  priority: "medium"
},
{
  name: "Best Website Gallery",
  url: "https://bestwebsite.gallery/",
  categories: ["web-design", "visual", "creative", "layout"],
  priority: "high"
},
{
  name: "Minimal Gallery",
  url: "https://minimal.gallery/",
  categories: ["minimal", "layout", "typography", "visual"],
  priority: "high"
},
{
  name: "Httpster",
  url: "https://httpster.net/",
  categories: ["web-design", "creative", "visual", "experimental"],
  priority: "high"
},
{
  name: "Webflow Showcase",
  url: "https://webflow.com/made-in-webflow/popular",
  categories: ["web-design", "interaction", "animation", "creative"],
  priority: "high"
},
{
  name: "Framer Templates",
  url: "https://www.framer.com/marketplace/templates/",
  categories: ["templates", "layout", "components", "landing-pages"],
  priority: "high"
},
{
  name: "Awwwards Websites",
  url: "https://www.awwwards.com/websites/",
  categories: ["award-winning", "creative", "ux", "interaction"],
  priority: "high"
},
{
  name: "Awwwards Studio",
  url: "https://www.awwwards.com/websites/studio/",
  categories: ["award-winning", "creative", "agency", "visual"],
  priority: "high"
},
{
  name: "CSS Design Awards Winners",
  url: "https://www.cssdesignawards.com/winners/",
  categories: ["award-winning", "creative", "visual", "interaction"],
  priority: "high"
},
{
  name: "Designspiration",
  url: "https://www.designspiration.com/",
  categories: ["visual", "creative", "branding", "typography"],
  priority: "medium"
},
{
  name: "Muzli Design Inspiration",
  url: "https://muz.li/",
  categories: ["visual", "ui", "ux", "creative"],
  priority: "medium"
},
{
  name: "UIJar",
  url: "https://uijar.com/",
  categories: ["ui", "ux", "patterns", "components"],
  priority: "medium"
},
{
  name: "UI Garage",
  url: "https://uigarage.net/",
  categories: ["ui", "ux", "patterns", "components"],
  priority: "high"
},
{
  name: "Collect UI",
  url: "https://collectui.com/",
  categories: ["ui", "components", "patterns", "visual"],
  priority: "medium"
},
{
  name: "Mobbin Flows",
  url: "https://mobbin.com/",
  categories: ["ui", "ux", "user-flows", "product-design"],
  priority: "high"
},
{
  name: "Page Flows",
  url: "https://pageflows.com/",
  categories: ["ux", "user-flows", "interaction", "product-design"],
  priority: "high"
},
{
  name: "Refero",
  url: "https://refero.design/",
  categories: ["ui", "ux", "product-design", "patterns"],
  priority: "high"
},
{
  name: "SaaSFrame",
  url: "https://www.saasframe.io/",
  categories: ["saas", "product-design", "ux", "ui"],
  priority: "high"
},
{
  name: "Godly",
  url: "https://godly.design/",
  categories: ["creative", "experimental", "interaction", "motion"],
  priority: "high"
},
{
  name: "Minimalissimo",
  url: "https://minimalissimo.com/",
  categories: ["minimal", "visual", "typography", "branding"],
  priority: "medium"
},
{
  name: "Typewolf",
  url: "https://www.typewolf.com/",
  categories: ["typography", "visual-identity", "font-pairing", "branding"],
  priority: "high"
},
{
  name: "Fonts In Use",
  url: "https://fontsinuse.com/",
  categories: ["typography", "branding", "visual-identity"],
  priority: "high"
},
{
  name: "Google Fonts",
  url: "https://fonts.google.com/",
  categories: ["typography", "fonts", "type-systems"],
  priority: "high"
},
{
  name: "Fontshare",
  url: "https://www.fontshare.com/",
  categories: ["typography", "fonts", "visual-identity"],
  priority: "medium"
},
{
  name: "Adobe Fonts",
  url: "https://fonts.adobe.com/",
  categories: ["typography", "fonts", "branding"],
  priority: "medium"
},
{
  name: "Coolors",
  url: "https://coolors.co/",
  categories: ["color", "branding", "visual-identity", "palettes"],
  priority: "high"
},
{
  name: "Color Hunt",
  url: "https://colorhunt.co/",
  categories: ["color", "branding", "palettes", "visual"],
  priority: "medium"
},
{
  name: "Realtime Colors",
  url: "https://www.realtimecolors.com/",
  categories: ["color", "design-systems", "visual-identity"],
  priority: "medium"
},
{
  name: "Happy Hues",
  url: "https://www.happyhues.co/",
  categories: ["color", "ui", "visual-identity", "palettes"],
  priority: "medium"
},
{
  name: "Adobe Color",
  url: "https://color.adobe.com/",
  categories: ["color", "branding", "palettes", "visual-identity"],
  priority: "high"
},

{
  name: "Fantasy",
  url: "https://fantasy.co/",
  categories: ["creative", "agency", "ux", "art-direction"],
  priority: "high"
},
{
  name: "Instrument",
  url: "https://www.instrument.com/",
  categories: ["creative", "agency", "branding", "art-direction"],
  priority: "high"
},
{
  name: "Locomotive",
  url: "https://locomotive.ca/",
  categories: ["creative", "agency", "interaction", "motion"],
  priority: "high"
},
{
  name: "Resn",
  url: "https://resn.co.nz/",
  categories: ["creative", "agency", "3d", "webgl"],
  priority: "high"
},
{
  name: "Active Theory",
  url: "https://activetheory.net/",
  categories: ["creative", "agency", "3d", "webgl", "interaction"],
  priority: "high"
},
{
  name: "Hello Monday",
  url: "https://www.hellomonday.com/",
  categories: ["creative", "agency", "motion", "interaction"],
  priority: "high"
},
{
  name: "Ueno",
  url: "https://ueno.co/",
  categories: ["creative", "agency", "ux", "branding"],
  priority: "high"
},
{
  name: "Basic Agency",
  url: "https://basicagency.com/",
  categories: ["creative", "agency", "branding", "ecommerce"],
  priority: "high"
},
{
  name: "Huge",
  url: "https://www.hugeinc.com/",
  categories: ["creative", "agency", "branding", "digital"],
  priority: "medium"
},
{
  name: "Fantasy Interactive",
  url: "https://www.fantasy.co/",
  categories: ["creative", "agency", "ux", "interaction"],
  priority: "high"
},

{
  name: "Stripe Press",
  url: "https://press.stripe.com/",
  categories: ["editorial", "typography", "branding", "visual"],
  priority: "medium"
},
{
  name: "Linear Design",
  url: "https://linear.app/method",
  categories: ["saas", "product-design", "ui", "interaction"],
  priority: "high"
},
{
  name: "Raycast Store",
  url: "https://www.raycast.com/store",
  categories: ["saas", "product-design", "ui", "components"],
  priority: "medium"
},
{
  name: "Vercel Templates",
  url: "https://vercel.com/templates",
  categories: ["saas", "templates", "components", "web-design"],
  priority: "high"
},
{
  name: "Webflow University",
  url: "https://university.webflow.com/",
  categories: ["web-design", "interaction", "animation", "components"],
  priority: "medium"
},

{
  name: "Codrops Tutorials",
  url: "https://tympanus.net/codrops/category/tutorials/",
  categories: ["motion", "interaction", "webgl", "3d"],
  priority: "high"
},
{
  name: "Codrops Playground",
  url: "https://tympanus.net/codrops/category/playground/",
  categories: ["3d", "webgl", "motion", "experimental"],
  priority: "high"
},
{
  name: "Three.js Journey",
  url: "https://threejs-journey.com/",
  categories: ["3d", "webgl", "threejs", "creative"],
  priority: "high"
},
{
  name: "14islands",
  url: "https://14islands.com/",
  categories: ["3d", "webgl", "creative", "interaction"],
  priority: "high"
},
{
  name: "Active Theory Experiments",
  url: "https://activetheory.net/lab",
  categories: ["3d", "webgl", "experimental", "interaction"],
  priority: "high"
},
{
  name: "Obys Agency",
  url: "https://obys.agency/",
  categories: ["creative", "art-direction", "motion", "interaction"],
  priority: "high"
},
{
  name: "Locomotive Experiments",
  url: "https://locomotive.ca/lab",
  categories: ["creative", "motion", "interaction", "experimental"],
  priority: "high"
},
{
  name: "Studio Freight",
  url: "https://www.studiofreight.com/",
  categories: ["creative", "motion", "interaction", "art-direction"],
  priority: "high"
},
{
  name: "Bureau Borsche",
  url: "https://bureau-borsche.com/",
  categories: ["creative", "branding", "art-direction", "typography"],
  priority: "medium"
},
{
  name: "Buck",
  url: "https://buck.co/",
  categories: ["creative", "animation", "motion", "art-direction"],
  priority: "high"
},
{
  name: "ManvsMachine",
  url: "https://manvsmachine.co.uk/",
  categories: ["creative", "3d", "animation", "art-direction"],
  priority: "high"
},
{
  name: "FutureDeluxe",
  url: "https://futuredeluxe.com/",
  categories: ["creative", "3d", "motion", "art-direction"],
  priority: "high"
},
{
  name: "Field",
  url: "https://www.field.io/",
  categories: ["creative", "3d", "generative", "interaction"],
  priority: "high"
},
{
  name: "Onesize",
  url: "https://onesize.nl/",
  categories: ["creative", "3d", "motion", "art-direction"],
  priority: "high"
},
{
  name: "Unit9",
  url: "https://unit9.com/",
  categories: ["creative", "interactive", "3d", "experiential"],
  priority: "high"
},
{
  name: "Resn Labs",
  url: "https://resn.co.nz/labs",
  categories: ["creative", "3d", "webgl", "experimental"],
  priority: "high"
},
{
  name: "Jam3",
  url: "https://www.jam3.com/",
  categories: ["creative", "webgl", "3d", "interaction"],
  priority: "high"
},
{
  name: "Active Theory Projects",
  url: "https://activetheory.net/work",
  categories: ["creative", "3d", "webgl", "interaction"],
  priority: "high"
},
{
  name: "Immersive Garden",
  url: "https://immersive-g.com/",
  categories: ["creative", "3d", "webgl", "motion"],
  priority: "high"
},
{
  name: "Obys Projects",
  url: "https://obys.agency/projects",
  categories: ["creative", "art-direction", "motion", "typography"],
  priority: "medium"
},
{
  name: "Awwwards Nominees",
  url: "https://www.awwwards.com/websites/nominees/",
  categories: ["award-winning", "creative", "interaction", "visual"],
  priority: "high"
},
{
  name: "Awwwards Winners",
  url: "https://www.awwwards.com/websites/winners/",
  categories: ["award-winning", "creative", "interaction", "visual"],
  priority: "high"
},
{
  name: "FWA Site of the Day",
  url: "https://thefwa.com/",
  categories: ["award-winning", "creative", "interaction", "motion"],
  priority: "high"
},
{
  name: "SiteSee",
  url: "https://sitesee.co/",
  categories: ["web-design", "visual", "creative", "layout"],
  priority: "medium"
},
{
  name: "Webframe",
  url: "https://webframe.xyz/",
  categories: ["web-design", "ui", "ux", "layout"],
  priority: "medium"
}
];

function getSourcesByCategory(category) {
  return sources.filter(source =>
    source.categories.includes(category)
  );
}

function getHighPrioritySources() {
  return sources.filter(source =>
    source.priority === "high"
  );
}

function getSourceByName(name) {
  return sources.find(source =>
    source.name.toLowerCase() === name.toLowerCase()
  );
}
// ============================================================
// BIZLY KNOWLEDGE CLASSIFICATION
// Automatically enriches every source with retrieval metadata.
// ============================================================

const classificationRules = [
  {
    match: ["award-winning"],
    knowledgeType: ["inspiration", "composition", "storytelling"],
    specialties: ["art-direction", "visual-hierarchy"]
  },
  {
    match: ["3d", "webgl"],
    knowledgeType: ["3d", "interaction", "technique"],
    specialties: ["webgl", "threejs", "spatial-ui"]
  },
  {
    match: ["motion", "animation", "interaction"],
    knowledgeType: ["motion", "interaction"],
    specialties: ["scroll-animation", "micro-interactions", "transitions"]
  },
  {
    match: ["saas", "product-design"],
    knowledgeType: ["product", "ux", "conversion"],
    specialties: ["dashboards", "user-flows", "conversion"]
  },
  {
    match: ["ecommerce"],
    knowledgeType: ["commerce", "conversion"],
    specialties: ["product-cards", "product-discovery", "checkout"]
  },
  {
    match: ["ui", "ux", "patterns"],
    knowledgeType: ["ui", "ux"],
    specialties: ["components", "interface-patterns", "user-flows"]
  },
  {
    match: ["design-systems", "components"],
    knowledgeType: ["design-system", "ui"],
    specialties: ["components", "tokens", "accessibility"]
  },
  {
    match: ["typography"],
    knowledgeType: ["typography", "visual-identity"],
    specialties: ["type-systems", "font-pairing"]
  },
  {
    match: ["branding"],
    knowledgeType: ["branding", "visual-identity"],
    specialties: ["brand-direction", "identity"]
  },
  {
    match: ["landing-pages", "marketing"],
    knowledgeType: ["conversion", "landing-page"],
    specialties: ["hero-sections", "cta", "marketing"]
  }
];

for (const source of sources) {
  const categories = source.categories || [];

  source.knowledgeType = [];
  source.specialties = [];

  for (const rule of classificationRules) {
    if (rule.match.some(category => categories.includes(category))) {
      source.knowledgeType.push(...rule.knowledgeType);
      source.specialties.push(...rule.specialties);
    }
  }

  source.knowledgeType = [...new Set(source.knowledgeType)];
  source.specialties = [...new Set(source.specialties)];

  source.tier =
    source.priority === "high" ? "core" :
    source.priority === "medium" ? "supporting" :
    "secondary";
}

module.exports = {
  sources,
  getSourcesByCategory,
  getHighPrioritySources,
  getSourceByName
};