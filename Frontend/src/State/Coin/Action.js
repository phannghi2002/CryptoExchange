import axios from "axios";
import {
  FETCH_ALL_COIN_FAILURE,
  FETCH_ALL_COIN_REQUEST,
  FETCH_ALL_COIN_SUCCESS,
  FETCH_COIN_DETAILS_FAILURE,
  FETCH_COIN_DETAILS_REQUEST,
  FETCH_COIN_DETAILS_SUCCESS,
  FETCH_COIN_LIST_FAILURE,
  FETCH_COIN_LIST_REQUEST,
  FETCH_COIN_LIST_SUCCESS,
  FETCH_MARKET_CHART_FAILURE,
  FETCH_MARKET_CHART_REQUEST,
  FETCH_MARKET_CHART_SUCCESS,
  FETCH_TOP50_COINS_FAILURE,
  FETCH_TOP50_COINS_REQUEST,
  FETCH_TOP50_COINS_SUCCESS,
  FETCH_TOPGAINERS_COINS_FAILURE,
  FETCH_TOPGAINERS_COINS_REQUEST,
  FETCH_TOPGAINERS_COINS_SUCCESS,
  FETCH_TOPLOSERS_COINS_FAILURE,
  FETCH_TOPLOSERS_COINS_REQUEST,
  FETCH_TOPLOSERS_COINS_SUCCESS,
  RESET_COIN_DETAILS_SUCCESS,
  SEARCH_COIN_FAILURE,
  SEARCH_COIN_REQUEST,
  SEARCH_COIN_SUCCESS,
} from "./ActionTypes";
import { API_BASE_URL } from "@/config/api";

export const getAllCoin = (page) => async (dispatch) => {
  console.log("page", page);

  dispatch({ type: FETCH_ALL_COIN_REQUEST });
  try {
    // const { data } = await axios.get(`${API_BASE_URL}/coins?page=${page}`);
    const { data } = await axios.get(
      `${API_BASE_URL}/coin/getAll`
      //`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=10&page=${page}`
    );
    console.log("coin all", data);

    dispatch({ type: FETCH_ALL_COIN_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: FETCH_ALL_COIN_FAILURE, payload: error.message });

    console.log(error);
  }
};

export const getCoinList =
  (page = 1) =>
  async (dispatch) => {
    console.log("page", page);

    dispatch({ type: FETCH_COIN_LIST_REQUEST });
    try {
      // const { data } = await axios.get(`${API_BASE_URL}/coins?page=${page}`);
      const { data } = await axios.get(
        `${API_BASE_URL}/coin/list?page=${page - 1}`
      );
      console.log("coin list", data);

      dispatch({ type: FETCH_COIN_LIST_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: FETCH_COIN_LIST_FAILURE, payload: error.message });

      console.log(error);
    }
  };

export const getTop50CoinList = () => async (dispatch) => {
  dispatch({ type: FETCH_TOP50_COINS_REQUEST });

  try {
    // const response = await axios.get(`${API_BASE_URL}/coins/top50`);
    const response = await axios.get(
      // `https://api.coingecko.com/api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=50&page=1`
      `${API_BASE_URL}/coin/top50`
    );
    console.log("coin top 50", response.data);

    dispatch({ type: FETCH_TOP50_COINS_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: FETCH_TOP50_COINS_FAILURE, payload: error.message });

    console.log(error);
  }
};

export const getTopGainers = () => async (dispatch) => {
  dispatch({ type: FETCH_TOPGAINERS_COINS_REQUEST });

  try {
    // const response = await axios.get(`${API_BASE_URL}/coins/top50`);
    const response = await axios.get(
      // `https://api.coingecko.com/api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=50&page=1`
      `${API_BASE_URL}/coin/topGainers`
    );
    console.log("topGainers", response.data);

    dispatch({ type: FETCH_TOPGAINERS_COINS_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: FETCH_TOPGAINERS_COINS_FAILURE, payload: error.message });

    console.log(error);
  }
};

export const getTopLosers = () => async (dispatch) => {
  dispatch({ type: FETCH_TOPLOSERS_COINS_REQUEST });

  try {
    // const response = await axios.get(`${API_BASE_URL}/coins/top50`);
    const response = await axios.get(
      // `https://api.coingecko.com/api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=50&page=1`
      `${API_BASE_URL}/coin/topLosers`
    );
    console.log("topLosers", response.data);

    dispatch({ type: FETCH_TOPLOSERS_COINS_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: FETCH_TOPLOSERS_COINS_FAILURE, payload: error.message });

    console.log(error);
  }
};
export const fetchMarketChart =
  ({ coinId, days }) =>
  async (dispatch) => {
    dispatch({ type: FETCH_MARKET_CHART_REQUEST });

    try {
      console.log("coinid, days", coinId, days);
      // const response = await axios.get(
      //   `${API_BASE_URL}/coins/${coinId}/chart?days=${days}`
      // );

      const response = await axios.get(
        // `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=1`
        //  `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
        `${API_BASE_URL}/coin/market/${coinId}?day=${days}`
      );
      console.log("market chart", response.data);

      dispatch({ type: FETCH_MARKET_CHART_SUCCESS, payload: response.data });
    } catch (error) {
      dispatch({ type: FETCH_MARKET_CHART_FAILURE, payload: error.message });

      console.log(error);
    }
  };

export const fetchCoinDetails = (coinId) => async (dispatch) => {
  dispatch({ type: FETCH_COIN_DETAILS_REQUEST });

  try {
    // const response = await axios.get(`${API_BASE_URL}/coins/details/${coinId}`);

    const response = await axios.get(
      // `https://api.coingecko.com/api/v3/coins/${coinId}`

      `${API_BASE_URL}/coin/details/${coinId}`
    );
    console.log("in ra t xem nao", response.data);

    dispatch({ type: FETCH_COIN_DETAILS_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: FETCH_COIN_DETAILS_FAILURE, payload: error.message });

    console.log(error);
  }
};

export const resetCoinDetails = () => (dispatch) => {
  dispatch({ type: RESET_COIN_DETAILS_SUCCESS });
};

export const searchCoin = (keyword) => async (dispatch) => {
  dispatch({ type: SEARCH_COIN_REQUEST });

  try {
    const response = await axios.get(
      `${API_BASE_URL}/coin/search?q=${keyword}`
    );
    console.log("search coin", response.data);

    dispatch({ type: SEARCH_COIN_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: SEARCH_COIN_FAILURE, payload: error.message });

    console.log(error);
  }
};
