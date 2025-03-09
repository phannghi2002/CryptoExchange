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

const VnPayOrderForm = () => {
  const location = useLocation(); // Lấy location từ React Router
  console.log("Location:", location); // Kiểm tra giá trị của location
  // const orderType = location.state?.orderInfo || "DEPOSIT"; // Lấy orderInfo từ state, mặc định là DEPOSIT
  const orderType = location.state?.orderInfo; // Lấy orderInfo từ state, mặc định là DEPOSIT

  // State to manage form fields
  const [formData, setFormData] = useState({
    amount: 150000, // Default value from HTML
    // orderInfo: "DEPOSIT", // Default value set to the first option
    orderInfo: orderType, // Đặt mặc định theo state
    // content: "321465464787854778",
    nameBank: "None",
  });

  // Handle input changes for amount
  const handleAmountChange = (event) => {
    setFormData((prevData) => ({
      ...prevData,
      amount: event.target.value, // Update amount
    }));
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted with:", formData);

    try {
      // Construct query parameters including nameBank and content
      const queryParams = new URLSearchParams({
        amount: formData.amount.toString(), // Ensure amount is a string
        orderInfo: encodeURIComponent(formData.orderInfo), // Encode special characters
        nameBank: encodeURIComponent(formData.nameBank), // Include bank name
      }).toString();

      // Send data to backend as query parameters
      const response = await fetch(
        `http://localhost:8087/payment/submitOrder?${queryParams}`,
        {
          method: "POST", // Use POST even with query params if backend expects it
          headers: {
            "Content-Type": "application/x-www-form-urlencoded", // Match the query param format
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.text();

      console.log("data xem nao", data);

      if (
        data &&
        typeof data === "string" &&
        data.includes("https://sandbox.vnpayment.vn")
      ) {
        // Redirect to VNPay payment URL
        window.location.href = data;
      } else {
        console.error("Lỗi: Không nhận được URL thanh toán hợp lệ từ backend");
      }
    } catch (error) {
      console.error("Lỗi gửi yêu cầu:", error.message || error);
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

              {/* <div className="space-y-2">
                <Label htmlFor="content">Nhập nội dung chuyển tiền:</Label>
                <Input
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleContentChange} // Updated to use handleContentChange
                  required
                />
              </div> */}

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
