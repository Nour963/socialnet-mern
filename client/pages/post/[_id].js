import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import UserRoute from "../../componets/routes/UserRoute";
import { toast } from "react-toastify";
import Post from "../../componets/cards/Post";
import Link from "next/link";

const PostCommment = () => {
  const [post, setPost] = useState({});
  const router = useRouter();
  const _id = router.query._id;

  useEffect(() => {
    if (_id) fetchPost();
  }, [_id]);

  const removeComment = async (postId, comment) => {
    let answer = window.confirm("u sure?");
    if (!answer) return;
    const { data } = await axios.put(`/remove-comment`, { postId, comment });
    fetchPost();
  };

  const fetchPost = async () => {
    try {
      const { data } = await axios.get(`/user-post/${_id}`);
      setPost(data);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <div className="container-fluid">
        <div className="row py-5 text-light bg-default-image">
          <div className="col text-center">
            <h1>socialnet</h1>
          </div>
        </div>
      </div>
      <div className="raw col-md-8 offset-md-2">
        <Post post={post} commentsCount="100" removeComment={removeComment} />
      </div>
      <Link href="/user/dashboard/">
        <div className="d-flex justify-content-center p-5"></div>
      </Link>
    </>
  );
};

export default PostCommment;
