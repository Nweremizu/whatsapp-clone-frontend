import { Envelope } from "@phosphor-icons/react";
import React from "react";

function Email({ email, setEmail }) {
  return (
    <div>
      <label className="input input-bordered flex items-center gap-2">
        <Envelope size={16} />
        <input
          type="email"
          className="grow"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
    </div>
  );
}

export default Email;
