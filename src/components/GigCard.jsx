import { Link } from 'react-router-dom';

const GigCard = ({ gig }) => {
  return (
    <Link
      to={`/gigs/${gig._id}`}
      className="block border rounded-xl p-4 shadow hover:shadow-lg transition bg-white hover:-translate-y-1"
    >
      <h2 className="text-xl font-semibold text-blue-700 mb-2">{gig.title}</h2>
      <p className="text-gray-600 text-sm mb-3">{gig.description}</p>
      <div className="flex justify-between items-center mt-4">
        <span className="text-green-600 font-bold">₹{gig.price}</span>
        <span className="text-sm text-gray-500">{gig.category || 'General'}</span>
      </div>
    </Link>
  );
};

export default GigCard;
