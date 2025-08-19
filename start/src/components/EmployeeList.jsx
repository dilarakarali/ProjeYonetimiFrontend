/*
Çalışanları yönetmek için kullanılan admin sayfalarıdır. 
Verileri listeler, yeni veri eklemek için form içerir ve her bir veri için düzenleme/silme butonları sunar.
*/

import React, { useEffect, useState } from "react";
import axios from "axios";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    department: "",
    status: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const token = localStorage.getItem("token");
  const pageSize = 6;

  const fetchEmployees = (pageNumber = 0) => {
    axios
      .get(`http://localhost:8081/api/employees/paged?page=${pageNumber}&size=${pageSize}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        setEmployees(res.data.content);
        setPage(res.data.number);
        setTotalPages(res.data.totalPages);
      })
      .catch(err => console.error("Listing error:", err));
  };

  useEffect(() => {
    fetchEmployees(page);
  }, [page]);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors(prev => ({ ...prev, [e.target.name]: "" }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setErrors({});
    try {
      let res;
      if (editingId) {
        res = await axios.put(
          `http://localhost:8081/api/employees/${editingId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );
        fetchEmployees(page);
        setMessage("Kişi güncellendi.");
      } else {
        res = await axios.post(
          "http://localhost:8081/api/employees",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );
        fetchEmployees(page);
        setMessage("Kişi eklendi.");
      }

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        department: "",
        status: ""
      });
      setEditingId(null);
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      if (error.response?.status === 400 && typeof error.response.data === "object") {
        setErrors(error.response.data);
      } else {
        setMessage("Hata oluştu: " + (error.response?.data?.message || "403 Forbidden"));
      }
    }
  };

  const handleEdit = emp => {
    setFormData({
      firstName: emp.firstName || "",
      lastName: emp.lastName || "",
      email: emp.email || "",
      phoneNumber: emp.phoneNumber || "",
      department: emp.department || "",
      status: emp.status || ""
    });
    setEditingId(emp.id);
  };

  const handleDelete = id => {
    const confirmDelete = window.confirm("Bu kişiyi silmek istediğinize emin misiniz?");
    if (!confirmDelete) return;

    axios
      .delete(`http://localhost:8081/api/employees/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(() => {
        fetchEmployees(page);
      })
      .catch(err => console.error("Delete error:", err));
  };

  const goToPreviousPage = () => {
    if (page > 0) setPage(page - 1);
  };

  const goToNextPage = () => {
    if (page < totalPages - 1) setPage(page + 1);
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
          Employee Management
        </h2>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
          {["firstName", "lastName", "email", "phoneNumber", "department", "status"].map(field => (
            <div key={field}>
              <input
                name={field}
                type={field === "email" ? "email" : "text"}
                value={formData[field]}
                onChange={handleChange}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                required
                style={{ padding: "0.4rem", borderRadius: "4px", border: "1.5px solid #800000", width: "100%" ,fontSize: "14px"}}
              />
              {errors[field] && <p style={{ color: "red" }}>{errors[field]}</p>}
            </div>
          ))}

          <button
            type="submit"
            style={{
              padding: "0.4rem",
              borderRadius: "4px",
              border: "none",
              backgroundColor: "#800000",
              color: "white",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            {editingId ? "Update" : "Add"} Employee
          </button>
        </form>

        {message && <p style={{ color: "green", marginTop: "10px" }}>{message}</p>}

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
              <th>Ad</th>
              <th>Soyad</th>
              <th>Email</th>
              <th>Telefon</th>
              <th>Departman</th>
              <th>Durum</th>
              <th>İşlem</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => (
              <tr key={emp.id}>
                <td>{emp.firstName}</td>
                <td>{emp.lastName}</td>
                <td>{emp.email}</td>
                <td>{emp.phoneNumber}</td>
                <td>{emp.department}</td>
                <td>{emp.status}</td>
                <td>
                  <button onClick={() => handleEdit(emp)} style={{ marginRight: "5px" }}>Edit</button>
                  <button onClick={() => handleDelete(emp.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: "10px", textAlign: "center" }}>
          <button onClick={goToPreviousPage} disabled={page === 0} style={{ marginRight: "10px" }}>
            Önceki
          </button>
          <span>
            Sayfa {page + 1} / {totalPages}
          </span>
          <button onClick={goToNextPage} disabled={page + 1 === totalPages} style={{ marginLeft: "10px" }}>
            Sonraki
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeList;
