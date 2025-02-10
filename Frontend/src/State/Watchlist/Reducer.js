import { existInWatchlist } from "@/utils/existInWatchlist";
import {
  GET_USER_WATCH_LIST_REQUEST,
  GET_USER_WATCH_LIST_SUCCESS,
  GET_USER_WATCH_LIST_FAILURE,
  TOGGLE_COIN_TO_WATCH_LIST_REQUEST,
  TOGGLE_COIN_TO_WATCH_LIST_SUCCESS,
  TOGGLE_COIN_TO_WATCH_LIST_FAILURE,
} from "./ActionType";

// const initialState = {
//   watchlist: [],
//   loading: false,
//   error: null,
//   items: [],
// };

// const watchlistReducer = (state = initialState, action) => {
//   switch (action.type) {
//     case GET_USER_WATCH_LIST_REQUEST:
//     case TOGGLE_COIN_TO_WATCH_LIST_REQUEST:
//       return {
//         ...state,
//         loading: true,
//         error: null,
//       };

//     case GET_USER_WATCH_LIST_SUCCESS:
//       return {
//         ...state,
//         watchlist: action.payload,
//         loading: false,
//         error: null,
//       };

//     case TOGGLE_COIN_TO_WATCH_LIST_SUCCESS: {
//       let updatedItems = existInWatchlist(state.watchlist, action.payload)
//         ? state.items.filter((item) => item.id !== action.payload.id)
//         : [action.payload, ...state.items];
//       return {
//         ...state,
//         items: updatedItems,
//         loading: false,
//         error: null,
//       };
//     }

//     case GET_USER_WATCH_LIST_FAILURE:
//     case TOGGLE_COIN_TO_WATCH_LIST_FAILURE:
//       return {
//         ...state,
//         loading: false,
//         error: action.payload,
//       };
//     default:
//       return state;
//   }
// };

const initialState = {
  watchlist: [],
  loading: false,
  error: null,
};

const watchlistReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_USER_WATCH_LIST_REQUEST:
    case TOGGLE_COIN_TO_WATCH_LIST_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case GET_USER_WATCH_LIST_SUCCESS:
      return {
        ...state,
        watchlist: action.payload,
        loading: false,
        error: null,
      };

    case TOGGLE_COIN_TO_WATCH_LIST_SUCCESS: {
      const updatedWatchlist = state.watchlist.find(
        (item) => item.id === action.payload.id
      )
        ? state.watchlist.filter((item) => item.id !== action.payload.id)
        : [...state.watchlist, action.payload];

      return {
        ...state,
        watchlist: updatedWatchlist,
      };
    }

    case GET_USER_WATCH_LIST_FAILURE:
    case TOGGLE_COIN_TO_WATCH_LIST_FAILURE:
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
