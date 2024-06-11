/* eslint-disable react/no-unescaped-entities */
import { useState } from "react";
import Image from "../../Image";
import Username from "../../Auth/Username";
import SubmitButton from "../../Auth/SubmitButton";
import Password from "../../Auth/Password";
import { LoginUser } from "../../../redux/slices/auth";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const reset = () => {
    setUsername("");
    setPassword("");
  };

  const handleSubmit = async () => {
    try {
      const user = {
        username: username,
        password: password,
      };
      const result = await dispatch(LoginUser(user));
      if (result.success) {
        navigate("/app/dashboard");
        reset();
      }
    } catch (error) {
      reset();
    }
  };
  return (
    <div className="flex h-fit min-w-96 flex-col items-center justify-center gap-4 rounded-lg bg-white px-10 py-20 shadow-lg">
      <Image
        src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
        alt="Whatsapp Logo"
        className="size-28"
      />
      <h1 className="text-2xl font-semibold">Sign in to WhatsApp</h1>
      <form className="flex flex-col gap-4 w-full">
        <Username
          username={username}
          setUsername={setUsername}
          type={"login"}
        />
        <Password password={password} setPassword={setPassword} />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            width={30}
            height={30}
            className="accent-whatsapp-green size-4"
          />
          <span>Remember me</span>
        </label>
        <SubmitButton text="Sign in" onClick={handleSubmit} />
      </form>
      <Link to="/signup" className="text-accent-whatsapp-green">
        Don't have an account? Sign up
      </Link>
    </div>
  );
}
