/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-constant-condition */
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  BookmarkFilledIcon,
  BookmarkIcon,
  DotIcon,
} from "@radix-ui/react-icons";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import TreadingForm from "./TreadingForm";
import StockChart from "../Home/StockChart";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchCoinDetails, resetCoinDetails } from "@/State/Coin/Action";
import { addItemToWatchlist, getUserWatchlist } from "@/State/Watchlist/Action";
import { existInWatchlist } from "@/utils/existInWatchlist";

function StockDetails() {
  const dispatch = useDispatch();
  const { coin, watchlist } = useSelector((store) => store);
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      dispatch(resetCoinDetails());
      dispatch(fetchCoinDetails(id)); // Fetch data for the new `id`
    }
  }, [id, dispatch]);

  const handleAddToWatchlist = () => {
    console.log("e cu", coin.coinDetails?.id, localStorage.getItem("jwt"));

    dispatch(addItemToWatchlist(coin.coinDetails?.id));
  };
  return (
    <div className="p-5 mt-5">
      <div className="flex justify-between">
        <div className="flex gap-5 items-center">
          <div>
            <Avatar>
              <AvatarImage src={coin.coinDetails?.image} />
            </Avatar>
          </div>
          <div>
            <div className="flex items-center gap-2">
              {/* <p>{coin.coinDetails?.symbol.toUpperCase()}</p> */}
              <DotIcon className="text-gray-400" />
              <p className="text-gray-400">{coin.coinDetails?.name}</p>
            </div>

            <div className="flex items-end gap-2">
              <p className="text-xl font-bold">
                ${coin.coinDetails?.current_price}
              </p>
              <p
                className={
                  coin.coinDetails?.price_change_percentage_24h > 0
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                <span>
                  {coin.coinDetails?.price_change_percentage_24h > 0 ? "+" : ""}
                  {coin.coinDetails?.price_change_percentage_24h}%
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button onClick={handleAddToWatchlist}>
            {existInWatchlist(watchlist.items, coin.coinDetails) ? (
              <BookmarkFilledIcon className="h-6 w-6" />
            ) : (
              <BookmarkIcon className="h-6 w-6" />
            )}
          </Button>

          <Dialog>
            <DialogTrigger>
              <Button size="lg">Tread</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>How much do you want to spend?</DialogTitle>
              </DialogHeader>
              <TreadingForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="mt-14">
        <StockChart coinId={id} />
      </div>
    </div>
  );
}

export default StockDetails;
