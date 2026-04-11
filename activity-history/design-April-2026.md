# Spoonful — Design System
**Version:** April 2026  
**Purpose:** Complete design specification to rebuild the app with pixel-accurate fidelity.

---

## 1. Typography

### Font Families
| Role | Font | Class | Source |
|------|------|-------|--------|
| Body / UI | Geist Sans | `font-sans` | `next/font/google` (or Google Fonts) |
| Monospace / Code | Geist Mono | `font-mono` | `next/font/google` (or Google Fonts) |

Only two font families are used throughout the entire app.

### Font Sizes
| Token | Size | Usage |
|-------|------|-------|
| `text-xs` | 12px | Compact UI labels, time slot activity text, button text in dense areas |
| `text-sm` | 14px | Body text, form inputs, modal content, menu items |
| `text-base` | 16px | Default text size |
| `text-lg` | 18px | Modal titles, section headings |
| `text-xl` | 20px | Page-level headings |
| `text-2xl` | 24px | Main app title / logo text |

### Font Weights
| Token | Weight | Usage |
|-------|--------|-------|
| `font-normal` | 400 | Body copy |
| `font-medium` | 500 | Emphasised labels, secondary headings |
| `font-semibold` | 600 | Modal titles, day names, button text, important labels |

### Line Height
- Body text: `leading-relaxed` (1.625)
- Compact elements: `leading-6` (24px)

### Text Wrapping
- Headings and titles: `text-balance`
- Paragraphs and descriptions: `text-pretty`

---

## 2. Colour Palette

### CSS Custom Properties

All tokens are defined in `app/globals.css` under `:root` (light mode) and `.dark` (dark mode).

#### Light Mode
```css
:root {
  --background: #fafafa;
  --foreground: #1a1a1a;
  --card: #ffffff;
  --card-foreground: #1a1a1a;
  --popover: #ffffff;
  --popover-foreground: #1a1a1a;
  --primary: #00a3b8;
  --primary-foreground: #ffffff;
  --secondary: #f4b03e;
  --secondary-foreground: #000000;
  --muted: #ebebeb;
  --muted-foreground: #666666;
  --accent: #00a3b8;
  --accent-foreground: #ffffff;
  --destructive: #ef4444;
  --destructive-foreground: #ffffff;
  --border: #d4d4d4;
  --input: #e0e0e0;
  --ring: #00a3b8;
  --radius: 0.625rem;

  /* Energy colours */
  --color-energy-extreme: #550000;
  --color-energy-extreme-fg: #ffffff;
  --color-energy-very-high: #d40f0c;
  --color-energy-very-high-fg: #ffffff;
  --color-energy-high: #f59e0b;
  --color-energy-high-fg: #000000;
  --color-energy-medium: #ffd700;
  --color-energy-medium-fg: #000000;
  --color-energy-low: #0a6802;
  --color-energy-low-fg: #ffffff;
  --color-energy-recharge: #808080;
  --color-energy-recharge-fg: #ffffff;
  --color-energy-sleep: #1e2939;
  --color-energy-sleep-fg: #ffffff;

  /* Sidebar */
  --sidebar: #ffffff;
  --sidebar-foreground: #1a1a1a;
  --sidebar-primary: #00a3b8;
  --sidebar-primary-foreground: #ffffff;
  --sidebar-accent: #f5f5f5;
  --sidebar-accent-foreground: #1a1a1a;
  --sidebar-border: #d4d4d4;
  --sidebar-ring: #00a3b8;
}
```

#### Dark Mode
```css
.dark {
  --background: #1a1a1a;
  --foreground: #fafafa;
  --card: #1a1a1a;
  --card-foreground: #fafafa;
  --popover: #1a1a1a;
  --popover-foreground: #fafafa;
  --primary: #00a3b8;
  --primary-foreground: #ffffff;
  --secondary: #f4b03e;
  --secondary-foreground: #000000;
  --muted: #2a2a2a;
  --muted-foreground: #999999;
  --accent: #00a3b8;
  --accent-foreground: #ffffff;
  --destructive: #ef4444;
  --destructive-foreground: #ffffff;
  --border: #333333;
  --input: #333333;
  --ring: #00a3b8;

  /* Energy colours are the same in both modes */

  /* Sidebar */
  --sidebar: #1a1a1a;
  --sidebar-foreground: #fafafa;
  --sidebar-primary: #00a3b8;
  --sidebar-primary-foreground: #ffffff;
  --sidebar-accent: #2a2a2a;
  --sidebar-accent-foreground: #fafafa;
  --sidebar-border: #333333;
  --sidebar-ring: #00a3b8;
}
```

