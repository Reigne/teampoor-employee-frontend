import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Login from "../Screens/User/Login";
import Register from "../Screens/User/Register";
import UserProfile from "../Screens/User/UserProfile";
import UserUpdate from "../Screens/User/UserUpdate";
import ChangePassword from "../Screens/User/ChangePassword";
import AuthGlobal from "../Context/Store/AuthGlobal";

const Stack = createStackNavigator();

const UserNavigator = (props) => {
  const context = useContext(AuthGlobal);
  console.log(context, "constext")

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { flex: 1 },
      }}
    >
      {context.stateUser.isAuthenticated ? (
        <>
          <Stack.Screen
            name="UserProfile"
            component={UserProfile}
          />
          <Stack.Screen
            name="UserUpdate"
            component={UserUpdate}
          />
          <Stack.Screen
            name="ChangePassword"
            component={ChangePassword}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Login"
            component={Login}
          />
          <Stack.Screen
            name="Register"
            component={Register}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default UserNavigator;
