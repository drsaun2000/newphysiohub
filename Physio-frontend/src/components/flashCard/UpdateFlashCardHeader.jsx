"use client";
import { Button } from "@/components/ui/button.jsx";
import { ArrowLeft, Search, Upload } from "lucide-react";
import Link from "next/link";



export default function PublishFlashCardHeader({handleUpdateFlashCard}) {
  return (
    <div className=" w-full mx-auto md:max-w-[80%] flex justify-between items-center p-4 rounded-lg">
      <div className="flex items-center gap-2">
        <Link
            href={"/teacher/flashCard"}
        >
        <ArrowLeft className="w-5 h-5 text-gray-700 cursor-pointer" />
        </Link>
        <h2 className=" font-semibold  md:text-base text-xs">Update Flash Card</h2>
      </div>
      <div className="flex items-center gap-4">
        <Button className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg  md:text-base text-xs" onClick={handleUpdateFlashCard}>
          <Upload/> Update
        </Button>
      </div>
    </div>
  );
}
