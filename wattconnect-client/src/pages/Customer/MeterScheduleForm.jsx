import Navbar from '../../components/Navbar';

export default function ScheduleMyMeter() {
  return (
    <div className="flex h-screen bg-[#dfeafa]">
      <Navbar type="customer" />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold">Apply for meter scheduling in the form</h1>
      </main>
    </div>
  );
}