import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Brands from "../Screens/Admin/Brands";
import BrandForm from "../Screens/Admin/BrandForm";

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Brands"
        component={Brands}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="BrandForm"
        component={BrandForm}
        options={{
          title: false,
        }}
      />
    </Stack.Navigator>
  );
}
export default function BrandNavigator() {
  return <MyStack />;
}
