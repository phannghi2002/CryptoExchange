import { useState } from "react";

import { showToast } from "@/utils/toast";
import ConfirmModal from "./ConfirmModal";
import { formatNumberWithCommas } from "@/utils/formatNumberWithCommas";
import { useDispatch, useSelector } from "react-redux";
import { updateStatusOfBankTransfer } from "@/State/Order/Action";

const PaymentModal = ({ onClose, timeLeft, orderInfo }) => {
  const [showConfirm, setShowConfirm] = useState(false); // State cho modal xác nhận
  console.log("order ne", orderInfo);

  const dispatch = useDispatch();
  const { order } = useSelector((store) => store);

  // Hàm định dạng thời gian
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };
  const handleRequestClose = () => {
    setShowConfirm(true); // Mở modal xác nhận khi click "X"
  };

  const handleConfirmClose = () => {
    setShowConfirm(false); // Đóng modal xác nhận
    onClose(); // Đóng PaymentModal

    dispatch(
      updateStatusOfBankTransfer(
        orderInfo?.orderId,
        order?.subOrderId,
        "NOT_PAYMENT"
      )
    );

    showToast("Thành công rồi!", "Đã hủy lệnh thành công", "success");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10]">
      <div className="relative bg-[#1F2937] text-white w-[500px] mx-auto p-6 rounded-lg shadow-lg space-y-6 z-20">
        <button
          onClick={handleRequestClose} // Gọi hàm yêu cầu đóng
          className="absolute top-4 right-4 text-white hover:text-red-400 text-2xl font-bold cursor-pointer z-50"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold">Thanh toán cho người bán</h2>
        <div>
          Lệnh mua sẽ bị hủy sau:
          <span className="text-red-400 font-semibold pl-3">
            {formatTime(timeLeft)}
          </span>{" "}
        </div>

        <div className="relative">
          <div className="absolute top-3 left-3 w-px h-[215px] bg-white opacity-30 z-0" />

          <div className="flex items-start gap-3 relative z-10">
            <div className="w-6 h-6 flex items-center justify-center bg-black text-white text-sm transform rotate-45 rounded-md z-10">
              <div className="transform -rotate-45">1</div>
            </div>

            <div>
              <p className="text-white font-semibold">
                Chuyển {formatNumberWithCommas(orderInfo.amount)} đ qua Chuyển
                khoản ngân hàng
              </p>
              <div className="bg-neutral-800 p-4 mt-2 rounded-lg">
                <p>
                  <strong>Bạn thanh toán:</strong>{" "}
                  {formatNumberWithCommas(orderInfo.amount)} ₫
                </p>
                <p>
                  <strong>Name:</strong> {order.bank?.nameAccount}
                </p>
                <p>
                  <strong>Số tài khoản:</strong> {order.bank?.numberAccount}
                </p>
                <p>
                  <strong>Ngân hàng:</strong> {order.bank?.nameBank}
                </p>
                <p>
                  <strong>Nội dung chuyển khoản:</strong> {order?.subOrderId}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 mt-6 relative z-10">
            <div className="h-6 aspect-square flex items-center justify-center bg-black text-white text-sm transform rotate-45 rounded-md z-10">
              <div className="transform -rotate-45">2</div>
            </div>

            <div className="flex-1">
              <p className="text-white">
                Đảm bảo rằng đã thanh toán thành công, rồi{" "}
                <span className="underline">nhấp vào nút bên dưới</span> để
                thông báo cho người bán.
              </p>
              <div className="flex gap-3 mt-4">
                <button
                  className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-500 transition"
                  onClick={() => console.log("kko")}
                >
                  Trợ giúp
                </button>
                <button
                  className="px-4 py-2 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 transition"
                  onClick={() => {
                    showToast(
                      "Thành công rồi!",
                      "Thông tin đã được gửi đến người bán",
                      "success"
                    );

                    dispatch(
                      updateStatusOfBankTransfer(
                        orderInfo.orderId,
                        order.subOrderId,
                        "PENDING"
                      )
                    );

                    onClose();
                  }}
                >
                  Đã chuyển tiền, thông báo cho người bán
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal xác nhận */}
      {showConfirm && (
        <ConfirmModal
          open={showConfirm}
          onCancel={() => setShowConfirm(false)} // Hủy, giữ PaymentModal mở
          onConfirm={handleConfirmClose} // Xác nhận, đóng PaymentModal
        />
      )}
    </div>
  );
};

export default PaymentModal;
