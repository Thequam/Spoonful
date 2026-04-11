# Spoonful — Product Requirements Document
**Version:** April 2026  
**Purpose:** Complete specification to rebuild this application exactly as it stands, in any tech stack with any backend.

---

## 1. Product Overview

**Spoonful** is an energy-pacing timetable application for individuals managing chronic illness or fatigue using the Spoon Theory framework. Each "spoon" is a unit of energy. Users plan their week by assigning energy costs to time slots in a visual calendar and track how much energy they have used versus their daily and weekly limits.

The app has three primary views: a weekly calendar grid, a single-day calendar view, and a collapsible analytics sidebar. It also has a full authentication flow (sign up, login, sign out) and a settings system for personalising energy limits.

---

## 2. Core Concepts

### Spoon Scale
| Spoons | Label | Hex Color (Background) | Text Color |
|--------|-------|------------------------|------------|
| 5 | Extreme Energy | `#550000` | `#ffffff` |
| 4 | Very High Energy | `#d40f0c` | `#ffffff` |
| 3 | High Energy | `#f59e0b` | `#000000` |
| 2 | Medium Energy | `#ffd700` | `#000000` |
| 1 | Low Energy | `#0a6802` | `#ffffff` |
| 0 | Recharging | `#808080` | `#ffffff` |
| 0 (Sleep) | Sleep | `#1e2939` | `#ffffff` |

Sleep is a special sub-category of 0-spoon activities. When an activity is named "Sleep" it renders in dark blue-grey (`#1e2939`) instead of grey.

---

## 3. Authentication

### Pages
- `/auth/login` — Email + password login form
- `/auth/sign-up` — Email + password registration form
- `/auth/sign-up-success` — Confirmation page after registration
- `/` — Root page: checks auth state and redirects to `/app` (logged in) or `/auth/login` (logged out)

### Behaviour
- All routes under `/app` require authentication. Unauthenticated users are redirected to `/auth/login`.
- On successful sign-up, a user profile record is automatically created (via backend trigger or equivalent).
- The profile stores: `display_name`, `daily_limit` (default 18), `weekday_limit` (default 90), `weekend_limit` (default 36).
- Sign-out redirects to `/auth/login`.

### Auth Pages Design
- Centred single-column card layout.
- App logo/name at top.
- Email and password fields with labels.
- Primary action button (Sign In / Create Account).
- Link to switch between login and sign-up.
- Error messages displayed inline below the form.

---

## 4. Data Models

### Profile
```
id           UUID (primary key, linked to auth user)
display_name TEXT
daily_limit  INTEGER (default: 18)
weekday_limit INTEGER (default: 90)
weekend_limit INTEGER (default: 36)
created_at   TIMESTAMP
updated_at   TIMESTAMP
```

### Activity
```
id           UUID (primary key, auto-generated)
user_id      UUID (foreign key to profile)
name         TEXT (unique per user)
spoons       INTEGER (0–5)
category     TEXT (optional label)
description  TEXT (optional, nullable)
is_default   BOOLEAN (default: false)
created_at   TIMESTAMP
```

### Timetable Entry
```
id            UUID (primary key, auto-generated)
user_id       UUID (foreign key to profile)
week_start    DATE (Monday of the week, ISO format)
date          DATE (exact date of the slot)
day_name      TEXT (e.g. "Monday")
timeslot      TEXT (e.g. "06:00", "08:00")
activity_name TEXT
spoons        INTEGER (0–5)
created_at    TIMESTAMP
updated_at    TIMESTAMP
```

### Default Activities (Seeded on First Use)
The following 24 activities are pre-seeded for every new user. See `activity-history/activities-export.md` for the full list including all user-created activities.

