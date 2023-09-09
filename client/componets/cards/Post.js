import { useContext } from "react";
import renderHTML from "react-render-html";
import moment from "moment";
import { Avatar } from "antd";
import PostImage from "../images/PostImage";
import {
  HeartOutlined,
  HeartFilled,
  CommentOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { UserContext } from "../../context";
import { useRouter } from "next/router";
import { imageSource } from "../../functions";
import Link from "next/link";

const Post = ({
  handleLike,
  post,
  page,
  handleDelete,
  handleUnlike,
  handleComment,
  commentsCount = 2,
  removeComment,
}) => {
  const [state] = useContext(UserContext);
  const router = useRouter();
  return (
    <>
      {post && post.postedBy && (
        <div className="card mb-5" key={post._id}>
          <div className="card-header">
            {/* <Avatar size={40} className="mb-2">{post.postedBy.name[0].toUpperCase()}</Avatar> */}
            <Avatar
              size={40}
              className="mb-2"
              src={imageSource(post.postedBy)}
            />

            <span className="pt-2" style={{ marginLeft: "1rem" }}>
              {post.postedBy.name}
            </span>
            <span className="pt-2" style={{ marginLeft: "1rem" }}>
              {moment(post.createdAt).fromNow()}
            </span>
          </div>
          <div className="card-body"> {renderHTML(post.content)}</div>
          <div className="card-footer mt-2">
            {post.image && <PostImage url={post.image.url} />}
            <div className="d-flex pt-2">
              {state && state.user && post.likes.includes(state.user._id) ? (
                <HeartFilled
                  onClick={() => handleUnlike(post._id)}
                  className="text-danger pt-2 px-2"
                />
              ) : (
                <HeartOutlined
                  onClick={() => handleLike(post._id)}
                  className="text-danger pt-2 px-2"
                />
              )}
              <div className="pt-2"> {post.likes.length} likes</div>
              <CommentOutlined
                onClick={() => handleComment(post)}
                className="text-danger pt-2 h5 px-3"
              />
              <div className="pt-2">
                {page == "home" ? (
                  <p> {post.comments.length} comments </p>
                ) : (
                  <>
                    <Link href={`/post/${post._id}`}>
                      {post.comments.length} comments
                    </Link>
                  </>
                )}
              </div>
              {state && state.user && state.user._id === post.postedBy._id && (
                <>
                  <EditOutlined
                    onClick={() => router.push(`/user/post/${post._id}`)}
                    className="text-danger pt-2 h5 px-3"
                  />
                  <DeleteOutlined
                    onClick={() => handleDelete(post)}
                    className="text-danger pt-2 h5 px-3"
                  />
                </>
              )}
            </div>
          </div>
          {/* by default show 2 comments only */}
          {post.comments && post.comments.length > 0 && (
            <ol
              className="list-group"
              style={{ maxHeight: "125px", overflow: "scroll" }}
            >
              {post.comments.slice(`-${commentsCount}`).map((c) => (
                <li
                  className="list-group-item d-flex justify-content-between align-item-start"
                  key={c._id}
                >
                  <div className="ms-2 me-auto">
                    <div>
                      <Avatar
                        size={20}
                        className="mb-1 mr-3"
                        src={imageSource(c.postedBy)}
                      />
                      {c.postedBy.name}
                    </div>
                    <div>{c.text}</div>
                  </div>
                  <span className="badge rounded-pill text-muted">
                    {moment(c.createdAt).fromNow()}
                    {state &&
                      state.user &&
                      state.user._id === c.postedBy._id && (
                        <div className="ml-auto mt-1">
                          <DeleteOutlined
                            onClick={() => removeComment(post._id, c)}
                            className="pl-2 text-danger"
                          />
                        </div>
                      )}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </div>
      )}
    </>
  );
};

export default Post;
