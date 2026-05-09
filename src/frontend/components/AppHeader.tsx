import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function AppHeader() {
    return (
        <View style={styles.appTitleRow}>
            <View style={styles.logoPlaceholder}>
                <Feather name="droplet" size={20} color="#FFFFFF" />
            </View>
            <View>
                <Text style={styles.appName}>Theo dõi chất lượng nước thông minh</Text>
                <Text style={styles.appSubtitle}>Ứng dụng hàng đầu Việt Nam</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    appTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    logoPlaceholder: { width: 35, height: 35, backgroundColor: '#00B8DB', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 8 },
    appName: { fontSize: 16, fontWeight: '600', color: '#0F172B' },
    appSubtitle: { fontSize: 10, color: '#62748E' },
});