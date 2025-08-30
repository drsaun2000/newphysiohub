"use client";
import Image from "next/image.js";
import { Button } from "@/components/ui/button.jsx";
import { Trash2, Edit, MessageSquareText, Clock } from "lucide-react";
import QuizHeader from "@/components/quiz/QuizHeader";

const articles = [
  {
    category: "Geriatric",
    title: "Biomechanics",
    questions: "25 Questions",
    time: "20 min",
  },
  {
    category: "Geriatric",
    title: "Medicine",
    questions: "25 Questions",
    time: "20 min",
  },
];

export default function Quizs() {
  const handleQuizDelete = async (id) => {
    const { data, error, status } = await useDelete(`/courses/delete/${id}`);
    if (status === 200) {
      window.location.reload();
    }
  };
  return (
    <>
      <QuizHeader setShowInQuiz={setShowInQuiz} />
      <div className="p-6 bg-white rounded-lg shadow-md w-full mx-auto max-w-[80%] mt-5">
        <div className="mt-4 space-y-6">
          {articles.map((article, index) => (
            <div
              key={index}
              className="border-t pt-4 first:border-t-0 first:pt-0"
            >
              <div className="flex justify-between items-center ">
                <div className="flex items-center gap-5 w-full">
                  <div className="h-[180px] w-[230px]">
                    <Image
                      src={"/auth-activity.png"}
                      alt="image"
                      height={200}
                      width={240}
                      className="object-cover h-full w-full rounded-2xl"
                    />
                  </div>
                  <div className="w-[44%] text-start">
                    <p className="text-sm text-blue-600 font-medium mb-2">
                      {article.category}
                    </p>
                    <h3 className="text-lg font-semibold text-gray-900 leading-relaxed">
                      {article.title}
                    </h3>
                    <p className="text-sm text-gray-400 mt-2 flex items-center">
                      <MessageSquareText size={14} />
                      &nbsp;{article.questions}&nbsp; • &nbsp;
                      <Clock size={14} />
                      &nbsp;{article.time}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-gray-300 text-gray-600 hover:bg-gray-100"
                    onClick={() => {
                      handleCourseDelete(course._id);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-gray-300 text-gray-600 hover:bg-gray-100"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
