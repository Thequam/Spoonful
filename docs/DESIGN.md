# Energy Pacing Timetable - Design System Documentation

## Typography

### Font Families
- **Primary Font**: Geist Sans (`--font-geist-sans`)
  - Used for: All body text, headings, UI elements
  - Implementation: `font-sans` class
  - Weights: Regular (400), Medium (500), Semibold (600)
  - Loading: Next.js font optimization
  - Source: `next/font/google`

- **Monospace Font**: Geist Mono (`--font-geist-mono`)
  - Used for: Code, technical data, timestamps
  - Implementation: `font-mono` class
  - Source: `next/font/google`

### Font Configuration
\`\`\`typescript
// app/layout.tsx
import { Geist, Geist_Mono } from 'next/font/google'

const geistSans = Geist({ subsets: ['latin'] })
const geistMono = Geist_Mono({ subsets: ['latin'] })
\`\`\`

### Font Sizes & Hierarchy
- **Extra Small**: `text-xs` (12px) - Used for compact UI elements, button text
- **Small**: `text-sm` (14px) - Used for body text, form inputs
- **Base**: `text-base` (16px) - Default text size
- **Large**: `text-lg` (18px) - Used for modal titles, section headers
- **Extra Large**: `text-xl` (20px) - Used for page titles
- **2XL**: `text-2xl` (24px) - Used for main headers

### Font Weights
- **Normal**: `font-normal` (400) - Body text
- **Medium**: `font-medium` (500) - Emphasized text
- **Semibold**: `font-semibold` (600) - Headers, buttons, important labels

### Line Height
- **Relaxed**: `leading-relaxed` (1.625) - Body text for readability
- **Leading-6**: `leading-6` (24px) - Compact spacing

### Text Utilities
- **Text Balance**: `text-balance` - Optimal line breaks for headings
- **Text Pretty**: `text-pretty` - Improved wrapping for paragraphs

## Color Palette

### Design System Colors

#### Primary Colors
**Light Mode:**
- Primary: `#00a3b8` (Cyan Blue)
- Primary Foreground: `#ffffff` (White)

**Dark Mode:**
- Primary: `#00a3b8` (Cyan Blue - same as light)
- Primary Foreground: `#ffffff` (White)

**Usage:** Buttons, links, active states, progress indicators, today highlight

#### Secondary Colors
**Light Mode:**
- Secondary: `#f4b03e` (Orange/Gold)
- Secondary Foreground: `#000000` (Black)

**Dark Mode:**
- Secondary: `#f4b03e` (Orange/Gold)
- Secondary Foreground: `#000000` (Black)

**Usage:** Accents, highlights, special indicators

#### Background & Surface Colors
**Light Mode:**
- Background: `#fafafa` (Off-white)
- Card: `#ffffff` (Pure white)
- Popover: `#ffffff` (Pure white)
- Muted: `#ebebeb` (Light grey)

**Dark Mode:**
- Background: `#1a1a1a` (Very dark grey)
- Card: `#1a1a1a` (Same as background)
- Popover: `#1a1a1a` (Same as background)
- Muted: `#2a2a2a` (Medium dark grey)

#### Text Colors
**Light Mode:**
- Foreground: `#1a1a1a` (Dark grey)
- Muted Foreground: `#666666` (Medium grey)

**Dark Mode:**
- Foreground: `#fafafa` (Off-white)
- Muted Foreground: `#999999` (Light grey)

#### Border & Input Colors
**Light Mode:**
- Border: `#d4d4d4` (Light border grey)
- Input: `#e0e0e0` (Light input grey)
- Ring: `#00a3b8` (Primary - for focus states)

**Dark Mode:**
- Border: `#333333` (Dark border grey)
- Input: `#333333` (Dark input grey)
- Ring: `#00a3b8` (Primary - for focus states)

#### Accent Colors
**Light Mode:**
- Accent: `#00a3b8` (Teal - matches primary)
- Accent Foreground: `#ffffff` (White)

