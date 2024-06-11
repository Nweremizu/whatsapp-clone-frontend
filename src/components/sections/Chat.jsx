import React, { useEffect } from "react";
import ChatHeader from "../Chat/ChatHeader";
import ChatBody from "../Chat/ChatBody";
import ChatFooter from "../Chat/ChatFooter";
import { useSelector, useDispatch } from "react-redux";
import {
  getMessages,
  setActiveChat,
  setUserOffline,
  setUserOnline,
} from "../../redux/slices/chat";
import { SocketContext } from "../../context/socket";
// import { getSocket } from "../../socket";

function Chat({ isMobile }) {
  const hide = useSelector((state) => state.app.hideSidebar);
  const hideSidebar = isMobile ? (hide ? "" : "hidden") : "";
  const isMobileSidebar = isMobile ? "w-full" : "";
  const { activeChat, currentMessages } = useSelector((state) => state.chat);
  const dispatch = useDispatch();
  const socket = React.useContext(SocketContext);

  useEffect(() => {
    // get the current chat
    socket.emit("getCurrentChat", { chatId: activeChat?._id }, (data) => {
      dispatch(setActiveChat(data));
    });

    // listen for online and offline users
    socket.on("online", (data) => {
      dispatch(setUserOnline(data));
    });

    socket.on("offline", (data) => {
      dispatch(setUserOffline(data));
    });

    // cleanup
    return () => {
      socket.off("getCurrentChat");
      socket.off("online");
      socket.off("offline");
    };
  }, [activeChat?._id, dispatch, socket]);

  // mark as read
  useEffect(() => {
    // mark as read when the chat is active and there are messages
    if (activeChat && socket && currentMessages.length > 0) {
      // mark as read
      socket.emit("markAsRead", { chatId: activeChat?._id });
    }

    // cleanup
    return () => {
      socket.off("markAsRead");
    };
  }, [socket, activeChat?._id, activeChat, currentMessages.length]);

  // get all messages
  useEffect(() => {
    // get all messages
    socket.emit("getMessages", { chatId: activeChat?._id }, (data) => {
      dispatch(getMessages(data));
    });

    // cleanup
    return () => {
      socket.off("getMessages");
    };
  }, [socket, activeChat?._id, dispatch]);

  // to listen for new messages

  // listen for deleted messages
  useEffect(() => {
    socket.on("messageDeleted", (data) => {
      const newMessages = currentMessages.filter(
        (message) => message._id !== data
      );
      dispatch(getMessages(newMessages));
    });
    return () => {
      socket.off("messageDeleted");
    };
  }, [socket, currentMessages, dispatch]);

  return (
    <div
      className={`flex w-full ${hideSidebar} ${isMobileSidebar} flex-col md:w-[70%] xl:w-[80%] 2xl:w-[75%]`}
    >
      <ChatHeader />
      <ChatBody isMobile={isMobile} />
      <ChatFooter />
    </div>
  );
}

export default Chat;
