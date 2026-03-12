const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "Bharath S.";
pres.title = "DataLineageFlow - Power BI Custom Visual";

// ── Color palette ──
const C = {
  bg:      "0E0C22",
  bgLight: "1A1535",
  bgCard:  "1E1940",
  accent:  "8B5CF6",  // purple
  accent2: "3B82F6",  // blue
  green:   "22C55E",
  yellow:  "EAB308",
  red:     "EF4444",
  orange:  "F97316",
  pink:    "EC4899",
  cyan:    "06B6D4",
  white:   "FFFFFF",
  textH:   "E8E0F0",
  textB:   "B4AAC8",
  textM:   "8A80A0",
  dim:     "504870",
};

const makeShadow = () => ({ type: "outer", blur: 10, offset: 3, angle: 135, color: "000000", opacity: 0.4 });

// ════════════════════════════════════════════════════════════════
// SLIDE 1: Title
// ════════════════════════════════════════════════════════════════
let s1 = pres.addSlide();
s1.background = { color: C.bg };
// Decorative gradient circles
s1.addShape(pres.shapes.OVAL, { x: -1.5, y: -1, w: 5, h: 5, fill: { color: C.accent, transparency: 92 } });
s1.addShape(pres.shapes.OVAL, { x: 6, y: 2.5, w: 6, h: 6, fill: { color: C.accent2, transparency: 93 } });
s1.addShape(pres.shapes.OVAL, { x: 8, y: -2, w: 4, h: 4, fill: { color: C.pink, transparency: 94 } });
// Title
s1.addText("Data Lineage Flow", {
  x: 0.8, y: 1.2, w: 8.4, h: 1.2,
  fontSize: 44, fontFace: "Calibri", bold: true, color: C.white,
  charSpacing: 2, margin: 0
});
// Subtitle
s1.addText("Power BI Custom Visual", {
  x: 0.8, y: 2.3, w: 8.4, h: 0.6,
  fontSize: 20, fontFace: "Calibri", color: C.accent, charSpacing: 4, margin: 0
});
// Description
s1.addText("Visualize data pipelines with interactive lineage tracing,\nhealth monitoring, and real-time metadata insights.", {
  x: 0.8, y: 3.2, w: 6, h: 0.9,
  fontSize: 13, fontFace: "Calibri", color: C.textB, lineSpacingMultiple: 1.5, margin: 0
});
// Version badge
s1.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x: 0.8, y: 4.4, w: 1.1, h: 0.32, fill: { color: C.accent, transparency: 80 },
  rectRadius: 0.05, line: { color: C.accent, width: 0.5, transparency: 50 }
});
s1.addText("v6.1", {
  x: 0.8, y: 4.4, w: 1.1, h: 0.32,
  fontSize: 11, fontFace: "Calibri", bold: true, color: C.accent, align: "center", valign: "middle", margin: 0
});
// Author
s1.addText("Bharath S.", {
  x: 0.8, y: 4.95, w: 4, h: 0.3,
  fontSize: 11, fontFace: "Calibri", color: C.textM, margin: 0
});

// ════════════════════════════════════════════════════════════════
// SLIDE 2: What is DataLineageFlow?
// ════════════════════════════════════════════════════════════════
let s2 = pres.addSlide();
s2.background = { color: C.bgLight };
s2.addText("What is DataLineageFlow?", {
  x: 0.8, y: 0.4, w: 8.4, h: 0.7,
  fontSize: 30, fontFace: "Calibri", bold: true, color: C.white, margin: 0
});
// Accent bar
s2.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.05, w: 1.2, h: 0.04, fill: { color: C.accent } });

s2.addText("A Power BI custom visual that maps how data flows from sources through transformations to final reports — showing every connection, health status, and refresh state at a glance.", {
  x: 0.8, y: 1.3, w: 8.4, h: 0.8,
  fontSize: 13, fontFace: "Calibri", color: C.textB, lineSpacingMultiple: 1.5, margin: 0
});

