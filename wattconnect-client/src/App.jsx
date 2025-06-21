import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import LandingHeader from './components/LandingHeader';
import Footer from './components/Footer';
import LoginHeader from './components/LoginHeader';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CustomerDashboard from './pages/Customer/Dashboard'
import AddEntry from './pages/Customer/AddEntry';

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
        <Route path="/customer/dashboard" element={<CustomerDashboard />}/>
        <Route path="/customer/add" element={<AddEntry />} />
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