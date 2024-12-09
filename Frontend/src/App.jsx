import { Route, Routes } from "react-router-dom";
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
// import Auth from "./page/Auth/Auth";
// import { useDispatch, useSelector } from "react-redux";
// import { useEffect } from "react";
// import { getUser } from "./State/Auth/Action";

function App() {
  // const { auth } = useSelector((store) => store);
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(getUser(auth.jwt || localStorage.getItem("jwt")));
  //   console.log("auth", auth.user);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [auth.jwt]);
  return (
    <>
      {/* {auth.user ? ( */}
      <div>
        <Navbar />

        <Routes>
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
        </Routes>
      </div>
      {/* ) : (
        <div>
          <Auth />
        </div>
      )} */}
    </>
  );
}

export default App;
