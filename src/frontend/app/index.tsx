import { Redirect } from "expo-router";
import { useState, useEffect } from "react";

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    return <Redirect href={isAuthenticated ? "/(tabs)/home" : "/welcome"} />;
}
