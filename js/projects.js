// All the project content lives here.
// To add a project, copy one object, paste it at the end of PROJECTS and edit it.
// The project page, contents list, stack matrix, tool list and road sign all update.
//
// id            unique name without spaces, used for the #link
// title         big heading, use "\n" for a line break
// sign          short text on the road sign (defaults to title)
// short         small note in the contents list
// sticker       tilted label in the corner
// ghost         big faded word behind the page
// note          small note next to the title
// desc          the paragraph
// highlights    parts of desc to highlight
// scope         list of what was built
// builtWith     tools in the "Built with" line
// extraTools    more tools for the tool list
// link          [label, url]
// specs         [[key, value], ...]
// illustration  "shops", "network", "hanger", "blocks" or your own svg string
// stack         tools per layer: interface, application, data, infrastructure, commerce

const PROJECTS = [
  {
    id: "work",
    title: "Esita\nOma Maitse",
    sign: "EOM",
    short: "Custom commerce",
    sticker: "Two shops",
    ghost: "PHP",
    note: "rebuilt with new backend",
    desc: "A complete reconstruction of a production woocommerce system: storefront, administration, catalogue management, checkout, order handling and blog posts rebuilt without carrying the weight of the original stack, plus implementing custom independent features and optimizations.",
    highlights: ["rebuilt without carrying the weight of the original stack"],
    scope: [
      "Storefront",
      "Administration",
      "Catalogue",
      "Checkout",
      "Order handling",
      "Posts",
    ],
    builtWith: ["PHP", "MySQL", "JavaScript", "REST", "EveryPay"],
    extraTools: ["GA4"],
    link: ["View the reconstruction", "https://esitaomamaitse.ee"],
    specs: [
      ["Architecture", "Custom PHP"],
      ["Storefront", "2 standalone shops"],
      ["Administration", "Custom Panel"],
      ["Database", "Local MySQL containers"],
      ["Statistics", "GA4 + custom"],
    ],
    illustration: "shops",
    stack: {
      interface: "JavaScript, custom storefronts (2 shops)",
      application: "Custom PHP, REST, custom admin panel",
      data: "MySQL",
      infrastructure: "Local MySQL containers",
      commerce: "EveryPay, GA4 + custom statistics",
    },
  },

  {
    id: "artizon",
    title: "Artizon\nNetwork",
    sign: "Artizon",
    short: "Server network",
    sticker: "Custom infrastructure",
    ghost: "JAVA",
    note: "our own api, backend & server software",
    desc: "A modular Minecraft network designed around a clean service boundary: proxy, backend, API and game engines living inside one coordinated system instead of becoming a pile of plugins talking to each other by accident. Orchastrated with Docker and Redis using custom backend software.",
    highlights: [
      "a clean service boundary",
      "instead of becoming a pile of plugins talking to each other by accident",
    ],
    scope: [
      "Proxy",
      "Backend",
      "API",
      "Engines",
      "Isolated servers",
      "Event bus",
    ],
    builtWith: ["Java 25", "Gradle", "Redis", "Docker", "MySQL"],
    extraTools: ["Velocity", "Vercel"],
    link: ["Inspect the Network", "https://artizon.ee"],
    specs: [
      ["Runtime", "Java 25"],
      ["Network", "Custom Velocity Fork"],
      ["Backend Software", "Custom Leaf Fork + API"],
      ["Deployment", "Docker + autoscaling backend"],
      ["Servers", "Vercel + Database VPS + Main gameserver"],
    ],
    illustration: "network",
    stack: {
      interface: "Web hosted on Vercel",
      application: "Java 25, Gradle, Velocity and Leaf forks, API",
      data: "MySQL, Redis",
      infrastructure:
        "Docker, autoscaling backend, Database VPS, main gameserver",
      commerce: "Tebex",
    },
  },

  {
    id: "freshfit",
    title: "FreshFit",
    sign: "FreshFit",
    short: "Resale platform",
    sticker: "private project",
    ghost: "NEXT",
    note: "no unnecessary overhead",
    desc: "A resale platform built around a fast and efficient technical surface: authentication, catalogue, wardrobe, order management and dashboard designed to be reliable, customizable and extensible without any unnecessary overhead.",
    highlights: ["reliable, customizable and extensible"],
    scope: [
      "Authentication",
      "Catalogue",
      "Wardrobe",
      "Order management",
      "Dashboard",
      "Advanced recommendations",
    ],
    builtWith: ["Next.js", "Auth.js", "Prisma", "Neon"],
    extraTools: ["PostgreSQL"],
    link: ["PROJECT IS PRIVATE", "#private-project"],
    specs: [
      ["Framework", "Next.js"],
      ["Authentication", "Auth.js"],
      ["Database", "PostgreSQL"],
      ["ORM", "Prisma"],
      ["Interface", "Custom"],
    ],
    illustration: "hanger",
    stack: {
      interface: "Next.js, custom interface",
      application: "Next.js, Auth.js",
      data: "PostgreSQL, Prisma, Neon",
      infrastructure: "Neon",
      commerce: "Montonio, order management, dashboard",
    },
  },
];

// rows of the stack matrix
const STACK_LAYERS = [
  ["interface", "Interface"],
  ["application", "Application"],
  ["data", "Data"],
  ["infrastructure", "Infrastructure"],
  ["commerce", "Commerce and insight"],
];

// wider toolkit shown under the matrix, edit freely
const MORE_TOOLS = [
  [
    "Languages",
    [
      "Java",
      "PHP",
      "JavaScript",
      "TypeScript",
      "Python",
      "SQL",
      "Go",
      "Rust",
      "Kotlin",
      "C++",
      "Bash",
      "Web (HTML, CSS)",
    ],
  ],
  [
    "Frameworks & Libraries",
    [
      "Next.js",
      "React",
      "Fastify",
      "Tailwind",
      "Prisma",
      "React Native",
      "shadcn-ui",
      "Auth.js",
      "FastAPI",
      "Spring Boot",
      "JUnit",
      "Flask",
    ],
  ],
  [
    "Data & Formats",
    [
      "MySQL",
      "PostgreSQL",
      "Redis",
      "SQLite",
      "Flat-file",
      "Yaml",
      "JSON",
      "XML",
      "CSV",
    ],
  ],
  [
    "Environments & Tools",
    [
      "Linux",
      "Docker",
      "VPS",
      "Vercel",
      "Cloudflare",
      "Git",
      "Obsidian",
      "Gradle",
      "Maven",
      "Node.js",
      "Nginx",
    ],
  ],
];
