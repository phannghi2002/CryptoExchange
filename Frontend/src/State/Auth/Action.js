import axios from "axios";
import {
  CHANGE_PASSWORD_OLD_FAILURE,
  CHANGE_PASSWORD_OLD_REQUEST,
  CHANGE_PASSWORD_OLD_SUCCESS,
  CHECK_OTP_FAILURE,
  CHECK_OTP_REQUEST,
  CHECK_OTP_SUCCESS,
  CLEAR_ERROR,
  ENABLE_TWO_STEP_AUTHENTICATION_OAUTH_USER_FAILURE,
  ENABLE_TWO_STEP_AUTHENTICATION_OAUTH_USER_REQUEST,
  ENABLE_TWO_STEP_AUTHENTICATION_OAUTH_USER_SUCCESS,
  ENABLE_TWO_STEP_AUTHENTICATION_USER_FAILURE,
  ENABLE_TWO_STEP_AUTHENTICATION_USER_REQUEST,
  ENABLE_TWO_STEP_AUTHENTICATION_USER_SUCCESS,
  FORGOT_PASSWORD_FAILURE,
  FORGOT_PASSWORD_REQUEST,
  FORGOT_PASSWORD_SUCCESS,
  GET_EMAIL_SUCCESS,
  GET_USER_FAILURE,
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
  REGISTER_FAILURE,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  SEND_EMAIL_FAILURE,
  SEND_EMAIL_REQUEST,
  SEND_EMAIL_SUCCESS,
  SEND_EMAIL_TWO_AUTH_FAILURE,
  SEND_EMAIL_TWO_AUTH_REQUEST,
  SEND_EMAIL_TWO_AUTH_SUCCESS,
  SINGIN_GG_FAILURE,
  SINGIN_GG_REQUEST,
  SINGIN_GG_SUCCESS,
  UPDATE_PASSWORD_FAILURE,
  UPDATE_PASSWORD_REQUEST,
  UPDATE_PASSWORD_SUCCESS,
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
} from "./ActionType";
import api, { API_BASE_URL } from "@/config/api";

export const register = (userData) => async (dispatch) => {
  dispatch({ type: REGISTER_REQUEST });

  try {
    const response = await axios.post(
      `${API_BASE_URL}/identity/users/registration`,
      userData
    );
    const data = response.data.result;
    console.log(data);

    dispatch({ type: REGISTER_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: REGISTER_FAILURE, payload: error.response.data.message });

    console.log(error.response.data.message);
  }
};

export const login = (userData) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });
  console.log("in ra t xem nao", userData);

  try {
    const response = await axios.post(
      `${API_BASE_URL}/identity/auth/token`,
      userData.data
    );
    const jwt = response.data.result.token;
    console.log("thang nay nos ngao r anh em oiw", response.data);

    dispatch({ type: LOGIN_SUCCESS, payload: jwt });
    localStorage.setItem("jwt", jwt);
    localStorage.setItem("twoAuth", response.data.result.twoAuth);
    userData.navigate("/overview");
    return response.data;
  } catch (error) {
    console.log("error", error);
    dispatch({ type: LOGIN_FAILURE, payload: error.response.data.message });

    return error.response.data;
  }
};

export const getUser = () => async (dispatch) => {
  dispatch({ type: GET_USER_REQUEST });

  try {
    const response = await api.get(`${API_BASE_URL}/profile/my-info`);
    const user = response.data;
    console.log(user);

    dispatch({ type: GET_USER_SUCCESS, payload: user });
  } catch (error) {
    dispatch({ type: GET_USER_FAILURE, payload: error.message });

    console.log(error);
  }
};
export const logout = () => (dispatch) => {
  localStorage.clear();

  dispatch({ type: LOGOUT_SUCCESS });
};

export const clearError = () => ({ type: CLEAR_ERROR });

export const checkOTP = (body) => async (dispatch) => {
  dispatch({ type: CHECK_OTP_REQUEST });
  console.log("body", body);

  try {
    const response = await axios.post(
      `${API_BASE_URL}/identity/auth/checkOTP`,
      body
    );
    const data = response.data;
    console.log(data);

    dispatch({ type: CHECK_OTP_SUCCESS, payload: data });
    return data;
  } catch (error) {
    dispatch({ type: CHECK_OTP_FAILURE, payload: error.response.data.message });
    console.log("in ra lõi nè", error);
    return error.response.data;
  }
};

export const sendEmailWelcome = (body) => async (dispatch) => {
  dispatch({ type: SEND_EMAIL_REQUEST });

  try {
    const response = await axios.post(
      `${API_BASE_URL}/identity/auth/welcome`,
      body
    );
    const data = response.data;
    console.log(data);

    dispatch({ type: SEND_EMAIL_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: SEND_EMAIL_FAILURE,
      payload: error.response.data.message,
    });

    console.log(error.response.data.message);
  }
};

