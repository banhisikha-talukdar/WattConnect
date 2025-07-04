import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PencilLine, CheckCircle, XCircle } from 'lucide-react';
import Navbar from '../../components/Navbar';

export default function Profile() {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    consumerNumber: '',
    usageType: '',
    category: ''
  });
  const [originalProfile, setOriginalProfile] = useState({});
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const categoryOptions = {
    domestic: [
      "LT-I Jeevan Dhara",
      "LT-II Domestic A",
      "LT-III Domestic B",
      "LT-X Electric Vehicle Charging",
      "LT-VII Agriculture",
    ],
    commercial: [
      "LT-IV Commercial",
      "LT-V General Purpose",
      "LT-VI Public Lighting",
      "LT-VIII(i) Small Industries Rural",
      "LT-VIII(ii) Small Industries Urban",
      "LT-XI Interstate Sale",
    ],
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          setError('Please log in to view your profile.');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = response.data;
        const profileData = {
          username: userData.username || '',
          email: userData.email || '',
          consumerNumber: userData.consumerNumber || '',
          usageType: userData.usageType || '',
          category: userData.category || ''
        };

        setProfile(profileData);
        setOriginalProfile({ ...profileData });
      } catch (err) {
        console.error('Error fetching profile:', err);
        
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
        } else {
          setError('Failed to fetch profile data. Please try again.');
        }
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleInputChange = (name, value) => {
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = () => {
    setEditing(true);
    setError('');
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');

    try {
      const token = localStorage.getItem('token');

      const response = await axios.put(
        `http://localhost:5000/api/auth/${profile.username}`,
        {
          email: profile.email.trim(),
        },
        { 
          headers: { Authorization: `Bearer ${token}` } 
        }
      );

      setOriginalProfile({ ...profile });
      setEditing(false);
      setSaving(false);
      
      console.log('Profile updated successfully');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to save changes. Please try again.');
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setProfile({ ...originalProfile });
    setEditing(false);
    setError('');
  };

  const handleUsageTypeChange = (value) => {
    setProfile(prev => ({ 
      ...prev, 
      usageType: value,
      category: '' 
    }));
  };

  return (
    <div className="flex h-screen bg-[#f4f6fa]">
      <Navbar type="customer" />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="bg-white shadow-lg border border-gray-200 rounded-2xl w-full max-w-2xl p-8">
          {!editing && (
            <h1 className="text-3xl font-extrabold text-center text-[#01217e] mb-6">
              Welcome, {profile.username || 'User'}!
            </h1>
          )}

          <h2 className="text-xl font-semibold text-blue-500 mb-4 text-center">
            {editing ? 'Edit Profile' : 'Profile Information'}
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
              <p className="text-red-600 text-sm text-center">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-sm text-gray-700 mb-1 font-medium">
                Username
              </label>
              {editing ? (
                <input
                  type="text"
                  value={profile.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#226c82]"
                  placeholder="Enter username"
                   
                />
              ) : (
                <div className="bg-gray-50 text-gray-800 px-4 py-2 rounded-md border">
                  {profile.username || 'Not set'}
                </div>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-700 mb-1 font-medium">
                Email
              </label>
              {editing ? (
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#226c82]"
                  placeholder="Enter email address"
                />
              ) : (
                <div className="bg-gray-50 text-gray-800 px-4 py-2 rounded-md border">
                  {profile.email || 'Not set'}
                </div>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-700 mb-1 font-medium">
                Consumer Number
              </label>
              {editing ? (
                <input
                  type="text"
                  value={profile.consumerNumber}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/\D/g, '').slice(0, 12);
                    handleInputChange('consumerNumber', numericValue);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#226c82]"
                  placeholder="12-digit consumer number"
                  maxLength={12}
                  
                />
              ) : (
                <div className="bg-gray-50 text-gray-800 px-4 py-2 rounded-md border">
                  {profile.consumerNumber || 'Not set'}
                </div>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-700 mb-1 font-medium">
                Usage Type
              </label>
              {editing ? (
                <select
                  value={profile.usageType}
                  onChange={(e) => handleUsageTypeChange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#226c82]"
                
                >
                  <option value="">Select Usage Type</option>
                  <option value="domestic">Domestic</option>
                  <option value="commercial">Commercial</option>
                </select>
              ) : (
                <div className="bg-gray-50 text-gray-800 px-4 py-2 rounded-md border">
                  {profile.usageType ? 
                    profile.usageType.charAt(0).toUpperCase() + profile.usageType.slice(1) : 
                    'Not set'
                  }
                </div>
              )}
            </div>

            <div className="mb-4 md:col-span-2">
              <label className="block text-sm text-gray-700 mb-1 font-medium">
                Category
              </label>
              {editing ? (
                profile.usageType ? (
                  <select
                    value={profile.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#226c82]"
                    
                  >
                    <option value="">Select Category</option>
                    {categoryOptions[profile.usageType]?.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                ) : (
                  <div className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500">
                    Please select a Usage Type first
                  </div>
                )
              ) : (
                <div className="bg-gray-50 text-gray-800 px-4 py-2 rounded-md border">
                  {profile.category || 'Not set'}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            {editing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle size={18} />
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={saving}
                  className="flex items-center gap-2 bg-gray-500 text-white px-5 py-2 rounded-md hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <XCircle size={18} />
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 bg-[#01217e] text-white px-5 py-2 rounded-md hover:bg-[#0a1a5c] transition-colors"
              >
                <PencilLine size={18} />
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}