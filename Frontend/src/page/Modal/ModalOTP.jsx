/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDispatch } from "react-redux";
import { checkOTP } from "@/State/Auth/Action";

export const ModalOTP = ({ isOpen, onClose, action, email, onSuccess }) => {
  const [otp, setOtp] = useState("");

  console.log("action, email", action, email);

  // Xử lý khi nhập OTP
  const handleInputChange = (value) => {
    setOtp(value);
    console.log("value ne", otp);
  };

  const [timeLeft, setTimeLeft] = useState(1 * 60);
  const [isTimeout, setIsTimeout] = useState(false);

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else {
      setIsTimeout(true);
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const [error, setError] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    if (otp.length === 6) {
      dispatch(checkOTP({ action, email, otpCode: otp }))
        .then((response) => {
          if (response.code === 1000) {
            onSuccess(); // Gọi callback khi OTP thành công
            console.log("response ne", response);
          } else {
            // Mã OTP không hợp lệ hoặc hết hạn
            setError(response.message); // Hiển thị thông báo lỗi
            console.log("OTP error", response.message);
          }
        })
        .catch((error) => {
          console.log("response ne 2", error);
          setError("Something went wrong");
        });
    }
  }, [otp]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* Đổi màu nền */}
      <DialogOverlay className="bg-blue-500/30 fixed inset-0" />{" "}
      <DialogContent
        onInteractOutside={(event) => event.preventDefault()}
        className="flex justify-center items-center flex-col my-2 sm:max-w-[30%]"
      >
        <DialogHeader>
          <DialogTitle className="flex justify-center items-center flex-col my-2">
            Mã OTP đã được gửi đến:
            <div className="my-3">{email}</div>
            <div className="text-2xl">{formatTime(timeLeft)}</div>
          </DialogTitle>
          <DialogDescription>
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => {
                handleInputChange(value);
                setError("");
              }}
            >
              <InputOTPGroup>
                {[0, 1, 2].map((index) => (
                  <InputOTPSlot key={index} index={index} />
                ))}
              </InputOTPGroup>

              <InputOTPSeparator />
              <InputOTPGroup>
                {[3, 4, 5].map((index) => (
                  <InputOTPSlot key={index} index={index} />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </DialogDescription>
        </DialogHeader>

        {error && <div className="text-red-600">{error}</div>}
        {isTimeout && (
          <div className="mt-4">
            {/* OTP has expired. */}
            Mã OTP đã hết hạn
            <span
              className="text-blue-500 underline ml-2 cursor-pointer"
              onClick={() => {
                setTimeLeft(1 * 60);
                setIsTimeout(false);

                setError("");
                setOtp("");
              }}
            >
              {/* Send to OTP again ? */}
              Gửi lại mã OTP ?
            </span>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
