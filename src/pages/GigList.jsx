/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import axios from '../utils/axios';
import GigCard from '../components/GigCard';

const GigList = () => {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        const res = await axios.get('/gigs');
        setGigs(res.data || []); // Defensive fallback
      } catch (err) {
        setError('Failed to load gigs');
      } finally {
        setLoading(false);
      }
    };

    fetchGigs();
  }, []);

  if (loading) return <div className="text-center mt-16 text-blue-600 text-lg">Loading gigs...</div>;
  if (error) return <div className="text-center text-red-500 mt-16">{error}</div>;
  if (gigs.length === 0) return <div className="text-center mt-16 text-gray-500">No gigs available.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Explore Gigs</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {gigs.map(gig => (
          <GigCard key={gig._id} gig={gig} />
        ))}
      </div>
    </div>
  );
};

export default GigList;
