import { logout } from "@/State/Auth/Action";
import { Button } from "@/components/ui/button";
import { SheetClose } from "@/components/ui/sheet";
import {
  BookmarkIcon,
  DashboardIcon,
  ExitIcon,
  HomeIcon,
  PersonIcon,
} from "@radix-ui/react-icons";
import { AnchorIcon, HandshakeIcon, WalletIcon } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const menu = [
  {
    name: "Trang chủ",
    path: "/overview",
    icon: <HomeIcon className="h-6 w-6" />,
  },
  {
    name: "Xác thực Kyc ",
    path: "/kyc",
    icon: <DashboardIcon className="h-6 w-6" />,
  },
  {
    name: "Danh sách theo dõi",
    path: "/watchlist",
    icon: <BookmarkIcon className="h-6 w-6" />,
  },
  {
    name: "Ví tiền",
    path: "/wallet",
    icon: <WalletIcon className="h-6 w-6" />,
  },
  {
    name: "Đặt lệnh",
    path: "/order",
    icon: <AnchorIcon className="h-6 w-6" />,
  },

  {
    name: "Thị trường",
    path: "/market",
    icon: <HandshakeIcon className="h-6 w-6" />,
  },

  {
    name: "Thông tin cá nhân",
    path: "/profile",
    icon: <PersonIcon className="h-6 w-6" />,
  },
  {
    name: "Đăng xuất",
    path: "/logout",
    icon: <ExitIcon className="h-6 w-6" />,
  },
];

function Sidebar() {
  const navigate = useNavigate();

  const dispatch = useDispatch();

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
    <div className="mt-10 space-y-5">
      <div>
        <SheetClose className="w-full">
          {menu.map((item, index) => (
            <Button
              key={index}
              variant="outline"
              className="flex items-center gap-8 py-6 w-full justify-start"
              onClick={() => {
                navigate(item.path);
                // if (item.name == "Logout") {
                if (item.name == "Đăng xuất") {
                  hanldeLogout();
                }
              }}
            >
              <span>{item.icon}</span>
              <p>{item.name}</p>
            </Button>
          ))}
        </SheetClose>
      </div>
    </div>
  );
}

export default Sidebar;
