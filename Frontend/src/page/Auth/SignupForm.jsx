import {
  clearError,
  login,
  register,
  sendEmailWelcome,
} from "@/State/Auth/Action";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EyeNoneIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { ModalOTP } from "../Modal/ModalOTP";
import { useNavigate } from "react-router-dom";

function SignupForm() {
  const dispatch = useDispatch();
  const { auth } = useSelector((store) => store);

  const [showPassword, setShowPassword] = useState(false); // State để điều khiển hiển thị mật khẩu

  const form = useForm({
    resolver: "",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  // let bodyOTP;
  const [showModalOTP, setShowModalOTP] = useState(false);

  const onSubmit = (data) => {
    dispatch(register(data));
    //1. Đăng ký -> thành công thì 2.Gửi mã OTP 3.Check mã OTP 4. Nếu đúng thì login trả về token để đăng nhập 5.Gửi email thông báo chào mừng đến
    //với nền tảng giao dịch. B1 và B2 gộp chung lại với nhau
    setShowModalOTP(true);
    console.log(form.getValues("email"));
  };

  useEffect(() => {
    if (auth.registerSuccess) {
      setShowModalOTP(true); // Hiển thị modal khi đăng ký thành công
    }
  }, [auth.registerSuccess]);

  const navigate = useNavigate();

  return (
    <div>
      {/* <h1 className="text-xl font-bold text-center pb-3">Create New Account</h1> */}
      <h1 className="text-xl font-bold text-center pb-3">Tạo tài khoản </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex justify-between items-center">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="w-full max-w-[48%]">
                  <FormControl>
                    <Input
                      // placeholder="First Name"
                      placeholder="Họ"
                      {...field}
                      className="border  border-gray-700 p-5"
                      onChange={(e) => {
                        field.onChange(e); // Cập nhật giá trị trong form
                        dispatch(clearError()); // Gọi hàm clearError
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="w-full max-w-[48%]">
                  <FormControl>
                    <Input
                      // placeholder="Last Name"
                      placeholder="Tên"
                      {...field}
                      className="border border-gray-700 p-5"
                      onChange={(e) => {
                        field.onChange(e); // Cập nhật giá trị trong form
                        dispatch(clearError()); // Gọi hàm clearError
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Phannghi@gmai.com"
                    {...field}
                    className="border w-full border-gray-700 p-5"
                    onChange={(e) => {
                      field.onChange(e); // Cập nhật giá trị trong form
                      dispatch(clearError()); // Gọi hàm clearError
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      {" "}
                      {/* Thêm container để gói các phần tử con */}
                      <Input
                        type={showPassword ? "text" : "password"}
                        // placeholder="Your Password"
                        placeholder="Mật khẩu"
                        {...field}
                        className="border w-full border-gray-700 p-5 pr-10" // Dành chỗ cho icon
                        onChange={(e) => {
                          field.onChange(e); // Cập nhật giá trị
                          dispatch(clearError()); // Gọi clearError
                        }}
                      />
                      <div
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer  text-blue-600 hover:text-blue-800"
                      >
                        {showPassword ? <EyeNoneIcon /> : <EyeOpenIcon />}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          {auth.error && (
            <div
              style={{
                marginTop: "8px",
                marginBottom: "-12px",
                color: "red",
                textAlign: "center",
              }}
            >
              {auth.error}
            </div>
          )}
          <Button type="submit" className="w-full py-5">
            Tiếp theo
          </Button>
        </form>
      </Form>

      {showModalOTP && (
        <ModalOTP
          isOpen={showModalOTP}
          onClose={() => setShowModalOTP(false)}
          action="REGISTER_OTP"
          email={form.getValues("email")}
          onSuccess={() => {
            dispatch(
              login({
                data: {
                  email: form.getValues("email"),
                  password: form.getValues("password"),
                },
                navigate, // Truyền navigate nếu cần cho điều hướng
              })
            );
            dispatch(
              sendEmailWelcome({
                email: form.getValues("email"),
                firstName: form.getValues("firstName"),
                lastName: form.getValues("lastName"),
              })
            );
          }}
        />
      )}
    </div>
  );
}

export default SignupForm;
