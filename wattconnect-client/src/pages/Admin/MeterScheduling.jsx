import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import { AuthContext } from '../../context/AuthContext';

export default function MeterScheduling() {
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [meters, setMeters] = useState([]);
  const [selectedMeters, setSelectedMeters] = useState({});
  const { token } = useContext(AuthContext);

  useEffect(() => {
    fetchApplications();
    fetchMeters();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/new-connection/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setApplications(res.data.filter(app => app.status === "fme_approved"));
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const fetchMeters = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/meters');
      setMeters(res.data); 
    } catch (error) {
      console.error('Error fetching meters:', error);
    }
  };

  const handleMeterFieldSelect = (appId, field, value) => {
    setSelectedMeters(prev => ({
      ...prev,
      [appId]: {
        ...prev[appId],
        [field]: value
      }
    }));
    
    if (selectedApp && selectedApp.appId === appId) {
      setSelectedApp(prev => ({
        ...prev,
        meterCompany: field === "company" ? value : prev.meterCompany,
        meterType: field === "type" ? value : prev.meterType
      }));
    }
  };

  const handleConnectionConfirm = async (application) => {
    setProcessing(true);
    const selected = selectedMeters[application.appId];
    const matchedMeter = meters.find(
      m => m.type === selected.type && m.company === selected.company && m.isAvailable
    );

    if (!matchedMeter) {
      alert("Selected meter combination not available.");
      setProcessing(false);
      return;
    }
    try {
      await axios.put(
        `http://localhost:5000/api/approve-new-connection/${application.appId}`
      );

      setSelectedMeters(prev => ({
        ...prev,
        [application.appId]: {
          ...selected,
          status: "connection_approved"
        }
      }));

      setSelectedApp(null);
      alert("Connection approved successfully");
    } catch (error) {
      console.error("Error approving connection:", error);
      alert(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setProcessing(false);
    }
  };

  return (
      <div className="flex h-screen bg-[#f4f6fa]">
        <Navbar type="admin" />
        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          <h1 className="text-2xl font-bold mb-6">Applications approved by FMEs</h1>
          <table className="min-w-full bg-white shadow-md rounded">
            <thead>
              <tr className="bg-gray-100 text-left text-sm font-semibold">
                <th className="p-3">App ID</th>
                <th className="p-3">Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Load</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {applications.map(app => {
                const confirmed = selectedMeters[app.appId] === "connection_approved";
                return (
                  <tr key={app._id} className={confirmed ? "bg-green-100" : "bg-white"}>
                    <td className="p-3">{app.appId}</td>
                    <td className="p-3">{app.consumerDetails?.name}</td>
                    <td className="p-3">{app.appliedCategory}</td>
                    <td className="p-3">{app.appliedLoad}</td>
                    <td className="p-3">
                      {confirmed ? "Connection Approved" : "Pending"}
                    </td>
                    <td className="p-3">
                      {!confirmed && (
                        <button
                          className="text-blue-600 underline"
                          onClick={() => setSelectedApp(app)}
                        >
                          View Details
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

        {selectedApp && (
          <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Details for App ID: {selectedApp.appId}</h2>
              <button
                onClick={() => setSelectedApp(null)}
                className="text-sm text-red-600 underline"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
              <p><strong>Name:</strong> {selectedApp.consumerDetails?.name}</p>
              <p><strong>Father's Name:</strong> {selectedApp.consumerDetails?.fatherName}</p>
              <p><strong>Area:</strong> {selectedApp.addressDetails?.area}</p>
              <p><strong>Village/Town:</strong> {selectedApp.addressDetails?.villageOrTown}</p>
              <p><strong>Post Office:</strong> {selectedApp.addressDetails?.postOffice}</p>
              <p><strong>Police Station:</strong> {selectedApp.addressDetails?.policeStation}</p>
              <p><strong>District:</strong> {selectedApp.addressDetails?.district}</p>
              <p><strong>PIN Code:</strong> {selectedApp.addressDetails?.pinCode}</p>
              <p><strong>Mobile:</strong> {selectedApp.addressDetails?.mobileNumber}</p>
            </div>

            <label className="block text-sm font-medium mb-1">Select Meter Type:</label>
              <select
                value={selectedMeters[selectedApp.appId]?.type || ""}
                onChange={(e) =>
                  handleMeterFieldSelect(selectedApp.appId, "type", e.target.value)
                }
                className="border border-gray-300 rounded p-2 w-full md:w-2/3 mb-4"
              >
                <option value="">Select Type</option>
                {[...new Set(meters.map(m => m.type))].map((type, i) => (
                  <option key={i} value={type}>{type}</option>
                ))}
              </select>

              <label className="block text-sm font-medium mb-1">Select Company:</label>
              <select
                value={selectedMeters[selectedApp.appId]?.company || ""}
                onChange={(e) =>
                  handleMeterFieldSelect(selectedApp.appId, "company", e.target.value)
                }
                className="border border-gray-300 rounded p-2 w-full md:w-2/3 mb-4"
              >
                <option value="">Select Company</option>
                {[...new Set(meters.map(m => m.company))].map((company, i) => (
                  <option key={i} value={company}>{company}</option>
                ))}
              </select>

            <button
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              onClick={() => handleConnectionConfirm(selectedApp)}
              disabled={processing || !selectedMeters[selectedApp.appId]}
            >
              {processing ? "Processing..." : "Confirm Connection"}
            </button>
          </div>
        )}
        </main>
      </div>
  );
}
