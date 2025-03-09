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

const initialState = {
  balance: {
    VND: 0, // Số dư VND mặc định
    crypto: {}, // Lưu trữ các loại tiền điện tử
  },
  history: [], // Lịch sử giao dịch
  listRate: {},
  loading: false,
  error: null,
};

const walletReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_BALANCE_WALLET_REQUEST:
    case GET_HISTORY_WALLET_FIAT_REQUEST:
    case GET_EXCHANGE_RATE_REQUEST:
    case UPDATE_WALLET_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case GET_BALANCE_WALLET_SUCCESS:
    case UPDATE_WALLET_SUCCESS:
      return {
        ...state,
        balance: {
          VND: action.payload.fiatBalance?.VND || 0, // Đảm bảo có giá trị mặc định
          crypto: { USDT: 0, ...action.payload.cryptoBalance }, // Đảm bảo có USDT với 0 nếu chưa có coin nào
        },
        loading: false,
        error: null,
      };

    case GET_HISTORY_WALLET_FIAT_SUCCESS:
      return {
        ...state,
        history: action.payload,
        loading: false,
        error: null,
      };
    case GET_EXCHANGE_RATE_SUCCESS:
      return {
        ...state,
        listRate: action.payload,
        loading: false,
        error: null,
      };

    case GET_BALANCE_WALLET_FAILURE:
    case GET_HISTORY_WALLET_FIAT_FAILURE:
    case GET_EXCHANGE_RATE_FAILURE:
    case UPDATE_WALLET_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default walletReducer;
