import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';

const CreateGig = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    deliveryTime: '' // ✅ added
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/gigs', form, { withCredentials: true });
      navigate(`/gigs/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Failed to create gig');
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white mt-10 p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-6 text-blue-700 text-center">Create a New Gig</h2>

      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Gig Title"
          value={form.title}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
        />
        <textarea
          name="description"
          placeholder="Gig Description"
          value={form.description}
          onChange={handleChange}
          required
          rows={4}
          className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
        />
        <input
          type="text"
          name="category"
          placeholder="Category (e.g. Design, Writing)"
          value={form.category}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
        />
        <input
          type="number"
          name="price"
          placeholder="Price in INR"
          value={form.price}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
        />
        <input
          type="number"
          name="deliveryTime"
          placeholder="Delivery Time (in days)" // ✅ new field
          value={form.deliveryTime}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition"
        >
          Post Gig
        </button>
      </form>
    </div>
  );
};

export default CreateGig;
