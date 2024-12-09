import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";

function Activity() {
  return (
    <div className="px-5 lg:px-20">
      <h1 className="font-bold text-3xl pb-5">Activity</h1>
      <Table className="border">
        <TableHeader>
          <TableRow>
            <TableHead className="py-5">Date & Time</TableHead>
            <TableHead className="w-[125px] ">Trading pair</TableHead>
            <TableHead>Buy Price</TableHead>
            <TableHead>Sell Price</TableHead>
            <TableHead>Order Type</TableHead>
            <TableHead>Profile/Loss</TableHead>
            <TableHead className="text-right">Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[1, 1, 1, 111, 111, 11, 1].map((item, index) => (
            <TableRow key={index}>
              <TableCell>
                <p>2024/05/31</p>
                <p className="text-gray-400"> 12:39:32</p>
              </TableCell>
              <TableCell className="font-medium flex items-center gap-2">
                <Avatar className="-z-50">
                  <AvatarImage
                    src="https://th.bing.com/th/id/OIP.s6Q43c6hfBySHW2j3K9PTAHaEo?w=242&h=180&c=7&r=0&o=5&pid=1.7"
                    alt="Image Bitcoin"
                  />
                </Avatar>
                <span>Bitcoin</span>
              </TableCell>

              <TableCell>$5824358</TableCell>
              <TableCell>$5824399</TableCell>

              <TableCell>-0.28878</TableCell>
              <TableCell>$250.00</TableCell>
              <TableCell className="text-right">345</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default Activity;
