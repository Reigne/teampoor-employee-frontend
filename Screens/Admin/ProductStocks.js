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
import ProductStockList from "./ProductStockList";

var { height, width } = Dimensions.get("window");

const ProductStocks = (props) => {
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
        <View className="flex flex-row">
          <View className="justify-center items-start w-1/5">
            <Text className="font-bold text-white">Image</Text>
          </View>
          <View className="justify-center items-start w-2/5">
            <Text className="font-bold text-white">Name</Text>
          </View>
          <View className="justify-center items-start  w-1/5">
            <Text className="font-bold text-white">Stock</Text>
          </View>
          <View className="justify-center items-start w-1/5">
            <Text className="font-bold text-white">Status</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View flex={1}>
      <View className="flex-row justify-between items-center px-2 mt-4">
        <View>
          <Text className="font-bold text-lg">Product Stock</Text>
        </View>

        <View>
          <Text className="text-xs text-zinc-600">(Press hold to edit)</Text>
        </View>
      </View>

      <View className="mt-2 flex-1">
        {loading === true ? (
          <View className="flex justify-center items-center">
            <ActivityIndicator size="large" color="red" />
          </View>
        ) : (
          <View className="flex-1 px-2">
            {/* { productFilter.length > 0 ? ( */}
            <View className="rounded-lg">
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
                    <ProductStockList
                      item={item}
                      index={index}
                      deleteProduct={deleteProduct}
                    />
                  </View>
                )}
                keyExtractor={(item) => item.id}
              />
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default ProductStocks;
