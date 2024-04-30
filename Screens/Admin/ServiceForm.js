import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  TextInput,
  FlatList,
} from "react-native";
import { Stack, Radio } from "native-base";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import baseURL from "../../assets/common/baseUrl";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import mime from "mime";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { ActivityIndicator } from "react-native-paper";

const ServiceForm = (props) => {
  const [token, setToken] = useState();
  const [errors, setErrors] = useState({});
  const [item, setItem] = useState();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [laborFee, setLaborFee] = useState(0)
  const [images, setImages] = useState([]);
  const [mainImages, setMainImages] = useState([]);
  const [isAvailable, setIsAvailable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [type, setType] = useState("1")

  const navigation = useNavigation();

  useEffect(() => {
    if (!props.route.params) {
      setItem(null);
    } else {
      setItem(props.route.params.item);
      setName(props.route.params.item.name);
      setDescription(props.route.params.item.description);
      setPrice(props.route.params.item.price?.toString());
      setImages(props.route.params.item.images);
      setMainImages(props.route.params.item.images);
      setIsAvailable(props.route.params.item.isAvailable);
      setType(props.route.params.item.type?.toString() || "");
    }

    AsyncStorage.getItem("jwt")
      .then((res) => {
        setToken(res);
      })
      .catch((error) => console.log(error));

    (async () => {
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();

        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();

    return () => {
      setCategories([]);
    };
  }, []);

  const pickImages = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true,
      selectionLimit: 10,
    });

    if (result.canceled) {
      return;
    }

    if (result.assets && result.assets.length > 0) {
      const images = result.assets.map((asset) => ({
        uri: asset.uri,
      }));

      setImages(images);
      setIsChanged(true);
    }
  };

  const validateForm = () => {
    let errors = {};

    if (!name) errors.name = "Name is required";
    if (!price) errors.price = "Price is required";
    if (!description) errors.description = "Description is required";

    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const addService = () => {
    console.log(isAvailable, "isAvailable");
    if (!validateForm()) {
      setLoading(false);
      return;
    }

    let formData = new FormData();

    formData.append("name", name);
    formData.append("price", price);
    formData.append("type", type);
    formData.append("description", description);
    formData.append("isAvailable", isAvailable);

    if (isChanged === true) {
      images.forEach((image, index) => {
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

    console.log(formData, "form data");

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    if (item !== null) {
      console.log(item);

      axios
        .put(`${baseURL}services/${item.id}`, formData, config)
        .then((res) => {
          if (res.status == 200 || res.status == 201) {
            Toast.show({
              topOffset: 60,
              type: "success",
              text1: "Service successfuly updated",
              text2: "",
            });

            setTimeout(() => {
              navigation.navigate("Services");
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
        .post(`${baseURL}services`, formData, config)
        .then((res) => {
          if (res.status == 200 || res.status == 201) {
            Toast.show({
              topOffset: 60,
              type: "success",
              text1: "New Service Added",
              text2: "Successfuly",
            });
            setTimeout(() => {
              navigation.navigate("Services");
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
            text2: "Create Service Form",
          });

          setLoading(false);
        });
    }
  };

  return (
    <KeyboardAwareScrollView className="flex-1 bg-white">
      <View>
        <View className="flex-1 justify-start bg-red-500 ">
          <View className="flex flex-row justify-center mt-5">
            {images.length > 0 ? (
              <View className="flex justify-center items-center">
                {console.log(images, "images")}
                <FlatList
                  data={images}
                  keyExtractor={(item, index) => index}
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
                        resizeMode="contain"
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
          </View>

          <View
            className="flex-1 bg-white mt-5"
            style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50 }}
          >
            <View className="form space-y-3 p-6 mt-5">
              <Text className="font-bold text-2xl mb-3">
                {!props.route.params ? "Create Service" : "Update Service"}
              </Text>

              <View>
                <Text className="mb-2">Name *</Text>
                <TextInput
                  className={
                    errors.name
                      ? "border border-red-500 p-4 bg-gray-100 text-gray-700 rounded-2xl mb-1"
                      : "p-4 bg-gray-100 text-gray-700 rounded-2xl mb-1"
                  }
                  placeholder="Enter service name"
                  name="name"
                  id="name"
                  value={name}
                  onChangeText={(text) => setName(text)}
                ></TextInput>
                <View>
                  {errors.name ? (
                    <Text className="text-sm text-red-500">{errors.name}</Text>
                  ) : null}
                </View>
              </View>

              <View>
                <Text className="mb-2">Price *</Text>
                <TextInput
                  className={
                    errors.price
                      ? "border border-red-500 p-4 bg-gray-100 text-gray-700 rounded-2xl mb-1"
                      : "p-4 bg-gray-100 text-gray-700 rounded-2xl"
                  }
                  placeholder="Enter service price"
                  name="price"
                  id="price"
                  value={price}
                  keyboardType={"numeric"}
                  onChangeText={(text) => setPrice(text)}
                ></TextInput>

                <View>
                  {errors.price ? (
                    <Text className="text-sm text-red-500">{errors.price}</Text>
                  ) : null}
                </View>
              </View>

              <View>
                <Text className="mb-2">Description *</Text>
                <TextInput
                  multiline
                  numberOfLines={4}
                  className={
                    errors.description
                      ? "border border-red-500 p-4 bg-gray-100 text-gray-700 rounded-2xl mb-1"
                      : "p-4 bg-gray-100 text-gray-700 rounded-2xl"
                  }
                  placeholder="Enter service description"
                  name="description"
                  id="description"
                  value={description}
                  onChangeText={(text) => setDescription(text)}
                ></TextInput>

                <View className="mb-2">
                  {errors.description ? (
                    <Text className="text-sm text-red-500">
                      {errors.description}
                    </Text>
                  ) : null}
                </View>
              </View>

              <View>
                <Text className="mb-2">Type of Service: </Text>

                <Radio.Group
                  value={type}
                  onChange={(e) => setType(e)}
                >
                  <Stack className="flex-col space-y-2">
                    <Radio value="1" colorScheme="red" size="sm" my="no">
                      Onsite Service
                    </Radio>
                    <Radio value="2" colorScheme="red" size="sm" my="yes">
                      Home Service
                    </Radio>
                    <Radio value="3" colorScheme="red" size="sm" my="yes">
                      Home Service & Onsite Service
                    </Radio>
                  </Stack>
                </Radio.Group>
              </View>

              <View>
                <Text className="mb-2">Service is available now?</Text>

                <Radio.Group
                  value={isAvailable}
                  onChange={(e) => setIsAvailable(e)}
                >
                  <Stack className="flex-col space-y-2">
                    <Radio value={false} colorScheme="red" size="sm" my="no">
                      No
                    </Radio>
                    <Radio value={true} colorScheme="red" size="sm" my="yes">
                      Yes
                    </Radio>
                  </Stack>
                </Radio.Group>
              </View>
            </View>

            <View className="px-4 mb-4">
              <TouchableOpacity
                className={
                  loading
                    ? "bg-zinc-500 py-4 rounded-2xl items-center"
                    : "bg-red-500 py-4 rounded-2xl items-center"
                }
                onPress={() => {
                  setLoading(true); 
                  addService(); 
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

export default ServiceForm;
