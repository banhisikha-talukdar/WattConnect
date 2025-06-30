import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PencilLine, CheckCircle, XCircle } from 'lucide-react';
import Navbar from '../../components/Navbar';

export default function Profile() {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({ username: '', email: '' });
  const [originalProfile, setOriginalProfile] = useState({ username: '', email: '' });
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const storedUserId = localStorage.getItem('userId');

        if (!token || !storedUserId) {
          setError('Please log in.');
          return;
        }

        setUserId(storedUserId);

        const res = await axios.get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { username, email } = res.data;
        const fetchedProfile = { username, email };

        setProfile(fetchedProfile);
        setOriginalProfile({ ...fetchedProfile }); 
      } catch (err) {
        console.error('❌ Error fetching profile:', err);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');

      await axios.put(
        `http://localhost:5000/api/auth/${userId}`,
        { username: profile.username, email: profile.email },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      localStorage.setItem('username', profile.username);
      setOriginalProfile({ ...profile }); 
      setEditing(false);
      setError('');
    } catch (err) {
      console.error('❌ Error updating profile:', err);
      setError('Failed to save changes.');
      setProfile({ ...originalProfile }); 
    }
  };

  const handleCancel = () => {
    setProfile({ ...originalProfile }); 
    setEditing(false);
    setError('');
  };

  return (
    <div className="flex h-screen bg-[#f4f6fa]">
      <Navbar type="customer" />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="bg-white shadow-lg border border-gray-200 rounded-2xl w-full max-w-md p-8">
          {!editing && (
            <h1 className="text-3xl font-extrabold text-center text-[#01217e] mb-6">
              Welcome, {profile.username}!
            </h1>
          )}

          <h2 className="text-xl font-semibold text-blue-500 mb-4 text-center">Profile Info</h2>

          {error && (
            <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
          )}

          {['username', 'email'].map((field) => (
            <div key={field} className="mb-5">
              <label className="block text-sm text-gray-700 mb-1 capitalize">{field}</label>
              {editing ? (
                <input
                  type={field === 'email' ? 'email' : 'text'}
                  name={field}
                  value={profile[field]}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#226c82]"
                />
              ) : (
                <div className="bg-gray-50 text-gray-800 px-4 py-2 rounded-md">
                  {profile[field]}
                </div>
              )}
            </div>
          ))}

          <div className="flex justify-end gap-4 mt-6">
            {editing ? (
              <>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 bg-[#01217e] text-white px-5 py-2 rounded-md hover:bg-[#55c428] transition"
                >
                  <CheckCircle size={18} />
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 bg-gray-200 text-gray-800 px-5 py-2 rounded-md hover:bg-[#f4410b] transition"
                >
                  <XCircle size={18} />
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 bg-[#01217e] text-white px-5 py-2 rounded-md hover:bg-[#f0920f] transition"
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
