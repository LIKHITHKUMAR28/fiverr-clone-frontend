import { useEffect, useState } from 'react';
import axios from '../utils/axios';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [user] = useState(() => JSON.parse(localStorage.getItem('user')));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('/orders/my-orders', { withCredentials: true });
        setOrders(res.data);
      } catch (err) {
        console.error('Failed to fetch orders', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div className="text-center mt-16">Loading orders...</div>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">
        {user.role === 'freelancer' ? 'Received Orders' : 'Your Orders'}
      </h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {orders.map(order => (
            <div
              key={order._id}
              className="bg-white border p-4 rounded-lg shadow-sm"
            >
              <h2 className="text-xl font-semibold text-blue-600">
                {order.gig?.title}
              </h2>
              <p className="text-sm text-gray-600 mb-1">
                Status: <span className="font-medium">{order.status}</span>
              </p>
              <p className="text-sm text-gray-600 mb-1">
                {user.role === 'freelancer'
                  ? `Client: ${order.buyer?.username}`
                  : `Freelancer: ${order.seller?.username}`}
              </p>
              <p className="text-sm text-gray-600">Price: ₹{order.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
