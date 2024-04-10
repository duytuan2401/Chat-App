import { View, Text, SafeAreaView, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import {useNavigation} from '@react-navigation/native';
import {MaterialIcons, Entypo, Ionicons} from '@expo/vector-icons'
import {useSelector} from 'react-redux'

const ProfileScreen =() => {
    const navigation = useNavigation();
    const user = useSelector((state) => state.user.user);
    
    const handleLogout  = async () => {
        try {
          navigation.navigate("LoginScreen");
          setLoading(true);
          await signOut(firebaseAuth); // Thực hiện đăng xuất từ Firebase Authentication
    
        } catch (error) {
          console.error('Error signing out:', error.message);
        } finally {
          setLoading(false);
        }
    };

    return (
        <SafeAreaView 
            style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'start',
                px: 4
            }}
        >
        {/* icons */}
            <View
                style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingLeft: 4,
                    paddingRight: 4
                }}
            >
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialIcons name="chevron-left" size={32} color="#555"/>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Entypo name="dots-three-vertical" size={24} color="#555"/>
                </TouchableOpacity>
            </View>
        {/* profile */}
            <View
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center' 
                }}
            >
                <View 
                    style={{
                        position: 'relative',
                        borderWidth: 2, 
                        borderColor: 'green',
                        padding: 1, 
                        borderRadius: 10  
                    }}
                >
                <Image
                    source={{ uri: user?.profilePic }}
                    style={{ width: 50, height: 50 }}
                    resizeMode="contain"
                />

                </View>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'black', paddingTop: 3 }}>
                    {user?.fullName}
                </Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'black' }}>
                    {user?.providerData.email}
                </Text>
            </View>
        {/*icons selection */}  
            <View
                style={{
                    width: '100%',
                    flexDirection: 'row', 
                    alignItems: 'center', 
                    justifyContent: 'space-evenly', 
                    paddingTop: 12 
                }}
            >

                <View
                    style={{ alignItems: 'center', justifyContent: 'center' }}
                >
                    <TouchableOpacity
                        style={{
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            width: 40, 
                            height: 40, 
                            borderRadius: 6,
                            backgroundColor: '#D5D5DA'
                        }}  
                    >
                        <MaterialIcons name="messenger-outline" size={24} color="#555"/>
                    </TouchableOpacity>
                    <Text
                        style={{ fontSize: 14, color: 'black', paddingTop: 1 }}
                    >
                        Message
                    </Text>
                </View>

                <View
                    style={{ alignItems: 'center', justifyContent: 'center' }}
                >
                    <TouchableOpacity
                        style={{
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            width: 40, 
                            height: 40, 
                            borderRadius: 6,
                            backgroundColor: '#D5D5DA'
                        }}  
                    >
                        <Ionicons name="videocam-outline" size={24} color="#555"/>
                    </TouchableOpacity>
                    <Text
                        style={{ fontSize: 14, color: 'black', paddingTop: 1 }}
                    >
                        Video Call
                    </Text>
                </View>

                <View
                    style={{ alignItems: 'center', justifyContent: 'center' }}
                >
                    <TouchableOpacity
                        style={{
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            width: 40, 
                            height: 40, 
                            borderRadius: 6,
                            backgroundColor: '#D5D5DA'
                        }}  
                    >
                        <Ionicons name="call-outline" size={24} color="#555"/>
                    </TouchableOpacity>
                    <Text
                        style={{ fontSize: 14, color: 'black', paddingTop: 1 }}
                    >
                        Call
                    </Text>
                </View>

                <View
                    style={{ alignItems: 'center', justifyContent: 'center' }}
                >
                    <TouchableOpacity
                        style={{
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            width: 40, 
                            height: 40, 
                            borderRadius: 6,
                            backgroundColor: '#D5D5DA'
                        }}  
                    >
                        <Entypo name="dots-three-horizontal" size={24} color="#555"/>
                    </TouchableOpacity>
                    <Text
                        style={{ fontSize: 14, color: 'black', paddingTop: 1 }}
                    >
                        More
                    </Text>
                </View>
            </View>
            
            {/* medias shared */}
            <View 
                style={{
                    width: '100%', 
                    paddingHorizontal: 12, 
                    marginBottom: 12,
                    marginTop: 12
                }}
            >
                <View
                    style={{ 
                        width: '100%', 
                        flexDirection: 'row', 
                        alignItems: 'center', 
                        justifyContent: 'space-between' 
                    }}
                >
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'black' }}>
                        Media Share
                    </Text>
                    <TouchableOpacity>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', textTransform: 'uppercase', color: 'black' }}>
                            View All
                        </Text>
                    </TouchableOpacity>
                </View>
                <View
                    style={{ 
                        width: '100%', 
                        flexDirection: 'row', 
                        alignItems: 'center', 
                        justifyContent: 'space-between' 
                    }}
                >
                    <TouchableOpacity
                        style={{
                            width: 100,
                            height: 100,
                            margin: 10, 
                            borderRadius: 10,
                            backgroundColor: '#ccc',
                            overflow: 'hidden' 
                        }}
                    >
                        <Image
                            source={{
                                uri: "https://images.app.goo.gl/xrjAdGxA7vDP7H9A9"
                            }}
                            style={{width: '100%', height: '100%'}}
                            resizeMode='cover'
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            width: 100,
                            height: 100,
                            margin: 10, 
                            borderRadius: 10,
                            backgroundColor: '#ccc',
                            overflow: 'hidden' 
                        }}
                    >
                        <Image
                            source={{
                                uri: "https://images.app.goo.gl/xrjAdGxA7vDP7H9A9"
                            }}
                            style={{width: '100%', height: '100%'}}
                            resizeMode='cover'
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            width: 100,
                            height: 100,
                            margin: 10 ,
                            borderRadius: 10,
                            backgroundColor: '#ccc',
                            overflow: 'hidden' 
                        }}
                    >
                        <Image
                            source={{
                                uri: "https://images.app.goo.gl/xrjAdGxA7vDP7H9A9"
                            }}
                            style={{width: '100%', height: '100%'}}
                            resizeMode='cover'
                        />
                        <View style={{ position: 'absolute', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#5A5650' }}>
                            <Text style={{ fontSize: 16, color: 'white', fontWeight: 'bold' }}>
                                250+
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

        {/* setting options */}
            <View style={{ width: '100%', paddingHorizontal: 6, paddingVertical: 4, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <MaterialIcons name="security" size={24} color="#555" />
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'black', paddingLeft: 3 }}>
                        Privacy
                    </Text>
                </View>
                <MaterialIcons name="chevron-right" size={32} color="#555" />
            </View>

            <View style={{ width: '100%', paddingHorizontal: 6, paddingVertical: 4, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <MaterialIcons name="message" size={24} color="#555" />
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'black', paddingLeft: 3 }}>
                        Group
                    </Text>
                </View>
                <MaterialIcons name="chevron-right" size={32} color="#555" />
            </View>

            <View style={{ width: '100%', paddingHorizontal: 6, paddingVertical: 4, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <MaterialIcons name="music-note" size={24} color="#555" />
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'black', paddingLeft: 3 }}>
                        Media's & Downloads
                    </Text>
                </View>
                <MaterialIcons name="chevron-right" size={32} color="#555" />
            </View>
            
            <View style={{ width: '100%', paddingHorizontal: 6, paddingVertical: 4, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('AccountScreen')}
                        style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}
                    >
                        <MaterialIcons name="person" size={24} color="#555" />
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'black', paddingLeft: 3 }}>
                            Account
                        </Text>
                        
                        <MaterialIcons name="chevron-right" size={32} color="#555" />
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity onPress={handleLogout} style={{ width: '100%', paddingHorizontal: 6, paddingVertical: 4, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'red', paddingLeft: 3, fontWeight:'bold'}}>
                    Logout
                </Text>
            </TouchableOpacity>

        </SafeAreaView>
    )
}
export default ProfileScreen;