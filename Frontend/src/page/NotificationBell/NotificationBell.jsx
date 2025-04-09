import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@radix-ui/react-dropdown-menu";
import {
  deleteNotify,
  deleteNotifyReadHandled,
  getNotifyUser,
  putNotifyConverHandle,
  putNotifyConvertRead,
} from "@/State/Notify/Action";
import { BellIcon, Trash2Icon, XIcon } from "lucide-react";
import styles from "./NotificationBell.module.css";
import {
  getBank,
  getOrderNotify,
  getSingleOrder,
  updateStatusOfBankTransfer,
} from "@/State/Order/Action";
import { formatNumberWithCommas } from "@/utils/formatNumberWithCommas";
import { formatDateTime } from "@/utils/formatDate";
import { showToast } from "@/utils/toast";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const NotificationBell = () => {
  const dispatch = useDispatch();
  const { auth, notify, order } = useSelector((store) => store);
  const { notifyList, unreadCount } = notify;

  const [localNotifications, setLocalNotifications] = useState([]);
  const [localUnreadCount, setLocalUnreadCount] = useState(0);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const isLoggedIn =
    !!localStorage.getItem("jwt") || !!localStorage.getItem("access_token");

  useEffect(() => {
    if (isLoggedIn && auth.user?.userId) {
      dispatch(getNotifyUser(auth?.user.userId));
      dispatch(getBank(auth.user?.userId));
    }
  }, [dispatch, isLoggedIn, auth.user?.userId]);

  useEffect(() => {
    setLocalNotifications(notifyList || []);
    setLocalUnreadCount(unreadCount || 0);
  }, [notifyList, unreadCount]);

  useEffect(() => {
    if (!isLoggedIn || !auth.user?.userId) return;

    const socket = new SockJS("http://localhost:8086/notification/ws");
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
      stompClient.subscribe(
        `/topic/notifications/${auth.user.userId}`,
        (message) => {
          const notification = JSON.parse(message.body);
          setLocalNotifications((prev) => [notification, ...prev]);
          setLocalUnreadCount((prev) => prev + 1);
        }
      );
    });

    return () => {
      stompClient.disconnect();
    };
  }, [isLoggedIn, auth.user?.userId]);

  const [open, setOpen] = useState(false);

  const handleOpenChange = (isOpen) => {
    setOpen(isOpen);
  };

  const handleNotificationClick = async (notifId, item) => {
    console.log("in item", item, notifId, selectedNotification);

    const notif = localNotifications.find((n) => n.id === notifId);
    setOpen(false);

    if (item.type === "ORDER_PAYMENT") {
      try {
        await dispatch(getOrderNotify(item.data.orderId, item.data.subOrderId));

        // Cập nhật UI sau khi lấy order thành công
        if (!notif || notif.read) {
          setSelectedNotification(notif);
        } else {
          setLocalNotifications((prev) =>
            prev.map((n) => (n.id === notifId ? { ...n, read: true } : n))
          );
          setLocalUnreadCount((prev) => Math.max(prev - 1, 0));
          setSelectedNotification(notif);
        }

        // Nếu chưa đọc thì đánh dấu là đã đọc
        if (!item.read) {
          await dispatch(putNotifyConvertRead(notifId));
          await dispatch(getNotifyUser(auth?.user.userId)); // gọi lại sau khi cập nhật
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin đơn hàng:", error);
        setSelectedNotification(null);
      }
    } else if (item.type === "ORDER_CONFIRM") {
      // Không cần gọi getOrderNotify
      if (!notif || notif.read) {
        setSelectedNotification(notif);
      } else {
        setLocalNotifications((prev) =>
          prev.map((n) => (n.id === notifId ? { ...n, read: true } : n))
        );
        setLocalUnreadCount((prev) => Math.max(prev - 1, 0));
        setSelectedNotification(notif);
      }

      if (!item.read) {
        await dispatch(putNotifyConvertRead(notifId));
        await dispatch(getNotifyUser(auth?.user.userId));
      }
    }
  };

  const handleCloseModal = () => {
    setSelectedNotification(null);
  };

  const handleDeleteNotify = async (notificationId) => {
    console.log("in id cua no", notificationId);

    showToast("Thành công rồi!", "Đã xóa thông báo thành công", "success");

    try {
      await dispatch(deleteNotify(notificationId));
      await dispatch(getNotifyUser(auth?.user.userId));
    } catch (error) {
      console.error("Lỗi khi lấy xóa thông báo:", error);
    }

    setSelectedNotification(null);
    handleCloseModal();
  };

  const handleConfirmReceiveMoney = async () => {
    try {
      // 1. Cập nhật trạng thái chuyển khoản
      await dispatch(
        updateStatusOfBankTransfer(
          order.orderNotify?.orderId,
          order.orderNotify?.subOrderId,
          "SUCCESS"
        )
      );

      // 2. Lấy đơn hàng sau khi cập nhật trạng thái
      await dispatch(getSingleOrder(order.orderNotify?.orderId));

      await dispatch(putNotifyConverHandle(selectedNotification?.id));

      await dispatch(getNotifyUser(auth?.user.userId)); // gọi lại sau khi cập nhật

      // Hiển thị thông báo thành công
      showToast(
        "Thành công rồi!",
        "Hệ thống đã ghi nhận thông tin của bạn. Giao dịch đã hoàn tất",
        "success"
      );

      // Đóng modal
      handleCloseModal();
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái hoặc lấy đơn hàng:", error);
      // Xử lý lỗi nếu cần
    }
  };

  const [showConfirmDeleteAllNotify, setShowConfirmDeleteAllNotify] =
    useState(false);

  if (!isLoggedIn) return null;

  return (
    <>
      <DropdownMenu open={open} onOpenChange={handleOpenChange}>
        <DropdownMenuTrigger asChild>
          <span className="cursor-pointer hover:text-yellow-500 relative">
            <BellIcon className="h-7 w-7" />
            {localUnreadCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
                {localUnreadCount}
              </span>
            )}
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className={`bg-gray-800 text-white p-5 w-80 mr-10 max-h-[345px] overflow-y-auto overflow-x-hidden ${styles.scrollbarContent}
        bg-gray-200 rounded-xl outline-2 outline-yellow-500 p-4 `}
        >
          {localNotifications.length === 0 ? (
            <div>Hiện tại không có thông báo nào</div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-lg">Thông báo</span>
                <button
                  onClick={() => {
                    setShowConfirmDeleteAllNotify(true);
                    setOpen(false);
                  }}
                  className="p-2 rounded hover:bg-gray-700 transition-colors "
                  title="Xóa tất cả thông báo đã đọc"
                >
                  <Trash2Icon className="w-5 h-5 text-white hover:text-yellow-500" />
                </button>
              </div>

              {localNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif.id, notif)}
                  className={`py-3 px-3 mb-3 rounded-md border border-gray-700 cursor-pointer transition-colors duration-200 ${
                    notif.read
                      ? "bg-gray-700 text-gray-400 hover:bg-gray-600"
                      : "bg-yellow-500 text-black font-semibold hover:bg-yellow-400"
                  }`}
                >
                  <div className="flex items-start">
                    <div className="flex-1">
                      <div className="truncate line-clamp-1 max-w-[15rem]">
                        {notif.message || notif.text}
                      </div>
                      <div className="text-xs mt-1">
                        {formatDateTime(notif.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {selectedNotification &&
        selectedNotification?.type === "ORDER_PAYMENT" && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-gray-800 text-white p-6 rounded-2xl w-[450px] shadow-lg">
              <h2 className="text-xl font-bold mb-5 text-center border-b border-gray-600 pb-2">
                Chi tiết thông báo
              </h2>

              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-400">Người mua:</span>{" "}
                  <span className="font-medium text-white">
                    {order.orderNotify?.buyerId}
                  </span>
                </div>

                <div>
                  <span className="text-gray-400">Đơn hàng:</span>{" "}
                  <span className="font-medium text-white">
                    {order.orderNotify?.orderId}
                  </span>
                </div>

                <div>
                  <span className="text-gray-400">Ngân hàng:</span>{" "}
                  <span className="font-medium text-white">
                    {order.bank?.nameBank}
                  </span>
                </div>

                <div>
                  <span className="text-gray-400">Số tài khoản:</span>{" "}
                  <span className="font-medium text-white">
                    {order.bank?.numberAccount}
                  </span>
                </div>

                <div>
                  <span className="text-gray-400">Số tiền:</span>{" "}
                  <span className="font-medium text-white">
                    {formatNumberWithCommas(order.orderNotify?.priceVnd)} VND
                  </span>
                </div>

                <div>
                  <span className="text-gray-400">Nội dung chuyển khoản:</span>{" "}
                  <span className="font-medium text-white">
                    {order.orderNotify?.subOrderId}
                  </span>
                </div>

                <p className="text-gray-300 pt-2 text-sm">
                  Vui lòng kiểm tra tài khoản ngân hàng để xác nhận thông tin.
                </p>
              </div>

              <div className="text-xs text-gray-500 mt-5 mb-4 text-right">
                {formatDateTime(selectedNotification.createdAt)}
              </div>

              <div className="flex flex-row gap-3 justify-between">
                {!selectedNotification?.data?.handleNotify ? (
                  <button
                    onClick={() => handleConfirmReceiveMoney()}
                    className="w-full bg-yellow-500 text-black px-4 py-2 rounded-md hover:bg-yellow-400 font-semibold transition"
                  >
                    Xác nhận đã nhận tiền
                  </button>
                ) : (
                  <button
                    onClick={() => handleDeleteNotify(selectedNotification.id)}
                    className="w-full bg-yellow-500 text-black px-4 py-2 rounded-md hover:bg-yellow-400 font-semibold transition"
                  >
                    Xóa thông báo
                  </button>
                )}

                <button
                  onClick={handleCloseModal}
                  className="w-full  bg-yellow-500 text-black px-4 py-2 rounded-md hover:bg-yellow-400 font-semibold transition"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}

      {selectedNotification &&
        selectedNotification?.type === "ORDER_CONFIRM" && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-gray-800 text-white p-6 rounded-2xl w-[450px] shadow-lg">
              <h2 className="text-xl font-bold mb-5 text-center border-b border-gray-600 pb-2">
                Giao dịch hoàn tất
              </h2>

              <div className="text-sm text-white space-y-4">
                <p>
                  Đơn hàng có mã{" "}
                  <span className="font-semibold text-yellow-400">
                    {/* {order.orderNotify?.orderId} */}

                    {selectedNotification?.data?.subOrderId}
                  </span>{" "}
                  đã được người bán{" "}
                  <span className="font-semibold text-yellow-400">
                    {selectedNotification?.data?.sellerId}
                  </span>{" "}
                  xác nhận thành công.
                </p>
                <p>Giao dịch hoàn tất. Vui lòng kiểm tra ví tiền của bạn.</p>
              </div>

              <div className="text-xs text-gray-500 mt-5 mb-4 text-right">
                {formatDateTime(selectedNotification.createdAt)}
              </div>

              <div className="flex justify-between gap-3">
                <button
                  onClick={() => handleDeleteNotify(selectedNotification.id)}
                  className="bg-yellow-500 w-full text-black px-4 py-2 rounded-md hover:bg-yellow-400 font-semibold transition"
                >
                  Xóa thông báo
                </button>

                <button
                  onClick={handleCloseModal}
                  className="bg-yellow-500 w-full text-black px-4 py-2 rounded-md hover:bg-yellow-400 font-semibold transition"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}

      <Dialog
        open={showConfirmDeleteAllNotify}
        onOpenChange={setShowConfirmDeleteAllNotify}
      >
        <DialogContent
          className="sm:max-w-md bg-[#1F2937] text-white"
          style={{ zIndex: 1001 }}
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="text-red-400 text-lg">
              Xác nhận xóa thông báo
            </DialogTitle>
          </DialogHeader>
          <div className="text-sm">
            Bạn có chắc muốn xóa tất cả thông báo đã đọc và đã được xử lý rồi
            không?
          </div>
          <DialogFooter className="mt-4 flex justify-end gap-2">
            <button
              onClick={() => setShowConfirmDeleteAllNotify(false)}
              className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-500 transition"
            >
              Không
            </button>
            <button
              onClick={async () => {
                const res = await dispatch(
                  deleteNotifyReadHandled(auth?.user?.userId)
                );

                console.log("res", res); // ✅ giờ sẽ thấy { payload: "..." } hoặc { error: "..." }

                setShowConfirmDeleteAllNotify(false);

                if (res?.payload !== "Đã xóa 0 thông báo đã đọc và đã xử lý") {
                  showToast("Thành công", res.payload, "success"); // Hiển thị sau khi dispatch xong
                } else {
                  showToast(
                    "Cảnh báo",
                    "Hiện tại không có thông báo nào phù hợp để xóa",
                    "warning"
                  );
                }

                await dispatch(getNotifyUser(auth?.user?.userId));
              }}
              className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-400 transition"
            >
              Có, xóa thông báo
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NotificationBell;
