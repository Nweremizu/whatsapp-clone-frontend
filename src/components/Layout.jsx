import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Layout() {
  return (
    <div className="main">
      <ToastContainer />
      <Outlet />
    </div>
  );
}

export default Layout;
