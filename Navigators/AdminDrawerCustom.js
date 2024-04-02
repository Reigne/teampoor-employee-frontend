import React, { useContext } from "react";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { Text, View } from "react-native";
import {
  ArchiveBoxIcon,
  BanknotesIcon,
  CalendarDaysIcon,
  ChartPieIcon,
  ClipboardDocumentListIcon,
  DocumentTextIcon,
  HandThumbUpIcon,
  Square3Stack3DIcon,
  Squares2X2Icon,
  UserGroupIcon,
  UsersIcon,
  WrenchScrewdriverIcon,
} from "react-native-heroicons/solid";
import { Drawer } from "react-native-paper";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faTruckRampBox } from "@fortawesome/free-solid-svg-icons/faTruckRampBox";
import { faBoxesStacked } from "@fortawesome/free-solid-svg-icons/faBoxesStacked";
import { faBoxOpen } from "@fortawesome/free-solid-svg-icons/faBoxOpen";
import { faCopyright } from "@fortawesome/free-solid-svg-icons/faCopyright";
import { faUserTie } from "@fortawesome/free-solid-svg-icons/faUserTie";
import { faAddressBook } from "@fortawesome/free-solid-svg-icons/faAddressBook";
import { faUserGear } from "@fortawesome/free-solid-svg-icons/faUserGear";
import { Image } from "native-base";
import AuthGlobal from "../Context/Store/AuthGlobal";

