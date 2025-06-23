import Navbar from '../../components/Navbar';

export default function TipsnInsights() {
  const tips = [
    {
      title: "Switch to LED Lighting",
      description:
        "LED bulbs use significantly less energy and can last over 10 years. Replacing older bulbs in high-usage areas is a quick win for both savings and sustainability."
    },
    {
      title: "Unplug Idle Devices",
      description:
        "Many devices still draw power even when off—this is known as “phantom” or standby energy. Unplug them manually or use a smart power strip to cut the drain."
    },
    {
      title: "Regular AC Maintenance",
      description:
        "Cleaning your AC filter every couple of weeks during peak seasons keeps airflow smooth and the unit running efficiently—translating into noticeable savings on your bill."
    },
    {
      title: "Track Your Usage Through the Website",
      description:
        "Use the dashboard to log monthly electricity usage. This helps you catch unusual spikes early and identify which months you use more power—then plan accordingly."
    },
    {
      title: "Submit Entries Consistently",
      description:
        "Use the Submit Usage feature every month to maintain a clear record of your consumption. This builds transparency and helps both you and your provider understand your habits better."
    },
    {
      title: "Start Using Solar Smart Meters",
      description:
        "Install a solar smart meter to track your energy production and consumption in real time. This helps optimize usage, reduce wastage, and uncover savings you might be missing."
    }
  ];

  return (
    <div className="flex h-screen bg-gradient-to-b from-white to-[#dceefd]">
      <Navbar type="customer" />
      <main className="flex-1 p-10 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-extrabold mb-4 text-[#226c82]">Energy Tips & Insights</h1>
          <p className="text-lg text-gray-700 mb-10">
            Make smarter energy choices with these practical tips — great for your wallet and the planet.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {tips.map((tip, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border border-gray-100"
              >
                <h2 className="text-2xl font-semibold text-[#226c82] mb-2">{tip.title}</h2>
                <p className="text-gray-700 text-base leading-relaxed">{tip.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
