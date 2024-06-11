import { createSlice } from "@reduxjs/toolkit";
import axios from "../../axios";
import notify from "../../utils/toaster";
import { Navigate } from "react-router-dom";
import { resetChat } from "./chat";
import { resetApp } from "./app";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isLoggedIn: false,
    token: null,
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
      state.isLoggedIn = true;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      state.token = null;
    },
    setUser: (state, action) => {
      state.user.username = action.payload.username;
      state.user.email = action.payload.email;
    },
    setAvatar: (state, action) => {
      state.user.avatar = action.payload.avatar;
    },
  },
});

export default authSlice.reducer;

// Toast Helper
export function AppointUser(user) {
  return async (dispatch, getState) => {
    dispatch(
      authSlice.actions.setUser({
        username: user.username,
        email: user.email,
      })
    );
    notify("Profile Updated ✨", "success");
  };
}

export function AppointAvatar(avatar) {
  return async (dispatch, getState) => {
    dispatch(
      authSlice.actions.setAvatar({
        avatar: avatar,
      })
    );
    notify("Profile Updated ✨", "success");
  };
}

export function LoginUser(formValues) {
  return async (dispatch, getState) => {
    try {
      const res = await axios.post("/auth/login", formValues, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      localStorage.setItem("token", res.data.accessToken);
      if (res.data.user) {
        dispatch(
          authSlice.actions.login({
            user: res.data.user,
            token: res.data.accessToken,
          })
        );
      }
      notify("Logged in successfully", "success");
      return { success: true };
    } catch (error) {
      if (error.message === "Network Error") {
        notify("Server is down", "error");
      } else {
        notify("Invalid email or password", "error");
      }
      return { success: false };
    }
  };
}

export function LogoutUser() {
  return async (dispatch, getState) => {
    try {
      await axios.post("/auth/logout");
      localStorage.removeItem("token");
      await dispatch(authSlice.actions.logout());
      await dispatch(resetChat());
      await dispatch(resetApp());
      notify("Logged out successfully", "success");
      window.location.reload();
    } catch (error) {
      // if server is down send to login page
      if (error.message === "Network Error") {
        notify("Server is down", "error");
        dispatch(authSlice.actions.logout());
        Navigate("/login");
      }
    }
  };
}

export function RegisterUser(formValues) {
  return async (dispatch, getState) => {
    try {
      const res = await axios.post("/auth/signup", formValues, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      localStorage.setItem("token", res.data.accessToken);
      if (res.data.user) {
        dispatch(
          authSlice.actions.login({
            user: res.data.user,
            token: res.data.accessToken.token,
          })
        );
      }
      notify("Registered successfully", "success");
      return { success: true };
    } catch (error) {
      if (error.message === "Network Error") {
        notify("Server is down", "error");
      } else {
        notify("Email already exists", "error");
      }
      return { success: false };
    }
  };
}
