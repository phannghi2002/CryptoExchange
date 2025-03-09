import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";

import { ReloadIcon, UpdateIcon } from "@radix-ui/react-icons";
import {
  WalletIcon,
  CopyIcon,
  UploadIcon,
  DownloadIcon,
  ArrowRightLeftIcon,
  CoinsIcon,
  ArrowLeftRightIcon,
  ArrowRightIcon,
  ChevronDownIcon,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import PaymentResultDetail from "../PaymentVNPay/PaymentResultDetail";
import { DialogTitle } from "@radix-ui/react-dialog";
import TransferForm from "./TransferForm";
import { useDispatch, useSelector } from "react-redux";
import { getBalanceWallet, getHistoryWalletFiat } from "@/State/Wallet/Action";
import { getHistoryTransactionSwap } from "@/State/Transaction/Action";

function Wallet() {
  const navigate = useNavigate();

  const handleDepositClick = () => {
    navigate("/vnpay", { state: { orderInfo: "DEPOSIT" } });
  };

  const handleWithdrawClick = () => {
    navigate("/vnpay", { state: { orderInfo: "WITHDRAW" } });
  };

  const dispatch = useDispatch();
  const { wallet, transaction } = useSelector((store) => store);

  useEffect(() => {
    dispatch(getHistoryWalletFiat());
    dispatch(getHistoryTransactionSwap("user123"));
    dispatch(getBalanceWallet());
  }, [dispatch]);

  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const [openDW, setOpenDW] = useState(true);
  const [openSwap, setOpenSwap] = useState(true);

  const formatNumber = (value, decimals = 8) => {
    if (isNaN(value) || value === null) return "0";
    return Number(value)
      .toFixed(decimals)
      .replace(/\.?0+$/, "");
  };

  return (
    <div className="flex flex-col items-center">
      <div className="pt-10 w-full lg:w-[60%]">
        <Card>
          {/* Header */}
          <CardHeader className="pb-9">
            <div className="flex justify-between items-center">
              <div className="w-[40%] flex items-center gap-5">
                <WalletIcon size={30} />
                <div>
                  <CardTitle className="text-2xl">Ví fiat</CardTitle>
                  <div className="flex items-center gap-2">
                    <p className="text-gray-200 text-sm">#A$&5Ed</p>
                    <CopyIcon
                      size={14}
                      className="cursor-pointer hover:text-slate-300"
                    />
                  </div>
                </div>
              </div>

              <div className="w-[40%] flex justify-center gap-5">
                <CoinsIcon size={30} />
                <div>
                  <CardTitle className="text-2xl">Ví Crypto</CardTitle>
                  <div className="flex items-center gap-2">
                    <p className="text-gray-200 text-sm">#A$&5Ed</p>
                    <CopyIcon
                      size={14}
                      className="cursor-pointer hover:text-slate-300"
                    />
                  </div>
                </div>
              </div>

              <div className="w-[20%] flex justify-end">
                <ReloadIcon
                  className="w-6 h-6 cursor-pointer hover:text-gray-400"
                  onClick={() => dispatch(getBalanceWallet())}
                />
              </div>
            </div>
          </CardHeader>

          {/* Content */}
          <div className="flex items-center ">
            {/* Ví Fiat */}
            <CardContent className="w-[50%]">
              <div className="flex items-center">
                <span className="text-2xl font-semibold">
                  {wallet.balance.VND.toLocaleString()}
                </span>
                <span className="text-2xl font-semibold ml-3">VND</span>
              </div>

              <div className="flex gap-7 mt-5">
                <Dialog>
                  <DialogTrigger>
                    <div
                      className="h-24 w-24 hover:text-gray-400 cursor-pointer flex flex-col items-center justify-center rounded-md shadow-sky-800 shadow-md"
                      onClick={handleDepositClick}
                    >
                      <UploadIcon />
                      <span className="text-sm mt-2">Nạp tiền</span>
                    </div>
                  </DialogTrigger>
                </Dialog>

                <Dialog>
                  <DialogTrigger>
                    <div
                      className="h-24 w-24 hover:text-gray-400 cursor-pointer flex flex-col items-center justify-center rounded-md shadow-sky-800 shadow-md"
                      onClick={handleWithdrawClick}
                    >
                      <DownloadIcon />
                      <span className="text-sm mt-2">Rút tiền</span>
                    </div>
                  </DialogTrigger>
                </Dialog>
              </div>
            </CardContent>

            {/* Ví Crypto */}
            <CardContent className="w-[50%] ">
              {Object.entries(wallet.balance.crypto).map(([coin, amount]) => (
                <div key={coin} className="flex items-center mb-3">
                  <span className="text-2xl font-semibold">
                    {amount.toLocaleString()}
                  </span>
                  <span className="text-2xl font-semibold ml-3">{coin}</span>
                </div>
              ))}

              <div className="flex gap-7 mt-5">
                <Dialog>
                  <DialogTrigger>
                    <div className="h-24 w-24 hover:text-gray-400 cursor-pointer flex flex-col items-center justify-center rounded-md shadow-sky-800 shadow-md">
                      <ArrowRightLeftIcon />
                      <span className="text-sm mt-2">Chuyển đổi</span>
                    </div>
                  </DialogTrigger>
                  <DialogContent onInteractOutside={(e) => e.preventDefault()}>
                    <DialogHeader className="text-center text-xl">
                      <DialogTitle>Chuyển đổi loại tiền</DialogTitle>
                    </DialogHeader>

                    <TransferForm
                      crypto={wallet.balance.crypto}
                      // onConvert={handleConvert}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </div>
        </Card>

        <div className="py-5 pt-10">
          <div className="flex gap-2 items-center pb-5 ">
            <h1 className="text-2xl font-semibold w-1/3">
              Lịch sử nạp rút tiền{" "}
            </h1>

            <div
              className="flex items-center gap-1 cursor-pointer hover:text-gray-400 w-1/3 justify-center"
              onClick={() => setOpenDW(!openDW)}
            >
              <span className="text-sm font-medium">
                {openDW ? "Ẩn" : "Hiển thị"}
              </span>
              <ChevronDownIcon
                className={`h-7 w-7 transition-transform duration-300 ${
                  openDW ? "rotate-180 text-blue-500" : "rotate-0 text-gray-500"
                }`}
              />
            </div>

            {/* <UpdateIcon className="h-7 w-1/3 p-0 cursor-pointer hover:text-gray-400 text-right" /> */}
            <UpdateIcon
              className="h-7 w-7 p-0 cursor-pointer hover:text-gray-400 ml-auto"
              onClick={() => dispatch(getHistoryWalletFiat())}
            />
          </div>

          {openDW && (
            <div className="space-y-5">
              {wallet.history.map((transaction) => (
                <Card
                  key={transaction.id}
                  className="px-5 flex items-center cursor-pointer"
                  onClick={() => setSelectedTransaction(transaction)}
                >
                  {/* Phần tử trái */}
                  <div className="w-1/3 flex items-center gap-5 p-2">
                    <Avatar>
                      <AvatarFallback>
                        {transaction.transactionType === "DEPOSIT" ? (
                          <UploadIcon />
                        ) : (
                          <DownloadIcon />
                        )}
                      </AvatarFallback>
                    </Avatar>

                    <div className="space-y-1">
                      <h1>
                        {transaction.transactionType === "DEPOSIT"
                          ? "Nạp tiền vào ví fiat"
                          : "Rút tiền từ ví fiat"}
                      </h1>
                      <p className="text-sm text-gray-500">
                        {new Date(transaction.paymentTime).toLocaleString(
                          "vi-VN"
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Phần tử giữa */}
                  <div className="w-1/3 flex justify-center ">
                    <Button
                      className={`w-24 focus:ring-0 ${
                        transaction.status === "SUCCESS"
                          ? "bg-green-500 text-white hover:bg-green-500"
                          : "bg-red-500 text-white hover:bg-red-500"
                      }`}
                    >
                      {transaction.status === "SUCCESS"
                        ? "Thành công"
                        : "Thất bại"}
                    </Button>
                  </div>

                  {/* Phần tử phải */}
                  <div className="w-1/3 text-right">
                    <p
                      className={
                        transaction.status === "SUCCESS"
                          ? "text-green-500"
                          : "text-red-500"
                      }
                    >
                      {transaction.amount.toLocaleString()} VND
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="py-5 pt-10">
          <div className="flex gap-2 items-center pb-5 ">
            <h1 className="text-2xl font-semibold w-1/3">Lịch sử đổi coin </h1>

            <div
              className="flex items-center gap-1 cursor-pointer hover:text-gray-400 w-1/3 justify-center"
              onClick={() => setOpenSwap(!openSwap)}
            >
              <span className="text-sm font-medium">
                {openSwap ? "Ẩn" : "Hiển thị"}
              </span>
              <ChevronDownIcon
                className={`h-7 w-7 transition-transform duration-300 ${
                  openSwap
                    ? "rotate-180 text-blue-500"
                    : "rotate-0 text-gray-500"
                }`}
              />
            </div>
            <UpdateIcon
              className="h-7 w-7 p-0 cursor-pointer hover:text-gray-400 ml-auto"
              onClick={() => dispatch(getHistoryTransactionSwap("user123"))}
            />
          </div>

          {openSwap && (
            <div className="space-y-5">
              {transaction.historySwap?.length > 0 ? (
                transaction.historySwap.map((swap) => (
                  <Card
                    key={swap.id}
                    className="px-5 flex justify-between items-center "
                  >
                    <div className="flex items-center gap-5 p-2 w-[25%]">
                      <Avatar>
                        <AvatarFallback>
                          <ArrowLeftRightIcon />
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <h1 className="text-lg font-semibold">Hoán đổi coin</h1>
                      </div>
                    </div>

                    <div className="space-y-1  w-[20%]">
                      <p className="text-sm text-gray-500">
                        {swap.timestamp
                          ? new Date(swap.timestamp).toLocaleString("vi-VN")
                          : "Không có dữ liệu"}
                      </p>
                    </div>

                    <div className="flex flex-col items-center gap-x-2 text-xl font-bold w-[50%] text-right">
                      <div className="flex items-center gap-2">
                        <span>
                          <span>{formatNumber(swap.originAmount)}</span>
                        </span>

                        <span>{swap.originCoin}</span>
                        <ArrowRightIcon className="w-6 h-6" />

                        <span>{formatNumber(swap.targetAmount)}</span>

                        <span>{swap.targetCoin}</span>
                      </div>
                      {swap.originCoin !== "USDT" && (
                        <div className="flex items-center gap-2">
                          <span>1</span>
                          <span>{swap.originCoin}</span>
                          <span>({swap.originPrice} USDT)</span>
                        </div>
                      )}
                      {swap.targetCoin !== "USDT" && (
                        <div className="flex items-center gap-2">
                          <span>1</span>
                          <span>{swap.targetCoin}</span>
                          <span>({swap.targetPrice} USDT)</span>
                        </div>
                      )}
                    </div>
                  </Card>
                ))
              ) : (
                <p>Không có dữ liệu lịch sử giao dịch</p>
              )}
            </div>
          )}
        </div>
      </div>

      {selectedTransaction && (
        <PaymentResultDetail
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      )}
    </div>
  );
}

export default Wallet;
