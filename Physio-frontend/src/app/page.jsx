"use client";
import React, { useEffect, useRef, useState } from "react";
import Header from "../components/header&footer/Header.jsx";
import Footer from "../components/header&footer/Footer.jsx";
import Image from "next/image";
import { Card, CardContent } from "../components/ui/card";
import { BadgeCheck, Check, Sparkles, ChevronLeft, ChevronRight, MessageSquareQuote,  BarChart3, FileText, Headphones, LayoutDashboard, FolderOpen } from "lucide-react";
import { FaStar } from "react-icons/fa";
import Accordion from "../components/accordian/Accordion.jsx"
import BlogCard from "../components/blogCard/BlogCard.jsx"
import HeroSection from "../components/heroSection/HeroSection.jsx"
import LottiePlayer from "../components/animations/LottiePlayer";
import happy from "../components/animations/data/Happy.json";
import run from "../components/animations/data/Run.json";
import Link from "next/link";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation.js";
import exersize from "../components/animations/data/Exersize.json";

const testimonials = [
  {
    company: "Tailwind",
    quote:
      "This app transformed our support operations. Response time reduced, leading to a rise in customer satisfaction.",
    name: "Frederic Hill",
    position: "Data Engineer at Tailwind",
  },
  {
    company: "HubSpot",
    quote:
      "We experienced a significant reduction in support tickets thanks to the intuitive AI features. Support was prompt to assist us.",
    name: "Safaa Sampson",
    position: "Front-end at Hubspot",
  },
  {
    company: "Google",
    quote:
      "This software integrated seamlessly with our existing tools. It helped us manage a huge increase in customer inquiries.",
    name: "Brendan Buck",
    position: "CEO at Google",
  },
  {
    company: "Microsoft",
    quote:
      "The platform's intuitive design made it easy for our team to adopt. We saw immediate improvements in our workflow efficiency.",
    name: "Sarah Johnson",
    position: "Product Manager at Microsoft",
  },
  {
    company: "Apple",
    quote:
      "Outstanding customer support and robust features. This tool has become essential for our daily operations.",
    name: "Michael Chen",
    position: "Senior Developer at Apple",
  },
  {
    company: "Amazon",
    quote:
      "The analytics and reporting features provided insights we never had before. Highly recommend for any growing business.",
    name: "Emily Rodriguez",
    position: "Operations Lead at Amazon",
  },
  {
    company: "Netflix",
    quote:
      "Seamless integration and excellent performance. Our team productivity has increased significantly since implementation.",
    name: "David Thompson",
    position: "Engineering Manager at Netflix",
  },
  {
    company: "Spotify",
    quote:
      "The user experience is exceptional. Clean interface, powerful features, and reliable performance across all devices.",
    name: "Lisa Wang",
    position: "UX Designer at Spotify",
  },
  {
    company: "Tesla",
    quote:
      "Revolutionary approach to problem-solving. The innovative features have streamlined our processes beyond expectations.",
    name: "Alex Martinez",
    position: "Technical Lead at Tesla",
  },
];

