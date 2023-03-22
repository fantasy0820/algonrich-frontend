import React, { useEffect, useState } from "react";
import { Input, Popover, Radio, Modal, message } from "antd";
import {
  ArrowDownOutlined,
  DownOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import axios from "axios";
import tokenList from "utils/tokenList.json";
import { shortenIfAddress } from "utils/address";
// import { Trans } from "react-i18next";
import "./Swap.scss";
import { useConnect, useDisconnect, useNetwork, useAccount, useSendTransaction, useWaitForTransaction } from "wagmi";
import { switchNetwork } from '@wagmi/core';
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { ethers } from "ethers";
import { isAddress } from "ethers/lib/utils.js";

interface DexPrices {
  tokenOne: number;
  tokenTwo: number;
  ratio: number;
}

export default function Swap() {
  const [messageApi, contextHolder] = message.useMessage();
  const [slippage, setSlippage] = useState(2.5);
  const [tokenOneAmount, setTokenOneAmount] = useState(0);
  const [tokenTwoAmount, setTokenTwoAmount] = useState(0);
  const [tokenOneBalance, setTokenOneBalance] = useState("0.0")
  const [tokenTwoBalance, setTokenTwoBalance] = useState("0.0")
  const [tokenOne, setTokenOne] = useState(tokenList[0]);
  const [tokenTwo, setTokenTwo] = useState(tokenList[1]);
  const [isOpen, setIsOpen] = useState(false);
  const [changeToken, setChangeToken] = useState(1);
  const [prices, setPrices] = useState<DexPrices>({
    tokenOne: 0,
    tokenTwo: 0,
    ratio: 1
  });
  const [txDetails, setTxDetails] = useState({
    to: null,
    data: null,
    value: null,
  });

  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new MetaMaskConnector(),
  });
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();

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
    setTokenOneAmount(e.target.value);

    if(e.target.value && prices) {
      setTokenTwoAmount(Number((e.target.value * prices.ratio).toFixed(2)));
    } else {
      setTokenTwoAmount(0);
    }
  }

  useEffect(() => {
    const handleSwitchNetwork = async () => {
      if(isConnected && chain?.id !== 56) {
        await switchNetwork({
          chainId: 56
        })
      }

      // if (isConnected) {
      //   localStorage.setItem("walletAddress", String(address));
      //   localStorage.setItem("chainId", String(chain?.id));
      // }

      // if (localStorage.getItem("walletAddress") !== null) {
      //   setWallet(String(localStorage.getItem("walletAddress")));
      // }

      // if (localStorage.getItem("chainId") !== null) {
      //   setChainId(String(localStorage.getItem("chainId")));
      // }
    }

    // if(!isConnected) {
    //   localStorage.clear();
    // }
    
    handleSwitchNetwork();
  }, [isConnected]);

  function handleSlippageChange(e: any) {
    setSlippage(e.target.value);
  }

  /**
   * Open modal dialog
   * @param asset 1: tokenOne 2: tokenTwo
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
    setTokenOneAmount(0);
    setTokenTwoAmount(0);
    if (changeToken === 1) {
      setTokenOne(tokenList[i]);
      fetchPrices(tokenList[i].address, tokenTwo.address)
    } else {
      setTokenTwo(tokenList[i]);
      fetchPrices(tokenOne.address, tokenList[i].address)
    }
    setIsOpen(false);
  }

  function switchTokens() {
    setPrices({
      tokenOne: 0,
      tokenTwo: 0,
      ratio: 1
    });
    setTokenOneAmount(0);
    setTokenTwoAmount(0);
    const one = tokenOne;
    const two = tokenTwo;
    setTokenOne(two);
    setTokenTwo(one);
    fetchPrices(two.address, one.address);
  }

  /**
   * Get Price from api
   * @param one address for tokenOne
   * @param two address for tokenTwo
   */
  async function fetchPrices(one: string, two: string) {
    setTokenOneBalance("0.0")
    setTokenTwoBalance("0.0")

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

    if(isConnected) {
      const url = `https://deep-index.moralis.io/api/v2/${address}/erc20`;

      const balanceOne = await axios.get(url, {
        headers: {
          accept: 'application/json',
          'X-API-Key': process.env.REACT_APP_MORALIS_KEY,
        },
        params: {
          "chain": "bsc",
          "token_addresses": one,
        }
      })

      const balanceTwo = await axios.get(url, {
        headers: {
          accept: 'application/json',
          'X-API-Key': process.env.REACT_APP_MORALIS_KEY,
        },
        params: {
          "chain": "bsc",
          "token_addresses": two,
        }
      })

      const formattedBalanceOne = balanceOne.data[0] ? Number(ethers.utils.formatEther(balanceOne.data[0]?.balance)).toFixed(5) : "0.0";
      const formattedBalanceTwo = balanceTwo.data[0] ? Number(ethers.utils.formatEther(balanceTwo.data[0]?.balance)).toFixed(5) : "0.0";
      setTokenOneBalance(formattedBalanceOne)
      setTokenTwoBalance(formattedBalanceTwo)
    }
  }

  async function fetchDexSwap(){
    console.log(address)
    const allowance = await axios.get(`https://api.1inch.io/v5.0/56/approve/allowance?tokenAddress=${tokenOne.address}&walletAddress=${address}`)
    if(allowance.data.allowance === "0"){
      const approve = await axios.get(`https://api.1inch.io/v5.0/56/approve/transaction?tokenAddress=${tokenOne.address}`)
      
      setTxDetails(approve.data);
      
      console.log("not approved")
      return
    }

    const tx = await axios.get(
      `https://api.1inch.io/v5.0/56/swap?fromTokenAddress=${tokenOne.address}&toTokenAddress=${tokenTwo.address}&amount=${tokenOneAmount.toString().padEnd(tokenOne.decimals+tokenOneAmount.toString().length, '0')}&fromAddress=${address}&slippage=${slippage}`
    )

    let decimals = Number(`1E${tokenTwo.decimals}`)

    setTokenTwoAmount(Number((Number(tx.data.toTokenAmount)/decimals).toFixed(2)));
    setTxDetails(tx.data.tx);
  }

  useEffect(() => {
    fetchPrices(tokenList[0].address, tokenList[1].address)
  }, [isConnected]);

  useEffect(()=>{
    if(txDetails.to && isConnected){
      sendTransaction();
    }
  }, [txDetails])

  useEffect(()=>{
    messageApi.destroy();

    if(isConnected) {
      messageApi.open({
        type: 'success',
        content: 'Metamask is connected',
        duration: 1.5,
      })
    } else {
      messageApi.open({
        type: 'warning',
        content: 'Metamask is disconnected',
        duration: 1.5,
      })
    }
  }, [isConnected])

  useEffect(()=>{
    messageApi.destroy();

    if(isLoading){
      messageApi.open({
        type: 'loading',
        content: 'Transaction is Pending...',
        duration: 0,
      })
    }    
  },[isLoading])

  useEffect(()=>{
    messageApi.destroy();

    if(isSuccess){
      messageApi.open({
        type: 'success',
        content: 'Transaction Successful',
        duration: 1.5,
      })
    }else if(txDetails.to){
      messageApi.open({
        type: 'error',
        content: 'Transaction Failed',
        duration: 1.50,
      })
    }
  },[isSuccess])

  const settings = (
    <>
      <div>Slippage Tolerance</div>
      <div>
        <Radio.Group value={slippage} onChange={handleSlippageChange}>
          <Radio.Button value={0.5}>0.5%</Radio.Button>
          <Radio.Button value={2.5}>2.5%</Radio.Button>
          <Radio.Button value={5}>5.0%</Radio.Button>
        </Radio.Group>
      </div>
    </>
  );

  return (
    <>
      {contextHolder}
      <Modal
        open={isOpen}
        footer={null}
        onCancel={() => setIsOpen(false)}
        title="Select a token"
      >
        <div className="modalContent">
          {tokenList?.map((e, i) => {
            return (
              <div
                className="tokenChoice"
                key={i}
                onClick={() => modifyToken(i)}
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
      <div className="flex flex-col mx-auto w-full gap-20 py-[140px]">
        <div className="flex justify-end items-right gap-5 mr-8">
          <div className="items-center rounded-[5px] flex font-[500] text-white px-[15px] py-[10px] transition duration-300 hover:bg-[#222a3a] hover:cursor-pointer">
            <img src="assets/images/bsc.svg" alt="Binance Smart Chain" className="h-7 w-7 pr-[10px]" />
            Binance Smart Chain
          </div>
          {isConnected && chain?.id === 56 ? (
            <div className="bg-[#243056] rounded-[100px] text-[#5981f3] font-[700] py-[10px] px-[20px] transition duration-300 hover:text-[#3b4874] hover:cursor-pointer" onClick={() => disconnect()}>{shortenIfAddress(address)}</div>
          ) : (
            <div className="bg-[#243056] rounded-[100px] text-[#5981f3] font-[700] py-[10px] px-[20px] transition duration-300 hover:text-[#3b4874] hover:cursor-pointer" onClick={() => connect()}>Connect</div>
          )}
          
        </div>
        <div className="flex justify-center items-center">
          <div className="tradeBox">
            <div className="tradeBoxHeader py-5">
              <h4 className="text-white">Swap</h4>
              <Popover
                content={settings}
                title="Settings"
                trigger="click"
                placement="bottomRight"
              >
                <SettingOutlined className="cog" />
              </Popover>
            </div>
            <div className="inputs">
              <Input
                placeholder="0"
                value={tokenOneAmount}
                onChange={changeAmount}
                disabled={!prices}
              />
              <Input placeholder="0" value={tokenTwoAmount} disabled={true} />
              <div className="switchButton" onClick={switchTokens}>
                <ArrowDownOutlined className="switchArrow" />
              </div>
              <div className="absolute top-[10px] right-5 text-[#5981e9]">Balance: {tokenOneBalance}</div>
              <div className="assetOne" onClick={() => openModal(1)}>
                <img src={tokenOne.img} alt="assetOneLogo" className="assetLogo" />
                {tokenOne.ticker}
                <DownOutlined />
              </div>
              <div className="absolute top-[110px] right-5 text-[#5981e9]">Balance: {tokenTwoBalance}</div>
              <div className="assetTwo" onClick={() => openModal(2)}>
                <img src={tokenTwo.img} alt="assetOneLogo" className="assetLogo" />
                {tokenTwo.ticker}
                <DownOutlined />
              </div>
            </div>
            {(tokenOneAmount == 0 || !isConnected) ? (
              <div className="swapButton disabled">Swap</div>
            ) : (
              <div className="swapButton" onClick={fetchDexSwap}>Swap</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
