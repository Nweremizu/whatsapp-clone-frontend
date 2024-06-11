/* eslint-disable no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";
import notify from "../../utils/toaster";

const appSlice = createSlice({
  name: "app",
  initialState: {
    isNewChatClicked: false,
    openSearchList: false,
    users: [],
    hideSidebar: false,
    closeChat: true,
    searchInput: "",
  },
  reducers: {
    setNewChatClicked: (state, action) => {
      state.isNewChatClicked = action.payload;
    },
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    setHideSidebar: (state, action) => {
      state.hideSidebar = action.payload;
    },
    setCloseChat: (state, action) => {
      state.closeChat = action.payload;
    },
    setOpenSearch: (state, action) => {
      state.openSearchList = action.payload;
    },
    setSearchInput: (state, action) => {
      state.searchInput = action.payload;
    },
    reset: (state) => {
      state.isNewChatClicked = false;
      state.users = [];
      state.hideSidebar = false;
      state.closeChat = true;
      state.openSearchList = false;
    },
  },
});

export default appSlice.reducer;

export function openNewChat(open) {
  return async (dispatch, getState) => {
    dispatch(appSlice.actions.setNewChatClicked(open));
  };
}

export function createNewChat(chat) {
  return async (dispatch, getState) => {
    try {
      dispatch(appSlice.actions.setNewChatClicked(false));
      notify("Chat created successfully", "success");
    } catch (error) {
      // console.error(error);
    }
  };
}

export function openSearch(open) {
  return async (dispatch, getState) => {
    dispatch(appSlice.actions.setOpenSearch(open));
  };
}

export function setSearchInput(input) {
  return async (dispatch, getState) => {
    dispatch(appSlice.actions.setSearchInput(input));
  };
}

export function getUsers(users) {
  return async (dispatch, getState) => {
    try {
      dispatch(appSlice.actions.setUsers(users));
    } catch (error) {
      notify("Could not fetch users", "error");
      // console.error(error);
    }
  };
}
export function toggleSidebar(hide) {
  return async (dispatch, getState) => {
    dispatch(appSlice.actions.setHideSidebar(hide));
  };
}

export function putcloseChat(close) {
  return async (dispatch, getState) => {
    dispatch(appSlice.actions.setCloseChat(close));
  };
}

export function resetApp() {
  return async (dispatch, getState) => {
    dispatch(appSlice.actions.reset());
  };
}
