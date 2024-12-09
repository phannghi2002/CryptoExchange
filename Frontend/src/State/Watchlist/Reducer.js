import { existInWatchlist } from "@/utils/existInWatchlist";
import {
  GET_USER_WATCH_LIST_REQUEST,
  ADD_COIN_TO_WATCH_LIST_REQUEST,
  GET_USER_WATCH_LIST_SUCCESS,
  ADD_COIN_TO_WATCH_LIST_SUCCESS,
  GET_USER_WATCH_LIST_FAILURE,
  ADD_COIN_TO_WATCH_LIST_FAILURE,
} from "./ActionType";

const initialState = {
  watchlist: null,
  loading: false,
  error: null,
  items: [],
};

const watchlistReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_USER_WATCH_LIST_REQUEST:
    case ADD_COIN_TO_WATCH_LIST_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case GET_USER_WATCH_LIST_SUCCESS:
      return {
        ...state,
        watchlist: action.payload,
        items: action.payload.coins,
        loading: false,
        error: null,
      };

    case ADD_COIN_TO_WATCH_LIST_SUCCESS: {
      let updatedItems = existInWatchlist(state.items, action.payload)
        ? state.items.filter((item) => item.id !== action.payload.id)
        : [action.payload, ...state.items];
      return {
        ...state,
        items: updatedItems,
        loading: false,
        error: null,
      };
    }

    case GET_USER_WATCH_LIST_FAILURE:
    case ADD_COIN_TO_WATCH_LIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default watchlistReducer;
