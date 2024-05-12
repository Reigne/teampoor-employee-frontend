import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, TextInput } from "react-native";
import { Select, VStack, CheckIcon, Badge } from "native-base";
import { useNavigation } from "@react-navigation/native";

const SupplierLogList = ({ item }) => {
  let navigation = useNavigation();
  const [isHide, setIsHide] = useState(false);

  const toggleHide = () => {
    setIsHide(!isHide);
  };
  return (
    <>
      <TouchableOpacity
        className="bg-white rounded-xl p-3 space-y-2"
        onPress={() => toggleHide()}
      >
        <View className="flex-row space-x-2">
          <Image
            className="rounded-lg"
            style={{
              width: 90,
              height: 90,
            }}
            source={
              item.supplier?.avatar?.url
                ? { uri: item.supplier?.avatar?.url }
                : require("../../assets/images/teampoor-default.png")
            }
            alt="images"
          />

          <View className="flex-1 space-y-1">
            <View className="flex flex-row justify-between items-center">
              <Text className="text-xs">Name:</Text>
              <Text className="">
                {item.supplier?.firstname} {item.supplier?.lastname}
              </Text>
            </View>
            <View className="flex flex-row justify-between items-center">
              <Text className="text-xs">Email:</Text>
              <Text className="">{item.supplier?.email}</Text>
            </View>
            <View className="flex flex-row justify-between items-center">
              <Text className="text-xs">Invoice I.D:</Text>
              <Text className="">{item.invoiceId}</Text>
            </View>
            <View className="flex flex-row justify-between items-center">
              <Text className="text-xs">Date Delivered:</Text>
              <Text className="">
                {item.dateDelivered
                  ? new Date(item.dateDelivered).toLocaleDateString("en-US", {
                      month: "long",
                      day: "2-digit",
                      year: "numeric",
                    }) + " "
                  : ""}
              </Text>
            </View>
            {/* <Text className="font-semibold">
            {item.supplier.firstname} {item.supplier.lastname}
          </Text>
          <Text className="text-xs">{item.supplier.email}</Text> */}
          </View>
        </View>

        {isHide && (
          <View className="space-y-2 bg-zinc-100 p-3 rounded-xl">
            {/* <Text className="text-xs font-semibold">Products</Text> */}

            <View className="flex flex-row items-center">
              <View className="w-8/12">
                <Text className="text-xs font-semibold">Name</Text>
              </View>
              <View className="w-2/12">
                <Text className="text-xs font-semibold">Price</Text>
              </View>
              <View className="w-2/12">
                <Text className="text-xs font-semibold">Quantity</Text>
              </View>
            </View>

            <View className="border-b border-zinc-200" />

            {item.products.map((item, index) => (
              <View key={index} className="flex flex-row">
                <View className="w-8/12">
                  <Text className="text-xs">{item.productName} ({item.brandName})</Text>
                </View>
                <View className="w-2/12">
                  <Text className="text-xs">{item.price}</Text>
                </View>
                <View className="w-2/12">
                  <Text className="text-xs">{item.quantity}</Text>
                </View>
              </View>
            ))}

            <View className="border-b border-zinc-200" />

            <View className="flex flex-row justify-end space-x-1 items-center">
              <Text className="text-xs">Grand Total:</Text>

              <Text className="font-semibold text-red-500 text-xs">
                {item.totalPrice}
              </Text>
            </View>
          </View>
        )}
      </TouchableOpacity>
    </>
  );
};

export default SupplierLogList;
