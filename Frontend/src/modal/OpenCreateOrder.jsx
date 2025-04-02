import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useDispatch, useSelector } from "react-redux";

import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { formatNumberWithCommas } from "@/utils/formatNumberWithCommas";
import {
  createOrder,
  getAllOrder,
  getBank,
  getOrderPagination,
  getPendingOrder,
} from "@/State/Order/Action";
import { showToast } from "@/utils/toast";
import { BankInfoModal, CreateBankInfoModal } from "./BankModal";
import { substractCoinWallet } from "@/State/Wallet/Action";

export default function OpenCreateModal({ open, setOpen, page, size }) {
  const dispatch = useDispatch();
  const { auth } = useSelector((store) => store);

  const [form, setForm] = useState({
    coin: "",
    amount: "",
    price: "",
    paymentMethods: [],
    paymentTimeLimit: "",
    minimum: "",
    maximum: "",
    policy: "",
  });

  const togglePaymentMethod = (method) => {
    setForm((prevForm) => {
      const updatedMethods = prevForm.paymentMethods.includes(method)
        ? prevForm.paymentMethods.filter((m) => m !== method)
        : [...prevForm.paymentMethods, method];
      return { ...prevForm, paymentMethods: updatedMethods };
    });
    setErrors((prev) => ({ ...prev, paymentMethods: "" })); // Xóa lỗi paymentMethods khi thay đổi
    // if (!form.paymentMethods.includes("BANK_TRANSFER") && method === "BANK_TRANSFER") {
    //   setErrors((prev) => ({ ...prev, paymentTimeLimit: "" }));
    // }
  };

  const { wallet, order } = useSelector((store) => store);
  let crypto = wallet.balance.crypto;

  const [errors, setErrors] = useState({});

  const [showBankModal, setShowBankModal] = useState(false);
  const [showCreateBankModal, setShowCreateBankModal] = useState(false);

  const handleConfirmOrder = () => {
    setShowBankModal(false);
    let body = {
      userId: auth.user?.userId, // Giá trị cố định
      coin: form.coin,
      amount: Number(form.amount), // Chuyển thành số
      price: Number(form.price), // Chuyển thành số
      paymentMethods: form.paymentMethods, // Mảng từ form

      minimum: Number(form.minimum), // Chuyển thành số
      maximum: Number(form.maximum), // Chuyển thành số
      policy: form.policy || "", // Nếu không có policy thì để chuỗi rỗng
    };

    if (form.paymentMethods.includes("BANK_TRANSFER")) {
      body = { ...body, paymentTimeLimit: Number(form.paymentTimeLimit) };
    }

    dispatch(createOrder(body));
    dispatch(
      substractCoinWallet(body.userId, {
        amount: body.amount,
        currency: body.coin,
      })
    );

    dispatch(getOrderPagination(page, size));
    dispatch(getPendingOrder(body.userId));
    setOpen(false);

    showToast("Thành công rồi!", "Đã đặt lệnh thành công", "success");
  };

  useEffect(() => {
    if (auth.user?.userId) {
      dispatch(getBank(auth.user?.userId));
    }
  }, []);
  const handleSubmit = async () => {
    let newErrors = {};

    // Kiểm tra các trường bắt buộc
    if (!form.coin) {
      newErrors.coin = "Vui lòng chọn loại tiền cần bán";
    }

    const amount = Number(form.amount);
    if (!form.amount) {
      newErrors.amount = "Vui lòng nhập số lượng";
    } else if (amount <= 0) {
      newErrors.amount = "Số lượng phải lớn hơn 0";
    } else if (form.coin && amount > crypto[form.coin]) {
      newErrors.amount = `Số lượng tối đa cho ${form.coin} là ${
        crypto[form.coin]
      }`;
    }

    if (!form.price) {
      newErrors.price = "Vui lòng nhập giá mong muốn";
    }

    if (form.paymentMethods.length === 0) {
      newErrors.paymentMethods =
        "Vui lòng chọn ít nhất một phương thức thanh toán";
    }
    const minimum = Number(form.minimum);
    if (!form.minimum) {
      newErrors.minimum = "Vui lòng nhập giá trị tối thiểu";
    } else if (minimum < 150000) {
      newErrors.minimum = "Giá trị tối thiểu phải từ 150,000 VND trở lên";
    }

    const maximum = Number(form.maximum);
    if (!form.maximum) {
      newErrors.maximum = "Vui lòng nhập giá trị tối đa";
    } else if (maximum > 10000000000) {
      newErrors.maximum =
        "Giá trị tối đa không được vượt quá 10,000,000,000 VND";
    }

    if (minimum && maximum && minimum >= maximum) {
      newErrors.minimum = "Giá trị tối thiểu phải nhỏ hơn giá trị tối đa";
    }

    if (form.paymentMethods.includes("BANK_TRANSFER")) {
      const timeLimit = Number(form.paymentTimeLimit);
      if (!form.paymentTimeLimit) {
        newErrors.paymentTimeLimit = "Vui lòng nhập thời gian thanh toán";
      } else if (timeLimit < 15 || timeLimit > 35) {
        newErrors.paymentTimeLimit =
          "Thời gian thanh toán phải từ 15 đến 35 phút";
      }
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      if (form.paymentMethods.includes("BANK_TRANSFER")) {
        if (order.bank) {
          // Nếu có thông tin ngân hàng, hiển thị modal xác nhận
          setShowBankModal(true);
        } else {
          // Nếu chưa có thông tin ngân hàng, yêu cầu tạo tài khoản ngân hàng
          setShowCreateBankModal(true);
        }
      } else {
        handleConfirmOrder();
      }
    }

    // if (Object.keys(newErrors).length === 0) {

    //   let body = {
    //     userId: "lananh92", // Giá trị cố định
    //     coin: form.coin,
    //     amount: Number(form.amount), // Chuyển thành số
    //     price: Number(form.price), // Chuyển thành số
    //     paymentMethods: form.paymentMethods, // Mảng từ form

    //     minimum: Number(form.minimum), // Chuyển thành số
    //     maximum: Number(form.maximum), // Chuyển thành số
    //     policy: form.policy || "", // Nếu không có policy thì để chuỗi rỗng
    //   };

    //   if (form.paymentMethods.includes("BANK_TRANSFER")) {
    //     body = { ...body, paymentTimeLimit: Number(form.paymentTimeLimit) };
    //   }

    //   dispatch(createOrder(body));

    //   showToast("Thành công rồi!", "Đã đặt lệnh thành công", "success");

    //   dispatch(getOrderPagination(page, size));
    //   setOpen(false);
    // }
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className=" bg-[#1E1E1E] text-white shadow-lg rounded-xl border border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">Thông tin Đặt Lệnh</DialogTitle>
          </DialogHeader>

          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Cột trái */}
            <div className="space-y-4">
              {/* Coin Select */}
              <div>
                <Label
                  htmlFor="sellCurrency"
                  className="text-gray-300 flex items-center"
                >
                  Chọn loại tiền cần bán:{" "}
                  <span className="text-red-600 font-bold text-2xl ml-1">
                    *
                  </span>
                </Label>
                <Select
                  value={form.coin}
                  onValueChange={(value) => setForm({ ...form, coin: value })}
                  required
                >
                  <SelectTrigger
                    id="sellCurrency"
                    name="sellCurrency"
                    className="py-6 bg-[#2A2A2A] text-white border border-gray-600"
                  >
                    <SelectValue placeholder="Chọn tiền điện tử">
                      {form.coin}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-[#2A2A2A] text-white">
                    {Object.keys(crypto).map((coin) => (
                      <SelectItem
                        key={coin}
                        value={coin}
                        className="hover:bg-[#3A3A3A]"
                      >
                        {coin}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {errors.coin && (
                  <p className="text-red-600 text-sm mt-1">{errors.coin}</p>
                )}
              </div>

              {/* Amount */}
              <div>
                <Label
                  htmlFor="amount"
                  className="text-gray-300 flex items-center cursor-pointer"
                >
                  Số lượng:{" "}
                  <span className="text-red-600 font-bold text-2xl ml-1">
                    *
                  </span>
                </Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  onChange={(e) => {
                    setForm({ ...form, amount: e.target.value });
                    setErrors((prev) => ({ ...prev, amount: "" })); // Xóa lỗi maximum
                  }}
                  value={form.amount}
                  className="py-6 bg-[#2A2A2A] text-white border border-gray-600"
                  placeholder="Nhập số lượng"
                />
                {errors.amount && (
                  <p className="text-red-600 text-sm mt-1">{errors.amount}</p>
                )}
              </div>

              {/* Price */}
              <div>
                <Label
                  htmlFor="price"
                  className="text-gray-300 flex items-center cursor-pointer"
                >
                  Giá mong muốn / 1 đơn vị:
                  <span className="text-red-600 font-bold text-2xl ml-1">
                    *
                  </span>
                </Label>

                <Input
                  id="price"
                  name="price"
                  type="text" // Chuyển từ type="number" sang type="text"
                  onChange={(e) => {
                    // Loại bỏ tất cả ký tự không phải số (dấu phẩy, chữ, v.v.)
                    const rawValue = e.target.value.replace(/[^0-9]/g, "");
                    // Cập nhật form.price với giá trị số nguyên
                    setForm({ ...form, price: rawValue });
                    setErrors((prev) => ({ ...prev, price: "" })); // Xóa lỗi price nếu có
                  }}
                  value={form.price ? formatNumberWithCommas(form.price) : ""} // Hiển thị giá trị có dấu phẩy
                  className="py-6 bg-[#2A2A2A] text-white border border-gray-600"
                  placeholder="Giá (VND)"
                />
                {errors.price && (
                  <p className="text-red-600 text-sm mt-1">{errors.price}</p>
                )}
              </div>

              {/* Payment Methods */}
              <div>
                <Label className="text-gray-300 flex items-center">
                  Phương thức thanh toán:{" "}
                  <span className="text-red-600 font-bold text-2xl ml-1">
                    *
                  </span>
                </Label>

                <div className="flex flex-col space-y-2 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="walletFiat"
                      checked={form.paymentMethods.includes("WALLET_FIAT")}
                      onCheckedChange={() => togglePaymentMethod("WALLET_FIAT")}
                    />
                    <label htmlFor="walletFiat" className="text-gray-300">
                      Chuyển tiền trong ví fiat
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="bankTransfer"
                      checked={form.paymentMethods.includes("BANK_TRANSFER")}
                      onCheckedChange={() =>
                        togglePaymentMethod("BANK_TRANSFER")
                      }
                    />
                    <label htmlFor="bankTransfer" className="text-gray-300">
                      Chuyển khoản ngân hàng
                    </label>
                  </div>
                </div>
                {errors.paymentMethods && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.paymentMethods}
                  </p>
                )}
              </div>
            </div>

            {/* Cột phải */}
            <div className="space-y-4">
              {/* Minimum */}
              <div>
                <Label
                  htmlFor="minimum"
                  className="text-gray-300 flex items-center cursor-pointer"
                >
                  Giá trị tối thiểu:
                  <span className="text-red-600 font-bold text-2xl ml-1">
                    *
                  </span>
                </Label>
                <Input
                  id="minimum"
                  name="minimum"
                  className="py-6 bg-[#2A2A2A] text-white border border-gray-600"
                  placeholder="Giá trị tối thiểu (VND)"
                  type="text"
                  value={
                    form.minimum ? formatNumberWithCommas(form.minimum) : ""
                  } // Hiển thị giá trị có dấu phẩy
                  onChange={(e) => {
                    const rawValue = e.target.value.replace(/[^0-9]/g, "");
                    setForm({ ...form, minimum: rawValue });
                    setErrors((prev) => ({ ...prev, minimum: "" })); // Xóa lỗi minimum
                  }}
                />
                {errors.minimum && (
                  <p className="text-red-600 text-sm mt-1">{errors.minimum}</p>
                )}
              </div>

              {/* Maximum */}
              <div>
                <Label
                  htmlFor="maximum"
                  className="text-gray-300 flex items-center cursor-pointer"
                >
                  Giá trị tối đa:
                  <span className="text-red-600 font-bold text-2xl ml-1">
                    *
                  </span>
                </Label>
                <Input
                  id="maximum"
                  name="maximum"
                  className="py-6 bg-[#2A2A2A] text-white border border-gray-600"
                  placeholder="Giá trị tối đa (VND)"
                  type="text"
                  value={
                    form.maximum ? formatNumberWithCommas(form.maximum) : ""
                  }
                  onChange={(e) => {
                    const rawValue = e.target.value.replace(/[^0-9]/g, "");
                    setForm({ ...form, maximum: rawValue });
                    setErrors((prev) => ({ ...prev, maximum: "" })); // Xóa lỗi maximum
                  }}
                />
                {errors.maximum && (
                  <p className="text-red-600 text-sm mt-1">{errors.maximum}</p>
                )}
              </div>

              {/* Policy */}
              <div>
                <Label
                  className="text-gray-300 cursor-pointer"
                  htmlFor="policy"
                >
                  Chính sách giao dịch:
                </Label>

                <Textarea
                  id="policy"
                  name="policy"
                  className={`bg-[#2A2A2A] text-white border border-gray-600 ${
                    form.paymentMethods.includes("BANK_TRANSFER")
                      ? "h-16"
                      : "h-40"
                  }`}
                  placeholder="Chính sách giao dịch"
                  value={form.policy}
                  onChange={(e) => setForm({ ...form, policy: e.target.value })}
                />
              </div>

              {/* Payment Time Limit (chỉ hiển thị khi có BANK_TRANSFER) */}
              {form.paymentMethods.includes("BANK_TRANSFER") && (
                <div>
                  <Label
                    htmlFor="paymentTimeLimit"
                    className="text-gray-300 flex items-center cursor-pointer"
                  >
                    Thời gian thanh toán (phút):
                    <span className="text-red-600 font-bold text-2xl ml-1">
                      *
                    </span>
                  </Label>
                  <Input
                    className="py-6 bg-[#2A2A2A] text-white border border-gray-600"
                    id="paymentTimeLimit"
                    name="paymentTimeLimit" // Sửa name để đúng ngữ nghĩa
                    placeholder="Thời gian "
                    type="number"
                    value={form.paymentTimeLimit}
                    onChange={(e) => {
                      setForm({ ...form, paymentTimeLimit: e.target.value });
                      setErrors((prev) => ({ ...prev, paymentTimeLimit: "" })); // Xóa lỗi paymentTimeLimit
                    }}
                  />
                  {errors.paymentTimeLimit && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.paymentTimeLimit}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="pt-5">
            <Button
              className="bg-[#32D993] hover:bg-[#2EBD85] text-black font-semibold"
              onClick={handleSubmit}
            >
              Xác nhận Đặt Lệnh
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <BankInfoModal
        showBankModal={showBankModal}
        setShowBankModal={setShowBankModal}
        handleConfirmOrder={handleConfirmOrder}
      />

      <CreateBankInfoModal
        showCreateBankModal={showCreateBankModal}
        setShowCreateBankModal={setShowCreateBankModal}
      />
    </div>
  );
}
