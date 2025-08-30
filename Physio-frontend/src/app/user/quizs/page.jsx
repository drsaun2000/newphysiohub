"use client";
import Image from "next/image.js";
import { Button } from "@/components/ui/button.jsx";
import {
  Trash2,
  Edit,
  MessageSquareText,
  Clock,
  BadgeCheck,
} from "lucide-react";
import UserQuizHeader from "@/components/user/quiz/UserQuizHeader";
import Link from "next/link";
import { useEffect, useState } from "react";
import useGet from "@/hooks/useGet";
import { FaQuestion } from "react-icons/fa";
import { Input } from "@/components/ui/input";

import usePost from "@/hooks/usePost";
import { useRouter } from "next/navigation";

// const articles = [
//   {
//     category: "Geriatric",
//     title: "Biomechanics",
//     questions: "25 Questions",
//     time: "20 min",
//   },
//   {
//     category: "Geriatric",
//     title: "Medicine",
//     questions: "25 Questions",
//     time: "20 min",
//   },
// ];

const QuizCard = ({ imageSrc, title, questions, cards, time, id }) => {
  const router = useRouter();

  const handleQuizStart = () => {
    // Navigate directly to quiz with auto-start parameter
    router.push(`/quiz/${id}?autostart=true`);
  };

  return (
    <div 
      className="flex flex-col justify-between bg-white rounded-xl border overflow-hidden p-4 max-w-[350px] relative cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]" 
      onClick={handleQuizStart}
    >
      <div className="h-[180px] w-[100%]">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt="image"
            height={200}
            width={240}
            className="object-cover h-full w-full rounded-2xl"
          />
        ) : (
          <div className="bg-gray-300 h-full w-full rounded animate-pulse"></div>
        )}
      </div>
      <div>
        <div className="flex items-center space-x-2 mt-4"></div>
        <h3 className="text-lg font-semibold mt-4">{title}</h3>
        <p className="text-sm text-gray-600">
          Questions <span className="font-semibold">{questions}</span>
        </p>
        <div className="flex justify-between items-center mt-4 text-gray-500 text-sm">
          <div className="w-full text-center py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-700 transition-all duration-200">
            Start Quiz
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Quizs() {
  const [quizzes, setQuizzes] = useState([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchQuizs = async () => {
    setIsLoading(true);
    const { data, error, status } = await useGet(`/quizzes`);
    if (status === 200) {
      setQuizzes(data || []);
      setFilteredQuizzes(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchQuizs();
  }, []);

  // Filter quizzes based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setIsSearching(false);
      setFilteredQuizzes(quizzes);
    } else {
      setIsSearching(true);
      const filtered = quizzes.filter(quiz => {
        const quizTitle = quiz.title?.toLowerCase() || '';
        const quizDescription = quiz.description?.toLowerCase() || '';
        const search = searchTerm.toLowerCase();
        
        return (
          quizTitle.includes(search) || 
          quizDescription.includes(search)
        );
      });
      setFilteredQuizzes(filtered);
    }
  }, [searchTerm, quizzes]);

  return (
    <div className="mt-4 w-full mx-auto md:max-w-[80%] max-w-[95%]">
      <div className="flex flex-col">
        <h6 className="font-semibold text-3xl">All Quizzes</h6>
        <p className="my-2">Checkout our quizzes, and test your skills.</p>
        <Input 
          className="max-w-96" 
          placeholder="Search by quiz title or description"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="grid xl:grid-cols-3 sm:grid-cols-2 gap-4 mt-4">
          {isLoading ? (
            // Loading skeleton
            Array(6).fill(0).map((_, index) => (
              <div key={index} className="flex flex-col justify-between bg-white rounded-xl border overflow-hidden p-4 max-w-[350px] relative">
                <div className="h-[180px] w-[100%] bg-gray-200 rounded-2xl animate-pulse"></div>
                <div className="mt-4">
                  <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-1/2 bg-gray-200 rounded mt-2 animate-pulse"></div>
                  <div className="h-10 w-full bg-gray-200 rounded mt-4 animate-pulse"></div>
                </div>
              </div>
            ))
          ) : (
            (isSearching ? filteredQuizzes : quizzes)?.map((quiz) => (
              <QuizCard
                key={quiz._id}
                imageSrc={quiz.banner || "/auth-activity.png"}
                title={quiz.title}
                questions={quiz.questions?.length || 0}
                id={quiz._id}
              />
            ))
          )}
        </div>
        
        {!isLoading && isSearching && filteredQuizzes.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No quizzes found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}