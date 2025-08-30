"use client";
import { Button } from "@/components/ui/button.jsx";
import { ArrowLeft, Search, Upload } from "lucide-react";



export default function PublishCourseHeader({handleCoursePublish, setShowInCourse}) {
  return (
    <div className="  w-full mx-auto md:max-w-[80%] flex justify-between items-center p-4 rounded-lg">
      <div className="flex items-center gap-2" onClick={()=>{setShowInCourse("Course")}}>
        <ArrowLeft className="w-5 h-5 text-gray-700 cursor-pointer" />
        <h2 className="text-lg font-semibold md:block hidden">Back</h2>
      </div>
      <div className="flex items-center md:gap-4 gap-2">
        {/* <Button className=" border-2 border-purple-600 bg-transparent hover:bg-purple-700 text-purple-600 hover:text-white px-4 py-2 rounded-lg  md:text-base text-xs">
          Save as Draft
        </Button> */}
        <Button className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg  md:text-base text-xs" onClick={handleCoursePublish}>
          <Upload/> Publish
        </Button>
      </div>
    </div>
  );
}
