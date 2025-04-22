/* Show the question */
function Questions({ question }) {
  return (
    <div className="question">
      <h2 dangerouslySetInnerHTML={{ __html: question }} />
    </div>
  );
}
export default Questions;
