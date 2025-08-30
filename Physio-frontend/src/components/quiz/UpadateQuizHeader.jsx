"use client";
import { Button } from "@/components/ui/button.jsx";
import { Select, SelectItem } from "@/components/ui/select";
import { ArrowLeft, Search, Upload } from "lucide-react";
import Link from "next/link";

export default function UpdateQuizHeader({ handleQuizUpdate, loading, id }) {
  return (
    <div className="  w-full mx-auto md:max-w-[80%] max-w-[95%] flex justify-between items-center p-4 rounded-lg">
      <div className="flex items-center gap-2">
        <Link href={`/teacher/quiz`}> <ArrowLeft className="w-5 h-5 text-gray-700 cursor-pointer" /></Link>
        <h2 className="font-semibold  md:text-base text-xs">Update Quiz</h2>
      </div>
      <div className="flex items-center gap-4">
        <Button
          className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg  md:text-base text-xs"
          onClick={(e) => handleQuizUpdate()}
        >
              <Upload /> Update
            
        </Button>
      </div>
    </div>
  );
}
