import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import baseURL from "../../assets/common/baseUrl";
import ProductPriceList from "./ProductPriceList";
import { Dropdown } from "react-native-element-dropdown";
import { MagnifyingGlassIcon, XMarkIcon } from "react-native-heroicons/solid";

const ProductPriceLogs = () => {
  const [productLogs, setProductLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [productFilter, setProductFilter] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState();

  useEffect(() => {
    fetchProductLogs();
    fetchProducts();

    return () => {
      setProductLogs([]);
      setProductFilter([]);
      setProducts([]);
    };
  }, []);

  const fetchProductLogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseURL}products/price-history`);
      setProductLogs(response.data.priceHistory);
      setProductFilter(response.data.priceHistory);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching product logs:", error);
      setLoading(false);
    }
  };

  const fetchProducts = () => {
    axios
      .get(`${baseURL}products`)
      .then((res) => {
        console.log(res.data);
        setProducts(res.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  };

  const resetSearch = () => {
    setProductFilter(productLogs); // Reset filtered product data to original product logs
    setSelectedProduct(null); // Reset selected product
  };

  const searchProduct = (id) => {
    console.log(id, "id");
    console.log(productFilter, "productFilter");
    console.log(productLogs, "search");
    if (id === "") {
      setProductFilter(productLogs);
    } else {
      setProductFilter(productLogs.filter((item) => item.product.id === id));
    }
  };

  const data = products.map((product) => ({
    label: product.name,
    value: product._id,
    _id: product._id,
    image: product.images[0]?.url || "",
  }));

  const renderProductDropdown = (product) => {
    return (
      <View style={styles.item}>
        <View className="flex flex-row space-x-2 items-center">
          <Image
            className="rounded"
            height={24}
            width={24}
            source={{
              uri: product.image
                ? product.image
                : "https://i.pinimg.com/originals/40/57/4d/40574d3020f73c3aa4b446aa76974a7f.jpg",
            }}
            alt="Product Image"
          />
          <Text style={styles.textItem}>{product.label}</Text>
        </View>
      </View>
    );
  };

  const ListHeader = () => {
    return (
      <View className="p-5 bg-red-500 rounded-lg">
        <View className="flex flex-row justify-between">
          <View className="flex-1 justify-center items-start">
            <Text className="font-bold text-white">Name</Text>
          </View>
          <View className="flex-1 justify-center items-start">
            <Text className="font-bold text-white">Price</Text>
          </View>
          <View className="flex-1 justify-center items-start">
            <Text className="font-bold text-white">Status</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 p-3">
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="red" />
        </View>
      ) : (
        <View className="space-y-2">
          <View className="flex flex-row items-center space-x-2">
            <View className="bg-white p-2 rounded-xl grow">
              <Dropdown
                data={data}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="Select Product"
                searchPlaceholder="Search Product"
                value={selectedProduct}
                onChange={(product) => {
                  setSelectedProduct(product._id);
                  searchProduct(product._id);
                }}
                renderLeftIcon={() => (
                  <MagnifyingGlassIcon size={20} color="black" />
                )}
                renderItem={renderProductDropdown}
              />
            </View>
            {selectedProduct && (
              <TouchableOpacity onPress={resetSearch}>
                {/* <XMarkIcon size={18} color="red" /> */}
                <Text className="text-xs text-red-500">Reset</Text>
              </TouchableOpacity>
            )}
          </View>

          <FlatList
            ListHeaderComponent={ListHeader}
            data={productFilter}
            renderItem={({ item, index }) => (
              <View className="mt-1 bg-white rounded-lg">
                <ProductPriceList item={item} index={index} />
              </View>
            )}
            keyExtractor={(item) => item._id}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "red",
    borderRadius: 10,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
  dropdownContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  itemContainer: {
    backgroundColor: "white",
    marginBottom: 10,
    borderRadius: 10,
  },
  item: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textItem: {
    flex: 1,
    fontSize: 16,
  },
});

export default ProductPriceLogs;
