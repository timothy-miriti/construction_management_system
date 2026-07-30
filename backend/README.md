#  Backend

Flask REST API for the Smart Construction Project Management System .
Handles authentication, role-based access control, and CRUD for projects, tasks,
expenses, materials, equipment, attendance, progress reports, and documents.

## Tech Stack

- **Flask** — web framework
- **Flask-SQLAlchemy** — ORM / database models
- **Flask-Migrate** — database migrations (Alembic)
- **Flask-JWT-Extended** — authentication (JSON Web Tokens)
- **Flask-Cors** — cross-origin support for the frontend
- **marshmallow** — request validation
- **bcrypt** — password hashing
- **SQLite** — database (development)

## Project Structure

```
backend/
├── app/
│   ├── __init__.py         # create_app() — the application factory
│   ├── config.py           # environment-based configuration
│   ├── extensions.py       # shared db/migrate/jwt/cors instances
│   ├── models/             # one file per database table
│   ├── schemas/             # marshmallow validation schemas
│   ├── middleware/rbac.py   # roles_required() decorator
│   ├── auth/routes.py       # register, login, /me
│   ├── projects/routes.py
│   ├── tasks/routes.py
│   ├── expenses/routes.py
│   ├── materials/routes.py
│   ├── equipment/routes.py
│   ├── attendance/routes.py
│   ├── progress_reports/routes.py
│   ├── documents/routes.py
│   └── dashboard/routes.py
├── migrations/              # Alembic migration history
├── requirements.txt
├── run.py                   # entry point
└── .env                     # secrets (not committed)
```

## Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in `backend/`:

```
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret
DATABASE_URL=sqlite:///app.db
```

Apply migrations and run the server:

```bash
export FLASK_APP=run.py
flask db upgrade
python run.py
```

The API runs at `http://127.0.0.1:5000`.

## Database Migrations

This project uses Flask-Migrate. After changing a model:

```bash
flask db migrate -m "describe the change"
flask db upgrade
```

Always review the generated migration file in `migrations/versions/` before
running `upgrade` — auto-generated migrations should be checked, not blindly trusted.

## Authentication

- `POST /api/auth/register` — create an account
- `POST /api/auth/login` — returns `access_token` and `user`
- `GET /api/auth/me` — returns the current user (requires `Authorization: Bearer <token>`)

Access tokens expire after 15 minutes.

## Roles

`admin`, `project_manager`, `engineer`, `contractor`, `worker`, `client`

Write operations (create/update/delete) are restricted per module using the
`roles_required()` decorator — see each `routes.py` file for the exact roles
allowed on each endpoint.

## API Overview

All resource endpoints (`/projects`, `/tasks`, `/expenses`, `/materials`,
`/equipment`, `/attendance`, `/progress-reports`, `/documents`) follow the same
REST shape:

| Method | Path | Notes |
|---|---|---|
| GET | `/api/<resource>` | List (supports `?project_id=` filter) |
| GET | `/api/<resource>/:id` | Single item (not all resources) |
| POST | `/api/<resource>` | Create |
| PUT | `/api/<resource>/:id` | Partial update |
| DELETE | `/api/<resource>/:id` | Delete |

Dashboard summary: `GET /api/dashboard`

## Known Limitations

- No refresh tokens — re-login required after 15 minutes
- `photo_url` / `file_url` fields accept plain text links, not real file uploads
- Task dependencies (`depends_on`) are stored but not enforced
- No `GET /users` listing endpoint yet (manager/worker fields use raw user IDs)