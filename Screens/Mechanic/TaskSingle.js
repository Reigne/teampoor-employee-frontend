import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {
  Pressable,
  Image,
  Badge,
  Select,
  VStack,
  CheckIcon,
  ScrollView,
} from "native-base";
import {
  ArrowDownTrayIcon,
  BanknotesIcon,
  ChevronDownIcon,
  DocumentTextIcon,
  MapPinIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  TruckIcon,
  UserIcon,
} from "react-native-heroicons/solid";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Dropdown } from "react-native-element-dropdown";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import Toast from "react-native-toast-message";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons/faCircle";
import mime from "mime";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TaskSingle = (props) => {
  const item = props.route.params.item;
  // const status = props.route.params.status;
  const [value, setValue] = useState(null);
  const [status, setStatus] = useState(props.route.params.status || "");
  const [selectedStatus, setSelectedStatus] = useState(status);
  const [mechanics, setMechanics] = useState([]);
  const [selectedMechanic, setSelectedMechanic] = useState(null);
  const [checklist, setChecklist] = useState();
  const [image, setImage] = useState("");
  const [errors, setErrors] = useState({});
  const [token, setToken] = useState();

  console.log("Route Params:", props.route.params);
  console.log("Item Data:", item);

  useEffect(() => {
    axios.get(`${baseURL}users/all-mechanics`).then((res) => {
      setMechanics(res.data);
    });

    AsyncStorage.getItem("jwt")
      .then((res) => {
        setToken(res);
      })
      .catch((error) => console.log(error));

    (async () => {
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();

        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();

    setSelectedMechanic(item.mechanic);
  }, []);

  console.log(mechanics);

  const pickProofImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: false,
      // selectionLimit: 2,
    });
    if (!result.canceled) {
      console.log(result.assets);
      setImage(result.assets[0].uri);
    }

    // console.log(imgMotorcycle);
  };

  const validateForm = () => {
    let errors = {};

    if (image.length === 0)
      errors.image = "You need to upload the inspection report";

    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const updateHandler = () => {
    if (!validateForm()) {
      // setLoading(false);
      return;
    }

    let formData = new FormData();

    formData.append("status", "DONE");

    if (image) {
      const newImageUri = "file:///" + image.split("file:/").join("");

      formData.append("image", {
        uri: newImageUri,
        type: mime.getType(newImageUri),
        name: newImageUri.split("/").pop(),
      });
    }

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      axios
        .put(
          `${baseURL}appointments/mechanic-update/${item._id}`,
          formData,
          config
        )
        .then((res) => {
          // Update the status state variable with the newly updated status
          setStatus(res.data.appointmentStatus?.pop()?.status);
          Toast.show({
            topOffset: 60,
            type: "success",
            text1: "Appointment Status Updated",
            text2: `#${item._id} Appointment has been Updated`,
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

  const data = mechanics.map((mechanic) => ({
    label: `${mechanic.firstname} ${mechanic.lastname}`,
    value: mechanic._id, // Assuming _id is the unique identifier for mechanics
    avatar: mechanic.avatar?.url || "", // Assuming _id is the unique identifier for mechanics
  }));

  const renderMechanicItem = (mechanic) => {
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
              uri: mechanic.avatar
                ? mechanic.avatar
                : "https://i.pinimg.com/originals/40/57/4d/40574d3020f73c3aa4b446aa76974a7f.jpg",
            }}
            alt="images"
          />
          <Text style={styles.textItem}>{mechanic.label}</Text>
        </View>
        {mechanic.value === selectedMechanic && <CheckIcon size={3} />}
      </View>
    );
  };

  return (
    <KeyboardAwareScrollView
      className="bg-zinc-100 p-3 pb-5 rounded-xl space-y-2"
      extraScrollHeight={10}
    >
      <View className="bg-white rounded-xl p-2 space-y-2">
        <View className="flex flex-row space-x-2 justify-between items-center">
          <Text className="text-zinc-700">Status:</Text>
          <View
            className={
              status === "PENDING"
                ? "bg-yellow-200 px-2 rounded"
                : status === "CONFIRMED"
                ? "bg-green-200 px-2 rounded"
                : status === "INPROGRESS"
                ? "bg-blue-200 px-2 rounded"
                : status === "COMPLETED"
                ? "bg-green-200 px-2 rounded"
                : status === "CANCELLED"
                ? "bg-red-200 px-2 rounded"
                : status === "RESCHEDULED"
                ? "bg-purple-200 px-2 rounded"
                : status === "DELAYED"
                ? "bg-yellow-200 px-2 rounded"
                : status === "NOSHOW"
                ? "bg-red-200 px-2 rounded"
                : "bg-zinc-200 px-2 rounded"
            }
          >
            <Text
              className={
                status === "PENDING"
                  ? "text text-yellow-800"
                  : status === "CONFIRMED"
                  ? "text text-green-800"
                  : status === "INPROGRESS"
                  ? "text text-blue-800"
                  : status === "COMPLETED"
                  ? "text text-green-800"
                  : status === "CANCELLED"
                  ? "text text-red-800"
                  : status === "RESCHEDULED"
                  ? "text text-purple-800"
                  : status === "DELAYED"
                  ? "text text-yellow-800"
                  : status === "NOSHOW"
                  ? "text text-red-800"
                  : ""
              }
            >
              {status}
            </Text>
          </View>
        </View>

        <View className="flex flex-row space-x-2 justify-between items-center">
          <Text className="text-zinc-700">Date:</Text>
          <Text className="font-semibold">
            {item.appointmentDate
              ? new Date(item.appointmentDate).toLocaleDateString("en-US", {
                  month: "long",
                  day: "2-digit",
                  year: "numeric",
                }) + " "
              : ""}{" "}
            - {item.timeSlot}
          </Text>
        </View>

        <View className="flex flex-row space-x-2 justify-between items-center">
          <Text className="text-zinc-700">Type:</Text>
          <Text className="font-semibold">{item.serviceType}</Text>
        </View>

        <View className="flex flex-row justify-between items-center">
          {/* <Text className="text-xs text-zinc-700">#{item._id}</Text> */}
        </View>
      </View>

      <View className="bg-white p-2 rounded-xl flex flex-row space-x-2">
        <Image
          className="rounded"
          style={{
            width: 64,
            height: 64,
          }}
          source={{
            uri: item.user.avatar.url
              ? item.user.avatar.url
              : "https://i.pinimg.com/originals/40/57/4d/40574d3020f73c3aa4b446aa76974a7f.jpg",
          }}
          alt="images"
        />

        <View>
          <Text className="font-semibold text-base">{item.fullname}</Text>

          <View className="flex flex-row space-x-2">
            <Text className="text-xs text-zinc-700">Email:</Text>
            <Text className="text-xs">{item.user.email}</Text>
          </View>

          <View className="flex flex-row space-x-2">
            <Text className="text-xs text-zinc-700">Contact:</Text>
            <Text className="text-xs">{item.phone}</Text>
          </View>
        </View>
      </View>

      {item.serviceType === "Home Service" && (
        <View className="bg-white p-2 rounded-lg space-y-2">
          <View>
            <Text className="font-semibold">Customer Address: </Text>
            {/* <Text className="text-xs text-zinc-700">
              Customer address details.
            </Text> */}
          </View>

          <View>
            <Text className="text-xs font-semibold">Address:</Text>
            <Text className="text-xs">
              {item.region}, {item.province}, {item.city}, {item.barangay},
              {item.postalcode}
            </Text>
          </View>
        </View>
      )}

      <View className="bg-white p-2 rounded-lg space-y-2">
        <View className="bg-white rounded-xl space-y-3">
          <View className="space-y-2">
            <View>
              <Text className="font-bold text-base">Motorcycle: </Text>
              <Text className="text-xs text-zinc-700">
                Customer motorcycle details.
              </Text>
            </View>

            <View className="border-b border-zinc-200" />

            <View className="flex flex-row space-x-2 justify-between items-center">
              <Text className="text-zinc-700">Brand:</Text>
              <Text className="font-semibold">{item.brand}</Text>
            </View>

            <View className="flex flex-row space-x-2 justify-between items-center">
              <Text className="text-zinc-700">Model:</Text>
              <Text className="font-semibold">{item.model}</Text>
            </View>

            <View className="flex flex-row space-x-2 justify-between items-center">
              <Text className="text-zinc-700">Year:</Text>
              <Text className="font-semibold">{item.year}</Text>
            </View>

            <View className="flex flex-row space-x-2 justify-between items-center">
              <Text className="text-zinc-700">Plate Number:</Text>
              <Text className="font-semibold">{item.plateNumber}</Text>
            </View>

            <View className="flex flex-row space-x-2 justify-between items-center">
              <Text className="text-zinc-700">Engine Number:</Text>
              <Text className="font-semibold">{item.engineNumber}</Text>
            </View>

            <View className="flex flex-row space-x-2 justify-between items-center">
              <Text className="text-zinc-700">Type:</Text>
              <Text className="font-semibold">{item.type}</Text>
            </View>
          </View>
        </View>

        <View className="border-b border-zinc-200" />

        <View>
          <Text className="font-semibold">Selected Services</Text>
        </View>

        {item.appointmentService.map((service, index) => (
          <View className="bg-zinc-100 p-2 rounded flex flex-row space-x-2 items-center">
            <Image
              className="rounded"
              style={{
                width: 44,
                height: 44,
              }}
              source={{
                uri: service.service.images[0]?.url
                  ? service.service.images[0]?.url
                  : "https://i.pinimg.com/originals/40/57/4d/40574d3020f73c3aa4b446aa76974a7f.jpg",
              }}
              alt="images"
            />

            <View className="flex-1 flex-row justify-between items-center">
              <View className="w-1/2">
                <Text className="text-xs font-semibold">
                  {service.service.name}
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

        <View className="flex flex-col items-end justify-end">
          <Text className="text-xs">Total Price:</Text>
          <Text className="text-red-500 font-semibold">
            ₱
            {item.totalPrice?.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Text>
        </View>
      </View>

      {/* <View className="bg-white p-2 rounded-lg space-y-2">
        <View className="space-y-1">
          <Text className="font-semibold">Motorcycle Inspection Report</Text>

          <View className="flex flex-row space-x-1 items-center">
            <FontAwesomeIcon icon={faCircle} color="#09090b" size={12} />
            <Text className="text-xs">Not Applicable</Text>
          </View>

          <View className="flex flex-row space-x-1 items-center">
            <FontAwesomeIcon icon={faCircle} color="#22c55e" size={12} />
            <Text className="text-xs">In Good Condition</Text>
          </View>

          <View className="flex flex-row space-x-1 items-center">
            <FontAwesomeIcon icon={faCircle} color="#fbbf24" size={12} />
            <Text className="text-xs">Will need attention soon</Text>
          </View>

          <View className="flex flex-row space-x-1 items-center">
            <FontAwesomeIcon icon={faCircle} color="#f87171" size={12} />
            <Text className="text-xs">Needs immediate attention</Text>
          </View>
        </View>

        <View className="border-b border-zinc-200" />

        <View>
          <View>
            <Text className="font-semibold">Tires:</Text>
            <Text className="text-xs ">Check the air pressure</Text>
          </View>

          <View>
            
          </View>
        </View>
      </View> */}

      <View className="bg-white p-2 rounded-lg space-y-2">
        <View>
          <Text className="text-xs">Upload the inspection report *</Text>
        </View>

        {image.length > 0 && (
          <View>
            <Image
              source={
                image[0].uri
                  ? { uri: image[0].uri }
                  : require("../../assets/images/teampoor-default.png")
              }
              style={{ width: 100, height: 100, margin: 1 }}
              resizeMode="contain"
            />
          </View>
        )}

        <View>
          <TouchableOpacity
            className={
              errors.image
                ? "p-8 border border-red-500 rounded-2xl justify-center items-center space-y-3"
                : "p-8 border-2 border-gray-100 rounded-2xl justify-center items-center space-y-3"
            }
            onPress={pickProofImage}
          >
            <ArrowDownTrayIcon color="#374151" size={24} />
            <Text className="text-gray-700">Browse image to upload</Text>
          </TouchableOpacity>
          <View>
            {errors.image ? (
              <Text className="text-sm text-red-500">{errors.image}</Text>
            ) : null}
          </View>
        </View>

        {status === "INPROGRESS" && (
          <TouchableOpacity
            className="bg-red-500 rounded-xl p-4"
            onPress={() => updateHandler()}
          >
            <Text className="text-white font-semibold text-center">Done</Text>
          </TouchableOpacity>
        )}
      </View>

      <View className="pb-4" />
    </KeyboardAwareScrollView>
  );
};

export default TaskSingle;

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
