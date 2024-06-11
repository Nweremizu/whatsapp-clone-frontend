import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import SimpleBar from "simplebar-react";
import ChatMessage from "./ChatMessage";
import chatBg from "../../assets/image.png";
import { useDispatch, useSelector } from "react-redux";
import { Copy, ArrowBendDoubleUpRight, Trash } from "@phosphor-icons/react";
import { SocketContext } from "../../context/socket";
import { getMessages } from "../../redux/slices/chat";

export default function ChatBody({ isMobile }) {
  const [openContextMenuId, setOpenContextMenuId] = useState(null);
  const [contextMenuPosition, setContextMenuPosition] = useState(null);
  const { activeChat, currentMessages } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);
  const socket = React.useContext(SocketContext);
  const dispatch = useDispatch();
  const [isTyping, setIsTyping] = useState(false);

  // Reference to the chat container
  const chatContainerRef = useRef(null);

  const menuOptions = [
    {
      name: "Copy",
      icon: <Copy size={16} />,
      action: (id, txt) => navigator.clipboard.writeText(txt),
    },
    {
      name: "Forward",
      icon: <ArrowBendDoubleUpRight size={16} />,
      action: () => {},
    },
    {
      name: "Delete",
      icon: <Trash size={16} />,
      action: (id) => {
        socket.emit("deleteMessage", { messageId: id });
      },
    },
  ];

  useEffect(() => {
    const handleClick = () => {
      setOpenContextMenuId(null);
    };
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  useEffect(() => {
    socket.on("new", (data) => {
      // console.log(data);
      if (data.chatId._id === activeChat?._id) {
        const newMessages = [...currentMessages, data];
        dispatch(getMessages(newMessages));
      }
    });

    return () => {
      socket.off("new");
    };
  }, [socket, activeChat, dispatch, currentMessages]);

  const handleContextMenu = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenContextMenuId(id);
    const rect = e.target.getBoundingClientRect();
    setContextMenuPosition({
      x: e.clientX - rect.left + 70,
      y: e.clientY - rect.top + 40,
    });
  };

  useEffect(() => {
    socket.on("typing", (data) => {
      if (
        data.chatId === activeChat._id &&
        data.isTyping &&
        data.userId !== user._id
      ) {
        setIsTyping(true);
      } else {
        setIsTyping(false);
      }
    });

    return () => {
      socket.off("typing");
    };
  });

  // Function to scroll to the bottom
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  // Scroll to bottom when messages change
  useLayoutEffect(() => {
    scrollToBottom();
  }, [currentMessages]);

  return (
    <div className="flex-1 bg-contain bg-[#ece5dd] bg-opacity-50 bg-repeat px-1 relative">
      <div
        style={{
          backgroundImage: `url(${chatBg})`,
          opacity: 0.12,
          overflow: "scroll",
        }}
        alt="chat background"
        className="absolute inset-0 w-full h-full bg-opacity-30 bg-repeat bg-contain"
      />
      <SimpleBar
        style={{
          height: "calc(100vh - 10rem)",
          maxHeight: "calc(100vh - 10rem)",
          scrollbarWidth: "thin",
          paddingRight: "8px",
          display: "flex",
          flexDirection: "column-reverse",
        }}
        className="!flex !flex-col-reverse overflow-y-auto"
        scrollableNodeProps={{ ref: chatContainerRef }} // Pass the ref here
      >
        {currentMessages ? (
          currentMessages.map((message) => (
            <ChatMessage
              key={message._id}
              type={message.sender._id === user._id ? "sender" : "receiver"}
              id={message._id}
              message={message}
              onContextMenu={handleContextMenu}
              setContextMenuPosition={setContextMenuPosition}
              setIsContextMenuOpen={setOpenContextMenuId}
              isContextMenuOpen={openContextMenuId === message._id}
              contextMenuPosition={contextMenuPosition}
              menuOptions={menuOptions}
            />
          ))
        ) : (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500">No messages yet</p>
          </div>
        )}
        {isTyping && <TypingIndicator />}
      </SimpleBar>
    </div>
  );
}

// Typing indicator component
function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 mb-1">
      <div className={`p-2 py-3 bg-gray-200 rounded-lg flex gap-2`}>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
      </div>
    </div>
  );
}
