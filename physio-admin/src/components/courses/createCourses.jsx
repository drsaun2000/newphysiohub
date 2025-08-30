import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateCoursePage = () => {
  const navigate = useNavigate();
  const SERVER_URL = import.meta.env.VITE_DEV_API_URL;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'draft',
    categories: [''],
    prerequisites: [''],
    isFree: true,
    price: 0,
    estimatedDuration: 0,
    coverImageUrl: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let parsedValue = value;

    if (type === 'checkbox') parsedValue = checked;
    if (['price', 'estimatedDuration'].includes(name)) parsedValue = parseFloat(value);

    setFormData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  const handleArrayChange = (e, field, index) => {
    const newArray = [...formData[field]];
    newArray[index] = e.target.value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayField = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const handleCoverImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const form = new FormData();
    form.append('file', file);

    try {
      const res = await axios.post(`${SERVER_URL}quizzes/upload`, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      let imageUrl = res.data.secure_url || res.data.data.url;

      if (!/^https?:\/\//i.test(imageUrl)) {
        imageUrl = `https://${imageUrl}`;
      }
      setFormData((prev) => ({
        ...prev,
        coverImageUrl: imageUrl,
      }));
    } catch (err) {
      console.error('Image upload failed:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: formData.isFree ? 0 : formData.price,
      };

      console.log('Submitting payload:', payload);

      await axios.post(`${SERVER_URL}courses/create`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      navigate('/courses');
    } catch (err) {
      console.error('Error creating course:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-8 text-center text-indigo-700">Create New Course</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">

        {/* Title */}
        <div>
          <label className="font-semibold text-sm mb-1 block">Title</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Course title"
          />
        </div>

        {/* Description */}
        <div>
          <label className="font-semibold text-sm mb-1 block">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            placeholder="Course description"
          />
        </div>

        {/* Status */}
        <div>
          <label className="font-semibold text-sm mb-1 block">
            Status <span className="text-gray-400 text-xs">(Optional)</span>
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {/* Categories */}
        <div>
          <label className="font-semibold text-sm mb-2 block">
            Categories <span className="text-gray-400 text-xs">(Optional)</span>
          </label>
          {formData.categories.map((cat, idx) => (
            <input
              key={idx}
              value={cat}
              onChange={(e) => handleArrayChange(e, 'categories', idx)}
              className="w-full mb-3 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder={`Category ${idx + 1}`}
            />
          ))}
          <button
            type="button"
            onClick={() => addArrayField('categories')}
            className="text-indigo-600 font-semibold text-sm hover:underline"
          >
            + Add Category
          </button>
        </div>

        {/* Prerequisites */}
        <div>
          <label className="font-semibold text-sm mb-2 block">
            Prerequisites <span className="text-gray-400 text-xs">(Optional)</span>
          </label>
          {formData.prerequisites.map((pre, idx) => (
            <input
              key={idx}
              value={pre}
              onChange={(e) => handleArrayChange(e, 'prerequisites', idx)}
              className="w-full mb-3 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder={`Prerequisite ${idx + 1}`}
            />
          ))}
          <button
            type="button"
            onClick={() => addArrayField('prerequisites')}
            className="text-indigo-600 font-semibold text-sm hover:underline"
          >
            + Add Prerequisite
          </button>
        </div>

        {/* Is Free */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="isFree"
            checked={formData.isFree}
            onChange={handleChange}
            className="h-4 w-4"
          />
          <label className="font-semibold text-sm">Is Free?</label>
        </div>

        {/* Price */}
        {!formData.isFree && (
          <div>
            <label className="font-semibold text-sm mb-1 block">
              Price ($) <span className="text-gray-400 text-xs">(Optional)</span>
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              min={0}
              step={0.01}
              placeholder="Enter price"
            />
          </div>
        )}

        {/* Estimated Duration */}
        <div>
          <label className="font-semibold text-sm mb-1 block">
            Estimated Duration (hours) <span className="text-gray-400 text-xs">(Optional)</span>
          </label>
          <input
            type="number"
            name="estimatedDuration"
            value={formData.estimatedDuration}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            min={0}
            placeholder="e.g. 10"
          />
        </div>

        {/* Cover Image */}
        <div>
          <label className="font-semibold text-sm mb-1 block">
            Cover Image <span className="text-gray-400 text-xs">(Optional)</span>
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleCoverImageUpload}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {formData.coverImageUrl && (
            <img
              src={formData.coverImageUrl}
              alt="Cover Preview"
              className="mt-3 max-h-40 rounded-md shadow-md object-contain border border-gray-300"
            />
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-md text-base font-semibold transition-all"
        >
          Create Course
        </button>
      </form>
    </div>
  );
};

export default CreateCoursePage;