const TestimonialCard = ({ company, quote, name, position }) => {
  const getInitials = (name) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };

  const getRandomColor = (name) => {
    const colors = [
      'bg-purple-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
      'bg-red-500', 'bg-indigo-500', 'bg-pink-500', 'bg-teal-500'
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  return (
    <div className="bg-gray-50 p-4 md:p-8 rounded-2xl w-full h-full text-left border transition-all duration-300 flex flex-col">
      <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-6 md:mb-8 flex-grow">"{quote}"</p>
      <div className="flex items-center gap-3 mt-auto">
        <div className={`w-10 h-10 md:w-12 md:h-12 ${getRandomColor(name)} rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0`}>
          <span className="text-xs md:text-sm">{getInitials(name)}</span>
        </div>
        <div>
          <p className="font-semibold text-gray-900 text-sm md:text-base">{name}</p>
          <p className="text-xs md:text-sm text-gray-500">{position}</p>
        </div>
      </div>
    </div>
  );
};

function Home() {
  const featuresRef = useRef(null);
  const faqRef = useRef(null);
  const courseRef = useRef(null);
  const aboutRef = useRef(null);

  const [animated, setAnimated] = useState(false);
  const [percent, setPercent] = useState(0);
  const directionRef = useRef(1);
  const [token, setToken] = useState(false)
  const [role, setRole] = useState("")
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [gifTimestamp, setGifTimestamp] = useState("");

  useEffect(()=>{
    const token = localStorage.getItem("token")
    const role = JSON.parse(localStorage.getItem("user"))?.role
    if(role){
      setRole(role)
    }
    if(token){
      setToken(true)
    }
    // Set timestamp once on mount to force GIF reload
    setGifTimestamp(Date.now().toString());
  },[])

  const data = [
    { label: "Jan", value: 40 },
    { label: "Feb", value: 80 },
    { label: "Mar", value: 60 },
    { label: "Apr", value: 30 },
    { label: "May", value: 45 },
    { label: "Jun", value: 70 },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPercent((prev) => {
        let next = prev + directionRef.current;
        if (next >= 70) directionRef.current = -1;
        else if (next <= 0) directionRef.current = 1;
        return next;
      });
    }, 55); // Slower animation speed (30ms per step)

    return () => clearInterval(interval);
  }, []);

  const radius = 40;
  const stroke = 8;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  useEffect(() => {
    const timeout = setTimeout(() => setAnimated(true), 4000);
    return () => clearTimeout(timeout);
  }, []);
  

  const scrollToSection = (key) => {
    const refs = {
      features: featuresRef,
      faq: faqRef,
      course: courseRef,
      about: aboutRef,
    };

    refs[key]?.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Header scrollToSection={scrollToSection} />
      <div className="h-full w-full relative overflow-hidden">
        <section className="relative min-h-screen bg-gradient-to-b from-white via-primary-10 to-[#7240FD]/20 py-20 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/hero/hero_bg_vector.png"
              alt="Background Vector"
              fill
              className="object-cover opacity-80"
              quality={100}
              priority
            />
          </div>

          {/* Dashboard Cards - Positioned at screen edges */}
          {/* Quiz Score Card - Top Left Edge */}
          <div className="absolute top-24 -left-20 z-20 md:block hidden">
            <img
              src={`/hero/quizscore.gif?t=${gifTimestamp}`}
              alt="Quiz Score"
              width={320}
              height={240}
              className="rounded-2xl"
            />
          </div>

          {/* Performance Chart - Bottom Left Edge */}
          <div className="absolute bottom-16 -left-40 z-20 md:block hidden">
            <img
              src={`/hero/performance_overtime.gif?t=${gifTimestamp}`}
              alt="Performance Over Time"
              width={540}
              height={200}
              className="rounded-2xl"
            />
          </div>

          {/* Over Time Card - Top Right Edge */}
          <div className="absolute top-24 -right-42 z-20 md:block hidden">
            <img
              src={`/hero/overtime.gif?t=${gifTimestamp}`}
              alt="Over Time Statistics"
              width={540}
              height={200}
              className="rounded-2xl"
            />
          </div>

          {/* Longest Streak Card - Bottom Right Edge */}
          <div className="absolute bottom-10 -right-30 z-20 md:block hidden">
            <img
              src={`/hero/longest_streak.gif?t=${gifTimestamp}`}
              alt="Longest Streak"
              width={480}
              height={180}
              className="rounded-2xl"
            />
          </div>

          {/* Lottie Animations */}
          {/* Lottie on top right of Performance Chart */}
          <div className="absolute bottom-96 left-46 z-30 md:block hidden">
            <div className="w-16 h-16 md:w-20 md:h-20">
              <LottiePlayer animationFile={happy} width="150%" height="150%" />
            </div>
          </div>

          {/* Lottie on top left of Longest Streak */}
          <div className="absolute bottom-96 right-54 z-30 md:block hidden">
            <div className="w-16 h-16 md:w-20 md:h-20">
              <LottiePlayer animationFile={exersize} width="150%" height="150%" />
            </div>
          </div>

           {/* Center Content */}
          <div className="relative z-30 flex flex-col items-center justify-center min-h-[80vh] text-center max-w-7xl mx-auto">
            {/* Top Badge */}
            <div>
              <div className="inline-flex items-center gap-2 px-6 py-3">
                <Sparkles className="text-primary-50" />
                <span className="text-sm font-normal text-primary-50 uppercase tracking-wide">
                Your #1 Learning Partner
                </span>
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-neutral-90 leading-tight mb-4 max-w-5xl">
              Master Your{" "}
              <br />
              <span className="text-primary-50">Physiotherapy</span>
              <br />
              Skills Now!
            </h1>
            
            {/* Description */}
            <p className="text-xl md:text-xl text-neutral-60 mb-10 max-w-3xl">
              Maximize your physiotherapy skills with our expert-led courses and tailored resources.
            </p>
            
            {/* Buttons */}
            <div className="flex gap-6 justify-center">
              <Link
                href={`${token ? role == "user" ? "/user/dashboard" : "/teacher/course" :"/auth/login"}`}
                className="bg-primary-50 text-white px-10 py-5 rounded-xl font-semibold hover:bg-primary-40 transition-all duration-300 text-xl"
              >
                Get Started
              </Link>
              <button className="bg-[#7240FD]/10 text-[#7240FD] px-10 py-5 rounded-xl font-semibold hover:bg-[#7240FD]/20 transition-all duration-300 text-xl">
                Complete Quiz
              </button>
            </div>
          </div>

          {/* Mobile Dashboard Cards */}
          <div className="grid grid-cols-2 gap-4 px-4 mt-12 md:hidden">
            <img
              src={`/hero/quizscore.gif?t=${gifTimestamp}`}
              alt="Quiz Score"
              width={180}
              height={180}
              className="rounded-xl"
            />
            <img
              src={`/hero/overtime.gif?t=${gifTimestamp}`}
              alt="Over Time Statistics"
              width={180}
              height={180}
              className="rounded-xl"
            />
            <img
              src={`/hero/performance_overtime.gif?t=${gifTimestamp}`}
              alt="Performance Over Time"
              width={180}
              height={180}
              className="rounded-xl"
            />
            <img
              src={`/hero/longest_streak.gif?t=${gifTimestamp}`}
              alt="Longest Streak"
              width={180}
              height={180}
              className="rounded-xl"
            />
          </div>
        </section>

        <section  ref={aboutRef} className="py-16 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto flex flex-col items-center gap-12">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3">
              <FolderOpen className="text-primary-50 w-5 h-5" />
              <span className="text-sm font-medium text-primary-50 uppercase tracking-wide">
                OVER 200+ RESOURCES
              </span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 leading-tight mt-2">
              Transform Your <br />
              Physiotherapy Learning
            </h1>
            <p className="text-gray-600 mt-4 max-w-md justify-self-center">
              Physiohub is a learning platform designed to help budding
              physiotherapists perfect their craft and become industry experts.
            </p>
          </div>
          <div className=" grid md:grid-cols-2 grid-cols-1 items-center gap-20">
            {/* Left Video Section */}
            <div className="flex justify-center items-center relative overflow-hidden">
              {/* Video Container */}
              <div className="relative z-30 w-full max-w-md">
                <video
                  className="w-full h-auto rounded-2xl shadow-lg"
                  autoPlay
                  muted
                  loop
                  preload="metadata"
                >
                  <source src="/videos/flash_cards.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>

            {/* Right Text Section */}
            <div className=" text-center md:text-left">
              <p className="text-xs font-semibold text-[#7240FD] uppercase tracking-wide mb-4">
                NO SIGN UP REQUIRED
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-6">
                Learn with Flash Cards
              </h2>
              <p className="text-gray-600 mt-4 mb-8 leading-relaxed">
                Master key concepts and terms with our interactive flashcards. A
                perfect tool for quick revisions and reinforcing your learning,
                making complex information easy to remember.
              </p>
              <div className="mt-6 mb-10 space-y-4">
                <div className="flex items-start gap-3 text-left">
                  <div className="w-6 h-6 bg-gradient-to-b from-[#9C7DF3] to-[#7240FD] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    1000+ pre made flashcard
                  </p>
                </div>
                <div className="flex items-start gap-3 text-left">
                  <div className="w-6 h-6 bg-gradient-to-b from-[#9C7DF3] to-[#7240FD] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    Effortless Memorization with spaced repetition
                  </p>
                </div>
                <div className="flex items-start gap-3 text-left">
                  <div className="w-6 h-6 bg-gradient-to-b from-[#9C7DF3] to-[#7240FD] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    Spaced repetition
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className=" grid md:grid-cols-2 grid-cols-1 items-center gap-20 mt-38">
            {/* Left Text Section */}
            <div className=" text-center md:text-left">
              <p className="text-xs font-semibold text-[#FF7F04] uppercase tracking-wide">
                MULTIPLE CHOICE QUIZZES
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4 mb-6">
                Interesting quiz
              </h2>
              <p className="text-gray-600 mt-4 mb-8 leading-relaxed">
                Designed exclusively for aspiring and practicing
                physiotherapists, our comprehensive quiz are crafted to enhance
                your knowledge, skills, and confidence.
              </p>
              <div className="mt-6 mb-10 space-y-4">
                <div className="flex items-start gap-3 text-left">
                  <div className="w-6 h-6 bg-gradient-to-b from-[#FFA44D] to-[#FF7F04] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    Time-based quizzes to improve your quick thinking and
                    diagnostics
                  </p>
                </div>
                <div className="flex items-start gap-3 text-left">
                  <div className="w-6 h-6 bg-gradient-to-b from-[#FFA44D] to-[#FF7F04] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    Personalized Dashboard
                  </p>
                </div>
                <div className="flex items-start gap-3 text-left">
                  <div className="w-6 h-6 bg-gradient-to-b from-[#FFA44D] to-[#FF7F04] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    Accessible anywhere anytime
                  </p>
                </div>
              </div>
            </div>

            {/* Right Video Section */}
            <div className="flex justify-center items-center relative overflow-hidden">
              {/* Video Container */}
              <div className="relative z-30 w-full max-w-md">
                <video
                  className="w-full h-auto rounded-2xl shadow-lg"
                  autoPlay
                  muted
                  loop
                  preload="metadata"
                >
                  <source src="/videos/quiz_video.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>
          <div className=" grid md:grid-cols-2 grid-cols-1 items-center gap-20 mt-38">
            {/* Left Video Section */}
            <div className="flex justify-center items-center relative overflow-hidden">
              {/* Video Container */}
              <div className="relative z-30 w-full max-w-md">
                <video
                  className="w-full h-auto rounded-2xl shadow-lg"
                  autoPlay
                  muted
                  loop
                  preload="metadata"
                >
                  <source src="/videos/blogs.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>

            {/* Right Text Section */}
            <div className=" text-center md:text-left">
              <p className="text-xs font-semibold text-[#2CCFB9] uppercase tracking-wide mb-4">
                INFORMATIVE ARTICLES
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-6">
                Informative Blogs
              </h2>
              <p className="text-gray-600 mt-4 mb-8 leading-relaxed">
                Stay updated with the latest trends, research, and best practices in
                physiotherapy. Our blogs are written by experienced professionals,
                providing valuable insights and continuous learning opportunities.
              </p>
              <div className="mt-6 mb-10 space-y-4">
                <div className="flex items-start gap-3 text-left">
                  <div className="w-6 h-6 bg-gradient-to-b from-[#4CDBC8] to-[#0CC2AA] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    75+ informative articles and rehab protocols
                  </p>
                </div>
                <div className="flex items-start gap-3 text-left">
                  <div className="w-6 h-6 bg-gradient-to-b from-[#4CDBC8] to-[#0CC2AA] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    No sign up required, access our blog completely free
                  </p>
                </div>
                <div className="flex items-start gap-3 text-left">
                  <div className="w-6 h-6 bg-gradient-to-b from-[#4CDBC8] to-[#0CC2AA] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    Complete guide to physio
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section  ref={featuresRef} className="py-16 px-6 md:px-12 lg:px-24 flex flex-col items-center gap-12 bg-[#F6F9FC]">
          <div className="text-center max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-4">
              <LayoutDashboard className="text-primary-50 h-5 w-5" />
              <span className="text-primary-50 text-sm font-semibold uppercase tracking-wide">
                YOUR OWN DASHBOARD
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
              The Tools You Really Need
            </h1>
            <p className="text-gray-600 text-lg max-w-lg mx-auto">
              Physiohub is a learning platform designed to help budding
              physiotherapists perfect their craft and become industry experts.
            </p>
          </div>

          {/* Dashboard Preview */}
          <div className="w-full max-w-6xl mx-auto relative">
            <div className="relative">
              <Image
                src="/dashboard_preview.png"
                alt="Dashboard Preview"
                width={1200}
                height={700}
                className="w-full h-auto rounded-3xl shadow-2xl"
                quality={100}
                priority
              />
              {/* Lottie Mascot - Bottom Right */}
              <div className="absolute bottom-20 right-20 w-16 h-16 md:w-20 md:h-20 z-10">
                <LottiePlayer animationFile={run} width="200%" height="200%" />
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="w-full max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xs overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-3">
                {/* Online Support */}
                <div className="p-8 relative">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 flex items-center justify-center">
                      <Headphones className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Online Support</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    We're here for you 24/7 including holidays and more
                  </p>
                  {/* Small separator in middle */}
                  <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-16 bg-gray-200"></div>
                </div>

                {/* Analytics */}
                <div className="p-8 relative border-t md:border-t-0 border-gray-200">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-orange-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Analytics</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    Dive deep into comprehensive analytics to track your goals
                  </p>
                  {/* Small separator in middle */}
                  <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-16 bg-gray-200"></div>
                </div>

                {/* Reports */}
                <div className="p-8 border-t md:border-t-0 border-gray-200">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-teal-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Reports</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    Hyper detailed reports with team information across all channels.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-6 md:px-12 lg:px-24 flex flex-col items-center gap-12">
          <div className="text-center max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-4">
              <MessageSquareQuote className="text-primary-50 h-5 w-5" />
              <span className="text-primary-50 text-sm font-semibold uppercase tracking-wide">
                TESTIMONIALS
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
              Hear from Our Happy<br />
              Users
            </h1>
            <p className="text-gray-600 text-lg max-w-lg mx-auto">
              Physiohub is a learning platform designed to help budding
              physiotherapists perfect their craft and become industry experts.
            </p>
          </div>

          {/* Testimonials Carousel */}
          <div className="w-full max-w-7xl mx-auto relative px-4 md:px-16">
            <div className="overflow-hidden">
              <div 
                className="flex gap-4 md:gap-6 transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${currentTestimonial * 100}%)`
                }}
              >
                {Array.from({ length: Math.ceil(testimonials.length / 3) }).map((_, pageIndex) => (
                  <div key={pageIndex} className="flex gap-4 md:gap-6 w-full flex-shrink-0">
                    {testimonials.slice(pageIndex * 3, pageIndex * 3 + 3).map((testimonial, index) => (
                      <div
                        key={pageIndex * 3 + index}
                        className="flex-1 min-h-[240px] md:min-h-[280px]"
                      >
                        <TestimonialCard {...testimonial} />
                      </div>
                    ))}
                    {/* Fill empty slots if less than 3 testimonials on last page */}
                    {testimonials.slice(pageIndex * 3, pageIndex * 3 + 3).length < 3 && 
                      Array.from({ length: 3 - testimonials.slice(pageIndex * 3, pageIndex * 3 + 3).length }).map((_, emptyIndex) => (
                        <div key={`empty-${emptyIndex}`} className="flex-1 min-h-[240px] md:min-h-[280px]"></div>
                      ))
                    }
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows - Positioned outside */}
            <button
              onClick={() => setCurrentTestimonial(prev => prev > 0 ? prev - 1 : Math.ceil(testimonials.length / 3) - 1)}
              className="absolute left-0 md:left-0 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow z-10"
              disabled={testimonials.length <= 3}
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
            </button>
            <button
              onClick={() => setCurrentTestimonial(prev => prev < Math.ceil(testimonials.length / 3) - 1 ? prev + 1 : 0)}
              className="absolute right-0 md:right-0 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow z-10"
              disabled={testimonials.length <= 3}
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
            </button>

            {/* Pagination Dots */}
            {Math.ceil(testimonials.length / 3) > 1 && (
              <div className="flex justify-center gap-2 mt-6 md:mt-8">
                {Array.from({ length: Math.ceil(testimonials.length / 3) }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                      index === currentTestimonial 
                        ? 'bg-primary-50 w-6 md:w-8' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        <section ref={faqRef} className="py-16 px-6 md:px-12 lg:px-24 flex flex-col items-center gap-12 bg-[#F6F9FC]">
              <Accordion/>
        </section>

        <section ref={courseRef} className="scroll-mt-20 py-16 px-6 md:px-12 lg:px-24 flex flex-col items-center gap-12 bg-white">
              <BlogCard/>
        </section>

        <section className="py-16 px-6 md:px-12 lg:px-24 flex flex-col items-center gap-12 bg-[#F6F9FC]">
              <HeroSection/>
        </section>
      </div>
      <Footer scrollToSection={scrollToSection}/>
    </>
  );
}

export default Home;
