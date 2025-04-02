import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useLocation } from "react-router-dom";
import api from "@/config/api";
import qs from "qs";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "@/State/Auth/Action";
import { getBalanceWallet } from "@/State/Wallet/Action";

const VnPayOrderForm = () => {
  const location = useLocation(); // Lấy location từ React Router
  console.log("Location:", location); // Kiểm tra giá trị của location
  // const orderType = location.state?.orderInfo || "DEPOSIT"; // Lấy orderInfo từ state, mặc định là DEPOSIT
  const orderType = location.state?.orderInfo; // Lấy orderInfo từ state, mặc định là DEPOSIT

  // State to manage form fields
  const [formData, setFormData] = useState({
    amount: 150000, // Default value from HTML
    orderInfo: orderType, // Đặt mặc định theo state
    userId: location.state?.userId,
    nameBank: "None",
  });

  // Handle input changes for amount
  const handleAmountChange = (event) => {
    setFormData((prevData) => ({
      ...prevData,
      amount: event.target.value, // Update amount
    }));

    setError("");
  };

  const { auth, wallet } = useSelector((store) => store);

  console.log("wallet ne ae", wallet.balance.VND);
  const dispatch = useDispatch();
  const jwt =
    localStorage.getItem("jwt") || localStorage.getItem("access_token");

  useEffect(() => {
    dispatch(getUser(jwt));
    if (auth.user?.userId) {
      console.log("hí hí");
      dispatch(getBalanceWallet(auth.user?.userId));
    }
  }, []);

  // Handle select changes for bank
  const handleSelectBankChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      nameBank: value,
    }));
  };

  // Handle select changes for orderInfo
  const handleSelectOrderInfoChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      orderInfo: value,
    }));
  };

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted with:", formData);

    if (
      (wallet.balance.VND < formData.amount) &
      (formData.orderInfo === "WITHDRAW")
    ) {
      setError("Số tiền trong ví không đủ");
      return;
    }

    try {
      // Encode dữ liệu theo kiểu application/x-www-form-urlencoded
      const formEncodedData = qs.stringify({
        amount: formData.amount,
        orderInfo: formData.orderInfo,
        userId: formData.userId || auth.user?.userId,
        nameBank: formData.nameBank,
      });

      const response = await api.post("/payment/submitOrder", formEncodedData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded", // Ghi đè Content-Type
        },
      });

      if (!response.data) {
        throw new Error("Không nhận được dữ liệu từ server");
      }

      console.log("data xem nào", response.data);

      if (
        typeof response.data === "string" &&
        response.data.includes("https://sandbox.vnpayment.vn")
      ) {
        window.location.href = response.data; // Chuyển hướng đến VNPay
      } else {
        console.error("Lỗi: Không nhận được URL thanh toán hợp lệ");
      }
    } catch (error) {
      console.error("Lỗi gửi yêu cầu:", error.response?.data || error.message);
    }
  };

  // Cập nhật orderInfo khi state thay đổi
  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      orderInfo: orderType,
    }));
  }, [orderType]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-center mt-5">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex justify-center">
              {/* Replace the Thymeleaf image with a static or dynamic image in React */}
              <img
                src="https://sandbox.vnpayment.vn/paymentv2/Images/brands/logo.svg" // Update this path based on your project structure or use a URL
                alt="VNPay Logo"
                className="w-50" // Tailwind class for width (adjust as needed)
              />
            </div>
            <CardTitle className="text-center">Tạo Đơn Hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nameBank">Ngân hàng:</Label>
                <Select
                  value={formData.nameBank}
                  onValueChange={handleSelectBankChange}
                  required
                >
                  <SelectTrigger id="nameBank" name="nameBank">
                    <SelectValue placeholder="Chọn thông tin ngân hàng" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="None">Không chọn</SelectItem>
                    <SelectItem value="NCB">NCB Bank</SelectItem>
                    <SelectItem value="MB">MB Bank</SelectItem>
                    <SelectItem value="VCB">Vietin Bank</SelectItem>
                    <SelectItem value="SCB">Sài Gòn Bank</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Số tiền:</Label>
                <Input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleAmountChange} // Updated to use handleAmountChange
                  required
                />

                {error && <div className="text-red-600 text-sm">{error}</div>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="orderInfo">Thông tin đơn hàng:</Label>
                <Select
                  value={formData.orderInfo}
                  onValueChange={handleSelectOrderInfoChange}
                  required
                >
                  <SelectTrigger id="orderInfo" name="orderInfo">
                    <SelectValue placeholder="Chọn thông tin đơn hàng" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* <SelectItem value="Nạp tiền vào ví fiat"> */}
                    <SelectItem value="DEPOSIT">
                      Nạp tiền vào ví fiat
                    </SelectItem>
                    {/* <SelectItem value="Chuyển khoản cho người dùng khác">
                      Chuyển khoản cho người dùng khác
                    </SelectItem> */}
                    {/* <SelectItem value="Rút tiền từ ví fiat"> */}
                    <SelectItem value="WITHDRAW">
                      Rút tiền từ ví fiat
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full">
                Thanh toán
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VnPayOrderForm;
