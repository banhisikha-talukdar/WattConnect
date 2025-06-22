import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import LandingHeader from './components/LandingHeader';
import Footer from './components/Footer';
import LoginSignupHeader from './components/LoginSignupHeader';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AddEntry from './pages/Customer/AddEntry';
import Home from './pages/Admin/Home';
import CustomerDashboard from './pages/Customer/Dashboard'
import NewApplication from './pages/Customer/NewApplication'
import TipsnInsights from './pages/Customer/TipsnInsights'
import MyProfile from './pages/Customer/MyProfile'
import Applications from './pages/Admin/Applications';
import EngineerScheduling from './pages/Admin/EngineerScheduling';
import MeterScheduling from './pages/Admin/MeterScheduling';

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
      <AppLayout header={<LoginSignupHeader />}>
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
        <Route path="/admin/home" element={<Home />} />
        <Route path="/customer/dashboard" element={<CustomerDashboard />}/>
        <Route path="/customer/add" element={<AddEntry />} />
        <Route path="/customer/new_application" element={<NewApplication />}/>
        <Route path="/customer/tips-insights" element={<TipsnInsights />}/>
        <Route path="/customer/profile" element={<MyProfile />}/>
        <Route path="/admin/applications" element={<Applications />} />
        <Route path="/admin/engineer_scheduling" element={<EngineerScheduling />} />
        <Route path="/admin/meter_scheduling" element={<MeterScheduling />} />
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