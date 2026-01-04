import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import JoinSession from './pages/JoinSession';
import StudentView from './pages/Student/StudentView';
import Register from './pages/Teacher/Register';
import Login from './pages/Teacher/Login';
import ActivitySession from './pages/Teacher/ActivitySession';
import TeacherDashboard from './pages/Teacher/TeacherDashboard';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import NotFound from './pages/NotFound';

function App() {
  return (
      <div className="min-h-screen flex flex-col">
        <Navbar /> {/* <--- Aici apare pe toate paginile */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path='join' element={<JoinSession />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/teacher" element={<PrivateRoute><TeacherDashboard /></PrivateRoute>} />
            <Route path="/teacher/activity/:id" element={<PrivateRoute><ActivitySession /></PrivateRoute>} />
            
            {/* Vizualizarea studentului - Navbar-ul se va ascunde automat aici */}
            <Route path="/session/:code" element={<StudentView />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
  );
}

export default App;