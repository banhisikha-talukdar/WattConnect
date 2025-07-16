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
import EngineerSchedule from './pages/Customer/EngineerSchedule';
import MeterSchedule from './pages/Customer/MeterSchedule';
import ScheduleMyEngineerForm from './pages/Customer/ScheduleMyEngineerForm';
import ScheduleMyMeterForm from './pages/Customer/ScheduleMyMeterForm';
import MyProfile from './pages/Customer/MyProfile';

// Admin Pages
import Home from './pages/Admin/Home';
import Applications from './pages/Admin/Applications';
import EngineerScheduling from './pages/Admin/EngineerScheduling';
import MeterScheduling from './pages/Admin/MeterScheduling';

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
          <Route path="/customer/my-engineer-scheduling" element={<EngineerSchedule />} />
          <Route path="/customer/my-meter-scheduling" element={<MeterSchedule />} />
          <Route path="/customer/schedule-my-engineer-form" element={<ScheduleMyEngineerForm />} />
          <Route path="/customer/schedule-my-meter-form" element={<ScheduleMyMeterForm />} />
          <Route path="/customer/profile" element={<MyProfile />}/>

          <Route path="/admin/home" element={<Home />} />
          <Route path="/admin/applications" element={<Applications />} />
          <Route path="/admin/engineer-scheduling" element={<EngineerScheduling />} />
          <Route path="/admin/meter-scheduling" element={<MeterScheduling />} />
        </Routes>
        </div>
        {/* Always show footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
