import React from 'react'
import { FileText } from "lucide-react";
import BlogHeader from "./BlogHeader"

function Empty({setShowInBlog}) {
  return (
    <>
         <BlogHeader setShowInBlog={setShowInBlog}/>
      <div className="flex flex-col items-center justify-center gap-4 p-8 rounded-lg min-h-[80vh]">
        <div className="bg-gray-200 p-4 rounded-full">
          <FileText className="w-10 h-10 text-gray-500" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">Your Blog is Empty</h2>
        <p className="text-gray-500 text-sm text-center max-w-sm">
          You haven't posted any articles yet. Start creating content to engage and inform your audience.
        </p>
      </div>
    </>
  )
}

export default Empty