import { useRouter } from "next/router";
import UserRoute from "../../../componets/routes/UserRoute";
import PostForm from "../../../componets/forms/PostForm";
import { toast } from "react-toastify";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "../../../context";
import axios from "axios";

const EditPost = () => {
  const [post, setPost] = useState();
  const [state, setState] = useContext(UserContext);
  const [content, setContent] = useState("");
  const [image, setImage] = useState({});
  const router = useRouter();
  const _id = router.query._id;

  useEffect(() => {
    if (_id) fetchPost();
  }, [_id]);

  const postSubmit = async (e) => {
    e.preventDefault();
    console.log("submit");
    try {
      const { data } = await axios.put(`/update-post/${_id}`, {
        content,
        image,
      });
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success("Post updated");
        router.push("/user/dashboard");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleImage = async (e) => {
    const file = e.target.files[0];
    let formData = new FormData();
    formData.append("image", file);
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
    } catch (err) {
      console.log(err);
    }
  };

  const fetchPost = async (req, res) => {
    try {
      const { data } = await axios.get(`/user-post/${_id}`);
      setPost(data);
      setContent(data.content);
      setImage(data.image);
      console.log("coo", data.content);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <UserRoute>
        <div className="container-fluid">
          <div className="row py-5 text-light bg-default-image">
            <div className="col text-center">
              <h1>News Feed</h1>
            </div>
          </div>
        </div>
        <div className="row py-3">
          <div className="col-md-8 offset-md-2">
            <PostForm
              content={content}
              setContent={setContent}
              postSubmit={postSubmit}
              handleImage={handleImage}
              image={image}
            />
          </div>
          {/* <pre>{JSON.stringify(posts, null, 4)}</pre> */}
        </div>
      </UserRoute>
    </>
  );
};

export default EditPost;
