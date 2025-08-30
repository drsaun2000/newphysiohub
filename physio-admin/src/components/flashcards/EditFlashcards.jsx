import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import RichTextEditor from '../common/RichTextEditor';

const EditFlashcardPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const SERVER_URL = import.meta.env.VITE_DEV_API_URL;

  const [formData, setFormData] = useState({
    frontContent: '',
    backContent: '',
    hint: '',
    frontImage: '',
    backImage: '',
    imageUrl: '', // ✅ New field
    masteryLevel: 1,
    confidenceLevel: 'low',
  });

  const [uploadingFront, setUploadingFront] = useState(false);
  const [uploadingBack, setUploadingBack] = useState(false);
  const [uploadingImageUrl, setUploadingImageUrl] = useState(false); // ✅

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${SERVER_URL}flashcards/getFlashcardById/${id}`);
        const data = res.data.data;
        setFormData({
          frontContent: data.frontContent || '',
          backContent: data.backContent || '',
          hint: data.hint || '',
          frontImage: data.frontImage || '',
          backImage: data.backImage || '',
          imageUrl: data.imageUrl || '', // ✅
          masteryLevel: data.masteryLevel || 1,
          confidenceLevel: data.confidenceLevel || 'low',
        });
      } catch (err) {
        console.error('Error loading flashcard:', err);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = ['masteryLevel'].includes(name) ? parseInt(value) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  const handleImageUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataImg = new FormData();
    formDataImg.append('file', file);

    try {
      if (field === 'frontImage') setUploadingFront(true);
      else if (field === 'backImage') setUploadingBack(true);
      else if (field === 'imageUrl') setUploadingImageUrl(true);

      const res = await axios.post(`${SERVER_URL}quizzes/upload`, formDataImg, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      let imageUrl = res.data.data.url;
      if (!/^https?:\/\//i.test(imageUrl)) {
        imageUrl = `https://${imageUrl}`;
      }

      setFormData((prev) => ({
        ...prev,
        [field]: imageUrl,
      }));
    } catch (err) {
      console.error('Image upload failed:', err);
    } finally {
      if (field === 'frontImage') setUploadingFront(false);
      else if (field === 'backImage') setUploadingBack(false);
      else if (field === 'imageUrl') setUploadingImageUrl(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      masteryLevel: parseInt(formData.masteryLevel),
    };

    try {
      await axios.patch(`${SERVER_URL}flashcards/updateFlashcardById/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      navigate('/flashcard-topics');
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6">Edit Flashcard</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="font-medium block mb-1">Term (Front)</label>
            <RichTextEditor
              value={formData.frontContent}
              onChange={(value) => setFormData(prev => ({ ...prev, frontContent: value }))}
              placeholder="Enter term..."
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, 'frontImage')}
              className="mt-2"
            />
            {uploadingFront && <p className="text-sm text-gray-500">Uploading...</p>}
            {formData.frontImage && (
              <img
                src={formData.frontImage}
                alt="Front"
                className="h-32 mt-2 rounded border"
              />
            )}
          </div>

          <div>
            <label className="font-medium block mb-1">Definition (Back)</label>
            <RichTextEditor
              value={formData.backContent}
              onChange={(value) => setFormData(prev => ({ ...prev, backContent: value }))}
              placeholder="Enter definition..."
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, 'backImage')}
              className="mt-2"
            />
            {uploadingBack && <p className="text-sm text-gray-500">Uploading...</p>}
            {formData.backImage && (
              <img
                src={formData.backImage}
                alt="Back"
                className="h-32 mt-2 rounded border"
              />
            )}
          </div>
        </div>

        <div>
          <label className="font-medium block mb-1">Hint</label>
          <input
            type="text"
            name="hint"
            value={formData.hint}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter a hint (optional)"
          />
        </div>

        <div>
          <label className="font-medium block mb-1">Card Image (Optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, 'imageUrl')}
            className="mt-2"
          />
          {uploadingImageUrl && <p className="text-sm text-gray-500">Uploading...</p>}
          {formData.imageUrl && (
            <img
              src={formData.imageUrl}
              alt="Card"
              className="h-32 mt-2 rounded border"
            />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="font-medium block mb-1">Mastery Level</label>
            <select
              name="masteryLevel"
              value={formData.masteryLevel}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            >
              <option value={1}>Beginner</option>
              <option value={2}>Intermediate</option>
              <option value={3}>Advanced</option>
            </select>
          </div>
          <div>
            <label className="font-medium block mb-1">Confidence Level</label>
            <select
              name="confidenceLevel"
              value={formData.confidenceLevel}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 rounded"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditFlashcardPage;
