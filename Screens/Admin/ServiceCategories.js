import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  TextInput,
} from "react-native";

import { Divider, ScrollView } from "native-base";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import baseURL from "../../assets/common/baseUrl";
import ServiceCategoryList from "./ServiceCategoryList";

import Toast from "react-native-toast-message";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  MagnifyingGlassCircleIcon,
  XMarkIcon,
} from "react-native-heroicons/solid";

const ServiceCategories = () => {
  let navigation = useNavigation();
  const [serviceCategories, setServiceCategories] = useState();
  const [serviceCategoriesFilter, setServiceCategoriesFilter] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState("");

  const searchServiceCategories = (text) => {
    if (text === "") {
      setServiceCategoriesFilter(serviceCategories);
    } else {
      setServiceCategoriesFilter(
        serviceCategories.filter((i) =>
          i.name.toLowerCase().includes(text.toLowerCase())
        )
      );
    }
  };

  useFocusEffect(
    useCallback(() => {
      //get token
      AsyncStorage.getItem("jwt")
        .then((res) => {
          setToken(res);
        })
        .catch((error) => console.log(error));

      setTimeout(() => {
        axios.get(`${baseURL}serviceCategories`).then((res) => {
          // console.log(res.data);
          setServiceCategories(res.data);
          setServiceCategoriesFilter(res.data);
          setLoading(false);
        });
      }, 2000);

      return () => {
        setServiceCategories();
        setServiceCategoriesFilter();
        setLoading(false);
      };
    }, [])
  );

  const deleteServiceCategory = (id) => {
    axios
      .delete(`${baseURL}serviceCategories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const services = serviceCategoriesFilter.filter(
          (item) => item.id !== id
        );
        setServiceCategoriesFilter(services);

        Toast.show({
          topOffset: 60,
          type: "success",
          text1: "Service Category Successfuly Deleted",
          text2: "",
        });
      })
      .catch((error) => console.log(error));
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    setTimeout(() => {
      axios.get(`${baseURL}serviceCategories`).then((res) => {
        setServiceCategories(res.data);
        setServiceCategoriesFilter(res.data);
      });

      setRefreshing(false);
    }, 2000);
  }, []);

  const ListHeader = () => {
    return (
      <View className="p-5">
        <View className="flex flex-row gap-8">
          <View className="w-1/4 justify-center items-center">
            <Text className="font-bold">Image</Text>
          </View>
          <View className="w-1/6 justify-center items-center">
            <Text className="font-bold">Name</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View>
      {/* <Text>Service Categories</Text>

      <TouchableOpacity
        onPress={() => navigation.navigate("ServiceCategoryForm")}
      >
        <Text>Add Category</Text>
      </TouchableOpacity> */}

      <View className="flex-row items-center space-x-2 px-2 mt-3">
        <View className="flex-row flex-1 justify-center items-center bg-white rounded-lg p-2">
          <MagnifyingGlassCircleIcon
            color="#ef4444"
            size={hp(3)}
            strokeWidth={3}
          />

          <TextInput
            className="flex-1 pl-2 tracking-wider"
            placeholder="Search Service Category"
            onChangeText={(text) => {
              searchServiceCategories(text), setSearchText(text);
            }}
            value={searchText}
          />

          {searchText.length > 0 ? (
            <TouchableOpacity
              onPress={() => {
                  setSearchText(""),
                  setServiceCategoriesFilter(serviceCategories);
              }}
            >
              <XMarkIcon color="black" size={20} />
            </TouchableOpacity>
          ) : null}
        </View>

        {searchText.length > 0 ? null : (
          <View className="flex flex-row">
            <TouchableOpacity
              className="bg-red-500 mx-auto flex justify-center items-center rounded-lg"
              style={{ height: wp(10), width: wp(25) }}
              onPress={() => navigation.navigate("ServiceCategoryForm")}
            >
              <Text className="text-white font-bold">+ Service Category</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View className="flex-row justify-between items-center px-2 mt-4">
        <View>
          <Text className="font-bold text-lg">Service Category List</Text>
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
            {/* { productFilter.length > 0 ? ( */}
            <View className="bg-white rounded-lg">
              <FlatList
                data={serviceCategoriesFilter}
                ListHeaderComponent={ListHeader}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
                renderItem={({ item, index }) => (
                  <View>
                    {serviceCategories.length > 0 ? (
                      <>
                        <Divider />
                        <ServiceCategoryList
                          item={item}
                          index={index}
                          deleteServiceCategory={deleteServiceCategory}
                        />
                      </>
                    ) : (
                      <View className="flex justify-center items-center p-5">
                        <Text>No data available.</Text>
                      </View>
                    )}
                  </View>
                )}
                keyExtractor={(item) => item.id}
              />
            </View>

            {/* ) : (
                <View className="flex justify-center items-center mt-10">
                  <Text className="font-bold text-base">No product found</Text>
                  <Text className="text-sm text-neutral">
                    Try different or more general keywords
                  </Text>
                </View>
              )} */}
          </View>
        )}
      </View>
    </View>
  );
};

export default ServiceCategories;
