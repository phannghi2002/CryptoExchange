import {
  CHECK_FORMAT_IMAGE_REQUEST,
  CHECK_FORMAT_IMAGE_SUCCESS,
  CHECK_FORMAT_IMAGE_FAILURE,
} from "./ActionType";

const initialState = {
  result: [],
  loading: false,
  error: null,
};

const profileReducer = (state = initialState, action) => {
  switch (action.type) {
    case CHECK_FORMAT_IMAGE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case CHECK_FORMAT_IMAGE_SUCCESS:
      return {
        ...state,
        result: action.payload,
        loading: false,
        error: null,
      };

    case CHECK_FORMAT_IMAGE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default profileReducer;
