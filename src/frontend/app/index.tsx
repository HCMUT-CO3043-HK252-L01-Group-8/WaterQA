import { Redirect } from "expo-router";

export default function Index() {
    const isAuthenticated = false;

    if (!isAuthenticated) {
        return <Redirect href="/login" />;
    }

    return <Redirect href="/(tabs)/home" />;
}
