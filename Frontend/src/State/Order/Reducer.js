import {
  GET_ALL_ORDER_FAILURE,
  GET_ALL_ORDER_REQUEST,
  GET_ALL_ORDER_SUCCESS,
} from "./ActionType";

const initialState = {
  listOrder: [],
  loading: false,
  error: null,
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
      return {
        ...state,
        listOrder: action.payload,
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
