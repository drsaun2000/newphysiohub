import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import LeftMockupImage from '../assets/Graphic.png';

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const SERVER_URL = import.meta.env.VITE_DEV_API_URL;
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${SERVER_URL}auth/admin-login`,
        { email, password },
        { 
          withCredentials: true,
          headers: {
            'ngrok-skip-browser-warning': 'true'
          }
        }
      );

      if (response.status === 201) {
        const { user, token } = response.data;
        console.log(response);

        // Check if user has admin role
        if (user?.role === 'admin' || user?.role === 'owner') {
          if (token) {
            // ✅ Store in localStorage instead of cookies
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            onLogin();
            navigate('/dashboard');
          }
        } else {
          setError('Access denied: Admins only');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid email or password');
    }
  };



  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex max-w-5xl w-full bg-white rounded-lg overflow-hidden shadow-lg">
        <div className="w-1/2 hidden md:block">
          <img
            src={LeftMockupImage}
            alt="Login Side Visual"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="w-full md:w-1/2 px-6 md:px-10 py-10 md:py-14">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-left">Admin Login Access</h2>
          <p className="text-sm text-gray-600 mb-6 text-left">
            Sign in to manage and update blog content and settings.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div>
              <label className="block text-sm mb-1">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
                required
              />
            </div>
{/* 
            <div className="text-right text-sm">
              <a href="#" className="text-indigo-500 hover:underline">
                Forgot password?
              </a>
            </div> */}

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md transition duration-200"
            >
              Login
            </button>

        {/*
        <div className="flex items-center my-4">
          <hr className="flex-grow border-t border-gray-300" />
          <span className="px-3 text-sm text-gray-500">or</span>
          <hr className="flex-grow border-t border-gray-300" />
        </div>

        <button
          type="button"
          className="w-full border border-gray-300 py-2 px-4 rounded-md flex items-center justify-center gap-2 hover:bg-gray-100 transition duration-200"
        >
          <img
            src="https://img.icons8.com/color/24/google-logo.png"
            alt="Google logo"
            className="h-5 w-5"
          />
          <span className="text-sm text-gray-700 font-medium">Continue with Google</span>
        </button>

        <p className="text-sm mt-4">
          Don't have an account?{' '}
          <a href="#" className="text-indigo-600 hover:underline">
            Sign up
          </a>
        </p>
      */}

          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
