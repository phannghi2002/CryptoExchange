/* eslint-disable react/no-unescaped-entities */
import { Button } from "@/components/ui/button";
import "./Auth.css";
import SignupForm from "./SignupForm";
import { useLocation, useNavigate } from "react-router-dom";
import ForgotPasswordForm from "./ForgotPasswordForm";
import SigninForm from "./SigninForm";
import { useEffect } from "react";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearError } from "@/State/Auth/Action";
import { ModalOTP } from "../Modal/ModalOTP";
import { ArrowBigRightIcon } from "lucide-react";

function Auth() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  console.log("location :", location.pathname);

  useEffect(() => {
    console.log("Current pathname:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="relative" style={{ height: "calc(100vh - 100px)" }}>
      <div className="absolute top-0 right-0 left-0 bottom-0 bg-[#030712] bg-opacity-50">
        <div
          className="bgBlure absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center
        items-center h-[35rem] w-[29rem] rounded-md z-50 bg-black bg-opacity-50 shadow-2xl shadow-white px-10"
        >
          <h1 className="font-bold text-5xl pb-8">Crypto Exchange</h1>

          <Routes>
            {/* Trang Signin */}
            <Route
              path="signin"
              element={
                <section className="w-full">
                  <SigninForm />
                  <div className="flex items-center justify-center mt-5">
                    {/* <span className="mr-3">Don't have an account?</span> */}
                    <span className="mr-3">Bạn chưa có tài khoản?</span>
                    <Button
                      onClick={() => {
                        navigate("/auth/signup");
                      }}
                      variant="ghost"
                    >
                      {/* Signup */}
                      Đăng ký
                    </Button>
                  </div>
                  <div className="mt-2">
                    <Button
                      className="w-full py-5"
                      onClick={() => {
                        navigate("/auth/forgot-password");
                        dispatch(clearError());
                      }}
                      variant="outline"
                    >
                      {/* Forgot Password */}
                      Quên mật khẩu
                    </Button>
                  </div>
                </section>
              }
            />

            {/* Trang Signup */}
            <Route
              path="signup"
              element={
                <section className="w-full">
                  <SignupForm />
                  <div className="flex items-center justify-center mt-3">
                    {/* <span className="mr-3">Already have an account?</span> */}
                    <span className="mr-3">Bạn đã có tài khoản?</span>

                    <Button
                      onClick={() => {
                        navigate("/auth/signin");
                        dispatch(clearError());
                      }}
                      variant="ghost"
                    >
                      {/* Login */}
                      Đăng nhập
                    </Button>
                  </div>
                </section>
              }
            />

            {/* Trang Forgot Password */}
            <Route
              path="forgot-password"
              element={
                <section className="w-full">
                  <ForgotPasswordForm />
                  <div className="flex items-center justify-center mt-5">
                    {/* <span className="mr-3">Back to login</span> */}
                    <span className="mr-3">Trở lại đăng nhập</span>
                    <ArrowBigRightIcon />

                    <Button
                      onClick={() => navigate("/auth/signin")}
                      variant="ghost"
                      className="ml-2"
                    >
                      {/* Signin */}
                      Đăng nhập
                    </Button>
                  </div>
                </section>
              }
            />

            {/* Route mặc định */}
            <Route path="*" element={<Navigate to="/auth/signin" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default Auth;