**Dark Mode:**
- Accent: `#00a3b8` (Teal - matches primary)
- Accent Foreground: `#ffffff` (White)

#### Destructive Colors (Error/Delete)
**Both Modes:**
- Destructive: `#ef4444` (Red)
- Destructive Foreground: `#ffffff` (White)

**Usage:** Delete buttons, error messages, warnings

### Energy Level Colors (Spoons Theory)

These colors represent different energy expenditure levels and are central to the app's functionality.

#### Extreme Energy (5+ Spoons)
**Light Mode:**
- Background: `#550000` (Dark red)
- Foreground: `#ffffff` (White)

**Dark Mode:**
- Background: `#550000` (Dark red)
- Foreground: `#ffffff` (White)

**CSS Variable:** `--color-energy-extreme`, `--color-energy-extreme-fg`

#### Very High Energy (4 Spoons)
**Light Mode:**
- Background: `#d40f0c` (Bright red)
- Foreground: `#ffffff` (White)

**Dark Mode:**
- Background: `#d40f0c` (Bright red)
- Foreground: `#ffffff` (White)

**CSS Variable:** `--color-energy-very-high`, `--color-energy-very-high-fg`

#### High Energy (3 Spoons)
**Light Mode:**
- Background: `#f59e0b` (Orange)
- Foreground: `#000000` (Black)

**Dark Mode:**
- Background: `#f59e0b` (Orange)
- Foreground: `#000000` (Black)

**CSS Variable:** `--color-energy-high`, `--color-energy-high-fg`

#### Medium Energy (2 Spoons)
**Light Mode:**
- Background: `#ffd700` (Bright yellow/gold)
- Foreground: `#000000` (Black)

**Dark Mode:**
- Background: `#ffd700` (Bright yellow/gold)
- Foreground: `#000000` (Black)

**CSS Variable:** `--color-energy-medium`, `--color-energy-medium-fg`

#### Low Energy (1 Spoon)
**Light Mode:**
- Background: `#0a6802` (Dark green)
- Foreground: `#ffffff` (White)

**Dark Mode:**
- Background: `#0a6802` (Dark green)
- Foreground: `#ffffff` (White)

**CSS Variable:** `--color-energy-low`, `--color-energy-low-fg`

#### Recharge (0 Spoons)
**Light Mode:**
- Background: `#808080` (Medium grey)
- Foreground: `#ffffff` (White)

**Dark Mode:**
- Background: `#808080` (Medium grey)
- Foreground: `#ffffff` (White)

**CSS Variable:** `--color-energy-recharge`, `--color-energy-recharge-fg`

#### Sleep (0 Spoons - Special)
**Both Modes:**
- Background: `#1e2939` (Dark blue-grey)
- Foreground: `#ffffff` (White)

**CSS Variable:** `--color-energy-sleep`, `--color-energy-sleep-fg`
**Usage:** Specifically for sleep activities (subset of 0 spoons)

### Sidebar Colors
**Light Mode:**
- Sidebar: `#ffffff` (White)
- Sidebar Foreground: `#1a1a1a` (Dark grey)
- Sidebar Primary: `#00a3b8` (Cyan)
- Sidebar Primary Foreground: `#ffffff` (White)
- Sidebar Accent: `#f5f5f5` (Very light grey)
- Sidebar Accent Foreground: `#1a1a1a` (Dark grey)
- Sidebar Border: `#d4d4d4` (Light grey)
- Sidebar Ring: `#00a3b8` (Cyan)

**Dark Mode:**
- Sidebar: `#1a1a1a` (Dark grey)
- Sidebar Foreground: `#fafafa` (Off-white)
- Sidebar Primary: `#00a3b8` (Cyan)
- Sidebar Primary Foreground: `#ffffff` (White)
- Sidebar Accent: `#2a2a2a` (Medium dark grey)
- Sidebar Accent Foreground: `#fafafa` (Off-white)
- Sidebar Border: `#333333` (Dark grey)
- Sidebar Ring: `#00a3b8` (Cyan)

