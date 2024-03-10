import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import axios from "axios";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import baseURL from "../../assets/common/baseUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const EmployeeForm = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState();
  const [errors, setErrors] = useState({});

  const navigation = useNavigation();

  useEffect(() => {
    AsyncStorage.getItem("jwt")
      .then((res) => {
        setToken(res);
      })
      .catch((error) => console.log(error));
  });

  const validateForm = () => {
    let errors = {};

    if (!firstname) errors.firstname = "First name is required";
    if (!lastname) errors.lastname = "Last name is required";
    if (!email) errors.email = "Email is required";
    if (!password) errors.password = "Password is required";

    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const createEmployee = () => {
    // if (
    //   firstname === "" ||
    //   lastname === "" ||
    //   email === "" ||
    //   password === ""
    // ) {
    //   Toast.show({
    //     type: "error",
    //     text1: "Incomplete Form",
    //     text2: "Please fill in all fields",
    //   });
    //   return;
    // }

    if (validateForm()) {
      const employeeData = {
        firstname,
        lastname,
        email,
        password,
        role: "employee",
        // Additional fields can be added as needed
      };

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      };

      axios
        .post(`${baseURL}users/employee/create`, employeeData)
        .then((res) => {
          if (res.status == 200 || res.status == 201) {
            Toast.show({
              type: "success",
              text1: "Employee Created",
              text2: "The employee account has been successfully created.",
            });

            navigation.navigate("Employees");
          }
        })
        .catch((error) => {
          console.error(error);
          Toast.show({
            type: "error",
            text1: "Error",
            text2:
              "An error occurred while creating the employee account. Please try again.",
          });
        });
    } else {
      console.log("has error");
    }
  };

  return (
    <View className="flex-1 bg-red-500">
      <KeyboardAwareScrollView>
        <View className="flex flex-row justify-center mt-5"></View>
        <View
          className="flex-1 bg-white mt-5 p-8"
          style={{
            borderTopLeftRadius: 50,
            borderTopRightRadius: 50,
          }}
        >
          <Text className="font-bold text-2xl mb-3">Create Employee</Text>

          <Text className="mb-3">First Name</Text>
          <TextInput
             className={
              errors.firstname
                ? "border border-red-500 p-4 bg-zinc-200 rounded-2xl mb-1"
                : "p-4 bg-zinc-200 rounded-2xl mb-1"
            }
            placeholder="Enter first name"
            name="firstname"
            id="firstname"
            value={firstname}
            onChangeText={(text) => setFirstname(text)}
          />

          <View className="mb-3">
            {errors.firstname ? (
              <Text className="text-sm text-red-500">{errors.firstname}</Text>
            ) : null}
          </View>

          <Text className="mb-3">Last Name</Text>
          <TextInput
            className={
              errors.lastname
                ? "border border-red-500 p-4 bg-zinc-200 rounded-2xl mb-1"
                : "p-4 bg-zinc-200 rounded-2xl mb-1"
            }
            placeholder="Enter last name"
            name="lastname"
            id="lastname"
            value={lastname}
            onChangeText={(text) => setLastname(text)}
          />

          <View className="mb-3">
            {errors.lastname ? (
              <Text className="text-sm text-red-500">{errors.lastname}</Text>
            ) : null}
          </View>

          <Text className="mb-3">Email</Text>
          <TextInput
             className={
              errors.email
                ? "border border-red-500 p-4 bg-zinc-200 rounded-2xl mb-1"
                : "p-4 bg-zinc-200 rounded-2xl mb-1"
            }
            placeholder="Enter email"
            name="email"
            id="email"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />

          <View className="mb-3">
            {errors.email ? (
              <Text className="text-sm text-red-500">{errors.email}</Text>
            ) : null}
          </View>

          <Text className="mb-3">Password</Text>
          <TextInput
             className={
              errors.password
                ? "border border-red-500 p-4 bg-zinc-200 rounded-2xl mb-1"
                : "p-4 bg-zinc-200 rounded-2xl mb-1"
            }
            placeholder="Enter password"
            secureTextEntry
            name="password"
            id="password"
            value={password}
            onChangeText={(text) => setPassword(text)}
          />

          <View className="mb-3">
            {errors.password ? (
              <Text className="text-sm text-red-500">{errors.password}</Text>
            ) : null}
          </View>

          <View className="mt-3">
            <TouchableOpacity
              className="bg-red-500 py-4 rounded-2xl items-center"
              onPress={() => createEmployee()}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text className="font-xl font-bold text-center text-white">
                  Create Employee
                </Text>
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
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default EmployeeForm;
