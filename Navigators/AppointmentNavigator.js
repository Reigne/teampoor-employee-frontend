import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Appointments from "../Screens/Admin/Appointments";
import AppointmentSingle from "../Screens/Admin/AppointmentSingle";
import AppointmentParts from "../Screens/Admin/AppointmentParts";
import AppointmentAddService from "../Screens/Admin/AppointmentAddService";

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Appointments"
        component={Appointments}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AppointmentSingle"
        component={AppointmentSingle}
        options={{
          title: false,
        }}
      />
      <Stack.Screen
        name="AppointmentParts"
        component={AppointmentParts}
        options={{
          title: false,
        }}
      />
      <Stack.Screen
        name="AppointmentAddService"
        component={AppointmentAddService}
        options={{
          title: false,
        }}
      />
    </Stack.Navigator>
  );
}
export default function AppointmentNavigator() {
  return <MyStack />;
}