// Feature cards - row 1
const cards = [
  { icon: "🔗", title: "Lineage Tracing", desc: "Click any node to trace its full upstream & downstream path", color: C.accent },
  { icon: "💚", title: "Health Monitoring", desc: "Green, yellow, red indicators on every node and in headers", color: C.green },
  { icon: "📊", title: "Cross-Filtering", desc: "Click to filter other Power BI visuals on the same page", color: C.accent2 },
];
const cards2 = [
  { icon: "🎨", title: "Fully Customizable", desc: "Colors, fonts, line styles, subtitles — all configurable", color: C.orange },
  { icon: "🔒", title: "Storage Labels", desc: "Show storage info directly on nodes as compact badges", color: C.cyan },
  { icon: "🕐", title: "Refresh Tracking", desc: "Display last refreshed timestamps in tooltips", color: C.pink },
];

function addCardRow(slide, cards, y) {
  cards.forEach((c, i) => {
    let x = 0.8 + i * 3.05;
    slide.addShape(pres.shapes.RECTANGLE, {
      x: x, y: y, w: 2.8, h: 1.55,
      fill: { color: C.bgCard }, line: { color: c.color, width: 0.5, transparency: 70 },
      shadow: makeShadow()
    });
    // Top accent
    slide.addShape(pres.shapes.RECTANGLE, { x: x, y: y, w: 2.8, h: 0.04, fill: { color: c.color } });
    slide.addText(c.icon, { x: x + 0.15, y: y + 0.18, w: 0.5, h: 0.4, fontSize: 20, margin: 0 });
    slide.addText(c.title, {
      x: x + 0.15, y: y + 0.6, w: 2.5, h: 0.3,
      fontSize: 13, fontFace: "Calibri", bold: true, color: C.white, margin: 0
    });
    slide.addText(c.desc, {
      x: x + 0.15, y: y + 0.9, w: 2.5, h: 0.5,
      fontSize: 10, fontFace: "Calibri", color: C.textM, lineSpacingMultiple: 1.4, margin: 0
    });
  });
}
addCardRow(s2, cards, 2.3);
addCardRow(s2, cards2, 4.0);

// ════════════════════════════════════════════════════════════════
// SLIDE 3: How Data Maps to Layers
// ════════════════════════════════════════════════════════════════
let s3 = pres.addSlide();
s3.background = { color: C.bg };
s3.addText("How Data Maps to Layers", {
  x: 0.8, y: 0.4, w: 8.4, h: 0.7,
  fontSize: 30, fontFace: "Calibri", bold: true, color: C.white, margin: 0
});
s3.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.05, w: 1.2, h: 0.04, fill: { color: C.accent } });

s3.addText("Each column in your dataset becomes a layer. Rows define the connections between nodes.", {
  x: 0.8, y: 1.3, w: 8.4, h: 0.5,
  fontSize: 12, fontFace: "Calibri", color: C.textB, margin: 0
});

// Table showing data structure
let tableRows = [
  [
    { text: "Source", options: { fill: { color: "2D2060" }, color: C.accent, bold: true, fontSize: 10, fontFace: "Calibri" } },
    { text: "Bronze", options: { fill: { color: "2D2060" }, color: C.accent2, bold: true, fontSize: 10, fontFace: "Calibri" } },
    { text: "Silver", options: { fill: { color: "2D2060" }, color: C.green, bold: true, fontSize: 10, fontFace: "Calibri" } },
    { text: "Gold", options: { fill: { color: "2D2060" }, color: C.orange, bold: true, fontSize: 10, fontFace: "Calibri" } },
  ],
  ...[
    ["SQL Server", "raw_orders", "clean_orders", "fact_sales"],
    ["API Feed", "raw_products", "clean_products", "dim_products"],
    ["CSV Files", "raw_customers", "clean_customers", "dim_customers"],
  ].map(row => row.map(cell => ({
    text: cell,
    options: { fill: { color: C.bgCard }, color: C.textB, fontSize: 10, fontFace: "Calibri" }
  })))
];
s3.addTable(tableRows, {
  x: 0.8, y: 2.0, w: 5.5, colW: [1.35, 1.4, 1.4, 1.35],
  border: { pt: 0.5, color: C.dim },
  rowH: [0.35, 0.32, 0.32, 0.32],
});

