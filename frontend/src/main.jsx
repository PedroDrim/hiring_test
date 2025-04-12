import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import Modal from 'react-modal'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login/Login';
import Register from './Login/Register';
import Play from './MemoryCardGame/Play';
import MemoryCardGame from './MemoryCardGame/MemoryCardGame';
import Congratulations from "./MemoryCardGame/Congratulation";
import { DifficultyEnums } from './Utils/DifficultyEnums';

// Creating "App" Tag
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  // Login function
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  // Logout function
  const handleLogout = () => {
     setIsAuthenticated(false);
     localStorage.removeItem('token');
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin}/>} />
        <Route path="/register" element={<Register />} />
        <Route path="/play" element={isAuthenticated ? <Play /> : <Navigate to="/login" />}/>

        <Route path="/easy" element={isAuthenticated ? <MemoryCardGame difficulty={DifficultyEnums.easy} /> : <Navigate to="/login" />}/>
        <Route path="/medium" element={isAuthenticated ? <MemoryCardGame difficulty={DifficultyEnums.medium} /> : <Navigate to="/login" />}/>  
        <Route path="/hard" element={isAuthenticated ? <MemoryCardGame difficulty={DifficultyEnums.hard} /> : <Navigate to="/login" />}/>

        <Route path="/congratulations-easy" element={isAuthenticated ? <Congratulations difficulty={DifficultyEnums.easy} /> : <Navigate to="/login" />}/>
        <Route path="/congratulations-medium" element={isAuthenticated ? <Congratulations difficulty={DifficultyEnums.medium} /> : <Navigate to="/login" />}/>
        <Route path="/congratulations-hard" element={isAuthenticated ? <Congratulations difficulty={DifficultyEnums.hard} /> : <Navigate to="/login" />}/>

        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

// Getting root element and rendering 'App'
const root = document.getElementById('root')

Modal.setAppElement(root)
createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
);
