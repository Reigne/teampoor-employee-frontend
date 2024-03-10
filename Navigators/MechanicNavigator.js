import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Tasks from "../Screens/Mechanic/Tasks";
import TaskSingle from "../Screens/Mechanic/TaskSingle";

const Stack = createStackNavigator();

const MechanicNAvigator = (props) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Tasks"
        options={{ headerShown: false }}
        component={Tasks}
      ></Stack.Screen>
      <Stack.Screen
        name="TaskSingle"
        options={{ headerShown: true }}
        component={TaskSingle}
      ></Stack.Screen>
    </Stack.Navigator>
  );
};

export default MechanicNAvigator;
