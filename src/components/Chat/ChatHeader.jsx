import React, { useEffect, useState, useCallback } from "react";
import { Avatar } from "@mui/material";
import SpecializedIconButton from "../SpecializedIconButton";
import {
  Phone,
  VideoCamera,
  MagnifyingGlass,
  ArrowLeft,
  Info,
  Users,
  UserPlus,
} from "@phosphor-icons/react";
import SimpleBar from "simplebar-react";
import { useDispatch, useSelector } from "react-redux";
import format from "../../utils/formatString";
import useResponsive from "../../hooks/useResponsive";
import { putcloseChat, toggleSidebar } from "../../redux/slices/app";
import { SocketContext } from "../../context/socket";

const ChatHeader = () => {
  const { user } = useSelector((state) => state.auth);
  const activeChat = useSelector((state) => state.chat.activeChat);
  const [avatar, setAvatar] = useState(null);
  const isMobile = useResponsive();
  const dispatch = useDispatch();
  const [chatName, setChatName] = useState("");
  const [chatStatus, setChatStatus] = useState("");
  const [openChatInfo, setOpenChatInfo] = useState(false);

  useEffect(() => {
    if (activeChat) {
      if (activeChat.isGroupChat) {
        setChatName(activeChat.groupName);
        setChatStatus(`${activeChat.users.length} members`);
        setAvatar(activeChat.groupImage);
      } else {
        const chatUser = activeChat.users?.find(
          (chatuser) => chatuser._id !== user._id
        );
        setChatName(chatUser?.username);
        setChatStatus(chatUser?.status);
        setAvatar(chatUser?.avatar);
      }
    }
  }, [activeChat, user]);

  const handleOutsideClick = useCallback((e) => {
    if (!e.target.closest(".flex.items-center.relative")) {
      setOpenChatInfo(false);
    }
  }, []);

  useEffect(() => {
    if (openChatInfo) {
      document.addEventListener("click", handleOutsideClick);
      return () => {
        document.removeEventListener("click", handleOutsideClick);
      };
    }
  }, [openChatInfo, handleOutsideClick]);

  const toggleChatInfo = () => setOpenChatInfo(!openChatInfo);
  const closeChat = () => {
    dispatch(putcloseChat(true));
    if (isMobile) {
      dispatch(toggleSidebar(false));
    }
  };

  return (
    <div
      className={`flex items-center justify-between border-b border-gray-200 ${isMobile && "pl-0.5"} px-4 py-3`}
    >
      <div className="flex items-center gap-2 relative">
        <SpecializedIconButton onClick={closeChat}>
          <ArrowLeft size={18} />
        </SpecializedIconButton>
        <Avatar src={avatar} onClick={toggleChatInfo} />
        <div className="flex flex-col h-full">
          <h2 className="text-base font-semibold self-start">
            {format(chatName || "Chat")}
          </h2>
          <p className="text-xs text-gray-400">
            <span className="text-whatsapp-green">
              {chatStatus || "Online"}
            </span>
          </p>
        </div>
        {openChatInfo && <ChatInfoModal />}
      </div>
      <div className="flex gap-2">
        <div className="flex w-fit items-center rounded border border-opacity-30 shadow-sm">
          <SpecializedIconButton
            style={{
              borderRadius: "2px",
              paddingLeft: "10px",
              paddingRight: "10px",
            }}
          >
            <VideoCamera size={16} color="#000" />
          </SpecializedIconButton>
          <div className="border-l border-gray-200 h-5"></div>
          <SpecializedIconButton
            style={{
              borderRadius: "2px",
              paddingLeft: "10px",
              paddingRight: "10px",
            }}
          >
            <Phone size={16} color="#000" />
          </SpecializedIconButton>
        </div>
        <SpecializedIconButton>
          <MagnifyingGlass size={16} color="#000" mirrored />
        </SpecializedIconButton>
      </div>
    </div>
  );
};

