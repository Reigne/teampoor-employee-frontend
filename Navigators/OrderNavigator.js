import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Orders from "../Screens/Admin/Orders";

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Orders"
        component={Orders}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default function OrderNavigator() {
  return <MyStack />;
}
