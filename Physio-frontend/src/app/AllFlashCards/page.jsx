"use client";
import useGet from "@/hooks/useGet";
import { AlarmClock, BadgeCheck, FileText } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const Flashcard = ({ imageSrc, title, tags, description, cards, time }) => {
  return (
    <div className="flex flex-col justify-between bg-white rounded-xl border overflow-hidden p-4 w-[inherit] md:w-[inherit] lg:w-[350px] relative cursor-pointer">
      <div className="h-[180px] w-[230px]">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt="image"
            height={200}
            width={240}
            className="object-cover h-full w-full rounded-2xl"
          />
        ) : (
          <div className="bg-gray-300 h-full w-full rounded animate-pulse"></div>
        )}
      </div>
      <div>
        <div className="flex items-center space-x-2 mt-4">
          <BadgeCheck size={18} color="#7240FD" />
          <span className="text-[#7240FD]"> Admin Verified</span>
        </div>
        <h3 className="text-lg font-semibold mt-4">{title}</h3>
        <div className="flex space-x-2 my-2">
          {tags.map((tag) => (
            <span key={tag} className="px-3 py-1 border text-sm rounded-sm">
              {tag}
            </span>
          ))}
        </div>
        <p className="text-sm text-gray-600">{description}</p>
        <div className="flex justify-between items-center mt-4 text-gray-500 text-sm">
          <span className="flex">
            <FileText size={18} />
            &nbsp;&nbsp;{cards} cards
          </span>
          <span className="flex">
            <AlarmClock size={18} />
            &nbsp;{time} min
          </span>
        </div>
      </div>
    </div>
  );
};

function AllFlashcards() {
  const [flashCards, setFlashCards] = useState([]);
  const fetchFlashCardsData = async() => {
    const { data, error, status } = await useGet(`/flashcards/getAllFlashcards`);
    if (status == 200) {
      setFlashCards(data);
    }
};
useEffect(()=>{
    fetchFlashCardsData()
},[])
  return (
    <>
      <div className="mt-4 w-full mx-auto max-w-[80%] ">
        <div className="flex flex-col sm:flex-col md:flex-row lg:flex-row gap-4 mt-4 overflow-x-auto overflow-y-hidden">
          {flashCards?.map((flashcard) => (
            <Flashcard
                key={flashcard._id}
              imageSrc={"/auth-activity.png"}
              title="Musculoskeletal Physiology"
              tags={["Muscle", "Cardiovascular", "Ribs"]}
              description="Exercise Therapy is a treatment method that uses physical exercise to address various medical conditions."
              cards="120"
              time="20"
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default AllFlashcards;
