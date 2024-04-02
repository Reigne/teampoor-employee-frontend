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

import Toast from "react-native-toast-message";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  MagnifyingGlassCircleIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "react-native-heroicons/solid";
import SupplierLogList from "./SupplierLogList";

const SupplierLogs = () => {
  let navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [supplierLogs, setSupplierLogs] = useState([]);

  useFocusEffect(
    useCallback(() => {
      fetchSupplierLogs();

      return () => {
        setSupplierLogs([]);
      };
    }, [])
  );

  const fetchSupplierLogs = () => {
    setLoading(true);

    axios
      .get(`${baseURL}supplierLogs`)
      .then((res) => {
        setSupplierLogs(res.data);
      })
      .catch((error) => console.log(error))
      .finally(() => {
        setLoading(false); // Set loading state to false when fetching is completed
      });
  };

  console.log(supplierLogs, "sup logs");
  
  return (
    <View className="flex-1 p-3">
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="red" />
        </View>
      ) : (
        <View className="space-y-3">
          <View>
            <View>
              <TouchableOpacity
                className="p-3 bg-red-500 rounded-lg"
                onPress={() => navigation.navigate("SupplierLogForm")}
              >
                <Text className="text-white font-semibold">Create New</Text>
              </TouchableOpacity>
            </View>

            {/* <Text className="mt-2">Supplier Logs</Text> */}

            <FlatList
              data={supplierLogs ? supplierLogs.slice() : []}
              renderItem={({ item }) => (
                <View className="mt-2">
                  <SupplierLogList item={item} />
                </View>
              )}
              keyExtractor={(item) => item.id?.toString()}
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default SupplierLogs;
