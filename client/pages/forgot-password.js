import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Modal } from "antd";
import Link from "next/link";
import ForgotPasswordForm from "../componets/forms/ForgotPasswordForm";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [secret, setSecret] = useState("");
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    //console.log(name, email, password, secret);
    try {
      setLoading(true);
      const { data } = await axios.post("/forgot-password", {
        email,
        newPassword,
        secret,
      });
      console.log("forg data: ", data);
      if (data.error) {
        toast.error(data.error);
        setLoading(false);
      }
      setOk(true);
      //   setName("");
      //   setPassword("");
      //   setEmail("");
      //   setSecret("");
      setLoading(false);
    } catch (err) {
      console.log(err.response.data);
      toast.error(err.response.data);
    }
  };

  return (
    <div className="container-fuild">
      <div className="row py-5 text-light bg-default-image">
        <div className="col text-center">
          <h1>Forgot Password page</h1>
        </div>
      </div>
      <div className="row py-5">
        <div className="col-md-6 offset-md-3">
          <ForgotPasswordForm
            handleSubmit={handleSubmit}
            newPassword={newPassword}
            setNewPassword={setNewPassword}
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
            <p>Congratulation! you can now login with your new password</p>
            <Link href="/login" className="btn btn-primary">
              Login
            </Link>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
