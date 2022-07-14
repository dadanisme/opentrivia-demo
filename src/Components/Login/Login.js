import { useState } from "react";
import "./Login.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [needAlert, setNeedAlert] = useState(false);

  const users = [
    { username: "admin", password: "admin" },
    { username: "user", password: "user" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(username, password);
    const user = users.find((user) => user.username === username);
    if (user && user.password === password) {
      localStorage.setItem("user", JSON.stringify(user.username));
      window.location.href = "/";
    } else {
      setNeedAlert(true);
    }
  };

  if (localStorage.getItem("user")) {
    window.location.href = "/";
  }

  return (
    <div className="login-container">
      <div className="login-form">
        <form onSubmit={handleSubmit}>
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="name@example.com"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              name="username"
              required
            />
            <label htmlFor="floatingInput">Username</label>
          </div>
          <div className="form-floating">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              name="password"
              required
            />
            <label htmlFor="floatingPassword">Password</label>
          </div>
          <button
            type="submit"
            className="mt-3 btn btn-outline-secondary login-btn"
          >
            Login
          </button>
        </form>
        {needAlert && (
          <div className="alert alert-danger mt-3" role="alert">
            Wrong username or password.
          </div>
        )}
      </div>
    </div>
  );
}
