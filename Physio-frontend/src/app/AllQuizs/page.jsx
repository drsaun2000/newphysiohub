"use client";
import Image from "next/image.js";
import { Button } from "@/components/ui/button.jsx";
import { Trash2, Edit, MessageSquareText, Clock } from "lucide-react";
import UserQuizHeader from "@/components/user/quiz/UserQuizHeader";
import Link from "next/link";
import { useEffect, useState } from "react";
import useGet from "@/hooks/useGet";
import { FaQuestion } from "react-icons/fa";

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

export default function AllQuizs() {
    const [articles, setArticles] = useState([])
  const fetchQuizs = async () => {
    const { data, error, status } = await useGet(`/quizzes`);
    setArticles(data)
  };
  useEffect(() => {
    fetchQuizs();
  }, []);
  return (
    <>
      <UserQuizHeader />
      <div className="p-6 bg-white rounded-lg shadow-md w-full mx-auto max-w-[80%] mt-5 ">
        <div className="mt-4 space-y-6">
          {articles.map((article, index) => (
            <div
              key={index}
              className="border-t pt-4 first:border-t-0 first:pt-0"
            >
              <div className="flex justify-between items-center ">
                <div className="flex items-center gap-5 w-full">
                  <div className="h-[180px] w-[230px]">
                    {article.coverImageUrl ? (
                      <Image
                        src={article.coverImageUrl}
                        alt="image"
                        height={200}
                        width={240}
                        className="object-cover h-full w-full rounded-2xl"
                      />
                    ) : (
                      <div className="bg-gray-300 h-full w-full rounded animate-pulse"></div>
                    )}
                  </div>
                  <div className="w-[44%] text-start">
                    <p className="text-sm text-blue-600 font-medium mb-2">
                      {/* {article?.mainTopic} */}
                    </p>
                    <h3 className="text-lg font-semibold text-gray-900 leading-relaxed">
                      {article.title}
                    </h3>
                    <p className="text-sm text-gray-400 mt-2 flex items-center">
                      Questions
                      &nbsp;{article.questions.length}&nbsp; • &nbsp;
                      <Clock size={14} />
                      &nbsp;{""}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <Link
                    href={`/quiz/${article._id}`}
                    className=" text-nowrap rounded-lg border px-4 py-2 border-purple-600 text-purple-600 hover:bg-purple-600  hover:text-white duration-200"
                  >
                    Join Quiz
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
