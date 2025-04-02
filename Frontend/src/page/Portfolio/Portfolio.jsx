import IDSampleFront from "../../assets/image/ID_Sample_Front.jpg";
import IDSampleBack from "../../assets/image/ID_Sample_Back.jpg";
import faceID from "../../assets/image/face_id.jpg";

import UploadFile from "../UploadFile/UploadFile";

function Kyc() {
  return (
    <>
      <h1 className="font-bold text-3xl p-5">
        Tiến hành tính năng xác thực Kyc
      </h1>

      <div className="flex justify-around mt-8">
        <UploadFile
          title="Tải hoặc kéo thả ảnh CCCD mặt trước của bạn"
          sampleImage={IDSampleFront}
          id="id-front"
        />

        <UploadFile
          title="Tải hoặc kéo thả ảnh CCCD mặt sau của bạn"
          sampleImage={IDSampleBack}
          id="id-back"
        />

        <UploadFile
          // title="Tải hoặc kéo thả ảnh chụp khuôn mặt của bạn"
          title="Bật camera để xác thực khuôn mặt"
          sampleImage={faceID}
          id="id-face"
        />
      </div>
    </>
  );
}

export default Kyc;
