import "./App.css";
import Navbar from "./Components/Navbar/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect, createContext } from "react";
import Problem from "./Components/Problem/Problem";

const TimeContext = createContext();

function App() {
  const [problems, setProblems] = useState([]);
  const [activeProblem, setActiveProblem] = useState(null);
  const [activeId, setActiveId] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [timeContext, setTimeContext] = useState(() => {
    if (localStorage.getItem("remaining_time")) {
      return JSON.parse(localStorage.getItem("remaining_time"));
    } else {
      return 600;
    }
  });

  useEffect(() => {
    // check is login or not
    if (localStorage.getItem("user") === null) {
      window.location.href = "/login";
    }

    if (localStorage.getItem("is_done")) {
      setIsFinished(true);
    }
    // check if user has problems set
    if (localStorage.getItem("user_problems")) {
      setProblems(JSON.parse(localStorage.getItem("user_problems")));
    } else {
      fetch("https://opentdb.com/api.php?amount=15&type=multiple")
        .then((res) => res.json())
        .then((data) => {
          setProblems(data.results);
          localStorage.setItem("user_problems", JSON.stringify(data.results));
        });
    }

    // check for saved answers
    if (localStorage.getItem("user_answers")) {
      setUserAnswers(JSON.parse(localStorage.getItem("user_answers")));
    }
  }, []);

  useEffect(() => {
    if (timeContext === 0) {
      setIsFinished(true);
    }
  }, [timeContext]);

  useEffect(() => {
    setActiveProblem(problems[activeId]);
  }, [activeId, problems]);

  useEffect(() => {
    const newAnswers = problems.map((curr) => {
      return [...curr.incorrect_answers, curr.correct_answer]
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
    });
    setAnswers(newAnswers);
  }, [problems]);

  useEffect(() => {
    localStorage.setItem("user_answers", JSON.stringify(userAnswers));
  }, [userAnswers]);

  const handleNext = () => {
    if (activeId < problems.length - 1) {
      setActiveId((prevId) => prevId + 1);
    }
  };

  const handlePrev = () => {
    if (activeId > 0) {
      setActiveId((prevId) => prevId - 1);
    }
  };

  const handleStart = () => {
    if (problems.length > 0) {
      setActiveId(0);
      setActiveProblem(problems[0]);
      setIsRunning(true);
      if (userAnswers.length === 0) {
        setUserAnswers(Array(problems.length).fill(null));
      }
    }
  };

  const handleFinish = () => {
    setIsFinished(true);
    setIsRunning(false);
    localStorage.setItem("is_done", true);
  };

  const handleUserAnswers = (id, answer) => {
    setUserAnswers((prevAnswers) => {
      const newAnswers = [...prevAnswers];
      newAnswers[id] = answer;
      return newAnswers;
    });
    setTimeout(() => {
      handleNext();
    }, 1000);
  };

  return (
    <TimeContext.Provider value={[timeContext, setTimeContext]}>
      {isFinished ? (
        <>
          <Navbar isTimerRunning={false} />
          <div className="result-container">
            <h1>You have done the quiz!</h1>
            <div className="result-info">
              <div className="result-info-item">
                <h3>
                  Your score:{" "}
                  <span>
                    {userAnswers.filter(
                      (answer, index) =>
                        answer === problems[index].correct_answer
                    ).length *
                      10 +
                      "%"}
                  </span>
                </h3>
              </div>
              <div className="result-info-item"></div>
            </div>
          </div>
        </>
      ) : (
        <div className="App">
          <Navbar isTimerRunning={isRunning} />
          {isRunning && (
            <div className="problem-container">
              <div className="problem-header">
                <div className="problem-number">
                  {activeId + 1}/{problems.length}
                </div>
                <div className="problem-category">{activeProblem.category}</div>
              </div>
              <Problem
                problem={activeProblem}
                problemId={activeId}
                answers={answers[activeId]}
                userAnswers={userAnswers}
                onUserAnswers={handleUserAnswers}
              />
              <div className="controls">
                <button
                  className="btn btn-outline-light"
                  onClick={handlePrev}
                  disabled={activeId === 0}
                >
                  Prev
                </button>
                {activeId !== problems.length - 1 ? (
                  <button
                    className="btn btn-outline-light"
                    onClick={handleNext}
                    disabled={activeId === problems.length - 1}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    className="btn btn-outline-danger"
                    onClick={handleFinish}
                  >
                    Finish
                  </button>
                )}
              </div>
            </div>
          )}

          {!isRunning && (
            <div className="start-container">
              <button
                className="btn btn-outline-dark btn-start"
                onClick={handleStart}
                disabled={problems.length === 0}
              >
                {problems.length === 0
                  ? "Loading"
                  : timeContext === 600
                  ? "Start"
                  : "Continue"}
              </button>
            </div>
          )}
        </div>
      )}
    </TimeContext.Provider>
  );
}

export default App;
export { TimeContext };
