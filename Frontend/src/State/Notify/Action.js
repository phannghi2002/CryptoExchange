import api, { API_BASE_URL } from "@/config/api";
import {
  DELETE_NOTIFY_FAILURE,
  DELETE_NOTIFY_READ_HANDLED_FAILURE,
  DELETE_NOTIFY_READ_HANDLED_REQUEST,
  DELETE_NOTIFY_READ_HANDLED_SUCCESS,
  DELETE_NOTIFY_REQUEST,
  DELETE_NOTIFY_SUCCESS,
  GET_NOTIFY_USER_FAILURE,
  GET_NOTIFY_USER_REQUEST,
  GET_NOTIFY_USER_SUCCESS,
  PUT_NOTIFY_CONVERT_READ_USER_FAILURE,
  PUT_NOTIFY_CONVERT_READ_USER_REQUEST,
  PUT_NOTIFY_CONVERT_READ_USER_SUCCESS,
  PUT_NOTIFY__CONVERT_HANDLE_FAILURE,
  PUT_NOTIFY__CONVERT_HANDLE_REQUEST,
  PUT_NOTIFY__CONVERT_HANDLE_SUCCESS,
} from "./ActionType";

export const getNotifyUser = (userId) => async (dispatch) => {
  dispatch({ type: GET_NOTIFY_USER_REQUEST });

  try {
    const response = await api.get(
      `${API_BASE_URL}/notification/user/${userId}`
    );

    dispatch({
      type: GET_NOTIFY_USER_SUCCESS,
      payload: response.data,
    });
    console.log("user notify h3h3h3h3", response.data);
  } catch (e) {
    console.log("error", e);
    dispatch({ type: GET_NOTIFY_USER_FAILURE, payload: e.message });
  }
};

export const putNotifyConvertRead = (notifyId) => async (dispatch) => {
  dispatch({ type: PUT_NOTIFY_CONVERT_READ_USER_REQUEST });

  console.log("JWT PUT_NOTIFY_CONVERT_READ_USER_REQUEST", notifyId);
  try {
    const res = await api.put(`${API_BASE_URL}/notification/${notifyId}/read`);

    dispatch({
      type: PUT_NOTIFY_CONVERT_READ_USER_SUCCESS,
      payload: res.data,
    });
    console.log(" PUT_NOTIFY_CONVERT_READ_USER_SUCCESS", res.data);
  } catch (error) {
    console.log("error", error);
    dispatch({
      type: PUT_NOTIFY_CONVERT_READ_USER_FAILURE,
      payload: error.message,
    });
  }
};

export const putNotifyConverHandle = (notifyId) => async (dispatch) => {
  dispatch({ type: PUT_NOTIFY__CONVERT_HANDLE_REQUEST });

  console.log("PUT_NOTIFY__CONVERT_HANDLE_REQUEST", notifyId);
  try {
    const res = await api.put(
      `${API_BASE_URL}/notification/${notifyId}/handle-notify`
    );

    dispatch({
      type: PUT_NOTIFY__CONVERT_HANDLE_SUCCESS,
      payload: res.data,
    });
    console.log(" PUT_NOTIFY__CONVERT_HANDLE_SUCCESS", res.data);
  } catch (error) {
    console.log("error", error);
    dispatch({
      type: PUT_NOTIFY__CONVERT_HANDLE_FAILURE,
      payload: error.message,
    });
  }
};

export const deleteNotify = (notifyId) => async (dispatch) => {
  dispatch({ type: DELETE_NOTIFY_REQUEST });

  try {
    const response = await api.delete(
      `${API_BASE_URL}/notification/${notifyId}`
    );

    dispatch({
      type: DELETE_NOTIFY_SUCCESS,
      payload: response.data,
    });
    console.log("delete notify", response.data);
  } catch (e) {
    console.log("error", e);
    dispatch({ type: DELETE_NOTIFY_FAILURE, payload: e.message });
  }
};

export const deleteNotifyReadHandled = (userId) => async (dispatch) => {
  dispatch({ type: DELETE_NOTIFY_READ_HANDLED_REQUEST });

  try {
    const response = await api.delete(
      `${API_BASE_URL}/notification/user/${userId}/read-handled`
    );

    dispatch({
      type: DELETE_NOTIFY_READ_HANDLED_SUCCESS,
      payload: response.data,
    });
    console.log("delete notify read handled", response.data);

    return Promise.resolve({ payload: response.data }); //  trả về promise rõ ràng thì bên gọi dispatch mới lấy giá trị được
  } catch (e) {
    console.log("error", e);
    dispatch({ type: DELETE_NOTIFY_READ_HANDLED_FAILURE, payload: e.message });
    return Promise.resolve({ error: e.message }); //  trả về lỗi cũng dưới dạng promise
  }
};
