import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import RichTextEditor from '../common/RichTextEditor';

const CreateFlashcards = () => {
  const [flashcards, setFlashcards] = useState([
    {
      frontContent: '',
      backContent: '',
      hint: '',
      frontImage: '',
      backImage: '',
      imageUrl: '',
      masteryLevel: 1,
      confidenceLevel: 'low',
    },
  ]);
  const [flashcardCount, setFlashcardCount] = useState('');
  const [mainTopics, setMainTopics] = useState([]);
  const [selectedTopicId, setSelectedTopicId] = useState('');
  const [uploadingIndex, setUploadingIndex] = useState(null);
  const [uploadingField, setUploadingField] = useState('');
  const [creating, setCreating] = useState(false);
  const [createdCount, setCreatedCount] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();
  const SERVER_URL = import.meta.env.VITE_DEV_API_URL;
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchMainTopics = async () => {
      try {
        const res = await axios.get(`${SERVER_URL}main-topics`);
        setMainTopics(res.data.data);
        const fromTopicId = location.state?.topicId;
        if (fromTopicId) {
          setSelectedTopicId(fromTopicId);
        } else if (res.data.data.length > 0) {
          setSelectedTopicId(res.data.data[0]._id);
        }
      } catch (err) {
        console.error('Failed to load topics:', err);
        toast.error('Failed to load topics');
      }
    };
    fetchMainTopics();
  }, []);

  const handleChange = (index, field, value) => {
    const updated = [...flashcards];
    updated[index][field] = value;
    setFlashcards(updated);
  };

  const handleImageUpload = async (index, field, file) => {
    if (!file) return;
    setUploadingIndex(index);
    setUploadingField(field);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await axios.post(`${SERVER_URL}quizzes/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      let imageUrl = res.data.data.url;
      if (!/^https?:\/\//i.test(imageUrl)) {
        imageUrl = `https://${imageUrl}`;
      }

      handleChange(index, field, imageUrl);
      toast.success('Image uploaded!');
    } catch (err) {
      console.error('Upload error:', err);
      toast.error('Upload failed');
    } finally {
      setUploadingIndex(null);
      setUploadingField('');
    }
  };

  const generateCards = () => {
    const count = parseInt(flashcardCount);
    if (!isNaN(count) && count > 0 && count <= 1000) {
      const newCards = Array(count).fill().map(() => ({
        frontContent: '',
        backContent: '',
        hint: '',
        frontImage: '',
        backImage: '',
        imageUrl: '',
        masteryLevel: 1,
        confidenceLevel: 'low',
      }));
      setFlashcards([...flashcards, ...newCards]);
    } else {
      toast.error('Enter a valid number (1–1000)');
    }
  };

  const stripHtmlTags = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTopicId) {
      toast.error('Please select a topic');
      return;
    }

    const invalidCardIndex = flashcards.findIndex(
      (card) => !stripHtmlTags(card.frontContent).trim() || !stripHtmlTags(card.backContent).trim()
    );
    if (invalidCardIndex !== -1) {
      toast.error(
        `Flashcard ${invalidCardIndex + 1} is missing front or back content. All flashcards must be filled.`
      );
      return;
    }

    setCreating(true);
    setCreatedCount(0);
    try {
      for (let i = 0; i < flashcards.length; i++) {
        const card = flashcards[i];
        await axios.post(
          `${SERVER_URL}flashcards/create`,
          {
            confidenceLevel: card.confidenceLevel,
            masteryLevel: card.masteryLevel,
            verifiedByAdmin: false,
            rating: 0,
            ratingCount: 0,
            frontContent: card.frontContent,
            backContent: card.backContent,
            frontImage: card.frontImage,
            backImage: card.backImage,
            imageUrl: card.imageUrl,
            hint: card.hint,
            topic: selectedTopicId,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCreatedCount(i + 1);
      }
      toast.success('All flashcards created!');
      navigate('/flashcard-topics');
    } catch (err) {
      console.error(err);
      toast.error('Error creating flashcards');
    } finally {
      setCreating(false);
      setCreatedCount(0);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 bg-white text-gray-900 min-h-screen font-sans">
      <h1 className="text-4xl font-extrabold text-center mb-10">🃏 Create Flashcards</h1>

      {selectedTopicId && (
        <div className="mb-8">
          <label className="block mb-2 font-medium text-gray-700">Topic</label>
          <div className="w-full rounded-md border border-gray-200 bg-gray-100 p-3">
            {mainTopics.find((t) => t._id === selectedTopicId)?.name || 'Selected Topic'}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-10">
        {flashcards.map((card, index) => (
          <div key={index} className="bg-gray-50 rounded-xl p-6 shadow-md border">
            <h2 className="text-xl font-semibold mb-6">Flashcard <span className="text-indigo-600">{index + 1}</span></h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Front */}
              <div className="flex flex-col gap-3">
                <label>Front Content</label>
                <RichTextEditor
                  value={card.frontContent}
                  onChange={(value) => handleChange(index, 'frontContent', value)}
                  placeholder="Enter front content..."
                  disabled={creating}
                />
                <label>Upload Front Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(index, 'frontImage', e.target.files[0])}
                  disabled={creating}
                />
                {uploadingIndex === index && uploadingField === 'frontImage' && (
                  <p className="text-sm text-blue-500">Uploading front image...</p>
                )}
                {card.frontImage && (
                  <img
                    src={card.frontImage}
                    alt="Front"
                    className="mt-2 w-full max-h-36 object-contain border"
                  />
                )}
              </div>

              {/* Back */}
              <div className="flex flex-col gap-3">
                <label>Back Content</label>
                <RichTextEditor
                  value={card.backContent}
                  onChange={(value) => handleChange(index, 'backContent', value)}
                  placeholder="Enter back content..."
                  disabled={creating}
                />
                <label>Upload Back Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(index, 'backImage', e.target.files[0])}
                  disabled={creating}
                />
                {uploadingIndex === index && uploadingField === 'backImage' && (
                  <p className="text-sm text-blue-500">Uploading back image...</p>
                )}
                {card.backImage && (
                  <img
                    src={card.backImage}
                    alt="Back"
                    className="mt-2 w-full max-h-36 object-contain border"
                  />
                )}
              </div>
            </div>

            {/* Image URL */}
            <div className="mt-4">
              <label>Upload imageUrl (other image)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(index, 'imageUrl', e.target.files[0])}
                disabled={creating}
              />
              {uploadingIndex === index && uploadingField === 'imageUrl' && (
                <p className="text-sm text-blue-500">Uploading imageUrl...</p>
              )}
              {card.imageUrl && (
                <img
                  src={card.imageUrl}
                  alt="Image URL"
                  className="mt-2 w-full max-h-36 object-contain border"
                />
              )}
            </div>

            <div className="mt-4">
              <label>Hint</label>
              <input
                type="text"
                value={card.hint}
                onChange={(e) => handleChange(index, 'hint', e.target.value)}
                className="w-full border rounded px-4 py-2"
                disabled={creating}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div>
                <label>Mastery Level</label>
                <select
                  value={card.masteryLevel}
                  onChange={(e) => handleChange(index, 'masteryLevel', parseInt(e.target.value))}
                  className="w-full border rounded px-4 py-2"
                  disabled={creating}
                >
                  <option value={1}>Beginner</option>
                  <option value={2}>Intermediate</option>
                  <option value={3}>Advanced</option>
                </select>
              </div>
              <div>
                <label>Confidence Level</label>
                <select
                  value={card.confidenceLevel}
                  onChange={(e) => handleChange(index, 'confidenceLevel', e.target.value)}
                  className="w-full border rounded px-4 py-2"
                  disabled={creating}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
          </div>
        ))}

        <div className="flex items-center gap-3">
          <input
            type="number"
            min={1}
            max={1000}
            value={flashcardCount}
            onChange={(e) => setFlashcardCount(e.target.value)}
            placeholder="Number of cards (1–1000)"
            className="w-48 px-4 py-2 border rounded"
            disabled={creating}
          />
          <button
            type="button"
            onClick={generateCards}
            className="bg-indigo-600 text-white px-5 py-2 rounded hover:bg-indigo-700"
            disabled={creating}
          >
            ➕ Add Cards
          </button>
        </div>

        <button
          type="submit"
          disabled={creating}
          className={`w-full py-3 font-semibold rounded ${
            creating ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {creating ? `Saving flashcards... (${createdCount} / ${flashcards.length})` : '✅ Save Flashcards'}
        </button>
      </form>
    </div>
  );
};

export default CreateFlashcards;
