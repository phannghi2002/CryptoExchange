import { applyMiddleware, combineReducers, legacy_createStore } from "redux";
import { thunk } from "redux-thunk";
import authReducer from "./Auth/Reducer";
import coinReducer from "./Coin/Reducer";
import watchlistReducer from "./Watchlist/Reducer";

const rootReducer = combineReducers({
  auth: authReducer,
  coin: coinReducer,
  watchlist: watchlistReducer,
});

export const store = legacy_createStore(rootReducer, applyMiddleware(thunk));
