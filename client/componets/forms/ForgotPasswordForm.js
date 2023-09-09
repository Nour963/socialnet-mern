import { SyncOutlined } from "@ant-design/icons";

const ForgotPasswordForm = ({
  email,
  setEmail,
  newPassword,
  setNewPassword,
  secret,
  setSecret,
  handleSubmit,
  loading,
  page,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group p-3">
        <small>
          <label className="text-muted">Email address</label>
        </small>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          className="form-control"
          placeholder="Enter Email"
        />
      </div>
      <div className="form-group p-3">
        <small>
          <label className="text-muted">New Password</label>
        </small>
        <input
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          type="password"
          className="form-control"
          placeholder="Enter Password"
        />
      </div>
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
      <div className="form-group p-3">
        <input
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          type="text"
          className="form-control"
          placeholder="Answer here"
        />
      </div>
      <div className="form-group p-3">
        <button
          disabled={!email || !newPassword || !secret || loading}
          className="btn btn-primary col-12 "
        >
          {loading ? <SyncOutlined spin className="py-5" /> : "Submit"}
        </button>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;
