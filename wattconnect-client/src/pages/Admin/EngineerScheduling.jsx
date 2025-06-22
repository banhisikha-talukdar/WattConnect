import Navbar from '../../components/Navbar';

export default function EngineerScheduling() {
  return (
    <div className="flex h-screen bg-[#dfeafa]">
      <Navbar type="admin" />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold">Check the pending engineer schedules here!</h1>
        {/* Add dashboard content here */}
      </main>
    </div>
  );
}