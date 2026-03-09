import axios from 'axios';

// In a real app, this would be your backend URL
const API_URL = import.meta.env.VITE_API_URL || 'https://api.example.com';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const doctorService = {
  getDoctors: () => api.get('/doctors'),
  getDoctorById: (id: string) => api.get(`/doctors/${id}`),
};

export const appointmentService = {
  bookAppointment: (data: any) => api.post('/appointment/book', data),
  getPatientAppointments: (patientId: string) => api.get(`/appointments/${patientId}`),
  cancelAppointment: (id: string) => api.put(`/appointment/${id}/cancel`),
  getDoctorRequests: (doctorId: string) => api.get(`/appointments/requests/${doctorId}`),
  updateStatus: (id: string, status: string) => api.put(`/appointment/${id}/status`, { status }),
};

export const adminService = {
  getStats: () => api.get('/admin/stats'),
  getDoctors: () => api.get('/admin/doctors'),
  addDoctor: (data: any) => api.post('/admin/doctors', data),
  updateDoctorStatus: (id: string, status: string) => api.put(`/admin/doctors/${id}/status`, { status }),
};

export default api;
