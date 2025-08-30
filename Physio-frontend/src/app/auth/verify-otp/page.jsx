"use client";

import usePost from "@/hooks/usePost";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

function VerifyOTP() {
  
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [email, setEmail] = useState("")
  const [resendOtp, setResendOtp] = useState(false)
  const [isVerified, setIsVerified] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180);
  const [isResendEnabled, setIsResendEnabled] = useState(false);
  const [ot, setOt] = useState("")
  const [error, setError] = useState(null)

  const router = useRouter();
  const inputRef = useRef(null);

  useEffect(()=>{
    setOt(localStorage.getItem("otptype"))
    setEmail(localStorage.getItem("email"))
  },[])

  useEffect(()=>{
   
    setOtp(new Array(6).fill(""))
    // startTimer()
    if(inputRef.current){
      inputRef.current.focus();
    }
  }, [resendOtp]);


  const handleResendOtp = () => {
    
    setIsResendEnabled(false);
    const {data, error, status} = usePost(`/auth/send-email-otp`)
    if(status == 200){
      
    }
  };

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);


  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };


  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (element, index, event) => {
    if (event.key === "Backspace") {
      if (element.previousSibling && !element.value) {
        element.previousSibling.focus();
      }
      setOtp([...otp.map((d, idx) => (idx === index ? "" : d))]);
    }
  };

  const handleOtpSubmit = async (e) =>{
    e.preventDefault();
    
    const otp_number = otp.join("");
    if(ot === "varify"){
      const {data, error, status} = await usePost(`/auth/verify-email`, {"otp": otp_number, "email" : email})
      if(status == 201){
        router.push("/auth/login")
      }
      if(error){
        setError(error)
      }
    } 
    if(ot === "forgot"){
      localStorage.setItem("otp" , otp_number)
      router.push("/auth/reset-password")
    }
   
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen  p-6">
        <div className="bg-white p-10 rounded-2xl shadow-md w-full max-w-xl text-center space-y-10">
        <Link href="/">
            <Image
              width={138}
              height={44}
              className="mx-auto mb-4"
              src="/logo-on-light.png"
              alt="logo"
            />
          </Link>
          <h2 className="text-2xl  font-[400]">Verify OTP</h2>
          <p className="text-gray-500 mt-2">
            Enter the OTP sent to{" "}
            <span className="font-medium">{email}</span>
          </p>
          <form onSubmit={handleOtpSubmit}>
          {/* OTP Inputs */}
          <div className="flex justify-center gap-3 mt-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                ref={index === 0 ? inputRef : null} 
                autoComplete="off"
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e.target, index, e)}
                className="w-12 h-12 text-center text-lg font-semibold border-2 border-[#7041FA ] rounded-lg focus:border-[#6f41fa7d] focus:ring-2 focus:ring-[#7041FA] outline-none transition-all"
              />
            ))}
          </div>
          {error && <p style={{ color: "red" , marginTop : "1px"}}>{error}</p>}

          {timeLeft > 0 && !isResendEnabled ? (
            <>
              <p className="text-md font-bold text-gray-500 mt-4">Time left: <span className="font-bold text-[#7041FA]">{formatTime(timeLeft)}</span>s</p>

              <button className={`py-2 px-8 bg-[#7041FA] rounded-md text-white font-semibold mt-5`} type="submit" disabled={otp.some((digit) => digit === "")}>
                submit
              </button>
            </>
          ) : (
            <p className="text-sm text-center mt-4">
              Didn't receive an email?
              <button className="text-[#068662] font-semibold" onClick={()=>{handleResendOtp()}}>
                &nbsp;
                RESEND OTP
              </button>
            </p>
          )}
            </form>

          {/* Success Message */}
          {isVerified && (
            <div className="flex items-center justify-center mt-4 text-green-600 font-medium">
              <i class="fa fa-check-circle" aria-hidden="true"></i>
              Code verified
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default VerifyOTP;
