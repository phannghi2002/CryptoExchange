import api, { API_BASE_URL } from "@/config/api";
import {
  GET_ALL_ORDER_REQUEST,
  GET_ALL_ORDER_SUCCESS,
  GET_ALL_ORDER_FAILURE,
  GET_ORDER_TYPE_COIN_REQUEST,
  GET_ORDER_TYPE_COIN_SUCCESS,
  GET_ORDER_TYPE_COIN_FAILURE,
  UPDATE_ORDER_BUY_REQUEST,
  UPDATE_ORDER_BUY_FAILURE,
  UPDATE_ORDER_BUY_SUCCESS,
  CREATE_BANK_REQUEST,
  CREATE_BANK_SUCCESS,
  CREATE_BANK_FAILURE,
  GET_BANK_REQUEST,
  GET_BANK_SUCCESS,
  GET_BANK_FAILURE,
  CREATE_ORDER_FAILURE,
  CREATE_ORDER_SUCCESS,
  CREATE_ORDER_REQUEST,
  GET_PAGINATION_ORDER_REQUEST,
  GET_PAGINATION_ORDER_SUCCESS,
  GET_PAGINATION_ORDER_FAILURE,
  GET_ANOTHER_ORDER_REQUEST,
  GET_ANOTHER_ORDER_SUCCESS,
  GET_ANOTHER_ORDER_FAILURE,
  GET_ORDER_ANOTHER_TYPE_COIN_REQUEST,
  GET_ORDER_ANOTHER_TYPE_COIN_SUCCESS,
  GET_ORDER_ANOTHER_TYPE_COIN_FAILURE,
  GET_ORDER_MY_TYPE_COIN_REQUEST,
  GET_ORDER_MY_TYPE_COIN_SUCCESS,
  GET_ORDER_MY_TYPE_COIN_FAILURE,
  GET_PENDING_ORDER_REQUEST,
  GET_PENDING_ORDER_SUCCESS,
  GET_PENDING_ORDER_FAILURE,
  GET_HISTORY_ORDER_REQUEST,
  GET_HISTORY_ORDER_SUCCESS,
  GET_HISTORY_ORDER_FAILURE,
  CANCEL_ORDER_REQUEST,
  CANCEL_ORDER_SUCCESS,
  CANCEL_ORDER_FAILURE,
  UPDATE_ORDER_RETURN_SUB_ID_BUY_REQUEST,
  UPDATE_ORDER_RETURN_SUB_ID_BUY_SUCCESS,
  UPDATE_ORDER_RETURN_SUB_ID_BUY_FAILURE,
  GET_SINGLE_ORDER_REQUEST,
  GET_SINGLE_ORDER_SUCCESS,
  GET_SINGLE_ORDER_FAILURE,
  UPDATE_STATUS_BANK_TRANSFER_REQUEST,
  UPDATE_STATUS_BANK_TRANSFER_SUCCESS,
  UPDATE_STATUS_BANK_TRANSFER_FAILURE,
  GET_ORDER_NOTIFY_REQUEST,
  GET_ORDER_NOTIFY_SUCCESS,
  GET_ORDER_NOTIFY_FAILURE,
  GET_ORDER_BUYING_REQUEST,
  GET_ORDER_BUYING_SUCCESS,
  GET_ORDER_BUYING_FAILURE,
  GET_MY_ORDER_PENDING_PAGINATION_REQUEST,
  GET_MY_ORDER_PENDING_PAGINATION_SUCCESS,
  GET_MY_ORDER_PENDING_PAGINATION_FAILURE,
} from "./ActionType";

export const getOrderPagination = (userId, page, size) => async (dispatch) => {
  dispatch({ type: GET_PAGINATION_ORDER_REQUEST });

  try {
    const response = await api.get(
      `${API_BASE_URL}/order/getOrderPagination?userId=${userId}&page=${page}&size=${size}`
    );

    dispatch({
      type: GET_PAGINATION_ORDER_SUCCESS,
      payload: response.data,
    });
    console.log("pagination order", response.data);
  } catch (e) {
    console.log("error", e);
    dispatch({ type: GET_PAGINATION_ORDER_FAILURE, payload: e.message });
  }
};

export const getMyOrderPendingPagination =
  (userId, page) => async (dispatch) => {
    dispatch({ type: GET_MY_ORDER_PENDING_PAGINATION_REQUEST });

    try {
      const response = await api.get(
        `${API_BASE_URL}/order/my-order-pending?userId=${userId}&page=${page}`
      );

      dispatch({
        type: GET_MY_ORDER_PENDING_PAGINATION_SUCCESS,
        payload: response.data,
      });
      console.log("GET_MY_ORDER_PENDING_PAGINATION_SUCCESS ", response.data);
    } catch (e) {
      console.log("error", e);
      dispatch({
        type: GET_MY_ORDER_PENDING_PAGINATION_FAILURE,
        payload: e.message,
      });
    }
  };

