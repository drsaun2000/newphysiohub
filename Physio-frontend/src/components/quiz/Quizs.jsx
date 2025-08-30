"use client";
import Image from "next/image.js";
import { Button } from "@/components/ui/button.jsx";
import { Trash2, Edit, MessageSquareText, Clock, Sparkles, X } from "lucide-react";
import QuizHeader from "@/components/quiz/QuizHeader";
import { useEffect, useState } from "react";
import useGet from "@/hooks/useGet";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useDelete from "@/hooks/useDelete";
import axios from "axios";
const api_url = process.env.NEXT_PUBLIC_API_BASE_URL

// const articles = [
//   {
//     category: "Geriatric",
//     title: "Biomechanics",
//     questions: "25 Questions",
//     time: "20 min",
//   },
//   {
//     category: "Geriatric",
//     title: "Medicine",
//     questions: "25 Questions",
//     time: "20 min",
//   },
// ];

export default function Quizs({ setShowInQuiz }) {
  const router = useRouter();
  const [notification, setNotification] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState(null);

  const fetchTeacherQuizs = async () => {
    setLoading(true);
    try {
      const { data } = await useGet(`/quizzes/my-quizzes`);
      setArticles(data || []);
    } catch (error) {
      console.error("Error fetching flashcards:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTeacherQuizs();
  }, []);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleDeleteClick = (id) => {
    setQuizToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleQuizDelete = async () => {
    try {
      const { data, error, status } = await useDelete(`/quizzes/${quizToDelete}`);
      console.log(data)
      if(status == 200){
        showToast("Quiz Deleted Successfully", "success")
        setTimeout(() => {
          fetchTeacherQuizs()
        }, 1000);
      }
    } catch (error) {
      showToast("Failed to Delete Quiz", "error")
    } finally {
      setDeleteModalOpen(false);
      setQuizToDelete(null);
    }
  };

  return (
    <>
      <QuizHeader setShowInQuiz={setShowInQuiz} />
      <div className="md:p-6 sm:p-5 bg-white rounded-lg shadow-md w-full mx-auto md:max-w-[80%] max-w-[95%] ">
      {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Sparkles className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Quiz Found
            </h3>
            <p className="text-gray-500 mb-6">
              You haven't created any Quiz yet. Get started by creating your first one!
            </p>  
          </div>
        ) : (
        <div className="mt-4 space-y-6">
          {articles?.map((article, index) => (
            <div
              key={index}
              className="border-t pt-4 first:border-t-0 first:pt-0 last:pb-5"
            >
              <div className="flex md:flex-row flex-col justify-between items-center ">
                <div className="flex sm:flex-row flex-col items-center gap-5 w-full">
                  <div className="h-[180px] max-w-[230px]">
                    <Image
                      src={article.banner || "/auth-activity.png"}
                      alt="image"
                      height={200}
                      width={240}
                      className="object-cover h-full w-full rounded-2xl"
                    />
                  </div>
                  <div className="md:w-[44%]  text-start">
                    {/* <p className="text-sm text-blue-600 font-medium mb-2">
                      {article.category}
                    </p> */}
                    <h3 className="text-lg md:text-base font-semibold text-gray-900 leading-relaxed">
                      {article.title}
                    </h3>
                    <p className="text-sm text-gray-400 mt-2 flex items-center">
                      <MessageSquareText size={14} />
                      &nbsp;{article.questions.length}&nbsp; Questions &nbsp;
                      {article.time}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-gray-300 text-gray-600 hover:bg-gray-100"
                    onClick={() => handleDeleteClick(article._id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <Link href={`/teacher/quiz/update/${article._id}`}>
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-gray-300 text-gray-600 hover:bg-gray-100"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>)}

        {/* Delete Confirmation Modal */}
        {deleteModalOpen && (
          <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Delete Quiz</h3>
                <button
                  onClick={() => {
                    setDeleteModalOpen(false);
                    setQuizToDelete(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this quiz? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setDeleteModalOpen(false);
                    setQuizToDelete(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleQuizDelete}
                >
                  Delete
                </Button>
              </div>
            </div>
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
