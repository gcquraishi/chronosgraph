# "Explore Connections" Button - Visual Design Specification

## Component Anatomy

```
┌─────────────────────────────────────────────┐
│  [Network Icon] EXPLORE CONNECTIONS         │  ← Button
└─────────────────────────────────────────────┘
```

### Dimensions
- **Height:** Auto (min 44px for touch accessibility)
- **Padding:** 16px horizontal (px-4), 8px vertical (py-2)
- **Icon Size:** 16x16px (w-4 h-4)
- **Gap:** 8px between icon and text (gap-2)

## Color Palette

### Default State
```
Background:   #D97706  (amber-600)
Border:       #B45309  (amber-700) - 2px solid
Text:         #FFFFFF  (white)
Icon:         #FFFFFF  (white)
Shadow:       medium depth shadow-md
```

### Hover State
```
Background:   #B45309  (amber-700) - darkens
Border:       #92400E  (amber-800) - darkens
Text:         #FFFFFF  (white)
Icon:         #FFFFFF  (white) + 12deg rotation
Shadow:       elevated shadow-lg
Transform:    -1px translateY (lifts up)
```

### Active State
```
Background:   #B45309  (amber-700)
Border:       #92400E  (amber-800)
Text:         #FFFFFF  (white)
Icon:         #FFFFFF  (white) + 90% scale
Shadow:       compressed shadow-md
Transform:    0px translateY (returns to base)
```

### Focus State (Keyboard)
```
Background:   #D97706  (amber-600)
Border:       #B45309  (amber-700)
Text:         #FFFFFF  (white)
Icon:         #FFFFFF  (white)
Focus Ring:   #F59E0B (amber-500) - 2px with 2px offset
```

## Typography

```css
Font Family:    ui-monospace (SF Mono, Menlo, Consolas)
Font Size:      10px
Font Weight:    900 (black)
Text Transform: uppercase
Letter Spacing: 0.15em (15% of font size)
Line Height:    normal
```

**Example:**
```
Normal Text:     explore connections
Rendered:        E X P L O R E   C O N N E C T I O N S
```

## Icon Details

### Network Icon (Lucide React)
```
  ●━━━●
  ┃╲ ╱┃
  ┃ ● ┃  ← Represents interconnected nodes
  ┃╱ ╲┃
  ●━━━●
```

**Specifications:**
- Size: 16x16px (4 Tailwind units)
- Stroke Width: 2px (Lucide default)
- Color: Inherits from parent (white)
- Animation: Rotates 12deg on hover, scales 90% on active

## Layout Integration

### Desktop View (≥768px)
```
┌─────────────────────────────────────────────────────────────────┐
│  SUBJECT DOSSIER // napoleon-bonaparte-1769                     │
│  ┌────────┐                                                      │
│  │  USER  │  NAPOLEON BONAPARTE              [VERIFIED]         │
│  │  ICON  │                                                      │
│  └────────┘  French Emperor, 1769-1821                          │
│              ┌─────────────────────┐  ┌──────────────────────┐ │
│              │  PORTRAYALS: 156    │  │ [≋] EXPLORE          │ │
│              └─────────────────────┘  │     CONNECTIONS      │ │
│                                        └──────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                              ↑
                                         CTA Button
```

### Mobile View (<768px)
```
┌─────────────────────────────┐
│  SUBJECT DOSSIER            │
│  ┌──────┐                   │
│  │ USER │  NAPOLEON          │
│  │ ICON │  BONAPARTE         │
│  └──────┘                   │
│         French Emperor       │
│  ┌─────────────────────┐   │
│  │  PORTRAYALS: 156    │   │
│  └─────────────────────┘   │
│  ┌─────────────────────┐   │  ← Wraps to new line
│  │ [≋] EXPLORE         │   │
│  │     CONNECTIONS     │   │
│  └─────────────────────┘   │
└─────────────────────────────┘
```

## Interaction States Timeline

### Click Sequence
```
1. Initial State (t=0ms)
   Button: amber-600, no transform

2. Mouse Down (active state)
   Button: amber-700, translateY(0), scale icon 90%
   Duration: instant

3. Mouse Up + Click Event Fires
   Button: returns to default state
   Action: ScrollIntoView starts
   Duration: instant

4. Scroll Animation (t=0-800ms)
   Page: smooth scroll to graph section
   Duration: ~800ms (browser-dependent)

5. Highlight Ring Appears (t=800ms)
   Graph Section: amber-400 ring-4 ring-opacity-50
   Duration: instant

6. Highlight Ring Fades (t=800-2300ms)
   Graph Section: ring fades out via transition
   Duration: 1500ms

7. Final State (t=2300ms+)
   Graph visible, no ring, ready for interaction
```

## Accessibility Visual Indicators

### Keyboard Focus Ring
```
┌━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓  ← 2px amber-500 ring
┃ ┌───────────────────────────┐ ┃     with 2px offset
┃ │ [≋] EXPLORE CONNECTIONS   │ ┃
┃ └───────────────────────────┘ ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

### High Contrast Mode Compatibility
```
Button maintains strong contrast:
- Background-to-text: 4.5:1 minimum (amber vs white)
- Border provides clear boundary
- Icon stroke visible in all modes
```

## Animation Curves

### Hover Transition
```css
transition-timing-function: ease-in-out
duration: 200ms
properties: background-color, border-color, transform, box-shadow
```

### Scroll Behavior
```css
scroll-behavior: smooth
scroll-snap-align: start
scroll-margin-top: 2rem  /* accounts for sticky headers */
```

### Icon Rotation (Hover)
```
Initial:  0deg
Hover:    12deg clockwise
Timing:   200ms ease-in-out
```

### Icon Scale (Active)
```
Initial:  100%
Active:   90%
Timing:   instant
```

## Responsive Breakpoints

### Mobile (<640px)
- Button: full-width optional (currently auto-width)
- Text: remains visible (no truncation)
- Icon: remains at 16px
- Touch target: minimum 44px height ✓

### Tablet (640px-1024px)
- Button: auto-width in flex container
- Layout: wraps if needed
- All states functional

### Desktop (>1024px)
- Button: auto-width in flex container
- Hover effects active
- Mouse cursor changes to pointer

## Z-Index Hierarchy
```
Layer 0:  Page background
Layer 1:  Content sections
Layer 2:  Button (default)
Layer 3:  Button shadow (hover)
Layer 4:  Focus ring
Layer 5:  Highlight ring on graph section
```

## Print Styles (Optional)
```css
@media print {
  .explore-graph-button {
    display: none;  /* Hide interactive elements */
  }
}
```

## Design Tokens Reference

### Spacing
```
gap-2:     8px   (icon-to-text)
px-4:      16px  (horizontal padding)
py-2:      8px   (vertical padding)
scroll-mt-8: 32px  (scroll margin top)
```

### Border
```
border-2:  2px solid
rounded:   0.25rem (0 for Evidence Locker aesthetic)
```

### Shadow
```
shadow-md:  0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)
shadow-lg:  0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)
```

### Transforms
```
hover:-translate-y-0.5:  translateY(-2px)
active:translate-y-0:    translateY(0px)
```

## Component Variants (Future)

### Primary (Current)
- Amber background
- White text
- Network icon

### Secondary (Potential)
- Stone background
- Amber text
- Same icon

### Compact (Potential)
- Icon only
- Tooltip on hover
- Mobile-optimized

---

**Visual Design Completed:** 2026-02-02
**Design System:** Evidence Locker (Data Noir)
**Designer:** Claude Code
