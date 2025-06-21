import Navbar from '../../components/Navbar';

export default function CustomerDashboard() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Navbar type="customer" />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold">Welcome to Customer Dashboard</h1>
      </main>
    </div>
  );
}