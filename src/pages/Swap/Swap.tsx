import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal } from "antd";
import axios from "axios";
import {
  faClock,
  faLayerGroup,
  faCaretDown,
  faCaretRight,
  faArrowDown,
  faCog,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import { CONTRACT_ADDR } from "const/Consts";
import tokenList from "utils/tokenList.json";
import { shortenIfAddress } from "utils/address";
import { Trans } from "react-i18next";
import "./Swap.scss";
import { toastInfo } from "helpers/toast.helper";
import { useBalances, useSwap, useTrade } from "hooks/useContract";
import { SwapType } from "types";
import {
  RightOutlined,
  ArrowDownOutlined,
  DownOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useConnect, useDisconnect, useNetwork, useAccount, useSendTransaction, useWaitForTransaction } from "wagmi";
import { switchNetwork } from '@wagmi/core';
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import erc20abi from "erc-20-abi";

interface DexPrices {
  tokenOne: number;
  tokenTwo: number;
  ratio: number;
}

export default function Swap() {
  const [openSelectFrom, setOpenSelectFrom] = useState(false);
  const [changeToken, setChangeToken] = useState(0);
  const [openSelectTo, setOpenSelectTo] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [coinFrom, setCoinFrom] = useState(tokenList[0]);
  const [tokenAmountFrom, setTokenAmountFrom] = useState<any | null>(null);
  const [coinTo, setCoinTo] = useState(tokenList[1]);
  const [tokenAmountTo, setTokenAmountTo] = useState<any | null>(null);
  const [openSettingModal, setOpenSettingModal] = useState(false);
  const [maxTokenFromAmount, setMaxTokenFromAmount] = useState(0);
  const [wallet, setWallet] = useState<string | null>(null);
  const [walletChainId, setChainId] = useState<string | null>(null);
  const [prices, setPrices] = useState<DexPrices>({
    tokenOne: 0,
    tokenTwo: 0,
    ratio: 1
  });
  const [slippage, setSlippage] = useState(2.5);
  const { bnb, updateBnb, tokenBalance, updateTokenBalance, getTokenBalance } =
    useBalances(56);

    const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new MetaMaskConnector(),
  });
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();

  const [txDetails, setTxDetails] = useState({
    to:null,
    data: null,
    value: null,
  });

  const {data, sendTransaction} = useSendTransaction({
    mode: "recklesslyUnprepared",
    request: {
      from: address,
      to: String(txDetails.to),
      data: String(txDetails.data),
      value: String(txDetails.value),
    }
  });

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  const changeAmount = (e: any) => {
    setTokenAmountFrom(e.target.value);

    if(e.target.value && prices) {
      setTokenAmountTo((e.target.value * prices.ratio).toFixed(2));
    } else {
      setTokenAmountTo(null);
    }
  }

  useEffect(() => {
    const handleSwitchNetwork = async () => {
      if(isConnected && chain?.id !== 56) {
        await switchNetwork({
          chainId: 56
        })
      }

      if (isConnected) {
        localStorage.setItem("walletAddress", String(address));
        localStorage.setItem("chainId", String(chain?.id));
      }

      if (localStorage.getItem("walletAddress") !== null) {
        setWallet(String(localStorage.getItem("walletAddress")));
      }

      if (localStorage.getItem("chainId") !== null) {
        setChainId(String(localStorage.getItem("chainId")));
      }
    }

    if(!isConnected) {
      localStorage.clear();
    }
    
    handleSwitchNetwork();
  }, [isConnected]);

  /**
   * Open modal dialog
   * @param asset 1: coinFrom 2: coinTo
   */
  function openModal(asset: number) {
    setChangeToken(asset);
    setIsOpen(true);
  }

  function modifyToken(i: number) {
    setPrices({
      tokenOne: 0,
      tokenTwo: 0,
      ratio: 1
    });
    setTokenAmountFrom(null);
    setTokenAmountTo(null);
    if (changeToken === 1) {
      setCoinFrom(tokenList[i]);
      fetchPrices(tokenList[i].address, coinTo.address)
    } else {
      setCoinTo(tokenList[i]);
      fetchPrices(coinFrom.address, tokenList[i].address)
    }
    setIsOpen(false);
  }

  function switchTokens() {
    setPrices({
      tokenOne: 0,
      tokenTwo: 0,
      ratio: 1
    });
    setTokenAmountFrom(null);
    setTokenAmountTo(null);
    const one = coinFrom;
    const two = coinTo;
    setCoinFrom(two);
    setCoinTo(one);
    fetchPrices(two.address, one.address);
  }

  /**
   * Get Price from api
   * @param one address for coinFrom
   * @param two address for coinTo
   */
  async function fetchPrices(one: string, two: string) {
    const urlOne = `https://deep-index.moralis.io/api/v2/erc20/${one}/price?chain=bsc&exchange=pancakeswap-v2`;
    const urlTwo = `https://deep-index.moralis.io/api/v2/erc20/${two}/price?chain=bsc&exchange=pancakeswap-v2`;
    const responseOne = await axios.get(urlOne, {
      headers: {
        accept: 'application/json',
        'X-API-Key': process.env.REACT_APP_MORALIS_KEY,
      }
    });

    const responseTwo = await axios.get(urlTwo, {
      headers: {
        accept: 'application/json',
        'X-API-Key': process.env.REACT_APP_MORALIS_KEY,
      }
    });

    setPrices({
      tokenOne: responseOne.data.usdPrice,
      tokenTwo: responseTwo.data.usdPrice,
      ratio: responseOne.data.usdPrice/responseTwo.data.usdPrice
    });

    console.log(prices)
  }

  async function fetchDexSwap(){
    console.log(address)
    const allowance = await axios.get(`https://api.1inch.io/v5.0/56/approve/allowance?tokenAddress=${coinFrom.address}&walletAddress=${address}`)
    if(allowance.data.allowance === "0"){
      const approve = await axios.get(`https://api.1inch.io/v5.0/56/approve/transaction?tokenAddress=${coinFrom.address}`)
      
      setTxDetails(approve.data);
      
      console.log("not approved")
      return
    }

    const tx = await axios.get(
      `https://api.1inch.io/v5.0/56/swap?fromTokenAddress=${coinFrom.address}&toTokenAddress=${coinTo.address}&amount=${tokenAmountFrom.padEnd(coinFrom.decimals+tokenAmountFrom.length, '0')}&fromAddress=${address}&slippage=${slippage}`
    )

    let decimals = Number(`1E${coinTo.decimals}`)

    setTokenAmountTo((Number(tx.data.toTokenAmount)/decimals).toFixed(2));
    setTxDetails(tx.data.tx);
  }

  useEffect(() => {
    fetchPrices(tokenList[0].address, tokenList[1].address)
  }, []);

  useEffect(()=>{
    if(txDetails.to && isConnected){
      sendTransaction();
    }
  }, [txDetails])

  return (
    <div>

      <div className="justify-between mx-auto w-[95%] lg:w-[90%] swap_form py-[150px] gap-[100px] flex-col md:flex-row items-center">
        <Modal
          open={isOpen}
          footer={null}
          style={{ padding: 0 }}
          onCancel={() => setIsOpen(false)}
          title="Select a token"
        >
          <div className="modalContent" >
            {tokenList?.map((e, i) => {
              return (
                <div
                  className="tokenChoice"
                  key={i}
                  onClick={() => {
                    modifyToken(i);
                  }}
                >
                  <img src={e.img} alt={e.ticker} className="tokenLogo" />
                  <div className="tokenChoiceNames">
                    <div className="tokenName">{e.name}</div>
                    <div className="tokenTicker">{e.ticker}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </Modal>
        <div className="max-w-[500px] text-left ml-[20px]">
          <p className="uppercase tracking-[1px] font-[700] text-[17px] text-white mb-[10px]">
            Coin Swap
          </p>
          <h2 className="text-[52px] text-white font-[700] leading-[60px] mb-[15px]">
            You can swap <span className="text-[#ff06b7]">Algos</span> here
          </h2>
          <p className="text-[18px] leading-[28px] text-[#ddd]">
            Take advantage now of our prices's and rewards.
          </p>
        </div>
        <div className="swap_form_content w-[90%] md:max-w-[450px]">
          <div className="swap_form_content_top">
            <div className="swap_control_left">
              {wallet && (
                <span
                  className="flex"
                  onClick={() => {
                    disconnect();
                    setWallet("");
                    setChainId("");
                  }}
                >
                  <FontAwesomeIcon
                    icon={faWallet}
                    color="white"
                    size="xs"
                    style={{
                      marginRight: "10px",
                      border: "1px solid",
                      borderRadius: "50%",
                      padding: "3px",
                    }}
                  />
                  {shortenIfAddress(wallet)}
                </span>
              )}
            </div>
            <div className="swap_contol_right">
              <div
                className="icon"
                onClick={() => {
                  setOpenSettingModal(!openSettingModal);
                }}
              >
                <FontAwesomeIcon icon={faLayerGroup} color="white" size="xl" />
              </div>
              <div className="icon">
                <FontAwesomeIcon icon={faClock} color="white" size="xl" />
              </div>
            </div>
          </div>
          <div className="swap_form_content_ratebar">
            <span className="text-[20px]">{prices.ratio.toFixed(2)} </span>
            <span className="text-[12px]">
              {coinFrom.ticker}/{coinTo.ticker}
            </span>
          </div>
          <div className="swap_form_content_inner_form">
            <div className="form">
              <label htmlFor="">
                From ({"Max :" + maxTokenFromAmount.toFixed(5) + " " + coinFrom.ticker})
                <div className="form_content">
                  <input
                    type="number"
                    className="form_content_input"
                    placeholder="0"
                    min={0}
                    value={tokenAmountFrom}
                    onChange={changeAmount}
                    onKeyDown={(evt) =>
                      ["e", "E", "+", "-"].includes(evt.key) &&
                      evt.preventDefault()
                    }
                  />

                  <div className="form_content_select">
                    <div className="asset-from" onClick={() => openModal(1)}>
                      <img src={coinFrom.img} alt="assetOneLogo" className="assetLogo" />
                      <p className="coin-type-text">
                        {coinFrom.ticker}
                      </p>
                    {(isOpen && changeToken === 1) && <DownOutlined />}
                    {!(isOpen && changeToken === 1) && <RightOutlined />}
                    </div>
                  </div>
                </div>
              </label>
            </div>
          </div>
          <div className="swap_form_content_middle_bar">
            <a href="#" onClick={switchTokens}>
              <FontAwesomeIcon icon={faArrowDown} color="white" size="lg" />
            </a>
          </div>
          <div className="swap_form_content_inner_form">
            <div className="form">
              <label htmlFor="">To</label>
              <div className="form_content">
                <input
                  type="number"
                  className="form_content_input"
                  placeholder="0"
                  min={0}
                  value={tokenAmountTo}
                  disabled={true}
                />
                <div className="form_content_select">
                  <div className="asset-to" onClick={() => openModal(2)}>
                    <img src={coinTo.img} alt="assetOneLogo" className="assetLogo" />
                    {coinTo.ticker}
                    {(isOpen && changeToken === 2) && <DownOutlined />}
                    {!(isOpen && changeToken === 2) && <RightOutlined />}
                  </div>
                  {/* <div
                    className="select_header"
                    style={{ cursor: "pointer" }}
                    onClick={() => openModal(2)}
                  >
                    <img src={coinTo.img} alt="assetOneLogo" className="assetLogo" />
                    {coinTo.ticker}
                    <FontAwesomeIcon
                      icon={
                        (isOpen === true && changeToken === 2) ? faCaretDown : faCaretRight
                      }
                      color="white"
                      size="sm"
                      className="icon"
                    />
                  </div> */}
                </div>
              </div>
            </div>
          </div>
          <div className="swap_form_content_btn">
            {wallet && walletChainId === "56" ? (
              <button onClick={() => fetchDexSwap()}>
                <Trans i18nKey="text_swap">Swap</Trans>
              </button>
            ) : (
              <button
                onClick={() => {
                  connect();
                }}
              >
                <Trans i18nKey="text_connectwallet">Connect Wallet</Trans>
              </button>
            )}
          </div>
          <div className="modal">
            <div
              className={
                openSettingModal ? "modal_setting" : "modal_setting dis-none"
              }
            >
              <div className="modal_header">
                <FontAwesomeIcon
                  icon={faCog}
                  color="white"
                  size="xl"
                  className="icon"
                />
                <h3>Setting</h3>
              </div>
              <div className="modal_content">
                <div className="swap_set">
                  <span>Default Transaction Speed</span>
                  <ul>
                    <li>standard (6)</li>
                    <li>fast (7)</li>
                    <li>instant (8)</li>
                  </ul>
                </div>
                <div className="swap_set">
                  <span>Slippage Tolerance</span>
                  <ul className="">
                    <li className="cursor-pointer" onClick={() => {setSlippage(0.1)}}>0.1%</li>
                    <li className="cursor-pointer" onClick={() => {setSlippage(0.5)}}>0.5%</li>
                    <li className="cursor-pointer" onClick={() => {setSlippage(1)}}>1%</li>
                    <li className="cursor-pointer" onClick={() => {setSlippage(10)}}>10%</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
