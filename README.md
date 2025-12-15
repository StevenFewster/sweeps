# Static Sweepstake - PL 2025/26

A static Next.js website for tracking Premier League prediction sweepstake scores.

## Features

- **Landing Page**: Welcome page with navigation to scores
- **Scores Page**: View player rankings, scores, and detailed predictions
- **League Table Editor**: Drag-and-drop interface to update league positions
- **Automated Score Calculation**: Generates scores based on predictions and actual league table

## Scoring System

- **5 points**: Exact position match
- **1 point**: Correct section (Top 4 or Bottom 3) but wrong position
- **Maximum**: 35 points (7 predictions per player)
- **Tie Breaker**: Closest guess to estimated total goals scored in the season

## Development

### Prerequisites

- Node.js 20+
- npm

### Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test
```

### Updating League Table

1. Navigate to `/table` in the app
2. Drag and drop teams to reorder positions
3. Enter games played and total goals scored
4. Click "Save & Copy JSON"
5. Save the copied JSON to `public/league-table.json`
6. Run `npm run generate-scores` to update scores

### Building for Production

```bash
# Generate scores
npm run generate-scores

# Build static site
npm run build

# Output will be in ./out directory
```

## Deployment

The site automatically deploys to GitHub Pages when changes are pushed to the main branch.

### GitHub Pages Setup

1. Enable GitHub Pages in repository settings
2. Set source to "GitHub Actions"
3. Push to main branch to trigger deployment

## Project Structure

```
├── app/
│   ├── page.tsx              # Landing page
│   ├── scores/
│   │   └── page.tsx          # Scores page
│   └── table/
│       └── page.tsx          # League table editor
├── components/
│   ├── ScoresTable.tsx       # Expandable scores table
│   └── LeagueTableEditor.tsx # Drag-and-drop table editor
├── lib/
│   ├── types.ts              # TypeScript interfaces
│   └── scoring.ts            # Score calculation logic
├── scripts/
│   └── generate-scores.ts    # Score generation script
├── resources/
│   └── entries/              # Player prediction files
├── public/
│   ├── league-table.json     # Current league state
│   └── scores.json           # Generated scores
└── __tests__/                # Test files
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run generate-scores` - Generate scores from league table and predictions
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode

## Technology Stack

- **Framework**: Next.js 16 (App Router, Static Export)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + DaisyUI
- **Drag & Drop**: @dnd-kit
- **Testing**: Jest + React Testing Library
- **Deployment**: GitHub Actions → GitHub Pages

## License

MIT
