import {
  View,
  Text,
  Image,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  TextInput,
} from "react-native";
import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { Logo } from "../assets";
import { useSelector } from "react-redux";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { firebaseAuth, firestoreDB } from "../config/firebase.config";
import {
  collection,
  collectionGroup,
  onSnapshot,
  orderBy,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { signOut } from "firebase/auth";

export default function HomeScreen() {
  const user = useSelector((state) => state.user.user);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const scrollViewRef = useRef(null);
  const [showOptions, setShowOptions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [chats, setChats] = useState(null);

  const [personalChats, setPersonalChats] = useState(null);
  const [groupChats, setGroupChats] = useState(null);

  useLayoutEffect(() => {
    const chatQuery = query(
      collectionGroup(firestoreDB, "chats"),
      // where("participants", "array-contains", user._id),
      orderBy("_id", "desc")
    );

    const groupChatQuery = query(
      collectionGroup(firestoreDB, "groupChats"),
      // where("participants", "array-contains", user._id),
      orderBy("_id", "desc")
    );

    const unsubscribePersonalChats = onSnapshot(chatQuery, (querySnapshot) => {
      const personalChats = querySnapshot.docs.map((doc) => doc.data());
      setPersonalChats(personalChats);
    });

    const unsubscribeGroupChats = onSnapshot(
      groupChatQuery,
      (querySnapshot) => {
        const groupChats = querySnapshot.docs.map((doc) => doc.data());
        // .filter((room) => room.participants.includes(user._id));
        setGroupChats(groupChats);
      }
    );

    return () => {
      unsubscribePersonalChats();
      unsubscribeGroupChats();
    };
  }, []);

  const handleProfilePicPress = () => {
    setShowOptions(!showOptions);
  };

  const handleSignOut = async () => {
    try {
      navigation.navigate("LoginScreen");
      setLoading(true);
      await signOut(firebaseAuth); // Thực hiện đăng xuất từ Firebase Authentication
    } catch (error) {
      console.error("Error signing out:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateToProfile = () => {
    navigation.navigate("ProfileScreen");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white", paddingTop: 30 }}>
      <SafeAreaView>
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingVertical: 20,
            paddingHorizontal: 20,
            backgroundColor: "green",
          }}
        >
          <Image
            source={Logo}
            style={{ width: 48, height: 48 }}
            resizeMode="contain"
          />
          <TouchableOpacity
            style={{
              width: 48,
              height: 48,
              borderRadius: 40,
              borderWidth: 2,
              borderColor: "white",
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={handleProfilePicPress}
          >
            <Image
              source={{ uri: user?.profilePic }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
            {showOptions && (
              <ScrollView
                ref={scrollViewRef}
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  backgroundColor: "#fff",
                  borderRadius: 8,
                  paddingVertical: 4,
                  paddingHorizontal: 8,
                }}
              >
                <View style={{ width: "100%" }}>
                  <TouchableOpacity onPress={handleSignOut} disabled={loading}>
                    <Text style={{ marginBottom: 8 }}>Sign out</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleNavigateToProfile}>
                    <Text>Profile</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginRight: 20,
            marginLeft: 20,
            marginTop: 20,
          }}
        >
          <TouchableOpacity>
            <Ionicons name="search" size={24} color="black" />
          </TouchableOpacity>
          <TextInput
            placeholder="Search"
            style={{
              flex: 1,
              height: 40,
              borderColor: "black",
              borderWidth: 1,
              borderRadius: 8,
              paddingHorizontal: 10,
            }}
          />
        </View>

        {/* Scrolling view */}
        <ScrollView
          style={{ width: "100%", paddingHorizontal: 16, paddingTop: 16 }}
        >
          <View style={{ width: "100%" }}>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 8,
              }}
            >
              <Text
                style={{
                  color: "black",
                  fontSize: 16,
                  fontWeight: "bold",
                  paddingBottom: 2,
                }}
              >
                Message
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("AddToChatScreen")}
              >
                <Ionicons name="chatbox" size={28} color="#555" />
              </TouchableOpacity>
            </View>
            {isLoading ? (
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ActivityIndicator size="large" color="#43C651" />
              </View>
            ) : (
              <>
                {/* Personal Chats */}
                {personalChats && personalChats.length > 0 && (
                  <View>
                    <Text>Personal Chats</Text>
                    {personalChats.map((room) => (
                      <MessageCard key={room._id} room={room} />
                    ))}
                  </View>
                )}
                {/* Group Chats */}
                {groupChats && groupChats.length > 0 && (
                  <View>
                    <Text>Group Chats</Text>
                    {groupChats.map((room) => (
                      <MessageCard key={room._id} room={room} />
                    ))}
                  </View>
                )}
              </>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const MessageCard = ({ room }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("ChatScreen", { room: room })}
      style={{
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingVertical: 8,
      }}
    >
      {/* images */}
      <View
        style={{
          width: 64,
          height: 64,
          borderRadius: 32,
          alignItems: "center",
          borderWidth: 2,
          borderColor: "white",
          padding: 1,
          justifyContent: "center",
        }}
      >
        <FontAwesome5 name="users" size={24} color="#555" />
      </View>
      {/* content */}
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          marginLeft: 16,
        }}
      >
        <Text
          style={{
            color: "#333",
            fontSize: 16,
            fontWeight: "bold",
            textTransform: "capitalize",
          }}
        >
          {room.chatName}
        </Text>
      </View>
      {/* time text */}
      {/* <Text
        style={{
          color: "black",
          paddingHorizontal: 16,
          fontSize: 16,
          fontWeight: "bold",
        }}
      >
        27 min
      </Text> */}
    </TouchableOpacity>
  );
};
