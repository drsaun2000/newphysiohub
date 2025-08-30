"use client";
import { Button } from "@/components/ui/button.jsx";
import {
  Select,
  SelectItem,
} from "@/components/ui/select";
import { ArrowLeft, Search } from "lucide-react";



export default function BlogHeader({setShowInBlog}) {
  return (
    <div className=" w-full mx-auto max-w-[80%] flex justify-between items-center p-4 rounded-lg ">
      <div className="flex items-center gap-2">
        <ArrowLeft className="w-5 h-5 text-gray-700 cursor-pointer" />
        <h2 className="text-lg font-semibold">Blogs</h2>
      </div>
      <div className="flex items-center gap-4">
        <Search className="w-5 h-5 text-gray-500 cursor-pointer" />
        <Select>
          <SelectItem value="">Choose category</SelectItem>
          <SelectItem value="health">Health</SelectItem>
          <SelectItem value="lifestyle">Lifestyle</SelectItem>
          <SelectItem value="business">Business</SelectItem>
        </Select>
        <button onClick={()=>{setShowInBlog("CreateBlog")}}  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg">
          + Create new
        </button>
      </div>
    </div>
  );
}
