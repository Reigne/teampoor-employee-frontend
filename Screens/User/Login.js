import { View, Text, Image, TouchableOpacity, TextInput } from "react-native";
import React, { useState, useContext, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import Register from "./Register";
import AuthGlobal from "../../Context/Store/AuthGlobal";
import { loginUser } from "../../Context/Actions/Auth.actions";
import Toast from "react-native-toast-message";
import { Formik } from "formik";
import * as Yup from "yup";

const Login = () => {
  const navigation = useNavigation();

  const context = useContext(AuthGlobal);

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = (values) => {
    const user = {
      email: values.email.toLowerCase(),
      password: values.password,
    };

    console.log(user, "user log");

    if (user.email === "" || user.password === "") {
      Toast.show({
        topOffset: 60,
        type: "error",
        text1: "Warning!",
        text2: "Please fill in your credentials",
      });
    } else {
      loginUser(user, context.dispatch);
    }
  };

  useEffect(() => {
    if (context.stateUser.isAuthenticated === true) {
      navigation.navigate("UserProfile");
    }
  }, [context.stateUser.isAuthenticated]);


  return (
    <View className="flex-1  bg-red-500">
      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View className="flex-1 justify-center bg-white px-8 pt-8">
            <View className="form space-y-2">

              <View className="flex items-center space-y-2 m-9">
                <Image
                  source={require("../../assets/images/teampoor-icon.png")}
                  style={{ width: 155, height: 155 }}
                  className="rounded-full"
                  resizeMode="contain"
                />

                <View className="flex items-center">
                  <Text className="text-3xl font-extrabold text-red-500" >
                    TEAMPOOR
                  </Text>
                  <Text className="">Sign in to continue</Text>
                </View>
              </View>

              <View className="space-y-1">
                <Text>Email</Text>
                <TextInput
                  className={
                    errors.email
                      ? "border border-red-500 p-4 bg-gray-100 text-gray-700 rounded-2xl"
                      : "p-4 bg-gray-100 text-gray-700 rounded-2xl"
                  }
                  placeholder="motorcycleshop@email.com"
                  name="email"
                  value={values.email}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                />

                <View className="mb-3">
                  {touched.email && errors.email && (
                    <Text className="text-red-500">{errors.email}</Text>
                  )}
                </View>
              </View>

              <View className="space-y-1">
                <Text>Password</Text>
                <TextInput
                  secureTextEntry={true}
                  className={
                    errors.password
                      ? "border border-red-500 p-4 bg-gray-100 text-gray-700 rounded-2xl"
                      : "p-4 bg-gray-100 text-gray-700 rounded-2xl"
                  }
                  placeholder="Enter password"
                  name="password"
                  value={values.password}
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                />

                <View className="">
                  {touched.password && errors.password && (
                    <Text className="text-red-500">{errors.password}</Text>
                  )}
                </View>
              </View>

              <TouchableOpacity
                className="bg-red-500 py-4 rounded-2xl"
                onPress={() => handleSubmit()}
              >
                <Text className="font-xl font-bold text-center text-white">
                  Login
                </Text>
              </TouchableOpacity>

              <View className="flex flex-row text-center justify-center mb-5">
                <Text className="mt-2 text-gray-500">
                  Don't have an account yet?
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate(Register)}>
                  <Text className="mt-2 text-blue-400"> Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </Formik>
    </View>
  );
};

export default Login;
