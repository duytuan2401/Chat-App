import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { firestoreDB } from "../config/firebase.config";
import { updateDoc, arrayRemove } from "firebase/firestore";
import { arrayUnion, getDocs, collection } from "firebase/firestore";
const SettingChatScreen = ({ route }) => {
  const navigation = useNavigation();
  const { room } = route.params;
  const [showMembers, setShowMembers] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [showAvailableUsers, setShowAvailableUsers] = useState(false);

  const toggleAvailableUsers = () => {
    setShowAvailableUsers(!showAvailableUsers);
  };

  useEffect(() => {
    const fetchAvailableUsers = async () => {
      try {
        // Lấy danh sách người dùng chưa tham gia cuộc trò chuyện
        const allUsersSnapshot = await getDocs(
          collection(firestoreDB, "users")
        );
        const allUsersData = allUsersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const alreadyInChat = room.participants.map(
          (participant) => participant._id
        );
        const newAvailableUsers = allUsersData.filter(
          (user) => !alreadyInChat.includes(user._id)
        );
        setAvailableUsers(newAvailableUsers);
      } catch (error) {
        console.error("Error fetching available users:", error);
      }
    };

    fetchAvailableUsers();
  }, [room.participants]);
  const toggleMembers = () => {
    setShowMembers(!showMembers);
  };

  const removeParticipant = async (userId) => {
    try {
      // Sử dụng updateDoc để cập nhật danh sách thành viên của phòng chat
      await updateDoc(doc(firestoreDB, "groupChats", room._id), {
        participants: arrayRemove(userId),
      });

      console.log("User removed successfully");

      // Cập nhật lại danh sách thành viên sau khi xóa
      const updatedParticipants = room.participants.filter(
        (item) => item._id !== userId
      );

      // Cập nhật giá trị mới cho phần params.room
      route.params.room.participants = updatedParticipants;
      Alert.alert("Success", "User removed successfully");
    } catch (error) {
      console.error("Error removing user:", error);
      Alert.alert(
        "Error",
        "An error occurred while removing the user. Please try again later."
      );
    }
  };

  const navigateToProfile = (userId) => {
    navigation.navigate("ProfileScreen", { userId });
  };

  const addParticipantToChat = async (userId) => {
    try {
      const userRef = doc(firestoreDB, "users", userId);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();

      // Thêm người dùng vào danh sách tham gia cuộc trò chuyện
      const updatedParticipants = [...room.participants, userData];

      // Cập nhật dữ liệu của cuộc trò chuyện với danh sách người dùng mới
      await updateDoc(doc(firestoreDB, "groupChats", room._id), {
        participants: updatedParticipants,
      });

      // Cập nhật lại state của cuộc trò chuyện
      route.params.room.participants = updatedParticipants;

      // Cập nhật lại danh sách người dùng chưa tham gia
      const updatedAvailableUsers = availableUsers.filter(
        (user) => user._id !== userId
      );
      setAvailableUsers(updatedAvailableUsers);

      Alert.alert("Success", "User added to chat successfully");
    } catch (error) {
      console.error("Error adding user to chat:", error);
      Alert.alert(
        "Error",
        "Failed to add user to chat. Please try again later."
      );
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ backgroundColor: "green", padding: 16, paddingTop: 50 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 16,
          }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="chevron-left" size={32} color="#fbfbfb" />
          </TouchableOpacity>
        </View>
      </View>
      <View>
        <TouchableOpacity onPress={toggleAvailableUsers}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 16,
              marginBottom: 10,
            }}
          >
            <Text style={{ fontSize: 23, fontWeight: "bold" }}>
              Members List Not Join
            </Text>
          </View>
        </TouchableOpacity>
        {showAvailableUsers && (
          <>
            {/* Danh sách người dùng chưa tham gia */}
            <FlatList
              data={availableUsers}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingHorizontal: 16,
                    marginBottom: 10,
                  }}
                >
                  <TouchableOpacity
                    style={{ flexDirection: "row", alignItems: "center" }}
                    onPress={() => navigateToProfile(item._id)}
                  >
                    <Image
                      source={{ uri: item.profilePic }}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        marginRight: 10,
                        borderColor: "#ccc",
                        borderWidth: 1,
                      }}
                    />
                    <Text style={{ fontSize: 16 }}>{item.fullName}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => addParticipantToChat(item._id)}
                  >
                    <FontAwesome name="plus" size={24} color="green" />
                  </TouchableOpacity>
                </View>
              )}
            />
          </>
        )}
      </View>

      <View
        style={{
          padding: 16,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <TouchableOpacity onPress={toggleMembers}>
          <Text style={{ fontSize: 23, fontWeight: "bold", marginBottom: 10 }}>
            Members List Joined
          </Text>
        </TouchableOpacity>
      </View>

      {showMembers && (
        <FlatList
          data={room.participants}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 16,
                marginBottom: 10,
              }}
            >
              <TouchableOpacity
                style={{ flexDirection: "row", alignItems: "center" }}
                onPress={() => navigateToProfile(item._id)}
              >
                <Image
                  source={{ uri: item.profilePic }}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    marginRight: 10,
                    borderColor: "#ccc",
                    borderWidth: 1,
                  }}
                />
                <Text style={{ fontSize: 16 }}>{item.fullName}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => removeParticipant(item._id)}>
                <FontAwesome name="trash" size={24} color="red" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default SettingChatScreen;
