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
import { THRESHOLDS, REFRESH_INTERVALS } from '../config/feeds';

// --- Constants & Thresholds ---
const REFRESH_INTERVAL_MS = REFRESH_INTERVALS.DASHBOARD_REFRESH_MS;
const TEMP_WARNING_THRESHOLD = THRESHOLDS.TEMP_WARNING;
const HUMI_WARNING_THRESHOLD = THRESHOLDS.HUMIDITY_WARNING;
const LIGHT_WARNING = THRESHOLDS.LIGHT_WARNING;
const LIGHT_NORMAL = THRESHOLDS.LIGHT_NORMAL;
const LIGHT_CHECK_DURATION = THRESHOLDS.LIGHT_CHECK_DURATION_MS;
const ALERT_THROTTLE_MS = REFRESH_INTERVALS.ALERT_THROTTLE_MS;

// --- Types ---
type SensorData = {
  temp: string | number | null;
  humi: string | number | null;
  light: string | number | null;
};

type LightHistory = {
  timestamp: number;
  value: number;
};

export default function IotDashboard() {
  const [data, setData] = useState<SensorData>({ temp: null, humi: null, light: null });
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const requestSeq = useRef(0);
  const abortRef = useRef<AbortController | null>(null);
  const lastTempAlertAt = useRef<number>(0);
  const lastLightAlertAt = useRef<number>(0);
  
  // Light tracking for 5-second window
  const lightHistoryRef = useRef<LightHistory[]>([]);

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

      const newLightValue = snap.leakage.value ? Number(snap.leakage.value) : null;

      setData({
        temp: snap.temp.value,
        humi: snap.humi.value,
        light: newLightValue,
      });

      // Track light history for 5-second window
      if (newLightValue !== null) {
        const now = Date.now();
        lightHistoryRef.current.push({ timestamp: now, value: newLightValue });
        
        // Remove old entries (older than 5 seconds)
        lightHistoryRef.current = lightHistoryRef.current.filter(
          (entry) => now - entry.timestamp < LIGHT_CHECK_DURATION
        );
      }
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
  const lightValue = data.light !== null ? Number(data.light) : null;
  const isLightHigh = lightValue !== null && lightValue >= LIGHT_WARNING;
  const isLightNormal = lightValue !== null && lightValue < LIGHT_NORMAL;

  // Check if light has been >= 60 for continuous 5 seconds
  const isLidOpened = useCallback(() => {
    if (lightHistoryRef.current.length === 0) return false;

    const now = Date.now();
    const recentReadings = lightHistoryRef.current.filter(
      (entry) => now - entry.timestamp < LIGHT_CHECK_DURATION
    );

    // Check if we have readings within the 5-second window
    if (recentReadings.length === 0) return false;

    // Check if ALL readings in the window are >= LIGHT_WARNING (60)
    const allReadingsHigh = recentReadings.every((entry) => entry.value >= LIGHT_WARNING);
    
    // Check if the oldest reading in window is at least 5 seconds old
    const oldestReading = Math.min(...recentReadings.map((r) => r.timestamp));
    const readingDuration = now - oldestReading;

    return allReadingsHigh && readingDuration >= LIGHT_CHECK_DURATION;
  }, []);

  // --- Alerts (throttled) ---
  useEffect(() => {
    const now = Date.now();

    if (isTempHigh && now - lastTempAlertAt.current > ALERT_THROTTLE_MS) {
      lastTempAlertAt.current = now;
      Alert.alert(
        'Warning: High Temperature',
        `Temperature is ${String(data.temp)}°C (threshold: ${TEMP_WARNING_THRESHOLD}°C).`,
      );
    }

    if (isLidOpened() && now - lastLightAlertAt.current > ALERT_THROTTLE_MS) {
      lastLightAlertAt.current = now;
      Alert.alert(
        '⚠️ Alert: Tank Lid Opened',
        `Light sensor detected ${lightValue} (threshold: ${LIGHT_WARNING}). Someone may have opened the tank lid!`,
      );
    }
  }, [data.temp, isTempHigh, lightValue]);

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
        {isLidOpened() && (
          <View style={[styles.alertBox, styles.dangerBox]}>
            <Text style={styles.alertIcon}>🚨</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.dangerTitle}>Danger: Tank Lid Opened!</Text>
              <Text style={styles.alertDesc}>High light level detected ({lightValue}). Check immediately!</Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  // Check for empty data
  const isEmpty = data.temp === null && data.humi === null && data.light === null;

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

              {/* Light Card */}
              <View style={[styles.card, styles.fullWidthCard, isLidOpened() && styles.cardDanger]}>
                <Text style={styles.cardIcon}>💡</Text>
                <Text style={styles.cardLabel}>Light Level</Text>
                <Text style={[styles.cardValue, isLidOpened() && styles.textDanger]}>
                  {lightValue !== null ? `${lightValue}` : '--'}
                </Text>
                <Text style={styles.cardStatus}>
                  {isLidOpened()
                    ? '🚨 Lid Opened! (≥60 for 5s)'
                    : isLightHigh
                      ? `High (${lightValue} ≥ ${LIGHT_WARNING})`
                      : isLightNormal
                        ? 'Normal (< 50)'
                        : 'Low Light'}
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
