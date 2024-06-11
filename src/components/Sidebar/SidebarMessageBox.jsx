import { File, VideoCamera } from "@phosphor-icons/react";
import ImageIcon from "@mui/icons-material/Image";

function SidebarMessageBox({ message, type }) {
  return (
    message && (
      <div className="flex gap-2 items-center h-fit">
        {message.type === "Image" && (
          <p className="text-xs text-gray-500 flex gap-1 !truncate max-w-[100px]  xl:max-w-[200px]">
            {type ? <span className="font-semibold">{type}</span> : ""}
            <ImageIcon sx={{ width: 16, height: 16 }} />
            {message.message}
          </p>
        )}
        {message.fileUrl && (
          <p className="text-xs text-gray-500 flex gap-2 !truncate max-w-[100px]  xl:max-w-[200px]">
            {type ? <span className="font-semibold">{type}</span> : ""}
            <File size={16} color="#000" weight="light" />
            File
          </p>
        )}

        {message.type === "Video" && (
          <p className="text-xs text-gray-500 flex gap-2 !truncate max-w-[100px]  xl:max-w-[200px]">
            {type ? <span className="font-semibold">{type}</span> : ""}
            <VideoCamera size={16} color="#000" weight="light" />
            {message.message}
          </p>
        )}
        {message.type === "Text" && (
          <p className="text-xs text-gray-500 gap-2 block !truncate max-w-[100px]  xl:max-w-[200px]">
            {type ? <span className="font-semibold">{type}</span> : ""}
            {message.message}
          </p>
        )}
      </div>
    )
  );
}

export default SidebarMessageBox;
