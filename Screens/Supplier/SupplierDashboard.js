import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  TouchableHighlight,
  Image,
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

// import baseURL from "../../assets/common/baseUrl";
// import BrandList from "./BrandList";

import Toast from "react-native-toast-message";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  AdjustmentsHorizontalIcon,
  MagnifyingGlassCircleIcon,
  XMarkIcon,
} from "react-native-heroicons/solid";
import {
  BarChart,
  LineChart,
  PieChart,
  PopulationPyramid,
} from "react-native-gifted-charts";
import baseURL from "../../assets/common/baseUrl";
import { FlatList, Badge, Pressable } from "native-base";

const SupplierDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, isLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("asc"); // Default sorting order

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem("jwt")
        .then((res) => {
          setToken(res);
        })
        .catch((error) => console.log(error));

      axios.get(`${baseURL}products/namesandstocks`).then((res) => {
        setProducts(res.data);
        isLoading(false);
      });

      return () => {
        setProducts();
      };
    }, [])
  );

  // Function to toggle sorting order
  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  // Function to sort products based on stock
  const sortProducts = () => {
    const sortedProducts = [...products].sort((a, b) => {
      if (sortOrder === "asc") {
        return a.stock - b.stock;
      } else {
        return b.stock - a.stock;
      }
    });

    setProducts(sortedProducts);
  };

  console.log(products);
  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const latestProducts = products?.slice(-8);

  const barData = latestProducts?.map((product) => ({
    value: product.stock,
    label: product.name,
    frontColor: getRandomColor(),
    sideColor: getRandomColor(),
    topColor: getRandomColor(),
  }));

  const renderProducts = ({ item }) => {
    return (
      <View className="border-b border-slate-200">
        <View className="bg-white p-3 flex flex-row space-x-1">
          <View className="w-16">
            <Image
              className="rounded"
              style={{
                width: 54,
                height: 54,
              }}
              source={
                item.images[0]?.url
                  ? { uri: item.images[0].url }
                  : require("../../assets/images/teampoor-default.png")
              }
            />
          </View>

          <View className="w-32">
            <Text className="font-bold">{item.name}</Text>
            <Text className="">{item.description}</Text>
          </View>

          <View className="w-12">
            <Text>{item.stock}</Text>
          </View>

          <View className="grow items-center">
            {item.stock < 10 ? (
              <Badge colorScheme="danger" className="rounded-full">
                <Text className="text-xs">Low Stock</Text>
              </Badge>
            ) : item.stock < 50 ? (
              <Badge colorScheme="info" className="rounded-full">
                <Text className="text-xs">Average Stock</Text>
              </Badge>
            ) : (
              <Badge colorScheme="success" className="rounded-full">
                <Text className="text-xs">High Stock</Text>
              </Badge>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-slate-50">
      {loading ? (
        <ActivityIndicator color="red" />
      ) : (
        <ScrollView className="p-3">
          <View className="bg-white flex rounded-lg p-4">
            <Text className="font-bold text-lg">Product Stock</Text>

            <View className="flex">
              <View>
                <BarChart
                  frontColor={"#177AD5"}
                  barWidth={22}
                  data={barData}
                  barBorderRadius={4}
                  yAxisThickness={0}
                  xAxisThickness={0}
                  isAnimated
                  // isThreeD
                />
              </View>
            </View>
          </View>

          <View className="mt-4 bg-white rounded-lg mb-5">
            <View className="flex flex-row p-3 space-x-1">
              <View className="w-16">
                <Text className="font-bold">Image</Text>
              </View>
              <View className="w-32">
                <Text className="font-bold">Product Name</Text>
              </View>
              <View className="w-12">
                <Text className="font-bold">Stock</Text>
              </View>
              <TouchableOpacity
                className="grow items-center"
                onPress={() => {
                  toggleSortOrder();
                  sortProducts();
                }}
              >
                <View className="flex flex-row space-x-1 items-center">
                  <Text className="font-bold">Status</Text>
                  <AdjustmentsHorizontalIcon color="gray" size={18} />
                </View>
              </TouchableOpacity>
            </View>
            <FlatList
              data={products}
              keyExtractor={(item) => item.id}
              renderItem={renderProducts}
            />
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default SupplierDashboard;
