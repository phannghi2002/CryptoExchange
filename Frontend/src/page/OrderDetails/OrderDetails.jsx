import { formatDateTime } from "@/utils/formatDate";
import { CheckCircleIcon } from "lucide-react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

function OrderDetails() {
  const { id } = useParams();

  const listOrder = useSelector((store) => store.order.listOrder);

  console.log("list Order:", listOrder);

  const matchedOrder = listOrder.find((order) => order.orderId === id);

  console.log("Matched Order:", matchedOrder);
  const subOrders = matchedOrder?.subOrders;

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
                  {order.paymentMethods}
                </p>
                <p className="flex items-center gap-1">
                  <span className="font-semibold">Trạng thái:</span>{" "}
                  <span
                    className={`flex items-center gap-1 ${
                      order.status === "SUCCESS"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {order.status === "SUCCESS" && (
                      <CheckCircleIcon className="w-4 h-4" />
                    )}
                    {order.status}
                  </span>
                </p>
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