## Layout & Spacing

### Container System
- **Main Container**: `container mx-auto px-4` - Centered with horizontal padding
- **Responsive Padding**: Adjusts based on screen size
- **Max Width**: Automatically constrains on large screens

### Grid System
- **Base Grid**: `grid gap-6` - 24px gap between major sections
- **Calendar Grid**: 
  - Mobile: `grid-cols-1` - Single column
  - Desktop: `lg:grid-cols-4` - 4 columns (sidebar + 3 sections)
- **Weekly Calendar**: 
  - 8 columns: 1 for time labels + 7 for days
  - Mobile: Scrollable horizontal overflow

### Spacing Scale (Tailwind)
- `gap-1`: 4px - Tight spacing
- `gap-2`: 8px - Close elements
- `gap-3`: 12px - Related elements
- `gap-4`: 16px - Standard spacing
- `gap-6`: 24px - Section spacing
- `p-2`: 8px padding
- `p-3`: 12px padding
- `p-4`: 16px padding
- `p-6`: 24px padding
- `py-2`: 8px vertical padding
- `py-6`: 24px vertical padding

### Component-Specific Spacing
- **Modal Padding**: `p-6` (24px)
- **Card Padding**: `p-4` (16px)
- **Button Padding**: `px-3 py-1.5` (12px horizontal, 6px vertical)
- **Time Slot Height**: `h-12` (48px) - Adequate for touch targets
- **Day Header Height**: `h-[85px]` (85px) - Shows day info and progress

### Border Radius
- **Base Radius**: `0.625rem` (10px) - `--radius`
- **Small Radius**: `calc(0.625rem - 4px)` (6px) - `rounded-sm`
- **Medium Radius**: `calc(0.625rem - 2px)` (8px) - `rounded-md`
- **Large Radius**: `0.625rem` (10px) - `rounded-lg`
- **XL Radius**: `calc(0.625rem + 4px)` (14px) - `rounded-xl`
- **Full Radius**: `9999px` - `rounded-full` (for circles)

### Sidebar Behavior
- **Desktop**: Always visible, collapsible
- **Mobile**: Hidden by default, accessible via sheet/drawer
- **Transition**: `transition-all duration-300` - Smooth collapse animation
- **Width**: Adjusts based on collapsed state

## Component Styling

### Buttons

#### Primary Button
- **Background**: `bg-primary` (Cyan)
- **Text**: `text-primary-foreground` (White)
- **Hover**: `hover:bg-primary/90` (Slightly darker)
- **Padding**: `px-4 py-2` (default size)
- **Border Radius**: `rounded-md`
- **Font**: `text-sm font-medium`

#### Outline Button
- **Background**: `bg-transparent` (Transparent)
- **Border**: `border border-input`
- **Text**: `text-foreground`
- **Hover**: `hover:bg-accent hover:text-accent-foreground`
- **Usage**: Secondary actions, less emphasis

#### Ghost Button
- **Background**: `bg-transparent` (Transparent)
- **No Border**: No visible border
- **Text**: `text-foreground`
- **Hover**: `hover:bg-accent hover:text-accent-foreground`
- **Usage**: Minimal actions, icon buttons

#### Destructive Button
- **Background**: `bg-destructive` (Red)
- **Text**: `text-destructive-foreground` (White)
- **Hover**: `hover:bg-destructive/90`
- **Usage**: Delete, remove, dangerous actions

#### Button Sizes
- **Small**: `h-9 px-3` - Compact interface
- **Default**: `h-10 px-4 py-2` - Standard size
- **Large**: `h-11 px-8` - Prominent actions
- **Icon**: `h-10 w-10` - Square icon button

### Cards & Containers

#### Card
- **Background**: `bg-card` (White/Dark grey)
- **Border**: `border border-border`
- **Border Radius**: `rounded-lg`
- **Padding**: `p-6` (content), `p-4` (compact)
- **Shadow**: Minimal, mostly flat design
- **Text**: `text-card-foreground`

