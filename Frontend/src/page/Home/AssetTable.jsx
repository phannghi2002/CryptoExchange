/* eslint-disable react/prop-types */
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";

import { useNavigate } from "react-router-dom";

function AssetTable({ coin, category }) {
  const navigate = useNavigate();

  return (
    <Table>
      <ScrollArea className={category == "all" ? "h-[77vh]" : "h-[82vh]"}>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px] px-4">Coin</TableHead>
            <TableHead>SYMBOL</TableHead>
            <TableHead>VOLUME</TableHead>
            <TableHead>MARKET CAP</TableHead>
            <TableHead>24h</TableHead>

            <TableHead className="text-right px-4">PRICE</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coin.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center font-semibold text-gray-500"
              >
                Coin not found in table
              </TableCell>
            </TableRow>
          ) : (
            coin.map((item) => (
              <TableRow key={item.id}>
                <TableCell
                  className="font-medium flex items-center gap-2 px-4"
                  onClick={() => navigate(`/market/${item.id}`)}
                >
                  <Avatar className="-z-50 w-8">
                    <AvatarImage src={item.image} alt="Image Bitcoin" />
                  </Avatar>
                  <span>{item.name}</span>
                </TableCell>
                <TableCell>{item.symbol.toUpperCase()}</TableCell>
                <TableCell>{item.total_volume}</TableCell>
                <TableCell>{item.market_cap}</TableCell>

                <TableCell
                  style={{
                    color:
                      item.price_change_percentage_24h > 0 ? "green" : "red",
                  }}
                >
                  {item.price_change_percentage_24h > 0 ? "+ " : ""}
                  {item.price_change_percentage_24h}%
                </TableCell>

                <TableCell className="text-right px-4">
                  ${item.current_price}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </ScrollArea>
    </Table>
  );
}

export default AssetTable;
