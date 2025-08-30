"use client";

import { FaTrophy } from "react-icons/fa";
import { ChevronDown, AlarmClock, BadgeCheck, FileText } from "lucide-react";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import useGet from "@/hooks/useGet";
import { useRouter } from "next/navigation";
import { Rating } from "@mui/material";
import usePost from "@/hooks/usePost";
import LottiePlayer from "@/components/animations/LottiePlayer";
import happy from "@/components/animations/data/Happy.json";

const Flashcard = ({
  imageSrc,
  title,
  description,
  id,
  rating,
  totalRating,
}) => {
  const router = useRouter();
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);
  const randomRating = Math.floor(Math.random() * (5 - 3 + 1)) + 3;
  const randomRatingCount = Math.floor(Math.random() * (50 - 10 + 1)) + 10;

  const showToast = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleFlashCardJoin = async () => {
    setLoading(true);
    const { data, error, status } = await usePost(`/flashcards/join/${id}`);
    if (status == 201) {
      setLoading(false);
      router.push(`/flashcard/${id}`);
    }
    if (error) {
      setLoading(false);
      showToast("Failed to Enroll in FlashCard. Try Again", "error");
    }
  };

  return (
    <div className="flex flex-col justify-between bg-white rounded-xl border overflow-hidden p-4 sm:max-w-[320px] max-w-[300px] relative cursor-pointer">
      <div className="h-[180px] w-[100%]">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt="image"
            height={200}
            width={240}
            className="object-cover h-full w-full rounded-2xl"
          />
        ) : (
          <div className="bg-gray-300 h-full w-full rounded animate-pulse"></div>
        )}
      </div>
      <div>
        <h3 className="md:text-lg text-base font-semibold mt-4">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
        <div className="mt-2">
          <Rating name="simple-controlled" value={randomRating} readOnly />
        </div>
        <p className="text-sm text-gray-600">Rating {randomRatingCount}+</p>
      </div>
      <div className="flex justify-between items-center mt-4 text-gray-500 text-sm">
        <button
          className="border border-purple-600 w-full text-purple-600 rounded-sm py-1 flex items-center justify-center font-semibold"
          onClick={() => {
            handleFlashCardJoin();
          }}
        >
          {loading ? (
            <div className="w-5 h-5 border-4 border-t-purple-600 border-b-transparent border-l-transparent border-r-transparent rounded-full animate-spin"></div>
          ) : (
            "View FlashCards"
          )}
        </button>
      </div>
      {notification && (
        <div
          className={`fixed bottom-4 right-4 p-4 rounded-md shadow-lg ${
            notification.type === "error" ? "bg-red-500" : "bg-green-500"
          } text-white`}
        >
          {notification.message}
          <button
            onClick={() => setNotification(null)}
            className="ml-4 text-xl"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

const QuizCard2 = ({ quiz }) => {
  const calculateTime = (startTime, endTime) => {
    if (!startTime || !endTime) return "N/A";
    const start = new Date(startTime);
    const end = new Date(endTime);
    const duration = (end - start) / (1000 * 60); // in minutes
    return Math.round(duration);
  };

  return (
    <Link
      href={`/quiz/${quiz._id}`}
      className="flex xl:flex-row flex-col gap-3 items-center justify-between bg-white rounded-lg border overflow-hidden p-4 h-[fit-content] w-full hover:bg-[#fcf9fe] duration-200"
    >
      <div className="h-[150px] w-[200px]">
        {quiz?.banner !== "URL" ? (
          <Image
            src={quiz?.banner || ""}
            alt="quiz banner"
            height={200}
            width={240}
            className="object-cover h-full w-full rounded-2xl"
          />
        ) : (
          <div className="bg-gray-300 h-full w-full rounded animate-pulse"></div>
        )}
      </div>

      <div className="flex flex-col justify-between mt-4">
        <div>
          <h3 className="text-lg font-semibold">{quiz.title}</h3>
          <div className="flex space-x-2 my-1">
            {/* {quiz.subTopics?.map((topic) => (
              <span
                key={topic}
                className="px-3 py-1 bg-white border text-sm rounded-sm"
              >
                {topic}
              </span>
            ))} */}
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          {quiz.questions?.[0]?.description ||
            "Test your knowledge with this quiz"}
        </p>
        <div className="flex items-center mt-2 text-gray-500 text-sm">
          <span>{quiz.questions?.length || 0} questions</span>
          <span className="flex ml-4 text-sm">
            <AlarmClock size={18} />
            &nbsp; {calculateTime(quiz.startTime, quiz.endTime)} min
          </span>
        </div>
      </div>
    </Link>
  );
};

const CourseCard = ({ course }) => {
  const user = localStorage.getItem("user");
  const calculateProgress = (course) => {
    if (!course.lessonProgress || course.lessonProgress.length === 0) return 0;
    const userProgress = course.lessonProgress.find(
      (p) => p.userId === user.id
    );
    if (!userProgress) return 0;
    return Math.round(
      (userProgress.completedLessons.length / course.lessons.length) * 100
    );
  };

  return (
    <div className="flex flex-col justify-between bg-white rounded-xl border overflow-hidden p-4 w-[inherit] md:w-[inherit] lg:w-[350px] relative cursor-pointer">
      <div className="relative h-45 w-full">
        {course.coverImageUrl ? (
          <img
            src={course.coverImageUrl}
            alt="Course cover"
            className="w-full md:h-[180px] h-[150px] object-cover"
          />
        ) : (
          <div className="bg-gray-300 h-[180px] w-full animate-pulse"></div>
        )}
      </div>
      <h5 className="text-gray-400 mt-4 text-md font-semibold">
        {course.lessons?.length || 0} lessons
      </h5>
      <h3 className="md:text-xl text-base font-bold text-gray-800 mt-1">{course.title}</h3>
      <p className="text-sm text-gray-600 mt-4">{course.description}</p>
      <div className="flex justify-between items-center mt-4 text-sm"></div>
    </div>
  );
};

export default function Discover() {
  const [userData, setUserData] = useState({
    quizzesCompleted: [],
    flashcardsCompleted: [],
    coursesEnrolled: [],
    joinedQuizzes: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchUserProgress = async () => {
    try {
      setLoading(true);
      const { data, error, status } = await useGet("/users/progress");
      if (status === 200) {
        setUserData(data);
      } else {
        console.error("Failed to fetch user progress:", error);
      }
    } catch (error) {
      console.error("Error fetching user progress:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProgress();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex justify-between w-[100%]">
      <div className="flex flex-col w-[100%] lg:w-[80%] md:w-[100%]">
        <span className="text-black font-bold text-xl w-[100%]">
          Continue Learning
        </span>

        {/* Enrolled Courses */}
        <div className="flex flex-col lg:flex-row md:flex-row gap-4 mt-4 overflow-x-auto overflow-y-hidden w-[100%]">
          {userData?.coursesEnrolled.slice(0, 3).map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>

        {/* Suggested Quiz Banner */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-700 rounded-lg p-8 flex items-center justify-between mt-4">
          <div className="w-[100%] md:w-[45%] lg:w-[50%] space-y-5">
            <h2 className="md:text-xl text-lg text-white font-bold mb-2">
              Suggested Quiz
            </h2>
            <p className="text-white md:text-base text-xs">
              We offer a personalized selection of quizzes based on your
              previous activities and preferences. Dive in and challenge
              yourself with new and exciting topics.
            </p>
            <Link href={"/user/quizs"} className="mt-2 bg-white text-purple-700 font-semibold py-2 px-4 rounded-md hover:bg-purple-200 transition duration-300">
              Explore
            </Link>
          </div>
          <div className="hidden md:block">
            {/* <img src={"/bird-flying.png"} alt="Penguin" width={150} height={150} /> */}
            <LottiePlayer
              animationFile={happy}
              width="100px"
              height="80px"
              className="hidden sm:block"
            />
          </div>
        </div>

        {/* Saved Quizzes */}
        <div className="mt-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Saved Quiz</h2>
            <Link
              href={`/user/quizs`}
              className="text-[#7240FD] cursor-pointer hover:underline"
            >
              See All
            </Link>
          </div>
          <div className="grid md:grid-cols-2  gap-4 mt-4 overflow-x-auto overflow-y-hidden">
            {userData?.joinedQuizzes.slice(0, 2).map((quiz) => (
              <QuizCard2 key={quiz._id} quiz={quiz} />
            ))}
          </div>
        </div>

        {/* Flashcards */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Flashcards</h2>
            <Link
              href={`/user/flashcards`}
              className="text-[#7240FD] cursor-pointer hover:underline"
            >
              See All
            </Link>
          </div>
          <div className="flex flex-col sm:flex-col md:flex-row lg:flex-row gap-4 mt-4 overflow-x-auto overflow-y-hidden">
            {userData?.flashcardsCompleted.slice(0, 3).map((flashcard) => (
              <Flashcard
                key={flashcard._id}
                imageSrc={flashcard.imageUrl || "/auth-activity.png"}
                title={flashcard.title}
                description={flashcard.description}
                rating={flashcard.rating}
                totalRating={flashcard.ratingCount}
                id={flashcard._id}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
