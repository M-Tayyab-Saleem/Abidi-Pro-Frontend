import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "../slices/authSlice";
import attendanceTImerSlice from '../slices/attendanceTimer';
import projectReducer from "./projectSlice";
import taskReducer from "./taskSlice";
import attendanceReducer from "../slices/attendanceSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  attendance: attendanceReducer,

  projects: projectReducer,
  tasks: taskReducer,
  attendanceTimer: attendanceTImerSlice,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "attendanceTimer"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

const persistor = persistStore(store);

export { store, persistor };