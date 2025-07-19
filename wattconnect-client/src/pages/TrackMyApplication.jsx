import { useState } from 'react';
import { Calendar, MapPin, AlertCircle, CheckCircle, XCircle, Clock } from 'lucide-react';
import axios from "axios";

export default function TrackMyApplication() {
  const [applicationIdInput, setApplicationIdInput] = useState('');
  const [filteredApp, setFilteredApp] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheckClick = async () => {
    if (!applicationIdInput.trim()) return;

    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/new-connection/track/${applicationIdInput.trim()}`);
      setFilteredApp(response.data);
    } catch (error) {
      console.error("Error fetching application:", error);
      setFilteredApp(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'approved': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected': return <XCircle className="h-5 w-5 text-red-500" />;
      case 'pending': return <Clock className="h-5 w-5 text-yellow-500" />;
      default: return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'approved': return 'bg-green-50 border-green-200 text-green-800';
      case 'rejected': return 'bg-red-50 border-red-200 text-red-800';
      case 'pending': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-start py-10 px-4">
      <div className="w-full max-w-3xl">
        <h1 className="text-2xl font-bold text-center mb-6">Enter your application ID to track</h1>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
          <input
            type="text"
            placeholder="Enter your Application ID"
            value={applicationIdInput}
            onChange={(e) => setApplicationIdInput(e.target.value)}
            className="border border-gray-400 px-4 py-2 rounded-full w-full sm:w-2/3"
          />
          <button
            onClick={handleCheckClick}
            className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700"
          >
            Check
          </button>
        </div>

        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading application data...</p>
          </div>
        ) : !filteredApp && applicationIdInput ? (
          <div className="text-center py-6">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 text-lg">No application found with that ID.</p>
          </div>
        ) : (
          filteredApp && (
            <div className="space-y-4">
              <div key={filteredApp._id} className={`border rounded-lg p-4 ${getStatusColor(filteredApp.status)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      {getStatusIcon(filteredApp.status)}
                      <h3 className="font-semibold ml-2">{filteredApp.consumerDetails?.name || 'Unknown User'}</h3>
                      <span className="ml-auto px-3 py-1 text-xs font-medium rounded-full bg-white bg-opacity-50">
                        {filteredApp.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 opacity-70" />
                        <span>{filteredApp.district}, {filteredApp.subdivision}</span>
                      </div>
                      <div>
                        <span className="font-medium">Category:</span> {filteredApp.appliedCategory}
                      </div>
                      <div>
                        <span className="font-medium">Load:</span> {filteredApp.appliedLoad} KW
                      </div>
                    </div>

                    <div className="flex items-center mt-2 text-sm opacity-70">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Submitted: {formatDate(filteredApp.submittedAt)}</span>
                    </div>

                    {filteredApp.status.toLowerCase() === 'approved' && (
                      <>
                        <div className="mt-3 p-3 bg-green-100 rounded-md">
                          <p className="text-sm text-green-800">
                            <CheckCircle className="h-4 w-4 inline mr-1" />
                            Congratulations! Your application has been approved.
                          </p>
                        </div>
                        {filteredApp.consumerNo && (
                          <div className="mt-2 text-sm font-medium text-blue-800">
                            <span className="bg-blue-100 px-3 py-1 rounded-md">
                              Consumer Number: {filteredApp.consumerNo}
                            </span>
                          </div>
                        )}
                      </>
                    )}

                    {filteredApp.status.toLowerCase() === 'rejected' && (
                      <div className="mt-3 p-3 bg-red-100 rounded-md">
                        <p className="text-sm text-red-800">
                          <XCircle className="h-4 w-4 inline mr-1" />
                          Your application has been rejected. Please contact support.
                        </p>
                      </div>
                    )}

                    {filteredApp.status.toLowerCase() === 'pending' && (
                      <div className="mt-3 p-3 bg-yellow-100 rounded-md">
                        <p className="text-sm text-yellow-800">
                          <Clock className="h-4 w-4 inline mr-1" />
                          Your application is under review. Please wait for admin approval.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </main>
  );
}
