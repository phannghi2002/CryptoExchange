import { getSingleOrder } from "@/State/Order/Action";
import { formatDateTime } from "@/utils/formatDate";
import {
  CheckCircleIcon,
  CircleDashedIcon,
  CircleOffIcon,
  CircleXIcon,
  ClockArrowUpIcon,
} from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

function OrderDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

  // const listOrder = useSelector((store) => store.order.listOrder);

  // console.log("list Order:", listOrder);

  // const matchedOrder = listOrder.find((order) => order.orderId === id);

  // console.log("Matched Order:", matchedOrder);
  // const subOrders = matchedOrder?.subOrders;
  const order = useSelector((store) => store.order.order);

  const subOrders = order?.subOrders;

  useEffect(() => {
    if (id) {
      dispatch(getSingleOrder(id));
    }
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-4">Chi tiết đơn hàng</h2>
      <div className="space-y-4">
        {subOrders ? (
          subOrders.map((order, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">
                  Mã đơn: {order.subOrderId}
                </span>
                <span className="text-sm text-gray-500">
                  {formatDateTime(order.createAt)}
                </span>
              </div>
              <div className="text-gray-800">
                <p>
                  <span className="font-semibold">Người mua:</span>{" "}
                  {order.buyerId}
                </p>
                <p>
                  <span className="font-semibold">Số tiền:</span> {order.amount}{" "}
                  USDT
                </p>
                <p>
                  <span className="font-semibold">Phương thức thanh toán:</span>{" "}
                  {order.paymentMethods == "BANK_TRANSFER"
                    ? "Chuyển khoản ngân hàng"
                    : "Chuyển tiền qua ví fiat"}
                </p>
                <p className="flex items-center gap-1">
                  <span className="font-semibold">Trạng thái:</span>{" "}
                  <span
                    className={`flex items-center gap-1 font-bold ${
                      order.status === "SUCCESS"
                        ? "text-green-600"
                        : order.status === "PENDING"
                        ? "text-yellow-600"
                        : order.status === "IN_PROGRESS"
                        ? "text-blue-600"
                        : order.status === "FAILED"
                        ? "text-red-600"
                        : "text-gray-600"
                    }`}
                  >
                    {order.status === "SUCCESS" ? (
                      <CheckCircleIcon className="w-4 h-4" />
                    ) : order.status === "PENDING" ? (
                      <CircleDashedIcon className="w-4 h-4" />
                    ) : order.status === "IN_PROGRESS" ? (
                      <ClockArrowUpIcon className="w-4 h-4" />
                    ) : order.status === "FAILED" ? (
                      <CircleXIcon className="w-4 h-4" />
                    ) : (
                      <CircleOffIcon />
                    )}
                    {order.status}
                  </span>
                </p>

                {order.paymentMethods === "BANK_TRANSFER" && (
                  <p className="flex items-center gap-1">
                    <span className="font-semibold">
                      Hạn cuối thời gian thanh toán:
                    </span>{" "}
                    {formatDateTime(order.paymentDeadline)}
                  </p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>Hiện tại chưa có giao dịch nào</p>
        )}
      </div>
    </div>
  );
}

export default OrderDetails;
