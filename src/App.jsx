import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateGig from './pages/CreateGig';
import GigList from './pages/GigList';
import GigDetail from './pages/GigDetail';
import Orders from './pages/Orders';
import Chat from './pages/Chat';
import AdminDashboard from './pages/AdminDashboard';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import PaymentSuccess from './pages/PaymentSuccess';
import Navbar from './components/Navbar';

const AppLayout = ({ children }) => {
  const location = useLocation();
  const hideNavbarOn = ['/login', '/register'];

  return (
    <>
      {!hideNavbarOn.includes(location.pathname) && <Navbar />}
      {children}
    </>
  );
};

const App = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/" element={
            <ProtectedRoute>
              <GigList />
            </ProtectedRoute>
          } />

          <Route path="/gigs/:id" element={<GigDetail />} />

          <Route path="/create-gig" element={
            <ProtectedRoute>
              <CreateGig />
            </ProtectedRoute>
          } />

          <Route path="/orders" element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          } />

          <Route path="/chat/:gigId" element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          } />

          {user?.role === 'admin' && (
            <Route path="/admin" element={<AdminDashboard />} />
          )}

          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />

          <Route path="/payment-success" element={<PaymentSuccess />} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
};

export default App;
