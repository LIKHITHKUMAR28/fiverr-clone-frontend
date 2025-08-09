import { useEffect, useState } from 'react';
import axios from '../utils/axios';

const ReviewSection = ({ gigId }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`/gigs/${gigId}/reviews`);
      setReviews(res.data);
    } catch (err) {
      console.error('Failed to fetch reviews');
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [gigId]);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post(`/gigs/${gigId}/reviews`, { rating, text });
      setRating(5);
      setText('');
      fetchReviews();
    } catch (err) {
      alert(err.response?.data?.message || 'Review failed');
    }
  };

  return (
    <div className="mt-10">
      <h3 className="text-lg font-bold mb-2">Reviews</h3>

      {user?.role === 'client' && (
        <form onSubmit={handleSubmit} className="mb-4 space-y-2">
          <select value={rating} onChange={e => setRating(e.target.value)} className="input">
            {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Stars</option>)}
          </select>
          <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Write your review..." className="input" />
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Submit Review</button>
        </form>
      )}

      <div className="space-y-4">
        {reviews.length === 0 ? <p>No reviews yet.</p> : (
          reviews.map(r => (
            <div key={r._id} className="border p-3 rounded">
              <p className="font-bold">{r.buyer?.username}</p>
              <p>{'⭐'.repeat(r.rating)}</p>
              <p>{r.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
