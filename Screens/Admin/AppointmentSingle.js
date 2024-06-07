import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  TextInput,
  ActivityIndicator,
} from "react-native";
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
  BanknotesIcon,
  CalendarDaysIcon,
  ChevronDownIcon,
  DocumentTextIcon,
  MapPinIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  TruckIcon,
  UserIcon,
  XMarkIcon,
} from "react-native-heroicons/solid";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Dropdown } from "react-native-element-dropdown";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import Toast from "react-native-toast-message";
import { Modal, Button } from "native-base";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const AppointmentSingle = (props) => {
  const appointmentID = props.route.params;
  // console.log(appointmentID, "item sa single");
  const navigation = useNavigation();
  // const status = props.route.params.status;

  const [item, setItem] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [value, setValue] = useState(null);
  const [status, setStatus] = useState();
  const [selectedStatus, setSelectedStatus] = useState();
  const [mechanics, setMechanics] = useState([]);
  const [selectedMechanic, setSelectedMechanic] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [productInputs, setProductInputs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [date, setDate] = useState();
  const [selectedTime, setSelectedTime] = useState(null);

  useFocusEffect(
    useCallback(() => {
      setLoading(true); // Start loading

      fetchMechanics();
      fetchProducts();
      fetchAppointment();

      return () => {
        setProducts([]);
        setMechanics([]);
        setItem();
      };
    }, [appointmentID])
  );

  const fetchAppointment = () => {
    axios
      .get(`${baseURL}appointments/${appointmentID}`)
      .then((res) => {
        setItem(res.data);
        setStatus(res.data.appointmentStatus?.pop()?.status);
        setSelectedStatus(res.data.appointmentStatus?.pop()?.status);
        setDate(res.data.appointmentDate);
      })
      .catch((error) => console.log(error))
      .finally(() => {
        setLoading(false); // Set loading state to false when fetching is completed
      });
  };

  const fetchMechanics = () => {
    axios.get(`${baseURL}users/all-mechanics`).then((res) => {
      setMechanics(res.data);
    });
  };

  const fetchProducts = () => {
    try {
      axios.get(`${baseURL}products`).then((res) => {
        // console.log(res.data);
        setProducts(res.data);
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

  const updateHandler = () => {
    try {
      axios
        .put(`${baseURL}appointments/update/${item._id}`, {
          status: selectedStatus,
        })
        .then((res) => {
          // Update the status state variable with the newly updated status
          setStatus(res.data.data.appointmentStatus?.pop()?.status);
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

  const formattedDate = new Date(date)?.toLocaleDateString(); // Format date as string

  const mechanicHandler = () => {
    if (!selectedMechanic) {
      // If no mechanic is selected, show a toast message or handle the error
      Toast.show({
        topOffset: 60,
        type: "error",
        text1: "No Mechanic Selected",
        text2: "Please select a mechanic to assign",
      });
      return;
    }

    console.log(selectedMechanic);

    try {
      axios
        .put(`${baseURL}appointments/assign-mechanic/${item._id}`, {
          mechanicId: selectedMechanic,
        })
        .then((res) => {
          // Handle the response, update UI, show success message, etc.
          console.log("Mechanic assigned successfully:", res.data);
          Toast.show({
            topOffset: 60,
            type: "success",
            text1: "Mechanic Assigned",
            text2: `Mechanic assigned successfully to Appointment #${item._id}`,
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

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setDate(date);
    // console.warn("A date has been picked: ", date);
    hideDatePicker();
  };

  const timeOptions = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
  ];

  const renderTimeButton = (time, selected) => (
    <TouchableOpacity
      key={time}
      onPress={() => handleTimePress(time)}
      style={{
        backgroundColor: selected ? "#ef4444" : "white",
        padding: 5,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#ef4444",
        margin: 5,
        alignItems: "center",
      }}
    >
      <Text style={{ color: selected ? "white" : "#ef4444" }}>{time}</Text>
    </TouchableOpacity>
  );

  const handleTimePress = (time) => {
    setSelectedTime(time);
  };

  const updateDateHandler = () => {
    if (!date || !selectedTime) {
      // Display a toast message for empty fields
      Toast.show({
        topOffset: 60,
        type: "error",
        text1: "Please select a date and time",
        text2: "Date and time are required for updating",
      });
      return; // Stop execution if fields are empty
    }

    try {
      axios
        .put(`${baseURL}appointments/update-date/${item._id}`, {
          date,
          timeSlot: selectedTime,
        })
        .then((res) => {
          // Handle the response, update UI, show success message, etc.
          console.log("Mechanic assigned successfully:", res.data);
          Toast.show({
            topOffset: 60,
            type: "success",
            text1: "Successfully Change Date",
            text2: `Appointment #${item._id} has been changed date`,
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

  console.log("mechanic", item?.mechanic);

  return (
    <>
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="red" />
        </View>
      ) : (
        <KeyboardAwareScrollView
          className="flex-1 bg-zinc-100 p-3 pb-5 rounded-xl space-y-2"
          extraScrollHeight={10}
        >
          <View className="bg-white p-2 rounded-xl flex flex-row space-x-2">
            <Image
              className="rounded"
              style={{
                width: 64,
                height: 64,
              }}
              source={
                item?.user?.avatar?.url
                  ? { uri: item?.user?.avatar?.url }
                  : require("../../assets/images/teampoor-default.png")
              }
              alt="images"
            />

            <View>
              <Text className="font-semibold text-base">{item?.fullname}</Text>

              <View className="flex flex-row space-x-2">
                <Text className="text-xs text-zinc-700">Email:</Text>
                <Text className="text-xs">{item?.user?.email}</Text>
              </View>

              <View className="flex flex-row space-x-2">
                <Text className="text-xs text-zinc-700">Contact:</Text>
                <Text className="text-xs">{item?.phone}</Text>
              </View>
            </View>
          </View>

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
                    : status === "BACKJOBPENDING"
                    ? "bg-yellow-200 px-2 rounded"
                    : status === "BACKJOBCONFIRMED"
                    ? "bg-blue-200 px-2 rounded"
                    : status === "BACKJOBCOMPLETED"
                    ? "bg-green-200 px-2 rounded"
                    : status === "DONE"
                    ? "bg-green-200 px-2 rounded"
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
                      : status === "BACKJOBPENDING"
                      ? "text text-yellow-800"
                      : status === "BACKJOBCONFIRMED"
                      ? "text text-blue-800"
                      : status === "BACKJOBCOMPLETED"
                      ? "text text-green-800"
                      : status === "DONE"
                      ? "text text-green-800"
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
                {item?.appointmentDate
                  ? new Date(item?.appointmentDate).toLocaleDateString(
                      "en-US",
                      {
                        month: "long",
                        day: "2-digit",
                        year: "numeric",
                      }
                    ) + " "
                  : ""}{" "}
                - {item?.timeSlot}
              </Text>
            </View>

            <View className="flex flex-row space-x-2 justify-between items-center">
              <Text className="text-zinc-700">Type:</Text>
              <Text className="font-semibold">{item?.serviceType}</Text>
            </View>

            <View className="flex flex-row justify-between items-center">
              {/* <Text className="text-xs text-zinc-700">#{item._id}</Text> */}
            </View>
          </View>

          {item?.backJob ? (
            <View className="bg-white rounded-xl p-2 space-y-2">
              <View>
                <Text>Backjob Request</Text>
              </View>

              <View>
                <View className="flex-1 flex-row justify-between items-center">
                  <Text className="text-xs text-zinc-700">Comment</Text>
                  <Text className="text-xs text-zinc-700">
                    {item?.backJob?.createdAt
                      ? new Date(item?.backJob?.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "long",
                            day: "2-digit",
                            year: "numeric",
                          }
                        )
                      : ""}
                  </Text>
                </View>
                <Text>{item?.backJob?.comment}</Text>
              </View>
            </View>
          ) : null}

          <View className="bg-white p-2 rounded-xl space-y-2">
            <View>
              <Text className="font-semibold">Update Status</Text>
              <Text className="text-xs text-zinc-700">
                Update appointment status here.
              </Text>
            </View>

            <View>
              <Select
                selectedValue={selectedStatus}
                onValueChange={(itemValue) => setSelectedStatus(itemValue)}
                // minWidth={200}
                accessibilityLabel="Select Appointment Status"
                placeholder="Select Appointment Status"
                _selectedItem={{
                  bg: "red.500",
                  endIcon: <CheckIcon size="5" color="red" />,
                }}
                _light={{
                  bg: "white",
                  _hover: {
                    bg: "coolGray.200",
                  },
                  _focus: {
                    bg: "coolGray.200:alpha.70",
                  },
                }}
              >
                {/* <Select.Item label="Pending" value="Pending" /> */}
                <Select.Item label="Pending" value="PENDING" />
                <Select.Item label="Confirmed" value="CONFIRMED" />
                <Select.Item label="Service in Progress" value="INPROGRESS" />
                <Select.Item label="Service Completed" value="COMPLETED" />
                <Select.Item label="Appointment Cancelled" value="CANCELLED" />
                <Select.Item
                  label="Appointment Rescheduled"
                  value="RESCHEDULED"
                />
                <Select.Item label="Appointment Delayed" value="DELAYED" />
                <Select.Item label="No Show" value="NOSHOW" />
                <Select.Item
                  label="Confirm Back Job"
                  value="BACKJOBCONFIRMED"
                />
                <Select.Item
                  label="Complete Back Job"
                  value="BACKJOBCOMPLETED"
                />
                {/* <Select.Item label="Payment Pending" value="Payment Pending" />
          <Select.Item label="Payment Received" value="Payment Received" /> */}
              </Select>
            </View>

            <View className="flex flex-row-reverse">
              <TouchableOpacity
                className="bg-green-500 px-7 py-2 rounded-lg"
                onPress={() => updateHandler()}
              >
                <Text className="text-white">Update</Text>
              </TouchableOpacity>
            </View>
          </View>

          {(status === "BACKJOBCONFIRMED" || status === "RESCHEDULED") && (
            <View className="bg-white p-2 rounded-lg space-y-2">
              <View>
                <Text className="font-semibold">Select Date: </Text>
                {/* <Text className="text-xs">Choose date.</Text> */}
              </View>

              <View>
                <TouchableOpacity
                  onPress={showDatePicker}
                  className="p-2 bg-gray-100 text-gray-700 rounded-lg mb-1 flex-row items-center space-x-2"
                >
                  <CalendarDaysIcon color="grey" size={20} />
                  <TextInput
                    value={formattedDate}
                    placeholder="Select date"
                    editable={false}
                    className="text-black"
                  />
                </TouchableOpacity>

                <DateTimePickerModal
                  isVisible={isDatePickerVisible}
                  mode="date"
                  onConfirm={handleConfirm}
                  onCancel={hideDatePicker}
                />
              </View>

              <View className="flex flex-row flex-wrap">
                {timeOptions.map((time) =>
                  renderTimeButton(time, time === selectedTime)
                )}
              </View>

              <TouchableOpacity
                className="bg-green-500 p-2 rounded-lg justify-center items-center"
                onPress={() => updateDateHandler()}
              >
                <Text className="text-white">Change Date</Text>
              </TouchableOpacity>
            </View>
          )}

          {item?.serviceType === "Home Service" && (
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
                  {item?.region}, {item?.province}, {item?.city},{" "}
                  {item?.barangay},{item?.postalcode}
                </Text>
              </View>
            </View>
          )}

          {status != "PENDING" && (
            <View className="bg-white p-2 rounded-xl space-y-2">
              <View>
                <Text className="font-semibold">Assign Mechanic</Text>
                <Text className="text-xs text-zinc-700">
                  Select the mechanic who will handle this appointment.
                </Text>
              </View>
              <View className="bg-zinc-100 rounded-xl p-2">
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
                  placeholder="Select mechanic"
                  searchPlaceholder="Search..."
                  value={item?.mechanic?._id || selectedMechanic}
                  onChange={(mechanic) => {
                    setSelectedMechanic(mechanic.value);
                  }}
                  renderLeftIcon={() => (
                    <UserIcon style={styles.icon} size={15} color="black" />
                  )}
                  renderItem={renderMechanicItem}
                />
              </View>

              <View className="flex-row-reverse">
                <TouchableOpacity
                  className="bg-blue-400 px-7 py-2 rounded-lg"
                  onPress={() => mechanicHandler()}
                >
                  <Text className="text-white">Assign</Text>
                </TouchableOpacity>
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
                  <Text className="font-semibold">{item?.brand}</Text>
                </View>

                {/* <View className="flex flex-row space-x-2 justify-between items-center">
                  <Text className="text-zinc-700">Model:</Text>
                  <Text className="font-semibold">{item?.model}</Text>
                </View> */}

                <View className="flex flex-row space-x-2 justify-between items-center">
                  <Text className="text-zinc-700">Year Model:</Text>
                  <Text className="font-semibold">{item?.year}</Text>
                </View>

                <View className="flex flex-row space-x-2 justify-between items-center">
                  <Text className="text-zinc-700">Plate Number:</Text>
                  <Text className="font-semibold">{item?.plateNumber}</Text>
                </View>

                <View className="flex flex-row space-x-2 justify-between items-center">
                  <Text className="text-zinc-700">Engine Number:</Text>
                  <Text className="font-semibold">{item?.engineNumber}</Text>
                </View>

                <View className="flex flex-row space-x-2 justify-between items-center">
                  <Text className="text-zinc-700">Type of Fuel:</Text>
                  <Text className="font-semibold">{item?.fuel}</Text>
                </View>

                <View className="flex flex-row space-x-2 justify-between items-center">
                  <Text className="text-zinc-700">Vehicle Category:</Text>
                  <Text className="font-semibold">{item?.type}</Text>
                </View>
              </View>
            </View>

            <View className="border-b border-zinc-200" />

            <View>
              <Text className="font-semibold">Selected Services</Text>
            </View>

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

            <View className="flex flex-col items-end justify-end">
              <Text className="text-xs">Total Price:</Text>
              <Text className="text-red-500 font-semibold">
                ₱
                {item?.totalPrice?.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Text>
            </View>

            <View>
              <TouchableOpacity
                className="p-3 bg-green-500 rounded-lg block"
                onPress={() =>
                  navigation.navigate("AppointmentAddService", item)
                }
              >
                <Text className="text-center text-white font-semibold">
                  Add additional service
                </Text>
              </TouchableOpacity>
            </View>
            {/* list of services */}
          </View>

          <View className="bg-white p-3 rounded-xl space-y-2">
            <View>
              <Text className="font-semibold text-lg">Inspection Report</Text>
              <Text className="text-xs">Motorcycle Inspection Report.</Text>
            </View>
            {item?.mechanicProof ? (
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Image
                  style={{ width: 125, height: 125 }}
                  source={
                    item?.mechanicProof?.url
                      ? { uri: item?.mechanicProof?.url }
                      : require("../../assets/images/teampoor-default.png")
                  }
                  alt="images"
                  resizeMode="contain"
                />
              </TouchableOpacity>
            ) : (
              <View className="p-2">
                <Text className="text-xs text-center text-red-400">
                  The inspection report has not been uploaded yet
                </Text>
              </View>
            )}

            <View></View>
          </View>

          <View className="bg-white p-3 rounded-xl space-y-2 mb-5">
            <View>
              <Text className="font-semibold text-lg">Additional Parts</Text>
              <Text className="text-xs">
                List of additional parts for motorcycle.
              </Text>
            </View>

            <View className="border-b border-zinc-200" />

            {item?.parts ? (
              <View className="space-y-2">
                <View className="space-y-1">
                  <View>
                    <View className="flex flex-row justify-around items-center">
                      <Text className="w-1/3 font-semibold">Product</Text>
                      <Text className="w-1/3 text-center font-semibold">
                        Quantity
                      </Text>
                      <View className="w-1/3 items-end">
                        <Text className="font-semibold">Price</Text>
                      </View>
                    </View>
                  </View>

                  <View className="bg-zinc-100 p-2 rounded-lg space-y-2">
                    {item?.parts?.map((part, index) => (
                      <View>
                        <View className="flex flex-row justify-between items-center">
                          <Text className="w-1/3">
                            {part.productName} ({part.brandName})
                          </Text>
                          <Text className="w-1/3 text-center">
                            {part.quantity}
                          </Text>

                          <View className="w-1/3 items-end">
                            <Text>{part.price}</Text>
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>

                <View className="flex flex-row justify-end items-center space-x-1">
                  <Text className="text">Total Price:</Text>
                  <Text className="text-red-500 font-semibold">
                    {item?.totalPartPrice}
                  </Text>
                </View>
              </View>
            ) : (
              <View>
                <Text className="text-xs text-zinc-500 text-center">
                  No additional parts
                </Text>
              </View>
            )}

            <View className="border-b border-zinc-200" />

            {/* <View className="border-b border-zinc-200" /> */}

            <TouchableOpacity
              className="p-3 bg-blue-400 rounded-xl"
              onPress={() => navigation.navigate("AppointmentParts", item)}
            >
              <Text className="font-semibold text-center text-white">
                Add Additional Parts
              </Text>
            </TouchableOpacity>
          </View>

          <Modal
            isOpen={modalVisible}
            transparent={true}
            onClose={() => setModalVisible(false)}
            backgroundColor="rgba(0, 0, 0, 0.5)"
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                <Image
                  style={{ width: wp("100%"), height: hp("100%") }}
                  source={
                    item?.mechanicProof?.url
                      ? { uri: item?.mechanicProof?.url }
                      : require("../../assets/images/teampoor-default.png")
                  }
                  alt="images"
                  resizeMode="contain"
                />
              </TouchableWithoutFeedback>
            </View>
          </Modal>
        </KeyboardAwareScrollView>
      )}
    </>
  );
};

export default AppointmentSingle;

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
