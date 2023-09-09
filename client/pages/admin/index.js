import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import axios from "axios";
import renderHTML from "react-render-html";
import AdminRoute from "../../componets/routes/AdminRoute";

const Admin = () => {
  const [state, setState] = useContext(UserContext);

  const [posts, setPosts] = useState([]);
  1;

  const router = useRouter();

  useEffect(() => {
    if (state && state.token) {
      newsFeed();
    }
  }, [state && state.token]);

  const newsFeed = async () => {
    try {
      console.log("hi");
      const { data } = await axios.get(`/posts`);
      console.log(data);
      setPosts(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (post) => {
    try {
      const answer = window.confirm("are you sure to delete this post?");
      if (!answer) return;
      const data = await axios.delete(`/admin/delete-post/${post._id}`);
      toast.success("Post deleted!");
      newsFeed();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <AdminRoute>
      <div className="container-fluid">
        <div className="row py-5 text-light bg-default-image">
          <div className="col text-center">
            <h1>Admin</h1>
          </div>
        </div>
        <div className="row py-4">
          <div className="col-md-8 offset-md-2">
            {posts &&
              posts.map((p) => (
                <div key={p._id} className="d-flex justify-content-between">
                  <div>
                    {renderHTML(p.content)} - <b>{p.postedBy.name} </b>
                  </div>
                  <div className="text-danger" onClick={() => handleDelete(p)}>
                    Delete
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </AdminRoute>
  );
};

export default Admin;
