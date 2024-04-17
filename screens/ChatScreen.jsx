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
  Alert,
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
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import { firebase } from "../config/firebase.config";
import { firestoreDB } from "../config/firebase.config";
import { useSelector } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import "firebase/storage";
import { Audio, Video } from "expo-av";
const ChatScreen = ({ route }) => {
  const { room } = route.params;
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(null);
  const user = useSelector((state) => state.user.user);
  const [uploading, setUploading] = useState(false);
  const textInputRef = useRef(null);
  // const [selectedImage, setSelectedImage] = useState(null);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  // KeyBoard
  const handleKeyboardOpen = () => {
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
  };

  // Lấy ảnh từ hệ thống
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      // setSelectedImage(result.uri);
      uploadImage(result.uri);
      setImage(result.assets[0].uri); // Hiển thị ảnh người dùng đã chọn
      sendMessage();
    }
  };

  const uploadImage = async () => {
    setUploading(true);
    try {
      if (image) {
        const { uri } = await FileSystem.getInfoAsync(image);
        const blob = await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.onload = () => {
            resolve(xhr.response);
          };
          xhr.onerror = (e) => {
            reject(new TypeError("Network request failed"));
          };
          xhr.responseType = "blob";
          xhr.open("GET", uri, true);
          xhr.send(null);
        });
        const fileName = image.substring(image.lastIndexOf("/") + 1);
        const ref = firebase.storage().ref().child(fileName);

        await ref.put(blob);
        setUploading(false);

        const downloadUrl = await ref.getDownloadURL(); // Lấy đường dẫn URL của hình ảnh từ Storage
        setImageUrl(downloadUrl); // Lưu đường dẫn vào state

        Alert.alert("Photo Uploaded");
        setImage(null);
      } else {
        // console.error("Image is null or undefined");
        setUploading(false);
      }
    } catch (error) {
      // console.error(error);
      setUploading(false);
    }
  };
  const userAvatarUrl = user.profilePic;
  // Gửi tin nhắn đồng thời tạo csdl
  const sendMessage = async () => {
    if (message.trim() === "" && !imageUrl) {
      // Nếu trường tin nhắn trống và không có ảnh được chọn, không gửi tin nhắn
      return;
    }
    const timeStamp = serverTimestamp();
    const id = `${Date.now()}`;
    const _doc = {
      _id: id,
      roomId: room._id,
      timeStamp: timeStamp,
      message: imageUrl || message,
      user: {
        // Thêm avatar vào đối tượng người gửi tin nhắn
        ...user,
        avatar: userAvatarUrl, // Thêm avatar vào đối tượng người gửi tin nhắn
      },
    };
    setMessage("");
    setImageUrl(false);
    await addDoc(
      collection(doc(firestoreDB, "chats", room._id), "messages"),
      _doc
    )
      .then(() => {})
      .catch((err) => {
        console.error("Error sending message:", error);
        // Hiển thị thông báo lỗi cho người dùng
        alert("Error sending message. Please try again later.");
      });
  };

  // Xóa tin nhắn
  const deleteMessage = async (messageId) => {
    // // Delete the message from Firestore using its messageId
    // await deleteDoc(doc(firestoreDB, "chats", room._id, "messages", messageId))
    //   .then(() => {
    //     console.log("MessageId", messageId);
    //     // Update messages state after deletion
    //     const updatedMessages = messages.filter((msg) => msg._id !== messageId);
    //     setMessages(updatedMessages);
    //   })
    //   .catch((err) => alert(err));
    try {
      const messageRef = doc(
        firestoreDB,
        "chats",
        room._id,
        "messages",
        messageId
      );
      await deleteDoc(messageRef);
      console.log("MessageId", messageId, "deleted successfully");

      // Kiểm tra xem tin nhắn vẫn tồn tại trong Firestore sau khi xóa
      const docSnapshot = await getDoc(messageRef);
      if (docSnapshot.exists()) {
        console.log("Tin nhắn vẫn tồn tại sau khi xóa.");
      } else {
        console.log("Tin nhắn đã được xóa thành công từ Firestore.");
      }

      // Cập nhật trạng thái sau khi xóa tin nhắn thành công
      const updatedMessages = messages.filter((msg) => msg._id !== messageId);
      setMessages(updatedMessages);
    } catch (error) {
      console.error("Error deleting message:", error);
      alert("Error deleting message. Please try again later.");
    }
  };
  const confirmDeleteMessage = (messageId) => {
    Alert.alert(
      "Delete Message",
      "Are you sure you want to delete this message?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => deleteMessage(messageId),
        },
      ]
    );
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
  // Kiểm tra đường dẫn hình ảnh
  function isValidURL(string) {
    try {
      new URL(string);
    } catch (_) {
      return false;
    }
    return true;
  }
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          width: "100%",
          backgroundColor: "green",
          padding: 12,
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
              {/* <Text
                style={{ color: "#D1D5DB", fontSize: 14, fontWeight: "600" }}
              >
                online
              </Text> */}
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
            <TouchableOpacity
              style={{ marginHorizontal: 10 }}
              onPress={() => navigation.navigate("CallScreen")}
            >
              <FontAwesome5 name="phone" size={24} color="#fbfbfb" />
            </TouchableOpacity>
            <TouchableOpacity
              style={{ marginLeft: 10 }}
              onPress={() =>
                navigation.navigate("SettingChatScreen", { room: room })
              }
            >
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
                      <View
                        className="m-1"
                        key={i}
                        style={{ alignSelf: "flex-end" }}
                      >
                        {msg.user.providerData.email ===
                          user.providerData.email && (
                          <TouchableOpacity
                            onPress={() => confirmDeleteMessage(msg._id)}
                          >
                            <MaterialIcons
                              name="delete"
                              size={24}
                              color="black"
                            />
                          </TouchableOpacity>
                        )}
                        <View
                          style={{ alignSelf: "flex-end" }}
                          className="px-4 py-2 rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl bg-green-500 w-auto relative"
                        >
                          {isValidURL(msg.message) &&
                          msg.message.includes(".mp4") ? (
                            // Kiểm tra nếu là video (.mp4)
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                            >
                              <View>
                                <Video
                                  source={{ uri: msg.message }}
                                  style={{ width: 250, height: 250 }}
                                  resizeMode="contain"
                                  useNativeControls={true}
                                />
                              </View>
                              <View style={{ marginLeft: 8 }}>
                                <Image
                                  source={{ uri: msg.user.avatar }}
                                  style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: 16,
                                  }}
                                />
                              </View>
                            </View>
                          ) : isValidURL(msg.message) ? ( // Kiểm tra nếu là hình ảnh
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                            >
                              <View>
                                <Image
                                  style={{ width: 100, height: 100 }}
                                  source={{ uri: msg.message }}
                                />
                              </View>
                              <View style={{ marginLeft: 8 }}>
                                <Image
                                  source={{ uri: msg.user.avatar }}
                                  style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: 16,
                                  }}
                                />
                              </View>
                            </View>
                          ) : (
                            // Nếu không phải là video hoặc hình ảnh, hiển thị văn bản
                            <View>
                              <View
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                  justifyContent: "flex-end",
                                }}
                              >
                                <View
                                  style={{
                                    backgroundColor: "green",
                                    borderRadius: 12,
                                    padding: 8,
                                    alignSelf: "flex-end",
                                  }}
                                >
                                  <Text style={{ color: "white" }}>
                                    {msg.message}
                                  </Text>
                                </View>
                                <View style={{ marginLeft: 8 }}>
                                  <Image
                                    source={{ uri: msg.user.avatar }}
                                    style={{
                                      width: 32,
                                      height: 32,
                                      borderRadius: 16,
                                    }}
                                  />
                                </View>
                              </View>
                            </View>
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
                            <TouchableOpacity
                              onPress={() => confirmDeleteMessage(msg._id)}
                            >
                              <MaterialIcons
                                name="delete"
                                size={24}
                                color="black"
                              />
                            </TouchableOpacity>
                            <View className="px-4 py-2 rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl bg-gray-200 w-auto relative">
                              {isValidURL(msg.message) ? ( // Kiểm tra nếu là hình ảnh
                                <View
                                  style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                  }}
                                >
                                  <View style={{ marginLeft: 8 }}>
                                    <Image
                                      source={{ uri: msg.user.avatar }}
                                      style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: 16,
                                      }}
                                    />
                                  </View>
                                  <View>
                                    <Image
                                      style={{ width: 100, height: 100 }}
                                      source={{ uri: msg.message }}
                                    />
                                  </View>
                                </View>
                              ) : (
                                // Nếu không phải là hình ảnh, hiển thị văn bản
                                <View>
                                  <View
                                    style={{
                                      flexDirection: "row",
                                      alignItems: "center",
                                      justifyContent: "flex-end",
                                    }}
                                  >
                                    <View style={{ marginLeft: 8 }}>
                                      <Image
                                        source={{ uri: msg.user.avatar }}
                                        style={{
                                          width: 32,
                                          height: 32,
                                          borderRadius: 16,
                                        }}
                                      />
                                    </View>
                                    <View
                                      style={{
                                        backgroundColor: "green",
                                        borderRadius: 12,
                                        padding: 8,
                                        alignSelf: "flex-end",
                                      }}
                                    >
                                      <Text style={{ color: "white" }}>
                                        {msg.message}
                                      </Text>
                                    </View>
                                  </View>
                                </View>
                              )}
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
                {/* Hiển thị hình ảnh đã chọn trước khi gửi */}
                {image && (
                  <Image
                    source={{ uri: image }}
                    style={{ width: 100, height: 100 }}
                  />
                )}
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

                <TouchableOpacity onPress={pickImage}>
                  <MaterialIcons
                    name="picture-in-picture"
                    size={24}
                    color="black"
                  />
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
