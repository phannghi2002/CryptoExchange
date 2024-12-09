/* eslint-disable no-constant-binary-expression */
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DotIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { useSelector } from "react-redux";

function TreadingForm() {
  const [orderType, setOrderType] = useState("BUY");
  const [, setAmount] = useState(0);
  const [quantity, setQuantity] = useState(0);

  const { coin } = useSelector((store) => store);
  const calculateBuyCost = (amount, price) => {
    let volume = amount / price;
    let decimalPlaces = Math.max(2, price.toString().split(".")[0].length);

    return volume.toFixed(decimalPlaces);
  };
  const handleChange = (e) => {
    const amount = e.target.value;
    setAmount(amount);

    const volume = calculateBuyCost(
      amount,
      coin.coinDetails.market_data.current_price.usd
    );

    setQuantity(volume);
  };
  return (
    <div className="space-y-10 p-5">
      <div>
        <div className="flex gap-4 items-center justify-between">
          <Input
            className="py-7 focus:outline-none"
            placeholder="Enter Amount ..."
            onChange={handleChange}
            type="number"
            name="amount"
          />
          <div>
            <p className="border text-2xl flex justify-center items-center w-36 h-14 rounded-md">
              {quantity}
            </p>
          </div>
        </div>

        {false && (
          <h1 className="text-red-600 text-center">
            Insufficent wallet balance to buy
          </h1>
        )}
      </div>

      <div className="flex gap-5 items-center">
        <div>
          <Avatar>
            <AvatarImage src={coin.coinDetails?.image.large} />
          </Avatar>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p>{coin.coinDetails?.symbol.toUpperCase()}</p>
            <DotIcon className="text-gray-400" />
            <p className="text-gray-400">{coin.coinDetails?.name}</p>
          </div>

          <div className="flex items-end gap-2">
            <p className="text-xl font-bold">
              ${coin.coinDetails?.market_data.current_price.usd}
            </p>
            <p className="text-red-600">
              <span>
                {" "}
                -{coin.coinDetails?.market_data.market_cap_change_24h}
              </span>
              <span>
                (-
                {coin.coinDetails?.market_data.market_cap_change_percentage_24h}
                %)
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p>Order Type</p>
        <p>Market Order</p>
      </div>

      <div className="flex items-center justify-between">
        <p>{orderType == "BUY" ? "Available Case" : "Available Quantity"}</p>
        <p>
          <p>{orderType == "BUY" ? 0 : 23.08}</p>
        </p>
      </div>
      <div>
        <Button
          className={`w-full py-6 ${
            orderType == "SELL" ? "bg-red-600 text-white" : ""
          }`}
        >
          {orderType}
        </Button>

        <Button
          variant="link"
          onClick={() => setOrderType(orderType == "BUY" ? "SELL" : "BUY")}
          className="w-full mt-5 text-xl"
        >
          {orderType == "BUY" ? "Or Sell" : "Or Buy"}
        </Button>
      </div>
    </div>
  );
}

export default TreadingForm;
