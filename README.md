# Crisis Simulation Game

An interactive educational crisis management simulation built with Next.js 16, React 19, and Tailwind CSS 4.

## Overview

This application provides an immersive learning experience where players navigate through crisis scenarios, making decisions that impact multiple stakeholders. The simulation teaches critical thinking, stakeholder analysis, and strategic decision-making in high-pressure situations.

## Features

### Learning Modules

- **Mini-Game 1: Priority Ranking** - Rank concerns by urgency and importance
- **Mini-Game 2: Tension Identification** - Identify stakeholder conflicts in crisis situations
- **Mini-Game 3: Credibility Ranking** - Evaluate information sources by reliability
- **Mini-Game 4: Impact Anticipation** - Assess consequences across multiple dimensions

### Crisis Scenarios

1. **Immediate Response** - Crisis onset with incomplete information
2. **Recovery & Accountability** - Short-term stabilization and responsibility
3. **Long-Term Positioning** - Strategic decisions for future resilience

### Scoring Dimensions

- **Economy** - Financial impact, investor confidence
- **Environment** - Ecological damage, sustainability
- **Legitimacy** - Public trust, brand reputation, compliance
- **Resilience** - Operational continuity, adaptability

## Tech Stack

- **Framework**: Next.js 16 (App Router with Turbopack)
- **UI**: React 19, Tailwind CSS 4
- **State Management**: Zustand
- **Database**: PostgreSQL (Neon serverless)
- **Export**: XLSX for data export

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (or Neon serverless)

### Installation

```bash
# Clone the repository
git clone https://github.com/Kenneth0416/crisis-sim.git
cd crisis-sim

# Install dependencies
npm install

# Create .env.local with your database URL
echo "DATABASE_URL=your_database_url_here" > .env.local

# Initialize database
curl http://localhost:3000/api/init-db

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Application Flow

```
Login -> Consent -> Briefing -> Mini-Games (1-4) -> Scenarios (1-3) -> Comparison -> Reflection -> Finish
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/init-db` | GET | Initialize database tables |
| `/api/session` | POST | Create/update game session |
| `/api/event` | POST | Log game events |
| `/api/comparison` | POST | Save comparison results |
| `/api/export` | GET | Export data as XLSX |
| `/api/admin` | GET | Admin dashboard data |

## Project Structure

```
src/
├── app/
│   ├── admin/          # Admin dashboard
│   ├── api/            # API routes
│   ├── briefing/       # Game briefing page
│   ├── comparison/     # Results comparison
│   ├── consent/        # Data consent form
│   ├── finish/         # Completion page
│   ├── login/          # Student login
│   ├── mini-game/      # Four mini-games
│   ├── reflection/     # Post-game reflection
│   └── scenario/       # Crisis scenarios
├── components/         # Shared components
└── lib/
    ├── db.ts           # Database utilities
    ├── game-data.ts    # Game configuration
    └── store.ts        # Zustand store
```

## Deployment

Deployed on Vercel with Neon PostgreSQL.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Kenneth0416/crisis-sim)

## License

MIT