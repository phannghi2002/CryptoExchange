import api, { API_BASE_URL } from "@/config/api";
import {
  TOGGLE_COIN_TO_WATCH_LIST_FAILURE,
  TOGGLE_COIN_TO_WATCH_LIST_REQUEST,
  TOGGLE_COIN_TO_WATCH_LIST_SUCCESS,
  GET_USER_WATCH_LIST_FAILURE,
  GET_USER_WATCH_LIST_REQUEST,
  GET_USER_WATCH_LIST_SUCCESS,
} from "./ActionType";

export const getUserWatchlist = () => async (dispatch) => {
  dispatch({ type: GET_USER_WATCH_LIST_REQUEST });

  try {
    const response = await api.get(`${API_BASE_URL}/watchlist/internal/coins`);

    dispatch({
      type: GET_USER_WATCH_LIST_SUCCESS,
      payload: response.data,
    });
    console.log("user watchlist", response.data);
  } catch (e) {
    console.log("error", e);
    dispatch({ type: GET_USER_WATCH_LIST_FAILURE, payload: e.message });
  }
};

export const toggleToWatchlist = (coinId) => async (dispatch) => {
  dispatch({ type: TOGGLE_COIN_TO_WATCH_LIST_REQUEST });

  console.log("JWT coinID", coinId);
  try {
    const res = await api.post(
      `${API_BASE_URL}/watchlist/toggle?coinId=${coinId}`
    );

    dispatch({
      type: TOGGLE_COIN_TO_WATCH_LIST_SUCCESS,
      payload: res.data,
    });
    console.log("add coin to watchlist", res.data);
  } catch (error) {
    console.log("error", error);
    dispatch({
      type: TOGGLE_COIN_TO_WATCH_LIST_FAILURE,
      payload: error.message,
    });
  }
};
