import { useDispatch, useSelector } from "react-redux";

import { useEffect, useState } from "react";
import CardInputForm from "../CardInputForm/CardInputForm";
import { getBank } from "@/State/Order/Action";
import {
  BadgePlusIcon,
  CircleUserIcon,
  CreditCardIcon,
  LandmarkIcon,
  NotebookPenIcon,
} from "lucide-react";

const BankInfoSection = () => {
  const dispatch = useDispatch();

  const { auth } = useSelector((state) => state);
  const bank = useSelector((state) => state.order.bank); // state.bank.bank là nơi bạn lưu bank info
  const [showForm, setShowForm] = useState(false);

  console.log("bank ne", bank);

  useEffect(() => {
    dispatch(getBank(auth.user?.userId));
  }, []);

  // Nếu đã có tài khoản, không hiển thị form
  if (bank && !showForm) {
    return (
      <div className="max-w-md mx-auto bg-[#1F2937] p-6 mt-12 rounded-2xl shadow-2xl text-white">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-400">
          Thông tin ngân hàng của bạn
        </h2>

        <div className="space-y-4 text-[16px]">
          <div className="flex items-center gap-2">
            <LandmarkIcon className="text-blue-300" />
            <span className="font-semibold text-gray-300">Ngân hàng:</span>
            <span>{bank.nameBank}</span>
          </div>

          <div className="flex items-center gap-2">
            <CreditCardIcon className="text-blue-300" />
            <span className="font-semibold text-gray-300">Số tài khoản:</span>
            <span>{bank.numberAccount}</span>
          </div>

          <div className="flex items-center gap-2">
            <CircleUserIcon className="text-blue-300" />
            <span className="font-semibold text-gray-300">Chủ tài khoản:</span>
            <span>{bank.nameAccount}</span>
          </div>

          <div className="flex items-center gap-2">
            <NotebookPenIcon className="text-blue-300" />
            <span className="font-semibold text-gray-300">
              Nội dung chuyển khoản:
            </span>
            <span>{bank.contentPay}</span>
          </div>
        </div>

        {/* <button
          onClick={() => setShowForm(true)}
          className="mt-6 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors duration-200 py-2 px-4 rounded-lg text-white font-medium"
        >
          <BadgePlusIcon />
          Thêm phương thức thanh toán
        </button> */}
      </div>
    );
  }

  return <CardInputForm setShowForm={setShowForm} />;
};

export default BankInfoSection;
