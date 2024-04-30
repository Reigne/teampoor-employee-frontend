import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import mime from "mime";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";
import baseURL from "../../assets/common/baseUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PencilIcon } from "react-native-heroicons/solid";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const CategoryForm = (props) => {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [mainImage, setMainImage] = useState();

  const [item, setItem] = useState(null);
  const [token, setToken] = useState();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  let navigation = useNavigation();

  useEffect(() => {
    if (!props.route.params) {
      setItem(null);
    } else {
      setItem(props.route.params.item);
      setName(props.route.params.item.name);
      setMainImage(props.route.params.item.image.url);
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
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      console.log(result.assets);
      setMainImage(result.assets[0].uri);
      setImage(result.assets[0].uri);
    }
  };

  const validateForm = () => {
    let errors = {};

    if (!name) errors.name = "Category name is required";

    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const addCategory = () => {
    if (!validateForm()) {
      return;
    }

    let formData = new FormData();

    formData.append("name", name);

    if (image) {
      const newImageUri = "file:///" + mainImage.split("file:/").join("");

      formData.append("image", {
        uri: newImageUri,
        type: mime.getType(newImageUri),
        name: newImageUri.split("/").pop(),
      });
    }

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    if (item !== null) {
      console.log(formData, "formData");

      axios
        .put(`${baseURL}categories/${item.id}`, formData, config)
        .then((res) => {
          if (res.status == 200 || res.status == 201) {
            Toast.show({
              topOffset: 60,
              type: "success",
              text1: "Category successfuly updated",
              text2: "",
            });

            setTimeout(() => {
              navigation.navigate("Categories");
              setLoading(false);
            }, 500);
          }
        })
        .catch((error) => {
          Toast.show({
            topOffset: 60,
            type: "error",
            text1: "Something went wrong",
            text2: "Please try again",
          });

          setLoading(false);
        });
    } else {
      axios
        .post(`${baseURL}categories/`, formData, config)
        .then((res) => {
          if (res.status == 200 || res.status == 201) {
            Toast.show({
              topOffset: 60,
              type: "success",
              text1: "Category successfuly added",
              text2: "",
            });

            setTimeout(() => {
              navigation.navigate("Categories");
              setLoading(false);
            }, 500);
          }
        })
        .catch((error) => {
          console.error(error.response);
          Toast.show({
            topOffset: 60,
            type: "error",
            text1: "Something went wrong",
            text2: "Please try again",
          });

          setLoading(false);
        });
    }
  };
  return (
    <KeyboardAwareScrollView className="flex-1 bg-red-500">
      <View className="bg-gray  flex-1 ">
        <View className="flex flex-row justify-center mt-5">
          <TouchableOpacity onPress={pickImage}>
            <Image
              source={
                mainImage
                  ? { uri: mainImage }
                  : require("../../assets/images/teampoor-default.png")
              }
              style={{ width: 200, height: 200 }}
              className="rounded-full"
            />
            <View
              style={{
                position: "absolute",
                bottom: 0,
                right: 20,
                backgroundColor: "#202020",
                width: 40,
                height: 40,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 5,
                borderColor: "#ef4444",
                borderRadius: 20,
              }}
            >
              <PencilIcon size={15} color="#d8d8d8" />
            </View>
          </TouchableOpacity>
        </View>
        <View
          className="flex-1 bg-white mt-5 p-8"
          style={{
            borderTopLeftRadius: 50,
            borderTopRightRadius: 50,
            height: hp("60%"),
          }}
        >
          <Text className="font-bold text-2xl mb-3">
            {!props.route.params ? "Create Category" : "Update Category"}
          </Text>

          <Text className="mb-3">Name</Text>
          <TextInput
            className={
              errors.name
                ? "border border-red-500 p-4 bg-gray-100 text-gray-700 rounded-2xl mb-1"
                : "p-4 bg-gray-100 text-gray-700 rounded-2xl mb-1"
            }
            placeholder="Enter brand name"
            name="name"
            id="name"
            value={name}
            onChangeText={(text) => setName(text)}
          ></TextInput>

          <View className="mb-3">
            {errors.name ? (
              <Text className="text-sm text-red-500">{errors.name}</Text>
            ) : null}
          </View>
        </View>
      </View>

      <View className="px-4 mb-4 absolute inset-x-0 bottom-0">
        <TouchableOpacity
          className={
            loading
              ? "bg-zinc-500 py-4 rounded-2xl items-center"
              : "bg-red-500 py-4 rounded-2xl items-center"
          }
          onPress={() => {
            setLoading(true);
            addCategory();
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
                {!props.route.params ? "Create Category" : "Update Category"}
              </Text>
            )}
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-gray-500 py-4 rounded-2xl items-center mt-4"
          onPress={() => navigation.goBack()}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text className="font-xl font-bold text-center text-white">
              Cancel
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default CategoryForm;
