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

const ProductForm = (props) => {
  const [pickerValueType, setPickerValueType] = useState("");
  const [pickerValueCategory, setPickerValueCategory] = useState("");
  const [pickerValueBrand, setPickerValueBrand] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [brandList, setBrandList] = useState([]);
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState(0);
  const [price, setPrice] = useState(0);
  const [images, setImages] = useState([]);
  const [mainImage, setMainImage] = useState();
  const [isWarranty, setIsWarranty] = useState(false); // Change the initial state to false (no warranty)
  const [isChanged, setIsChanged] = useState(false);
  const [token, setToken] = useState();
  const [errors, setErrors] = useState({});
  const [item, setItem] = useState();
  const [loading, setLoading] = useState(false);

  let navigation = useNavigation();

  const context = useContext(AuthGlobal);

  useEffect(() => {
    if (!props.route.params) {
      setItem(null);
    } else {
      setItem(props.route.params.item);
      setName(props.route.params.item.name);
      setType(props.route.params.item.type);
      setPickerValueType(props.route.params.item.type || "");
      setBrand(props.route.params.item.brand?.id || ""); // Add the optional chaining operator here
      setPickerValueBrand(props.route.params.item.brand?.id || ""); // Add the optional chaining operator here
      setCategory(props.route.params.item.category?.id || ""); // Add the optional chaining operator here
      setPickerValueCategory(props.route.params.item.category?.id || ""); // Add the optional chaining operator here
      setDescription(props.route.params.item.description);
      setStock(props.route.params.item.stock.toString());
      setPrice(props.route.params.item.price.toString());
      setImages(props.route.params.item.images);
      setMainImage(props.route.params.item.images);
      setIsWarranty(props.route.params.item.isWarranty);
    }

    console.log(setMainImage, "Main image");

    AsyncStorage.getItem("jwt")
      .then((res) => {
        setToken(res);
      })
      .catch((error) => console.log(error));

    axios
      .get(`${baseURL}categories`)
      .then((res) => setCategories(res.data))
      .catch((error) => alert("Error to load categories!"));

    axios
      .get(`${baseURL}brands`)
      .then((res) => setBrandList(res.data))
      .catch((error) => alert("Error to load brands"));

    (async () => {
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();

        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();

    return () => {
      setBrandList([]);
      setCategories([]);
    };
  }, []);

  const pickImages = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      // allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true, // Enable multiple image selection
      selectionLimit: 10,
    });

    if (result.canceled) {
      // Handle cancellation
      return;
    }

    if (result.assets && result.assets.length > 0) {
      // Use result.assets instead of result.uri
      const images = result.assets.map((asset) => ({
        uri: asset.uri,
        // Add other properties as needed
      }));

      // console.log(
      //   "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      //   images
      // );

      setImages(images);
      setIsChanged(true);
    }
  };

  // Function to remove an image by index
  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const validateForm = () => {
    let errors = {};

    if (!name) errors.name = "Name is required";
    if (!price) errors.price = "Price is required";
    if (!description) errors.description = "Description is required";
    if (!type) errors.type = "Type is required";
    if (!brand) errors.brand = "Brand is required";
    if (!category) errors.category = "Category is required";
    if (!stock) errors.stock = "Stock is required";

    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const addProduct = () => {
    // if (
    //   name == "" ||
    //   price == "" ||
    //   description == "" ||
    //   type == "" ||
    //   brand == "" ||
    //   category == "" ||
    //   stock == "" ||
    //   isWarranty == ""
    // ) {
    //   setError("Please fill in the form correctly");
    // }

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    let formData = new FormData();

    formData.append("name", name);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("type", type);
    formData.append("brand", brand);
    formData.append("category", category);
    formData.append("stock", stock);
    formData.append("isWarranty", isWarranty);
    formData.append("user", context.stateUser.user.userId)

    console.log(images, "images");

    if (isChanged === true) {
      images.forEach((image, index) => {
        // formData.append(`images[${index}]`, image);
        console.log(image.uri, "image");
        const newImageUri = "file:///" + image.uri.split("file:/").join("");

        formData.append("images", {
          uri: newImageUri,
          type: mime.getType(newImageUri),
          name: newImageUri.split("/").pop(),
        });
      });

      formData.append("isNewImage", true);
    } else {
      formData.append("isNewImage", false);
    }

    // console.log(mainImage, "main image");
    // console.log(image, "image");

    // // Append each image to the formData
    // images.forEach((image, index) => {
    //   const newImageUri = "file:///" + image.uri.split("file:/").join("");
    //   formData.append(`images${index}`, {
    //     uri: newImageUri,
    //     type: mime.getType(newImageUri),
    //     name: newImageUri.split("/").pop(),
    //   });
    // });

    // // Append the main image if it is different from the images array
    // if (mainImage && !images.find((image) => image.uri === mainImage)) {
    //   const newImageUri = "file:///" + mainImage.split("file:/").join("");
    //   formData.append("images", {
    //     uri: newImageUri,
    //     type: mime.getType(newImageUri),
    //     name: newImageUri.split("/").pop(),
    //   });
    // }

    console.log(formData, "formData log");

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    if (item !== null) {
      console.log(item);

      axios
        .put(`${baseURL}products/${item.id}`, formData, config)
        .then((res) => {
          if (res.status == 200 || res.status == 201) {
            Toast.show({
              topOffset: 60,
              type: "success",
              text1: "Product successfuly updated",
              text2: "",
            });

            setTimeout(() => {
              navigation.navigate("Products");
            }, 500);

            setLoading(false);
          }
        })
        .catch((error) => {
          Toast.show({
            topOffset: 60,
            type: "error",
            text1: "Something went wrong",
            text2: "Update Product Form",
          });
          console.log(error);

          setLoading(false);
        });
    } else {
      axios
        .post(`${baseURL}products`, formData, config)
        .then((res) => {
          if (res.status == 200 || res.status == 201) {
            Toast.show({
              topOffset: 60,
              type: "success",
              text1: "New Product Added",
              text2: "Successfuly",
            });
            setTimeout(() => {
              navigation.navigate("Products");
            }, 500);

            setLoading(false);
          }
        })
        .catch((error) => {
          console.log(error);
          Toast.show({
            topOffset: 60,
            type: "error",
            text1: "Something went wrong",
            text2: "Create Product Form",
          });

          setLoading(false);
        });
    }
  };

  return (
    <KeyboardAwareScrollView className="flex-1 bg-white">
      <View className="">
        <View className="flex-1 justify-start bg-red-500 ">
          <View className="flex flex-row justify-center mt-5">
            {/* <Image
                source={
                  mainImage
                    ? { uri: mainImage }
                    : require("../../assets/images/teampoor-default.png")
                }
                style={{ width: 200, height: 200 }}
                className="rounded-full"
              /> */}
            {images.length > 0 ? (
              <View className="flex justify-center items-center">
                {console.log(images, "images")}
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

                <TouchableOpacity onPress={pickImages}>
                  <View className="bg-white p-3 rounded-lg mt-3">
                    <Text>Upload Images</Text>
                  </View>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity onPress={pickImages}>
                <Image
                  source={require("../../assets/images/teampoor-default.png")}
                  style={{ width: 200, height: 200 }}
                  className="rounded-full"
                />
              </TouchableOpacity>
            )}

            {/* <CameraIcon
            size={24}
            color="black"
          /> */}
          </View>

          <View
            className="flex-1 bg-white mt-5"
            style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50 }}
          >
            <View className="form space-y-3 p-6 mt-5">
              <Text className="font-bold text-2xl mb-3">
                {!props.route.params ? "Create Product" : "Update Product"}
              </Text>
              <Text>Name</Text>
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
                onChangeText={(text) => setName(text)}
              ></TextInput>
              <View className="space-y-0">
                {errors.name ? (
                  <Text className="text-sm text-red-500">{errors.name}</Text>
                ) : null}
              </View>

              <Text>Price</Text>
              <TextInput
                className={
                  errors.price
                    ? "border border-red-500 p-4 bg-gray-100 text-gray-700 rounded-2xl mb-1"
                    : "p-4 bg-gray-100 text-gray-700 rounded-2xl"
                }
                placeholder="Enter product price"
                name="price"
                id="price"
                value={price}
                keyboardType={"numeric"}
                onChangeText={(text) => setPrice(text)}
              ></TextInput>

              <View className="">
                {errors.price ? (
                  <Text className="text-sm text-red-500">{errors.price}</Text>
                ) : null}
              </View>

              <Text>Description</Text>
              <TextInput
                multiline
                numberOfLines={4}
                className={
                  errors.description
                    ? "border border-red-500 p-4 bg-gray-100 text-gray-700 rounded-2xl mb-1"
                    : "p-4 bg-gray-100 text-gray-700 rounded-2xl"
                }
                textAlignVertical="top"
                placeholder="Enter product description"
                name="description"
                id="description"
                value={description}
                onChangeText={(text) => setDescription(text)}
              ></TextInput>

              <View className="">
                {errors.description ? (
                  <Text className="text-sm text-red-500">
                    {errors.description}
                  </Text>
                ) : null}
              </View>

              <Text>Brand</Text>
              <Box>
                <Select
                  minWidth="90%"
                  placeholder="Select product brand"
                  selectedValue={pickerValueBrand}
                  onValueChange={(e) => [setPickerValueBrand(e), setBrand(e)]}
                >
                  {brandList.map((c, index) => {
                    return (
                      <Select.Item key={c.id} label={c.name} value={c.id} />
                    );
                  })}
                </Select>
              </Box>
              <View className="">
                {errors.brand ? (
                  <Text className="text-sm text-red-500">{errors.brand}</Text>
                ) : null}
              </View>

              <Text>Type</Text>
              <Box>
                <Select
                  minWidth="90%"
                  placeholder="Select product type"
                  selectedValue={pickerValueType}
                  onValueChange={(itemValue) => {
                    setPickerValueType(itemValue);
                    setType(itemValue);
                  }}
                  value={type}
                >
                  <Select.Item label="Accessories" value="Accessories" />
                  <Select.Item label="Parts" value="Parts" />
                </Select>
              </Box>

              <View className="">
                {errors.type ? (
                  <Text className="text-sm text-red-500">{errors.type}</Text>
                ) : null}
              </View>

              <Text>Category</Text>
              <Box>
                <Select
                  minWidth="90%"
                  placeholder="Select your Category"
                  selectedValue={pickerValueCategory}
                  onValueChange={(e) => [
                    setPickerValueCategory(e),
                    setCategory(e),
                  ]}
                >
                  {categories.map((c, index) => {
                    return (
                      <Select.Item key={c.id} label={c.name} value={c.id} />
                    );
                  })}
                </Select>
              </Box>

              <View className="">
                {errors.category ? (
                  <Text className="text-sm text-red-500">
                    {errors.category}
                  </Text>
                ) : null}
              </View>

              <Text>Stock</Text>
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

              <Text>Product has warranty?</Text>
              <Radio.Group
                accessibilityLabel="product has warranty?"
                value={isWarranty}
                onChange={(newValue) => setIsWarranty(newValue)}
              >
                <Stack
                  direction={{
                    base: "row",
                    md: "row",
                  }}
                  alignItems={{
                    base: "flex-row",
                    md: "center",
                  }}
                  space={4}
                  w="75%"
                  maxW="300px"
                >
                  <Radio value={false} colorScheme="red" size="sm" my="no">
                    No
                  </Radio>
                  <Radio value={true} colorScheme="red" size="sm" my="yes">
                    Yes
                  </Radio>
                </Stack>
              </Radio.Group>
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
              <TouchableOpacity className="bg-zinc-500 py-4 rounded-2xl items-center mt-4">
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text className="font-xl font-bold text-center text-white">
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

export default ProductForm;
