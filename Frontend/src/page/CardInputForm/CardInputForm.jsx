import React, { useState } from "react";
import "./CardInputForm.css";
import { useDispatch, useSelector } from "react-redux";
import { createBank } from "@/State/Order/Action";
import { showToast } from "@/utils/toast";

const CardInputForm = ({ setShowForm }) => {
  const [bankName, setBankName] = useState("Vietcombank");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [contentPay, setContentPay] = useState("");

  const { auth } = useSelector((store) => store);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = {
      userId: auth.user?.userId, // hoặc bạn lấy từ redux store nếu đã đăng nhập
      nameBank: bankName,
      numberAccount: accountNumber,
      nameAccount: accountHolder,
      contentPay, // nếu bạn muốn gửi nội dung chuyển khoản (nếu có)
    };

    try {
      // Gửi lên redux (giả sử createBank là async action)
      await dispatch(createBank(body));

      showToast(
        "Thành công rồi!",
        "Thông tin ngân hàng đã được lưu",
        "success"
      );

      // Sau khi lưu thành công thì đóng form
      setShowForm(false);
    } catch (error) {
      showToast("Lỗi!", "Không thể lưu thông tin ngân hàng", "error");
      console.error(error);
    }
  };

  return (
    <div className="h-[90vh] flex items-center justify-center bg-gradient-to-b from-purple-900 p-6">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-white p-6 rounded-xl shadow-lg"
        >
          <h2 className="text-xl font-bold text-center mb-4 text-black">
            Nhập thông tin tài khoản ngân hàng
          </h2>

          <div>
            <label className="block text-sm font-medium text-black">
              Ngân hàng
            </label>
            <select
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className="w-full border px-3 py-2 rounded-md text-black"
            >
              <option value="Vietcombank">Vietcombank</option>
              <option value="MB">MB Bank</option>
              <option value="Techcombank">Techcombank</option>
              <option value="ACB">ACB</option>
              <option value="TPBank">TPBank</option>
              <option value="VPBank">VPBank</option>
              <option value="Vietin">VietinBank</option>
              <option value="Sacombank">Sacombank</option>
              <option value="BIDV">BIDV</option>
              <option value="SHB">SHB</option>
              <option value="OCB">OCB</option>
              <option value="HDBank">HDBank</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-black">
              Số tài khoản
            </label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="Nhập số tài khoản"
              className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 text-black"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black">
              Tên chủ tài khoản
            </label>
            <input
              type="text"
              value={accountHolder}
              onChange={(e) => setAccountHolder(e.target.value)}
              placeholder="VD: NGUYEN VAN A"
              className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 text-black uppercase"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black">
              Nội dung chuyển khoản đề xuất
            </label>
            <input
              type="text"
              value={contentPay}
              onChange={(e) => setContentPay(e.target.value)}
              placeholder="VD: Chuyen tien"
              className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 text-black "
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 py-2 rounded-md hover:bg-blue-700 transition text-white"
          >
            Lưu thông tin
          </button>
        </form>
      </div>
    </div>
  );
};
export default CardInputForm;
