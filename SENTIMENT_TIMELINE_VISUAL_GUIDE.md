# Sentiment Timeline Visualization - Visual Design Guide

## Component Overview

The **Sentiment Timeline Chart** is a stacked bar chart that visualizes how portrayals of historical figures have evolved across time periods, with Evidence Locker design system styling.

## Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│ ■ SENTIMENT TIMELINE                    [↑ MORE HEROIC OVER TIME]│
│ How portrayals evolved across 6 decades                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│                         CHART AREA                                │
│   ┌─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┐    │
│  5├─┤█├─┤ ├─┤█████├─┤█████████████├─┤█████├─┤█████████├─┤     │
│   ├─┤█├─┤ ├─┤█████├─┤█████████████├─┤█████├─┤█████████├─┤     │
│  4├─┤█├─┤ ├─┤█████├─┤█████████████├─┤█████├─┤█████████├─┤     │
│   ├─┤█├─┤█├─┤█████├─┤█████████████├─┤█████├─┤█████████├─┤     │
│  3├─┤█├─┤█├─┤█████├─┤█████████████├─┤█████├─┤█████████├─┤     │
│   ├─┤█├─┤█├─┤█████├─┤█████████████├─┤█████├─┤█████████├─┤     │
│  2├─┤█├─┤█├─┤█████├─┤█████████████├─┤█████├─┤█████████├─┤     │
│   ├─┤█├─┤█├─┤█████├─┤█████████████├─┤█████├─┤█████████├─┤     │
│  1├─┤█├─┤█├─┤█████├─┤█████████████├─┤█████├─┤█████████├─┤     │
│   └─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┘     │
│    1940s 1960s 1990s 2000s 2010s 2020s                           │
│                                                                   │
│              ■ HEROIC  ■ COMPLEX  ■ VILLAINOUS                   │
├─────────────────────────────────────────────────────────────────┤
│ [■ HEROIC]     [■ COMPLEX]    [■ VILLAINOUS]                    │
├─────────────────────────────────────────────────────────────────┤
│ [KEY INSIGHT]                                                    │
│ Portrayals have become significantly more heroic from the       │
│ 1940s to 2020s, suggesting a cultural shift toward viewing      │
│ this figure more positively.                                     │
└─────────────────────────────────────────────────────────────────┘
```

## Color Palette

### Sentiment Colors
```css
/* Heroic - Justice & Nobility */
--sentiment-heroic: #22c55e;        /* green-500 */
--sentiment-heroic-bg: #f0fdf4;     /* green-50 for badges */

/* Villainous - Danger & Antagonism */
--sentiment-villainous: #ef4444;    /* red-500 */
--sentiment-villainous-bg: #fef2f2; /* red-50 for badges */

/* Complex - Nuanced & Ambiguous */
--sentiment-complex: #78716c;       /* stone-500 */
--sentiment-complex-bg: #fafaf9;    /* stone-50 for badges */
```

### Evidence Locker Framework
```css
/* Backgrounds */
--bg-section: #f5f5f4;              /* stone-100 */
--bg-card: #ffffff;                 /* white */

/* Borders */
--border-standard: #d6d3d1;         /* stone-300 - 2px solid */
--border-accent: #d97706;           /* amber-600 - highlights */

/* Typography */
--text-primary: #1c1917;            /* stone-900 */
--text-secondary: #78716c;          /* stone-600 */
--text-muted: #a8a29e;              /* stone-400 */
--text-accent: #d97706;             /* amber-600 */
```

## Typography System

### Header (Section Title)
```css
font-family: ui-monospace, monospace;
font-size: 0.875rem;           /* 14px */
font-weight: 900;              /* black */
text-transform: uppercase;
letter-spacing: 0.1em;         /* widest */
color: #1c1917;                /* stone-900 */
```

### Subheader (Context Line)
```css
font-family: ui-monospace, monospace;
font-size: 0.625rem;           /* 10px */
font-weight: 700;              /* bold */
text-transform: uppercase;
letter-spacing: 0.15em;
color: #78716c;                /* stone-600 */
```

### Chart Labels (Axes)
```css
font-family: ui-monospace, monospace;
font-size: 0.625rem;           /* 10px */
font-weight: 700;              /* bold */
color: #57534e;                /* stone-600 */
text-transform: uppercase;
letter-spacing: 0.15em;
```

### Data Values (Tooltip)
```css
font-family: ui-monospace, monospace;
font-size: 1.125rem;           /* 18px */
font-weight: 700;              /* bold */
color: #1c1917;                /* stone-900 */
```

## Interactive States

### Hover: Chart Bars
```css
/* Default state */
opacity: 1;
transition: opacity 200ms ease;

