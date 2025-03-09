// import api, { API_BASE_URL } from "@/config/api";
import {
  GET_ALL_TRANSACTION_SWAP_COIN_FAILURE,
  GET_ALL_TRANSACTION_SWAP_COIN_REQUEST,
  GET_ALL_TRANSACTION_SWAP_COIN_SUCCESS,
  SAVE_TRANSACTION_SWAP_COIN_FAILURE,
  SAVE_TRANSACTION_SWAP_COIN_REQUEST,
  SAVE_TRANSACTION_SWAP_COIN_SUCCESS,
} from "./ActionType";
import axios from "axios";

export const createTransactionSwap = (body) => async (dispatch) => {
  dispatch({ type: SAVE_TRANSACTION_SWAP_COIN_REQUEST });

  try {
    // const response = await api.get(`${API_BASE_URL}/watchlist/internal/coins`);
    const response = await axios.post(
      "http://localhost:8089/transaction/swap/save",
      body
    );

    dispatch({
      type: SAVE_TRANSACTION_SWAP_COIN_SUCCESS,
      payload: response.data,
    });
    console.log("transaction swap", response.data);
  } catch (e) {
    console.log("error", e);
    dispatch({ type: SAVE_TRANSACTION_SWAP_COIN_FAILURE, payload: e.message });
  }
};

export const getHistoryTransactionSwap = (userId) => async (dispatch) => {
  dispatch({ type: GET_ALL_TRANSACTION_SWAP_COIN_REQUEST });

  try {
    // const res = await api.post(
    //   `${API_BASE_URL}/watchlist/toggle?coinId=${coinId}`
    // );
    const response = await axios.get(
      `http://localhost:8089/transaction/swap/get/${userId}`
    );

    dispatch({
      type: GET_ALL_TRANSACTION_SWAP_COIN_SUCCESS,
      payload: response.data,
    });
    console.log("get history transaction swap ", response.data);
  } catch (error) {
    console.log("error", error);
    dispatch({
      type: GET_ALL_TRANSACTION_SWAP_COIN_FAILURE,
      payload: error.message,
    });
  }
};
