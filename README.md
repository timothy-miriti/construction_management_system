#  Construction Project Management System 

A full-stack web application for managing construction projects — tracking
projects, tasks, budgets, materials, equipment, workforce attendance, progress
reports, and documents, with role-based access for admins, project managers,
engineers, contractors, workers, and clients.

Built with a **Flask REST API** backend and a **React** frontend.

## Repository Structure

```
construction_management_system/
├── backend/     Flask API, SQLite database, JWT auth, RBAC
├── frontend/     React (Vite) single-page app
├── docs/         Project documentation
└── README.md     (this file)
```

See `backend/README.md` and `frontend/README.md` for setup details specific
to each half.

## Quick Start

**1. Backend** (in one terminal):
```bash
cd backend
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
export FLASK_APP=run.py
flask db upgrade
python run.py
```
Runs at `http://127.0.0.1:5000`.

**2. Frontend** (in a second terminal):
```bash
cd frontend
npm install
npm run dev
```
Runs at `http://localhost:5173`.

Open the frontend URL in your browser, register an account, and log in.

## Tech Stack Summary

| | |
|---|---|
| Backend | Flask, SQLAlchemy, Flask-Migrate, Flask-JWT-Extended, marshmallow |
| Frontend | React, Vite, Tailwind CSS, react-router-dom, axios |
| Database | SQLite |
| Auth | JWT (JSON Web Tokens) |

## Core Modules

Authentication · Projects · Tasks (with dependencies) · Expenses (planned vs.
actual) · Materials · Equipment · Attendance · Progress Reports · Documents ·
Dashboard (live summary)

## Roles

| Role | Access |
|---|---|
| admin | Full access, including deleting projects |
| project_manager | Creates/manages projects, tasks, budgets, materials, equipment |
| engineer | Updates progress reports and documents |
| contractor | Logs attendance and progress reports |
| worker | Views tasks, logs own attendance |
| client | Read-only access to project updates |

## Architecture at a Glance

- Backend: Flask application factory pattern; one module per resource
  (model + validation schema + routes), each protected by a `roles_required()`
  decorator matching the table above.
- Frontend: one service file and one page per resource, sharing a common
  layout, authentication context, and API client. No Redux — server data is
  fetched per page; the only global client state is the logged-in user.

## Known Limitations (by design, for this version)

- No refresh tokens — sessions expire after 15 minutes
- Photos/documents are stored as links, not uploaded files
- Task dependencies are tracked but not automatically enforced
- No notifications system yet — the dashboard is the single source of updates

See each half's own README for more detail, and `docs/` for full project
documentation.

## Contributors

Backend — implemented independently.
Frontend — split across two contributors; see `docs/` for the team split guide.