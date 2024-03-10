import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Select, VStack, CheckIcon, Badge } from "native-base";

import { useNavigation } from "@react-navigation/native";

import { Modal, Button } from "native-base";

const EmployeeList = ({ item, index, deleteUser, updateRole }) => {
  const [showModal, setShowModal] = useState(false);
  const [isOrderListVisible, setOrderListVisible] = useState(false);
  const [selectRole, setSelectRole] = useState("");

  const handlePress = () => {
    // Toggle the visibility of the order list
    setOrderListVisible(!isOrderListVisible);
  };

  let navigation = useNavigation();

  console.log(item, "brand item");
  return (
    <View>
      <View className="bg-white p-3 px-6">
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

        <TouchableOpacity
          onLongPress={() => setShowModal(true)}
          onPress={handlePress}
        >
          <View className="flex flex-row items-center">
            <View className="w-16">
              <Image
                className="rounded"
                style={{ width: 34, height: 34 }}
                source={
                  item.avatar
                    ? { uri: item.avatar?.url }
                    : require("../../assets/images/default-profile.jpg")
                }
                resizeMode="contain"
              />
            </View>

            <Text className="w-24">{item.firstname}</Text>

            <Text className="w-28">{item.lastname}</Text>

            <View className="justify-center w-24">
              <Badge
                className="rounded-lg"
                colorScheme={
                  item.role === "admin"
                    ? "coolGray"
                    : item.role === "secretary"
                    ? "success"
                    : item.role === "mechanic"
                    ? "info"
                    : ""
                }
              >
                {item.role}
              </Badge>
            </View>
          </View>
        </TouchableOpacity>
      </View>
      {isOrderListVisible && (
        <View className="p-3 px-6 bg-slate-200">
          <Text className="font-bold">Account Details</Text>
          <View className="flex-row mt-1 items-center">
            <Text className="font-semibold ">Email: </Text>
            <Text className="">{item.email}</Text>
          </View>
          <View className="flex-row mt-1 items-center">
            <Text className="font-semibold ">Contact #: </Text>
            <Text className="">{item.phone}</Text>
          </View>
          <View className="mt-3">
            <Text className="font-semibold mb-1">Change Role:</Text>
            <Select
              shadow={2}
              selectedValue={selectRole || item.role} // Set the default selected value to item.role
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
                setSelectRole(value);
                updateRole(item.id, value);
              }}
            >
              <Select.Item shadow={2} label="Admin" value="admin" />
              <Select.Item shadow={2} label="Secretary" value="secretary" />
              <Select.Item shadow={2} label="Mechanic" value="mechanic" />
            </Select>
          </View>
        </View>
      )}
    </View>
  );
};

export default EmployeeList;
