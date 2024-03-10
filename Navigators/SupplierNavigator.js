import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Suppliers from "../Screens/Admin/Suppliers";
import SupplierList from "../Screens/Admin/SupplierList";
const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Suppliers"
        component={Suppliers}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Supplier List"
        component={SupplierList}
        options={{
          headerShown: false,
        }}
      />

    </Stack.Navigator>
  );
}
export default function SupplierNavigator() {
  return <MyStack />;
}
