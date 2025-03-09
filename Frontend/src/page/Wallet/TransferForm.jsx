/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { createTransactionSwap } from "@/State/Transaction/Action";
import { getExchangeRate, updateWallet } from "@/State/Wallet/Action";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectItem } from "@radix-ui/react-select";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function TransferForm({ crypto }) {
  const dispatch = useDispatch();
  const { balance, listRate } = useSelector((store) => store.wallet);
  const [error, setError] = useState(""); // State để lưu lỗi

  const [valueExchange, setValueExchange] = useState(0);

  const [formData, setFormData] = useState({
    fromCurrency: "",
    toCurrency: "",
    amount: "",
  });

  const handleChange = (e) => {
    console.log(formData.fromCurrency, formData.toCurrency);

    setFormData({ ...formData, [e.target.name]: e.target.value });

    if (e.target.value > balance.crypto[formData.fromCurrency]) {
      setError(
        `Số dư không đủ! Bạn chỉ có ${balance.crypto[formData.fromCurrency]} ${
          formData.fromCurrency
        }.`
      );
    } else {
      setError(""); // Xóa lỗi nếu hợp lệ
      console.log(
        "giá sau khi đổi nè",
        (listRate[formData.fromCurrency] / listRate[formData.toCurrency]) *
          e.target.value
      );
      setValueExchange(
        (listRate[formData.fromCurrency] / listRate[formData.toCurrency]) *
          e.target.value
      );
    }
  };

  useEffect(() => {
    if (formData.fromCurrency && formData.toCurrency) {
      const symbols = `${formData.fromCurrency},${formData.toCurrency}`;
      dispatch(getExchangeRate(symbols));
    }
  }, [formData.fromCurrency, formData.toCurrency]);

  const handleSubmit = () => {
    if (error) return; // Nếu có lỗi, không cho gửi dữ liệu

    // console.log("userId, originCoin,originAmount,originPrice,targetCoin, targetAmount, targetPrice",);

    const body = {
      userId: "user123", // Thay bằng userId thực tế nếu có
      originCoin: formData.fromCurrency,
      originAmount: formData.amount,
      originPrice: listRate[formData.fromCurrency], // Giá của đồng coin gốc
      targetCoin: formData.toCurrency,
      targetAmount: valueExchange,
      targetPrice: listRate[formData.toCurrency], // Giá của đồng coin đích
    };

    console.log("Dữ liệu gửi lên API:", body);

    dispatch(createTransactionSwap(body));

    const body2 = {
      userId: "user123", // Thay bằng userId thực tế nếu có
      transactionType: "SWAP",
      status: "SUCCESS",
      originCurrency: formData.fromCurrency,
      originAmount: formData.amount,
      targetCurrency: formData.toCurrency,
      targetAmount: valueExchange,
    };

    dispatch(updateWallet(body2));
  };

  console.log("Current toCurrency:", formData.toCurrency);

  return (
    <div className="pt-10 space-y-5">
      <div>
        <Label htmlFor="fromCurrency">Chọn loại tiền cần chuyển:</Label>
        <Select
          value={formData.fromCurrency} // Hiển thị giá trị đã chọn
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, fromCurrency: value }))
          } // Cập nhật state khi chọn
          required
        >
          <SelectTrigger
            id="fromCurrency"
            name="fromCurrency"
            className="h-[56px] w-full border rounded-md"
          >
            <SelectValue placeholder="Chọn tiền điện tử">
              {formData.fromCurrency}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {Object.keys(crypto).map((coin) => (
              <SelectItem key={coin} value={coin}>
                {coin}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="toCurrency">Chuyển đổi sang:</Label>
        <Select
          className="mt-2"
          value={formData.toCurrency} // Hiển thị giá trị đã chọn
          onValueChange={(value) => {
            console.log("in hộ bố ra xem nao", value);

            setFormData((prev) => ({ ...prev, toCurrency: value }));
          }} // Cập nhật state khi chọn
          required
        >
          <SelectTrigger
            id="toCurrency"
            name="toCurrency"
            className="h-[56px] w-full border rounded-md"
          >
            {/* <SelectValue placeholder="Chọn loại tiền" /> */}
            <SelectValue placeholder="Chọn loại tiền">
              {formData.toCurrency}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="BTC">BTC (Bitcoin)</SelectItem>
            <SelectItem value="ETH">ETH (Ethereum)</SelectItem>
            <SelectItem value="USDT">USDT (Tether)</SelectItem>
            <SelectItem value="BNB">BNB (BNB)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <h1 className="pb-1">Nhập số lượng</h1>
        <Input
          name="amount"
          type="number"
          onChange={handleChange}
          value={formData.amount}
          className="py-7"
          placeholder="Nhập số lượng"
        />
        {error ? (
          <p className="text-red-500 pt-2">{error}</p>
        ) : valueExchange ? (
          <p className="text-green-500 pt-2">
            {valueExchange} {formData.toCurrency}
          </p>
        ) : (
          ""
        )}
      </div>

      <DialogClose className="w-full">
        <Button onClick={handleSubmit} className="w-full py-7">
          Xác nhận chuyển đổi
        </Button>
      </DialogClose>
    </div>
  );
}

export default TransferForm;
