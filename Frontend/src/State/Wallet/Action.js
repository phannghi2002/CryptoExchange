// import api, { API_BASE_URL } from "@/config/api";
import api, { API_BASE_URL } from "@/config/api";
import {
  ADD_COIN_WALLET_FAILURE,
  ADD_COIN_WALLET_REQUEST,
  ADD_COIN_WALLET_SUCCESS,
  GET_BALANCE_WALLET_FAILURE,
  GET_BALANCE_WALLET_REQUEST,
  GET_BALANCE_WALLET_SUCCESS,
  GET_EXCHANGE_RATE_FAILURE,
  GET_EXCHANGE_RATE_REQUEST,
  GET_EXCHANGE_RATE_SUCCESS,
  GET_HISTORY_WALLET_FIAT_FAILURE,
  GET_HISTORY_WALLET_FIAT_REQUEST,
  GET_HISTORY_WALLET_FIAT_SUCCESS,
  SUBSTRACT_COIN_WALLET_FAILURE,
  SUBSTRACT_COIN_WALLET_REQUEST,
  SUBSTRACT_COIN_WALLET_SUCCESS,
  UPDATE_WALLET_BUY_FAILURE,
  UPDATE_WALLET_BUY_REQUEST,
  UPDATE_WALLET_BUY_SUCCESS,
  UPDATE_WALLET_FAILURE,
  UPDATE_WALLET_REQUEST,
  UPDATE_WALLET_SUCCESS,
} from "./ActionType";

export const getBalanceWallet = (userId) => async (dispatch) => {
  dispatch({ type: GET_BALANCE_WALLET_REQUEST });

  try {
    const response = await api.get(
      `${API_BASE_URL}/wallet/getWallet?userID=${userId}`
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

export const getHistoryWalletFiat = (userId) => async (dispatch) => {
  dispatch({ type: GET_HISTORY_WALLET_FIAT_REQUEST });

  try {
    const response = await api.get(
      `${API_BASE_URL}/payment/transaction?userId=${userId}`
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
    const response = await api.get(
      `${API_BASE_URL}/coin/exchange-rate?symbols=${symbols}`
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
    const response = await api.post(`${API_BASE_URL}/wallet/update`, body);

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

export const updateBuyWallet = (body) => async (dispatch) => {
  dispatch({ type: UPDATE_WALLET_BUY_REQUEST });

  try {
    // const response = await api.get(`${API_BASE_URL}/watchlist/internal/coins`);
    const response = await api.post(`${API_BASE_URL}/wallet/updateTrade`, body);

    dispatch({
      type: UPDATE_WALLET_BUY_SUCCESS,
      payload: response.data,
    });
    console.log("update wallet", response.data);
  } catch (e) {
    console.log("error", e);
    dispatch({ type: UPDATE_WALLET_BUY_FAILURE, payload: e.message });
  }
};
export const substractCoinWallet = (userId, body) => async (dispatch) => {
  dispatch({ type: SUBSTRACT_COIN_WALLET_REQUEST });

  try {
    const response = await api.put(
      `${API_BASE_URL}/wallet/substract-coin/${userId}`,
      body
    );

    dispatch({
      type: SUBSTRACT_COIN_WALLET_SUCCESS,
      payload: response.data,
    });
    console.log("update wallet", response.data);
  } catch (e) {
    console.log("error", e);
    dispatch({ type: SUBSTRACT_COIN_WALLET_FAILURE, payload: e.message });
  }
};

export const returnCoinWallet = (userId, body) => async (dispatch) => {
  dispatch({ type: ADD_COIN_WALLET_REQUEST });

  try {
    const response = await api.put(
      `${API_BASE_URL}/wallet/add-coin/${userId}`,
      body
    );

    dispatch({
      type: ADD_COIN_WALLET_SUCCESS,
      payload: response.data,
    });
    console.log("update wallet", response.data);
  } catch (e) {
    console.log("error", e);
    dispatch({ type: ADD_COIN_WALLET_FAILURE, payload: e.message });
  }
};
