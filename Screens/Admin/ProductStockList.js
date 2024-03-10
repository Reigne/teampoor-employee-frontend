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

const ProductStockList = ({ item, index, deleteProduct }) => {
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
            <View className="space-y-2">
              <Text className="font-semibold text-base">{item.name}</Text>
              <View>
                <Button.Group
                  space={2}
                  className="flex flex-col justify-center space-y-3"
                >
                  <Button
                    colorScheme="blue"
                    onPress={() => [
                      navigation.navigate("ProductStockForm", { item }),
                      setShowModal(false),
                    ]}
                  >
                    <Text className="font-bold text-white">Update Stock</Text>
                  </Button>
                </Button.Group>
              </View>
            </View>
          </Modal.Body>
        </Modal.Content>
      </Modal>

      <View
        className={
          showModal === true ? "p-4 border-2 border-red-500 rounded" : "p-4 bg-white rounded-xl"
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
            <View className="flex flex-row justify-between gap-5">
              <View className="flex-1 justify-center items-start">
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

              <View className="flex-1 justify-center items-start">
                <Text className="" numberOfLines={2} ellipsizeMode="tail">
                  {item.name}
                </Text>
              </View>

              <View className="flex-1 justify-center items-end">
                <Text className="" numberOfLines={1} ellipsizeMode="tail">
                  {item.stock}
                </Text>
              </View>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default ProductStockList;
