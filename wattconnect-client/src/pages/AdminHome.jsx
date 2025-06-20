import { useNavigate } from 'react-router-dom';

export default function AdminHome() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-lg p-6">
        <h2 className="text-xl font-bold mb-6">WattConnect</h2>
        <ul className="space-y-4">
          <li className="font-medium text-blue-600">Dashboard</li>
          <li className="text-gray-700 hover:text-blue-600 cursor-pointer">Applications</li>
          <li className="text-gray-700 hover:text-blue-600 cursor-pointer">Users</li>
          <li className="text-gray-700 hover:text-blue-600 cursor-pointer">Meter Scheduling</li>
          <li className="text-gray-700 hover:text-blue-600 cursor-pointer">Payouts & Billing</li>
          <li className="text-gray-700 hover:text-blue-600 cursor-pointer">Reports & Analytics</li>
          <li className="text-gray-700 hover:text-blue-600 cursor-pointer">Settings</li>
          <li>
            <button onClick={handleLogout} className="text-red-600 hover:text-red-800 cursor-pointer w-full text-left">
              Logout
            </button>
          </li>
        </ul>
      </aside>
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold">Welcome back, Admin!</h1>
        {/* Add dashboard content here */}
      </main>
    </div>
  );
}
