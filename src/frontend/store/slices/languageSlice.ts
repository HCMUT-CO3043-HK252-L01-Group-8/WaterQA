import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "@/i18n";

interface LanguageState {
    currentLanguage: string;
}

const initialState: LanguageState = {
    currentLanguage: "vi",
};

const languageSlice = createSlice({
    name: "language",
    initialState,
    reducers: {
        setLanguage: (state, action: PayloadAction<string>) => {
            const newLang = action.payload;
            state.currentLanguage = newLang;
            AsyncStorage.setItem("appLanguage", newLang).catch((err: any) => console.error("Lỗi lưu ngôn ngữ cục bộ:", err));
            i18n.changeLanguage(newLang);
        },
    },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
