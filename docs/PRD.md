# Energy Pacing Timetable - Product Requirements Document (PRD)

## Product Overview
The Energy Pacing Timetable is a specialized calendar application designed for individuals with chronic conditions who need to manage their energy levels using the "Spoons Theory" framework. The app helps users plan activities based on their energy capacity and track energy expenditure throughout the week.

## Core Concept
Based on the Spoons Theory, where each "spoon" represents a unit of energy:
- **5 Spoons**: Extreme energy activities (Dark Red - #550000)
- **4 Spoons**: Very high energy activities (Red - #d40f0c) 
- **3 Spoons**: High energy activities (Orange - #f59e0b)
- **2 Spoons**: Medium energy activities (Bright Yellow - #ffd700)
- **1 Spoon**: Low energy activities (Green - #0a6802)
- **0 Spoons**: Recharging/Rest activities (Grey - #808080)
- **Sleep**: Special 0 spoons category (Dark Blue-Grey - #1e2939)

## Technical Stack

### Framework & Core Libraries
- **Next.js**: 16.0.10 with App Router
- **React**: 19.2.0 with TypeScript 5
- **TypeScript**: Full type safety throughout application

### Styling & UI
- **Tailwind CSS**: v4.1.9 with custom design tokens
- **shadcn/ui**: Component library based on Radix UI
- **Radix UI**: Comprehensive primitive components
- **lucide-react**: Icon library (v0.454.0)
- **class-variance-authority**: Component variant management
- **tailwindcss-animate**: Animation utilities
- **tw-animate-css**: Additional animation support (v1.4.0)

### State & Forms
- **react-hook-form**: v7.60.0 for form management
- **zod**: v3.25.76 for schema validation
- **@hookform/resolvers**: v3.10.0 for form validation

### Backend & Authentication
- **Supabase**: Complete backend solution
  - **@supabase/supabase-js**: v2.48.1 for client-side operations
  - **@supabase/ssr**: v0.7.0 for server-side rendering support
  - **@supabase/auth-js**: v2.66.1-rc.1 for authentication
- **PostgreSQL**: Database (via Supabase)

### Data & Date Management
- **date-fns**: v4.1.0 for date manipulation
- **localStorage**: Client-side persistence fallback

### Specialized Components
- **react-day-picker**: v9.8.0 for calendar UI
- **recharts**: v2.15.4 for data visualization
- **embla-carousel-react**: v8.5.1 for carousels
- **sonner**: v1.7.4 for toast notifications
- **vaul**: v0.9.9 for drawer components
- **cmdk**: v1.0.4 for command menu
- **input-otp**: v1.4.1 for OTP inputs
- **react-resizable-panels**: v2.1.7 for resizable layouts

### Analytics & Monitoring
- **@vercel/analytics**: v1.3.1 for usage tracking

## Database Schema

### Tables

#### profiles
- `id`: UUID (primary key, references auth.users)
- `display_name`: TEXT
- `daily_limit`: INTEGER (default: 18)
- `weekday_limit`: INTEGER (default: 90)
- `weekend_limit`: INTEGER (default: 36)
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

#### activities
- `id`: UUID (primary key, auto-generated)
- `user_id`: UUID (foreign key to profiles)
- `name`: TEXT (unique per user)
- `spoons`: INTEGER (0-5)
- `category`: TEXT
- `description`: TEXT (nullable)
- `is_default`: BOOLEAN (default: false)
- `created_at`: TIMESTAMP

#### timetable_entries
- `id`: UUID (primary key, auto-generated)
- `user_id`: UUID (foreign key to profiles)
- `week_start`: DATE
- `date`: DATE
- `day_name`: TEXT
- `timeslot`: TEXT (e.g., "06:00", "08:00")
- `activity_name`: TEXT
- `spoons`: INTEGER (0-5)
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

### SQL Scripts
1. **001_create_tables.sql**: Initial schema creation
2. **002_create_profile_trigger.sql**: Auto-create profile on user signup
3. **003_seed_default_activities.sql**: Populate default activities
4. **004_update_spoons_constraint.sql**: Update spoons validation (0-5 range)

## Key Features

### 1. Authentication
- **Supabase Auth**: Email/password authentication
- **Protected Routes**: Middleware redirects unauthenticated users
- **User Profiles**: Automatic profile creation on signup
- **Sign In/Sign Up**: Dedicated auth pages
- **Sign Out**: Logout functionality with redirect

### 2. Calendar Views
- **Weekly View**: Shows 7 days with 2-hour time slots from 06:00 to 04:00 (24 hours)
  - Displays all days of the week in columns
  - Shows spoon usage and limits in day headers
  - Progress bars indicating daily energy consumption
  - Compact view optimized for desktop
- **Day View**: Detailed single-day view
  - Larger time slots for easier mobile interaction
  - Same 2-hour increments
  - Full width utilization
  - Navigation between days
- **Date Picker Modal**: Click on date to navigate to any week/month
  - Month/year selection
  - Quick navigation to historical dates
  - Jump to specific week start

### 3. Activity Management

#### Activity Modal
- **Add Activities**: Click any time slot to open modal
- **Edit Activities**: Click existing activity to modify
- **Delete Activities**: Remove activities from time slots (X button)
- **Search Activities**: Searchable dropdown with real-time filtering
- **Custom Activities**: Create new activities with:
  - Activity name
  - Spoon rating (0-5)
  - Category (optional)
  - Description (optional)
- **Activity Organization**: Grouped by energy level (accordions)
- **Delete Custom Activities**: Trash icon for user-created activities

#### Bulk Schedule Modal
- **Multi-Slot Scheduling**: Schedule activities across multiple slots
- **Day Selection**: Choose specific days of the week
- **Time Selection**: Select multiple time slots per day
- **Recharging Activity**: Dedicated dropdown for 0-spoon activities
- **Quick Selection Tools**:
  - Select All button
  - Start Time selector
  - Duration selector (2-24 hours in 2-hour increments)
  - Wraps around midnight for overnight activities

#### Drag & Drop System
- **Desktop Drag**: Native HTML5 drag and drop
- **Touch Support**: Full tablet/mobile drag support
  - Visual clone follows touch
  - Drop zones highlighted
  - Works across time slots
- **Activity Panel**: Drag pre-defined activities onto calendar
- **Rearrange**: Move activities between time slots
- **Visual Feedback**: Hover states and drop indicators

### 4. Energy Tracking & Visualization

#### Dashboard Sidebar (Collapsible)
- **Daily Energy Grid**: Visual grid showing energy usage by day
- **Weekly Summary**: Total spoons used vs. limits
- **Energy Legend**: Color-coded guide with spoon levels
- **Drag Activities Panel**: Pre-defined activities organized by energy level
  - Collapsible sections by spoon level
  - Default closed state
  - Drag activities directly to calendar

#### Progress Indicators
- **Day Headers**: Show current/limit with progress bars
- **Color-Coded Progress**: Changes color when over limit
- **Real-Time Updates**: Instant feedback on changes
- **Today Highlight**: Cyan background for current day

### 5. Data Persistence & Management

#### Save System
- **Auto-Save**: Automatic saving to Supabase on changes
- **Manual Save**: Explicit save button in menu
- **Data Sync**: Syncs between localStorage and Supabase
- **User-Specific**: Data isolated per user account

#### History System
- **Undo/Redo**: 35-step history per week
- **Action Tracking**: Tracks all modifications
- **State Restoration**: Revert to previous states
- **Clear Week**: Remove all activities with undo capability

#### Load Previous Week
- **Historical Data**: Access and load past weeks
- **Week Selection**: Choose from previously saved weeks
- **Data Preservation**: Loads exact state from history

### 6. Navigation & Controls

#### Week Navigation
- **Previous/Next Arrows**: Navigate between weeks
- **Week Display**: Shows date range (e.g., "Feb 23 - Mar 1, 2026")
- **Date Picker**: Click date to open month selector

#### Day Navigation (Day View)
- **Previous/Next Day Arrows**: Navigate between days
- **Day Display**: Shows selected day with spoon count
- **Seamless Switching**: Maintains context when switching views

#### View Controls
- **Week/Day Toggle**: Switch between calendar views
- **Responsive Design**: Adapts to screen size
- **Persistent State**: Remembers last used view

### 7. Settings & Customization

#### Settings Modal
- **Daily Limit**: Configure spoons per day
- **Weekday Limit**: Set weekly limit for Mon-Fri
- **Weekend Limit**: Set limit for Sat-Sun
- **User Preferences**: Save configuration per user

#### Theme System
- **Light/Dark Mode**: Full theme support
- **Theme Toggle**: Switch between modes
- **Persistent Theme**: Remembers user preference
- **System Default**: Respects system theme preference

### 8. Menu System

#### Mobile-Responsive Menu (Sheet)
- **User Name Display**: Shows logged-in user
- **Schedule Section**:
  - Load Previous Week
  - Bulk Schedule
  - Clear Week
- **Account Section**:
  - Settings
  - Sign Out
- **Hover Effects**: Cyan highlight on hover
- **Clean Design**: Minimal, Apple Calendar-inspired

### 9. User Experience Features

#### Responsive Design
- **Mobile-First**: Optimized for mobile devices
- **Desktop Enhanced**: Larger screens get more features
- **Touch-Friendly**: 44px minimum touch targets
- **Collapsible Sidebar**: Hide/show on mobile

#### Accessibility
- **ARIA Labels**: Screen reader support
- **Keyboard Navigation**: Full keyboard access
- **Focus Management**: Clear focus indicators
- **High Contrast**: WCAG AA compliant colors
- **Semantic HTML**: Proper heading hierarchy

#### Visual Feedback
- **Loading States**: Skeleton loaders and spinners
- **Toast Notifications**: Success/error messages
- **Hover States**: Interactive element feedback
- **Active States**: Visual indication of selected items
- **Debossed Delete Buttons**: Subtle X buttons on activity cards

## File Structure

### App Directory (Next.js App Router)
\`\`\`
app/
├── app/
│   └── page.tsx              # Main application page
├── auth/
│   ├── login/
│   │   └── page.tsx          # Login page
│   ├── sign-up/
│   │   └── page.tsx          # Sign up page
│   └── sign-up-success/
│       └── page.tsx          # Post-signup confirmation
├── layout.tsx                # Root layout with providers
├── page.tsx                  # Landing page (redirects to app)
└── globals.css               # Global styles and design tokens
\`\`\`

### Components Directory
\`\`\`
components/
├── activity/
│   ├── activity-modal.tsx          # Add/edit activity modal
│   ├── bulk-schedule-modal.tsx     # Bulk scheduling modal
│   └── drag-activities-panel.tsx   # Draggable activities sidebar
├── calendar/
│   ├── calendar-header.tsx         # Week/day navigation header
│   ├── date-picker-modal.tsx       # Month/date selection modal
│   ├── day-header.tsx              # Day column header with progress
│   ├── day-view.tsx                # Single day calendar view
│   ├── time-column.tsx             # Time labels column
│   ├── time-slot.tsx               # Individual time slot component
│   └── week-view.tsx               # Weekly calendar grid
├── dashboard/
│   ├── daily-energy-grid.tsx       # Visual energy usage grid
│   ├── dashboard-sidebar.tsx       # Main sidebar container
│   ├── energy-legend.tsx           # Color-coded legend
│   └── weekly-summary.tsx          # Weekly stats summary
├── settings/
│   ├── load-previous-week-modal.tsx # Historical week loader
│   ├── settings-modal.tsx           # User settings dialog
│   └── theme-toggle.tsx             # Light/dark mode toggle
├── ui/                              # shadcn/ui components
│   ├── accordion.tsx
│   ├── button.tsx
│   ├── card.tsx
│   ├── checkbox.tsx
│   ├── dialog.tsx
│   ├── input.tsx
│   ├── label.tsx
│   ├── select.tsx
│   ├── sheet.tsx
│   ├── tabs.tsx
│   ├── textarea.tsx
│   ├── toast.tsx
│   └── ... (additional UI primitives)
└── theme-provider.tsx               # Theme context provider
\`\`\`

### Library Directory
\`\`\`
lib/
├── supabase/
│   ├── client.ts              # Browser Supabase client
│   ├── server.ts              # Server Supabase client
│   └── middleware.ts          # Auth middleware utilities
├── data-persistence.ts        # Data save/load management
├── date-utils.ts              # Date manipulation utilities
├── default-activities.ts      # Pre-defined activity list
├── energy-utils.ts            # Spoon color/label utilities
├── history-manager.ts         # Undo/redo functionality
├── types.ts                   # TypeScript type definitions
└── utils.ts                   # General utility functions
\`\`\`

### Configuration Files
\`\`\`
├── middleware.ts              # Next.js middleware (auth)
├── next.config.mjs            # Next.js configuration
├── tailwind.config.ts         # Tailwind CSS config
├── tsconfig.json              # TypeScript configuration
├── components.json            # shadcn/ui configuration
└── package.json               # Dependencies and scripts
\`\`\`

### Scripts Directory
\`\`\`
scripts/
├── 001_create_tables.sql              # Database schema
├── 002_create_profile_trigger.sql     # Auto-profile creation
├── 003_seed_default_activities.sql    # Default activities
└── 004_update_spoons_constraint.sql   # Spoons validation
\`\`\`

## Component Architecture

### Main App Component (`app/app/page.tsx`)
- Central state management
- Authentication checking
- Data loading and persistence
- Modal state management
- Drag and drop coordination
- History management (undo/redo)
- Auto-save functionality
- Touch drag support for tablets

### Calendar Components
- **CalendarHeader**: Navigation and view controls
- **WeekView**: 7-day grid layout with time slots
- **DayView**: Single day with larger slots
- **TimeSlot**: Individual slot with activity display and delete button
- **DayHeader**: Column header with spoon progress

### Activity Components
- **ActivityModal**: Searchable activity selection/creation (optimized layout)
- **BulkScheduleModal**: Multi-slot scheduling with quick selection tools
- **DragActivitiesPanel**: Collapsible activity library (default closed)

### Dashboard Components
- **DashboardSidebar**: Container for dashboard widgets
- **DailyEnergyGrid**: Visual energy distribution
- **WeeklySummary**: Aggregate statistics
- **EnergyLegend**: Color reference guide

## State Management

### Local State (useState)
- Current view (week/day)
- Current date and week start
- Timetable entries
- User profile
- Modal open/close states
- Selected slot/activity
- Drag state (desktop and touch)
- Undo/redo availability

### Refs (useRef)
- DataPersistence instance
- HistoryManager instance
- Auto-save timer
- Drag clone element (touch)

### Side Effects (useEffect)
- User authentication check
- Profile loading
- Initial data load
- History state updates
- Auto-save scheduling

## Data Flow

### Authentication Flow
1. Middleware checks for authenticated session
2. Redirects to `/auth/login` if not authenticated
3. Loads user profile from Supabase
4. Creates profile if doesn't exist (trigger)

### Data Loading Flow
1. Check authenticated user
2. Initialize DataPersistence with user ID
3. Load user profile from database
4. Load or seed default activities
5. Load timetable entries for current week
6. Initialize HistoryManager
7. Set up auto-save

### Activity Addition Flow
1. User clicks time slot
2. ActivityModal opens with slot context
3. User selects/creates activity
4. Activity saved to entries state
5. Entry persisted to Supabase
6. History snapshot taken
7. Auto-save triggered

### Drag and Drop Flow
1. User starts drag (mouse or touch)
2. Drag data set with activity info
3. Drop zone highlights on drag over
4. On drop, activity added to slot
5. State updated and persisted
6. History snapshot taken

## User Workflows

### Primary Workflow: Planning a Week
1. User logs in and sees current week
2. User clicks time slots to add activities
3. User selects from searchable activity list
4. Or creates custom activity with spoon rating
5. Dashboard shows real-time energy tracking
6. User can bulk schedule recurring activities
7. User can drag activities to reschedule
8. Changes auto-save to database

### Secondary Workflow: Daily Management
1. User switches to Day view
2. User navigates between days with arrows
3. User adds/modifies activities for specific day
4. User monitors energy levels through progress bars
5. User can delete activities with X button
6. User can undo/redo changes

### Tertiary Workflow: Historical Review
1. User clicks on week date to open date picker
2. User navigates to previous weeks/months
3. User reviews past energy usage patterns
4. User can load previous week's schedule
5. User can modify historical data

## Technical Requirements

### Performance
- Optimized for mobile devices
- Smooth drag and drop (desktop and touch)
- Fast navigation between views
- Efficient state management
- Lazy loading for modals

### Security
- Row Level Security (RLS) on all tables
- User data isolation
- Authenticated API calls
- Secure session management
- HTTPS only

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Responsive design breakpoints
- Touch event support

## Success Metrics
- User engagement with energy tracking
- Daily active users
- Activities created per user
- Data persistence reliability
- Cross-device synchronization accuracy
- Feature adoption rates

## Future Enhancements
- Export functionality (CSV, PDF)
- Import from calendar apps
- Health app integration
- Push notifications
- Advanced analytics dashboard
- Collaborative planning
- Native mobile app
- Recurring activity templates
- Custom spoon scales
- Activity tagging system
- Notes and journaling
- Energy trend analysis
- AI-powered suggestions
