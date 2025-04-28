import "./App.css";
import trivialryLogo from "./assets/trivialry_logo.png";
import "./css/Timer.css";
import "./css/completedQuiz.css";
import Quiz from "./components/Quiz";

function App() {
  return (
    <div>
      <img src={trivialryLogo} alt="Trivialry Logo" className="logo" />
      <Quiz />
    </div>
  );
}

export default App;
