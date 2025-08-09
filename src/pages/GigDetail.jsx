/* eslint-disable no-unused-vars */
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from '../utils/axios';

const GigDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [gig, setGig] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  // Fetch gig and reviews
  useEffect(() => {
  const fetchData = async () => {
    try {
      // First get gig
      const gigRes = await axios.get(`/gigs/${id}`);
      setGig(gigRes.data);

      // Then get reviews (don't break if fails)
      try {
        const reviewRes = await axios.get(`/reviews/${id}`);
        setReviews(reviewRes.data);
      } catch {
        setReviews([]); // No reviews yet
      }
    } catch (err) {
      setError('Gig not found');
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [id]);


  // Handle Stripe Checkout
  const handlePurchase = async () => {
    try {
      const res = await axios.post('/orders/create-checkout-session', { gigId: gig._id });
      window.location.href = res.data.url;
    } catch (err) {
      alert('Could not start payment');
    }
  };

  // Submit a review
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/reviews', {
        gigId: gig._id,
        rating,
        comment
      }, { withCredentials: true });
      setComment('');
      setRating(5);
      const res = await axios.get(`/reviews/${id}`);
      setReviews(res.data);
    } catch (err) {
      alert(err?.response?.data?.message || 'Review failed');
    }
  };

  if (loading) return <div className="text-center mt-16">Loading...</div>;
  if (error) return <div className="text-center text-red-500 mt-16">{error}</div>;
  if (!gig) return null;

  return (
    <div className="max-w-4xl mx-auto p-6 mt-6 bg-white rounded-xl shadow">
      <h1 className="text-3xl font-bold text-blue-800 mb-2">{gig.title}</h1>
      <p className="text-gray-600 mb-4">{gig.description}</p>

      <div className="flex justify-between items-center mt-4">
        <span className="text-green-600 text-xl font-semibold">₹{gig.price}</span>
        {user?.role === 'client' && (
          <button
            onClick={handlePurchase}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition"
          >
            Purchase
          </button>
        )}
      </div>

      <div className="mt-6 border-t pt-4">
        <p className="text-sm text-gray-500">
          Posted by: <strong>{gig.freelancer?.username || 'Unknown'}</strong>
        </p>
      </div>

      {/* Reviews */}
      <div className="mt-10">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review, idx) => (
              <div key={idx} className="bg-gray-100 p-3 rounded-md">
                <p className="font-semibold">{review.reviewer.username}</p>
                <p>⭐ {review.rating}/5</p>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Form */}
      {user?.role === 'client' && (
        <form onSubmit={handleReviewSubmit} className="mt-6 space-y-4">
          <h3 className="text-lg font-semibold">Leave a Review</h3>
          <div>
            <label className="block text-sm font-medium">Rating (1-5)</label>
            <input
              type="number"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              className="w-full p-2 border rounded"
              rows="3"
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
          >
            Submit Review
          </button>
        </form>
      )}
    </div>
  );
};

export default GigDetail;
