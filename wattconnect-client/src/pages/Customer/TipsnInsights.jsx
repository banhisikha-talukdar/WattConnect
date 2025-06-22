import Navbar from '../../components/Navbar';

export default function TipsnInsights() {
  return (
    <div className="flex h-screen bg-[#dfeafa]">
      <Navbar type="customer" />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold">Get your tips and insights ready now!</h1>
      </main>
    </div>
  );
}