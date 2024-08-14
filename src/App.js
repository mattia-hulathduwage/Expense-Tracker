import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged, setPersistence, browserSessionPersistence, signOut } from 'firebase/auth';
import Sidebar from './components/Sidebar';
import Income from './pages/Income';
import Expense from './pages/Expense';
import CalendarPage from './pages/Calendar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Settings from './pages/Settings';

const auth = getAuth(); // Firebase Auth instance

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Set the persistence to 'browserSessionPersistence'
    setPersistence(auth, browserSessionPersistence)
      .then(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          setIsAuthenticated(!!user); // Update state based on user authentication
        });
        return () => unsubscribe(); // Clean up the subscription on unmount
      })
      .catch((error) => {
        console.error("Error setting persistence: ", error);
      });
  }, []);

  const handleLogout = () => {
    signOut(auth).then(() => {
      // Sign-out successful.
      // Redirect to login page or show a message
      setIsAuthenticated(false);
    }).catch((error) => {
      console.error("Error during sign-out: ", error);
    });
  };

  const ProtectedRoute = ({ element: Component, ...rest }) => {
    return isAuthenticated ? <Component {...rest} /> : <Navigate to="/" />;
  };

  return (
    <Router>
      <div style={{ display: 'flex', height: '100vh', margin: 0, padding: 0 }}>
        {isAuthenticated && <Sidebar onLogout={handleLogout} />} {/* Pass handleLogout to Sidebar */}
        <div style={{ flex: 1, overflowY: 'auto', zIndex: 1 }}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/income" element={<ProtectedRoute element={Income} />} />
            <Route path="/expense" element={<ProtectedRoute element={Expense} />} />
            <Route path="/calendar" element={<ProtectedRoute element={CalendarPage} />} />
            <Route path="/dashboard" element={<ProtectedRoute element={Dashboard} />} />
            <Route path="/settings" element={<ProtectedRoute element={Settings} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
