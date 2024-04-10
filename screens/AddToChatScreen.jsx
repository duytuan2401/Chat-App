import { View, Text, TouchableOpacity, Image, TextInput } from 'react-native';
import React, { useState } from 'react';
import { MaterialIcons, Ionicons, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { doc, setDoc } from 'firebase/firestore';
import { firestoreDB } from '../config/firebase.config';


const AddToChatScreen = () => {
    const navigation = useNavigation();
    const user = useSelector((state) => state.user.user);   
    const [addChat, setAddChat] = useState("");

    const createNewChat = async () => {
        let id = `${Date.now()}`;
        
        const _doc = {
            _id: id,
            user: user,
            chatName: addChat,
        };

        if (addChat !== "") {
            setDoc(doc(firestoreDB, "chats", id), _doc).then(() => {
                setAddChat("");
                navigation.replace("HomeScreen");
            }).catch((err) => {
                alert("Error: ", err);
            });
        }
    };


  return (
    <View style={{ flex: 1 }}>
        <View style={{ backgroundColor: 'green', padding: 16, paddingTop: 24 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 }}>
                {/* Go back */}
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialIcons name="chevron-left" size={32} color="#fbfbfb" />
                </TouchableOpacity>
                {/* Middle */}
                
                {/* last section */}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 }}>
                    <Image
                        source={{ uri: user?.profilePic }}
                        style={{ width: 48, height: 48 }} // Thay thế w-12 h-12 bằng các giá trị cụ thể
                        resizeMode='contain'
                    />
                </View>
            </View>
        </View>
        {/* bottom section */}
        <View style={{ width: '100%', backgroundColor: 'white', padding: '24px', flex: 1, borderTopLeftRadius: '50px', borderTopRightRadius: '50px', marginTop: '-10px' }}>
            <View style={{ width: '100%', padding: '16px' }}>
                <View style={{ width: '100%', padding: '16px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: '20px', border: '1px solid #E5E7EB' }}>
                      {/* icons */}
                      <Ionicons name='chatbubbles' size={24} color={"#777"} />
                      {/* text input */}
                      <TextInput
                          style={{
                            flex: 1,
                            fontSize: '1.125rem', // tương đương với text-lg trong Tailwind CSS
                            color: '#333', // tương đương với text-primaryText trong Tailwind CSS
                            marginTop: '-8px', // tương đương với -mt-2 trong Tailwind CSS
                            height: '48px', // tương đương với h-12 trong Tailwind CSS
                            width: '100%',
                            paddingLeft: '8px', // giả sử có padding-left là 8px
                            paddingRight: '8px', // giả sử có padding-right là 8px
                            borderColor: '#999', // màu sắc placeholderTextColor
                            borderWidth: '1px', // giả sử độ dày viền là 1px
                            borderRadius: '8px' // giả sử độ cong là 8px
                        }}
                          placeholder='Create a chat'
                          placeholderTextColor={"#999"}
                          value={addChat}
                          onChangeText={(text) => setAddChat(text)}
                      />    
                      {/* icons */}
                      <TouchableOpacity onPress={createNewChat}>
                          <FontAwesome name='send' size={24} color={"#777"} />
                      </TouchableOpacity>
                </View>
            </View>
        </View>

    </View>
  )
}

export default AddToChatScreen;