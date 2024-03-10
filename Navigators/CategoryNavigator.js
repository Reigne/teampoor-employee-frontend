import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Categories from "../Screens/Admin/Categories";
import CategoryForm from "../Screens/Admin/CategoryForm";

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Categories"
        component={Categories}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="CategoryForm"
        component={CategoryForm}
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
