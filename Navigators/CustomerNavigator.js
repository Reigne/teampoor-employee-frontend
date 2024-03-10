import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Customers from "../Screens/Admin/Customers";

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Customers"
        component={Customers}
        options={{
          headerShown: false,
        }}
      />
      {/* <Stack.Screen
        name="BrandForm"
        component={BrandForm}
        options={{
          title: false,
        }}
      /> */}
    </Stack.Navigator>
  );
}
export default function CustomerNavigator() {
  return <MyStack />;
}
