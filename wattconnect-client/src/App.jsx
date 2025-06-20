import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import LandingHeader from './components/LandingHeader';
import Footer from './components/Footer';
import LoginHeader from './components/LoginHeader';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CustomerHome from './pages/CustomerHome';
import AdminHome from './pages/AdminHome';

const AppLayout = ({ children, header }) => (
  <div className="min-h-screen flex flex-col bg-gray-50">
    {header}
    <main className="flex-grow">{children}</main>
    <Footer />
  </div>
);

const AppWrapper = () => {
  const location = useLocation();
  const { pathname } = location;
  if (pathname === '/login' || pathname === '/signup') {
    return (
      <AppLayout header={<LoginHeader />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </AppLayout>
    );
  }
  const showLandingHeader = pathname === '/';
  const header = showLandingHeader ? <LandingHeader /> : null;

  return (
    <AppLayout header={header}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/customer/home" element={<CustomerHome />} />
        <Route path="/admin/home" element={<AdminHome />} />
      </Routes>
    </AppLayout>
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