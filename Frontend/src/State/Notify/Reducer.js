import {
  DELETE_NOTIFY_READ_HANDLED_SUCCESS,
  GET_NOTIFY_USER_REQUEST,
  GET_NOTIFY_USER_SUCCESS,
} from "./ActionType";

const initialState = {
  notifyList: [],
  loading: false,
  error: null,
  unreadCount: null,
  successMessageDelete: null,
};

const notifyReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_NOTIFY_USER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case GET_NOTIFY_USER_SUCCESS:
      return {
        ...state,
        notifyList: action.payload.notifications,
        unreadCount: action.payload.unreadCount,
        loading: false,
        error: null,
      };

    case DELETE_NOTIFY_READ_HANDLED_SUCCESS: {
      return {
        ...state,
        successMessageDelete: action.payload,
      };
    }

    default:
      return state;
  }
};

export default notifyReducer;
