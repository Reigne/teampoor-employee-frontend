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
import {
  MagnifyingGlassCircleIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "react-native-heroicons/solid";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Dropdown } from "react-native-element-dropdown";

const AppointmentAddService = (props) => {
  const navigation = useNavigation();
  const item = props.route.params;

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      axios.get(`${baseURL}services`).then((res) => {
        setServices(res.data);
        setLoading(false);
      });

      return () => {
        setServices([]);
        setLoading(false);
      };
    }, [item])
  );

  const data = services.map((service) => ({
    label: `${service.name}`,
    value: service._id, // Assuming _id is the unique identifier for mechanics
    image: service.images[0]?.url || "", // Assuming _id is the unique identifier for mechanics
  }));

  const renderServices = (service) => {
    return (
      <View style={styles.item}>
        <View className="flex flex-row space-x-2">
          <Image
            className="rounded"
            style={{
              width: 24,
              height: 24,
            }}
            source={{
              uri: service.image
                ? service.image
                : "https://i.pinimg.com/originals/40/57/4d/40574d3020f73c3aa4b446aa76974a7f.jpg",
            }}
            alt="images"
          />
          <Text style={styles.textItem}>{service.label}</Text>
        </View>
        {/* {service.value === selectedMechanic && <CheckIcon size={3} />} */}
      </View>
    );
  };

  console.log(services, "services");

  return (
    <KeyboardAwareScrollView>
      <View className="p-2 space-y-2">
        <View className="bg-white p-3 rounded-xl space-y-1">
          <Text className="text-xl font-bold">Additional Services</Text>
          <View className="flex flex-col gap-2">
            <View className="bg-zinc-100 rounded-xl p-2 w-full">
              <Dropdown
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={data}
                search
                maxHeight={300}
                className="w-full"
                labelField="label"
                valueField="value"
                placeholder="Select mechanic"
                searchPlaceholder="Search..."
                //   value={item?.mechanic?._id || selectedMechanic}
                //   onChange={(mechanic) => {
                //     setSelectedMechanic(mechanic.value);
                //   }}
                //   renderLeftIcon={() => (
                //     <UserIcon style={styles.icon} size={15} color="black" />
                //   )}
                renderItem={renderServices}
              />
            </View>

            <View className="bg-red-500 p-3 rounded-xl">
              <Text className="text-white font-semibold text-center">
                Add Service
              </Text>
            </View>
          </View>
        </View>

        <View className="bg-white p-3 rounded-xl space-y-2">
          <View className="space-y-1">
            {item?.appointmentServices?.map((service, index) => (
              <View className="bg-zinc-100 p-2 rounded flex flex-row space-x-2 items-center">
                <Image
                  className="rounded"
                  style={{
                    width: 44,
                    height: 44,
                  }}
                  source={
                    service.service?.images[0]?.url
                      ? { uri: service.service?.images[0]?.url }
                      : require("../../assets/images/teampoor-default.png")
                  }
                  alt="images"
                />

                <View className="flex-1 flex-row justify-between items-center">
                  <View className="w-1/2">
                    <Text className="text-xs font-semibold">
                      {service?.service?.name}
                    </Text>

                    <Text
                      className="text-xs text-zinc-700"
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                      {service.service.description}
                    </Text>
                  </View>
                  <Text className="text-xs">
                    ₱
                    {service.service.price?.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    margin: 16,
    height: 50,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 17,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textItem: {
    flex: 1,
    fontSize: 16,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});

export default AppointmentAddService;
