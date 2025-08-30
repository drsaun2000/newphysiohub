import React, { useState } from "react";
import Image from "next/image";
import { MessageCircleQuestion, PlusIcon } from "lucide-react";
import LottiePlayer from "@/components/animations/LottiePlayer";
import smart from "@/components/animations/data/Smart.json";

const faqs = [
  {
    question: "Who can benefit from using Physiohub?",
    answer: "Physiohub is designed for individuals seeking physiotherapy support, professionals in the field, and clinics aiming to enhance patient care.",
  },
  {
    question: "How often is the content updated?",
    answer: "It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  },
  {
    question: "Do I need to create an account to use the platform?",
    answer: "While some features are accessible without an account, registering allows access to personalized recommendations and premium content.",
  },
  {
    question: "Who can benefit from using Physiohub?",
    answer: "Physiohub is designed for individuals seeking physiotherapy support, professionals in the field, and clinics aiming to enhance patient care.",
  },
  {
    question: "Is there a subscription fee to use the platform?",
    answer: "Physiohub offers both free and premium subscription plans to cater to different user needs.",
  },
  {
    question: "How do you handle user data and privacy?",
    answer: "We prioritize user privacy with encrypted data storage and strict access policies, ensuring user information is secure.",
  },
  {
    question: "Can I suggest topics or features for the platform?",
    answer: "Absolutely! We welcome user feedback and encourage suggestions to improve our platform.",
  },
  {
    question: "What should I do if I encounter technical issues on the platform?",
    answer: "You can visit our Help Center for troubleshooting guides or contact our support team for assistance.",
  },
];

const Accordion = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="py-8 md:py-16 px-4 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          
          {/* Left Side - Header and Character */}
          <div className="space-y-6 lg:space-y-8 order-1 lg:order-1">
            <div>
              <div className="flex items-center gap-1 mb-3 md:mb-4">
                <MessageCircleQuestion className="text-primary-50 h-4 w-4 md:h-5 md:w-5 font-semibold uppercase tracking-wide"/>
                <span className="text-primary-50 text-xs md:text-sm font-semibold uppercase tracking-wide">FAQ</span>
              </div>
              
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-3 md:mb-4">
                Frequently asked<br />
                questions
              </h1>
              
              <p className="text-gray-600 text-base md:text-lg">
                Visit our{" "}
                <a href="#" className="text-primary-50 underline font-medium">
                  Help Center
                </a>{" "}
                for more information.
              </p>
            </div>

            {/* Character Image - Hidden on mobile, positioned better on desktop */}
            <div className="hidden lg:flex justify-start mt-20 xl:mt-40">
              <div className="w-24 h-24 lg:w-32 lg:h-32 relative">
                <LottiePlayer animationFile={smart} width="150%" height="150%"/>
              </div>
            </div>
          </div>

          {/* Right Side - FAQ Items */}
          <div className="space-y-2 md:space-y-3 order-2 lg:order-2">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-xl overflow-hidden bg-white hover:shadow-md transition-shadow"
              >
                <button
                  className="w-full text-left p-4 md:p-6 flex justify-between items-center hover:bg-gray-50 transition-colors"
                  onClick={() => toggleFAQ(index)}
                >
                  <span className="font-semibold text-gray-900 text-base md:text-lg pr-3 md:pr-4 leading-tight">
                    {faq.question}
                  </span>
                  <div className="flex-shrink-0">
                    <div className={`w-6 h-6 md:w-8 md:h-8 flex items-center justify-center transition-all duration-200 ${
                      openIndex === index 
                        ? 'text-purple-600 rotate-45' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}>
                      <PlusIcon className="h-4 w-4 md:h-5 md:w-5"/>
                    </div>
                  </div>
                </button>
                
                {openIndex === index && (
                  <div className="px-4 md:px-6 pb-4 md:pb-6">
                    <div className="pt-3 md:pt-4 border-t border-gray-100">
                      <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accordion;
