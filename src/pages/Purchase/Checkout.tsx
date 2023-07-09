import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import axios from 'axios';
import CheckoutForm from './CheckoutForm';
import { Product } from 'types';

const Checkout = ({ stripePromise, item }: any) => {
  const [loadedPage, setLoadedPage] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [paymentId, setPaymentId] = useState('');
  const getClientSecret = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/payment/stripe/create-payment-intent`,
        {
          currency: item.currency,
          products: [
            {
              title: item.title,
              amount: item.amount,
            },
          ],
        },
      );
      setLoadedPage(true);
      if (response.data) {
        setClientSecret(response.data.client_secret);
        setPaymentId(response.data.id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (loadedPage) return;
    getClientSecret();
  }, [loadedPage]);

  const options = {
    clientSecret,
  };

  return (
    <div className="p-4">
      {clientSecret && loadedPage && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm item={item} id={paymentId} />
        </Elements>
      )}
      {!loadedPage && 'loading...'}
    </div>
  );
};

export default Checkout;
