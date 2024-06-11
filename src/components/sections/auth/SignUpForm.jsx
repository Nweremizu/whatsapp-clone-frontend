import Image from "../../Image";
import Username from "../../Auth/Username";
import Password from "../../Auth/Password";
import SubmitButton from "../../Auth/SubmitButton";
import { useState } from "react";
import Email from "../../Auth/Email";
import { RegisterUser } from "../../../redux/slices/auth";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

export default function SignUpForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const reset = () => {
    setUsername("");
    setEmail("");
    setPassword("");
  };

  const handleSubmit = async () => {
    try {
      const user = {
        username: username,
        email: email,
        password: password,
      };
      const result = await dispatch(RegisterUser(user));
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
        <Username username={username} setUsername={setUsername} />
        <Email email={email} setEmail={setEmail} />
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
        <SubmitButton text="Sign Up" onClick={() => handleSubmit()} />
      </form>
      <Link to="/login" className="text-accent-whatsapp-green">
        Already have an account? Sign in
      </Link>
    </div>
  );
}
