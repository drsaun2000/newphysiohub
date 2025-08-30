"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
const api_url = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function LoginPage() {
  const [firstVisit, setFirstVisit] = useState(true);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {

    const urlParams = new URLSearchParams(window.location.search);
    const urltoken = urlParams.get("token");
    const urluser = urlParams.get("user");

    if (!urltoken && !urluser) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      return;
    }
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    
    if (token && user) {
      
      window.history.pushState(null, '', window.location.href);
      window.onpopstate = function () {
        window.history.pushState(null, '', window.location.href);
      };
      
      if (user.role === "user") {
        router.replace("/user/dashboard");
      } else if (user.role === "teacher" || user.role === "instructor") {
        router.replace("/teacher/course");
      } else {
        router.replace("/");
      }
    }
  }, [router]);



  const handleForgotClick = () => {
    localStorage.setItem("otptype", "forgot");
    router.push("/auth/verify-email");
  };

  // useEffect(()=>{
  //   localStorage.removeItem("token")
  //   localStorage.removeItem("role")
  //   Cookies.remove("token")
  //   Cookies.remove("role")
  // },[])

  const validate = () => {
    const newErrors = {};
    const { email, password } = formData;

    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // clear field error
    setApiError(""); // clear api error
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await axios.post(`${api_url}/auth/login`, formData, {
        withCredentials: true,
      });
      const { token, user, message } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("user", JSON.stringify(user));
      
      if (!user.isEmailVerified) {
        router.push("/auth/verify-email");
        return;
      }
      
      const firstVisit = localStorage.getItem("firstVisit");
      if (firstVisit == "true") {
        router.replace("/onboarding");
      } else if (user.isEmailVerified) {
        const targetPath = user.role == "user" 
          ? "/user/dashboard" 
          : user.role == "teacher" || user.role == "instructor"
            ? "/teacher/course" 
            : "/";
        router.replace(targetPath);
      }
    } catch (error) {
      const errMsg = error.response?.data?.errorMessage?.message;
      setApiError(errMsg);
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setGoogleLoading(true);
    try {
      window.location.href = `${api_url}/auth/google`;
    } catch (error) {
      const errMsg = error.response?.data?.message;
      setApiError(errMsg);
    } finally {
      setGoogleLoading(false);
    }
  };

useEffect(()=>{
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");
  const user = urlParams.get("user");

  if (token && user) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", user);
    const userObj = JSON.parse(user);
    localStorage.setItem("role", userObj.role);

    const firstVisit = localStorage.getItem("firstVisit");

    if (firstVisit == "true") {
      router.replace("/onboarding");
    } else {
      const userObj = JSON.parse(localStorage.getItem("user"));
      const targetPath = userObj.role === "user" 
        ? "/user/dashboard" 
        : userObj.role === "teacher" || userObj.role === "instructor"
          ? "/teacher/course" 
          : "/";
      router.replace(targetPath);
    }
  }
}, [])


  return (
    <CardContent>
      <img
        className="md:flex lg:hidden hidden sm:w-[160px] w-full mb-10"
        src={"/logo-on-light.png"}
      />
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Login to Your Account
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Access your personalized dashboard by logging into your account.
      </p>

      {apiError && <p className="text-sm text-red-500 mb-3">{apiError}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Email Address
          </label>
          <Input
            placeholder="Enter your email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className={`mt-1 ${errors.email ? "border-red-500" : ""}`}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="text-sm font-medium text-gray-700">Password</label>
          <div className="relative">
            <Input
              placeholder="Enter your password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              className={`mt-1 ${errors.password ? "border-red-500" : ""}`}
            />
            <span
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="text-xl" />
              ) : (
                <Eye className="text-xl" />
              )}
            </span>
          </div>
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password}</p>
          )}
        </div>

        {/* Forgot Password */}
        <div
          className="text-right text-sm text-blue-600 cursor-pointer"
          onClick={handleForgotClick}
        >
          Forgot password?
        </div>

        {/* Submit */}
        <Button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>

        {/* Google */}
        <Separator className="my-2" />
      </form>
      <Button
        onClick={handleGoogleAuth}
        variant="outline"
        className="w-full flex items-center justify-center gap-2"
        disabled={googleLoading}
      >
        <FcGoogle className="text-lg" />{" "}
        {googleLoading ? "Loading..." : "Continue with Google"}
      </Button>

      {/* Sign Up */}
      <p className="text-sm text-center text-gray-600 mt-4">
        Don&apos;t have an account yet?{" "}
        <Link href={"/auth/signup"}>
          <span className="text-blue-600 cursor-pointer">Sign up</span>
        </Link>
      </p>
    </CardContent>
  );
}
