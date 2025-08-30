"use client"
import Image from "next/image.js";
import { Button } from "../ui/button.jsx";
import { Trash2, Edit, Sparkles } from "lucide-react";
import BlogHeader from "./BlogHeader.jsx"

const articles = [
  {
    category: "Geriatric",
    title: "Unlocking the Secrets of Movement: Advanced Techniques for Enhancing Physiotherapy Outcomes",
    author: "Sandy Gustiman",
    date: "July 23, 2024",
  },
  {
    category: "Wellness and Lifestyle",
    title: "Unlocking the Secrets of Movement: Advanced Techniques for Enhancing Physiotherapy Outcomes",
    author: "Albert Flores",
    date: "July 23, 2024",
  },
  {
    category: "Professional Tips",
    title: "Unlocking the Secrets of Movement: Advanced Techniques for Enhancing Physiotherapy Outcomes",
    author: "Dianne Russell",
    date: "July 23, 2024",
  },
];

export default function Blogs({setShowInBlog}) {
  return (
    <>
    <BlogHeader setShowInBlog={setShowInBlog}/>
        <div className="p-6 bg-white rounded-lg shadow-md w-full mx-auto max-w-[80%] mt-5">
      <div className="flex items-center gap-2 text-gray-800 font-semibold">
        <Sparkles className="w-5 h-5 text-blue-500" />
        Featured Articles
      </div>
      <div className="mt-4 space-y-6">
        {articles.map((article, index) => (
          <div key={index} className="border-t pt-4 first:border-t-0 first:pt-0">
            <div className="flex justify-between items-center">
            <div className=" w-[44%]">
            <p className="text-sm text-blue-600 font-medium mb-2">{article.category}</p>
            <h3 className="text-md font-semibold text-gray-900 leading-relaxed">
              {article.title}
            </h3>
            <p className="text-sm text-gray-400 mt-2 ms-2">{article.author} • {article.date}</p>

            </div>
            <div className="flex gap-2 mt-2">
              <Button variant="outline" size="icon" className="border-gray-300 text-gray-600 hover:bg-gray-100">
                <Trash2 className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="border-gray-300 text-gray-600 hover:bg-gray-100">
                <Edit className="w-4 h-4" />
              </Button>
            </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}
