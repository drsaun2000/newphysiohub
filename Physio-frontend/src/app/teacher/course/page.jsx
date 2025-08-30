"use client";
import { useEffect, useState } from "react";
import Courses from "@/components/course/Courses"
import CreateCourse from "@/components/course/CreateCourse"
import useGet from "@/hooks/useGet"


export default function Course() {
  const [showInCourse, setShowInCourse] = useState("Course")


  return (
    <>
      <div className="flex flex-col md:flex-col sm:flex-col lg:flex-row">
        <div className="w-full">
          <div className="flex flex-col items-center justify-center min-h-[80vh]">
            {showInCourse == "Course"&&<Courses setShowInCourse={setShowInCourse} />}
            {showInCourse == "CreateCourse"&&<CreateCourse setShowInCourse={setShowInCourse}/>}  
          </div>
        </div>
      </div>
    </>
  );
}
