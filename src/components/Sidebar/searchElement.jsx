import { Avatar } from "@mui/material";
import React from "react";
import format from "../../utils/formatString";
import { useDispatch, useSelector } from "react-redux";
// import { getSocket } from "../../socket";
import {
  createNewChat,
  openSearch,
  putcloseChat,
  setSearchInput,
  toggleSidebar,
} from "../../redux/slices/app";
import { SocketContext } from "../../context/socket";
import { getChats, setActiveChat } from "../../redux/slices/chat";

export default function SearchElement({ user }) {
  const dispatch = useDispatch();
  const socket = React.useContext(SocketContext);
  const { chats } = useSelector((state) => state.chat);

  const onClick = (id) => {
    const data = { userId: id };
    socket.emit("createChat", data, (data) => {
      // check if chat already exists by checking if the chatId is already in the chats array
      if (chats.find((chat) => chat._id === data._id)) {
        dispatch(setActiveChat(data));
        dispatch(toggleSidebar(true));
        dispatch(putcloseChat(false));
        dispatch(openSearch(false));
        dispatch(setSearchInput(""));
        return;
      }
      dispatch(createNewChat(data));
      const newChatArray = [...chats, data];
      dispatch(getChats(newChatArray));
      dispatch(setActiveChat(data));
      dispatch(toggleSidebar(true));
      dispatch(putcloseChat(false));
      dispatch(openSearch(false));
      dispatch(setSearchInput(""));
    });
  };
  return (
    <div
      onClick={() => onClick(user._id)}
      className="flex items-center gap-4 justify-between rounded p-2 cursor-pointer hover:bg-gray-100"
    >
      <div className="flex items-center gap-4">
        <Avatar sx={{ width: 50, height: 50 }} src={user?.avatar} />
      </div>
      <div className="flex flex-col w-full h-full justify-between">
        <div className="flex flex-col justify-between w-full self-start ">
          <h1 className="text-lg font-semibold">{format(user.username)}</h1>
          <p className="text-[10px] text-gray-500">{user.email}</p>
        </div>
      </div>
    </div>
  );
}
