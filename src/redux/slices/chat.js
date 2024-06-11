import { createSlice, current } from "@reduxjs/toolkit";
// import axios from "../../axios";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chats: [],
    activeChat: null,
    currentMessages: [],
    unreadingMessages: {},
    lastMessages: {},
  },
  reducers: {
    setChats: (state, action) => {
      state.chats = action.payload;
    },
    putActiveChat: (state, action) => {
      state.activeChat = action.payload;
    },
    setCurrentChatOffline: (state, action) => {
      state.activeChat.users = state.activeChat.users.map((user) => {
        if (user._id === action.payload) {
          user.status = "offline";
        }
        return user;
      });
    },
    setCurrentChatOnline: (state, action) => {
      state.activeChat.users = state.activeChat.users.map((user) => {
        if (user._id === action.payload) {
          user.status = "online";
        }
        return user;
      });
    },
    setMessages: (state, action) => {
      state.currentMessages = action.payload;
    },
    setUnreadingMessages: (state, action) => {
      state.unreadingMessages = action.payload;
    },
    setLastMessages: (state, action) => {
      state.lastMessages = action.payload;
    },
    reset: (state) => {
      state.chats = [];
      state.activeChat = null;
      state.currentMessages = [];
      state.lastMessages = {};
      state.unreadingMessages = {};
    },
  },
});

export default chatSlice.reducer;

// Get All Chats
export function getChats(chats) {
  return async (dispatch, getState) => {
    try {
      dispatch(chatSlice.actions.setChats(chats));
    } catch (error) {
      console.error(error);
    }
  };
}

// To Set the Active Selected Chat
export function setActiveChat(chat) {
  return async (dispatch, getState) => {
    try {
      dispatch(chatSlice.actions.putActiveChat(chat));
    } catch (error) {
      console.error(error);
    }
  };
}

// To get all messages
export function getMessages(messages) {
  return async (dispatch, getState) => {
    try {
      dispatch(chatSlice.actions.setMessages(messages));
    } catch (error) {
      console.error(error);
    }
  };
}

// To set the User to be  offline
export function setUserOffline(userId) {
  return async (dispatch, getState) => {
    try {
      dispatch(chatSlice.actions.setCurrentChatOffline(userId));
    } catch (error) {
      console.error(error);
    }
  };
}

// To set the User Online
export function setUserOnline(userId) {
  return async (dispatch, getState) => {
    try {
      dispatch(chatSlice.actions.setCurrentChatOnline(userId));
    } catch (error) {
      console.error(error);
    }
  };
}

// To set unread messages Count
export function setUnreadingMessages(messages) {
  return async (dispatch, getState) => {
    try {
      dispatch(chatSlice.actions.setUnreadingMessages(messages));
    } catch (error) {
      console.error(error);
    }
  };
}

// To get the last messages of all chats
export function setLastMessages(messages) {
  return async (dispatch, getState) => {
    try {
      dispatch(chatSlice.actions.setLastMessages(messages));
    } catch (error) {
      console.error(error);
    }
  };
}

// to reset
export function resetChat() {
  return async (dispatch, getState) => {
    dispatch(chatSlice.actions.reset());
  };
}
