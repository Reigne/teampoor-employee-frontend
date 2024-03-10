import React, { useContext } from "react";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/FontAwesome";
import AuthGlobal from "../Context/Store/AuthGlobal";
import {
  ClipboardDocumentListIcon,
  PresentationChartBarIcon,
  Squares2X2Icon,
  UserCircleIcon,
} from "react-native-heroicons/solid";

//navigators
import UserNavigator from "../Navigators/UserNavigator";
import AdminNavigator from "./AdminNavigator";
import SupperlierDrawerNavigation from "./SupplierDrawerNavigator";
import MechanicNavigator from "./MechanicNavigator";

const Tab = createBottomTabNavigator();

const Main = () => {
  const context = useContext(AuthGlobal);

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#ef4444",
      }}
    >
      {context.stateUser.user.role === "admin" && (
        <Tab.Screen
          name="Admin"
          component={AdminNavigator}
          options={{
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <Squares2X2Icon
                name="cog"
                style={{ position: "relative" }}
                color={color}
                size={30}
              />
            ),
          }}
        />
      )}

      {context.stateUser.user.role === "supplier" && (
        <Tab.Screen
          name="Supplier Dashboard"
          component={SupperlierDrawerNavigation}
          options={{
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <PresentationChartBarIcon
                name="cog"
                style={{ position: "relative" }}
                color={color}
                size={30}
              />
            ),
          }}
        />
      )}

      {context.stateUser.user.role === "mechanic" && (
        <Tab.Screen
          name="Mechanic"
          component={MechanicNavigator}
          options={{
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <ClipboardDocumentListIcon
                name="cog"
                style={{ position: "relative" }}
                color={color}
                size={30}
              />
            ),
          }}
        />
      )}

      <Tab.Screen
        name="User"
        component={UserNavigator}
        options={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <UserCircleIcon
              name="gear"
              style={{ position: "relative" }}
              color={color}
              size={30}
            />
          ),
          tabBarStyle: {
            display: getRouteName(route) === "none" ? "none" : "flex",
          }, // Fix this line
        })}
      />
    </Tab.Navigator>
  );
};

const getRouteName = (route) => {
  const routeName = getFocusedRouteNameFromRoute(route);
  console.log(routeName);

  if (routeName?.includes("Login") || routeName?.includes("Register")) {
    return "none";
  }

  return "flex";
};

export default Main;
