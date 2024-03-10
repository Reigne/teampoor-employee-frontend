import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  TouchableHighlight,
} from "react-native";

import { Divider, ScrollView } from "native-base";
import { useFocusEffect } from "@react-navigation/native";
import { Searchbar } from "react-native-paper";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import baseURL from "../../assets/common/baseUrl";
import ListItem from "./ListItem";
import Toast from "react-native-toast-message";
import {
  MagnifyingGlassCircleIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "react-native-heroicons/solid";
import ServiceList from "./ServiceList";

const Services = () => {
  const navigation = useNavigation();
  const [services, setServices] = useState();
  const [servicesFilter, setServicesFilter] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState();
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      //get token
      AsyncStorage.getItem("jwt")
        .then((res) => {
          setToken(res);
        })
        .catch((error) => console.log(error));

      setTimeout(() => {
        axios.get(`${baseURL}services`).then((res) => {
          console.log(res.data);
          setServices(res.data);
          setServicesFilter(res.data);
          setLoading(false);
        });
      }, 2000);

      return () => {
        setServicesFilter();
        setServices();
        setLoading(false);
      };
    }, [])
  );

  const searchService = (text) => {
    if (text === "") {
      setServicesFilter(services);
    } else {
      setServicesFilter(
        services.filter((i) =>
          i.name.toLowerCase().includes(text.toLowerCase())
        )
      );
    }
  };

  const deleteService = (id) => {
    axios
      .delete(`${baseURL}services/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const services = servicesFilter.filter((item) => item.id !== id);
        
        setServicesFilter(services);

        Toast.show({
          topOffset: 60,
          type: "success",
          text1: "Service successfuly deleted",
          text2: "",
        });
      })
      .catch((error) => console.log(error));
  };

  const ListHeader = () => {
    return (
      <View
        className="p-5 bg-red-500 rounded-xl"
        // style={{ borderBottomWidth: 0.5, borderBottomColor: "gray" }}
      >
        <View className="flex flex-row justify-center gap-8">
          <View className="w-1/6 justify-center items-center">
            <Text className="font-bold text-white">Image</Text>
          </View>
          <View className="w-1/5 justify-center items-center">
            <Text className="font-bold text-white">Name</Text>
          </View>
          <View className="w-1/5 justify-center items-center">
            <Text className="font-bold text-white">Price</Text>
          </View>
          <View className="w-1/6 justify-center items-center">
            <Text className="font-bold text-white">Available</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View>
      {/* <Text>services</Text>
      <TouchableOpacity
        className="p-2 bg-white rounded-lg"
        onPress={() => navigation.navigate("ServiceForm")}
      >
        <Text>Add Service</Text>
      </TouchableOpacity> */}
      <View className="flex-row items-center space-x-2 px-2 mt-3">
        <View className="flex-row flex-1 items-center bg-white rounded-lg p-2">
          <MagnifyingGlassCircleIcon
            color="#ef4444"
            size={hp(3)}
            strokeWidth={3}
          />

          <TextInput
            className="flex-1 mb-1 pl-2 tracking-wider"
            placeholder="Search Service"
            onChangeText={(text) => searchService(text)}
          />
        </View>

        <View className="flex flex-row">
          <TouchableOpacity
            className="bg-red-500 mx-auto flex justify-center items-center rounded-lg"
            style={{ height: wp(10), width: wp(25) }}
            onPress={() => navigation.navigate("ServiceForm")}
          >
            <Text className="text-white font-bold">+ Service</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex-row justify-between items-center px-2 mt-4">
        <View>
          <Text className="font-bold text-lg">Service List</Text>
        </View>

        <View>
          <Text className="text-xs text-zinc-600">(Press hold to edit)</Text>
        </View>
      </View>

      <View className="mb-20 mt-2 ">
        {loading === true ? (
          <View className="flex justify-center items-center">
            <ActivityIndicator size="large" color="red" />
          </View>
        ) : (
          <View className="px-2">
            <View className="rounded-lg">
              <FlatList
                ListHeaderComponent={ListHeader}
                data={servicesFilter}
                renderItem={({ item, index }) => (
                  <View className="mt-1">
                    {services.length > 0 ? (
                      <>
                        <ServiceList item={item} index={index} deleteService={deleteService} />
                      </>
                    ) : (
                      <View className="flex justify-center items-center p-5">
                        <Text>No data available.</Text>
                      </View>
                    )}
                  </View>
                )}
              />
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default Services;