// Flow diagram on right
const layers = [
  { label: "Source", color: C.accent, nodes: ["SQL Server", "API Feed", "CSV Files"] },
  { label: "Bronze", color: C.accent2, nodes: ["raw_orders", "raw_products", "raw_customers"] },
  { label: "Silver", color: C.green, nodes: ["clean_orders", "clean_products", "clean_customers"] },
  { label: "Gold", color: C.orange, nodes: ["fact_sales", "dim_products", "dim_customers"] },
];
layers.forEach((l, i) => {
  let x = 6.8 + i * 0.82;
  // Header
  s3.addShape(pres.shapes.OVAL, { x: x + 0.08, y: 2.05, w: 0.1, h: 0.1, fill: { color: l.color } });
  s3.addText(l.label, {
    x: x - 0.1, y: 2.18, w: 0.85, h: 0.25,
    fontSize: 7, fontFace: "Calibri", bold: true, color: l.color, align: "center", margin: 0
  });
  // Nodes
  l.nodes.forEach((n, j) => {
    s3.addShape(pres.shapes.RECTANGLE, {
      x: x - 0.05, y: 2.55 + j * 0.45, w: 0.75, h: 0.35,
      fill: { color: l.color, transparency: 88 }, line: { color: l.color, width: 0.5, transparency: 65 }
    });
    s3.addText(n, {
      x: x - 0.05, y: 2.55 + j * 0.45, w: 0.75, h: 0.35,
      fontSize: 5.5, fontFace: "Calibri", color: C.textH, align: "center", valign: "middle", margin: 0
    });
  });
});

// Key points
s3.addText([
  { text: "Drag columns into the Layers field well in order", options: { bullet: true, breakLine: true, fontSize: 11, color: C.textB } },
  { text: "Each unique value becomes a node in its layer", options: { bullet: true, breakLine: true, fontSize: 11, color: C.textB } },
  { text: "Rows define parent-child connections automatically", options: { bullet: true, breakLine: true, fontSize: 11, color: C.textB } },
  { text: "Duplicate values are grouped — connections merge", options: { bullet: true, fontSize: 11, color: C.textB } },
], { x: 0.8, y: 3.7, w: 5.5, h: 1.5, fontFace: "Calibri", paraSpaceAfter: 6, margin: 0 });

// ════════════════════════════════════════════════════════════════
// SLIDE 4: Metadata Columns
// ════════════════════════════════════════════════════════════════
let s4 = pres.addSlide();
s4.background = { color: C.bgLight };
s4.addText("Metadata Columns", {
  x: 0.8, y: 0.4, w: 8.4, h: 0.7,
  fontSize: 30, fontFace: "Calibri", bold: true, color: C.white, margin: 0
});
s4.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.05, w: 1.2, h: 0.04, fill: { color: C.accent } });

s4.addText("Add rich metadata to any layer by creating columns with special suffixes.", {
  x: 0.8, y: 1.25, w: 8.4, h: 0.4,
  fontSize: 12, fontFace: "Calibri", color: C.textB, margin: 0
});

// Three metadata cards
const metaCols = [
  {
    suffix: "__health", title: "Health Status",
    desc: "Adds a colored dot indicator to each node.\nRecognized values:",
    values: "green · healthy · ok\nyellow · warning · amber\nred · critical · error · stale",
    color: C.green, icon: "💚"
  },
  {
    suffix: "__refreshed", title: "Refreshed Date",
    desc: "Shows last refresh timestamp in the tooltip on hover.",
    values: "Any date or timestamp value\ne.g. \"2026-03-10 14:30\"",
    color: C.accent2, icon: "🕐"
  },
  {
    suffix: "__storage", title: "Storage Info",
    desc: "Displays a compact badge at bottom-left of each node.",
    values: "Any text value\ne.g. \"Azure SQL\" or \"2.4 GB\"",
    color: C.cyan, icon: "💾"
  },
];

