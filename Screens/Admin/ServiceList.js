import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import { Modal, Button } from "native-base";

const ServiceList = ({ item, index, deleteService }) => {
  const [showModal, setShowModal] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  let navigation = useNavigation();

  const handleDelete = (id) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 2000, // Adjust the duration as needed
      useNativeDriver: false,
    }).start(() => {
      deleteService(id);
    });
  };
  return (
    <>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content maxWidth="300px">
          {/* <Modal.CloseButton /> */}
          <Modal.Body>
            <View>
              <Button.Group space={2} className="flex flex-col justify-center gap-2">
                <Button
                  colorScheme="green"
                  onPress={() => [
                    navigation.navigate("ServiceForm", { item }),
                    setShowModal(false),
                  ]}
                >
                  <Text className="font-bold text-white">Edit</Text>
                </Button>
                <Button
                  colorScheme="red"
                  onPress={() => {
                    [setShowModal(false), handleDelete(item._id)];
                  }}
                >
                  <Text className="font-bold text-white">Delete</Text>
                </Button>
              </Button.Group>
            </View>
          </Modal.Body>
        </Modal.Content>
      </Modal>

      <View
        className={
          showModal === true ? "p-4 border-2 border-red-500 bg-white rounded-xl" : "p-4 bg-white rounded-xl"
        }
      >
        <TouchableOpacity
          onLongPress={() => setShowModal(true)}
          className="px-5"
        >
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [
                {
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-10, 0],
                  }),
                },
              ],
            }}
          >
            <View className="px-5">
              <View className="flex flex-row justify-center gap-8">
                {/* {console.log("listItem images", item.images)} */}
                <View className="w-1/5 justify-center items-center">
                  <Image
                    className="rounded"
                    style={{
                      width: 34,
                      height: 34,
                    }}
                    source={
                      item.images.length > 0
                        ? { uri: item.images[0].url }
                        : require("../../assets/images/teampoor-default.png")
                    }
                    resizeMode="contain"
                  />
                </View>

                <View className="w-1/4 justify-center items-center">
                  <Text className="" numberOfLines={2} ellipsizeMode="tail">
                    {item.name}
                  </Text>
                </View>

                <View className="w-1/4 justify-center items-center">
                  <Text className="" numberOfLines={1} ellipsizeMode="tail">
                    {parseFloat(item.price).toLocaleString("en-US", {
                      style: "currency",
                      currency: "PHP",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Text>
                </View>

                <View className="w-1/5 justify-center items-center">
                  <Text className="" numberOfLines={1} ellipsizeMode="tail">
                    {item.isAvailable === false ? "No" : "Yes"}
                  </Text>
                </View>
              </View>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default ServiceList;
