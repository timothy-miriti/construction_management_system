import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import { ProtectedRoute } from './routes/ProtectedRoute.jsx';
import Projects from './pages/Projects/Projects.jsx';
import Tasks from './pages/Tasks/Tasks.jsx';
import Expenses from './pages/Expenses/Expenses.jsx';
import Materials from './pages/Materials/Materials.jsx';
import Equipment from './pages/Equipment/Equipment.jsx';
import Attendance from './pages/Attendance/Attendance.jsx';
import ProgressReports from './pages/ProgressReports/ProgressReports.jsx';
import Documents from './pages/Documents/Documents.jsx';
import Register from './pages/Register/Register.jsx';





function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route
        path="/projects"
        element={
          <ProtectedRoute>
            <Projects />
          </ProtectedRoute>
        }
      />
      <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
      <Route path="/expenses" element={<ProtectedRoute><Expenses /></ProtectedRoute>} />
      <Route path="/materials" element={<ProtectedRoute><Materials /></ProtectedRoute>} />
      <Route path="/equipment" element={<ProtectedRoute><Equipment /></ProtectedRoute>} />
      <Route path="/attendance" element={<ProtectedRoute><Attendance /></ProtectedRoute>} />
      <Route path="/progress-reports" element={<ProtectedRoute><ProgressReports /></ProtectedRoute>} />
      <Route path="/documents" element={<ProtectedRoute><Documents /></ProtectedRoute>} />
      <Route path="/register" element={<Register />} />


    </Routes>
    
  );
}

export default App;