| Name | Spoons |
|------|--------|
| Sleep | 0 |
| Rest in Bed | 0 |
| Deep Rest | 0 |
| Meditation | 0 |
| Gentle Stretching | 1 |
| Listening to Music | 1 |
| Reading | 1 |
| Short Phone Call | 1 |
| Quiet Social Interaction | 1 |
| House Chores | 2 |
| Light Cooking | 2 |
| Relaxing/TV | 2 |
| Light Socialising | 2 |
| Rest in Car | 2 |
| Laptop Work | 3 |
| Cooking Meal | 3 |
| Cleaning House | 3 |
| Shopping | 3 |
| Conversations/Meetings | 3 |
| Driving Long Distance | 4 |
| Gym/Exercise | 4 |
| Heavy Socialising | 4 |
| Hiking | 4 |
| Dancing | 4 |
| Long Distance Driving | 5 |
| Power Gym Session | 5 |
| Running Long Distance | 5 |
| Sports Match | 5 |

---

## 5. App Layout

### Overall Structure
```
Root Layout
├── Theme Provider (light/dark)
└── App Page (/app)
    ├── Calendar Header (top bar)
    ├── Main Content Area
    │   ├── Calendar (WeekView or DayView)
    │   └── Dashboard Sidebar (collapsible, right side on desktop)
    └── Modals (Activity, Bulk Schedule, Date Picker, Settings, Load Week)
```

### Header
- Fixed to top of the app.
- Left side: hamburger menu icon (opens Sheet from left), app logo/name "Spoonful".
- Centre: week date range display (e.g. "Feb 23 – Mar 1, 2026"), clickable to open date picker modal.
- Right side: previous week arrow, next week arrow, Week/Day toggle tabs.
- On mobile, the right-side controls collapse or reflow.

### Sidebar (Dashboard)
- Visible on desktop (right side), hidden on mobile (accessible via separate toggle).
- Collapsible with an arrow button. Animates open/closed with a smooth width transition.
- When collapsed, only shows icons.
- Contains:
  1. **Daily Energy Grid** — visual grid showing each day's spoon usage.
  2. **Weekly Summary** — totals for the week, weekday and weekend spoons used vs limits.
  3. **Energy Legend** — colour-coded key for all spoon levels.
  4. **Drag Activities Panel** — collapsible list of all activities grouped by spoon level, draggable onto calendar.

---

## 6. Calendar Views

### Week View
- 8-column grid: 1 column for time labels + 7 columns for days (Mon–Sun).
- Each day column has a **Day Header** at the top.
- Time slots run from 06:00 to 04:00 (next day) in 2-hour increments = 12 slots per day.
- The 04:00 slot wraps overnight.
- Today's column has a cyan tint background (`bg-primary/10`).
- Horizontal scroll on mobile.

#### Day Header (per column)
- Shows: day name (Mon, Tue…), full date (e.g. "Mar 3").
- Shows spoon count: `[used] / [limit]` spoons.
- Shows a progress bar:
  - Normal: cyan fill.
  - Over limit: red fill.
- Height: approximately 85px.

#### Time Slot (per cell)
- Default empty: shows time label on hover or always (depending on screen size).
- Height: 48px (h-12).
- Occupied: filled with energy colour, shows activity name in truncated text, and a debossed X delete button in the top-right corner.
- Hover on empty slot: subtle grey tint.
- Drag-over state: cyan tint border and background.
- Click on empty slot: opens Activity Modal.
- Click on occupied slot: opens Activity Modal pre-filled with current activity.
- X button: deletes activity from slot.

### Day View
- Single day shown full width.
- Same 2-hour time slots (06:00–04:00).
- Larger slot height for easier touch interaction.
- Day header shows the day name, date, and spoon count.
- Navigation: left/right arrows to move between days.
- Same activity add/edit/delete behaviour as week view.

### View Toggle
- Tabs component: "Week" | "Day"
- Clicking "Day" switches to day view showing the currently selected or today's date.
- Clicking "Week" returns to the week view.

---

## 7. Activity Management

### Activity Modal
Opened by clicking any time slot (empty or occupied).

**Layout:**
- Title: "Add Activity" or "Edit Activity" depending on context.
- Shows the slot info: day + time.
- Search input at the top for filtering activities.
- Scrollable list of activities grouped by spoon level using Accordion:
  - Each group label shows the spoon count and colour dot.
  - Groups default to collapsed.
  - Clicking a group expands it to show activities.
  - Each activity item shows name, spoon count badge, and a trash icon (for user-created activities only).
