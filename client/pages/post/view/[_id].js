import axios from "axios";
import { useContext } from "react";
import { UserContext } from "../../../context";
import PostPublic from "../../../componets/cards/PostPublic";
import Post from "../../../componets/cards/Post";
import Head from "next/head";

//posts argument here is of the getServerSiePropos returned data
const SinglePost = ({ post }) => {
  const [state, setState] = useContext(UserContext);

  //for SEO, and some fields are dynamic
  const head = () => {
    return (
      <Head>
        <title>My social network</title>
        <meta
          name="desription"
          content="a social network made by dev for dev"
        />
        <meta
          property="og:description"
          content="a social network made by dev for dev"
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="socialnet" />
        <meta
          property="og:url"
          content={`http://localhost:3000/post/view/${post._id}`}
        />
        <meta
          property="og:image:secure_url"
          content="http://localhost:3000/images/default.jpg"
        />
      </Head>
    );
  };
  return (
    <>
      {head()}
      <div
        className="container-fluid"
        style={{
          backgroundImage: "url(" + "/images/default.jpg" + " )",
          backgroundAttachment: "fixed",
          padding: "100px 0px 75px 0px",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center cente",
          display: "block",
        }}
      >
        <h1 className="display-1 text-center py-5">Home page</h1>
      </div>
      <div className="container">
        <div className="row pt-5">
          <div key={post._id} className="col">
            {state && state.user._id ? (
              <>
                <Post key={post._id} post={post} />
              </>
            ) : (
              <>
                <PostPublic key={post._id} post={post} />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps = async (ctx) => {
  const { data } = await axios.get(`/post/${ctx.params._id}`);
  return {
    props: {
      post: data,
    },
  };
};

export default SinglePost;