const AdminDrawerCustom = (props) => {
  console.log(props, "colorr");

  const context = useContext(AuthGlobal);
  const { activeColor } = props;

  // Function to determine if the item is active
  const isItemActive = (routeName) => {
    const currentRoute = props.state.routes[props.state.index].name;
    return currentRoute === routeName;
  };

  // Function to get the style for active items
  const getItemStyle = (routeName) => {
    return isItemActive(routeName)
      ? { color: activeColor, backgroundColor: "#fee2e2" } // Set background color for active item
      : null;
  };

  return (
    <View className="flex-1">
      <DrawerContentScrollView {...props}>
        <Drawer.Section className="px-4 justify-center items-center space-y-2">
          <Image
            source={require("../assets/images/teampoor-icon.png")}
            style={{ width: 124, height: 124 }}
            className="rounded-full"
            resizeMode="contain"
            alt="teampoor logo"
          />
          <View className="items-center">
            <Text className="font-extrabold text-lg text-red-500">
              TEAMPOOR
            </Text>
            <Text className="text-xs text-zinc-600">
              Thai Parts & Thai Units
            </Text>
          </View>
        </Drawer.Section>

        <View>
          <View className="px-4 py-3">
            <View className="border-b border-zinc-200 " />
          </View>

          {context.stateUser.user.role === "admin" && (
            <>
              <View className="px-4 py-2 flex flex-row space-x-2 items-center">
                <Text className="font-semibold text-zinc-500 text-xs">
                  Dashboard
                </Text>
              </View>

              <View style={{ marginLeft: 5, marginRight: 5 }}>
                <DrawerItem
                  label="Dashboard"
                  icon={({ color, size }) => (
                    <ChartPieIcon
                      color={
                        isItemActive("DashboardNavigator") ? "#ef4444" : "grey"
                      }
                      size={18}
                    />
                  )}
                  onPress={() => {
                    props.navigation.navigate("DashboardNavigator");
                  }}
                  labelStyle={
                    isItemActive("DashboardNavigator")
                      ? { color: "#ef4444" }
                      : null
                  }
                  style={
                    isItemActive("DashboardNavigator")
                      ? { backgroundColor: "#fee2e2" }
                      : null
                  }
                />
              </View>
            </>
          )}
        </View>

        <View>
          <View className="px-4 py-2 flex flex-row space-x-2 items-center">
            <Text className="font-semibold text-zinc-500 text-xs">
              Products
            </Text>
          </View>

          <View style={{ marginLeft: 5, marginRight: 5 }}>
            <DrawerItem
              label="Orders"
              icon={({ color, size }) => (
                <FontAwesomeIcon
                  icon={faTruckRampBox}
                  color={isItemActive("MainOrder") ? "#ef4444" : "grey"}
                  size={18}
                />
              )}
              onPress={() => {
                props.navigation.navigate("MainOrder");
              }}
              labelStyle={
                isItemActive("MainOrder") ? { color: "#ef4444" } : null
              }
              style={
                isItemActive("MainOrder")
                  ? { backgroundColor: "#fee2e2" }
                  : null
              }
            />
            {context.stateUser.user.role === "admin" && (
              <>
                <DrawerItem
                  label="All Products"
                  icon={({ color, size }) => (
                    <FontAwesomeIcon
                      icon={faBoxOpen}
                      color={isItemActive("MainProduct") ? "#ef4444" : "grey"}
                      size={18}
                    />
                  )}
                  onPress={() => {
                    props.navigation.navigate("MainProduct");
                  }}
                  labelStyle={
                    isItemActive("MainProduct") ? { color: "#ef4444" } : null
                  }
                  style={
                    isItemActive("MainProduct")
                      ? { backgroundColor: "#fee2e2" }
                      : null
                  }
                />

                <DrawerItem
                  label="Product Stocks"
                  icon={({ color, size }) => (
                    <FontAwesomeIcon
                      icon={faBoxesStacked}
                      color={
                        isItemActive("ProductStockNavigator")
                          ? "#ef4444"
                          : "grey"
                      }
                      size={18}
                    />
                  )}
                  onPress={() => {
                    props.navigation.navigate("ProductStockNavigator");
                  }}
                  labelStyle={
                    isItemActive("ProductStockNavigator")
                      ? { color: "#ef4444" }
                      : null
                  }
                  style={
                    isItemActive("ProductStockNavigator")
                      ? { backgroundColor: "#fee2e2" }
                      : null
                  }
                />

                <DrawerItem
                  label="Product Logs"
                  icon={({ color, size }) => (
                    <ClipboardDocumentListIcon
                      color={
                        isItemActive("ProductStockLogs") ? "#ef4444" : "grey"
                      }
                      size={18}
                    />
                  )}
                  onPress={() => {
                    props.navigation.navigate("ProductStockLogs");
                  }}
                  labelStyle={
                    isItemActive("ProductStockLogs")
                      ? { color: "#ef4444" }
                      : null
                  }
                  style={
                    isItemActive("ProductStockLogs")
                      ? { backgroundColor: "#fee2e2" }
                      : null
                  }
                />
                <DrawerItem
                  label="Price Logs"
                  icon={({ color, size }) => (
                    <BanknotesIcon
                      color={
                        isItemActive("ProductPriceLogs") ? "#ef4444" : "grey"
                      }
                      size={18}
                    />
                  )}
                  onPress={() => {
                    props.navigation.navigate("ProductPriceLogs");
                  }}
                  labelStyle={
                    isItemActive("ProductPriceLogs")
                      ? { color: "#ef4444" }
                      : null
                  }
                  style={
                    isItemActive("ProductPriceLogs")
                      ? { backgroundColor: "#fee2e2" }
                      : null
                  }
                />
                <DrawerItem
                  label="Brands"
                  icon={({ color, size }) => (
                    <FontAwesomeIcon
                      icon={faCopyright}
                      color={isItemActive("MainBrand") ? "#ef4444" : "grey"}
                      size={18}
                    />
                  )}
                  onPress={() => {
                    props.navigation.navigate("MainBrand");
                  }}
                  labelStyle={
                    isItemActive("MainBrand") ? { color: "#ef4444" } : null
                  }
                  style={
                    isItemActive("MainBrand")
                      ? { backgroundColor: "#fee2e2" }
                      : null
                  }
                />
                <DrawerItem
                  label="Categories"
                  icon={({ color, size }) => (
                    <Square3Stack3DIcon
                      color={isItemActive("MainCategory") ? "#ef4444" : "grey"}
                      size={18}
                    />
                  )}
                  onPress={() => {
                    props.navigation.navigate("MainCategory");
                  }}
                  labelStyle={
                    isItemActive("MainCategory") ? { color: "#ef4444" } : null
                  }
                  style={
                    isItemActive("MainCategory")
                      ? { backgroundColor: "#fee2e2" }
                      : null
                  }
                />
              </>
            )}
          </View>
        </View>

        <View>
          <View className="px-4 py-2 flex flex-row space-x-2 items-center">
            <Text className="font-semibold text-zinc-500 text-xs">
              Services
            </Text>
          </View>

          <View style={{ marginLeft: 5, marginRight: 5 }}>
            <DrawerItem
              label="Appointments"
              icon={({ color, size }) => (
                <CalendarDaysIcon
                  color={
                    isItemActive("AppointmentNavigator") ? "#ef4444" : "grey"
                  }
                  size={18}
                />
              )}
              onPress={() => {
                props.navigation.navigate("AppointmentNavigator");
              }}
              labelStyle={
                isItemActive("AppointmentNavigator")
                  ? { color: "#ef4444" }
                  : null
              }
              style={
                isItemActive("AppointmentNavigator")
                  ? { backgroundColor: "#fee2e2" }
                  : null
              }
            />
            {context.stateUser.user.role === "admin" && (
              <>
                <DrawerItem
                  label="Services"
                  icon={({ color, size }) => (
                    <WrenchScrewdriverIcon
                      color={
                        isItemActive("ServiceNavigator") ? "#ef4444" : "grey"
                      }
                      size={18}
                    />
                  )}
                  onPress={() => {
                    props.navigation.navigate("ServiceNavigator");
                  }}
                  labelStyle={
                    isItemActive("ServiceNavigator")
                      ? { color: "#ef4444" }
                      : null
                  }
                  style={
                    isItemActive("ServiceNavigator")
                      ? { backgroundColor: "#fee2e2" }
                      : null
                  }
                />
                <DrawerItem
                  label="Feedbacks (Mechanic)"
                  icon={({ color, size }) => (
                    <HandThumbUpIcon
                      color={
                        isItemActive("FeedbackNavigator") ? "#ef4444" : "grey"
                      }
                      size={18}
                    />
                  )}
                  onPress={() => {
                    props.navigation.navigate("FeedbackNavigator");
                  }}
                  labelStyle={
                    isItemActive("FeedbackNavigator")
                      ? { color: "#ef4444" }
                      : null
                  }
                  style={
                    isItemActive("FeedbackNavigator")
                      ? { backgroundColor: "#fee2e2" }
                      : null
                  }
                />
              </>
            )}
          </View>
        </View>

        <View>
          <View className="px-4 py-2 flex flex-row space-x-2 items-center">
            <Text className="font-semibold text-zinc-500 text-xs">
              Supplier
            </Text>
          </View>

          <View style={{ marginLeft: 5, marginRight: 5 }}>
            <DrawerItem
              label="Supplier Logs"
              icon={({ color, size }) => (
                <DocumentTextIcon
                  color={
                    isItemActive("SupplierLogNavigator") ? "#ef4444" : "grey"
                  }
                  size={18}
                />
              )}
              onPress={() => {
                props.navigation.navigate("SupplierLogNavigator");
              }}
              labelStyle={
                isItemActive("SupplierLogNavigator")
                  ? { color: "#ef4444" }
                  : null
              }
              style={
                isItemActive("SupplierLogNavigator")
                  ? { backgroundColor: "#fee2e2" }
                  : null
              }
            />
          </View>
        </View>

        {context.stateUser.user.role === "admin" && (
          <View>
            <View className="px-4 py-2 flex flex-row space-x-2 items-center">
              <Text className="font-semibold text-zinc-500 text-xs">Users</Text>
            </View>

            <View style={{ marginLeft: 5, marginRight: 5 }}>
              <DrawerItem
                label="Customers"
                icon={({ color, size }) => (
                  <UsersIcon
                    color={isItemActive("MainCustomer") ? "#ef4444" : "grey"}
                    size={18}
                  />
                )}
                onPress={() => {
                  props.navigation.navigate("MainCustomer");
                }}
                labelStyle={
                  isItemActive("MainCustomer") ? { color: "#ef4444" } : null
                }
                style={
                  isItemActive("MainCustomer")
                    ? { backgroundColor: "#fee2e2" }
                    : null
                }
              />
              <DrawerItem
                label="Suppliers"
                icon={({ color, size }) => (
                  <FontAwesomeIcon
                    icon={faUserTie}
                    color={isItemActive("MainSupplier") ? "#ef4444" : "grey"}
                    size={18}
                  />
                )}
                onPress={() => {
                  props.navigation.navigate("MainSupplier");
                }}
                labelStyle={
                  isItemActive("MainSupplier") ? { color: "#ef4444" } : null
                }
                style={
                  isItemActive("MainSupplier")
                    ? { backgroundColor: "#fee2e2" }
                    : null
                }
              />
              <DrawerItem
                label="Employees"
                icon={({ color, size }) => (
                  <FontAwesomeIcon
                    icon={faUserGear}
                    color={isItemActive("MainEmployee") ? "#ef4444" : "grey"}
                    size={18}
                  />
                )}
                onPress={() => {
                  props.navigation.navigate("MainEmployee");
                }}
                labelStyle={
                  isItemActive("MainEmployee") ? { color: "#ef4444" } : null
                }
                style={
                  isItemActive("MainEmployee")
                    ? { backgroundColor: "#fee2e2" }
                    : null
                }
              />
            </View>
          </View>
        )}
      </DrawerContentScrollView>
    </View>
  );
};

export default AdminDrawerCustom;
