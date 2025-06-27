import Navbar from '../../components/Navbar';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  const sections = [
    {
      title: "New Applications",
      icon: "📄",
      description: "Review and approve new electricity connection applications submitted by customers.",
      action: () => navigate("/admin/applications"),
    },
    {
      title: "Engineer Scheduling",
      icon: "👷‍♂️",
      description: "Manage requests for engineer visits from customers based on their preferred schedule.",
      action: () => navigate("/admin/engineer_scheduling"),
    },
    {
      title: "Meter Scheduling",
      icon: "🔌",
      description: "Schedule and oversee meter installation visits requested by customers.",
      action: () => navigate("/admin/meter_scheduling"),
    },
  ];

  return (
    <div className="flex h-screen bg-[#f4f6fa]">
      <Navbar type="admin" />
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {/* Welcome Section */}
        <div className="mb-10">
          <h2 className="text-3xl font-semibold text-gray-800">Hi Admin,</h2>
          <p className="text-5xl font-bold text-[#01217e] mt-1">Welcome!</p>
        </div>

        {/* Horizontal Full-Width Sections */}
        <div className="space-y-6 max-w-5xl mx-auto">
          {sections.map((section, index) => (
            <div
              key={index}
              onClick={section.action}
              className="flex items-center gap-6 bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition cursor-pointer"
            >
              <div className="text-5xl">{section.icon}</div>
              <div className="flex flex-col">
                <h3 className="text-xl font-semibold text-[#01217e]">{section.title}</h3>
                <p className="text-gray-600">{section.description}</p>
                <span className="text-md text-blue-600 mt-2 hover:text-black">
                  Go to {section.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