const ChatInfoModal = () => {
  const activeChat = useSelector((state) => state.chat.activeChat);
  const { user } = useSelector((state) => state.auth);
  const [chatName, setChatName] = useState("");
  const [chatStatus, setChatStatus] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [chatEmail, setChatEmail] = useState("");
  const [selectedOption, setSelectedOption] = useState("Overview");
  const dispatch = useDispatch();
  const isMobile = useResponsive();
  const socket = React.useContext(SocketContext);

  useEffect(() => {
    if (activeChat) {
      if (activeChat.isGroupChat) {
        setChatName(activeChat.groupName);
        setChatStatus(`${activeChat.users.length} members`);
        setAvatar(activeChat.groupImage);
        setChatEmail("Group Chat");
      } else {
        const chatUser = activeChat.users?.find(
          (chatuser) => chatuser._id !== user._id
        );
        setChatName(chatUser?.username);
        setChatStatus(chatUser?.status);
        setAvatar(chatUser?.avatar);
        setChatEmail(chatUser?.email);
      }
    }
  }, [activeChat, user]);

  const leaveGroup = () => {
    socket.emit("leaveGroupChat", { chatId: activeChat._id }, (data) => {
      dispatch(putcloseChat(true));
      if (isMobile) {
        dispatch(toggleSidebar(false));
      }
    });
  };

  return (
    <div className="flex flex-row min-h-48 h-96 max-h-96 w-96 absolute top-0 -left-3 z-50 bg-white rounded-md shadow-lg border border-gray-300">
      <div className="flex flex-col gap-2 w-[30%] p-1 items-start h-full border-r border-gray-300 bg-gray-100">
        <OptionButton
          onClick={() => setSelectedOption("Overview")}
          selected={selectedOption === "Overview"}
          icon={<Info size={16} />}
          label="Overview"
        />
        {activeChat.isGroupChat && (
          <OptionButton
            onClick={() => setSelectedOption("Members")}
            selected={selectedOption === "Members"}
            icon={<Users size={16} />}
            label="Members"
          />
        )}
      </div>
      <div className="flex flex-col gap-2 w-[70%] p-1">
        {selectedOption === "Overview" && (
          <Overview
            avatar={avatar}
            chatName={chatName}
            chatEmail={chatEmail}
            chatStatus={chatStatus}
            onLeaveGroup={leaveGroup}
          />
        )}
        {selectedOption === "Members" && <Members />}
      </div>
    </div>
  );
};

const OptionButton = ({ onClick, selected, icon, label }) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-2 w-full justify-center p-2 rounded ${selected ? "bg-gray-200" : "hover:bg-gray-200"}`}
  >
    {icon}
    <p className="text-xs">{label}</p>
  </div>
);

const Overview = ({
  avatar,
  chatName,
  chatEmail,
  chatStatus,
  onLeaveGroup,
}) => {
  const activeChat = useSelector((state) => state.chat.activeChat);
  return (
    <div className="p-3">
      <div className="flex flex-col items-center gap-2">
        <Avatar sx={{ width: 80, height: 80 }} src={avatar} />
        <h2 className="text-lg">{chatName}</h2>
        <p className="text-sm text-gray-400">{chatEmail}</p>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-1">
          <p className="text-xs text-gray-400">Status</p>
          <p className="text-xs">{chatStatus}</p>
        </div>
        <div className="flex flex-col gap-2">
          <div className="border-b border-gray-200"></div>
          <button
            onClick={activeChat.isGroupChat ? onLeaveGroup : () => {}}
            className="text-xs bg-red-500 text-white rounded-md p-1"
          >
            {activeChat.isGroupChat ? "Leave Group" : "Block User"}
          </button>
        </div>
      </div>
    </div>
  );
};

const Members = () => {
  const activeChat = useSelector((state) => state.chat.activeChat);
  return (
    <div>
      <h2 className="font-bold mb-3">Members ({activeChat?.users.length})</h2>
      <SimpleBar className="custom-scrollbar !flex !flex-col !gap-2 h-80 px-1 scroll-p-1">
        <MemberAction icon={<UserPlus size={16} />} label="Add Members" />
        {activeChat?.users.map((user) => (
          <Member
            key={user._id}
            user={user}
            isAdmin={activeChat.groupAdmins.includes(user._id)}
          />
        ))}
      </SimpleBar>
    </div>
  );
};

const Member = ({ user, isAdmin }) => (
  <div className="flex flex-col gap-2 mt-2 hover:bg-gray-100 p-1 px-2 rounded">
    <div className="flex items-center gap-2">
      <Avatar sx={{ width: 30, height: 30 }} src={user.avatar} />
      <div className="flex flex-col text-xs w-full">
        <h2>{user.username}</h2>
        <div className="flex justify-between w-full">
          <p>{user.status}</p>
          {isAdmin && <p>Admin</p>}
        </div>
      </div>
    </div>
  </div>
);

const MemberAction = ({ icon, label }) => (
  <div className="flex flex-col gap-2 hover:bg-gray-100 p-1 rounded px-2">
    <div className="flex items-center gap-2">
      <div className="flex items-center justify-center rounded-full gap-2 w-10 h-8 border border-gray-200">
        {icon}
      </div>
      <div className="flex flex-col text-xs w-full">
        <h2>{label}</h2>
      </div>
    </div>
  </div>
);

export default ChatHeader;
