import { useEffect, useState } from "react";

const url =
  "https://opentdb.com/api.php?amount=15&category=9&difficulty=medium&type=multiple";

function Quiz() {
  const [data, setData] = useState(null);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          setError("Could not fetch data");
          setLoading(false);
        }
      };

      fetchData();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <p>Loading questions...</p>;
  if (error) return <p>{error}</p>;

  const currentQuestion = data[current];

  return (
    <div>
      {currentQuestion && (
        <div>
          <h2 dangerouslySetInnerHTML={{ __html: currentQuestion.question }} />
          <ul>
            {currentQuestion.options.map((answer, index) => (
              <li key={index} dangerouslySetInnerHTML={{ __html: answer }} />
            ))}
          </ul>
          {current < data.length - 1 && (
            <button onClick={() => setCurrent((prev) => prev + 1)}>Next</button>
          )}
        </div>
      )}
    </div>
  );
}

export default Quiz;
