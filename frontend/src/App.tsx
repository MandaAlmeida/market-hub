import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import Register from './pages/register';
import Login from './pages/login';
import Marketplace from './pages/marketplace';
import { PrivateRoute } from './PrivateRoute';
import PaymentPage from './pages/payment';
import CreateAdPage from './pages/createAd';
import GoogleCallback from './components/googleCallback';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth/callback" element={<GoogleCallback />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Marketplace />} />


        <Route
          path="/payment/:orderId"
          element={
            <PrivateRoute>
              <PaymentPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/createAd"
          element={
            <PrivateRoute>
              <CreateAdPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