- Selected activity is highlighted with a border and ring.
- "Create Custom Activity" section at the bottom:
  - Name input (required).
  - Spoon rating selector (0–5, shown as coloured radio buttons or a select).
  - Category input (optional).
  - Description textarea (optional).
  - "Add" button.
- "Confirm" / "Save" button to apply the selection to the time slot.
- Modal max-width: ~383px. Max height: 85vh with internal scroll.

### Bulk Schedule Modal
Accessed from the hamburger menu.

**Layout:**
- Title: "Bulk Schedule".
- Activity selector: search + select an activity (same as activity modal).
- Day selection: 7 checkboxes (Mon–Sun), "Select All" toggle.
- Time slot selection grid: all 12 time slots shown as a grid of checkboxes.
- Quick selection tools:
  - Start Time dropdown: pick a start slot.
  - Duration dropdown: 2h, 4h, 6h… up to 24h.
  - Applying these auto-selects the appropriate contiguous slots, wrapping past midnight.
- "Schedule" button: applies the selected activity to all checked day+slot combinations.
- Recharging Activity section: a dedicated dropdown for 0-spoon activities to fill all unoccupied slots.

### Delete Activity
- X button on each occupied time slot.
- Debossed style: no background, drop-shadow only.
  - `filter: drop-shadow(0px 1px 0px rgba(255,255,255,0.3)) drop-shadow(0px -1px 0px rgba(0,0,0,0.2))`
- Opacity: 50% default, 90% on hover.
- Positioned: `absolute top-1 right-1`.

---

## 8. Drag and Drop

### Desktop (Mouse)
- Activities in the Drag Activities Panel are draggable using native HTML5 drag API.
- Time slots are drop targets. Dragging over a slot shows a cyan highlight.
- Dropping places the activity into that slot.
- Activities already placed in slots can also be dragged to new slots.
- On drag start: source slot reduces to 50% opacity.
- On drag end: opacity restored.

### Touch / Mobile
- Full touch drag support.
- On touch start: a visual clone of the activity card is created and follows the finger.
- Drop zones are detected by element position (not native drag events).
- Valid drop zones highlight as the clone passes over them.
- On release: activity placed into the nearest valid slot.
- Clone is removed after placement.
- Minimum 44px touch targets throughout.

---

## 9. Navigation

### Week Navigation
- Previous/Next arrows in the header.
- Each click moves back or forward by 7 days (one full week).
- The week always starts on Monday.
- The week display shows `MMM D – MMM D, YYYY` format.

### Date Picker Modal
- Opened by clicking the week date range in the header.
- Shows a month grid calendar.
- User can navigate months with arrows.
- Clicking a date jumps to the week containing that date.
- Shows current selection highlighted.
- Custom implementation (no external calendar library dependency).

### Day Navigation (Day View)
- Left/right arrows navigate one day at a time.
- Header updates to show the new day name, date and spoon count.

---

## 10. History (Undo / Redo)

- 35-step undo/redo history per week session.
- Every change to timetable entries (add, edit, delete, bulk schedule, drag drop, clear week) creates a history snapshot.
- Undo (Ctrl+Z / button) restores the previous snapshot.
- Redo (Ctrl+Shift+Z / button) re-applies a reverted snapshot.
- History resets when navigating to a different week.
- Undo/Redo availability shown in the menu (greyed out when unavailable).

---

## 11. Data Persistence

### Auto-Save
- Changes are automatically saved to the backend after a short debounce (approximately 1–2 seconds after the last change).
- A "Saving…" indicator appears during save.
- A "Saved" indicator appears on success.

### Manual Save
- "Save" option in the hamburger menu forces an immediate save.

### Data Loading
- On app load: fetch timetable entries for the current week from the backend.
- On week navigation: fetch entries for the newly selected week.
- If no entries exist for a week: show empty calendar.

