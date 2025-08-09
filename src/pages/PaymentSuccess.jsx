import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from '../utils/axios';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const gigId = searchParams.get('gigId');
  const session_id = searchParams.get('session_id');

  useEffect(() => {
    const createOrder = async () => {
      try {
        const res = await axios.post('/orders/create', {
          gigId,
          paymentIntentId: session_id,
        }, { withCredentials: true });

        console.log('Order created:', res.data);
        navigate('/orders');
      } catch (err) {
        console.error('Order creation failed', err);
      }
    };

    if (gigId && session_id) {
      createOrder();
    }
  }, [gigId, session_id, navigate]);

  return (
    <div className="text-center mt-16 text-xl text-green-600 font-bold">
      Payment successful! Creating your order...
    </div>
  );
};

export default PaymentSuccess;
