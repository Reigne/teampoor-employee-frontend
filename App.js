import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
// import Main from './Navigators/Main';
import Main from "./Navigators/Main";
import { NavigationContainer } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import Auth from "./Context/Store/Auth";
import { Provider } from "react-redux";
import { NativeBaseProvider, extendTheme } from "native-base";
import store from "./Redux/store";

export default function App() {
  return (
    // <View style={styles.container}>
    //   <Text>Open up App.js to start working on your app!</Text>
    //   <StatusBar style="auto" />
    // </View>
    <Auth>
      <Provider store={store}>
        <NativeBaseProvider>
          <NavigationContainer>
            <Main />
            <Toast />
            <StatusBar style="auto" />
          </NavigationContainer>
        </NativeBaseProvider>
      </Provider>
    </Auth>
  );
}
