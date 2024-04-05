import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {MaterialIcons, Ionicons} from '@expo/vector-icons'
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux'

const AccountScreen =() => {
    const navigation = useNavigation();
    const user = useSelector((state) => state.user.user);
    
    return (
        <SafeAreaView style={{flex: 1, alignItems: 'center', justifyContent: 'start', px: 4}}>
            <TouchableOpacity
                onPress={() => navigation.navigate('ChangePasswordScreen')}
                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 4, paddingHorizontal: 6 }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <MaterialIcons name="lock-open-outline" size={24} color="#555" />
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'black', paddingLeft: 3 }}>
                        Change Password
                    </Text>
                </View>
                <MaterialIcons name="chevron-right" size={32} color="#555" />
            </TouchableOpacity>
        </SafeAreaView>
    )
}

export default AccountScreen;