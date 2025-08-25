import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './components/Login';
import Home from './components/Home';
import EmployeeList from './components/EmployeeList';
import ProjectList from './components/ProjectList';
import ProjectAssignmentList from './components/ProjectAssignmentList';
import MyProjects from './components/MyProjects';

const ProtectedRoute = ({ isAllowed, children }) => {
  if (!isAllowed) {
    return <Navigate to="/" replace />;
  }
  return children;
};

// Bu fonksiyonu App component'inin DIŞINA taşıyalım. Daha temiz.
const getInitialRoles = () => {
  try {
    const storedRoles = localStorage.getItem('roles');
    // Eğer storedRoles 'null', 'undefined' veya boş bir string değilse, parse et.
    // Değilse, boş bir dizi döndür.
    return storedRoles ? JSON.parse(storedRoles) : [];
  } catch (error) {
    // Eğer parse ederken bir hata olursa (örneğin bozuk veri),
    // güvenli bir şekilde boş dizi döndür.
    console.error("Failed to parse roles from localStorage", error);
    return [];
  }
};

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  // State'i başlatmak için yukarıdaki güvenli fonksiyonu kullanıyoruz.
  const [roles, setRoles] = useState(getInitialRoles());

  const handleLogin = (newToken, newRoles) => {
    localStorage.setItem('token', newToken);
    // Kaydetmeden önce newRoles'in bir dizi olduğundan emin olalım.
    localStorage.setItem('roles', JSON.stringify(newRoles || [])); 
    setToken(newToken);
    setRoles(newRoles || []);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('roles');
    localStorage.removeItem('username');
    
    setToken(null);
    setRoles([]);
  };

  const isAdmin = roles.includes('ROLE_ADMIN');

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={token ? <Home onLogout={handleLogout} /> : <Login onLogin={handleLogin} />}
        />
        
        <Route path="/employees" element={
          <ProtectedRoute isAllowed={isAdmin}>
            <EmployeeList />
          </ProtectedRoute>
        } />
        <Route path="/projects" element={
          <ProtectedRoute isAllowed={isAdmin}>
            <ProjectList />
          </ProtectedRoute>
        } />
        <Route path="/assignments" element={
          <ProtectedRoute isAllowed={isAdmin}>
            <ProjectAssignmentList />
          </ProtectedRoute>
        } />
        <Route path="/my-projects" element={
          <ProtectedRoute isAllowed={!!token}>
            <MyProjects />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;



/*
import React, { useState, useEffect } from 'react';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './components/Login';
import Home from './components/Home';
import EmployeeList from './components/EmployeeList';
import ProjectList from './components/ProjectList';
import ProjectAssignmentList from './components/ProjectAssignmentList';
import MyProjects from './components/MyProjects';


const ProtectedRoute = ({ isAllowed, children }) => {
  if (!isAllowed) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [roles, setRoles] = useState(JSON.parse(localStorage.getItem('roles') || '[]'));


  const handleLogin = (newToken, newRoles) => {
    localStorage.setItem('token', newToken);  //tokenı kalıcı hafızaya yazar
    localStorage.setItem('roles', JSON.stringify(newRoles));
    setToken(newToken);
    setRoles(newRoles);
  };
  
 
  const handleLogout = () => {
    // Hafızayı temizle
    localStorage.removeItem('token');
    localStorage.removeItem('roles');
    localStorage.removeItem('username');
    
    // State'leri sıfırla
    setToken(null);
    setRoles([]);
  
  };


  const isAdmin = roles.includes('ROLE_ADMIN');


  return (
    <Router>
      <Routes>
        <Route
          path="/"
          // Home component'ine handleLogout fonksiyonunu onLogout prop'u olarak gönderiyoruz
          element={token ? <Home onLogout={handleLogout} /> : <Login onLogin={handleLogin} />}
        />
        
        <Route path="/employees" element={
          <ProtectedRoute isAllowed={isAdmin}>
            <EmployeeList />
          </ProtectedRoute>
        } />
        <Route path="/projects" element={
          <ProtectedRoute isAllowed={isAdmin}>
            <ProjectList />
          </ProtectedRoute>
        } />
        <Route path="/assignments" element={
          <ProtectedRoute isAllowed={isAdmin}>
            <ProjectAssignmentList />
          </ProtectedRoute>
        } />
        <Route path="/my-projects" element={
          <ProtectedRoute isAllowed={!!token}>
            <MyProjects />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
*/