import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    // Use searchParams.get() directly instead of Object.fromEntries
    console.log(
      "VNPay Return Parameters in PaymentResult:",
      Object.fromEntries(searchParams.entries())
    );

    // Try to determine the result from query parameters using searchParams.get()
    const result = searchParams.get("result") || "orderFailed";
    const orderId = searchParams.get("orderId") || "[order ID]";
    const totalPrice = searchParams.get("totalPrice") || "[total price]";
    const paymentTime = searchParams.get("paymentTime") || "[payment time]";
    const transactionId =
      searchParams.get("transactionId") || "[transaction ID]";

    const responseCode = searchParams.get("responseCode") || "[response Code]";

    // Decode orderId if needed
    let decodedOrderId = orderId;
    try {
      decodedOrderId = decodeURIComponent(orderId);
    } catch (e) {
      console.error("Error decoding orderId:", e);
      decodedOrderId = "[Unknown]";
    }

    // Format totalPrice
    let formattedTotalPrice = totalPrice;
    if (formattedTotalPrice && !isNaN(formattedTotalPrice)) {
      formattedTotalPrice = Number(formattedTotalPrice / 100).toLocaleString(
        "vi-VN"
      ); // Format as Vietnamese currency (e.g., 44,444,400)
    } else {
      formattedTotalPrice = "[Unknown]";
    }

    // Format paymentTime if it’s in "yyyyMMddHHmmss" format
    let formattedPaymentTime = paymentTime;
    if (formattedPaymentTime && formattedPaymentTime.length === 14) {
      // e.g., "20250302114241"
      const year = formattedPaymentTime.substring(0, 4);
      const month = formattedPaymentTime.substring(4, 6);
      const day = formattedPaymentTime.substring(6, 8);
      const hour = formattedPaymentTime.substring(8, 10);
      const minute = formattedPaymentTime.substring(10, 12);
      const second = formattedPaymentTime.substring(12, 14);
      formattedPaymentTime = `${day}/${month}/${year} ${hour}:${minute}:${second}`;
    } else if (formattedPaymentTime) {
      console.warn("Unexpected paymentTime format:", formattedPaymentTime);
      formattedPaymentTime = "[Unknown]";
    }

    setPaymentData({
      result,
      orderId: decodedOrderId,
      totalPrice: formattedTotalPrice,
      paymentTime: formattedPaymentTime,
      transactionId,
      responseCode,
    });
  }, [searchParams]);

  if (!paymentData) {
    return (
      <div className="container mx-auto p-4 text-center">
        Đang tải dữ liệu...
      </div>
    );
  }

  const {
    result,
    orderId,
    totalPrice,
    paymentTime,
    transactionId,
    responseCode,
  } = paymentData;

  const checkResponseCode = {
    "00": "Giao dịch thành công",
    "07": "Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).",
    "09": "Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.",
    10: "Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần.",
    11: "Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.",
    12: "Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.",
    13: "Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP). Xin quý khách vui lòng thực hiện lại giao dịch.",
    24: "Giao dịch không thành công do: Khách hàng hủy giao dịch.",
    51: "Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.",
    65: "Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.",
    75: "Ngân hàng thanh toán đang bảo trì.",
    79: "Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định. Xin quý khách vui lòng thực hiện lại giao dịch.",
    99: "Các lỗi khác (lỗi còn lại, không có trong danh sách mã lỗi đã liệt kê).",
  };

  return (
    <div className="container mx-auto p-5">
      <div className="flex justify-center">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle
              className={`text-center ${
                result === "orderSuccess" ? "text-green-600" : "text-red-600"
              }`}
            >
              Giao dịch {result === "orderSuccess" ? "thành công" : "thất bại"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <h2 className="text-lg font-semibold mb-4">Chi tiết đơn hàng</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Thông tin</TableHead>
                  <TableHead>Giá trị</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Thông tin đơn hàng:</TableCell>
                  <TableCell>
                    {orderId === "DEPOSIT"
                      ? "Nạp tiền vào ví fiat"
                      : "Rút tiền từ ví fiat"}
                  </TableCell>
                </TableRow>
                {responseCode !== "00" && (
                  <TableRow>
                    <TableCell>Lỗi:</TableCell>
                    <TableCell>
                      {checkResponseCode[String(responseCode)] ||
                        "Lỗi không xác định"}
                    </TableCell>
                  </TableRow>
                )}
                <TableRow>
                  <TableCell>Tổng tiền:</TableCell>
                  <TableCell>{totalPrice}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Thời gian thanh toán:</TableCell>
                  <TableCell>{paymentTime}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Mã giao dịch:</TableCell>
                  <TableCell>{transactionId}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <div className="mt-4 flex justify-center">
              <Button asChild>
                <a href="/wallet">Về ví tiền</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentResult;
