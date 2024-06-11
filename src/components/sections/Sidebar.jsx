import React, { lazy, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SidebarHeader from "../Sidebar/SidebarHeader";
import { getChats } from "../../redux/slices/chat";
import { SocketContext } from "../../context/socket";
import SearchList from "../Sidebar/SearchList";

const Search = lazy(() => import("../Sidebar/Search"));
const SidebarList = lazy(() => import("../Sidebar/SidebarList"));
const UserList = lazy(() => import("../Sidebar/userList"));

function Sidebar({ isMobile }) {
  const dispatch = useDispatch();
  const socket = React.useContext(SocketContext);
  const [searchResults, setSearchResults] = useState([]);
  const { chats } = useSelector((state) => state.chat);
  const { openSearchList } = useSelector((state) => state.app);
  const { hideSidebar, isNewChatClicked } = useSelector((state) => state.app);

  useEffect(() => {
    const handleGetChats = (data) => {
      // sort chats by last messageTime
      if (data.length > 0) {
        data.sort((a, b) => {
          return (
            new Date(b.lastMessageTime).getTime() -
            new Date(a.lastMessageTime).getTime()
          );
        });
      }
      dispatch(getChats(data));
    };
    socket.emit("getChats", handleGetChats);
    // socket.on("getChats", handleGetChats);

    return () => {
      socket.off("getChats");
    };
  }, [dispatch, socket, chats]);

  return (
    <div
      className={`flex flex-col ${hideSidebar && isMobile && "hidden"} ${isMobile && "w-full"} border-r px-2 py-1 md:w-[30%] xl:w-[20%] rounded-tl-lg 2xl:w-[25%] bg-white`}
    >
      <SidebarHeader />
      <Search setSearchResults={setSearchResults} />
      {searchResults.length === 0 && !openSearchList ? (
        isNewChatClicked ? (
          <UserList />
        ) : (
          <SidebarList />
        )
      ) : (
        <SearchList searchResults={searchResults} />
      )}
    </div>
  );
}

export default Sidebar;
