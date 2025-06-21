import Navbar from '../../components/Navbar';
import { useNavigate } from 'react-router-dom';

export default function CustomerDashboard() {
  const navigate = useNavigate();

  const handleAddNew = () => {
    navigate('/customer/add');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Navbar type="customer" />
      <main className="flex-1 p-8 relative">
        <button
          onClick={handleAddNew}
          className="absolute top-8 right-8 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add New
        </button>
        <h1 className="text-2xl font-bold">Welcome to Customer Dashboard</h1>
      </main>
    </div>
  );
}
