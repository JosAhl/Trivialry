import React from "react";

/* Show the questions as buttons */
function Options({
  options,
  correctAnswer,
  selectedOption,
  handleClick,
  disabled,
}) {
  const getButtonStyle = (option) => {
    if (!selectedOption) {
      if (disabled && option === correctAnswer) {
        return { backgroundColor: "green", color: "white", opacity: 0.7 };
      }
      return {};
    }
    if (option === correctAnswer) {
      return { backgroundColor: "green", color: "white" };
    }
    if (option === selectedOption) {
      return { backgroundColor: "red", color: "white" };
    }
    return { backgroundColor: "lightgray" };
  };

  return (
    <div className="options">
      {options.map((option, index) => (
        <button
          key={index}
          className="option"
          onClick={() => handleClick(option)}
          style={getButtonStyle(option)}
          dangerouslySetInnerHTML={{ __html: option }}
          disabled={!!selectedOption || disabled}
        />
      ))}
    </div>
  );
}

export default Options;
