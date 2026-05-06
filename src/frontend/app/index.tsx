import { Redirect } from "expo-router";

export default function Index() {
    // Kiểm tra xem user đã đăng nhập chưa dựa vào localStorage
    const isAuthenticated =
        typeof window !== "undefined" &&
        !!localStorage.getItem("userEmail");

    if (!isAuthenticated) {
        return <Redirect href="/welcome" />;
    }

    return <Redirect href="/(tabs)/home" />;
}
