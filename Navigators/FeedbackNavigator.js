import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Feedbacks from "../Screens/Admin/Feedbacks";

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Feedbacks"
        component={Feedbacks}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
export default function FeedbackNavigator() {
  return <MyStack />;
}
