import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TAB_BAR_HEIGHT = 60;
const EXTRA_PADDING = 16;

export function useTabBarHeight() {
    const insets = useSafeAreaInsets();

    // Phải khớp chính xác với công thức trong _layout.tsx
    const safeBottom = Math.max(insets.bottom, Platform.OS === 'android' ? 16 : 0);
    const tabBarBottom = safeBottom + (Platform.OS === 'ios' ? 12 : 16);

    return tabBarBottom + TAB_BAR_HEIGHT + EXTRA_PADDING;
}