  // src/Store/index.js or src/store.js
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "../slices/authSlice";
import attendanceTImerSlice from '../slices/attendanceTimer'; 
import projectReducer from "./projectSlice";
import taskReducer from "./taskSlice";

// 🧩 Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  projects: projectReducer,
  tasks: taskReducer,
  attendanceTimer: attendanceTImerSlice,
});

// 🔐 Persistence config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "attendanceTimer"], // Reducers to persist
};

// 🎯 Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 🏗 Create store
const store = configureStore({
  reducer: persistedReducer,
  
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }),
});

// 🚀 Create persistor
const persistor = persistStore(store);

export { store, persistor };