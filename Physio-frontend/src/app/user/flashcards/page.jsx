"use client";
import { Input } from "@/components/ui/input";
import useGet from "@/hooks/useGet";
import usePost from "@/hooks/usePost";
import { FileText, Heart, Search, BookOpen } from "lucide-react";
import { BsPatchCheck } from "react-icons/bs";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

// Add line-clamp styles
const lineClampStyles = `
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

const Flashcard = ({ imageSrc, title, description, rating, totalRating, id, verified, topicName }) => {
  const router = useRouter()
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);
  const randomRating = Math.random() * (5 - 3) + 2; // Generates random number between 2 and 5

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleFlashCardJoin = async(topic) => {
    setLoading(true)
    const {data, error, status} = await usePost(`/flashcards/join/${id}`)
    if(status == 201){
      setLoading(false)
      router.push(`/flashcard/1`)
      localStorage.setItem("topic" , topic)
    }
    if(error){
      setLoading(false)
      showToast("Failed to Enroll in FlashCard. Try Again", "error")
    }
  }

  // Dummy description for cards
  const dummyDescription = description || "Exercise Therapy is a treatment method that uses physical exercise to address various musculoskeletal conditions and improve overall health and fitness.";

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 group">
      {/* Image Section */}
      <div className="relative w-full h-54">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt="image"
            fill
            className="object-cover"
          />
        ) : (
          <div className="bg-gray-300 h-full w-full animate-pulse"></div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4">
          <div className="flex items-center gap-1 mb-3">
            <div className="w-4 h-4 flex items-center justify-center">
              <BsPatchCheck className="w-4 h-4 bg-purple-500 rounded-full text-white" />
            </div>
            <span className="text-purple-600 text-sm font-medium">Admin Verified</span>
          </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 leading-tight">
          {topicName || title || "Musculoskeletal Physiology"}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
          {dummyDescription}
        </p>

        {/* Topic Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {/* Hardcoded tags to match Figma design */}
          <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
            Muscle
          </span>
          <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
            Cardiovascular
          </span>
          <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
            Ribs
          </span>
        </div>

        {/* Study Button */}
        <button 
          className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-lg py-3 flex items-center justify-center font-medium transition-all duration-200" 
          onClick={()=>{handleFlashCardJoin(topicName)}}
          disabled={loading}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : "View FlashCards"}
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

function Flashcards() {
  const [topics, setTopics] = useState([]);
  const [filteredTopics, setFilteredTopics] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [isSearching, setIsSearching] = useState(false);

  const fetchBookmarkCount = async () => {
    try {
      const { data, status } = await useGet("/flashcards/bookmarked");
      if (status === 200) {
        setBookmarkCount(data.length);
      }
    } catch (error) {
      console.error("Error fetching bookmark count:", error);
    }
  };

  const fetchFlashCardsData = async () => {
    setLoading(true);
    try {
      const { data, error, status } = await useGet("/flashcards/grouped-by-topic");
      if (status === 200) {
        setTopics(data);
        setFilteredTopics(data);
      } else {
        console.error("Error fetching flashcards:", error);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlashCardsData();
    fetchBookmarkCount();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredTopics(topics);
      setIsSearching(false);
    } else {
      setIsSearching(true);
      const filtered = topics.filter((topicGroup) =>
        topicGroup.topic?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topicGroup.flashcards?.some(flashcard =>
          flashcard.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          flashcard.description?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setFilteredTopics(filtered);
    }
  }, [searchQuery, topics]);

  return (
    <div className="min-h-screen">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <BookOpen className="w-8 h-8 text-purple-600 fill-current" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Flashcards</h1>
                <p className="text-gray-600 mt-1">Master your knowledge with interactive flashcards</p>
              </div>
            </div>
            
            {/* Bookmarks Link */}
            <Link 
              href="/user/bookmarks"
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200 w-fit mt-4 sm:mt-0"
            >
              <Heart className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium text-gray-700">
                Bookmarks ({bookmarkCount})
              </span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search flashcards by topic or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 w-full bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
            {Array(6).fill(0).map((_, index) => (
              <div key={index} className="bg-white rounded-2xl overflow-hidden">
                <div className="h-48 w-full bg-gray-200 animate-pulse"></div>
                <div className="p-4">
                  <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse mb-4"></div>
                  <div className="flex gap-2 mb-4">
                    <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div>
                  </div>
                  <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
              {(isSearching ? filteredTopics : topics).map((topicGroup) => {
                if (topicGroup.flashcards.length === 0) return null;
                
                const flashcard = topicGroup.flashcards[0];
                return (
                  <Flashcard  
                    key={flashcard._id}
                    imageSrc={flashcard.imageUrl || flashcard.frontImage || "/auth-activity.png"}
                    title={flashcard.title}
                    verified={flashcard.verifiedByAdmin}
                    description={flashcard.description}
                    rating={flashcard.rating}
                    totalRating={flashcard.ratingCount}
                    id={flashcard._id}
                    topicName={topicGroup.topic?.name}
                  />
                );
              })}
            </div>
            
            {isSearching && filteredTopics.length === 0 && (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <FileText className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No flashcards found</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  We couldn't find any flashcards matching your search. Try adjusting your search terms or browse all available flashcards.
                </p>
              </div>
            )}

            {!isSearching && topics.length === 0 && (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <FileText className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No flashcards available</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  There are no flashcards available at the moment. Check back later for new content.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Flashcards;