"use client";
import { ArrowLeft, ArrowRight, Flag, Clock, Hash, Play, Settings, Sparkles } from "lucide-react";
import React, { useState, useEffect } from "react";
import { FaCircleCheck } from "react-icons/fa6";
import { RxCrossCircled } from "react-icons/rx";
import { MdTimer, MdTimerOff } from "react-icons/md";
import { BsQuestionCircle, BsArrowRepeat } from "react-icons/bs";
import run from "@/components/animations/data/Happy.json";
import cry from "@/components/animations/data/Cry.json";
import LottiePlayer from "@/components/animations/LottiePlayer";
import SignInBanner from "@/components/signInBanner/SignInBanner.js";
import { IoIosCheckmark } from "react-icons/io";
import Link from "next/link";
import ReportModal from "@/components/common/ReportModal";
import useGet from "@/hooks/useGet";
import usePost from "@/hooks/usePost";

// Custom CSS for the range slider
const sliderStyles = `
  .custom-slider {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 8px;
    border-radius: 4px;
    outline: none;
    transition: all 0.2s ease;
    cursor: pointer;
  }
  
  .custom-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    height: 24px;
    width: 24px;
    border-radius: 50%;
    background: #8B5CF6;
    cursor: grab;
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
    border: 3px solid white;
    transition: all 0.2s ease;
  }
  
  .custom-slider::-webkit-slider-thumb:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgba(139, 92, 246, 0.4);
  }
  
  .custom-slider::-webkit-slider-thumb:active {
    cursor: grabbing;
    transform: scale(1.05);
  }
  
  .custom-slider::-moz-range-thumb {
    height: 24px;
    width: 24px;
    border-radius: 50%;
    background: #8B5CF6;
    cursor: grab;
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
    border: 3px solid white;
    transition: all 0.2s ease;
  }
  
  .custom-slider::-moz-range-thumb:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgba(139, 92, 246, 0.4);
  }
  
  .custom-slider::-moz-range-thumb:active {
    cursor: grabbing;
    transform: scale(1.05);
  }
  
  .toggle-switch {
    position: relative;
    display: inline-block;
    width: 48px;
    height: 24px;
  }
  
  .toggle-switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  .toggle-slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #E5E7EB;
    transition: all 0.3s ease;
    border-radius: 24px;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .toggle-slider:before {
    position: absolute;
    content: "";
    height: 20px;
    width: 20px;
    left: 2px;
    bottom: 2px;
    background-color: white;
    transition: all 0.3s ease;
    border-radius: 50%;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
  
  input:checked + .toggle-slider {
    background: linear-gradient(135deg, #8B5CF6, #7C3AED);
    box-shadow: inset 0 2px 4px rgba(139, 92, 246, 0.2);
  }
  
  input:checked + .toggle-slider:before {
    transform: translateX(24px);
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
  }
  
  .config-card {
    background: white;
    border-radius: 20px;
    padding: 24px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(139, 92, 246, 0.1);
    transition: all 0.2s ease;
  }
  
  .config-card:hover {
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.12);
    transform: translateY(-1px);
  }
  
  .quick-select-btn {
    padding: 8px 16px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 500;
    border: 2px solid #E5E7EB;
    background: white;
    color: #6B7280;
    cursor: pointer;
    transition: all 0.2s ease;
    min-width: 44px;
    text-align: center;
  }
  
  .quick-select-btn:hover {
    border-color: #8B5CF6;
    color: #8B5CF6;
    background: #F3E8FF;
  }
  
  .quick-select-btn.active {
    background: linear-gradient(135deg, #8B5CF6, #7C3AED);
    color: white;
    border-color: #8B5CF6;
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
  }
`;

