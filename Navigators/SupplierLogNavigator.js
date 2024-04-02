import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import SupplierLogs from "../Screens/Admin/SupplierLogs";
import SupplierLogForm from "../Screens/Admin/SupplierLogForm";

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SupplierLogs"
        component={SupplierLogs}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SupplierLogForm"
        component={SupplierLogForm}
        options={{
          title: false,
        }}
      />
    </Stack.Navigator>
  );
}
export default function SupplierLogNavigator() {
  return <MyStack />;
}
