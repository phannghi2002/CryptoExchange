import {
  GET_ALL_ORDER_REQUEST,
  GET_ALL_ORDER_SUCCESS,
  GET_ALL_ORDER_FAILURE,
} from "./ActionType";
import axios from "axios";

export const getAllOrder = () => async (dispatch) => {
  dispatch({ type: GET_ALL_ORDER_REQUEST });

  try {
    const response = await axios.get(`http://localhost:8090/order/getAllOrder`);

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
