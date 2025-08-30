import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Trash2, Pencil } from 'lucide-react';
import DeleteConfirmationModal from '../modals/delete.confirmation.page';

const FlashcardsByTopicPage = () => {
  const { topicId } = useParams();
  const SERVER_URL = import.meta.env.VITE_DEV_API_URL;
  const [flashcards, setFlashcards] = useState([]);
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedFlashcardId, setSelectedFlashcardId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [topicsRes, flashcardsRes] = await Promise.all([
          axios.get(`${SERVER_URL}main-topics`),
          axios.get(`${SERVER_URL}flashcards/getAllFlashcards`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        const foundTopic = topicsRes.data.data.find((t) => t._id === topicId);
        setTopic(foundTopic);
        setFlashcards(flashcardsRes.data.data.filter((fc) => fc.topic === topicId));
      } catch (error) {
        console.error('Failed to load flashcards or topic:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [topicId]);

  const openDeleteModal = (id) => {
    setSelectedFlashcardId(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await axios.delete(`${SERVER_URL}flashcards/delete/${selectedFlashcardId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFlashcards((prev) => prev.filter((fc) => fc._id !== selectedFlashcardId));
    } catch (err) {
      console.error('Failed to delete flashcard:', err);
    } finally {
      setDeleteModalOpen(false);
      setSelectedFlashcardId(null);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <button
        onClick={() => navigate('/flashcard-topics')}
        className="flex items-center gap-1 text-indigo-600 hover:underline mb-6"
      >
        <ArrowLeft size={18} /> Back to Topics
      </button>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">
          Flashcards for <span className="text-indigo-600">{topic?.name || 'Topic'}</span>
        </h2>
        <button
          onClick={() => navigate('/create-flashcard', { state: { topicId } })}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          + Create Flashcard
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading flashcards...</p>
      ) : flashcards.length === 0 ? (
        <p className="text-gray-600">No flashcards found for this topic.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {flashcards.map((fc) => (
            <div
              key={fc._id}
              className="bg-white rounded-xl border shadow-sm p-4 flex flex-col md:flex-row gap-4 hover:shadow-md transition"
            >
              {fc.frontImage && (
                <img
                  src={fc.frontImage}
                  alt="Front"
                  className="w-full md:w-48 h-32 object-cover rounded-md border"
                />
              )}

              <div className="flex flex-col flex-1 justify-between">
                <div>
                  <p className="text-sm text-gray-800">
                    <span className="font-medium">Front:</span> {fc.frontContent}
                  </p>
                  <p className="text-sm text-gray-700 mt-1">
                    <span className="font-medium">Back:</span> {fc.backContent}
                  </p>

                  <div className="mt-2 text-xs text-gray-500 space-y-1">
                    <p>
                      <strong>Subject:</strong> {fc.subject || 'N/A'}
                    </p>
                    <p>
                      <strong>Confidence:</strong> {fc.confidenceLevel || 'N/A'}
                    </p>
                    {fc.hint && <p><strong>Hint:</strong> {fc.hint}</p>}
                  </div>
                </div>

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => openDeleteModal(fc._id)}
                    title="Delete"
                    className="p-2 bg-red-100 hover:bg-red-200 rounded"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </button>
                  <button
                    onClick={() => navigate(`/edit-flashcard/${fc._id}`)}
                    title="Edit"
                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded"
                  >
                    <Pencil className="h-4 w-4 text-gray-700" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirmed}
        title="Delete Flashcard"
        message="Are you sure you want to delete this flashcard? This action cannot be undone."
      />
    </div>
  );
};

export default FlashcardsByTopicPage;
