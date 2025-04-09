import { Button } from "@/components/ui/button";

import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearError, logout } from "@/State/Auth/Action";
import { CircleUserIcon, LogOutIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BellIcon } from "@radix-ui/react-icons";
import NotificationBell from "../NotificationBell/NotificationBell";

function Navbar() {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const access_token = localStorage.getItem("access_token");
  const token = localStorage.getItem("jwt");

  const hanldeLogout = async () => {
    await dispatch(logout());
    document.cookie =
      "OAUTH_TOKEN=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "TWO_AUTH=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    await new Promise((resolve) => setTimeout(resolve, 50));
    navigate("/overview"); // Điều hướng sau khi logout
  };

  return (
    <div className="px-8 py-3 border-b z-50 bg-background bg-opacity-0 sticky top-0 left-0 right-0 flex items-center justify-between">
      <div className="flex items-center">
        <span
          className={`text-sm lg:text-base cursor-pointer text-yellow-500 font-bold uppercase `}
          onClick={() => {
            navigate("/overview");
          }}
        >
          Crypto Exchange
        </span>

        {(token || access_token) && (
          <div className="flex items-center space-x-6 ml-6">
            <span
              className="hover:text-yellow-500 cursor-pointer"
              onClick={() => navigate("/market")}
            >
              Thị trường
            </span>
            <span
              className="hover:text-yellow-500 cursor-pointer"
              onClick={() => navigate("/watchlist")}
            >
              Danh sách theo dõi
            </span>
            <span
              className="hover:text-yellow-500 cursor-pointer"
              onClick={() => navigate("/wallet")}
            >
              Ví tiền
            </span>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <span className="cursor-pointer hover:text-yellow-500">
                  Đặt lệnh
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-gray-800 text-white">
                <DropdownMenuItem onClick={() => navigate("/order")}>
                  Đặt lệnh P2P
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/order-limit")}>
                  Đặt lệnh limit
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {(token || access_token) && (
        <div className="flex items-center space-x-3">
          {/* <NotificationBell /> */}

          <div className="flex items-center space-x-3 ">
            <NotificationBell />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <span className="cursor-pointer hover:text-yellow-500">
                <CircleUserIcon size={24} />
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gray-800 text-white">
              <DropdownMenuItem onClick={() => navigate("/profile")}>
                Thông tin cá nhân
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/kyc")}>
                Xác thực Kyc
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/account-bank")}>
                Tài khoản ngân hàng
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <span className="cursor-pointer hover:text-yellow-500">
                <LogOutIcon size={24} />
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gray-800 text-white">
              <DropdownMenuItem onClick={hanldeLogout}>
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {!token && !access_token && (
        <div className="mr-5">
          <Button
            className="mr-3"
            variant="destructive"
            onClick={() => {
              navigate("/auth/signin");
              dispatch(clearError());
            }}
          >
            {/* Log In */}
            Đăng nhập
          </Button>
          <Button
            onClick={() => {
              navigate("/auth/signup");
              dispatch(clearError());
            }}
          >
            {/* Sign Up */}
            Đăng ký
          </Button>
        </div>
      )}
    </div>
  );
}

export default Navbar;