export const getSingleOrder = (orderId) => async (dispatch) => {
  dispatch({ type: GET_SINGLE_ORDER_REQUEST });

  try {
    const response = await api.get(`${API_BASE_URL}/order/getOrder/${orderId}`);

    dispatch({
      type: GET_SINGLE_ORDER_SUCCESS,
      payload: response.data,
    });
    console.log("single order", response.data);
  } catch (e) {
    console.log("error", e);
    dispatch({ type: GET_SINGLE_ORDER_FAILURE, payload: e.message });
  }
};

export const getAllOrder = () => async (dispatch) => {
  dispatch({ type: GET_ALL_ORDER_REQUEST });

  try {
    const response = await api.get(`${API_BASE_URL}/order/getAllOrder`);

    dispatch({
      type: GET_ALL_ORDER_SUCCESS,
      payload: response.data,
    });
    console.log("all order", response.data);
  } catch (e) {
    console.log("error", e);
    dispatch({ type: GET_ALL_ORDER_FAILURE, payload: e.message });
  }
};

export const getAnotherOrderPending = (userId) => async (dispatch) => {
  dispatch({ type: GET_ANOTHER_ORDER_REQUEST });

  try {
    const response = await api.get(
      `${API_BASE_URL}/order/getAnotherOrderPending/${userId}`
    );

    dispatch({
      type: GET_ANOTHER_ORDER_SUCCESS,
      payload: response.data,
    });
    console.log("all ANOTHER order", response.data);
  } catch (e) {
    console.log("error", e);
    dispatch({ type: GET_ANOTHER_ORDER_FAILURE, payload: e.message });
  }
};

export const getMyOrder = (userId) => async (dispatch) => {
  dispatch({ type: GET_ORDER_MY_TYPE_COIN_REQUEST });

  try {
    const response = await api.get(
      `${API_BASE_URL}/order/getMyOrder/${userId}`
    );

    dispatch({
      type: GET_ORDER_MY_TYPE_COIN_SUCCESS,
      payload: response.data,
    });
    console.log("all MY order", response.data);
  } catch (e) {
    console.log("error", e);
    dispatch({ type: GET_ORDER_MY_TYPE_COIN_FAILURE, payload: e.message });
  }
};

export const getTypeOrder =
  (coin, paymentMethod, price) => async (dispatch) => {
    dispatch({ type: GET_ORDER_TYPE_COIN_REQUEST });

    try {
      const params = new URLSearchParams();

      if (coin) params.append("coin", coin);
      if (paymentMethod) params.append("paymentMethod", paymentMethod);
      if (price && price.trim() !== "") params.append("price", price);

      const response = await api.get(
        `${API_BASE_URL}/order/getOrder?${params.toString()}`
      );

      dispatch({
        type: GET_ORDER_TYPE_COIN_SUCCESS,
        payload: response.data,
      });
    } catch (e) {
      dispatch({ type: GET_ORDER_TYPE_COIN_FAILURE, payload: e.message });
    }
  };

export const getTypeAnotherOrderPending =
  (userId, coin, paymentMethod, price) => async (dispatch) => {
    dispatch({ type: GET_ORDER_ANOTHER_TYPE_COIN_REQUEST });

    try {
      const params = new URLSearchParams();
      if (userId) params.append("userId", userId);
      if (coin) params.append("coin", coin);
      if (paymentMethod) params.append("paymentMethod", paymentMethod);
      if (price && price.trim() !== "") params.append("price", price);

      const response = await api.get(
        `${API_BASE_URL}/order/getAnotherOrderPending?${params.toString()}`
      );

      dispatch({
        type: GET_ORDER_ANOTHER_TYPE_COIN_SUCCESS,
        payload: response.data,
      });
    } catch (e) {
      dispatch({
        type: GET_ORDER_ANOTHER_TYPE_COIN_FAILURE,
        payload: e.message,
      });
    }
  };

export const getPendingOrder = (userId) => async (dispatch) => {
  dispatch({ type: GET_PENDING_ORDER_REQUEST });

  try {
    const response = await api.get(
      `${API_BASE_URL}/order/getOrderPending/${userId}`
    );

    dispatch({
      type: GET_PENDING_ORDER_SUCCESS,
      payload: response.data,
    });
    console.log("all order PENDING", response.data);
  } catch (e) {
    console.log("error", e);
    dispatch({ type: GET_PENDING_ORDER_FAILURE, payload: e.message });
  }
};

export const getHistoryOrder = (userId) => async (dispatch) => {
  dispatch({ type: GET_HISTORY_ORDER_REQUEST });

  try {
    const response = await api.get(
      `${API_BASE_URL}/order/getOrderHistory/${userId}`
    );

    dispatch({
      type: GET_HISTORY_ORDER_SUCCESS,
      payload: response.data,
    });
    console.log("all order HISTORY", response.data);
  } catch (e) {
    console.log("error", e);
    dispatch({ type: GET_HISTORY_ORDER_FAILURE, payload: e.message });
  }
};

export const getOrderBuy = (userId, group) => async (dispatch) => {
  dispatch({ type: GET_ORDER_BUYING_REQUEST });

  try {
    const response = await api.get(
      `${API_BASE_URL}/order/suborder-ids/by-group?userId=${userId}&group=${group}`
    );

    dispatch({
      type: GET_ORDER_BUYING_SUCCESS,
      payload: response.data,
    });
  } catch (e) {
    dispatch({ type: GET_ORDER_BUYING_FAILURE, payload: e.message });
  }
};

