import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import ServiceCategories from "../Screens/Admin/ServiceCategories";
import ServiceCategoryForm from "../Screens/Admin/ServiceCategoryForm";

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ServiceCategories"
        component={ServiceCategories}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ServiceCategoryForm"
        component={ServiceCategoryForm}
        options={{
          title: false,
        }}
      />
    </Stack.Navigator>
  );
}
export default function CategoryNavigator() {
  return <MyStack />;
}
