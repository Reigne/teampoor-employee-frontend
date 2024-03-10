import jwt_decode from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import baseURL from "../../assets/common/baseUrl";

export const SET_CURRENT_USER = "SET_CURRENT_USER";

export const loginUser = (user, dispatch) => {
    fetch(`${baseURL}users/login-employee`, {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            throw new Error(data.error || "Invalid email or password");
          });
        }
        return res.json();
      })
      .then((data) => {
        const token = data.token;
        AsyncStorage.setItem("jwt", token);
        const decoded = jwt_decode(token);
        dispatch(setCurrentUser(decoded, user));
  
        Toast.show({
          topOffset: 60,
          type: "success",
          text1: "Successfully Login",
          text2: "You can now explore our shop!",
        });
      })
      .catch((err) => {
        console.error(err);
  
        if (
          err.message === "Token expired! New one has been sent to your email."
        ) {
          Toast.show({
            topOffset: 60,
            type: "error",
            text1: "Token Expired",
            text2: "A new verification link has been sent to your email.",
          });
        } else if (
          err.message === "Please check your email for the verification link."
        ) {
          Toast.show({
            topOffset: 60,
            type: "error",
            text1: "Verification Email Sent",
            text2: "Please check your email for the verification link.",
          });
        } else {
          Toast.show({
            topOffset: 60,
            type: "error",
            text1: "Login Failed",
            text2: err.message,
          });
          logoutUser(dispatch);
        }
      });
  };
  

export const getUserProfile = (id) => {
  fetch(`${baseURL}users/${id}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => console.log(data))
    .catch((err) => console.error(err));
};

export const logoutUser = (dispatch) => {
  AsyncStorage.removeItem("jwt");
  dispatch(setCurrentUser({}));
};

export const setCurrentUser = (decoded, user) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded,
    userProfile: user,
  };
};
