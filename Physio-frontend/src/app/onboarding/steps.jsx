'use client'

import { Button } from "@/components/ui/button.jsx";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const LevelCard = ({ title, subTitle, icon, isSelected, onClick }) => {
    return (
        <div
            onClick={()=>onClick(title)}
            className={`p-2 border w-full rounded-lg cursor-pointer hover:bg-[#f1f1f1] ${isSelected ? "border-[#6c4ce6]" : ''
                }`}
        >
            <div className="flex items-center space-x-4">
                <div className="w-15 h-15 rounded-sm flex items-center justify-center bg-[#F6F9FC]">
                    <img src={icon} className="w-10 h-10"/> 
                </div>
                <div>
                    <h3 className="font-semibold text-lg text-black">{title}</h3>
                    <p className="text-sm text-gray-400">{subTitle}</p>
                </div>
            </div>
        </div>
    );
};


export default function Steps({ title, subTitle, data, onNext, isMulti, step, formData, setFormData }) {
    const router = useRouter()
    const [selected, setSelected] = useState([]);
    const handleStepData = (value) => {
        setSelected((prev) => {
          let updated = [...prev];
          if (isMulti) {
            if (updated.includes(value)) {
              updated = updated.filter((item) => item !== value);
            } else {
              updated.push(value);
            }
          } else {
            updated = [value];
          }
      
          // Update central formData
          const keys = ["level", "pace", "interestAreas", "goals", "notification"];
          setFormData({ ...formData, [keys[step - 1]]: isMulti ? updated : updated[0] });
      
          return updated;
        });
      };
      

    const handleNext = () => {
        // handleData(fieldKey, isMulti ? selected : selected[0]);
        if (selected.length === 0) return;
        onNext(step + 1);
    };

    return (
        <div className="flex p-10 flex-col justify-between flex-grow w-full sm:w-[60%] border">
            {/* ...your existing JSX remains same... */}
        <div className="flex flex-col w-full">

            <div className="flex justify-center">
                <div className="flex flex-col justify-center items-center">
                    <ArrowLeft className="text-[#6c4ce6] mr-4 cursor-pointer" size={24} />
                </div>
                <div className="flex flex-col w-full justify-center items-center">
                    <div className="w-full h-2 bg-[#e0e0e0] rounded-full">
                        <div 
                            className="h-full bg-[#6c4ce6] rounded-full transition-all duration-300 ease-in-out"
                            style={{ width: `${(step / 6) * 100}%` }}
                        ></div>
                    </div>
                </div>
            </div>
            
            <div className="flex flex-col mt-10 items-center">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-black">{title}</h2>
                    <p className="text-md text-gray-500 mt-2">
                        {subTitle}
                    </p>
                </div>
                <div className="flex flex-col items-center mt-5 w-[100%] gap-2 overflow-y-auto max-h-[500px]">
                    {
                        data.map((d, index) => (
                            <div className="flex w-[100%] justify-between gap-2 sm:flex-row flex-col" key={index}>
                                {
                                    Array.isArray(d) ?
                                        d.map((id, i) => (
                                            <LevelCard
                                                title={id.title}
                                                subTitle={id.subTitle}
                                                icon={id.icon}
                                                key={i}
                                                onClick={handleStepData}
                                                isSelected={selected.includes(id.title)}
                                            />
                                        ))
                                        :

                                        <LevelCard
                                        title={d.title}
                                        subTitle={d.subTitle}
                                        icon={d.icon}
                                        onClick={handleStepData}
                                        isSelected={selected.includes(d.title)}
                                        />
                                }

                            </div>
                        ))
                    }

                </div>
            </div>
        </div>
        <div className="flex justify-between">
                <Button
                    variant="outline"
                    onClick={() => {router.push("/")}}
                    className="px-6 py-3 text-sm font-semibold text-[#6c4ce6] border-[#6c4ce6] rounded-sm hover:bg-[#6c4ce6] hover:text-white transition-all duration-200"
                >
                    I’ll do this later
                </Button>
                <Button
                    onClick={handleNext}
                    variant="ghost"
                    className="px-8 py-3 text-white bg-[#6c4ce6] rounded-sm"
                >
                    Next
                </Button>
            </div>
        </div>
    );
}