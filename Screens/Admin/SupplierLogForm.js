import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  TextInput,
  ActivityIndicator,
} from "react-native";
import {
  Pressable,
  Image,
  Badge,
  Select,
  VStack,
  CheckIcon,
  ScrollView,
} from "native-base";
import {
  ArchiveBoxIcon,
  BanknotesIcon,
  ChevronDownIcon,
  DocumentTextIcon,
  MapPinIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  CalendarDaysIcon,
  UserIcon,
  XMarkIcon,
} from "react-native-heroicons/solid";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Dropdown } from "react-native-element-dropdown";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import Toast from "react-native-toast-message";
import { Modal, Button } from "native-base";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const SupplierLogForm = () => {
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [productList, setProductList] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [invoiceId, setInvoiceId] = useState("");
  const [dateDelivered, setDateDelivered] = useState();
  const [notes, setNotes] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [date, setDate] = useState();
  const [errors, setErrors] = useState({});

  useFocusEffect(
    useCallback(() => {
      // setLoading(true); // Start loading

      fetchProducts();
      fetchSupplier();
      setDate(new Date());

      setLoading(false);
      return () => {
        setProducts([]);
        setSuppliers([]);
      };
    }, [])
  );

  const fetchProducts = () => {
    try {
      axios.get(`${baseURL}products`).then((res) => {
        setProducts(res.data);
      });
    } catch (error) {
      console.error(error);
      // Handle errors, show an error toast, etc.
      Toast.show({
        topOffset: 60,
        type: "error",
        text1: "Something went wrong",
        text2: "Please try again",
      });
    }
  };

  const fetchSupplier = () => {
    try {
      axios.get(`${baseURL}users/suppliers`).then((res) => {
        setSuppliers(res.data);
      });
    } catch (error) {
      console.error(error);
      // Handle errors, show an error toast, etc.
      Toast.show({
        topOffset: 60,
        type: "error",
        text1: "Something went wrong",
        text2: "Please try again",
      });
    }
  };

  const productData = products.map((product) => ({
    label: `${product.name}`,
    value: product._id,
    image: product.images[0]?.url || "",
    price: product.price,
    stock: product.stock,
    brand: product.brand.name,
  }));

  console.log(products, "products");

  const supplierData = suppliers.map((supplier) => ({
    label: `${supplier.firstname} ${supplier.lastname}`,
    value: supplier._id,
    image: supplier.avatar?.url,
    phone: supplier.phone,
    email: supplier.email,
  }));

  console.log(supplierData, "supplierData");

  const addProductToList = () => {
    if (!selectedProduct || !quantity || !price) {
      Toast.show({
        topOffset: 60,
        type: "error",
        text1: "Missing Information",
        text2: "Please select a product, quantity, and price.",
      });
      return;
    }

    const productToAdd = {
      product: selectedProduct,
      quantity: parseInt(quantity),
      price: parseFloat(price),
    };

    console.log(productToAdd, "add");

    setProductList([...productList, productToAdd]);
    setSelectedProduct(null);
    setQuantity("");
    setPrice("");
  };

  const handleProductChange = (product) => {
    setSelectedProduct(product);
  };

  const handleSupplierChange = (supplier) => {
    setSelectedSupplier(supplier);
  };

  const renderProduct = (product) => {
    return (
      <View style={styles.item}>
        <View className="flex flex-row space-x-2">
          <Image
            className="rounded"
            style={{
              width: 24,
              height: 24,
            }}
            source={{
              uri: product?.image
                ? product?.image
                : "https://i.pinimg.com/originals/40/57/4d/40574d3020f73c3aa4b446aa76974a7f.jpg",
            }}
            alt="images"
          />
          <Text style={styles.textItem}>
            {product.label} ({product.brand})
          </Text>
        </View>
        {/* {product.value === selectedMechanic && <CheckIcon size={3} />} */}
      </View>
    );
  };

  const renderSupplier = (supplier) => {
    return (
      <View style={styles.item}>
        <View className="flex flex-row space-x-2">
          <Image
            className="rounded"
            style={{
              width: 24,
              height: 24,
            }}
            source={{
              uri: supplier?.image
                ? supplier?.image
                : "https://i.pinimg.com/originals/40/57/4d/40574d3020f73c3aa4b446aa76974a7f.jpg",
            }}
            alt="images"
          />
          <Text style={styles.textItem}>{supplier.label}</Text>
        </View>
        {/* {product.value === selectedMechanic && <CheckIcon size={3} />} */}
      </View>
    );
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setDate(date);
    // console.warn("A date has been picked: ", date);
    hideDatePicker();
  };

  const formattedDate = new Date(date).toLocaleDateString(); // Format date as string

  const validateForm = () => {
    let errors = {};

    if (!selectedSupplier) errors.selectedSupplier = "Supplier is required";
    if (!invoiceId) errors.invoiceId = "Invoice I.D is required";
    if (!formattedDate) errors.formattedDate = "Date delivery is required";

    if (productList.length === 0)
      errors.productList = "Please add at least one product";

    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const submitHandler = () => {
    if (!validateForm()) {
      setLoading(false);
      return;
    }

    const data = {
      supplier: selectedSupplier.value,
      products: productList.map((item) => ({
        id: item.product.value,
        productName: item.product.label,
        brandName: item.product.brand,
        price: item.price,
        quantity: item.quantity,
        brand: item.brand,
      })),
      invoiceId: invoiceId,
      notes: notes,
      dateDelivered: formattedDate,
      totalPrice:
        productList.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        ) || 0,
    };

    console.log(data, "submit handler");

    // Make a POST request to the backend API endpoint
    axios
      .post(`${baseURL}supplierLogs`, data)
      .then((response) => {
        console.log("Successfully submitted:", response.data);

        Toast.show({
          type: "success",
          text1: "Supplier log submitted successfully!",
          text2: "The supplier log has been successfully submitted.",
        });

        navigation.goBack();
      })
      .catch((error) => {
        console.error("Error submitting:", error);

        Toast.show({
          type: "error",
          text1: "Error submitting supplier log",
          text2:
            "An error occurred while submitting the supplier log. Please try again later.",
        });
      });
  };

  return (
    <KeyboardAwareScrollView className="flex-1 p-3 bg-red space-y-3">
      <View className="bg-white p-3 rounded-xl space-y-2">
        <View>
          <Text className="text-xl font-bold">Supplier Invoice</Text>
          <Text className="text-xs">
            Create new invoice. Fill up the details below.
          </Text>
        </View>

        <View className="border-b border-zinc-200" />

        <View className="space-y-2">
          <View className="space-y-1">
            <Text>Supplier</Text>
            {/* 
            <TextInput
              className="p-2 bg-zinc-100 rounded-lg"
              placeholder="Select Supplier"
            /> */}

            <View className="bg-zinc-100 rounded-xl px-2 py-1">
              <Dropdown
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={supplierData}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="Select supplier"
                searchPlaceholder="Search..."
                value={selectedSupplier}
                onChange={(supplier) => {
                  handleSupplierChange(supplier);
                }}
                renderLeftIcon={() => (
                  <UserIcon style={styles.icon} size={14} color="gray" />
                )}
                renderItem={renderSupplier}
              />
            </View>

            {errors.selectedSupplier ? (
              <Text className="text-sm text-red-500">
                {errors.selectedSupplier}
              </Text>
            ) : null}
          </View>

          <View className="space-y-1">
            <Text>Invoice I.D</Text>

            <TextInput
              className="p-2 bg-zinc-100 rounded-lg"
              placeholder="Invoice i.d"
              id="invoceId"
              name="invoceId"
              value={invoiceId}
              onChangeText={(text) => setInvoiceId(text)}
            />

            {errors.invoiceId ? (
              <Text className="text-sm text-red-500">{errors.invoiceId}</Text>
            ) : null}
          </View>

          <View className="space-y-1">
            <Text>Date Delivered</Text>

            <TouchableOpacity
              onPress={showDatePicker}
              className="p-2 bg-gray-100 text-gray-700 rounded-lg mb-1 flex-row items-center space-x-2"
            >
              <CalendarDaysIcon color="grey" size={20} />
              <TextInput
                value={formattedDate}
                placeholder="Select date"
                editable={false}
                className="text-black"
              />
            </TouchableOpacity>

            {errors.formattedDate ? (
              <Text className="text-sm text-red-500">
                {errors.formattedDate}
              </Text>
            ) : null}

            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
          </View>
        </View>
      </View>

      <View className="bg-white p-3 rounded-xl space-y-3">
        <View>
          <Text className="text-base font-semibold">Product</Text>
          <Text className="text-xs">Search and add product in here.</Text>
        </View>

        <View className="flex flex-row space-x-2">
          <View className="space-y-1 grow">
            <Text>Product</Text>

            {/* <TextInput
              className="p-2 bg-zinc-100 rounded-lg"
              placeholder="Search Product"
            /> */}

            <View className="bg-zinc-100 rounded-xl px-2 py-1">
              <Dropdown
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={productData}
                search
                dropdownPosition="top"
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="Search product"
                searchPlaceholder="Search..."
                value={selectedProduct}
                onChange={(product) => {
                  handleProductChange(product);
                }}
                renderLeftIcon={() => (
                  <ArchiveBoxIcon style={styles.icon} size={14} color="gray" />
                )}
                renderItem={renderProduct}
              />
            </View>
          </View>
        </View>

        <View className="flex flex-row space-x-2">
          <View className="space-y-1 w-1/2">
            <Text>Quantity</Text>
            <TextInput
              className="p-2 bg-zinc-100 rounded-lg"
              placeholder="Quantity"
              value={quantity}
              onChangeText={setQuantity}
              inputMode="numeric"
            />
          </View>
          <View className="space-y-1 grow">
            <Text>Price</Text>
            <TextInput
              className="p-2 bg-zinc-100 rounded-lg"
              placeholder="Price"
              value={price}
              onChangeText={setPrice}
              inputMode="numeric"
            />
          </View>
        </View>

        <TouchableOpacity
          className="bg-green-400 rounded-lg p-2"
          onPress={addProductToList}
        >
          <Text className="text-white font-semibold text-center text-xs">
            Add Product
          </Text>
        </TouchableOpacity>
      </View>

      <View className="space-y-1">
        <View
          className={
            errors.productList
              ? "border border-red-500 bg-white p-3 rounded-xl space-y-3"
              : "bg-white p-3 rounded-xl space-y-3"
          }
        >
          <View className="flex flex-row items-center">
            <View className="w-8/12">
              <Text className="text-xs font-semibold">Product</Text>
            </View>
            <View className="w-2/12 items-end">
              <Text className="text-xs font-semibold">Price</Text>
            </View>
            <View className="w-2/12 items-end">
              <Text className="text-xs font-semibold">Quantity</Text>
            </View>
          </View>

          <View className="border-b border-zinc-200" />

          <View className="space-y-1">
            {productList.length > 0 ? (
              <>
                {productList.map((item, index) => (
                  <View key={index} className="flex flex-row items-center">
                    <View className="w-8/12">
                      <Text className="">
                        {item.product.label} ({item.product.brand})
                      </Text>
                    </View>
                    <View className="w-2/12 items-end">
                      <Text className="">{item.price}</Text>
                    </View>
                    <View className="w-2/12 items-end">
                      <Text className="">{item.quantity}</Text>
                    </View>
                  </View>
                ))}
              </>
            ) : (
              <View className="flex-1 items-center justify-center">
                <Text className="text-xs text-zinc-600">
                  No product listed.
                </Text>
              </View>
            )}
          </View>

          <View className="border-b border-zinc-200" />

          <View className="flex flex-row justify-between items-center">
            <Text className="font-semibold">Grand Total:</Text>

            <Text className="font-semibold text-red-500">
              {productList.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
              )}
            </Text>
          </View>
        </View>

        {errors.productList ? (
          <Text className="text-sm text-red-500">{errors.productList}</Text>
        ) : null}
      </View>

      <View className="bg-white p-3 rounded-xl space-y-3">
        <View className="space-y-1">
          <View className="flex flex-row space-x-1 items-center">
            <Text>Notes</Text>
            <Text className="text-xs text-zinc-500">(Optional)</Text>
          </View>
          <TextInput
            textAlignVertical="top"
            multiline={true}
            numberOfLines={4}
            className="p-2 bg-zinc-100 rounded-lg"
            placeholder="Create notes here."
            value={notes}
            onChangeText={(text) => setNotes(text)}
          />
        </View>
      </View>

      <TouchableOpacity
        className={
          loading ? "bg-zinc-500 p-3 rounded-xl" : "bg-red-500 p-3 rounded-xl"
        }
        onPress={() => submitHandler()}
      >
        <Text className="text-white text-center font-semibold">Submit</Text>
      </TouchableOpacity>

      <View className="mb-3" />
    </KeyboardAwareScrollView>
  );
};

export default SupplierLogForm;

const styles = StyleSheet.create({
  dropdown: {
    margin: 16,
    height: 50,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 17,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textItem: {
    flex: 1,
    fontSize: 16,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