metaCols.forEach((m, i) => {
  let x = 0.8 + i * 3.05;
  // Card
  s4.addShape(pres.shapes.RECTANGLE, {
    x: x, y: 1.85, w: 2.8, h: 3.2,
    fill: { color: C.bgCard }, line: { color: m.color, width: 0.5, transparency: 65 },
    shadow: makeShadow()
  });
  s4.addShape(pres.shapes.RECTANGLE, { x: x, y: 1.85, w: 2.8, h: 0.04, fill: { color: m.color } });
  s4.addText(m.icon + "  " + m.title, {
    x: x + 0.15, y: 2.05, w: 2.5, h: 0.35,
    fontSize: 14, fontFace: "Calibri", bold: true, color: C.white, margin: 0
  });
  // Suffix badge
  s4.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: x + 0.15, y: 2.5, w: 1.6, h: 0.28,
    fill: { color: m.color, transparency: 82 }, rectRadius: 0.04,
    line: { color: m.color, width: 0.5, transparency: 50 }
  });
  s4.addText(m.suffix, {
    x: x + 0.15, y: 2.5, w: 1.6, h: 0.28,
    fontSize: 10, fontFace: "Consolas", bold: true, color: m.color, align: "center", valign: "middle", margin: 0
  });
  // Description
  s4.addText(m.desc, {
    x: x + 0.15, y: 2.95, w: 2.5, h: 0.7,
    fontSize: 10, fontFace: "Calibri", color: C.textB, lineSpacingMultiple: 1.4, margin: 0
  });
  // Values
  s4.addText(m.values, {
    x: x + 0.15, y: 3.65, w: 2.5, h: 1.0,
    fontSize: 9, fontFace: "Consolas", color: C.textM, lineSpacingMultiple: 1.5, margin: 0
  });
});

// Example
s4.addText("Example:  If your layer column is \"Bronze\", create columns named  Bronze__health  Bronze__refreshed  Bronze__storage", {
  x: 0.8, y: 5.15, w: 8.4, h: 0.35,
  fontSize: 10, fontFace: "Calibri", italic: true, color: C.dim, margin: 0
});

// ════════════════════════════════════════════════════════════════
// SLIDE 5: Health Indicators
// ════════════════════════════════════════════════════════════════
let s5 = pres.addSlide();
s5.background = { color: C.bg };
s5.addText("Health Indicators", {
  x: 0.8, y: 0.4, w: 8.4, h: 0.7,
  fontSize: 30, fontFace: "Calibri", bold: true, color: C.white, margin: 0
});
s5.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.05, w: 1.2, h: 0.04, fill: { color: C.green } });

s5.addText("Monitor pipeline health at a glance — from individual nodes to layer-level summaries.", {
  x: 0.8, y: 1.25, w: 8.4, h: 0.4,
  fontSize: 12, fontFace: "Calibri", color: C.textB, margin: 0
});

// Where health appears
const healthFeats = [
  { title: "Node Dot", desc: "Each node shows a colored health dot directly on the element", y: 1.9 },
  { title: "Tooltip Detail", desc: "Hover to see health status with a colored indicator in the tooltip", y: 2.55 },
  { title: "Header Summary", desc: "Layer subtitles show aggregated counts: ●2 ●1 ●1", y: 3.2 },
  { title: "Trace Mode", desc: "During lineage trace, health counts update to show only traced nodes", y: 3.85 },
];
healthFeats.forEach((f, i) => {
  let dotColors = [C.green, C.accent2, C.accent, C.orange];
  s5.addShape(pres.shapes.OVAL, {
    x: 1.0, y: f.y + 0.12, w: 0.15, h: 0.15,
    fill: { color: dotColors[i] }
  });
  s5.addText(f.title, {
    x: 1.35, y: f.y, w: 3, h: 0.25,
    fontSize: 13, fontFace: "Calibri", bold: true, color: C.white, margin: 0
  });
  s5.addText(f.desc, {
    x: 1.35, y: f.y + 0.25, w: 4, h: 0.25,
    fontSize: 10, fontFace: "Calibri", color: C.textM, margin: 0
  });
});

