import { useState } from "react";

export function Switch({inQuiz = false, checked = false, onChange, w = "w-11" }) {
  const [isOn, setIsOn] = useState(checked);

  const toggleSwitch = () => {
    setIsOn(!isOn);
    if (onChange) {
      onChange(!isOn);
    }
  };

  return (
    <button
      onClick={toggleSwitch}
      className={`relative ${w} md:h-6 h-5 min-w-10  flex items-center rounded-full p-1 transition-colors ${
        isOn ? "bg-purple-600" : "bg-gray-300"
      }`}
    >
      <span
        className={`md:w-5 w-4 md:h-5 h-4 bg-white rounded-full shadow-md transform transition-transform ${
          isOn ? inQuiz? "translate-x-4 " :"md:translate-x-5 translate-x-5" : "translate-x-0"
        }`}
      ></span>
    </button>
  );
}
