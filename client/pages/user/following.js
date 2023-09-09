import { Avatar, List } from "antd";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context";
import Link from "next/link";
import { RollbackOutlined } from "@ant-design/icons";

const Following = () => {
  const [state, setState] = useContext(UserContext);
  const [people, setPeople] = useState([]);

  useEffect(() => {
    if (state && state.token) fetchFollowing();
  }, [state && state.token]);

  const router = useRouter();

  const fetchFollowing = async () => {
    try {
      console.log("hi");
      const { data } = await axios.get("/user-following");
      setPeople(data);
    } catch (err) {
      console.log(err);
    }
  };

  const imageSource = (user) => {
    if (user.image) return user.image.url;
    else return "/images/default.jpg";
  };

  const handleUnfollow = async (user) => {
    try {
      const { data } = await axios.put("/user-unfollow", { _id: user._id });
      //update localstorage, only user field
      let auth = JSON.parse(localStorage.getItem("auth"));
      auth.user = data;
      localStorage.setItem("auth", JSON.stringify(auth));
      //update state, only user field
      setState({ ...state, user: data });
      //remove followed user from people list
      let filtered = people.filter((p) => p._id !== user._id);
      setPeople(filtered);
      //re-render posts list with followed user's posts
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="row col-md-6 offset-md-3">
      <List
        itemLayout="horizontal"
        dataSource={people}
        renderItem={(user) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={imageSource(user)} />}
              title={
                <div className="d-flex justify-content-between">
                  {user.username}

                  <span
                    onClick={() => handleUnfollow(user)}
                    className="text-danger pointer"
                  >
                    Unfollow
                  </span>
                </div>
              }
            />
          </List.Item>
        )}
      />
      <Link
        href="/user/dashboard"
        className="d-flex justify-content-center pt-5"
      >
        <RollbackOutlined />
      </Link>
    </div>
  );
};

export default Following;
