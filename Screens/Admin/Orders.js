import React, { useCallback, useState } from "react";
import { View, FlatList, ScrollView } from "native-base";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import Toast from "react-native-toast-message";
import OrderList from "./OrderList";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Orders = (props) => {
  const [allOrders, setAllOrders] = useState();
  const [token, setToken] = useState();
  const [statusSelected, setStatusSelected] = useState("All");
  const [loading, setLoading] = useState(false); // Introduce loading state

  useFocusEffect(
    useCallback(() => {
      // AsyncStorage.getItem("jwt")
      //   .then((res) => {
      //     setToken(res);
      //   })
      //   .catch((error) => console.log(error));

      getOrders();

      return () => {
        setAllOrders([]);
      };
    }, [])
  );

  const getOrders = () => {
    setLoading(true);

    axios
      .get(`${baseURL}orders`)
      .then((res) => {
        setAllOrders(res.data);
      })
      .catch((error) => console.log(error))
      .finally(() => {
        setLoading(false); // Set loading state to false when fetching is completed
      });
  };

  const updateStatus = (id, newStatus) => {
    try {
      axios
        .put(
          `${baseURL}orders/${id}`,
          { status: newStatus },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((res) => {
          getOrders();

          Toast.show({
            topOffset: 60,
            type: "success",
            text1: "Order Status Updated",
            text2: `#${id} Order has been Updated`,
          });
        });
    } catch (error) {
      console.error(error);
      // Handle errors, show an error toast, etc.
      Toast.show({
        topOffset: 60,
        type: "error",
        text1: "Something went wrong",
        text2: "Please try again",
      });
    }
  };

  // console.log(allOrders, "ordaser list");
  return (
    <View className="flex-1 p-2">
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="red" />
        </View>
      ) : (
        <>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="space-x-3"
          >
            {/* <View className="flex-row gap-4">
          <TouchableOpacity>
            <View className="bg-white p-5 rounded-lg">
              <Text className="font-semibold">Pending</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity>
            <View className="bg-white p-5 rounded-lg">
              <Text className="font-semibold">Confirmed</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity>
            <View className="bg-white p-5 rounded-lg">
              <Text className="font-semibold">Out for Delivery</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity>
            <View className="bg-white p-5 rounded-lg">
              <Text className="font-semibold">Delivered</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity>
            <View className="bg-white p-5 rounded-lg">
              <Text className="font-semibold">Canceled</Text>
            </View>
          </TouchableOpacity>
        </View> */}
          </ScrollView>
          <FlatList
            data={allOrders ? allOrders.slice() : []}
            renderItem={({ item }) => (
              <OrderList item={item} updateStatus={updateStatus} />
            )}
            keyExtractor={(item) => item.id?.toString()}
          />
        </>
      )}
    </View>
  );
};

export default Orders;
