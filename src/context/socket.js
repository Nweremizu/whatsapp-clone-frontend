import { createContext } from "react";
import socketio from "socket.io-client";
import instance from "../axios";
import notify from "../utils/toaster";
import { createBrowserHistory } from "history";

const history = createBrowserHistory();

export const connectSocket = () => {
  // eslint-disable-next-line no-undef
  const socket = socketio(process.env.SOCKET, {
    auth: {
      token: localStorage.getItem("token"),
    },
  });

  socket.on("connect", () => {
    console.log("Socket connected");
  });

  socket.on("connect_error", async (error) => {
    console.log("Connection error:", error.message);

    if (error.message.startsWith("xhr")) {
      notify("Failed to connect to server", "error");
      console.error("Failed to connect, retrying...");
      console.log("Retrying connection...");
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

export const socket = connectSocket();

export const SocketContext = createContext();
