import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ModalOTP } from "../Modal/ModalOTP";
import { forgotPassword } from "@/State/Auth/Action";
import { useDispatch } from "react-redux";
import { ModalChangePassword } from "../Modal/ModalChangePassword";

function ForgotPasswordForm() {
  const dispatch = useDispatch();
  const form = useForm({
    resolver: "",
    defaultValues: {
      email: "",
    },
  });

  const [showModalOTP, setShowModalOTP] = useState(false);
  const [error, setError] = useState(""); // Lưu lỗi để hiển thị

  const onSubmit = async (data) => {
    dispatch(forgotPassword(data))
      .then((response) => {
        if (response.code === 1000) {
          setShowModalOTP(true);
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
  };

  const [showModalChangePassword, setShowModalChangePassword] = useState(false);

  return (
    <div>
      <h1 className="text-xl font-bold text-center pb-10">Forgot password</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Enter your email ..."
                    {...field}
                    className="border w-full border-gray-700 p-5"
                    onChange={(e) => {
                      field.onChange(e); // Cập nhật giá trị trong form
                      setError(""); // Gọi hàm clearError
                    }}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
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

          <Button type="submit" className="w-full py-5">
            Next
          </Button>
        </form>
      </Form>

      {showModalOTP && (
        <ModalOTP
          isOpen={showModalOTP}
          onClose={() => setShowModalOTP(false)}
          action="FORGOT_PASSWORD"
          email={form.getValues("email")}
          onSuccess={() => {
            // dispatch(forgotPassword({ email: form.getValues("email") }));
            setShowModalChangePassword(true);
          }}
        />
      )}
      {showModalChangePassword && (
        <ModalChangePassword
          isOpen={showModalChangePassword}
          onClose={() => setShowModalChangePassword(false)}
          email={form.getValues("email")}
          // onSuccess={() => {
          //   dispatch(forgotPassword({ email: form.getValues("email") }));
          //   console.log("hehe");
          // }}
        />
      )}
    </div>
  );
}

export default ForgotPasswordForm;
