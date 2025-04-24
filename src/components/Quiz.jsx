import { useEffect, useState } from "react";
import Question from "./Questions";
import Options from "./Options";
import Loading from "./Loading";
import Error from "./Error";

const url =
  "https://opentdb.com/api.php?amount=15&category=9&difficulty=medium&type=multiple";

function Quiz() {
  const [data, setData] = useState(null);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [answerState, setAnswerState] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const fetchData = async () => {
        try {
          const res = await fetch(url);
          const json = await res.json();

          const formatted = json.results.map((q) => ({
            ...q,
            options: [...q.incorrect_answers, q.correct_answer].sort(
              () => Math.random() - 0.5
            ),
          }));

          setData(formatted);
          setLoading(false);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      };

      fetchData();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  const currentQuestion = data[current];

  const handleOptionClick = (option) => {
    setSelectedOption(option);

    /* Update score if the answer is correct */
    if (option === currentQuestion.correct_answer) {
      setScore((prevScore) => prevScore + 1);
      setAnswerState("correct");
    } else {
      setAnswerState("incorrect");
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setAnswerState(null);

    /* Set to completed after the last question */
    if (current === data.length - 1) {
      setQuizCompleted(true);
    } else {
      setCurrent((prev) => prev + 1);
    }
  };

  const resetQuiz = () => {
    setCurrent(0);
    setScore(0);
    setSelectedOption(null);
    setAnswerState(null);
    setQuizCompleted(false);
  };

  /* Display results when quiz is completed */
  if (quizCompleted) {
    return (
      <div className="quiz-container">
        <div className="quiz-completed">
          <h2>Quiz Completed!</h2>
          <div className="score-display">
            <p>
              Final score: <span className="final-score">{score}</span> out of{" "}
              {data.length}
            </p>
            <p>{Math.round((score / data.length) * 100)}% correct</p>
          </div>
          <button className="reset-button" onClick={resetQuiz}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      {currentQuestion && (
        <>
          <div className="quiz-header">
            <div className="progress">
              Question {current + 1}/{data.length}
            </div>
            <div className="score">
              Score: {score}/{data.length}
            </div>
          </div>

          <Question question={currentQuestion.question} />

          <Options
            options={currentQuestion.options}
            selectedOption={selectedOption}
            correctAnswer={currentQuestion.correct_answer}
            handleClick={handleOptionClick}
          />

          {selectedOption && (
            <button className="next-button" onClick={handleNextQuestion}>
              {current < data.length - 1 ? "Next" : "Results"}
            </button>
          )}
        </>
      )}
    </div>
  );
}

export default Quiz;
