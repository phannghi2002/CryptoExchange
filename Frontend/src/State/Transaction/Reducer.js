import {
  GET_ALL_TRANSACTION_SWAP_COIN_FAILURE,
  GET_ALL_TRANSACTION_SWAP_COIN_REQUEST,
  GET_ALL_TRANSACTION_SWAP_COIN_SUCCESS,
  SAVE_TRANSACTION_SWAP_COIN_FAILURE,
  SAVE_TRANSACTION_SWAP_COIN_REQUEST,
  SAVE_TRANSACTION_SWAP_COIN_SUCCESS,
} from "./ActionType";

const initialState = {
  historySwap: [],
  loading: false,
  error: null,
};

const transactionReducer = (state = initialState, action) => {
  switch (action.type) {
    case SAVE_TRANSACTION_SWAP_COIN_REQUEST:
    case GET_ALL_TRANSACTION_SWAP_COIN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_ALL_TRANSACTION_SWAP_COIN_SUCCESS:
      return {
        ...state,
        historySwap: action.payload, // Đảm bảo payload là array
        loading: false,
        error: null,
      };

    case SAVE_TRANSACTION_SWAP_COIN_SUCCESS:
      return {
        ...state,
        historySwap: Array.isArray(state.historySwap)
          ? [action.payload, ...state.historySwap] // Thêm giao dịch mới vào danh sách cũ
          : [action.payload], // Nếu state ban đầu không phải array, khởi tạo mới
        loading: false,
        error: null,
      };

    case SAVE_TRANSACTION_SWAP_COIN_FAILURE:
    case GET_ALL_TRANSACTION_SWAP_COIN_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default transactionReducer;
