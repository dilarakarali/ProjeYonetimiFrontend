/*
Kullanıcı adı ve şifre girilen giriş ekranıdır. 
"Login" butonuna basıldığında api.js'teki login fonksiyonunu çağırır.
*/
import React, { useState } from 'react';
import { login } from '../service/api';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsloading] = useState(false);

const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsloading(true);

    try {
      const response = await login(username, password);

      // --- DEĞİŞİKLİK BURADA ---
      // Backend'den gelen cevabın içindeki 'data' nesnesinden token ve rolleri al
      const { token, roles } = response.data.data; 

      // Eğer token veya roller hala tanımsızsa, bir hata fırlat
      if (!token || !roles) {
        throw new Error("Token or roles not found in response");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("username", username);
      localStorage.setItem("roles", JSON.stringify(roles));

      onLogin(token, roles);
    } catch (err) {
      // Hata mesajını daha bilgilendirici hale getirelim
      console.error("Login Error:", err); // Konsola detaylı hatayı yazdır
      setError('Login failed. Please check your credentials or contact support.');
    } finally {
      setIsloading(false);
    }
  };

  /*
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsloading(true);

    try {
      const response = await login(username, password);

      const token = response.data.token;
      const roles = response.data.roles;

      localStorage.setItem("token", token);
      localStorage.setItem("username", username);
      localStorage.setItem("roles", JSON.stringify(roles));

      onLogin(token, roles);
    } catch (err) {
      setError('Login failed. Username or password is incorrect.');
    } finally {
      setIsloading(false);
    }
  };
*/
  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ba4d68ff', // açık bordo
      }}
    >
    <div
    style={{
      padding: '2rem',
      backgroundColor: 'white',
      borderRadius: '12px',
      border: '3px solid #800000', // kalın bordo kenar
      boxShadow: '0 6px 12px rgba(0,0,0,0.3)',
      minWidth: '300px',
    }}
  >
    <h2
      style={{
        textAlign: 'center',
        fontFamily: '"Comic Sans MS", cursive, sans-serif', // şekilli font
        fontSize: '2rem',
        color: '#800000',
        textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
        marginBottom: '1.5rem',
        letterSpacing: '2px',
      }}
    >
      Login
    </h2>
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
        style={{ padding: '0.5rem', borderRadius: '4px', border: '1.5px solid #800000' }}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
        style={{ padding: '0.5rem', borderRadius: '4px', border: '1.5px solid #800000' }}
      />
      <button
        type="submit"
        disabled={isLoading}
        style={{
          padding: '0.5rem',
          borderRadius: '4px',
          border: 'none',
          backgroundColor: '#800000',
          color: 'white',
          cursor: 'pointer',
          fontWeight: 'bold',
        }}
      >
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
    {error && <p style={{ color: 'red', textAlign: 'center', marginTop: '1rem' }}>{error}</p>}
  </div>
</div>
  );
};

export default Login;



/*           HTML
yazıyı biçimlendirmek için kullanıln taglar(etiket)
html-head-body-style
hr:bir satır çizgi çeker
br:bir satır boşluk bırakır
p:paragraf
strong:kalın yapar
b:kalın yapar
i:italik yapar
mark:işaretler
background:(width-height-color)arka plan için 
text-aligin:(center-left-right)resim veya yazının konumu
a href :link tıklama
OL ve UL:sıralı(123..) ve sırasız(noktalı) listeler
table-tr-td-th-rowspan-colspan:tablo oluşturur
inline-span ve blocak mantığı
div:sitenin daha dinamik/güzel olmasını sağlar/block elementidir aynı zamanda
. class - # id - <!...> yorum satırı
form:action-method-placeholder attribute var ve bir sürü type seçenekleri var
video:src tag(source) kaynak almak için -controls attribute
iframe:sayfa içinde sayfa gömmek
*/

/*            CSS 
CSS border style sayfasında var
HTML sayfası içinde CSS çağırmak:tag-style attribute-harici css dosyası
yorum satırı burdakiyle aynı
renklendirme:color picker-css/html rgb 
border ve radius:çerçeve(solid-dotted.. gibi çizgi özellikleri de var)
width ve height değeri px verirsen değer değişmez ama % verirsen tarayıcnın boyutuna göre değişir  
padding:contentle border arasındaki boşluğu ayarlama
margin:borderın dışındaki en dıştaki katman 
display:inline-block-inline block parametreleri
(sadece kendi alanını kaplıyorsa inline buna width ve height veremezsin, bütün satırı kaplıyorsa blocak)
font-weight(htmlde b-strong):kalınlık
font-family:yazı tipi
font-style(htmlde i):italik yapar
text-trasnform:büyük küçük harf
letter-spacing:harfler arası boşluk
text-decoration:çizgi çizer
word-spacing:kelimeler arasındaki boşluk 
CSS selectors reference w3schols(parent-child kullanarak)
fontawesome.com: ücretsiz açık kaynak icon  
cdnjs font awesome:iconun classının bulunduğu dosya 
link:(active-hover-visited) linkin ilk hali, üstüne gelinceki ve basınca renk değişimi
border-collopse:çift border gider
z-index:iki tag üst üste gelir
overflow:visible gösterir- hidden,scroll(her zaman), auto(gerekliyse) saklar 
navigation bar:menü
dropdown menü:seçenekli açılır bölüm üstüne tıklamalı 
*/