// Health value mapping table
let hTableRows = [
  [
    { text: "Status", options: { fill: { color: "2D2060" }, color: C.accent, bold: true, fontSize: 10, fontFace: "Calibri" } },
    { text: "Color", options: { fill: { color: "2D2060" }, color: C.accent, bold: true, fontSize: 10, fontFace: "Calibri" } },
    { text: "Recognized Values", options: { fill: { color: "2D2060" }, color: C.accent, bold: true, fontSize: 10, fontFace: "Calibri" } },
  ],
  [
    { text: "Healthy", options: { fill: { color: C.bgCard }, color: C.green, fontSize: 10, fontFace: "Calibri", bold: true } },
    { text: "● Green", options: { fill: { color: C.bgCard }, color: C.green, fontSize: 10, fontFace: "Calibri" } },
    { text: "green, healthy, ok, good", options: { fill: { color: C.bgCard }, color: C.textB, fontSize: 9, fontFace: "Consolas" } },
  ],
  [
    { text: "Warning", options: { fill: { color: C.bgCard }, color: C.yellow, fontSize: 10, fontFace: "Calibri", bold: true } },
    { text: "● Yellow", options: { fill: { color: C.bgCard }, color: C.yellow, fontSize: 10, fontFace: "Calibri" } },
    { text: "yellow, warning, amber, degraded", options: { fill: { color: C.bgCard }, color: C.textB, fontSize: 9, fontFace: "Consolas" } },
  ],
  [
    { text: "Critical", options: { fill: { color: C.bgCard }, color: C.red, fontSize: 10, fontFace: "Calibri", bold: true } },
    { text: "● Red", options: { fill: { color: C.bgCard }, color: C.red, fontSize: 10, fontFace: "Calibri" } },
    { text: "red, critical, error, down, stale", options: { fill: { color: C.bgCard }, color: C.textB, fontSize: 9, fontFace: "Consolas" } },
  ],
];
s5.addTable(hTableRows, {
  x: 5.8, y: 1.9, w: 3.6, colW: [0.85, 0.85, 1.9],
  border: { pt: 0.5, color: C.dim },
  rowH: [0.32, 0.32, 0.32, 0.32],
});

// ════════════════════════════════════════════════════════════════
// SLIDE 6: Interactive Lineage Tracing
// ════════════════════════════════════════════════════════════════
let s6 = pres.addSlide();
s6.background = { color: C.bgLight };
s6.addText("Interactive Lineage Tracing", {
  x: 0.8, y: 0.4, w: 8.4, h: 0.7,
  fontSize: 30, fontFace: "Calibri", bold: true, color: C.white, margin: 0
});
s6.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.05, w: 1.2, h: 0.04, fill: { color: C.accent2 } });

// Left column — interactions
const interactions = [
  { action: "Left Click", desc: "Traces full upstream & downstream lineage.\nDims unrelated nodes. Filters other visuals.", icon: "👆", color: C.accent },
  { action: "Hover", desc: "Highlights immediate neighbors.\nShows metadata tooltip below node.", icon: "🖱️", color: C.accent2 },
  { action: "Right Click", desc: "Opens context menu with \"Copy Value\".\nShows \"Copied!\" toast notification.", icon: "📋", color: C.green },
  { action: "Click Again", desc: "Toggles trace off. Restores all nodes\nand clears cross-filter.", icon: "🔄", color: C.orange },
];
interactions.forEach((item, i) => {
  let y = 1.4 + i * 1.0;
  s6.addShape(pres.shapes.RECTANGLE, {
    x: 0.8, y: y, w: 4.5, h: 0.85,
    fill: { color: C.bgCard }, line: { color: item.color, width: 0.5, transparency: 75 },
    shadow: makeShadow()
  });
  s6.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: y, w: 0.06, h: 0.85, fill: { color: item.color } });
  s6.addText(item.icon, { x: 1.0, y: y + 0.1, w: 0.5, h: 0.4, fontSize: 18, margin: 0 });
  s6.addText(item.action, {
    x: 1.5, y: y + 0.08, w: 3.5, h: 0.28,
    fontSize: 13, fontFace: "Calibri", bold: true, color: C.white, margin: 0
  });
  s6.addText(item.desc, {
    x: 1.5, y: y + 0.38, w: 3.5, h: 0.4,
    fontSize: 9.5, fontFace: "Calibri", color: C.textM, lineSpacingMultiple: 1.3, margin: 0
  });
});

