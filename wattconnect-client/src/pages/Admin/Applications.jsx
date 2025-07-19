import { useState, useEffect, useContext } from 'react';
import Navbar from '../../components/Navbar';
import {
  Eye, Check, X, FileText, Download,
  User, MapPin, Calendar, ArrowLeft
} from 'lucide-react';
import { AuthContext } from "../../context/AuthContext";
import axios from 'axios';

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [fmes, setFmes] = useState([]);
  const [selectedFme, setSelectedFme] = useState(null);
  const [showFmeDialog, setShowFmeDialog] = useState(false);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/new-connection/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setApplications(res.data.filter(app => app.status === "pending_admin_forward"));
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const fetchFMEs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/fmes', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFmes(Array.isArray(res.data) ? res.data : []);
      setShowFmeDialog(true);
    } catch (error) {
      console.error('Error fetching FMEs:', error);
      alert("Failed to load FMEs");
    }
  };

  const handleStatusUpdate = async (application, newStatus) => {
    setProcessing(true);
    try {
      await axios.put(
        `http://localhost:5000/api/new-connection/${application.appId}/status`,
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

  const confirmAndForwardToFME = async () => {
    if (!selectedApp || !selectedFme) {
      alert("Application or FME not selected");
      return;
    }

    setProcessing(true);
    try {
      await axios.post(
        `http://localhost:5000/api/assign-fme/${selectedApp.appId}`,
        { fmeId: selectedFme.fmeId },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await handleStatusUpdate(selectedApp, 'pending_fme_action');
      setShowFmeDialog(false);
      setSelectedFme(null);
    } catch (error) {
      console.error('Error assigning FME:', error);
      alert(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setProcessing(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const ApplicationModal = ({ application, onClose }) => {
    const docs = application.uploadedDocs;

    return (
      <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-xl font-bold">Application Details</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Basic Info */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-3">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div><span className="text-sm text-gray-600">Application ID:</span><p className="font-medium">{application.appId}</p></div>
                <div><span className="text-sm text-gray-600">District:</span><p className="font-medium">{application.district}</p></div>
                <div><span className="text-sm text-gray-600">Subdivision:</span><p className="font-medium">{application.subdivision}</p></div>
                <div><span className="text-sm text-gray-600">Category:</span><p className="font-medium">{application.appliedCategory}</p></div>
                <div><span className="text-sm text-gray-600">Applied Load:</span><p className="font-medium">{application.appliedLoad} KW</p></div>
              </div>
            </div>

            {/* Consumer Details */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-3">Consumer Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div><span className="text-sm text-gray-600">Application ID:</span><p className="font-medium">{application.consumerDetails.appId}</p></div>
                <div><span className="text-sm text-gray-600">Name:</span><p className="font-medium">{application.consumerDetails.name}</p></div>
                <div><span className="text-sm text-gray-600">Father's Name:</span><p className="font-medium">{application.consumerDetails.fatherName}</p></div>
              </div>
            </div>

            {/* Address Details */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-3">Address Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div><span className="text-sm text-gray-600">Area:</span><p className="font-medium">{application.addressDetails.area}</p></div>
                <div><span className="text-sm text-gray-600">Village/Town:</span><p className="font-medium">{application.addressDetails.villageOrTown}</p></div>
                <div><span className="text-sm text-gray-600">Post Office:</span><p className="font-medium">{application.addressDetails.postOffice}</p></div>
                <div><span className="text-sm text-gray-600">Police Station:</span><p className="font-medium">{application.addressDetails.policeStation}</p></div>
                <div><span className="text-sm text-gray-600">District:</span><p className="font-medium">{application.addressDetails.district}</p></div>
                <div><span className="text-sm text-gray-600">Pin Code:</span><p className="font-medium">{application.addressDetails.pinCode}</p></div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-gray-600">Mobile Number:</span>
                <p className="font-medium">{application.addressDetails.mobileNumber}</p>
              </div>
            </div>

            {/* Documents */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-3">Uploaded Documents</h3>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { key: 'identityProof', label: 'Identity Proof' },
                  { key: 'addressProof', label: 'Address Proof' },
                  { key: 'legalOccupationProof', label: 'Legal Occupation Proof' },
                  { key: 'testReport', label: 'Test Report' },
                  { key: 'passportPhoto', label: 'Passport Photo' },
                  { key: 'affidavitOrNOC', label: 'Affidavit/NOC' },
                  { key: 'agreementForm', label: 'Agreement Form' },
                  { key: 'htAdditionalDocs', label: 'HT Additional Documents' }
                ].map(({ key, label }) => (
                  docs[key] && (
                    <div key={key} className="flex items-center justify-between p-2 bg-white rounded border">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 text-blue-500 mr-2" />
                        <span className="text-sm">{label}</span>
                      </div>
                      <a
                        href={`http://localhost:5000/${docs[key]}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                    </div>
                  )
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-center space-x-4 pt-4 border-t">
              <button onClick={onClose} className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </button>
              <button
                onClick={() => fetchFMEs()}
                disabled={processing}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 flex items-center">
                <Check className="h-4 w-4 mr-2" />
                Select FME
              </button>
            </div>

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
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
                      disabled={!selectedFme || processing}
                      onClick={confirmAndForwardToFME}
                    >
                      Forward to FME
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-[#f4f6fa]">
      <Navbar type="admin" />
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-6">New Connection Applications</h1>
        {applications.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No applications found</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category & Load</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {applications.map(app => (
                  <tr key={app._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{app.consumerDetails.name}</div>
                          <div className="text-sm text-gray-500">{app.userId?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm text-gray-900">{app.district}</div>
                          <div className="text-sm text-gray-500">{app.subdivision}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{app.appliedCategory}</div>
                      <div className="text-sm text-gray-500">{app.appliedLoad} KW</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{formatDate(app.submittedAt)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button onClick={() => setSelectedApp(app)} className="text-blue-600 hover:text-blue-800 flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedApp && (
          <ApplicationModal
            application={selectedApp}
            onClose={() => setSelectedApp(null)}
          />
        )}
      </main>
    </div>
  );
}
