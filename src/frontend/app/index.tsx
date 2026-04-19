import { Redirect } from "expo-router";
import { useState, useEffect } from "react";

export default function Index() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    if (!isAuthenticated) {
        return <Redirect href="/login" />;
    }

    return <Redirect href="/(tabs)/home" />;
}
