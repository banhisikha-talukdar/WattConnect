import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PencilLine, CheckCircle, XCircle } from 'lucide-react';
import Navbar from '../../components/Navbar';

export default function Profile() {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({ username: '', email: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/customers/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile({
          username: res.data.username,
          email: res.data.email,
        });
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
        `http://localhost:5000/api/customers/${profile.username}`,
        { username: profile.username, email: profile.email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditing(false);
    } catch (err) {
      console.error('❌ Error updating profile:', err);
      alert('Failed to save changes.');
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-b from-white to-[#cde9f6]">
      <Navbar type="customer" />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="bg-white shadow-lg border border-gray-200 rounded-2xl w-full max-w-md p-8">

          {!editing && (
            <h1 className="text-3xl font-extrabold text-center text-[#226c82] mb-6">
              Welcome, {profile.username}!
            </h1>
          )}

          <h2 className="text-xl font-semibold text-[#226c82] mb-4 text-center">Profile Info</h2>

          {['username', 'email'].map((field) => (
            <div key={field} className="mb-5">
              <label className="block text-sm text-gray-700 mb-1 capitalize">{field}</label>
              {editing ? (
                <input
                  type="text"
                  name={field}
                  value={profile[field]}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#226c82]"
                />
              ) : (
                <div className="bg-gray-50 text-gray-800 px-4 py-2 rounded-md">{profile[field]}</div>
              )}
            </div>
          ))}

          <div className="flex justify-end gap-4 mt-6">
            {editing ? (
              <>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 bg-[#226c82] text-white px-5 py-2 rounded-md hover:bg-[#1a5466] transition"
                >
                  <CheckCircle size={18} />
                  Save
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="flex items-center gap-2 bg-gray-200 text-gray-800 px-5 py-2 rounded-md hover:bg-gray-300 transition"
                >
                  <XCircle size={18} />
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 bg-[#226c82] text-white px-5 py-2 rounded-md hover:bg-[#f0920f] transition"
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
