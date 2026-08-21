import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import { PrivateRoute, AdminRoute } from './components/RouteGuards';

import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import MyOrders from './pages/MyOrders';
import Contact from './pages/Contact';

import AdminLayout from './pages/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminPromotions from './pages/admin/AdminPromotions';
import AdminOrders from './pages/admin/AdminOrders';
import AdminMessages from './pages/admin/AdminMessages';
import AdminActivityLog from './pages/admin/AdminActivityLog';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Customer-only (any logged-in user) */}
            <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
            <Route path="/my-orders" element={<PrivateRoute><MyOrders /></PrivateRoute>} />

            {/* Admin-only area - separate from the customer login/session above.
                /admin/login is deliberately not linked anywhere in the site nav. */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="promotions" element={<AdminPromotions />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="messages" element={<AdminMessages />} />
              <Route path="activity-log" element={<AdminActivityLog />} />
            </Route>
          </Routes>
          <Footer />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
