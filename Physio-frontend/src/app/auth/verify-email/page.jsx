"use client";

import usePost from "@/hooks/usePost";
import { Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifyEmail() {
  const [email, setEmail] = useState("");
  const [otpType, setOtpType] = useState("verify")
  const [isValid, setIsValid] = useState("");
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter();
  useEffect(()=>{
    const otptype = localStorage.getItem("otptype")
    
    if(otptype){
      setOtpType(otptype)
    }
  },[])

  const handleInputChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    setIsValid(emailRegex.test(newEmail)); // Update validation state
  };

  const handleVerify = async(e) => {
    setLoading(true)
    e.preventDefault();
    console.log(otpType)
    if(otpType == "varify"){
      console.log("called")
      const {data, error, status} = await usePost(`/auth/send-email-otp`, {"email" : email} )
      if(status == 201){
        router.push(`/auth/verify-otp`)
      }
      if(error){
        setLoading(false)
        setError(error)
      }
    }

    if(otpType == "forgot"){
      const {data, error, status} = await usePost(`/auth/forgot-password`, {"email" : email} )
      if(status == 201){
        router.push(`/auth/verify-otp`)
      }
      if(error){
        setError(error)
        setLoading(false)
      }
    }
  };


  return (
    <>
      <section className="relative bg-white sm:py-12 md:py-16">
        <div className="container mx-auto relative z-10">
          <div
            className="flex justify-center"
            data-aos="fade-left"
            data-aos-delay="300"
          >
            <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-8 sm:p-6 space-y-10">
              {/* Logo and Header */}
              <div className="text-center space-y-5">
                <Link href="/">
                  <Image
                    width={138}
                    height={44}
                    className="mx-auto mb-4"
                    src="/logo-on-light.png"
                    alt="logo"
                  />
                </Link>
                {/* className="h-20 w-20 mx-auto" */}
                <Mail className="mx-auto text-purple-600" size={50} />
                <h2 className="text-2xl font-semibold">
                  Please verify your Email
                </h2>
                <p className="text-gray-500 text-sm">
                  We’ll send a one-time password (OTP) to your email address.
                </p>
              </div>

              {/* Email Form */}
              <form onSubmit={handleVerify} className="space-y-6">
                <div>
                  <label htmlFor="email" className="sr-only">
                    Email address
                  </label>
                  <div className="flex items-center gap-3 border rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-purple-500">
                    <input
                      id="email"
                      type="email"
                      placeholder="Please Enter Your Email Address"
                      value={email}
                      onChange={handleInputChange}
                      required
                      className="flex-1 outline-none text-sm"
                    />
                    {isValid && (
                      <i
                        className="fa fa-check text-green-500"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  <p className="text-sm text-gray-400 mt-1 ms-1">
                    OTP will be sent to this email
                  </p>
                </div>
                    {error&&<p className="text-red-500 my-5">{error}</p>}
                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!isValid||loading}
                  className={`w-full py-2 px-4 rounded-md text-white font-medium transition duration-200 ${
                    isValid || loading
                      ? "bg-[#7041FA] hover:bg-[#5c3ed2da] cursor-pointer"
                      : "bg-[#a385ff] cursor-not-allowed"
                  }`}
                >
                  {loading ? "Sending...":"Send OTP"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
