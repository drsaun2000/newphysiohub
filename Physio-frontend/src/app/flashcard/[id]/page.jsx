"use client";
import React, { useEffect, useState } from "react";
import { IoFlagOutline } from "react-icons/io5";
import { IoIosArrowBack } from "react-icons/io";
import { MdDashboard, MdFullscreen, MdFullscreenExit, MdRefresh, MdSchedule } from "react-icons/md";
import { FaArrowLeftLong, FaTrophy, FaClock, FaPlay, FaChartLine } from "react-icons/fa6";
import { BsStarFill, BsCheckCircleFill } from "react-icons/bs";
import { HiSparkles, HiArrowLeft } from "react-icons/hi2";
import ReportModal from "@/components/common/ReportModal";
import FlashCards from "@/components/user/flashcard/flashcard";
import LottiePlayer from "@/components/animations/LottiePlayer";
import happyAnimation from "@/components/animations/data/Happy.json";
import useGet from "@/hooks/useGet";
import Link from "next/link";
import "@/styles/richtext.css";
import "../../../../public/styles/flashcard.css";

const Flashcard = () => {
  const topic = localStorage.getItem("topic");
  const [originalFlashcards, setOriginalFlashcards] = useState([]);
  const [filteredFlashcards, setFilteredFlashcards] = useState([]);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [currentCard, setCurrentCard] = useState(0);
  const [progressBar, setProcessBar] = useState(0);
  const [topicName, setTopicName] = useState("");
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [studyTime, setStudyTime] = useState(0);

  // Initialize start time when component mounts
  useEffect(() => {
    setStartTime(Date.now());
  }, []);

  // Calculate study time when completed
  useEffect(() => {
    if (isCompleted && startTime) {
      const endTime = Date.now();
      const timeSpent = Math.floor((endTime - startTime) / 1000 / 60); // in minutes
      setStudyTime(timeSpent);
    }
  }, [isCompleted, startTime]);

  useEffect(() => {
    setProcessBar(((currentCard + 1) / filteredFlashcards.length) * 100);
  }, [currentCard, filteredFlashcards]);

  // Add keyboard event listener
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Prevent default behavior if we're handling the key
      switch (event.code) {
        case 'Space':
          event.preventDefault();
          setIsFlipped(prev => !prev);
          break;
        case 'ArrowLeft':
          event.preventDefault();
          handleBack();
          break;
        case 'ArrowRight':
          event.preventDefault();
          handleNext();
          break;
        case 'KeyF':
          event.preventDefault();
          toggleFocusMode();
          break;
        case 'KeyS':
          event.preventDefault();
          toggleShuffle();
          break;
        case 'Escape':
          if (isFocusMode) {
            event.preventDefault();
            setIsFocusMode(false);
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
  }, [currentCard, filteredFlashcards.length, isFocusMode, isShuffled]); // Dependencies for handleNext/handleBack

  // Reset flip state when card changes
  useEffect(() => {
    setIsFlipped(false);
  }, [currentCard]);

  const toggleFocusMode = () => {
    setIsFocusMode(prev => !prev);
  };

  // Fisher-Yates shuffle algorithm
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const toggleShuffle = () => {
    setCurrentCard(0); // Reset to first card
    setIsFlipped(false); // Reset flip state
    
    if (isShuffled) {
      // Turn off shuffle - restore original order
      setFilteredFlashcards(originalFlashcards);
      setIsShuffled(false);
    } else {
      // Turn on shuffle - shuffle the cards
      const shuffled = shuffleArray(originalFlashcards);
      setFilteredFlashcards(shuffled);
      setIsShuffled(true);
    }
  };

  const fetchFlashCard = async () => {
    const { data, error, status } = await useGet(`/flashcards/grouped-by-topic`);
    if (status == 200) {
      // Filter flashcards by topic ID from params
      const topicGroup = data.find(group => group.topic?.name === topic);
      
      if (topicGroup) {
        setTopicName(topicGroup.topic?.name || "");
        const flashcards = topicGroup.flashcards || [];
        setOriginalFlashcards(flashcards);
        setFilteredFlashcards(flashcards);
      } else {
        setOriginalFlashcards([]);
        setFilteredFlashcards([]);
      }
    }
  };

  useEffect(() => {
    fetchFlashCard();
  }, [topic]); // Add id to dependency array to refetch when id changes

  const handleNext = () => {
    if (currentCard < filteredFlashcards.length - 1) {
      setCurrentCard((prev) => prev + 1);
    } else {
      // Last card reached, show completion screen
      setIsCompleted(true);
    }
  };

  const handleBack = () => {
    if (currentCard > 0) {
      setCurrentCard((prev) => prev - 1);
    }
  };

  // Completion Screen Component
  const CompletionScreen = () => (
    <div className={`min-h-screen ${isFocusMode ? 'bg-gradient-to-br from-purple-50 via-white to-blue-50' : 'bg-gradient-to-br from-purple-50 via-white to-blue-50'} py-8 transition-all duration-500`}>
      <div className={`flex flex-col gap-6 sm:max-w-[50%] max-w-[95%] mx-auto ${isFocusMode ? 'max-w-4xl' : ''}`}>
        {/* Progress Bar */}
        <div className="progress-container">
          <Link href={"/user/flashcards"} className="dashboard-btn hover:bg-white hover:shadow-md">
            <FaArrowLeftLong size={20} className="text-gray-600" />
          </Link>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
            <div className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-1000 shadow-sm" style={{ width: '100%' }}></div>
          </div>
        </div>

        {/* Completion Content */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-8 py-6 text-center">
            <div className="mb-4 flex justify-center">
              <div className="relative">
                <LottiePlayer 
                  animationFile={happyAnimation}
                  width="100px" 
                  height="100px" 
                  loop={true}
                />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
              <HiSparkles className="w-6 h-6" />
              Flashcards completed!
              <HiSparkles className="w-6 h-6" />
            </h2>
            <p className="text-purple-100 text-lg">All flashcards have been completed successfully.</p>
          </div>

          {/* Stats Section */}
          <div className="p-8">
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 text-center border border-purple-200 hover:shadow-md transition-all duration-200">
                <div className="w-14 h-14 mx-auto bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                  <BsStarFill className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-2">Cards Reviewed</h3>
                <div className="text-2xl font-bold text-purple-600 mb-1">{filteredFlashcards.length}</div>
                <p className="text-purple-600 text-sm font-medium">Flashcards completed</p>
              </div>
              
              <div className="bg-gradient-to-br from-orange-50 to-yellow-100 rounded-xl p-6 text-center border border-orange-200 hover:shadow-md transition-all duration-200">
                <div className="w-14 h-14 mx-auto bg-gradient-to-br from-orange-400 to-yellow-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                  <FaClock className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-2">Time Spent</h3>
                <div className="text-2xl font-bold text-orange-600 mb-1">{studyTime || 10}</div>
                <p className="text-orange-600 text-sm font-medium">Minutes studied</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => {
                  setCurrentCard(0);
                  setIsCompleted(false);
                  setIsFlipped(false);
                  setStartTime(Date.now());
                }}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-4 px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group"
              >
                <MdRefresh className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" />
                Restart Flashcards
                <FaPlay className="w-4 h-4" />
              </button>
              
              <button
                disabled
                className="w-full bg-gray-100 text-gray-500 py-4 px-6 rounded-xl font-semibold cursor-not-allowed border border-gray-200 flex items-center justify-center gap-3"
              >
                <FaChartLine className="w-5 h-5" />
                Spaced Repetition
                <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">Coming Soon</span>
              </button>
            </div>
            
            {/* Back to Dashboard Link */}
            <div className="mt-6 text-center">
              <Link 
                href="/user/flashcards"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-purple-600 text-sm font-medium transition-colors duration-200 hover:bg-purple-50 px-4 py-2 rounded-lg"
              >
                <HiArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (filteredFlashcards.length === 0) {
    return (
      <div className="min-h-screen bg-[#f5f7fa] py-8">
        <div className="flex flex-col gap-6 sm:max-w-[60%] max-w-[90%] mx-auto">
          <Link
            href={"/user/flashcards"}
            className="px-4 py-2 bg-white flex items-center w-fit rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200"
          >
            <IoIosArrowBack className="text-gray-600" size={16} />
            <span className="ml-2 text-sm font-medium">Go to Dashboard</span>
          </Link>
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              {topicName ? `No flashcards found for ${topicName}` : "Topic not found"}
            </h3>
            <p className="text-gray-600 text-lg">
              {topicName ? "This topic doesn't have any flashcards yet." : "The requested topic doesn't exist."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show completion screen if completed
  if (isCompleted) {
    return <CompletionScreen />;
  }

  return (
    <div className={`min-h-screen ${isFocusMode ? 'bg-gradient-to-br from-purple-50 via-white to-blue-50' : 'bg-[#f5f7fa]'} py-8 transition-all duration-500`}>
      <div className={`flex flex-col gap-6 sm:max-w-[50%] max-w-[95%] mx-auto ${isFocusMode ? 'max-w-4xl' : ''}`}>
        {!isFocusMode && (
          <div className="progress-container">
            <Link href={"/user/flashcards"} className="dashboard-btn">
              <FaArrowLeftLong size={20} />
            </Link>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#8B5CF6] rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${progressBar}%`
                }}
              ></div>
            </div>
          </div>
        )}
        
        <FlashCards
          flashCardData={{ ...filteredFlashcards[currentCard] }}
          length={filteredFlashcards.length}
          currentCard={currentCard}
          isFlipped={isFlipped}
          setIsFlipped={setIsFlipped}
          isFocusMode={isFocusMode}
          toggleFocusMode={toggleFocusMode}
          isShuffled={isShuffled}
          toggleShuffle={toggleShuffle}
        />

        {!isFocusMode && (
          <div className="navigation-controls flex justify-between items-center z-50">
            <button
              onClick={() => setIsReportOpen(true)}
              className="text-gray-500 hover:text-red-500 flex items-center gap-2 text-sm font-medium transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-red-50"
            >
              <IoFlagOutline size={16} />
              Report
            </button>
            <div className="flex gap-3">
              <button
                className={`previous-btn ${currentCard === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                onClick={handleBack}
                disabled={currentCard === 0}
              >
                Previous Card
              </button>
              {currentCard === filteredFlashcards.length - 1 ? (
                <button
                  className="nav-btn cursor-pointer"
                  onClick={() => setIsCompleted(true)}
                >
                  Finish
                </button>
              ) : (
                <button
                  className="nav-btn cursor-pointer"
                  onClick={handleNext}
                >
                  Continue
                </button>
              )}
            </div>
          </div>
        )}

        {isFocusMode && (
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
            <div className="focus-controls">
              <span className="card-counter">
                Card {currentCard + 1} of {filteredFlashcards.length}
                {isShuffled && <span className="text-purple-600 ml-2">(Shuffled)</span>}
              </span>
              <div className="flex gap-3">
                <button
                  className={`focus-nav-btn ${currentCard === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={handleBack}
                  disabled={currentCard === 0}
                >
                  Previous
                </button>
                {currentCard === filteredFlashcards.length - 1 ? (
                  <button
                    className="focus-nav-btn"
                    onClick={() => setIsCompleted(true)}
                  >
                    Finish
                  </button>
                ) : (
                  <button
                    className="focus-nav-btn"
                    onClick={handleNext}
                  >
                    Next
                  </button>
                )}
                <button
                  className="focus-exit-btn"
                  onClick={toggleFocusMode}
                >
                  Exit Focus
                </button>
              </div>
            </div>
          </div>
        )}
        
        <ReportModal
          isOpen={isReportOpen}
          onClose={() => setIsReportOpen(false)}
        />
      </div>
    </div>
  );
};

export default Flashcard;