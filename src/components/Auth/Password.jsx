import { Key } from "@phosphor-icons/react";
// import { useStateValue } from "../utils/StateProvider";

function Password({ password, setPassword }) {
  //   const [{ password }, dispatch] = useStateValue();
  return (
    <div>
      <label className="input input-bordered flex items-center gap-2">
        <Key size={16} />
        <input
          type="password"
          className="grow"
          placeholder="Password"
          autoComplete="off"
          required
          min={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
    </div>
  );
}

export default Password;