export const forgotPassword = (email) => async (dispatch) => {
  dispatch({ type: FORGOT_PASSWORD_REQUEST });

  try {
    const response = await axios.post(
      `${API_BASE_URL}/identity/users/forgotPassword`,
      email
    );
    const data = response.data;
    console.log(data);

    dispatch({ type: FORGOT_PASSWORD_SUCCESS, payload: data });
    return data;
  } catch (error) {
    dispatch({
      type: FORGOT_PASSWORD_FAILURE,
      payload: error.response.data.message,
    });

    console.log(error.response.data.message);
    return error.response.data;
  }
};

export const updatePassword = (email, password) => async (dispatch) => {
  dispatch({ type: UPDATE_PASSWORD_REQUEST });

  try {
    const response = await axios.post(
      `${API_BASE_URL}/identity/users/updatePassword`,
      { email, password }
    );
    const data = response.data;
    console.log(data);

    dispatch({ type: UPDATE_PASSWORD_SUCCESS, payload: data });
    return data;
  } catch (error) {
    dispatch({
      type: UPDATE_PASSWORD_FAILURE,
      payload: error.response.data.message,
    });

    console.log(error.response.data.message);
    return error.response.data;
  }
};

export const getEmailFromToken = () => async (dispatch) => {
  dispatch({ type: GET_EMAIL_SUCCESS });

  try {
    const response = await api.get(`${API_BASE_URL}/identity/common/getEmail`);

    dispatch({
      type: GET_EMAIL_SUCCESS,
      payload: response.data.result.email,
    });
    console.log("email", response.data.result.email);
  } catch (e) {
    console.log("error", e);
    dispatch({ type: GET_USER_FAILURE, payload: e.message });
  }
};

export const updateUser = (body) => async (dispatch) => {
  dispatch({ type: UPDATE_USER_REQUEST });

  try {
    const response = await api.put(`${API_BASE_URL}/profile/updateMine`, body);
    console.log("in body ra xem nao", body);
    dispatch({
      type: UPDATE_USER_SUCCESS,
      payload: response.data,
    });
    console.log("res", response.data);
  } catch (e) {
    console.log("error", e);
    dispatch({ type: GET_USER_FAILURE, payload: e.message });
  }
};

export const toggle2FAUser = () => async (dispatch) => {
  dispatch({ type: ENABLE_TWO_STEP_AUTHENTICATION_USER_REQUEST });

  try {
    const response = await api.put(
      `${API_BASE_URL}/identity/users/convertTwoAuth`
    );

    dispatch({
      type: ENABLE_TWO_STEP_AUTHENTICATION_USER_SUCCESS,
      payload: response.data.result.twoAuth,
    });
    console.log("res", response.data);
  } catch (e) {
    console.log("error", e);
    dispatch({
      type: ENABLE_TWO_STEP_AUTHENTICATION_USER_FAILURE,
      payload: e.message,
    });
  }
};

export const toggle2FAOAuthUser = () => async (dispatch) => {
  dispatch({ type: ENABLE_TWO_STEP_AUTHENTICATION_OAUTH_USER_REQUEST });

  try {
    const response = await api.put(
      `${API_BASE_URL}/identity/oauth2/convertTwoAuth`
    );

    dispatch({
      type: ENABLE_TWO_STEP_AUTHENTICATION_OAUTH_USER_SUCCESS,
      payload: response.data.result.twoAuth,
    });
    console.log("res", response.data);
  } catch (e) {
    console.log("error", e);
    dispatch({
      type: ENABLE_TWO_STEP_AUTHENTICATION_OAUTH_USER_FAILURE,
      payload: e.message,
    });
  }
};

export const sendEmailTwoAuth = () => async (dispatch) => {
  dispatch({ type: SEND_EMAIL_TWO_AUTH_REQUEST });

  try {
    const response = await api.post(
      `${API_BASE_URL}/identity/common/sendEmailTwoAuth`
    );

    dispatch({
      type: SEND_EMAIL_TWO_AUTH_SUCCESS,
    });
    console.log("res", response.data);
  } catch (e) {
    console.log("error", e);
    dispatch({
      type: SEND_EMAIL_TWO_AUTH_FAILURE,
      payload: e.message,
    });
  }
};

export const loginWithGG = () => (dispatch) => {
  console.log("kha nang thang nay ko chaty");
  dispatch({ type: SINGIN_GG_SUCCESS });
  console.log("dugn me roi");
};

export const changePasswordEnterOldPassword = (body) => async (dispatch) => {
  dispatch({ type: CHANGE_PASSWORD_OLD_REQUEST });

  try {
    const response = await api.post(
      `${API_BASE_URL}/identity/users/changePassword`,
      body
    );

    dispatch({
      type: CHANGE_PASSWORD_OLD_SUCCESS,
    });
    console.log("res", response.data);
    return response.data;
  } catch (e) {
    console.log("error", e);
    dispatch({
      type: CHANGE_PASSWORD_OLD_FAILURE,
      payload: e.response.data.message,
    });
    return e.response.data;
  }
};
