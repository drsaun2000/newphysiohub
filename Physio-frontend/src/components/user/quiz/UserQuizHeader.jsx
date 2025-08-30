"use client";
import { ArrowLeft, Search, Upload } from "lucide-react";



export default function UserQuizHeader() {
  return (
    <div className=" w-full mx-auto max-w-[80%] flex justify-between items-center p-4 rounded-lg">
      <div className="flex items-center gap-2">
        <ArrowLeft className="w-5 h-5 text-gray-700 cursor-pointer" />
        <h2 className="text-lg font-semibold">Quiz</h2>
      </div>
      <div className="flex items-center gap-4">
      </div>
    </div>
  );
}
