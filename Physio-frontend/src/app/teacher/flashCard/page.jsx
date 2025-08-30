"use client";
import { useState } from "react";
import FlashCards from "@/components/flashCard/FlashCards";
import CreateFlashCard from "@/components/flashCard/CreateFlashCard"


export default function FlashCard() {
  const [showInFlashCard, setShowInFlashCard] = useState("FlashCards")
  return (
    <>
      <div className="flex flex-col md:flex-col sm:flex-col lg:flex-row">
        <div className="w-full">
          <div className="flex flex-col items-center justify-center min-h-[80vh]">
            {showInFlashCard == "FlashCards"&&<FlashCards setShowInFlashCard={setShowInFlashCard}/>}
            {showInFlashCard == "CreateFlashCard"&&<CreateFlashCard setShowInFlashCard={setShowInFlashCard}/>}  
          </div>
        </div>
      </div>
    </>
  );
}
