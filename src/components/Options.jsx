/* Show the questions as buttons */
function Options({ options, handleClick }) {
  return (
    <div className="options">
      {options.map((option, index) => (
        <button
          key={index}
          className="option"
          onClick={() => handleClick(option)}
          dangerouslySetInnerHTML={{ __html: option }}
        />
      ))}
    </div>
  );
}
export default Options;
