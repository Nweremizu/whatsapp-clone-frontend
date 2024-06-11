import React from "react";
import { ImagePreview } from "./ChatMessage";

function ImageMessage({ message }) {
  const [isImageClicked, setIsImageClicked] = React.useState(false);

  const onClosed = () => {
    setIsImageClicked(false);
  };

  return (
    <div className=" my-2.5">
      {isImageClicked && (
        <ImagePreview imageUrl={message.imageUrl} onClose={onClosed} />
      )}
      <img
        src={`${message.imageUrl}`}
        onClick={() => setIsImageClicked(!isImageClicked)}
        className="rounded-lg  h-48 object-cover aspect-auto"
      />
    </div>
  );
}

export default ImageMessage;
