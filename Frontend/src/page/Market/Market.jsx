import { getUser } from "@/State/Auth/Action";
import {
  getAnotherOrderPending,
  getBank,
  getTypeAnotherOrderPending,
  getTypeOrder,
  updateOrderBuy,
  updateOrderReturnSubIdBuy,
} from "@/State/Order/Action";
import { getBalanceWallet, updateBuyWallet } from "@/State/Wallet/Action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import BankPaymentModal from "@/modal/BankPaymentModal";
import PaymentModal from "@/modal/PaymentModal";
import { showToast } from "@/utils/toast";

import { UpdateIcon } from "@radix-ui/react-icons";
import { ChevronUpIcon, ClockIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useDebounce } from "use-debounce";

function Market() {
  const list = ["ALL", "USDT", "BTC", "BNB", "ETH", "TRUMP", "DOGE"];
  const [activeTab, setActiveTab] = useState("ALL"); // Mặc định là ALL
  const [selectedPayment, setSelectedPayment] = useState("ALL");

  const transfer = {
    BANK_TRANSFER: "Chuyển khoản ngân hàng",
    WALLET_FIAT: "Chuyển khoản qua ví fiat",
  };

  const checkTransfer = (paymentMethods) => {
    if (!Array.isArray(paymentMethods)) return [];

    return paymentMethods
      .filter((method) => transfer[method]) // chỉ lấy những phương thức có trong object transfer
      .map((method) => transfer[method]); // chuyển sang chuỗi tiếng Việt
  };

  const dispatch = useDispatch();
  const { auth, wallet, order } = useSelector((store) => store);

  const formatNumberWithCommas = (value) => {
    return Number(value).toLocaleString("en-US");
  };

  const coin = activeTab === "ALL" ? "" : activeTab;
  const paymentMethod = selectedPayment === "ALL" ? "" : selectedPayment;
  const [price, setPrice] = useState("");
  const [debouncedPrice] = useDebounce(price, 3000);

  useEffect(() => {
    if (auth.user?.userId) {
      dispatch(getBalanceWallet(auth.user?.userId));
    }
  }, []);

  useEffect(() => {
    console.log("Effect run with:", {
      activeTab,
      selectedPayment,
      debouncedPrice,
      userId: auth.user?.userId,
    });

    if (!auth.user?.userId) return;

    if (activeTab === "ALL" && selectedPayment === "ALL" && !debouncedPrice) {
      dispatch(getAnotherOrderPending(auth.user.userId));
    } else {
      dispatch(
        getTypeAnotherOrderPending(
          auth.user.userId,
          coin,
          paymentMethod,
          debouncedPrice
        )
      );
    }
  }, [debouncedPrice, activeTab, selectedPayment, auth.user?.userId]);

  const [filterBy, setFilterBy] = useState("price");

  // Hàm sắp xếp danh sách đơn hàng theo filterBy
  const sortOrders = (orders) => {
    if (!orders || orders.length === 0) return orders;

    const sortedOrders = [...orders]; // Tạo bản sao để không thay đổi mảng gốc
    switch (filterBy) {
      case "price":
        return sortedOrders.sort((a, b) => Number(a.price) - Number(b.price)); // Sắp xếp theo giá
      case "number":
        // Giả sử có trường completedOrders trong dữ liệu đơn hàng
        return sortedOrders.sort(
          (a, b) => (a.completedOrders || 1500) - (b.completedOrders || 1500)
        ); // Sắp xếp theo số lượng lệnh hoàn tất
      case "rate":
        // Giả sử có trường completionRate trong dữ liệu đơn hàng
        return sortedOrders.sort(
          (a, b) => (a.completionRate || 100) - (b.completionRate || 100)
        ); // Sắp xếp theo tỷ lệ hoàn tất
      default:
        return sortedOrders; // Không sắp xếp nếu không có filter
    }
  };

  const handleUpdate = () => {
    dispatch(getTypeOrder(coin, paymentMethod, debouncedPrice));
  };

  const itemRefs = useRef([]);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const handleBuy = (index) => {
    setSelectedIndex(index);
    const el = itemRefs.current[index];

    if (el) {
      // const top = el.getBoundingClientRect().top + window.pageYOffset - 280;
      const top = el.getBoundingClientRect().top + window.pageYOffset - 400;

      window.scrollTo({
        top,
        behavior: "smooth",
      });
    }
  };

  const [coinInputs, setCoinInputs] = useState({});
  const [displayValues, setDisplayValues] = useState({});
  const [pricePays, setPricePays] = useState({});
  const [invalidInputs, setInvalidInputs] = useState({});
  const [selectedPayments, setSelectedPayments] = useState({});

  // Đảo ngược object: value → key
  const reverseTransfer = Object.fromEntries(
    Object.entries(transfer).map(([key, value]) => [value, key])
  );

  const handleChangeCoin = (e, item, index) => {
    const value = e.target.value;
    setCoinInputs((prev) => ({ ...prev, [index]: value }));

    const parsed = parseFloat(value.replace(",", ""));
    if (isNaN(parsed) || !item.price) {
      setDisplayValues((prev) => ({ ...prev, [index]: "" }));
      setPricePays((prev) => ({ ...prev, [index]: "" }));
      setInvalidInputs((prev) => ({ ...prev, [index]: true }));
      return;
    }

    const vndValue = parsed * item.price;
    const floored = Math.floor(vndValue);

    setDisplayValues((prev) => ({
      ...prev,
      [index]: formatNumberWithCommas(floored),
    }));
    setPricePays((prev) => ({ ...prev, [index]: String(floored) }));

    const isInvalid = floored < item.minimum || floored > item.maximum;
    setInvalidInputs((prev) => ({ ...prev, [index]: isInvalid }));
  };

  const handleChangePayment = (e, item, index) => {
    const rawValue = e.target.value;
    const numericStr = rawValue.replace(/,/g, "");
    const number = Number(numericStr);

    //  Nếu input rỗng: reset state, show placeholder
    if (numericStr === "") {
      setDisplayValues((prev) => ({ ...prev, [index]: "" }));
      setPricePays((prev) => ({ ...prev, [index]: "" }));
      setCoinInputs((prev) => ({ ...prev, [index]: "" }));
      setInvalidInputs((prev) => ({ ...prev, [index]: false }));
      return;
    }

    setDisplayValues((prev) => ({
      ...prev,
      [index]: formatNumberWithCommas(numericStr),
    }));
    setPricePays((prev) => ({ ...prev, [index]: numericStr }));

    if (!isNaN(number) && number >= item.minimum && number <= item.maximum) {
      setInvalidInputs((prev) => ({ ...prev, [index]: false }));

      //  Xác định số chữ số sau dấu phẩy
      const decimalPlaces = item.coin === "USDT" ? 2 : 8;
      const coin = (number / item.price).toFixed(decimalPlaces);

      setCoinInputs((prev) => ({ ...prev, [index]: coin }));
    } else {
      setInvalidInputs((prev) => ({ ...prev, [index]: true }));
      setCoinInputs((prev) => ({ ...prev, [index]: "" }));
    }
  };

  const handlePaymentSuccess = (index) => {
    // 1. Reset trạng thái các ô input
    setDisplayValues((prev) => ({
      ...prev,
      [index]: "",
    }));
    setCoinInputs((prev) => ({
      ...prev,
      [index]: "",
    }));
    setSelectedPayments((prev) => ({
      ...prev,
      [index]: undefined,
    }));
    setPricePays((prev) => ({
      ...prev,
      [index]: "",
    }));
    setInvalidInputs((prev) => ({
      ...prev,
      [index]: false,
    }));

    // 2. Đóng chi tiết đơn hàng
    setSelectedIndex(null);
  };

  const [showModalBank, setShowModalBank] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [timeLeft, setTimeLeft] = useState(0);

  const handleClickBuy = (item, index) => {
    console.log("wallet ne", wallet);
    if (Number(coinInputs[index]) > item.remainingAmount) {
      showToast("Thất bại rồi!", "Vượt quá số dư khả dụng", "error");
      return;
    }

    if (reverseTransfer[selectedPayments[index]] === "WALLET_FIAT") {
      console.log("in tien", wallet?.balance?.VND < Number(pricePays[index]));
      if (wallet?.balance?.VND < Number(pricePays[index])) {
        showToast(
          "Thất bại rồi!",
          "Số tiền trong ví fiat không đủ. Vui lòng nạp thêm tiền",
          "error"
        );
        return;
      } else {
        dispatch(
          updateOrderBuy(
            item.id,
            auth.user?.userId,
            coinInputs[index],
            reverseTransfer[selectedPayments[index]],
            Number(pricePays[index])
          )
        );

        const body = {
          buyerId: auth.user?.userId,
          sellerId: item.userId,
          amountFiat: Number(pricePays[index]),
          amountCrypto: Number(coinInputs[index]),
          cryptoType: item.coin,
        };

        console.log("body ne em", body);
        dispatch(updateBuyWallet(body));

        handlePaymentSuccess(item);
        showToast("Thành công rồi!", "Giao dịch đã được xử lý", "success");

        if (
          activeTab === "ALL" &&
          selectedPayment === "ALL" &&
          !debouncedPrice
        ) {
          dispatch(getAnotherOrderPending(auth.user.userId));
        } else {
          dispatch(
            getTypeAnotherOrderPending(
              auth.user.userId,
              coin,
              paymentMethod,
              debouncedPrice
            )
          );
        }
      }
    } else if (reverseTransfer[selectedPayments[index]] === "BANK_TRANSFER") {
      console.log("Thanh toán qua ngân hàng nhỉ", item);

      setSelectedOrder({
        amount: pricePays[index], // Số tiền Fiat
        price: item.price, // Giá
        usdt: coinInputs[index], // Số USDT nhận
        orderId: item.orderId, // Số lệnh
        // numberOrder: generateRandom20Digits(),
        userId: item.userId,
        paymentDeadline: item.paymentDeadline, // thời gian
      });

      setTimeLeft(item.paymentDeadline * 60);
      setShowModalBank(true); //  mở modal

      showToast("Thành công rồi!", "Đặt lệnh thành công", "success");

      dispatch(
        updateOrderReturnSubIdBuy(
          item.id,
          auth.user?.userId,
          coinInputs[index],
          reverseTransfer[selectedPayments[index]],
          Number(pricePays[index])
        )
      );

      if (activeTab === "ALL" && selectedPayment === "ALL" && !debouncedPrice) {
        dispatch(getAnotherOrderPending(auth.user.userId));
      } else {
        console.log("Dispatching getTypeAnotherOrder");
        dispatch(
          getTypeAnotherOrderPending(
            auth.user.userId,
            coin,
            paymentMethod,
            debouncedPrice
          )
        );
      }
    }
  };

  useEffect(() => {
    if (auth.user?.userId) {
      dispatch(getBank(auth.user?.userId));
    }
  }, []);

  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    if (!showModalBank && !showPaymentModal) return; // Chỉ chạy khi có modal mở

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showModalBank, showPaymentModal]); // Phụ thuộc cả hai trạng thái modal

  return (
    <div className="w-[80%] mx-auto">
      <div className="flex items-center gap-4 pt-2">
        <Button className="bg-[#59616b] text-white hover:bg-[#525e6d] hover:text-white">
          Mua
        </Button>

        <div className="flex gap-3">
          {list.map((item, index) => (
            <span
              key={index}
              onClick={() => setActiveTab(item)}
              className={`px-3 py-2 text-sm rounded cursor-pointer transition-all ${
                activeTab === item
                  ? " text-yellow-400 font-semibold"
                  : "text-white"
              }`}
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="pt-4 flex flex-row justify-between">
        <div className="flex gap-4">
          <Input
            type="number"
            placeholder="Số tiền giao dịch"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border border-gray-600 focus:!border-yellow-400 hover:!border-yellow-400 focus:!ring-0 remove-arrow"
            //  chú ý: ring-0 để tắt hiệu ứng viền ngoài
          />

          <Select
            value={selectedPayment}
            onValueChange={(value) => setSelectedPayment(value)}
          >
            <SelectTrigger className="w-auto border border-gray-600 focus:!border-yellow-400 hover:!border-yellow-400 focus:!ring-0">
              <SelectValue placeholder="Tất cả thanh toán" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="ALL">Tất cả thanh toán</SelectItem>
                <SelectItem value="BANK_TRANSFER">
                  Chuyển khoản ngân hàng
                </SelectItem>
                <SelectItem value="WALLET_FIAT">
                  Chuyển khoản qua ví fiat
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-4">
          <Select
            value={filterBy}
            onValueChange={(value) => setFilterBy(value)} // Cập nhật filterBy khi chọn
          >
            <SelectTrigger className="w-[180px] border border-gray-600 focus:!border-yellow-400 hover:!border-yellow-400 focus:!ring-0">
              <SelectValue placeholder="Lọc theo" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="price">Giá</SelectItem>
                <SelectItem value="number">
                  Số lượng lệnh đã hoàn tất
                </SelectItem>
                <SelectItem value="rate">Tỷ lệ lệnh hoàn tất</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={handleUpdate}>
            {" "}
            <UpdateIcon className="h-7 w-7 p-0 cursor-pointer hover:text-gray-400 ml-auto" />
          </Button>
        </div>
      </div>

      <div className="pt-8">
        <div className="flex border-b py-5 text-[12px] text-gray-400">
          <span className="w-[25%]">Người quảng cáo</span>
          <span className="w-[15%]">Giá</span>
          <span className="w-[20%]">Khả dụng</span>
          <span className="w-[25%]">Thanh toán</span>
          <span className="w-[15%] text-right">Giao dịch</span>
        </div>

        {order.listOrder.length === 0 ? (
          <div className="text-center text-gray-400 py-10 text-sm">
            Không có đơn hàng nào phù hợp cho loại coin này.
          </div>
        ) : (
          sortOrders(order.listOrder).map((item, index) => (
            <div
              className="flex flex-col border-b py-4"
              key={index}
              ref={(el) => (itemRefs.current[index] = el)}
            >
              <div className="flex">
                <span className="w-[25%] space-y-3">
                  <span>{item.userId}</span>
                  <span className="flex items-center">
                    <span>1500 lệnh</span>
                    <span className="pl-2 ml-2 border-l border-gray-300 h-[10px] flex items-center">
                      100% hoàn tất
                    </span>
                  </span>
                  <span className="flex items-center">
                    <ClockIcon className="h-3" /> {item.paymentDeadline} phút
                  </span>
                </span>
                <span className="w-[15%]">
                  <span className="text-xl">
                    {formatNumberWithCommas(item.price)}
                  </span>{" "}
                  <span>VND</span>
                </span>
                <span className="w-[20%] text-sm flex flex-col space-y-3">
                  <span>
                    {item.remainingAmount} {item.coin}
                  </span>
                  <span>
                    {formatNumberWithCommas(item.minimum)}{" "}
                    <span className="underline text-xs">đ</span> -{" "}
                    {formatNumberWithCommas(item.maximum)}{" "}
                    <span className="underline text-xs">đ</span>
                  </span>
                </span>
                <span className="w-[25%] space-y-3">
                  {checkTransfer(item.paymentMethods).map((text, i) => (
                    <p key={i} className="flex items-center">
                      <span className="w-[3px] h-2 bg-yellow-400  mr-2"></span>
                      {text}
                    </p>
                  ))}
                </span>
                <span className="w-[15%] text-right">
                  {selectedIndex === index ? (
                    <Button
                      className=" text-white bg-[#59616b] hover:bg-[#7e8996] px-4 py-2"
                      onClick={() => setSelectedIndex(null)}
                    >
                      Ẩn <ChevronUpIcon />
                    </Button>
                  ) : (
                    <Button
                      className="bg-[#32D993] text-white hover:bg-[#2EBD85] px-4 py-2"
                      onClick={() => handleBuy(index)}
                    >
                      Mua {item.coin}
                    </Button>
                  )}
                </span>
              </div>

              {/* Chi tiết đơn hàng nếu được chọn */}
              {selectedIndex === index && (
                <div className="flex flex-col md:flex-row bg-[#0F0F0F] rounded-lg p-4 gap-4 text-white">
                  {/* BÊN TRÁI - Điều khoản */}
                  <div className="w-full md:w-1/2 bg-[#1C1C1C] p-4 rounded-md">
                    <div className="text-lg font-semibold mb-2">
                      Điều khoản của nhà quảng cáo{" "}
                      <span className="text-red-500">*</span>
                    </div>
                    <p className="text-sm text-gray-300">
                      {item.policy
                        ? item.policy
                        : "Nhà quảng cáo này đã không đặt ra bất kỳ điều khoản nào."}
                    </p>
                  </div>

                  {/* BÊN PHẢI - Giá, số tiền, ngân hàng */}
                  <div className="w-full md:w-1/2 bg-[#1C1C1C] p-4 rounded-md">
                    <div className="flex items-center text-sm mb-3">
                      <span>Giá:</span>
                      <span className="text-green-400 font-semibold ml-3">
                        {formatNumberWithCommas(item.price)} VND
                      </span>
                    </div>

                    <div className="mb-3">
                      <div className="relative w-full">
                        <div
                          className={`bg-[#0F0F0F] border rounded-md w-full px-4 py-4 transition  ${
                            invalidInputs[index]
                              ? "border-red-500"
                              : "border-gray-600 "
                          }`}
                        >
                          {/* ✅ Hàng 1: Label */}
                          <label className="text-sm text-white mb-2 block">
                            Bạn thanh toán
                          </label>

                          {/* ✅ Hàng 2: Input + "Tất cả" */}
                          <div className="flex justify-between items-center">
                            <input
                              type="text"
                              value={displayValues[index] || ""}
                              onChange={(e) =>
                                handleChangePayment(e, item, index)
                              }
                              placeholder={`${formatNumberWithCommas(
                                item.minimum
                              )} - ${formatNumberWithCommas(item.maximum)}`}
                              className="bg-transparent outline-none text-white placeholder:text-gray-500 w-full h-[40px] text-2xl"
                            />

                            {/* Phần "Tất cả" + icon */}
                            <div className="flex items-center gap-1 text-lg ml-3 whitespace-nowrap pr-5">
                              <span
                                className="text-yellow-400 font-semibold cursor-pointer pr-2"
                                onClick={() => {
                                  const max = item.maximum;

                                  setPricePays((prev) => ({
                                    ...prev,
                                    [index]: String(max),
                                  }));
                                  setDisplayValues((prev) => ({
                                    ...prev,
                                    [index]: formatNumberWithCommas(max),
                                  }));
                                  setInvalidInputs((prev) => ({
                                    ...prev,
                                    [index]: false,
                                  }));

                                  if (item.price) {
                                    // ✅ Xác định số chữ số sau dấu phẩy theo loại coin
                                    const decimalPlaces =
                                      item.coin === "USDT" ? 2 : 8;
                                    const coin = (max / item.price).toFixed(
                                      decimalPlaces
                                    );

                                    setCoinInputs((prev) => ({
                                      ...prev,
                                      [index]: coin,
                                    }));
                                  }
                                }}
                              >
                                Tất cả
                              </span>

                              <img
                                src="https://cdn2.iconfinder.com/data/icons/finance-337/24/VND_Currency-512.png"
                                alt="vnd"
                                className="w-6 h-6 rounded-full p-1 bg-white"
                              />
                              <span className="text-pink-400 font-semibold ml-2">
                                VND
                              </span>
                            </div>
                          </div>

                          {/* ✅ Hàng 3: Hiển thị lỗi nếu có */}

                          {invalidInputs[index] && (
                            <p className="text-red-500 text-sm mt-2">
                              Lệnh Giới hạn:{" "}
                              {formatNumberWithCommas(item.minimum)}đ -{" "}
                              {formatNumberWithCommas(item.maximum)}đ
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div
                        className={`relative bg-[#0F0F0F] border rounded-md w-full px-4 py-4 transition ${
                          invalidInputs[index]
                            ? "border-red-500"
                            : "border-gray-600"
                        }`}
                      >
                        <label className="absolute left-4 top-2 text-sm text-white pointer-events-none">
                          Bạn nhận được
                        </label>

                        <div className="pt-5 flex justify-between items-center">
                          <input
                            type="text"
                            // value={coinInput}
                            // onChange={(e) => handleChangeCoin(e, item)}

                            value={coinInputs[index] || ""}
                            onChange={(e) => handleChangeCoin(e, item, index)}
                            placeholder={
                              item.coin === "USDT" ? "0.00" : "0.00000000"
                            }
                            className="bg-transparent outline-none text-white placeholder:text-gray-500 w-full h-[40px] text-2xl"
                          />
                          <span className="text-cyan-400 text-lg pr-1">
                            {item.coin}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-3 w-full">
                      <Select
                        value={selectedPayments[index] || undefined}
                        onValueChange={(value) =>
                          setSelectedPayments((prev) => ({
                            ...prev,
                            [index]: value,
                          }))
                        }
                      >
                        <SelectTrigger className="w-full border h-[60px] border-gray-600  focus:!ring-0 text-white">
                          <SelectValue placeholder="Chọn phương thức thanh toán" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {checkTransfer(item.paymentMethods).map(
                              (text, i) => (
                                <SelectItem
                                  key={i}
                                  value={text}
                                  className="flex items-center gap-2"
                                >
                                  <span className="inline-block w-[3px] h-2 mr-2 bg-yellow-400 "></span>
                                  {text}
                                </SelectItem>
                              )
                            )}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    <button
                      disabled={
                        !coinInputs[index] ||
                        invalidInputs[index] ||
                        !selectedPayments[index]
                      }
                      className={`w-full py-2 rounded-lg font-semibold transition h-[60px] text-lg ${
                        !coinInputs[index] ||
                        invalidInputs[index] ||
                        !selectedPayments[index]
                          ? "bg-[#1b4235] text-gray-500 cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-700 text-white"
                      }`}
                      onClick={() => handleClickBuy(item, index)}
                    >
                      Mua {item.coin}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {showModalBank && !showPaymentModal && (
        <BankPaymentModal
          isOpen={showModalBank}
          onClose={() => setShowModalBank(false)}
          orderInfo={selectedOrder}
          onOpenPaymentModal={() => setShowPaymentModal(true)}
          timeLeft={timeLeft}
        />
      )}

      {showPaymentModal && (
        <PaymentModal
          onClose={() => setShowPaymentModal(false)}
          timeLeft={timeLeft}
          orderInfo={selectedOrder}
        />
      )}
    </div>
  );
}

export default Market;
