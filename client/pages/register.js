import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Modal } from "antd";
import Link from "next/link";
import AuthForm from "../componets/forms/AuthForm";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secret, setSecret] = useState("");
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    //console.log(name, email, password, secret);
    try {
      setLoading(true);
      const { data } = await axios.post("/register", {
        name,
        email,
        password,
        secret,
      });
      if (data.error) {
        toast.error(data.error);
        setLoading(false);
      } else {
        setOk(true);
        setName("");
        setPassword("");
        setEmail("");
        setSecret("");
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
      toast.error(err);
    }
  };

  return (
    <div className="container-fuild">
      <div className="row py-5 text-light bg-default-image">
        <div className="col text-center">
          <h1>Register page</h1>
        </div>
      </div>
      <div className="row py-5">
        <div className="col-md-6 offset-md-3">
          <AuthForm
            handleSubmit={handleSubmit}
            name={name}
            setName={setName}
            password={password}
            setPassword={setPassword}
            email={email}
            setEmail={setEmail}
            secret={secret}
            setSecret={setSecret}
            loading={loading}
            page="register"
          />
        </div>
      </div>
      <div className="row">
        <div className="col">
          <Modal
            title="Congratulation"
            open={ok}
            onCancel={() => setOk(false)}
            footer={null}
          >
            <p>You have successfully registered!</p>
            <Link href="/login" className="btn btn-primary">
              Login
            </Link>
          </Modal>
        </div>
      </div>
      <div className="row">
        <div className="col text-center">
          Already registered? <Link href="/login">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
