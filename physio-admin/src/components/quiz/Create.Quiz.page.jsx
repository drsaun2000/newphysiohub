import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Upload,
  ChevronDown,
  ChevronUp,
  Trash2,
  Plus,
  X,
} from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';

const CreateQuizPage = () => {
  const SERVER_URL = import.meta.env.VITE_DEV_API_URL;
  const navigate = useNavigate();

  const [mainTopics, setMainTopics] = useState([]);
  const [expandedQuestions, setExpandedQuestions] = useState([0]);

  const [quiz, setQuiz] = useState({
    title: '',
    mainTopic: '',
    cardTopic: '',
    questions: [
      {
        question: '',
        image: '',
        type: 'radio',
        options: [
          { type: 'text', value: '', correctAnswer: false },
          { type: 'text', value: '', correctAnswer: false },
          { type: 'text', value: '', correctAnswer: false },
          { type: 'text', value: '', correctAnswer: false },
        ],
        description: '',
      },
    ],
    banner: '',
    thumbnail: '',
    quizDurationInMinutes: '',
  });

  // Loading states
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [bannerUploading, setBannerUploading] = useState(false);
  const [thumbnailUploading, setThumbnailUploading] = useState(false);
  const [questionImageUploading, setQuestionImageUploading] = useState({});

  const fetchTopics = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}main-topics`);
      setMainTopics(res.data.data);
    } catch (error) {
      console.error('Error fetching topics:', error);
      toast.error('Error fetching main topics');
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'quizDurationInMinutes') {
      if (value === '') {
        setQuiz((prev) => ({ ...prev, [name]: '' }));
        return;
      }
      const numberValue = Number(value);
      if (!isNaN(numberValue) && numberValue >= 1) {
        setQuiz((prev) => ({ ...prev, [name]: numberValue }));
      }
    } else {
      setQuiz((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleBannerUpload = async (file) => {
    setBannerUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await axios.post(`${SERVER_URL}quizzes/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      let bannerUrl = res.data.data.url;
      if (!/^https?:\/\//i.test(bannerUrl)) {
        bannerUrl = `https://${bannerUrl}`;
      }

      setQuiz((prev) => ({ ...prev, banner: bannerUrl }));
    } catch (error) {
      console.error('Banner upload error:', error);
      toast.error('Error uploading banner');
    } finally {
      setBannerUploading(false);
    }
  };

  const handleThumbnailUpload = async (file) => {
    setThumbnailUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await axios.post(`${SERVER_URL}quizzes/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      let thumbnailUrl = res.data.data.url;
      if (!/^https?:\/\//i.test(thumbnailUrl)) {
        thumbnailUrl = `https://${thumbnailUrl}`;
      }

      setQuiz((prev) => ({ ...prev, thumbnail: thumbnailUrl }));
    } catch (error) {
      console.error('Thumbnail upload error:', error);
      toast.error('Error uploading thumbnail');
    } finally {
      setThumbnailUploading(false);
    }
  };

  const handleImageUpload = async (file, qIndex) => {
    setQuestionImageUploading((prev) => ({ ...prev, [qIndex]: true }));
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await axios.post(`${SERVER_URL}quizzes/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      let imageUrl = res.data.data.url;
      if (!/^https?:\/\//i.test(imageUrl)) {
        imageUrl = `https://${imageUrl}`;
      }

      handleQuestionChange(qIndex, 'image', imageUrl);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Error uploading image');
    } finally {
      setQuestionImageUploading((prev) => ({ ...prev, [qIndex]: false }));
    }
  };

  const handleQuestionChange = (index, field, value) => {
    const updated = [...quiz.questions];
    updated[index][field] = value;
    setQuiz((prev) => ({ ...prev, questions: updated }));
  };

  const handleOptionChange = (qIndex, optIndex, field, value) => {
    const updated = [...quiz.questions];
    
    if (field === 'correctAnswer' && value) {
      // Only one option can be correct, so set all others to false
      updated[qIndex].options.forEach((option, index) => {
        option.correctAnswer = index === optIndex;
      });
    } else if (field === 'value') {
      updated[qIndex].options[optIndex][field] = value;
    }
    
    setQuiz((prev) => ({ ...prev, questions: updated }));
  };

  const addQuestion = () => {
    const newIndex = quiz.questions.length;
    setQuiz((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          question: '',
          image: '',
          type: 'radio',
          options: [
            { type: 'text', value: '', correctAnswer: false },
            { type: 'text', value: '', correctAnswer: false },
            { type: 'text', value: '', correctAnswer: false },
            { type: 'text', value: '', correctAnswer: false },
          ],
          description: '',
        },
      ],
    }));
    setExpandedQuestions([...expandedQuestions, newIndex]);
  };

  const removeQuestion = (index) => {
    const updated = quiz.questions.filter((_, i) => i !== index);
    setQuiz((prev) => ({ ...prev, questions: updated }));
    setExpandedQuestions(expandedQuestions.filter(i => i !== index).map(i => i > index ? i - 1 : i));
  };

  const addOption = (qIndex) => {
    const updated = [...quiz.questions];
    updated[qIndex].options.push({ type: 'text', value: '', correctAnswer: false });
    setQuiz((prev) => ({ ...prev, questions: updated }));
  };

  const removeOption = (qIndex, optIndex) => {
    const updated = [...quiz.questions];
    updated[qIndex].options = updated[qIndex].options.filter((_, i) => i !== optIndex);
    setQuiz((prev) => ({ ...prev, questions: updated }));
  };

  const toggleQuestion = (index) => {
    setExpandedQuestions(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const handleSubmit = async (isDraft = false) => {
    if (
      !quiz.title ||
      !quiz.mainTopic ||
      !quiz.quizDurationInMinutes ||
      quiz.questions.length === 0 ||
      Number(quiz.quizDurationInMinutes) <= 1
    ) {
      toast.error('Please fill in all required fields. Quiz duration must be greater than 1 minute.');
      return;
    }

    setLoadingSubmit(true);
    try {
      const quizData = {
        ...quiz,
        status: isDraft ? 'draft' : 'published'
      };
      
      await axios.post(`${SERVER_URL}quizzes/create`, quizData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      toast.success(isDraft ? 'Quiz saved as draft!' : 'Quiz published!');
      navigate('/quizzes');
    } catch (error) {
      console.error('Quiz creation error:', error);
      toast.error('Error creating quiz');
    } finally {
      setLoadingSubmit(false);
    }
  };

  const DropZone = ({ onDrop, children, accept = "image/*", className = "" }) => {
    const handleDragOver = (e) => {
      e.preventDefault();
    };

    const handleDrop = (e) => {
      e.preventDefault();
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        onDrop(files[0]);
      }
    };

    const fileInputId = `file-upload-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div
        className={`border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-400 transition-colors cursor-pointer ${className}`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept={accept}
          onChange={(e) => e.target.files[0] && onDrop(e.target.files[0])}
          className="hidden"
          id={fileInputId}
        />
        <label htmlFor={fileInputId} className="cursor-pointer block">
          {children}
        </label>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-2xl font-semibold text-gray-900">Create Quiz</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleSubmit(true)}
              disabled={loadingSubmit}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Save as Draft
            </button>
            <button
              onClick={() => handleSubmit(false)}
              disabled={loadingSubmit}
              className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-medium hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center gap-2"
            >
              {loadingSubmit ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Publishing...
                </>
              ) : (
                <>
                  📝 Publish
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Quiz Title Section */}
        <div className="bg-white rounded-2xl border border-gray-100 p-8 mb-6 shadow-sm">
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3">Quiz Title</label>
            <input
              type="text"
              name="title"
              value={quiz.title}
              onChange={handleChange}
              placeholder="Enter quiz title"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-300 text-lg font-medium"
              disabled={loadingSubmit}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3">Quiz Duration</label>
            <input
              type="number"
              name="quizDurationInMinutes"
              value={quiz.quizDurationInMinutes}
              onChange={handleChange}
              placeholder="Enter duration in minutes"
              min="1"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-300"
              disabled={loadingSubmit}
            />
          </div>
        </div>

        {/* Cover Section */}
        <div className="bg-white rounded-2xl border border-gray-100 p-8 mb-6 shadow-sm">
          <div className="mb-8">
            <label className="block text-lg font-semibold text-gray-900 mb-4">Cover</label>
            <DropZone 
              onDrop={handleBannerUpload}
              className="p-16 text-center bg-gray-50"
            >
              {bannerUploading ? (
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 border-3 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-base text-gray-600 font-medium">Uploading cover image...</p>
                </div>
              ) : quiz.banner ? (
                <div className="relative inline-block">
                  <img
                    src={quiz.banner}
                    alt="Quiz cover"
                    className="max-w-full max-h-64 mx-auto rounded-xl object-cover shadow-lg"
                  />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setQuiz(prev => ({ ...prev, banner: '' }));
                    }}
                    className="absolute -top-2 -right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                    <Upload className="w-8 h-8 text-purple-600" />
                  </div>
                  <p className="text-lg font-semibold text-gray-700 mb-2">Drag or drop image here</p>
                  <p className="text-sm text-gray-500">Image should be landscape at least 1920 x 1080 px</p>
                </div>
              )}
            </DropZone>
          </div>

          {/* Thumbnail Section */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-gray-900 mb-4">Thumbnail</label>
            <DropZone 
              onDrop={handleThumbnailUpload}
              className="p-12 text-center bg-gray-50"
            >
              {thumbnailUploading ? (
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                  <p className="text-sm text-gray-600">Uploading thumbnail...</p>
                </div>
              ) : quiz.thumbnail ? (
                <div className="relative inline-block">
                  <img
                    src={quiz.thumbnail}
                    alt="Quiz thumbnail"
                    className="max-w-full max-h-40 mx-auto rounded-lg object-cover shadow-md"
                  />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setQuiz(prev => ({ ...prev, thumbnail: '' }));
                    }}
                    className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                    <Upload className="w-6 h-6 text-purple-600" />
                  </div>
                  <p className="text-base font-semibold text-gray-700 mb-1">Drag or drop image here</p>
                  <p className="text-sm text-gray-500">Image should be landscape at least 1920 x 1080 px</p>
                </div>
              )}
            </DropZone>
          </div>

          {/* Quiz Topic and Card Topic */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-4">Quiz Topic</label>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600">Select Category</label>
                <select
                  name="mainTopic"
                  value={quiz.mainTopic}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-300 bg-white text-gray-700"
                  disabled={loadingSubmit}
                >
                  <option value="">Choose category</option>
                  {mainTopics.map((topic) => (
                    <option key={topic._id} value={topic._id}>
                      {topic.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-4">Card Topic</label>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600">Select Category</label>
                <select
                  name="cardTopic"
                  value={quiz.cardTopic}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-300 bg-white text-gray-700"
                  disabled={loadingSubmit}
                >
                  <option value="">Choose category</option>
                  {mainTopics.map((topic) => (
                    <option key={topic._id} value={topic._id}>
                      {topic.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Questions Section */}
        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold text-gray-900">Questions</h2>
            <button
              onClick={addQuestion}
              className="flex items-center gap-2 px-5 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors shadow-md hover:shadow-lg"
            >
              <Plus className="w-4 h-4" />
              Add Question
            </button>
          </div>

          <div className="space-y-6">
            {quiz.questions.map((question, qIndex) => (
              <div key={qIndex} className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                {/* Question Header */}
                <div 
                  className="flex items-center justify-between p-6 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors border-b border-gray-200"
                  onClick={() => toggleQuestion(qIndex)}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-base font-semibold text-gray-800">Question {qIndex + 1}</span>
                    {question.question && (
                      <span className="text-sm text-gray-600 truncate max-w-md bg-white px-3 py-1 rounded-lg">
                        {question.question}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeQuestion(qIndex);
                      }}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    {expandedQuestions.includes(qIndex) ? (
                      <ChevronUp className="w-6 h-6 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Question Content */}
                {expandedQuestions.includes(qIndex) && (
                  <div className="p-8">
                    {/* Thumbnail */}
                    <div className="mb-8">
                      <label className="block text-base font-semibold text-gray-800 mb-4">Thumbnail</label>
                      <DropZone 
                        onDrop={(file) => handleImageUpload(file, qIndex)}
                        className="p-10 text-center bg-gray-50"
                      >
                        {questionImageUploading[qIndex] ? (
                          <div className="flex flex-col items-center">
                            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                            <p className="text-sm text-gray-600">Uploading image...</p>
                          </div>
                        ) : question.image ? (
                          <div className="relative inline-block">
                            <img
                              src={question.image}
                              alt="Question"
                              className="max-w-full max-h-40 mx-auto rounded-lg object-cover shadow-md"
                            />
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                handleQuestionChange(qIndex, 'image', '');
                              }}
                              className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                              <Upload className="w-5 h-5 text-purple-600" />
                            </div>
                            <p className="text-sm font-medium text-gray-700 mb-1">Drag or drop image here</p>
                            <p className="text-xs text-gray-500">Image should be landscape at least 1920 x 1080 px</p>
                          </div>
                        )}
                      </DropZone>
                    </div>

                    {/* Question Text */}
                    <div className="mb-8">
                      <label className="block text-base font-semibold text-gray-800 mb-3">Question</label>
                      <textarea
                        value={question.question}
                        onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)}
                        placeholder="Write question here"
                        className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-300 resize-none text-base"
                        rows={4}
                        disabled={loadingSubmit}
                      />
                    </div>

                    {/* Options */}
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-6">
                        <label className="block text-base font-semibold text-gray-800">Options</label>
                        <button
                          onClick={() => addOption(qIndex)}
                          className="text-sm text-purple-600 hover:text-purple-700 font-semibold bg-purple-50 px-4 py-2 rounded-lg hover:bg-purple-100 transition-colors"
                        >
                          + Add option
                        </button>
                      </div>

                      <div className="space-y-4">
                        {question.options.map((option, optIndex) => (
                          <div key={optIndex} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-3 min-w-[140px]">
                              <span className="text-sm font-semibold text-gray-700">
                                Option {optIndex + 1}
                              </span>
                              <div className="flex items-center gap-2">
                                <div className="relative">
                                  <input
                                    type="radio"
                                    name={`correct-${qIndex}`}
                                    checked={option.correctAnswer}
                                    onChange={(e) =>
                                      handleOptionChange(qIndex, optIndex, 'correctAnswer', e.target.checked)
                                    }
                                    className="w-5 h-5 text-purple-600 border-2 border-gray-300 focus:ring-purple-500 focus:ring-2"
                                    disabled={loadingSubmit}
                                  />
                                </div>
                                <span className="text-xs font-medium text-gray-600">Correct</span>
                              </div>
                            </div>
                            <input
                              type="text"
                              value={option.value}
                              onChange={(e) =>
                                handleOptionChange(qIndex, optIndex, 'value', e.target.value)
                              }
                              placeholder="Enter option here"
                              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-300 text-base"
                              disabled={loadingSubmit}
                            />
                            {question.options.length > 2 && (
                              <button
                                onClick={() => removeOption(qIndex, optIndex)}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Explanation */}
                    <div>
                      <label className="block text-base font-semibold text-gray-800 mb-3">Explanation</label>
                      <textarea
                        value={question.description}
                        onChange={(e) => handleQuestionChange(qIndex, 'description', e.target.value)}
                        placeholder="Write explanation here"
                        className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-300 resize-none text-base"
                        rows={4}
                        disabled={loadingSubmit}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateQuizPage;
