import { SyncOutlined } from "@ant-design/icons";

const AuthForm = ({
  name,
  setName,
  username,
  setUsername,
  about,
  setAbout,
  email,
  setEmail,
  password,
  setPassword,
  secret,
  setSecret,
  handleSubmit,
  loading,
  page,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      {page == "profile" && (
        <>
          <div className="form-group p-3">
            <small>
              <label className="text-muted">Username</label>
            </small>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              className="form-control"
              placeholder="Username"
            />
          </div>
          <div className="form-group p-3">
            <small>
              <label className="text-muted">About</label>
            </small>
            <input
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              type="text"
              className="form-control"
              placeholder="Write about yourself..."
            />
          </div>
        </>
      )}
      {page != "login" && (
        <div className="form-group p-3">
          <small>
            <label className="text-muted">Your Name</label>
          </small>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            className="form-control"
            placeholder="Enter Name"
          />
        </div>
      )}
      <div className="form-group p-3">
        <small>
          <label className="text-muted">Email address</label>
        </small>
        <input
          disabled={page == "profile"}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          className="form-control"
          placeholder="Enter Email"
        />
      </div>
      <div className="form-group p-3">
        <small>
          <label className="text-muted">Password</label>
        </small>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          className="form-control"
          placeholder="Enter Password"
        />
      </div>
      {page != "login" && (
        <div className="form-group p-3">
          <small>
            <label className="text-muted">Pick a question</label>
          </small>
          <select className="form-control">
            <option>What's your favorite color?</option>
            <option>What's your bff name?</option>
            <option>What city you were born in?</option>
          </select>
          <small className="form-text text-muted">
            You can use this to reset your password if forgotten
          </small>
        </div>
      )}
      {page != "login" && (
        <div className="form-group p-3">
          <input
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            type="text"
            className="form-control"
            placeholder="Answer here"
          />
        </div>
      )}
      <div className="form-group p-3">
        <button
          disabled={
            page === "login"
              ? !email || !password
              : page !== "profile"
              ? !email || !password || !name || !secret
              : false
          }
          className="btn btn-primary col-12 "
        >
          {loading ? <SyncOutlined spin className="py-5" /> : "Submit"}
        </button>
      </div>
    </form>
  );
};

export default AuthForm;
