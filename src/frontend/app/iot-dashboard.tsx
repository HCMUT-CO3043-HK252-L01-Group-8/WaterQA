import React, { useEffect, useCallback, useRef, useState } from 'react';
import {
  Alert,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getLatestTelemetrySnapshot } from '../services/api';

// --- Constants & Thresholds ---
const REFRESH_INTERVAL_MS = 8000; // 8 seconds
const TEMP_WARNING_THRESHOLD = 40; // degrees Celsius (demo threshold)
const HUMI_WARNING_THRESHOLD = 80; // %
const LEAKAGE_DANGER_VALUE = '1';
const ALERT_THROTTLE_MS = 30_000;

// --- Types ---
type SensorData = {
  temp: string | number | null;
  humi: string | number | null;
  leakage: string | number | null;
};

export default function IotDashboard() {
  const [data, setData] = useState<SensorData>({ temp: null, humi: null, leakage: null });
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const requestSeq = useRef(0);
  const abortRef = useRef<AbortController | null>(null);
  const lastTempAlertAt = useRef<number>(0);
  const lastLeakAlertAt = useRef<number>(0);

  const loadData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    setError(null);
    const thisReq = ++requestSeq.current;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const snap = await getLatestTelemetrySnapshot({ signal: controller.signal });
      if (thisReq !== requestSeq.current) return;

      setData({
        temp: snap.temp.value,
        humi: snap.humi.value,
        leakage: snap.leakage.value,
      });
    } catch (err) {
      if ((err as any)?.name === 'AbortError') return;
      console.error(err);
      setError('Failed to fetch data from the server. Please check your connection.');
    } finally {
      if (thisReq === requestSeq.current) {
        setLoading(false);
        if (isRefresh) setRefreshing(false);
      }
    }
  }, []);

  // --- Auto-refresh Effect ---
  useEffect(() => {
    loadData(); // initial load

    const intervalId = setInterval(() => {
      loadData();
    }, REFRESH_INTERVAL_MS);

    return () => {
      abortRef.current?.abort();
      clearInterval(intervalId);
    };
  }, [loadData]);

  const onRefresh = () => {
    loadData(true);
  };

  // --- Render Helpers ---
  const isTempHigh = data.temp !== null && Number(data.temp) > TEMP_WARNING_THRESHOLD;
  const isHumiHigh = data.humi !== null && Number(data.humi) > HUMI_WARNING_THRESHOLD;
  const isLeakageDetected = data.leakage !== null && String(data.leakage) === LEAKAGE_DANGER_VALUE;

  // --- Alerts (throttled) ---
  useEffect(() => {
    const now = Date.now();

    if (isTempHigh && now - lastTempAlertAt.current > ALERT_THROTTLE_MS) {
      lastTempAlertAt.current = now;
      Alert.alert(
        'Warning: High temperature',
        `Temperature is ${String(data.temp)}°C (threshold ${TEMP_WARNING_THRESHOLD}°C).`,
      );
    }

    if (isLeakageDetected && now - lastLeakAlertAt.current > ALERT_THROTTLE_MS) {
      lastLeakAlertAt.current = now;
      Alert.alert('Danger: Leakage detected', 'Leakage signal is active. Please check immediately.');
    }
  }, [data.temp, isLeakageDetected, isTempHigh]);

  // Render Alert Banners
  const renderAlerts = () => {
    return (
      <View style={styles.alertContainer}>
        {isTempHigh && (
          <View style={[styles.alertBox, styles.warningBox]}>
            <Text style={styles.alertIcon}>⚠️</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.warningTitle}>Warning: High Temperature</Text>
              <Text style={styles.alertDesc}>Temperature is above normal ({data.temp}°C).</Text>
            </View>
          </View>
        )}
        {isLeakageDetected && (
          <View style={[styles.alertBox, styles.dangerBox]}>
            <Text style={styles.alertIcon}>🚨</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.dangerTitle}>Danger: Leakage Detected!</Text>
              <Text style={styles.alertDesc}>Water leakage signal is currently active.</Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  // Check for empty data
  const isEmpty = data.temp === null && data.humi === null && data.leakage === null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>IoT Dashboard</Text>
          <Text style={styles.headerSubtitle}>Real-time Telemetry Data</Text>
        </View>

        {loading && !refreshing ? (
          <View style={styles.centerBox}>
            <ActivityIndicator size="large" color="#0092B8" />
            <Text style={styles.loadingText}>Fetching latest data...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>❌ {error}</Text>
          </View>
        ) : isEmpty ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>No telemetry data available.</Text>
          </View>
        ) : (
          <View>
            {renderAlerts()}

            <View style={styles.cardsGrid}>
              {/* Temperature Card */}
              <View style={[styles.card, isTempHigh && styles.cardWarning]}>
                <Text style={styles.cardIcon}>🌡️</Text>
                <Text style={styles.cardLabel}>Temperature</Text>
                <Text style={[styles.cardValue, isTempHigh && styles.textWarning]}>
                  {data.temp !== null ? `${data.temp}°C` : '--'}
                </Text>
                <Text style={styles.cardStatus}>
                  {isTempHigh ? 'Above Normal' : 'Normal'}
                </Text>
              </View>

              {/* Humidity Card */}
              <View style={[styles.card, isHumiHigh && styles.cardWarning]}>
                <Text style={styles.cardIcon}>💧</Text>
                <Text style={styles.cardLabel}>Humidity</Text>
                <Text style={[styles.cardValue, isHumiHigh && styles.textWarning]}>
                  {data.humi !== null ? `${data.humi}%` : '--'}
                </Text>
                <Text style={styles.cardStatus}>
                  {isHumiHigh ? 'High' : 'Normal'}
                </Text>
              </View>

              {/* Leakage Card */}
              <View style={[styles.card, styles.fullWidthCard, isLeakageDetected && styles.cardDanger]}>
                <Text style={styles.cardIcon}>⚠️</Text>
                <Text style={styles.cardLabel}>Leakage Status</Text>
                <Text style={[styles.cardValue, isLeakageDetected && styles.textDanger]}>
                  {data.leakage !== null
                    ? String(data.leakage) === '0'
                      ? 'Safe (0)'
                      : 'Warning (1)'
                    : '--'}
                </Text>
                <Text style={styles.cardStatus}>
                  {isLeakageDetected ? 'Immediate Attention Required' : 'All clear'}
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  centerBox: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#64748B',
    fontSize: 14,
  },
  errorBox: {
    backgroundColor: '#FEE2E2',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  errorText: {
    color: '#991B1B',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  emptyBox: {
    padding: 40,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyText: {
    color: '#94A3B8',
    fontSize: 16,
  },
  alertContainer: {
    marginBottom: 20,
    gap: 12,
  },
  alertBox: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    alignItems: 'center',
  },
  warningBox: {
    backgroundColor: '#FFF7ED',
    borderLeftColor: '#F97316',
  },
  dangerBox: {
    backgroundColor: '#FEF2F2',
    borderLeftColor: '#EF4444',
  },
  alertIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#9A3412',
    marginBottom: 4,
  },
  dangerTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#991B1B',
    marginBottom: 4,
  },
  alertDesc: {
    fontSize: 12,
    color: '#475569',
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  card: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  fullWidthCard: {
    minWidth: '100%',
  },
  cardWarning: {
    borderColor: '#FDBA74',
    backgroundColor: '#FFF7ED',
  },
  cardDanger: {
    borderColor: '#FCA5A5',
    backgroundColor: '#FEF2F2',
  },
  cardIcon: {
    fontSize: 28,
    marginBottom: 12,
  },
  cardLabel: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
    fontWeight: '500',
  },
  cardValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 4,
  },
  cardStatus: {
    fontSize: 12,
    color: '#94A3B8',
  },
  textWarning: {
    color: '#EA580C',
  },
  textDanger: {
    color: '#DC2626',
  },
});
