import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/store/slices/authSlice";
import languageReducer from "@/store/slices/languageSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        language: languageReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;