"use client";
import { Button } from "@/components/ui/button.jsx";
import { ArrowLeft, Search, Upload } from "lucide-react";
import Link from "next/link";



export default function UpdateCourseHeader({handleCourseUpdate, id}) {
  return (
    <div className="  w-full mx-auto max-w-[80%] flex justify-between items-center p-4 rounded-lg">
      <Link href={`/teacher/course`} className="flex items-center gap-2">
        <ArrowLeft className="w-5 h-5 text-gray-700 cursor-pointer" />
        <h2 className="text-lg font-semibold">Update Course</h2>
      </Link>
      <div className="flex items-center gap-4">
        <Link
        href={`/teacher/course/updateLessons/${id}`}
        >
        <Button className=" border bg-transparent border-purple-600 hover:bg-transparent text-purple-600 px-5 py-2 rounded-lg  md:text-base text-xs">
           Update Lessons
        </Button>
        </Link>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg  md:text-base text-xs" onClick={handleCourseUpdate}>
          <Upload/> Update Course
        </Button>
      </div>
    </div>
  );
}