#### Card Header
- **Padding**: `p-6`
- **Flex**: `flex flex-col space-y-1.5`

#### Card Title
- **Font**: `text-2xl font-semibold leading-none tracking-tight`

#### Card Description
- **Font**: `text-sm text-muted-foreground`

#### Card Content
- **Padding**: `p-6 pt-0` (no top padding if after header)

### Time Slots (Calendar)

#### Base Time Slot
- **Height**: `h-12` (48px) - Touch-friendly
- **Border**: `border-b border-r border-border/40` - Subtle grid lines
- **Background**: `bg-background` (default)
- **Hover**: `hover:bg-muted/50` - Feedback on interaction
- **Cursor**: `cursor-pointer` - Indicates clickability
- **Transition**: `transition-colors` - Smooth color changes

#### Time Slot with Activity
- **Background**: Energy color based on spoon level
- **Text Color**: Corresponding foreground color
- **Padding**: `p-2` (8px)
- **Font**: `text-xs font-semibold`
- **Border Radius**: None (grid cell)
- **Delete Button**: Debossed X in top-right corner
  - Opacity: `opacity-50` (default), `hover:opacity-90`
  - Position: `absolute top-1 right-1`
  - No background, only drop-shadow effect
  - Filter: `drop-shadow(0px 1px 0px rgba(255,255,255,0.3)) drop-shadow(0px -1px 0px rgba(0,0,0,0.2))`

#### Time Slot - Drag Over
- **Background**: `bg-primary/20` - Cyan tint
- **Border**: `border-primary` - Highlighted border
- **Visual Feedback**: Shows valid drop zone

### Modals & Overlays

#### Dialog/Modal
- **Backdrop**: `bg-black/80` - Semi-transparent overlay
- **Container**: `bg-card border border-border`
- **Max Width**: 
  - Small: `max-w-[383px]` - Activity modal (reduced 5% from 403px)
  - Medium: `max-w-md` (448px) - Standard modals
  - Large: `max-w-lg` (512px) - Bulk schedule
  - Extra Large: `max-w-2xl` (672px) - Wide modals
- **Max Height**: `max-h-[85vh]` - Fits on screen
- **Border Radius**: `rounded-lg`
- **Padding**: `p-6`
- **Shadow**: `shadow-lg`
- **Positioning**: Centered with flexbox

#### Modal Header
- **Padding**: `pb-4` - Space below title
- **Title**: `text-lg font-semibold`
- **Description**: `text-sm text-muted-foreground`

#### Modal Content
- **Scrollable**: `overflow-y-auto` - Handles long content
- **Flex Layout**: `flex-1 flex flex-col` - Flexible height

#### Sheet (Mobile Menu)
- **Side**: `side="left"` - Slides from left
- **Width**: `w-[300px]` - Fixed width
- **Background**: `bg-card`
- **Padding**: `p-6`

### Navigation Elements

#### Header
- **Background**: `bg-card`
- **Border**: `border-b border-border`
- **Height**: Auto, responsive padding
- **Flex Layout**: `flex items-center justify-between`
- **Padding**: `px-4 py-3`

#### Navigation Buttons
- **Style**: Outline variant
- **Icon Size**: `h-4 w-4` (16px)
- **Hover**: Cyan primary color on hover
- **Active States**: `bg-primary text-primary-foreground`

#### Week/Day Toggle
- **Tabs**: Radix UI tabs component
- **Active Tab**: `bg-background shadow-sm` (card-like)
- **Inactive Tab**: `text-muted-foreground`
- **Border**: Clean separation between options

### Form Elements

#### Input
- **Background**: `bg-background`
- **Border**: `border border-input`
- **Border Radius**: `rounded-md`
- **Padding**: `px-3 py-2`
- **Height**: `h-10` (default), `h-9` (compact)
- **Font**: `text-sm`
- **Focus**: `focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2`
- **Disabled**: `disabled:cursor-not-allowed disabled:opacity-50`

