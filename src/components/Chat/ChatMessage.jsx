import ContextMenu from "./contextMenu";
import DateFormatter from "../../utils/DateFormatter";
import ImageMessage from "./ImageMessage";
import { X } from "@phosphor-icons/react";
import { useSelector } from "react-redux";
import { Avatar } from "@mui/material";

function ChatMessage({ type, ...props }) {
  const isSender = type === "sender";
  const messageClass = isSender ? "chat-end" : "chat-start";
  const bubbleClass = isSender ? "bg-green-500" : "bg-white text-black";
  const activeChat = useSelector((state) => state.chat.activeChat);

  //a listener to handle closing the context menu when clicked outside

  const handleCloseContextMenu = () => {
    props.setIsContextMenuOpen(null);
  };

  return (
    <div className={`chat ${messageClass} py-1.5 relative`}>
      {type === "receiver" && activeChat.isGroupChat && (
        <>
          <div className="chat-header text-xs font-semibold">
            {props.message.sender.username}
          </div>
          <div className="chat-image avatar">
            <div className="w-5 rounded-full text-center">
              <Avatar
                src={props.message.sender.avatar}
                sx={{ width: 20, height: 20 }}
              />
            </div>
          </div>
        </>
      )}
      <div
        onContextMenu={(e) => props.onContextMenu(props.id, e)}
        className={`chat-bubble shadow-sm px-2 flex h-fit min-h-9 min-w-28 flex-col rounded-lg pb-0 pt-2 ${bubbleClass}`}
      >
        <span className="text-sm break-words text-black">
          {
            <ChatMessagePreview
              message={props.message || "This is a sample message"}
            />
          }
        </span>
        {props.isContextMenuOpen && (
          <ContextMenu
            id={props.id}
            txt={props.message}
            x={props.contextMenuPosition.x}
            y={props.contextMenuPosition.y}
            options={props.menuOptions}
            onClose={handleCloseContextMenu}
          />
        )}
        <time
          className={`text-[10px] ${isSender ? "text-gray-100" : "text-slate-600"}  self-end`}
        >
          {props.message.timestamp
            ? DateFormatter(props.message.timestamp, "time")
            : "12:00"}
        </time>
      </div>
    </div>
  );
}

function ChatMessagePreview({ message }) {
  // For previewing all types of messages i.e. text, image, video, document
  return (
    <>
      {message.imageUrl && <ImageMessage message={message} />}
      {message.videoUrl && <video src={message.videoUrl} alt={message.alt} />}
      {/* {message.link && <a href={message.link}>{message.link}</a>} */}
      {message && <p>{message.message}</p>}
    </>
  );
}

export function ImagePreview({ imageUrl, onClose }) {
  return (
    <div className="fixed top-0 left-0 inset-0 bg-black bg-opacity-80 z-[1000000] flex justify-center items-center">
      <button className="absolute top-2 right-2" onClick={() => onClose()}>
        <X
          size={24}
          colorInterpolation={"#fff"}
          colorInterpolationFilters="auto"
        />
      </button>

      <img
        src={imageUrl}
        alt="preview"
        className="object-contain max-w-90% h-85%"
      />
    </div>
  );
}

export default ChatMessage;