// const questions = [
//   {
//     question:
//       "A 25-year-old man comes to the emergency department because of acute onset hoarseness of voice within the past 3 days. He also reports coughing, frequent throat clearing, and flu-like symptoms. He reports having an upper respiratory infection from babysitting his younger cousin 5 days ago. A laryngoscopy is done and shows erythematous and oedematous laryngeal tissue. Which of the following is the next best step in management for this patient?",
//     options: [
//       {
//         id: "A",
//         text: "90% inorganic material & 10% organic material",
//         correct: false,
//       },
//       {
//         id: "B",
//         text: "35% inorganic material & 65% organic material",
//         correct: true,
//       },
//       {
//         id: "C",
//         text: "50% inorganic material & 50% organic material",
//         correct: false,
//       },
//       {
//         id: "D",
//         text: "65% inorganic material & 35% organic material",
//         correct: false,
//       },
//     ],
//     explanation:
//       "The Biceps Brachii muscle is located in the upper arm and is primarily responsible for flexion of the elbow. It helps in bringing the forearm towards the shoulder.",
//     image: "http://example.jpg",
//     type: "chooseTheCorrect",
//   },
//   {
//     question:
//       "Which structure is responsible for producing cerebrospinal fluid?",
//     answer: "abcd",
//     explanation:
//       "The Biceps Brachii muscle is located in the upper arm and is primarily responsible for flexion of the elbow. It helps in bringing the forearm towards the shoulder.",
//     type: "text",
//   },
//   {
//     question:
//       "What are the common goals of physiotherapy for patients with stroke? (Select all that apply)",
//     options: [
//       { id: "A", text: "Choroid Plexus" },
//       { id: "B", text: "Pineal Gland" },
//       { id: "C", text: "Cerebellum" },
//       { id: "D", text: "Thalamus" },
//     ],
//     explanation:
//       "The Biceps Brachii muscle is located in the upper arm and is primarily responsible for flexion of the elbow. It helps in bringing the forearm towards the shoulder.",
//     type: "multipleChoice",
//   },
//   {
//     question:
//       "What are the common goals of physiotherapy for patients with stroke? (Select all that apply)",
//     options: [
//       { id: "A", text: "True", correct: false },
//       { id: "B", text: "False", correct: true },
//     ],
//     explanation:
//       "The Biceps Brachii muscle is located in the upper arm and is primarily responsible for flexion of the elbow. It helps in bringing the forearm towards the shoulder.",
//     type: "trueFalse",
//   },
// ];