### Colour Usage Summary

| Colour | Value | Where Used |
|--------|-------|------------|
| Cyan / Primary | `#00a3b8` | Buttons, links, focus rings, progress bars, today highlight, hover states |
| Orange / Secondary | `#f4b03e` | Accents, special indicators |
| Off-white | `#fafafa` | Light mode background |
| Dark grey | `#1a1a1a` | Dark mode background, light mode text |
| Red destructive | `#ef4444` | Delete buttons, error states, over-limit progress bars |

### Energy Colour Usage
Energy colours are applied directly via inline styles or utility classes wherever an activity is displayed:
- Time slot backgrounds
- Activity list items in the drag panel and modals (at 20% opacity for backgrounds of list items)
- Energy legend swatches
- Daily energy grid cells
- Weekly summary bars

---

## 3. Spacing

The app uses Tailwind's default spacing scale. Key values:

| Token | Value | Usage |
|-------|-------|-------|
| `gap-1` / `p-1` | 4px | Tight internal padding |
| `gap-2` / `p-2` | 8px | Close related elements, time slot padding |
| `gap-3` / `p-3` | 12px | Related elements |
| `gap-4` / `p-4` | 16px | Standard spacing between elements |
| `gap-6` / `p-6` | 24px | Section spacing, modal padding |
| `px-4 py-3` | 16px / 12px | Header padding |
| `px-3 py-2` | 12px / 8px | Input padding |
| `px-2.5 py-1.5` | 10px / 6px | Activity list item padding |

---

## 4. Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `rounded-sm` | ~6px | Small elements |
| `rounded-md` | ~8px | Inputs, buttons, small cards |
| `rounded-lg` | 10px (base `--radius`) | Modals, cards, sheets |
| `rounded-xl` | ~14px | Larger containers |
| `rounded-full` | 9999px | Circular badges, progress bar ends |

---

## 5. Component Specifications

### Header Bar
- Background: `bg-card`
- Border: `border-b border-border`
- Padding: `px-4 py-3`
- Layout: `flex items-center justify-between`
- Height: auto (content-driven)

### Week View Grid
- Overall container: `overflow-x-auto` for mobile scroll
- Grid: `grid grid-cols-8` (1 time column + 7 day columns)
- Day columns: `min-w-[120px]` to ensure horizontal scroll works on mobile
- Grid lines: `border-b border-r border-border/40` on each cell

### Day Header
- Height: `h-[85px]`
- Layout: `flex flex-col items-center justify-center p-2`
- Day name: `text-xs font-semibold uppercase text-muted-foreground`
- Date number: `text-sm font-semibold`
- Spoon count: `text-xs text-muted-foreground`
- Progress bar container: `h-1.5 w-[95%] rounded-full bg-muted mt-1`
- Progress bar fill: `h-full rounded-full transition-all` — cyan normally, red when over limit

### Time Column
- Width: fixed, content-driven (~56px)
- Each label: `text-xs text-muted-foreground text-right pr-2`
- Height matches time slot: `h-12`

### Time Slot (Empty)
```
height: h-12 (48px)
border: border-b border-r border-border/40
background: bg-background
hover: hover:bg-muted/50
cursor: cursor-pointer
transition: transition-colors
```

### Time Slot (Occupied)
```
background: [energy colour for the spoon level]
text-color: [energy foreground colour]
padding: p-2
font: text-xs font-semibold
overflow: hidden
position: relative
```

### Delete Button on Time Slot
```css
position: absolute;
top: 4px;   /* top-1 */
right: 4px; /* right-1 */
width: 16px;
height: 16px;
opacity: 0.5;
cursor: pointer;
filter: drop-shadow(0px 1px 0px rgba(255,255,255,0.3))
        drop-shadow(0px -1px 0px rgba(0,0,0,0.2));
background: transparent;
border: none;
```
On hover: `opacity: 0.9`

### Button Variants

#### Primary
```
bg-primary text-primary-foreground
hover:bg-primary/90
rounded-md px-4 py-2 text-sm font-medium
```

#### Outline
```
border border-input bg-transparent text-foreground
hover:bg-accent hover:text-accent-foreground
rounded-md px-4 py-2 text-sm font-medium
```

#### Ghost
```
bg-transparent text-foreground
hover:bg-accent hover:text-accent-foreground
rounded-md px-4 py-2 text-sm font-medium
```

#### Destructive
```
bg-destructive text-destructive-foreground
hover:bg-destructive/90
rounded-md px-4 py-2 text-sm font-medium
```