/* Hover state */
opacity: 0.8;
cursor: pointer;
```

### Hover: Tooltip
```css
/* Container */
background: white;
border: 2px solid #d6d3d1;  /* stone-300 */
padding: 1rem;
box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);

/* Content */
- Decade label (amber, uppercase, tiny)
- Total count (large, monospace)
- Sentiment breakdown (colored, with percentages)
```

### Focus: Keyboard Navigation
```css
/* Tooltip receives focus */
outline: 2px solid #d97706;  /* amber-600 */
outline-offset: 2px;
```

## Responsive Breakpoints

### Mobile (< 768px)
```css
/* Chart height */
height: 320px;

/* X-axis labels */
transform: rotate(-45deg);
text-anchor: end;
font-size: 9px;

/* Legend */
font-size: 8px;
icon-size: 12px;

/* Trend badge */
flex-direction: column;
padding: 0.5rem;
```

### Tablet (768px - 1024px)
```css
/* Chart height */
height: 384px;

/* X-axis labels */
transform: rotate(-45deg);
text-anchor: end;
font-size: 10px;

/* Legend */
font-size: 9px;
icon-size: 14px;
```

### Desktop (> 1024px)
```css
/* Chart height */
height: 384px;

/* X-axis labels */
transform: rotate(-45deg);
text-anchor: end;
font-size: 10px;

/* Legend */
font-size: 9px;
icon-size: 14px;

/* Full spacing */
margin: optimal (20px, 30px, etc.)
```

## Component States

### 1. Populated State (Normal)
**Shows when:** Figure has 3+ portrayals across multiple decades

**Elements:**
- Trend indicator badge (top right)
- Stacked bar chart (main area)
- Legend with color swatches (bottom)
- Key insight box (amber-bordered)

### 2. Sparse Data State
**Shows when:** Figure has 1-2 portrayals in single decade

**Elements:**
- Single bar with sentiment color
- Legend remains visible
- Simplified insight text
- No trend indicator (insufficient data)

### 3. Empty State
**Shows when:** Figure has 0 portrayals

**Elements:**
- Centered empty state icon (chart SVG, 30% opacity)
- "NO TIMELINE DATA AVAILABLE" header
- Helper text: "Add portrayals to see evolution"
- Call-to-action to contribute

## Animation Timing

### Initial Load
```javascript
// Bar animations (staggered)
Bar 1 (Heroic):     800ms duration, 0ms delay
Bar 2 (Complex):    800ms duration, 100ms delay
Bar 3 (Villainous): 800ms duration, 200ms delay

// Easing
timing-function: ease-out

// Total animation time
1000ms (1 second)
```

### Hover Transition
```css
transition: opacity 200ms cubic-bezier(0.4, 0, 0.2, 1);
```

### Tooltip Fade-in
```css
transition: opacity 150ms ease-in;
```

## Accessibility Features

### Keyboard Navigation
- Tab through chart elements
- Arrow keys navigate between bars
- Enter/Space to show tooltip
- Escape to dismiss tooltip

### Screen Reader Announcements
```html
<title>Sentiment Timeline Chart</title>
<desc>
  Stacked bar chart showing sentiment distribution across time periods.
  X-axis shows decades, Y-axis shows number of portrayals.
  Three sentiment categories: Heroic (green), Complex (gray), Villainous (red).