#### Textarea
- **Similar to Input**: Same base styling
- **Min Height**: `min-h-[80px]` or custom rows
- **Resize**: `resize-none` or `resize-vertical`

#### Select
- **Trigger**: Styled like button
- **Content**: Dropdown with border and shadow
- **Item**: `px-2 py-1.5` with hover state
- **Height**: `h-10` (default), `h-9` (compact)

#### Label
- **Font**: `text-sm font-medium`
- **Color**: `text-foreground`
- **Margin**: `mb-2` (when above input)

#### Checkbox
- **Size**: `h-4 w-4`
- **Border**: `border border-primary`
- **Checked**: `bg-primary text-primary-foreground`
- **Border Radius**: `rounded-sm`

### Progress Indicators

#### Day Header Progress Bar
- **Container**: `h-1.5 w-[95%] rounded-full bg-muted`
- **Fill**: `h-full rounded-full transition-all`
- **Color**: 
  - Normal: `bg-primary` (Cyan)
  - Over Limit: `bg-destructive` (Red)
- **Width**: Dynamic based on percentage (e.g., `style={{ width: '60%' }}`)

### Accordion (Activity Grouping)

#### Trigger
- **Padding**: `px-3 py-2` (compact)
- **Hover**: `hover:bg-card`
- **Icon**: Chevron down, rotates on open
- **Font**: `text-xs font-medium`

#### Content
- **Padding**: `px-3 pb-1.5`
- **Space Between Items**: `space-y-0.5`
- **Animation**: Smooth expand/collapse

#### Activity Item
- **Padding**: `px-2.5 py-1.5`
- **Border Radius**: `rounded-md`
- **Background**: Energy color at 20% opacity
- **Border**: `border` (transparent or primary when selected)
- **Selected**: `border-primary ring-2 ring-primary/20`
- **Font**: `text-xs font-medium`
- **Delete Button**: `h-6 w-6` icon button

## Interactive States

### Hover Effects
- **Buttons**: Background color darkens or lightens (`/90` opacity)
- **Time Slots**: `hover:bg-muted/50` - Subtle grey tint
- **Menu Items**: `hover:bg-primary/10 hover:text-primary` - Cyan tint
- **Cards**: Optional subtle lift (`hover:shadow-md`)
- **Links**: `hover:underline`

### Focus States
- **Ring**: `focus:ring-2 focus:ring-ring focus:ring-offset-2`
- **Outline**: `outline-ring/50` - Semi-transparent outline
- **Color**: Uses primary color (`--ring`)
- **Accessibility**: Always visible for keyboard navigation

### Active States
- **Buttons**: `active:scale-95` - Subtle press effect
- **Today Column**: `bg-primary/10` - Cyan background tint
- **Selected Day**: Highlighted with primary color
- **Active Tab**: Card-like appearance with shadow

### Disabled States
- **Opacity**: `opacity-50` - Faded appearance
- **Cursor**: `cursor-not-allowed` - Visual feedback
- **Pointer Events**: `pointer-events-none` - Prevents interaction

### Loading States
- **Skeleton**: `animate-pulse bg-muted` - Pulsing grey placeholder
- **Spinner**: Rotating icon or CSS animation
- **Button Loading**: Disabled with spinner icon
- **Text**: "Loading..." or "Saving..." states

## Responsive Design

### Breakpoints (Tailwind Default)
- **Small (sm)**: `640px` - Small tablets
- **Medium (md)**: `768px` - Tablets
- **Large (lg)**: `1024px` - Desktops (primary breakpoint)
- **Extra Large (xl)**: `1280px` - Large desktops
- **2XL**: `1536px` - Extra large screens

### Mobile-First Approach
- Base styles target mobile devices
- Progressive enhancement for larger screens
- Use `lg:` prefix for desktop-specific styles

### Layout Adaptations

#### Calendar Grid
- **Mobile**: Single column, scrollable
- **Desktop**: Multi-column with sidebar