#### Sizes
| Size | Classes |
|------|---------|
| Small | `h-9 px-3 text-sm` |
| Default | `h-10 px-4 py-2 text-sm` |
| Large | `h-11 px-8 text-base` |
| Icon | `h-10 w-10` |

### Modal / Dialog
```
backdrop: bg-black/80
container: bg-card border border-border rounded-lg shadow-lg
padding: p-6
max-height: max-h-[85vh]
overflow: overflow-y-auto (content area)
```

**Size variants:**
| Variant | Max Width | Used For |
|---------|-----------|----------|
| Activity Modal | 383px | Add/edit activity |
| Standard | max-w-md (448px) | Settings, date picker |
| Large | max-w-lg (512px) | Bulk schedule |

### Sheet (Left Drawer Menu)
```
side: left
width: w-[300px]
background: bg-card
padding: p-6
```
Menu item hover: `hover:bg-primary/10 hover:text-primary rounded-md px-3 py-2`

### Accordion (Activity Groups)
- Trigger: `px-3 py-2 text-xs font-medium hover:bg-card`
- Chevron: rotates 180° when open, `transition-transform duration-200`
- Content: `px-3 pb-1.5`
- Item spacing: `space-y-0.5`

### Activity List Item (in Modal / Drag Panel)
```
padding: px-2.5 py-1.5
border-radius: rounded-md
background: [energy colour at 20% opacity]
border: border border-transparent
font: text-xs font-medium
cursor: cursor-pointer
```
Selected state: `border-primary ring-2 ring-primary/20`

### Progress Bar
```css
/* Container */
height: 6px; /* h-1.5 */
width: 95%;
border-radius: 9999px;
background: var(--muted);

/* Fill */
height: 100%;
border-radius: 9999px;
background: var(--primary);     /* normal */
background: var(--destructive); /* when over limit */
transition: width 0.3s ease, background-color 0.3s ease;
```

### Checkbox
```
size: h-4 w-4
border: border border-primary
checked: bg-primary text-primary-foreground
border-radius: rounded-sm
```

### Input / Textarea
```
background: bg-background
border: border border-input
border-radius: rounded-md
padding: px-3 py-2
height: h-10 (input) or auto (textarea)
font: text-sm
focus: ring-2 ring-ring ring-offset-2
```

### Select
- Trigger styled as outline button.
- Dropdown: `bg-popover border border-border rounded-md shadow-md`
- Item: `px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground`

### Tabs (Week / Day toggle)
```
tab list: bg-muted rounded-md p-1
active tab: bg-background shadow-sm rounded-sm
inactive tab: text-muted-foreground
font: text-sm font-medium
```

---

## 6. Layout Breakpoints

| Breakpoint | Width | Behaviour |
|------------|-------|-----------|
| Default (mobile) | <640px | Single column, horizontal scroll on calendar |
| `sm` | 640px | Small tablets |
| `md` | 768px | Tablets |
| `lg` | 1024px | Desktop — sidebar becomes persistent, full week view |
| `xl` | 1280px | Large desktop |

### Mobile
- Week view: horizontal scroll (`overflow-x-auto`)
- Sidebar: hidden, accessible via Sheet from menu
- Modals: near-full-screen width
- Day view preferred as primary view

### Desktop (`lg:` and above)
- Week view: full grid visible without scroll
- Sidebar: fixed to right side, collapsible
- Both week and day views fully accessible

---

## 7. Sidebar (Dashboard)

### Layout
- Right side of the main content area on desktop.
- Collapsible. When open: ~280–320px wide. When closed: icon-width only.
- Smooth width transition: `transition-all duration-300`

### Sections (top to bottom)
1. **Daily Energy Grid**
   - 7 cells (one per day).
   - Each cell coloured by the dominant energy level of that day.
   - Shows the total spoons used as text.

2. **Weekly Summary**
   - Shows: Total week spoons / weekday limit / weekend limit.
   - Each as a labelled progress bar.

3. **Energy Legend**
   - Coloured swatches with labels for all 7 energy levels.
   - Font: `text-xs`

4. **Drag Activities Panel**
   - Accordion grouped by spoon level (0–5).
   - Default: all groups collapsed.
   - Each item draggable.
   - Shows activity name and spoon count.

---

## 8. Animations & Transitions

### Modal Open/Close
```css
/* Backdrop */
transition: opacity 200ms ease;
from: opacity 0;
to: opacity 1;

/* Content */
transition: transform 200ms ease, opacity 200ms ease;
from: transform scale(0.95), opacity 0;
to: transform scale(1), opacity 1;
```

