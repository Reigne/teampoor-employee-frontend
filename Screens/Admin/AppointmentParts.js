import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  TextInput,
} from "react-native";
import {
  Pressable,
  Image,
  Badge,
  Select,
  VStack,
  CheckIcon,
  ScrollView,
} from "native-base";
import {
  BanknotesIcon,
  ChevronDownIcon,
  DocumentTextIcon,
  MapPinIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  TruckIcon,
  UserIcon,
  XMarkIcon,
} from "react-native-heroicons/solid";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Dropdown } from "react-native-element-dropdown";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import Toast from "react-native-toast-message";
import { Modal, Button } from "native-base";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";
const AppointmentParts = (props) => {
  const item = props.route.params;
  const navigation = useNavigation();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [productInputs, setProductInputs] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0); // State to hold the total price

  //   console.log(item, "parts");
  useEffect(() => {
    calculateTotalPrice(productInputs);
  }, [productInputs]);

  
  useEffect(() => {
    fetchProducts();

    if (item.parts) {
      setProductInputs(
        item.parts.map((part) => ({
          name: part.productName,
          id: part._id,
          quantity: part.quantity.toString(),
          price: part.price,
        }))
      );
    }

    return () => {
      setProducts([]);
    };
  }, []);

  const calculateTotalPrice = (updatedInputs) => {
    let totalPrice = 0;

    console.log(productInputs, "inputs product");

    updatedInputs.forEach((product) => {
      console.log(product.price * product.quantity, `${product.label}`);
      console.log(product.quantity, "quantity");
      totalPrice += product.price * (product.quantity || 0);
    });

    console.log(totalPrice, "total price");

    setTotalPrice(totalPrice);
  };

  const fetchProducts = () => {
    try {
      axios.get(`${baseURL}products`).then((res) => {
        // console.log(res.data);
        setProducts(res.data);
      });
    } catch (error) {
      console.error(error);
      // Handle errors, show an error toast, etc.
      Toast.show({
        topOffset: 60,
        type: "error",
        text1: "Something went wrong",
        text2: "Please try again",
      });
    }
  };

  const productData = products.map((product) => ({
    label: `${product.name}`,
    value: product._id,
    image: product.images[0]?.url || "",
    price: product.price,
    stock: product.stock,
  }));

  const handleProductChange = (product) => {
    setSelectedProduct(product);
  };

  const handleInsert = () => {
    console.log(selectedProduct);
    if (selectedProduct) {
      setProductInputs([
        ...productInputs,
        {
          name: selectedProduct.label,
          id: selectedProduct.value,
          price: selectedProduct.price,
        },
      ]);
      setSelectedProduct(null);
    }
  };

  const handleRemove = (index) => {
    setProductInputs((prevInputs) => {
      const updatedInputs = [...prevInputs];
      updatedInputs.splice(index, 1);
      calculateTotalPrice(updatedInputs); // Recalculate total price
      return updatedInputs;
    });
  };

  const handleUpdate = () => {
    // Create an object for update data
    const updateData = {
      id: item._id,
      parts: productInputs,
      serviceFee: item.totalPrice,
      partsPrice: totalPrice,
    };

    console.log(updateData, "update");

    try {
      axios
        .put(
          `${baseURL}appointments/update-appointment/${item._id}`,
          updateData
        )
        .then((res) => {
          Toast.show({
            topOffset: 60,
            type: "success",
            text1: "Additional Payment Success",
            text2: `#${item._id} Appointment has been Updated`,
          });

          navigation.navigate("AppointmentSingle", item._id);
        })
        .catch((error) =>
          Toast.show({
            topOffset: 60,
            type: "error",
            text1: "Additional Payment Error",
            text2:
              error.response.data ||
              "Something went wrong. Please try again later.",
          })
        );
    } catch (error) {
      console.log(error, "error");
      // Handle errors, show an error toast, etc.
      Toast.show({
        topOffset: 60,
        type: "error",
        text1: "Additional Payment Error",
        text2:
          error.response.data ||
          "Something went wrong. Please try again later.",
      });
    }
  };

  const renderProduct = (product) => {
    return (
      <View style={styles.item}>
        <View className="flex flex-row space-x-2">
          <Image
            className="rounded"
            style={{
              width: 24,
              height: 24,
            }}
            source={{
              uri: product?.image
                ? product?.image
                : "https://i.pinimg.com/originals/40/57/4d/40574d3020f73c3aa4b446aa76974a7f.jpg",
            }}
            alt="images"
          />
          <Text style={styles.textItem}>{product.label}</Text>
        </View>
        {/* {product.value === selectedMechanic && <CheckIcon size={3} />} */}
      </View>
    );
  };

  return (
    <KeyboardAwareScrollView className="flex-1 bg-zinc-100 p-3 space-y-3">
      <View className="bg-white p-3 rounded-xl space-y-2">
        <View>
          <Text className="font-semibold text-xl">Inspection Report</Text>
          <Text className="text-xs">Click to view the image</Text>
        </View>

        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Image
            style={{ width: 125, height: 125 }}
            source={{
              uri: item?.mechanicProof?.url
                ? item?.mechanicProof?.url
                : "https://i.pinimg.com/originals/40/57/4d/40574d3020f73c3aa4b446aa76974a7f.jpg",
            }}
            alt="images"
            resizeMode="contain"
          />
        </TouchableOpacity>
        <View>
          {/* <TouchableOpacity
            className="p-2 bg-blue-400 rounded-lg"
            onPress={() => setModalVisible(true)}
          >
            <Text className="font-semibold text-white">
              View Inspection Report
            </Text>
          </TouchableOpacity> */}
        </View>
      </View>

      <View className="bg-white p-3 rounded-xl space-y-3">
        <View className="space-y-1">
          <Text>Select Product</Text>

          <View className="flex flex-row items-center space-x-3">
            <View className="space-y-1 w-9/12">
              <View className="bg-zinc-100 rounded-xl px-2 py-1">
                <Dropdown
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={productData}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder="Search product"
                  searchPlaceholder="Search..."
                  value={selectedProduct}
                  onChange={(product) => {
                    handleProductChange(product);
                  }}
                  // renderLeftIcon={() => (
                  //   <UserIcon style={styles.icon} size={15} color="black" />
                  // )}
                  renderItem={renderProduct}
                />
              </View>
            </View>

            <View>
              <TouchableOpacity
                onPress={handleInsert}
                className="bg-blue-400 px-4 py-2 rounded-lg"
              >
                <Text className="text-white">Insert</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View>
          <View className="space-y-3">
            {productInputs?.length > 0 && (
              <View className="space-y-2">
                <View className="flex-1 flex-row">
                  <View className="px-5">
                    <Text className="text-xs"></Text>
                  </View>

                  <View className="flex-1 flex-row">
                    <Text className="text-xs w-10/12">Product</Text>
                    <Text className="text-xs">Quantity</Text>
                  </View>
                </View>
                {productInputs?.map((product, index) => (
                  <View className="flex flex-row justify-between items-center space-x-3">
                    <View className="">
                      <TouchableOpacity onPress={() => handleRemove(index)}>
                        <XMarkIcon color="red" size={18} />
                      </TouchableOpacity>
                    </View>

                    <View className="space-y-1 w-8/12">
                      <TextInput
                        className="bg-zinc-100 p-2 rounded-xl"
                        placeholder="Product Name"
                        placeholderTextColor="black"
                        value={product.name}
                        editable={false} // Make the input field readonly
                      />
                    </View>

                    <View className="space-y-1 w-auto">
                      <TextInput
                        className="bg-zinc-100 p-2 rounded-xl text-center"
                        placeholder="Quantity"
                        inputMode="numeric"
                        value={product.quantity} // Update the value to product.quantity directly
                        onChangeText={(quantity) => {
                          console.log("Quantity changed:", quantity);
                          setProductInputs((prevInputs) => {
                            const updatedInputs = [...prevInputs];
                            updatedInputs[index] = {
                              ...updatedInputs[index],
                              quantity: quantity,
                            };
                            calculateTotalPrice(updatedInputs); // Recalculate total price
                            return updatedInputs;
                          });
                        }}
                      />
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </View>

      <View className="bg-white p-3 rounded-xl space-y-3">
        <View>
          <Text className="text-lg font-semibold">Bill</Text>
          <Text className="text-xs">Billing information for customer.</Text>
        </View>

        <View className="border-b border-zinc-200" />

        <View className="space-y-1">
          <View className="flex flex-row justify-between items-center">
            <Text>Service Fee</Text>
            <Text>{item.totalPrice}</Text>
          </View>
          {/* <View className="flex flex-row justify-between items-center">
            <Text>Installation Fee</Text>
            <Text>100</Text>
          </View> */}
          <View className="flex flex-row justify-between items-center">
            <Text>Additional Parts</Text>
            <Text>{totalPrice}</Text>
          </View>
        </View>

        <View className="border-b border-zinc-200" />

        <View className="flex flex-row justify-end items-center space-x-1">
          <Text>Total Price:</Text>
          <Text>{item.totalPrice + totalPrice}</Text>
        </View>
      </View>

      <View className="space-y-2">
        <TouchableOpacity
          className="bg-blue-500 p-3 rounded-lg"
          onPress={() => handleUpdate()}
        >
          <Text className="text-white text-center">Submit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="border border-zinc-500 p-3 rounded-lg"
          onPress={() => navigation.goBack({ item: item._id })}
        >
          <Text className="text-center">Cancel</Text>
        </TouchableOpacity>
      </View>

      <Modal
        isOpen={modalVisible}
        transparent={true}
        onClose={() => setModalVisible(false)}
        backgroundColor="rgba(0, 0, 0, 0.5)"
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <Image
              style={{ width: wp("100%"), height: hp("100%") }}
              source={{
                uri: item?.mechanicProof?.url
                  ? item?.mechanicProof?.url
                  : "https://i.pinimg.com/originals/40/57/4d/40574d3020f73c3aa4b446aa76974a7f.jpg",
              }}
              alt="images"
              resizeMode="contain"
            />
          </TouchableWithoutFeedback>
        </View>
      </Modal>

      <View className="mb-5" />
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    margin: 16,
    height: 50,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 17,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textItem: {
    flex: 1,
    fontSize: 16,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});

export default AppointmentParts;
