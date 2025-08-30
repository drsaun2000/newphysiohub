"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import useGet from "@/hooks/useGet";
import usePost from "@/hooks/usePost";
import { Rating } from "@mui/material";
import { Heart, BadgeCheck, ArrowLeft, BookOpen, Clock, Eye, Search, Star, Trash2, Play, ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import RichTextDisplay from '@/components/common/RichTextDisplay';
import "../../../styles/richtext.css";

// Add line-clamp styles
const lineClampStyles = `
  .line-clamp-2 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
  .line-clamp-3 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = lineClampStyles;
  document.head.appendChild(styleElement);
}

const BookmarkedFlashcard = ({ flashcard, onUnbookmark }) => {
  const router = useRouter();
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);
  const [unbookmarkLoading, setUnbookmarkLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const randomRating = Math.random() * (5 - 3) + 3;

  // Add safety checks for flashcard properties
  if (!flashcard) {
    return null;
  }

  const {
    _id,
    title = flashcard.frontContent ? 'Medical Flashcard' : 'Untitled Flashcard',
    description = flashcard.backContent || 'No description available',
    imageUrl,
    frontImage,
    backImage,
    verifiedByAdmin = false,
    topic,
    rating,
    ratingCount,
    frontContent,
    backContent
  } = flashcard;

  // Extract text from HTML content for better display
  const extractTextFromHtml = (html) => {
    if (!html) return '';
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  // Generate smart display content
  const getDisplayTitle = () => {
    if (title && title !== 'Medical Flashcard' && title !== 'Untitled Flashcard') {
      return title;
    }
    
    if (frontContent) {
      const textContent = extractTextFromHtml(frontContent);
      return textContent.length > 60 ? textContent.substring(0, 60) + '...' : textContent;
    }
    
    return 'Untitled Flashcard';
  };

  const getDisplayDescription = () => {
    if (description && description !== 'No description available') {
      return description;
    }
    
    if (backContent) {
      const textContent = extractTextFromHtml(backContent);
      return textContent.length > 120 ? textContent.substring(0, 120) + '...' : textContent;
    }
    
    return 'No description available';
  };

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleFlashCardJoin = async() => {
    if (!topic?.name) {
      showToast("Topic not available", "error");
      return;
    }
    
    setLoading(true);
    try {
      const {data, error, status} = await usePost(`/flashcards/join/${_id}`);
      if(status === 201 || status === 200){
        router.push(`/flashcard/1`);
        localStorage.setItem("topic", topic.name);
        showToast("Joined flashcard successfully!", "success");
      } else {
        showToast("Failed to join flashcard. Try again.", "error");
      }
    } catch (error) {
      showToast("Failed to join flashcard. Try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUnbookmark = async (e) => {
    e.stopPropagation();
    if (unbookmarkLoading) return;
    
    setUnbookmarkLoading(true);
    try {
      const { data, error, status } = await usePost(`/flashcards/bookmark/${_id}`, {});
      
      // Accept both 200 and 201 as successful responses
      if (status === 200 || status === 201) {
        // usePost already extracts response.data.data, so data is directly {bookmarked: true/false}
        if (data && typeof data.bookmarked === 'boolean') {
          if (data.bookmarked === false) {
            showToast('Removed from bookmarks', 'success');
            onUnbookmark(_id);
          } else {
            showToast('Failed to remove bookmark', 'error');
          }
        } else {
          console.error('Invalid response structure:', data);
          showToast('Failed to remove bookmark', 'error');
        }
      } else {
        showToast('Failed to remove bookmark', 'error');
      }
    } catch (error) {
      console.error('Unbookmark error:', error);
      showToast('Failed to remove bookmark', 'error');
    } finally {
      setUnbookmarkLoading(false);
    }
  };

  const cardRating = rating || randomRating;
  const displayImage = frontImage || backImage || imageUrl;

  // Check if content overflows
  useEffect(() => {
    const checkOverflow = () => {
      const titleLength = (title === 'Untitled Flashcard' && frontContent ? frontContent : title).length;
      const descLength = (description === 'No description available' && backContent ? backContent : description).length;
      setHasOverflow(titleLength > 100 || descLength > 150);
    };
    checkOverflow();
  }, [title, description, frontContent, backContent]);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:border-purple-200 hover:shadow-xl transition-all duration-300 group h-[480px] flex flex-col">
      {/* Image Section - Prominent at top */}
      {displayImage && (
        <div className="relative w-full h-48 flex-shrink-0 bg-gradient-to-br from-gray-50 to-gray-100">
          <Image
            src={displayImage}
            alt={getDisplayTitle()}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
          
          {/* Topic Badge - Floating on image */}
          {topic?.name && (
            <div className="absolute top-4 left-4">
              <div className="inline-flex items-center bg-white/90 backdrop-blur-sm text-purple-700 px-3 py-1.5 rounded-lg text-xs font-semibold border border-purple-200 shadow-sm">
                {topic.name}
              </div>
            </div>
          )}
          
          {/* Bookmark Button - Floating on image */}
          <button
            onClick={handleUnbookmark}
            disabled={unbookmarkLoading}
            className="absolute top-4 right-4 p-2.5 rounded-xl bg-white/90 backdrop-blur-sm hover:bg-white border border-white/50 transition-all duration-200 group/btn shadow-sm"
            title="Remove from bookmarks"
          >
            {unbookmarkLoading ? (
              <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Heart className="w-4 h-4 text-red-500 fill-current group-hover/btn:scale-110 transition-transform duration-200" />
            )}
          </button>
        </div>
      )}

      {/* Header for cards without images */}
      {!displayImage && (
        <div className="p-5 flex-shrink-0 border-b border-gray-50">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              {/* Topic Badge */}
              {topic?.name && (
                <div className="inline-flex items-center bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 px-3 py-1.5 rounded-lg text-xs font-semibold border border-purple-200">
                  {topic.name}
                </div>
              )}
            </div>
            
            {/* Bookmark Button */}
            <button
              onClick={handleUnbookmark}
              disabled={unbookmarkLoading}
              className="flex-shrink-0 p-2.5 rounded-xl bg-gray-50 hover:bg-red-50 border border-gray-200 hover:border-red-200 transition-all duration-200 group/btn"
              title="Remove from bookmarks"
            >
              {unbookmarkLoading ? (
                <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Heart className="w-4 h-4 text-red-500 fill-current group-hover/btn:scale-110 transition-transform duration-200" />
              )}
            </button>
          </div>
          
          {/* Admin Verified Badge */}
          {verifiedByAdmin && (
            <div className="flex items-center gap-2">
              <BadgeCheck className="w-4 h-4 text-blue-500" />
              <span className="text-blue-600 text-xs font-medium bg-blue-50 px-2 py-0.5 rounded-full">Verified</span>
            </div>
          )}
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 flex flex-col p-5">
        {/* Admin Verified Badge for image cards */}
        {displayImage && verifiedByAdmin && (
          <div className="flex items-center gap-2 mb-3">
            <BadgeCheck className="w-4 h-4 text-blue-500" />
            <span className="text-blue-600 text-xs font-medium bg-blue-50 px-2 py-0.5 rounded-full">Verified</span>
          </div>
        )}
        
        {/* Text Content */}
        <div className="flex-1 overflow-hidden">
          {/* Title */}
          <div className="mb-3">
            <RichTextDisplay 
              content={title === 'Untitled Flashcard' && frontContent ? frontContent : title}
              className={`text-xl font-bold text-gray-900 leading-tight hover:text-purple-700 transition-colors duration-200 ${!isExpanded ? 'line-clamp-2' : ''}`}
            />
          </div>
          
          {/* Description */}
          <div className={`${!isExpanded ? 'line-clamp-3' : ''} transition-all duration-300`}>
            <RichTextDisplay 
              content={description === 'No description available' && backContent ? backContent : description}
              className="text-gray-600 text-sm leading-relaxed"
            />
          </div>
          
          {/* Expand/Collapse Button */}
          {hasOverflow && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 text-purple-600 hover:text-purple-700 text-xs font-medium mt-3 transition-colors duration-200"
            >
              {isExpanded ? (
                <>
                  <span>Show less</span>
                  <ChevronUp className="w-3 h-3" />
                </>
              ) : (
                <>
                  <span>Show more</span>
                  <ChevronDown className="w-3 h-3" />
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 pb-5 mt-auto flex-shrink-0 border-t border-gray-50 pt-4">
        {/* Rating */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Rating
              name="flashcard-rating"
              value={cardRating}
              readOnly
              size="small"
              precision={0.1}
              sx={{
                '& .MuiRating-iconFilled': {
                  color: '#8B5CF6',
                },
              }}
            />
            <span className="text-xs text-gray-500 font-medium">
              {cardRating.toFixed(1)} ({ratingCount || Math.floor(Math.random() * 50) + 10})
            </span>
          </div>
        </div>
        
        {/* Action Button */}
        <button 
          className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl py-3.5 flex items-center justify-center font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0" 
          onClick={handleFlashCardJoin}
          disabled={loading}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <Eye className="w-4 h-4 mr-2" />
              Study Flashcard
            </>
          )}
        </button>
      </div>
      
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-4 right-4 p-4 rounded-xl shadow-lg z-50 ${
            notification.type === "error" ? "bg-red-500" : "bg-green-500"
          } text-white`}
        >
          {notification.message}
          <button onClick={() => setNotification(null)} className="ml-4 text-xl hover:text-gray-200">
            ×
          </button>
        </div>
      )}
    </div>
  );
};