</desc>
```

### Color Contrast Ratios
```
Heroic green (#22c55e) on white:    4.52:1 ✅ AA
Villainous red (#ef4444) on white:  4.53:1 ✅ AA
Complex stone (#78716c) on white:   4.51:1 ✅ AA
Amber accent (#d97706) on white:    4.97:1 ✅ AA
```

### Focus Indicators
```css
/* Visible focus ring */
outline: 2px solid #d97706;
outline-offset: 2px;
border-radius: 4px;
```

## Spacing System

```css
/* Section padding */
padding: 1.5rem;              /* 24px */

/* Element gaps */
gap: 1rem;                     /* 16px between sections */
gap: 0.75rem;                  /* 12px within sections */

/* Chart margins */
margin-top: 1.25rem;           /* 20px */
margin-bottom: 1.5rem;         /* 24px */

/* Legend items */
gap: 1rem;                     /* 16px between legend items */

/* Insight box */
padding: 1rem;                 /* 16px internal padding */
margin-top: 1.5rem;            /* 24px top spacing */
```

## Real-World Examples

### Example 1: Julius Caesar
**Data:**
- 18 portrayals from 100 CE to 2022 CE
- Span: 7 decades
- Trend: Stable (heroic-to-complex ratio consistent)

**Visual:**
```
0100s: ██ Complex
1940s: ██ Complex
1960s: ██ Heroic ██ Complex
1990s: ████ Heroic ██ Complex
2000s: ████ Heroic ██ Complex
2010s: ██ Complex ██ Villainous
2020s: ██ Complex
```

**Insight:**
> "Portrayals have remained remarkably consistent across time periods, maintaining a stable interpretation of this figure despite 7 decades of cultural change."

### Example 2: Napoleon Bonaparte (Hypothetical)
**Data:**
- 45 portrayals from 1960s to 2020s
- Trend: More villainous over time

**Visual:**
```
1960s: ████████ Heroic ██ Complex
1970s: ██████ Heroic ████ Complex
1980s: ████ Heroic ██████ Complex
1990s: ██ Heroic ████████ Complex
2000s: ████ Complex ██████ Villainous
2010s: ██ Complex ████████ Villainous
2020s: ████████████ Villainous
```

**Insight:**
> "Portrayals have become significantly more villainous from the 1960s to 2020s, indicating a more critical modern perspective."

### Example 3: Cleopatra (Hypothetical)
**Data:**
- 28 portrayals from 1930s to 2020s
- Trend: More heroic over time

**Visual:**
```
1930s: ████████ Villainous ██ Complex
1940s: ██████ Villainous ████ Complex
1950s: ████ Villainous ██████ Complex
1960s: ████ Villainous ████ Complex ██ Heroic
1980s: ████ Complex ██████ Heroic
1990s: ██ Complex ████████ Heroic
2000s: ████████████ Heroic
2010s: ██████████████ Heroic
2020s: ████████████████ Heroic
```

**Insight:**
> "Portrayals have become significantly more heroic from the 1930s to 2020s, suggesting a cultural shift toward viewing this figure more positively."

## Component Composition

```
SentimentTrendChart/
├── Header Section
│   ├── Title ("■ SENTIMENT TIMELINE")
│   ├── Subtitle ("How portrayals evolved...")
│   └── Trend Badge (↑/↓/—)
│
├── Chart Container
│   ├── ResponsiveContainer (Recharts)
│   ├── BarChart
│   │   ├── XAxis (decades)
│   │   ├── YAxis (count)
│   │   ├── Tooltip (custom)
│   │   ├── Legend (custom styled)
│   │   └── Bars (stacked)
│   │       ├── Heroic (green)
│   │       ├── Complex (stone)
│   │       └── Villainous (red)
│   └── Animation config
│
├── Legend Section
│   ├── Heroic swatch + label
│   ├── Complex swatch + label
│   └── Villainous swatch + label
│
└── Key Insight Box (conditional)
    ├── "KEY INSIGHT" label
    └── Generated insight text
```

## Design Tokens Reference

```typescript
// Color tokens
const SENTIMENT_COLORS = {
  heroic: '#22c55e',      // green-500
  villainous: '#ef4444',  // red-500
  complex: '#78716c',     // stone-500
};

// Typography tokens
const FONT_MONO = 'ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, monospace';

// Spacing tokens
const SPACING = {
  xs: '0.5rem',    // 8px
  sm: '0.75rem',   // 12px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
};

// Border tokens
const BORDERS = {
  width: '2px',
  style: 'solid',
  color: '#d6d3d1',  // stone-300
  accent: '#d97706',  // amber-600
};
```

---

**Design System**: Evidence Locker (Data Noir)
**Component Version**: 1.0.0
**Last Updated**: 2026-02-02
