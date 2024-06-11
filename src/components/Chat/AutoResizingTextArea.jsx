import React, { useEffect } from "react";

function AutoResizingTextArea({ onEnterPress, ...props }) {
  const textareaRef = React.useRef(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = " 0px";
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = `${scrollHeight}px`;
    }
  }, [props.value]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (onEnterPress) {
        onEnterPress();
      }
    }
  };

  return (
    <textarea
      {...props}
      ref={textareaRef}
      style={{ overflowY: "hidden", ...props.style }}
      onKeyDown={handleKeyDown}
    />
  );
}

export default AutoResizingTextArea;
