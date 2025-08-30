import { Upload } from "lucide-react";
import React, { useState } from "react";

export default function ReportModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#00000071] bg-opacity-40 flex justify-center items-center">
      <div className="bg-white w-full md:max-w-md max-w-sm rounded-xl shadow-xl p-6 relative">
        <h2 className="md:text-xl text-base font-semibold mb-4">Report a Problem</h2>

        <form className="md:space-y-4 space-y-2">
          <div>
            <label className="block mb-1 md:text-base text-sm font-medium">Select the steps that led to the issue:</label>
            <div className="md:space-y-2 space-y-1 md:text-sm text-xs">
              <label className="block"><input type="checkbox" className="mr-2" />Received an incorrect score</label>
              <label className="block"><input type="checkbox" className="mr-2" />Couldn't move to the next question</label>
              <label className="block"><input type="checkbox" className="mr-2" />App froze during the session</label>
              <label className="block"><input type="checkbox" className="mr-2" />Incorrect content displayed</label>
              <label className="block"><input type="checkbox" className="mr-2" />Other</label>
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium md:text-base text-sm">Issue Description</label>
            <textarea
              rows="3"
              placeholder="Describe the issue you encountered"
              className="w-full border border-gray-300 rounded-md p-2 resize-none placeholder:md:text-base placeholder:text-sm"
            />
          </div>

          <div>
            <label className="block mb-1 md:text-base text-sm font-medium">Screenshot (optional)</label>
            <div className="border-dashed border-2 border-gray-300 rounded-lg mdLpx-6 px-4 md:py-10 py-5 flex flex-col items-center justify-center text-gray-500 cursor-pointer">
            <Upload className="md:w-6 w-3 md:h-6 h-3 mb-2 text-purple-600" />
            <p className="md:text-base text-sm">Drag or drop image here</p>
            <p className="md:text-xs text-[10px]">
              Image should be horizontal, at least 1500 x 500 px
            </p>
          </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 md:text-base text-xs rounded-md border border-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="md:px-4 px-2 md:py-2 md:text-base text-xs bg-blue-600 text-white rounded-md"
            >
              Submit report
            </button>
          </div>
        </form>

        <button
          className="absolute top-2 right-3 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
