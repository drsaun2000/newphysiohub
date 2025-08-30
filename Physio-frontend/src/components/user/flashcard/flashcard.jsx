"use client";
import React, { useEffect, useState } from "react";
import { BsVolumeUp, BsStarFill } from "react-icons/bs";
import { FaWandMagicSparkles } from "react-icons/fa6";
import { BsArrowRepeat } from "react-icons/bs";
import { MdVerified, MdOutlineShare, MdFullscreen } from "react-icons/md";
import { TbClock, TbSettings } from "react-icons/tb";
import { FiCopy } from "react-icons/fi";
import { BiHappy } from "react-icons/bi";
import { Rating } from "@mui/material";
import RichTextDisplay from "../../common/RichTextDisplay";
import "../../../styles/richtext.css";
import Link from "next/link";
import "../../../../public/styles/flashcard.css";
import usePost from "@/hooks/usePost";
import useGet from "@/hooks/useGet";

function Flashcard({ flashCardData, length, currentCard, isFlipped, setIsFlipped, isFocusMode, toggleFocusMode, isShuffled, toggleShuffle }) {
  const [showHint, setShowHint] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isStarred, setIsStarred] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  // Generate random rating between 3 and 5
  const randomRating = Math.floor(Math.random() * (5 - 3 + 1)) + 3;
  const flashcardRating = flashCardData.rating || randomRating;

  const handleCopyUrl = () => {
    // Get the current URL
    const currentUrl = window.location.href;

    // Copy to clipboard
    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        setIsCopied(true);
        // Reset after 2 seconds
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy URL: ", err);
      });
  };
  
  const handleCopyContent = () => {
    const content = isFlipped 
      ? extractTextFromHtml(flashCardData?.backContent) 
      : extractTextFromHtml(flashCardData?.frontContent);
    
    navigator.clipboard
      .writeText(content)
      .then(() => {
        alert("Content copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy content: ", err);
      });
  };
  
  useEffect(() => {
    // Reset flip state is now handled by parent component
    // setIsFlipped(false); - removed since it's now a prop
    
    // Check if this flashcard is bookmarked when component mounts or flashcard changes
    if (flashCardData?._id) {
      checkBookmarkStatus();
    }
  }, [flashCardData, currentCard]);

  const checkBookmarkStatus = async () => {
    try {
      const { data, error, status } = await useGet(`/flashcards/is-bookmarked/${flashCardData._id}`);
      if (status === 200) {
        setIsStarred(data.bookmarked);
      }
    } catch (error) {
      console.error('Error checking bookmark status:', error);
    }
  };

  const toggleStar = async (e) => {
    e.stopPropagation();
    if (bookmarkLoading) return;
    
    setBookmarkLoading(true);
    try {
      const { data, error, status } = await usePost(`/flashcards/bookmark/${flashCardData._id}`, {});
      console.log('Bookmark response:', { data, error, status }); // Debug log
      
      // Accept both 200 and 201 as successful responses
      if (status === 200 || status === 201) {
        // usePost already extracts response.data.data, so data is directly {bookmarked: true/false}
        if (data && typeof data.bookmarked === 'boolean') {
          setIsStarred(data.bookmarked);
          console.log(data.bookmarked ? 'Flashcard bookmarked!' : 'Flashcard unbookmarked!');
        } else {
          console.error('Invalid response structure:', data);
        }
      } else {
        console.error('Error toggling bookmark:', error || 'Unknown error');
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    } finally {
      setBookmarkLoading(false);
    }
  };

  const speakText = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
  };

  // Helper function to extract text from HTML for speech synthesis
  const extractTextFromHtml = (html) => {
    if (!html) return '';
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <>
      <div className={`card space-y-5 ${isFocusMode ? 'focus-mode-card' : ''}`}>
        {/* Top Label - Hidden in focus mode */}
        {!isFocusMode && (
          <div className="card-label flex items-center justify-between">
            <span>
              Card {currentCard + 1} of {length} • Chapter Chest Physiotherapy
            </span>
            {isShuffled && (
              <span className="text-purple-600 font-semibold text-xs bg-purple-100 px-2 py-1 rounded-full flex items-center gap-1">
                <BsArrowRepeat className="w-3 h-3" />
                Shuffled
              </span>
            )}
          </div>
        )}

        <div
          className={`flashcard-container ${isFocusMode ? 'md:h-[500px] h-[400px]' : 'md:h-[350px] h-[300px]'} ${isFlipped ? "flipped" : ""}`}
          onClick={handleCardClick}
        >
          <div className="flashcard-inner">
            <div className="flashcard-front relative">
              <div className="absolute top-5 left-5 flex items-center gap-3 z-10 flashcard-front-buttons">
                <div className="tooltip-container">
                  <button 
                    className="round-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      speakText(extractTextFromHtml(flashCardData?.frontContent));
                    }}
                  >
                    <BsVolumeUp className="w-4 h-4 text-gray-600" />
                  </button>
                  <div className="tooltip">Read aloud</div>
                </div>
                <div
                  className="relative inline-block tooltip-container"
                  onMouseEnter={() => setShowHint(true)}
                  onMouseLeave={() => setShowHint(false)}
                >
                  <button className="hint-btn" onClick={(e) => e.stopPropagation()}>
                    <FaWandMagicSparkles className="hint-icon" />
                    <span className="hint-text">
                      Get a hint
                    </span>
                  </button>

                  {showHint && (
                    <div className="tooltip">
                      {flashCardData?.hint || "This type of disease often involves inflammation."}
                    </div>
                  )}
                </div>
              </div>
              <div className="absolute top-5 right-5 z-10 flashcard-front-buttons">
                <div className="flex items-center gap-2">
                  {!isFocusMode && (
                    <div className="tooltip-container">
                      <button className="round-button" onClick={(e) => {
                        e.stopPropagation();
                        toggleFocusMode();
                      }}>
                        <MdFullscreen className="w-4 h-4 text-gray-600" />
                      </button>
                      <div className="tooltip">Focus mode</div>
                    </div>
                  )}
                  <div className="tooltip-container">
                    <button className="round-button" onClick={toggleStar} disabled={bookmarkLoading}>
                      {bookmarkLoading ? (
                        <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <BsStarFill className={`w-4 h-4 ${isStarred ? 'text-yellow-400' : 'text-gray-300'}`} />
                      )}
                    </button>
                    <div className="tooltip star-tooltip">{isStarred ? 'Remove from favorites' : 'Add to favorites'}</div>
                  </div>
                </div>
              </div>
              <div className="flashcard-content">
                {flashCardData?.frontImage ? (
                  <img 
                    src={flashCardData.frontImage} 
                    alt="Front content"
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <RichTextDisplay 
                    content={flashCardData?.frontContent || `
                      <div style="text-align: center;">
                        <p style="font-size: 18px; font-weight: 600; color: #1e293b; line-height: 1.4;">The musculoskeletal system weakens with age, too, increasing the risk of injuries and musculoskeletal diseases like ___________</p>
                      </div>
                    `}
                    className="text-center max-w-full"
                  />
                )}
              </div>
            </div>
            <div className="flashcard-back relative">
              <div className="absolute top-5 left-5 flex items-center gap-3 z-10 flashcard-back-buttons">
                <div className="tooltip-container">
                  <button 
                    className="speak-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      speakText(extractTextFromHtml(flashCardData?.backContent));
                    }}
                  >
                    <BsVolumeUp className="speak-icon" />
                  </button>
                  <div className="tooltip">Read aloud</div>
                </div>
                <div
                  className="relative inline-block tooltip-container"
                  onMouseEnter={() => setShowHint(true)}
                  onMouseLeave={() => setShowHint(false)}
                >
                  <button className="hint-btn" onClick={(e) => e.stopPropagation()}>
                    <FaWandMagicSparkles className="hint-icon" />
                    <span className="hint-text">
                      Get a hint
                    </span>
                  </button>

                  {showHint && (
                    <div className="hint-tooltip">
                      {flashCardData?.hint || "This type of disease often involves inflammation."}
                    </div>
                  )}
                </div>
              </div>
              <div className="absolute top-5 right-5 z-10 flashcard-back-buttons">
                <div className="flex items-center gap-2">
                  {!isFocusMode && (
                    <div className="tooltip-container">
                      <button className="round-button" onClick={(e) => {
                        e.stopPropagation();
                        toggleFocusMode();
                      }}>
                        <MdFullscreen className="w-4 h-4 text-gray-600" />
                      </button>
                      <div className="tooltip">Focus mode</div>
                    </div>
                  )}
                  <div className="tooltip-container">
                    <button className="round-button" onClick={toggleStar} disabled={bookmarkLoading}>
                      {bookmarkLoading ? (
                        <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <BsStarFill className={`w-4 h-4 ${isStarred ? 'text-yellow-400' : 'text-gray-300'}`} />
                      )}
                    </button>
                    <div className="tooltip star-tooltip">{isStarred ? 'Remove from favorites' : 'Add to favorites'}</div>
                  </div>
                </div>
              </div>
              <div className="flashcard-content back">
                {flashCardData?.backImage ? (
                  <img 
                    src={flashCardData.backImage} 
                    alt="Back content"
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <RichTextDisplay 
                    content={flashCardData?.backContent || `
                      <div style="text-align: center;">
                        <p style="font-size: 24px; font-weight: 700; color: #7c3aed;">osteoporosis</p>
                      </div>
                    `}
                    className="text-center max-w-full"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Controls Below Card - Hidden in focus mode */}
        {!isFocusMode && (
          <div className="flex flex-row justify-between items-center gap-3">
            <div className="button-group">
              <div className="tooltip-container">
                <button 
                  className={`round-button ${isShuffled ? 'bg-purple-100 border-purple-200' : ''}`}
                  onClick={toggleShuffle}
                >
                  <BsArrowRepeat className={`w-4 h-4 ${isShuffled ? 'text-purple-600' : 'text-gray-600'}`} />
                </button>
                <div className="tooltip">
                  {isShuffled ? 'Turn off shuffle (S)' : 'Shuffle cards (S)'}
                </div>
              </div>
              <div className="tooltip-container">
                <button className="round-button" onClick={() => setIsOpen(!isOpen)}>
                  <TbSettings className="w-4 h-4 text-gray-600" />
                </button>
                <div className="tooltip">Settings</div>
              </div>
              <div className="tooltip-container">
                <button className="round-button" onClick={handleCopyContent}>
                  <FiCopy className="w-4 h-4 text-gray-600" />
                </button>
                <div className="tooltip">Duplicate set</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="tooltip-container">
                <button className="pill-button">
                  <TbClock className="icon" />
                  <span className="text">
                    Spaced Repetition
                  </span>
                </button>
                <div className="tooltip">Schedule for review</div>
              </div>
              <div className="tooltip-container">
                <button
                  onClick={handleCopyUrl}
                  className="pill-button"
                >
                  <MdOutlineShare className="icon" />
                  <span className="text">
                    {isCopied ? "URL Copied!" : "Share"}
                  </span>
                </button>
                <div className="tooltip">Share this card</div>
              </div>
            </div>
          </div>
        )}
        
        {/* Settings Modal */}
        {isOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Flashcard Settings
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Question Format</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <div className="relative">
                        <input
                          type="radio"
                          name="questionFormat"
                          defaultChecked
                          className="sr-only"
                        />
                        <div className="w-5 h-5 border-2 border-purple-500 rounded-full bg-purple-500 flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      </div>
                      <span className="text-gray-700 font-medium">Answer with Term</span>
                      <div className="ml-auto">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <div className="relative">
                        <input
                          type="radio"
                          name="questionFormat"
                          className="sr-only"
                        />
                        <div className="w-5 h-5 border-2 border-gray-300 rounded-full flex items-center justify-center">
                        </div>
                      </div>
                      <span className="text-gray-700">Answer with Definition</span>
                      <div className="ml-auto">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Select the steps that led to the issue:</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="sr-only"
                        />
                        <div className="w-5 h-5 border-2 border-purple-500 rounded bg-purple-500 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                      <span className="text-gray-700 font-medium">Study starred terms only</span>
                      <div className="ml-auto">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          className="sr-only"
                        />
                        <div className="w-5 h-5 border-2 border-gray-300 rounded flex items-center justify-center">
                        </div>
                      </div>
                      <span className="text-gray-700">Shuffle terms</span>
                      <div className="ml-auto">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-6 py-2.5 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-6 py-2.5 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Confidence Level - Hidden in focus mode */}
      {!isFocusMode && (
        <div className="card">
          <div className="flex md:flex-row flex-col md:items-center justify-between gap-4">
            <p className="text-base font-semibold text-gray-700">Confidence Level</p>
            <div className="flex gap-3">
              {[
                { text: "Low", bg: "bg-[#FF4D4D]", emoji: "😟", class: "low" },
                { text: "Medium", bg: "bg-[#FFBF1B]", emoji: "😐", class: "medium" },
                { text: "High", bg: "bg-[#4CDBC8]", emoji: "😊", class: "high" },
              ].map((level, index) => (
                <button
                  key={index}
                  className={`confidence-btn ${level.class} ${
                    flashCardData?.confidenceLevel === level.text.toLowerCase()
                      ? "active"
                      : ""
                  }`}
                >
                  {level.emoji && <span className="text-lg">{level.emoji}</span>}
                  <span className="font-medium">{level.text}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Rating card - Hidden in focus mode */}
      {!isFocusMode && (
        <div className="card">
          <div className="flex md:flex-row flex-col md:items-center justify-between gap-4">
            {/* Left: Verified */}
            <div className="flex items-center gap-3 text-sm font-medium">
              <MdVerified className="text-blue-500 w-5 h-5" />
              <span className="text-gray-700">Verified by Admin</span>
            </div>

            {/* Right: Rating */}
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-gray-900">
                  {flashcardRating.toFixed(1)}
                </span>
                <div className="rating-stars">
                  <Rating
                    name="simple-controlled"
                    value={flashcardRating}
                    readOnly
                    precision={0.1}
                    size="small"
                  />
                </div>
              </div>
              <div className="ratings-count">
                {flashCardData?.ratingCount || 273} Ratings
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* View All Card button - Hidden in focus mode */}
      {!isFocusMode && (
        <div className="card">
          <Link href="/user/flashcards" className="view-all-btn">
            <span className="font-medium text-gray-700">View All Cards</span>
            <span className="text-gray-400 text-lg">›</span>
          </Link>
        </div>
      )}
    </>
  );
}

export default Flashcard;
