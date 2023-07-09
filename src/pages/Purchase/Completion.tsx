import { useEffect, useState } from 'react';
import { message,Modal, Upload } from "antd";
import "./Checkout.scss"

const Completion = (props: any) => {
  const [messageBody, setMessageBody] = useState('');
  const { stripePromise } = props;

  useEffect(() => {
    if (!stripePromise) return;

    stripePromise.then(async (stripe: any) => {
      const url = new URLSearchParams(window.location.search);
      const clientSecret = url.get('payment_intent_client_secret');
      const { error, paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);
      if (!paymentIntent) return;
      switch (paymentIntent.status) {
        case "succeeded":
          message.success("Payment succeeded!");
          break;
        case "processing":
          message.info("Your payment is processing.");
          break;
        case "requires_payment_method":
          message.info("Your payment was not successful, please try again.");
          break;
        default:
          message.info("Something went wrong.");
          break;
      }
    });
  }, [stripePromise]);

  return (
    <div className="justify-between mx-auto w-[95%] lg:w-[90%] py-[150px] text-white">
      <Modal
        open={true}
        footer={null}
        onCancel={() => {window.location.href = "/purchase-algo"}}
        title="Buy ALGO To Your Wallet"
      >
        <div className="modalContent">
          Thank You for purchasing our token!
        </div>
      </Modal>
    </div>
  );
}

export default Completion;