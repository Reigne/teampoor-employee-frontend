import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, TextInput } from "react-native";
import { Select, VStack, CheckIcon, Badge } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { Modal, Button } from "native-base";
import { Rating, AirbnbRating } from "react-native-ratings";

const FeedbackList = ({ item }) => {
  let navigation = useNavigation();

  return (
    <View className="bg-white rounded-xl p-3">
      <View className="space-y-3">
        <View className="space-y-1">
          <View className="flex flex-row items-start space-x-2">
            <Image
              className="rounded-lg"
              style={{
                width: 90,
                height: 90,
              }}
              source={
                item.mechanic?.avatar?.url
                  ? { uri: item.mechanic?.avatar?.url }
                  : require("../../assets/images/teampoor-default.png")
              }
              alt="images"
            />

            <View className="flex-1">
              <View className="flex-row justify-between items-center">
                <Text className="text-xs text-zinc-500">Mechanic Name</Text>
                <Text className="">
                  {item.mechanic.firstname} {item.mechanic.lastname}
                </Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-xs text-zinc-500">Email</Text>
                <Text className="">{item.mechanic.email}</Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-xs text-zinc-500">Mobile Number</Text>
                <Text className="">{item.mechanic.phone}</Text>
              </View>
            </View>
          </View>
        </View>

        <View className="space-y-1">
          {item.appointment?.appointmentServices?.map((service, index) => (
            <View className="bg-zinc-100 px-2 py-1 rounded-lg" key={index}>
              <Text className="text-xs">{`\u2022 ${service.service.name}`}</Text>
            </View>
          ))}
        </View>
        <View className="border-b border-zinc-100" />

        <View className="space-y-1">
          <Text className="text-xs">Comment</Text>

          <View className="flex flex-row space-x-2">
            <View className="w-10">
              <Image
                className="rounded-lg"
                style={{
                  width: 40,
                  height: 40,
                }}
                source={
                  item.customer?.avatar?.url
                    ? { uri: item.customer?.avatar?.url }
                    : require("../../assets/images/teampoor-default.png")
                }
                alt="images"
              />
            </View>

            <View className="w-5/6 space-y-1">
              <View className="flex-1 flex-row justify-between items-center">
                <Text className="text-xs font-semibold">{item.name}</Text>
                <Text className="text-xs font-semibold">
                  {item?.createdAt
                    ? new Date(item?.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "2-digit",
                        year: "numeric",
                      }) + " "
                    : null}
                </Text>
              </View>

              <View className="flex flex-row">
                <Rating
                  type="star"
                  startingValue={item.ratings}
                  imageSize={12}
                  ratingCount={5}
                  readonly
                />
              </View>

              <View>
                <Text>{item.comment}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default FeedbackList;
