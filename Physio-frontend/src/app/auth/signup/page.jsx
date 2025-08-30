'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { CardContent } from "../../../components/ui/card";
import { Separator } from "../../../components/ui/separator";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import usePost from '@/hooks/usePost';
const api_url = process.env.NEXT_PUBLIC_API_BASE_URL
export default function SignUpPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    password: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState({ type: '', text: '' });

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    setFormErrors(prev => ({ ...prev, [field]: '' }));
    setResponseMessage({ type: '', text: '' });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Full Name is required.";
    if (!formData.email.trim()) errors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Enter a valid email.";

    if (!formData.mobileNumber.trim()) errors.mobileNumber = "Mobile number is required.";
    else if (!/^\d{10}$/.test(formData.mobileNumber)) errors.mobileNumber = "Enter a valid 10-digit mobile number.";

    if (!formData.password) errors.password = "Password is required.";
    else if (formData.password.length < 6) errors.password = "Password must be at least 6 characters.";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const res = await axios.post(`${api_url}/auth/register`, formData);

      setResponseMessage({ type: 'success', text: res?.data?.message || 'Registration successful!' });
      if(res.status){
        const {data, error, status} = await usePost(`/auth/send-email-otp`, {"email": formData.email})
        if(status == 201){
          localStorage.setItem("otptype" , "varify")
          localStorage.setItem("firstVisit", true)
          router.push("/auth/verify-otp")
          localStorage.setItem("email" , formData.email)
        }
      }
      // Redirect to onboarding after a short delay
      // setTimeout(() => router.push('/onboarding'), 1500);
    } catch (error) {
      const errorMsg = error.response?.data?.errorMessage?.message;
      setResponseMessage({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const role = params.get("role");
  
    if (token) {
      Cookies.set("token", token)
      Cookies.set("role", role)
      router.push("/"); // or wherever you want
    }
  }, []);
  
  const handleGoogleAuth = async()=>{
      try {
        localStorage.setItem("firstVisit", true)
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        localStorage.removeItem("role")
        // const response = await axios.get(`${api_url}/auth/google`,{
        //   withCredentials: true
        // });
        window.location.href = `${api_url}/auth/google`;

        const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      const user = urlParams.get('user');
      console.log(token)
      if (token && user) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", user);
        const userObj = JSON.parse(user);
        localStorage.setItem("role", userObj.role);
        
      }
        // Store in localStorage (or cookies, or context)
        // localStorage.setItem("user", JSON.stringify(user));
        // if(!user.isEmailVerified){
        //   router.push("/auth/verify-email")
        // }
        // const firstVisit = localStorage.getItem("firstVisit")
        // if(firstVisit == true){
        //   router.push("/onboarding");
        // } else {
        //   router.push("/")
        // }

  
      } catch (error) {
        const errMsg =
          error.response?.data?.message;
          setResponseMessage({ type: 'error', text: errMsg });
      } finally {
        setLoading(false);
      }
    }

  return (
    <CardContent>
      <img className="md:flex lg:hidden hidden w-[160px] mb-10" src={'/logo-on-light.png'} />
      <h2 className="text-xl font-bold text-gray-900 mb-4">Sign up</h2>
      <p className="text-sm text-gray-500 mb-4">Join our community and start your learning journey today!</p>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Full Name */}
        <div>
          <label className="text-sm font-medium text-gray-700">Full Name</label>
          <Input
            placeholder="Enter your full Name"
            value={formData.name}
            onChange={handleChange('name')}
            className={`mt-1 ${formErrors.name ? 'border-red-500' : ''}`}
          />
          {formErrors.name && <p className="text-sm text-red-500">{formErrors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="text-sm font-medium text-gray-700">Email Address</label>
          <Input
            placeholder="Enter your email"
            type="email"
            value={formData.email}
            onChange={handleChange('email')}
            className={`mt-1 ${formErrors.email ? 'border-red-500' : ''}`}
          />
          {formErrors.email && <p className="text-sm text-red-500">{formErrors.email}</p>}
        </div>

        {/* Mobile */}
        <div>
          <label className="text-sm font-medium text-gray-700">Mobile Number</label>
          <Input
            placeholder="Enter your mobile number"
            type="tel"
            value={formData.mobileNumber}
            onChange={handleChange('mobileNumber')}
            className={`mt-1 ${formErrors.mobileNumber ? 'border-red-500' : ''}`}
            maxLength={10}
          />
          {formErrors.mobileNumber && <p className="text-sm text-red-500">{formErrors.mobileNumber}</p>}
        </div>

        {/* Password */}
        <div className="relative">
          <label className="text-sm font-medium text-gray-700">Password</label>
          <Input
            placeholder="Enter your password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange('password')}
            className={`mt-1 pr-10 ${formErrors.password ? 'border-red-500' : ''}`}
          />
          <span
            className="absolute right-3 top-[38px] cursor-pointer text-gray-500"
            onClick={() => setShowPassword(prev => !prev)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
          {formErrors.password && <p className="text-sm text-red-500">{formErrors.password}</p>}
        </div>

        {/* Response Message */}
        {responseMessage.text && (
          <p className={`text-sm text-center ${responseMessage.type === 'error' ? 'text-red-500' : 'text-green-600'}`}>
            {responseMessage.text}
          </p>
        )}

        {/* Submit */}
        <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white" disabled={loading}>
          {loading ? "Creating Account..." : "Create Account"}
        </Button>

        <Separator className="my-2" />

        {/* Google */}
      </form>
        <Button onClick={handleGoogleAuth}  variant="outline" className="w-full flex items-center justify-center gap-2">
          <FcGoogle className="text-lg" /> Continue with Google
        </Button>

      {/* Login link */}
      <p className="text-sm text-center text-gray-600 mt-4">
        Already have an account?{" "}
        <Link href="/auth/login">
          <span className="text-blue-600 cursor-pointer">Login</span>
        </Link>
      </p>
    </CardContent>
  );
}
