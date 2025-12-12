# Phased Implementation Plan: Static Sweepstake Site

## Phase 0: Project Setup & Infrastructure
**Duration: 1-2 hours**

### Tasks:
- [ ] Initialize Next.js project with TypeScript
- [ ] Configure for static export (`output: 'export'` in next.config.js)
- [ ] Install dependencies (React, TypeScript, DaisyUI, Tailwind CSS)
- [ ] Set up project structure (components, lib, types, public directories)
- [ ] Configure testing framework (Jest, React Testing Library)
- [ ] Set up GitHub Actions workflow for automatic deployment to GitHub Pages
- [ ] Create base layout component with DaisyUI theme

### Deliverables:
- Working Next.js project with static export capability
- CI/CD pipeline configured
- Testing infrastructure ready

---

## Phase 1: Data Models & Utilities
**Duration: 2-3 hours**

### Tasks:
- [ ] Create TypeScript interfaces for:
  - Entry predictions (`Entry`)
  - League table data (`LeagueTable`, `Team`)
  - Calculated scores (`ScoreResult`, `PlayerScore`)
- [ ] Implement score calculation logic:
  - Section matching (top 4, bottom 3): 1 point
  - Exact position matching: 4 points (5 total with section point)
  - Maximum 35 points per player
- [ ] Create utility functions:
  - Load and parse JSON entries
  - Calculate estimated total goals from games played
  - Sort players by score (tie-breaker: closest to actual goals)
- [ ] Write unit tests for all calculation logic

### Deliverables:
- Type-safe data models
- Tested scoring algorithm
- Utility functions with >80% test coverage

---

## Phase 2: Page 1 - Landing Page
**Duration: 1 hour**

### Tasks:
- [ ] Create landing page component (`app/page.tsx`)
- [ ] Implement simple welcome message: "Welcome to the PL Sweepstake 2025/26"
- [ ] Add DaisyUI styled button linking to `/scores`
- [ ] Apply basic styling with DaisyUI components
- [ ] Write component tests

### Deliverables:
- Functional landing page
- Navigation to scores page
- Responsive design

---

## Phase 3: Page 2 - Current Scores Page
**Duration: 4-5 hours**

### Tasks:
- [ ] Create scores page component (`app/scores/page.tsx`)
- [ ] Implement data loading from static JSON at build time
- [ ] Create table component with columns: Position | Player | Score | Tie Breaker
- [ ] Add expandable row functionality (click to show predictions)
- [ ] Create nested table for predictions: Pos | Team | Actual | Score
- [ ] Add footer showing estimated total goals
- [ ] Style with DaisyUI table components
- [ ] Implement sorting by score (descending)
- [ ] Write component and integration tests

### Deliverables:
- Interactive scores table
- Expandable player details
- Correct score calculations displayed

---

## Phase 4: Page 3 - League Table Editor
**Duration: 5-6 hours**

### Tasks:
- [ ] Create league table page component (`app/table/page.tsx`)
- [ ] Implement drag-and-drop functionality for team reordering
  - Use HTML5 drag and drop API or library (e.g., dnd-kit)
- [ ] Create table with columns: Position | Short Name | Name
- [ ] Add visual styling for:
  - Top 4 teams (e.g., green/gold background)
  - Bottom 3 teams (e.g., red background)
  - Middle teams (neutral styling)
- [ ] Add input fields:
  - Games played (number input)
  - Total goals scored to date (number input)
- [ ] Implement calculated estimated total goals
  - Formula: (total goals / games played) * total games in season
- [ ] Create "Save" button functionality:
  - Generate JSON output with ordered teams, fields, estimates, timestamp
  - Copy to clipboard using Clipboard API
  - Show success notification
- [ ] Write component tests (mock drag-and-drop)

### Deliverables:
- Functional drag-and-drop table
- Editable fields
- JSON export to clipboard
- Visual indicators for table positions

---

## Phase 5: Score Generation Script
**Duration: 2-3 hours**

### Tasks:
- [ ] Create Node.js script to generate scores JSON
- [ ] Script reads:
  - Current league table JSON
  - All entry JSON files from `/resources/entries/`
- [ ] Calculate scores for each player
- [ ] Output scores JSON to `/public/` directory for static hosting
- [ ] Add script to `package.json` scripts
- [ ] Integrate into build process
- [ ] Write tests for script logic

### Deliverables:
- Automated score generation
- Static JSON files ready for deployment

---

## Phase 6: Integration & Polish
**Duration: 2-3 hours**

### Tasks:
- [ ] Connect all pages with navigation
- [ ] Add consistent header/footer across pages
- [ ] Implement responsive design for mobile/tablet
- [ ] Add loading states and error handling
- [ ] Optimize for static generation (ensure all data at build time)
- [ ] Test full user flow
- [ ] Add meta tags and favicon
- [ ] Verify GitHub Actions deployment works

### Deliverables:
- Fully integrated site
- Mobile-responsive
- Production-ready static export

---

## Phase 7: Testing & Documentation
**Duration: 2-3 hours**

### Tasks:
- [ ] Achieve unit test coverage target (>80%)
- [ ] Add integration tests for page navigation
- [ ] Test static export locally
- [ ] Create README.md with:
  - Setup instructions
  - How to update league table
  - How to regenerate scores
  - Deployment process
- [ ] Add inline code documentation
- [ ] Test deployment on GitHub Pages

### Deliverables:
- Comprehensive test suite
- Documentation for maintenance
- Verified production deployment

---

## Total Estimated Time: 19-26 hours

## Technology Stack Summary:
- **Framework:** Next.js 14+ (App Router, Static Export)
- **Language:** TypeScript
- **UI Library:** React 18+
- **Styling:** Tailwind CSS + DaisyUI
- **Testing:** Jest + React Testing Library
- **Deployment:** GitHub Actions → GitHub Pages
- **Drag & Drop:** dnd-kit or HTML5 native API

## Key Files Structure:
```
static-sweep/
├── app/
│   ├── page.tsx                 # Landing page
│   ├── scores/
│   │   └── page.tsx             # Scores page
│   ├── table/
│   │   └── page.tsx             # League table editor
│   └── layout.tsx               # Root layout
├── components/
│   ├── ScoresTable.tsx
│   ├── LeagueTableEditor.tsx
│   └── ...
├── lib/
│   ├── scoring.ts               # Score calculation logic
│   ├── utils.ts                 # Utility functions
│   └── types.ts                 # TypeScript interfaces
├── scripts/
│   └── generate-scores.ts       # Score generation script
├── public/
│   ├── scores.json              # Generated scores
│   └── league-table.json        # Current league state
├── resources/
│   ├── prem-2024-25.json
│   └── entries/                 # Player predictions
├── __tests__/                   # Test files
├── .github/
│   └── workflows/
│       └── deploy.yml           # GitHub Actions
└── next.config.js               # Static export config
```

## Dependencies:
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "daisyui": "^4.0.0",
    "tailwindcss": "^3.0.0",
    "@dnd-kit/core": "^6.0.0",
    "@dnd-kit/sortable": "^8.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/react": "^18.0.0",
    "@types/node": "^20.0.0",
    "jest": "^29.0.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0"
  }
}
```
