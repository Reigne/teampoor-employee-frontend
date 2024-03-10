import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { Modal, Button, Select, CheckIcon, Badge } from "native-base";

const CustomerList = ({ item, index, deleteUser, updateRole }) => {
  const [showModal, setShowModal] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");

  let navigation = useNavigation();

  const handlePress = () => {
    // Toggle the visibility of the order list
    setIsVisible(!isVisible);
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
                  colorScheme="red"
                  onPress={() => {
                    [deleteUser(item.id), setShowModal(false)];
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
        <TouchableOpacity
          onLongPress={() => setShowModal(true)}
          onPress={() => handlePress()}
        >
          <View className="flex flex-row items-center">
            <Image
              className="rounded"
              style={{ width: 34, height: 34 }}
              source={
                item.image?.url
                  ? { uri: item.image?.url }
                  : require("../../assets/images/default-profile.jpg")
              }
              resizeMode="contain"
            />

            <Text className="w-24 ml-10">
              {item.firstname} {item.lastname}
            </Text>

            <Text className="w-40 ml-3">{item.email}</Text>
          </View>

          {isVisible && (
            <View className="mt-3">
              <Text className="font-bold">Information</Text>
              <View className="flex-row space-x-2 items-center">
                <Text>Contact #: </Text>
                <Text>{item.phone}</Text>
              </View>

              <View className="flex-row space-x-2 items-center">
                <Text>Birthday: </Text>
                <Text>{item.birthday}</Text>
              </View>

              {/* <View className="flex-row space-x-2 items-center">
                <Text>Created At: </Text>
                <Text>{item.birthday}</Text>
              </View> */}

              <View className="flex-row space-x-2 items-center mt-2">
                <Text>Role</Text>
                <Badge colorScheme="success" className="rounded">
                  <Text className="text-xs">{item.role}</Text>
                </Badge>
              </View>
              <View className="mt-3">
                <Text className="font-semibold mb-1">Change Role:</Text>
                <Select
                  shadow={2}
                  selectedValue={selectedRole || item.role} // Set the default selected value to item.role
                  minWidth="200"
                  accessibilityLabel="Choose Role"
                  placeholder="Choose Role"
                  _selectedItem={{
                    bg: "red.500",
                    endIcon: <CheckIcon size="5" color="black" />,
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
                  onValueChange={(value) => {
                    setSelectedRole(value);
                    updateRole(item.id, value);
                  }}
                >
                  <Select.Item shadow={2} label="User" value="user" />
                  <Select.Item shadow={2} label="Supplier" value="supplier" />
                  <Select.Item shadow={2} label="Secretary" value="secretary" />
                  <Select.Item shadow={2} label="Mechanic" value="mechanic" />
                  <Select.Item shadow={2} label="Admin" value="admin" />
                </Select>
              </View>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </>
  );
};

export default CustomerList;
