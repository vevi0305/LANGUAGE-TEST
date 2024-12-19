import React, { useState, useEffect } from "react";
import qs from "./QnA/Question/QSW__kannadam.json"; // Import the JSON file

function App() {
  const [randomQuestion, setRandomQuestion] = useState({ key: "", value: "" }); // Holds the current question
  const [userAnswer, setUserAnswer] = useState(""); // Tracks the user's input
  const [isStarted, setIsStarted] = useState(false); // Tracks whether the quiz has started
  const [postman, setPostman] = useState([]); // Stores all user answers
  const [showResults, setShowResults] = useState(false); // Toggles result display

  // Function to get a random question
  const getRandomQuestion = () => {
    const keys = Object.keys(qs); // Get all keys from the JSON
    const randomKey = keys[Math.floor(Math.random() * keys.length)]; // Select a random key
    return { key: randomKey, value: qs[randomKey] }; // Return the question (key)
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
        { question: randomQuestion.key, answer: userAnswer },
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
    <div className="result p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold text-green-500 mb-4">User Answers</h2>
      <ol className="list-decimal list-inside">
        {postman.map((item, index) => (
          <li key={index} className="mb-2">
            <strong>{item.question}:</strong> {item.answer}
          </li>
        ))}
      </ol>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => {
          setShowResults(false), setPostman([]);
        }} // Reset the results display
      >
        Back to Quiz
      </button>
    </div>
  );

  return (
    <div
      className="flex flex-col justify-center items-center h-screen bg-gray-100"
      onKeyDown={handleKeyDown}
      tabIndex="0" // Needed to ensure the div can detect keyboard events
    >
      {showResults ? (
        renderResults()
      ) : (
        <div className="flex flex-col md:flex-row w-full justify-center items-center space-y-6 md:space-y-0 md:space-x-6">
          {/* Question Section */}
          <div className="question text-center p-4 bg-white shadow-lg rounded-lg">
            <h1 className="text-4xl font-bold text-blue-500 mb-6">Quiz App</h1>

            {!isStarted ? (
              <p className="text-lg text-gray-700 mb-4">
                Click "Start" to begin the quiz!
              </p>
            ) : (
              <>
                <p className="text-lg text-gray-700">
                  <strong>Question:</strong> {randomQuestion.key || "---"}
                </p>
                <div className="mt-4">
                  <input
                    type="text"
                    className="px-4 py-2 border rounded shadow-sm w-60"
                    placeholder="Type your answer here..."
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="mt-6">
              {!isStarted ? (
                <button
                  className="mr-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  onClick={handleStartClick}
                >
                  Start
                </button>
              ) : (
                <>
                  <button
                    className="mr-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={handleNextClick}
                  >
                    Next
                  </button>
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
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
