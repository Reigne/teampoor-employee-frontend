import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import ProductStocks from "../Screens/Admin/ProductStocks";
import ProductStockForm from "../Screens/Admin/ProductStockForm";

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProductStocks"
        component={ProductStocks}
        options={{
          headerShown: false,
        }}
      />
     <Stack.Screen
        name="ProductStockForm"
        component={ProductStockForm}
        options={{
          title: false,
        }}
      />
      
    </Stack.Navigator>
  );
}
export default function AdminFormNavigator() {
  return <MyStack />;
}
