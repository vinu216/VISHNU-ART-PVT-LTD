export type NavItem = {
  label: string;
  path: string;
  children?: { label: string; path: string }[];
};

export type Product = {
  id: string;
  name: string;
  category: string;
  image: string;
  shortDescription: string;
  features: string[];
  specifications: string[];
  applications: string[];
  packaging: string[];
  faq: { q: string; a: string }[];
};

export const navItems: NavItem[] = [
  { label: "Home", path: "/" },
  { label: "About Us", path: "/about" },
  {
    label: "Products",
    path: "/products",
    children: [
      { label: "Wooden Handicrafts", path: "/products?category=Wooden+Handicrafts" },
      { label: "Wooden Home Decor", path: "/products?category=Wooden+Home+Decor" },
      { label: "Wooden Furniture Components", path: "/products?category=Wooden+Furniture+Components" },
      { label: "Wooden Kitchenware", path: "/products?category=Wooden+Kitchenware" },
      { label: "Wooden Boxes", path: "/products?category=Wooden+Boxes" },
    ],
  },
  { label: "Manufacturing", path: "/infrastructure" },
  { label: "Quality Assurance", path: "/quality" },
  { label: "Gallery", path: "/gallery" },
  { label: "Certifications", path: "/certifications" },
  { label: "Custom Orders / OEM", path: "/custom-oem" },
  { label: "Order Now", path: "/order-now" },
  { label: "Blog / News", path: "/blog" },
  { label: "Contact Us", path: "/contact" },
  { label: "Request Quote", path: "/quote" },
];

export const stats = [
  { label: "Years of Craft Heritage", value: 24 },
  { label: "Global Buyers Served", value: 320 },
  { label: "Wooden Product SKUs", value: 850 },
  { label: "Export Countries", value: 34 },
];

