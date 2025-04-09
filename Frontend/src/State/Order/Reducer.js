import {
  CREATE_BANK_SUCCESS,
  CREATE_ORDER_SUCCESS,
  GET_ALL_ORDER_FAILURE,
  GET_ALL_ORDER_REQUEST,
  GET_ALL_ORDER_SUCCESS,
  GET_ANOTHER_ORDER_SUCCESS,
  GET_BANK_SUCCESS,
  GET_HISTORY_ORDER_SUCCESS,
  GET_MY_ORDER_PENDING_PAGINATION_SUCCESS,
  GET_ORDER_ANOTHER_TYPE_COIN_SUCCESS,
  GET_ORDER_BUYING_SUCCESS,
  GET_ORDER_HISTORY_BUY_SUCCESS,
  GET_ORDER_MY_TYPE_COIN_SUCCESS,
  GET_ORDER_NOTIFY_SUCCESS,
  GET_ORDER_TYPE_COIN_SUCCESS,
  GET_PAGINATION_ORDER_SUCCESS,
  GET_PENDING_ORDER_SUCCESS,
  GET_SINGLE_ORDER_SUCCESS,
  UPDATE_ORDER_BUY_SUCCESS,
  UPDATE_ORDER_RETURN_SUB_ID_BUY_SUCCESS,
  UPDATE_STATUS_BANK_TRANSFER_SUCCESS,
} from "./ActionType";

const initialState = {
  listOrder: [],
  pendingOrder: [],
  historyOrder: [],
  loading: false,
  error: null,
  bank: null,
  totalPages: null,
  subOrderId: null,
  order: null,
  orderNotify: null,
  orderBuy: [],
  pendingOrderPagination: [],
  totalPagesPending: null,
};

const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_ORDER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case GET_ALL_ORDER_SUCCESS:
    case GET_ANOTHER_ORDER_SUCCESS:
    case GET_ORDER_TYPE_COIN_SUCCESS:
    case GET_ORDER_ANOTHER_TYPE_COIN_SUCCESS:
    case GET_ORDER_MY_TYPE_COIN_SUCCESS:
      return {
        ...state,
        listOrder: action.payload,
        loading: false,
        error: null,
      };
    case GET_SINGLE_ORDER_SUCCESS:
      return {
        ...state,
        order: action.payload,
        loadind: false,
        error: null,
      };

    case GET_PENDING_ORDER_SUCCESS:
      return {
        ...state,
        pendingOrder: action.payload,
        loading: false,
        error: null,
      };

    case GET_HISTORY_ORDER_SUCCESS:
      return {
        ...state,
        historyOrder: action.payload,
        loading: false,
        error: null,
      };

    case GET_PAGINATION_ORDER_SUCCESS:
      return {
        ...state,
        listOrder: action.payload.content,
        totalPages: action.payload.totalPages,
        loading: false,
        error: null,
      };

    case GET_MY_ORDER_PENDING_PAGINATION_SUCCESS:
      return {
        ...state,
        pendingOrderPagination: action.payload.content,
        totalPagesPending: action.payload.totalPages,
        loading: false,
        error: null,
      };
    case GET_ORDER_NOTIFY_SUCCESS:
      return {
        ...state,
        orderNotify: action.payload,
        loading: false,
        error: null,
      };

    case UPDATE_ORDER_BUY_SUCCESS:
    case UPDATE_STATUS_BANK_TRANSFER_SUCCESS:
      return {
        ...state,
        listOrder: state.listOrder.map((order) =>
          order.id === action.payload.id ? action.payload : order
        ),
        loading: false,
        error: null,
      };

    case UPDATE_ORDER_RETURN_SUB_ID_BUY_SUCCESS:
      return {
        ...state,
        subOrderId: action.payload,
        loading: false,
        error: null,
      };
    case CREATE_ORDER_SUCCESS:
      return {
        ...state,
        listOrder: [...state.listOrder, action.payload],
        loading: false,
        error: null,
      };

    case CREATE_BANK_SUCCESS:
    case GET_BANK_SUCCESS: {
      return {
        ...state,
        bank: action.payload,
        loading: false,
        error: null,
      };
    }
    case GET_ORDER_BUYING_SUCCESS:
      return {
        ...state,
        orderBuy: action.payload,
        loading: false,
        error: null,
      };

    case GET_ALL_ORDER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default orderReducer;
