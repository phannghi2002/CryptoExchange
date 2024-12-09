import { logout } from "@/State/Auth/Action";
import { Button } from "@/components/ui/button";
import { SheetClose } from "@/components/ui/sheet";
import {
  ActivityLogIcon,
  BookmarkIcon,
  DashboardIcon,
  ExitIcon,
  HomeIcon,
  PersonIcon,
} from "@radix-ui/react-icons";
import { LandmarkIcon, PanelTopIcon, WalletIcon } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const menu = [
  { name: "Home", path: "/", icon: <HomeIcon className="h-6 w-6" /> },
  {
    name: "Portfolio",
    path: "/portfolio",
    icon: <DashboardIcon className="h-6 w-6" />,
  },
  {
    name: "Watchlist",
    path: "/watchlist",
    icon: <BookmarkIcon className="h-6 w-6" />,
  },
  {
    name: "Activity",
    path: "/activity",
    icon: <ActivityLogIcon className="h-6 w-6" />,
  },
  { name: "Wallet", path: "/wallet", icon: <WalletIcon className="h-6 w-6" /> },

  {
    name: "Payment Details",
    path: "/paymentdetails",
    icon: <LandmarkIcon className="h-6 w-6" />,
  },
  {
    name: "Withdrawal",
    path: "/withdrawal",
    icon: <PanelTopIcon className="h-6 w-6" />,
  },
  {
    name: "Profile",
    path: "/profile",
    icon: <PersonIcon className="h-6 w-6" />,
  },
  { name: "Logout", path: "/", icon: <ExitIcon className="h-6 w-6" /> },
];

function Sidebar() {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const hanldeLogout = () => {
    dispatch(logout());
  };
  return (
    <div className="mt-10 space-y-5">
      <div>
        <SheetClose className="w-full">
          {menu.map((item, index) => (
            <Button
              key={index}
              variant="outline"
              className="flex items-center gap-5 py-6 w-full"
              onClick={() => {
                navigate(item.path);
                if (item.name == "Logout") {
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
