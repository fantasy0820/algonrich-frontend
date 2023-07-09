import { useEffect, useState } from "react";
import {
  useConnect,
  useDisconnect,
  useNetwork,
  useAccount,
  useSendTransaction,
  useWaitForTransaction,
} from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { switchNetwork } from "@wagmi/core";
import { Input, Popover, Radio, Modal, message } from "antd";
import Select from "react-tailwindcss-select";
import { Product } from "types";
import axios from "axios";
import { ethers } from "ethers";
import { CONTRACT_ADDR, Currencies, CurrenciesOptions } from "const/Consts";
import { shortenIfAddress } from "utils/address";
import Checkout from "./Checkout";
import tokenList from "utils/tokenList.json";
import { fetchCurrenciesRate, fetchOwnerWallet, fetchTokenPrice } from "apis";
import "./Checkout.scss";
import { formatEther, formatUnits } from "ethers/lib/utils.js";

const Purchase = ({ stripePromise }: any) => {
  const [tokenUSDPrice, setTokenUSDPrice] = useState(0);
  const [currenciesRate, setCurrenciesRate] = useState<{ [key: string]: (number | undefined) }>({});
  const [currency, setCurrency] = useState(CurrenciesOptions[0])
  const [tokenBalance, setTokenBalance] = useState("0.0");
  const [maxTokenAmount, setMaxTokenAmount] = useState(0);
  const [maxAmount, setMaxAmount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [estimate, setEstimate] = useState("0.00");
  const [refreshStamp, setRefreshStamp] = useState(0);
  const [isOpenCheckout, setIsOpenCheckout] = useState(false);

  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { connect } = useConnect({
    connector: new MetaMaskConnector(),
  });
  const { disconnect } = useDisconnect();

  const getBalance = async (token: string) => {
    if (!isConnected) return;
    const url = `https://deep-index.moralis.io/api/v2/${address}/erc20`;

    try {
      const tokenBalance = await axios.get(url, {
        headers: {
          accept: "application/json",
          "X-API-Key": process.env.REACT_APP_MORALIS_KEY,
        },
        params: {
          chain: "bsc",
          token_addresses: token,
        },
      });

      const formattedBalance = tokenBalance.data[0]
        ? Number(ethers.utils.formatEther(tokenBalance.data[0]?.balance)).toFixed(
          5
        )
        : "0.0";
      setTokenBalance(formattedBalance);
    } catch (e) {
      setTokenBalance("0.00");
    }
  }

  const modifyCurrency = (e: any) => {
    setCurrency({
      ...currency,
      value: e.value,
      label: e.label
    });
    setRefreshStamp(30);
  }

  const openCheckout = () => {
    setIsOpen(true);
  }


  useEffect(() => {
    if (!isConnected) return;
    getBalance(tokenList[0].address);
  }, [isConnected])

  useEffect(() => {
    fetchOwnerWallet().then(res => {
      if (!res) return;
      let algoToken = res.filter((item: any) => item.token_address.toUpperCase() == CONTRACT_ADDR.ALGO.toUpperCase())[0];
      if (!algoToken) return;
      let tokenAmount = formatEther(algoToken.balance);
      setMaxTokenAmount(parseFloat(tokenAmount));
    });
    fetchCurrenciesRate(Currencies).then(res => { if (res) setCurrenciesRate(res) });
    fetchTokenPrice(tokenList[0].address).then(res => setTokenUSDPrice(res.usdPrice))
  }, [])

  useEffect(() => {
    if (tokenUSDPrice === 0 || maxTokenAmount === 0) return;
    let rate = currenciesRate[currency.label];
    if (!rate) return;
    setMaxAmount(maxTokenAmount * tokenUSDPrice / rate);
  }, [currenciesRate, currency, tokenUSDPrice, maxTokenAmount])

  useEffect(() => {
    if (!isConnected) connect();
    const handleSwitchNetwork = async () => {
      if (isConnected && chain?.id !== 56) {
        await switchNetwork({
          chainId: 56,
        });
      }
    };
    handleSwitchNetwork();
  }, [isConnected]);

  useEffect(() => {
    if (tokenUSDPrice == 0 || !parseFloat(amount) || amount == "") return;
    let rate = currenciesRate[currency.label];
    if (!rate) return;
    setEstimate((parseFloat(amount) * rate / tokenUSDPrice).toFixed(2))
  }, [tokenUSDPrice, amount, currenciesRate, currency, amount])

  const product: Product = {
    title: "ALGO",
    amount: parseFloat(amount) ? parseFloat(amount) : 0,
    currency: currency.label
  }

  return (
    <div className="justify-between mx-auto w-[95%] lg:w-[90%] py-[150px] text-white">
      <div className="buyBoxHeader">
        <h1 className="">Buy Crypto Token</h1>
      </div>
      <div className="flex justify-center items-center">
        <div className="buyBox">
          <div className="my-3 flex justify-between gap-4 py-auto w-full">
            {isConnected && chain?.id === 56 ? (
              <div
                className="bg-[#243056] rounded-[100px] text-[#5981f3] font-[700] py-[10px] px-[20px] transition duration-300 hover:text-[#3b4874] hover:cursor-pointer"
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

          <div className="my-3 flex justify-between w-full">
            <img src={tokenList[0].img} alt="Algo" className="w-24" />
            <div className="my-auto hidden md:block">
              <h1 className="text-[20px]">ALGO Token</h1>
              <span className="text-[12px]">Binance Smart Chain</span>
            </div>
            <div className="my-auto text-right">
              <div className="text-white text-lg py-auto my-auto">Price: {tokenUSDPrice.toFixed(6)}</div>
              {
                isConnected && chain?.id === 56 ? (
                  <div className="text-white text-lg py-auto my-auto">Balance: {tokenBalance}</div>
                ) : null
              }
            </div>
          </div>

          <div className="my-3 flex justify-between gap-5 w-full">
            <div className="bg-slate-100 rounded-xl px-3 py-1 dark:bg-portfolio-slateGray-700 border border-subdued bg-default">
              <div className="flex justify-between text-black w-32 md:w-[80%]">
                <input type="text" className="bg-transparent border-transparent focus:border-transparent focus:outline-none focus:ring-0 font-bold text-xl ml-0 pl-0 py-0" placeholder={`${currency.value} 0.00`} value={amount} onInput={(e: any) => setAmount(e.target.value)
                } />
              </div>
            </div>
            <div className="font-chakrapetch w-[80px] rounded-xl text-[18px] my-auto">
              <Select
                primaryColor={"#3d4db5"}
                classNames={{
                  menuButton: ({ isDisabled }: { isDisabled?: boolean } = {}) =>
                    `flex text-sm text-white font-chakrapetch border border-[#3d4db5] shadow-sm transition-all outline-none rounded-xl duration-200 focus:outline-none ${isDisabled ? "bg-[#0c1226]" : "bg-[#3d4db5] hover:bg-[#4e5cdb]"
                    }`,
                }}
                value={currency}
                onChange={modifyCurrency}
                options={CurrenciesOptions}
              />
            </div>
          </div>

          <div className="mt-2 text-lg w-full">
            <div className="flex justify-between w-full">
              <span>You pay</span>
              <span>{parseFloat(amount)? parseFloat(amount) : 0} {currency.label}</span>
            </div>

            <div className="flex justify-between w-full">
              <span>You receive</span>
              <span>{estimate}</span>
            </div>
          </div>

          <div className="my-3 w-full">
            <p className="text-sm text-left">Selected payment method</p>
            <button className="space-x-2 px-3.5 py-2 text-sm rounded-xl inline-flex justify-center items-center bg-inherit hover:bg-midnight-100 dark:hover:bg-blue-800 text-default hover:text-info hover:dark:text-white border border-default hover:border-midnight-600 dark:hover:border-blue-600 transition-colors group !h-12 !p-4 w-full">
              <div className="flex items-center truncate flex-1">
                <div className="flex items-center">
                  <svg width="20" height="14" viewBox="0 0 20 14" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M18.3334 5.33366H1.66669M9.16669 8.66699H5.00002M1.66669 3.83366L1.66669 10.167C1.66669 11.1004 1.66669 11.5671 1.84834 11.9236C2.00813 12.2372 2.2631 12.4922 2.5767 12.652C2.93322 12.8337 3.39993 12.8337 4.33335 12.8337L15.6667 12.8337C16.6001 12.8337 17.0668 12.8337 17.4233 12.652C17.7369 12.4922 17.9919 12.2372 18.1517 11.9236C18.3334 11.5671 18.3334 11.1004 18.3334 10.167V3.83366C18.3334 2.90024 18.3334 2.43353 18.1517 2.07701C17.9919 1.76341 17.7369 1.50844 17.4233 1.34865C17.0668 1.16699 16.6001 1.16699 15.6667 1.16699L4.33335 1.16699C3.39993 1.16699 2.93322 1.16699 2.5767 1.34865C2.2631 1.50844 2.00813 1.7634 1.84834 2.07701C1.66669 2.43353 1.66669 2.90024 1.66669 3.83366Z" stroke="black" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                  <p className="text-xs sm:text-sm leading-5 text-default font-normal ml-2">Debit or Credit</p>
                </div>
              </div>
            </button>
          </div>

          <div className="my-4 w-full">
            <button className="py-2 rounded-xl font-medium justify-center w-full bg-blue-800 disabled:bg-gray-600 disabled:text-gray-800" disabled={(parseFloat(amount) && parseFloat(amount) < maxAmount && parseFloat(amount) >= 0.5 && isConnected) ? false : true} onClick={openCheckout}>Buy Now</button>
          </div>
        </div>
      </div>
      {isOpen && <Modal
        open={isOpen}
        footer={null}
        onCancel={() => setIsOpen(false)}
        title="Buy ALGO To Your Wallet"
      >
        <div className="modalContent">
          {isOpen && <Checkout stripePromise={stripePromise} item={product} />}
        </div>
      </Modal>}
    </div>
  )
}

export default Purchase;