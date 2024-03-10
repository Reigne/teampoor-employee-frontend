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
import CategoryList from "./CategoryList";

import Toast from "react-native-toast-message";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  MagnifyingGlassCircleIcon,
  XMarkIcon,
} from "react-native-heroicons/solid";

const ListHeader = () => {
  return (
    <View className="mt-3 bg-red-500 rounded-xl p-5">
      <View className="flex flex-row gap-16 items-center">
        <Text className="font-bold text-white">Image</Text>
        <Text className="font-bold text-white">Name</Text>
      </View>
    </View>
  );
};

const Categories = (props) => {
  const [categoryList, setCategoryList] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState("");

  const navigation = useNavigation();

  const searchCategory = (text) => {
    if (text === "") {
      setCategoryFilter(categoryList);
    } else {
      setCategoryFilter(
        categoryList.filter((i) =>
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

      axios.get(`${baseURL}categories`).then((res) => {
        setCategoryList(res.data);
        setCategoryFilter(res.data);
        setLoading(false);
      });

      return () => {
        setCategoryList();
        setCategoryFilter();
        setLoading(false);
      };
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    setTimeout(() => {
      axios.get(`${baseURL}categories`).then((res) => {
        setCategoryList(res.data);
        setCategoryFilter(res.data);
        setLoading(false);
      });

      return () => {
        setCategoryList();
        setCategoryFilter();
        setLoading(false);
      };

      setRefreshing(false);
    }, 2000);
  }, []);

  const deleteCategory = (id) => {
    console.log(`${baseURL}categories/${id}`, "delete console");

    axios
      .delete(`${baseURL}categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const categories = categoryFilter.filter((item) => item.id !== id);
        setCategoryFilter(categories);

        Toast.show({
          topOffset: 60,
          type: "success",
          text1: "Category Successfully Deleted",
          text2: "",
        });
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.status === 400 &&
          error.response.data.success
        ) {
          // Treat as a successful deletion
          const categories = categoryFilter.filter((item) => item.id !== id);
          setCategoryFilter(categories);

          Toast.show({
            topOffset: 60,
            type: "success",
            text1: "Category Successfully Deleted",
            text2: "",
          });
        } else {
          // Handle other errors
          console.error(
            "Error response status:",
            error.response ? error.response.status : "unknown"
          );
          console.error(
            "Error response data:",
            error.response ? error.response.data : "unknown"
          );
        }
      });
  };

  return (
    <KeyboardAwareScrollView className="flex-1 bg-gray-100">
      <View className="flex-row items-center space-x-2 px-2 pb-1 mt-3">
        <View className="flex-row flex-1 items-center p-2 rounded-xl bg-white divide-x divide-zinc-200">
          <MagnifyingGlassCircleIcon
            color="#ef4444"
            size={hp(3)}
            strokeWidth={3}
          />

          <TextInput
            className="flex-1 ml-1 pl-2 tracking-wider"
            placeholder="Search CATEGORY"
            onChangeText={(text) => {
              setSearchText(text);
              searchCategory(text);
            }}
            value={searchText}
          />

          {searchText.length > 0 ? (
            <TouchableOpacity
              className="rounded-full p-1"
              onPress={() => {
                setSearchText("");
                setCategoryFilter(categoryList);
              }}
            >
                <XMarkIcon
                  height="15"
                  width="15"
                  strokeWidth={2}
                  stroke="#ef4444"
                />
            </TouchableOpacity>
          ) : null}
        </View>
        {searchText.length > 0 ? null : (
          <TouchableOpacity
            className="bg-red-500 p-3 rounded-full"
            onPress={() => navigation.navigate("CategoryForm")}
          >
            <Text className="text-white font-bold text-sm">Add</Text>
          </TouchableOpacity>
        )}
      </View>

      <View>
        {loading ? (
          <View>
            <ActivityIndicator size="large" color="#ef4444" />
          </View>
        ) : (
          <View className="px-2">
            <FlatList
              data={categoryFilter}
              ListHeaderComponent={ListHeader}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              renderItem={({ item, index }) => (
                <View className="mt-1">
                  <CategoryList
                    item={item}
                    index={index}
                    deleteCategory={deleteCategory}
                  />
                </View>
              )}
              keyExtractor={(item) => item._id}
            />
          </View>
        )}
      </View>
    </KeyboardAwareScrollView>
  );
};

export default Categories;