export const cancelOrder = (userId) => async (dispatch) => {
  dispatch({ type: CANCEL_ORDER_REQUEST });

  try {
    const response = await api.post(`${API_BASE_URL}/order/cancel/${userId}`);

    dispatch({
      type: CANCEL_ORDER_SUCCESS,
      payload: response.data,
    });

    return response.data;
  } catch (e) {
    dispatch({
      type: CANCEL_ORDER_FAILURE,
      payload: e?.response?.data?.message || e.message,
    });

    throw e; // ⭐ phải THÊM DÒNG NÀY
  }
};

export const updateOrderBuy =
  (orderId, userId, amount, paymentMethod, priceVnd) => async (dispatch) => {
    dispatch({ type: UPDATE_ORDER_BUY_REQUEST });

    console.log("value hien tai", orderId, userId, amount, paymentMethod);

    try {
      const response = await api.put(
        `${API_BASE_URL}/order/updateOrder/${orderId}`,
        {
          buyerId: userId,
          amount: amount,
          paymentMethods: paymentMethod,
          priceVnd: priceVnd,
        }
      );

      dispatch({
        type: UPDATE_ORDER_BUY_SUCCESS,
        payload: response.data,
      });
    } catch (e) {
      dispatch({ type: UPDATE_ORDER_BUY_FAILURE, payload: e.message });
    }
  };

export const updateOrderReturnSubIdBuy =
  (orderId, userId, amount, paymentMethod, priceVnd) => async (dispatch) => {
    dispatch({ type: UPDATE_ORDER_RETURN_SUB_ID_BUY_REQUEST });

    console.log("value hien tai", orderId, userId, amount, paymentMethod);

    try {
      const response = await api.put(
        `${API_BASE_URL}/order/updateOrderReturnSubId/${orderId}`,
        {
          buyerId: userId,
          amount: amount,
          paymentMethods: paymentMethod,
          priceVnd,
        }
      );

      dispatch({
        type: UPDATE_ORDER_RETURN_SUB_ID_BUY_SUCCESS,
        payload: response.data,
      });
    } catch (e) {
      dispatch({
        type: UPDATE_ORDER_RETURN_SUB_ID_BUY_FAILURE,
        payload: e.message,
      });
    }
  };

export const updateStatusOfBankTransfer =
  (orderId, subOrderId, status) => async (dispatch) => {
    dispatch({ type: UPDATE_STATUS_BANK_TRANSFER_REQUEST });

    console.log("value hien tai", orderId, subOrderId);

    try {
      const response = await api.put(
        `${API_BASE_URL}/order/updateStatusOfBankTransfer?orderId=${orderId}&subOrderId=${subOrderId}&status=${status}`
      );

      dispatch({
        type: UPDATE_STATUS_BANK_TRANSFER_SUCCESS,
        payload: response.data,
      });
    } catch (e) {
      dispatch({
        type: UPDATE_STATUS_BANK_TRANSFER_FAILURE,
        payload: e.message,
      });
    }
  };

export const getOrderNotify = (orderId, subOrderId) => async (dispatch) => {
  dispatch({ type: GET_ORDER_NOTIFY_REQUEST });

  try {
    const response = await api.get(
      `${API_BASE_URL}/order/${orderId}/suborders/${subOrderId}`
    );

    dispatch({
      type: GET_ORDER_NOTIFY_SUCCESS,
      payload: response.data,
    });
    console.log("all order notify", response.data);
  } catch (e) {
    console.log("error", e);
    dispatch({ type: GET_ORDER_NOTIFY_FAILURE, payload: e.message });
  }
};

export const createBank = (body) => async (dispatch) => {
  dispatch({ type: CREATE_BANK_REQUEST });

  console.log("value hien tai", body);

  try {
    const response = await api.post(`${API_BASE_URL}/order/create-bank`, body);

    dispatch({
      type: CREATE_BANK_SUCCESS,
      payload: response.data,
    });
  } catch (e) {
    dispatch({ type: CREATE_BANK_FAILURE, payload: e.message });
  }
};

export const createOrder = (body) => async (dispatch) => {
  dispatch({ type: CREATE_ORDER_REQUEST });

  console.log("value hien tai", body);

  try {
    const response = await api.post(`${API_BASE_URL}/order/create`, body);

    dispatch({
      type: CREATE_ORDER_SUCCESS,
      payload: response.data,
    });
  } catch (e) {
    dispatch({ type: CREATE_ORDER_FAILURE, payload: e.message });
  }
};

export const getBank = (userId) => async (dispatch) => {
  dispatch({ type: GET_BANK_REQUEST });

  console.log("value hien tai", userId);

  try {
    const response = await api.get(`${API_BASE_URL}/order/get-bank/${userId}`);

    dispatch({
      type: GET_BANK_SUCCESS,
      payload: response.data,
    });
  } catch (e) {
    dispatch({ type: GET_BANK_FAILURE, payload: e.message });
  }
};
