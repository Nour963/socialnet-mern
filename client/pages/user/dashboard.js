import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context";
import { toast } from "react-toastify";
import UserRoute from "../../componets/routes/UserRoute";
import PostForm from "../../componets/forms/PostForm";
import { useRouter } from "next/router";
import axios from "axios";
import PostList from "../../componets/cards/PostList";
import People from "../../componets/cards/People";
import Link from "next/link";
import { Modal, Pagination } from "antd";
import CommentForm from "../../componets/forms/CommentForm";
import Search from "../../componets/Search";
import io from "socket.io-client";

//to see new posts in realtime
const socket = io(process.env.NEXT_PUBLIC_SOCKETIO, {
  reconnection: true,
});

const Home = () => {
  const [state, setState] = useContext(UserContext);
  const [content, setContent] = useState("");
  const [image, setImage] = useState({});
  const [uploading, setUploading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [people, setPeople] = useState([]);
  //comments
  const [comment, setComment] = useState("");
  const [visible, setVisible] = useState(false);
  const [currentPost, setCurrentPost] = useState("");
  //pagination
  const [totalPosts, setTotalPosts] = useState(0);
  const [page, setPage] = useState(1);

  const router = useRouter();

  useEffect(() => {
    if (state && state.token) {
      newsFeed();
      findPeople();
    }
  }, [state && state.token, page]);

  useEffect(() => {
    try {
      axios.get("/total-posts").then(({ data }) => setTotalPosts(data));
    } catch (error) {}
  }, []);

  const newsFeed = async () => {
    try {
      const { data } = await axios.get(`/newsfeed/${page}`);
      setPosts(data);
    } catch (err) {
      console.log(err);
    }
  };

  const findPeople = async () => {
    try {
      const { data } = await axios.get("/find-people");
      console.log(data);
      setPeople(data);
    } catch (err) {
      console.log(err);
    }
  };

  const postSubmit = async (e) => {
    e.preventDefault();
    console.log("content is: ", content);
    try {
      const { data } = await axios.post("/create-post", { content, image });
      console.log("post response: ", data);
      if (data.error) {
        toast.error(data.error);
      } else {
        newsFeed();
        toast.success("Post created!");
        setContent("");
        setImage({});

        //socket
        socket.emit("new-post", data);
      }
    } catch (err) {
      console.log("err: ", err);
    }
  };

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

  const handleDelete = async (post) => {
    try {
      const answer = window.confirm("are you sure to delete this post?");
      if (!answer) return;
      const data = await axios.delete(`delete-post/${post._id}`);
      toast.success("Post deleted!");
      newsFeed();
    } catch (err) {
      console.log(err);
    }
  };

  const handleFollow = async (user) => {
    try {
      const { data } = await axios.put("/user-follow", { _id: user._id });
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

  const handleLike = async (_id) => {
    try {
      const { data } = await axios.put("/like-post", { _id });
      newsFeed();
      console.log("liked ", data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUnlike = async (_id) => {
    try {
      const { data } = await axios.put("/unlike-post", { _id });
      newsFeed();
      console.log("unliked ", data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleComment = (post) => {
    setCurrentPost(post);
    setVisible(true);
  };

  const addComment = async (e) => {
    e.preventDefault();
    console.log("current currentPost._id ", currentPost._id);
    //we get the post from the currentpost state
    //get comment from comment state
    try {
      const { data } = await axios.put("/add-comment", {
        postId: currentPost._id,
        comment,
      });
      console.log("comment: ", data);
      setComment("");
      setVisible(false);
      newsFeed();
    } catch (err) {
      console.log(err);
    }
  };

  const removeComment = async () => {};

  return (
    <UserRoute>
      <div className="container-fluid">
        <div className="row py-5 text-light bg-default-image">
          <div className="col text-center">
            <h1>News Feed</h1>
          </div>
        </div>
      </div>
      <div className="row py-3">
        <div className="col-md-8">
          <PostForm
            content={content}
            setContent={setContent}
            postSubmit={postSubmit}
            handleImage={handleImage}
            uploading={uploading}
            image={image}
          />
          <br />
          <PostList
            posts={posts}
            handleDelete={handleDelete}
            handleLike={handleLike}
            handleUnlike={handleUnlike}
            handleComment={handleComment}
          />
          <Pagination
            current={page}
            total={(totalPosts / 3) * 10}
            onChange={(value) => setPage(value)}
          />
        </div>
        {/* <pre>{JSON.stringify(posts, null, 4)}</pre> */}
        <div className="col-md-4 h5">
          <div>
            <Search />
          </div>
          {state && state.user && state.user.following && (
            <Link href="/user/following">
              {state.user.following.length} Following
            </Link>
          )}
          <People people={people} handleFollow={handleFollow} />
        </div>
        <Modal
          open={visible}
          onCancel={() => setVisible(false)}
          title="Comment"
          footer={null}
        >
          <CommentForm
            comment={comment}
            setComment={setComment}
            addComment={addComment}
          />
        </Modal>
      </div>
    </UserRoute>
  );
};

export default Home;
