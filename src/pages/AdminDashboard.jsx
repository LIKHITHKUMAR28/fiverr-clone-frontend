import { useEffect, useState } from 'react';
import axios from '../utils/axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const [users, setUsers] = useState([]);
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [userRes, gigRes] = await Promise.all([
          axios.get('/admin/users'),
          axios.get('/admin/gigs')
        ]);
        setUsers(userRes.data);
        setGigs(gigRes.data);
        setLoading(false);
      } catch (err) {
        console.error('Admin fetch failed', err);
      }
    };

    fetchData();
  }, [navigate, user]);

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    await axios.delete(`/admin/users/${id}`);
    setUsers(users.filter(u => u._id !== id));
  };

  const handleDeleteGig = async (id) => {
    if (!window.confirm('Delete this gig?')) return;
    await axios.delete(`/admin/gigs/${id}`);
    setGigs(gigs.filter(g => g._id !== id));
  };

  if (loading) return <div className="text-center mt-10">Loading Admin Panel...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg shadow mb-6">
        <h1 className="text-3xl font-bold">👑 Admin Dashboard</h1>
        <p className="mt-1">Welcome, <span className="font-semibold">{user.username}</span></p>
        <p className="italic text-sm">Role: {user.role}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-white shadow p-4 rounded-lg text-center">
          <p className="text-gray-500">Total Users</p>
          <p className="text-2xl font-bold">{users.length}</p>
        </div>
        <div className="bg-white shadow p-4 rounded-lg text-center">
          <p className="text-gray-500">Total Gigs</p>
          <p className="text-2xl font-bold">{gigs.length}</p>
        </div>
        <div className="bg-white shadow p-4 rounded-lg text-center">
          <p className="text-gray-500">Total Orders</p>
          <p className="text-2xl font-bold">-</p> {/* Replace when orders endpoint ready */}
        </div>
      </div>

      {/* Users Table */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Users</h2>
        <div className="overflow-auto rounded-lg border border-gray-200">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Username</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{u.username}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3 capitalize">{u.role}</td>
                  <td className="p-3">
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                      onClick={() => handleDeleteUser(u._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Gigs Table */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Gigs</h2>
        <div className="overflow-auto rounded-lg border border-gray-200">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-left">Freelancer</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {gigs.map(g => (
                <tr key={g._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{g.title}</td>
                  <td className="p-3">₹{g.price}</td>
                  <td className="p-3">{g.freelancer?.username || 'N/A'}</td>
                  <td className="p-3">
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                      onClick={() => handleDeleteGig(g._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
