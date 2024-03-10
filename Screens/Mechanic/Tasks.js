import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Image,
} from "react-native";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import AuthGlobal from "../../Context/Store/AuthGlobal";
import { useFocusEffect } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import TaskList from "./TaskList";

const Tasks = () => {
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [profile, setProfile] = useState();
  const context = useContext(AuthGlobal);
  const user = context.stateUser.user;

  useFocusEffect(
    useCallback(() => {
      setLoading(true); // Start loading
        if (selectedCategory === "All") {
          fetchAllAppointment();
        } else if (selectedCategory === "Upcoming") {
          upcomingAppointment();
        } else if (selectedCategory === "Today") {
          todayAppointment();
        } else if (selectedCategory === "Completed") {
          completedAppointment();
        }

      getProfile();

      return () => {
        setAppointments([]); // Clear appointments
        // setProfile([]);
      };
    }, [selectedCategory])
  );

  //   console.log(appointments);

  const fetchAllAppointment = async () => {
    axios
      .get(`${baseURL}appointments/mechanic/${user.userId}`)
      .then((res) => {
        setAppointments(res.data);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  };

  const upcomingAppointment = async () => {
    axios
      .get(`${baseURL}appointments/mechanic/${user.userId}/upcoming`)
      .then((res) => {
        setAppointments(res.data);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  };

  const todayAppointment = async () => {
    axios
      .get(`${baseURL}appointments/mechanic/${user.userId}/today`)
      .then((res) => {
        setAppointments(res.data);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  };

  const completedAppointment = async () => {
    axios
      .get(`${baseURL}appointments/mechanic/${user.userId}/completed`)
      .then((res) => {
        setAppointments(res.data);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  };

  const getProfile = async () => {
    axios
      .get(`${baseURL}users/${user.userId}`)
      .then((res) => {
        setProfile(res.data);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  };

  console.log(profile, "profile");

  return (
    <KeyboardAwareScrollView className="p-3 space-y-4 bg-white ">
      <SafeAreaView>
        <View className="flex flex-row space-x-4 items-center">
          <Image
            source={
              profile?.avatar?.url
                ? { uri: profile?.avatar?.url }
                : require("../../assets/images/default-profile.jpg")
            }
            style={{ width: 45, height: 45 }}
            className="rounded-full"
          />

          <View>
            <Text className="text-xs">Welcome,</Text>
            <Text className="font-semibold text-lg">{profile?.firstname} {profile?.lastname}</Text>
          </View>
        </View>
      </SafeAreaView>

      {/* <Text className="text-xl font-bold">Mechanic Tasks</Text> */}
      <View className="flex flex-row space-x-2">
        {["All", "Upcoming", "Today", "Completed"].map((category) => (
          <TouchableOpacity
            key={category}
            // style={{
            //   marginRight: 10,
            //   padding: 10,
            //   backgroundColor: selectedCategory === category ? "blue" : "gray",
            //   borderRadius: 5,
            // }}
            className={
              selectedCategory === category
                ? "bg-red-500 px-4 py-3 rounded"
                : "bg-zinc-400 px-4 py-3 rounded"
            }
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={{ color: "white" }}>{category}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="red" />
      ) : (
        <View className="pb-6">
          <FlatList
            data={appointments}
            renderItem={({ item }) => (
              <View className="mb-2">
                <TaskList item={item} />
              </View>
            )}
            keyExtractor={(item, index) => index.toString()} // Use index as key
            ListEmptyComponent={
              <View className="flex justify-center items-center">
                <Text>No appointments found.</Text>
              </View>
            }
          />
        </View>
      )}
    </KeyboardAwareScrollView>
  );
};

export default Tasks;
