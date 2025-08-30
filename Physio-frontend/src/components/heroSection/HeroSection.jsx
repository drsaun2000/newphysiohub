"use client"
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import happy from "@/components/animations/data/Happy.json";
import LottiePlayer from "@/components/animations/LottiePlayer";

const HeroSection = (href) => {
    const [token, setToken] = useState(false)
    const [role, setRole] = useState("")
  
    useEffect(()=>{
      const token = localStorage.getItem("token")
      const role = JSON.parse(localStorage.getItem("user"))?.role
      if(role){
        setRole(role)
      }
      if(token){
        setToken(true)
      }
    },[])
  
  return (
    <div className="bg-gradient-to-br from-[#7C3AED] via-[#8B5CF6] to-[#A855F7] text-white rounded-3xl px-8 py-16 text-center relative overflow-hidden w-full mx-auto max-w-7xl">
      {/* Background Vector */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/footer/footer_vector.png"
          alt="Background Vector"
          fill
          className="object-cover opacity-30"
          quality={100}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Top Badge */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2">
            <Sparkles className="w-4 h-4 text-white" fill="currentColor" />
            <span className="text-sm font-semibold uppercase tracking-wide">
              TOP #1 EXPERT-LED COURSES
            </span>
          </div>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
          Make physiohub<br />
          your learning<br />
          partner
        </h1>
        
        {/* Description */}
        <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto">
          Maximize your physiotherapy skills with our expert-led courses and tailored resources.
        </p>
        
        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link 
            href={`${token ? role == "user" ? "/user/dashboard" : "/teacher/course" :"/auth/login"}`} 
            className="bg-white text-[#7C3AED] px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 text-lg shadow-lg"
          >
            Get Started
          </Link>
          <button className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/30 transition-all duration-300 text-lg">
            Complete Quiz
          </button>
        </div>
      </div>
      {/* Character Image */}
      <div className="absolute right-2 bottom-0 z-20 hidden md:block">
          <LottiePlayer animationFile={happy} width="100%" height="100%"/>
      </div>

      {/* Mobile Character */}
      <div className="absolute right-4 bottom-4 z-20 md:hidden">
          <LottiePlayer animationFile={happy} width="120px" height="120px"/>
      </div>
    </div>
  );
};

export default HeroSection;
