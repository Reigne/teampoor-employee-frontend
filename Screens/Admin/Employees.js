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
import EmployeeList from "./EmployeeList";

import Toast from "react-native-toast-message";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  MagnifyingGlassCircleIcon,
  XMarkIcon,
} from "react-native-heroicons/solid";

const ListHeader = () => {
  return (
    <View className="bg-slate-700 p-5 rounded-t">
      <View className="flex flex-row items-center">
        <Text className="font-bold text-white w-16">Image</Text>
        <Text className="font-bold text-white w-24">First Name</Text>
        <Text className="font-bold text-white w-28">Last Name</Text>
        <Text className="font-bold text-white w-24">Role</Text>
      </View>
    </View>
  );
};

const Employees = () => {
  const [userList, setUserlist] = useState();
  const [userFilter, setUserFilter] = useState();
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState("");
  const navigation = useNavigation();

  const searchUser = (text) => {
    if (text === "") {
      setUserFilter(userList);
    } else {
      setUserFilter(
        userList.filter(
          (i) =>
            (i.firstname?.toLowerCase() || "").includes(text.toLowerCase()) ||
            (i.lastname?.toLowerCase() || "").includes(text.toLowerCase())
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

      axios.get(`${baseURL}users/all-employee`).then((res) => {
        setUserlist(res.data);
        setUserFilter(res.data);
        setLoading(false);
      });

      return () => {
        setUserlist();
        setUserFilter();
        setLoading(false);
      };
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    setTimeout(() => {
      axios.get(`${baseURL}users/all-employee`).then((res) => {
        setUserlist(res.data);
        setUserFilter(res.data);
        setLoading(false);
      });

      setRefreshing(false);
    }, 1000);
  }, []);

  const deleteUser = (id) => {
    axios
      .delete(`${baseURL}users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const brands = userFilter.filter((item) => item.id !== id);
        setUserFilter(brands);

        Toast.show({
          topOffset: 60,
          type: "success",
          text1: "Account Successfully Deleted",
          text2: "",
        });
      })
      .catch((error) => console.log(error));
  };

  const updateRole = (id, newRole) => {
    // Make an API call to update the user's role in the database
    axios
      .put(
        `${baseURL}users/update-role/${id}`,
        { role: newRole },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        // Update the user's role in the local state
        setUserFilter((prevUsers) =>
          prevUsers.map((user) =>
            user.id === id ? { ...user, role: newRole } : user
          )
        );

        Toast.show({
          topOffset: 60,
          type: "success",
          text1: "Role Successfully Updated",
          text2: "",
        });
      })
      .catch((error) => console.log(error));
  };

  return (
    <KeyboardAwareScrollView className="flex-1 bg-slate-100">
      <View className="flex-row items-center space-x-2 px-2 pb-1 mt-3">
        <View className="flex-row flex-1 items-center p-2 rounded bg-white">
          <MagnifyingGlassCircleIcon
            color="#ef4444"
            size={hp(3)}
            strokeWidth={3}
          />

          <TextInput
            className="flex-1 ml-1 pl-2 tracking-wider"
            placeholder="Search USER"
            value={searchText}
            onChangeText={(text) => {
              setSearchText(text);
              searchUser(text);
            }}
          />

          {searchText.length > 0 ? (
            <TouchableOpacity
              className="rounded-full"
              onPress={() => {
                setSearchText("");
                setUserFilter(userList);
              }}
            >
              <View className="p-1 border border-red-500 rounded-full">
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

        {/* {searchText.length > 0 ? null : (
          <TouchableOpacity
            className="bg-red-500 p-3 rounded"
            onPress={() => navigation.navigate("EmployeeForm")}
          >
            <Text className="text-white font-bold text-sm">
              {" "}
              + Add Employee
            </Text>
          </TouchableOpacity>
        )} */}
      </View>

      <View>
        {loading ? (
          <View>
            <ActivityIndicator size="large" color="#ef4444" />
          </View>
        ) : (
          <View className="mt-3 p-1">
            <FlatList
              data={userFilter}
              ListHeaderComponent={ListHeader}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              renderItem={({ item, index }) => (
                <View className="border-b border-slate-200">
                  <EmployeeList
                    item={item}
                    index={index}
                    deleteUser={deleteUser}
                    updateRole={updateRole}
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

export default Employees;
