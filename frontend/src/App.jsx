import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import Navbar from './components/Navbar';

import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Contact from './pages/Contact';
import AboutUs from './pages/AboutUs';
import UserLogin from './pages/UserLogin';
import UserRegister from './pages/UserRegister';
import Cart from './pages/Cart';

import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductManagement from './pages/admin/ProductManagement';
import InquiryManagement from './pages/admin/InquiryManagement';
import OrderManagement from './pages/admin/OrderManagement';

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 64px - 96px)', overflowY: 'auto', paddingTop: '1rem' }}>
        {children}
      </main>
      <footer style={{ background: '#1a1a2e', color: '#aaa', textAlign: 'center', padding: '1.5rem', marginTop: '4rem', fontSize: '0.9rem' }}>
        © 2026 Sri Sai Mosquito Enterprises. All rights reserved.
      </footer>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Auth pages — no navbar */}
        <Route path="/login" element={<UserLogin />} />
        <Route path="/register" element={<UserRegister />} />

        {/* Protected admin pages */}
        <Route path="/admin/dashboard" element={<ProtectedRoute><Layout><AdminDashboard /></Layout></ProtectedRoute>} />
        <Route path="/admin/products" element={<ProtectedRoute><Layout><ProductManagement /></Layout></ProtectedRoute>} />
        <Route path="/admin/inquiries" element={<ProtectedRoute><Layout><InquiryManagement /></Layout></ProtectedRoute>} />
        <Route path="/admin/orders" element={<ProtectedRoute><Layout><OrderManagement /></Layout></ProtectedRoute>} />

        {/* Public pages */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/products" element={<Layout><Products /></Layout>} />
        <Route path="/products/:id" element={<Layout><ProductDetail /></Layout>} />
        <Route path="/contact" element={<Layout><Contact /></Layout>} />
        <Route path="/about" element={<Layout><AboutUs /></Layout>} />
        <Route path="/cart" element={<Layout><Cart /></Layout>} />
      </Routes>
    </AuthProvider>
  );
}

