/* eslint-disable react/prop-types */
import { Button } from "@/components/ui/button";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDispatch, useSelector } from "react-redux";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateUser } from "@/State/Auth/Action";

export const ModalUpdateUser = ({ isOpen, onClose }) => {
  const [error, setError] = useState("");
  const { auth } = useSelector((store) => store);
  const dispatch = useDispatch();

  console.log("in ra auth ne", auth);

  const [formState, setFormState] = useState({
    firstName: auth.user?.firstName,
    lastName: auth.user?.lastName,
    dob: auth.user?.dob,
    city: auth.user?.city,
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

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = { ...formState, dob: formState.dobBackend };
    delete payload.dobBackend;

    dispatch(updateUser(payload));

    onClose();
  };
  const handleDateInput = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // Chỉ cho phép số

    if (value.length > 8) value = value.slice(0, 8); // Giới hạn 8 ký tự

    // Định dạng thành dd/mm/yyyy
    if (value.length >= 2) value = value.slice(0, 2) + "/" + value.slice(2);
    if (value.length >= 5) value = value.slice(0, 5) + "/" + value.slice(5);

    // Lưu hiển thị cho người dùng
    setFormState((prev) => ({ ...prev, dob: value }));

    // Chuyển thành yyyy-mm-dd cho backend
    if (value.length === 10) {
      const [dd, mm, yyyy] = value.split("/");
      if (dd && mm && yyyy) {
        const formattedDate = `${yyyy}-${mm}-${dd}`;
        setFormState((prev) => ({
          ...prev,
          dobBackend: formattedDate,
        }));
      }
    }
  };

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
            Cập nhật thông tin
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="firstName" className="text-left col-span-1">
              Frist Name
            </Label>

            <div className="col-span-2">
              <Input
                id="firstName"
                name="firstName"
                value={formState.firstName}
                onChange={handleInputChange}
                className="w-full pr-10" // Thêm padding để tránh icon đè lên nội dung input
              />
            </div>
          </div>

          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="lastName" className="text-left col-span-1">
              Last Name
            </Label>

            <div className="col-span-2">
              <Input
                id="lastName"
                name="lastName"
                value={formState.lastName}
                onChange={handleInputChange}
                className="w-full pr-10" // Thêm padding để tránh icon đè lên nội dung input
              />
            </div>
          </div>

          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="dob" className="text-left col-span-1">
              Dob
            </Label>
            <div className="col-span-2">
              <Input
                id="dob"
                type="text"
                placeholder="dd/mm/yyyy"
                name="dob"
                value={formState.dob}
                onChange={handleDateInput}
                className="w-full pr-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="confirm-password" className="text-left col-span-1">
              Country
            </Label>

            <div className="col-span-2">
              <Select
                value={formState.city || auth.user?.city || ""}
                onValueChange={(value) =>
                  setFormState((prev) => ({ ...prev, city: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Country</SelectLabel>
                    <SelectItem value="Vietnamese">Vietnamese</SelectItem>
                    <SelectItem value="Chinese">Chinese</SelectItem>
                    <SelectItem value="United States">United States</SelectItem>
                    <SelectItem value="Russia">Russia</SelectItem>
                    <SelectItem value="England">England</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          {error && (
            <p className="text-red-500 mr-auto flex justify-center">{error}</p>
          )}
        </div>

        <DialogFooter className="flex justify-end w-full ">
          <Button type="submit" onClick={handleSubmit}>
            Cập nhật
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
