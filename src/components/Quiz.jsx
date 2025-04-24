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
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setCurrent((prev) => prev + 1);
  };

  return (
    <div>
      {currentQuestion && (
        <div>
          <Question question={currentQuestion.question} />
          <Options
            options={currentQuestion.options}
            correctAnswer={currentQuestion.correct_answer}
            selectedOption={selectedOption}
            handleClick={handleOptionClick}
          />
          {current < data.length - 1 && (
            <button onClick={handleNextQuestion} disabled={!selectedOption}>
              Next
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default Quiz;
