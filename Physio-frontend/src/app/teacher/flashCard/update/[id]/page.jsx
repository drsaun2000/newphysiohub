"use client";
import React, { useEffect, useRef, useState } from "react";
import {  Upload, X } from "lucide-react";
import { Select } from "@/components/ui/select.jsx";
import { Input } from "@/components/ui/input.jsx";
import UpdateFlashCardHeader from "@/components/flashCard/UpdateFlashCardHeader"
import useImagePost from "@/hooks/useImagePost";
import useGet from "@/hooks/useGet";
import { useRouter } from "next/navigation";
import usePatch from "@/hooks/usePatch"
import Image from "next/image";
export default function UpdateFlashCard({params}) {
  const router = useRouter()
  const {id} = React.use(params)
  const [notification, setNotification] = useState(null);
  const [data, setData] = useState({})
  const fileInputRef = useRef(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [frontCardImageLoading, setFrontCardImageLoading] = useState(false);
  const [backCardImageLoading, setBackCardImageLoading] = useState(false);
  const [topics, setTopics] = useState([]);
  const [flashcard, setFlashcard] = useState({
    title : "",
    description : "",
    hint: "",
    imageUrl: "",
    masteryLevel: 0,
    subject: "",
    confidenceLevel: "",
    frontContent: "",
    frontImage: "",
    backContent: "",
    backImage: "",
    topic: "",
  });

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const fetch = async() =>{
    const {data, status} = await useGet(`/flashcards/getFlashcardById/${id}`)
    if(status == 200){
      setData(data)
    }
  }
  
  const fetchTopics = async () => {
    const { data, error, status } = await useGet(`/main-topics/`);
    if (status === 200) {
      setTopics(data);
    }
  };
  useEffect(()=>{
    fetch()
    fetchTopics()
  },[])


  
useEffect(() => {
    setFlashcard(()=>({
      title : data.title || "",
      description : data.description || "",
      hint: data.hint || "",
      imageUrl: data.imageUrl || "",
      masteryLevel: data.masteryLevel || 0,
      subject: data.subject || "",
      confidenceLevel: data.confidenceLevel || "",
      frontImage : data.frontImage || "",
      frontContent : data.frontContent || "",
      backImage : data.backImage || "",
      backContent : data.backContent || "",
      topic : data.topic?._id || ""
    })); 
}, [data]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name == "masteryLevel") {
      setFlashcard((prev) => ({
        ...prev,
        [name]: Number(value),
      }));
      return;
    }
    setFlashcard((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpload = async (eOrFiles, name) => {
    if (name === "imageUrl") {
      setImageLoading(true);
    }
    if (name === "frontImage") {
      setFrontCardImageLoading(true);
    }
    if (name === "backImage") {
      setBackCardImageLoading(true);
    }
    // Support both input events and FileList directly
    const file = eOrFiles.target?.files?.[0] || eOrFiles[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    const { data, error, status } = await useImagePost(
      `/quizzes/upload`,
      formData
    );

    if (data) {
      setFlashcard((prev) => ({ ...prev, [name]: data }));
    }

    setImageLoading(false);
    setFrontCardImageLoading(false);
    setBackCardImageLoading(false);
  };

  const handleDrop = (event, name) => {
    event.preventDefault();
    if (event.dataTransfer && event.dataTransfer.files) {
      handleUpload(event.dataTransfer.files, name);
    } else {
      console.warn("No files found in drop event");
    }
  };

  const handleRemoveImage = (name) => {
    setFlashcard((prev) => ({
      ...prev,
      [name]: "",
    }));
  };


  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleUpdateFlashCard = async () => {
    const { data, error, status } = await usePatch(`/flashcards/updateFlashcardById/${id}`, {
      ...flashcard,
    });
    if (status == 200) {
      showToast("Flashcard Updated Successfully", "success")
      setTimeout(() => {
        router.push(`/teacher/flashCard`)
      }, 2000);
    }
    
    if (error) {
      showToast(error[0], "error")
    }
  };

  return (
    <>
      <UpdateFlashCardHeader handleUpdateFlashCard={handleUpdateFlashCard} />
      <div className=" p-6 bg-white rounded-lg shadow-md w-full mx-auto md:max-w-[80%] max-w-[95%]">
        {/* Cover Image Upload */}
        <div className="mb-4 ">
          <label className="block font-semibold text-gray-700">Title</label>
          <Input
            placeholder="Write question here"
            className="my-2"
            name="title"
            value={flashcard.title}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4 ">
          <label className="block font-semibold text-gray-700">Description</label>
          <Input
            placeholder="Write question here"
            className="my-2"
            name="description"
            value={flashcard.description}
            onChange={handleChange}
          />
        </div>
        <div className="grid md:grid-cols-2 gap-2">
          <div className="mb-4 ">
            <label className="block font-semibold text-gray-700">Hint</label>
            <Input
              placeholder="Write Hint here"
              className="my-2"
              name="hint"
              value={flashcard.hint}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4 ">
            <label className="block font-semibold text-gray-700">Subject</label>
            <Input
              placeholder="Write Subject here"
              className="my-2"
              name="subject"
              value={flashcard.subject}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="mb-4 ">
          <label className="block font-semibold text-gray-700">Mastery Level</label>
          <Input
            placeholder="Write Mastery Level here"
            className="my-2"
            type={"number"}
            name="masteryLevel"
            value={flashcard.masteryLevel}
            onChange={handleChange}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-2">
          <div className="mb-4">
            <label className="block font-semibold text-gray-700">Confidence Level</label>
            <Select
              name="confidenceLevel"
              value={flashcard.confidenceLevel}
              onChange={handleChange}
              className="w-full"
            >
              <option value="">Choose Level</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Select>
          </div>

          <div className="mb-4">
            <label className="block font-semibold text-gray-700">Topic</label>
            <Select
              name="topic"
              value={flashcard.topic}
              onChange={handleChange}
              className="w-full"
            >
              <option value="">Choose Topic</option>
              {topics.map((topic, index) => (
                <option key={index} value={topic._id} selected={topic._id === data.topic?._id}>
                  {topic.name}
                </option>
              ))}
            </Select>
          </div>
        </div>
        {/* Thumbnail Upload */}
        <div className="mb-4">
          <label className="block font-semibold text-gray-700">Image</label>
          {!flashcard.imageUrl ? (
            <div
              className="border-dashed border-2 border-gray-300 rounded-lg px-6 py-10 flex flex-col items-center justify-center text-gray-500 "
              onDrop={(e) => {
                handleDrop(e, "imageUrl");
              }}
              onDragOver={(e) => {
                handleDragOver(e, "imageUrl");
              }}
            >
              {imageLoading ? (
                <div className="w-12 h-12 border-4 border-t-purple-600 border-b-transparent border-l-transparent border-r-transparent rounded-full animate-spin"></div>
              ) : (
                <label className="ud-btn btn-white text-center cursor-pointer">
                  <div className="icon mb5">
                    <Upload className="w-6 h-6 mb-2 text-purple-600 justify-self-center " />
                  </div>
                  <h4 className="title fz17 mb1">
                    Upload/Drag photos of your FlashCard
                  </h4>
                  <p className="text fz-10 mb10">
                    Photos must be JPEG or PNG format and at least 2048x768
                  </p>
                  Browse Files
                  <input
                    ref={fileInputRef}
                    id="fileInput"
                    type="file"
                    name="imageUrl"
                    multiple
                    className="ud-btn btn-white"
                    onChange={(e) => {
                      handleUpload(e, "imageUrl");
                    }}
                    style={{ display: "none" }}
                    required
                  />
                </label>
              )}
            </div>
          ) : (
            <div>
              <button
                className="justify-self-end cursor-pointer"
                onClick={() => {
                  handleRemoveImage("imageUrl");
                }}
              >
                <X />
              </button>
              <div className="md:w-[150px] w-[100px] md:h-[150px] h-[100px]">
                <Image
                  src={flashcard.imageUrl}
                  height={200}
                  width={200}
                  alt="cover-image"
                  className="w-full h-full"
                />
              </div>
            </div>
          )}
        </div>

        <div className="border p-4 mb-4 rounded shadow-sm">
          {/* Front */}
          <div className="flex md:flex-row flex-col md:gap-3 items-center">
            <div className="md:mb-4 mb-2">
              {!flashcard.frontImage ? (
                <div
                  className="border-dashed border-2 border-gray-300 rounded-lg px-6 py-10 flex flex-col items-center justify-center text-gray-500 h-10 w-[100px]"
                  onDrop={(e) => {
                    handleDrop(e, "frontImage");
                  }}
                  onDragOver={(e) => {
                    handleDragOver(e, "frontImage");
                  }}
                >
                  {frontCardImageLoading ? (
                    <div className="w-3 h-3 border-2 p-2 border-t-purple-600 border-b-transparent border-l-transparent border-r-transparent rounded-full animate-spin"></div>
                  ) : (
                    <label className=" text-center cursor-pointer">
                      <div className="icon mb5">
                        <Upload className="w-4 h-4 text-purple-600 justify-self-center" />
                      </div>
                      <h4 className="title fz17 mb1">Front</h4>
                      <input
                        ref={fileInputRef}
                        id="fileInput"
                        type="file"
                        name="frontImage"
                        multiple
                        className=""
                        onChange={(e) => {
                          handleUpload(e, "frontImage");
                        }}
                        style={{ display: "none" }}
                        required
                      />
                    </label>
                  )}
                </div>
              ) : (
                <div>
                  <button
                    className="justify-self-end cursor-pointer"
                    onClick={() => {
                      handleRemoveImage("frontImage");
                    }}
                  >
                    <X />
                  </button>
                  <Image
                    src={flashcard.frontImage}
                    height={100}
                    width={100}
                    alt="cover-image"
                  />
                </div>
              )}
            </div>
            <div className="mb-3 w-full">
              <label className="block font-semibold text-gray-700">Front</label>
              <Input
                placeholder="Front Content"
                name="frontContent"
                value={flashcard.frontContent}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Back */}
          <div className="flex md:flex-row flex-col md:gap-3 items-center">
            <div className="md:mb-4 mb-2">
              {!flashcard.backImage ? (
                <div
                  className="border-dashed border-2 border-gray-300 rounded-lg px-6 py-10 flex flex-col items-center justify-center text-gray-500 h-10 w-[100px]"
                  onDrop={(e) => {
                    handleDrop(e, "backImage");
                  }}
                  onDragOver={(e) => {
                    handleDragOver(e, "backImage");
                  }}
                >
                  {backCardImageLoading ? (
                    <div className="w-3 h-3 border-2 p-2 border-t-purple-600 border-b-transparent border-l-transparent border-r-transparent rounded-full animate-spin"></div>
                  ) : (
                    <label className=" text-center cursor-pointer">
                      <div className="icon mb5">
                        <Upload className="w-4 h-4 text-purple-600 justify-self-center" />
                      </div>
                      <h4 className="title fz17 mb1">Back</h4>
                      <input
                        ref={fileInputRef}
                        id="fileInput"
                        type="file"
                        name="backImage"
                        multiple
                        className=""
                        onChange={(e) => {
                          handleUpload(e, "backImage");
                        }}
                        style={{ display: "none" }}
                        required
                      />
                    </label>
                  )}
                </div>
              ) : (
                <div>
                  <button
                    className="justify-self-end cursor-pointer"
                    onClick={() => {
                      handleRemoveImage("backImage");
                    }}
                  >
                    <X />
                  </button>
                  <Image
                    src={flashcard.backImage}
                    height={100}
                    width={100}
                    alt="cover-image"
                  />
                </div>
              )}
            </div>
            <div className="mb-3 w-full">
              <label className="block font-semibold text-gray-700">Back</label>
              <Input
                placeholder="Back Content"
                name="backContent"
                value={flashcard.backContent}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
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