// Right — trace algorithm
s6.addShape(pres.shapes.RECTANGLE, {
  x: 5.7, y: 1.4, w: 3.7, h: 3.8,
  fill: { color: C.bgCard }, line: { color: C.accent, width: 0.5, transparency: 75 },
  shadow: makeShadow()
});
s6.addText("Directed Trace Algorithm", {
  x: 5.9, y: 1.55, w: 3.3, h: 0.35,
  fontSize: 14, fontFace: "Calibri", bold: true, color: C.accent, margin: 0
});
s6.addText([
  { text: "1.  Identify clicked node & its data rows", options: { breakLine: true, fontSize: 10, color: C.textB } },
  { text: "", options: { breakLine: true, fontSize: 6 } },
  { text: "2.  Upstream BFS — trace backward\n     through parent connections", options: { breakLine: true, fontSize: 10, color: C.textB } },
  { text: "", options: { breakLine: true, fontSize: 6 } },
  { text: "3.  Downstream BFS — trace forward\n     through child connections", options: { breakLine: true, fontSize: 10, color: C.textB } },
  { text: "", options: { breakLine: true, fontSize: 6 } },
  { text: "4.  Row-aware filtering prevents\n     fan-out through shared ancestors", options: { breakLine: true, fontSize: 10, color: C.textB } },
  { text: "", options: { breakLine: true, fontSize: 6 } },
  { text: "5.  Highlight connected set,\n     dim everything else", options: { fontSize: 10, color: C.textB } },
], { x: 5.9, y: 2.05, w: 3.3, h: 3.0, fontFace: "Calibri", margin: 0 });

// ════════════════════════════════════════════════════════════════
// SLIDE 7: Customization Options
// ════════════════════════════════════════════════════════════════
let s7 = pres.addSlide();
s7.background = { color: C.bg };
s7.addText("Customization Options", {
  x: 0.8, y: 0.4, w: 8.4, h: 0.7,
  fontSize: 30, fontFace: "Calibri", bold: true, color: C.white, margin: 0
});
s7.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.05, w: 1.2, h: 0.04, fill: { color: C.orange } });

const settingsGroups = [
  {
    title: "General", color: C.accent, x: 0.8, y: 1.35,
    items: ["Header Font Size (6-40px)", "Cell Font Size (6-40px)", "Show Count Badge", "Show Tooltip on Hover", "Storage Label Font Size"]
  },
  {
    title: "Connection Lines", color: C.accent2, x: 0.8, y: 3.15,
    items: ["Line Opacity (0.05 - 1.0)", "Line Width (0.5 - 6px)", "Dashed lines for skipped layers"]
  },
  {
    title: "Layer Colors", color: C.green, x: 5.3, y: 1.35,
    items: ["12 individual color pickers", "Custom override per layer", "Default palette fallback"]
  },
  {
    title: "Layer Subtitles", color: C.orange, x: 5.3, y: 3.15,
    items: ["Custom unit text per layer", "e.g. \"sources\" instead of \"tables\"", "Dynamic count during trace"]
  },
  {
    title: "URL Columns", color: C.cyan, x: 0.8, y: 4.4,
    items: ["Toggle per layer", "Open in browser / Copy / Both"]
  },
  {
    title: "Interactions", color: C.pink, x: 5.3, y: 4.4,
    items: ["Enable Cross-Filter on Click", "URL Click Action dropdown"]
  },
];
settingsGroups.forEach(g => {
  let h = g.items.length * 0.22 + 0.55;
  s7.addShape(pres.shapes.RECTANGLE, {
    x: g.x, y: g.y, w: 4.2, h: h,
    fill: { color: C.bgCard }, line: { color: g.color, width: 0.5, transparency: 75 },
    shadow: makeShadow()
  });
  s7.addShape(pres.shapes.RECTANGLE, { x: g.x, y: g.y, w: 4.2, h: 0.04, fill: { color: g.color } });
  s7.addText(g.title, {
    x: g.x + 0.15, y: g.y + 0.1, w: 3.8, h: 0.28,
    fontSize: 13, fontFace: "Calibri", bold: true, color: g.color, margin: 0
  });
  let bulletItems = g.items.map((item, idx) => ({
    text: item,
    options: { bullet: true, fontSize: 10, color: C.textB, fontFace: "Calibri", ...(idx < g.items.length - 1 ? { breakLine: true } : {}) }
  }));
  s7.addText(bulletItems, {
    x: g.x + 0.15, y: g.y + 0.4, w: 3.8, h: h - 0.5, margin: 0, paraSpaceAfter: 2
  });
});

