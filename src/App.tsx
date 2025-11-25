import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AdminProvider } from './context/AdminContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Cart from './components/Cart';
import Home from './pages/Home';
import About from './pages/About';
import Menu from './pages/Menu';
import Loyalty from './pages/Loyalty';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <CartProvider>
      <AdminProvider>
        <Router>
          <div className="min-h-screen flex flex-col">
            <Routes>
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/" element={
                <>
                  <Navbar />
                  <main className="flex-grow">
                    <Home />
                  </main>
                  <Footer />
                  <Cart />
                </>
              } />
              <Route path="/about" element={
                <>
                  <Navbar />
                  <main className="flex-grow">
                    <About />
                  </main>
                  <Footer />
                  <Cart />
                </>
              } />
              <Route path="/menu" element={
                <>
                  <Navbar />
                  <main className="flex-grow">
                    <Menu />
                  </main>
                  <Footer />
                  <Cart />
                </>
              } />
              <Route path="/loyalty" element={
                <>
                  <Navbar />
                  <main className="flex-grow">
                    <Loyalty />
                  </main>
                  <Footer />
                  <Cart />
                </>
              } />
              <Route path="/contact" element={
                <>
                  <Navbar />
                  <main className="flex-grow">
                    <Contact />
                  </main>
                  <Footer />
                  <Cart />
                </>
              } />
            </Routes>
          </div>
        </Router>
      </AdminProvider>
    </CartProvider>
  );
}

export default App;