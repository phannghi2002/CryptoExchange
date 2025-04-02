import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import Chart from "react-apexcharts";
import { Slider } from "@/components/ui/slider";
import { useDispatch, useSelector } from "react-redux";
import { getBalanceWallet, substractCoinWallet } from "@/State/Wallet/Action";
import { Button } from "@/components/ui/button";
import {
  createTransactionSwapOrderLimit,
  getAllAnotherStatusPendingSwapOrderLimit,
  getAllOpenOrderTransactionSwapOrderLimit,
  updateTransactionSwapOrderLimit,
} from "@/State/Transaction/Action";

import TransactionTabs from "../Tabs/TransactionTabs";
import { showToast } from "@/utils/toast";

function OrderLimit() {
  const [priceRange, setPriceRange] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [priceHistory, setPriceHistory] = useState([]);
  const [prevPrice, setPrevPrice] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [isBuyOrderActive, setIsBuyOrderActive] = useState(false);
  const [isSellOrderActive, setIsSellOrderActive] = useState(false);

  const [priceBuy, setPriceBuy] = useState("");
  const [quantityBuy, setQuantityBuy] = useState("");
  const [totalBuy, setTotalBuy] = useState("");

  const [priceSell, setPriceSell] = useState("");
  const [quantitySell, setQuantitySell] = useState("");
  const [totalSell, setTotalSell] = useState("");

  const [sliderValueBuy, setSliderValueBuy] = useState([0]);
  const [sliderValueSell, setSliderValueSell] = useState([0]);
  const { auth, wallet } = useSelector((store) => store);

  const dispatch = useDispatch();

  // Lấy balance wallet
  useEffect(() => {
    if (auth.user?.userId) {
      dispatch(getBalanceWallet(auth.user?.userId));
      dispatch(getAllOpenOrderTransactionSwapOrderLimit(auth.user?.userId));
      dispatch(getAllAnotherStatusPendingSwapOrderLimit(auth.user?.userId));
    }
  }, [dispatch, auth.user?.userId]);

  // Lấy 100 giá từ backend
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch(
          "http://localhost:8888/api/v1/coin/market/price1day/binancecoin"
        );
        const prices = await response.json();
        setPriceRange(prices);
        setPriceHistory(prices.slice(0, 20));
        setCurrentPrice(prices[19]);
        setPrevPrice(prices[18]);
      } catch (error) {
        console.error("Lỗi khi lấy giá từ backend:", error);
      }
    };
    fetchPrices();
  }, []);

  // Xoay vòng giá
  useEffect(() => {
    if (priceRange.length === 0) return;

    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % priceRange.length;
      const newPrice = priceRange[nextIndex];

      setPrevPrice(currentPrice);
      setCurrentPrice(newPrice);
      setCurrentIndex(nextIndex);

      setPriceHistory((prev) => {
        const updatedHistory = [...prev, newPrice].slice(-20);
        return updatedHistory;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex, priceRange]);

  const handleBuyMatch = () => {
    const priceBuyNum = parseFloat(priceBuy);
    if (priceBuyNum && quantityBuy && currentPrice <= priceBuyNum) {
      const matchedOrder = {
        price: currentPrice,
        quantity: parseFloat(quantityBuy),
        side: "BUY",
        timestamp: new Date().toLocaleTimeString(),
      };

      setIsBuyOrderActive(false);
      setPriceBuy("");
      setQuantityBuy("");
      setTotalBuy("");
      setSliderValueBuy([0]);
      alert(
        `Khớp lệnh mua: ${matchedOrder.quantity} BNB ở giá ${matchedOrder.price} USDT`
      );

      return new Promise((resolve, reject) => {
        dispatch(updateTransactionSwapOrderLimit("SUCCESS", auth.user?.userId))
          .then(() => {
            dispatch(
              getAllOpenOrderTransactionSwapOrderLimit(auth.user?.userId)
            );
            resolve(); // Resolve promise khi cả hai dispatch hoàn thành
          })
          .catch((error) => {
            console.error("Lỗi khi tạo giao dịch:", error);
            reject(error); // Reject promise nếu có lỗi
          });
      });
    }
  };

  const handleSellMatch = () => {
    const priceSellNum = parseFloat(priceSell);
    if (priceSellNum && quantitySell && currentPrice >= priceSellNum) {
      const matchedOrder = {
        price: currentPrice,
        quantity: parseFloat(quantitySell),
        side: "SELL",
        timestamp: new Date().toLocaleTimeString(),
      };

      setIsSellOrderActive(false);
      setPriceSell("");
      setQuantitySell("");
      setTotalSell("");
      setSliderValueSell([0]);
      alert(
        `Khớp lệnh bán: ${matchedOrder.quantity} BNB ở giá ${matchedOrder.price} USDT`
      );
    }
  };

  useEffect(() => {
    if ((!isBuyOrderActive && !isSellOrderActive) || priceRange.length === 0)
      return;

    const interval = setInterval(() => {
      if (isBuyOrderActive) handleBuyMatch();
      if (isSellOrderActive) handleSellMatch();
    }, 3000);

    return () => clearInterval(interval);
  }, [
    isBuyOrderActive,
    isSellOrderActive,
    currentPrice,
    priceBuy,
    quantityBuy,
    priceSell,
    quantitySell,
  ]);

  // Xử lý giá và số lượng
  const handlePriceBuyChange = (e) => {
    const price = e.target.value;
    setPriceBuy(price);
    const priceNum = parseFloat(price) || 0;
    const quantityNum = parseFloat(quantityBuy) || 0;
    if (priceNum && quantityNum) {
      setTotalBuy((priceNum * quantityNum).toFixed(3));
    } else {
      setTotalBuy("");
    }
    setErrorBuy("");
  };

  const handleQuantityBuyChange = (e) => {
    const quantity = e.target.value;
    setQuantityBuy(quantity);
    const priceNum = parseFloat(priceBuy) || 0;
    const quantityNum = parseFloat(quantity) || 0;
    if (priceNum && quantityNum) {
      setTotalBuy((priceNum * quantityNum).toFixed(3));
    } else {
      setTotalBuy("");
    }
    setErrorBuy("");
  };

  const handleTotalBuyChange = (e) => {
    const total = e.target.value;
    setTotalBuy(total);
    const priceNum = parseFloat(priceBuy) || 0;
    const totalNum = parseFloat(total) || 0;
    if (priceNum && totalNum) {
      setQuantityBuy((totalNum / priceNum).toFixed(3));
      setSliderValueBuy([totalNum]);
    } else {
      setQuantityBuy("");
      setSliderValueBuy([0]);
    }
    setErrorBuy("");
  };

  const handleSliderBuyChange = (value) => {
    const newValue = value[0];
    setSliderValueBuy(value);
    setTotalBuy(newValue.toString());
    const priceNum = parseFloat(priceBuy) || 0;
    if (priceNum) {
      setQuantityBuy((newValue / priceNum).toFixed(3));
    }
    setErrorBuy("");
  };

  const handlePriceSellChange = (e) => {
    const price = e.target.value;
    setPriceSell(price);
    const priceNum = parseFloat(price) || 0;
    const quantityNum = parseFloat(quantitySell) || 0;
    if (priceNum && quantityNum) {
      setTotalSell((priceNum * quantityNum).toFixed(3));
    } else {
      setTotalSell("");
    }
    setErrorSell("");
  };

  const handleQuantitySellChange = (e) => {
    const quantity = e.target.value;
    setQuantitySell(quantity);
    const priceNum = parseFloat(priceSell) || 0;
    const quantityNum = parseFloat(quantity) || 0;
    if (priceNum && quantityNum) {
      setTotalSell((priceNum * quantityNum).toFixed(3));
    } else {
      setTotalSell("");
    }
    setErrorSell("");
  };

  const handleTotalSellChange = (e) => {
    const total = e.target.value;
    setTotalSell(total);
    const priceNum = parseFloat(priceSell) || 0;
    const totalNum = parseFloat(total) || 0;
    if (priceNum && totalNum) {
      setQuantitySell((totalNum / priceNum).toFixed(3));
      setSliderValueSell([totalNum]);
    } else {
      setQuantitySell("");
      setSliderValueSell([0]);
    }
    setErrorSell("");
  };

  const handleSliderSellChange = (value) => {
    console.log("in value ne", sliderValueSell);
    const newValue = value[0];
    setSliderValueSell(value);
    setQuantitySell(newValue.toString());
    const priceNum = parseFloat(priceSell) || 0;
    if (priceNum) {
      setTotalSell((newValue * priceNum).toFixed(3));
    }
    setErrorSell("");
  };

  const [errorBuy, setErrorBuy] = useState("");
  const [errorSell, setErrorSell] = useState("");

  // Xử lý khi nhấn nút "Mua"
  const handleBuy = () => {
    if (!priceBuy || !quantityBuy) {
      setErrorBuy("Vui lòng nhập giá và số lượng trước khi đặt lệnh mua!");
      return;
    }
    if (parseFloat(quantityBuy) <= 0) {
      setErrorBuy("Số lượng mua phải lớn hơn 0!");
      return;
    }

    if (wallet.balance.crypto?.USDT < totalBuy) {
      setErrorBuy("Trong ví không đủ USDT để thực hiện giao dịch");
      return;
    }
    console.log("Mua BNB", { priceBuy, quantityBuy, totalBuy });
    showToast("Thành công rồi!", "Đã đặt lệnh mua thành công", "success");
    setIsBuyOrderActive(true);
    const body = {
      userId: auth.user?.userId,
      originCoin: "USDT",
      originAmount: priceBuy,
      targetCoin: "BNB",
      targetAmount: quantityBuy,
      status: "PENDING",
      type: "BUY",
      total: totalBuy,
      pair: "BNB/USDT",
    };
    return new Promise((resolve, reject) => {
      dispatch(createTransactionSwapOrderLimit(body))
        .then(() => {
          dispatch(getAllOpenOrderTransactionSwapOrderLimit(body.userId));
          dispatch(
            substractCoinWallet(body.userId, {
              currency: body.originCoin,
              amount: priceBuy,
            })
          );
          setPriceBuy(0);
          setQuantityBuy(0);
          setTotalBuy(0);
          resolve(); // Resolve promise khi cả hai dispatch hoàn thành
        })
        .catch((error) => {
          console.error("Lỗi khi tạo giao dịch:", error);
          reject(error); // Reject promise nếu có lỗi
        });
    });
  };

  const handleSell = () => {
    if (!priceSell || !quantitySell) {
      setErrorSell("Vui lòng nhập giá và số lượng trước khi đặt lệnh bán!");
      return;
    }

    if (parseFloat(quantitySell) <= 0) {
      setErrorSell("Số lượng bán phải lớn hơn 0!");
      return;
    }

    if (!("BNB" in wallet.balance.crypto)) {
      setErrorSell("Trong ví không chứa BNB để thực hiện giao dịch");
      return;
    }

    if (wallet.balance.crypto.BNB < quantitySell) {
      setErrorSell("Trong ví không đủ BNB để thực hiện giao dịch");
      return;
    }

    showToast("Thành công rồi!", "Đã đặt lệnh bán thành công", "success");

    setIsSellOrderActive(true);

    const body = {
      userId: auth.user?.userId,
      originCoin: "BNB",
      originAmount: quantitySell,
      targetCoin: "USDT",
      targetAmount: priceSell,
      status: "PENDING",
      type: "SELL",
      total: totalSell,
      pair: "BNB/USDT",
    };

    return new Promise((resolve, reject) => {
      dispatch(createTransactionSwapOrderLimit(body))
        .then(() => {
          dispatch(getAllOpenOrderTransactionSwapOrderLimit(body.userId));
          dispatch(
            substractCoinWallet(body.userId, {
              currency: body.originCoin,
              amount: quantitySell,
            })
          );
          setPriceSell(0);
          setQuantitySell(0);
          setTotalSell(0);
          resolve(); // Resolve promise khi cả hai dispatch hoàn thành
        })
        .catch((error) => {
          console.error("Lỗi khi tạo giao dịch:", error);
          reject(error); // Reject promise nếu có lỗi
        });
    });
  };

  // Cấu hình biểu đồ
  const chartOptions = {
    chart: {
      id: "price-chart",
      toolbar: { show: false },
      animations: { enabled: true, easing: "easeinout", speed: 800 },
    },
    xaxis: { categories: priceHistory.map((_, index) => `#${index + 1}`) },
    yaxis: { opposite: true },
    colors: ["#0000FF"],
    markers: {
      colors: ["#fff"],
      strokeColor: "#fff",
      size: 0,
      strokeWidth: 1,
      style: "hollow",
    },
    tooltip: { theme: "dark" },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 100],
      },
    },
    grid: { borderColor: "#47535E", strokeDashArray: 4, show: true },
  };

  const chartSeries = [{ name: "Giá (USDT)", data: priceHistory }];

  return (
    <>
      <div className="bg-background flex items-center justify-center flex-col">
        <div className="bg-card py-3 rounded-lg shadow-lg w-full max-w-screen-xl flex">
          {/* Lịch sử giá */}
          <div className="bg-secondary p-4 rounded-lg shadow-md mr-4 overflow-y-auto max-h-screen w-1/4">
            <h2 className="text-lg font-semibold text-secondary-foreground mb-2">
              Lịch sử giá
            </h2>
            <div className="flex flex-col-reverse">
              {priceHistory.map((price, index) => (
                <div
                  key={index}
                  className={`p-1 text-accent-foreground text-xs text-center ${
                    index === 19 ? "font-bold text-blue-600" : ""
                  }`}
                >
                  {price.toLocaleString()} USDT
                </div>
              ))}
            </div>
          </div>

          {/* Phần chính */}
          <div className="flex-1  ">
            <div className="p-5 bg-secondary rounded-lg">
              <div className="text-center">
                <button
                  className={`p-2 rounded-lg text-primary-foreground text-xl font-bold ${
                    currentPrice > prevPrice ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {currentPrice.toLocaleString()} USDT
                </button>
              </div>
              <div>
                <Chart
                  options={chartOptions}
                  series={chartSeries}
                  type="line"
                  height={250}
                />
              </div>
              <div className="flex w-full space-x-4">
                {/* Cột mua */}
                <div className="flex-1 p-5 bg-secondary rounded-lg">
                  <div className="relative flex items-center mb-4">
                    <span className="absolute left-2 text-gray-500">Giá</span>
                    <Input
                      type="number"
                      value={priceBuy}
                      onChange={handlePriceBuyChange}
                      className="remove-arrow  w-full border border-gray-600 focus:!border-yellow-400 hover:!border-yellow-400 focus:!ring-0 text-right pr-16 pl-16"
                      placeholder="0"
                    />
                    <span className="absolute right-2">USDT</span>
                  </div>

                  <div className="relative flex items-center mb-4">
                    <span className="absolute left-2 text-gray-500">
                      Số lượng
                    </span>
                    <Input
                      type="number"
                      value={quantityBuy}
                      onChange={handleQuantityBuyChange}
                      className="remove-arrow w-full border border-gray-600 focus:!border-yellow-400 hover:!border-yellow-400 focus:!ring-0 text-right pr-16 pl-16"
                      placeholder="0"
                      step="0.001"
                    />
                    <span className="absolute right-2">BNB</span>
                  </div>

                  <div className="my-4">
                    <Slider
                      value={sliderValueBuy}
                      max={Number(wallet?.balance?.crypto?.USDT) || 0}
                      step={0.5}
                      onValueChange={handleSliderBuyChange}
                    />
                  </div>

                  <div className="relative flex items-center ">
                    <span className="absolute left-2 text-gray-500">Tổng</span>
                    <Input
                      type="number"
                      value={totalBuy}
                      onChange={handleTotalBuyChange}
                      className=" remove-arrow w-full border border-gray-600 focus:!border-yellow-400 hover:!border-yellow-400 focus:!ring-0 text-right pr-16 pl-16"
                      placeholder="0"
                    />
                    <span className="absolute right-2">USDT</span>
                  </div>

                  {errorBuy && (
                    <p className="text-red-600 text-sm mt-2">{errorBuy}</p>
                  )}

                  <Button
                    onClick={handleBuy}
                    className="mt-4 w-full bg-green-500 hover:bg-green-600"
                  >
                    Mua BNB
                  </Button>
                </div>

                {/* Cột bán */}
                <div className="flex-1 p-5 bg-secondary rounded-lg">
                  <div className="relative flex items-center mb-4">
                    <span className="absolute left-2 text-gray-500">Giá</span>
                    <Input
                      type="number"
                      value={priceSell}
                      onChange={handlePriceSellChange}
                      className="remove-arrow w-full border border-gray-600 focus:!border-yellow-400 hover:!border-yellow-400 focus:!ring-0 text-right pr-16 pl-16"
                      placeholder="0"
                    />
                    <span className="absolute right-2">USDT</span>
                  </div>

                  <div className="relative flex items-center mb-4">
                    <span className="absolute left-2 text-gray-500">
                      Số lượng
                    </span>
                    <Input
                      type="number"
                      value={quantitySell}
                      // value={Number(quantitySell).toFixed(3)}
                      onChange={handleQuantitySellChange}
                      className="remove-arrow w-full border border-gray-600 focus:!border-yellow-400 hover:!border-yellow-400 focus:!ring-0 text-right pr-16 pl-16"
                      placeholder="0"
                      step="0.001"
                    />
                    <span className="absolute right-2">BNB</span>
                  </div>

                  <div className="my-4">
                    <Slider
                      value={sliderValueSell}
                      max={Number(wallet?.balance?.crypto?.BNB) || 0}
                      step={0.01}
                      onValueChange={handleSliderSellChange}
                    />
                  </div>

                  <div className="relative flex items-center ">
                    <span className="absolute left-2 text-gray-500">Tổng</span>
                    <Input
                      type="number"
                      value={totalSell}
                      onChange={handleTotalSellChange}
                      className="remove-arrow w-full border border-gray-600 focus:!border-yellow-400 hover:!border-yellow-400 focus:!ring-0 text-right pr-16 pl-16"
                      placeholder="0"
                    />
                    <span className="absolute right-2">USDT</span>
                  </div>

                  {errorSell && (
                    <p className="text-red-600 text-sm mt-2">{errorSell}</p>
                  )}

                  <Button
                    onClick={handleSell}
                    className="mt-4 w-full bg-red-500 hover:bg-red-600"
                  >
                    Bán BNB
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-1 pb-4 rounded-lg w-full max-w-screen-xl bg-secondary mb-2">
          {" "}
          <TransactionTabs />
        </div>
      </div>
    </>
  );
}

export default OrderLimit;
