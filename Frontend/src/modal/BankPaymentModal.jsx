import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import ConfirmModal from "./ConfirmModal";
import { formatNumberWithCommas } from "@/utils/formatNumberWithCommas";
import { useDispatch, useSelector } from "react-redux";
import { getBank } from "@/State/Order/Action";

const BankPaymentModal = ({
  isOpen,
  onClose,
  orderInfo,
  onOpenPaymentModal,
  timeLeft,
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  console.log("orderInfo", orderInfo);

  const dispatch = useDispatch();
  const { order } = useSelector((store) => store);

  useEffect(() => {
    if (orderInfo.userId) {
      dispatch(getBank(orderInfo.userId));
    }
  }, []);

  console.log("bank ne be yeu", order);

  const handleRequestClose = () => {
    setShowConfirm(true);
  };

  const handleConfirmClose = () => {
    setShowConfirm(false);
    onClose();
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <>
      {/* Modal chính */}
      <Dialog
        open={isOpen}
        onOpenChange={(open) => !open && handleRequestClose()}
      >
        <DialogContent
          className="bg-[#1F2937] text-white sm:max-w-md"
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="text-blue-400 text-xl">
              Đã đặt lệnh:
              {timeLeft > 0 && (
                <div className="text-sm text-red-400 font-semibold">
                  Thanh toán cho người bán trong vòng: {formatTime(timeLeft)}
                </div>
              )}
              {timeLeft === 0 && (
                <div className="text-sm text-red-500 font-semibold">
                  Đã hết thời gian thanh toán!
                </div>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 text-sm">
            <div>
              <span className="text-gray-400">Số tiền Fiat:</span>{" "}
              <span className="font-semibold text-white">
                {formatNumberWithCommas(orderInfo.amount)}đ
              </span>
            </div>
            <div>
              <span className="text-gray-400">Giá:</span>{" "}
              <span className="font-semibold text-white">
                {formatNumberWithCommas(orderInfo.price)} đ
              </span>
            </div>
            <div>
              <span className="text-gray-400">Số lượng nhận:</span>{" "}
              <span className="font-semibold">{orderInfo.usdt} USDT</span>
            </div>
            <div>
              <span className="text-gray-400">Số lệnh:</span>{" "}
              <span className="font-mono">{orderInfo.numberOrder}</span>
            </div>

            <hr className="my-2 border-gray-600" />

            <div>
              <span className="text-yellow-400 font-semibold">
                Cách thanh toán:
              </span>
              <p>Chuyển khoản ngân hàng</p>
              <p className="text-gray-300">
                Số tài khoản: {order.bank?.numberAccount}
              </p>
              <p className="text-gray-300">
                Chủ tài khoản: {order.bank?.nameAccount}
              </p>
              <p className="text-gray-300">Ngân hàng: {order.bank?.nameBank}</p>
              <p className="text-gray-300">
                Nội dung chuyển khoản: {orderInfo.numberOrder}
              </p>
            </div>
          </div>

          <DialogFooter className="mt-6 flex justify-end gap-2">
            <button
              onClick={handleRequestClose}
              className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-500 transition"
            >
              Hủy
            </button>
            <button
              onClick={() => {
                // handleOpenModal();
                onOpenPaymentModal();
                onClose();
                console.log("ahihi");
              }}
              className="px-4 py-2 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 transition"
            >
              Thanh toán
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal xác nhận */}
      {showConfirm && (
        <ConfirmModal
          open={showConfirm}
          onCancel={() => setShowConfirm(false)}
          onConfirm={handleConfirmClose}
        />
      )}
    </>
  );
};

export default BankPaymentModal;
