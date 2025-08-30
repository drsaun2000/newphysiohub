"use client";
import { Button } from "../ui/button.jsx";
import {
  Select,
  SelectItem,
} from "../ui/select.jsx";
import { ArrowLeft, Search, Upload } from "lucide-react";



export default function CourseHeader({setShowInCourse}) {
  return (
    <div className=" w-full mx-auto md:max-w-[80%]  flex justify-between items-center p-4 rounded-lg">
      <div className="flex items-center gap-2">
      </div>
      <div className="flex items-center gap-4">
        <button onClick={()=>{setShowInCourse("CreateCourse")}} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg  md:text-base text-xs">
          + Create new
        </button>
      </div>
    </div>
  );
}
