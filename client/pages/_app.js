import { UserProvider } from "../context";
import "bootstrap/dist/css/bootstrap.min.css";
import Nav from "../componets/Nav";
import Head from "next/head";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "antd/dist/reset.css";

function MyApp({ Component, pageProps }) {
  if (typeof window !== "undefined") {
    window.__NEXT_DATA__.props.pageProps.html = true;
  }
  return (
    <UserProvider>
      <Nav />
      <ToastContainer position="top-center" />
      <Component {...pageProps} />
    </UserProvider>
  );
}

export default MyApp;
