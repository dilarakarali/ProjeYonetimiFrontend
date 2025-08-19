/*
Adminlerin çalışanları projelere atadığı sayfadır. 
Dropdown menüler aracılığıyla proje ve çalışan seçimi yapılarak atama/çıkarma işlemleri gerçekleştirilir.
*/

import React, { useEffect, useState } from "react";
import axios from "axios";

const ProjectAssignmentList = () => {
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [assignedEmployees, setAssignedEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const token = localStorage.getItem("token");



  useEffect(() => {
    axios.get("http://localhost:8081/api/projects?size=200", {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      console.log("Projects API response:", res.data);
      // Sayfalı geliyorsa content, değilse direkt data
      setProjects(res.data.content || res.data);
    }).catch(console.error);

    axios.get("http://localhost:8081/api/employees", {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      console.log("Employees API response:", res.data);
      setEmployees(res.data.content || res.data);
    }).catch(console.error);
  }, [token]);

  const fetchAssignedEmployees = (projectId) => {
    if (!projectId) {
      setAssignedEmployees([]);
      return;
    }
    axios.get(`http://localhost:8081/api/assignments/${projectId}/employees`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      console.log("Atanan kişiler:", res.data);
      setAssignedEmployees(res.data);
    }).catch(err => {
      console.error("Atanan kişileri çekerken hata:", err);
      setAssignedEmployees([]);
    });
  };

  const handleProjectChange = (e) => {
    const projectId = e.target.value;
    setSelectedProjectId(projectId);
    fetchAssignedEmployees(projectId);
  };

  const handleAssign = () => {
    if (!selectedProjectId || !selectedEmployeeId) {
      alert("Lütfen proje ve kişi seçiniz.");
      return;
    }

    const alreadyAssigned = assignedEmployees.some(emp => emp.id.toString() === selectedEmployeeId);
    if (alreadyAssigned) {
      alert("Bu kişi zaten bu projeye atanmış.");
      return;
    }

    axios.post(
      `http://localhost:8081/api/assignments/assign?projectId=${selectedProjectId}&employeeId=${selectedEmployeeId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then(() => {
      fetchAssignedEmployees(selectedProjectId);
      setSelectedEmployeeId("");
    })
    .catch(err => {
      console.error("assignment error:", err);
      alert("Atamada hata oluştu.");
    });
  };

  const handleRemove = (employeeId) => {
    const confirmed = window.confirm("Bu kişiyi projeden silmek istediğinizden emin misiniz?");
    if (!confirmed) return;

    axios.delete(
      `http://localhost:8081/api/assignments/remove?projectId=${selectedProjectId}&employeeId=${employeeId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then(() => fetchAssignedEmployees(selectedProjectId))
    .catch(err => console.error("subtraction error:", err));
  };


  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "2rem",
        backgroundColor: "#b22222",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "800px",
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "12px",
          border: "3px solid #800000",
          boxShadow: "0 6px 12px rgba(0,0,0,0.3)"
        }}
      >
        <h2
          style={{
            textAlign: "center",
            fontFamily: '"Comic Sans MS", cursive, sans-serif',
            fontSize: "1rem",
            color: "#800000",
            textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
            marginBottom: "1.5rem",
            letterSpacing: "2px"
          }}
        >
          Proje Atama
        </h2>

        <div style={{ marginBottom: "1rem" }}>
          <label>Proje Seç: </label>
          <select
            value={selectedProjectId}
            onChange={handleProjectChange}
            style={{ padding: "0.4rem", borderRadius: "4px", border: "1.5px solid #800000", fontSize: "14px" }}
          >
            <option value="">-- Proje Seçiniz --</option>
            
            {projects.map(project => (
              <option key={project.id} value={project.id}>
                {project.projectName}
              </option>
            ))}
          </select>
        </div>

        {selectedProjectId && (
          <>
            <div style={{ marginBottom: "1rem" }}>
              <label>Kişi Seç: </label>
              <select
                value={selectedEmployeeId}
                onChange={(e) => setSelectedEmployeeId(e.target.value)}
                style={{ padding: "0.4rem", borderRadius: "4px", border: "1.5px solid #800000", fontSize: "14px" }}
              >
                <option value="">-- Kişi Seçiniz --</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.firstName} {emp.lastName}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAssign}
                style={{
                  marginLeft: "10px",
                  padding: "0.4rem 0.8rem",
                  borderRadius: "4px",
                  border: "none",
                  backgroundColor: "#800000",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: "bold"
                }}
              >
                Ata
              </button>
            </div>

            <h3 style={{ marginBottom: "0.5rem" }}>Projeye Atanmış Çalışanlar:</h3>
            {assignedEmployees.length > 0 ? (
              <ul style={{ listStyle: "none", padding: 0 }}>
                {assignedEmployees.map(emp => (
                  <li key={emp.id} style={{ marginBottom: "5px" }}>
                    {emp.firstName} {emp.lastName} ({emp.email})
                    <button
                      onClick={() => handleRemove(emp.id)}
                      style={{
                        marginLeft: "10px",
                        padding: "0.2rem 0.5rem",
                        borderRadius: "4px",
                        border: "none",
                        backgroundColor: "#800000",
                        color: "white",
                        cursor: "pointer",
                        fontSize: "12px"
                      }}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Henüz bu projeye atanan kişi yok.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProjectAssignmentList;
