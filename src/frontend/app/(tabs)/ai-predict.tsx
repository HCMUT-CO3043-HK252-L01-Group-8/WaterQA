import AppHeader from "@/components/ui/AppHeader";
import { aiServices } from "@/services/aiServices";
import { useState } from "react";
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

export default function AiPredictScreen() {
    const { t } = useTranslation();
    const [params, setParams] = useState({
        ph: "7.2",
        hardness: "195.1",
        solids: "20000",
        chloramines: "7.5",
        sulfate: "300",
        conductivity: "400",
        organic_carbon: "10",
        trihalomethanes: "60",
        turbidity: "3.5"
    });

    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handlePredict = async () => {
        setIsLoading(true);
        try {
            const aiRes = await aiServices.predictPotability({
                ph: Number(params.ph),
                Hardness: Number(params.hardness),
                Solids: Number(params.solids),
                Chloramines: Number(params.chloramines),
                Sulfate: Number(params.sulfate),
                Conductivity: Number(params.conductivity),
                Organic_carbon: Number(params.organic_carbon),
                Trihalomethanes: Number(params.trihalomethanes),
                Turbidity: Number(params.turbidity)
            });
            
            if (aiRes.success) {
                setResult({
                    prob: aiRes.result.probability,
                    potable: aiRes.result.probability >= 0.5
                });
            } else {
                setResult(null);
                alert(t("aiPredict.predictError", "Lỗi dự đoán!"));
            }
        } catch (error) {
            console.log(error);
            alert(t("aiPredict.networkError", "Lỗi kết nối tới AI"));
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (key: string, value: string) => {
        setParams(prev => ({ ...prev, [key]: value }));
    };

    const renderInput = (label: string, key: keyof typeof params) => (
        <View style={styles.inputGroup} key={key}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={params[key]}
                onChangeText={(val) => handleChange(key, val)}
            />
        </View>
    );

    return (
        <View style={styles.mainContainer}>
            <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
                <View style={styles.header}>
                    <AppHeader />
                    <Text style={styles.screenTitle}>{t("aiPredict.screenTitle", "Dự đoán thủ công (AI)")}</Text>
                    <Text style={styles.screenSubtitle}>{t("aiPredict.screenSubtitle", "Nhập các thông số nước để AI phân tích độ an toàn")}</Text>
                </View>

                <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: 100 }}>
                    {result && (
                        <View style={[styles.resultCard, result.potable ? styles.safeBg : styles.dangerBg]}>
                            <Text style={[styles.resultTitle, result.potable ? styles.safeText : styles.dangerText]}>
                                {result.potable ? t("aiPredict.safe", "An toàn") : t("aiPredict.danger", "Nguy hiểm")}
                            </Text>
                            <Text style={styles.resultDesc}>
                                {t("aiPredict.wqiScore", "WQI (Chỉ số chất lượng): ")}<Text style={{ fontFamily: "Inter-Bold" }}>{Math.round(result.prob * 100)}</Text>
                            </Text>
                        </View>
                    )}

                    <View style={styles.formContainer}>
                        {renderInput(t("aiPredict.phLabel", "Độ pH (pH)"), "ph")}
                        {renderInput(t("aiPredict.hardnessLabel", "Độ cứng (Hardness mg/l)"), "hardness")}
                        {renderInput(t("aiPredict.solidsLabel", "Tổng chất rắn hoà tan (Solids ppm)"), "solids")}
                        {renderInput(t("aiPredict.chloraminesLabel", "Chloramines (ppm)"), "chloramines")}
                        {renderInput(t("aiPredict.sulfateLabel", "Sulfate (mg/l)"), "sulfate")}
                        {renderInput(t("aiPredict.conductivityLabel", "Độ dẫn điện (Conductivity μS/cm)"), "conductivity")}
                        {renderInput(t("aiPredict.organicCarbonLabel", "Carbon hữu cơ (Organic Carbon ppm)"), "organic_carbon")}
                        {renderInput(t("aiPredict.trihalomethanesLabel", "Trihalomethanes (μg/l)"), "trihalomethanes")}
                        {renderInput(t("aiPredict.turbidityLabel", "Độ đục (Turbidity NTU)"), "turbidity")}
                    </View>

                    <TouchableOpacity style={styles.predictBtn} onPress={handlePredict} disabled={isLoading}>
                        {isLoading ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <Text style={styles.predictBtnText}>{t("aiPredict.predictBtn", "Dự đoán chất lượng")}</Text>
                        )}
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: "#FFFFFF" },
    safeArea: { flex: 1 },
    scrollView: { flex: 1, paddingHorizontal: 16 },
    header: { padding: 16, paddingBottom: 0 },
    screenTitle: { fontSize: 24, fontFamily: "Inter-Bold", color: "#0F172B", marginTop: 12 },
    screenSubtitle: { fontSize: 14, fontFamily: "Inter-Regular", color: "#64748B", marginTop: 4, marginBottom: 16 },
    formContainer: { backgroundColor: "#F8FAFC", padding: 16, borderRadius: 16, borderWidth: 1, borderColor: "#E2E8F0" },
    inputGroup: { marginBottom: 16 },
    label: { fontSize: 13, fontFamily: "Inter-Medium", color: "#475569", marginBottom: 6 },
    input: { backgroundColor: "#FFF", borderWidth: 1, borderColor: "#CBD5E1", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16, fontFamily: "Inter-Regular", color: "#0F172B" },
    predictBtn: { backgroundColor: "#00A89D", paddingVertical: 16, borderRadius: 12, alignItems: "center", marginTop: 24, marginBottom: 40 },
    predictBtnText: { color: "#FFF", fontSize: 16, fontFamily: "Inter-Bold" },
    resultCard: { padding: 20, borderRadius: 16, marginBottom: 20, alignItems: "center", borderWidth: 1 },
    safeBg: { backgroundColor: "#F0FDF4", borderColor: "#86EFAC" },
    dangerBg: { backgroundColor: "#FEF2F2", borderColor: "#FECACA" },
    safeText: { color: "#166534" },
    dangerText: { color: "#991B1B" },
    resultTitle: { fontSize: 24, fontFamily: "Inter-Bold", marginBottom: 8 },
    resultDesc: { fontSize: 16, fontFamily: "Inter-Medium", color: "#334155" }
});
