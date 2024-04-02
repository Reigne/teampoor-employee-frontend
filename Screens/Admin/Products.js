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

var { height, width } = Dimensions.get("window");

const Products = (props) => {
  const [productList, setProductList] = useState();
  const [productFilter, setProductFilter] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const searchProduct = (text) => {
    if (text === "") {
      setProductFilter(productList);
    } else {
      setProductFilter(
        productList.filter((i) =>
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
        axios.get(`${baseURL}products`).then((res) => {
          // console.log(res.data);
          setProductList(res.data);
          setProductFilter(res.data);
          setLoading(false);
        });
      }, 2000);

      return () => {
        setProductList();
        setProductFilter();
        setLoading(false);
      };
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    setTimeout(() => {
      axios.get(`${baseURL}products`).then((res) => {
        setProductList(res.data);
        setProductFilter(res.data);
      });

      setRefreshing(false);
    }, 2000);
  }, []);

  const deleteProduct = (id) => {
    axios
      .delete(`${baseURL}products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const products = productFilter.filter((item) => item.id !== id);
        setProductFilter(products);
        Toast.show({
          topOffset: 60,
          type: "success",
          text1: "Product successfuly deleted",
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
        <View className="flex flex-row justify-between">
          <View className="w-1/6 justify-center items-center">
            <Text className="font-bold text-white">Image</Text>
          </View>
          <View className="w-1/6 justify-center items-center">
            <Text className="font-bold text-white">Name</Text>
          </View>
          <View className="w-1/6 justify-center items-center">
            <Text className="font-bold text-white">Brand</Text>
          </View>
          <View className="w-1/6 justify-center items-center">
            <Text className="font-bold text-white">Price</Text>
          </View>
          {/* <View className="w-1/6 justify-center items-center">
            <Text className="font-bold text-white">Stock</Text>
          </View> */}
        </View>
      </View>
    );
  };

  return (
    <View flex={1}>
      <View className="flex-row items-center space-x-2 px-2 mt-3">
        <View className="flex-row flex-1 items-center bg-white rounded-lg p-2">
          <MagnifyingGlassCircleIcon
            color="#ef4444"
            size={hp(3)}
            strokeWidth={3}
          />

          <TextInput
            className="flex-1 mb-1 pl-2 tracking-wider"
            placeholder="Search Product"
            onChangeText={(text) => searchProduct(text)}
          />
        </View>

        <View className="flex flex-row">
          <TouchableOpacity
            className="bg-red-500 mx-auto flex justify-center items-center rounded-lg"
            style={{ height: wp(10), width: wp(25) }}
            onPress={() => navigation.navigate("ProductForm")}
          >
            <Text className="text-white font-bold">+ Product</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex-row justify-between items-center px-2 mt-4">
        <View>
          <Text className="font-bold text-lg">Product List</Text>
        </View>

        <View>
          <Text className="text-xs text-zinc-600">(Press hold to edit)</Text>
        </View>
      </View>

      {/* <View className="mx-2 flex-row items-center rounded-full bg-black/5 p-[6px]">
          <TextInput
            className="flex-1 text-base mb-1 pl-3 tracking-wider"
            placeholder="Search any product here..."
            onChangeText={(text) => searchProduct(text)}
          />
          <TouchableOpacity className="rounded-full">
            <XMarkIcon color="gray" size={hp(2.5)} strokeWidth={3} />
          </TouchableOpacity>
        </View> */}
      <View className="mb-20 mt-2 ">
        {loading === true ? (
          <View className="flex justify-center items-center">
            <ActivityIndicator size="large" color="red" />
          </View>
        ) : (
          <View className="px-2">
            {/* { productFilter.length > 0 ? ( */}
            <View className="rounded-lg pb-10">
              <FlatList
                data={productFilter}
                ListHeaderComponent={ListHeader}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
                renderItem={({ item, index }) => (
                  <View className="mt-1">
                    <ListItem
                      item={item}
                      index={index}
                      deleteProduct={deleteProduct}
                    />
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

export default Products;
