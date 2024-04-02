import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  TouchableHighlight,
} from "react-native";
import { Box, Divider, ScrollView, useToast } from "native-base";
import { useFocusEffect } from "@react-navigation/native";
import { Searchbar } from "react-native-paper";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import baseURL from "../../assets/common/baseUrl";
import CustomerList from "./CustomerList";
import SupplierList from "./SupplierList";
import Toast from "react-native-toast-message";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  ArchiveBoxIcon,
  CalendarDaysIcon,
  CheckBadgeIcon,
  MagnifyingGlassCircleIcon,
  Squares2X2Icon,
  TruckIcon,
  UserGroupIcon,
  WrenchScrewdriverIcon,
  XMarkIcon,
} from "react-native-heroicons/solid";
import { BarChart, LineChart } from "react-native-gifted-charts";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons/faCircle";
import { faMotorcycle } from "@fortawesome/free-solid-svg-icons/faMotorcycle";

const Dashboard = () => {
  const [totalProduct, setTotalProduct] = useState(null);
  const [totalServices, setTotalServices] = useState(null);
  const [totalAppointments, setTotalAppointments] = useState(null);
  const [totalOrders, setTotalOrders] = useState(null);
  const [totalBrands, setTotalBrands] = useState(null);
  const [totalCategories, setTotalCategories] = useState(null);
  const [totalUsers, setTotalUsers] = useState(null);
  const [totalMotorcycles, setTotalMotorcycles] = useState(null);
  const [productStocks, setProductStocks] = useState([]);
  const [chartOrders, setChartOrders] = useState([]);
  const [mostPurchasedProduct, setMostPurchasedProduct] = useState(null);

  const [loading, setLoading] = useState(true);

  const toast = useToast();

  useFocusEffect(
    useCallback(() => {
      fetchTotalProducts();
      fetchTotalServices();
      fetchTotalAppointments();
      fetchTotalOrders();
      fetchTotalCategories();
      fetchTotalBrands();
      fetchTotalUsers();
      fetchTotalMotorcycles();
      fetchProductStocks();
      fetchTotalOrderCharts();
      fetchMostPurchasedProduct();

      return () => {
        // setAppointments([]);
      };
    }, [])
  );

  const fetchMostPurchasedProduct = async () => {
    try {
      const response = await axios.get(
        `${baseURL}dashboards/most-purchased-product`
      );
      setMostPurchasedProduct(response.data.mostPurchasedProducts);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTotalProducts = async () => {
    axios
      .get(`${baseURL}dashboards/total-products`)
      .then((res) => {
        setTotalProduct(res.data.totalProducts);
      })
      .catch((error) => console.log(error));
  };

  const fetchTotalServices = async () => {
    axios
      .get(`${baseURL}dashboards/total-services`)
      .then((res) => {
        setTotalServices(res.data.totalServices);
      })
      .catch((error) => console.log(error));
  };

  const fetchTotalAppointments = async () => {
    axios
      .get(`${baseURL}dashboards/total-appointments`)
      .then((res) => {
        setTotalAppointments(res.data.totalAppointments);
      })
      .catch((error) => console.log(error));
  };

  const fetchTotalOrders = async () => {
    axios
      .get(`${baseURL}dashboards/total-orders`)
      .then((res) => {
        setTotalOrders(res.data.totalOrders);
      })
      .catch((error) => console.log(error));
  };

  const fetchTotalBrands = async () => {
    axios
      .get(`${baseURL}dashboards/total-brands`)
      .then((res) => {
        setTotalBrands(res.data.totalBrands);
      })
      .catch((error) => console.log(error));
  };

  const fetchTotalCategories = async () => {
    axios
      .get(`${baseURL}dashboards/total-categories`)
      .then((res) => {
        setTotalCategories(res.data.totalCategories);
      })
      .catch((error) => console.log(error));
  };

  const fetchTotalUsers = async () => {
    axios
      .get(`${baseURL}dashboards/total-users`)
      .then((res) => {
        setTotalUsers(res.data.totalUsers);
      })
      .catch((error) => console.log(error));
  };

  const fetchTotalMotorcycles = async () => {
    axios
      .get(`${baseURL}dashboards/total-motorcycles`)
      .then((res) => {
        setTotalMotorcycles(res.data.totalMotorcycles);
      })
      .catch((error) => console.log(error));
  };

  const fetchTotalOrderCharts = async () => {
    axios
      .get(`${baseURL}dashboards/orders-charts`)
      .then((res) => {
        setChartOrders(res.data.orders);
      })
      .catch((error) => console.log(error));
  };

  // Function to get color based on index
  const getColor = (index) => {
    const colors = [
      "#64748b",
      "#ef4444",
      "#fbbf24",
      "#a3e635",
      "#4ade80",
      "#2dd4bf",
      "#38bdf8",
      "#818cf8",
    ];
    return colors[index % colors.length];
  };

  // Transforming productStocks into data format suitable for BarChart
  const barData = productStocks.map((product, index) => ({
    value: product.stock,
    label: product.name,
    frontColor: getColor(index), // Assigning color based on index
  }));

  const mostPurchasedBarData = mostPurchasedProduct?.map((item, index) => ({
    value: item.sold,
    label: item.productName,
    frontColor: getColor(index), // Assigning color based on index
  }));

  const formatMonth = (dateString) => {
    const date = new Date(dateString);
    const month = date.toLocaleString("default", { month: "short" }); // Get abbreviated month name like "Jan"
    return month;
  };

  const orderLineData = chartOrders.map((order, index) => ({
    value: order.totalOrders,
    dataPointText: order.totalOrders,
    date: order._id, // Assigning color based on index
    label: formatMonth(order._id), // Format the date
  }));

  console.log(mostPurchasedProduct, "orderLineData");

  const fetchProductStocks = async () => {
    try {
      const response = await axios.get(`${baseURL}dashboards/product-stocks`);
      setProductStocks(response.data.products);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(barData, "asddd");

  // Custom legend component
  // const renderLegendComponent = () => {
  //   return (
  //     <View className="flex space-y-1">
  //       {barData.map((product, index) => (
  //         <View className="flex flex-row items-center space-x-2" key={index}>
  //           <FontAwesomeIcon
  //             icon={faCircle}
  //             color={product.frontColor}
  //             size={14}
  //           />
  //           <Text className="">{product.label}</Text>
  //         </View>
  //       ))}
  //     </View>
  //   );
  // };

  return (
    <KeyboardAwareScrollView className="flex-1 bg-zinc-100 p-3 space-y-3">
      {/* <Text>Dashboard</Text> */}

      <View className="space-y-1 flex-1 flex-row flex-wrap justify-between items-center ">
        <View className="w-1/2 border-2 border-white flex flex-row bg-blue-500 rounded-xl p-3 items-center space-x-3">
          <View className="bg-blue-400 p-2 rounded-lg">
            <ArchiveBoxIcon color="white" size={24} />
          </View>
          <View className="flex-1 flex-col">
            <Text className="font-semibold text-white">Total Products</Text>
            <Text className="font-semibold text-white">{totalProduct}</Text>
          </View>
        </View>

        <View className="w-1/2 border-2 border-white flex flex-row bg-amber-500 rounded-xl p-3 items-center space-x-3">
          <View className="bg-amber-400 p-2 rounded-lg">
            <WrenchScrewdriverIcon color="white" size={24} />
          </View>
          <View className="flex-1 flex-col">
            <Text className="font-semibold text-white">Total Services</Text>
            <Text className="font-semibold text-white">{totalServices}</Text>
          </View>
        </View>

        <View className="w-1/2 border-2 border-white flex flex-row bg-red-500 rounded-xl p-3 items-center space-x-3">
          <View className="bg-red-400 p-2 rounded-lg">
            <CheckBadgeIcon color="white" size={24} />
          </View>
          <View className="flex-1 flex-col">
            <Text className="font-semibold text-white">Total Brands</Text>
            <Text className="font-semibold text-white">{totalBrands}</Text>
          </View>
        </View>

        <View className="w-1/2 border-2 border-white flex flex-row bg-violet-500 rounded-xl p-3 items-center space-x-3">
          <View className="bg-violet-400 p-2 rounded-lg">
            <Squares2X2Icon color="white" size={24} />
          </View>
          <View className="flex-1 flex-col">
            <Text className="font-semibold text-white text-xs">
              Total Categories
            </Text>
            <Text className="font-semibold text-white">{totalCategories}</Text>
          </View>
        </View>

        <View className="w-1/2 border-2 border-white flex flex-row bg-amber-500 rounded-xl p-3 items-center space-x-3">
          <View className="bg-amber-400 p-2 rounded-lg">
            <CalendarDaysIcon color="white" size={24} />
          </View>
          <View className="flex-1 flex-col">
            <Text className="font-semibold text-white text-xs">
              Appointments
            </Text>
            <Text className="font-semibold text-white">
              {totalAppointments}
            </Text>
          </View>
        </View>

        <View className="w-1/2 border-2 border-white flex flex-row bg-red-500 rounded-xl p-3 items-center space-x-3">
          <View className="bg-red-400 p-2 rounded-lg">
            <TruckIcon color="white" size={24} />
          </View>
          <View className="flex-1 flex-col">
            <Text className="font-semibold text-white">Orders</Text>
            <Text className="font-semibold text-white">{totalOrders}</Text>
          </View>
        </View>

        <View className="w-1/2 border-2 border-white flex flex-row bg-violet-500 rounded-xl p-3 items-center space-x-3">
          <View className="bg-violet-400 p-2 rounded-lg">
            <UserGroupIcon color="white" size={24} />
          </View>
          <View className="flex-1 flex-col">
            <Text className="font-semibold text-white">Users</Text>
            <Text className="font-semibold text-white">{totalUsers}</Text>
          </View>
        </View>

        <View className="w-1/2 border-2 border-white flex flex-row bg-blue-500 rounded-xl p-3 items-center space-x-3">
          <View className="bg-blue-400 p-2 rounded-lg">
          <FontAwesomeIcon icon={faMotorcycle} color="white"  size={24} />
          </View>
          <View className="flex-1 flex-col">
            <Text className="font-semibold text-white">Motorcycles</Text>
            <Text className="font-semibold text-white">{totalMotorcycles}</Text>
          </View>
        </View>
      </View>

      <View className="bg-white rounded-xl p-3 overflow-hidden ">
        <View className="mb-2">
          <Text className="text-xl font-semibold">Products</Text>
          <Text className="text-xs ">Total quantity per product</Text>
        </View>

        <BarChart
          barWidth={22}
          barBorderRadius={4}
          frontColor="lightgray"
          data={barData}
          yAxisThickness={0}
          xAxisThickness={0}
          noOfSections={8}
          onPress={(item, index) =>
            toast.show({
              render: () => {
                return (
                  <View className="bg-zinc-600 p-2 rounded-full flex flex-row items-center space-x-2">
                    <FontAwesomeIcon
                      icon={faCircle}
                      color={item.frontColor}
                      size={12}
                    />
                    <Text className="text-white text-xs">
                      {item.label} ({item.value})
                    </Text>
                  </View>
                );
              },
            })
          }
        />

        {/* <View className="p-5">{renderLegendComponent()}</View> */}
      </View>

      <View className="bg-white rounded-xl p-3 overflow-hidden">
        <View className="mb-2">
          <Text className="text-xl font-semibold">Orders</Text>
          <Text className="text-xs ">Total orders per day</Text>
        </View>

        <LineChart
          areaChart
          data={orderLineData}
          // width={300}
          // hideDataPoints
          // spacing={10}
          color="red"
          thickness={2}
          startFillColor="red"
          endFillColor="red"
          startOpacity={0.9}
          endOpacity={0.2}
          initialSpacing={0}
          noOfSections={6}
          // maxValue={600}
          yAxisColor="white"
          yAxisThickness={0}
          rulesType="solid"
          // rulesColor="gray"

          yAxisSide="right"
          xAxisColor="lightgray"
          textColor1="black"
          textShiftY={-8}
          textShiftX={-10}
          // showVerticalLines

          verticalLinesColor="rgba(14,164,164,0.5)"
          pointerConfig={{
            pointerStripHeight: 160,
            pointerStripColor: "lightgray",
            pointerStripWidth: 2,
            pointerColor: "lightgray",
            radius: 6,
            pointerLabelWidth: 100,
            pointerLabelHeight: 90,
            activatePointersOnLongPress: true,
            autoAdjustPointerLabelPosition: false,
            pointerLabelComponent: (items) => {
              return (
                <View
                  style={{
                    height: 90,
                    width: 100,
                    justifyContent: "center",
                    marginTop: -30,
                    marginLeft: -40,
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: 14,
                      marginBottom: 6,
                      textAlign: "center",
                    }}
                  >
                    {items[0].date}
                  </Text>

                  <View
                    style={{
                      paddingHorizontal: 14,
                      paddingVertical: 6,
                      borderRadius: 16,
                      backgroundColor: "white",
                    }}
                  >
                    <Text style={{ fontWeight: "bold", textAlign: "center" }}>
                      {"$" + items[0].value + ".0"}
                    </Text>
                  </View>
                </View>
              );
            },
          }}
        />
      </View>

      <View className="bg-white rounded-xl p-3 overflow-hidden mb-5">
        <View className="mb-2">
          <Text className="text-xl font-semibold">Products</Text>
          <Text className="text-xs ">Most Purchased Product</Text>
        </View>
        <BarChart
          barWidth={22}
          barBorderRadius={4}
          frontColor="lightgray"
          data={mostPurchasedBarData}
          yAxisThickness={0}
          xAxisThickness={0}
          noOfSections={8}
          onPress={(item, index) =>
            toast.show({
              render: () => {
                return (
                  <View className="bg-zinc-600 p-2 rounded-full flex flex-row items-center space-x-2">
                    <FontAwesomeIcon
                      icon={faCircle}
                      color={item.frontColor}
                      size={12}
                    />
                    <Text className="text-white text-xs">
                      {item.label} ({item.value})
                    </Text>
                  </View>
                );
              },
            })
          }
        />
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  legendContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  colorCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  legendText: {
    fontSize: 14,
  },
});

export default Dashboard;
