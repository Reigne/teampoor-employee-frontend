import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import baseURL from "../../assets/common/baseUrl";
import ProductStockLogsList from "./ProductStockLogsList";

const ProductStockLogs = (props) => {
  const [productLogs, setProductLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [token, setToken] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem("jwt")
        .then((res) => {
          setToken(res);
        })
        .catch((error) => console.log(error));

      fetchProductLogs(1);

      return () => {
        setProductLogs([]);
      };
    }, [])
  );

  const fetchProductLogs = (pageNum) => {
    setLoading(true);
    axios
      .get(`${baseURL}products/stockLogs?page=${pageNum}`)
      .then((res) => {
        console.log(res.data);
        if (pageNum === 1) {
          setProductLogs(res.data.stockLogs);
        } else {
          setProductLogs((prevLogs) => [...prevLogs, ...res.data.stockLogs]);
        }
        setHasMore(res.data.hasMore);
        setLoading(false);
        setRefreshing(false);
      })
      .catch((error) => {
        console.error("Error fetching product logs:", error);
        setLoading(false);
        setRefreshing(false);
      });
  };

  const onRefresh = useCallback(() => {
    setPage(1);
    setRefreshing(true);
    fetchProductLogs(1);
  }, []);

  const onEndReached = () => {
    if (!loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
      fetchProductLogs(page + 1);
    }
  };

  const ListHeader = () => {
    return (
      <View className="p-5 bg-red-500 rounded-lg">
        <View className="flex flex-row justify-between">
          <View className="flex-1 justify-center items-start">
            <Text className="font-bold text-white">Name</Text>
          </View>
          <View className="flex-1 justify-center items-start">
            <Text className="font-bold text-white">Quantity</Text>
          </View>
          <View className="flex-1 justify-center items-start">
            <Text className="font-bold text-white">Status</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1">
      <View className="flex-1 p-2">
        {loading && page === 1 ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="red" />
          </View>
        ) : (
          <FlatList
            data={productLogs}
            ListHeaderComponent={ListHeader}
            renderItem={({ item, index }) => (
              <View className="mt-1 bg-white rounded-lg">
                <ProductStockLogsList item={item} index={index} />
              </View>
            )}
            keyExtractor={(item) => item.id}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} color="red"/>
            }
            onEndReached={onEndReached}
            onEndReachedThreshold={0.1}
          />
        )}
      </View>
    </View>
  );
};

export default ProductStockLogs;
