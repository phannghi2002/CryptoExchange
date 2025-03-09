// import api, { API_BASE_URL } from "@/config/api";
import {
  GET_BALANCE_WALLET_FAILURE,
  GET_BALANCE_WALLET_REQUEST,
  GET_BALANCE_WALLET_SUCCESS,
  GET_EXCHANGE_RATE_FAILURE,
  GET_EXCHANGE_RATE_REQUEST,
  GET_EXCHANGE_RATE_SUCCESS,
  GET_HISTORY_WALLET_FIAT_FAILURE,
  GET_HISTORY_WALLET_FIAT_REQUEST,
  GET_HISTORY_WALLET_FIAT_SUCCESS,
  UPDATE_WALLET_FAILURE,
  UPDATE_WALLET_REQUEST,
  UPDATE_WALLET_SUCCESS,
} from "./ActionType";
import axios from "axios";

export const getBalanceWallet = () => async (dispatch) => {
  dispatch({ type: GET_BALANCE_WALLET_REQUEST });

  try {
    // const response = await api.get(`${API_BASE_URL}/watchlist/internal/coins`);
    const response = await axios.get(
      "http://localhost:8088/wallet/getWallet?userID=user123"
    );

    dispatch({
      type: GET_BALANCE_WALLET_SUCCESS,
      payload: response.data,
    });
    console.log("balance wallet", response.data);
  } catch (e) {
    console.log("error", e);
    dispatch({ type: GET_BALANCE_WALLET_FAILURE, payload: e.message });
  }
};

export const getHistoryWalletFiat = () => async (dispatch) => {
  dispatch({ type: GET_HISTORY_WALLET_FIAT_REQUEST });

  try {
    // const res = await api.post(
    //   `${API_BASE_URL}/watchlist/toggle?coinId=${coinId}`
    // );
    const response = await axios.get(
      "http://localhost:8087/payment/transaction?userId=user123"
    );

    dispatch({
      type: GET_HISTORY_WALLET_FIAT_SUCCESS,
      payload: response.data,
    });
    console.log("get history transaction wallet", response.data);
  } catch (error) {
    console.log("error", error);
    dispatch({
      type: GET_HISTORY_WALLET_FIAT_FAILURE,
      payload: error.message,
    });
  }
};

export const getExchangeRate = (symbols) => async (dispatch) => {
  dispatch({ type: GET_EXCHANGE_RATE_REQUEST });

  try {
    // const res = await api.post(
    //   `${API_BASE_URL}/watchlist/toggle?coinId=${coinId}`
    // );
    const response = await axios.get(
      `http://localhost:8888/api/v1/coin/exchange-rate?symbols=${symbols}`
    );

    dispatch({
      type: GET_EXCHANGE_RATE_SUCCESS,
      payload: response.data,
    });
    console.log("get exchange rate", response.data);
  } catch (error) {
    console.log("error", error);
    dispatch({
      type: GET_EXCHANGE_RATE_FAILURE,
      payload: error.message,
    });
  }
};

export const updateWallet = (body) => async (dispatch) => {
  dispatch({ type: UPDATE_WALLET_REQUEST });

  try {
    // const response = await api.get(`${API_BASE_URL}/watchlist/internal/coins`);
    const response = await axios.post(
      "http://localhost:8088/wallet/update",
      body
    );

    dispatch({
      type: UPDATE_WALLET_SUCCESS,
      payload: response.data,
    });
    console.log("update wallet", response.data);
  } catch (e) {
    console.log("error", e);
    dispatch({ type: UPDATE_WALLET_FAILURE, payload: e.message });
  }
};