export const products: Product[] = [
  {
    id: "teak-carved-panel",
    name: "Teak Carved Wall Panel",
    category: "Wooden Handicrafts",
    image:
      "https://images.unsplash.com/photo-1604014238170-4def1e4e6fcf?auto=format&fit=crop&w=1200&q=80",
    shortDescription:
      "Intricately hand-carved teak panel for boutique interiors, hotels, and export decor collections.",
    features: ["Deep relief carving", "Kiln-dried hardwood base", "Custom motifs and dimensions"],
    specifications: ["Wood: Teak", "Size: 90 x 45 cm", "Finish: Natural oil matte"],
    applications: ["Feature walls", "Boutique resorts", "Designer decor programs"],
    packaging: ["Bubble-wrap and edge guards", "5-ply master carton", "Humidity-safe export wrap"],
    faq: [
      { q: "Can carving patterns be customized?", a: "Yes, we develop custom motifs from sketches or CAD references." },
      { q: "What is your MOQ?", a: "Standard MOQ starts at 120 pieces per design." },
    ],
  },
  {
    id: "walnut-console-top",
    name: "Walnut Console Table Top",
    category: "Wooden Furniture Components",
    image:
      "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1200&q=80",
    shortDescription: "Precision-machined walnut top engineered for premium furniture brands and OEM assembly lines.",
    features: ["CNC profiled edges", "Moisture-controlled wood", "Stable joinery readiness"],
    specifications: ["Wood: American walnut", "Thickness: 30 mm", "Moisture content: 8-10%"],
    applications: ["Console tables", "Modular furniture", "Premium retail fixtures"],
    packaging: ["Surface film protection", "Corner-protected stack", "ISPM-compliant pallets"],
    faq: [
      { q: "Do you match exact stain tones?", a: "Yes, stain matching is done through approved shade samples." },
      { q: "Can this be supplied pre-drilled?", a: "Pre-drilled and hardware-ready options are available." },
    ],
  },
  {
    id: "artisan-candle-holder",
    name: "Artisan Wooden Candle Holder Set",
    category: "Wooden Home Decor",
    image:
      "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1200&q=80",
    shortDescription: "Turned and hand-finished decor set crafted for high-end lifestyle stores and gifting assortments.",
    features: ["Hand-turned profiles", "Heat-resistant metal cup insert", "Rich walnut and oak finish options"],
    specifications: ["Set: 3 sizes", "Wood: Mango and Sheesham", "Finish: Low-VOC lacquer"],
    applications: ["Home decor retail", "Hospitality styling", "Festive gifting lines"],
    packaging: ["Individual sleeve packs", "Master carton with dividers", "Retail-ready labeling"],
    faq: [
      { q: "Can we mix wood finishes in one set?", a: "Yes, mixed finish assortments are available for container orders." },
      { q: "Is private branding available?", a: "Custom laser logo and brand sleeves are supported." },
    ],
  },
  {
    id: "acacia-kitchen-range",
    name: "Acacia Kitchen Utility Range",
    category: "Wooden Kitchenware",
    image:
      "https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=1200&q=80",
    shortDescription: "Export-grade boards, trays, and kitchen essentials manufactured for global utility and gifting markets.",
    features: ["Food-safe treatment", "Warp-resistant seasoning", "OEM assortment development"],
    specifications: ["Wood: Acacia", "Compliance: LFGB/FDA-ready options", "Moisture: below 12%"],
    applications: ["Kitchenware importers", "Modern trade chains", "E-commerce utility collections"],
    packaging: ["Shrink and barcode", "Gift sleeve option", "Container optimized cartons"],
    faq: [
      { q: "Do you support compliance testing?", a: "Yes, third-party lab testing and declarations are supported." },
      { q: "Can we create market-specific bundles?", a: "Yes, we build bundle packs by country and retail channel." },
    ],
  },
  {
    id: "oem-bedroom-legs",
    name: "Custom OEM Furniture Legs",
    category: "Wooden Furniture Components",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
    shortDescription: "Dimensionally accurate wooden legs for beds, sofas, and storage units with custom profiles.",
    features: ["High repeatability", "CNC and lathe production", "Thread inserts and hardware fitting"],
    specifications: ["Length: 80-220 mm", "Wood options: Beech, Rubberwood, Oak", "Load tested batches"],
    applications: ["Furniture OEM", "Contract manufacturing", "Knock-down furniture kits"],
    packaging: ["Compartment cartons", "Batch coding", "Palletized export packs"],
    faq: [
      { q: "Can we develop a unique profile?", a: "Yes, samples and tooling are developed from your drawings." },
      { q: "What about finish durability?", a: "Abrasion and adhesion tests are run for each finish lot." },
    ],
  },
  {
    id: "heritage-jali-screen",
    name: "Heritage Jali Room Divider",
    category: "Wooden Handicrafts",
    image: "https://images.unsplash.com/photo-1617104678098-de229db51175?auto=format&fit=crop&w=1200&q=80",
    shortDescription: "Decorative partition inspired by traditional Indian patterns and built for contemporary spaces.",
    features: ["Hand-carved lattice", "Foldable panel option", "Project-size customization"],
    specifications: ["Panels: 3 or 4", "Wood: Mango/Teak", "Finish: Distressed antique or clear matte"],
    applications: ["Hospitality interiors", "Residential decor", "Export decor programs"],
    packaging: ["Protective wrap", "Edge foam", "Crate option for LCL shipping"],
    faq: [
      { q: "Can this be fire-retardant treated?", a: "Optional fire-retardant coating is available for project supplies." },
      { q: "Can we ship flat-packed?", a: "Yes, knock-down configurations are offered for efficient freight." },
    ],
  },
  {
    id: "gift-box-duo",
    name: "Premium Wooden Gift Box Duo",
    category: "Wooden Gift Items",
    image: "https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=1200&q=80",
    shortDescription: "Hand-finished keepsake gift boxes with magnetic closure and export-ready presentation.",
    features: ["Velvet inner lining", "Laser logo customization", "Gift-grade finish options"],
    specifications: ["Sizes: S and M", "Wood: Mango/Teak veneer", "Closure: Hidden magnetic"],
    applications: ["Festive gifting", "Luxury retail packaging", "Corporate gift programs"],
    packaging: ["Individual sleeve", "Master carton with separators", "Moisture barrier wrapping"],
    faq: [
      { q: "Can we add embossed branding?", a: "Yes, we support laser engraving and foil branding options." },
      { q: "Is gift insert customization possible?", a: "Custom inserts are available based on your product dimensions." },
    ],
  },
  {
    id: "temple-artisan-mandir",
    name: "Carved Wooden Mandir Unit",
    category: "Wooden Religious Items",
    image: "https://images.unsplash.com/photo-1601979031925-424e53b6caaa?auto=format&fit=crop&w=1200&q=80",
    shortDescription: "Fine carved wooden temple unit developed for heritage decor and spiritual retail programs.",
    features: ["Traditional carved facade", "Compact export-friendly structure", "Custom polish shades"],
    specifications: ["Wood: Teak/Sheesham", "Size: Customizable", "Finish: PU matte or antique"],
    applications: ["Home worship units", "Spiritual stores", "Heritage decor exports"],
    packaging: ["Foam and edge corner protection", "5-ply corrugation", "Crate option for bulk"],
    faq: [
      { q: "Can this be flat-packed?", a: "Yes, knock-down variants are available for selected models." },
      { q: "Do you support private design references?", a: "Yes, we build custom mandir profiles for private labels." },
    ],
  },
  {
    id: "custom-display-riser",
    name: "Custom Wooden Display Riser",
    category: "Custom Wooden Products",
    image: "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=1200&q=80",
    shortDescription: "Bespoke display risers for retail and hospitality merchandising, engineered to client specs.",
    features: ["Exact dimension production", "Brand-focused finishing", "High-repeat OEM compatibility"],
    specifications: ["Material: Beech/Oak/MDF veneer", "Finish: Paint or stain", "MOQ: Project dependent"],
    applications: ["Retail merchandising", "Product photography", "Trade show displays"],
    packaging: ["Flat stack design", "Transit-safe wraps", "Barcode-ready cartons"],
    faq: [
      { q: "Can we combine finishes in one order?", a: "Yes, we support assortment-based production plans." },
      { q: "Do you create sampling before mass production?", a: "Every custom project is approved through controlled sampling." },
    ],
  },
  {
    id: "teak-storage-box-set",
    name: "Teak Storage Box Set",
    category: "Wooden Boxes",
    image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1200&q=80",
    shortDescription: "Premium teak storage boxes for gifting, retail organization, and export decor assortments.",
    features: ["Nested size assortment", "Smooth hinge action", "Custom inner partitions"],
    specifications: ["Set: 3 pieces", "Wood: Seasoned teak", "Finish: Natural matte"],
    applications: ["Luxury gifting", "Retail storage", "Decor merchandising"],
    packaging: ["Foam corner protection", "Barcoded sleeves", "Pallet-ready master cartons"],
    faq: [
      { q: "Can dimensions be customized?", a: "Yes, we produce custom box programs for OEM orders." },
      { q: "Is this available with lock fittings?", a: "Lock and latch accessories can be included on request." },
    ],
  },
];

