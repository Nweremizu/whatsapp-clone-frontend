// Button

import React from "react";
import { ThreeDots } from "react-loader-spinner";

export default function SubmitButton({ text, onClick }) {
  const [loading, setLoading] = React.useState(false);
  async function handleClick(e) {
    e.preventDefault();
    try {
      setLoading(true);
      await onClick();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }
  return (
    <button
      className="btn bg-whatsapp-green text-white hover:bg-green-500"
      disabled={loading}
      type="submit"
      onClick={handleClick}
    >
      <span className="text-white text-lg">
        {loading && <ThreeDots color="white" height={50} width={50} />}
        {text}
      </span>
    </button>
  );
}