### Load Previous Week
- Accessible from the hamburger menu.
- Opens a modal listing all past weeks that have saved entries.
- Selecting a week loads it into the current view (replacing the current week's data with the historical data).
- The user can then edit it as normal.

### Clear Week
- Accessible from the hamburger menu.
- Prompts for confirmation.
- Deletes all entries for the current week.
- Creates a history snapshot so the action can be undone.

---

## 12. Settings

### Settings Modal
- Opened from the hamburger menu.
- Fields:
  - **Daily Limit**: integer input (spoons per day).
  - **Weekday Limit**: integer input (total Mon–Fri spoons).
  - **Weekend Limit**: integer input (total Sat–Sun spoons).
- Save button: persists changes to the user profile.
- Changes immediately reflect in day headers and weekly summary.

---

## 13. Menu (Hamburger / Sheet)

- Sheet component slides in from the left.
- Width: 300px.
- Header: shows logged-in user's display name.
- Sections:
  - **Schedule**: Load Previous Week, Bulk Schedule, Clear Week.
  - **Account**: Settings, Sign Out.
- Menu items have a cyan hover state (`hover:bg-primary/10 hover:text-primary`).
- Clean, minimal design — no icons on items (text only).

---

## 14. Theme

- Full light/dark mode support.
- Toggle available in the header or menu.
- Default: follows system preference.
- Preference persisted in localStorage.
- All colours use CSS custom properties (design tokens) so both modes are fully supported.
- See `activity-history/design-April-2026.md` for all token values.

---

## 15. Notifications

- Toast notifications for:
  - Successful save.
  - Save error.
  - Activity created.
  - Activity deleted.
  - Week loaded.
  - Week cleared.
- Toasts appear at the bottom of the screen, auto-dismiss after ~3–4 seconds.

---

## 16. File & Component Structure

```
app/
├── app/page.tsx              # Main application (all state lives here)
├── auth/
│   ├── login/page.tsx
│   ├── sign-up/page.tsx
│   └── sign-up-success/page.tsx
├── layout.tsx                # Root layout, fonts, theme provider
├── page.tsx                  # Root redirect (auth check)
└── globals.css               # All design tokens and global styles

components/
├── activity/
│   ├── activity-modal.tsx
│   ├── bulk-schedule-modal.tsx
│   └── drag-activities-panel.tsx
├── calendar/
│   ├── calendar-header.tsx
│   ├── date-picker-modal.tsx
│   ├── day-header.tsx
│   ├── day-view.tsx
│   ├── time-column.tsx
│   ├── time-slot.tsx
│   └── week-view.tsx
├── dashboard/
│   ├── daily-energy-grid.tsx
│   ├── dashboard-sidebar.tsx
│   ├── energy-legend.tsx
│   └── weekly-summary.tsx
├── settings/
│   ├── load-previous-week-modal.tsx
│   ├── settings-modal.tsx
│   └── theme-toggle.tsx
├── theme-provider.tsx
└── ui/                       # Shadcn-style primitive components
    ├── accordion.tsx
    ├── button.tsx
    ├── card.tsx
    ├── checkbox.tsx
    ├── dialog.tsx
    ├── input.tsx
    ├── label.tsx
    ├── select.tsx
    ├── sheet.tsx
    ├── tabs.tsx
    ├── textarea.tsx
    ├── toast.tsx
    └── toaster.tsx

lib/
├── data-persistence.ts       # All backend read/write logic
├── date-utils.ts             # Date helpers (week start, formatting)
├── default-activities.ts     # The 28 seeded activities list
├── energy-utils.ts           # getEnergyColor(spoons), getEnergyLabel(spoons)
├── history-manager.ts        # Undo/redo stack implementation
├── types.ts                  # TypeScript interfaces
└── utils.ts                  # cn() and other shared utilities
```

---

## 17. Key Utility Functions

### `energy-utils.ts`
```typescript
getEnergyColor(spoons: number, activityName?: string): string
// Returns Tailwind class or hex for background colour

getEnergyForeground(spoons: number): string
// Returns text colour (white or black) for contrast

getEnergyLabel(spoons: number): string
// Returns "Recharging", "Low Energy", "Medium Energy" etc.
```

### `date-utils.ts`
```typescript
getWeekStart(date: Date): Date
// Returns the Monday of the week containing the given date

formatWeekRange(weekStart: Date): string
// Returns "Feb 23 – Mar 1, 2026"

getWeekDays(weekStart: Date): Date[]
// Returns array of 7 Date objects for Mon–Sun
```

### `history-manager.ts`
```typescript
class HistoryManager {
  push(snapshot: TimetableEntry[]): void
  undo(): TimetableEntry[] | null
  redo(): TimetableEntry[] | null
  canUndo(): boolean
  canRedo(): boolean
  clear(): void
}
```

---

## 18. Types

```typescript
interface Activity {
  id: string
  user_id: string
  name: string
  spoons: number       // 0–5
  category?: string
  description?: string
  is_default: boolean
  created_at: string
}

interface TimetableEntry {
  id: string
  user_id: string
  week_start: string   // ISO date string "YYYY-MM-DD"
  date: string         // ISO date string
  day_name: string     // "Monday", "Tuesday" etc.
  timeslot: string     // "06:00", "08:00" etc.
  activity_name: string
  spoons: number
  created_at: string
  updated_at: string
}

interface UserProfile {
  id: string
  display_name: string
  daily_limit: number
  weekday_limit: number
  weekend_limit: number
}

interface DragData {
  activityName: string
  spoons: number
  sourceSlot?: { date: string; timeslot: string }
}
```

---

## 19. State Management (Main App Component)

All state lives in the main `app/app/page.tsx` component. No external state library is used.

```typescript
// Core data
const [entries, setEntries] = useState<TimetableEntry[]>([])
const [activities, setActivities] = useState<Activity[]>([])
const [userProfile, setUserProfile] = useState<UserProfile | null>(null)

// Navigation
const [currentView, setCurrentView] = useState<'week' | 'day'>('week')
const [currentWeekStart, setCurrentWeekStart] = useState<Date>(getWeekStart(new Date()))
const [selectedDay, setSelectedDay] = useState<Date>(new Date())

// Modal states
const [activityModalOpen, setActivityModalOpen] = useState(false)
const [bulkModalOpen, setBulkModalOpen] = useState(false)
const [settingsModalOpen, setSettingsModalOpen] = useState(false)
const [loadWeekModalOpen, setLoadWeekModalOpen] = useState(false)
const [datePickerOpen, setDatePickerOpen] = useState(false)
const [selectedSlot, setSelectedSlot] = useState<{ date: string; timeslot: string } | null>(null)

// UI state
const [isSidebarOpen, setIsSidebarOpen] = useState(true)
const [isMenuOpen, setIsMenuOpen] = useState(false)
const [isSaving, setIsSaving] = useState(false)
const [canUndo, setCanUndo] = useState(false)
const [canRedo, setCanRedo] = useState(false)

// Refs
const dataPersistenceRef = useRef<DataPersistence | null>(null)
const historyManagerRef = useRef<HistoryManager | null>(null)
const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null)
const touchCloneRef = useRef<HTMLElement | null>(null)
```

---

## 20. Accessibility Requirements

- All interactive elements reachable by keyboard (Tab, Enter, Space, Arrow keys).
- All icon-only buttons have `aria-label`.
- Modals trap focus when open and restore focus on close.
- Colour is never the sole means of conveying information (spoon labels always accompany colours).
- Minimum 44×44px touch targets.
- WCAG AA colour contrast on all text.
- Proper heading hierarchy (h1 → h2 → h3).
- `aria-live` regions for dynamic updates (save status, toast messages).

---

## 21. Performance Requirements

- Week view renders in under 300ms on mobile.
- Drag operations maintain 60fps on modern devices.
- Auto-save debounce: 1500ms to avoid excessive backend writes.
- Modals lazy-mount (not rendered until first opened).
- No full-page reloads — all navigation is client-side.

---

## 22. Not In Scope (for this build)

- Native mobile app.
- Export to CSV or PDF.
- Calendar integrations (Google Calendar, Apple Calendar).
- Push notifications.
- Collaborative / shared calendars.
- Advanced analytics / charts beyond the sidebar widgets.
- AI suggestions.
