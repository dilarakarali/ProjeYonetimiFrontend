/*
App.jsx: Tüm uygulamanın ana bileşenidir. Sayfalar arası geçişi (routing) ve kullanıcının giriş durumunu yönetir.
State Yönetimi: token ve roles bilgilerini useState ile tutar. Bu token'ın dolu veya boş olması, kullanıcının giriş yapıp yapmadığını belirler.
Yönlendirme (Router): URL'e göre hangi bileşenin (Login, Home, EmployeeList vb.) ekranda gösterileceğine karar verir.
Oturum Yönetimi: handleLogin ve handleLogout fonksiyonları ile kullanıcının giriş/çıkış işlemlerini yönetir. Bu fonksiyonlar localStorage (tarayıcı hafızası) üzerindeki token ve rol bilgilerini günceller.
Korunan Yollar (ProtectedRoute): Bir kullanıcının belirli bir sayfaya (örneğin /employees) erişim yetkisi olup olmadığını kontrol eder. Yetkisi yoksa onu ana sayfaya yönlendirir.

service/api.js: Backend ile İletişim Merkezi
Backend API'si ile olan tüm iletişimi tek bir yerden yönetir. Bu, kod tekrarını önler ve yönetimi kolaylaştırır.
Axios Instance: Backend'in ana adresi (http://localhost:8081/api) ile önceden yapılandırılmış bir axios nesnesi oluşturur.
Interceptor (Otomatik Token Ekleme): En önemli özelliğidir. Backend'e gönderilen her isteğin başlığına, localStorage'dan aldığı token'ı otomatik olarak ekler. Bu sayede her istekte "Ben kimim?" diye kendini kanıtlamış olur.
API Fonksiyonları: login, getEmployees gibi backend endpoint'lerini çağıran, kolay kullanımlı fonksiyonlar içerir.
components Klasörü: Ekranda Görünen Sayfalar
Kullanıcının gördüğü her bir sayfa veya arayüz parçasıdır.
*/


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

  // Login fonksiyonu - Değişiklik yok
  const handleLogin = (newToken, newRoles) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('roles', JSON.stringify(newRoles));
    setToken(newToken);
    setRoles(newRoles);
  };
  
  // YENİ LOGOUT FONKSİYONU
  const handleLogout = () => {
    // Hafızayı temizle
    localStorage.removeItem('token');
    localStorage.removeItem('roles');
    localStorage.removeItem('username');
    
    // State'leri sıfırla
    setToken(null);
    setRoles([]);
    
    // Navigate component'i render sırasında çalıştığı için burada direkt yönlendirme yapmaya gerek yok,
    // state değişimi zaten login sayfasını gösterecektir.
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
