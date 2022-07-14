import { useEffect, useState, useContext } from "react";
import "./Timer.css";
import { TimeContext } from "../../App";
export default function Timer(props) {
  const [remainingTime, setRemainingTime] = useContext(TimeContext);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  useEffect(() => {
    setIsTimerRunning(props.isTimerRunning);
  }, [props.isTimerRunning]);

  const updateTimer = () => {
    setRemainingTime((prevTime) => prevTime - 1);
  };

  useEffect(() => {
    if (isTimerRunning) {
      const timer = setInterval(updateTimer, 1000);
      return () => clearInterval(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTimerRunning]);

  useEffect(() => {
    localStorage.setItem("remaining_time", remainingTime);
  }, [remainingTime]);

  const convertTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time - minutes * 60;

    const minutesString = minutes < 10 ? `0${minutes}` : minutes;
    const secondsString = seconds < 10 ? `0${seconds}` : seconds;

    return `${minutesString}:${secondsString}`;
  };

  return (
    <>
      <div className="timer">
        <h4>Times left {convertTime(remainingTime)}</h4>
      </div>
      <div className="problem-info"></div>
    </>
  );
}
