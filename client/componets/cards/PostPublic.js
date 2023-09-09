import renderHTML from "react-render-html";
import moment from "moment";
import { Avatar } from "antd";
import PostImage from "../images/PostImage";
import { HeartOutlined, CommentOutlined } from "@ant-design/icons";
import { imageSource } from "../../functions";

const PostPublic = ({ post, commentsCount = 2 }) => {
  return (
    <>
      {post && post.postedBy && (
        <div className="card mb-5" key={post._id}>
          <div className="card-header">
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
              <HeartOutlined className="text-danger pt-2 px-2" />
              <div className="pt-2"> {post.likes.length} likes</div>
              <CommentOutlined className="text-danger pt-2 h5 px-3" />
              <div className="pt-2">{post.comments.length} comments</div>
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
                </li>
              ))}
            </ol>
          )}
        </div>
      )}
    </>
  );
};

export default PostPublic;
