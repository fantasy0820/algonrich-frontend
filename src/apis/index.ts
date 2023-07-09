import axios from "axios";
import { API_BASIC_URL } from "const/Consts";

const handleSendRequst = async (data: any) => {
  return axios.post(`${API_BASIC_URL}` + `/contact`, data)
};

const fetchCurrenciesRate = async (currencies: string[]) => {
  const requestURL = `${API_BASIC_URL}` + `/payment/getCurrenciesRate`
  try {
    const response = await axios.get(requestURL, { params: { currencies } });
    return response.data;
  } catch (e) {
    return undefined;
  }
}

const fetchOwnerWallet = async () => {
  const requestURL = `${API_BASIC_URL}` + `/crypto-token/ownerWallet`
  try {
    const response = await axios.get(requestURL);
    return response.data;
  } catch (e) {
    return undefined;
  }
}

const fetchTokenPrice = async (token: string) => {
  const urlToken = `https://deep-index.moralis.io/api/v2/erc20/${token}/price?chain=bsc&exchange=pancakeswap-v2`;
  try {
    const response = await axios.get(urlToken, {
      headers: {
        accept: "application/json",
        "X-API-Key": process.env.REACT_APP_MORALIS_KEY,
      }
    });
    return response.data;
  } catch (e) {
    return 0;
  }
}

export {
  handleSendRequst,
  fetchCurrenciesRate,
  fetchTokenPrice,
  fetchOwnerWallet,
};