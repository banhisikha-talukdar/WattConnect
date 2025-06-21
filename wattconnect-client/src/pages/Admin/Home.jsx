import Navbar from '../../components/Navbar';

export default function AdminHome() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Navbar type="admin" />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold">Welcome back, Admin!</h1>
        {/* Add dashboard content here */}
      </main>
    </div>
  );
}