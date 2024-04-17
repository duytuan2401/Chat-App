import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import { MaterialIcons, Entypo, Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { signOut } from "firebase/auth";
import { firebaseAuth, firestoreDB } from "../config/firebase.config";
import { useNavigation } from "@react-navigation/native";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  doc,
  getDocs,
  get,
} from "firebase/firestore";
const ProfileScreen = ({ route }) => {
  const [userProfile, setUserProfile] = useState(null);
  const navigation = useNavigation();
  const user = useSelector((state) => state.user.user);
  const { userId } = route.params;

  useEffect(() => {
    // Load user profile based on userId
    const fetchUserProfile = async () => {
      try {
        // Fetch user profile from firestoreDB based on userId
        const userProfileDoc = await getDoc(doc(firestoreDB, "users", userId));
        if (userProfileDoc.exists()) {
          // Nếu tài liệu tồn tại, lấy dữ liệu của tài liệu đó
          setUserProfile(userProfileDoc.data());
        } else {
          console.error("User profile not found for userId:", userId);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error.message);
      }
    };

    fetchUserProfile();
  }, [userId]);

  const handleLogout = async () => {
    try {
      navigation.navigate("LoginScreen");
      await signOut(firebaseAuth);
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "start",
        paddingHorizontal: 4,
      }}
    >
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 4,
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="chevron-left" size={32} color="#555" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Entypo name="dots-three-vertical" size={24} color="#555" />
        </TouchableOpacity>
      </View>

      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Image
          source={{ uri: userProfile?.profilePic }}
          style={{ width: 100, height: 100, borderRadius: 50 }}
          resizeMode="contain"
        />
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: "black",
            paddingTop: 3,
          }}
        >
          {userProfile?.fullName}
        </Text>
        <Text style={{ fontSize: 16, fontWeight: "bold", color: "black" }}>
          {userProfile?.email}
        </Text>
      </View>

      {/*icons selection */}
      {/* Đoạn code tương tự như trước, chỉ cần thay đổi các biến cục bộ nếu cần thiết */}
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-evenly",
          paddingTop: 12,
        }}
      >
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <TouchableOpacity
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              borderRadius: 6,
              backgroundColor: "#D5D5DA",
            }}
          >
            <MaterialIcons name="messenger-outline" size={24} color="#555" />
          </TouchableOpacity>
          <Text style={{ fontSize: 14, color: "black", paddingTop: 1 }}>
            Message
          </Text>
        </View>

        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <TouchableOpacity
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              borderRadius: 6,
              backgroundColor: "#D5D5DA",
            }}
          >
            <Ionicons name="videocam-outline" size={24} color="#555" />
          </TouchableOpacity>
          <Text style={{ fontSize: 14, color: "black", paddingTop: 1 }}>
            Video Call
          </Text>
        </View>

        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <TouchableOpacity
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              borderRadius: 6,
              backgroundColor: "#D5D5DA",
            }}
          >
            <Ionicons name="call-outline" size={24} color="#555" />
          </TouchableOpacity>
          <Text style={{ fontSize: 14, color: "black", paddingTop: 1 }}>
            Call
          </Text>
        </View>

        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <TouchableOpacity
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              borderRadius: 6,
              backgroundColor: "#D5D5DA",
            }}
          >
            <Entypo name="dots-three-horizontal" size={24} color="#555" />
          </TouchableOpacity>
          <Text style={{ fontSize: 14, color: "black", paddingTop: 1 }}>
            More
          </Text>
        </View>
      </View>
      {/* medias shared */}
      {/* Đoạn code tương tự như trước, chỉ cần thay đổi các biến cục bộ nếu cần thiết */}
      <View
        style={{
          width: "100%",
          paddingHorizontal: 12,
          marginBottom: 12,
          marginTop: 12,
        }}
      >
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "bold", color: "black" }}>
            Media Share
          </Text>
          <TouchableOpacity>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                textTransform: "uppercase",
                color: "black",
              }}
            >
              View All
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            style={{
              width: 100,
              height: 100,
              margin: 10,
              borderRadius: 10,
              backgroundColor: "#ccc",
              overflow: "hidden",
            }}
          >
            <Image
              source={{
                uri: "https://images.app.goo.gl/xrjAdGxA7vDP7H9A9",
              }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              width: 100,
              height: 100,
              margin: 10,
              borderRadius: 10,
              backgroundColor: "#ccc",
              overflow: "hidden",
            }}
          >
            <Image
              source={{
                uri: "https://images.app.goo.gl/xrjAdGxA7vDP7H9A9",
              }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              width: 100,
              height: 100,
              margin: 10,
              borderRadius: 10,
              backgroundColor: "#ccc",
              overflow: "hidden",
            }}
          >
            <Image
              source={{
                uri: "https://images.app.goo.gl/xrjAdGxA7vDP7H9A9",
              }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
            <View
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#5A5650",
              }}
            >
              <Text
                style={{ fontSize: 16, color: "white", fontWeight: "bold" }}
              >
                250+
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      {/* setting options */}
      {/* Đoạn code tương tự như trước, chỉ cần thay đổi các biến cục bộ nếu cần thiết */}
      <View
        style={{
          width: "100%",
          paddingHorizontal: 6,
          paddingVertical: 4,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <MaterialIcons name="security" size={24} color="#555" />
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              color: "black",
              paddingLeft: 3,
            }}
          >
            Privacy
          </Text>
        </View>
        <MaterialIcons name="chevron-right" size={32} color="#555" />
      </View>

      <View
        style={{
          width: "100%",
          paddingHorizontal: 6,
          paddingVertical: 4,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <MaterialIcons name="message" size={24} color="#555" />
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              color: "black",
              paddingLeft: 3,
            }}
          >
            Group
          </Text>
        </View>
        <MaterialIcons name="chevron-right" size={32} color="#555" />
      </View>

      <View
        style={{
          width: "100%",
          paddingHorizontal: 6,
          paddingVertical: 4,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <MaterialIcons name="music-note" size={24} color="#555" />
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              color: "black",
              paddingLeft: 3,
            }}
          >
            Media's & Downloads
          </Text>
        </View>
        <MaterialIcons name="chevron-right" size={32} color="#555" />
      </View>

      <View
        style={{
          width: "100%",
          paddingHorizontal: 6,
          paddingVertical: 4,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => navigation.navigate("AccountScreen")}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <MaterialIcons name="person" size={24} color="#555" />
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                color: "black",
                paddingLeft: 3,
              }}
            >
              Account
            </Text>

            <MaterialIcons name="chevron-right" size={32} color="#555" />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        onPress={handleLogout}
        style={{
          width: "100%",
          paddingHorizontal: 6,
          paddingVertical: 4,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "bold",
            color: "red",
            paddingLeft: 3,
            fontWeight: "bold",
          }}
        >
          Logout
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ProfileScreen;
