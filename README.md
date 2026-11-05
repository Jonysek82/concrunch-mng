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
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── eventController.js
│   │   │   ├── merchantController.js
│   │   │   ├── newsController.js
│   │   │   ├── performerController.js
│   │   │   ├── tagController.js
│   │   │   └── userController.js
│   │   │
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   ├── errorMiddleware.js
│   │   │   ├── notFoundMiddleware.js
│   │   │   └── roleMiddleware.js
│   │   │
│   │   ├── models/
│   │   │   ├── Event.js
│   │   │   ├── Merchant.js
│   │   │   ├── News.js
│   │   │   ├── Performer.js
│   │   │   ├── Tag.js
│   │   │   └── User.js
│   │   │
│   │   ├── routes/
│   │   │   ├── admin.js
│   │   │   ├── auth.js
│   │   │   ├── events.js
│   │   │   ├── merchants.js
│   │   │   ├── news.js
│   │   │   ├── performers.js
│   │   │   ├── tags.js
│   │   │   └── users.js
│   │   │
│   │   ├── services/
│   │   ├── utils/
│   │   │   └── validators.js
│   │   ├── validators/
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── .env.example
│   ├── .gitignore
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

The backend application is built with Node.js and Express.js and uses MongoDB through Mongoose.

The backend uses a layered structure:

- `config/` – application configuration and database connection
- `controllers/` – API application logic
- `middleware/` – authentication, authorization, and error handling
- `models/` – MongoDB data models
- `routes/` – API endpoint definitions
- `services/` – service logic
- `utils/` – utility functions
- `validators/` – input data validation

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

---

## Cloning the Repository

```bash
git clone
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

Example basic configuration:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/concrunch_manager
CLIENT_URL=
NODE_ENV=development
```

Additional environment variables will be added as new features are implemented.

> Real passwords, API keys, tokens, and other sensitive information must not be committed to the Git repository.

### Running the Backend

```bash
npm run dev
```

The backend is normally available at:

```text

```

---

## Database

The backend uses MongoDB through the Mongoose library.

For local development, MongoDB can be used, for example, at:

```text
mongodb://127.0.0.1:27017
```

The application's database connection is defined using the following environment variable:

```env
MONGODB_URI=
```

---

## Git Workflow

The project is developed collaboratively by a team.

The branch:

```text
main
```

represents the shared stable version of the project.

For further development, we use working branches in the following format:

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

---

## Commit Convention

Commit messages use the following prefixes:

| Prefix | Meaning |
|---|---|
| `feat:` | new feature |
| `fix:` | bug fix |
| `docs:` | documentation |
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

---

## Pushing a Working Branch

For the first push:

```bash
git push -u origin firstname.lastname/area
```

For subsequent changes:

```bash
git push
```

Once a complete area of work is finished, the working branch is merged into `main`.

---

## Project Status

The project is currently under development.

Frontend and backend functionality is being implemented gradually across individual sprints. Some parts of the application are therefore currently only prepared or still in progress.

The goal of the project is to create a functional MVP application for managing and presenting a festival program.