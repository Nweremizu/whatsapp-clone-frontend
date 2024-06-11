/* eslint-disable no-undef */
import { useEffect, useState, useContext, useRef, useMemo } from "react";
import SimpleBar from "simplebar-react";
import SpecializedIconButton from "../SpecializedIconButton";
import { ArrowLeft, Camera } from "@phosphor-icons/react";
import { SocketContext } from "../../context/socket";
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "../../redux/slices/app";
import { Avatar } from "@mui/material";
import { Cloudinary } from "@cloudinary/url-gen";
import axios from "axios";
import CryptoJS from "crypto-js";
import "simplebar-react/dist/simplebar.min.css"; // Import SimpleBar CSS

const cid = new Cloudinary({
  cloud: {
    cloudName: "dzglnbdu1",
  },
});

function GroupCreation({ onClose }) {
  const socket = useContext(SocketContext);
  const { user } = useSelector((state) => state.auth);
  const { users } = useSelector((state) => state.app);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const [chosenUsers, setChosenUsers] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [groupIcon, setGroupIcon] = useState(null);
  const [openContextMenu, setOpenContextMenu] = useState(false);
  const [publicId, setPublicId] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [createGroupError, setCreateGroupError] = useState(null);

  useEffect(() => {
    socket.emit("getUsers", (data) => {
      dispatch(getUsers(data));
    });

    return () => {
      socket.off("getUsers");
    };
  }, [dispatch, socket]);

  const handleUpload = async () => {
    setIsUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("upload_preset", "Groups");

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      setPublicId(data.public_id);
      setGroupIcon(data.secure_url); // Use the secure URL from Cloudinary response
      // console.log(data);
    } catch (error) {
      // console.error("Error uploading file:", error);
      setUploadError("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const deleteUpload = async (publicId) => {
    const url = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/image/destroy`;
    const timestamp = Math.floor(Date.now() / 1000);
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const apiKey = process.env.CLOUDINARY_API_KEY;

    // Create the signature
    const stringToSign = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
    const signature = CryptoJS.SHA1(stringToSign).toString(CryptoJS.enc.Hex);

    const data = {
      public_id: publicId,
      timestamp: timestamp,
      api_key: apiKey,
      signature: signature,
    };

    try {
      const response = await axios.post(url, data);
      // console.log("Response:", response.data);
    } catch (error) {
      // console.error("Error:", error);
    }
  };

  const handleOpenContextMenu = () => {
    setOpenContextMenu(!openContextMenu);
  };

  const handleOpenFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
    fileInputRef.current.click();
  };

  const handleRemoveImage = () => {
    if (publicId) {
      deleteUpload(publicId);
    }
    setGroupIcon(null);
    setOpenContextMenu(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      handleUpload();
    }
  };

  useEffect(() => {
    // Cleanup function to delete upload if component unmounts or group creation is canceled
    return () => {
      if (publicId) {
        deleteUpload(publicId);
      }
    };
  }, [publicId]);

  const handleCreateGroup = () => {
    if (!groupName) {
      alert("Group name is required");
      return;
    }

    setIsCreatingGroup(true);
    setCreateGroupError(null);

    // Extract user IDs from chosenUsers
    const chosenUserIds = chosenUsers.map((user) => String(user._id));
    // add current user to the group
    chosenUserIds.push(String(user._id));

    // send group creation request to server
    socket.emit(
      "createGroupChat",
      {
        userIds: chosenUserIds,
        groupImage: groupIcon,
        groupName,
      },
      (chat) => {
        // console.log(chat);
        setGroupName("");
        setChosenUsers([]);
        setGroupIcon(null);
        setSelectedFile(null);
        setPublicId(null);
        setSignature(null);
        setIsCreatingGroup(false);
        onClose();
      }
    );
  };

  const isUserChosen = (user) =>
    chosenUsers.some((chosenUser) => chosenUser._id === user._id);

  const handleToggleUser = (user) => {
    if (isUserChosen(user)) {
      setChosenUsers(
        chosenUsers.filter((chosenUser) => chosenUser._id !== user._id)
      );
    } else {
      setChosenUsers([...chosenUsers, user]);
    }
  };

  const chosenUsersMemo = useMemo(
    () =>
      chosenUsers.map((user) => (
        <div
          key={user._id}
          className="flex items-center gap-2 bg-whatsapp-green px-2 py-0.5 rounded"
        >
          <Avatar
            src={user.avatar}
            alt={user.username}
            sx={{ width: 15, height: 15 }}
          />
          <p className="text-xs text-white">{user.username}</p>
        </div>
      )),
    [chosenUsers]
  );

  const usersMemo = useMemo(
    () =>
      users.map((user) => (
        <div
          key={user._id}
          className="flex items-center justify-between gap-2 cursor-pointer"
          onClick={() => handleToggleUser(user)}
        >
          <div className="flex items-center gap-2">
            <Avatar src={user.avatar} alt={user.username} />
            <span className="text-sm font-semibold">{user.username}</span>
          </div>
          <input
            type="checkbox"
            checked={isUserChosen(user)}
            readOnly
            className="form-checkbox h-3 w-3 text-whatsapp-green accent-whatsapp-green"
          />
        </div>
      )),
    [users, chosenUsers]
  );

  const handleBack = () => {
    const dialog = document.getElementById("dialog");
    dialog.showModal();
  };

  const handleCloseModal = () => {
    const dialog = document.getElementById("dialog");
    dialog.close();
  };

  return (
    <>
      <div className="flex flex-row gap-2 w-full">
        <SpecializedIconButton onClick={() => handleBack()}>
          <ArrowLeft size={18} />
        </SpecializedIconButton>
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 w-full">
          <h2 className="text-base font-semibold">Create Group</h2>
        </div>
        <dialog id="dialog" className="modal">
          <div className="modal-box p-0 rounded-md">
            <div className="flex flex-col p-5">
              <div className="modal-header">
                <h1 className="font-semibold text-2xl">
                  Cancel creating group?
                </h1>
              </div>
              <div className="modal-middle pt-2">
                <p className="text-sm">
                  Your group members, group name and icon will not be saved.
                </p>
              </div>
            </div>
            <div className="modal-footer border-t border-gray-300 bg-gray-100">
              <div className="flex gap-4 p-5 w-full">
                <div
                  onClick={() => {
                    handleCloseModal();
                    onClose();
                  }}
                  className="w-full cursor-default hover:bg-green-600 text-center rounded-md text-sm py-1 bg-whatsapp-green font-thin text-white"
                >
                  Yes, cancel
                </div>
                <div
                  onClick={handleCloseModal}
                  className="w-full cursor-default hover:bg-gray-50 text-center rounded-md text-sm py-1 bg-white border border-gray-200 font-thin text-black"
                >
                  Go back
                </div>
              </div>
            </div>
          </div>
        </dialog>
      </div>
      <div className="divide-x divide-gray-200 my-1 w-full"></div>
      <section id="group-creation" className="flex flex-col gap-2 p-2 w-full">
        <form
          className="flex flex-col gap-2"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="flex items-center gap-2">
            <div
              onClick={!groupIcon ? handleOpenFileInput : handleOpenContextMenu}
              className="flex items-center relative justify-center border border-gray-300 w-12 h-12 rounded-full gap-2 cursor-pointer"
            >
              {openContextMenu && (
                <div className="absolute -top-16 left-0 w-32 p-1 bg-white border border-gray-400 shadow-lg text-black rounded text-xs">
                  <div className="flex flex-col space-y-1">
                    <div
                      onClick={handleRemoveImage}
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1 rounded"
                    >
                      <p className="text-sm">Remove image</p>
                    </div>
                    <div
                      onClick={handleOpenFileInput}
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1 rounded"
                    >
                      <p className="text-sm">Change Image</p>
                    </div>
                  </div>
                </div>
              )}

              {groupIcon ? (
                <img
                  src={groupIcon}
                  alt="group icon"
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <Camera size={20} />
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                hidden
              />
            </div>
            <p className="text-sm font-normal">Add group icon (optional)</p>
          </div>

          {isUploading && <p className="text-sm text-gray-500">Uploading...</p>}
          {uploadError && <p className="text-sm text-red-500">{uploadError}</p>}

          <label htmlFor="group-name" className="text-sm">
            Group Name
          </label>
          <input
            type="text"
            id="group-name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="border border-gray-200 rounded p-1"
            required
          />
        </form>
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Participants</h2>
        </div>
        <div className="flex flex-row gap-1 border-b border-b-whatsapp-green border border-gray-100 p-1">
          {chosenUsers.length > 0 ? (
            chosenUsersMemo
          ) : (
            <p className="text-xs text-gray-400">No Participants</p>
          )}
        </div>
        <div className="flex flex-col gap-2">{usersMemo}</div>
        <button
          className="btn bg-whatsapp-green text-white"
          onClick={handleCreateGroup}
          disabled={isCreatingGroup || chosenUsers.length === 0}
        >
          {isCreatingGroup ? "Creating Group..." : "Create Group"}
        </button>
        {createGroupError && (
          <p className="text-sm text-red-500">{createGroupError}</p>
        )}
      </section>

      <SimpleBar
        style={{
          maxHeight: "calc(100vh - 9.1rem)",
          scrollbarWidth: "thin",
          paddingRight: "8px",
        }}
      />
    </>
  );
}

export default GroupCreation;
