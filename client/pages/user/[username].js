import { Avatar, Card } from "antd";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context";
import Link from "next/link";
import { RollbackOutlined } from "@ant-design/icons";

const Username = () => {
  const [state, setState] = useContext(UserContext);
  const [user, setUser] = useState([]);

  const router = useRouter();

  useEffect(() => {
    if (router.query.username) fetchUser();
  }, [router.query.username]);

  const fetchUser = async () => {
    const username = router.query.username;
    try {
      const { data } = await axios.get(`/user/${username}`);
      setUser(data);
    } catch (err) {
      console.log(err);
    }
  };

  const imageSource = (user) => {
    if (user.image) return user.image.url;
    else return "/images/default.jpg";
  };

  return (
    <div className="row col-md-6 offset-md-3">
      <div className="pt-5 pb-5">
        <Card hoverable cover={<img src={imageSource(user)} alt={user.name} />}>
          <Card.Meta title={user.username} description={user.about} />
          <p className="pt-2 text-muted">
            Joined {moment(user.createdAt).fromNow()}
          </p>
          <div className="d-flex justify-content-between">
            <span className="btn btn-sm">
              {user.following && user.following.length} Following
            </span>
            <span className="btn btn-sm">
              {user.followers && user.followers.length} Followers
            </span>
          </div>
        </Card>

        <Link
          href="/user/dashboard"
          className="d-flex justify-content-center pt-5"
        >
          <RollbackOutlined />
        </Link>
      </div>
    </div>
  );
};

export default Username;
