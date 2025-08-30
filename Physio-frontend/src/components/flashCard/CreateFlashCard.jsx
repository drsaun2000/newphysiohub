"use client";
import { useEffect, useRef, useState } from "react";
import { Upload, X, Plus } from "lucide-react";
import { Select } from "@/components/ui/select.jsx";
import { Input } from "@/components/ui/input.jsx";
import PublishFlashCardHeader from "@/components/flashCard/PublishFlashCardHeader";
import usePost from "@/hooks/usePost";
import useImagePost from "@/hooks/useImagePost";
import { FaTimesCircle } from "react-icons/fa";
import Image from "next/image";
import useGet from "@/hooks/useGet";
import { Button } from "@/components/ui/button";

export default function CreateFlashCard({ setShowInFlashCard }) {
  const fileInputRef = useRef(null);
  const [notification, setNotification] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [frontCardImageLoading, setFrontCardImageLoading] = useState(false);
  const [backCardImageLoading, setBackCardImageLoading] = useState(false);
  const [imageUrlLoading, setImageUrlLoading] = useState(false);
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [flashcards, setFlashcards] = useState([{
    title: "",
    description: "",
    hint: "",
    masteryLevel: 0,
    subject: "",
    confidenceLevel: "",
    frontContent: "",
    frontImage: "",
    backContent: "",
    backImage: "",
    imageUrl: "",
  }]);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const fetchTopics = async () => {
    const { data, error, status } = await useGet(`/main-topics/`);
    if (status === 200) {
      setTopics(data);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const updatedFlashcards = [...flashcards];
    if (name === "masteryLevel") {
      updatedFlashcards[index] = {
        ...updatedFlashcards[index],
        [name]: Number(value),
      };
    } else {
      updatedFlashcards[index] = {
        ...updatedFlashcards[index],
        [name]: value,
      };
    }
    setFlashcards(updatedFlashcards);
  };

  const handleUpload = async (eOrFiles, name, index) => {
    if (name === "frontImage") setFrontCardImageLoading(true);
    if (name === "backImage") setBackCardImageLoading(true);
    if (name === "imageUrl") setImageUrlLoading(true);

    const file = eOrFiles.target?.files?.[0] || eOrFiles[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    const { data, error, status } = await useImagePost(
      `/quizzes/upload`,
      formData
    );

    if (data) {
      const updatedFlashcards = [...flashcards];
      updatedFlashcards[index] = {
        ...updatedFlashcards[index],
        [name]: data,
      };
      setFlashcards(updatedFlashcards);
    }

    setFrontCardImageLoading(false);
    setBackCardImageLoading(false);
    setImageUrlLoading(false);
  };

  const handleDrop = (event, name, index) => {
    event.preventDefault();
    if (event.dataTransfer?.files) {
      handleUpload(event.dataTransfer.files, name, index);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleRemoveImage = (name, index) => {
    const updatedFlashcards = [...flashcards];
    updatedFlashcards[index] = {
      ...updatedFlashcards[index],
      [name]: "",
    };
    setFlashcards(updatedFlashcards);
  };

  const addNewFlashcard = () => {
    setFlashcards([...flashcards, {
      title: "",
      description: "",
      hint: "",
      masteryLevel: 0,
      subject: "",
      confidenceLevel: "",
      frontContent: "",
      frontImage: "",
      backContent: "",
      backImage: "",
      imageUrl: "",
    }]);
  };

  const removeFlashcard = (index) => {
    const updatedFlashcards = flashcards.filter((_, i) => i !== index);
    setFlashcards(updatedFlashcards);
  };

  const handleCreateFlashCards = async () => {
    if (!selectedTopic) {
      showToast("Please select a topic", "error");
      return;
    }

    const validFlashcards = flashcards.filter(fc => 
      fc.frontContent.trim() && fc.backContent.trim()
    );

    if (validFlashcards.length === 0) {
      showToast("Please add at least one valid flashcard with front and back content", "error");
      return;
    }

    try {
      setIsCreating(true);
      console.log(validFlashcards)
      for (let i = 0; i < validFlashcards.length; i++) {
        
        const flashcard = validFlashcards[i];
        const { data, error, status } = await usePost(`/flashcards/create`, {
          ...flashcard,
          topic: selectedTopic,
        });

        if (status === 201) {
          showToast(`Created flashcard ${i + 1} of ${validFlashcards.length}`, "success");
        } else if (error) {
          showToast(`Error creating flashcard ${i + 1}: ${error[0]}`, "error");
          break;
        }
      }
      
      setTimeout(() => {
        setShowInFlashCard("FlashCards");
      }, 2000);
    } catch (error) {
      showToast("An error occurred while creating flashcards", "error");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      <PublishFlashCardHeader 
        handleCreateFlashCard={handleCreateFlashCards} 
        setShowInFlashCard={setShowInFlashCard}
        isCreating={isCreating}
      />
      <div className="p-6 bg-white rounded-lg shadow-md w-full mx-auto md:max-w-[80%] max-w-[95%]">
        <div className="mb-6">
          <label className="block font-semibold text-gray-700 mb-4">Select Topic</label>
          {selectedTopic ? (
            <div className="flex items-center gap-4">
              <div className="p-4 border border-purple-600 bg-purple-50 rounded-lg flex-1">
                <h3 className="font-medium text-gray-900 md:text-base text-xs">
                  {topics.find(t => t._id === selectedTopic)?.name}
                </h3>
              </div>
              <Button
                variant="outline"
                onClick={() => setSelectedTopic("")}
                className="flex items-center gap-2 md:text-base text-xs"
              >
                <X size={16} />
                Change Topic
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {topics.map((topic) => (
                <div
                  key={topic._id}
                  onClick={() => setSelectedTopic(topic._id)}
                  className="p-4 border border-gray-200 rounded-lg cursor-pointer transition-all duration-200 hover:border-purple-400"
                >
                  <h3 className="font-medium text-gray-900 md:text-base text-xs">{topic.name}</h3>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedTopic ? (
          <>
            {flashcards.map((flashcard, index) => (
              <div key={index} className="border p-6 rounded-lg mb-6 relative">
                <button
                  onClick={() => removeFlashcard(index)}
                  className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                >
                  <X size={20} />
                </button>
                <h3 className="md:text-lg text-base font-semibold mb-4">Flashcard {index + 1}</h3>
                
                <div className="mb-4">
                  <label className="block font-semibold text-gray-700">Title</label>
                  <Input
                    placeholder="Write question here"
                    className="my-2"
                    name="title"
                    value={flashcard.title}
                    onChange={(e) => handleChange(e, index)}
                  />
                </div>
                <div className="mb-4">
                  <label className="block font-semibold text-gray-700">Description</label>
                  <Input
                    placeholder="Write question here"
                    className="my-2"
                    name="description"
                    value={flashcard.description}
                    onChange={(e) => handleChange(e, index)}
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-2">
                  <div className="mb-4">
                    <label className="block font-semibold text-gray-700">Hint</label>
                    <Input
                      placeholder="Write Hint here"
                      className="my-2"
                      name="hint"
                      value={flashcard.hint}
                      onChange={(e) => handleChange(e, index)}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block font-semibold text-gray-700">Subject</label>
                    <Input
                      placeholder="Write Subject here"
                      className="my-2"
                      name="subject"
                      value={flashcard.subject}
                      onChange={(e) => handleChange(e, index)}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-2">
                  <div className="mb-4">
                    <label className="block font-semibold text-gray-700">Confidence Level</label>
                    <Select
                      name="confidenceLevel"
                      value={flashcard.confidenceLevel}
                      onChange={(e) => handleChange(e, index)}
                      className="w-full"
                    >
                      <option value="">Choose Level</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </Select>
                  </div>
                  <div className="mb-4">
                    <label className="block font-semibold text-gray-700">Mastery Level</label>
                    <Input
                      placeholder="Write Mastery Level here"
                      className="mt-0.5"
                      type={"number"}
                      max={3}
                      min={1}
                      name="masteryLevel"
                      value={flashcard.masteryLevel}
                      onChange={(e) => handleChange(e, index)}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block font-semibold text-gray-700">Main Image</label>
                  <div className="flex items-center gap-4">
                    {!flashcard.imageUrl ? (
                      <div
                        className="border-dashed border-2 border-gray-300 rounded-lg px-6 py-10 flex flex-col items-center justify-center text-gray-500 h-10 w-[100px]"
                        onDrop={(e) => handleDrop(e, "imageUrl", index)}
                        onDragOver={handleDragOver}
                      >
                        {imageUrlLoading ? (
                          <div className="w-3 h-3 border-2 p-2 border-t-purple-600 border-b-transparent border-l-transparent border-r-transparent rounded-full animate-spin"></div>
                        ) : (
                          <label className="text-center cursor-pointer">
                            <div className="icon mb5">
                              <Upload className="w-4 h-4 text-purple-600 justify-self-center" />
                            </div>
                            <h4 className="title fz17 mb1">Upload Image</h4>
                            <input
                              type="file"
                              name="imageUrl"
                              multiple
                              className=""
                              onChange={(e) => handleUpload(e, "imageUrl", index)}
                              style={{ display: "none" }}
                            />
                          </label>
                        )}
                      </div>
                    ) : (
                      <div>
                        <button
                          className="justify-self-end cursor-pointer"
                          onClick={() => handleRemoveImage("imageUrl", index)}
                        >
                          <X />
                        </button>
                        <Image
                          src={flashcard.imageUrl}
                          height={200}
                          width={200}
                          alt="main-image"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="border p-4 mb-4 rounded shadow-sm">
                  {/* Front */}
                  <div className="flex md:flex-row flex-col md:gap-3 items-center">
                    <div className="md:mb-4 mb-2">
                      {!flashcard.frontImage ? (
                        <div
                          className="border-dashed border-2 border-gray-300 rounded-lg px-6 py-10 flex flex-col items-center justify-center text-gray-500 h-10 w-[100px]"
                          onDrop={(e) => handleDrop(e, "frontImage", index)}
                          onDragOver={handleDragOver}
                        >
                          {frontCardImageLoading ? (
                            <div className="w-3 h-3 border-2 p-2 border-t-purple-600 border-b-transparent border-l-transparent border-r-transparent rounded-full animate-spin"></div>
                          ) : (
                            <label className="text-center cursor-pointer">
                              <div className="icon mb5">
                                <Upload className="w-4 h-4 text-purple-600 justify-self-center" />
                              </div>
                              <h4 className="title fz17 mb1">Front (Optional)</h4>
                              <input
                                type="file"
                                name="frontImage"
                                multiple
                                className=""
                                onChange={(e) => handleUpload(e, "frontImage", index)}
                                style={{ display: "none" }}
                              />
                            </label>
                          )}
                        </div>
                      ) : (
                        <div>
                          <button
                            className="justify-self-end cursor-pointer"
                            onClick={() => handleRemoveImage("frontImage", index)}
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
                      <label className="block font-semibold text-gray-700">
                        Front/Term <span className="text-red-500">*</span>
                      </label>
                      <Input
                        placeholder="Front Content (Required)"
                        name="frontContent"
                        value={flashcard.frontContent}
                        onChange={(e) => handleChange(e, index)}
                        required
                        className={!flashcard.frontContent.trim() ? "border-red-300" : ""}
                      />
                    </div>
                  </div>

                  {/* Back */}
                  <div className="flex md:flex-row flex-col md:gap-3 items-center">
                    <div className="md:mb-4 mb-2">
                      {!flashcard.backImage ? (
                        <div
                          className="border-dashed border-2 border-gray-300 rounded-lg px-6 py-10 flex flex-col items-center justify-center text-gray-500 h-10 w-[100px]"
                          onDrop={(e) => handleDrop(e, "backImage", index)}
                          onDragOver={handleDragOver}
                        >
                          {backCardImageLoading ? (
                            <div className="w-3 h-3 border-2 p-2 border-t-purple-600 border-b-transparent border-l-transparent border-r-transparent rounded-full animate-spin"></div>
                          ) : (
                            <label className="text-center cursor-pointer">
                              <div className="icon mb5">
                                <Upload className="w-4 h-4 text-purple-600 justify-self-center" />
                              </div>
                              <h4 className="title fz17 mb1">Back (Optional)</h4>
                              <input
                                type="file"
                                name="backImage"
                                multiple
                                className=""
                                onChange={(e) => handleUpload(e, "backImage", index)}
                                style={{ display: "none" }}
                              />
                            </label>
                          )}
                        </div>
                      ) : (
                        <div>
                          <button
                            className="justify-self-end cursor-pointer"
                            onClick={() => handleRemoveImage("backImage", index)}
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
                      <label className="block font-semibold text-gray-700">
                        Back/Description <span className="text-red-500">*</span>
                      </label>
                      <Input
                        placeholder="Back Content (Required)"
                        name="backContent"
                        value={flashcard.backContent}
                        onChange={(e) => handleChange(e, index)}
                        required
                        className={!flashcard.backContent.trim() ? "border-red-300" : ""}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-center mb-6">
              <Button
                onClick={addNewFlashcard}
                className="flex items-center gap-2 md:text-base text-xs"
              >
                <Plus size={20} />
                Add Another Flashcard
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Please select a topic to start creating flashcards
          </div>
        )}

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