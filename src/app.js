import React, { useState, useEffect } from "react";
import qs from "./QnA/Question/Q__kannadam.json"; // Import the JSON file

function App() {
  const [randomQuestion, setRandomQuestion] = useState({
    category: "",
    key: "",
    value: "",
  }); // Holds the current question
  const [userAnswer, setUserAnswer] = useState(""); // Tracks the user's input
  const [isStarted, setIsStarted] = useState(false); // Tracks whether the quiz has started
  const [postman, setPostman] = useState([]); // Stores all user answers
  const [showResults, setShowResults] = useState(false); // Toggles result display

  // Helper function to get a random element from an array
  const getRandomElement = (array) => {
    return array[Math.floor(Math.random() * array.length)];
  };

  // Function to get a random question from the JSON
  const getRandomQuestion = () => {
    const categories = Object.keys(qs); // Get all categories from the JSON
    const randomCategory = getRandomElement(categories); // Pick a random category
    const subCategory = getRandomElement(qs[randomCategory]); // Get subcategories array
    const keys = Object.keys(subCategory); // Get all keys from the subcategory
    const randomKey = getRandomElement(keys); // Pick a random key
    return {
      category: randomCategory,
      key: randomKey,
      value: subCategory[randomKey],
    };
  };

  // useEffect to trigger random question generation when "Start" is clicked
  useEffect(() => {
    if (isStarted) {
      setRandomQuestion(getRandomQuestion());
      setUserAnswer(""); // Clear the input field on new question
    }
  }, [isStarted]);

  // Event handler for "Start" button click
  const handleStartClick = () => {
    setIsStarted(true);
  };

  // Event handler for "Next" button click
  const handleNextClick = () => {
    if (userAnswer.trim() !== "") {
      setPostman((prev) => [
        ...prev,
        {
          category: randomQuestion.category,
          question: randomQuestion.key,
          userAnswer: userAnswer,
          correctAnswer: randomQuestion.value,
          isCorrect: userAnswer.trim() === randomQuestion.value.trim(),
        },
      ]); // Store current answer
    }
    setRandomQuestion(getRandomQuestion()); // Set the next question
    setUserAnswer(""); // Clear the input field
  };

  // Event handler for "Result" button click
  const handleResultClick = () => {
    setShowResults(true);
    setIsStarted(false); // Stops the quiz
  };

  // Event handler for keyboard enter key
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && isStarted) {
      handleNextClick(); // Trigger the next button click
    }
  };

  // Renders the list of user answers in the result section
  const renderResults = () => (
    <div className="result p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-6xl font-bold text-green-500 mb-8">User Answers</h2>
      <ol className="list-decimal list-inside text-4xl space-y-6">
        {postman.map((item, index) => (
          <li key={index} className="mb-6">
            <strong>
              {item.category} - {item.question}:
            </strong>{" "}
            {item.userAnswer}{" "}
            {item.isCorrect ? "✔️" : `❌ (Correct: ${item.correctAnswer})`}
          </li>
        ))}
      </ol>
      <button
        className="mt-10 px-6 py-3 text-4xl bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        onClick={() => {
          setShowResults(false);
          setPostman([]); // Clear answers
        }}
      >
        Back to Quiz
      </button>
    </div>
  );

  return (
    <div
      className="flex flex-col justify-center items-center h-screen bg-gray-100 space-y-12"
      onKeyDown={handleKeyDown}
      tabIndex="0"
    >
      {showResults ? (
        renderResults()
      ) : (
        <div className="flex flex-col md:flex-row w-full justify-center items-center space-y-16 md:space-y-0 md:space-x-16">
          {/* Question Section */}
          <div className="question text-center p-10 bg-white shadow-lg rounded-lg space-y-8">
            <h1 className="text-7xl font-bold text-blue-500">Quiz App</h1>

            {!isStarted ? (
              <p className="text-5xl text-gray-700">
                Click "Start" to begin the quiz!
              </p>
            ) : (
              <>
                <p className="text-5xl text-gray-700">
                  <strong>Category:</strong> {randomQuestion.category || "---"}
                </p>
                <p className="text-5xl text-gray-700">
                  <strong>Question:</strong> {randomQuestion.key || "---"}
                </p>
                <div>
                  <input
                    type="text"
                    className="px-6 py-3 text-4xl border rounded-lg shadow-sm w-96"
                    placeholder="Type your answer here..."
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="space-x-6 mt-8">
              {!isStarted ? (
                <button
                  className="px-6 py-3 bg-green-500 text-white text-4xl rounded-lg hover:bg-green-600"
                  onClick={handleStartClick}
                >
                  Start
                </button>
              ) : (
                <>
                  <button
                    className="px-6 py-3 bg-blue-500 text-white text-4xl rounded-lg hover:bg-blue-600"
                    onClick={handleNextClick}
                  >
                    Next
                  </button>
                  <button
                    className="px-6 py-3 bg-red-500 text-white text-4xl rounded-lg hover:bg-red-600"
                    onClick={handleResultClick}
                  >
                    Result
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

/*new version*/
