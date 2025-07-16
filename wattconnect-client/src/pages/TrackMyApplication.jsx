import { useState, useEffect } from 'react';
import { Calendar, MapPin, AlertCircle, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function TrackMyApplication(){
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserApplications();
    }, []);

    const fetchUserApplications = async () => {
        try {
        const response = await fetch('http://localhost:5000/api/new-connection/all', {
            headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });

        if (response.ok) {
            const data = await response.json();
            const token = localStorage.getItem('token');
            const userId = JSON.parse(atob(token.split('.')[1])).userId; 
            
            const userApplications = data.filter(app => 
            app.userId && app.userId._id === userId
            );
            setApplications(userApplications);
        }
        } catch (error) {
        console.error('Error fetching applications:', error);
        } finally {
        setLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status.toLowerCase()) {
        case 'approved':
            return <CheckCircle className="h-5 w-5 text-green-500" />;
        case 'rejected':
            return <XCircle className="h-5 w-5 text-red-500" />;
        case 'pending':
            return <Clock className="h-5 w-5 text-yellow-500" />;
        default:
            return <AlertCircle className="h-5 w-5 text-gray-500" />;
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
        <section className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Applications Status</h2>
          
          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading applications...</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-6">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 text-lg">No applications found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => (
                <div key={app._id} className={`border rounded-lg p-4 ${getStatusColor(app.status)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        {getStatusIcon(app.status)}
                        <h3 className="font-semibold ml-2">{app.consumerDetails.name}</h3>
                        <span className="ml-auto px-3 py-1 text-xs font-medium rounded-full bg-white bg-opacity-50">
                          {app.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 opacity-70" />
                          <span>{app.district}, {app.subdivision}</span>
                        </div>
                        <div>
                          <span className="font-medium">Category:</span> {app.appliedCategory}
                        </div>
                        <div>
                          <span className="font-medium">Load:</span> {app.appliedLoad} KW
                        </div>
                      </div>
                      
                      <div className="flex items-center mt-2 text-sm opacity-70">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>Submitted: {formatDate(app.submittedAt)}</span>
                      </div>
                      
                      {app.status.toLowerCase() === 'approved' && (
                        <div className="mt-3 p-3 bg-green-100 rounded-md">
                          <p className="text-sm text-green-800">
                            <CheckCircle className="h-4 w-4 inline mr-1" />
                            Congratulations! Your application has been approved.
                          </p>
                        </div>
                      )}
                      
                      {app.status.toLowerCase() === 'rejected' && (
                        <div className="mt-3 p-3 bg-red-100 rounded-md">
                          <p className="text-sm text-red-800">
                            <XCircle className="h-4 w-4 inline mr-1" />
                            Your application has been rejected. Please contact customer service for more information.
                          </p>
                        </div>
                      )}
                      
                      {app.status.toLowerCase() === 'pending' && (
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
              ))}
            </div>
          )}
        </section>
    );
}