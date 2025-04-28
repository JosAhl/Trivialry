import { useEffect, useState } from "react";
import supabase from "../Supabase";
import Category from "./Category";
import Question from "./Questions";
import Options from "./Options";
import Loading from "./Loading";
import Error from "./Error";
import Timer from "./Timer";

const TIME_PER_QUESTION = 20;

function Quiz() {
  const [category, setCategory] = useState(null);
  const [data, setData] = useState(null);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [userHasGuessed, setUserHasGuessed] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [answerState, setAnswerState] = useState(null);
  const [timeExpired, setTimeExpired] = useState(false);
  const [username, setUsername] = useState("");
  const [categoryScores, setCategoryScores] = useState([]);

  const handleNameSubmit = async (e) => {
    e.preventDefault();

    if (!username) {
      alert("Please enter your name.");
      return;
    }

    const finalScore = Math.round((score / data.length) * 100);

    try {
      const { data: scoreData, error } = await supabase
        .from("scores")
        .insert([{ username, score: finalScore, category: category.name }]);

      if (error) {
        console.error("Error saving score:", error);
      } else {
        console.log("Score saved successfully:", scoreData);
      }
      const { data: updatedScores, error: fetchError } = await supabase
        .from("scores")
        .select("*")
        .eq("category", category.name)
        .order("score", { ascending: false })
        .limit(5);

      if (fetchError) {
        console.error("Error fetching updated scores:", fetchError);
      } else {
        setCategoryScores(updatedScores);
      }
    } catch (err) {
      console.error("Error saving score:", err);
    }
  };

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

          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }

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

  useEffect(() => {
    setTimeExpired(false);
  }, [current]);

  const handleTimeUp = () => {
    if (!selectedOption) {
      setTimeExpired(true);
    }
  };

  const handleOptionClick = (option) => {
    if (timeExpired) return;

    setSelectedOption(option);
    setUserHasGuessed(true);
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
    setUserHasGuessed(false);
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
    setTimeExpired(false);
  };

  useEffect(() => {
    if (quizCompleted && category) {
      const fetchCategoryScores = async () => {
        const { data, error } = await supabase
          .from("scores")
          .select("*")
          .eq("category", category.name)
          .order("score", { ascending: false })
          .limit(5);

        if (error) {
          console.error("Error fetching scores:", error);
        } else {
          setCategoryScores(data);
        }
      };

      fetchCategoryScores();
    }
  }, [quizCompleted, category]);

  if (!category) return <Category onSelectCategory={setCategory} />;
  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  const currentQuestion = data && current < data.length ? data[current] : null;

  if (!data || data.length == 0) {
    return null;
  }

  return (
    <div className="quiz-container">
      {quizCompleted ? (
        <div className="quiz-completed">
          <h2>Final Score:</h2>
          <h3>Top Scores for {category.name}</h3>
          <ul className="scoreboard">
            {categoryScores.length === 0 ? (
              <p>No scores yet for this category!</p>
            ) : (
              categoryScores.map((entry) => (
                <li key={entry.id}>
                  {entry.username}: {entry.score}%
                </li>
              ))
            )}
          </ul>
          <div className="score-display">
            <p>
              <span className="final-score">{score}</span> out of{" "}
              {data ? data.length : 0}
            </p>
            <p>{data ? Math.round((score / data.length) * 100) : 0}% correct</p>
          </div>

          <form onSubmit={handleNameSubmit}>
            <div>
              <label htmlFor="username">Enter Your Name:</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your name"
                required
              />
            </div>
            <button type="submit">Submit Score</button>
          </form>

          <button className="reset-button" onClick={resetQuiz}>
            Try Again
          </button>
        </div>
      ) : (
        <>
          {data && currentQuestion && (
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
                disabled={timeExpired}
              />

              <Timer
                duration={TIME_PER_QUESTION}
                onTimeUp={handleTimeUp}
                key={current}
                hasGuessed={userHasGuessed}
              />

              <div className="button-container">
                {(selectedOption || timeExpired) && (
                  <button className="next-button" onClick={handleNextQuestion}>
                    {current < (data ? data.length : 0) - 1
                      ? "Next"
                      : "Results"}
                  </button>
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default Quiz;
