import {
  CHANGE_PASSWORD_OLD_FAILURE,
  CLEAR_ERROR,
  ENABLE_TWO_STEP_AUTHENTICATION_OAUTH_USER_SUCCESS,
  ENABLE_TWO_STEP_AUTHENTICATION_USER_SUCCESS,
  GET_EMAIL_SUCCESS,
  GET_USER_FAILURE,
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  REGISTER_FAILURE,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  SINGIN_GG_SUCCESS,
  UPDATE_USER_SUCCESS,
} from "./ActionType";

const initialState = {
  user: null,
  loading: false,
  error: null,
  jwt: null,
  registerSuccess: false,
  email: null,
  twoAuth: false,
  gg: false,
};
const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case REGISTER_REQUEST:
    case LOGIN_REQUEST:
    case GET_USER_REQUEST:
    case LOGOUT_REQUEST:
      return { ...state, loading: true, error: null };

    case REGISTER_SUCCESS:
      return { ...state, loading: false, error: null, registerSuccess: true };
    case LOGIN_SUCCESS:
      return { ...state, loading: false, error: null, jwt: action.payload };

    case GET_USER_SUCCESS:
      return { ...state, user: action.payload, loading: false, error: null };
    case UPDATE_USER_SUCCESS:
      return { ...state, user: action.payload, loading: false, error: null };
    case ENABLE_TWO_STEP_AUTHENTICATION_USER_SUCCESS:
      return { ...state, twoAuth: action.payload, loading: false, error: null };
    case ENABLE_TWO_STEP_AUTHENTICATION_OAUTH_USER_SUCCESS:
      return { ...state, twoAuth: action.payload, loading: false, error: null };

    case GET_EMAIL_SUCCESS:
      return { ...state, email: action.payload, loading: false, error: null };
    case SINGIN_GG_SUCCESS:
      return { ...state, gg: true, loading: false, error: null };

    case LOGOUT_SUCCESS:
      return initialState;

    case REGISTER_FAILURE:
    case LOGIN_FAILURE:
    case GET_USER_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case CHANGE_PASSWORD_OLD_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case CLEAR_ERROR: // Xóa lỗi thủ công
      return { ...state, error: null };

    default:
      return state;
  }
};

export default authReducer;
