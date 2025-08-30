import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Layers } from 'lucide-react'; // You can replace this with any icon library you're using

const FlashcardTopicsPage = () => {
  const SERVER_URL = import.meta.env.VITE_DEV_API_URL;
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [topicsRes, flashcardsRes] = await Promise.all([
          axios.get(`${SERVER_URL}main-topics`),
          axios.get(`${SERVER_URL}flashcards/getAllFlashcards`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setTopics(topicsRes.data.data || []);
        setFlashcards(flashcardsRes.data.data || []);
      } catch (error) {
        console.error('Failed to fetch topics or flashcards:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getFlashcardCount = (topicId) =>
    flashcards.filter((fc) => fc.topic === topicId).length;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <Layers className="text-indigo-600" /> Flashcard Topics
      </h1>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : topics.length === 0 ? (
        <p className="text-gray-600">No topics available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic) => (
            <div
              key={topic._id}
              onClick={() => navigate(`/flashcards/${topic._id}`)}
              className="p-5 bg-white rounded-xl shadow hover:shadow-lg transition-all duration-200 cursor-pointer border border-gray-100 hover:border-indigo-500"
            >
              <h2 className="text-lg font-semibold text-indigo-700 mb-2 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                {topic.name}
              </h2>
              <p className="text-sm text-gray-600">
                {getFlashcardCount(topic._id)} flashcard
                {getFlashcardCount(topic._id) !== 1 ? 's' : ''}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FlashcardTopicsPage;
