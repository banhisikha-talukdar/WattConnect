import { useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  FileText,
  Users,
  User,
  Wrench,
  LayoutDashboard,
  FileBarChart,
  CalendarClock,
  LogOut
} from 'lucide-react';

export default function Navbar({ type }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    navigate('/');
  };

  const links = type === 'admin' ? [
    { name: 'Home', icon: <Home size={20} />, path: '/admin/home' },
    { name: 'Applications', icon: <FileText size={20} />, path: '/admin/applications' },
    { name: 'Engineer Scheduling', icon: <Wrench size={20} />, path: '/admin/engineer_scheduling' },
    { name: 'Meter Scheduling', icon: <CalendarClock size={20} />, path: '/admin/meter_scheduling' },
  ] : [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/customer/dashboard' },
    { name: 'New Application', icon: <FileText size={20} />, path: '/customer/new_application' },
    { name: 'Tips & Insights', icon: <FileBarChart size={20} />, path: '/customer/tips-insights' },
    { name: 'Schedule my engineer', icon: <Wrench size={20} />, path: '/customer/my_engineer_scheduling' },
    { name: 'Schedule my meter', icon: <CalendarClock size={20} />, path: '/customer/my_meter_scheduling' },
    { name: 'Profile', icon: <User size={20} />, path: '/customer/profile' },
  ];

  return (
    <aside className="w-68 bg-[#dfeafa] shadow-xl p-6 h-full">
      <h2 className="text-xl text-blue-700 font-bold mb-4">WattConnect</h2>
      <ul className="space-y-3">
        {links.map((link, index) => {
          const isActive = location.pathname === link.path;
          return (
            <li key={index} onClick={() => navigate(link.path)}>
              <div className={`relative rounded-lg p-[2px] transition-all duration-200
                ${isActive
                  ? 'bg-gradient-to-r from-[#031517] via-[#4eb14f] to-[#031517]'
                  : 'hover:bg-gradient-to-r hover:from-[#031517] via-gray-200 to-[#031517]'}
              `}>
                <div className={`flex items-center gap-3 cursor-pointer px-3 py-2 rounded-lg w-full h-full
                  ${isActive
                    ? 'bg-[#dfeafa] font-semibold text-[#031517]'
                    : 'bg-[#dfeafa] text-gray-600 hover:text-blue-500'}
                `}>
                  {link.icon}
                  <span>{link.name}</span>
                </div>
              </div>
            </li>
          );
        })}
        <li>
          <button onClick={handleLogout} className="flex items-center gap-3 font-bold bg-[#f20d19] text-white hover:bg-[#b70a13] rounded-lg cursor-pointer w-full text-left mt-4 px-3 py-2 transition-colors duration-100">
            <LogOut size={30} />
            <span>Logout</span>
          </button>
        </li>
      </ul>
    </aside>
  );
}
