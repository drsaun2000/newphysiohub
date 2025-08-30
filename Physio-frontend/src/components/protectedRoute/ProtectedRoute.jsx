"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";

const ProtectedRoute = ({ children }) => {

  const router = useRouter();
  const pathname = usePathname();

  const protectedPaths = [
    "/user/dashboard", "/user/discover", "/user/courses", "/user/quizs",
    "/user/flashcards", "/user/settings", "/teacher/course",
    "/teacher/course/update", "/teacher/quiz", "/teacher/quiz/update",
    "/teacher/flashCard", "/teacher/flashCard/update", "/teacher/setting",
    "/teacher/add-lesson", "/quiz", "/flashcard", "/AllFlashCards", "/AllQuizs"
  ];


  useEffect(() => {
    const token = localStorage.getItem("token")
    
    const role = JSON?.parse(localStorage.getItem("user"))?.role
    const isProtectedRoute = protectedPaths.some((path) =>
      pathname.startsWith(path)
    );

    const isAuthRoute = pathname.startsWith("/auth");
    const isTeacherRoute = pathname.startsWith("/teacher");
    const isUserRoute = pathname.startsWith("/user");

    // ✅ Skip protection for any /auth route
    if (isAuthRoute) return;

    // 🔐 Redirect to login if no token and accessing a protected route
    if (isProtectedRoute && !token) {
      router.replace("/auth/login");
      return;
    }

    // 🔒 Role-based protection
    if (isTeacherRoute && role !== "teacher" && role !== "instructor") {
      router.push("/");
      return;
    }
    if (isUserRoute && role !== "user") {
      router.replace("/");
      return;
    }
  }, [pathname, router]);

  return children;
};

export default ProtectedRoute;
