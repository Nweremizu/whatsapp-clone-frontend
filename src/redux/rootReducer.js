import { combineReducers } from "redux";
import storage from "redux-persist/lib/storage";
// slices
import authReducer from "./slices/auth";
import chatReducer from "./slices/chat";
import appReducer from "./slices/app";

const rootPersistConfig = {
  key: "root",
  storage,
  keyPrefix: "redux-",
};

const rootReducer = combineReducers({
  auth: authReducer,
  chat: chatReducer,
  app: appReducer,
});

export { rootReducer, rootPersistConfig };