// ════════════════════════════════════════════════════════════════
// SLIDE 8: Visual Design & Dark Theme
// ════════════════════════════════════════════════════════════════
let s8 = pres.addSlide();
s8.background = { color: C.bgLight };
s8.addText("Visual Design & Dark Theme", {
  x: 0.8, y: 0.4, w: 8.4, h: 0.7,
  fontSize: 30, fontFace: "Calibri", bold: true, color: C.white, margin: 0
});
s8.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.05, w: 1.2, h: 0.04, fill: { color: C.pink } });

// Color palette display
s8.addText("Default Color Palette", {
  x: 0.8, y: 1.35, w: 4, h: 0.3,
  fontSize: 14, fontFace: "Calibri", bold: true, color: C.white, margin: 0
});
const palette = ["9594B8", "3B82F6", "22C55E", "D49A2E", "F97316", "8B5CF6", "06B6D4", "EF4444", "EC4899", "84CC16", "F59E0B", "6366F1"];
palette.forEach((c, i) => {
  let row = Math.floor(i / 6);
  let col = i % 6;
  s8.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.8 + col * 0.7, y: 1.75 + row * 0.55, w: 0.55, h: 0.4,
    fill: { color: c }, rectRadius: 0.05
  });
  s8.addText("#" + c, {
    x: 0.65 + col * 0.7, y: 2.15 + row * 0.55, w: 0.85, h: 0.2,
    fontSize: 6, fontFace: "Consolas", color: C.textM, align: "center", margin: 0
  });
});

// Design features on the right
s8.addText("Design Highlights", {
  x: 5.3, y: 1.35, w: 4, h: 0.3,
  fontSize: 14, fontFace: "Calibri", bold: true, color: C.white, margin: 0
});
const designItems = [
  "Dark gradient background (135° multi-stop)",
  "Radial glow overlays for depth effect",
  "Semi-transparent node backgrounds",
  "Smooth transitions on all interactions",
  "Custom scrollbars with purple tint",
  "Animated tooltip fade-in",
  "Bezier curve connection lines",
  "Glow effects on health dots",
];
let designBullets = designItems.map((item, idx) => ({
  text: item,
  options: { bullet: true, fontSize: 10, color: C.textB, fontFace: "Calibri", ...(idx < designItems.length - 1 ? { breakLine: true } : {}) }
}));
s8.addText(designBullets, {
  x: 5.3, y: 1.7, w: 4, h: 2.5, margin: 0, paraSpaceAfter: 4
});

// Typography
s8.addText("Typography", {
  x: 0.8, y: 3.2, w: 4, h: 0.3,
  fontSize: 14, fontFace: "Calibri", bold: true, color: C.white, margin: 0
});
s8.addText([
  { text: "Font: ", options: { bold: true, color: C.textB, fontSize: 11, breakLine: false } },
  { text: "Segoe UI with system fallbacks", options: { color: C.textM, fontSize: 11, breakLine: true } },
  { text: "Headers: ", options: { bold: true, color: C.textB, fontSize: 11, breakLine: false } },
  { text: "Uppercase, 1px letter-spacing", options: { color: C.textM, fontSize: 11, breakLine: true } },
  { text: "Nodes: ", options: { bold: true, color: C.textB, fontSize: 11, breakLine: false } },
  { text: "Max 2 lines with ellipsis overflow", options: { color: C.textM, fontSize: 11 } },
], { x: 0.8, y: 3.55, w: 8.4, h: 1.0, fontFace: "Calibri", margin: 0 });

// ════════════════════════════════════════════════════════════════
// SLIDE 9: Getting Started
// ════════════════════════════════════════════════════════════════
let s9 = pres.addSlide();
s9.background = { color: C.bg };
s9.addText("Getting Started", {
  x: 0.8, y: 0.4, w: 8.4, h: 0.7,
  fontSize: 30, fontFace: "Calibri", bold: true, color: C.white, margin: 0
});
s9.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.05, w: 1.2, h: 0.04, fill: { color: C.accent } });

