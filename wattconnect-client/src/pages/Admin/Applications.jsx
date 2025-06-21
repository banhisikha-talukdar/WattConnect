import Navbar from '../../components/Navbar';

export default function Applications() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Navbar type="admin" />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold">Check the pending applications here!</h1>
        {/* Add dashboard content here */}
      </main>
    </div>
  );
}