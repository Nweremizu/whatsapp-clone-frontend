import { toast } from "react-toastify";

const notify = (message, type, position = "top-right") => {
  toast(message, {
    position: position,
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    type,
  });
};

export default notify;
