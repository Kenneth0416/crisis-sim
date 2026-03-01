# Crisis Simulation Game - Corporate Crisis Management Simulator

![Crisis Sim](docs/screenshots/01-login.png)

An interactive educational simulation system for corporate crisis management, helping learners develop decision-making thinking, crisis response, and strategic planning capabilities in high-pressure scenarios.

---

## Table of Contents

1. [Features](#features)
2. [Technical Architecture](#technical-architecture)
3. [Functional Modules](#functional-modules)
4. [User Guide](#user-guide)
5. [Installation](#installation)
6. [API Endpoints](#api-endpoints)
7. [Project Structure](#project-structure)
8. [Deployment](#deployment)
9. [Developer Guide](#developer-guide)

---

## Features

### 🎮 Immersive Learning Experience

- **4 Interactive Mini-Games** - Build crisis sensitivity and analysis skills
- **3 Crisis Scenarios** - Simulate real corporate crisis decisions
- **Real-time Score Feedback** - Four-dimensional decision evaluation

### 📊 Multi-Dimensional Assessment System

| Dimension | Description | Evaluation Metrics |
|-----------|-------------|-------------------|
| Economy | Financial impact, investor confidence | Cost-benefit, risk exposure |
| Environment | Ecological impact, sustainability | Environmental remediation, long-term impact |
| Legitimacy | Public trust, brand reputation | Media reaction, regulatory compliance |
| Resilience | Operational continuity, adaptability | Recovery speed, response mechanisms |

### 🏆 Performance Comparison System

- Compare rankings with peers
- Detailed dimension analysis
- Radar chart visualization (planned)

---

## Technical Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Frontend                          │
│   Next.js 16 + React 19 + Tailwind CSS 4           │
└─────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────┐
│                   State Management                  │
│   Zustand (Client State)                           │
└─────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────┐
│                   API Layer                          │
│   Next.js API Routes (App Router)                  │
└─────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────┐
│                   Database                          │
│   PostgreSQL (Neon Serverless)                     │
└─────────────────────────────────────────────────────┘
```

### Tech Stack

- **Framework**: Next.js 16 (App Router + Turbopack)
- **UI**: React 19, Tailwind CSS 4
- **State Management**: Zustand
- **Database**: PostgreSQL (Neon Serverless)
- **Export**: XLSX

---

## Functional Modules

### 1. Login System

![Login](docs/screenshots/01-login.png)

Enter a nickname to start the experience, no registration required.

### 2. Consent Form

![Consent](docs/screenshots/03-consent.png)

Explain data collection purposes and ensure academic ethics compliance.

### 3. Mini-Game Modules

#### Mini-Game 1: Priority Ranking

![Mini-Game 1](docs/screenshots/05-mini-game-1.png)

Based on stakeholder roles, select the 3 issues they care about most.

#### Mini-Game 2: Tension Identification

![Mini-Game 2](docs/screenshots/07-mini-game-2.png)

Identify conflict points between different stakeholders in a crisis.

#### Mini-Game 3: Information Credibility

![Mini-Game 3](docs/screenshots/09-mini-game-3.png)

Evaluate the credibility of different information sources.

#### Mini-Game 4: Impact Anticipation

![Mini-Game 4](docs/screenshots/11-mini-game-4.png)

Predict the multiple impacts of decisions.

### 4. Briefing Transition Page

![Briefing](docs/screenshots/13-briefing.png)

Preview the four-dimensional assessment framework ahead.

### 5. Crisis Scenarios

#### Scenario 1: Immediate Response

![Scenario](docs/screenshots/14-scenario-1.png)

Initial decisions during crisis outbreak with incomplete information.

#### Scenario 2: Recovery & Accountability

![Scenario 2](docs/screenshots/16-scenario-2.png)

Responsibility attribution and remedial measures after short-term stabilization.

#### Scenario 3: Long-Term Positioning

![Scenario 3](docs/screenshots/18-scenario-3.png)

Strategic positioning for future resilience.

### 6. Performance Comparison

![Comparison](docs/screenshots/20-comparison.png)

Compare four-dimensional performance and rankings with peers.

### 7. Reflection Notes

![Reflection](docs/screenshots/21-reflection.png)

Mandatory reflection session to record learning insights and improvement suggestions.

### 8. Completion Page

![Finish](docs/screenshots/24-finish.png)

Thank you for participating, data has been recorded.

### 9. Admin Dashboard

![Admin](docs/screenshots/25-admin.png)

View all learning records and export data.

---

## User Guide

### Basic Flow

```
Login → Consent → Mini-Games (1-4) → Scenarios (1-3) → Comparison → Reflection → Finish
```

### Step-by-Step Guide

#### Step 1: Start Experience

1. Visit http://localhost:3000
2. Enter a nickname (e.g., `Alex`)
3. Click "Start Simulation"

#### Step 2: Read Consent Form

1. Check "I agree"
2. Click "Continue to Simulation"

#### Step 3: Complete Mini-Games

Each mini-game requires completing specific tasks:

| Mini-Game | Task |
|-----------|------|
| MG-1 | Select 3 most important issues for each stakeholder |
| MG-2 | Identify tension points between different positions |
| MG-3 | Rank information source credibility |
| MG-4 | Predict impacts of different decisions |

#### Step 4: Scenario Decisions

![Scenario Mobile](docs/screenshots/28-mobile-scenario.png)

Each scenario provides 5 options, and score impacts are calculated in real-time.

#### Step 5: View Results

After completion, view:
- Total score (400 points max)
- Four-dimensional scores
- Ranking percentage

#### Step 6: Submit Reflection

Answer 6 structured questions + 1 open-ended suggestion.

---

## Installation

### Prerequisites

- Node.js 18+
- PostgreSQL database (Neon free tier available)

### Installation Steps

```bash
# 1. Clone the repository
git clone https://github.com/Kenneth0416/crisis-sim.git
cd crisis-sim

# 2. Install dependencies
npm install

# 3. Create environment variables
# Create .env.local file
echo "DATABASE_URL=your_neon_database_url" > .env.local

# 4. Initialize database
curl http://localhost:3000/api/init-db

# 5. Start development server
npm run dev
```

Visit http://localhost:3000 to start.

### Docker Deployment (Optional)

```bash
# Using Docker Compose
docker-compose up -d
```

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/init-db` | GET | Initialize database tables |
| `/api/session` | POST | Create game session |
| `/api/session` | PUT | Update mini-game results |
| `/api/session` | PATCH | Update reflection content |
| `/api/event` | POST | Record user behavior events |
| `/api/comparison` | GET | Get performance comparison data |
| `/api/export` | GET | Export as XLSX |
| `/api/admin` | GET | Admin get all data |
| `/api/admin` | DELETE | Delete specific session |

---

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   │   ├── init-db/      # Database initialization
│   │   ├── session/      # Session management
│   │   ├── event/        # Event logging
│   │   ├── comparison/  # Performance comparison
│   │   ├── export/       # Data export
│   │   └── admin/        # Admin endpoints
│   ├── briefing/         # Briefing transition page
│   ├── comparison/       # Performance comparison page
│   ├── consent/          # Consent form page
│   ├── finish/           # Completion page
│   ├── login/            # Login page
│   ├── mini-game/       # 4 mini-games
│   │   ├── 1/
│   │   ├── 2/
│   │   ├── 3/
│   │   └── 4/
│   ├── reflection/       # Reflection page
│   └── scenario/         # 3 crisis scenarios
│       └── [id]/
├── components/            # Shared components
│   ├── Header.tsx        # Top navigation
│   └── ProgressBar.tsx   # Progress bar
└── lib/                   # Utility functions
    ├── db.ts             # Database connection
    ├── game-data.ts      # Game configuration data
    └── store.ts          # Zustand state store
```

---

## Deployment

### Vercel Deployment (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Kenneth0416/crisis-sim)

1. Click the button above
2. Connect GitHub
3. Set `DATABASE_URL` environment variable
4. Deployment complete

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Neon PostgreSQL connection string | `postgres://user:pass@host/neon` |

---

## Developer Guide

### Run Tests

```bash
npm test
```

### Screenshot Guide

```bash
# Install Playwright
npm install -D playwright @playwright/test

# Start development server
npm run dev

# Run screenshot script
node screenshot.js
```

Screenshots are saved in `docs/screenshots/` directory.

### Adding New Scenarios

1. Edit the `SCENARIOS` array in `src/lib/game-data.ts`
2. Define scenario title, description, 5 optional decisions
3. Each decision includes: name, icon, consequences, dimension scores

### Adding New Mini-Games

1. Create new directory in `src/app/mini-game/`
2. Implement game logic component
3. Update game list in `src/lib/game-data.ts`

---

## FAQ

### Q: Database connection failed?

A: Verify `DATABASE_URL` in `.env.local` is correct. Get connection string from Neon dashboard.

### Q: How to export student data?

A: Visit `/admin` page, click "Export XLSX" button.

### Q: Is mobile supported?

A: Yes, responsive design supports mobile and tablet access.

---

## License

This project is for educational and research purposes only.

---

## Contact

For issues, please submit an Issue or contact the project maintainer.