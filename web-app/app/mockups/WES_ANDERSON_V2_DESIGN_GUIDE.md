# Fictotum Design System v2.0
## Wes Anderson Visual Language

**Version:** 2.0
**Date:** February 4, 2026
**Status:** Production-Ready

---

## Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Color Palette](#color-palette)
3. [Typography](#typography)
4. [Icon Library](#icon-library)
5. [Component Specifications](#component-specifications)
6. [Layout Principles](#layout-principles)
7. [Implementation Guide](#implementation-guide)
8. [Accessibility Standards](#accessibility-standards)

---

## Design Philosophy

### Core Principles

**Meticulous Symmetry**
Every layout should feel intentionally balanced. Centered compositions, equal spacing, and mirrored elements create visual harmony reminiscent of Anderson's signature cinematography.

**Vintage Craftsmanship**
Design elements evoke mid-century ephemera: travel posters, passport stamps, scout badges, vintage film reels. Every component should feel hand-crafted, not algorithmically generated.

**Restrained Color Palette**
Muted pastels with strategic accent colors. Never more than 3-4 colors in a single component. Color serves hierarchy and emotion, not decoration.

**Geometric Clarity**
Icons and illustrations use simple geometric shapes. Circles, rectangles, triangles. Clean lines, 2-3px strokes, minimal detail. Legible at any size.

**Analog Warmth**
Digital interfaces with analog soul. Subtle textures, rounded corners (2px max), box shadows that suggest depth without skeuomorphism.

---

## Color Palette

### Primary Colors

These are the foundation of the visual system. Use them for backgrounds, primary UI surfaces, and large compositional areas.

| Color Name      | Hex Code  | Usage                                    | Contrast Notes            |
|-----------------|-----------|------------------------------------------|---------------------------|
| **Dusty Pink**  | `#D4A59A` | Headers, primary accent, navigation      | AAA with dark text        |
| **Muted Yellow**| `#F4D9C6` | Card backgrounds, highlighted surfaces   | AAA with dark text        |
| **Sage Green**  | `#A8C9A8` | Positive sentiment, success states       | AAA with dark text        |
| **Powder Blue** | `#E8C5B5` | Soft backgrounds, secondary surfaces     | AAA with dark text        |

### Secondary Colors (v2.0 Addition)

Strategic accent colors for interactive elements, data visualization, and semantic meaning.

| Color Name       | Hex Code  | Usage                                    | Contrast Notes            |
|------------------|-----------|------------------------------------------|---------------------------|
| **Mid-Blue**     | `#5B9AA9` | CTAs, links, interactive elements        | AAA with white text       |
| **Bottle Green** | `#2F5D50` | Media badges, secondary accents          | AAA with white text       |
| **Muted Red**    | `#C97676` | Negative sentiment, destructive actions  | AAA with dark text        |
| **Warm Taupe**   | `#A8896D` | Borders, dividers, structural elements   | AA with white text        |

### Text & Structure

| Color Name         | Hex Code  | Usage                                    |
|--------------------|-----------|------------------------------------------|
| **Dark Brown**     | `#3A2F27` | Primary headings, high-emphasis text     |
| **Medium Brown**   | `#5C4A3C` | Body text, secondary text                |
| **Light Brown**    | `#8B6F61` | Tertiary text, borders, disabled states  |
| **Cream**          | `#F5E6D3` | Page backgrounds, canvas                 |

### Sentiment Scale (Data Visualization)

For the unified timeline and reputation components:

| Sentiment      | Hex Code  | Dot Icon | Usage Context                |
|----------------|-----------|----------|------------------------------|
| **Villainous** | `#C97676` | Red dot  | Antagonistic portrayals      |
| **Critical**   | `#D4A59A` | Pink dot | Negative but nuanced         |
| **Neutral**    | `#F4D9C6` | Yellow   | Balanced/historical          |
| **Complex**    | `#A8C9A8` | Green    | Multi-dimensional characters |
| **Sympathetic**| `#7BA87B` | Sage     | Favorable portrayals         |
| **Heroic**     | `#5B9AA9` | Blue     | Highly positive              |

**Implementation Note:** This 6-point scale replaces generic star ratings or numeric scores. Color-coded dots appear in timeline frames with text labels for accessibility.

---

## Typography

### Typeface

**Primary Font:** Futura (or fallbacks: Century Gothic, Avenir Next, sans-serif)

**Why Futura?**
Geometric, timeless, widely associated with mid-century modern design. Evokes vintage travel posters and museum labels.

### Type Scale

| Element              | Size   | Weight | Letter Spacing | Line Height | Color        |
|----------------------|--------|--------|----------------|-------------|--------------|
| **Hero Title**       | 64px   | 700    | 2px            | 1.2         | Dark Brown   |
| **Page Title**       | 48px   | 700    | 3px            | 1.2         | Dark Brown   |
| **Section Title**    | 32px   | 700    | 2px            | 1.3         | Dark Brown   |
| **Card Title**       | 20px   | 700    | 1px            | 1.3         | Dark Brown   |
| **Body Text**        | 14px   | 300    | 0.5px          | 1.6         | Medium Brown |
| **Small Caps Label** | 12px   | 500    | 2px            | 1.4         | Medium Brown |
| **Metadata**         | 11px   | 300    | 1.5px          | 1.5         | Light Brown  |

### Text Transforms

- **All caps:** Section titles, labels, buttons, breadcrumbs
- **Title case:** Card titles, feature headings
- **Sentence case:** Body copy, descriptions

### Accessibility

- Minimum body text size: 14px
- Minimum contrast ratio: 4.5:1 (WCAG AA)
- Line length: Max 75 characters for readability
- Line height: 1.5+ for body text

---

## Icon Library

### Design Principles

1. **Geometric Foundation:** All icons built from circles, rectangles, triangles
2. **2-3 Color Maximum:** Maintain visual cohesion
3. **Stroke Weight:** 2-3px for legibility
4. **Symmetry Preferred:** When conceptually appropriate
5. **Inline SVG:** For easy customization and performance

### Primary Icons (60-80px)

- **Crown** - Historical figures, royalty, authority
- **Trophy** - Reputation, achievements, awards
- **Clock** - Timeline, chronology, temporal data
- **Film Reel** - Movies, cinema, film portrayals
- **Network Graph** - Connections, relationships
- **Portrait Frame** - Figure profiles, character pages

### Media Type Icons (30-40px)

- **Film Camera** - Feature films
- **Television** - TV series, miniseries
- **Book** - Novels, literature
- **Theater Masks** - Stage plays, theater
- **Video Game** - Interactive media
- **Musical Note** - Musicals, musical theater

### Utility Icons (40-50px)

- **Gauge/Meter** - Volatility, metrics
- **Calendar** - Date ranges, periods
- **Star Badge** - Featured content
- **Compass** - Navigation, discovery
- **Search** - Search functionality
- **List** - Collections, catalogs

### Usage Guidelines

```html
<!-- Example: Icon with label -->
<div class="stat-box">
  <div class="stat-icon">
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <!-- SVG paths here -->
    </svg>
  </div>
  <div class="stat-number">12</div>
  <div class="stat-label">Portrayals</div>
</div>
```

**Spacing:** 15-20px between icon and text
**Accent Colors:** Use mid-blue and bottle green for dots/accents
**Color Limit:** Never more than 3 accent colors per icon

---

## Component Specifications

### 1. Hero Section - "Vintage Frame" Approach

**Concept:** Single centered focal point with ornamental border, mimicking a framed vintage photograph or museum placard.

**Structure:**
```
┌─────────────────────────────────────┐
│   [Corner Brackets in Four Corners] │
│                                     │
│   ┌──────────────────────────┐    │
│   │  [Thick Ornamental Frame]│    │
│   │  ┌────────────────────┐  │    │
│   │  │  [Double Border]    │  │    │
│   │  │  Hero Title         │  │    │
│   │  │  Description        │  │    │
│   │  └────────────────────┘  │    │
│   └──────────────────────────┘    │
│                                     │
│   [Stage Props - 3 Tilted Cards]   │
│   [CTA Button]                      │
└─────────────────────────────────────┘
```

**Key Elements:**

- **Vintage Frame:** 12px solid border (#A8896D) + double inner border (3px)
- **Corner Ornamental Screws:** 16px circles in each corner (#8B6F61)
- **Stage Props:** 3 cards with slight rotation (-2deg, +1deg, -1deg)
- **Props interact on hover:** Straighten to 0deg rotation, lift with increased shadow

**CSS Specifications:**
```css
.vintage-frame {
  border: 12px solid #A8896D;
  padding: 40px;
  box-shadow: 0 8px 0 #8B6F61, 0 0 40px rgba(0,0,0,0.1);
}

.frame-inner {
  border: 3px double #8B6F61;
  padding: 40px;
}

.prop-card {
  transform: rotate(-2deg);
  transition: all 0.3s ease;
}

.prop-card:hover {
  transform: rotate(0deg) translateY(-8px);
}
```

**Alternatives Considered (but not implemented):**
- Split-screen hero (v1 approach - didn't work in practice)
- Overhead diorama (too complex for landing page)
- Illustrated stage set (requires custom illustration assets)

---

### 2. Unified Timeline - "Film Strip" Approach

**Concept:** Horizontal scrollable timeline where each portrayal is a "frame" on a film strip. A gradient line runs through all frames showing reputation evolution.

**User Journey:**
1. User lands on figure page (e.g., Henry VIII)
2. Sees complete timeline at a glance - earliest to most recent
3. Hover on frame → card lifts, shows full details
4. Color-coded sentiment dots provide instant visual pattern
5. Can scroll horizontally to see all 12+ portrayals

**Structure:**
```
┌────────────────────────────────────────────────────┐
│  Cultural Reputation Timeline                      │
│  [Subtitle explaining what they're seeing]         │
│                                                    │
│  ┌─────────── FILM STRIP CONTAINER ─────────────┐ │
│  │ [Sprocket holes at top]                       │ │
│  │                                               │ │
│  │  [Reputation gradient line runs through]     │ │
│  │                                               │ │
│  │  [Frame] [Frame] [Frame] [Frame] [Frame] ... │ │
│  │  1613    1933    1953    1966    1969        │ │
│  │                                               │ │
│  │ [Sprocket holes at bottom]                    │ │
│  └───────────────────────────────────────────────┘ │
│                                                    │
│  ┌─────────── SENTIMENT LEGEND ────────────────┐  │
│  │ [Dot] Villainous  [Dot] Critical  [Dot] ...  │  │
│  └───────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────┘
```

**Frame Anatomy:**
```
┌─────────────────┐
│   [1966]        │ ← Year badge (pink, prominent)
│                 │
│   A Man for     │ ← Work title (bold, 15px)
│   All Seasons   │
│                 │
│   FILM          │ ← Media type (small caps, 9px)
│                 │
│   [•] Manipu-   │ ← Sentiment dot + label
│   lative antag- │    (color-coded, 10px)
│   onist          │
└─────────────────┘
```

**CSS Specifications:**
```css
.film-strip {
  background: #3A2F27; /* Dark brown simulating film */
  border: 4px solid #2A1F1A;
  padding: 20px 0;
  overflow-x: auto;
}

/* Reputation gradient line */
.reputation-line {
  position: absolute;
  height: 3px;
  background: linear-gradient(to right,
    #C97676 0%,    /* Villainous */
    #D4A59A 20%,   /* Critical */
    #F4D9C6 40%,   /* Neutral */
    #A8C9A8 60%,   /* Complex */
    #7BA87B 80%,   /* Sympathetic */
    #5B9AA9 100%   /* Heroic */
  );
}

.frame {
  min-width: 200px;
  max-width: 200px;
  padding: 20px 16px;
  background: #F4D9C6;
  border: 3px solid #8B6F61;
  transition: all 0.3s ease;
}

.frame:hover {
  transform: translateY(-8px) scale(1.05);
  z-index: 10;
}
```

**Data Integration:**
- Fetch all PORTRAYED_AS relationships for figure
- Sort by work.year (ascending)
- Extract sentiment from relationship properties
- Map sentiment string to color category
- Render frames in chronological order

**Advantages over separate timeline:**
- **Single source of truth:** One component shows both chronology and sentiment
- **Visual pattern recognition:** Users see reputation volatility at a glance
- **Scannable:** Horizontal scroll feels natural for timeline exploration
- **Film metaphor:** Reinforces "portrayals through media" concept

---

### 3. Color-Coded Sentiment System

**Problem Solved:** Generic 5-star ratings or numeric scores don't capture nuance of historical portrayal. "3 stars" means nothing for Henry VIII.

**Solution:** 6-point sentiment scale with descriptive labels and color-coded dots.

**Scale:**

| Position | Color      | Label         | Example Context                    |
|----------|------------|---------------|------------------------------------|
| 1        | Red        | Villainous    | "Tyrannical despot"                |
| 2        | Pink       | Critical      | "Manipulative antagonist"          |
| 3        | Yellow     | Neutral       | "Historical, balanced"             |
| 4        | Green      | Complex       | "Multi-dimensional, flawed"        |
| 5        | Sage       | Sympathetic   | "Humanized, vulnerable"            |
| 6        | Blue       | Heroic        | "Noble, inspirational"             |

**Implementation:**
```html
<div class="sentiment-indicator">
  <div class="sentiment-dot villainous"></div>
  <div class="sentiment-label">Tyrannical despot</div>
</div>
```

```css
.sentiment-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid #5C4A3C;
}

.sentiment-dot.villainous { background: #C97676; }
.sentiment-dot.critical   { background: #D4A59A; }
.sentiment-dot.neutral    { background: #F4D9C6; }
.sentiment-dot.complex    { background: #A8C9A8; }
.sentiment-dot.sympathetic{ background: #7BA87B; }
.sentiment-dot.heroic     { background: #5B9AA9; }
```

**Accessibility:** Always pair dot with text label. Color is enhancement, not sole conveyor of meaning.

---

### 4. Reputation Volatility Gauge

**Concept:** Vintage meter/gauge showing how much a figure's reputation has swung over time.

**Structure:**
```
┌─────────────────────────────────┐
│   [Gauge Icon - Arc with needle]│
│                                 │
│           68                    │ ← Large number
│      HIGH VOLATILITY            │ ← Label
│                                 │
│   Henry VIII's cultural rep...  │ ← Explanation text
└─────────────────────────────────┘
```

**Calculation Logic:**
```javascript
// Calculate standard deviation of sentiment scores
// Map to 0-100 scale
// Categorize: Low (0-33), Medium (34-66), High (67-100)
```

**CSS:**
```css
.volatility-gauge {
  background: #F4D9C6;
  border: 3px solid #A8896D;
  padding: 40px;
  text-align: center;
}

.volatility-score {
  font-size: 72px;
  font-weight: 700;
  color: #3A2F27;
}
```

---

### 5. Feature Cards

**Standard card anatomy:**

```
┌─────────────────────┐
│     [Icon SVG]      │ ← 80px icon, centered
│                     │
│   Feature Title     │ ← 20px, bold, dark brown
│                     │
│   Description text  │ ← 14px, light weight
│   explaining the    │    medium brown
│   feature clearly.  │
└─────────────────────┘
```

**Specifications:**
- Background: `#E8D4C0`
- Border: `3px solid #A8896D`
- Padding: `40px 30px`
- Box shadow: `0 4px 0 #A8896D`
- Hover: `translateY(-6px)` + shadow `0 10px 0 #A8896D`

**Grid Layout:**
```css
.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
}

@media (max-width: 768px) {
  .features-grid {
    grid-template-columns: 1fr;
  }
}
```

---

### 6. Stat Boxes

**Usage:** Display key metrics about a figure (portrayals, years, marriages, etc.)

```
┌──────────────┐
│  [Icon SVG]  │ ← 50px icon
│              │
│      12      │ ← 48px number, bold
│              │
│  PORTRAYALS  │ ← 12px small caps
└──────────────┘
```

**CSS:**
```css
.stat-box {
  background: #F4D9C6;
  border: 3px solid #8B6F61;
  padding: 30px 40px;
  min-width: 180px;
  box-shadow: 0 4px 0 #8B6F61;
}
```

---

## Layout Principles

### Symmetry & Centering

**Primary Rule:** When in doubt, center it.

- Hero sections: Centered text and content
- Feature grids: Equal spacing, balanced columns
- Icon placement: Centered above text
- Footer navigation: Centered links with equal gaps

**Exception:** Detail-heavy sections (portrayals grid, timeline) can use asymmetric layouts for scannability.

### Spacing Scale

Use a consistent spacing scale based on multiples of 8px:

| Size | Value | Usage                                    |
|------|-------|------------------------------------------|
| XS   | 8px   | Tight spacing (icon-to-text)             |
| SM   | 16px  | Standard spacing within components       |
| MD   | 24px  | Spacing between related elements         |
| LG   | 40px  | Spacing between component sections       |
| XL   | 60px  | Section padding (top/bottom)             |
| XXL  | 80px  | Major section separation                 |

### Grid System

**Desktop (1200px max-width):**
- 12-column grid
- 30px gutters
- Feature cards: 3 columns
- Stat boxes: 3-4 columns

**Tablet (768px-1023px):**
- 8-column grid
- 24px gutters
- Feature cards: 2 columns
- Stat boxes: 2 columns

**Mobile (<768px):**
- 4-column grid
- 16px gutters
- Single column stacking
- Reduced padding (40px → 24px)

---

## Implementation Guide

### File Structure

```
web-app/
├── components/
│   ├── VintageFrame.tsx         (Hero section)
│   ├── FilmStripTimeline.tsx    (Unified timeline)
│   ├── FeatureCard.tsx          (Reusable card)
│   ├── StatBox.tsx              (Metric display)
│   ├── SentimentDot.tsx         (Color-coded sentiment)
│   └── icons/
│       ├── Crown.tsx
│       ├── Trophy.tsx
│       ├── FilmReel.tsx
│       └── ... (all SVG icons as components)
├── styles/
│   ├── colors.css               (CSS variables for palette)
│   ├── typography.css           (Type scale, font loading)
│   └── wes-anderson.css         (Component styles)
└── app/
    └── mockups/
        ├── wes-anderson-landing-v2.html
        ├── wes-anderson-figure-v2.html
        └── wes-anderson-icons.html
```

### CSS Variables

```css
:root {
  /* Primary Colors */
  --color-dusty-pink: #D4A59A;
  --color-muted-yellow: #F4D9C6;
  --color-sage-green: #A8C9A8;
  --color-powder-blue: #E8C5B5;

  /* Secondary Colors */
  --color-mid-blue: #5B9AA9;
  --color-bottle-green: #2F5D50;
  --color-muted-red: #C97676;
  --color-warm-taupe: #A8896D;

  /* Text & Structure */
  --color-dark-brown: #3A2F27;
  --color-medium-brown: #5C4A3C;
  --color-light-brown: #8B6F61;
  --color-cream: #F5E6D3;

  /* Spacing */
  --space-xs: 8px;
  --space-sm: 16px;
  --space-md: 24px;
  --space-lg: 40px;
  --space-xl: 60px;
  --space-xxl: 80px;

  /* Typography */
  --font-primary: 'Futura', 'Century Gothic', 'Avenir Next', sans-serif;
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;
}
```

### React Component Example

```tsx
// components/SentimentDot.tsx
interface SentimentDotProps {
  sentiment: 'villainous' | 'critical' | 'neutral' | 'complex' | 'sympathetic' | 'heroic';
  label: string;
}

export function SentimentDot({ sentiment, label }: SentimentDotProps) {
  return (
    <div className="sentiment-indicator">
      <div className={`sentiment-dot ${sentiment}`} aria-hidden="true" />
      <div className="sentiment-label">{label}</div>
    </div>
  );
}
```

### Database Query Example

```typescript
// Fetch timeline data for unified component
async function getFigureTimeline(figureId: string) {
  const query = `
    MATCH (f:HistoricalFigure {canonical_id: $figureId})
    OPTIONAL MATCH (f)-[p:PORTRAYED_AS]->(c:FictionalCharacter)-[:APPEARS_IN]->(m:MediaWork)
    RETURN
      m.title AS workTitle,
      m.year AS workYear,
      m.media_type AS mediaType,
      p.sentiment AS sentiment,
      c.name AS characterName
    ORDER BY m.year ASC
  `;

  const result = await neo4j.run(query, { figureId });

  return result.records.map(record => ({
    workTitle: record.get('workTitle'),
    workYear: record.get('workYear'),
    mediaType: record.get('mediaType'),
    sentiment: mapSentimentToColor(record.get('sentiment')),
    characterName: record.get('characterName')
  }));
}

function mapSentimentToColor(sentiment: string): 'villainous' | 'critical' | 'neutral' | 'complex' | 'sympathetic' | 'heroic' {
  // Parse sentiment string and map to color category
  // Example: "tyrannical-despot" → 'villainous'
  //          "complex-vulnerable" → 'complex'
}
```

---

## Accessibility Standards

### WCAG 2.1 AA Compliance

**Color Contrast:**
- All text meets 4.5:1 minimum contrast
- Large text (18px+) meets 3:1 minimum
- Interactive elements have 3:1 contrast against adjacent colors

**Keyboard Navigation:**
- All interactive elements reachable via Tab
- Focus states clearly visible (outline: 3px solid mid-blue)
- Skip links provided for main content
- Logical tab order follows visual hierarchy

**Screen Reader Support:**
- All icons have descriptive `aria-label` attributes
- Timeline frames use `<article>` semantic markup
- Sentiment dots paired with text labels (color not sole indicator)
- Loading states announced with `aria-live="polite"`

**Motion & Animation:**
- `prefers-reduced-motion` media query disables hover transforms
- No auto-playing animations
- Transitions under 0.5s duration

### Testing Checklist

- [ ] Run axe DevTools audit (0 violations)
- [ ] Test with NVDA/JAWS screen reader
- [ ] Verify keyboard-only navigation
- [ ] Check color contrast with WebAIM tool
- [ ] Test at 200% zoom (no horizontal scroll)
- [ ] Validate HTML (no errors)

---

## Maintenance Notes

### When to Update This Guide

- Adding new component patterns
- Expanding color palette (rare - maintain discipline)
- New icon additions to library
- Typography scale adjustments
- Accessibility improvements

### Version History

**v2.0 (Feb 4, 2026)**
- Added mid-blue and bottle green secondary colors
- Replaced emoji with custom SVG icon library
- Introduced unified timeline "film strip" component
- Redesigned hero section with "vintage frame" approach
- Comprehensive color-coded sentiment system

**v1.0 (Feb 4, 2026)**
- Initial Wes Anderson design system
- Split-screen hero (deprecated in v2.0)
- Basic color palette (primary colors only)
- Emoji-based icons (replaced in v2.0)

---

## Quick Reference Card

### Most Common Patterns

**Feature Card:**
```html
<div class="feature-card">
  <div class="feature-icon">[SVG]</div>
  <h3 class="feature-title">Title</h3>
  <p class="feature-text">Description</p>
</div>
```

**Stat Box:**
```html
<div class="stat-box">
  <div class="stat-icon">[SVG]</div>
  <div class="stat-number">12</div>
  <div class="stat-label">Label</div>
</div>
```

**Timeline Frame:**
```html
<div class="frame">
  <div class="frame-year">1966</div>
  <h3 class="frame-title">Work Title</h3>
  <div class="frame-medium">Film</div>
  <div class="sentiment-indicator">
    <div class="sentiment-dot critical"></div>
    <div class="sentiment-label">Antagonist</div>
  </div>
</div>
```

### Color Quick Picks

- **Primary Action:** Mid-Blue (#5B9AA9)
- **Destructive Action:** Muted Red (#C97676)
- **Success/Positive:** Sage Green (#A8C9A8)
- **Card Background:** Muted Yellow (#F4D9C6)
- **Border/Structure:** Warm Taupe (#A8896D)

---

**End of Design Guide v2.0**

For questions or contributions, contact the Fictotum design team.
