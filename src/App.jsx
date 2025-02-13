import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './pages/Login';
import Items from './pages/Items';
import Payments from './pages/Payments';
import Settings from './pages/Settings';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import AddCustomer from './pages/AddCustomer';
import EditCustomer from './pages/EditCustomer';
import CustomerView from './pages/CustomerView';
import EditPayment from './pages/EditPayment';
import PaymentView from './pages/PaymentView';
import Reservations from './pages/Reservations';
import ProtectedRoute from './components/ProtectedRoute';
import Documentation from './pages/Documentation';

import { setUsers } from './store/reducers/userSlice';
import { setItems } from './store/reducers/itemSlice';
import { setPayments } from './store/reducers/paymentSlice';
import { setCustomers } from './store/reducers/customerSlice';
import { setCategories } from './store/reducers/categorySlice';
import { setReservations } from './store/reducers/reservationSlice';

import { handleGetUsers } from './actions/user';
import { handleGetPayments } from './actions/payment';
import { handleGetCustomers } from './actions/customer';
import { handleGetCategories } from './actions/category';
import { handleGetAllProducts } from './actions/product';
import { handleGetReservations } from './actions/reservation';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const loadData = async () => {
      try {
        const items = await handleGetAllProducts();
        const users = await handleGetUsers();
        const customers = await handleGetCustomers();
        const categories = await handleGetCategories();
        const reservations = await handleGetReservations();
        const payments = await handleGetPayments();

        // Dispatch actions only once per data fetch
        dispatch(setCustomers(customers));
        dispatch(setCategories(categories));
        dispatch(setItems(items));
        dispatch(setReservations(reservations));
        dispatch(setPayments(payments));
        dispatch(setUsers(users));
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, [dispatch]); // Ensure dispatch is the only dependency

  return (
    <Router>
      <ToastContainer position="top-right" draggable theme="dark" />
      <Routes>
        <Route path="/" element={<Login />} />

        {/* Redirect /dashboard to /home */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Navigate to="/home" replace />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <Navigate to="/home" replace />
            </ProtectedRoute>
          }
        />

        {/* Dashboard layout wrapper */}
        <Route
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route path="/home" element={null} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/reservations" element={<Reservations />} />
          <Route path="/items" element={<Items />} />
          <Route path="/items/:id" element={<Items />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/documentation" element={<Documentation />} />
          {/* Customer routes */}
          <Route path="/customer/:id" element={<CustomerView />} />
          <Route path="/customer/:id/edit" element={<EditCustomer />} />
          <Route path="/add-customer" element={<AddCustomer />} />
          {/* Payment routes */}
          <Route path="/payment/:id" element={<PaymentView />} />
          <Route path="/payment/:id/edit" element={<EditPayment />} />
        </Route>

        {/* Catch all route */}
        <Route
          path="*"
          element={
            localStorage.getItem('isAuthenticated') ? (
              <Navigate to="/home" replace />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
