import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  TextInput,
  FlatList,
} from "react-native";
import { Select, ZStack, VStack, Box, Switch, Stack, Radio } from "native-base";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import baseURL from "../../assets/common/baseUrl";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import mime from "mime";
import { CameraIcon } from "react-native-heroicons/solid";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import CheckIcon from "react-native-heroicons/solid";
import { CloseIcon } from "react-native-heroicons/solid"; // Import the CloseIcon component
import { ActivityIndicator, MD2Colors } from "react-native-paper";
import AuthGlobal from "../../Context/Store/AuthGlobal";

const ProductStockForm = (props) => {
  const [stock, setStock] = useState(0);
  const [images, setImages] = useState([]);
  const [token, setToken] = useState();
  const [errors, setErrors] = useState({});
  const [item, setItem] = useState();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState();

  const context = useContext(AuthGlobal);

  let navigation = useNavigation();

  useEffect(() => {
    setItem(props.route.params.item);
    setImages(props.route.params.item.images);

    AsyncStorage.getItem("jwt")
      .then((res) => {
        setToken(res);
      })
      .catch((error) => console.log(error));

    return () => {};
  }, []);

  console.log(context.stateUser.user.userId, "asdasdqweqweas");

  const validateForm = () => {
    let errors = {};

    if (!stock) errors.stock = "Stock is required";

    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const addProduct = () => {
    if (!validateForm()) {
      return;
    }

    let formData = new FormData();

    formData.append("stock", stock);
    formData.append("user", context.stateUser.user.userId);

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .put(`${baseURL}products/stock/${item.id}`, formData, config)
      .then((res) => {
        if (res.status == 200 || res.status == 201) {
          Toast.show({
            topOffset: 60,
            type: "success",
            text1: "Product stock successfuly updated",
            text2: "",
          });

          setTimeout(() => {
            navigation.navigate("ProductStocks");
          }, 500);

          setLoading(false);
        }
      })
      .catch((error) => {
        Toast.show({
          topOffset: 60,
          type: "error",
          text1: "Something went wrong",
          text2: "Update Product Stock Form",
        });
        console.log(error);

        setLoading(false);
      });
  };

  return (
    <KeyboardAwareScrollView className="flex-1 bg-white">
      <View className="">
        <View className="flex-1 justify-start bg-red-500 ">
          <View className="flex flex-row justify-center mt-5">
            <View className="flex justify-center items-center">
              <FlatList
                data={images}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <>
                    {console.log(item, "each item")}
                    <Image
                      source={
                        item.url
                          ? { uri: item.url }
                          : item.uri
                          ? { uri: item.uri }
                          : require("../../assets/images/teampoor-default.png")
                      }
                      style={{ width: 200, height: 200, margin: 5 }}
                      className=""
                    />
                  </>
                )}
                horizontal
              />
            </View>
          </View>

          <View
            className="flex-1 bg-white mt-5"
            style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50 }}
          >
            <View className="form space-y-3 p-6 mt-5">
              <View>
                <Text className="font-bold text-2xl">Update Stock</Text>

                {/* <Text className="text-zinc-600">Update product stock below.</Text> */}
              </View>
              {/* <Text>Product Name</Text>
              <TextInput
                className={
                  errors.name
                    ? "border border-red-500 p-4 bg-gray-100 text-gray-700 rounded-2xl mb-1"
                    : "p-4 bg-gray-100 text-gray-700 rounded-2xl mb-1"
                }
                placeholder="Enter product name"
                name="name"
                id="name"
                value={name}
                editable={false}
              ></TextInput>
              <View className="space-y-0">
                {errors.name ? (
                  <Text className="text-sm text-red-500">{errors.name}</Text>
                ) : null}
              </View> */}

              <Text>Stock *</Text>
              <TextInput
                className={
                  errors.stock
                    ? "border border-red-500 p-4 bg-gray-100 text-gray-700 rounded-2xl"
                    : "p-4 bg-gray-100 text-gray-700 rounded-2xl"
                }
                placeholder="Enter product stock"
                name="stock"
                id="stock"
                value={stock}
                keyboardType={"numeric"}
                onChangeText={(text) => setStock(text)}
              ></TextInput>

              <View className="">
                {errors.stock ? (
                  <Text className="text-sm text-red-500">{errors.stock}</Text>
                ) : null}
              </View>
            </View>
            <View className="px-4 mb-4">
              <TouchableOpacity
                // className="bg-red-500 py-4 rounded-2xl items-center"
                className={
                  loading
                    ? "bg-red-500 py-4 rounded-2xl items-center"
                    : "bg-red-500 py-4 rounded-2xl items-center"
                }
                onPress={() => {
                  setLoading(true); // Set loading to true when the button is pressed
                  addProduct(); // Trigger the addProduct function
                }}
                disabled={loading ? true : false}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {loading ? (
                    <View className="flex-row gap-3 items-center justify-center">
                      <Text className="font-xl font-bold text-center text-white">
                        Please wait...
                      </Text>
                      <ActivityIndicator animating={true} color="white" />
                    </View>
                  ) : (
                    <Text className="font-xl font-bold text-center text-white ">
                      {!props.route.params
                        ? "Create Product"
                        : "Update Product"}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
              <TouchableOpacity className="border border-zinc-700 py-4 rounded-2xl items-center mt-4">
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text className="font-xl font-bold text-center text-zinc-700">
                    Cancel
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default ProductStockForm;
