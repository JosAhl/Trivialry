import { useEffect, useState } from "react";
import Category from "./Category";
import Question from "./Questions";
import Options from "./Options";
import Loading from "./Loading";
import Error from "./Error";

function Quiz() {
  const [category, setCategory] = useState(null);
  const [data, setData] = useState(null);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [answerState, setAnswerState] = useState(null);

  useEffect(() => {
    if (!category) return;

    const timer = setTimeout(() => {
      const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
          const res = await fetch(
            `https://opentdb.com/api.php?amount=15&category=${category.id}&difficulty=medium&type=multiple`
          );
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
  }, [category]);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    if (option === data[current].correct_answer) {
      setScore((prev) => prev + 1);
      setAnswerState("correct");
    } else {
      setAnswerState("incorrect");
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setAnswerState(null);
    if (current === data.length - 1) {
      setQuizCompleted(true);
    } else {
      setCurrent((prev) => prev + 1);
    }
  };

  const resetQuiz = () => {
    setCategory(null);
    setData(null);
    setCurrent(0);
    setScore(0);
    setSelectedOption(null);
    setAnswerState(null);
    setQuizCompleted(false);
  };

  if (!category) return <Category onSelectCategory={setCategory} />;
  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  if (quizCompleted) {
    return (
      <div className="quiz-container">
        <div className="quiz-completed">
          <h2>Final Score:</h2>
          <div className="score-display">
            <p>
              <span className="final-score">{score}</span> out of {data.length}
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

  const currentQuestion = data && data[current];

  return (
    <div className="quiz-container">
      {currentQuestion && (
        <>
          <div className="question-counter">
            {current + 1}/{data.length}
          </div>
          <div className="quiz-header">
            <h2 className="quiz-title">{category.name}</h2>
            <div className="score">Score: {score}</div>
          </div>

          <Question question={currentQuestion.question} />

          <Options
            options={currentQuestion.options}
            selectedOption={selectedOption}
            correctAnswer={currentQuestion.correct_answer}
            handleClick={handleOptionClick}
          />

          <div className="button-container">
            {selectedOption && (
              <button className="next-button" onClick={handleNextQuestion}>
                {current < data.length - 1 ? "Next" : "Results"}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Quiz;
