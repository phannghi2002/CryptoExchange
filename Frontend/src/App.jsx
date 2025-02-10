import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./page/Home/Home";
import Navbar from "./page/Navbar/Navbar";
import Portfolio from "./page/Portfolio/Portfolio";
import Profile from "./page/Profile/Profile";
import Activity from "./page/Activity/Activity";
import SearchCoin from "./page/SearchCoin/SearchCoin";
import Notfound from "./page/Notfound/Notfound";
import Watchlist from "./page/Watchlist/Watchlist";
import Wallet from "./page/Wallet/Wallet";
import PaymentDetails from "./page/PaymentDetails/PaymentDetails";
import Withdrawal from "./page/Withdrawal/Withdrawal";
import StockDetails from "./page/StockDetails/StockDetails";
import Auth from "./page/Auth/Auth";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getUser } from "./State/Auth/Action";
import { ModalOTP } from "./page/Modal/ModalOTP";

function App() {
  const { auth } = useSelector((store) => store);
  const dispatch = useDispatch();

  const access_token = localStorage.getItem("access_token");

  // Kiểm tra nếu pathname thuộc các trang Auth
  const isAuthPage = ["/signin", "/signup", "/forgot-password"].includes(
    location.pathname
  );

  console.log(location.pathname);

  useEffect(() => {
    dispatch(getUser(auth.jwt || localStorage.getItem("jwt") || access_token));
    console.log("auth", auth.user);
  }, [auth.jwt]);

  return (
    <>
      <Navbar />

      <Routes>
        {auth.jwt || access_token ? (
          <>
            <Route path="/overview" element={<Home />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/activity" element={<Activity />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/search" element={<SearchCoin />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/paymentdetails" element={<PaymentDetails />} />
            <Route path="/withdrawal" element={<Withdrawal />} />
            <Route path="market/:id" element={<StockDetails />} />
            <Route path="*" element={<Notfound />} />
          </>
        ) : (
          <>
            <Route path="/overview" element={<Home />} />

            <Route path="/modal" element={<ModalOTP />} />

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
