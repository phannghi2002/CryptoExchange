import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function Withdrawal() {
  return (
    <div className="px-5 lg:px-20">
      <h1 className="font-bold text-3xl pb-5">Withdrawal</h1>
      <Table className="border">
        <TableHeader>
          <TableRow>
            <TableHead className="py-5">Date</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[1, 1, 1, 111, 111, 11, 1].map((item, index) => (
            <TableRow key={index}>
              <TableCell>
                <p>June 2, 2024 at 11:33</p>
              </TableCell>

              <TableCell>Bank</TableCell>

              <TableCell>$250.00</TableCell>
              <TableCell className="text-right">345</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default Withdrawal;
