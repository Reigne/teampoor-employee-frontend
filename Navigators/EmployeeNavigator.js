import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Employees from "../Screens/Admin/Employees";
import EmployeeForm from "../Screens/Admin/EmployeeForm";

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Employees"
        component={Employees}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="EmployeeForm"
        component={EmployeeForm}
        options={{
          title: false,
        }}
      />
    </Stack.Navigator>
  );
}
export default function EmployeeNavigator() {
  return <MyStack />;
}
