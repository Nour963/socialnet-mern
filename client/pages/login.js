import { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Modal } from "antd";
import Link from "next/link";
import AuthForm from "../componets/forms/AuthForm";
import { useRouter } from "next/router";
import { UserContext } from "../context";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [state, setState] = useContext(UserContext);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    //console.log(name, email, password, secret);
    try {
      setLoading(true);
      const { data } = await axios.post("/login", {
        email,
        password,
      });

      if (data.error) {
        toast.error(data.error);
        setLoading(false);
      } else {
        //update context
        setState({
          user: data.user,
          token: data.token,
        });

        //save localstorage
        window.localStorage.setItem("auth", JSON.stringify(data));

        router.push("/");
      }
    } catch (err) {
      console.log("error login: ", err);
      setLoading(false);
    }
  };

  return (
    <div className="container-fuild">
      <div className="row py-5 text-light bg-default-image">
        <div className="col text-center">
          <h1>Login page</h1>
        </div>
      </div>
      <div className="row py-5">
        <div className="col-md-6 offset-md-3">
          <AuthForm
            handleSubmit={handleSubmit}
            password={password}
            setPassword={setPassword}
            email={email}
            setEmail={setEmail}
            loading={loading}
            page="login"
          />
        </div>
      </div>
      <div className="row">
        <div className="col text-center">
          Not yet registered? <Link href="/register">Register</Link>
        </div>
      </div>
      <div className="row">
        <div className="col text-center text-danger">
          Forgot password? <Link href="/forgot-password">Reset password</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
