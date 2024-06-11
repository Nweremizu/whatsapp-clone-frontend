import React from "react";
import Image from "../Image";
import { Lock } from "@phosphor-icons/react";

function EmptyChat() {
  return (
    <div className="flex  flex-col items-center w-full md:w-[70%] xl:w-[80%] 2xl:w-[75%] justify-center bg-gray-50 px-2 py-1 h-full">
      <div className="flex flex-col items-center justify-center  px-2 py-1 h-full">
        <Image
          src={
            "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
          }
          alt={"WhatsApp"}
          className={"h-24 w-24 grayscale xl:h-48 xl:w-48"}
        />
        <h2 className="text-lg font-semibold text-gray-500">
          Keep your phone connected
        </h2>
        <p className="text-sm text-gray-400 w-[80%] text-center">
          WhatsApp connects to your phone to sync messages. To reduce data
          usage, connect your phone to Wi-Fi.
        </p>
      </div>
      <div className="flex gap-2 mt-4 items-center ">
        <Lock size={16} color="#000" weight="light" />
        <p className="text-sm text-gray-400">Not End-to-end encrypted</p>
      </div>
    </div>
  );
}

export default EmptyChat;
