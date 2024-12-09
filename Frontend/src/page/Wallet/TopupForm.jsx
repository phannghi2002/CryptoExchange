import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DotFilledIcon } from "@radix-ui/react-icons";
import { useState } from "react";

function TopupForm() {
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("RAZORPAY");
  const handleChange = (e) => {
    setAmount(e.target.value);
  };
  const handlePaymentMethodChange = (value) => {
    setPaymentMethod(value);
  };

  const handleSubmit = () => {
    console.log(amount, paymentMethod);
  };
  return (
    <div className="pt-10 space-y-5">
      <div>
        <h1 className="pb-1">Enter Amount</h1>
        <Input
          className="py-7 text-lg"
          placeholder="$9999"
          onChange={handleChange}
          value={amount}
        />
      </div>

      <div>
        <h1 className="pb-1">Select payment method</h1>

        <RadioGroup
          className="flex"
          defaultValue="RAZORPAY"
          onValueChange={(value) => handlePaymentMethodChange(value)}
        >
          <div className="flex items-center space-x-2 border p-3 px-5 rounded-md">
            <RadioGroupItem
              icon={DotFilledIcon}
              className="h-9 w-9"
              value="RAZORPAY"
              id="r1"
            />
            <Label htmlFor="r1">
              <div className="bg-white rounded-md px-5 py-2 w-32">
                <img
                  src="https://th.bing.com/th/id/OIP.UIf7zTnAJMVtjFAZlR5oZQHaB5?rs=1&pid=ImgDetMain"
                  alt="RAZORPAY"
                />
              </div>
            </Label>
          </div>

          <div className="flex items-center space-x-2 border p-3 px-5 rounded-md">
            <RadioGroupItem
              icon={DotFilledIcon}
              className="h-9 w-9"
              value="STRIPE"
              id="r1"
            />
            <Label htmlFor="r1">
              <div className="bg-white rounded-md px-5 py-2 w-32">
                <img
                  className="h-8"
                  src="https://ecommerce-platforms.com/wp-content/uploads/2023/06/stripe-logo.png"
                  alt="STRIPE"
                />
              </div>
            </Label>
          </div>
        </RadioGroup>
      </div>

      <Button className="w-full py-7" onClick={handleSubmit}>
        Submit
      </Button>
    </div>
  );
}

export default TopupForm;
