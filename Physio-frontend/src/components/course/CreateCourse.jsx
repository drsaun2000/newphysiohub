"use client";
import { useEffect, useRef, useState } from "react";
import {
  Upload,
} from "lucide-react";
import { Input } from "@/components/ui/input.jsx";
import PublishCourseHeader from "@/components/course/PublishCourseHeader";
import useImagePost from "@/hooks/useImagePost"
import usePost from "@/hooks/usePost"
import Image from "next/image";

export default function CreateCourse({setShowInCourse}) {
  const [notification, setNotification] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categories: "",
    prerequisites: "",
    isFree: true, // note: values from select are always strings
    price: "",
    estimatedDuration: "",
    coverImageUrl :null
  });
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef(null);

    
  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    // Check if the field is 'categories' or 'prerequisites'
    if (name === "categories" || name === "prerequisites") {
      setFormData((prev) => ({
        ...prev,
        [name]: value.split(",").map((item) => item.trim()),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  
  

  const handleUpload = async (e) => {
    setLoading(true)
    const file = e.target.files[0];
  const formData = new FormData();
  formData.append('file', file);

    const {data, error, status} = await useImagePost(`/quizzes/upload`, formData)
    if(data){
      setFormData((prev)=>({...prev, coverImageUrl : data}))
      setLoading(false)
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    handleUpload(event.dataTransfer.files);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleCoursePublish = async () => {
    const {data, error, status} = await usePost(`/courses/create`, formData)
    if(status == 201){
      showToast("Course Created Successfully", "success")
      setTimeout(() => {
        setShowInCourse("Course")
      }, 2000);
    }
    if(error){
      showToast(error[0], "error")
    }
  };

  return (
    <>
      <PublishCourseHeader handleCoursePublish={handleCoursePublish} setShowInCourse={setShowInCourse}/>
      <div className=" p-6 bg-white rounded-lg shadow-md w-full mx-auto md:max-w-[80%] max-w-[95%]">
        {/*  Title */}
        <div className="mb-4 ">
          <label className="block text-gray-700 font-semibold">Title</label>
          <Input
            placeholder="Write question here"
            className="my-5"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        {/* Thumbnail  */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold">
            Description <span className="text-sm text-gray-400 font-normal">(max 150 words)</span>
          </label>
          <Input
            placeholder="Write description here"
            className="my-5"
            name="description"
            onChange={handleChange}
            value={formData.description}
            maxLength={150}
          />
        </div>

        {/* Instructor  */}
        {/* <div className="mb-4">
          <label className="block text-gray-700 font-semibold">
            Instructor Name
          </label>
          <Input
            placeholder="Write instructor name here"
            className="my-5"
            name="instructor"
            onChange={handleChange}
            value={formData.instructor}
          />
        </div> */}

        {/* Categories  */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold">
            Categories
          </label>
          <p className="text-sm text-gray-400 ">
            Type Categories Saperated by coma " , "
          </p>
          <Input
            placeholder="e.g. Orthopedic, Neurological, Pediatric "
            className="my-5"
            name="categories"
            onChange={handleChange}
            value={formData.categories}
          />
        </div>

        {/* Prerequisites  */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold">
            Prerequisites
          </label>
          <p className="text-sm text-gray-400 ">
            Type Prerequisites Saperated by coma " , "
          </p>
          <Input
            placeholder="e.g. Basic Human Anatomy, Prior Clinical."
            className="my-5"
            name="prerequisites"
            onChange={handleChange}
            value={formData.prerequisites}
          />
        </div>

        {/* Cover Image  */}
        <div className="mb-4 flex gap-2 items-start">
          {/* <div>
            <label className="block text-gray-700 font-semibold">Course</label>
            <select
              name="isFree"
              id=""
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
              onChange={handleChange}
              value={formData.isFree}
            >
              <option value={true}>Free</option>
              <option value={false}>Paid</option>
            </select>
          </div> */}
          {!formData.isFree && (
            <div className="mb-4 ">
              <Input
                placeholder="Price"
                className="my-5"
                name="price"
                onChange={handleChange}
                value={formData.price}
              />
            </div>
          )}
        </div>

        {/* Duration  */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold">
            Estimated Duration (in Minutes)
          </label>
          <Input
            type="number"
            placeholder="Write Estimated Duration"
            className="my-5"
            name="estimatedDuration"
            onChange={handleChange}
            value={formData.estimatedDuration}
          />
        </div>

        {/* Thumbnail Upload */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold">
            Cover Image
          </label>
          {!formData.coverImageUrl?<div
            className="border-dashed border-2 border-gray-300 rounded-lg px-6 py-10 flex flex-col items-center justify-center text-gray-500 "
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {loading? <div className="w-12 h-12 border-4 border-t-purple-600 border-b-transparent border-l-transparent border-r-transparent rounded-full animate-spin"></div>:<label className="ud-btn btn-white text-center cursor-pointer">
            <div className="icon mb5">
              <Upload className="w-6 h-6 mb-2 text-purple-600 justify-self-center " />
            </div>
            <h4 className="title fz17 mb1">
              Upload/Drag photos of your property
            </h4>
            <p className="text fz-10 mb10">
              Photos must be JPEG or PNG format and at least 2048x768
            </p>
            
              Browse Files
              <input
                ref={fileInputRef}
                id="fileInput"
                type="file"
                name="images"
                multiple
                className="ud-btn btn-white"
                onChange={handleUpload}
                style={{ display: "none" }}
                required
              />
            </label>}
          </div> : <div>
            <Image src={formData.coverImageUrl} height={400} width={200} alt="cover-image"/>
            </div>}
          
        </div>


        {/* Quiz and Card Topic Selection */}
        {/* <div className="mb-4">
          <label className="block text-gray-700 font-semibold">
            Card Topic
          </label>
          <Select className="w-full">
            <option>Choose category</option>
          </Select>
        </div> */}
        {notification && (
          <div
            className={`fixed bottom-4 right-4 p-4 rounded-md shadow-lg ${
              notification.type === "error" ? "bg-red-500" : "bg-green-500"
            } text-white`}
          >
            {notification.message}
            <button onClick={() => setNotification(null)} className="ml-4 text-xl">
              ×
            </button>
          </div>
        )}
      </div>
    </>
  );
}
