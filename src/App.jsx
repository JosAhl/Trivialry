import "./App.css";
import trivialryLogo from "./assets/trivialry_white.png";
import "./css/Timer.css";
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
