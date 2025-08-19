/*
 Normal bir çalışanın (ROLE_EMPLOYEE) giriş yaptığında gördüğü, 
 sadece kendisine atanmış olan projelerin listelendiği, 
 salt okunur bir sayfadır. 
*/

import React, { useEffect, useState } from "react";
import axiosInstance from "../service/api"; // Merkezi axiosInstance'ı kullanıyoruz

const MyProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Backend'de oluşturduğumuz yeni, güvenli endpoint'i çağırıyoruz.
    // Parametre yok, ID yok, username yok. Token'ı api.js otomatik ekliyor.
    axiosInstance.get("/projects/my-assignments")
      .then(res => {
        setProjects(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Projelerim getirilirken hata:", err);
        setError("Projelerinizi yüklerken bir hata oluştu.");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Yükleniyor...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={containerStyle}>
      <div style={contentBoxStyle}>
        <h2 style={headerStyle}>Atandığım Projeler</h2>
        {projects.length > 0 ? (
          <table border="1" cellPadding="8" style={tableStyle}>
            <thead style={{ backgroundColor: "#f2f2f2" }}>
              <tr>
                <th>Proje Adı</th>
                <th>Durum</th>
                <th>Bütçe</th>
                <th>Başlangıç Tarihi</th>
                <th>Bitiş Tarihi</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(p => (
                <tr key={p.id}>
                  <td>{p.projectName}</td>
                  <td>{p.status}</td>
                  <td>{p.budget}</td>
                  <td>{p.startDate}</td>
                  <td>{p.endDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Henüz size atanmış bir proje bulunmamaktadır.</p>
        )}
      </div>
    </div>
  );
};

// Stil objeleri (kodun daha temiz olması için dışarı alındı)
const containerStyle = { minHeight: "100vh", padding: "2rem", backgroundColor: "#b22222", display: "flex", justifyContent: "center", alignItems: "flex-start" };
const contentBoxStyle = { width: "100%", maxWidth: "800px", backgroundColor: "white", padding: "2rem", borderRadius: "12px", border: "3px solid #800000", boxShadow: "0 6px 12px rgba(0,0,0,0.3)" };
const headerStyle = { textAlign: "center", fontFamily: '"Comic Sans MS", cursive, sans-serif', fontSize: "2rem", color: "#800000", textShadow: "2px 2px 4px rgba(0,0,0,0.3)", marginBottom: "1.5rem", letterSpacing: "2px" };
const tableStyle = { marginTop: "20px", width: "100%", borderCollapse: "collapse", textAlign: "left" };

export default MyProjects;