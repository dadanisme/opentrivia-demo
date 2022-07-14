import Timer from "../Timer/Timer";
import "./Navbar.css";

export default function Navbar(props) {
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("remaining_time");
    localStorage.removeItem("user_answers");
    localStorage.removeItem("user_problems");
    window.location.href = "/login";
  };
  return (
    <div className="navbar-container">
      <Timer isTimerRunning={props.isTimerRunning} />
      <div className="user-information">
        <div>
          Signed as{" "}
          <span className="user-name">
            {JSON.parse(localStorage.getItem("user"))},{" "}
          </span>
          <span className="logout" onClick={handleLogout}>
            Logout
          </span>
        </div>
      </div>
    </div>
  );
}
