import React, { useCallback, useState } from "react";
import { View, FlatList, ScrollView } from "native-base";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import OrderList from "./OrderList";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppointmentList from "./AppointmentList";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false); // Introduce loading state

  useFocusEffect(
    useCallback(() => {
      fetchAppointments();

      return () => {
        setAppointments([]);
      };
    }, [])
  );

  const fetchAppointments = () => {
    setLoading(true); // Set loading state to true when starting fetching
    axios
      .get(`${baseURL}appointments`)
      .then((res) => {
        setAppointments(res.data);
      })
      .catch((error) => console.log(error))
      .finally(() => {
        setLoading(false); // Set loading state to false when fetching is completed
      });
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchAppointments();
    }, [])
  );

  return (
    <View className="flex-1 bg-white p-3 space-y-3">
      {/* <Text>Appointments</Text> */}

      {loading ? ( // Display loading indicator if loading is true
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="red" />
        </View>
      ) : (
        <FlatList
          data={appointments.slice().reverse()}
          renderItem={({ item }) => (
            <View className="mb-2">
              <AppointmentList item={item} />
            </View>
          )}
          keyExtractor={(item) => item.id?.toString()} // Corrected keyExtractor
        />
      )}
    </View>
  );
};

export default Appointments;
