import { useState, useContext } from "react";
import { UserContext } from "../context";
import axios from "axios";
import People from "../componets/cards/People";

const Search = () => {
  const [state, setState] = useContext(UserContext);
  const [query, setQuery] = useState("");
  const [result, setResult] = useState([]);

  const searchUser = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get(`/search-user/${query}`);
      console.log("search result: ", data);
      setResult(data);
      console.log("gi", result);
    } catch (error) {
      console.log(error);
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
      let filtered = result.filter((p) => p._id !== user._id);
      setResult(filtered);
      console.log(result);
      //re-render posts list with followed user's posts
    } catch (err) {
      console.log(err);
    }
  };

  const handleUnfollow = async (user) => {
    try {
      const { data } = await axios.put("/user-unfollow", { _id: user._id });
      //update localstorage, only user field
      let auth = JSON.parse(localStorage.getItem("auth"));
      auth.user = data;
      localStorage.setItem("auth", JSON.stringify(auth));
      //update state, only user field
      setState({ ...state, user: data });
      //remove followed user from people list
      let filtered = result.filter((p) => p._id !== user._id);
      setResult(filtered);

      //re-render posts list with followed user's posts
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <form className="form-inline row" onSubmit={searchUser}>
        <div className="col-8">
          <input
            onChange={(e) => {
              setQuery(e.target.value);
              setResult([]);
            }}
            value={query}
            className="form-control"
            type="search"
            placeholder="Search..."
          />
        </div>
        <div className="col-4">
          <button className="btn btn-primary col-12" type="submit">
            Search
          </button>
        </div>
      </form>
      {result.length > 0 && (
        <People
          people={result}
          handleFollow={handleFollow}
          handleUnfollow={handleUnfollow}
        />
      )}
    </>
  );
};

export default Search;
