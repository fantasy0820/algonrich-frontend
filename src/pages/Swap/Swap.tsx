import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal } from "antd";
import {
  faClock,
  faLayerGroup,
  faArrowDown,
  faCog,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import tokenList from "utils/tokenList.json";
import { shortenIfAddress } from "utils/address";
import { Trans } from "react-i18next";
import "./Swap.scss";
import { toastInfo } from "helpers/toast.helper";
import useConnect from "hooks/useConnect";
import { useBalances, useSwap, useTrade } from "hooks/useContract";
import {
  RightOutlined,
  DownOutlined,
} from "@ant-design/icons";
import erc20abi from "erc-20-abi";

export default function Swap() {
  const [changeToken, setChangeToken] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [coinFrom, setCoinFrom] = useState(tokenList[0]);
  const [tokenAmountFrom, setTokenAmountFrom] = useState(0);
  const [coinTo, setCoinTo] = useState(tokenList[0]);
  const [tokenAmountTo, setTokenAmountTo] = useState(0);
  const [openSettingModal, setOpenSettingModal] = useState(false);
  const [maxTokenFromAmount, setMaxTokenFromAmount] = useState(0);
  const [wallet, setWallet] = useState<string | null>(null);
  const [walletChainId, setChainId] = useState<string | null>(null);
  const { bnb, updateBnb, tokenBalance, updateTokenBalance, getTokenBalance } =
    useBalances(56);
  const { swapTokens, loading, disabled, error } = useSwap(56);

  const {
    connect,
    disconnect,
    isUnsupportedChainIdError,
    chainId,
    account,
    active,
    switchToBSC,
  } = useConnect();
  const {
    getTradeAmount,
    getOtherTradeAmount,
    rate,
    update: updateRate,
    tradeAmount,
  } = useTrade(56);

  const handleSwapToken = async () => {
    if (!validateInput()) {
      toastInfo("Input Invalid");
      return;
    }
    swapTokens(
      tokenAmountFrom,
      coinFrom.address,
      coinTo.address
    ).then((res) => {
      if (res) {
        updateBnb();
        updateTokenBalance();
      }
    });
  };
  const validateInput = () => {
    if (
      tokenAmountFrom == null ||
      tokenAmountFrom <= 0 ||
      tokenAmountFrom >= maxTokenFromAmount
    ) {
      return false;
    }
    return true;
  };
  useEffect(() => {
    if (account) {
      localStorage.setItem("walletAddress", String(account));
      localStorage.setItem("chainId", String(chainId));
    }

    if (localStorage.getItem("walletAddress") !== null) {
      setWallet(String(localStorage.getItem("walletAddress")));
    }
    if (localStorage.getItem("chainId") !== null) {
      setChainId(String(localStorage.getItem("chainId")));
    }

    let _temp_max = 0;
    if (coinFrom.ticker === "BNB") {
      _temp_max = bnb > 0.001 ? bnb - 0.001 : 0;
      setMaxTokenFromAmount(_temp_max);
      getTradeAmount(
        tokenAmountFrom,
        coinFrom.address,
        coinTo.address
      );
    } else {
      getTokenBalance(coinFrom.address, erc20abi);
      setMaxTokenFromAmount(tokenBalance);
      getOtherTradeAmount(
        tokenAmountFrom,
        coinFrom.address,
        coinTo.address
      );
    }

    // disconnect
  }, [coinFrom.ticker, coinTo.ticker, bnb, tokenBalance, wallet, walletChainId]);

  useEffect(() => {
    if(!account) {
      localStorage.clear()
    }

    if (tokenAmountFrom == 0) {
      setTokenAmountTo(0);
      return;
    }

    setTokenAmountTo(parseFloat(tradeAmount.toFixed(8)));
  }, [tokenAmountFrom, tradeAmount]);

  /**
   * Open modal dialog
   * @param asset 1: coinFrom 2: coinTo
   */
  function openModal(asset: number) {
    setChangeToken(asset);
    setIsOpen(true);
  }

  function modifyToken(i: number) {
    setTokenAmountFrom(0);
    setTokenAmountTo(0);
    if (changeToken === 1) {
      setCoinFrom(tokenList[i]);
      updateRate(tokenAmountFrom, coinFrom.address, coinTo.address);
    } else {
      setCoinTo(tokenList[i]);
      updateRate(tokenAmountFrom, coinFrom.address, coinTo.address);
    }
    setIsOpen(false);
  }

  function switchTokens() {
    setTokenAmountFrom(0);
    setTokenAmountTo(0);
    const one = coinFrom;
    const two = coinTo;
    setCoinFrom(two);
    setCoinTo(one);
    updateRate(tokenAmountFrom, coinFrom.address, coinTo.address);
  }

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
            <span className="text-[20px]">{rate.toFixed(2)} </span>
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
                    onInput={(e: any) => {
                      setTokenAmountFrom(e.target.value);
                      let amount = 0;
                      if (e.target.value) {
                        amount = parseFloat(e.target.value);
                        if (coinFrom.ticker === "BNB") {
                          getTradeAmount(
                            amount,
                            coinFrom.address,
                            coinTo.address
                          );
                        } else {
                          getOtherTradeAmount(
                            amount,
                            coinFrom.address,
                            coinTo.address
                          );
                        }
                      }
                    }}
                    onKeyDown={(evt) =>
                      ["e", "E", "+", "-"].includes(evt.key) &&
                      evt.preventDefault()
                    }
                  />

                  <div className="form_content_select">
                    <div className="asset-from cursor-pointer" onClick={() => openModal(1)}>
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
                  <div className="asset-to cursor-pointer" onClick={() => openModal(2)}>
                    <img src={coinTo.img} alt="assetOneLogo" className="assetLogo" />
                    {coinTo.ticker}
                    {(isOpen && changeToken === 2) && <DownOutlined />}
                    {!(isOpen && changeToken === 2) && <RightOutlined />}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="swap_form_content_btn">
            {wallet && !isUnsupportedChainIdError && walletChainId === "56" ? (
              <button onClick={() => handleSwapToken()}>
                <Trans i18nKey="text_swap">Swap</Trans>
              </button>
            ) : (
              <button
                onClick={() => {
                  connect();
                  switchToBSC();
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
                  <ul>
                    <li>0.1%</li>
                    <li>0.5%</li>
                    <li>1%</li>
                    <li>10%</li>
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
