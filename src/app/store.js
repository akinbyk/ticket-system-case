// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "../api/baseApi";
import authReducer from "../features/auth/authSlice";
import uiReducer from "../features/ui/uiSlice";
import requestsUiReducer from "../features/requests/requestsSlice.js";


export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    requestsUi: requestsUiReducer,  
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefault) => getDefault().concat(baseApi.middleware),
});

