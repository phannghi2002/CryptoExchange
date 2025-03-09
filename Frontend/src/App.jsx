import { Route, Routes } from "react-router-dom";
import Home from "./page/Home/Home";
import Navbar from "./page/Navbar/Navbar";
import Profile from "./page/Profile/Profile";
import SearchCoin from "./page/SearchCoin/SearchCoin";
import Notfound from "./page/Notfound/Notfound";
import Watchlist from "./page/Watchlist/Watchlist";

import StockDetails from "./page/StockDetails/StockDetails";
import Auth from "./page/Auth/Auth";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getUser } from "./State/Auth/Action";
import Kyc from "./page/Portfolio/Portfolio";
import VnPayOrderForm from "./page/PaymentVNPay/VnPayOrderForm";
import PaymentResult from "./page/PaymentVNPay/PaymentResult";
import Wallet from "./page/Wallet/Wallet";
import Market from "./page/Market/Market";
import Order from "./page/Order/Order";
// import PaymentReturn from "./page/PaymentVNPay/PaymentReturn";

function App() {
  const { auth } = useSelector((store) => store);
  const dispatch = useDispatch();

  const access_token = localStorage.getItem("access_token");
  const token = localStorage.getItem("jwt");

  // Kiểm tra nếu pathname thuộc các trang Auth
  // const isAuthPage = ["/signin", "/signup", "/forgot-password"].includes(
  //   location.pathname
  // );

  console.log(location.pathname);

  useEffect(() => {
    dispatch(getUser(auth.jwt || localStorage.getItem("jwt") || access_token));
    console.log("auth", auth.user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.jwt]);

  return (
    <>
      <Navbar />

      <Routes>
        {token || access_token ? (
          <>
            <Route path="/overview" element={<Home />} />
            <Route path="/kyc" element={<Kyc />} />
            <Route path="/watchlist" element={<Watchlist />} />

            <Route path="/profile" element={<Profile />} />
            <Route path="/search" element={<SearchCoin />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/vnpay" element={<VnPayOrderForm />} />

            <Route path="/payment-result" element={<PaymentResult />} />
            <Route path="/order" element={<Order />} />
            <Route path="/market" element={<Market />} />
            {/* <Route path="market/:id" element={<StockDetails />} /> */}
            <Route path="stock/:id" element={<StockDetails />} />

            <Route path="*" element={<Notfound />} />
          </>
        ) : (
          <>
            <Route path="/overview" element={<Home />} />

            <Route path="market/:id" element={<StockDetails />} />
            <Route path="/auth/*" element={<Auth />} />

            {/* <Route path="*" element={<Navigate to="/auth/signin" replace />} /> */}
          </>
        )}
      </Routes>
    </>
  );
}

export default App;
