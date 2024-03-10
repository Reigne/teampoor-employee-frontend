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
import BrandList from "./BrandList";

import Toast from "react-native-toast-message";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  MagnifyingGlassCircleIcon,
  XMarkIcon,
} from "react-native-heroicons/solid";

const ListHeader = () => {
  return (
    <View className="bg-red-500 p-5 rounded-lg mb-1">
      <View className="flex flex-row gap-16 items-center">
        <Text className="font-bold text-white">Image</Text>
        <Text className="font-bold text-white">Name</Text>
      </View>
    </View>
  );
};

const Brands = () => {
  const [brandList, setBrandList] = useState([]);
  const [brandFilter, setBrandFilter] = useState([]);
  const [loading, setLoading] = useState(true);
  const [focus, setFocus] = useState();
  const [token, setToken] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState("");

  const navigation = useNavigation();

  const searchBrand = (text) => {
    if (text === "") {
      setBrandFilter(brandList);
    } else {
      setBrandFilter(
        brandList.filter((i) =>
          i.name.toLowerCase().includes(text.toLowerCase())
        )
      );
    }
  };

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem("jwt")
        .then((res) => {
          setToken(res);
        })
        .catch((error) => console.log(error));

      axios.get(`${baseURL}brands`).then((res) => {
        setBrandList(res.data);
        setBrandFilter(res.data);
        setLoading(false);
      });

      return () => {
        setBrandList();
        setBrandFilter();
        setLoading(false);
      };
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    setTimeout(() => {
      axios.get(`${baseURL}brands`).then((res) => {
        setBrandList(res.data);
        setBrandFilter(res.data);
        setLoading(false);
      });

      return () => {
        setBrandList();
        setBrandFilter();
        setLoading(false);
      };

      setRefreshing(false);
    }, 2000);
  }, []);

  const deleteBrand = (id) => {
    axios
      .delete(`${baseURL}brands/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const brands = brandFilter.filter((item) => item.id !== id);
        setBrandFilter(brands);

        Toast.show({
          topOffset: 60,
          type: "success",
          text1: "Brand Successfully Deleted",
          text2: "",
        });
      })
      .catch((error) => console.log(error));
  };

  return (
    <KeyboardAwareScrollView className="flex-1 bg-gray-100">
      {/* <Text>Hello Brands</Text> */}

      {/* <View className="flex flex-row justify-center items-center p-2 mt-3">
        <TouchableOpacity className="bg-red-500 p-4 rounded-full" onPress={() => navigation.navigate("BrandForm")}>
          <Text className="text-white font-bold">+ Add Brand</Text>
        </TouchableOpacity>
      </View> */}

      <View className="flex-row items-center space-x-2 px-2 pb-1 mt-3">
        <View className="flex-row flex-1 items-center p-2 rounded-lg bg-white divide-x divide-zinc-100 ">
            
          <MagnifyingGlassCircleIcon
            color="#ef4444"
            size={hp(3)}
            strokeWidth={3}
          />

          <TextInput
            className="flex-1 ml-1 pl-2 tracking-wider "
            placeholder="Search brand"
            onChangeText={(text) => {
              setSearchText(text);
              searchBrand(text);
            }}
            value={searchText}
          />

          {searchText.length > 0 ? (
            <TouchableOpacity
              onPress={() => {
                setSearchText("");
                setBrandFilter(brandList); // Reset the filter when XMarkIcon is pressed
              }}
              className="rounded-lg"
            >
              <View className="p-1 rounded-full">
                <XMarkIcon
                  height="15"
                  width="15"
                  strokeWidth={2}
                  stroke="#ef4444"
                />
              </View>
            </TouchableOpacity>
          ) : null}
        </View>

        {searchText.length > 0 ? null : (
          <TouchableOpacity
            className="bg-red-500 py-3 px-2 rounded-lg"
            onPress={() => navigation.navigate("BrandForm")}
          >
            <Text className="text-white font-bold text-sm"> + Add Brand</Text>
          </TouchableOpacity>
        )}
      </View>

      <View className="px-2 flex flex-row justify-end mt-2">
        {/* <Text className="font-bold text-lg">Brand List</Text> */}
        <Text className="text-xs text-zinc-700">(Press hold to edit)</Text>
      </View>

      <View>
        {loading ? (
          <View>
            <ActivityIndicator size="large" color="#ef4444" />
          </View>
        ) : (
          <View className="p-2">
            <FlatList
              data={brandFilter}
              ListHeaderComponent={ListHeader}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              renderItem={({ item, index }) => (
                <View className="">
                  {/* <Divider /> */}
                  <BrandList
                    item={item}
                    index={index}
                    deleteBrand={deleteBrand}
                  />
                </View>
              )}
              keyExtractor={(item) => item.id}
            />
          </View>
        )}
      </View>
    </KeyboardAwareScrollView>
  );
};

export default Brands;
