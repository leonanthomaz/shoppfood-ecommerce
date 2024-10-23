// src/routes/index.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Navbar from '../components/Navbar';
import NotFoundPage from '../pages/NotFoundPage';
import MenuPage from '../pages/Menu';
import PurchasePage from '../components/PurchasePage';
import NavbarFlex from '../components/NavbarFooter';
import Cart from '../components/Cart';
import Checkout from '../pages/Checkout';
import Order from '../components/Order';
import LoginPage from '../pages/Authentication/Login';
import RegisterPage from '../pages/Authentication/Register';
import PaymentPage from '../pages/Payment';
import ContactPage from '../pages/Contact';
import TermsAcceptance from '../components/TermsAcceptance';
import OrderLoggedIn from '../pages/Order';
import Profile from '../pages/Profile';

const AppRoute: React.FC = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/orders" element={<Order />} />
        <Route path="/orders-test" element={<OrderLoggedIn />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/purchase" element={<PurchasePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/terms" element={<TermsAcceptance />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <NavbarFlex/>
      {/* <Footer /> */}
    </>
  );
};

export default AppRoute;
