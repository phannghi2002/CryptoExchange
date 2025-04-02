// import api, { API_BASE_URL } from "@/config/api";
import api, { API_BASE_URL } from "@/config/api";
import {
  CREATE_TRANSACTION_ORDER_LIMIT_FAILURE,
  CREATE_TRANSACTION_ORDER_LIMIT_REQUEST,
  CREATE_TRANSACTION_ORDER_LIMIT_SUCCESS,
  GET_ALL_STATUS_ANOTHER_PENDING_TRANSACTION_ORDER_LIMIT_FAILURE,
  GET_ALL_STATUS_ANOTHER_PENDING_TRANSACTION_ORDER_LIMIT_REQUEST,
  GET_ALL_STATUS_ANOTHER_PENDING_TRANSACTION_ORDER_LIMIT_SUCCESS,
  GET_ALL_STATUS_PENDING_TRANSACTION_ORDER_LIMIT_FAILURE,
  GET_ALL_STATUS_PENDING_TRANSACTION_ORDER_LIMIT_REQUEST,
  GET_ALL_STATUS_PENDING_TRANSACTION_ORDER_LIMIT_SUCCESS,
  GET_ALL_TRANSACTION_SWAP_COIN_FAILURE,
  GET_ALL_TRANSACTION_SWAP_COIN_REQUEST,
  GET_ALL_TRANSACTION_SWAP_COIN_SUCCESS,
  SAVE_TRANSACTION_SWAP_COIN_FAILURE,
  SAVE_TRANSACTION_SWAP_COIN_REQUEST,
  SAVE_TRANSACTION_SWAP_COIN_SUCCESS,
  UPDATE_TRANSACTION_ORDER_LIMIT_FAILURE,
  UPDATE_TRANSACTION_ORDER_LIMIT_REQUEST,
  UPDATE_TRANSACTION_ORDER_LIMIT_SUCCESS,
} from "./ActionType";
import axios from "axios";

// export const createTransactionSwap = (body) => async (dispatch) => {
//   dispatch({ type: SAVE_TRANSACTION_SWAP_COIN_REQUEST });

//   try {
//     // const response = await api.get(`${API_BASE_URL}/watchlist/internal/coins`);
//     const response = await axios.post(
//       "http://localhost:8089/transaction/swap/save",
//       body
//     );

//     dispatch({
//       type: SAVE_TRANSACTION_SWAP_COIN_SUCCESS,
//       payload: response.data,
//     });
//     console.log("transaction swap", response.data);
//   } catch (e) {
//     console.log("error", e);
//     dispatch({ type: SAVE_TRANSACTION_SWAP_COIN_FAILURE, payload: e.message });
//   }
// };

// export const getHistoryTransactionSwap = (userId) => async (dispatch) => {
//   dispatch({ type: GET_ALL_TRANSACTION_SWAP_COIN_REQUEST });

//   try {
//     const response = await axios.get(
//       `http://localhost:8089/transaction/swap/get/${userId}`
//     );

//     dispatch({
//       type: GET_ALL_TRANSACTION_SWAP_COIN_SUCCESS,
//       payload: response.data,
//     });
//     console.log("get history transaction swap ", response.data);
//   } catch (error) {
//     console.log("error", error);
//     dispatch({
//       type: GET_ALL_TRANSACTION_SWAP_COIN_FAILURE,
//       payload: error.message,
//     });
//   }
// };

export const createTransactionSwap = (body) => async (dispatch) => {
  dispatch({ type: SAVE_TRANSACTION_SWAP_COIN_REQUEST });

  try {
    // const response = await api.get(`${API_BASE_URL}/watchlist/internal/coins`);
    const response = await api.post(
      `${API_BASE_URL}/transaction/swap/save`,
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
    const response = await api.get(
      `${API_BASE_URL}/transaction/swap/get/${userId}`
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

export const createTransactionSwapOrderLimit = (body) => async (dispatch) => {
  dispatch({ type: CREATE_TRANSACTION_ORDER_LIMIT_REQUEST });

  try {
    // const response = await api.get(`${API_BASE_URL}/watchlist/internal/coins`);
    const response = await api.post(
      `${API_BASE_URL}/transaction/swap-order-limit/save`,
      body
    );

    dispatch({
      type: CREATE_TRANSACTION_ORDER_LIMIT_SUCCESS,
      payload: response.data,
    });
    console.log("transaction swap order limit", response.data);
  } catch (e) {
    console.log("error", e);
    dispatch({
      type: CREATE_TRANSACTION_ORDER_LIMIT_FAILURE,
      payload: e.message,
    });
  }
};

export const getAllOpenOrderTransactionSwapOrderLimit =
  (userId) => async (dispatch) => {
    dispatch({ type: GET_ALL_STATUS_PENDING_TRANSACTION_ORDER_LIMIT_REQUEST });

    try {
      const response = await api.get(
        `${API_BASE_URL}/transaction/swap-order-limit/get-all-status-pending/${userId}`
      );

      dispatch({
        type: GET_ALL_STATUS_PENDING_TRANSACTION_ORDER_LIMIT_SUCCESS,
        payload: response.data,
      });
      console.log("transaction swap order limit", response.data);
    } catch (e) {
      console.log("error", e);
      dispatch({
        type: GET_ALL_STATUS_PENDING_TRANSACTION_ORDER_LIMIT_FAILURE,
        payload: e.message,
      });
    }
  };

export const getAllAnotherStatusPendingSwapOrderLimit =
  (userId) => async (dispatch) => {
    dispatch({
      type: GET_ALL_STATUS_ANOTHER_PENDING_TRANSACTION_ORDER_LIMIT_REQUEST,
    });

    try {
      const response = await api.get(
        `${API_BASE_URL}/transaction/swap-order-limit/get-all-status-another-pending/${userId}`
      );

      dispatch({
        type: GET_ALL_STATUS_ANOTHER_PENDING_TRANSACTION_ORDER_LIMIT_SUCCESS,
        payload: response.data,
      });
      console.log("no co chay ham nay khong", response.data);
    } catch (e) {
      console.log("error", e);
      dispatch({
        type: GET_ALL_STATUS_ANOTHER_PENDING_TRANSACTION_ORDER_LIMIT_FAILURE,
        payload: e.message,
      });
    }
  };

export const updateTransactionSwapOrderLimit =
  (status, transactionId) => async (dispatch) => {
    dispatch({ type: UPDATE_TRANSACTION_ORDER_LIMIT_REQUEST });

    try {
      const response = await api.put(
        `${API_BASE_URL}/transaction/swap-order-limit/update/${transactionId}`,
        { status }
      );

      dispatch({
        type: UPDATE_TRANSACTION_ORDER_LIMIT_SUCCESS,
        payload: response.data,
      });
      console.log("transaction swap order limit", response.data);
    } catch (e) {
      console.log("error", e);
      dispatch({
        type: UPDATE_TRANSACTION_ORDER_LIMIT_FAILURE,
        payload: e.message,
      });
    }
  };
