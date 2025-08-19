/*
Giriş yapıldıktan sonra karşılaşılan ana ekrandır. 
"Çalışanlar", "Projeler" gibi kutucuklar içerir. 
Kullanıcının rolüne (isAdmin) göre bu kutucuklara tıklanınca ne olacağına karar verir. 
Çıkış butonu da burada yer alır.
*/

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Home component'i artık onLogout adında bir prop alıyor.
const Home = ({ onLogout }) => { 
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const storedRoles = JSON.parse(localStorage.getItem("roles") || "[]");
    setRoles(storedRoles);
  }, []);

  const isAdmin = roles.includes('ROLE_ADMIN');

  const handleBoxClick = (box) => {
    if (box === "employee" || box === "project") {
      if (!isAdmin) {
        alert("Yetkiniz yok. Bu bölüme sadece admin erişebilir.");
        return;
      }
      navigate(box === "employee" ? "/employees" : "/projects");
    } else if (box === "assignment") {
      if (isAdmin) {
        navigate("/assignments");
      } else {
        navigate("/my-projects");
      }
    }
  };

  return (
    <div style={containerStyle}>
      {/* ÇIKIŞ YAP BUTONU */}
      <button onClick={onLogout} style={logoutButtonStyle}>
        Çıkış Yap
      </button>

      <h1 style={headerStyle}>Project Management</h1>
      <div style={boxContainerStyle}>
        {["employee", "project", "assignment"].map((box) => (
          <div
            key={box}
            onClick={() => handleBoxClick(box)}
            style={boxStyle}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.backgroundColor = "#ffe6e6"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.backgroundColor = "#fff"; }}
          >
            {box.charAt(0).toUpperCase() + box.slice(1).replace("ment", " Assignment")}
          </div>
        ))}
      </div>
    </div>
  );
};

// Stil objeleri
const containerStyle = { minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "center", paddingTop: "5%", backgroundColor: "#c54949ff" };
const headerStyle = { fontFamily: '"Comic Sans MS", cursive, sans-serif', color: "white", fontSize: "3rem", textShadow: "2px 2px 4px rgba(0,0,0,0.5)", marginBottom: "2rem" };
const boxContainerStyle = { display: "flex", justifyContent: "center", gap: "2rem", flexWrap: "wrap" };
const boxStyle = { width: "180px", height: "120px", backgroundColor: "#fff", border: "3px solid #b14e4eff", borderRadius: "12px", display: "flex", alignItems: "center", textAlign: "center", justifyContent: "center", cursor: "pointer", fontWeight: "bold", fontSize: "1.2rem", color: "#7b3838ff", boxShadow: "0 6px 12px rgba(0,0,0,0.3)", transition: "transform 0.2s, background-color 0.2s" };

// Logout butonu için stil
const logoutButtonStyle = {
  position: 'absolute',
  top: '20px',
  right: '20px',
  padding: '10px 20px',
  backgroundColor: '#800000',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: 'bold',
  boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
};


export default Home;
