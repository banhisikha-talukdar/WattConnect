import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CustomerHome from './pages/CustomerHome';
import AdminHome from './pages/AdminHome';

const AppLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col bg-gray-50">
    <Header />
    <main className="flex-grow">{children}</main>
    <Footer />
  </div>
);

const AppWrapper = () => {
  const location = useLocation();
  const noLayoutRoutes = ['/login', '/signup'];

  const isLayoutRoute = !noLayoutRoutes.includes(location.pathname);

  return isLayoutRoute ? (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/customer/home" element={<CustomerHome />} />
        <Route path="/admin/home" element={<AdminHome />} />
      </Routes>
    </AppLayout>
  ) : (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
