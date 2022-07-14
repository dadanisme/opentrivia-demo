import "./Problem.css";
export default function Problem(props) {
  const handleSelectAnswer = (id) => {
    props.onUserAnswers(props.problemId, props.answers[id]);
  };

  return (
    <div className="problem-item">
      <div
        className="problem-question"
        dangerouslySetInnerHTML={{
          __html: props.problem.question,
        }}
      ></div>

      <div className="problem-answer">
        {props.answers.map((answer, index) => (
          <div
            key={index}
            className={
              "problem-answer-item " +
              (props.userAnswers[props.problemId] === answer ? "selected" : "")
            }
            onClick={() => handleSelectAnswer(index)}
            dangerouslySetInnerHTML={{
              __html: answer,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}