export const testimonials = [
  {
    name: "Elena Strauss",
    company: "Nordhaus Living, Germany",
    quote:
      "VISHNU ART PVT. LTD. consistently delivers outstanding wood finish quality and excellent batch consistency. They are a trusted long-term partner for our premium lines.",
  },
  {
    name: "Michael Turner",
    company: "Oak & Hearth Imports, USA",
    quote:
      "Their OEM process is structured and transparent. Sampling, compliance, packaging, and delivery were managed with precision from start to finish.",
  },
  {
    name: "Aisha Rahman",
    company: "Bloomline Interiors, UAE",
    quote:
      "The handcrafted detailing and premium wood textures elevated our hospitality projects. Export packaging quality is among the best we have seen.",
  },
];

export const certifications = [
  {
    title: "ISO 9001:2015",
    issuer: "Quality Management System",
    image:
      "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "FSC Chain of Custody",
    issuer: "Responsible Wood Sourcing",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "SEDEX Verified",
    issuer: "Ethical Trade Compliance",
    image:
      "https://images.unsplash.com/photo-1560520031-3a4dc4e9de0c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "BSCI Audited",
    issuer: "Social Responsibility",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
  },
];

export const galleryItems = [
  {
    title: "Wood Turning and Profiling Unit",
    category: "Manufacturing",
    image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Hand Sanding and Surface Finishing",
    category: "Manufacturing",
    image: "https://images.unsplash.com/photo-1556911220-bda9f7f7597e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Export Packaging and Labeling",
    category: "Infrastructure",
    image: "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Premium Decor Product Display",
    category: "Products",
    image: "https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Dimensional and Finish Quality Inspection",
    category: "Quality",
    image: "https://images.unsplash.com/photo-1581092335397-9583eb92d232?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Container Loading for International Dispatch",
    category: "Exports",
    image: "https://images.unsplash.com/photo-1592833159155-c62df1b65634?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Custom OEM Prototyping",
    category: "Custom Orders",
    image: "https://images.unsplash.com/photo-1581092921461-39b9d08a9b2b?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Handcrafted Jali Detailing",
    category: "Products",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80",
  },
];

