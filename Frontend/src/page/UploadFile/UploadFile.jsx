import { useEffect, useState } from "react";
import { BadgePlusIcon } from "lucide-react";
import FaceDetectionComponent from "./FaceDetectionComponent";
import { useDispatch, useSelector } from "react-redux";
import { checkFormatImage, uploadFileToServer } from "@/State/Profile/Action";

function UploadFile({ title, sampleImage, id }) {
  const dispatch = useDispatch();
  const { auth } = useSelector((store) => store);

  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null); // Lưu file để gửi API
  const [isDragging, setIsDragging] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  const [error, setError] = useState("");

  const handleGetImage = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setError("");
      setImage(URL.createObjectURL(selectedFile));
      setFile(selectedFile); // Lưu file vào state
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      setError("");
      setImage(URL.createObjectURL(droppedFile));
      setFile(droppedFile); // Lưu file vào state
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // const handleCapture = async (capturedImage, capturedFile) => {
  //   setError("");
  //   setImage(capturedImage); // Hiển thị ảnh đã chụp
  //   setFile(capturedFile); // Lưu file từ camera

  //   console.log("co ve sai r", capturedImage, capturedFile);

  //   // Chuyển base64 thành Blob
  //   const byteCharacters = atob(base64Data.split(',')[1]);
  //   const byteNumbers = new Array(byteCharacters.length);
  //   for (let i = 0; i < byteCharacters.length; i++) {
  //       byteNumbers[i] = byteCharacters.charCodeAt(i);
  //   }
  //   const byteArray = new Uint8Array(byteNumbers);
  //   const fileBlob = new Blob([byteArray], { type: 'image/png' });

  //   // Tạo File object
  //   const file = new File([fileBlob], "upload.png", { type: 'image/png' });
  //   try {
  //     await dispatch(uploadFileToServer(capturedFile, id, auth.user?.userId));
  //   } catch (error) {
  //     console.log("Lỗi mẹ rồi", error);
  //   }
  // };

  const handleCapture = (capturedImage, capturedFile) => {
    setError("");
    setImage(capturedImage); // Hiển thị ảnh đã chụp
    setFile(capturedFile); // Lưu file từ camera
  };

  // useEffect(() => {
  //   if (image && file && id === "id-face") {
  //     console.log("file ne con", image, "ao vcl", file);
  //     sendFileFaceId();
  //   }
  // }, []);

  const sendFileFaceId = async () => {
    // Giả sử capturedFile là chuỗi base64 từ ảnh
    console.log("file ne con", image);
    const base64Data = image.split(",")[1]; // Chỉ lấy phần dữ liệu base64 từ chuỗi full base64

    // Chuyển base64 thành Blob
    const byteCharacters = atob(base64Data); // Giải mã base64 thành các ký tự byte
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i); // Chuyển đổi mỗi ký tự thành mã byte
    }
    const byteArray = new Uint8Array(byteNumbers); // Chuyển thành Uint8Array để tạo Blob

    const fileBlob = new Blob([byteArray], { type: "image/png" }); // Tạo Blob từ byteArray

    // Tạo đối tượng File từ Blob
    const fileSend = new File([fileBlob], "upload.png", { type: "image/png" });

    // Tiến hành gửi file đã chuyển đổi lên server
    try {
      await dispatch(uploadFileToServer(fileSend, id, auth.user?.userId)); // Gửi file qua hàm uploadFileToServer
    } catch (error) {
      console.log("Lỗi khi upload ảnh:", error);
    }
  };

  const handleClick = async () => {
    if (id === "id-face") {
      sendFileFaceId();
      return;
    }
    if (!file) {
      console.error("Không có file nào được chọn!");
      return;
    }

    try {
      //  Gọi API kiểm tra định dạng ảnh
      const response = await dispatch(checkFormatImage({ file, imageId: id }));
      console.log("in ra reslt ponst", response);

      //  Kiểm tra kết quả từ API OCR
      if (response.data.code === 1000) {
        console.log("Hình ảnh hợp lệ, bắt đầu upload...");
        setError("");

        //Gửi ảnh lên server
        await dispatch(uploadFileToServer(file, id, auth.user?.userId));
      } else {
        setError(response.data.message);
        console.log("Hình ảnh không hợp lệ, không upload!");
      }
    } catch (error) {
      console.error("Lỗi khi kiểm tra ảnh:", error);
    }
  };

  return (
    <div className="flex flex-col items-center w-[20%]">
      <div className="mb-5">{title}</div>
      <div
        className={`border relative w-full ${
          isDragging ? "border-blue-500" : "border-gray-300"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {!showCamera && !image ? (
          <>
            <img
              src={sampleImage}
              alt="Sample ID"
              className="object-cover w-full h-auto filter"
              style={{ filter: "blur(1px)" }}
            />
            <div className="absolute inset-0 flex justify-center items-center">
              {id === "id-face" ? (
                <BadgePlusIcon
                  className="text-white bg-blue-600 rounded-full w-16 h-16 cursor-pointer"
                  onClick={() => setShowCamera(true)}
                />
              ) : (
                <label htmlFor={id} className="cursor-pointer">
                  <BadgePlusIcon className="text-white bg-blue-600 rounded-full w-16 h-16" />
                </label>
              )}
              <input
                id={id}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleGetImage}
              />
            </div>
          </>
        ) : showCamera ? (
          <FaceDetectionComponent
            onClose={() => {
              setShowCamera(false);
              // sendFileFaceId();
            }}
            onCapture={handleCapture}
          />
        ) : (
          <img
            src={image}
            alt="Uploaded ID"
            className="object-cover w-full h-auto"
          />
        )}
      </div>

      {error && (
        <div
          style={{
            marginTop: "8px",
            marginBottom: "-12px",
            color: "red",
            textAlign: "center",
          }}
        >
          {error}
        </div>
      )}
      {image && (
        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleClick}
        >
          Gửi
        </button>
      )}
    </div>
  );
}

export default UploadFile;
