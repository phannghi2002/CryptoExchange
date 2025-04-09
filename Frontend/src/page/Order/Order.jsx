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
  getHistoryOrder,
  getMyOrderPendingPagination,
  getOrderBuy,
  getOrderPagination,
  getPendingOrder,
} from "@/State/Order/Action";
import { getBalanceWallet, returnCoinWallet } from "@/State/Wallet/Action";
import { Trash2Icon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { showToast } from "@/utils/toast";

// function Order() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const dispatch = useDispatch();
//   const { order, auth } = useSelector((store) => store);

//   const [openModal, setOpenModal] = useState(false);
//   const [pageSize] = useState(6); // Số lượng bản ghi mỗi trang (cố định là 6)

//   // Lấy currentPage từ query string trong URL
//   const queryParams = new URLSearchParams(location.search);
//   const initialPage = parseInt(queryParams.get("page")) || 0;
//   const [currentPage, setCurrentPage] = useState(initialPage);

//   const totalPages = order.totalPages || 0; // Tổng số trang, lấy từ dữ liệu API

//   // Gọi API khi currentPage thay đổi và đồng bộ URL
//   useEffect(() => {
//     if (auth.user?.userId) {
//       dispatch(getOrderPagination(auth.user?.userId, currentPage, pageSize));
//     }
//     navigate(`/order?page=${currentPage}`, { replace: true }); // Cập nhật URL
//   }, [currentPage, dispatch, navigate]);

//   // Gọi getBalanceWallet khi component mount
//   useEffect(() => {
//     if (auth.user?.userId) {
//       dispatch(getBalanceWallet(auth.user?.userId));
//     }
//   }, [dispatch]);

//   // Điều hướng đến trang trước
//   const handlePrevious = () => {
//     if (currentPage > 0) {
//       setCurrentPage(currentPage - 1);
//       navigate(`/order?page=${currentPage - 1}`);
//     }
//   };

//   // Điều hướng đến trang sau
//   const handleNext = () => {
//     if (currentPage < totalPages - 1) {
//       setCurrentPage(currentPage + 1);
//       navigate(`/order?page=${currentPage + 1}`);
//     }
//   };

//   // Điều hướng đến trang cụ thể
//   const handlePageClick = (page) => {
//     setCurrentPage(page);
//     navigate(`/order?page=${page}`);
//   };

//   // Tạo mảng số trang để hiển thị (giới hạn số lượng nút)
//   const getPageNumbers = () => {
//     const maxButtons = 5; // Giới hạn số nút hiển thị
//     const startPage = Math.max(0, currentPage - Math.floor(maxButtons / 2));
//     const endPage = Math.min(totalPages, startPage + maxButtons);
//     return Array.from({ length: endPage - startPage }, (_, i) => startPage + i);
//   };

//   const handleCancelOrder = async (item) => {
//     if (!auth.user?.userId) return;

//     try {
//       await dispatch(cancelOrder(item.id)); // sẽ throw nếu lỗi

//       await dispatch(getPendingOrder(auth.user.userId));

//       showToast("Thành công rồi!", "Đã hủy lệnh thành công", "success");
//     } catch (error) {
//       console.error("Lỗi khi hủy lệnh:", error);
//       const message =
//         error?.response?.data?.message || error?.message || "Đã xảy ra lỗi";
//       showToast("Thất bại rồi!", message, "error");
//     }
//   };

//   const [currentTab, setCurrentTab] = useState("orderPending");

//   useEffect(() => {
//     if (auth.user?.userId) {
//       if (currentTab === "orderPending") {
//         dispatch(getPendingOrder(auth.user?.userId));
//       } else if (currentTab === "orderHistory") {
//         dispatch(getHistoryOrder(auth.user?.userId));
//       }
//     }
//   }, [currentTab, auth.user?.userId]);

//   return (
//     <div className="relative ">
//       <div className="px-5 lg:px-20 ">
//         <h1 className="font-bold text-3xl py-5">
//           Đặt lệnh theo phương thức P2P
//         </h1>

//         <Tabs
//           defaultValue="orderPending"
//           className="w-full bg-"
//           onValueChange={(value) => setCurrentTab(value)}
//         >
//           <TabsList className="grid w-full grid-cols-2">
//             <TabsTrigger value="orderPending">Lệnh đang thực hiện</TabsTrigger>
//             <TabsTrigger value="orderHistory">Lịch sử lệnh</TabsTrigger>
//           </TabsList>
//           <TabsContent value="orderPending">
//             <Table className="border border-gray-700">
//               <TableHeader>
//                 <TableRow>
//                   <TableHead className="py-5 border border-gray-700">
//                     Mã lệnh
//                   </TableHead>
//                   <TableHead className="border border-gray-700">Coin</TableHead>
//                   <TableHead className="border border-gray-700">
//                     Số lượng
//                   </TableHead>
//                   <TableHead className="border border-gray-700">
//                     Số lượng còn lại
//                   </TableHead>
//                   <TableHead className="border border-gray-700">
//                     Nhỏ nhất
//                   </TableHead>
//                   <TableHead className="border border-gray-700">Giá</TableHead>
//                   <TableHead className="border border-gray-700">
//                     Lớn nhất
//                   </TableHead>
//                   <TableHead className="border border-gray-700">
//                     Thời gian tối đa thanh toán
//                   </TableHead>
//                   <TableHead className="border border-gray-700">
//                     Thời gian đặt lệnh
//                   </TableHead>
//                   <TableHead className="border border-gray-700">
//                     Trạng thái
//                   </TableHead>
//                   <TableHead className="text-right border border-gray-700">
//                     Hủy bỏ giao dịch
//                   </TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {order?.pendingOrder.map((item, index) => (
//                   <TableRow key={index} className="h-[60px]">
//                     <TableCell
//                       className="border border-gray-700"
//                       onClick={() => navigate(`/order/${item.orderId}`)}
//                     >
//                       {item.orderId}
//                     </TableCell>
//                     <TableCell
//                       className="border border-gray-700"
//                       onClick={() => navigate(`/order/${item.orderId}`)}
//                     >
//                       {item.coin}
//                     </TableCell>
//                     <TableCell
//                       className="border border-gray-700"
//                       onClick={() => navigate(`/order/${item.orderId}`)}
//                     >
//                       {item.amount}
//                     </TableCell>
//                     <TableCell
//                       className="border border-gray-700"
//                       onClick={() => navigate(`/order/${item.orderId}`)}
//                     >
//                       {item.remainingAmount}
//                     </TableCell>
//                     <TableCell
//                       className="border border-gray-700"
//                       onClick={() => navigate(`/order/${item.orderId}`)}
//                     >
//                       {item.price.toLocaleString()}
//                     </TableCell>
//                     <TableCell
//                       className="border border-gray-700"
//                       onClick={() => navigate(`/order/${item.orderId}`)}
//                     >
//                       {item.minimum.toLocaleString()}
//                     </TableCell>
//                     <TableCell
//                       className="border border-gray-700"
//                       onClick={() => navigate(`/order/${item.orderId}`)}
//                     >
//                       {item.maximum.toLocaleString()}
//                     </TableCell>
//                     <TableCell
//                       className="border border-gray-700"
//                       onClick={() => navigate(`/order/${item.orderId}`)}
//                     >
//                       {item.paymentDeadline}
//                     </TableCell>
//                     <TableCell
//                       className="border border-gray-700"
//                       onClick={() => navigate(`/order/${item.orderId}`)}
//                     >
//                       {new Date(item.createdAt).toLocaleString("vi-VN")}
//                     </TableCell>
//                     <TableCell
//                       className="border border-gray-700"
//                       onClick={() => navigate(`/order/${item.orderId}`)}
//                     >
//                       {item.status}
//                     </TableCell>

//                     <TableCell className="border border-gray-700">
//                       <Button onClick={() => handleCancelOrder(item)}>
//                         <Trash2Icon />
//                       </Button>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//                 {order?.pendingOrder.length === 0 && (
//                   <TableRow>
//                     <TableCell
//                       colSpan="11"
//                       className="text-center p-4 border border-gray-700"
//                     >
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         width="24"
//                         height="24"
//                         viewBox="0 0 24 24"
//                         fill="none"
//                         stroke="currentColor"
//                         strokeWidth="2"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         className="h-12 w-12 text-gray-400 mx-auto mb-2"
//                       >
//                         <circle cx="12" cy="12" r="10" />
//                         <line x1="12" y1="8" x2="12" y2="12" />
//                         <line x1="12" y1="16" x2="12" y2="16" />
//                       </svg>
//                       <p className="text-gray-500">
//                         Bạn không có lệnh đang trạng thái chờ.
//                       </p>
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           </TabsContent>
//           <TabsContent value="orderHistory">
//             <Table className="border border-gray-700">
//               <TableHeader>
//                 <TableRow>
//                   <TableHead className="py-5 border border-gray-700">
//                     Mã lệnh
//                   </TableHead>
//                   <TableHead className="border border-gray-700">Coin</TableHead>
//                   <TableHead className="border border-gray-700">
//                     Số lượng
//                   </TableHead>
//                   <TableHead className="border border-gray-700">
//                     Số lượng còn lại
//                   </TableHead>
//                   <TableHead className="border border-gray-700">
//                     Nhỏ nhất
//                   </TableHead>
//                   <TableHead className="border border-gray-700">Giá</TableHead>
//                   <TableHead className="border border-gray-700">
//                     Lớn nhất
//                   </TableHead>
//                   <TableHead className="border border-gray-700">
//                     Thời gian tối đa thanh toán
//                   </TableHead>
//                   <TableHead className="border border-gray-700">
//                     Thời gian đặt lệnh
//                   </TableHead>
//                   <TableHead className="border border-gray-700">
//                     Trạng thái
//                   </TableHead>
//                   <TableHead className="border border-gray-700">
//                     Thời gian hủy lệnh
//                   </TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {order?.historyOrder.map((item, index) => (
//                   <TableRow key={index} className="h-[60px]">
//                     <TableCell
//                       className="border border-gray-700"
//                       onClick={() => navigate(`/order/${item.orderId}`)}
//                     >
//                       {item.orderId}
//                     </TableCell>
//                     <TableCell
//                       className="border border-gray-700"
//                       onClick={() => navigate(`/order/${item.orderId}`)}
//                     >
//                       {item.coin}
//                     </TableCell>
//                     <TableCell
//                       className="border border-gray-700"
//                       onClick={() => navigate(`/order/${item.orderId}`)}
//                     >
//                       {item.amount}
//                     </TableCell>
//                     <TableCell
//                       className="border border-gray-700"
//                       onClick={() => navigate(`/order/${item.orderId}`)}
//                     >
//                       {item.remainingAmount}
//                     </TableCell>
//                     <TableCell
//                       className="border border-gray-700"
//                       onClick={() => navigate(`/order/${item.orderId}`)}
//                     >
//                       {item.price.toLocaleString()}
//                     </TableCell>
//                     <TableCell
//                       className="border border-gray-700"
//                       onClick={() => navigate(`/order/${item.orderId}`)}
//                     >
//                       {item.minimum.toLocaleString()}
//                     </TableCell>
//                     <TableCell
//                       className="border border-gray-700"
//                       onClick={() => navigate(`/order/${item.orderId}`)}
//                     >
//                       {item.maximum.toLocaleString()}
//                     </TableCell>
//                     <TableCell
//                       className="border border-gray-700"
//                       onClick={() => navigate(`/order/${item.orderId}`)}
//                     >
//                       {item.paymentDeadline}
//                     </TableCell>
//                     <TableCell
//                       className="border border-gray-700"
//                       onClick={() => navigate(`/order/${item.orderId}`)}
//                     >
//                       {new Date(item.createdAt).toLocaleString("vi-VN")}
//                     </TableCell>
//                     <TableCell
//                       className="border border-gray-700"
//                       onClick={() => navigate(`/order/${item.orderId}`)}
//                     >
//                       {item.status}
//                     </TableCell>
//                     <TableCell
//                       className="border border-gray-700"
//                       onClick={() => navigate(`/order/${item.orderId}`)}
//                     >
//                       {new Date(item.updatedAt).toLocaleString("vi-VN")}
//                     </TableCell>
//                   </TableRow>
//                 ))}
//                 {order?.historyOrder.length === 0 && (
//                   <TableRow>
//                     <TableCell
//                       colSpan="10"
//                       className="text-center p-4 border border-gray-700"
//                     >
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         width="24"
//                         height="24"
//                         viewBox="0 0 24 24"
//                         fill="none"
//                         stroke="currentColor"
//                         strokeWidth="2"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         className="h-12 w-12 text-gray-400 mx-auto mb-2"
//                       >
//                         <circle cx="12" cy="12" r="10" />
//                         <line x1="12" y1="8" x2="12" y2="12" />
//                         <line x1="12" y1="16" x2="12" y2="16" />
//                       </svg>
//                       <p className="text-gray-500">
//                         Bạn không có lịch sử lệnh P2P.
//                       </p>
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           </TabsContent>
//         </Tabs>
//       </div>

//       {/* Phân trang cố định */}
//       {order.totalPages > 1 && (
//         <div className="fixed bottom-40 left-0 right-0 flex justify-center items-center space-x-2 px-5">
//           {order.totalPages >= 3 && (
//             <Button
//               onClick={handlePrevious}
//               disabled={currentPage === 0}
//               className="bg-gray-700 text-white hover:bg-gray-600 px-4 py-2"
//             >
//               Previous
//             </Button>
//           )}

//           {getPageNumbers().map((page) => (
//             <Button
//               key={page}
//               onClick={() => handlePageClick(page)}
//               className={`px-4 py-2 ${
//                 currentPage === page
//                   ? "bg-[#32D993] text-black"
//                   : "bg-gray-700 text-white hover:bg-gray-600"
//               }`}
//             >
//               {page + 1}
//             </Button>
//           ))}

//           {order.totalPages >= 3 && (
//             <Button
//               onClick={handleNext}
//               disabled={currentPage >= totalPages - 1}
//               className="bg-gray-700 text-white hover:bg-gray-600 px-4 py-2"
//             >
//               Next
//             </Button>
//           )}
//         </div>
//       )}

//       {/* Nút Đặt lệnh cố định */}
//       <div className="fixed bottom-20 left-0 right-0 flex justify-center">
//         <Button
//           onClick={() => setOpenModal(true)}
//           className="bg-[#32D993] text-white hover:bg-[#2EBD85] px-4 py-2"
//         >
//           Đặt lệnh
//         </Button>

//         <OpenCreateModal
//           open={openModal}
//           setOpen={setOpenModal}
//           page={currentPage}
//           size={pageSize}
//         />
//       </div>
//     </div>
//   );
// }

function Order() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { order, auth } = useSelector((store) => store);

  const [openModal, setOpenModal] = useState(false);
  const [pageSize] = useState(6); // Số lượng bản ghi mỗi trang (cố định là 6)

  // Lấy currentPage từ query string trong URL
  const queryParams = new URLSearchParams(location.search);
  const initialPage = parseInt(queryParams.get("page")) || 0;
  const [currentPage, setCurrentPage] = useState(initialPage);

  const totalPages = order.totalPagesPending || 0; // Tổng số trang, lấy từ dữ liệu API

  // Gọi API khi currentPage thay đổi và đồng bộ URL
  useEffect(() => {
    // if (auth.user?.userId) {
    //   dispatch(getOrderPagination(auth.user?.userId, currentPage, pageSize));
    // }

    if (auth.user?.userId) {
      dispatch(getMyOrderPendingPagination(auth.user?.userId, currentPage));
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

  const handleCancelOrder = async (item) => {
    if (!auth.user?.userId) return;

    try {
      await dispatch(cancelOrder(item.id)); // sẽ throw nếu lỗi

      await dispatch(getPendingOrder(auth.user.userId));

      showToast("Thành công rồi!", "Đã hủy lệnh thành công", "success");
    } catch (error) {
      console.error("Lỗi khi hủy lệnh:", error);
      const message =
        error?.response?.data?.message || error?.message || "Đã xảy ra lỗi";
      showToast("Thất bại rồi!", message, "error");
    }
  };

  const [currentTab, setCurrentTab] = useState("orderPending");

  useEffect(() => {
    if (auth.user?.userId) {
      if (currentTab === "orderPending") {
        // dispatch(getPendingOrder(auth.user?.userId));
        dispatch(getMyOrderPendingPagination(auth.user?.userId, 0));
      } else if (currentTab === "orderHistory") {
        dispatch(getHistoryOrder(auth.user?.userId));
      }
    }
  }, [currentTab, auth.user?.userId]);

  const [currentTabBuy, setCurrentTabBuy] = useState("orderPendingBuy");

  useEffect(() => {
    if (auth.user?.userId) {
      if (currentTabBuy === "orderPendingBuy") {
        dispatch(getOrderBuy(auth.user?.userId, "GROUP_2"));
      } else if (currentTabBuy === "orderHistoryBuy") {
        dispatch(getOrderBuy(auth.user?.userId, "GROUP_1"));
      }
    }
  }, [currentTabBuy, auth.user?.userId]);

  return (
    <div className="relative ">
      <div className="px-5 lg:px-20 ">
        <div className="flex justify-between items-center">
          <h1 className="font-bold text-3xl py-5">
            Đặt lệnh bán theo phương thức P2P
          </h1>

          <Button
            onClick={() => setOpenModal(true)}
            className="bg-[#32D993] text-white hover:bg-[#2EBD85] px-4 py-2 w-[40%]"
          >
            Đặt lệnh bán
          </Button>
        </div>

        <Tabs
          defaultValue="orderPending"
          className="w-full bg-"
          onValueChange={(value) => setCurrentTab(value)}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="orderPending">
              Lệnh bán đang thực hiện
            </TabsTrigger>
            <TabsTrigger value="orderHistory">Lịch sử lệnh bán</TabsTrigger>
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
                  <TableHead className="border border-gray-700">Giá</TableHead>
                  <TableHead className="border border-gray-700">
                    Nhỏ nhất
                  </TableHead>
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
                {order?.pendingOrderPagination.map((item, index) => (
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
                {order?.pendingOrderPagination.length === 0 && (
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
                        Bạn không có lệnh bán đang trạng thái chờ.
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
                  <TableHead className="border border-gray-700">Giá</TableHead>
                  <TableHead className="border border-gray-700">
                    Nhỏ nhất
                  </TableHead>
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
                    Thời gian hủy lệnh
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
                      {new Date(item.updatedAt).toLocaleString("vi-VN")}
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
                        Bạn không có lịch sử lệnh bán P2P.
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </div>

      {/* Phân trang cố định */}
      {order?.totalPagesPending > 1 && currentTab === "orderPending" && (
        <div className="flex justify-center items-center space-x-2 px-5 mt-6">
          {order.totalPagesPending >= 3 && (
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

          {order.totalPagesPending >= 3 && (
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

      {/* {order?.totalPagesPending > 1 && (
        <div className="fixed bottom-40 left-0 right-0 flex justify-center items-center space-x-2 px-5">
          {order.totalPagesPending >= 3 && (
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

          {order.totalPagesPending >= 3 && (
            <Button
              onClick={handleNext}
              disabled={currentPage >= totalPages - 1}
              className="bg-gray-700 text-white hover:bg-gray-600 px-4 py-2"
            >
              Next
            </Button>
          )}
        </div>
      )} */}

      <div className="px-5 lg:px-20 py-12">
        <div className="flex justify-between items-center">
          <h1 className="font-bold text-3xl py-5">
            Lệnh mua theo phương thức P2P
          </h1>

          <Button
            onClick={() => navigate("/market")}
            className="bg-[#32D993] text-white hover:bg-[#2EBD85] px-4 py-2 w-[40%]"
          >
            Đặt lệnh mua
          </Button>
        </div>

        <Tabs
          defaultValue="orderPendingBuy"
          className="w-full bg-"
          onValueChange={(value) => setCurrentTabBuy(value)}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="orderPendingBuy">
              Lệnh mua đang thực hiện
            </TabsTrigger>
            <TabsTrigger value="orderHistoryBuy">Lịch sử lệnh mua</TabsTrigger>
          </TabsList>
          <TabsContent value="orderPendingBuy">
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
                    Số tiền
                  </TableHead>
                  <TableHead className="border border-gray-700">
                    Thời gian đặt lệnh
                  </TableHead>
                  <TableHead className="border border-gray-700">
                    Phương thức thanh toán
                  </TableHead>
                  <TableHead className="border border-gray-700">
                    Trạng thái
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order?.orderBuy.map((item, index) => (
                  <TableRow key={index} className="h-[60px]">
                    <TableCell className="border border-gray-700">
                      {item.subOrderId}
                    </TableCell>
                    <TableCell className="border border-gray-700">
                      {item.coin}
                    </TableCell>
                    <TableCell className="border border-gray-700">
                      {item.amount}
                    </TableCell>

                    <TableCell className="border border-gray-700">
                      {item.priceVnd.toLocaleString()}
                    </TableCell>

                    <TableCell className="border border-gray-700">
                      {new Date(item.createAt).toLocaleString("vi-VN")}
                    </TableCell>

                    <TableCell className="border border-gray-700">
                      {item.paymentMethods === "BANK_TRANSFER"
                        ? "Chuyển khoản ngân hàng"
                        : "Chuyển tiền qua ví fiat"}
                    </TableCell>
                    <TableCell className="border border-gray-700">
                      {item.status}
                    </TableCell>
                  </TableRow>
                ))}
                {order?.orderBuy.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan="7"
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
                        Bạn không có lệnh mua đang trạng thái chờ hoặc thanh
                        toán.
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TabsContent>
          <TabsContent value="orderHistoryBuy">
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
                    Số tiền
                  </TableHead>
                  <TableHead className="border border-gray-700">
                    Thời gian đặt lệnh
                  </TableHead>

                  <TableHead className="border border-gray-700">
                    Phương thức thanh toán
                  </TableHead>
                  <TableHead className="border border-gray-700">
                    Trạng thái
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order?.orderBuy.map((item, index) => (
                  <TableRow key={index} className="h-[60px]">
                    <TableCell className="border border-gray-700">
                      {item.subOrderId}
                    </TableCell>
                    <TableCell className="border border-gray-700">
                      {item.coin}
                    </TableCell>
                    <TableCell className="border border-gray-700">
                      {item.amount}
                    </TableCell>

                    <TableCell className="border border-gray-700">
                      {item.priceVnd.toLocaleString()}
                    </TableCell>

                    <TableCell className="border border-gray-700">
                      {new Date(item.createAt).toLocaleString("vi-VN")}
                    </TableCell>

                    <TableCell className="border border-gray-700">
                      {item.paymentMethods === "BANK_TRANSFER"
                        ? "Chuyển khoản ngân hàng"
                        : "Chuyển tiền qua ví fiat"}
                    </TableCell>
                    <TableCell className="border border-gray-700">
                      {item.status}
                    </TableCell>
                  </TableRow>
                ))}
                {order?.orderBuy.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan="7"
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
                        Bạn không có lịch sử lệnh mua P2P.
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </div>

      <OpenCreateModal
        open={openModal}
        setOpen={setOpenModal}
        page={currentPage}
        size={pageSize}
      />
    </div>
  );
}

export default Order;
