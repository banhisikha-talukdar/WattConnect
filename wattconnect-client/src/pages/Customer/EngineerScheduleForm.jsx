import Navbar from '../../components/Navbar';

export default function ScheduleMyEngineer() {
  return (
    <div className="flex h-screen bg-[#dfeafa]">
      <Navbar type="customer" />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold">Apply for engineering scheduling in the form</h1>
      </main>
    </div>
  );
}