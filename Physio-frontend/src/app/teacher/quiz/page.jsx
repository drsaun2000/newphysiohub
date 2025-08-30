"use client";
import { useState } from "react";
// import Empty from "@/components/blogs/empty.jsx";
import Quizs from "@/components/quiz/Quizs";
import CreateQuiz from "@/components/quiz/CreateQuiz";


export default function Quiz() {
  const [showInQuiz, setShowInQuiz] = useState("Quizs")
  return (
    <>
      <div className="flex flex-col md:flex-col sm:flex-col lg:flex-row">
        <div className="w-full">
          <div className="flex flex-col items-center justify-center min-h-[80vh]">
            {showInQuiz == "Quizs"&&<Quizs setShowInQuiz={setShowInQuiz}/>}
            {showInQuiz== "CreateQuiz"&&<CreateQuiz setShowInQuiz={setShowInQuiz}/>}
          </div>
        </div>
      </div>
    </>
  );
}