export default function QuizCard({ params }) {
  const { id } = React.use(params);
  const [questions, setQuestions] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]); // Store all questions
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [explanation, setExplanation] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState([]);
  const [multipleOptions, setMultipleOptions] = useState([]);
  const [textAnswer, setTextAnswer] = useState("");
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [quizTime, setQuizTime] = useState(0);
  const [originalQuizTime, setOriginalQuizTime] = useState(0); // Store original time
  const [timeLeft, setTimeLeft] = useState(() => {
    // Try to get the stored time from localStorage
    const storedTime =
      typeof window !== "undefined"
        ? localStorage.getItem(`quiz_${id}_time`)
        : null;
    if (storedTime) {
      const { time, timestamp } = JSON.parse(storedTime);
      const elapsed = Math.floor((Date.now() - timestamp) / 1000);
      return Math.max(0, time - elapsed);
    }
    return 0;
  });
  const [isSubmited, setIsSubmited] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [userAnswers, setUserAnswers] = useState([]);
  const [result, setResult] = useState([]);
  const [showFeedback, setShowFeedback] = useState(true);
  
  // Quiz configuration states
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [isTimerEnabled, setIsTimerEnabled] = useState(true);
  const [numberOfQuestions, setNumberOfQuestions] = useState(10);
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  // const [mainTopic, setMainTopic] = useState("")

  const fetchQuizData = async () => {
    const { data, error, status } = await useGet(`/quizzes/${id}`);
    if (status == 200) {
      setQuizTime(data.quizDurationInMinutes);
      setOriginalQuizTime(data.quizDurationInMinutes);
      setQuizTitle(data.title || "Quiz");
      setQuizDescription(data.description || "Test your knowledge with this quiz");
      setAllQuestions(data.questions);
      
      // Set initial number of questions (don't exceed available questions)
      const maxQuestions = data.questions.length;
      setNumberOfQuestions(Math.min(10, maxQuestions));
      
      // Only set initial time if there's no stored time and quiz hasn't started
      if (!localStorage.getItem(`quiz_${id}_time`) && !isQuizStarted) {
        const initialTime = data.quizDurationInMinutes * 60;
        setTimeLeft(initialTime);
      }
      // setMainTopic(data.mainTopic.name)
    }
  };

  useEffect(() => {
    fetchQuizData();
  }, []);

  // Timer countdown effect
  useEffect(() => {
    if (timeLeft <= 0 || isSubmited || !isTimerEnabled || !isQuizStarted) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTime = prevTime - 1;
        // Update localStorage with new time
        localStorage.setItem(
          `quiz_${id}_time`,
          JSON.stringify({
            time: newTime,
            timestamp: Date.now(),
          })
        );

        if (newTime <= 0) {
          clearInterval(timer);
          handleSubmit(); // Auto submit when time runs out
          localStorage.removeItem(`quiz_${id}_time`); // Clean up localStorage
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [timeLeft, isSubmited, id, isTimerEnabled, isQuizStarted]);

  // Add keyboard event listener for arrow controls
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Only handle arrow keys if quiz is started, not submitted and not in input fields
      if (!isQuizStarted || isSubmited || event.target.tagName === 'TEXTAREA' || event.target.tagName === 'INPUT') {
        return;
      }

      switch (event.code) {
        case 'ArrowLeft':
          event.preventDefault();
          if (currentQuestion > 0) {
            handleBack();
          }
          break;
        case 'ArrowRight':
          event.preventDefault();
          if (isAnswered) {
            if (currentQuestion < questions.length - 1) {
              handleNext();
            } else {
              handleSubmit();
            }
          }
          break;
        case 'Enter':
          event.preventDefault();
          if (!isAnswered && (selectedOption || textAnswer.length > 0 || multipleOptions.length > 0)) {
            handleCheckAnswer();
          } else if (isAnswered) {
            if (currentQuestion < questions.length - 1) {
              handleNext();
            } else {
              handleSubmit();
            }
          }
          break;
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentQuestion, questions.length, isAnswered, selectedOption, textAnswer, multipleOptions, isSubmited, isQuizStarted]);

  // Start quiz with selected configuration
  const startQuiz = () => {
    // Shuffle and select the specified number of questions
    const shuffledQuestions = [...allQuestions].sort(() => Math.random() - 0.5);
    const selectedQuestions = shuffledQuestions.slice(0, numberOfQuestions);
    setQuestions(selectedQuestions);
    
    // Set up timer if enabled
    if (isTimerEnabled) {
      const timePerQuestion = Math.floor((originalQuizTime * 60) / numberOfQuestions);
      const totalTime = timePerQuestion * numberOfQuestions;
      setTimeLeft(totalTime);
      setQuizTime(Math.ceil(totalTime / 60));
      
      // Store initial time in localStorage
      localStorage.setItem(
        `quiz_${id}_time`,
        JSON.stringify({
          time: totalTime,
          timestamp: Date.now(),
        })
      );
    } else {
      setTimeLeft(0);
      setQuizTime(0);
    }
    
    setIsQuizStarted(true);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleCheckAnswer = () => {
    if (isAnswered) return;

    const current = questions[currentQuestion];
    let correct = false;

    const correctAnswer = questions[currentQuestion].options.filter(
      (option) => option.correctAnswer
    );
    if (correctAnswer) {
      setCorrectAnswer(correctAnswer[0].value);
      console.log(correctAnswer);
    }
    if (current.type === "checkbox") {
      const correctAnswers = current.options
        .filter((opt) => opt.correctAnswer)
        .map((opt) => opt._id);

      correct =
        multipleOptions.length === correctAnswers.length &&
        multipleOptions.every((id) => correctAnswers.includes(id));
    } else if (current.type === "radio") {
      const correctAnswer = current.options.find(
        (opt) => opt.correctAnswer
      )?._id;
      correct = selectedOption === correctAnswer;
    } else if (current.type === "short-answer") {
      const correctAnswer = current.answer?.toLowerCase().trim();
      correct = textAnswer.toLowerCase().trim() === correctAnswer;
    }

    // Get selected text option
    let selectedTextOption = "";
    if (current.type === "checkbox") {
      selectedTextOption = current.options
        .filter((opt) => multipleOptions.includes(opt._id))
        .map((opt) => opt.value)
        .join(", ");
    } else if (current.type === "radio") {
      selectedTextOption =
        current.options.find((opt) => opt._id === selectedOption)?.value || "";
    } else if (current.type === "short-answer") {
      selectedTextOption = textAnswer;
    }

    // Save answer
    setUserAnswers((prev) => [
      ...prev,
      {
        questionIndex: currentQuestion,
        selectedTextOption,
      },
    ]);

    setIsCorrect(correct);
    setExplanation(current.explanation || "");
    setIsAnswered(true);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setIsAnswered(false);
      setSelectedOption(null);
      setMultipleOptions([]);
      setTextAnswer("");
      setExplanation("");
    } else {
      alert("🎉 Quiz completed!");
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
      setIsAnswered(false);
      setSelectedOption(null);
      setMultipleOptions([]);
      setTextAnswer("");
      setExplanation("");
    }
  };

  const handleSubmit = async () => {
    setIsSubmited(true);
    localStorage.removeItem(`quiz_${id}_time`); // Clean up localStorage

    const timeUsed = (quizTime * 60) - timeLeft; // Calculate time used in seconds

    const finalPayload = {
      answers:
        userAnswers.length === 0
          ? [
              {
                questionIndex: 0,
                selectedImageOption: " ",
              },
            ]
          : userAnswers,
      completionTime: timeUsed,
    };

    const fetchResult = async () => {
      const { data, error, status } = await usePost(
        `/quizzes/generate-results/${id}`
      );

      if (status === 201 && Array.isArray(data)) {
        const lastResult = data[0]; // get last object
        setResult(lastResult);
      }
    };

    const { data, error, status } = await usePost(
      `/quizzes/submit-quiz/${id}`,
      finalPayload
    );
    if (status == 201) {
      const { data, error, status } = await usePost("/users/attendance");
      console.log(status);
      if (status == 201 && userAnswers.length > 0) {
        fetchResult();
      }
    }
  };

  // Pre-Quiz Configuration Screen
  const PreQuizScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 p-4">
      <style>{sliderStyles}</style>
      
      <div className="max-w-4xl mx-auto">
        {/* Header Navigation */}
        <div className="mb-8">
          <Link
            href={"/user/quizs"}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft size={18} />
            <span className="font-medium">Back to Dashboard</span>
          </Link>
        </div>

        {/* Main Header */}
        <div className="text-center mb-12">
          <div className="relative inline-block mb-6">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-xl">
              <Settings className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
              <Sparkles className="w-4 h-4 text-yellow-800" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">{quizTitle}</h1>
          <p className="text-xl text-gray-600 mb-4">{quizDescription}</p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full text-purple-700 font-medium">
            <Hash className="w-4 h-4" />
            <span>{allQuestions.length} Questions Available</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Timer Configuration Card */}
          <div className="config-card">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                {isTimerEnabled ? (
                  <MdTimer className="w-6 h-6 text-white" />
                ) : (
                  <MdTimerOff className="w-6 h-6 text-white" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">Timer Settings</h3>
                <p className="text-gray-600">Control your quiz timing</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={isTimerEnabled}
                  onChange={() => setIsTimerEnabled(!isTimerEnabled)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            
            <div className="space-y-4">
              {isTimerEnabled ? (
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-xl border border-purple-100">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="w-5 h-5 text-purple-600" />
                    <span className="font-semibold text-purple-900">
                      {Math.ceil((originalQuizTime * numberOfQuestions) / Math.max(allQuestions.length, 1))} minutes
                    </span>
                  </div>
                  <p className="text-sm text-purple-700">
                    Approximately {Math.ceil((originalQuizTime * 60) / Math.max(allQuestions.length, 1))} seconds per question
                  </p>
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-3">
                    <MdTimerOff className="w-5 h-5 text-gray-500" />
                    <span className="font-medium text-gray-700">No time limit</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Take your time to answer each question</p>
                </div>
              )}
            </div>
          </div>

          {/* Question Selection Card */}
          <div className="config-card">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <BsQuestionCircle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">Question Count</h3>
                <p className="text-gray-600">Choose how many questions</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-indigo-600">{numberOfQuestions}</div>
                <div className="text-sm text-gray-500">of {allQuestions.length}</div>
              </div>
            </div>
            
            <div className="space-y-6">
              {/* Custom Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm font-medium text-gray-700">
                  <span>Questions</span>
                  <span className="text-indigo-600">{Math.round((numberOfQuestions / allQuestions.length) * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max={allQuestions.length}
                  value={numberOfQuestions}
                  onChange={(e) => setNumberOfQuestions(parseInt(e.target.value))}
                  className="custom-slider"
                  style={{
                    background: `linear-gradient(to right, #8B5CF6 0%, #8B5CF6 ${(numberOfQuestions / allQuestions.length) * 100}%, #E5E7EB ${(numberOfQuestions / allQuestions.length) * 100}%, #E5E7EB 100%)`
                  }}
                />
              </div>
              
              {/* Quick Select Buttons */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-700">Quick Select:</p>
                <div className="flex flex-wrap gap-2">
                  {[5, 10, 15, Math.min(25, allQuestions.length)].map((num) => (
                    num <= allQuestions.length && (
                      <button
                        key={num}
                        onClick={() => setNumberOfQuestions(num)}
                        className={`quick-select-btn ${numberOfQuestions === num ? 'active' : ''}`}
                      >
                        {num}
                      </button>
                    )
                  ))}
                  {allQuestions.length > 25 && (
                    <button
                      onClick={() => setNumberOfQuestions(allQuestions.length)}
                      className={`quick-select-btn ${numberOfQuestions === allQuestions.length ? 'active' : ''}`}
                    >
                      All ({allQuestions.length})
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Card */}
        <div className="config-card mb-8">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Quiz Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <BsQuestionCircle className="w-5 h-5 text-white" />
                </div>
                <div className="text-2xl font-bold text-purple-700">{numberOfQuestions}</div>
                <div className="text-sm text-purple-600">Questions</div>
              </div>
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-xl">
                <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                  {isTimerEnabled ? (
                    <Clock className="w-5 h-5 text-white" />
                  ) : (
                    <MdTimerOff className="w-5 h-5 text-white" />
                  )}
                </div>
                <div className="text-2xl font-bold text-indigo-700">
                  {isTimerEnabled 
                    ? `${Math.ceil((originalQuizTime * numberOfQuestions) / Math.max(allQuestions.length, 1))}m`
                    : '∞'
                  }
                </div>
                <div className="text-sm text-indigo-600">
                  {isTimerEnabled ? 'Time Limit' : 'No Limit'}
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <BsArrowRepeat className="w-5 h-5 text-white" />
                </div>
                <div className="text-2xl font-bold text-green-700">Random</div>
                <div className="text-sm text-green-600">Order</div>
              </div>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <div className="text-center">
          <button
            onClick={startQuiz}
            className="group relative inline-flex items-center gap-4 bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 text-white px-12 py-4 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:from-purple-700 hover:to-indigo-700"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <Play className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
              </div>
              <span>Start Quiz</span>
            </div>
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
          </button>
          <p className="mt-4 text-gray-600">
            Ready to test your knowledge? Let's begin!
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {!isQuizStarted ? (
        <PreQuizScreen />
      ) : (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg">
          <Link
            href={"/user/quizs"}
            className="px-2 py-1 bg-gray-100 flex items-center w-fit rounded-md"
          >
            <ArrowLeft className="text-gray-600" size={18} /> &nbsp; Go to Dashboard
          </Link>
          <div className="flex justify-center my-5">
            <ArrowLeft
              className="text-gray-600 cursor-pointer"
              size={24}
              onClick={handleBack}
            />
            <div className="w-full h-2 bg-gray-200 rounded-full mx-4">
              <div
                className=" h-full bg-[#6c4ce6] rounded-full"
                style={{
                  width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>
          {/* <SignInBanner /> */}
          {!isSubmited ? (
            <>
              <div className="flex items-center justify-between md:gap-0 gap-2 mb-4 bg-gray-100 rounded-md py-2 px-2">
                <div className="flex md:justify-start justify-center items-center md:space-x-3 space-x-2">
                  {/* <img
                    src="/user-avatar.png"
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full"
                  />
                  <h2 className="text-gray-900 md:block hidden font-semibold">
                    Devon Lane
                  </h2> */}
                </div>

                {isTimerEnabled && (
                  <div className="text-gray-600 md:text-sm text-xs">
                    <span className="font-semibold">Time Remaining </span>
                    <div className="text-lg font-bold text-center">
                      {formatTime(timeLeft)}
                    </div>
                  </div>
                )}
                <div className="text-gray-700 md:text-base text-xs font-semibold">
                  24 Points ⭐
                </div>
              </div>

              <div className="my-10 relative">
                <h3 className="text-xs border-s-2 border-blue-600 ps-2 mb-3 text-gray-400 uppercase font-semibold">
                  Question {currentQuestion + 1} of {questions.length}
                  {/* • Topic
                  {mainTopic} */}
                </h3>
                {questions[currentQuestion]?.image && (
                  <div className="md:w-52 w-38 md:h-52 h-38 rounded-md justify-self-center">
                    <img
                      src={questions[currentQuestion].image}
                      className="w-full h-full"
                      alt="question Image"
                    />
                  </div>
                )}
                <p className="text-gray-800 mt-2 md:text-[15px] text-[14px] w-full text-wrap">
                  {questions[currentQuestion]?.question}
                </p>

                {isAnswered && !isCorrect && (
                  <div className="w-full py-2 px-3 bg-[#E2F9FC] mt-3 rounded-md sm:text-sm text-xs border border-green-300">
                    <p>
                      <span className="font-semibold sm:text-base text-xsf">
                        The Correct Answer is {correctAnswer}.
                      </span>
                    </p>
                  </div>
                )}

                <div className="mt-8 mb-10 space-y-2 ">
                  {questions[currentQuestion]?.type == "radio" &&
                    questions[currentQuestion]?.options.map((option, index) => {
                      let borderColor = "border-gray-300";
                      let bgColor = "";
                      if (
                        isAnswered &&
                        selectedOption === option._id &&
                        !option.correctAnswer
                      ) {
                        borderColor = "border-red-500"; // Wrong answer gets a red border
                        bgColor = "bg-red-50";
                      }
                      if (isAnswered && option.correctAnswer) {
                        borderColor = "border-green-300";
                        bgColor = "bg-green-50";
                      }

                      return (
                        <label
                          key={option._id}
                          className={`flex items-center p-2 border rounded-lg cursor-pointer gap-2 ${borderColor} ${bgColor} ${
                            selectedOption === option.id
                              ? "border-[#6C4CE6] bg-purple-50"
                              : "border-gray-300"
                          }`}
                        >
                          <input
                            type="radio"
                            name="quiz"
                            className="hidden"
                            onChange={() => {
                              setSelectedOption(option._id);
                              setSelectedAnswer(option.value);
                            }}
                            disabled={isAnswered}
                          />
                          <div
                            className={`py-1 md:px-3 px-2 rounded md:text-base text-sm ${
                              selectedOption === option._id
                                ? isAnswered && !isCorrect
                                  ? "bg-red-500 text-white"
                                  : "bg-[#6C4CE6] text-white"
                                : "bg-gray-100"
                            }`}
                          >
                            {index + 1}
                          </div>
                          <div className="w-full flex justify-between items-center">
                            <p className="md:text-sm text-[13px] font-semibold">
                              {option.value}
                            </p>
                            <span className="md:w-6 w-[22px] md:h-6 h-[20px] border-2 rounded-full flex items-center justify-center">
                              {selectedOption === option._id && (
                                <span
                                  className={`md:w-3 w-2 md:h-3 h-2 ${
                                    isAnswered && !isCorrect && "bg-red-500"
                                  } bg-[#6C4CE6] rounded-full`}
                                ></span>
                              )}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  {questions[currentQuestion]?.type == "short-answer" && (
                    <div className="w-full">
                      <textarea
                        name=""
                        id=""
                        placeholder="Enter your answer here..."
                        className="w-full h-full p-2 bg-gray-50 border rounded-md"
                        rows={5}
                        onChange={(e) => {
                          setTextAnswer(e.target.value);
                        }}
                      ></textarea>
                    </div>
                  )}
                  {questions[currentQuestion]?.type == "checkbox" &&
                    questions[currentQuestion]?.options.map((option) => (
                      <label
                        key={option._id}
                        className={`flex items-center p-2 border rounded-lg cursor-pointer gap-2 ${
                          multipleOptions.includes(option._id)
                            ? "bg-purple-50 border-[#6C4CE6]"
                            : "border-gray-300"
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="hidden"
                          onChange={() => {
                            if (multipleOptions.includes(option._id)) {
                              setMultipleOptions(
                                multipleOptions.filter((id) => id !== option._id)
                              );
                            } else {
                              setMultipleOptions([...multipleOptions, option._id]);
                            }
                          }}
                          checked={multipleOptions.includes(option._id)}
                          disabled={isAnswered}
                        />
                        <div
                          className={`py-1 px-3 w-full rounded ${
                            multipleOptions.includes(option._id)
                              ? "bg-[#6C4CE6] text-white"
                              : "bg-gray-100"
                          }`}
                        >
                          {option.value}
                        </div>
                        <div className=" flex justify-between">
                          <p className="text-sm font-semibold">{option.text}</p>
                          <span className="w-6 h-6 border-2 rounded flex items-center justify-center mr-3">
                            {multipleOptions.includes(option._id) && (
                              <span className="w-6 h-6 bg-[#6C4CE6] flex items-center justify-center rounded    ">
                                <IoIosCheckmark className="text-white text-2xl" />
                              </span>
                            )}
                          </span>
                        </div>
                      </label>
                    ))}
                  {questions[currentQuestion]?.type == "trueFalse" &&
                    questions[currentQuestion]?.options.map((option) => {
                      let borderColor = "border-gray-300";
                      let bgColor = "";
                      if (
                        isAnswered &&
                        selectedOption === option.id &&
                        !option.correct
                      ) {
                        borderColor = "border-red-500"; // Wrong answer gets a red border
                        bgColor = "bg-red-50";
                      }

                      return (
                        <label
                          key={option.id}
                          className={`flex items-center p-2 border rounded-lg cursor-pointer gap-2 ${borderColor} ${bgColor} ${
                            selectedOption === option.id
                              ? "border-[#6C4CE6] bg-purple-50"
                              : "border-gray-300"
                          }`}
                        >
                          <input
                            type="radio"
                            name="quiz"
                            className="hidden"
                            onChange={() => {
                              setSelectedOption(option.id);
                              setSelectedAnswer(option);
                            }}
                            disabled={isAnswered}
                          />
                          <div
                            className={`py-1 md:px-3 px-2 rounded md:text-base text-sm ${
                              selectedOption === option.id
                                ? isAnswered && !isCorrect
                                  ? "bg-red-500 text-white"
                                  : "bg-[#6C4CE6] text-white"
                                : "bg-gray-100"
                            }`}
                          >
                            {option.id}
                          </div>
                          <div className="w-full flex justify-between items-center">
                            <p className="md:text-sm text-[13px] font-semibold">
                              {option.text}
                            </p>
                            <span className="md:w-6 w-[22px] md:h-6 h-[20px] border-2 rounded-full flex items-center justify-center">
                              {selectedOption === option.id && (
                                <span
                                  className={`md:w-3 w-2 md:h-3 h-2 ${
                                    isAnswered && !isCorrect && "bg-red-500"
                                  } bg-[#6C4CE6] rounded-full`}
                                ></span>
                              )}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                </div>

                {isAnswered && showFeedback && (
                  <div
                    className={`flex sm:flex-row flex-col items-center  ${
                      isCorrect
                        ? "sm:flex-row flex-col sm:left-[25%] left-[20%] bottom-[-10%] "
                        : "sm:flex-row-reverse flex-col left-[8%] sm:bottom-[-10%] bottom-[-5%]"
                    } sm:gap-5 gap-3 absolute z-10 justify-self-center`}
                  >
                    <div className="mt-4 p-3 border rounded-lg bg-white shadow-md space-x-3 max-w-[300px] relative">
                      <button 
                        onClick={() => setShowFeedback(false)}
                        className="absolute -top-2 -right-2 bg-gray-200 hover:bg-gray-300 rounded-full p-1"
                      >
                        <RxCrossCircled className="text-gray-600 size-5" />
                      </button>
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-white`}
                      >
                        {isCorrect ? (
                          <FaCircleCheck className="text-green-300 sm:size-10 size-5" />
                        ) : (
                          <RxCrossCircled className="text-red-500 sm:size-10 size-5" />
                        )}
                      </span>
                      <div>
                        <h3 className="font-semibold sm:text-base text-sm">
                          {isCorrect
                            ? "Great job!"
                            : "Oops, that's not quite right!"}
                        </h3>
                        <p className="sm:text-sm text-xs text-gray-600">
                          {isCorrect
                            ? "You've answered correctly."
                            : "Don't worry, mistakes help you learn."}
                        </p>
                        <p className="text-sm text-gray-600">
                          {isCorrect
                            ? " Keep up the good work"
                            : " Here's the correct answer and an explanation."}
                        </p>
                      </div>
                    </div>
                    {isCorrect ? (
                      <div className="sm:w-[100px] w-[80px] sm:h-[100px] h-[80px] justify-self-center">
                        <LottiePlayer
                          animationFile={run}
                          width="100%"
                          height="100%"
                        />
                      </div>
                    ) : (
                      <div className="sm:w-[100px] w-[80px] sm:h-[100px] h-[80px]">
                        <LottiePlayer
                          animationFile={cry}
                          width="100%"
                          height="100%"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-10 flex justify-between z-50">
                <button
                  onClick={() => setIsReportOpen(true)}
                  className="text-gray-600 hover:underline sm:flex hidden items-center gap-2"
                >
                  <Flag size={16} />
                  Report
                </button>
                <div className="space-x-4 flex sm:justify-end justify-between md:w-auto w-full">
                  {currentQuestion !== questions.length - 1 && (
                    <button
                      className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100"
                      onClick={handleNext}
                    >
                      Skip
                    </button>
                  )}
                  {!isAnswered ? (
                    <button
                      className={`px-4 py-2 rounded-lg text-white ${
                        selectedOption ||
                        textAnswer.length > 0 ||
                        multipleOptions.length > 0
                          ? "bg-[#6C4CE6]"
                          : "bg-gray-300"
                      }`}
                      disabled={
                        !(
                          selectedOption ||
                          textAnswer.length > 0 ||
                          multipleOptions.length > 0
                        )
                      }
                      onClick={handleCheckAnswer}
                    >
                      Check Answer
                    </button>
                  ) : currentQuestion !== questions.length - 1 ? (
                    <button
                      className={`px-4 py-2 rounded-lg  ${
                        !isCorrect
                          ? "bg-red-500 text-white"
                          : "bg-[#6C4CE6] text-white"
                      } text-white`}
                      onClick={handleNext}
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      className="px-4 py-2 cursor-pointer rounded-lg bg-[#6C4CE6] text-white"
                      onClick={handleSubmit}
                    >
                      Submit
                    </button>
                  )}
                </div>
              </div>
              <ReportModal
                isOpen={isReportOpen}
                onClose={() => setIsReportOpen(false)}
              />
            </>
          ) : (
            <>
              <div className="flex justify-center items-center min-h-[80vh] bg-gradient-to-br rounded-lg from-purple-50 to-blue-50">
                <div className="w-full max-w-2xl flex flex-col items-center px-4 py-8">
                  {/* Loading State */}
                  {!result ? (
                    <div className="flex flex-col items-center">
                      <h1 className="md:text-3xl sm:text-2xl text-xl font-bold text-purple-800 mb-2 text-center">
                        Calculating Results...
                      </h1>
                      <p className="md:text-base sm:text-sm text-xs text-gray-600 mb-8 text-center">
                        Please wait while we analyze your performance
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Celebration Animation */}
                      <div className="md:w-[180px] sm:w-[150px] w-[80px] md:h-[180px] sm:h-[150px] h-[50px] mb-6 animate-bounce">
                        <LottiePlayer 
                          animationFile={userAnswers.length === 0 ? cry : run} 
                          width="100%" 
                          height="100%" 
                        />
                      </div>

                      {/* Header */}
                      <h1 className="md:text-3xl sm:text-2xl text-xl font-bold text-purple-800 mb-2 text-center">
                        Quiz Completed!
                      </h1>
                      <p className="md:text-base sm:text-sm text-xs text-gray-600 mb-8 text-center">
                        {userAnswers.length === 0 
                          ? "You didn't answer any questions" 
                          : "Your performance breakdown"}
                      </p>

                      {/* Score Card - Only show if user answered questions */}
                      {userAnswers.length > 0 && (
                        <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-xl">
                          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 text-center">
                            <img
                              src="/CompletionBadge.png"
                              alt="Achievement Badge"
                              className="md:w-24 sm:w-20 w-16 md:h-24 sm:h-20 h-16 mx-auto mb-2 animate-pulse"
                            />
                            <h2 className="md:text-2xl sm:text-xl text-lg font-bold text-white">Great Job!</h2>
                          </div>

                          {!result.score ? <>
                          <div className="p-4 sm:p-6">
                            <div className="flex items-center justify-center space-x-2">
                              <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"></div>
                              <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse delay-75"></div>
                              <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse delay-150"></div>
                            </div>
                            <p className="text-center text-purple-600 font-medium mt-2 animate-pulse">
                              Calculating your results...
                            </p>
                          </div>
                          </> : <div className="p-4 sm:p-6 grid grid-cols-2 gap-3 sm:gap-4">
                            <div className="bg-purple-50 p-3 sm:p-4 rounded-lg">
                              <p className="text-xs sm:text-sm text-purple-600 font-medium">Score</p>
                              <p className="md:text-3xl sm:text-2xl text-xl font-bold text-purple-800">
                                {result.score}
                              </p>
                            </div>

                            <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                              <p className="text-xs sm:text-sm text-blue-600 font-medium">Rank</p>
                              <p className="md:text-3xl sm:text-2xl text-lg font-bold text-blue-800">
                                Top {result.rank}
                              </p>
                            </div>

                            <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
                              <p className="text-xs sm:text-sm text-green-600 font-medium">Time</p>
                              <p className="md:text-xl sm:text-lg text-sm font-bold text-green-800">
                                {Math.floor(result.completionTime / 60)} mins {result.completionTime % 60} secs
                              </p>
                            </div>

                            <div className="bg-yellow-50 p-3 sm:p-4 rounded-lg">
                              <p className="text-xs sm:text-sm text-yellow-600 font-medium">
                                Accuracy
                              </p>
                              <p className="md:text-xl sm:text-lg text-base font-bold text-yellow-800">
                                {Math.round(
                                  (result.correctAnswers /
                                    (result.correctAnswers + result.incorrectAnswers)) *
                                    100
                                )}
                                %
                              </p>
                            </div>
                          </div>}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full mt-8 sm:mt-10 px-2 sm:px-4">
                        <Link
                          href={"/user/dashboard"}
                          className="px-4 sm:px-6 py-2 sm:py-3 border-2 border-purple-200 rounded-xl text-purple-700 hover:bg-purple-50 transition-all flex items-center justify-center gap-2 font-medium text-sm sm:text-base"
                        >
                          <ArrowLeft className="w-4 sm:w-5 h-4 sm:h-5" />
                          Back to Dashboard
                        </Link>

                        <Link
                          href={"/user/quizs"}
                          className="px-4 sm:px-6 py-2 sm:py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-lg transition-all flex items-center justify-center gap-2 font-medium text-sm sm:text-base"
                        >
                          Next Quiz
                          <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5" />
                        </Link>
                      </div>

                      {/* Progress Visualization - Only show if user answered questions */}
                      {userAnswers.length > 0 && (
                        <div className="w-full mt-6 sm:mt-8 bg-white p-3 sm:p-4 rounded-xl shadow">
                          <h3 className="font-medium text-gray-700 mb-2 sm:mb-3 text-sm sm:text-base">
                            Question Analysis
                          </h3>
                          <div className="flex items-center gap-2">
                            <div
                              className="h-3 sm:h-4 bg-green-200 rounded-full"
                              style={{
                                width: `${
                                  (result.correctAnswers /
                                    (result.correctAnswers + result.incorrectAnswers)) *
                                    100
                                }%`,
                              }}
                            ></div>
                            <div
                              className="h-3 sm:h-4 bg-red-200 rounded-full"
                              style={{
                                width: `${
                                  (result.incorrectAnswers /
                                    (result.correctAnswers + result.incorrectAnswers)) *
                                    100
                                }%`,
                              }}
                            ></div>
                          </div>
                          <div className="flex justify-between mt-2 text-xs sm:text-sm">
                            <span className="text-green-600">
                              {result.correctAnswers} Correct
                            </span>
                            <span className="text-red-600">
                              {result.incorrectAnswers} Incorrect
                            </span>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
