import { StyleSheet, View, ViewProps } from "react-native";

export default function Card({ style, children, ...props }: ViewProps) {
    return (
        <View style={[styles.card, style]} {...props}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        marginHorizontal: 16,
        marginBottom: 20,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#E2E8F0",
        borderRadius: 14,
        padding: 16,
    },
});