export const blogs = [
  {
    slug: "how-to-source-premium-wooden-products-globally",
    title: "How to Source Premium Wooden Products for International Retail Programs",
    excerpt: "A practical sourcing framework for brands seeking craftsmanship, quality controls, and export reliability.",
    category: "Industry Insights",
    date: "Mar 03, 2026",
    image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1200&q=80",
    content:
      "Premium sourcing starts with wood integrity, seasoning control, process transparency, and packaging discipline. Buyers should evaluate partner capabilities across prototyping, production consistency, compliance support, and documentation quality. At VISHNU ART PVT. LTD., these pillars are managed within one accountable export workflow.",
  },
  {
    slug: "wood-moisture-control-in-export-manufacturing",
    title: "Why Moisture Control Is Critical for Export Wooden Products",
    excerpt: "How proper kiln drying and storage protocols protect finish quality and dimensional stability.",
    category: "Quality",
    date: "Feb 19, 2026",
    image: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1200&q=80",
    content:
      "Uncontrolled moisture leads to warping, cracks, and finishing defects in transit. Reliable export programs depend on kiln-drying, calibrated moisture checks, controlled storage, and strict pre-dispatch inspection. Our production teams track moisture range at each key manufacturing stage to maintain consistency.",
  },
  {
    slug: "oem-wood-manufacturing-for-private-label-brands",
    title: "OEM Wood Manufacturing: Scaling Private Label Without Quality Compromise",
    excerpt: "A look at how design controls, sampling discipline, and staged approvals improve OEM outcomes.",
    category: "Packaging",
    date: "Jan 27, 2026",
    image: "https://images.unsplash.com/photo-1556742393-d75f468bfcb0?auto=format&fit=crop&w=1200&q=80",
    content:
      "Successful OEM partnerships rely on precise technical packs, controlled prototyping, and approved golden samples. With strong cross-functional planning, brands can scale volume while preserving handcrafted identity and finish integrity. Our OEM cell is built for this exact balance.",
  },
  {
    slug: "wooden-decor-trends-for-hospitality-interiors",
    title: "Wooden Decor Trends Shaping Premium Hospitality Interiors",
    excerpt: "What global hospitality buyers are selecting for warm, authentic, and durable interior stories.",
    category: "Trends",
    date: "Jan 08, 2026",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
    content:
      "Hospitality design is moving toward tactile materials, handcrafted detailing, and naturally warm palettes. Wooden textures, layered finishes, and artisanal accents are now central to premium ambiance. Our design team develops collections tuned to these evolving global preferences.",
  },
];

export const faqs = [
  {
    q: "What types of wooden products do you manufacture?",
    a: "We manufacture wooden handicrafts, decor items, furniture components, kitchen utility products, and OEM custom wooden ranges.",
  },
  {
    q: "Do you offer export documentation and logistics support?",
    a: "Yes, we support FOB/CIF documentation, labeling standards, pallet planning, and coordinated international dispatch.",
  },
  {
    q: "Can we place custom OEM orders with our own branding?",
    a: "Absolutely. We provide design collaboration, prototyping, brand packaging, and confidential OEM manufacturing workflows.",
  },
];

export const oemServices = [
  {
    title: "Concept to Prototype",
    description: "Translate design references into production-ready prototypes with finish and dimension validation.",
  },
  {
    title: "Private Label Production",
    description: "Dedicated lines for branded collections with barcode, inserts, and market-specific labeling.",
  },
  {
    title: "Material and Finish Engineering",
    description: "Wood selection, stain matching, and protective coating development for durability and appearance.",
  },
  {
    title: "Export Program Management",
    description: "Batch planning, compliance documentation, and shipping coordination for predictable lead times.",
  },
];

export const processSteps = [
  "Timber Sourcing and Seasoning",
  "Precision Cutting and Profiling",
  "Handcrafting and Joinery",
  "Sanding and Surface Preparation",
  "Color, Coating, and Finishing",
  "Quality Inspection and Packaging",
];

export const qualityPillars = [
  "Incoming wood moisture and grain inspection",
  "In-process dimensional and joinery checks",
  "Surface and coating adhesion verification",
  "Drop-test and transit durability simulation",
  "Lot-level traceability with inspection logs",
];