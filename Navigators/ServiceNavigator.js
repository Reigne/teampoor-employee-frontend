import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Services from "../Screens/Admin/Services";
import ServiceForm from "../Screens/Admin/ServiceForm";

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Services"
        component={Services}
        options={{
          headerShown: false,
        }}
      />
      
      <Stack.Screen
        name="ServiceForm"
        component={ServiceForm}
        options={{
          title: false,
        }}
      />

    </Stack.Navigator>
  );
}
export default function ServiceNavigator() {
  return <MyStack />;
}
