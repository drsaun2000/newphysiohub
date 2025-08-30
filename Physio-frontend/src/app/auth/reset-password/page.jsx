"use client";
import usePost from "@/hooks/usePost";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ResetPassword() {
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [confirmValidationError, setConfirmValidationError] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(null);
  const [email, setEmail] = useState("");
  const [state, setState] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });

  const router = useRouter();

  useEffect(() => {
    setOtp(localStorage.getItem("otp"))
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$#!%*?&])[A-Za-z\d@$#!%*?&]{8,}$/;

    if (name == "password") {
      if (!passwordRegex.test(value)) {
        setValidationError(
          "Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character (@$!%*?&)."
        );
      } else {
        setValidationError("");
        setNewPassword(value);
      }
    }
    if (name == "confirmPassword") {
      if (!passwordRegex.test(value)) {
        setConfirmValidationError(
          "Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character (@$!%*?&)."
        );
      } else {
        setConfirmValidationError("");
        setConfirmPassword(value);
      }
    }
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setPasswordMatch(false);
      return;
    }
    setPasswordMatch(true);
    const {data, error , status} = await usePost(`/auth/reset-password`, {otp, password : newPassword})
    if(data){
      router.push("/auth/login")
    }
  };


  return (
    <>
      <section className="relative w-full">
      
        <div className="container mx-auto px-4">
          <div
            className="flex flex-col lg:flex-row justify-center items-center"
            data-aos="fade-left"
            data-aos-delay="300"
          >
            <div className="w-full lg:w-1/2">
              <div className="bg-white p-8 sm:p-6 shadow-md rounded-xl">
                <div className="text-center space-y-5">
                    <Image
                      width={138}
                      height={44}
                      className="mb-4 mx-auto"
                      src="/logo-on-light.png"
                      alt="logo"
                    />
                  {/* <img
                    src="/images/emailverificationicon.png"
                    alt="Email Icon"
                    className="h-20 w-20 mx-auto"
                  /> */}
                  <h2 className="text-xl font-semibold">Create New Password</h2>
                </div>
                <div className="flex justify-center items-center min-h-[50vh] mt-6">
                  <div className="w-full max-w-xl p-4">
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div>
                        <label className="block font-semibold text-gray-800 mb-1">
                          New Password
                        </label>
                        <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
                          <input
                            type={show ? "text" : "password"}
                            name="password"
                            placeholder="Enter Password"
                            className="flex-grow outline-none bg-transparent"
                            onChange={handleInputChange}
                            required
                          />
                          <p
                            className="cursor-pointer text-sm text-blue-500 ml-2"
                            onClick={() => setShow(!show)}
                          >
                            {show ? "Hide" : "Show"}
                          </p>
                        </div>
                        {validationError && (
                          <p className="text-red-500 mt-1 text-sm">
                            {validationError}
                          </p>
                        )}
                      </div>

                      <div className="mb-5">
                        <label className="block font-semibold text-gray-800 mb-1">
                          Confirm Password
                        </label>
                        <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
                          <input
                            type={showConfirm ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="Enter Confirm Password"
                            className="flex-grow outline-none bg-transparent"
                            onChange={handleInputChange}
                            required
                          />
                          <p
                            className="cursor-pointer text-sm text-blue-500 ml-2"
                            onClick={() => setShowConfirm(!showConfirm)}
                          >
                            {showConfirm ? "Hide" : "Show"}
                          </p>
                        </div>
                        {confirmValidationError && (
                          <p className="text-red-500 mt-1 text-sm">
                            {confirmValidationError}
                          </p>
                        )}
                      </div>

                      {passwordMatch !== null && (
                        <p
                          className={`text-sm mt-1 ${
                            passwordMatch ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {passwordMatch ? (
                            <>
                              Passwords Matched{" "}
                              <i
                                className="fa fa-check-circle"
                                aria-hidden="true"
                              ></i>
                            </>
                          ) : (
                            "Passwords do not match"
                          )}
                        </p>
                      )}

                      <button
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed transition"
                        type="submit"
                        disabled={
                          newPassword.length <= 7 || confirmPassword.length <= 7
                        }
                      >
                        Create Password
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
