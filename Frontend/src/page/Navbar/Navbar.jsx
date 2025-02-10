import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { DragHandleHorizontalIcon } from "@radix-ui/react-icons";
import Sidebar from "./Sidebar";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearError } from "@/State/Auth/Action";

function Navbar() {
  const { auth } = useSelector((store) => store);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const access_token = localStorage.getItem("access_token");

  return (
    <div className="px-2 py-3 border-b z-50 bg-background bg-opacity-0 sticky top-0 left-0 right-0 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <Sheet>
          {(auth.jwt || access_token) && (
            <SheetTrigger>
              <Button
                variant="ghost"
                side="icon"
                className="rounded-full h-11 w-11"
              >
                <DragHandleHorizontalIcon className="h-7 w-7" />
              </Button>
            </SheetTrigger>
          )}
          <SheetContent
            className="w-72 border-r-0 flex flex-col justify-center"
            side="left"
          >
            <SheetHeader>
              <SheetTitle>
                {" "}
                <div className="text-3xl flex justify-center items-center gap-1">
                  <Avatar>
                    <AvatarImage src="https://th.bing.com/th/id/OIP.OtF13w_nmGZyaR165utCKgHaE8?w=234&h=180&c=7&r=0&o=5&pid=1.7" />
                  </Avatar>

                  <div>
                    <span className="font-bold text-orange-700">Trading</span>
                  </div>
                </div>
              </SheetTitle>
            </SheetHeader>
            <Sidebar />
          </SheetContent>
        </Sheet>

        <p
          className={`text-sm lg:text-base cursor-pointer ${
            !auth.jwt && !access_token ? "ml-6" : ""
          }`}
          onClick={() => {
            navigate("/overview");
          }}
        >
          Trading Platform
        </p>
      </div>

      {!auth.jwt && !access_token && (
        <div className="mr-5">
          <Button
            className="mr-3"
            variant="destructive"
            onClick={() => {
              navigate("/auth/signin");
              dispatch(clearError());
            }}
          >
            Log In
          </Button>
          <Button
            onClick={() => {
              navigate("/auth/signup");
              dispatch(clearError());
            }}
          >
            Sign Up
          </Button>
        </div>
      )}
      {/* <div>
        <Avatar>
          <AvatarFallback>{auth.user.fullName[0].toUpperCase()}</AvatarFallback>
        </Avatar>
      </div> */}
    </div>
  );
}

export default Navbar;
