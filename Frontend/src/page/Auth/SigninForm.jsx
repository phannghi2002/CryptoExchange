import {
  clearError,
  getEmailFromToken,
  getUser,
  login,
  loginWithGG,
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
import { useNavigate } from "react-router-dom";

function SigninForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false); // State để điều khiển hiển thị mật khẩu

  const { auth } = useSelector((store) => store);
  const [error, setError] = useState("");

  const form = useForm({
    resolver: "",
    defaultValues: {
      email: "",
      password: "",
    },
  });
  // const onSubmit = (data) => {
  //   dispatch(login({ data, navigate }));
  //   console.log(data);
  //   dispatch(getUser(localStorage.getItem("token")));
  // };

  const onSubmit = async (data) => {
    const result = await dispatch(login({ data, navigate }));

    console.log("in ra result xem nào", result);
    if (result.code !== 1000) {
      setError(result.message); // Hiển thị lỗi nếu đăng nhập thất bại
    } else {
      dispatch(getUser(localStorage.getItem("token")));
    }
  };

  const loginWithOauth = () => {
    localStorage.setItem("loginGG", true);
    window.location.href =
      "http://localhost:8888/api/v1/identity/oauth2/authorization/google";
  };

  return (
    <div>
      <h1 className="text-xl font-bold text-center pb-7">Login</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                      // dispatch(clearError()); // Gọi hàm clearError
                      setError("");
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
                        placeholder="Your Password"
                        {...field}
                        className="border w-full border-gray-700 p-5 pr-10" // Dành chỗ cho icon
                        onChange={(e) => {
                          field.onChange(e); // Cập nhật giá trị
                          // dispatch(clearError()); // Gọi clearError
                          setError("");
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
          <Button type="submit" className="w-full py-5 mt-2">
            Next
          </Button>

          <p
            className="flex items-center justify-center"
            style={{ marginTop: "9px", marginBottom: "-10px" }}
          >
            <span className="flex-grow border-t border-white"></span>
            <span className="mx-2" style={{ marginBottom: "4px" }}>
              or
            </span>
            <span className="flex-grow border-t border-white"></span>
          </p>

          <Button className="w-full py-5" onClick={loginWithOauth}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="25"
              height="25"
              viewBox="0 0 48 48"
            >
              <path
                fill="#FFC107"
                d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
              ></path>
              <path
                fill="#FF3D00"
                d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
              ></path>
              <path
                fill="#4CAF50"
                d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
              ></path>
              <path
                fill="#1976D2"
                d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
              ></path>
            </svg>
            <span className="pl-2"> Countinue with Google</span>
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default SigninForm;
