import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableHighLight,
  TouchableOpacity,
  Dimensions,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import { Modal, FormControl, Input, Button } from "native-base";

var { width } = Dimensions.get("window");

const ListItem = ({ item, index, deleteProduct }) => {
  const [showModal, setShowModal] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  let navigation = useNavigation();

  const handleDelete = (id) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 2000, // Adjust the duration as needed
      useNativeDriver: false,
    }).start(() => {
      deleteProduct(id);
    });
  };
  return (
    <>
      {/* <Button onPress={() => setShowModal(true)}>Button</Button> */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.CloseButton />
        <Modal.Content maxWidth="300px">
          <Modal.Body>
            <View>
              <Button.Group
                space={2}
                className="flex flex-col justify-center space-y-3"
              >
                <Button
                  colorScheme="green"
                  onPress={() => [
                    navigation.navigate("ProductForm", { item }),
                    setShowModal(false),
                  ]}
                >
                  <Text className="font-bold text-white">Edit Details</Text>
                </Button>
                {/* <Button
                  colorScheme="blue"
                  onPress={() => [
                    navigation.navigate("ProductStockForm", { item }),
                    setShowModal(false),
                  ]}
                >
                  <Text className="font-bold text-white">Update Stock</Text>
                </Button> */}
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
          showModal === true
            ? "p-4 border-2 border-red-500 bg-white rounded-xl"
            : "p-4 bg-white rounded-xl"
        }
      >
        <TouchableOpacity onLongPress={() => setShowModal(true)}>
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
            <View className="flex flex-row justify-between">
              {/* {console.log("listItem images", item.images)} */}
              <View className="w-1/6 justify-center items-center">
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

              <View className="w-1/5 justify-center items-start">
                <Text className="" numberOfLines={3} ellipsizeMode="tail">
                  {item.name}
                </Text>
              </View>

              <View className="w-1/6 justify-center items-start">
                <Text className="" numberOfLines={3} ellipsizeMode="tail">
                  {!item.brand ? "" : <>{item.brand.name}</>}
                </Text>
              </View>

              <View className="w-1/6 justify-center items-center">
                <Text className="" numberOfLines={1} ellipsizeMode="tail">
                  ₱{item.price?.toLocaleString()}
                </Text>
              </View>
              {/* <View className="w-1/6 justify-center items-center">
                <Text className="" numberOfLines={1} ellipsizeMode="tail">
                  {item.stock}
                </Text>
              </View> */}
            </View>
          </Animated.View>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default ListItem;
