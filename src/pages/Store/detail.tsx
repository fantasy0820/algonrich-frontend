import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal } from "antd";
import { message } from "antd";
import axios from "axios";
import {
  solid,
  regular,
  brands,
  icon,
} from "@fortawesome/fontawesome-svg-core/import.macro"; // <-- import styles to be used
import "./Store.scss";

import { useConnect, useDisconnect, useNetwork, useAccount } from "wagmi";
import {
  switchNetwork,
  prepareWriteContract,
  writeContract,
} from "@wagmi/core";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { parseEther } from "ethers/lib/utils.js";
import { shortenIfAddress } from "utils/address";
import { CONTRACT_ADDR, RECIPIENT } from "const/Consts";
import { ALGO_ABI } from "abi/AlgonrichABI";

interface ProductType {
  id: number;
  name: string;
  description: string;
  images: string;
  inStock: boolean;
  code: string;
  keywords: string;
  price: number;
  salePrice: number;
}

const ProductDetail = () => {
  const { id } = useParams();

  const [productData, setProductData] = useState<ProductType>({
    id: 0,
    name: "",
    description: "",
    images: "",
    inStock: true,
    code: "",
    keywords: "",
    price: 0,
    salePrice: 0,
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [delivery, setDelivery] = useState("");
  const [qtyVal, setQty] = useState(0);
  const [totalPrice, setTotal] = useState(0);
  const [isGet, setGetProduct] = useState(false);
  const [qtyError, setQtyError] = useState(false);

  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new MetaMaskConnector(),
  });
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();

  const getProduct = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/product/${id}`
    );

    let product = {
      id: response.data.id,
      name: response.data.name,
      description: response.data.description,
      images: response.data.images,
      inStock: response.data.inStock,
      code: response.data.code,
      keywords: response.data.keywords,
      price: response.data.price,
      salePrice: response.data.salePrice,
    };

    setProductData(product);
  };

  const handleOk = async () => {
    const config = await prepareWriteContract({
      address: CONTRACT_ADDR["ALGO"] as `0x${string}`,
      abi: ALGO_ABI,
      functionName: "transfer",
      args: [RECIPIENT, parseEther(totalPrice.toString())],
    });

    await writeContract(config);

    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/order`,
      {
        productId: productData.id,
        price: productData.price,
        qty: qtyVal,
        orderer: address,
        address: delivery,
      }
    );

    if (response.data.id > 0) {
      message.success("Purchased successfully!");
    }

    setIsModalVisible(false);
  };

  const checkQty = (type: string) => {
    const qty = document.getElementById("qty") as HTMLInputElement;
    if (qty.value === "") {
      setQtyError(true);
    } else {
      setQtyError(false);
      setQty(parseInt(qty.value));
      setTotal(qtyVal * productData.price);

      if (type === "buy") {
        setIsModalVisible(true);
      }
    }
  };

  const getBigPrice = (price: number) => {
    return Math.floor(price);
  };

  const getSmallPrice = (price: number) => {
    const decimal = price - Math.floor(price);
    if (decimal === 0) {
      return "00";
    } else {
      const decimalAsInt = Math.floor(decimal * 100);
      return decimalAsInt.toString().padStart(2, "0");
    }
  };

  const getFirstImage = (images: string) => {
    const list = JSON.parse(images);

    return list[0];
  };

  const getDeliveryAddress = async (e: any) => {
    setDelivery(e.target.value);
  };

  useEffect(() => {
    getProduct();
  }, [isGet]);

  useEffect(() => {
    const handleSwitchNetwork = async () => {
      if (isConnected && chain?.id !== 56) {
        await switchNetwork({
          chainId: 56,
        });
      }
    };

    handleSwitchNetwork();
  }, [isConnected, chain?.id]);

  return (
    <div className="justify-between mx-auto w-[95%] lg:w-[90%] py-[150px]">
      <div className="flex justify-end items-right gap-5 mr-8">
        <div className="items-center rounded-[5px] flex font-[500] text-white px-[15px] py-[10px] transition duration-300 hover:bg-[#222a3a] hover:cursor-pointer">
          <img
            src="../../assets/images/bsc.svg"
            alt="Binance Smart Chain"
            className="h-7 w-7 pr-[10px]"
          />
          Binance Smart Chain
        </div>
        {isConnected && chain?.id === 56 ? (
          <div
            className="bg-[#243056] rounded-[100px] text-[#5981f3] font-[700] py-[10px] px-[20px] transition duration-300 hover:text-[#3b4874] hover:cursor-pointer"
            onClick={() => disconnect()}
          >
            {shortenIfAddress(address)}
          </div>
        ) : (
          <div
            className="bg-[#243056] rounded-[100px] text-[#5981f3] font-[700] py-[10px] px-[20px] transition duration-300 hover:text-[#3b4874] hover:cursor-pointer"
            onClick={() => connect()}
          >
            Connect
          </div>
        )}
      </div>
      <section className="min-h-[100vh]">
        <section className="flex justify-between h-[100vh] my-0 mx-auto pt-[5rem]">
          <section>
            <img
              src={productData.images && getFirstImage(productData.images)}
              alt="Product Image"
              width="600"
              height="600"
            />
          </section>
          <section className="w-[30rem] mx-[1rem] text-left">
            <section className="mb-[1rem] border-b-[1px] border-b-[#c3c3c3]">
              <p className="text-[20px] font-bold">{productData.name}</p>
              <p className="text-[#307083] text-[0.8rem] mt-[0.3rem] cursor-pointer">
                Visit The Crypto Store
              </p>
              <section className="flex flex-row justify-between items-center w-[9rem] text-[#f2a942] mt-[0.3rem] mb-[0.2rem]">
                <section className="flex w-[3.5rem]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                      clipRule="evenodd"
                    />
                  </svg>
                </section>
                <p className="text-[#307083] text-[0.8rem] underline">
                  512 ratings
                </p>
              </section>
            </section>
            <section className="flex flex-col justify-evenly h-[4rem] mb-[1rem] border-b-[1px] border-b-[#c3c3c3]">
              <p className="text-[28px] font-semibold">
                <span className="relative sm:text-sm text-[9px] sm:top-[-0.5rem] top-[-0.2rem] font-normal pr-[2px]">
                  $
                </span>
                {getBigPrice(productData.price)}
                <span className="relative sm:text-sm text-[9px] sm:top-[-0.5rem] top-[-0.2rem] pl-[2px] font-normal">
                  {getSmallPrice(productData.price)}
                </span>
              </p>
              <p className="text-[#ccc] text-[0.8rem] pb-[0.5rem]">
                No Import Fees Deposit & $10 Shipping World Wide
              </p>
            </section>
            <section>
              <h4>About this Item</h4>
              <div
                className="product-description"
                dangerouslySetInnerHTML={{ __html: productData.description }}
              ></div>
            </section>
          </section>
          <section className="w-[18rem] h-[21rem] border border-[#c3c3c3] rounded-[0.5rem] p-[1.2rem] mr-[1rem] bg-[#131740] text-left">
            <p className="text-[28px] font-semibold">
              <span className="relative sm:text-sm text-[9px] sm:top-[-0.5rem] top-[-0.2rem] font-normal pr-[2px]">
                $
              </span>
              {getBigPrice(productData.price)}
              <span className="relative sm:text-sm text-[9px] sm:top-[-0.5rem] top-[-0.2rem] pl-[2px] font-normal">
                {getSmallPrice(productData.price)}
              </span>
            </p>
            <p className="text-[#ccc] text-[0.8rem] mt-[1rem]">
              No Import Fees Deposit & $10 Shipping World Wide
            </p>
            <section className="flex flex-col justify-evenly h-[4rem] mt-[1rem] mb-[1rem]">
              <label
                className="text-[#40cd5e] text-[1rem]"
                htmlFor="inputField"
              >
                In Stock
              </label>
              <input
                className="w-[5rem] text-white text-[0.8rem] bg-[#131740] p-[0.2rem] text-center rounded-[0.2rem] outline-none border border-[#c3c3c3]"
                type="text"
                id="qty"
                name="qty"
                placeholder="Qty: 1"
                onChange={() => checkQty("qty")}
                required
              />
              {qtyError && (
                <span className="text-[#ff2d55] text-[14px]">
                  * Qty is required!
                </span>
              )}
            </section>
            <section className="flex flex-col justify-evenly h-[7rem]">
              <button className="bg-[#f9d94c] hover:bg-[#e9c939] text-xs text-black rounded-[10rem] p-[0.5rem] border-none outline-none cursor-pointer">
                Add to Cart
              </button>
              <button
                className="bg-[#f2a942] hover:bg-[#e9c939] text-xs text-black rounded-[10rem] p-[0.5rem] border-none outline-none cursor-pointer"
                onClick={() => checkQty("buy")}
              >
                Buy Now
              </button>
            </section>
          </section>
        </section>
        <Modal
          title="Purchase Product"
          open={isModalVisible}
          onOk={handleOk}
          onCancel={() => setIsModalVisible(false)}
          className="buy-modal"
          width={800}
        >
          <section className="flex justify-between">
            <img
              src={productData.images && getFirstImage(productData.images)}
              alt="Product Image"
              width="300"
              height="300"
            />
            <section className="ml-[2rem]">
              <p className="text-[20px] text-white">{productData.name}</p>
              <p className="text-[28px] text-white font-semibold p-[0.7rem 0]">
                <span className="relative sm:text-sm text-[9px] sm:top-[-0.5rem] top-[-0.2rem] font-normal pr-[2px]">
                  $
                </span>
                {getBigPrice(productData.price)}
                <span className="relative sm:text-sm text-[9px] sm:top-[-0.5rem] top-[-0.2rem] pl-[2px] font-normal">
                  {getSmallPrice(productData.price)}
                </span>
              </p>
              <label className="text-white">Qty:</label>
              <span className="relative top-[1px] text-white text-[18px] ml-[0.5rem]">
                {qtyVal}
              </span>
              <br />
              <label className="text-white" htmlFor="inputField">
                Delivery Address
              </label>
              <input
                className="text-black w-[15rem] h-[2rem] p-[0.3rem] ml-[0.5rem] rounded-[0.2rem 0 0 0.2rem] outline-none border border-[#c3c3c3]"
                type="text"
                id="inputField"
                name="inputField"
                //   maxLength="120"
                placeholder="Delivery Address"
                required
                onChange={getDeliveryAddress}
              />

              <br />
              <div className="text-white text-[20px] border-t-[1px] border-t-white mt-[2rem] pt-[1rem]">
                Total:{" "}
                <span className="text-[28px] font-semibold pr-[0.3rem]">
                  {totalPrice}
                </span>
                ALGO
              </div>
            </section>
          </section>
        </Modal>
      </section>
    </div>
  );
};

export default ProductDetail;
