import { View, Text, SafeAreaView, TouchableOpacity, Image, TextInput } from 'react-native'
import React, { useState } from 'react'
import {useNavigation} from '@react-navigation/native';
import {MaterialIcons, Entypo, Ionicons} from '@expo/vector-icons'
import {useSelector} from 'react-redux'
import { firestoreDB } from '../config/firebase.config';
import { doc, setDoc } from 'firebase/firestore';

export default function AddToChatScreen() {
  const navigation = useNavigation();
  const user = useSelector((state) => state.user.user);
  const [addChat, setAddChat] = useState("");

  const createNewChat = async () =>{
    let id = "${Date.now()}"

    const _doc = {
      _id : id,
      user : user,
      chatName : addChat
    }

    if(addChat !== ""){
      setDoc(doc(firestoreDB, "chats", id), _doc).then(() =>{
        setAddChat("")
        navigation.replace("HomeScreen")
      }).catch((err) =>{
        alert("Error: ", err)
      })
    }
  }
  return (
    <View 
      style={{
        flex: 1,
      }}
    >
    {/* icons */}
      <View
        style={{
          width: '100%', 
          backgroundColor: '#84D9FE', 
          paddingHorizontal: 4, 
          paddingVertical: 6, 
          flex: 0.25
        }}
      >
        <View
          style={{
            flexDirection: 'row', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            width: '100%', 
            paddingHorizontal: 4, 
            paddingVertical: 12
          }}
        >
          {/*go back */}
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="chevron-left" size={32} color="#fbfbfb"/>
          </TouchableOpacity>

          {/*user profile */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginHorizontal: 3
            }}
          >
            <Image
              source={{uri: user?.profilePic}}
              style={{width: 30, height: 30}}
              resizeMode='contain'
            />
          </View>
        </View>
      </View>

      {/* bottom section */}
      <View
        style={{
          width: '100%',
          backgroundColor: 'white',
          paddingHorizontal: 4,
          paddingVertical: 6,
          borderRadius: 48, 
          marginTop: -10, 
          flex: 1, 
          borderRadius: 20
        }}
      >
        <View style={{width: '100%', paddingHorizontal: 4, paddingVertical: 4,}}>
          <View 
            style={{
              width: '100%', 
              paddingHorizontal: 4, 
              flexDirection: 'row', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              paddingVertical: 2,
              borderRadius: 16,
              borderWidth: 1, 
              borderColor: 'gray',
              paddingHorizontal: 12,
              marginVertical: 20,
            }}
          >
            {/* icon */}
            <Ionicons name='chatbubbles' size={24} color={'#777'}/>
            {/* text input */}
            <TextInput
              style={{
                flex: 1, 
                fontSize: 16,
                color: 'black',
                marginTop: -3, 
                height: 48, 
                width: '100%', 
                marginLeft: 5
              }}
              placeholder="Create a chat"
              placeholderTextColor={"#999"}
              value={addChat}
              onChangeText={(text)=>setAddChat(text)}
            />
            {/* icon */}
            <TouchableOpacity onPress={createNewChat}>
              <Ionicons name='send-outline' size={24} color={'#777'}/>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )
}