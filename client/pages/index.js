import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context";
import axios from "axios";
import PostPublic from "../componets/cards/PostPublic";
import Post from "../componets/cards/Post";
import Head from "next/head";
import Link from "next/link";
import io from "socket.io-client";

//to see new posts in realtime
const socket = io(process.env.NEXT_PUBLIC_SOCKETIO, {
  reconnection: true,
});

//posts argument here is of the getServerSiePropos returned data
const Home = ({ posts }) => {
  const [state, setState] = useContext(UserContext);
  const [newsFeed, setNewsFeeds] = useState([]);

  //to see new posts in realtime
  useEffect(() => {
    socket.on("new-post", (newPost) => {
      //when receiving this event that a new post got created, add the new post to the old posts list variable
      setNewsFeeds([newPost, ...posts]);
    });
  }, []);

  //for SEO
  const head = () => {
    return (
      <Head>
        <title>My social network</title>
        <meta
          name="desctoption"
          content="a social network made by dev for dev"
        />
        <meta
          property="og:description"
          content="a social network made by dev for dev"
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="socialnet" />
        <meta property="og:url" content="http://socialnet.net" />
        <meta
          property="og:image:secure_url"
          content="http://localhost:3000/images/default.jpg"
        />
      </Head>
    );
  };

  //if no new post (so newsFeed var is empty, then allposts variable is only posts variable)
  const allposts = newsFeed.length > 0 ? newsFeed : posts;

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
          {allposts &&
            allposts.map((post) => (
              <div key={post._id} className="col-md-4">
                <Link href={`/post/view/${post._id}`}>
                  {/* {state && state.user._id ? (
                    <>
                      <Post key={post._id} post={post} />
                    </>
                  ) : (
                    <>
                      <PostPublic key={post._id} post={post} />
                    </>
                  )} */}
                  <Post page="home" key={post._id} post={post} />
                </Link>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export const getServerSideProps = async () => {
  const { data } = await axios.get("/posts");
  return {
    props: {
      posts: data,
    },
  };
};

export default Home;
