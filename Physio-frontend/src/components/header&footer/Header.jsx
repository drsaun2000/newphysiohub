"use client";
import { useEffect, useState } from "react";
import { Menu, X, ChevronDown, BookOpen, Brain, FileText, TrendingUp } from "lucide-react";
import Link from "next/link";
import logo from "../../../public/logo-on-light.png";
import { IoMdPerson } from "react-icons/io";
import Cookies from "js-cookie";

function Header({scrollToSection}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      setIsLoggedIn(true);
    }
    const role = JSON.parse(localStorage.getItem("user"))?.role
    if(role){
      setRole(role)
    }
  });

  return (
    <>
      <div>
        <nav className="backdrop-blur-md shadow-sm w-full fixed top-0 left-0 p-2 z-50 border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              {/* Logo */}
              <div className="flex items-center">
                <span className="text-xl font-bold text-gray-800 flex items-center">
                  <Link href={"/"}>
                    <img
                      className=" md:w-[160px] w-[130px]"
                      src={"/logo-on-light.png"}
                    />
                  </Link>
                </span>
              </div>

              {/* Desktop Menu */}
              <div className="hidden md:flex space-x-8">
                <div className="relative group">
                  <button 
                    onClick={()=>{scrollToSection("features")}}  
                    className="text-neutral-70 hover:text-primary-50 flex items-center font-medium text-base transition-colors"
                  >
                    Features
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="p-6">
                      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">
                        QUIZZES AND TESTS
                      </div>
                      
                      <div className="space-y-4">
                        {/* Interactive Learning Features */}
                        <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                            <Brain className="w-4 h-4 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 text-sm mb-1">
                              Quizzes
                            </h3>
                            <p className="text-gray-600 text-xs leading-relaxed">
                              Quizzes for decision-making practice.
                            </p>
                          </div>
                        </div>

                        {/* Flashcards */}
                        <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                            <BookOpen className="w-4 h-4 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 text-sm mb-1">
                              Flashcards
                            </h3>
                            <p className="text-gray-600 text-xs leading-relaxed">
                              Medical and anatomical term flashcards with images.
                            </p>
                          </div>
                        </div>

                        {/* Blogs */}
                        <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                            <FileText className="w-4 h-4 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 text-sm mb-1">
                              Blogs
                            </h3>
                            <p className="text-gray-600 text-xs leading-relaxed">
                              Informative articles and physiotherapy insights.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative group">
                  <button 
                    onClick={()=>{scrollToSection("course")}} 
                    className="text-neutral-70 hover:text-primary-50 flex items-center font-medium text-base transition-colors"
                  >
                    Articles
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </button>
                  
                  {/* Articles Dropdown Menu */}
                  <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="p-6">
                      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">
                        INFORMATIVE ARTICLES
                      </div>
                      
                      <div className="space-y-4">
                        {/* Latest Research */}
                        <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                          <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                            <TrendingUp className="w-4 h-4 text-teal-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 text-sm mb-1">
                              Latest Research
                            </h3>
                            <p className="text-gray-600 text-xs leading-relaxed">
                              Stay updated with cutting-edge physiotherapy research.
                            </p>
                          </div>
                        </div>

                        {/* Clinical Guidelines */}
                        <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                          <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                            <FileText className="w-4 h-4 text-teal-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 text-sm mb-1">
                              Clinical Guidelines
                            </h3>
                            <p className="text-gray-600 text-xs leading-relaxed">
                              Evidence-based protocols and treatment guidelines.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={()=>{scrollToSection("about")}} 
                  className="text-neutral-70 hover:text-primary-50 font-medium text-base transition-colors"
                >
                  About Us
                </button>
                <button 
                  onClick={()=>{scrollToSection("faq")}} 
                  className="text-neutral-70 hover:text-primary-50 font-medium text-base transition-colors"
                >
                  Contact
                </button>
              </div>

              {/* Buttons */}
              <div className="hidden md:flex space-x-3 items-center">
                {isLoggedIn ? (
                  <Link href={`${role == "user" ? "/user/dashboard" : (role == "teacher" || role == "instructor") ? "/teacher/course" : false} `}>
                    <div className="w-8 h-8 bg-primary-50 rounded-full flex items-center justify-center">
                      <IoMdPerson className="text-white text-lg" />
                    </div>
                  </Link> 
                ) : (
                  <>
                    <Link href={"/auth/login"}>
                      <button className="border border-primary-50 text-primary-50 px-6 py-2 rounded-lg hover:bg-primary-10 font-medium transition-colors text-base">
                        Login
                      </button>
                    </Link>
                    <Link href={"/auth/signup"}>
                      <button className="bg-primary-50 text-white px-6 py-2 rounded-lg hover:bg-primary-40 font-medium transition-colors text-base">
                        Sign In
                      </button>
                    </Link>
                  </>
                )}
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden flex items-center">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="text-neutral-70 focus:outline-none"
                >
                  {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>
          {/* Mobile Menu */}
          {isOpen && (
            <div className="md:hidden bg-white/90 backdrop-blur-md shadow-md p-4 space-y-4 flex flex-col border-t border-neutral-30">
              <button onClick={()=>{scrollToSection("features")}} className="block text-neutral-70 hover:text-primary-50 font-medium text-left text-base">
                Features
              </button>
              <button onClick={()=>{scrollToSection("course")}} className="block text-neutral-70 hover:text-primary-50 font-medium text-left text-base">
                Articles
              </button>
              <button onClick={()=>{scrollToSection("about")}} className="block text-neutral-70 hover:text-primary-50 font-medium text-left text-base">
                About Us
              </button>
              <button onClick={()=>{scrollToSection("faq")}} className="block text-neutral-70 hover:text-primary-50 font-medium text-left text-base">
                Contact
              </button>
              {isLoggedIn ? (
                <Link
                href={`${role == "user" ? "/user/dashboard" : role == "teacher" || role == "instructor"&&"/teacher/course"}`}
                className="w-full bg-primary-50 text-white px-4 py-2 rounded-lg hover:bg-primary-40 text-center font-medium"
              >
                Profile
              </Link>
              ) : (
                <>
                  <Link
                    href={"/auth/login"}
                    className="w-full border border-primary-50 text-primary-50 px-4 py-2 rounded-lg hover:bg-primary-10 text-center font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    href={"/auth/signup"}
                    className="w-full bg-primary-50 text-white px-4 py-2 rounded-lg hover:bg-primary-40 text-center font-medium"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          )}
        </nav>
      </div>
    </>
  );
}

export default Header;
