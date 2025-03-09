// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

// function Market() {
//   return (
//     <div className="px-5 lg:px-20">
//       <h1 className="font-bold text-3xl pb-5">Market</h1>
//       <Table className="border">
//         <TableHeader>
//           <TableRow>
//             <TableHead className="py-5">Date</TableHead>
//             <TableHead>Method</TableHead>
//             <TableHead>Amount</TableHead>
//             <TableHead className="text-right">Status</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {[1, 1, 1, 111, 111, 11, 1].map((item, index) => (
//             <TableRow key={index}>
//               <TableCell>
//                 <p>June 2, 2024 at 11:33</p>
//               </TableCell>

//               <TableCell>Bank</TableCell>

//               <TableCell>$250.00</TableCell>
//               <TableCell className="text-right">345</TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </div>
//   );
// }

// export default Market;

import { getAllOrder } from "@/State/Order/Action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UpdateIcon } from "@radix-ui/react-icons";
import { ClockIcon } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

function Market() {
  const list = ["USDT", "BTC", "BNB", "ETH", "TRUMP", "DOGE"];
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
  const { order } = useSelector((store) => store);
  console.log("order ne con", order.listOrder);

  const formatNumberWithCommas = (value) => {
    return Number(value).toLocaleString("en-US");
  };

  useEffect(() => {
    dispatch(getAllOrder());
  }, []);
  return (
    <div className="w-[80%] mx-auto">
      <div className="flex items-center gap-4 pt-2">
        <Button>Mua</Button>

        <Pagination>
          <PaginationContent className="flex gap-3">
            {list.map((item, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  href="#"
                  className="w-auto min-w-0 px-3 py-2 text-sm truncate"
                  title={item}
                >
                  {item}
                </PaginationLink>
              </PaginationItem>
            ))}
          </PaginationContent>
        </Pagination>
      </div>

      <div className="pt-4 flex flex-row justify-between">
        <div className="flex gap-4">
          <Input type="number" placeholder="Số tiền giao dịch" />

          <Select>
            <SelectTrigger className="w-auto ">
              <SelectValue placeholder="Tất cả thanh toán" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {/* <SelectLabel>Fruits</SelectLabel> */}
                <SelectItem value="ALL">Tất cả thanh toán</SelectItem>
                <SelectItem value="BANK_TRANSFER">
                  Chuyển khoản qua ngân hàng
                </SelectItem>
                <SelectItem value="WALLET_FIAT">
                  Chuyển khoản qua ví fiat
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-4">
          <Select>
            <SelectTrigger className="w-[180px]">
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

          <Button variant="outline">
            {" "}
            <UpdateIcon className="h-7 w-7 p-0 cursor-pointer hover:text-gray-400 ml-auto" />
          </Button>
        </div>
      </div>

      <div className="pt-8">
        <div className="flex  border-b py-5">
          <span className="w-[25%]">Người quảng cáo</span>
          <span className="w-[15%]">Giá</span>
          <span className="w-[20%]">Khả dụng</span>
          <span className="w-[25%]">Thanh toán</span>
          <span className="w-[15%] text-right">Giao dịch</span>
        </div>
        {order.listOrder.map((item, index) => (
          <div className="flex  border-b py-4" key={index}>
            <span className="w-[25%] space-y-3">
              <span> {item.userId}</span>
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
            <span className="w-[15%] ">
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
                <p key={i}>{text}</p>
              ))}
            </span>

            <span className="w-[15%] text-right">
              <Button variant="outline">Mua {item.coin}</Button>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Market;
