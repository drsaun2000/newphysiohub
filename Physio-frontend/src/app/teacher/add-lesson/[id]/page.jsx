"use client";
import React, { useRef, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  PlusCircle,
  Trash2,
  Upload,
} from "lucide-react";
import { Select, SelectItem } from "@/components/ui/select.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Textarea } from "@/components/ui/textArea.jsx";
import { Button } from "@/components/ui/button.jsx";
import PublishLessonHeader from "@/components/course/PublishLessonHeader";
import usePost from "@/hooks/usePost";
import { useRouter } from "next/navigation";
import useImagePost from "@/hooks/useImagePost";
import Image from "next/image";

export default function AddLessons({params}) {
  const { id } = React.use(params); 
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false)
  const [cards, setCards] = useState([
    { id: 1, type: "", title: "", url: "", open: true },
  ]);
  const [type, setType] = useState(""); // default to "true" (Free)
  const [formData, setFormData] = useState({
    lessonTitle: "",
    contents: cards,
  });
  const fileInputRef = useRef(null);
  const router = useRouter()
  const options = [
    {
      label: "Choose Type",
      value: "",
    },
    {
      label: "Video",
      value: "video",
    },
    // {
    //   label: "Image",
    //   value: "image",
    // },
    {
      label: "Article",
      value: "article",
    },
  ];

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleTypeSelect = (e) => {
    setType(e.target.value);
  };

  const addQuestion = () => {
    setCards([
      ...cards,
      { id: cards.length + 1, options: ["Front", "Back"], open: false },
    ]);
  };

  const toggleQuestion = (index) => {
    setCards(cards.map((q, i) => (i === index ? { ...q, open: !q.open } : q)));
  };

  const removeQuestion = (index) => {
    setCards(cards.filter((_, i) => i !== index));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCardChange = (index, field, value) => {
    const updatedCards = [...cards];
    updatedCards[index][field] = value;
    setCards(updatedCards);
    setFormData(prev => ({
      ...prev,
      contents: updatedCards
    }));
  };

  const handleImageUpload = async (e, index) => {
    setLoading(true)
    const file = e.target.files[0];
    const formImageData = new FormData();
    formImageData.append('file', file);
  
    const { data, error, status } = await useImagePost(
      `/quizzes/upload`,
      formImageData
    );
     if (status == 201) {
      setLoading(false)
      handleCardChange(index, "url", data);
    }

  };

  const handleVideoUpload = async (e, index) => {
    setLoading(true)
    const file = e.target.files[0];
    const formImageData = new FormData();
    formImageData.append('file', file);
  
    const { data, error, status } = await useImagePost(
      `/quizzes/upload`,
      formImageData
    );
    
    if (status == 201) {
      setLoading(false)
      handleCardChange(index, "url", data);
    }
  };

  const handleDrop = (event, index, type) => {
    event.preventDefault();
    if(type === "image"){
      handleImageUpload(event, index)
    }
    if(type === "video"){
      handleVideoUpload(event.dataTransfer.files, index);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleLessonsAdd = async () => {
    // Clean up the formData by removing open, id, and options from each card
    const cleanedContents = cards.map(({ open, id, options, ...rest }) => rest);
    
    try {
      for (const lesson of cleanedContents) {
        const lessonData = {
          lessonTitle: formData.lessonTitle,
          contents: [lesson]
        };
        
        const {data, error, status} = await usePost(`/courses/add-to-course/${id}`, lessonData);
        
        if (error) {
          showToast(error[0], "error");
          return;
        }
      }
      
      showToast("All Lessons Added Successfully", "success");
      setTimeout(() => {
        router.push("/teacher/course");
      }, 2000);
    } catch (error) {
      showToast("Error adding lessons", "error");
    }
  };

  return (
    <>
      <PublishLessonHeader handleLessonsAdd={handleLessonsAdd} />
      <div className=" p-6 bg-white rounded-lg shadow-md w-full mx-auto md:max-w-[80%] max-w-[95%]">
        {/*  Title */}
        <div className="mb-4 ">
          <label className="block text-gray-700 font-semibold">
            Lesson Title
          </label>
          <Input
            placeholder="Lesson title"
            className="my-5"
            name="lessonTitle"
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4 space-y-4">
          {cards.map((q, index) => (
            <div key={q.id} className="border p-4 rounded-lg mb-4">
              <div
                className="flex justify-between items-center cursor-pointer bg-gray-100 p-3 rounded-lg"
                onClick={() => toggleQuestion(index)}
              >
                <span className="text-gray-700 font-medium">Lesson {q.id}</span>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeQuestion(index);
                    }}
                  >
                    <Trash2 size={16} className="text-red-500" />
                  </button>
                  {q.open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </div>
              {q.open && (
                <div className="mt-3">
                  <div className="w-full">
                    <div className=" mb-2 first:border-t-0 p-2">
                      <div className="w-full">
                        <label>Title</label>
                        <Input
                          placeholder="Enter Title here"
                          className="my-5 w-full"
                          value={q.title}
                          onChange={(e) =>
                            handleCardChange(index, "title", e.target.value)
                          }
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700 font-semibold">
                          Choose Type
                        </label>
                        <Select
                          className="w-full"
                          value={q.type}
                          onChange={(e) =>
                            handleCardChange(index, "type", e.target.value)
                          }
                        >
                          {options.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </Select>
                      </div>
                      {q.type == "video" && (
                        <div className="mb-4">
                          <label className="block text-gray-700 font-semibold">
                            Video
                          </label>
                          {!cards[index].url ? (
                            <div
                              className="border-dashed border-2 border-gray-300 rounded-lg px-6 py-10 flex flex-col items-center justify-center text-gray-500 "
                              onDrop={(e)=>{handleDrop(e, index, q.type )}}
                              onDragOver={handleDragOver}
                            >
                              {loading? <div className="w-12 h-12 border-4 border-t-purple-600 border-b-transparent border-l-transparent border-r-transparent rounded-full animate-spin"></div>:<label className="ud-btn btn-white text-center cursor-pointer">
                                <div className="icon mb5">
                                  <Upload className="w-6 h-6 mb-2 text-purple-600 justify-self-center " />
                                </div>
                                <h4 className="title fz17 mb1">
                                  Upload/Drag Videos
                                </h4>
                                Browse Files
                                <input
                                  ref={fileInputRef}
                                  id="fileInput"
                                  type="file"
                                  name="images"
                                  accept="video/*"
                                  multiple
                                  className="ud-btn btn-white"
                                  onChange={(e) => {
                                    handleVideoUpload(e, index);
                                  }}
                                  style={{ display: "none" }}
                                  required
                                />
                              </label>}
                            </div>
                          ) : (
                            <div className="w-full max-w-3xl mx-auto aspect-video">
                              <video
                                src={cards[index].url}
                                className="w-full h-full object-cover rounded-lg"
                                alt="cover-image"
                                muted
                                autoPlay
                                controls
                              />
                            </div>
                          )}
                        </div>
                      )}
                      {/* {q.type == "image" && (
                        <div className="mb-4">
                          <label className="block text-gray-700 font-semibold">
                            Image
                          </label>
                          {!formData.contents[index]?.url ? (
                            <div
                              className="border-dashed border-2 border-gray-300 rounded-lg px-6 py-10 flex flex-col items-center justify-center text-gray-500 "
                              onDrop={(e)=>{handleDrop(e, index, q.type)}}
                              onDragOver={handleDragOver}
                            >
                              {loading? <div className="w-12 h-12 border-4 border-t-purple-600 border-b-transparent border-l-transparent border-r-transparent rounded-full animate-spin"></div>:<label className="ud-btn btn-white text-center cursor-pointer">
                                <div className="icon mb5">
                                  <Upload className="w-6 h-6 mb-2 text-purple-600 justify-self-center " />
                                </div>
                                <h4 className="title fz17 mb1">
                                  Upload/Drag photos of Lesson
                                </h4>
                                Browse Files
                                <input
                                  ref={fileInputRef}
                                  id="fileInput"
                                  type="file"
                                  name="images"
                                  multiple
                                  className="ud-btn btn-white"
                                  onChange={(e) => {
                                    handleImageUpload(e, index);
                                  }}
                                  style={{ display: "none" }}
                                  required
                                />
                              </label>}
                            </div>
                          ) : (
                            <div>
                              <Image
                                src={formData.contents[index].url}
                                height={400}
                                width={200}
                                alt="cover-image"
                              />
                            </div>
                          )}
                        </div>
                      )} */}
                    </div>
                  </div>
                  {q.type == "article" && (
                    <>
                      <label>Article Link</label>
                      <Textarea placeholder="Enter Title here" name="url" onChange={(e)=>{handleCardChange(index,"url", e.target.value)}}/>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
          <Button onClick={addQuestion} className="flex items-center gap-2">
            <PlusCircle size={16} /> Add Question
          </Button>
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
