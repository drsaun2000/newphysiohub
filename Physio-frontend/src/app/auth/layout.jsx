"use client";

import "./auth.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useEffect, useState, useRef } from "react";
// import { Card, CardContent } from "@/components/ui";
import { LineChart, Activity } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import LottiePlayer from "@/components/animations/LottiePlayer";
import run from "@/components/animations/data/Like.json"

const data = [
    { label: "Jan", value: 40 },
    { label: "Feb", value: 80 },
    { label: "Mar", value: 60 },
    { label: "Apr", value: 30 },
    { label: "May", value: 45 },
    { label: "Jun", value: 70 },
];

const slides = [
    {
        title: "Master Your Physiotherapy Skills Now!",
        description:
            "Maximize your physiotherapy skills with our expert-led courses and tailored resources.",
    },
    {
        title: "Build Stronger Recovery Programs",
        description:
            "Learn how to design effective and safe recovery routines for all kinds of patients.",
    },
    {
        title: "Stay Ahead with Modern Techniques",
        description:
            "Explore the latest in physiotherapy methods and technologies, all in one platform.",
    },
];

export default function AuthLayout({ children }) {

    const [animated, setAnimated] = useState(false);
    const [percent, setPercent] = useState(0);
    const directionRef = useRef(1);

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
        const timeout = setTimeout(() => setAnimated(true), 3000);
        return () => clearTimeout(timeout);
    }, []);

    return (
        <div className="h-screen w-full flex flex-col lg:flex-row sm:p-10 sm:pt-0 pt-10" >
            <div className="hidden lg:flex lg:w-1/2 xl:w-2/5 mt-10 flex-col bg-[#9333EA] rounded-3xl pt-5 pl-8 pr-8 pb-10 relative">
                <img src={'/logo-on-dark.png'} className="w-45 h-10 mb-10" />

                <div className="text-white w-full flex flex-col justify-between  p-2">
                    <Swiper
                        modules={[Pagination, Autoplay]}
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 3000 }}
                        loop
                        className="w-full"
                    >
                        {slides.map((item, index) => (
                            <SwiperSlide key={index}>
                                <div className="space-y-3 text-left">
                                    <h2 className="text-2xl font-bold">{item.title}</h2>
                                    <p className="text-base">{item.description}</p>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <div className="flex w-[100%]">
                        {/* First Column (takes max space) */}
                        <div className="flex-1 flex flex-col  justify-between">
                            <Card className="w-full max-w-[14rem] rounded-[20px] shadow-md overflow-hidden mb-2 self-end">
                                <CardContent className="">
                                    <div className="flex justify-between items-start">
                                        <div className="flex flex-col items-start gap-1">
                                            <p className="text-sm font-medium text-black">Over time</p>
                                            <h2 className="text-2xl font-bold text-black">$40K</h2>
                                            <p className="text-xs text-gray-500">Last 7 days</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <LineChart className="h-5 w-5 text-purple-500" />

                                            <div className="text-xs px-2 py-[2px] rounded-full bg-purple-100 text-purple-700 font-medium flex items-center gap-1">
                                                <Activity className="w-3 h-3" />
                                                25%
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-full h-full relative rounded-lg overflow-hidden">
                                        <img
                                            src="/auth-activity.png"
                                            alt="Muscle Stats"
                                            // fill
                                            className="object-cover"
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="w-[18rem] rounded-[20px] bg-white shadow-md">
                                <CardContent className="flex flex-col justify-between">
                                    <h3 className="text-[#1F1F1F] text-[16px] font-semibold mb-6">
                                        Performance over time
                                    </h3>
                                    <div className="flex justify-between items-end">
                                        {data.map((item, index) => (
                                            <div key={index} className="flex flex-col items-center">
                                                <div className="w-[20px] h-[100px] bg-gray-200 rounded-sm overflow-hidden relative">
                                                    <div
                                                        className={`absolute bottom-0 w-full bg-[#F593D5] rounded-sm animate-bar`}
                                                        style={{
                                                            height: `${item.value}%`,
                                                            animationDelay: `${index * 0.2}s`,
                                                        }}
                                                    />
                                                </div>
                                                <span className="text-[12px] text-[#333]">{item.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Second Column (fits content) */}
                        <div className="flex-none flex mt-38 justify-center text-center w-1/2">
                            {/* Your content here */}
                            <Card className="w-[11rem] rounded-[20px] shadow-md relative overflow-visible h-fit">
                                <div className="absolute -top-32 right-0 z-10">
                                    {/* <img
                                        src="/bird-ping.png" // Replace with your penguin image path
                                        alt="Penguin"
                                        width={100}
                                        height={100}
                                    // fill
                                    /> */}
                                    <LottiePlayer animationFile={run} width="150px" height="100px" />

                                </div>

                                <CardContent className="flex flex-col items-center justify-center mt-4">
                                    <h3 className="text-[22px] font-semibold text-gray-800 mb-4 w-full">
                                        Quiz Score
                                    </h3>

                                    <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
                                        <circle
                                            stroke="#E5E7EB"
                                            fill="transparent"
                                            strokeWidth={stroke}
                                            r={normalizedRadius}
                                            cx={radius}
                                            cy={radius}
                                        />
                                        <circle
                                            stroke="#34D1C4"
                                            fill="transparent"
                                            strokeWidth={stroke}
                                            strokeLinecap="round"
                                            strokeDasharray={circumference}
                                            strokeDashoffset={strokeDashoffset}
                                            r={normalizedRadius}
                                            cx={radius}
                                            cy={radius}
                                        />
                                    </svg>

                                    <span className="absolute text-xl font-bold text-[#111] mt-11 ml-2">
                                        {Math.round(percent)}%
                                    </span>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full sm:lg:w-3/5 max-w-full flex items-center justify-center sm:p-6 p-3 sm:pt-0 pt-10">
                {children}
            </div>
        </div>
    );
}