import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Dashboard from "../Screens/Admin/Dashboard";

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          headerShown: false,
        }}
      />
  
    </Stack.Navigator>
  );
}
export default function DashboardNavigator() {
  return <MyStack />;
}
