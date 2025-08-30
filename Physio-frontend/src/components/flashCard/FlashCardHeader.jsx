"use client";
import { Button } from "../ui/button.jsx";
import {
  Select,
  SelectItem,
} from "../ui/select.jsx";
import { ArrowLeft, Search, Upload, Plus, X } from "lucide-react";
import { Input } from "../ui/input.jsx";
import { useState } from "react";
import usePost from "@/hooks/usePost";

export default function FlashCardHeader({setShowInFlashCard}) {
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [newTopicName, setNewTopicName] = useState("");
  const [notification, setNotification] = useState(null);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleCreateTopic = async () => {
    if (!newTopicName.trim()) {
      showToast("Topic name cannot be empty", "error");
      return;
    }

    const { data, error, status } = await usePost("/main-topics", {
      name: newTopicName
    });

    if (status === 201) {
      showToast("Topic Added successfully", "success");
      setNewTopicName("");
      setShowTopicModal(false);
    } else {
      showToast(error?.[0] || "Failed to create topic", "error");
    }
  };

  return (
    <>
      <div className="w-full mx-auto md:max-w-[80%] flex justify-between items-center p-4 rounded-lg">
        <div className="flex items-center gap-2">
        </div>
        <div className="flex items-center gap-4">
          <Button
            type="button"
            onClick={() => setShowTopicModal(true)}
            variant="outline"
            className="gap-2 md:w-auto px-2 md:py-5 py-2 md:text-base text-xs"
          >
            <Plus className="w-4 h-4 " />
            Add New Topic
          </Button>
          <button onClick={()=>{setShowInFlashCard("CreateFlashCard")}} className="bg-purple-600 hover:bg-purple-700 text-white md:px-4 px-2 py-2 rounded-lg md:text-base text-xs">
            + Create new
          </button>
        </div>
      </div>

      {showTopicModal && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Create New Topic</h3>
              <button 
                onClick={() => setShowTopicModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Topic Name
                </label>
                <Input
                  type="text"
                  value={newTopicName}
                  onChange={(e) => setNewTopicName(e.target.value)}
                  placeholder="Enter topic name"
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowTopicModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateTopic}
                >
                  Create
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {notification && (
        <div
          className={`fixed bottom-4 right-4 p-4 rounded-md shadow-lg ${
            notification.type === "error" ? "bg-red-500" : "bg-green-500"
          } text-white`}
        >
          {notification.message}
          <button onClick={() => setNotification(null)} className="ml-4 text-xl">
            ×
          </button>
        </div>
      )}
    </>
  );
}
