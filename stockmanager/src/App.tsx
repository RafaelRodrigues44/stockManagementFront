import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserRegistration from '../src/components/user/UserRegistration';
import Login from '../src/components/login/Login';
import StockManagement from '../src/components/stock/StockManagement';
import ProtectedRoute from '../src/routes/ProtectedRoutes';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} /> 
        <Route path="/register" element={<UserRegistration />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <StockManagement />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
