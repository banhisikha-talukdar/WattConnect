import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useContext, useEffect  } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
  LayoutDashboard,
  FileText,
  FileBarChart,
  Wrench,
  CalendarClock,
  User,
  LogOut,
  Menu,
  Home // 👈 Add this
} from 'lucide-react';

export default function Navbar({ type }) {
  const navigate = useNavigate();
  const { token, logout } = useContext(AuthContext);
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const handleLogout = () => {
      logout(); 
      navigate("/");
  };

  useEffect(() => {
      if (!token) {
        navigate("/");
    }
  }, [token, navigate]);

  const links = type === 'admin' ? [
    { name: 'Home', icon: <Home size={20} />, path: '/admin/home' },
    { name: 'Applications', icon: <FileText size={20} />, path: '/admin/applications' },
    { name: 'Engineer Scheduling', icon: <Wrench size={20} />, path: '/admin/engineer-scheduling' },
    { name: 'Meter Scheduling', icon: <CalendarClock size={20} />, path: '/admin/meter-scheduling' },
  ] : [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/customer/dashboard' },
    { name: 'Tips & Insights', icon: <FileBarChart size={20} />, path: '/customer/tips-insights' },
    { name: 'Schedule my engineer', icon: <Wrench size={20} />, path: '/customer/my-engineer-scheduling' },
    { name: 'Schedule my meter', icon: <CalendarClock size={20} />, path: '/customer/my-meter-scheduling' },
    { name: 'Profile', icon: <User size={20} />, path: '/customer/profile' },
  ];

  return (
    <>
      <button onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 bg-[#f4f6fa] p-2 rounded shadow md:hidden"
      >
        <Menu size={24} />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`
          ${isOpen ? 'translate-x-0' : '-translate-x-64'}
          fixed md:relative md:translate-x-0 top-0 left-0 h-full w-64 bg-[#f4f6fa] shadow-lg p-6 z-40 transition-transform duration-300
        `}
      >
        <div className="h-8" />
        <hr className="border-t border-gray-300 mb-6" />

        <ul className="space-y-3">
          {links.map((link, index) => {
            const isActive = location.pathname === link.path;
            return (
              <li key={index} onClick={() => navigate(link.path)}>
                <div
                  className={`relative rounded-lg p-[2px] transition-all duration-200
                    ${isActive
                      ? 'bg-gradient-to-r from-[#01217e] via-blue-300 to-[#01217e]'
                      : 'hover:bg-gradient-to-r hover:from-[#01217e] via-gray-200 to-[#01217e]'}
                  `}
                >
                  <div
                    className={`flex items-center gap-3 cursor-pointer px-3 py-2 rounded-lg w-full h-full
                      ${isActive
                        ? 'bg-[#f4f6fa] font-semibold text-[#01217e]'
                        : 'bg-[#f4f6fa] text-gray-600 hover:text-blue-500'}`}
                  >
                    {link.icon}
                    <span>{link.name}</span>
                  </div>
                </div>
              </li>
            );
          })}

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 font-bold bg-[#f20d19] text-white hover:bg-[#b70a13] rounded-lg cursor-pointer w-full text-left px-3 py-2 mt-4"
          >
            <LogOut size={24} />
            <span>Logout</span>
          </button>
        </ul>
      </aside>
    </>
  );
}
