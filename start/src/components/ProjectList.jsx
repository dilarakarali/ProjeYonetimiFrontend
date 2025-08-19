/*
Projeleri yönetmek için kullanılan admin sayfalarıdır. 
Verileri listeler, yeni veri eklemek için form içerir ve her bir veri için düzenleme/silme butonları sunar.
*/

import React, { useEffect, useState } from "react";
import axios from "axios";

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    projectName: "",
    status: "",
    budget: "",
    startDate: "",
    endDate: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const token = localStorage.getItem("token");
  const pageSize = 5;

  const fetchProjects = (pageNumber = 0) => {
    axios.get(`http://localhost:8081/api/projects?page=${pageNumber}&size=${pageSize}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setProjects(res.data.content);
      setTotalPages(res.data.totalPages);
      setPage(pageNumber);
    })
    .catch(err => console.error("project listing error:", err));
  };

  useEffect(() => {
    fetchProjects(0);
  }, []);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    const url = editingId
      ? `http://localhost:8081/api/projects/${editingId}`
      : "http://localhost:8081/api/projects";

    const method = editingId ? "put" : "post";

    axios[method](url, formData, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      fetchProjects(page);
      setFormData({
        projectName: "",
        status: "",
        budget: "",
        startDate: "",
        endDate: ""
      });
      setEditingId(null);
    })
    .catch(err => console.error("project update error:", err));
  };

  const handleEdit = project => {
    setFormData(project);
    setEditingId(project.id);
  };

  const handleDelete = id => {
    const confirm = window.confirm("Bu projeyi silmek istediğinize emin misiniz?");
    if (!confirm) return;

    axios.delete(`http://localhost:8081/api/projects/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => fetchProjects(page))
    .catch(err => console.error("delete error:", err));
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
            fontSize: "2rem",
            color: "#800000",
            textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
            marginBottom: "1.5rem",
            letterSpacing: "2px"
          }}
        >
          Project Management
        </h2>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
          {["projectName", "status", "budget", "startDate", "endDate"].map(field => (
            <div key={field}>
              <input
                name={field}
                type={field.includes("Date") ? "date" : "text"}
                value={formData[field]}
                onChange={handleChange}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                required={field !== "budget" && field !== "endDate"}
                style={{
                  padding: "0.4rem",
                  borderRadius: "4px",
                  border: "1.5px solid #800000",
                  width: "100%",
                  fontSize: "14px"
                }}
              />
            </div>
          ))}
          <button
            type="submit"
            style={{
              padding: "0.5rem",
              borderRadius: "4px",
              border: "none",
              backgroundColor: "#800000",
              color: "white",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            {editingId ? "Update" : "Add"} Project
          </button>
        </form>

        <table
          border="1"
          cellPadding="8"
          style={{
            marginTop: "20px",
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left"
          }}
        >
          <thead style={{ backgroundColor: "#f2f2f2" }}>
            <tr>
              <th>Project</th>
              <th>Status</th>
              <th>Budget</th>
              <th>Start</th>
              <th>End</th>
              <th>İşlem</th>
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
                <td>
                  <button onClick={() => handleEdit(p)} style={{ marginRight: "5px" }}>Edit</button>
                  <button onClick={() => handleDelete(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: "10px", textAlign: "center" }}>
          <button onClick={() => fetchProjects(page - 1)} disabled={page === 0} style={{ marginRight: "10px" }}>
            Önceki
          </button>
          <span>{page + 1} / {totalPages}</span>
          <button onClick={() => fetchProjects(page + 1)} disabled={page + 1 >= totalPages} style={{ marginLeft: "10px" }}>
            Sonraki
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectList;

