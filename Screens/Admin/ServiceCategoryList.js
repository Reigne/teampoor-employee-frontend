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

const ServiceCategoryList = ({ item, index, deleteServiceCategory }) => {
  const [showModal, setShowModal] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  let navigation = useNavigation();

  const handleDelete = (id) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 2000, // Adjust the duration as needed
      useNativeDriver: false,
    }).start(() => {
        deleteServiceCategory(id);
    });
  };

  return (
    <>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content maxWidth="300px">
          <Modal.CloseButton />
          <Modal.Body>
            <View className="flex flex-row justify-center">
              <Button.Group space={2}>
                <Button
                  colorScheme="green"
                  onPress={() => [
                    navigation.navigate("ServiceCategoryForm", { item }),
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
          showModal === true ? "p-4 border-2 border-red-500 rounded" : "p-4"
        }
      >
        <TouchableOpacity
          onLongPress={() => setShowModal(true)}
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
            <View className="">
              <View className="flex flex-row gap-8">
                {/* {console.log("listItem images", item.images)} */}
                <View className="w-1/4 justify-center items-center">
                  <Image
                    className="rounded"
                    style={{
                      width: 34,
                      height: 34,
                    }}
                    source={
                      item.image.url
                        ? { uri: item.image.url }
                        : require("../../assets/images/teampoor-default.png")
                    }
                    resizeMode="contain"
                  />
                </View>

                <View className="w-1/6 justify-center items-start grow ">
                  <Text className="ml-2" numberOfLines={2} ellipsizeMode="tail">
                    {item.name}
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

export default ServiceCategoryList;
