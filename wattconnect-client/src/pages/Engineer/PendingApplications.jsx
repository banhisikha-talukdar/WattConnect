import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from 'axios';
import { Eye, X, FileText, Download, ArrowLeft, MessageSquare,
    Clock, CheckCircle, XCircle
    } from 'lucide-react';

export default function PendingApplications() {
    const navigate = useNavigate();
    const { token, logout } = useContext(AuthContext);
    const [applications, setApplications] = useState([]);
    const [selectedApp, setSelectedApp] = useState(null);
    const [processing, setProcessing] = useState(false);

    const handleLogout = () => {
        logout(); 
        navigate("/");
    };

    useEffect(() => {
        if (!token) {
            navigate("/");
        } else {
            fetchApplications();
        }
    }, [token, navigate]);

    const fetchApplications = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/fme/assigned-applications`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setApplications(res.data.filter(app => app.status === "pending_fme_action"));
        } catch (error) {
            console.error('Error fetching applications:', error);
            if (error.response?.status === 401) {
                logout();
                navigate("/");
            }
        } 
    };

    const handleApprove = async (application) => {
        setProcessing(true);
        try {
            await axios.put(
                `http://localhost:5000/api/fme/approve-application/${application.appId}`,
                {},
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setSelectedApp(null);
            alert('Application approved successfully! Forwarded to admin for meter scheduling.');
        } catch (error) {
            console.error('Error approving application:', error);
            alert(`Error: ${error.response?.data?.message || error.message}`);
        } finally {
            setProcessing(false);
        }
    };

    const handleReject = async () => {
        const application = selectedApp;
        setProcessing(true);
        try {
            await axios.put(
                `http://localhost:5000/api/fme/reject-application/${application.appId}`,{},
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setSelectedApp(null);
            alert('Application rejected successfully!');
        } catch (error) {
            console.error('Error rejecting application:', error);
            alert(`Error: ${error.response?.data?.message || error.message}`);
        } finally {
            setProcessing(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending_fme_action':
                return 'bg-yellow-100 text-yellow-800';
            case 'fme_approved':
                return 'bg-green-100 text-green-800';
            case 'fme_rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const ApplicationModal = ({ application, onClose, onApprove, onReject, processing }) => {
    const docs = application.uploadedDocs || {};

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                    <h2 className="text-xl font-bold text-[#01217e]">
                        Application Review - {application.appId}
                    </h2>
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
                            <div><span className="text-sm text-gray-600">Name:</span><p className="font-medium">{application.consumerDetails?.name}</p></div>
                            <div><span className="text-sm text-gray-600">Father's Name:</span><p className="font-medium">{application.consumerDetails?.fatherName}</p></div>
                        </div>
                    </div>

                    {/* Address Details */}
                    <div className="bg-purple-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-lg mb-3">Address Details</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div><span className="text-sm text-gray-600">Area:</span><p className="font-medium">{application.addressDetails?.area}</p></div>
                            <div><span className="text-sm text-gray-600">Village/Town:</span><p className="font-medium">{application.addressDetails?.villageOrTown}</p></div>
                            <div><span className="text-sm text-gray-600">Post Office:</span><p className="font-medium">{application.addressDetails?.postOffice}</p></div>
                            <div><span className="text-sm text-gray-600">Police Station:</span><p className="font-medium">{application.addressDetails?.policeStation}</p></div>
                            <div><span className="text-sm text-gray-600">District:</span><p className="font-medium">{application.addressDetails?.district}</p></div>
                            <div><span className="text-sm text-gray-600">Pin Code:</span><p className="font-medium">{application.addressDetails?.pinCode}</p></div>
                        </div>
                        <div className="mt-4">
                            <span className="text-sm text-gray-600">Mobile Number:</span>
                            <p className="font-medium">{application.addressDetails?.mobileNumber}</p>
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
                </div>

                {/* Actions*/}
                <div className="flex justify-center space-x-4 p-6 border-t bg-gray-50">
                    <button 
                        onClick={onClose} 
                        className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Cancel
                    </button>
                    
                    {application.status === 'pending_fme_action' && (
                        <>
                            <button
                                onClick={onReject}
                                disabled={processing}
                                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors flex items-center"
                            >
                                <XCircle className="h-4 w-4 mr-2" />
                                {processing ? 'Processing...' : 'Reject'}
                            </button>
                            <button
                                onClick={() => onApprove(application)}
                                disabled={processing}
                                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors flex items-center"
                            >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                {processing ? 'Processing...' : 'Approve'}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-[#01217e] flex items-center">
                    <Clock className="h-8 w-8 mr-3" />
                    Assigned Applications
                </h1>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow transition-colors"
                >
                    Logout
                </button>
            </header>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                {applications.length === 0 ? (
                    <div className="p-8 text-center">
                        <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600 text-lg">
                            No applications assigned to you yet.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Application ID
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Consumer Name
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        District/Subdivision
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Category/Load
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Submitted On
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {applications.map((app) => (
                                    <tr key={app._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {app.appId}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {app.consumerDetails?.name || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <div>
                                                <p className="font-medium">{app.district}</p>
                                                <p className="text-gray-500">{app.subdivision}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <div>
                                                <p className="font-medium">{app.appliedCategory}</p>
                                                <p className="text-gray-500">{app.appliedLoad} KW</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(app.status)}`}>
                                                {app.status === 'pending_fme_action' ? 'Pending Review' : app.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {formatDate(app.submittedAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => setSelectedApp(app)}
                                                className="text-[#01217e] hover:text-[#01217e]/80 flex items-center"
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
            </div>

            {selectedApp && (
                <ApplicationModal 
                    application={selectedApp} 
                    onClose={() => setSelectedApp(null)}
                    onApprove={handleApprove}
                    processing={processing}
                    onReject={handleReject}
                />
            )}
        </div>
    );
}

