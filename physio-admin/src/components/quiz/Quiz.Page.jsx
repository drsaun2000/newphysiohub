import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Search,
  Clock,
  Trash2,
  Edit3,
  FileText,
  Timer,
} from 'lucide-react';
import { FaQuestion } from 'react-icons/fa';
import { HiOutlineDocumentText } from 'react-icons/hi';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import DeleteConfirmationModal from '../modals/delete.confirmation.page';

const QuizPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [search, setSearch] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const SERVER_URL = import.meta.env.VITE_DEV_API_URL;

  const fetchQuizzes = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${SERVER_URL}quizzes`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setQuizzes(res.data.data || []);
      setFilteredQuizzes(res.data.data || []);
    } catch (err) {
      console.error('Error fetching quizzes:', err);
      toast.error('Failed to fetch quizzes.');
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDeleteQuiz = (id) => {
    setQuizToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await axios.delete(`${SERVER_URL}quizzes/${quizToDelete}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      toast.success('Quiz deleted successfully');
      fetchQuizzes(); // Refresh list
    } catch (err) {
      console.error('Delete quiz error:', err);
      toast.error('Failed to delete quiz');
    } finally {
      setShowDeleteModal(false);
      setQuizToDelete(null);
    }
  };

  // Filter quizzes based on search term
  useEffect(() => {
    if (search.trim() === "") {
      setFilteredQuizzes(quizzes);
    } else {
      const filtered = quizzes.filter(quiz => {
        const quizTitle = quiz.title?.toLowerCase() || '';
        const topicName = quiz.mainTopic?.name?.toLowerCase() || '';
        const searchTerm = search.toLowerCase();
        
        return (
          quizTitle.includes(searchTerm) || 
          topicName.includes(searchTerm)
        );
      });
      setFilteredQuizzes(filtered);
    }
  }, [search, quizzes]);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-6xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Quiz</h1>
          </div>

          <div className="flex items-center gap-5">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search quizzes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-96 pl-12 pr-5 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-300 shadow-sm"
              />
            </div>

            <button
              className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
              onClick={() => navigate('/create-quiz')}
            >
              <span className="text-lg">+</span>
              Create new
            </button>
          </div>
        </div>

        {/* Single Quiz Card Container */}
        {isLoading ? (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            {Array(3).fill(0).map((_, index) => (
              <div key={index} className={`p-8 ${index !== 2 ? 'border-b border-gray-50' : ''}`}>
                <div className="flex items-center gap-8">
                  <div className="w-[140px] h-[90px] bg-gray-200 rounded-xl animate-pulse flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="h-5 w-20 bg-gray-200 rounded-full animate-pulse mb-4"></div>
                    <div className="h-7 w-80 bg-gray-200 rounded animate-pulse mb-4"></div>
                    <div className="flex items-center gap-8">
                      <div className="h-5 w-28 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                    <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredQuizzes.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mb-6">
              <HiOutlineDocumentText className="w-10 h-10 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              {search ? 'No quizzes found' : 'No quizzes created yet'}
            </h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
              {search 
                ? `No quizzes found matching "${search}". Try a different search term.`
                : 'Get started by creating your first quiz to engage your students!'
              }
            </p>
            {!search && (
              <button
                onClick={() => navigate('/create-quiz')}
                className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Create Your First Quiz
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            {filteredQuizzes.map((quiz, index) => (
              <div
                key={quiz._id}
                className={`p-8 hover:bg-gray-50/70 transition-all duration-200 ${
                  index !== filteredQuizzes.length - 1 ? 'border-b border-gray-50' : ''
                }`}
              >
                <div className="flex items-center gap-8">
                  {/* Quiz Image */}
                  <div className="w-[140px] h-[90px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden shadow-sm">
                    {quiz.banner ? (
                      <img
                        src={quiz.banner}
                        alt={quiz.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                        <HiOutlineDocumentText className="w-10 h-10 text-blue-500" />
                      </div>
                    )}
                  </div>

                  {/* Quiz Info */}
                  <div className="flex-1 min-w-0">
                    <div className="mb-3">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200">
                        {quiz.mainTopic?.name || 'Geriatric'}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 leading-tight line-clamp-2">
                      {quiz.title}
                    </h3>
                    <div className="flex items-center gap-8 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-green-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-3 h-3 text-green-600" />
                        </div>
                        <span className="font-medium">{quiz.questions?.length || 23} Questions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-orange-100 rounded-lg flex items-center justify-center">
                          <Timer className="w-3 h-3 text-orange-600" />
                        </div>
                        <span className="font-medium">{quiz.quizDurationInMinutes || 20} min</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => confirmDeleteQuiz(quiz._id)}
                      className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group"
                      title="Delete quiz"
                    >
                      <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </button>
                    <button
                      onClick={() => navigate(`/edit-quiz/${quiz._id}`)}
                      className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 group"
                      title="Edit quiz"
                    >
                      <Edit3 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteConfirmed}
          title="Delete Quiz"
          message="Are you sure you want to delete this quiz? This action cannot be undone."
        />
      </div>
    </div>
  );
};

export default QuizPage;
