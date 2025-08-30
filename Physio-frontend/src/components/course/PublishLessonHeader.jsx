"use client";
import { Button } from "@/components/ui/button.jsx";
import { ArrowLeft, Search, Upload } from "lucide-react";
import Link from "next/link";



export default function PublishLessonHeader({handleLessonsAdd}) {
  return (
    <div className=" w-full mx-auto md:max-w-[80%] flex justify-between items-center p-3 rounded-lg">
      <div className="flex items-center gap-2 ">
        <Link href={"/teacher/course"} className="flex items-center gap-2 ">
        <ArrowLeft className="w-5 h-5 text-gray-700 cursor-pointer" />
        <h2 className="text-lg font-semibold md:block hidden">Back</h2>
        </Link>
      </div>
      <div className="flex items-center md:gap-4 gap-2">
        {/* <Button className=" border-2 border-purple-600 bg-transparent hover:bg-purple-700 text-purple-600 hover:text-white md:px-4 px-2 py-2 rounded-lg  md:text-base text-xs">
          Save as Draft
        </Button> */}
        <Button className="bg-purple-600 hover:bg-purple-700 text-white md:px-5 px-2 py-2 md:text-base text-xs rounded-lg" onClick={handleLessonsAdd}>
          <Upload/> Add Lessons
        </Button>
      </div>
    </div>
  );
}
