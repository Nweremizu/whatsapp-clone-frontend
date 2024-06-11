// socket.js (Create a separate file for socket initialization)

import io from "socket.io-client";
import instance from "./axios";
import notify from "./utils/toaster";
import { createBrowserHistory } from "history";

const token = localStorage.getItem("token");
const history = createBrowserHistory();

let socket;

export const connectSocket = () => {
  socket = io("http://localhost:3001", {
    auth: {
      token,
    },
  });

  socket.on("connect", () => {
    console.log("Socket connected");
  });

  socket.on("connect_error", async (error) => {
    if (error.message.startsWith("xhr")) {
      notify("Failed to connect to server", "error");
      console.error("Failed to connect, retrying...");
      socket.connect();
    }

    if (error.message === "jwt expired") {
      try {
        const res = await instance.post(
          "/auth/refreshToken",
          {},
          {
            withCredentials: true,
          }
        );
        const newToken = res.data.accessToken;
        localStorage.setItem("token", newToken);
        socket.auth.token = newToken;
        socket.connect();
      } catch (refreshError) {
        console.error("Failed to refresh token:", refreshError);
        history.push("/login");
        window.location.reload(); // Force a reload to ensure navigation to login
      }
    }

    if (error.message === "jwt malformed") {
      console.error("Invalid token, redirecting to login.");
      history.push("/login");
      window.location.reload(); // Force a reload to ensure navigation to login
    }
  });

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    socket = connectSocket();
  }
  return socket;
};
