import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';

export default function EngineerScheduling() {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    const fetchEngineerRequests = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/schedule', {
          params: { type: 'engineer' },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        console.log("API response for engineer requests:", res.data);

        const requestList = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.data)
          ? res.data.data
          : [];

        setRequests(requestList);
      } catch (err) {
        console.error("Error fetching engineer requests:", err);
        setRequests([]);
      }
    };

    fetchEngineerRequests();
  }, []);

  const handleAccept = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/schedule/engineer/${id}/accept`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setRequests((prev) => prev.filter((r) => r._id !== id));
      setSelectedRequest(null);
    } catch (err) {
      console.error("Error accepting request:", err);
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/schedule/engineer/${id}/reject`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setRequests((prev) => prev.filter((r) => r._id !== id));
      setSelectedRequest(null);
    } catch (err) {
      console.error("Error rejecting request:", err);
    }
  };

  return (
    <div className="flex h-screen bg-[#f4f6fa]">
        <Navbar type="admin" />
      <main className="flex-1 px-4 sm:px-8 pt-15 pb-10 overflow-y-auto relative">
        <h1 className="text-2xl font-bold mb-6">Check the pending engineer schedule requests here!</h1>

        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${selectedRequest ? 'blur-sm pointer-events-none' : ''}`}>
          {requests.map((request) => (
            <div key={request._id} className="bg-white shadow-md rounded-lg p-4">
              <p className="font-semibold text-gray-800 mb-1">{request.applicantName}</p>
              <p className="text-sm text-gray-600">Consumer #: {request.consumerNumber}</p>
              <p className="text-sm text-gray-600 mb-4">Purpose: {request.usageType}</p>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800"
                onClick={() => setSelectedRequest(request)}
              >
                View
              </button>
            </div>
          ))}
        </div>

        {selectedRequest && (
          <div className="fixed inset-0 z-50 bg-white p-6 md:p-10 overflow-y-auto shadow-lg rounded-lg mx-auto max-w-2xl border border-gray-300">
            <h2 className="text-2xl font-bold mb-4">Engineer Visit Details</h2>
            <div className="space-y-2 text-gray-700">
              <p><strong>Consumer Number:</strong> {selectedRequest.consumerNumber}</p>
              <p><strong>District:</strong> {selectedRequest.district}</p>
              <p><strong>Subdivision:</strong> {selectedRequest.subdivision}</p>
              <p><strong>Name:</strong> {selectedRequest.applicantName}</p>
              <p><strong>Address:</strong> {selectedRequest.address}</p>
              <p><strong>Purpose:</strong> {selectedRequest.usageType}</p>
              <p><strong>Reason:</strong> {selectedRequest.reason}</p>
              <p><strong>Preferred Date:</strong> {selectedRequest.preferredDate}</p>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => setSelectedRequest(null)}
              >
                Go Back
              </button>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                onClick={() => handleAccept(selectedRequest._id)}
              >
                Accept
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={() => handleReject(selectedRequest._id)}
              >
                Reject
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
