import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

const apiClient = axios.create({ baseURL: BASE_URL });

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default apiClient;

// Auth
export const login = (data) => apiClient.post('/auth/login', data);
export const register = (data) => apiClient.post('/auth/register', data);

// Products
export const getProducts = () => apiClient.get('/products');
export const getProductById = (id) => apiClient.get(`/products/${id}`);
export const filterProducts = (params) => apiClient.get('/products/filter', { params });
export const createProduct = (data) => apiClient.post('/products', data);
export const updateProduct = (id, data) => apiClient.put(`/products/${id}`, data);
export const deleteProduct = (id) => apiClient.delete(`/products/${id}`);

// Categories
export const getCategories = () => apiClient.get('/categories');

// Inquiries
export const submitInquiry = (data) => apiClient.post('/inquiries', data);
export const getInquiries = () => apiClient.get('/inquiries');
export const getInquiryById = (id) => apiClient.get(`/inquiries/${id}`);
export const deleteInquiry = (id) => apiClient.delete(`/inquiries/${id}`);

// Cart
export const getCart = () => apiClient.get('/cart');
export const addCartItem = (data) => apiClient.post('/cart/items', data);
export const updateCartItem = (itemId, data) => apiClient.put(`/cart/items/${itemId}`, data);
export const removeCartItem = (itemId) => apiClient.delete(`/cart/items/${itemId}`);
export const clearCart = () => apiClient.delete('/cart');
export const submitCart = (data) => apiClient.post('/cart/submit', data);

// Orders
export const getMyOrders = () => apiClient.get('/orders');
export const getOrderById = (id) => apiClient.get(`/orders/${id}`);
export const getAllOrders = () => apiClient.get('/orders/admin/all');
export const updateOrder = (id, data) => apiClient.put(`/orders/admin/${id}`, data);
export const confirmOrder = (id) => apiClient.put(`/orders/admin/${id}/confirm`);

// File upload
export const uploadMedia = (file) => {
  const form = new FormData();
  form.append('file', file);
  return apiClient.post('/uploads/media', form, { headers: { 'Content-Type': 'multipart/form-data' } });
};
