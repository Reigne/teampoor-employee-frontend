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
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Searchbar } from "react-native-paper";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
  const [selectedService, setSelectedService] = useState("");
  const [errors, setErrors] = useState({});
  const [appointment, setAppointment] = useState([]);

  const appointmentId = item._id;

  useFocusEffect(
    useCallback(() => {
      fetchService();
      fetchAppointment();

      return () => {
        setServices([]);
        setAppointment([]);
        setLoading(false);
      };
    }, [])
  );

  const fetchService = () => {
    axios.get(`${baseURL}services`).then((res) => {
      setServices(res.data);
      setLoading(false);
    });
  };

  const fetchAppointment = () => {
    axios
      .get(`${baseURL}appointments/${appointmentId}`)
      .then((res) => {
        setAppointment(res.data);
      })
      .catch((error) => console.log(error))
      .finally(() => {
        setLoading(false); // Set loading state to false when fetching is completed
      });
  };

  const data = services.map((service) => ({
    label: `${service.name}`,
    value: service._id,
    image: service.images[0]?.url || "",
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

  const validateForm = () => {
    let errors = {};

    if (!selectedService) errors.selectedService = "Please choose service.";

    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const submitHandler = () => {
    if (!validateForm()) {
      return;
    }

    const data = {
      id: selectedService,
    };

    console.log(appointmentId, "appointmentId");

    try {
      axios
        .put(`${baseURL}appointments/add-service/${appointmentId}`, data)
        .then((res) => {
          fetchAppointment();

          Toast.show({
            topOffset: 60,
            type: "success",
            text1: "Successfully Added",
            text2: `Added new service`,
          });
        })
        .catch((error) => {
          console.error("Error:", error);
          Toast.show({
            topOffset: 60,
            type: "error",
            text1: "Additional Service Error",
            text2:
              error.response?.data ||
              "Something went wrong. Please try again later.",
          });
        });
    } catch (error) {
      console.log("Catch Error:", error);
      Toast.show({
        topOffset: 60,
        type: "error",
        text1: "Additional Payment Error",
        text2:
          error.response?.data ||
          "Something went wrong. Please try again later.",
      });
    }
  };

  const deleteHandler = (id) => {
    try {
      axios
        .delete(`${baseURL}appointments/delete-service/${appointmentId}`, {
          data: { id },
        })
        .then((res) => {
          fetchAppointment();

          Toast.show({
            topOffset: 60,
            type: "success",
            text1: "Successfully Deleted",
            text2: `Service Deleted`,
          });
        })
        .catch((error) => {
          console.error("Error:", error);
          Toast.show({
            topOffset: 60,
            type: "error",
            text1: "Delete Service Error",
            text2:
              error.response?.data ||
              "Something went wrong. Please try again later.",
          });
        });
    } catch (error) {
      console.log("Catch Error:", error);
      Toast.show({
        topOffset: 60,
        type: "error",
        text1: "Delete Service Error",
        text2:
          error.response?.data ||
          "Something went wrong. Please try again later.",
      });
    }
  };

  console.log(selectedService, "selectedService");

  return (
    <KeyboardAwareScrollView>
      <View className="p-2 space-y-2">
        <View className="bg-white p-3 rounded-xl space-y-1">
          <Text className="text-xl font-bold">Additional Services</Text>
          <View className="flex flex-col gap-2">
            <View>
              <View
                className={
                  errors.selectedService
                    ? "border border-red-500 bg-zinc-100 rounded-xl p-2 w-full"
                    : "bg-zinc-100 rounded-xl p-2 w-full"
                }
              >
                <Dropdown
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={data}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder="Select service"
                  searchPlaceholder="Search..."
                  value={selectedService}
                  onChange={(service) => {
                    setSelectedService(service.value);
                  }}
                  renderItem={renderServices}
                />
              </View>
              {errors.selectedService ? (
                <Text className="text-sm text-red-500">
                  {errors.selectedService}
                </Text>
              ) : null}
            </View>

            <TouchableOpacity
              className="bg-red-500 p-3 rounded-xl"
              onPress={() => submitHandler()}
            >
              <Text className="text-white font-semibold text-center">
                Add Service
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="bg-white p-3 rounded-xl space-y-2">
          <View className="space-y-1">
            {appointment?.appointmentServices?.map((service, index) => (
              <View className="bg-zinc-100 p-2 rounded flex flex-row space-x-2 items-start">
                <Image
                  className="rounded"
                  style={{
                    width: 80,
                    height: 80,
                  }}
                  source={
                    service?.service?.images[0]?.url
                      ? { uri: service.service?.images[0]?.url }
                      : require("../../assets/images/teampoor-default.png")
                  }
                  alt="images"
                />

                <View className="flex-1 flex-row justify-between items-start">
                  <View className="w-1/2">
                    <Text className="text-xs font-semibold">
                      {service?.service?.name}
                    </Text>

                    <Text
                      className="text-xs text-zinc-700"
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                      {service?.service?.description}
                    </Text>
                  </View>
                  <Text className="text-xs">
                    ₱
                    {service?.service?.price?.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Text>

                  {/* <Text>X</Text> */}
                  <View>
                    <XMarkIcon
                      color="red"
                      size={18}
                      onPress={() => deleteHandler(service._id)}
                    />
                  </View>
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
