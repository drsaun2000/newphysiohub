"use client"
import Cookies from "js-cookie";
import { Mail, Facebook, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Footer({scrollToSection}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [role, setRole] = useState("")

  useEffect(()=>{
    const token = localStorage.getItem("token")
    const role = JSON.parse(localStorage.getItem("user"))?.role
    if(token){
      setIsLoggedIn(true)
    }
  },[])

    return (
      <footer className="bg-white text-gray-600 px-6 py-12 md:px-16 lg:px-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            
            {/* Logo and Email Section */}
            <div className="md:col-span-1">
              <div className="flex items-center space-x-2 mb-6">
                <Link href={"/"}>
                  <img className="w-[160px]" src={"/logo-on-light.png"} alt="PhysioHub" />
                </Link>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-purple-600" />
                <a
                  href="mailto:mail@example.com"
                  className="text-purple-600 hover:underline text-sm"
                >
                  mail@example.com
                </a>
              </div>
            </div>

            {/* Features Column */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Features</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href={`${isLoggedIn ? role == "user" ? "/user/quizs" : "/teacher/quiz" :"/auth/login"}`} className="hover:text-gray-900 transition-colors">
                    Quiz
                  </Link>
                </li>
                <li>
                  <Link href={`${isLoggedIn ? role == "user" ? "/user/flashcards" : "/teacher/flashcard" :"/auth/login"}`} className="hover:text-gray-900 transition-colors">
                    Flash Card
                  </Link>
                </li>
                <li>
                  <Link href={`${isLoggedIn ? role == "user" ? "/user/courses" : "/teacher/course" :"/auth/login"}`} className="hover:text-gray-900 transition-colors">
                    Mock Test
                  </Link>
                </li>
              </ul>
            </div>

            {/* Articles Column */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Articles</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <button onClick={()=>{scrollToSection("course")}} className="hover:text-gray-900 transition-colors text-left">
                    Our Blogs
                  </button>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900 transition-colors">
                    Rehab Protocols
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources Column */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Resources</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <button onClick={()=>{scrollToSection("about")}} className="hover:text-gray-900 transition-colors text-left">
                    About Us
                  </button>
                </li>
                <li>
                  <button onClick={()=>{scrollToSection("faq")}} className="hover:text-gray-900 transition-colors text-left">
                    Contact
                  </button>
                </li>
              </ul>
            </div>

            {/* Extra Column */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Extra</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="#" className="hover:text-gray-900 transition-colors">
                    Customer Support
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900 transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900 transition-colors">
                    Terms & Conditions
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500 mb-4 md:mb-0">
              © Copyright 2024, PhysioHub All Rights Reserved
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="text-gray-600 hover:text-gray-900 transition-colors" target="_blank" rel="noopener noreferrer">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com" className="text-gray-600 hover:text-gray-900 transition-colors" target="_blank" rel="noopener noreferrer">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" className="text-gray-600 hover:text-gray-900 transition-colors" target="_blank" rel="noopener noreferrer">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    );
  }
  