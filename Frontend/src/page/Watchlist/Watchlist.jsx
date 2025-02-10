/* eslint-disable react-hooks/exhaustive-deps */
import { getUserWatchlist, toggleToWatchlist } from "@/State/Watchlist/Action";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { BookmarkFilledIcon } from "@radix-ui/react-icons";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Watchlist() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { watchlist } = useSelector((store) => store);
  console.log("WAtch list ne", watchlist.watchlist);

  const handleRemoveToWatchlist = async (coinId) => {
    await dispatch(toggleToWatchlist(coinId));
    dispatch(getUserWatchlist());
  };

  useEffect(() => {
    dispatch(getUserWatchlist());
  }, []);
  return (
    <div className="px-5 lg:px-20">
      <h1 className="font-bold text-3xl pb-5">Watchlist</h1>
      <Table className="border">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[185px] py-5">Coin</TableHead>
            <TableHead>SYMBOL</TableHead>
            <TableHead>24h</TableHead>
            <TableHead>PRICE</TableHead>
            <TableHead className="text-right">REMOVE</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {watchlist?.watchlist?.length > 0 ? (
            watchlist?.watchlist.map((item, index) => (
              <TableRow key={index}>
                <TableCell
                  className="font-medium flex items-center gap-2"
                  onClick={() => navigate(`/market/${item.id}`)}
                >
                  <Avatar className="-z-50 w-[40px]">
                    <AvatarImage src={item.image} />
                  </Avatar>
                  <span>{item.name}</span>
                </TableCell>
                <TableCell>{item?.symbol?.toUpperCase()}</TableCell>

                <TableCell
                  style={{
                    color:
                      item.price_change_percentage_24h > 0 ? "green" : "red",
                  }}
                >
                  {item.price_change_percentage_24h > 0 ? "+ " : ""}
                  {item.price_change_percentage_24h}%
                </TableCell>
                <TableCell>${item.current_price}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    onClick={() => handleRemoveToWatchlist(item.id)}
                    size="icon"
                    className="h-10 w-10"
                  >
                    <BookmarkFilledIcon className="w-6 h-6" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4">
                Chưa có danh sách theo dõi
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default Watchlist;
