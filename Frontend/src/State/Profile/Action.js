import api, { API_BASE_URL } from "@/config/api";
import {
  CHECK_FORMAT_IMAGE_REQUEST,
  CHECK_FORMAT_IMAGE_SUCCESS,
  CHECK_FORMAT_IMAGE_FAILURE,
  UPLOAD_FILE_TO_SERVER_SUCCESS,
  UPLOAD_FILE_TO_SERVER_REQUEST,
  UPLOAD_FILE_TO_SERVER_FAILURE,
} from "./ActionType";

export const checkFormatImage =
  ({ file, imageId }) =>
  async (dispatch) => {
    dispatch({ type: CHECK_FORMAT_IMAGE_REQUEST });

    const formData = new FormData();
    formData.append("file", file);
    formData.append("imageId", imageId);

    try {
      const response = await api.post(
        `${API_BASE_URL}/profile/info-image`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      dispatch({
        type: CHECK_FORMAT_IMAGE_SUCCESS,
        payload: response.data,
      });

      console.log("format", response.data);
      return response;
    } catch (e) {
      console.log("error", e);
      dispatch({ type: CHECK_FORMAT_IMAGE_FAILURE, payload: e.message });
      return e;
    }
  };

export const uploadFileToServer =
  (file, imageId, userId) => async (dispatch) => {
    dispatch({ type: UPLOAD_FILE_TO_SERVER_REQUEST });

    try {
      // Sử dụng FormData để gửi file
      const formData = new FormData();
      formData.append("file", file);
      formData.append("imageId", imageId); // "id-front", "id-back", v.v.
      formData.append("userId", userId); // Giả sử profile chứa userId

      const response = await api.post(
        `${API_BASE_URL}/profile/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      dispatch({
        type: UPLOAD_FILE_TO_SERVER_SUCCESS,
        payload: response.data,
      });

      console.log("Upload thành công:", response.data);
    } catch (e) {
      console.log("Lỗi khi upload ảnh:", e);
      dispatch({ type: UPLOAD_FILE_TO_SERVER_FAILURE, payload: e.message });
    }
  };
