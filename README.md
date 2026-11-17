# ConCrunch Manager

ConCrunch Manager is a web application for managing a festival program and related content.

The application includes a public section for festival visitors and an administration section for organizers and administrators.

The project is being developed as a semester MVP, with individual frontend and backend features implemented gradually according to the project plan.

---

## Technologies

### Frontend

- React
- Vite
- TypeScript
- React Router
- Tailwind CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- REST API

### Authentication and Authorization

- Google Authentication
- User roles and API authorization

### Development Tools

- Git
- GitHub
- npm

---

## Project Structure

The project is divided into separate frontend and backend parts.

```text
concrunch-mng/
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── app/
│   │   ├── components/
│   │   ├── features/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── types/
│   │   └── index.css
│   │
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   └── tsconfig.json
│
├── backend/
│   ├── gateway/
│   ├── services/
│   │   ├── identity-service/
│   │   ├── festival-service/
│   │   └── audit-service/
│   ├── shared/
│   ├── scripts/
│   ├── Dockerfile
│   ├── compose.yaml
│   ├── .env.example
│   ├── package.json
│   ├── package-lock.json
│   └── seed.js
│
└── README.md
```

---

## Frontend

The frontend application is built with React, Vite, and TypeScript.

### Main Parts

- `api/` – communication with the backend API
- `app/` – application configuration and routing
- `components/` – shared UI and layout components
- `features/` – individual functional areas of the application
- `hooks/` – custom React hooks
- `lib/` – utility functions and temporary data
- `types/` – TypeScript data types

The frontend is gradually being developed to include both the public festival application and the administration interface.

---

## Backend

The backend runs four independent Node.js processes:

- **API Gateway** – public entry point on port `5000`; routes existing `/api` paths without changing the frontend contract.
- **Identity Service** – authentication, Google registration, users, roles, and organizer requests; owns `concrunch_identity`.
- **Festival Service** – events, performers, merchants, news, and tags; owns `concrunch_festival`.
- **Audit Service** – stores audit records in `concrunch_audit`; administrators can read them through `GET /api/audit?limit=100` (maximum 200 records per request).

The three services own separate MongoDB databases. Identity and Festival services send audit records to the Audit Service through a private endpoint. Services do not access each other's collections.

The gateway forwards `/api/auth` and `/api/users` to Identity, festival-content routes and `/api/admin` to Festival, and `/api/audit` to Audit. The frontend continues to use `http://localhost:5000/api`.

---

## Main Application Areas

The project gradually implements the following areas:

- festival program
- events
- venues
- performers
- vendors
- news
- tags
- authentication and authorization
- administration interface
- public API
- audit log

---

## Local Development

### Requirements

The following tools are required to run the project locally:

- Node.js
- npm
- Git
- MongoDB
- Docker and Docker Compose (optional, for the containerized local stack)

---

## Cloning the Repository

```bash
git clone https://github.com/Jonysek82/concrunch-mng.git
cd concrunch-mng
```

---

## Frontend

### Installation

```bash
cd frontend
npm install
```

### Running the Frontend

```bash
npm run dev
```

The development server is normally available at:

```text
http://localhost:5173
```

---

## Backend

### Installation

```bash
cd backend
npm install
```

### Configuration

For local development, create the following file:

```text
backend/.env
```

based on:

```text
backend/.env.example
```

Copy `.env.example` to `.env`. Configure the Google client ID and replace the example JWT and internal-service secrets before deploying. Do not commit real passwords, API keys, tokens, or secrets.

### Running the Backend

```bash
npm run dev
```

The backend is normally available at:

```text
http://localhost:5000
```

The REST API is available under:

```text
http://localhost:5000/api
```

`npm run dev` starts the gateway and all three services. You can also start a service individually using `npm run dev:gateway`, `npm run dev:identity`, `npm run dev:festival`, or `npm run dev:audit`.

For a containerized local setup, run from `backend/`:

```bash
docker compose --env-file .env up --build
```

Only the gateway is exposed on port `5000`; the services and MongoDB remain on the internal Compose network.

---

## Database

MongoDB stores service-owned data in three databases on the local server:

- `concrunch_identity` – users and authentication
- `concrunch_festival` – events, performers, merchants, news, and tags
- `concrunch_audit` – audit records

To copy existing data from the old `concrunch_manager` database, set `LEGACY_MONGODB_URI` and run `npm run migrate:legacy` from `backend/`. The migration is non-destructive and does not overwrite records already in a target database. Run `npm run seed` if development seed data is needed.

## Cloud deployment

Deploy the backend image as separate service instances using the corresponding `npm run start:*` command. Configure each service's MongoDB URI and internal service URLs, and expose only the API Gateway publicly. Use a managed MongoDB deployment and production secrets; do not use development values from `.env.example`.

For an Internet-hosted gateway, set the frontend API URL to `https://<public-gateway-host>/api`.

Sensitive values such as passwords, API keys, authentication secrets, and access tokens must never be committed to the repository.

---

## Git Workflow

The project is developed collaboratively by a team.

The branch:

```text
main
```

represents the shared stable version of the project.

For further development, working branches use the following format:

```text
firstname.lastname/area
```

For example:

```text
john.smith/performers
james.johnson/program
michael.williams/auth
```

### Starting New Work

Before creating a working branch, update your local `main` branch:

```bash
git switch main
git pull
```

Then create a new working branch:

```bash
git switch -c firstname.lastname/area
```

For example:

```bash
git switch -c john.smith/performers
```

Each branch should represent a logically related area of development. Multiple related tasks can be implemented within the same branch.

---

## Commit Convention

Commit messages use the following prefixes:

| Prefix | Meaning |
|---|---|
| `feat:` | new feature |
| `fix:` | bug fix |
| `docs:` | documentation changes |
| `style:` | styling or formatting changes |
| `refactor:` | code restructuring without changing functionality |
| `chore:` | technical maintenance and dependency changes |

Examples:

```text
feat: add performer endpoint
feat: add program page
fix: correct event validation
docs: update README
refactor: simplify API routes
chore: update dependencies
```

Changes should be committed in logical units with short and meaningful commit messages.

---

## Pushing a Working Branch

For the first push of a new branch:

```bash
git push -u origin firstname.lastname/area
```

For example:

```bash
git push -u origin john.smith/performers
```

Subsequent changes can be pushed using:

```bash
git push
```

Once a complete area of work is finished, the working branch can be merged into `main`.

---

## Project Status

The project is currently under development.

Frontend and backend functionality is being implemented gradually across individual sprints. Some parts of the application are therefore currently only prepared or still in progress.

The goal of the project is to create a functional MVP application for managing and presenting a festival program.