const steps = [
  { num: "01", title: "Import the Visual", desc: "Visualizations pane > ··· > Import a visual from a file\nSelect  DataLineageFlow_v6_0_0.pbiviz", color: C.accent },
  { num: "02", title: "Add Layer Columns", desc: "Drag your data columns into the Layers field well.\nOrder matters: left = upstream, right = downstream.", color: C.accent2 },
  { num: "03", title: "Add Metadata (Optional)", desc: "Create columns with __health, __refreshed, or __storage\nsuffix to enrich nodes with metadata.", color: C.green },
  { num: "04", title: "Customize in Format Pane", desc: "Adjust colors, fonts, line styles, subtitles, and\ninteraction settings to match your report theme.", color: C.orange },
];
steps.forEach((s, i) => {
  let y = 1.35 + i * 1.03;
  // Number circle
  s9.addShape(pres.shapes.OVAL, {
    x: 0.9, y: y + 0.08, w: 0.5, h: 0.5,
    fill: { color: s.color, transparency: 80 }, line: { color: s.color, width: 1, transparency: 40 }
  });
  s9.addText(s.num, {
    x: 0.9, y: y + 0.08, w: 0.5, h: 0.5,
    fontSize: 16, fontFace: "Calibri", bold: true, color: s.color, align: "center", valign: "middle", margin: 0
  });
  // Content card
  s9.addShape(pres.shapes.RECTANGLE, {
    x: 1.6, y: y, w: 7.6, h: 0.85,
    fill: { color: C.bgCard }, line: { color: s.color, width: 0.5, transparency: 75 },
    shadow: makeShadow()
  });
  s9.addShape(pres.shapes.RECTANGLE, { x: 1.6, y: y, w: 0.05, h: 0.85, fill: { color: s.color } });
  s9.addText(s.title, {
    x: 1.85, y: y + 0.08, w: 7, h: 0.28,
    fontSize: 14, fontFace: "Calibri", bold: true, color: C.white, margin: 0
  });
  s9.addText(s.desc, {
    x: 1.85, y: y + 0.38, w: 7, h: 0.42,
    fontSize: 10, fontFace: "Calibri", color: C.textM, lineSpacingMultiple: 1.4, margin: 0
  });
});

// ════════════════════════════════════════════════════════════════
// SLIDE 10: Thank You
// ════════════════════════════════════════════════════════════════
let s10 = pres.addSlide();
s10.background = { color: C.bg };
s10.addShape(pres.shapes.OVAL, { x: 3, y: 0.5, w: 7, h: 7, fill: { color: C.accent, transparency: 95 } });
s10.addShape(pres.shapes.OVAL, { x: -2, y: 2, w: 5, h: 5, fill: { color: C.accent2, transparency: 94 } });

s10.addText("Thank You", {
  x: 0.8, y: 1.5, w: 8.4, h: 1,
  fontSize: 44, fontFace: "Calibri", bold: true, color: C.white, align: "center", margin: 0
});
s10.addText("Data Lineage Flow v6.1", {
  x: 0.8, y: 2.5, w: 8.4, h: 0.5,
  fontSize: 16, fontFace: "Calibri", color: C.accent, align: "center", charSpacing: 3, margin: 0
});

// Repo link
s10.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x: 3.0, y: 3.4, w: 4, h: 0.45,
  fill: { color: C.accent, transparency: 85 }, rectRadius: 0.06,
  line: { color: C.accent, width: 0.5, transparency: 50 }
});
s10.addText("github.com/BharathsDev29/dataLineageFlow", {
  x: 3.0, y: 3.4, w: 4, h: 0.45,
  fontSize: 11, fontFace: "Consolas", color: C.accent, align: "center", valign: "middle", margin: 0,
  hyperlink: { url: "https://github.com/BharathsDev29/dataLineageFlow" }
});

s10.addText("Built by Bharath S.", {
  x: 0.8, y: 4.3, w: 8.4, h: 0.4,
  fontSize: 12, fontFace: "Calibri", color: C.textM, align: "center", margin: 0
});

// ── Save ──
const outPath = "E:\\Bharath\\Power Bi design\\dataLineageFlow\\DataLineageFlow_Presentation.pptx";
pres.writeFile({ fileName: outPath }).then(() => {
  console.log("Created: " + outPath);
}).catch(err => {
  console.error("Error:", err);
});
