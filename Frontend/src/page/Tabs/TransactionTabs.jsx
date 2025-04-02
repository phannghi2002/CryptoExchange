import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateTime } from "@/utils/formatDate";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { returnCoinWallet } from "@/State/Wallet/Action";
import {
  getAllAnotherStatusPendingSwapOrderLimit,
  getAllOpenOrderTransactionSwapOrderLimit,
  updateTransactionSwapOrderLimit,
} from "@/State/Transaction/Action";

const TransactionTabs = () => {
  const { transaction, auth } = useSelector((store) => store);
  const dispatch = useDispatch();

  const [currentTab, setCurrentTab] = useState("openOrders");

  const handleCancelOrderLimit = (order) => {
    dispatch(
      returnCoinWallet(order.userId, {
        currency: order.originCoin,
        amount: order.originAmount,
      })
    );
    dispatch(updateTransactionSwapOrderLimit("FAILED", order.id))
      .then(() => {
        dispatch(getAllOpenOrderTransactionSwapOrderLimit(order.userId));
      })
      .catch((error) => {
        console.error("Lỗi khi cập nhật giao dịch:", error);
      });
  };
  useEffect(() => {
    if (auth.user?.userId) {
      dispatch(getAllOpenOrderTransactionSwapOrderLimit(auth.user.userId));
      dispatch(getAllAnotherStatusPendingSwapOrderLimit(auth.user.userId));
    }
  }, [dispatch, auth.user?.userId]);

  useEffect(() => {
    if (auth.user?.userId) {
      dispatch(getAllOpenOrderTransactionSwapOrderLimit(auth.user.userId));
      dispatch(getAllAnotherStatusPendingSwapOrderLimit(auth.user.userId));
    }
  }, [currentTab, dispatch, auth.user?.userId]);

  return (
    <div className="p-5">
      <Tabs
        defaultValue="openOrders"
        className="w-full"
        onValueChange={(value) => setCurrentTab(value)}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="openOrders">
            Giao dịch đang chờ khớp lệnh
          </TabsTrigger>
          <TabsTrigger value="closedOrders">Lịch sử lệnh</TabsTrigger>
        </TabsList>
        <TabsContent value="openOrders">
          <Table className="border border-gray-700">
            <TableHeader>
              <TableRow>
                <TableHead className="border  border-gray-700 w-[15%]">
                  Trạng thái khớp lệnh
                </TableHead>
                <TableHead className="border border-gray-700 w-[15%]">
                  Ngày giờ
                </TableHead>
                <TableHead className="border border-gray-700 w-[12%]">
                  Cặp
                </TableHead>
                <TableHead className="border border-gray-700 w-[10%]">
                  Bên
                </TableHead>
                <TableHead className="border border-gray-700 w-[10%]">
                  Giá
                </TableHead>
                <TableHead className="border border-gray-700 w-[15%]">
                  Số lượng (Nhận được)
                </TableHead>

                <TableHead className="border border-gray-700 w-[12%]">
                  Tổng (Mất đi)
                </TableHead>
                <TableHead className="border border-gray-700">
                  Hủy bỏ giao dịch
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transaction?.openOrderLimit.map((order, index) => (
                <TableRow key={index}>
                  <TableCell className="border border-gray-700">
                    PENDING
                  </TableCell>
                  <TableCell className="border border-gray-700">
                    {formatDateTime(order.timestamp)}
                  </TableCell>
                  <TableCell className="border border-gray-700">
                    {order.pair}
                  </TableCell>
                  <TableCell className="border border-gray-700">
                    {order.type === "BUY" ? "Mua" : "Bán"}
                  </TableCell>
                  <TableCell className="border border-gray-700">
                    {order.type === "BUY"
                      ? order.originAmount
                      : order.targetAmount}
                  </TableCell>
                  <TableCell className="border border-gray-700">
                    {order.type === "BUY" ? order.targetAmount : order.total}
                  </TableCell>
                  <TableCell className="border border-gray-700">
                    {order.type === "BUY" ? order.total : order.originAmount}
                  </TableCell>

                  <TableCell className="border border-gray-700">
                    <Button onClick={() => handleCancelOrderLimit(order)}>
                      <Trash2Icon />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {transaction?.openOrderLimit.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan="8"
                    className="text-center p-4 border border-gray-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-12 w-12 text-gray-400 mx-auto mb-2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12" y2="16" />
                    </svg>
                    <p className="text-gray-500">Bạn không có lệnh đang mở.</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TabsContent>
        <TabsContent value="closedOrders">
          <Table className="border border-gray-600">
            <TableHeader>
              <TableRow>
                <TableHead className="border  border-gray-700 w-[18%]">
                  Trạng thái khớp lệnh
                </TableHead>
                <TableHead className="border  border-gray-700 w-[18%]">
                  Ngày giờ
                </TableHead>
                <TableHead className="border  border-gray-700 w-[14%]">
                  Cặp
                </TableHead>
                <TableHead className="border  border-gray-700 w-[12%]">
                  Bên
                </TableHead>
                <TableHead className="border  border-gray-700 w-[12%]">
                  Giá
                </TableHead>
                <TableHead className="border  border-gray-700">
                  Số lượng (Nhận được)
                </TableHead>
                <TableHead className="border  border-gray-700">
                  {" "}
                  Tổng (Mất đi)
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transaction?.notOpenOrderLimit.map((order, index) => (
                <TableRow key={index}>
                  <TableCell className="border  border-gray-700">
                    {order.status}
                  </TableCell>
                  <TableCell className="border  border-gray-700">
                    {formatDateTime(order.timestamp)}
                  </TableCell>
                  <TableCell className="border  border-gray-700">
                    {order.pair}
                  </TableCell>
                  <TableCell className="border  border-gray-700">
                    {order.type === "BUY" ? "Mua" : "Bán"}
                  </TableCell>
                  <TableCell className="border  border-gray-700">
                    {order.type === "BUY"
                      ? order.originAmount
                      : order.targetAmount}
                  </TableCell>
                  <TableCell className="border  border-gray-700">
                    {order.type === "BUY" ? order.targetAmount : order.total}
                  </TableCell>
                  <TableCell className="border  border-gray-700">
                    {order.type === "BUY" ? order.total : order.originAmount}
                  </TableCell>
                </TableRow>
              ))}
              {transaction?.notOpenOrderLimit.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan="7"
                    className="text-center p-4 border  border-gray-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-12 w-12 text-gray-400 mx-auto mb-2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12" y2="16" />
                    </svg>
                    <p className="text-gray-500">Bạn không có lịch sử lệnh.</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TransactionTabs;
