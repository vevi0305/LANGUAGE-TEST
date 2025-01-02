import React, { useState, useEffect, useRef } from "react";
import qs from "./QnA/Language.json";

function App() {
  const [randomQuestion, setRandomQuestion] = useState({
    category: "",
    key: "",
    value: "",
  }); // Holds the current question
  const [remainingQuestions, setRemainingQuestions] = useState([]); // Stores remaining questions
  const [userAnswer, setUserAnswer] = useState(""); // Tracks the user's input
  const [isStarted, setIsStarted] = useState(false); // Tracks whether the quiz has started
  const [postman, setPostman] = useState([]); // Stores all user answers
  const [showResults, setShowResults] = useState(false); // Toggles result display
  const [quizOver, setQuizOver] = useState(false); // Indicates whether the quiz is over
  const [newCategory, setNewCategory] = useState("");
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [addStatus, setAddStatus] = useState(""); // Tracks the status of data addition
  const categoryInputRef = useRef(null);
  const dataInputRef = useRef(null);
  // For Option Choose
  const [availableCategories, setAvailableCategories] = useState([]);

  // Helper function to initialize all questions
  const initializeQuestions = () => {
    const questions = [];
    for (const category in qs) {
      qs[category].forEach((subCategory) => {
        for (const key in subCategory) {
          questions.push({
            category,
            key,
            value: subCategory[key],
          });
        }
      });
    }
    return questions;
  };

  // Function to get a random question from a given array
  const getRandomQuestion = (questions) => {
    if (!questions || questions.length === 0) {
      return null; // Handle empty array gracefully
    }
    const randomIndex = Math.floor(Math.random() * questions.length);
    return questions[randomIndex];
  };

  // useEffect to initialize the question pool when "Start" is clicked or quiz is restarted
  useEffect(() => {
    if (isStarted) {
      const questions = initializeQuestions();
      setRemainingQuestions(questions); // Initialize the remaining questions
      const firstQuestion = getRandomQuestion(questions);
      setRandomQuestion(firstQuestion || { category: "", key: "", value: "" }); // Safely set the first question
      setUserAnswer(""); // Clear the input field
    }
  }, [isStarted]);

  // Event handler for "Start" button click
  const handleStartClick = () => {
    setQuizOver(false); // Reset the quiz-over flag
    setPostman([]); // Clear previous answers
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
      ]);

      // Remove the current question from remainingQuestions
      const updatedQuestions = remainingQuestions.filter(
        (q) =>
          !(
            q.category === randomQuestion.category &&
            q.key === randomQuestion.key
          )
      );
      setRemainingQuestions(updatedQuestions);

      // Check if there are still questions left
      if (updatedQuestions.length > 0) {
        setRandomQuestion(getRandomQuestion(updatedQuestions));
      } else {
        setQuizOver(true); // Mark the quiz as over
        setIsStarted(false);
      }

      setUserAnswer(""); // Clear the input field
    }
  };

  // Event handler for "Result" button click
  const handleResultClick = () => {
    setShowResults(true);
    setIsStarted(false); // Stops the quiz
  };

  // Event handler for keyboard navigation
  const handleKeyDown = (event) => {
    if (isStarted) {
      if (event.key === "ArrowRight") {
        handleNextClick();
      } else if (event.key === "ArrowDown") {
        handleResultClick();
      }
    }
  };

  useEffect(() => {
    if (categoryInputRef.current) {
      categoryInputRef.current.focus();
    }
  }, [newCategory]);

  useEffect(() => {
    // Extract unique categories from the JSON
    const uniqueCategories = Object.keys(qs);
    setAvailableCategories(uniqueCategories);
  }, []);

  const triggerAddButton = (event) => {
    if (event.key == "Enter") {
      handleAddClick();
    }
  };

  // Handles data addition to the JSON file
  const handleAddClick = async () => {
    if (newCategory && newKey && newValue) {
      const data = {
        category: newCategory.trim().toLowerCase(),
        key: newKey.trim().toLowerCase(),
        value: newValue.trim().toLowerCase(),
      };

      const categoryExists = qs[newCategory] || [];
      const isDuplicateGlobal = categoryExists.some((subCategory) =>
        Object.keys(subCategory).some(
          (key) => key === newKey && subCategory[key] === newValue
        )
      );

      const isDuplicateLocal = remainingQuestions.some(
        (q) =>
          q.category === newCategory && q.key === newKey && q.value === newValue
      );

      if (isDuplicateGlobal || isDuplicateLocal) {
        setAddStatus("Duplicate entry detected! Please add unique values.");
        setNewKey("");
        setNewValue("");
        if (dataInputRef.current) {
          dataInputRef.current.focus();
        }
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          setAddStatus(
            "Data added successfully! Add another or click 'Cancel' to return."
          );
          if (categoryInputRef.current) {
            categoryInputRef.current.focus();
          }

          setRemainingQuestions((prev) => [
            ...prev,
            { category: newCategory, key: newKey, value: newValue },
          ]);

          setNewCategory("");
          setNewKey("");
          setNewValue("");
        } else {
          setAddStatus("Failed to add data!");
        }
      } catch (error) {
        console.error("Error adding data:", error);
        setAddStatus("Error occurred while adding data.");
      }
    } else {
      if (categoryInputRef.current) {
        categoryInputRef.current.focus();
      }
      setAddStatus("All fields are required!");
    }
  };

  // Renders the list of user answers in the result section
  const renderResults = () => (
    <div className="resultshow flex flex-col items-center  oneSamPixelISE:flex oneSamPixelISE:flex-col oneSamPixelISE:items-center">
      <div className="text-6xl font-bold text-green-500 mb-8  iphoneXR:text-4xl oneSamPixelISE:text-3xl  oneSamPixelISE:font-bold oneSamPixelISE:text-green-500 oneSamPixelISE:mb-8">
        <h2>Your Answers</h2>
      </div>
      <div className="result p-6 bg-white shadow-lg rounded-lg max-h-96 overflow-y-auto oneSamPixelISE:p-6 oneSamPixelISE:bg-white oneSamPixelISE:shadow-lg oneSamPixelISE:rounded-lg oneSamPixelISE:max-h-96">
        <ol className="list-decimal list-inside text-4xl space-y-6 iphoneXR:text-2xl oneSamPixelISE:text-2xl">
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
      </div>
      <button
        className="mt-10 px-6 py-3 text-4xl bg-blue-500 text-white rounded-lg hover:bg-blue-600 iphoneXR:text-2xl oneSamPixelISE:text-2xl oneSamPixelISE:mt-10 oneSamPixelISE:px-6 oneSamPixelISE:py-3 oneSamPixelISE:bg-blue-500 oneSamPixelISE:text-white oneSamPixelISE:rounded-lg oneSamPixelISE:hover:bg-blue-600"
        onClick={() => {
          setShowResults(false);
        }}
      >
        Back To Start
      </button>
    </div>
  );

  return (
    <div
      className="flex flex-col oneSamPixelISE:justify-items-start items-center h-screen bg-gray-100 space-y-12 oneSamPixelISE:flex oneSamPixelISE:flex-col oneSamPixelISE:top-32 oneSamPixelISE:items-center oneSamPixelISE:h-screen oneSamPixelISE:bg-gray-100 oneSamPixelISE:space-y-2"
      onKeyDown={handleKeyDown}
      tabIndex="0"
    >
      {showResults ? (
        renderResults()
      ) : quizOver ? (
        <div className="text-center p-10 bg-white shadow-lg rounded-lg space-y-8 oneSamPixelISE:p-10 oneSamPixelISE:bg-white oneSamPixelISE:shadow-lg oneSamPixelISE:rounded-lg oneSamPixelISE:space-y-8">
          {renderResults()}
        </div>
      ) : (
        <div className="flex flex-col md:flex-row w-full justify-center items-center space-y-16 md:space-y-0 md:space-x-16  oneSamPixelISE:flex oneSamPixelISE:flex-col oneSamPixelISE:md:flex-row oneSamPixelISE:w-full oneSamPixelISE:justify-center oneSamPixelISE:items-center oneSamPixelISE:space-y-16 oneSamPixelISE:md:space-y-0 oneSamPixelISE:md:space-x-16">
          <div className="question text-center p-10 bg-white shadow-lg rounded-lg space-y-8  oneSamPixelISE:text-center oneSamPixelISE:p-10 oneSamPixelISE:bg-white oneSamPixelISE:shadow-lg oneSamPixelISE:rounded-lg oneSamPixelISE:space-y-8">
            {!isStarted ? (
              <div className="text-center p-10 bg-white shadow-lg rounded-lg space-y-8  oneSamPixelISE:p-10 oneSamPixelISE:bg-white oneSamPixelISE:shadow-lg oneSamPixelISE:rounded-lg oneSamPixelISE:space-y-8">
                <h1 className="text-7xl font-bold text-blue-500   oneSamPixelISE:text-3xl">
                  Language Test
                </h1>
                <p className="text-5xl text-gray-700  oneSamPixelISE:text-xl">
                  Click "Start" to begin the Test
                </p>
                <div className=" mt-8">
                  <button
                    className="px-6 py-3 bg-green-500 text-white text-4xl rounded-lg hover:bg-green-600  oneSamPixelISE:text-xl"
                    onClick={handleStartClick}
                  >
                    Start
                  </button>
                  <p className="text-5xl text-gray-700   oneSamPixelISE:text-xl">
                    Or
                  </p>
                  <p className="text-5xl text-gray-700  oneSamPixelISE:text-xl">
                    Add New Vocabulary Here
                  </p>
                  <div
                    className="p-6 bg-white shadow-lg rounded-lg space-y-6 space-x-5"
                    onKeyDown={triggerAddButton}
                    tabIndex="0"
                  >
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="inputdata category px-6 py-3 border text-2xl oneSamPixelISE:text-xl"
                      ref={categoryInputRef}
                    >
                      <option value="" disabled>
                        Choose a Category
                      </option>
                      {availableCategories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="Type Your Language..."
                      value={newKey}
                      onChange={(e) => setNewKey(e.target.value)}
                      className="inputdata keys px-6 py-3 border text-2xl  oneSamPixelISE:text-xl"
                      ref={dataInputRef}
                    />
                    <input
                      type="text"
                      placeholder="Type Converted Language..."
                      value={newValue}
                      onChange={(e) => setNewValue(e.target.value)}
                      className="inputdata values px-6 py-3 border text-2xl oneSamPixelISE:text-xl"
                    />
                    <div className="AddCancel">
                      {addStatus && (
                        <p className="text-red-500 mt-4">{addStatus}</p>
                      )}
                      <button
                        className="px-6 py-3 bg-blue-500 text-white text-4xl rounded-lg hover:bg-blue-600  oneSamPixelISE:text-xl"
                        onClick={() => {
                          handleAddClick();
                          setIsStarted(false);
                        }}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : isStarted ? (
              <>
                <p className="text-5xl text-gray-700  oneSamPixelISE:text-xl">
                  <strong>Category:</strong> {randomQuestion.category || "---"}
                </p>
                <p className="text-5xl text-gray-700  oneSamPixelISE:text-xl">
                  <strong>Question:</strong> {randomQuestion.key || "---"}
                </p>
                <div>
                  <input
                    type="text"
                    className="px-6 py-3 text-4xl border rounded-lg shadow-sm w-full oneSamPixelISE:text-xl"
                    placeholder="Type your answer here..."
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                  />
                </div>
                {isStarted && !quizOver && (
                  <div className="nextResult space-x-6 ">
                    <button
                      className="px-8 py-3 space-y-6 bg-blue-500 text-white text-4xl rounded-lg hover:bg-blue-600   oneSamPixelISE:text-xl"
                      onClick={handleNextClick}
                    >
                      Next
                    </button>
                    <button
                      className="px-8 py-3 space-y-6 bg-red-500 text-white text-4xl rounded-lg hover:bg-red-600   oneSamPixelISE:text-xl"
                      onClick={handleResultClick}
                    >
                      Result
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
export default App;
