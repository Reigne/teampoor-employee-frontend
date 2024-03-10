import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import ProductStockLogs from "../Screens/Admin/ProductStockLogs";

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProductStockLogs"
        component={ProductStockLogs}
        options={{
          headerShown: false,
        }}
      />
    
      
    </Stack.Navigator>
  );
}
export default function AdminFormNavigator() {
  return <MyStack />;
}
