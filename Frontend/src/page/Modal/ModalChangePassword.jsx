/* eslint-disable react/prop-types */
import { Button } from "@/components/ui/button";

import { EyeNoneIcon, EyeOpenIcon } from "@radix-ui/react-icons";

import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import {
  changePasswordEnterOldPassword,
  updatePassword,
} from "@/State/Auth/Action";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

export const ModalChangePassword = ({
  email,
  isOpen,
  onClose,
  changeOld = false,
}) => {
  console.log("email:", email);

  const [error, setError] = useState("");
  const { auth } = useSelector((store) => store);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formState, setFormState] = useState({
    password: "",
    confirmPassword: "",
    oldPassword: "",
    showPassword: false,
    showConfirmPassword: false,
    showOldPassword: false,
  });

  // Hàm xử lý khi người dùng nhập giá trị
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    setError("");
  };

  // Hàm xử lý toggle hiển thị mật khẩu
  const togglePasswordVisibility = (field) => {
    setFormState((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formState.password.trim() || !formState.confirmPassword.trim()) {
      setError("Các trường mật khẩu không được để trống");
      return;
    }

    if (formState.password !== formState.confirmPassword) {
      setError("Mật khẩu không khớp. Vui lòng kiểm tra lại.");
      return;
    }

    if (changeOld && formState.oldPassword === formState.password) {
      setError("Mật khẩu cũ không được trùng với mật khẩu mới.");
      return;
    }

    setError("");

    const response = await (changeOld
      ? dispatch(
          changePasswordEnterOldPassword({
            oldPassword: formState.oldPassword,
            newPassword: formState.password,
          })
        )
      : dispatch(updatePassword(email, formState.password)));

    if (response.code === 1000) {
      // Đặt lại formState về giá trị ban đầu
      setFormState({
        password: "",
        confirmPassword: "",
        oldPassword: "",
        showPassword: false,
        showConfirmPassword: false,
        showOldPassword: false,
      });
      onClose();

      if (!changeOld) navigate("/auth/signin");
    } else {
      setError(response.message); // Set lỗi nếu thất bại
    }
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   // Kiểm tra mật khẩu không trống
  //   if (
  //     !formState.password.trim() ||
  //     !formState.confirmPassword.trim() ||
  //     (changeOld && !formState.oldPassword.trim())
  //   ) {
  //     setError("Các trường mật khẩu không được để trống");
  //     return;
  //   }

  //   // Kiểm tra mật khẩu mới và xác nhận phải khớp
  //   if (formState.password !== formState.confirmPassword) {
  //     setError("Mật khẩu không khớp. Vui lòng kiểm tra lại.");
  //     return;
  //   }

  //   // Nếu có changeOld, kiểm tra mật khẩu cũ không trùng với mật khẩu mới
  //   if (changeOld && formState.oldPassword === formState.password) {
  //     setError("Mật khẩu cũ không được trùng với mật khẩu mới.");
  //     return;
  //   }

  //   setError("");

  //   if (changeOld) {
  //     // Dispatch đổi mật khẩu có kiểm tra mật khẩu cũ
  //     dispatch(
  //       changePasswordEnterOldPassword({
  //         oldPassword: formState.oldPassword,
  //         newPassword: formState.password,
  //       })
  //     );
  //     onClose();
  //   } else {
  //     // Dispatch đổi mật khẩu không cần kiểm tra mật khẩu cũ
  //     dispatch(updatePassword(email, formState.password));
  //     onClose();
  //     navigate("/auth/signin");
  //   }
  // };

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
            Thay đổi mật khẩu
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {changeOld && (
            <div className="grid grid-cols-2 items-center gap-4">
              <Label htmlFor="old-password" className="text-left">
                Nhập mật khẩu cũ
              </Label>

              <div className="relative w-full">
                <Input
                  id="old-password"
                  name="oldPassword"
                  value={formState.oldPassword}
                  type={formState.showOldPassword ? "text" : "password"}
                  onChange={handleInputChange}
                  className="w-full pr-10" // Thêm padding để tránh icon đè lên nội dung input
                />
                <div
                  onClick={() => togglePasswordVisibility("showOldPassword")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-blue-600 hover:text-blue-800"
                >
                  {formState.showOldPassword ? (
                    <EyeNoneIcon />
                  ) : (
                    <EyeOpenIcon />
                  )}
                </div>
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 items-center gap-4">
            <Label htmlFor="new-password" className="text-left">
              Nhập mật khẩu mới
            </Label>

            <div className="relative w-full">
              <Input
                id="new-password"
                name="password"
                value={formState.password}
                onChange={handleInputChange}
                type={formState.showPassword ? "text" : "password"}
                className="w-full pr-10" // Thêm padding để tránh icon đè lên nội dung input
              />
              <div
                onClick={() => togglePasswordVisibility("showPassword")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-blue-600 hover:text-blue-800"
              >
                {formState.showPassword ? <EyeNoneIcon /> : <EyeOpenIcon />}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 items-center gap-4">
            <Label htmlFor="confirm-password" className="text-left">
              Nhập lại mật khẩu mới
            </Label>

            <div className="relative w-full">
              <Input
                id="confirm-password"
                name="confirmPassword"
                value={formState.confirmPassword}
                type={formState.showConfirmPassword ? "text" : "password"}
                onChange={handleInputChange}
                className="w-full pr-10" // Thêm padding để tránh icon đè lên nội dung input
              />
              <div
                onClick={() => togglePasswordVisibility("showConfirmPassword")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-blue-600 hover:text-blue-800"
              >
                {formState.showConfirmPassword ? (
                  <EyeNoneIcon />
                ) : (
                  <EyeOpenIcon />
                )}
              </div>
            </div>
          </div>

          {error && (
            <p className="text-red-500 mr-auto flex justify-center">{error}</p>
          )}
        </div>

        <DialogFooter className="flex justify-end w-full ">
          <Button type="submit" onClick={handleSubmit}>
            Cập nhật mật khẩu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
