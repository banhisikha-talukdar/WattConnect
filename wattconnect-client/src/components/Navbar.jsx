import { useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  FileText,
  Users,
  User,
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
    { name: 'Engineer Scheduling', icon: <Users size={20} />, path: '/admin/engineer_scheduling' },
    { name: 'Meter Scheduling', icon: <CalendarClock size={20} />, path: '/admin/meter_scheduling' },
  ] : [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/customer/dashboard' },
    { name: 'New Application', icon: <FileText size={20} />, path: '/customer/new_application' },
    { name: 'Tips & Insights', icon: <FileBarChart size={20} />, path: '/customer/tips-insights' },
    { name: 'Profile', icon: <User size={20} />, path: '/customer/profile' },
  ];

  return (
    <aside className="w-64 bg-white shadow-lg p-6 h-full">
      <h2 className="text-xl text-blue-700 font-bold mb-4">WattConnect</h2>
      <ul className="space-y-3">
        {links.map((link, index) => (
          <li
            key={index}
            onClick={() => navigate(link.path)}
            className={`flex items-center gap-3 cursor-pointer px-3 py-2 rounded-lg transition duration-200 border-2 ${
              location.pathname === link.path
                ? 'border-[3px] border-transparent font-semibold bg-gray-200'
                : 'border-transparent text-gray-700 hover:bg-white hover:border-2 hover:border-[transparent] hover:bg-clip-padding hover:border-2 hover:[border-image:linear-gradient(to_right,blue,#60a5fa)_1]'
            }`}
          >
            {link.icon}
            <span>{link.name}</span>
          </li>
        ))}
        <li>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-red-600 hover:bg-red-100 hover:rounded-lg cursor-pointer w-full text-left mt-4"
          >
            <LogOut size={35} />
            <span>Logout</span>
          </button>
        </li>
      </ul>
    </aside>
  );
}
