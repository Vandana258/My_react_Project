import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import './intercepter';
import PublicRoutes from './Pages/Routes/PublicRoutes';
import ProtectedRoutes from './Pages/Routes/ProtectedRoutes';
import RoleBasedRoutes from './Pages/Routes/RoleBasedRoutes'
import Dashboard from './Pages/Dashboard/Dashboard';
import Unauthorized from './Pages/PublicPages/Unauthorized';
import Login from './Pages/Auth/Login'
import Profile from './Pages/AccountSettings/Profile';
import ChangePassword from './Pages/AccountSettings/ChangePassword';
import Item from './Pages/Items/item';
import SignUp from './Pages/Auth/Signup';
import ForgotPassword from './Pages/Auth/ForgotPassword';

function App() {
  return (
    // <BrowserRouter basename='/decorato'>
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicRoutes />}>
          <Route element={<Login />} path="/" />
          <Route element={<Login />} path="/login" />
          <Route element={<SignUp />} path="/sign-up" />
          <Route element={<ForgotPassword />} path="/forgot_password" />
        </Route>

        {/* Protected Routes for Authenticated Users */}
        <Route path="/" element={<ProtectedRoutes />}>
          {/* SuperAdmin Only Routes */}
          <Route element={<RoleBasedRoutes allowedRoles={["SuperAdmin", "Admin"]} />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          {/* Client Only Routes */}
          <Route element={<RoleBasedRoutes allowedRoles={["SuperAdmin", "Admin", "Client"]} />}>
            <Route path="/items" element={<Item />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/change-password" element={<ChangePassword />} />
              {/* <Route path="/client_quote_requests" element={<ClientQuoteRequests />} />
              <Route path="/client_offers" element={<ClientOffers />} /> */}
          </Route>

          {/* Common Routes for Both Roles */}
        </Route>
        
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </BrowserRouter>

  );
}

export default App;