import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import { AuthContext } from '../../context/AuthContext';

export default function MeterScheduling() {
  const [applications, setApplications] = useState([]);
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

  const handleMeterSelect = (appId, meterType) => {
    setSelectedMeters(prev => ({
      ...prev,
      [appId]: meterType
    }));
  };

  const handleStatusUpdate = async (application, newStatus) => {
    setProcessing(true);
    try {
      if (newStatus === 'connection_approved') {
        const res = await axios.put(`http://localhost:5000/api/approve-new-connection/${application.appId}`);
        const updatedApp = { ...application, status: "connection_approved", consumerNumber: res.data.consumerNumber };
        
        setApplications(prev =>
          prev.map(app =>
            app._id === application._id ? updatedApp : app
          )
        );
        setSelectedApp(null);
        return;
      }
  
      await axios.put(`http://localhost:5000/api/new-connection/${application.appId}/status`,
      { status: newStatus },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
      );
  
      setApplications(prev =>
        prev.map(app =>
          app._id === application._id ? { ...app, status: newStatus } : app
        )
      );
  
      setSelectedApp(null);
  
    } catch (error) {
      console.error('Error updating status:', error);
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
          {applications.map(app => (
            <div key={app._id} className="bg-white rounded-lg shadow p-4 mb-6">
              <p><strong>App ID:</strong> {app.appId}</p>
              <p><strong>District:</strong> {app.district}</p>
              <p><strong>Subdivision:</strong> {app.subdivision}</p>
              <p><strong>Applied Category:</strong> {app.appliedCategory}</p>
              <p><strong>Applied Load:</strong> {app.appliedLoad}</p>

              <div className="mt-4">
                <h2 className="font-semibold text-lg">Consumer Details</h2>
                <p><strong>Name:</strong> {app.consumerDetails?.name}</p>
                <p><strong>Father's Name:</strong> {app.consumerDetails?.fatherName}</p>
              </div>

              <div className="mt-4">
                <h2 className="font-semibold text-lg">Address Details</h2>
                <p><strong>Area:</strong> {app.addressDetails?.area}</p>
                <p><strong>Village/Town:</strong> {app.addressDetails?.villageOrTown}</p>
                <p><strong>Post Office:</strong> {app.addressDetails?.postOffice}</p>
                <p><strong>Police Station:</strong> {app.addressDetails?.policeStation}</p>
                <p><strong>District:</strong> {app.addressDetails?.district}</p>
                <p><strong>PIN Code:</strong> {app.addressDetails?.pinCode}</p>
                <p><strong>Mobile Number:</strong> {app.addressDetails?.mobileNumber}</p>
              </div>

              <div className="mt-4">
                <label htmlFor={`meter-${app._id}`} className="block text-sm font-medium mb-1">Select Meter Type:</label>
                <select
                  id={`meter-${app._id}`}
                  value={selectedMeters[app._id] || ""}
                  onChange={(e) => handleMeterSelect(app._id, e.target.value)}
                  className="border border-gray-300 rounded p-2 w-full md:w-2/3"
                >
                  <option value="">Select Meter</option>
                  {meters.map((meter, index) => (
                    <option
                      key={`${meter._id}-${index}`}
                      value={meter.type} // You can change to `meter._id` if needed
                      disabled={!meter.isAvailable}>
                      {`${meter.type} - ${meter.company} (${meter.isAvailable ? "Available" : "Unavailable"})`}
                    </option>
                  ))}
                </select>
              </div>

              {selectedMeters[app._id] && (
                <button
                  className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                  onClick={() => handleStatusUpdate(app, 'connection_approved')}
                  disabled={processing}
                >
                  {processing ? "Processing..." : "Confirm"}
                </button>
              )}
            </div>
          ))}
        </main>
      </div>
  );
}
