import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableHighLight,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import { Modal, FormControl, Input, Button } from "native-base";

const CategoryList = ({ item, index, deleteCategory }) => {
  const [showModal, setShowModal] = useState(false);

  let navigation = useNavigation();

  console.log(item, "category item");
  return (
    <View
      className={
        showModal === true
          ? "p-4 border-2 border-red-500 bg-white rounded-xl"
          : "p-4 bg-white rounded-xl"
      }
    >
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content maxWidth="300px">
          {/* <Modal.CloseButton /> */}
          <Modal.Body>
            <View >
              <Button.Group space={2} className="flex flex-col justify-center gap-2">
                <Button
                  colorScheme="green"
                  onPress={() => [
                    navigation.navigate("CategoryForm", { item }),
                    setShowModal(false),
                  ]}
                >
                  <Text className="font-bold text-white">Edit</Text>
                </Button>
                <Button
                  colorScheme="red"
                  onPress={() => {
                    [deleteCategory(item.id), setShowModal(false)];
                  }}
                >
                  <Text className="font-bold text-white">Delete</Text>
                </Button>
              </Button.Group>
            </View>
          </Modal.Body>
        </Modal.Content>
      </Modal>

      <TouchableOpacity onLongPress={() => setShowModal(true)}>
        <View className="flex flex-row gap-16 items-center">
          <Image
            className="rounded"
            style={{ width: 50, height: 50 }}
            source={
              item.image.url
                ? { uri: item.image.url }
                : require("../../assets/images/teampoor-default.png")
            }
            resizeMode="contain"
          />

          <Text className="">{item.name}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default CategoryList;
