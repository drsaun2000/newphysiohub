"use client";
import { Button } from "@/components/ui/button.jsx";
import { ArrowLeft, Search, Upload } from "lucide-react";
import Link from "next/link";

export default function UpdateLessonHeader({handleLessonsUpdate, id, formDataLength, loading}) {
  return (
    <div className="w-full mx-auto max-w-[80%] flex justify-between items-center p-4 rounded-lg">
      <div className="flex items-center gap-2 ">
        <Link href={`/teacher/course/update/${id}`}><ArrowLeft className="w-5 h-5 text-gray-700 cursor-pointer" /></Link>
        <h2 className="md:text-base text-xs font-semibold ">Update Lessons</h2>
      </div>
      {formDataLength !== 0 && <div className="flex items-center gap-4">
        <Button 
          className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg md:text-base text-xs" 
          onClick={handleLessonsUpdate}
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Updating...
            </div>
          ) : (
            <>
              <Upload/> Update Lessons
            </>
          )}
        </Button>
      </div>}
    </div>
  );
}
