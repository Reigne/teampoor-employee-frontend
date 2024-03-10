import React, { useContext } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";

import ProductNavigator from "./ProductNavigator";
import BrandNavigator from "./BrandNavigator";
import OrderNavigator from "./OrderNavigator";
import CategoryNavigator from "./CategoryNavigator";
import CustomerNavigator from "./CustomerNavigator";
import EmployeeNavigator from "./EmployeeNavigator";
import ServiceNavigator from "./ServiceNavigator";
// import ServiceCategoryNavigator from "./ServiceCategoryNavigator";
import SupplierNavigator from "./SupplierNavigator";
import ProductStockNavigator from "./ProductStockNavigator";
import ProductStockLogs from "../Screens/Admin/ProductStockLogs";
import AppointmentNavigator from "./AppointmentNavigator";
import DashboardNavigator from "./DashboardNavigator";

import AuthGlobal from "../Context/Store/AuthGlobal";
import { Squares2X2Icon } from "react-native-heroicons/solid";
import AdminDrawerCustom from "./AdminDrawerCustom";

const Drawer = createDrawerNavigator();

function MyStack() {
  const context = useContext(AuthGlobal);
  const activeColor = "#ef4444"; // Set your default active color here or retrieve it from your context
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: {
          // backgroundColor: 'rgba(0, 0, 0, 0.5)', // 50% transparent black
          width: 250,
        },
        drawerActiveBackgroundColor: "#fee2e2",
        drawerActiveTintColor: "#ef4444",
        drawerLabelStyle: {
          // marginLeft: -20,
        },
      }}
      drawerContent={(props) => <AdminDrawerCustom {...props} activeColor={activeColor} />}
    >
      {/* {context.stateUser.user.role === "admin" ? (
        <> */}
      <Drawer.Screen
        name="DashboardNavigator"
        component={DashboardNavigator}
        // options={{
        //   title: "Dashboard",
        // }}

        options={{
          title: "Dashboard",
          drawerIcon: ({ color }) => (
            <Squares2X2Icon
              name="cog"
              style={{ position: "relative" }}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="MainProduct"
        component={ProductNavigator}
        options={{
          title: "Products",
        }}
      />

      <Drawer.Screen
        name="MainBrand"
        component={BrandNavigator}
        options={{
          title: "Brands",
        }}
      />
      <Drawer.Screen
        name="MainCategory"
        component={CategoryNavigator}
        options={{
          title: "Categories",
        }}
      />
      <Drawer.Screen
        name="MainOrder"
        component={OrderNavigator}
        options={{
          title: "Orders",
        }}
      />
      <Drawer.Screen
        name="MainCustomer"
        component={CustomerNavigator}
        options={{
          title: "Customers",
        }}
      />
      <Drawer.Screen
        name="MainEmployee"
        component={EmployeeNavigator}
        options={{
          title: "Employees",
        }}
      />
      <Drawer.Screen
        name="ServiceNavigator"
        component={ServiceNavigator}
        options={{
          title: "Services",
        }}
      />
      <Drawer.Screen
        name="ProductStockNavigator"
        component={ProductStockNavigator}
        options={{
          title: "Product Stock",
        }}
      />
      <Drawer.Screen
        name="ProductStockLogs"
        component={ProductStockLogs}
        options={{
          title: "Product Log",
        }}
      />
      {/* <Drawer.Screen
            name="ServiceCategoryNavigator"
            component={ServiceCategoryNavigator}
            options={{
              title: "Categories (Service)",
            }}
          /> */}
      <Drawer.Screen
        name="MainSupplier"
        component={SupplierNavigator}
        options={{
          title: "Suppliers",
        }}
      />

      <Drawer.Screen
        name="AppointmentNavigator"
        component={AppointmentNavigator}
        options={{
          title: "Appointments",
        }}
      />
      {/* </>
      ) : context.stateUser.user.role === "secretary" ? (
        <> */}
      {/* <Drawer.Screen
            name="MainOrder"
            component={OrderNavigator}
            options={{
              title: "Orders",
            }}
          /> */}
      {/* </>
      ) : null} */}
    </Drawer.Navigator>
  );
}

export default function AdminNavigator() {
  return <MyStack />;
}
