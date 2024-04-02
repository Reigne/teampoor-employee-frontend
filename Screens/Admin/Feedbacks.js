import React, { useState, useEffect } from "react";
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

import baseURL from "../../assets/common/baseUrl";

import Toast from "react-native-toast-message";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  MagnifyingGlassCircleIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "react-native-heroicons/solid";
import FeedbackList from "./FeedbackList";

const Feedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    getFeedbacks();
  }, []);

  const getFeedbacks = () => {
    axios.get(`${baseURL}feedbacks`).then((res) => {
      setFeedbacks(res.data);
      setFilteredFeedbacks(res.data);
    });
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = feedbacks.filter((feedback) => {
      const mechanic = feedback.mechanic;
      const fullName =
        `${mechanic.firstname} ${mechanic.lastname}`.toLowerCase();
      return fullName.includes(query.toLowerCase());
    });
    setFilteredFeedbacks(filtered);

    // If the query is empty, reset the filteredFeedbacks state
    if (!query) {
      setFilteredFeedbacks(feedbacks);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    getFeedbacks();
    setRefreshing(false);
  };

  return (
    <View className="flex-1 bg-zinc-100 p-3 space-y-3">
      <View className="flex flex-row items-center space-x-1">
        <View className="flex-1 flex-row space-x-2 items-center bg-white px-3 py-2 rounded-xl">
          <View>
            <MagnifyingGlassIcon color="black" size={14} />
          </View>

          <TextInput
            placeholder="Search Mechanic Name"
            value={searchQuery}
            onChangeText={handleSearch}
            className="flex-1"
          />
        </View>

        {searchQuery && (
          <TouchableOpacity onPress={() => (setSearchQuery(""), handleSearch(""))}>
            <XMarkIcon size={18} color="#ef4444" />
          </TouchableOpacity>
        )}
      </View>

      <View>
        <Text>Feedback</Text>
      </View>

      <View className="flex-1">
        <FlatList
          contentContainerStyle={{ flexGrow: 1 }}
          data={filteredFeedbacks}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => (
            <View className="mb-2">
              <FeedbackList item={item} />
            </View>
          )}
          keyExtractor={(item) => item.id?.toString()}
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center">
              <View>
                <Image
                  style={{ width: 120, height: 120 }} // Adjust the width and height as needed
                  source={require("../../assets/images/search-empty.png")}
                  alt="empty-cart"
                />
              </View>
              <Text className="text-xl font-bold text-red-500">
                NO FEEDBACKS FOUND
              </Text>
              <Text className="text-xs">
                No feedbacks match your search query.
              </Text>
            </View>
          }
        />
      </View>
    </View>
  );
};

export default Feedbacks;
