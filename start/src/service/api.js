// start/src/service/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// ✅ Her isteğe otomatik token ekle
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Giriş
export const login = async (username, password) => {
  return axiosInstance.post('/auth/login', {
    username,
    password,
  });
};

// ✅ Çalışanları getir
export const getEmployees = async () => {
  return axiosInstance.get('/employees/getAll');
};

// ✅ Yeni çalışan ekle
export const addEmployee = async (employee) => {
  return axiosInstance.post('/employees', employee);
};

// ✅ Çalışan güncelle
export const updateEmployee = async (id, employee) => {
  return axiosInstance.put(`/employees/${id}`, employee);
};

// ✅ Çalışan sil
export const deleteEmployee = async (id) => {
  return axiosInstance.delete(`/employees/${id}`);
};

export default axiosInstance;



/*
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Token'ı otomatik olarak her isteğe eklemek istersen:
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // localStorage'dan al
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔐 Giriş yap
export const login = async (username, password) => {
  return axiosInstance.post('/auth/login', {
    username,
    password,
  });
};

// ✅ Tüm çalışanları getir
export const getEmployees = async () => {
  return axiosInstance.get('/employees/getAll');
};

// ✅ Projeleri getir
export const getProjects = async () => {
  return axiosInstance.get('/projects');
};

// Diğer API fonksiyonları buraya eklenebilir (save, update, delete vs.)
export default axiosInstance;
*/
