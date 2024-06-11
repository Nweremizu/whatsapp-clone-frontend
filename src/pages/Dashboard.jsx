import React, { useEffect, lazy, Suspense } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { WhatsappLogo } from "@phosphor-icons/react";
import useResponsive from "../hooks/useResponsive";
import notify from "../utils/toaster";
import { LogoutUser } from "../redux/slices/auth";
import { SocketContext, socket } from "../context/socket";
import { openNewChat, putcloseChat } from "../redux/slices/app";
import { setupAxiosInterceptors } from "../axios";

const Menu = lazy(() => import("../components/Menu"));
const Sidebar = lazy(() => import("../components/sections/Sidebar"));
const Chat = lazy(() => import("../components/sections/Chat"));
const EmptyChat = lazy(() => import("../components/Chat/EmptyChat"));

function Dashboard() {
  const { isLoggedIn } = useSelector((state) => state.auth);
  const { closeChat, hideSidebar } = useSelector((state) => state.app);
  const dispatch = useDispatch();

  const isMobile = useResponsive();

  useEffect(() => {
    setupAxiosInterceptors(isLoggedIn);
    dispatch(openNewChat(false));
    dispatch(putcloseChat(true));
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      socket.emit("online");
      socket.on("error", (error) => {
        if (error === "jwt expired") {
          notify("Session expired. Please login again", "error");
          dispatch(LogoutUser());
        }
      });
    }

    return () => {
      socket.off("error");
      socket.off("online");
    };
  }, [dispatch, isLoggedIn]); // Add socket as a dependency

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return (
    <SocketContext.Provider value={socket}>
      <div className="flex h-screen overflow-hidden bg-gray-50 pl-12 pt-12">
        <Menu />
        <div className="absolute left-3 top-3 flex gap-2 justify-center items-center z-10">
          <WhatsappLogo size={24} color="green" />
          <h1 className="text-xs font-light">WhatsApp</h1>
        </div>

        <div className="flex h-full w-full rounded-tl-lg bg-white self-end border border-gray-300">
          <Sidebar isMobile={isMobile} />
          {!isMobile ? (
            closeChat ? (
              <EmptyChat />
            ) : (
              <Chat isMobile={isMobile} />
            )
          ) : (
            hideSidebar && <Chat isMobile={isMobile} />
          )}
        </div>
      </div>
    </SocketContext.Provider>
  );
}

export default Dashboard;
