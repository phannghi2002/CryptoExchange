import api from "@/config/api";
import {
  ADD_COIN_TO_WATCH_LIST_FAILURE,
  ADD_COIN_TO_WATCH_LIST_REQUEST,
  ADD_COIN_TO_WATCH_LIST_SUCCESS,
  GET_USER_WATCH_LIST_FAILURE,
  GET_USER_WATCH_LIST_REQUEST,
  GET_USER_WATCH_LIST_SUCCESS,
} from "./ActionType";

export const getUserWatchlist = () => async (dispatch) => {
  dispatch({ type: GET_USER_WATCH_LIST_REQUEST });

  try {
    const res = await api.get("/api/watchlist/user");

    dispatch({
      type: GET_USER_WATCH_LIST_SUCCESS,
      payload: res.data,
    });
    console.log("user watchlist", res.data);
  } catch (e) {
    console.log("error", e);
    dispatch({ type: GET_USER_WATCH_LIST_FAILURE, payload: e.message });
  }
};

export const addItemToWatchlist = (coinId) => async (dispatch) => {
  dispatch({ type: ADD_COIN_TO_WATCH_LIST_REQUEST });

  console.log("JWT coinID", coinId);
  try {
    const res = await api.put(`/api/watchlist/add/coin/${coinId}`);

    dispatch({
      type: ADD_COIN_TO_WATCH_LIST_SUCCESS,
      payload: res.data,
    });
    console.log("add coin to watchlist", res.data);
  } catch (error) {
    console.log("error", error);
    dispatch({
      type: ADD_COIN_TO_WATCH_LIST_FAILURE,
      payload: error.message,
    });
  }
};

// export const addItemToWatchlist1 = (jwt, coinId) => async (dispatch) => {
//   dispatch({ type: GET_USER_WATCH_LIST_REQUEST });

//   try {
//     const res = await api.get(
//       "/api/watchlist/user",
//       {},
//       {
//         headers: {
//           Authorization: `Bearer ${jwt}`,
//         },
//       }
//     );

//     dispatch({
//       type: GET_USER_WATCH_LIST_SUCCESS,
//       payload: res.data,
//     });
//     console.log("user watchlist", res.data);
//   } catch (e) {
//     console.log("error", e);
//     dispatch({ type: GET_USER_WATCH_LIST_FAILURE, payload: e.message });
//   }
// };
