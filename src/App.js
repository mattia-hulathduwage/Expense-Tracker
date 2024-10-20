import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Income from './pages/Income';
import Expense from './pages/Expense';
import CalendarPage from './pages/Calendar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Settings from './pages/Settings';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();
    let inactivityTimer;

    const handleLogout = () => {
        setIsAuthenticated(false);
        navigate('/login');
        // Make a request to invalidate session on server
        fetch('http://localhost:3001/logout', { method: 'POST' });
    };

    const resetInactivityTimer = () => {
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(handleLogout, 60 * 1000); // 1 minute
    };

    const ProtectedRoute = ({ element: Component, ...rest }) => {
        return isAuthenticated ? <Component {...rest} /> : <Navigate to="/login" />;
    };

    useEffect(() => {
        resetInactivityTimer();
        window.addEventListener('mousemove', resetInactivityTimer);
        window.addEventListener('keypress', resetInactivityTimer);
        
        return () => {
            clearTimeout(inactivityTimer);
            window.removeEventListener('mousemove', resetInactivityTimer);
            window.removeEventListener('keypress', resetInactivityTimer);
        };
    }, []);

    return (
        <div style={{ display: 'flex', height: '100vh', margin: 0, padding: 0 }}>
            {isAuthenticated && <Sidebar onLogout={handleLogout} />}
            <div style={{ flex: 1, overflowY: 'auto', zIndex: 1 }}>
                <Routes>
                    <Route path="/" element={<Navigate to="/login" />} />
                    <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/income" element={<ProtectedRoute element={Income} />} />
                    <Route path="/expense" element={<ProtectedRoute element={Expense} />} />
                    <Route path="/calendar" element={<ProtectedRoute element={CalendarPage} />} />
                    <Route path="/dashboard" element={<ProtectedRoute element={Dashboard} />} />
                    <Route path="/settings" element={<ProtectedRoute element={Settings} />} />
                </Routes>
            </div>
        </div>
    );
}

export default App;
