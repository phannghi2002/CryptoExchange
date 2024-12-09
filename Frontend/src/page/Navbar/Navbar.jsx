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

function Navbar() {
  // const { auth } = useSelector((store) => store);

  return (
    <div className="px-2 py-3 border-b z-50 bg-background bg-opacity-0 sticky top-0 left-0 right-0 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <Sheet>
          <SheetTrigger>
            <Button
              variant="ghost"
              side="icon"
              className="rounded-full h-11 w-11"
            >
              <DragHandleHorizontalIcon className="h-7 w-7" />
            </Button>
          </SheetTrigger>
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

        <p className="text-sm lg:text-base cursor-pointer">Trading Platform</p>
      </div>

      {/* <div>
        <Avatar>
          <AvatarFallback>{auth.user.fullName[0].toUpperCase()}</AvatarFallback>
        </Avatar>
      </div> */}
    </div>
  );
}

export default Navbar;
