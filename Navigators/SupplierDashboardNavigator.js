import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import SupplierDashboard from "../Screens/Supplier/SupplierDashboard";

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Employees"
        component={SupplierDashboard}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
export default function SupplierDashboardNavigator() {
  return <MyStack />;
}
