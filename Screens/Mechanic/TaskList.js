import React, { useEffect, useState, memo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
  Pressable,
  Image,
  Badge,
  Select,
  VStack,
  CheckIcon,
} from "native-base";
import {
  BanknotesIcon,
  ChevronDownIcon,
  DocumentTextIcon,
  MapPinIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  TruckIcon,
} from "react-native-heroicons/solid";
import { useNavigation } from "@react-navigation/native";

const TaskList = ({ item }) => {
  let navigation = useNavigation();

  const [status, setStatus] = useState(item.appointmentStatus?.pop()?.status);

  const items = {
    status,
    item,
  };

  console.log("items", items);
  // console.log(selectedStatus, "status");

  //   console.log(item.appointmentService, "services");
  return (
    <TouchableOpacity
      className="bg-zinc-100 p-3 rounded-xl space-y-2"
      onPress={() => navigation.navigate("TaskSingle", items)}
    >
      <View className="flex flex-row justify-between items-center">
        {/* <Text className="text-xs text-zinc-700">#{item._id}</Text> */}
        <Text className="text-xs text-zinc-700">{item.serviceType}</Text>

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
                : status === "Pending"
                ? "bg-yellow-200 px-2 rounded"
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
                  : status === "Pending"
                  ? "text text-yellow-800"
                  : ""
              }
            >
              {status}
            </Text>
          </View>
      </View>

      <View className="flex flex-row space-x-2">
        <Image
          className="rounded"
          style={{
            width: 74,
            height: 74,
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

          <View className="flex flex-row space-x-2">
            <Text className="text-xs text-zinc-700">Appointment:</Text>
            <Text className="text-xs">
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
        </View>
      </View>

      <View className="p-2 bg-zinc-200 rounded-lg space-y-2">
        {item.appointmentServices.map((service, index) => (
          <View className="flex flex-row space-x-2 items-center">
            <Image
              className="rounded"
              style={{
                width: 24,
                height: 24,
              }}
              source={{
                uri: service.service.images[0]?.url
                  ? service.service.images[0]?.url
                  : "https://i.pinimg.com/originals/40/57/4d/40574d3020f73c3aa4b446aa76974a7f.jpg",
              }}
              alt="images"
            />

            <Text className="text-xs">{service.service.name}</Text>
          </View>
        ))}
      </View>

      {/* <View className="bg-zinc-200 p-2 rounded-xl space-y-3">
        <View className="flex flex-row-reverse ">
          <View className="flex flex-row space-x-1 items-center">
            <Text className="text-xs text-zinc-500">Show</Text>
            <ChevronDownIcon color="#71717a" size={14} />
          </View>
        </View>

        {item.serviceType === "Home Service" && (
          <View className="">
            <Text className="text-zinc-700 text-xs">Home Address: </Text>
            <Text className="font-semibold text-xs">
              {item.region}, {item.province}, {item.city}, {item.barangay},
              {item.postalcode}
            </Text>
          </View>
        )}

        <View>
          <Text className="font-bold text-xs">Motorcycle: </Text>

          <View className="flex flex-row space-x-2">
            <Text className="text-zinc-700 text-xs">Brand:</Text>
            <Text className="font-semibold text-xs">{item.brand}</Text>
          </View>

          <View className="flex flex-row space-x-2">
            <Text className="text-zinc-700 text-xs">Model:</Text>
            <Text className="font-semibold text-xs">{item.model}</Text>
          </View>

          <View className="flex flex-row space-x-2">
            <Text className="text-zinc-700 text-xs">Year:</Text>
            <Text className="font-semibold text-xs">{item.year}</Text>
          </View>

          <View className="flex flex-row space-x-2">
            <Text className="text-zinc-700 text-xs">Plate Number:</Text>
            <Text className="font-semibold text-xs">{item.plateNumber}</Text>
          </View>

          <View className="flex flex-row space-x-2">
            <Text className="text-zinc-700 text-xs">Engine Number:</Text>
            <Text className="font-semibold text-xs">{item.engineNumber}</Text>
          </View>

          <View className="flex flex-row space-x-2">
            <Text className="text-zinc-700 text-xs">Type:</Text>
            <Text className="font-semibold text-xs">{item.type}</Text>
          </View>
        </View>
      </View> */}

      {/* <View className="flex flex-row space-x-2 justify-end">
        <TouchableOpacity className="bg-green-400 px-3 py-1 rounded-lg">
          <Text className="text-white">Accept</Text>
        </TouchableOpacity>

        <TouchableOpacity className="border border-red-500 px-3 py-1 rounded-lg">
          <Text className="text-red-500">Cancel</Text>
        </TouchableOpacity>
      </View> */}
    </TouchableOpacity>
  );
};

export default memo(TaskList);