#### Sidebar
- **Mobile**: Hidden, accessible via sheet
- **Desktop**: Always visible, collapsible

#### Navigation
- **Mobile**: Compact header with hamburger menu
- **Desktop**: Full navigation with all controls

#### Time Slots
- **Mobile**: Larger touch targets (`h-12` minimum)
- **Desktop**: Can be slightly smaller if needed

### Mobile Optimizations
- **Touch Targets**: Minimum 44x44px (WCAG guidelines)
- **Font Sizes**: Minimum 16px for inputs (prevents zoom on iOS)
- **Spacing**: Adequate spacing for finger navigation
- **Scrolling**: Smooth momentum scrolling
- **Gestures**: Touch drag and drop support
- **Modals**: Full-screen or near full-screen on small devices

## Animation & Transitions

### Transition Properties
- **Duration**: 
  - Fast: `duration-150` (150ms) - Quick feedback
  - Standard: `duration-300` (300ms) - Default transitions
  - Slow: `duration-500` (500ms) - Emphasis
- **Easing**: Default CSS easing (`ease-in-out`)
- **Properties**: 
  - `transition-colors` - Color changes only
  - `transition-all` - All animatable properties

### Specific Animations

#### Sidebar Toggle
- **Width**: Animates between collapsed/expanded
- **Opacity**: Fades content in/out
- **Duration**: `duration-300`

#### Modal Appearance
- **Backdrop**: Fade in (`opacity-0` to `opacity-100`)
- **Content**: Scale and fade (`scale-95 opacity-0` to `scale-100 opacity-100`)
- **Duration**: `duration-300`

#### Drag Operations
- **Drag Start**: Opacity reduces to 50%
- **Drag Over**: Drop zone highlights
- **Drag End**: Smooth placement
- **Touch Clone**: Follows touch with `translate` transform

#### Accordion
- **Height**: Animates from 0 to auto
- **Opacity**: Content fades in
- **Icon**: Chevron rotates 180deg

#### Progress Bar
- **Width**: `transition-all` - Smooth fill animation
- **Color**: `transition-colors` - Smooth color change when over limit

#### Toast Notifications
- **Slide In**: From bottom or top
- **Fade Out**: Opacity to 0
- **Duration**: Auto-dismiss after 3-5 seconds

## Accessibility Features

### Color Contrast
- **WCAG AA Compliance**: All text meets minimum 4.5:1 ratio
- **Energy Colors**: Distinct enough for visibility
- **High Contrast**: Dark mode provides strong contrast
- **Colorblind Friendly**: Energy colors distinguishable by intensity

### Interactive Elements
- **Focus Indicators**: Clear ring around focused elements
- **Focus Visible**: Shows only for keyboard navigation
- **Tab Order**: Logical tab sequence
- **Keyboard Shortcuts**: Where applicable

### ARIA Attributes
- **Labels**: `aria-label` for icon buttons
- **Descriptions**: `aria-describedby` for context
- **Live Regions**: `aria-live` for dynamic updates
- **Expanded**: `aria-expanded` for collapsible elements
- **Selected**: `aria-selected` for choices
- **Disabled**: `aria-disabled` for disabled states

### Semantic HTML
- **Headings**: Proper h1-h6 hierarchy
- **Landmarks**: `<main>`, `<nav>`, `<aside>`
- **Lists**: `<ul>`, `<ol>` for groups
- **Buttons**: `<button>` not `<div>` with click handlers
- **Forms**: Proper `<form>`, `<label>`, `<input>` structure

### Screen Reader Support
- **Alt Text**: Images and icons have descriptive text
- **Labels**: All form inputs have associated labels
- **State Announcements**: Changes announced to screen readers
- **Skip Links**: Option to skip to main content
- **Role Attributes**: Proper ARIA roles where needed

## Implementation Details

### CSS Custom Properties
All design tokens defined in `app/globals.css`:

\`\`\`css
:root {
  --background: #fafafa;
  --foreground: #1a1a1a;
  --primary: #00a3b8;
  --radius: 0.625rem;
  /* ... all color and size variables */
}

.dark {
  --background: #1a1a1a;
  --foreground: #fafafa;
  /* ... dark mode overrides */
}
\`\`\`

### Tailwind Theme Integration
Tailwind v4 uses `@theme inline` to map CSS variables:

\`\`\`css
@theme inline {
  --color-background: var(--background);
  --color-primary: var(--primary);
  --radius-lg: var(--radius);
  /* ... all mappings */
}
\`\`\`

### Utility Classes

#### Scrollbar Hide
\`\`\`css
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
\`\`\`

#### Energy Color Classes
Dynamically applied via `getSpoonColor()` utility:
- Returns Tailwind classes based on spoon level
- Handles both background and foreground colors

### Component Consistency
- **shadcn/ui**: Base component library
- **Radix UI Primitives**: Unstyled accessible components
- **Custom Styling**: Tailwind classes for all styling
- **No Inline Styles**: Except for dynamic values (progress width, etc.)
- **Theme Integration**: All components respect light/dark mode

### Dark Mode Implementation
- **Strategy**: Class-based (`.dark` class on `<html>`)
- **Provider**: `next-themes` via `ThemeProvider`
- **Toggle**: `ThemeToggle` component
- **Persistence**: LocalStorage
- **System Preference**: Respects `prefers-color-scheme`

## Design Principles

### Simplicity
- Clean, uncluttered interface
- Focus on essential features
- Minimal decoration
- Clear visual hierarchy

### Consistency
- Reusable components
- Consistent spacing and sizing
- Predictable interactions
- Unified color palette

### Accessibility
- WCAG AA compliant
- Keyboard navigable
- Screen reader friendly
- High contrast options

### Responsiveness
- Mobile-first design
- Touch-friendly
- Adaptive layouts
- Progressive enhancement

### Performance
- Minimal animations
- Efficient rendering
- Lazy loading
- Optimized assets

## Design Tokens Summary

### Spacing Scale
\`\`\`
1 = 0.25rem (4px)
2 = 0.5rem (8px)
3 = 0.75rem (12px)
4 = 1rem (16px)
6 = 1.5rem (24px)
8 = 2rem (32px)
12 = 3rem (48px)
\`\`\`

### Font Scale
\`\`\`
xs = 0.75rem (12px)
sm = 0.875rem (14px)
base = 1rem (16px)
lg = 1.125rem (18px)
xl = 1.25rem (20px)
2xl = 1.5rem (24px)
\`\`\`

### Border Radius Scale
\`\`\`
sm = 6px
md = 8px
lg = 10px
xl = 14px
full = 9999px
\`\`\`

### Shadow Scale
\`\`\`
sm = 0 1px 2px 0 rgb(0 0 0 / 0.05)
md = 0 4px 6px -1px rgb(0 0 0 / 0.1)
lg = 0 10px 15px -3px rgb(0 0 0 / 0.1)
\`\`\`

## Component-Specific Design Notes

### Activity Cards
- Compact design with energy color background at 20% opacity
- Selected state shows full border and ring
- Delete button only on custom activities
- Hover state increases opacity

### Time Slots
- Grid-like appearance with subtle borders
- Filled slots show full energy color
- Delete X button uses debossed style (drop-shadow, no background)
- Empty slots show subtle hover state

### Day Headers
- Show day abbreviation, date, and spoon count
- Progress bar fills based on energy usage
- Today gets cyan background highlight
- Date is circled for current day

### Dashboard Sidebar
- Collapsible with smooth transition
- Energy legend always visible
- Drag activities panel starts collapsed
- Clean separation between sections

### Modals
- Centered positioning
- Semi-transparent backdrop
- Constrained width for readability
- Scrollable content area
- Action buttons at bottom

### Menu (Sheet)
- Slides from left
- Sections separated by dividers
- Hover states with cyan tint
- User name at top
- Clean, minimal design

This design system ensures consistency across the entire application while maintaining flexibility for future enhancements.
