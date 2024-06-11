import { Avatar, Badge } from "@mui/material";
import { Archive, ChatCircleText, List } from "@phosphor-icons/react";
import SpecializedIconButton from "./SpecializedIconButton";
import React, { useEffect, useRef, useState } from "react";
import { Camera } from "@phosphor-icons/react/dist/ssr";
import { useDispatch, useSelector } from "react-redux";
import { AppointAvatar, AppointUser, LogoutUser } from "../redux/slices/auth";
// import { getSocket } from "../socket";
import { SocketContext } from "../context/socket";
import instance from "../axios";

function Menu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const user = useSelector((state) => state.auth.user);

  const handleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleModal = () => {
    setOpenModal(!openModal);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <div
      className={`absolute left-0 h-full ${isMenuOpen ? "w-40 border-gray-300 shadow-lg rounded-lg z-10" : "w-12"} bg-gray-50 top-0 pt-[64px] pb-3`}
      style={{
        transition: "all 0.3s",
      }}
    >
      <div
        className={`flex flex-col ${isMenuOpen ? "px-1" : "items-center"} justify-between h-full`}
      >
        <div className="flex flex-col justify-center gap-1.5">
          <SpecializedIconButton
            onClick={handleMenu}
            style={{
              alignSelf: "start",
            }}
          >
            <List size={20} color="#000" weight="light" />
          </SpecializedIconButton>
          <div className="flex w-full">
            <SpecializedIconButton
              style={{
                width: "100% !important",
                alignItems: "center !important",
                justifyContent: "start !important",
                backgroundColor: "#f0f0f0",
              }}
            >
              <ChatCircleText size={20} color="#000" weight="thin" />
              {isMenuOpen && <p className="ml-3 text-xs text-black">Chats</p>}
            </SpecializedIconButton>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <SpecializedIconButton>
            <Archive size={20} color="#000" weight="thin" />
            {isMenuOpen && (
              <p className="ml-3 text-xs text-black">Archived chats</p>
            )}
          </SpecializedIconButton>
          <div
            className={`${isMenuOpen ? "w-[90%]" : "w-8"} h-[1px] bg-gray-300 rounded-full`}
          ></div>
          <SpecializedIconButton
            style={{
              width: "100% !important",
              alignItems: "center !important",
              justifyContent: "start !important",
            }}
            onClick={handleModal}
          >
            <Avatar
              sx={{ width: 20, height: 20, border: "1px solid gray" }}
              src={user?.avatar}
            />
            {isMenuOpen && <p className="ml-3 text-xs text-black">Profile</p>}
          </SpecializedIconButton>
          {openModal && <ProfileModal onClose={handleCloseModal} />}
        </div>
      </div>
    </div>
  );
}

export default Menu;

function ProfileModal({ onClose }) {
  const dispatch = useDispatch();
  const [userInput, setUserInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const user = useSelector((state) => state.auth.user);
  const modalRef = useRef(null);
  const socket = React.useContext(SocketContext);
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  useEffect(() => {
    if (user) {
      setUserInput(user.username);
      setEmailInput(user.email);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    // console.log(token);
    const res = await instance.patch(
      "/users/me",
      {
        username: userInput,
        email: emailInput,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // console.log(res);
    setUserInput(res.data.user.username);
    setEmailInput(res.data.user.email);
    dispatch(AppointUser(res.data.user));
    onClose();
  };

  const handleLogout = async () => {
    try {
      await dispatch(LogoutUser());
      socket.emit("end");
    } catch (error) {
      // console.error("Logout failed:", error);
    }
  };

  const handleDialog = () => {
    const dialog = document.getElementById("dialog");
    dialog.showModal();
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const res = await instance.post(
      `/users/me/avatar/${user._id}`,
      {
        image: selectedFile,
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // console.log(res.data.user.avatar);
    dispatch(AppointAvatar(res.data.user.avatar));
    setSelectedFile(null);
    onClose();
    window.location.reload();
  };

  return (
    <div
      ref={modalRef}
      className="flex flex-col items-center gap-2 absolute bottom-8 left-5 bg-white p-4 border rounded-lg border-gray-300 shadow-lg"
    >
      <h1 className="text-lg font-semibold">Profile</h1>
      <div className="divider m-0"></div>
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        badgeContent={
          <div
            onClick={() => handleDialog()}
            className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-800 text-white"
          >
            <Camera size={14} />
          </div>
        }
        className="self-start mb-2"
      >
        <Avatar
          sx={{ width: 60, height: 60 }}
          src={user?.avatar || "https://randomuser.me/api/portraits/men/76.jpg"}
        />
      </Badge>
      <form className="flex flex-col gap-3">
        <label className="input input-sm input-bordered flex items-center gap-2">
          Name
          <input
            type="text"
            className="grow"
            placeholder="Daisy"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
        </label>
        <label className="input input-sm input-bordered flex items-center gap-2">
          Email
          <input
            type="text"
            className="grow"
            placeholder="daisy@site.com"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
          />
        </label>
      </form>
      <div className="flex gap-2 justify-between w-full self-end">
        <button
          onClick={handleSubmit}
          className="btn btn-xs bg-white hover:bg-whatsapp-green hover:text-white"
        >
          Save
        </button>
        <button
          className="btn btn-xs bg-white hover:bg-red-400 hover:text-white"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
      <div className="divider m-0 w-full h-3"></div>
      <div
        className="btn btn-sm bg-white hover:bg-red-400 hover:text-white w-full"
        onClick={handleLogout}
      >
        Logout
      </div>
      <dialog id="dialog" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <div className="modal-header">
            <h3 className="font-semibold text-2xl text-center">
              Change Profile Picture
            </h3>
          </div>
          {/* Preview the image */}
          <div className="modal-body flex justify-center items-center my-4">
            <Avatar
              src={
                (selectedFile && URL.createObjectURL(selectedFile)) ||
                user.avatar
              }
              sx={{ width: 100, height: 100 }}
              onClick={() => fileInputRef.current.click()}
            />
          </div>

          <div className="modal-body">
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </div>
          <div className="modal-footer px-4 mt-4 w-full">
            {/* only enable the button when the input is not empty */}
            <button
              onClick={handleUpload}
              className="btn btn-sm w-full bg-green-400 text-white hover:bg-green-500"
            >
              Upload
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
