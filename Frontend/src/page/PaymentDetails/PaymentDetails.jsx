/* eslint-disable no-constant-condition */
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import PaymentDetailsForm from "./PaymentDetailsForm";

function PaymentDetails() {
  return (
    <div className="px-20">
      <h1 className="text-3xl font-bold py-10">Payment Details</h1>

      {false ? (
        <Card>
          <CardHeader>
            <CardTitle>Yes Bank</CardTitle>
            <CardDescription>A/C No: ************1651</CardDescription>

            <CardContent>
              <div className="flex items-center">
                <p className="w-32">A/C Holder</p>
                <p className="text-gray-400">: Code with Nghi</p>
              </div>

              <div className="flex items-center">
                <p className="w-32">IFSC</p>
                <p className="text-gray-400">: YESB000007</p>
              </div>
            </CardContent>
          </CardHeader>
        </Card>
      ) : (
        <Dialog>
          <DialogTrigger>
            {" "}
            <Button className="py-6">Add payment details</Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Payment Details</DialogTitle>
            </DialogHeader>
            <PaymentDetailsForm />
          </DialogContent>
        </Dialog>

        // <Dialog>
        //   <DialogTrigger asChild>
        //     <Button className="py-6">Add payment details</Button>
        //   </DialogTrigger>

        //   <DialogContent>
        //     <DialogHeader>
        //       <DialogTitle>Payment Details</DialogTitle>
        //     </DialogHeader>
        //     <PaymentDetailsForm />
        //   </DialogContent>
        // </Dialog>
        // <div>kho a</div>
      )}
    </div>
  );
}

export default PaymentDetails;
