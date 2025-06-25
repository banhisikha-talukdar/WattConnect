import Navbar from '../../components/Navbar';

export default function AdminHome() {
  return (
    <div className="flex h-screen bg-[#f4f6fa]">
      <Navbar type="admin" />
      <main className="flex-1 p-8 overflow-y-auto relative">
        {/* Greeting */}
        <div className="mb-6">
          <h2 className="text-3xl font-semibold text-black">Hi Admin,</h2>
          <p className="text-5xl font-bold text-black mt-1">Welcome !</p>
        </div>

        {/* Add dashboard content here */}
        <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-5xl">
          {/* You can add admin-specific widgets, charts, etc. */}
          <p className="text-gray-600">Your admin dashboard content goes here.</p>
        </div>
      </main>
    </div>
  );
}
