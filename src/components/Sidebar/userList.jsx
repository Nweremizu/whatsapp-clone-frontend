import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SimpleBar from "simplebar-react";
import UserElement from "./UserElement";
import { getUsers, openNewChat } from "../../redux/slices/app";
// import { getSocket } from "../../socket";
import { SocketContext } from "../../context/socket";
import GroupCreation from "./GroupCreation";

export default function UserList() {
  const { users } = useSelector((state) => state.app);

  const dispatch = useDispatch();
  const socket = React.useContext(SocketContext);
  const [groupCreationMenu, setGroupCreationMenu] = useState(false);
  const { isNewChatClicked } = useSelector((state) => state.app);

  const newChat = async () => {
    await dispatch(openNewChat(!isNewChatClicked));
  };

  function onClose() {
    setGroupCreationMenu(false);
    newChat();
  }

  useEffect(() => {
    socket.emit("getUsers", (data) => {
      dispatch(getUsers(data));
    });

    return () => {
      socket.off("getUsers");
    };
  }, [dispatch, socket]);

  useEffect(() => {
    setGroupCreationMenu(false);
  }, []);

  return (
    <div>
      {!groupCreationMenu ? (
        <>
          {" "}
          <div
            onClick={() => setGroupCreationMenu(true)}
            className="flex items-center p-2 cursor-pointer hover:bg-gray-100"
          >
            <div className="flex items-center mr-4 w-12 h-10 justify-center bg-white rounded-full border border-gray-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="#030303"
                viewBox="0 0 256 256"
              >
                <path
                  d="M112.6,158.43a58,58,0,1,0-57.2,0A93.83,93.83,0,0,0,5.21,196.72a6,
              6,0,0,0,10.05,6.56,82,82,0,0,1,137.48,0,6,6,0,0,0,10-6.56A93.83,93.83,0,0,0,112.6,158.43ZM38,108a46,
              46,0,1,1,46,46A46.06,46.06,0,0,1,38,108Zm211,97a6,6,0,0,1-8.3-1.74A81.8,81.8,0,0,0,172,166a6,6,0,0,1,0-12,46,46,0,1,0-17.08-88.73,
              6,6,0,1,1-4.46-11.14,58,58,0,0,1,50.14,104.3,93.83,93.83,0,0,1,50.19,38.29A6,6,0,0,1,249,205Z"
                ></path>
              </svg>
            </div>
            <div className="flex flex-col w-full h-full justify-between">
              <div className="flex flex-col justify-between w-full self-start ">
                <h1 className="text-lg font-semibold">New Group</h1>
                <p className="text-[10px] text-gray-500">Create a new group</p>
              </div>
            </div>
          </div>
          <SimpleBar
            style={{
              maxHeight: "calc(100vh - 9.1rem)",
              scrollbarWidth: "thin",
              paddingRight: "8px",
            }}
          >
            {/* To add a new group */}

            <p className="text-gray-500 text-sm font-semibold p-2">Users</p>
            {users && users.length > 0 ? (
              users.map((user) => <UserElement key={user._id} user={user} />)
            ) : (
              <p>No users found.</p>
            )}
          </SimpleBar>
        </>
      ) : (
        <GroupCreation onClose={() => onClose()} />
      )}
    </div>
  );
}
