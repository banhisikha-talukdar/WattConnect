import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Footer from './components/Footer';
import NewApplicationForm from './components/NewApplicationForm';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import NewApplication from './pages/NewApplication';
import TrackMyApplication from './pages/TrackMyapplication';

// Customer Pages
import CustomerDashboard from './pages/Customer/Dashboard';
import AddEntry from './pages/Customer/AddEntry';
import TipsnInsights from './pages/Customer/TipsnInsights';
import MyProfile from './pages/Customer/MyProfile';

// Admin Pages
import Home from './pages/Admin/Home';
import Applications from './pages/Admin/Applications';
import MeterScheduling from './pages/Admin/MeterScheduling';

// Engineer Page
import PendingApplications from './pages/Engineer/PendingApplications';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/new-application" element={<NewApplication />}/>
          <Route path="/new-connection-form" element={<NewApplicationForm />} />
          <Route path="/track-my-application" element={<TrackMyApplication />}/>

          <Route path="/customer/dashboard" element={<CustomerDashboard />}/>
          <Route path="/customer/add" element={<AddEntry />} />
          <Route path="/customer/tips-insights" element={<TipsnInsights />}/>
          <Route path="/customer/profile" element={<MyProfile />}/>

          <Route path="/admin/home" element={<Home />} />
          <Route path="/admin/applications" element={<Applications />} />
          <Route path="/admin/meter-scheduling" element={<MeterScheduling />} />

          <Route path="/engineer/pending-applications" element={<PendingApplications />}/>
        </Routes>
        </div>
        {/* Always show footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
