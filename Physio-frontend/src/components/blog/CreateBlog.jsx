import { Input } from "../ui/input.jsx";
import { Textarea } from "../ui/textArea.jsx";
import { Select, SelectItem } from "../ui/select.jsx";
import { Upload } from "lucide-react";
import PublishBlogHeader from "./PublishBlogHeader.jsx"

export default function CreateBlog() {
  return (
    <>
    <PublishBlogHeader/>
        <div className="p-6 mt-5 bg-white rounded-lg shadow-md overscroll-y-auto w-full mx-auto max-w-[80%]">
      <div className="space-y-10">
        {/* Cover Image Upload */}
        <div>
          <label className="block text-gray-700 font-medium">Cover</label>
          <div className="border-dashed border-2 border-gray-300 rounded-lg px-6 py-10 flex flex-col items-center justify-center text-gray-500 cursor-pointer">
            <Upload className="w-6 h-6 mb-2 text-purple-600" />
            <p>Drag or drop image here</p>
            <p className="text-xs">
              Image should be horizontal, at least 1500 x 500 px
            </p>
          </div>
        </div>

        {/* Thumbnail Image Upload */}
        <div>
          <label className="block text-gray-700 font-medium">Thumbnail</label>
          <div className="border-dashed border-2 border-gray-300 rounded-lg px-6 py-10 flex flex-col items-center justify-center text-gray-500 cursor-pointer">
            <Upload className="w-6 h-6 mb-2 text-purple-600" />
            <p>Drag or drop image here</p>
            <p className="text-xs">
              Image should be horizontal, at least 1500 x 1125 px
            </p>
          </div>
        </div>

        {/* Title Input */}
        <div>
          <label className="block text-gray-700 font-medium">Title</label>
          <Input placeholder="Enter title here" />
        </div>

        {/* Category Select */}
        <div>
          <label className="block text-gray-700 font-medium">Category</label>
          <Select className="w-full">
            <SelectItem value="">Choose category</SelectItem>
            <SelectItem value="health">Health</SelectItem>
            <SelectItem value="lifestyle">Lifestyle</SelectItem>
            <SelectItem value="business">Business</SelectItem>
          </Select>
        </div>

        {/* Short Description */}
        <div>
          <label className="block text-gray-700 font-medium">
            Short Description
          </label>
          <Textarea placeholder="Enter short description here" />
        </div>

        {/* Content */}
        <div>
          <label className="block text-gray-700 font-medium">Content</label>
          <Textarea placeholder="Write your content here..." className="h-40" />
        </div>
      </div>
    </div>
    </>
  );
}
