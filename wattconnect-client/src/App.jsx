import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Footer from './components/Footer';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Customer Pages
import CustomerDashboard from './pages/Customer/Dashboard';
import AddEntry from './pages/Customer/AddEntry';
import NewApplication from './pages/Customer/NewApplication';
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

          <Route path="/customer/dashboard" element={<CustomerDashboard />}/>
          <Route path="/customer/add" element={<AddEntry />} />
          <Route path="/customer/new_application" element={<NewApplication />}/>
          <Route path="/customer/tips-insights" element={<TipsnInsights />}/>
          <Route path="/customer/my_engineer_scheduling" element={<EngineerSchedule />} />
          <Route path="/customer/my_meter_scheduling" element={<MeterSchedule />} />
          <Route path="/customer/schedule_my_engineer_form" element={<ScheduleMyEngineerForm />} />
          <Route path="/customer/schedule_my_meter_form" element={<ScheduleMyMeterForm />} />
          <Route path="/customer/profile" element={<MyProfile />}/>

          <Route path="/admin/home" element={<Home />} />
          <Route path="/admin/applications" element={<Applications />} />
          <Route path="/admin/engineer_scheduling" element={<EngineerScheduling />} />
          <Route path="/admin/meter_scheduling" element={<MeterScheduling />} />
        </Routes>
        </div>
        {/* Always show footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
