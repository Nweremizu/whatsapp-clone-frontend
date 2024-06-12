import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import { useSelector } from "react-redux";
import SidebarChat from "./SidebarChat";
import useResponsive from "../../hooks/useResponsive";

function SidebarList() {
  const { chats } = useSelector((state) => state.chat);
  const isMobile = useResponsive();
  return (
    <div>
      {chats.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <h1 className="text-gray-400">No chats</h1>
        </div>
      ) : (
        <SimpleBar
          style={{
            maxHeight: `calc(100vh -${isMobile ? "10rem" : "9.1rem"})`,
            scrollbarWidth: "thin",
            paddingRight: "8px",
          }}
        >
          {chats.map((chat) => (
            <SidebarChat key={chat._id} chat={chat} />
          ))}
        </SimpleBar>
      )}
    </div>
  );
}

export default SidebarList;
