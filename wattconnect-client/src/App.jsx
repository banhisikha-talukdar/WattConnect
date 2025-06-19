import Login from './pages/Login';
import Signup from './pages/Signup';
import CustomerHome from './pages/CustomerHome';
import AdminHome from './pages/AdminHome';

import { BrowserRouter, Route, Routes, Navigate} from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/customer/home" element={<CustomerHome />} />
        <Route path="/admin/home" element={<AdminHome />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;