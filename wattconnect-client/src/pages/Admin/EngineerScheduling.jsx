import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import { AuthContext } from '../../context/AuthContext';

export default function EngineerScheduling() {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [fmes, setFmes] = useState([]);
  const [selectedFme, setSelectedFme] = useState(null);
  const [showFmeDialog, setShowFmeDialog] = useState(false);
  const { token } = useContext(AuthContext);

  const fetchEngineerRequests = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/schedule', {
        params: { type: 'engineer' },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const requestList = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.data)
        ? res.data.data
        : [];

      const pendingOnly = requestList.filter((r) => r.status === 'Pending');
      setRequests(pendingOnly);
    } catch (err) {
      console.error('Error fetching engineer requests:', err);
      setRequests([]);
    }
  };

  useEffect(() => {
    if (token) fetchEngineerRequests();
  }, [token]);

  const handleReject = async (id) => {
    try {
      await axios.post(
        `http://localhost:5000/api/schedule/${id}/reject`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { type: 'engineer' },
        }
      );
      await fetchEngineerRequests();
      setSelectedRequest(null);
    } catch (err) {
      console.error('Error rejecting request:', err);
    }
  };

  const handleAccept = async (id) => {
    try {
      await axios.post(
        `http://localhost:5000/api/schedule/${id}/accept`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { type: 'engineer' },
        }
      );

      const res = await axios.get('http://localhost:5000/api/fmes', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFmes(Array.isArray(res.data) ? res.data : []);
      setShowFmeDialog(true);
    } catch (err) {
      console.error('Error accepting request or fetching FMEs:', err);
    }
  };

  const confirmFmeAssignment = async () => {
    if (!selectedFme || !selectedRequest) return;

    try {
      await axios.post(
        `http://localhost:5000/api/schedule/${selectedRequest._id}/assign-fme`,
        { fmeId: selectedFme._id },
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { type: 'engineer' },
        }
      );

      setSelectedFme(null);
      setSelectedRequest(null);
      setShowFmeDialog(false);
      await fetchEngineerRequests(); // Only now refresh
    } catch (err) {
      console.error('Error assigning FME:', err);
    }
  };

  return (
    <div className="flex h-screen bg-[#f4f6fa]">
      <Navbar type="admin" />
      <main className="flex-1 px-4 sm:px-8 pt-15 pb-10 overflow-y-auto relative">
        <h1 className="text-2xl font-bold mb-6">Pending engineer schedule requests</h1>

        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${(selectedRequest || showFmeDialog) ? 'blur-sm pointer-events-none' : ''}`}>
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

        {/* Request Details Panel */}
        {selectedRequest && !showFmeDialog && (
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

        {/* FME Assignment Dialog */}
        {showFmeDialog && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 md:p-10 overflow-y-auto shadow-lg rounded-lg max-w-2xl w-full border border-gray-300" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-2xl font-bold mb-4">Assign FME</h2>
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {fmes.map((fme) => (
                  <div
                    key={fme._id}
                    className={`p-4 border rounded cursor-pointer ${
                      selectedFme && selectedFme._id === fme._id
                        ? 'border-blue-500 bg-blue-50'
                        : 'hover:border-gray-400'
                    }`}
                    onClick={() => setSelectedFme(fme)}
                  >
                    <p className="font-semibold text-lg">{fme.name}</p>
                    <p>Employee ID: {fme.employeeId}</p>
                    <p>Contact: {fme.contactNumber}</p>
                    <p>Email: {fme.email}</p>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                  onClick={() => {
                    setShowFmeDialog(false);
                    setSelectedFme(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  disabled={!selectedFme}
                  onClick={confirmFmeAssignment}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
