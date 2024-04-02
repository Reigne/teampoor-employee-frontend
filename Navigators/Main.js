import { View, Text } from "react-native";
import React, { useContext, useEffect } from "react";
import {
  NavigationContainer,
  getFocusedRouteNameFromRoute,
} from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/FontAwesome";

//navigators
import UserNavigator from "../Navigators/UserNavigator";
import AdminNavigator from "./AdminNavigator";
import SupperlierDrawerNavigation from "./SupplierDrawerNavigator";
import MechanicNavigator from "./MechanicNavigator";
// import Notifications from "../Screens/Notification/Notifications";
import NotificationIcon from "../Shared/NotificationIcon";
import NotificationsAdmin from "../Screens/Admin/Notifications";

import AuthGlobal from "../Context/Store/AuthGlobal";
import {
  BellIcon,
  ClipboardDocumentIcon,
  ClipboardDocumentListIcon,
  PresentationChartBarIcon,
  UserCircleIcon,
  Squares2X2Icon,
} from "react-native-heroicons/solid";
import baseURL from "../assets/common/baseUrl";
import * as actions from "../Redux/Actions/notificationActions";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

const Tab = createBottomTabNavigator();

const getRouteName = (route) => {
  const routeName = getFocusedRouteNameFromRoute(route);
  console.log(routeName);

  if (routeName?.includes("Login") || routeName?.includes("Register")) {
    return "none";
  }

  return "flex";
};

const Main = () => {
  const context = useContext(AuthGlobal);
  // const dispatch = useDispatch();

  // if (context.stateUser.user.role === "user") {
  //   useEffect(() => {
  //     axios
  //       .get(`${baseURL}notifications/unread/${context.stateUser.user.userId}`)
  //       .then((res) => {
  //         dispatch(actions.fetchUnreadCountSuccess(res.data.unreadCount)); // Dispatch action to update Redux store
  //       })
  //       .catch((error) => console.log(error));
  //   }, []);
  // }

  const getRouteName = (route) => {
    const routeName = getFocusedRouteNameFromRoute(route);
    console.log(routeName);

    if (routeName?.includes("Login") || routeName?.includes("Register")) {
      return "none";
    }

    return "flex";
  };

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#ef4444",
      }}
    >
      {(context.stateUser.user.role === "admin" ||
        context.stateUser.user.role === "secretary") && (
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

      {(context.stateUser.user.role === "admin" ||
        context.stateUser.user.role === "secretary") && (
        <Tab.Screen
          name="NotificationsAdmin"
          component={NotificationsAdmin}
          options={{
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <NotificationIcon
                color={color}
                userId={context.stateUser?.user?.userId}
              />
            ),
          }}
        />
      )}
    </Tab.Navigator>
  );
};

export default Main;
