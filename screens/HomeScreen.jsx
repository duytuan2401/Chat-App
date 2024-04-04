import { View, Text, Image, SafeAreaView, TouchableOpacity, ScrollView, ActivityIndicator, TextInput} from 'react-native'
import React, { useState } from 'react'
import { Logo } from '../assets';
import {useSelector} from 'react-redux'
import { Ionicons, FontAwesome5 } from '@expo/vector-icons'
import {useNavigation} from '@react-navigation/native';


export default function HomeScreen() {
  
  const user = useSelector((state) => state.user.user);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  return (
    <View style={{flex: 1, backgroundColor: "#87CEEB", paddingTop: 30 }}>
        <SafeAreaView>
          <View style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8, paddingHorizontal: 16}}>
              <Image source={Logo} style={{width: 48, height: 48}} resizeMode='contain' />
              <TouchableOpacity style={{width: 48, height: 48, borderRadius: 40, borderWidth: 2, borderColor: 'white', alignItems: 'center', justifyContent: 'center'}}>
                  <Image source={{uri: user?.profilePic}} style={{width: '100%', height: '100%'}} resizeMode='cover' />
              </TouchableOpacity>
              
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 20, marginLeft: 20, marginTop: 20}}>
            <TouchableOpacity style={{marginRight: 8}}>
              <Ionicons name="search" size={24} color="black" />
            </TouchableOpacity>
            <TextInput 
              placeholder="Search"
              style={{ flex: 1, height: 40, borderColor: 'gray', borderWidth: 1, borderRadius: 8, paddingHorizontal: 10}}
            />
          </View>
          
              {/* Scrolling view */}
          <ScrollView style={{width: '100%', paddingHorizontal: 16, paddingTop: 16}}>
            <View style={{width: '100%'}}>
              <View style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 8}}>
                <Text style={{color: 'black', fontSize: 16, fontWeight: 'bold', paddingBottom: 2}}>
                Message
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate('AddToChatScreen')}>
                  <Ionicons name='chatbox' size={28} color="#555" />
                </TouchableOpacity>
              </View>
              {isLoading ? (
                <View style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                  <ActivityIndicator size="large" color="#43C651" />
                </View>
              ) : (
                <>
                  <MessageCard />
                  <MessageCard />
                  <MessageCard />
                  <MessageCard />
                  <MessageCard />
                  <MessageCard />
                  <MessageCard />
                  
                </>
              )}

            </View>
          </ScrollView>

        </SafeAreaView>
</View>

  )
}

const MessageCard = () => {
  return (
    <TouchableOpacity style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', paddingVertical: 8}}>
      {/* images */}
      <View style={{width: 64, height: 64, borderRadius: 32, alignItems: 'center', borderWidth: 2, borderColor: 'primary', padding: 1, justifyContent: 'center'}}>
        <FontAwesome5 name="users" size={24} color="#555" />
      </View>
      {/* content */}
      <View style={{flex: 1, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', marginLeft: 16}}>
        <Text style={{color: '#333', fontSize: 16, fontWeight: 'bold', textTransform: 'capitalize'}}>
          Message title
        </Text>
        <Text style={{color: 'primaryText', fontSize: 14}}>
          Content!
        </Text>
      </View>
      {/* time text */}
      <Text style={{color: 'primary', paddingHorizontal: 16, fontSize: 16, fontWeight: 'bold'}}>
        27 min
      </Text>
    </TouchableOpacity>

  );
};