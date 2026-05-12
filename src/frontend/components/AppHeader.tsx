import React from 'react';
import { Image } from 'expo-image';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function AppHeader() {
    return (
        <View style={styles.appTitleRow}>
            <LinearGradient
                colors={['#00B8DB', '#009689']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.logoPlaceholder}
            >
                <Image 
                    source={require('@/assets/images/logo_app.svg')} 
                    style={{ width: 20, height: 20, tintColor: '#FFFFFF' }} 
                    contentFit="contain"
                />
            </LinearGradient>
            <View>
                <Text style={styles.appName}>Theo dõi chất lượng nước thông minh</Text>
                <Text style={styles.appSubtitle}>Ứng dụng hàng đầu Việt Nam</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    appTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    logoPlaceholder: { width: 35, height: 35, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 8 },
    appName: { fontSize: 16, fontWeight: '600', color: '#0F172B', fontFamily: 'Inter-SemiBold'},
    appSubtitle: { fontSize: 10, color: '#62748E', fontFamily: 'Inter-Regular'}
});