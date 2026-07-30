#  Frontend

React single-page application for the Construction Project Management
System . Talks to the Flask backend via a REST API, with JWT-based
login and role-aware UI.

## Tech Stack

- **React (Vite)** — UI framework and build tool
- **Tailwind CSS** — styling
- **react-router-dom** — client-side routing
- **axios** — HTTP client
- **lucide-react** — icons

## Getting Started

```bash
cd frontend
npm install
npm run dev
```

Runs at `http://localhost:5173`. Requires the backend running at
`http://127.0.0.1:5000` (see `api/client.js` for the base URL).

## Folder Structure

```
src/
├── api/client.js            # configured axios instance, attaches JWT automatically
├── services/                 # one file per resource — thin wrappers around client.js
├── context/AuthContext.jsx   # global logged-in user state
├── routes/ProtectedRoute.jsx # redirects to /login if not authenticated
├── layouts/AppLayout.jsx     # shared sidebar + nav shell for all pages
├── components/Modal.jsx      # shared popup component
├── pages/
│   ├── Login/, Register/
│   ├── Dashboard/
│   ├── Projects/, Tasks/
│   └── Expenses/, Materials/, Equipment/, Attendance/, ProgressReports/, Documents/
├── App.jsx                   # route definitions
└── main.jsx                  # entry point — wraps App in Router + AuthProvider
```

## How Authentication Works

1. `Login.jsx` calls `authService.login()`, which hits `POST /api/auth/login`.
2. The returned `access_token` and `user` are stored in `localStorage`.
3. `AuthContext` reads this on load so refreshing the page keeps you logged in.
4. Every subsequent API request automatically includes the token via an axios
   interceptor in `api/client.js`.
5. If the backend ever returns `401` (expired/invalid token), the interceptor
   clears storage and redirects to `/login`.

## Page Pattern

Every feature page (Projects, Tasks, Expenses, etc.) follows the same shape:

1. Fetch the list from its service on mount (`useEffect`)
2. Optionally filter by project
3. Render a table
4. "Create" button opens a `Modal` with a form
5. On submit, call the service, close the modal, and re-fetch the list

If you're adding a new page, copy an existing one of the same shape rather
than starting from scratch.

## Role-Aware UI

Create/edit/delete buttons are conditionally shown based on `user.role` from
`AuthContext`, matching the backend's role restrictions. This is a usability
measure only — the backend is the actual security boundary.

## State Management

No Redux. The only global client state is the logged-in user (via Context).
Everything else is fetched per-page and held in local component state — this
project's scale doesn't need more than that.

## Known Limitations

- Manager/worker/uploader fields are raw numeric user IDs (no user dropdown yet)
- Tokens are stored in `localStorage`, not HttpOnly cookies
- Photo/document fields take a URL, not a real file upload