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
/*SORU 7 & 9:React projesini kurarken 'react-router-dom' gibi kütüphaneler npm ile indirildi.
Bu kütüphane, tek bir sayfada (SPA) farklı URL'ler için farklı bileşenler göstererek sanal sayfalar oluşturur
ve sayfalar arası geçişi yönetir. 'Navigate' bileşeni de buradan gelir.
Reactı doğrudan kurmadım.Reactla çalışmak için tüm gerekenleri içeren proje şablonunu Vite aracılığıyla kurdum
*/

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
/*SORU 2:React,projenizde kullanıcı arayüzünü (UI) oluşturmak ve yönetmek için kullanılan bir JavaScript kütüphanesidir.
Bu gibi yeniden kullanılabilir bileşenler (Login, Home vb.) oluşturarak
kullanıcı arayüzünü (UI) modüler ve yönetilebilir hale getirir.
Arayüzü modüler bileşenlere ayırdı.
State'ler ile veriyi dinamik olarak yönetti ve sayfa yenilemelerini ortadan kaldırdı.
Router ile sanal sayfalar arasında hızlı geçişler sağladı.
useEffect ve axios ile backend ile akıcı bir veri alışverişi sağladı.
*/
import Login from './components/Login';
import Home from './components/Home';
import EmployeeList from './components/EmployeeList';
import ProjectList from './components/ProjectList';
import ProjectAssignmentList from './components/ProjectAssignmentList';
import MyProjects from './components/MyProjects';

/*SORU 6(Authorization): Yetkilendirme mantığının frontend'deki yansımasıdır.
'isAllowed' (örneğin isAdmin mi?) kontrolü ile bir kullanıcının bu sayfaya girip giremeyeceğine karar verilir.
*/
const ProtectedRoute = ({ isAllowed, children }) => {
  if (!isAllowed) {
    return <Navigate to="/" replace />;
  }
  return children;
};

/*SORU 1 & 10:'localStorage.getItem' ile sayfa yenilendiğinde token'ın kaybolmaması sağlanır.
localStorage, tarayıcı kapatılıp açılsa bile silinmeyen bir depolama alanıdır.
Sonra app.jsx tokenle, routes yönlendirmesiyle karar veriyor.
Sayfa yenilenmesi anında API çağrısı yapılmaz.Apıler ana sayfayı gördükten sonra gelir.
'useState', React'in state (durum) yönetimi kancasıdır(hook).
Bu satır, React Yaşam Döngüsünün (Lifecycle) başlangıcını temsil eder. Bileşen ilk "doğduğunda"
tarayıcının kalıcı hafızasına (localStorage) bakarak token'ı okur.
Ama modern "Hooks" (Kancalar) yöntemiyle.Eski sınıf tabanlı (class-based) bileşenlerdeki componentDidMount veya componentDidUpdate gibi metotları doğrudan yazmadım 
Bunun yerine, aynı işlevleri gören useEffect hook'unu kullandım.
useEffect'in sonundaki diziye [page] gibi bir değişken koysaydın, o zaman page state'i her değiştiğinde useEffect tekrar çalışırdı.
Bu da eski componentDidUpdate'in karşılığı olurdu.
*/
function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [roles, setRoles] = useState(JSON.parse(localStorage.getItem('roles') || '[]'));
/*SORU 6 (Authentication):Kimlik doğrulama başarılı olduğunda (login), bu fonksiyon çalışır.
Backend'den gelen Token'ı alır ve hem state'e hem de localStorage'a kaydeder.
Authentication:"Sen kimsin?" 
Authorization:"Kim olduğuna göre, buraya girmeye iznin var mı?
*/

  const handleLogin = (newToken, newRoles) => {
    localStorage.setItem('token', newToken);  //tokenı kalıcı hafızaya yazar
    localStorage.setItem('roles', JSON.stringify(newRoles));
    setToken(newToken);
    setRoles(newRoles);
  };
  
 
/*SORU 5:Token, kullanıcının kimliğini kanıtlayan dijital bir pasaporttur.
Çıkış yapıldığında bu pasaport (token) hafızadan silinir.Sürekli hafızasında tutmasına gerek kalmadı.
*/
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


/*SORU 3 & 4:Spirng context merkzi bir konteynırdır.Spring bu konteyneri başlatır ve içine Bean adı verilen, önceden yapılandırılmış nesneleri doldurur. 
Uygulamanızın geri kalanı, ihtiyaç duyduğu nesneleri bu "hazır nesneler kutusundan" alarak çalışır. Bu yönetim şekline Inversion of Control denir.
Birbirlerine ihtiyaç duyan nesneleri bağımlılıkları Otomatik Olarak Enjekte Etmek (Dependency Injection)
Backend'deki Spring Context/Bean'ler ve ORM (JPA/Hibernate) köprü kurarak bu isAdmin kontrolünün
altyapısını oluşturur. Kullanıcı giriş yaptığında backend, veritabanından ORM ile kullanıcının
rollerini çeker ve bu bilgiyi token'a ekleyerek frontend'e gönderir.
Entity sınıfları "neyin" eşleneceğini, Repository arayüzleri ise bu eşlenmiş nesnelerle "nasıl" işlem yapılacağını tanımladı.
*/
  const isAdmin = roles.includes('ROLE_ADMIN');
/*SORU 8:Bu kodun tarayıcıda `http://localhost:5173` gibi bir adreste çalışmasını sağlayan
ve kodda değişiklik yaptığınızda sayfayı anında güncelleyen araç VITE'tır.
`npm run dev` komutuyla Vite'ın geliştirme sunucusunu başlatırsınız.
*/

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          // Home component'ine handleLogout fonksiyonunu onLogout prop'u olarak gönderiyoruz
          //element={token ? <Home onLogout={handleLogout} /> : <Login onLogin={handleLogin} />}
          element={(token && roles.length > 0) ? <Home onLogout={handleLogout} roles={roles} /> : <Login onLogin={handleLogin} />}
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
