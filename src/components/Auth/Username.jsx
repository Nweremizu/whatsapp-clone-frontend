// import { useStateValue } from "../utils/StateProvider";

import { User } from "@phosphor-icons/react";

export default function Username({ username, setUsername, type }) {
  return (
    <div className="flex flex-col">
      <label
        className={`input input-bordered ${username && username.length < 3 && username.length >= 1 && "border-red-500 outline-2 focus-within:outline-red-500 focus:outline-red-500"} flex items-center gap-2`}
      >
        <User size={16} />
        <input
          type="text"
          className="grow appearance-none"
          placeholder={type === "login" ? "Username or Email" : "Username"}
          value={username}
          autoComplete="off"
          onChange={(e) => setUsername(e.target.value)}
        />
      </label>
      {username && username.length < 3 && username.length >= 1 && (
        <span className="ml-4 mt-0.5 self-start text-xs text-red-600">
          Username is too short
        </span>
      )}
    </div>
  );
}