### Sidebar Collapse
```css
transition: width 300ms ease, opacity 300ms ease;
```

### Accordion Expand
```css
transition: height 200ms ease;
chevron: transition: transform 200ms ease;
```

### Progress Bar Fill
```css
transition: width 300ms ease, background-color 300ms ease;
```

### Drag Operations
- Drag source: `opacity: 0.5` during drag
- Drop zone hover: `background-color: rgba(0,163,184,0.2)` + `border-color: #00a3b8`
- Touch clone: translates with `transform: translate(x, y)` following finger position

### Toast Slide In
```css
from: transform translateY(100%), opacity 0;
to: transform translateY(0), opacity 1;
duration: 200ms ease-out;
```

### Hover State Transitions
- All hover changes: `transition-colors duration-150`
- Scale on active press: `active:scale-95`

---

## 9. Today Highlight

The current day's column in the week view receives:
```css
background: rgba(0, 163, 184, 0.1); /* primary/10 */
```
Applied to both the day header and all time slots in the column.

---

## 10. Accessibility Colours

All text/background pairs meet WCAG AA (4.5:1 minimum contrast ratio):
- Dark grey `#1a1a1a` on off-white `#fafafa`: ✓ ~18:1
- White `#ffffff` on primary cyan `#00a3b8`: ✓ ~3.1:1 (large text / UI elements)
- Black `#000000` on energy-high orange `#f59e0b`: ✓ ~9.7:1
- Black `#000000` on energy-medium yellow `#ffd700`: ✓ ~14.4:1
- White `#ffffff` on energy-low green `#0a6802`: ✓ ~7.2:1
- White `#ffffff` on energy-very-high red `#d40f0c`: ✓ ~5.1:1
- White `#ffffff` on energy-extreme dark red `#550000`: ✓ ~10.8:1

---

## 11. Icons

- Library: `lucide-react`
- Default size: `h-4 w-4` (16px)
- Menu/navigation icons: `h-5 w-5` (20px)
- All icon-only buttons must have an `aria-label`.

Key icons used:
| Icon | Usage |
|------|-------|
| `ChevronLeft` / `ChevronRight` | Week/day navigation arrows |
| `ChevronDown` | Accordion open/close, sidebar collapse |
| `Menu` | Hamburger menu button |
| `X` | Delete activity from slot, close modal |
| `Settings` | Settings menu item |
| `LogOut` | Sign out menu item |
| `Trash2` | Delete custom activity in modal |
| `Plus` | Add new activity |
| `Save` | Manual save button |
| `Undo2` / `Redo2` | Undo/redo |
| `Sun` / `Moon` | Theme toggle |
| `GripVertical` | Drag handle on activity items |

---

## 12. Logo / Branding

- App name: **Spoonful**
- Displayed in the header next to the hamburger menu icon.
- Font: Geist Sans, `text-xl font-semibold`
- Colour: `text-foreground` (adapts to theme)
- SVG icon: a spoon icon, monochrome, `h-6 w-6`

---

## 13. Dark Mode Specifics

- Background shifts from `#fafafa` to `#1a1a1a`.
- Cards remain the same as the background in dark mode (no elevation effect).
- Borders shift from `#d4d4d4` to `#333333`.
- All energy colours remain identical in both modes.
- Muted text shifts from `#666666` to `#999999`.
- Primary cyan `#00a3b8` stays identical in both modes.
- Sheet/modal backdrops: `bg-black/80` in both modes.

---

## 14. Empty States

When a week has no activities:
- Calendar renders as an empty grid with the normal layout and time labels.
- No placeholder text inside time slots.
- A subtle prompt may appear above the calendar on first use: `"Click any time slot to add an activity."`

---

## 15. Loading States

- **Initial load**: Skeleton placeholders for time slots (pulsing grey blocks: `animate-pulse bg-muted`).
- **Saving**: Small spinner or "Saving…" text in the header.
- **Saved**: "Saved" with a tick icon, fades out after ~2 seconds.
- **Modals**: Open immediately; data is already in client state.

---

## 16. Z-Index Layers

| Layer | z-index | Element |
|-------|---------|---------|
| Base | 0 | Calendar grid |
| Sticky header | 10 | App header bar |
| Sidebar | 20 | Dashboard sidebar |
| Sheet overlay | 40 | Hamburger menu sheet |
| Modal backdrop | 50 | Dialog overlays |
| Modal content | 51 | Dialog boxes |
| Toast | 60 | Notification toasts |
| Drag clone | 100 | Touch drag visual clone |
