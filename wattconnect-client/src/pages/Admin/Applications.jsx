import { useState, useEffect, useContext } from 'react';
import Navbar from '../../components/Navbar';
import { Eye, Check, X, FileText, Download, User, MapPin, Calendar, ArrowLeft } from 'lucide-react';
import { AuthContext } from "../../context/AuthContext";

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [processing, setProcessing] = useState(false);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/new-connection/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setApplications(data.filter(app => app.status === "Pending")); // ✅ Show only pending
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } 
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    setProcessing(true);
    try {
      const response = await fetch(`http://localhost:5000/api/new-connection/${applicationId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
           Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setApplications(prev => 
          prev.map(app => 
            app._id === applicationId ? { ...app, status: newStatus } : app
          )
        );
        setSelectedApp(null);
      }
    } catch (error) {
      console.error('Error updating status:', error);
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
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const ApplicationModal = ({ application, onClose }) => {
    const docs = application.uploadedDocs;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Application Details</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-3">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">District:</span>
                  <p className="font-medium">{application.district}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Subdivision:</span>
                  <p className="font-medium">{application.subdivision}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Category:</span>
                  <p className="font-medium">{application.appliedCategory}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Applied Load:</span>
                  <p className="font-medium">{application.appliedLoad} KW</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-3">Consumer Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">Name:</span>
                  <p className="font-medium">{application.consumerDetails.name}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Father's Name:</span>
                  <p className="font-medium">{application.consumerDetails.fatherName}</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-3">Address Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">Area:</span>
                  <p className="font-medium">{application.addressDetails.area}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Village/Town:</span>
                  <p className="font-medium">{application.addressDetails.villageOrTown}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Post Office:</span>
                  <p className="font-medium">{application.addressDetails.postOffice}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Police Station:</span>
                  <p className="font-medium">{application.addressDetails.policeStation}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">District:</span>
                  <p className="font-medium">{application.addressDetails.district}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Pin Code:</span>
                  <p className="font-medium">{application.addressDetails.pinCode}</p>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-gray-600">Mobile Number:</span>
                <p className="font-medium">{application.addressDetails.mobileNumber}</p>
              </div>
            </div>

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
                      <a href={`http://localhost:5000/${docs[key]}`}
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

            <div className="flex justify-center space-x-4 pt-4 border-t">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </button>

              <button
                onClick={() => handleStatusUpdate(application._id, 'Rejected')}
                disabled={processing}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 flex items-center"
              >
                <X className="h-4 w-4 mr-2" />
                Reject
              </button>
              
              <button
                onClick={() => handleStatusUpdate(application._id, 'Approved')}
                disabled={processing}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 flex items-center"
              >
                <Check className="h-4 w-4 mr-2" />
                Approve
              </button>
            </div>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applicant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category & Load
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {applications.map((app) => (
                  <tr key={app._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {app.consumerDetails.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {app.userId?.email}
                          </div>
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
                        <span className="text-sm text-gray-900">
                          {formatDate(app.submittedAt)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="text-blue-600 hover:text-blue-800 flex items-center"
                      >
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