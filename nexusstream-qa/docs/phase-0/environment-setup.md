# Phase 0 — Environment Setup

## Objective
Set up the local environment needed to run the NexusStream application and prepare the repository for manual QA, API testing, and future automation work.

This project is a single portfolio application used for the full QA learning path. The target setup is a working local application, a GitHub repository, and a stable environment for testing and later automation.

---

## Required tools

Install the following tools before starting the project work:

- Python 3.11+
- uv
- Git
- VS Code
- Postman
- PostgreSQL (local or Docker-based)
- Pytest
- Node.js 18+
- npm

Recommended setup:
- use GitHub for version control
- use VS Code terminal for project work
- use Docker Compose for the PostgreSQL service

---

## Project checkout

```bash
git clone <your-repository-url>
cd nexusstream-enterprise-qa
```

The app used for this portfolio is in:

```text
nexusstream-app/
```

The QA tracking work sits in:

```text
nexusstream-qa/
```

---

## App prerequisites

From the app directory:

```bash
cd nexusstream-app
npm install
```

Create a local environment file from `.env.example` if needed:

```bash
cp .env.example .env
```

Example values:

```env
TEST_MODE=1
NODE_ENV=development
PGHOST=localhost
PGPORT=5432
PGUSER=nexus
PGPASSWORD=nexus_password
PGDATABASE=nexusstream
GEMINI_API_KEY=your_key_here
```

The app supports SQLite by default and PostgreSQL when the database environment variables are configured.

---

## Start the app

Run the application locally:

```bash
npm run dev
```

The app should be available at:

```text
http://localhost:3000
```

If using PostgreSQL through Docker:

```bash
npm run compose:up
```

To stop the database stack:

```bash
npm run compose:down
```

---

## Application features relevant to QA

The app includes the features that should be covered in the portfolio project:

- login and registration
- protected routes
- shop/catalog display
- search and filter
- cart behavior
- checkout wizard
- stock validation
- order creation
- admin audit logs
- policy endpoint
- mock payment flows
- test seeding and teardown endpoints

These are the features that will be used throughout the QA roadmap.

---

## Deliverables for Phase 0

Phase 0 is complete when all of the following are true:

- the repository is created and tracked in Git
- the project can run locally
- Node dependencies are installed
- the app loads without startup errors
- the environment is documented
- the QA project folder is ready for test planning

This is the baseline for all later phases.
