import React, { useEffect, useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import {
  useAccount,
} from "wagmi";
import axios from "axios";
import { message} from "antd";
import { ethers } from "ethers";
import "./Checkout.scss";

const CheckoutForm = ({ item, id }: any) => {
  const stripe = useStripe();
  const elements = useElements();

  const [email, setEmail] = useState('');
  const [tokenPrice, setTokenPrice] = useState(0);
  const [estimate, setEstimate] = useState("0.00");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenConfirmModal, setISOpenConfirmModal] = useState(false);
  const [wallet, setWallet] = useState("");
  const { address, isConnected } = useAccount();
  useEffect(() => {
    if (!address) return;
    setWallet(address);
  }, [address]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!stripe || !elements || !ethers.utils.isAddress(wallet)) {
      return;
    }
    if (!ethers.utils.isAddress(wallet)) {
      message.error("Invalid ETH wallet address.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/payment/stripe/paymentRequest`, {
        stripePaymentId: id,
        ETHWalletAddress: wallet,
        ContactInfo: email,
      }); 
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/completion`,
        },
      });

      if (error.type === "card_error" || error.type === "validation_error") {
        message.error(error.message);
      } else {
        message.error("An unexpected error occurred.");
      }

      setIsLoading(false);
    } catch (e) {
      console.log(e)

    }
  };

  useEffect(() => {
    if (tokenPrice == 0) return;
    setEstimate((item.amount / tokenPrice).toFixed(2))
  }, [tokenPrice])

  useEffect(() => {
    // fetchPrice(tokenList[0].address, item.currency).then(res => setTokenPrice(res));
  }, [])

  return (
    <>
      <form id="payment-form" onSubmit={handleSubmit}>
        <span className="text-lg">ETH wallet address</span>
        <div className="bg-slate-100 rounded-[5px] px-3 py-1 mb-3 dark:bg-portfolio-slateGray-700 border border-subdued bg-default">
          <div className="flex justify-between text-black">
            <input type="text" className="bg-transparent border-transparent focus:border-transparent focus:outline-none focus:ring-0 font-medium ml-0 pl-0 min-w-0 py-0 w-full text-lg placeholder:font-normal" placeholder="Enter your ETH wallet address" value={wallet} onChange={(e) => setWallet(e.target.value)} />
          </div>
        </div>
        <PaymentElement id="payment-element" />
        <button className="py-2 mt-3 rounded-[5px] font-medium justify-center w-full bg-blue-800 disabled:bg-gray-600 disabled:text-gray-800" disabled={isLoading || !stripe || !elements || !ethers.utils.isAddress(wallet)}>
          <span id="button-text">
            {isLoading ? <div className="spinner" id="spinner">Pending...</div> : "Pay now"}
          </span>
        </button>
      </form>
    </>
  );
}

export default CheckoutForm;