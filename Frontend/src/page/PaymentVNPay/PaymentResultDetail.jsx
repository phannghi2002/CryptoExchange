/* eslint-disable react/prop-types */
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

const PaymentResultDetail = ({ transaction, onClose }) => {
  if (!transaction) return null; // Nếu chưa có transaction, không hiển thị

  const {
    transactionNo,
    amount,
    paymentTime,
    status,
    transactionType,
    responseCode,
  } = transaction;
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
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-90">
      <Card className="w-full max-w-2xl bg-gray-900 text-white p-5 rounded-lg shadow-lg">
        <CardHeader>
          <CardTitle
            className={`text-center text-lg font-bold ${
              status === "SUCCESS" ? "text-green-400" : "text-red-500"
            }`}
          >
            {status === "SUCCESS"
              ? "Giao dịch thành công"
              : "Giao dịch thất bại"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <h2 className="text-lg font-semibold mb-4 text-white">
            Chi tiết đơn hàng
          </h2>
          <Table className="border border-gray-600">
            <TableHeader>
              <TableRow className="border-b border-gray-600">
                <TableHead className="text-white">Thông tin</TableHead>
                <TableHead className="text-white">Giá trị</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="border-b border-gray-600">
                <TableCell className="text-white">Loại giao dịch:</TableCell>
                <TableCell className="text-white">
                  {transactionType === "DEPOSIT" ? "Nạp tiền" : "Rút tiền"}
                </TableCell>
              </TableRow>
              <TableRow className="border-b border-gray-600">
                <TableCell className="text-white">Số tiền:</TableCell>
                <TableCell className="text-white">
                  {amount.toLocaleString()} VND
                </TableCell>
              </TableRow>
              <TableRow className="border-b border-gray-600">
                <TableCell className="text-white">Thời gian:</TableCell>
                <TableCell className="text-white">
                  {new Date(paymentTime).toLocaleString("vi-VN")}
                </TableCell>
              </TableRow>
              <TableRow className="border-b border-gray-600">
                <TableCell className="text-white">Mã giao dịch:</TableCell>
                <TableCell className="text-white">{transactionNo}</TableCell>
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
            </TableBody>
          </Table>
          <div className="mt-4 flex justify-center">
            <Button
              className="bg-white text-black hover:bg-gray-300"
              onClick={onClose}
            >
              Đóng
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentResultDetail;
