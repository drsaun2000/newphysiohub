"use client"
import Cookies from "js-cookie";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { ApiFetchRequest } from "@/axios/apiRequest";
import { FileText } from "lucide-react";

const BlogCard = ({ category, title, author, readTime, categoryColor }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
      {/* Gradient Header with Read Time */}
      <div className="h-40 md:h-48 bg-gradient-to-b from-gray-200 to-purple-300 relative p-3 md:p-4">
        <div className="absolute top-3 left-3 md:top-4 md:left-4">
          <span className="bg-white/90 backdrop-blur-sm text-gray-700 px-2 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-medium">
            {readTime} min Read
          </span>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4 md:p-6">
        <div className="mb-2 md:mb-3">
          <span className={`text-xs md:text-sm font-semibold ${categoryColor}`}>
            {category}
          </span>
        </div>
        <h3 className="text-lg md:text-xl font-bold text-gray-900 leading-tight mb-3 md:mb-4">
          {title}
        </h3>
        <p className="text-gray-600 text-xs md:text-sm">
          {author}
        </p>
      </div>
    </div>
  );
};

const BlogSection = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      setIsLoggedIn(true);
    }
    const role = JSON.parse(localStorage.getItem("user"))?.role;
    if (role) {
      setRole(role);
    }
  }, []);

  const blogs = [
    {
      category: "Muscle",
      title: "Your New Knee: Rehab and Physical Therapy",
      author: "Dr. Alexander",
      readTime: "6",
      categoryColor: "text-purple-600"
    },
    {
      category: "Cardiovascular",
      title: "High-quality results if you regularly receive messages.",
      author: "Dr. Alexander",
      readTime: "6",
      categoryColor: "text-purple-600"
    },
    {
      category: "Muscle",
      title: "Arthroplasty Replacement Surgery for the Lower Arm",
      author: "Dr. Alexander",
      readTime: "6",
      categoryColor: "text-purple-600"
    }
  ];

  return (
    <div className="py-8 md:py-16 px-4 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 md:mb-12 gap-4 sm:gap-0">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="text-primary-50 h-4 w-4 md:h-5 md:w-5"/>
              <span className="text-primary-50 text-xs md:text-sm font-semibold uppercase tracking-wide">
                BLOGS
              </span>
            </div>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900">
              Explore all our insight
            </h1>
          </div>
          <Link
            href={`${
              !isLoggedIn
                ? "/auth/login"
                : role == "user"
                ? "/user/courses"
                : role == "teacher" || role == "instructor"
                ? "/teacher/course"
                : ""
            }`}
            className="bg-purple-100 text-purple-700 px-4 py-2 md:px-6 md:py-2 rounded-full text-xs md:text-sm font-medium hover:bg-purple-200 transition-colors"
          >
            View All
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {blogs.map((blog, index) => (
            <BlogCard
              key={index}
              category={blog.category}
              title={blog.title}
              author={blog.author}
              readTime={blog.readTime}
              categoryColor={blog.categoryColor}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogSection;
