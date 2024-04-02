import React, { useEffect, useState, memo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
  Pressable,
  Image,
  Badge,
  Select,
  VStack,
  CheckIcon,
} from "native-base";
import {
  BanknotesIcon,
  DocumentTextIcon,
  MapPinIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  TruckIcon,
} from "react-native-heroicons/solid";

const OrderList = ({ item, updateStatus }) => {
  const [isOrderListVisible, setOrderListVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(
    item.orderStatus?.pop()?.status
  );

  const [statusText, setStatusText] = useState(item.orderStatus?.pop()?.status);
  // console.log(selectedStatus, "item.id");

  const handlePress = () => {
    // Toggle the visibility of the order list
    setOrderListVisible(!isOrderListVisible);
  };

  return (
    <View className="mt-3 bg-white rounded-lg">
      <Pressable
        onPress={handlePress}
        _pressed={{
          bg: "coolGray.100",
        }}
      >
        {({ isPressed }) => (
          <View
            style={{
              transform: [{ scale: isPressed ? 0.96 : 1 }],
            }}
            className="bg-white rounded-lg"
          >
            <View className="flex flex-row items-center">
              <View className="p-4 items-center w-28 ">
                <TruckIcon size="38" color="gray" />
                <View className="items-center justify-center">
                  <Badge
                    colorScheme={
                      selectedStatus === "Pending"
                        ? "info"
                        : selectedStatus === "TOPAY"
                        ? "info"
                        : selectedStatus === "TOSHIP"
                        ? "info"
                        : selectedStatus === "PAID"
                        ? "success"
                        : selectedStatus === "TORECEIVED"
                        ? "info"
                        : selectedStatus === "FAILEDATTEMPT"
                        ? "warning"
                        : selectedStatus === "CANCELLED"
                        ? "danger"
                        : selectedStatus === "RETURNED"
                        ? "danger"
                        : selectedStatus === "DELIVERED"
                        ? "success"
                        : selectedStatus === "COMPLETED"
                        ? "success"
                        : "No Status"
                    }
                    className="rounded mt-2"
                  >
                    {selectedStatus === "Pending"
                      ? "Pending"
                      : selectedStatus === "TOPAY"
                      ? "To Pay"
                      : selectedStatus === "TOSHIP"
                      ? "To Ship"
                      : selectedStatus === "PAID"
                      ? "Paid"
                      : selectedStatus === "TORECEIVED"
                      ? "Out for Delivery"
                      : selectedStatus === "FAILEDATTEMPT"
                      ? "Failed Attempt"
                      : selectedStatus === "CANCELLED"
                      ? "Cancelled"
                      : selectedStatus === "RETURNED"
                      ? "Returned"
                      : selectedStatus === "DELIVERED"
                      ? "Received"
                      : selectedStatus === "COMPLETED"
                      ? "Completed"
                      : "No Status"}
                    {console.log(item)}
                  </Badge>
                  {/* <Text className="mt-2 text-gray-500">{item.status}</Text> */}
                </View>
              </View>

              <View className="py-4 w-72">
                <View className="flex-row ">
                  <Text className="font-bold">Full Name: </Text>
                  <Text>{item.fullname}</Text>
                </View>

                <View className="flex-row mt-1">
                  <Text className="font-bold">Order: #</Text>
                  <Text>{item._id}</Text>
                </View>

                <View className="flex">
                  <View className="flex-row mt-1">
                    <Text className="font-bold">Date Ordered: </Text>
                    <Text>
                      {item.dateOrdered
                        ? new Date(item.dateOrdered).toLocaleDateString(
                            "en-US",
                            {
                              month: "numeric",
                              day: "numeric",
                              year: "numeric",
                            }
                          ) +
                          " " +
                          new Date(item.dateOrdered).toLocaleTimeString(
                            "en-US",
                            {
                              hour: "numeric",
                              minute: "numeric",
                              hour12: true,
                            }
                          )
                        : ""}
                    </Text>
                  </View>
                  {item.dateReceived ? (
                    <View className="flex-row mt-1">
                      <Text className="font-bold">Date Received: </Text>
                      <Text>
                        {item.dateReceived
                          ? new Date(item.dateReceived).toLocaleDateString(
                              "en-US",
                              {
                                month: "numeric",
                                day: "numeric",
                                year: "numeric",
                              }
                            ) +
                            " " +
                            new Date(item.dateReceived).toLocaleTimeString(
                              "en-US",
                              {
                                hour: "numeric",
                                minute: "numeric",
                                hour12: true,
                              }
                            )
                          : ""}
                      </Text>
                    </View>
                  ) : null}
                </View>
              </View>
            </View>
          </View>
        )}
      </Pressable>

      {isOrderListVisible && (
        <View className="p-4 bg-white">
          <View className="">
            <View className="flex-row">
              <MapPinIcon color="gray" size="18" />
              <Text className="font-bold mb-2"> Delivery Address</Text>
            </View>
            <View className="bg-zinc-100 mb-2 rounded-lg p-2">
              <Text className="mb-1">{item.fullname}</Text>
              <Text className="mb-1">{item.phone}</Text>
              <Text className="mb-1">{item.address}</Text>
              <View className="flex-row w-68">
                <Text className="mb-1">
                  {item.region}, {item.province}, {item.city}, {item.barangay},{" "}
                  {item.postalcode}
                </Text>
              </View>
            </View>

            <View className="flex-row mt-2">
              <BanknotesIcon color="gray" size="18" />
              <Text className="font-semibold mb-2"> Payment</Text>
            </View>
            <View className="bg-zinc-100 mb-2 rounded-lg p-2">
              <Text className="">Payment Method:</Text>
              <View className="flex-row gap-1">
                <Text>{item.paymentMethod}</Text>
                {item.eWallet ? <Text>({item.eWallet})</Text> : null}
              </View>
            </View>

            <View className="flex-row mt-2">
              <DocumentTextIcon color="gray" size="18" />
              <Text className="font-bold mb-2"> Order List: </Text>
            </View>
            <View>
              {item.orderItems.map((orderItem, index) => (
                <>
                  {orderItem.product ? (
                    <>
                      <View
                        key={index}
                        className="bg-zinc-100 mb-2 rounded-lg p-2"
                      >
                        <View className="flex flex-row gap-5 justify-center items-center">
                          <View className="w-8">
                            <Image
                              className="rounded mb-1"
                              style={{
                                width: 34,
                                height: 34,
                              }}
                              source={{
                                uri: orderItem.product.images[0]?.url
                                  ? orderItem.product.images[0]?.url
                                  : "https://i.pinimg.com/originals/40/57/4d/40574d3020f73c3aa4b446aa76974a7f.jpg",
                              }}
                              alt="images"
                            />
                          </View>
                          <View className="w-44">
                            <View className="flex-row">
                              <Text className="font-semibold">
                                {orderItem.product.name}
                              </Text>
                              <Text> x{orderItem.quantity}</Text>
                            </View>
                            <Text>₱{orderItem.product.price}</Text>
                          </View>
                          <View className="flex-row justify-end w-24">
                            <Text className="font-semibold">Total: </Text>
                            <Text>
                              ₱
                              {(
                                orderItem.quantity * orderItem.product.price
                              ).toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </>
                  ) : (
                    <View className="bg-zinc-100 mb-2 rounded-lg p-2 justify-center items-center">
                      <Text>Product is no longer available</Text>
                    </View>
                  )}
                </>
              ))}
            </View>
            <View className="flex-row-reverse">
              <View className="flex-row">
                <Text className="font-semibold">Grand Total: </Text>
                <Text className="text-red-500">
                  ₱
                  {item.totalPrice?.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Text>
              </View>
            </View>
          </View>

          <View className="mt-3">
            <View className="flex-row">
              <ShoppingCartIcon color="gray" size="18" />
              <Text className="font-bold mb-2"> Order Status: </Text>
            </View>
            <Select
              selectedValue={selectedStatus}
              onValueChange={(itemValue) => setSelectedStatus(itemValue)}
              minWidth={200}
              accessibilityLabel="Select Order Status"
              placeholder="Select Order Status"
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
            >
              {/* <Select.Item label="Pending" value="Pending" /> */}
              <Select.Item label="To Pay" value="TOPAY" />
              <Select.Item label="To Ship" value="TOSHIP" />
              <Select.Item label="Out for Delivery" value="TORECEIVED" />
              <Select.Item
                label="Unsuccessful Delivery Attempt"
                value="FAILEDATTEMPT"
              />
              <Select.Item
                label="Delivery Missed - Order Returned"
                value="RETURNED"
              />
              <Select.Item label="Cancel Order" value="CANCELLED" />
              <Select.Item label="Successful Delivery" value="DELIVERED" />
            </Select>
            <TouchableOpacity
              className="bg-red-500 justify-center items-center p-3 rounded-lg mt-3"
              onPress={() => updateStatus(item._id, selectedStatus)}
            >
              <Text className="text-white">Update Status</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default memo(OrderList);