function BookmarksPage() {
  const [bookmarkedFlashcards, setBookmarkedFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

  const fetchBookmarkedFlashcards = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error, status } = await useGet("/flashcards/bookmarked");
      if (status === 200) {
        setBookmarkedFlashcards(data || []);
      } else {
        setError("Failed to fetch bookmarked flashcards");
      }
    } catch (error) {
      console.error("Error fetching bookmarked flashcards:", error);
      setError("An error occurred while fetching bookmarks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarkedFlashcards();
  }, []);

  const handleUnbookmark = (flashcardId) => {
    setBookmarkedFlashcards(prev => prev.filter(card => card._id !== flashcardId));
  };

  // Filter flashcards based on search term
  const filteredFlashcards = bookmarkedFlashcards.filter(flashcard => {
    if (!flashcard) return false;
    
    // Helper function to extract text from HTML content for search
    const extractTextFromHtml = (html) => {
      if (!html) return '';
      try {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || '';
      } catch (error) {
        return html; // Fallback to original text if parsing fails
      }
    };
    
    const title = extractTextFromHtml(flashcard.title) || extractTextFromHtml(flashcard.frontContent) || '';
    const description = extractTextFromHtml(flashcard.description) || extractTextFromHtml(flashcard.backContent) || '';
    const topicName = flashcard.topic?.name?.toLowerCase() || '';
    const frontContent = extractTextFromHtml(flashcard.frontContent) || '';
    const backContent = extractTextFromHtml(flashcard.backContent) || '';
    const search = searchTerm.toLowerCase();
    
    return (
      title.toLowerCase().includes(search) || 
      description.toLowerCase().includes(search) ||
      topicName.includes(search) ||
      frontContent.toLowerCase().includes(search) ||
      backContent.toLowerCase().includes(search)
    );
  });

  return (
    <div className="min-h-screen">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          {/* Page Title */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Heart className="w-8 h-8 text-purple-600 fill-current" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Bookmarks</h1>
                <p className="text-gray-600 mt-1">Your favorite flashcards for quick access</p>
              </div>
            </div>
            
            {/* Back to Flashcards Link */}
            <Link 
              href="/user/flashcards"
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200 w-fit mt-4 sm:mt-0"
            >
              <BookOpen className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">
                All Flashcards
              </span>
            </Link>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search your bookmarks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 w-full bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, index) => (
              <div key={index} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded-lg mb-4 animate-pulse"></div>
                  <div className="h-6 bg-gray-200 rounded-lg mb-3 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded-lg mb-4 animate-pulse"></div>
                  <div className="h-48 bg-gray-200 rounded-xl mb-4 animate-pulse"></div>
                  <div className="h-10 bg-gray-200 rounded-xl animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ArrowLeft className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Unable to load bookmarks</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={fetchBookmarkedFlashcards}
              className="bg-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-purple-700 transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        ) : filteredFlashcards.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm ? 'No matching bookmarks found' : 'No bookmarks yet'}
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchTerm 
                ? 'Try adjusting your search terms to find what you\'re looking for.'
                : 'Start bookmarking your favorite flashcards to access them quickly here.'
              }
            </p>
            {!searchTerm && (
              <Link href="/user/flashcards">
                <button className="bg-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-purple-700 transition-colors duration-200 inline-flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Browse Flashcards
                </button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFlashcards.map((flashcard) => (
              <BookmarkedFlashcard
                key={flashcard._id}
                flashcard={flashcard}
                onUnbookmark={handleUnbookmark}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BookmarksPage; 