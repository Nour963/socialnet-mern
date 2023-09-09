import { useState, useContext, useEffect } from "react";
import { Avatar } from "antd";

import axios from "axios";
import { toast } from "react-toastify";
import { Modal } from "antd";
import Link from "next/link";
import AuthForm from "../../../componets/forms/AuthForm";
import { UserContext } from "../../../context";
import { CameraOutlined, LoadingOutlined } from "@ant-design/icons";

const ProfileUpdate = () => {
  const [username, setUsername] = useState("");
  const [about, setAbout] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secret, setSecret] = useState("");
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  //profile pic
  const [image, setImage] = useState({});
  const [uploading, setUploading] = useState(false);

  const [state, setState] = useContext(UserContext);

  const handleImage = async (e) => {
    const file = e.target.files[0];
    let formData = new FormData();
    formData.append("image", file);
    setUploading(true);
    console.log([...formData]);
    try {
      const { data } = await axios.post("/upload-image", formData);
      if (data.error) {
        toast.error(data.error);
      } else {
        setImage({
          url: data.url,
          public_id: data.public_id,
        });
      }
      setUploading(false);
    } catch (err) {
      console.log(err);
      setUploading(false);
    }
  };

  useEffect(() => {
    if (state && state.user) {
      setUsername(state.user.username);
      setAbout(state.user.about);
      setEmail(state.user.email);
      setName(state.user.name);
      setImage(state.user.image);
    }
  }, [state && state.user]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    //console.log(name, email, password, secret);
    try {
      setLoading(true);
      const { data } = await axios.put("/profile-update", {
        name,
        about,
        username,
        password,
        secret,
        image,
      });
      if (data.error) {
        toast.error(data.error);
        setLoading(false);
      } else {
        console.log("update profile: ", data);

        //update localstorage auth but keep token
        let auth = JSON.parse(localStorage.getItem("auth"));
        auth.user = data;
        localStorage.setItem("auth", JSON.stringify(auth));
        //update context, only user key
        setState({ ...state, user: data });
        setOk(true);
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
          <h1>Profile page</h1>
        </div>
      </div>
      <div className="row py-5">
        <div className="col-md-6 offset-md-3">
          <label className="d-flex justify-content-center h5">
            {image && image.url ? (
              <Avatar size={30} src={image.url} className="mt-1" />
            ) : uploading ? (
              <LoadingOutlined className="mt-2" />
            ) : (
              <CameraOutlined className="mt-2" />
            )}

            <input
              onChange={handleImage}
              type="file"
              accept="images/*"
              hidden
            />
          </label>
          <AuthForm
            handleSubmit={handleSubmit}
            name={name}
            setName={setName}
            username={username}
            setUsername={setUsername}
            about={about}
            setAbout={setAbout}
            password={password}
            setPassword={setPassword}
            email={email}
            setEmail={setEmail}
            secret={secret}
            setSecret={setSecret}
            loading={loading}
            page="profile"
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
            <p>You have successfully updated!</p>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default ProfileUpdate;
