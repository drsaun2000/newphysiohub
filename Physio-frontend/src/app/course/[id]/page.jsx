"use client";
import useGet from '@/hooks/useGet';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function CourseDetail({params}) {
    const {id} = React.use(params);
    const [course, setCourse] = useState(null);
    const [completedLessons, setCompletedLessons] = useState([]);
    const [expandedLesson, setExpandedLesson] = useState(null);
    const [loading, setLoading] = useState(true);

    const userId = "67ee7a348b19a3a5a5a40dc0";

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                setLoading(true);
                const {data, error, status} = await useGet(`/courses/get/${id}`);
                setCourse(data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch course:", error);
                setLoading(false);
            }
        };

        fetchCourse();
    }, [id]);

    const toggleLesson = (lessonId) => {
        if (expandedLesson === lessonId) {
            setExpandedLesson(null);
        } else {
            setExpandedLesson(lessonId);
        }
    };

    const completeLesson = (lessonId) => {
        setCompletedLessons([...completedLessons, lessonId]);
    };

    const isLessonAccessible = (lessonIndex) => {
        if (lessonIndex === 0) return true;
        const previousLessonId = course?.lessons[lessonIndex - 1]?._id;
        return previousLessonId ? completedLessons.includes(previousLessonId) : false;
    };

    const allLessonsCompleted = () => {
        if (!course) return false;
        return course.lessons.every(lesson => completedLessons.includes(lesson._id));
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"
                />
            </div>
        );
    }

    if (!course) {
        return <div className="p-4">Course not found</div>;
    }

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    const accordionVariants = {
        open: { 
            opacity: 1, 
            height: "auto",
            transition: { 
                duration: 0.3,
                ease: "easeInOut"
            }
        },
        closed: { 
            opacity: 0, 
            height: 0,
            transition: { 
                duration: 0.3,
                ease: "easeInOut"
            }
        }
    };

    return (
        <motion.div 
            initial="hidden"
            animate="show"
            variants={containerVariants}
            className="md:max-w-[70%] max-w-[95%] mx-auto p-4"
        >
            {/* Course Header */}
            <div className="flex items-center gap-2">
                <Link href={"/user/courses"} className="flex items-center gap-2">
                    <ArrowLeft className="w-5 h-5 text-gray-700 cursor-pointer"/>
                    <h2 className="text-lg font-semibold md:block hidden">Back</h2>
                </Link>
      </div>
            <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-md overflow-hidden mb-6 md:p-5 ">
                <div className="md:flex ">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="md:max-w-1/2 w-full h-auto"
                    >
                        <img 
                            src={course.coverImageUrl} 
                            alt={course.title}
                            className="w-full h-full object-cover rounded-lg"
                        />
                    </motion.div>
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="p-6 md:w-2/3 flex flex-col  justify-between"
                    >
                       <div>
                         <h1 className="md:text-2xl text-lg font-bold text-gray-800 mb-2">{course.title}</h1>
                       <p className="text-gray-600 md:text-base text-sm mb-4">{course.description}</p>
                       </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center">
                                    {course.instructor.profilePic ? (
                                        <img 
                                            src={course.instructor.profilePic} 
                                            alt={course.instructor.name}
                                            className="rounded-full w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-gray-600">
                                            {course.instructor.name.charAt(0).toUpperCase()}
                                        </span>
                                    )}
                                </div>
                                <span className="ml-2 text-gray-700">{course.instructor.name}</span>
                            </div>
                            <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                                {course.lessons.length} Lessons
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Lessons Accordion */}
            <motion.div variants={itemVariants} className="space-y-4">
                <motion.h2 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-xl font-semibold text-gray-800"
                >
                    Course Lessons
                </motion.h2>
                
                {course.lessons.map((lesson, index) => {
                    const isCompleted = completedLessons.includes(lesson._id);
                    const isAccessible = isLessonAccessible(index);
                    
                    return (
                        <motion.div 
                            key={lesson._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index }}
                            className={`border rounded-lg overflow-hidden ${isAccessible ? '' : 'opacity-50'}`}
                        >
                            <button
                                onClick={() => isAccessible && toggleLesson(lesson._id)}
                                className={`w-full p-4 text-left flex justify-between items-center ${isCompleted ? 'bg-purple-50' : 'bg-white'}`}
                            >
                                <div className="flex items-center">
                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${isCompleted ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                                        {isCompleted ? '✓' : index + 1}
                                    </span>
                                    <span className="font-medium">{lesson.lessonTitle}</span>
                                </div>
                                <motion.svg 
                                    animate={{ rotate: expandedLesson === lesson._id ? 180 : 0 }}
                                    className="w-5 h-5"
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </motion.svg>
                            </button>
                            
                            <AnimatePresence>
                                {expandedLesson === lesson._id && (
                                    <motion.div
                                    initial="closed"
                                    animate="open"
                                    exit="closed"
                                    variants={accordionVariants}
                                    className="overflow-hidden"
                                  >
                                    <div className="sm:p-4 p-1 border-t bg-gray-50">
                                      <div className="space-y-4">
                                        {lesson.contents.map(content => (
                                          <div key={content._id} className="bg-white sm:p-4 p-2 rounded-lg shadow-sm">
                                            <div className="flex items-start mb-3">
                                              <div className="bg-blue-100 p-2 rounded-lg mr-3">
                                                {content.type === 'video' ? (
                                                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                  </svg>
                                                ) : (
                                                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                                  </svg>
                                                )}
                                              </div>
                                              <div>
                                                <h4 className="font-medium text-lg">{content.title}</h4>
                                                <p className="text-sm text-gray-500 mt-1">Type: {content.type}</p>
                                              </div>
                                            </div>
                                  
                                            {/* Video Player for video content */}
                                            {content.type === 'video' && (
                                              <div className="w-full max-w-3xl mx-auto aspect-video">
                                                <video 
                                                  controls 
                                                  
                                                  className="w-full h-full object-cover rounded-lg"
                                                  poster="https://via.placeholder.com/800x450?text=Video+Thumbnail"
                                                  src={content.url}
                                                >
                                                  <source src={content.url} type="video/mp4" />
                                                  Your browser does not support the video tag.
                                                </video>
                                              </div>
                                            )}
                                  
                                            {/* Article Content Display */}
                                            {content.type === 'article' && (
                                              <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                                                <div className="prose max-w-none">
                                                  <h5 className="text-gray-700 mb-2">Article Content Preview:</h5>
                                                  <a href={content.url} className="text-blue-600" target='_blank'>
                                                    open link
                                                  </a>
                                                </div>
                                              </div>
                                            )}
                                  
                                            {/* Additional content details */}
                                            <div className="mt-3 pt-3 border-t text-sm text-gray-500">
                                              {content.duration && <p>Duration: {content.duration} minutes</p>}
                                              {content.author && <p>Author: {content.author}</p>}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                      
                                      {!isCompleted && (
                                        <motion.button
                                          whileHover={{ scale: 1.02 }}
                                          whileTap={{ scale: 0.98 }}
                                          onClick={() => completeLesson(lesson._id)}
                                          className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
                                        >
                                          Mark as Complete
                                        </motion.button>
                                      )}
                                    </div>
                                  </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* Finish Button */}
            <AnimatePresence>
                {allLessonsCompleted() && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="mt-8 text-center"
                    >
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors text-lg font-medium"
                        >
                            <Link href={`/user/courses`}>
                            Finish Course
                            </Link>
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}