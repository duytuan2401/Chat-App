import { View, Text, Image, Dimensions, TouchableOpacity, ScrollView, TextInput, Alert  } from 'react-native'
import React, { useState } from 'react'
import {BGImage, Logo} from "../assets"
import { UserTextInput } from '../components';
import {useNavigation} from '@react-navigation/native';
import {avatars} from '../utils/supports';
import { MaterialIcons} from '@expo/vector-icons';
import {BlurView} from 'expo-blur';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { firebaseAuth, firestoreDB } from '../config/firebase.config';
import { doc, setDoc } from 'firebase/firestore';



export default function SignUpScreen() {
    const screenWidth = Math.round(Dimensions.get("window").width); 
    const screenHeight = Math.round(Dimensions.get("window").height); 
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [avatar, setAvatar] = useState(avatars[0]?.image.asset.url);
    const [isAvatarMenu, setIsAvatarMenu] = useState(false);
    const [getEmailValidationStatus, setGetEmailValidationStatus] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [emailSent, setEmailSent] = useState(false);
    const [alert, setAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState(null);

    const navigation = useNavigation();

    const handleAvatar = (item) => {
        setAvatar(item?.image.asset.url);
        setIsAvatarMenu(false);
    };

    const handleSignUp = async () => {
        if (getEmailValidationStatus && email !== "") {
            await createUserWithEmailAndPassword(firebaseAuth, email, password)
                .then(async (userCred) => {
                    const data = {
                        _id: userCred?.user.uid,
                        fullName: name,
                        profilePic: avatar,
                        providerData: userCred.user.providerData[0],
                    };

                    await setDoc(doc(firestoreDB, 'users', userCred?.user.uid), data);
                    navigation.navigate("LoginScreen");
                })
                .catch(err => {
                    console.log('Error creating user:', err.message);
                    if (err.message.includes("(auth/invalid-email)")) {
                        setAlert(true);
                        setAlertMessage("Invalid Email Address");
                    }
                    if (err.message.includes("(auth/weak-password)")) {
                        setAlert(true);
                        setAlertMessage("Password should be at least 6 characters long.");
                    }
                    if (err.message.includes("(auth/email-already-in-use)")) {
                        setAlert(true);
                        setAlertMessage("Email already in use");
                    }

                    setInterval(() => {
                        setAlert(false);
                    }, 5000);
                });
        }
    };

    // const handleSignUp = async () => {
    //     try {
    //         const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
    //         const userCred = userCredential.user;

    //         // Gửi email xác thực
    //         await sendEmailVerification(userCred);

    //         // Đặt trạng thái đã gửi email xác thực
    //         setEmailSent(true);

    //         // Lưu thông tin người dùng vào cơ sở dữ liệu
    //         const userData = {
    //             _id: userCred.uid,
    //             fullName: name,
    //             profilePic: avatar,
    //             providerData: userCred.providerData[0],
    //         };

    //         await setDoc(doc(firestoreDB, 'users', userCred.uid), userData);
    //     } catch (error) {
    //         Alert.alert('Error', error.message);
    //     }
    // };

    // const handleVerifyEmail = async () => {
    //     try {
    //         // Lấy mã xác thực từ cơ sở dữ liệu Firebase
    //         const docRef = doc(firestoreDB, 'verificationCodes', firebaseAuth.currentUser.uid);
    //         const docSnap = await getDoc(docRef);
    //         const savedCode = docSnap.data().code;

    //         // So sánh mã xác thực
    //         if (verificationCode === savedCode) {
    //             Alert.alert('Success', 'Email verification successful!');
    //             setTimeout(()=>{
    //                 navigation.replace("LoginScreen");
    //             }, 1000000);
    //         } else {
    //             Alert.alert('Error', 'Invalid verification code');
    //         }
    //     } catch (error) {
    //         Alert.alert('Error', 'Could not verify email');
    //     }
    // };
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start' }}>
            <Image 
                source={BGImage} 
                resizeMode='cover' 
                style={{ height: 180, width: screenWidth }}
            />
            { isAvatarMenu && (
                <>
                {/* List of avatar */}
                <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10, width: screenWidth, height: screenHeight }}>
                    <ScrollView>
                        <BlurView 
                            tint='dark' 
                            intensity={40} 
                            style={[ {width: screenWidth, height: screenHeight}, { paddingHorizontal: 4, paddingTop: 200, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center'}]}
                        >
                            {avatars?.map((item) => (
                                <TouchableOpacity
                                onPress={()=> handleAvatar(item)} 
                                key={item._id} 
                                style={{ width: 80, height: 80, padding: 1, borderRadius: 40, borderWidth: 2, borderColor: 'white', position: 'relative' }}
                                >
                                    <Image source={{ uri: item?.image.asset.url }} style={{ width: '100%', height: '100%' }} resizeMode='contain' />
                                </TouchableOpacity>
                            ))}
                        </BlurView>
                    </ScrollView>
                </View>
                </>
            )
            }

            {/* Main View */}
            <View style={{ 
                width: '100%', 
                height: '100%', 
                backgroundColor: 'white', 
                borderTopLeftRadius: 90, 
                marginTop: -44, 
                alignItems: 'center', 
                justifyContent: 'flex-start', 
                paddingVertical: 6, 
                paddingHorizontal: 6, 
                spaceY: 6, 
                borderColor: '#3498db',
                borderWidth: 2, 
            }}>

                <Image 
                    source={Logo} 
                    style={{ width: 90, height: 100 }} 
                    resizeMode='contain'
                />
                
                <Text 
                    style={{ 
                        paddingVertical: 8, 
                        color: 'black', 
                        fontSize: 24, 
                        fontWeight: '600' 
                    }}
                >
                    Sign Up
                </Text>
                {alert && (
                    <Text style={{ fontSize: 16, color: '#ff0000' }}>
                        {alertMessage}
                    </Text>
                )}
                {/* Avatar sections */}
                <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center', marginTop: 10, marginBottom: 10}}>
                    <TouchableOpacity onPress={()=>setIsAvatarMenu(true)} style={{ width: 80, height: 80, borderRadius: 80, borderWidth: 3,borderColor: 'green', alignItems: 'center', justifyContent: 'center', borderColor: 'white'}}>
                        <Image source={{uri: avatar}} style={{ width: '100%', height: '100%' }} resizeMode='contain' />
                        <View style={{ width: 25, height: 25, backgroundColor: 'green', borderRadius: 10, position: 'absolute', top: 0, right: 0, alignItems: 'center', justifyContent: 'center' }}>
                            <MaterialIcons name="edit" size={24} color={"#fff"}/>
                        </View>

                    </TouchableOpacity>

                </View>

                <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>

                    <UserTextInput 
                        placeholder="Username" 
                        isPass={false} 
                        setStatValue={setName}
                    />

                    <UserTextInput 
                        placeholder="Email" 
                        isPass={false} 
                        setStatValue={setEmail}
                        setGetEmailValidationStatus={setGetEmailValidationStatus}
                    />

                    <UserTextInput 
                        placeholder="Password" 
                        isPass={true} 
                        setStatValue={setPassword}
                    />
                    {/* {emailSent && (
                        <View>
                            <TextInput
                                placeholder="Verification Code"
                                onChangeText={setVerificationCode}
                                value={verificationCode}
                            />
                            <TouchableOpacity onPress={handleVerifyEmail} >
                                <Text>Verify Email</Text>
                            </TouchableOpacity>
                        </View>
                    )} */}
                    <TouchableOpacity onPress={handleSignUp}
                        style={{ 
                            width: '80%', 
                            paddingHorizontal: 16, 
                            paddingVertical: 8, 
                            borderRadius: 20, 
                            backgroundColor: '#3498db',
                            marginVertical: 12, 
                            alignItems: 'center', 
                            justifyContent: 'center' 
                        }}
                    >
                        <Text style={{ color: 'white', fontSize: 18 }}>Sign Up</Text>
                    </TouchableOpacity>
                    
                    <View style={{ width: '100%', paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 16, color: '#333' }}>Have an account?</Text>
                        <TouchableOpacity onPress={()=>navigation.navigate('LoginScreen')}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#007bff' }}> Login Now</Text>
                        </TouchableOpacity>
                    </View> 

                </View>
            </View>
        </View>
    );
}
