import { applyMiddleware, combineReducers, legacy_createStore } from "redux";
import { thunk } from "redux-thunk";
import authReducer from "./Auth/Reducer";
import coinReducer from "./Coin/Reducer";
import watchlistReducer from "./Watchlist/Reducer";
import profileReducer from "./Profile/Reducer";
import walletReducer from "./Wallet/Reducer";
import transactionReducer from "./Transaction/Reducer";
import orderReducer from "./Order/Reducer";

const rootReducer = combineReducers({
  auth: authReducer,
  coin: coinReducer,
  watchlist: watchlistReducer,
  profile: profileReducer,
  wallet: walletReducer,
  transaction: transactionReducer,
  order: orderReducer,
});

export const store = legacy_createStore(rootReducer, applyMiddleware(thunk));
