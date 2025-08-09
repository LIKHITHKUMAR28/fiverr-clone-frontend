import { useEffect, useState } from 'react';
import axios from '../utils/axios';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));
  const [gigs, setGigs] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const [ordersRes, gigsRes] = await Promise.all([
        axios.get('/orders/my-orders', { withCredentials: true }),
        user.role === 'freelancer' ? axios.get('/gigs/my-gigs', { withCredentials: true }) : Promise.resolve({ data: [] })
      ]);
      setOrders(ordersRes.data);
      setGigs(gigsRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchDashboardData();
  }, [user]);

  if (loading) return <div className="text-center mt-16">Loading dashboard...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-blue-700 mb-8">Welcome, {user.username}</h1>

      {user.role === 'freelancer' && (
        <>
          <h2 className="text-2xl font-semibold mb-4">Your Gigs</h2>
          {gigs.length === 0 ? (
            <p className="text-gray-500 mb-6">No gigs posted yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {gigs.map(gig => (
                <Link
                  to={`/gigs/${gig._id}`}
                  key={gig._id}
                  className="border rounded-lg p-4 hover:shadow transition"
                >
                  <h3 className="font-semibold text-blue-600">{gig.title}</h3>
                  <p className="text-sm text-gray-500">${gig.price}</p>
                </Link>
              ))}
            </div>
          )}
        </>
      )}

      <h2 className="text-2xl font-semibold mb-4">
        {user.role === 'freelancer' ? 'Received Orders' : 'Your Orders'}
      </h2>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {orders.map(order => (
            <div
              key={order._id}
              className="border p-4 rounded-md bg-white shadow-sm"
            >
              <h3 className="text-blue-700 font-bold">{order.gig?.title}</h3>
              <p className="text-sm text-gray-500">Status: {order.status}</p>
              <p className="text-sm text-gray-500">
                {user.role === 'freelancer'
                  ? `Client: ${order.buyer?.username}`
                  : `Freelancer: ${order.seller?.username}`}
              </p>
              <p className="text-sm text-gray-500">Price: ${order.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
