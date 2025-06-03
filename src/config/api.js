// API Configuration
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://mern-fashion-shop-api.onrender.com/api'  // URL của server trên Render
  : 'http://localhost:5000/api';  // URL local

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    REGISTER: `${API_URL}/auth/register`,
    LOGIN: `${API_URL}/auth/login`,
    LOGOUT: `${API_URL}/auth/logout`,
    CHECK_AUTH: `${API_URL}/auth/check-auth`,
  },
  // Shop endpoints
  SHOP: {
    PRODUCTS: `${API_URL}/shop/products`,
    CART: `${API_URL}/shop/cart`,
    ADDRESS: `${API_URL}/shop/address`,
    ORDER: `${API_URL}/shop/order`,
    SEARCH: `${API_URL}/shop/search`,
    REVIEW: `${API_URL}/shop/review`,
  },
  // Admin endpoints
  ADMIN: {
    PRODUCTS: `${API_URL}/admin/products`,
    ORDERS: `${API_URL}/admin/orders`,
    USERS: `${API_URL}/admin/users`,
  },
  // Common endpoints
  COMMON: {
    FEATURE: `${API_URL}/common/feature`,
  },
}; 