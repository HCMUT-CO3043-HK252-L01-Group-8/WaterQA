import React, { createElement } from 'react';
import { View, Platform } from 'react-native';

interface WebDatePickerProps {
    value: Date;
    onChange: (date: Date) => void;
}

export default function WebDatePicker({ value, onChange }: WebDatePickerProps) {
    if (Platform.OS !== 'web') return null;

    // Fix timezone shift when converting to YYYY-MM-DD
    const dateValue = value 
        ? new Date(value.getTime() - value.getTimezoneOffset() * 60000).toISOString().split('T')[0] 
        : '';
        
    const maxDate = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0];

    return (
        <View style={{ padding: 10, alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, marginHorizontal: 16, marginBottom: 16, elevation: 2, shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.1, shadowRadius: 4 }}>
            {createElement('input', {
                type: 'date',
                value: dateValue,
                max: maxDate,
                onChange: (e: any) => {
                    if (e.target.value) {
                        onChange(new Date(e.target.value));
                    }
                },
                style: {
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '16px',
                    fontFamily: 'Inter-Medium',
                    color: '#334155',
                    backgroundColor: '#F8FAFC',
                    outline: 'none',
                    cursor: 'pointer',
                    width: '100%',
                    maxWidth: 300,
                    textAlign: 'center'
                }
            })}
        </View>
    );
}
