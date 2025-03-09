import { useEffect, useRef, useState } from "react";
import { FaceDetection } from "@mediapipe/face_detection";
import { Camera } from "@mediapipe/camera_utils";

export default function FaceDetectionComponent({ onClose, onCapture }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [faceCaptured, setFaceCaptured] = useState(false);
  const captureTimeoutRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const faceDetection = new FaceDetection({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`,
    });

    faceDetection.setOptions({
      model: "short",
      minDetectionConfidence: 0.5,
    });

    let camera;

    faceDetection.onResults((results) => {
      if (results.detections.length > 0 && !faceCaptured) {
        // Kiểm tra nếu canvas đã được gán giá trị
        if (!canvasRef.current) return;

        const canvasWidth = canvasRef.current.width;
        const canvasHeight = canvasRef.current.height;

        for (const detection of results.detections) {
          const bbox = detection.boundingBox;
          const xCenter = bbox.xCenter * canvasWidth;
          const yCenter = bbox.yCenter * canvasHeight;

          const boxWidth = bbox.width * canvasWidth;
          const boxHeight = bbox.height * canvasHeight;

          const withinHorizontalBounds =
            xCenter > 0.4 * canvasWidth && xCenter < 0.6 * canvasWidth;
          const withinVerticalBounds =
            yCenter > 0.4 * canvasHeight && yCenter < 0.6 * canvasHeight;

          if (withinHorizontalBounds && withinVerticalBounds) {
            if (!captureTimeoutRef.current) {
              // Bắt đầu đếm ngược 3 giây
              captureTimeoutRef.current = setTimeout(() => {
                if (withinHorizontalBounds && withinVerticalBounds) {
                  // Chỉ chụp nếu khuôn mặt vẫn ở trong vùng xác định
                  setFaceCaptured(true);
                  const capturedImage = captureImageFromVideo();
                  onCapture(capturedImage);
                  camera.stop();
                  onClose();
                }
              }, 3000); // 3 giây
            }
          } else {
            // Nếu khuôn mặt rời khỏi vùng trước 3 giây, hủy đếm ngược
            clearTimeout(captureTimeoutRef.current);
            captureTimeoutRef.current = null;
          }
        }
      }
    });

    camera = new Camera(videoRef.current, {
      onFrame: async () => {
        if (!faceCaptured) {
          await faceDetection.send({ image: videoRef.current });
        }
      },
      width: 640,
      height: 480,
    });

    camera.start();

    return () => {
      clearTimeout(captureTimeoutRef.current);
      camera.stop();
    };
  }, [onClose, onCapture, faceCaptured]);

  const captureImageFromVideo = () => {
    const canvas = document.createElement("canvas");

    // Đảm bảo video đã có kích thước trước khi lấy kích thước canvas
    if (videoRef.current) {
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
    }

    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/png");
  };

  return (
    <div className="relative flex flex-col items-center">
      <video ref={videoRef} className="rounded-lg" autoPlay playsInline />
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}

// export default function FaceDetectionComponent({ onClose, onCapture }) {
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const [faceCaptured, setFaceCaptured] = useState(false);
//   const captureTimeoutRef = useRef(null);

//   useEffect(() => {
//     if (!videoRef.current || !canvasRef.current) return;

//     const faceDetection = new FaceDetection({
//       locateFile: (file) =>
//         `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`,
//     });

//     faceDetection.setOptions({
//       model: "short",
//       minDetectionConfidence: 0.5,
//     });

//     let camera;

//     faceDetection.onResults((results) => {
//       if (results.detections.length > 0 && !faceCaptured) {
//         const canvasWidth = canvasRef.current.width;
//         const canvasHeight = canvasRef.current.height;

//         for (const detection of results.detections) {
//           const bbox = detection.boundingBox;
//           const xCenter = bbox.xCenter * canvasWidth;
//           const yCenter = bbox.yCenter * canvasHeight;

//           const boxWidth = bbox.width * canvasWidth;
//           const boxHeight = bbox.height * canvasHeight;

//           const withinHorizontalBounds =
//             xCenter > 0.4 * canvasWidth && xCenter < 0.6 * canvasWidth;
//           const withinVerticalBounds =
//             yCenter > 0.4 * canvasHeight && yCenter < 0.6 * canvasHeight;

//           if (withinHorizontalBounds && withinVerticalBounds) {
//             if (!captureTimeoutRef.current) {
//               // Bắt đầu đếm ngược 3 giây
//               captureTimeoutRef.current = setTimeout(() => {
//                 if (withinHorizontalBounds && withinVerticalBounds) {
//                   // Chỉ chụp nếu khuôn mặt vẫn ở trong vùng xác định
//                   setFaceCaptured(true);
//                   const capturedImage = captureImageFromVideo();
//                   onCapture(capturedImage);
//                   camera.stop();
//                   onClose();
//                 }
//               }, 3000); // 3 giây
//             }
//           } else {
//             // Nếu khuôn mặt rời khỏi vùng trước 3 giây, hủy đếm ngược
//             clearTimeout(captureTimeoutRef.current);
//             captureTimeoutRef.current = null;
//           }
//         }
//       }
//     });

//     camera = new Camera(videoRef.current, {
//       onFrame: async () => {
//         if (!faceCaptured) {
//           await faceDetection.send({ image: videoRef.current });
//         }
//       },
//       width: 640,
//       height: 480,
//     });

//     camera.start();

//     return () => {
//       clearTimeout(captureTimeoutRef.current);
//       camera.stop();
//     };
//   }, [onClose, onCapture, faceCaptured]);

//   const captureImageFromVideo = () => {
//     const canvas = document.createElement("canvas");
//     canvas.width = videoRef.current.videoWidth;
//     canvas.height = videoRef.current.videoHeight;
//     const ctx = canvas.getContext("2d");
//     ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
//     return canvas.toDataURL("image/png");
//   };

//   return (
//     <div className="relative flex flex-col items-center">
//       <video ref={videoRef} className="rounded-lg" autoPlay playsInline />
//       <canvas ref={canvasRef} className="absolute inset-0" />
//     </div>
//   );
// }
