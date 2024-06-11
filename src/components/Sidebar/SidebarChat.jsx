import { useContext, useEffect, useState } from "react";
import { Avatar } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { putcloseChat, toggleSidebar } from "../../redux/slices/app";
import { setActiveChat } from "../../redux/slices/chat";
import DateFormatter from "../../utils/DateFormatter";
import { SocketContext } from "../../context/socket";
import SidebarMessageBox from "./SidebarMessageBox";
import format from "../../utils/formatString";

function SidebarChat({ chat }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [lastMessage, setLastMessage] = useState({});
  const [unReadMessageCount, setUnReadMessageCount] = useState(0);
  const socket = useContext(SocketContext);
  const [chatName, setChatName] = useState("");
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    if (!chat.isGroupChat) {
      const participant = chat.users.find(
        (participant) => participant._id !== user._id
      );
      setChatName(participant?.username || "Unknown");
      setUserProfile(participant?.avatar);
    } else {
      setChatName(chat.groupName);
      setUserProfile(chat.groupImage);
    }
  }, [chat, user._id]);

  useEffect(() => {
    const handleNewMessage = (data) => {
      if (data.chatId._id === chat._id) {
        const messageContent = getMessageContent(data);
        setLastMessage({
          message: messageContent,
          timestamp: data.timestamp,
          type: getMessageType(data),
        });
        if (!data.readBy.includes(user._id)) {
          setUnReadMessageCount((prevCount) => prevCount + 1);
        }
      }
    };

    socket.on("newSide", handleNewMessage);

    return () => {
      socket.off("newSide", handleNewMessage);
    };
  }, [chat._id, user._id, socket]);

  useEffect(() => {
    const handleGetLastMessage = (data) => {
      if (data.chatId._id === chat._id) {
        const messageContent = getMessageContent(data);
        setLastMessage({
          message: messageContent,
          timestamp: data.timestamp,
          type: getMessageType(data),
        });
      }
    };

    const handleGetUnreadMessagesCount = (count) => {
      setUnReadMessageCount(count);
    };

    socket.emit("getLastMessage", { chatId: chat._id }, handleGetLastMessage);
    socket.emit(
      "getUnreadMessagesCount",
      { chatId: chat._id },
      handleGetUnreadMessagesCount
    );

    return () => {
      socket.off("getLastMessage", handleGetLastMessage);
      socket.off("getUnreadMessagesCount", handleGetUnreadMessagesCount);
    };
  }, [chat._id, socket]);

  useEffect(() => {
    const handleRead = (data) => {
      if (data.chatId === chat._id && data.userId === user._id) {
        setUnReadMessageCount(0);
      }
    };

    socket.on("read", handleRead);

    return () => {
      socket.off("read", handleRead);
    };
  }, [chat._id, socket, user._id]);

  const handleChatClick = () => {
    dispatch(toggleSidebar(true));
    dispatch(putcloseChat(false));
    dispatch(setActiveChat(chat));
  };

  const getMessageContent = (data) => {
    if (data.imageUrl) return { type: "Image", message: "Image" };
    if (data.videoUrl) return { type: "Video", message: "Video" };
    return { type: "Text", message: data.message };
  };

  const getMessageType = (data) => {
    if (data.sender?._id === user._id)
      return data.chatId.isGroupChat ? "" : "You: ";
    return data.chatId.isGroupChat ? `${data.sender.username}: ` : "";
  };

  return (
    <div
      onClick={handleChatClick}
      className="flex items-center gap-4 rounded p-2.5 hover:bg-gray-100 h-18 cursor-pointer"
    >
      <Avatar sx={{ width: 50, height: 50 }} src={userProfile} />
      <div className="flex flex-col w-full h-full justify-between">
        <div className="flex justify-between w-full self-start mt-1">
          <h1 className="text-sm font-semibold flex gap-1 !truncate max-w-[80px]  xl:max-w-[100px]">
            {format(chatName)}
          </h1>
          {lastMessage.timestamp && (
            <p
              className={`text-xs ${unReadMessageCount > 0 ? "!text-green-800 font-semibold" : "text-gray-400"}`}
            >
              {DateFormatter(lastMessage.timestamp)}
            </p>
          )}
        </div>
        <div className="flex justify-between w-full self-end items-center">
          <SidebarMessageBox
            message={lastMessage.message}
            type={lastMessage.type}
          />
          {unReadMessageCount > 0 && (
            <div className="min-w-4 min-h-3 rounded-full bg-whatsapp-green px-1">
              <p className="text-[10px] text-white text-center">
                {unReadMessageCount}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SidebarChat;
