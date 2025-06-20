export default function CustomerHome() {
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-lg p-6">
        <h2 className="text-xl font-bold mb-6">WattConnect</h2>
        <ul className="space-y-4">
          <li className="font-medium text-blue-600">Dashboard</li>
          <li className="text-gray-700 hover:text-blue-600 cursor-pointer">Usage Reports</li>
          <li className="text-gray-700 hover:text-blue-600 cursor-pointer">Bill & Payments</li>
          <li className="text-gray-700 hover:text-blue-600 cursor-pointer">Tips & Insights</li>
          <li className="text-gray-700 hover:text-blue-600 cursor-pointer">Application Status</li>
          <li className="text-gray-700 hover:text-blue-600 cursor-pointer">Settings</li>
          <li className="text-red-600 hover:text-red-800 cursor-pointer">Logout</li>
        </ul>
      </aside>
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold">Welcome back, Customer!</h1>
        {/* Add dashboard content here */}
      </main>
    </div>
  );
}