import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import OpenCreateModal from "@/modal/OpenCreateOrder";
import {
  cancelOrder,
  getAnotherOrder,
  getHistoryOrder,
  getMyOrder,
  getOrderPagination,
  getPendingOrder,
} from "@/State/Order/Action";
import { getBalanceWallet, returnCoinWallet } from "@/State/Wallet/Action";
import { Trash2Icon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { showToast } from "@/utils/toast";

function Order() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { order, auth } = useSelector((store) => store);

  console.log("ow kia 2");

  // useEffect(() => {
  //   if (auth.user?.userId) {
  //     console.log("ow kia");
  //     dispatch(getMyOrder(auth.user?.userId));
  //   }
  // }, []);

  const [openModal, setOpenModal] = useState(false);
  const [pageSize] = useState(6); // Số lượng bản ghi mỗi trang (cố định là 6)

  // Lấy currentPage từ query string trong URL
  const queryParams = new URLSearchParams(location.search);
  const initialPage = parseInt(queryParams.get("page")) || 0;
  const [currentPage, setCurrentPage] = useState(initialPage);

  const totalPages = order.totalPages || 0; // Tổng số trang, lấy từ dữ liệu API

  // Gọi API khi currentPage thay đổi và đồng bộ URL
  useEffect(() => {
    if (auth.user?.userId) {
      dispatch(getOrderPagination(auth.user?.userId, currentPage, pageSize));
    }
    navigate(`/order?page=${currentPage}`, { replace: true }); // Cập nhật URL
  }, [currentPage, dispatch, navigate]);

  // Gọi getBalanceWallet khi component mount
  useEffect(() => {
    if (auth.user?.userId) {
      dispatch(getBalanceWallet(auth.user?.userId));
    }
  }, [dispatch]);

  // Điều hướng đến trang trước
  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      navigate(`/order?page=${currentPage - 1}`);
    }
  };

  // Điều hướng đến trang sau
  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
      navigate(`/order?page=${currentPage + 1}`);
    }
  };

  // Điều hướng đến trang cụ thể
  const handlePageClick = (page) => {
    setCurrentPage(page);
    navigate(`/order?page=${page}`);
  };

  // Tạo mảng số trang để hiển thị (giới hạn số lượng nút)
  const getPageNumbers = () => {
    const maxButtons = 5; // Giới hạn số nút hiển thị
    const startPage = Math.max(0, currentPage - Math.floor(maxButtons / 2));
    const endPage = Math.min(totalPages, startPage + maxButtons);
    return Array.from({ length: endPage - startPage }, (_, i) => startPage + i);
  };

  // const handleCancelOrder = (item) => {
  //   console.log("in item", item);
  //   if (auth.user?.userId) {
  //     dispatch(cancelOrder(item.id));
  //     dispatch(
  //       returnCoinWallet(auth.user?.userId, {
  //         amount: item.remainingAmount,
  //         currency: item.coin,
  //       })
  //     );
  //     dispatch(getPendingOrder(auth.user?.userId));
  //   }
  // };

  const handleCancelOrder = (item) => {
    console.log("in item", item);
    if (auth.user?.userId) {
      dispatch(cancelOrder(item.id))
        .then(() => {
          return dispatch(
            returnCoinWallet(auth.user?.userId, {
              amount: item.remainingAmount,
              currency: item.coin,
            })
          );
        })
        .then(() => {
          return dispatch(getPendingOrder(auth.user?.userId));
        })
        .then(() => {
          console.log("Hủy lệnh thành công!");
          showToast("Thành công rồi!", "Đã hủy lệnh thành công", "success");
        })
        .catch((error) => {
          console.error("Lỗi khi hủy lệnh:", error);
          showToast("Thất bại rồi!", "Đã xảy ra lỗi", "success");
        });
    }
  };

  const [currentTab, setCurrentTab] = useState("orderPending");

  useEffect(() => {
    if (auth.user?.userId) {
      if (currentTab === "orderPending") {
        dispatch(getPendingOrder(auth.user?.userId));
      } else if (currentTab === "orderHistory") {
        dispatch(getHistoryOrder(auth.user?.userId));
      }
    }
  }, [currentTab, auth.user?.userId]);

  return (
    <div className="relative ">
      <div className="px-5 lg:px-20 ">
        <h1 className="font-bold text-3xl py-5">
          Đặt lệnh theo phương thức P2P
        </h1>

        <Tabs
          defaultValue="orderPending"
          className="w-full bg-"
          onValueChange={(value) => setCurrentTab(value)}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="orderPending">Lệnh đang thực hiện</TabsTrigger>
            <TabsTrigger value="orderHistory">Lịch sử lệnh</TabsTrigger>
          </TabsList>
          <TabsContent value="orderPending">
            <Table className="border border-gray-700">
              <TableHeader>
                <TableRow>
                  <TableHead className="py-5 border border-gray-700">
                    Mã lệnh
                  </TableHead>
                  <TableHead className="border border-gray-700">Coin</TableHead>
                  <TableHead className="border border-gray-700">
                    Số lượng
                  </TableHead>
                  <TableHead className="border border-gray-700">
                    Số lượng còn lại
                  </TableHead>
                  <TableHead className="border border-gray-700">
                    Nhỏ nhất
                  </TableHead>
                  <TableHead className="border border-gray-700">Giá</TableHead>
                  <TableHead className="border border-gray-700">
                    Lớn nhất
                  </TableHead>
                  <TableHead className="border border-gray-700">
                    Thời gian tối đa thanh toán
                  </TableHead>
                  <TableHead className="border border-gray-700">
                    Thời gian đặt lệnh
                  </TableHead>
                  <TableHead className="border border-gray-700">
                    Trạng thái
                  </TableHead>
                  <TableHead className="text-right border border-gray-700">
                    Hủy bỏ giao dịch
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order?.pendingOrder.map((item, index) => (
                  <TableRow key={index} className="h-[60px]">
                    <TableCell
                      className="border border-gray-700"
                      onClick={() => navigate(`/order/${item.orderId}`)}
                    >
                      {item.orderId}
                    </TableCell>
                    <TableCell
                      className="border border-gray-700"
                      onClick={() => navigate(`/order/${item.orderId}`)}
                    >
                      {item.coin}
                    </TableCell>
                    <TableCell
                      className="border border-gray-700"
                      onClick={() => navigate(`/order/${item.orderId}`)}
                    >
                      {item.amount}
                    </TableCell>
                    <TableCell
                      className="border border-gray-700"
                      onClick={() => navigate(`/order/${item.orderId}`)}
                    >
                      {item.remainingAmount}
                    </TableCell>
                    <TableCell
                      className="border border-gray-700"
                      onClick={() => navigate(`/order/${item.orderId}`)}
                    >
                      {item.price.toLocaleString()}
                    </TableCell>
                    <TableCell
                      className="border border-gray-700"
                      onClick={() => navigate(`/order/${item.orderId}`)}
                    >
                      {item.minimum.toLocaleString()}
                    </TableCell>
                    <TableCell
                      className="border border-gray-700"
                      onClick={() => navigate(`/order/${item.orderId}`)}
                    >
                      {item.maximum.toLocaleString()}
                    </TableCell>
                    <TableCell
                      className="border border-gray-700"
                      onClick={() => navigate(`/order/${item.orderId}`)}
                    >
                      {item.paymentDeadline}
                    </TableCell>
                    <TableCell
                      className="border border-gray-700"
                      onClick={() => navigate(`/order/${item.orderId}`)}
                    >
                      {new Date(item.createdAt).toLocaleString("vi-VN")}
                    </TableCell>
                    <TableCell
                      className="border border-gray-700"
                      onClick={() => navigate(`/order/${item.orderId}`)}
                    >
                      {item.status}
                    </TableCell>

                    <TableCell className="border border-gray-700">
                      <Button onClick={() => handleCancelOrder(item)}>
                        <Trash2Icon />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {order?.pendingOrder.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan="11"
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
                      <p className="text-gray-500">
                        Bạn không có lệnh đang trạng thái chờ.
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TabsContent>
          <TabsContent value="orderHistory">
            <Table className="border border-gray-700">
              <TableHeader>
                <TableRow>
                  <TableHead className="py-5 border border-gray-700">
                    Mã lệnh
                  </TableHead>
                  <TableHead className="border border-gray-700">Coin</TableHead>
                  <TableHead className="border border-gray-700">
                    Số lượng
                  </TableHead>
                  <TableHead className="border border-gray-700">
                    Số lượng còn lại
                  </TableHead>
                  <TableHead className="border border-gray-700">
                    Nhỏ nhất
                  </TableHead>
                  <TableHead className="border border-gray-700">Giá</TableHead>
                  <TableHead className="border border-gray-700">
                    Lớn nhất
                  </TableHead>
                  <TableHead className="border border-gray-700">
                    Thời gian tối đa thanh toán
                  </TableHead>
                  <TableHead className="border border-gray-700">
                    Thời gian đặt lệnh
                  </TableHead>
                  <TableHead className="border border-gray-700">
                    Trạng thái
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order?.historyOrder.map((item, index) => (
                  <TableRow key={index} className="h-[60px]">
                    <TableCell
                      className="border border-gray-700"
                      onClick={() => navigate(`/order/${item.orderId}`)}
                    >
                      {item.orderId}
                    </TableCell>
                    <TableCell
                      className="border border-gray-700"
                      onClick={() => navigate(`/order/${item.orderId}`)}
                    >
                      {item.coin}
                    </TableCell>
                    <TableCell
                      className="border border-gray-700"
                      onClick={() => navigate(`/order/${item.orderId}`)}
                    >
                      {item.amount}
                    </TableCell>
                    <TableCell
                      className="border border-gray-700"
                      onClick={() => navigate(`/order/${item.orderId}`)}
                    >
                      {item.remainingAmount}
                    </TableCell>
                    <TableCell
                      className="border border-gray-700"
                      onClick={() => navigate(`/order/${item.orderId}`)}
                    >
                      {item.price.toLocaleString()}
                    </TableCell>
                    <TableCell
                      className="border border-gray-700"
                      onClick={() => navigate(`/order/${item.orderId}`)}
                    >
                      {item.minimum.toLocaleString()}
                    </TableCell>
                    <TableCell
                      className="border border-gray-700"
                      onClick={() => navigate(`/order/${item.orderId}`)}
                    >
                      {item.maximum.toLocaleString()}
                    </TableCell>
                    <TableCell
                      className="border border-gray-700"
                      onClick={() => navigate(`/order/${item.orderId}`)}
                    >
                      {item.paymentDeadline}
                    </TableCell>
                    <TableCell
                      className="border border-gray-700"
                      onClick={() => navigate(`/order/${item.orderId}`)}
                    >
                      {new Date(item.createdAt).toLocaleString("vi-VN")}
                    </TableCell>
                    <TableCell
                      className="border border-gray-700"
                      onClick={() => navigate(`/order/${item.orderId}`)}
                    >
                      {item.status}
                    </TableCell>
                  </TableRow>
                ))}
                {order?.historyOrder.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan="10"
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
                      <p className="text-gray-500">
                        Bạn không có lịch sử lệnh P2P.
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>

        {/* <Table className="border border-gray-700">
          <TableHeader>
            <TableRow>
              <TableHead className="py-5 border border-gray-700">
                Mã lệnh
              </TableHead>
              <TableHead className="border border-gray-700">Coin</TableHead>
            
              <TableHead className="border border-gray-700">Số lượng</TableHead>
              <TableHead className="border border-gray-700">
                Số lượng còn lại
              </TableHead>
              <TableHead className="border border-gray-700">Nhỏ nhất</TableHead>
              <TableHead className="border border-gray-700">Giá</TableHead>
              <TableHead className="border border-gray-700">Lớn nhất</TableHead>
              <TableHead className="border border-gray-700">
                Thời gian tối đa thanh toán
              </TableHead>
              <TableHead className="border border-gray-700">
                Thời gian đặt lệnh
              </TableHead>
              <TableHead className="border border-gray-700">
                Trạng thái
              </TableHead>
              <TableHead className="text-right border border-gray-700">
                Hủy bỏ giao dịch
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {order.listOrder.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={11}
                  className="text-center text-gray-500 py-4"
                >
                  Hiện tại bạn chưa đặt lệnh bán nào cả.
                </TableCell>
              </TableRow>
            ) : (
              order.listOrder.map((item, index) => (
                <TableRow key={index} className="h-[60px]">
                  <TableCell
                    className="border border-gray-700"
                    onClick={() => navigate(`/order/${item.orderId}`)}
                  >
                    {item.orderId}
                  </TableCell>
                  <TableCell
                    className="border border-gray-700"
                    onClick={() => navigate(`/order/${item.orderId}`)}
                  >
                    {item.coin}
                  </TableCell>
                  <TableCell
                    className="border border-gray-700"
                    onClick={() => navigate(`/order/${item.orderId}`)}
                  >
                    {item.amount}
                  </TableCell>
                  <TableCell
                    className="border border-gray-700"
                    onClick={() => navigate(`/order/${item.orderId}`)}
                  >
                    {item.remainingAmount}
                  </TableCell>
                  <TableCell
                    className="border border-gray-700"
                    onClick={() => navigate(`/order/${item.orderId}`)}
                  >
                    {item.price.toLocaleString()}
                  </TableCell>
                  <TableCell
                    className="border border-gray-700"
                    onClick={() => navigate(`/order/${item.orderId}`)}
                  >
                    {item.minimum.toLocaleString()}
                  </TableCell>
                  <TableCell
                    className="border border-gray-700"
                    onClick={() => navigate(`/order/${item.orderId}`)}
                  >
                    {item.maximum.toLocaleString()}
                  </TableCell>
                  <TableCell
                    className="border border-gray-700"
                    onClick={() => navigate(`/order/${item.orderId}`)}
                  >
                    {item.paymentDeadline}
                  </TableCell>
                  <TableCell
                    className="border border-gray-700"
                    onClick={() => navigate(`/order/${item.orderId}`)}
                  >
                    {new Date(item.createdAt).toLocaleString("vi-VN")}
                  </TableCell>
                  <TableCell
                    className="border border-gray-700"
                    onClick={() => navigate(`/order/${item.orderId}`)}
                  >
                    {item.status}
                  </TableCell>

                  <TableCell className="border border-gray-700">
                    <Button onClick={() => handleCancelOrder(item)}>
                      <Trash2Icon />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table> */}
      </div>

      {/* Phân trang cố định */}
      {order.totalPages > 1 && (
        <div className="fixed bottom-40 left-0 right-0 flex justify-center items-center space-x-2 px-5">
          {order.totalPages >= 3 && (
            <Button
              onClick={handlePrevious}
              disabled={currentPage === 0}
              className="bg-gray-700 text-white hover:bg-gray-600 px-4 py-2"
            >
              Previous
            </Button>
          )}

          {getPageNumbers().map((page) => (
            <Button
              key={page}
              onClick={() => handlePageClick(page)}
              className={`px-4 py-2 ${
                currentPage === page
                  ? "bg-[#32D993] text-black"
                  : "bg-gray-700 text-white hover:bg-gray-600"
              }`}
            >
              {page + 1}
            </Button>
          ))}

          {order.totalPages >= 3 && (
            <Button
              onClick={handleNext}
              disabled={currentPage >= totalPages - 1}
              className="bg-gray-700 text-white hover:bg-gray-600 px-4 py-2"
            >
              Next
            </Button>
          )}
        </div>
      )}

      {/* Nút Đặt lệnh cố định */}
      <div className="fixed bottom-20 left-0 right-0 flex justify-center">
        <Button
          onClick={() => setOpenModal(true)}
          className="bg-[#32D993] text-white hover:bg-[#2EBD85] px-4 py-2"
        >
          Đặt lệnh
        </Button>

        <OpenCreateModal
          open={openModal}
          setOpen={setOpenModal}
          page={currentPage}
          size={pageSize}
        />
      </div>
    </div>
  );
}

export default Order;
