import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

const ProductStockLogsList = ({ item }) => {
  const [isHide, setIsHide] = useState(false);

  const toggleHide = () => {
    setIsHide(!isHide);
  };

  const createdAtDate = new Date(item.createdAt);

  // Format the date
  const formattedDate = createdAtDate.toLocaleString("en-US", {
    month: "long", // Full month name (e.g., January)
    day: "2-digit", // Day with leading zeros (e.g., 18)
    year: "numeric", // Full year (e.g., 2024)
    hour: "numeric", // Hour (e.g., 1)
    minute: "2-digit", // Minute with leading zeros (e.g., 00)
    hour12: true, // 12-hour format (true) or 24-hour format (false)
  });

  return (
    <>
      <TouchableOpacity className="p-5" onPress={() => toggleHide()}>
        <View className="flex flex-row justify-between">
          <View className="flex-1 justify-start">
            <Text className="font-semibold">{item.name}</Text>
          </View>
          <View className="flex-1 justify-center items-start">
            <Text className={item.quantity < 0 ? "font-semibold text-red-500" : "font-semibold text-green-600"}>{item.quantity}</Text>
          </View>
          <View className="flex-1 justify-center items-start">
            {/* <Text className="font-semibold">{item.status}</Text> */}
            {item.status === "Sold" ? (
              <View className="px-3 rounded-full bg-red-100">
                <Text className="text-red-900">{item.status}</Text>
              </View>
            ) : (
              <View className="px-3 rounded-full bg-green-100">
                <Text className="text-green-900">{item.status}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>

      {isHide && (
        <View className="px-5 mb-5 space-y-3">
          <View className="border-t border-zinc-300" />
          <View className="bg-zinc-100 p-2 rounded-lg">
            <View className="flex-row space-x-2 justify-between">
              <Text className="text-zinc-600">By:</Text>
              <Text className="font-semibold">{item.by}</Text>
            </View>
            <View className="flex-row space-x-2 justify-between">
              <Text className="text-zinc-600">Created At:</Text>
              <Text className="font-semibold">{formattedDate}</Text>
            </View>
          </View>
        </View>
      )}
    </>
  );
};

export default ProductStockLogsList;
