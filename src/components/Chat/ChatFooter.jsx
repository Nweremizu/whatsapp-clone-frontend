/* eslint-disable no-undef */
import React, { useEffect, useRef, useState } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import SpecializedIconButton from "../SpecializedIconButton";
import {
  Download,
  PaperPlaneRight,
  PaperPlaneTilt,
  Paperclip,
  Smiley,
  X,
} from "@phosphor-icons/react";
import AutoResizingTextArea from "./AutoResizingTextArea";
import { Box } from "@mui/material";
import useResponsive from "../../hooks/useResponsive";
import { SocketContext } from "../../context/socket";
import { useSelector } from "react-redux";
import { Cloudinary } from "@cloudinary/url-gen";

function ChatFooter() {
  const cid = new Cloudinary({
    cloud: {
      cloudName: "dzglnbdu1",
    },
  });
  const [openEmoji, setOpenEmoji] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const PickerRef = useRef(null);
  const socket = React.useContext(SocketContext);
  const { activeChat } = useSelector((state) => state.chat);
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const fileInputRef = useRef();
  const typingTimeoutRef = useRef(null);

  const isMobile = useResponsive();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (PickerRef.current && !PickerRef.current.contains(e.target)) {
        setOpenEmoji(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [PickerRef, setOpenEmoji]);

  const handleEmojiSelect = (emoji) => {
    setInputValue((prev) => prev + emoji.native);
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setIsFileModalOpen(true);
    }
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("upload_preset", "whatsapp-clone");

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      // console.log(data);
      socket.emit("sendMessage", {
        message: { imageUrl: data.secure_url },
        chatId: activeChat._id,
      });
      setImageUrl(data.secure_url);
      handleCloseModal();
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleCloseModal = () => {
    setIsFileModalOpen(false);
    setSelectedFile(null);
  };

  const handleSubmit = () => {
    if (inputValue.length > 0)
      socket.emit("sendMessage", {
        message: inputValue,
        chatId: activeChat._id,
      });
    setInputValue("");
    socket.emit("typing", { chatId: activeChat._id, isTyping: false });
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);

    if (socket && activeChat) {
      socket.emit("typing", { chatId: activeChat._id, isTyping: true });

      // Clear the existing timer if there is any
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set a new timer
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("typing", { chatId: activeChat._id, isTyping: false });
      }, 2000); // 2 seconds of inactivity
    }
  };

  return (
    <div className={`border-t border-gray-200 px-2 py-1`}>
      <form className={`flex items-end justify-between gap-4`}>
        <div className="relative flex gap-2">
          <Box
            sx={{
              position: "absolute",
              bottom: 45,
              display: openEmoji ? "block" : "none",
              zIndex: 1000,
              left: isMobile ? 0 : -40,
            }}
            ref={PickerRef}
          >
            <Picker
              data={data}
              theme="light"
              onEmojiSelect={(emoji) => handleEmojiSelect(emoji)}
              previewPosition="none"
            />
          </Box>
          <SpecializedIconButton onClick={() => setOpenEmoji(!openEmoji)}>
            <Smiley size={20} color="#000" weight="light" />
          </SpecializedIconButton>

          <SpecializedIconButton onClick={handleButtonClick}>
            <Paperclip size={20} color="#000" weight="light" />
          </SpecializedIconButton>
          {isFileModalOpen && (
            <div className="relative">
              <FilePreviewModal
                file={URL.createObjectURL(selectedFile)}
                onClose={handleCloseModal}
                onUpload={handleUpload}
              />
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>
        <AutoResizingTextArea
          type="text"
          placeholder="Type a message"
          value={inputValue}
          onEnterPress={handleSubmit}
          onChange={handleInputChange}
          className="flex h-0 flex-1 items-center self-center border-none bg-transparent align-middle text-sm outline-none"
          style={{ resize: "none", scrollbarWidth: "none" }}
        />
        <SpecializedIconButton
          onClick={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <PaperPlaneTilt size={18} color="#000" weight="light" />
        </SpecializedIconButton>
      </form>
    </div>
  );
}

export default ChatFooter;

function FilePreviewModal({ file, onClose, onUpload }) {
  return (
    <div
      className="absolute flex bottom-12 -left-20 min-w-52 bg-white shadow-md rounded-lg
    max-w-[400px]  overflow-hidden"
    >
      <div className="flex flex-col relative w-full h-full">
        <div className="flex border-b border-gray-200 p-2 justify-end mb-4">
          <div className="self-end cursor-pointer" onClick={onClose}>
            <X size={18} color="#000" weight="light" />
          </div>
        </div>
        <img
          src={file}
          alt="file"
          className="object-scale-down w-[350px] max-h-[300px] self-center"
        />
        <div className="flex justify-between px-2 py-1 items-center gap-2">
          <SpecializedIconButton
            style={{
              backgroundColor: "#0a8d48",
              padding: "0.5rem",
            }}
          >
            <Download size={16} color="#000" weight="light" />
          </SpecializedIconButton>
          <SpecializedIconButton
            onClick={onUpload}
            style={{
              marginLeft: "auto",
              backgroundColor: "#0a8d48",
              padding: "0.5rem",
            }}
          >
            <PaperPlaneRight size={16} color="#000" weight="light" />
          </SpecializedIconButton>
        </div>
      </div>
    </div>
  );
}
