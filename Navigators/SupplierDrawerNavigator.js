import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";

//navigators
import SupplierDashboardNavigator from "./SupplierDashboardNavigator";

const Drawer = createDrawerNavigator();

function MyStack() {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: {
          // backgroundColor: "#c6cbef",
          // width: 240,
        //   borderColor: "#c6cbef",
        },
      }}
    >
      <Drawer.Screen
        name="Dashboards"
        component={SupplierDashboardNavigator}
        options={{
          title: "Dashboard",
        }}
      />
     
    </Drawer.Navigator>
  );
}

export default function SupperlierDrawerNavigation() {
  return <MyStack />;
}
