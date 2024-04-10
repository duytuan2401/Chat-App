import React, { useLayoutEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  TextInput,
  Image,
} from "react-native";
import {
  MaterialIcons,
  FontAwesome5,
  Entypo,
  FontAwesome,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  doc,
} from "firebase/firestore";

import { firestoreDB } from "../config/firebase.config";
import { useSelector } from "react-redux";

const ChatScreen = ({ route }) => {
  const { room } = route.params;
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(null);
  const user = useSelector((state) => state.user.user);

  const textInputRef = useRef(null);

  const handleKeyboardOpen = () => {
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
  };

  const sendMessage = async () => {
    const timeStamp = serverTimestamp();
    const id = `${Date.now()}`;
    const _doc = {
      _id: id,
      roomId: room._id,
      timeStamp: timeStamp,
      message: message,
      user: user,
    };
    setMessage("");
    await addDoc(
      collection(doc(firestoreDB, "chats", room._id), "messages"),
      _doc
    )
      .then(() => {})
      .catch((err) => alert(err));
  };

  useLayoutEffect(() => {
    const msgQuery = query(
      collection(firestoreDB, "chats", room?._id, "messages"),
      orderBy("timeStamp", "asc")
    );
    const unsubscribe = onSnapshot(msgQuery, (querySnap) => {
      const upMsg = querySnap.docs.map((doc) => doc.data());
      setMessages(upMsg);
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          width: "100%",
          backgroundColor: "green",
          padding: 24,
          flex: 0.2,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            padding: 16,
            paddingTop: 48,
          }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="chevron-left" size={32} color="#fbfbfb" />
          </TouchableOpacity>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                borderWidth: 1,
                borderColor: "#fff",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FontAwesome5 name="users" size={24} color="#fbfbfb" />
            </View>
            <View>
              <Text
                style={{ color: "#D1D5DB", fontSize: 16, fontWeight: "600" }}
              >
                {room.chatName.length > 16
                  ? `${room.chatName.slice(0, 16)}..`
                  : room.chatName}
              </Text>
              <Text
                style={{ color: "#D1D5DB", fontSize: 14, fontWeight: "600" }}
              >
                online
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 3,
            }}
          >
            <TouchableOpacity style={{ marginRight: 10 }}>
              <FontAwesome5 name="video" size={24} color="#fbfbfb" />
            </TouchableOpacity>
            <TouchableOpacity style={{ marginHorizontal: 10 }}>
              <FontAwesome5 name="phone" size={24} color="#fbfbfb" />
            </TouchableOpacity>
            <TouchableOpacity style={{ marginLeft: 10 }}>
              <Entypo name="dots-three-vertical" size={24} color="#fbfbfb" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View
        style={{
          width: "100%",
          backgroundColor: "white",
          padding: 24,
          flex: 1,
          borderTopLeftRadius: 50,
          borderTopRightRadius: 50,
          marginTop: -10,
        }}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "android" ? "padding" : "height"}
          keyboardVerticalOffset={160}
        >
          <>
            <ScrollView>
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
                  {messages?.map((msg, i) =>
                    msg.user.providerData.email === user.providerData.email ? (
                      <View className="m-1" key={i}>
                        <View
                          style={{ alignSelf: "flex-end" }}
                          className="px-4 py-2 rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl bg-green-500 w-auto relative"
                        >
                          <Text className="text-base font-semibold text-white">
                            {msg.message}
                          </Text>
                        </View>
                        <View style={{ alignSelf: "flex-end" }}>
                          {msg?.timeStamp?.seconds && (
                            <Text className="text-[12px] text-black font-semibold">
                              {new Date(
                                parseInt(msg?.timeStamp?.seconds) * 1000
                              ).toLocaleTimeString("en-US", {
                                hour: "numeric",
                                minute: "numeric",
                                hour12: true,
                              })}
                            </Text>
                          )}
                        </View>
                      </View>
                    ) : (
                      <View
                        key={i}
                        style={{ alignSelf: "flex-start" }}
                        className="flex items-center justify-start space-x-2"
                      >
                        <View className="flex-row items-center justify-center space-x-2">
                          {/* images */}
                          <Image
                            className="w-12 h-12 rounded-full"
                            resizeMode="cover"
                            source={{ uri: msg?.user?.profilePic }}
                          />
                          {/* Text */}
                          <View className="m-1">
                            <View className="px-4 py-2 rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl bg-gray-200 w-auto relative">
                              <Text className="text-base font-semibold text-black">
                                {msg.message}
                              </Text>
                            </View>
                            <View style={{ alignSelf: "flex-start" }}>
                              {msg?.timeStamp?.seconds && (
                                <Text className="text-[12px] text-black font-semibold">
                                  {new Date(
                                    parseInt(msg?.timeStamp?.seconds) * 1000
                                  ).toLocaleTimeString("en-US", {
                                    hour: "numeric",
                                    minute: "numeric",
                                    hour12: true,
                                  })}
                                </Text>
                              )}
                            </View>
                          </View>
                        </View>
                      </View>
                    )
                  )}
                </>
              )}
            </ScrollView>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: 8,
              }}
            >
              <View
                style={{
                  backgroundColor: "#E5E7EB",
                  borderRadius: 12,
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flex: 1,
                }}
              >
                <TouchableOpacity onPress={handleKeyboardOpen}>
                  <Entypo name="emoji-happy" size={24} color="#555" />
                </TouchableOpacity>
                <TextInput
                  style={{
                    flex: 1,
                    height: 32,
                    fontSize: 16,
                    color: "#333",
                    fontWeight: "600",
                  }}
                  placeholder="Type your message..."
                  placeholderTextColor="#999"
                  value={message}
                  onChangeText={(text) => setMessage(text)}
                />
                <TouchableOpacity>
                  <Entypo name="mic" size={24} color="#43C651" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={{ paddingLeft: 8 }}
                onPress={sendMessage}
              >
                <FontAwesome name="send" size={24} color="#555" />
              </TouchableOpacity>
            </View>
          </>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

export default ChatScreen;
