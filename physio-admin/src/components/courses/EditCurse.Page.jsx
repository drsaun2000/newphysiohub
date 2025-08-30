import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const EditCoursePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const SERVER_URL = import.meta.env.VITE_DEV_API_URL;

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`${SERVER_URL}courses/get/${id}`);
        const course = res.data.data;
        setFormData({
          title: course.title,
          description: course.description,
          categories: course.categories.join(', '),
          prerequisites: course.prerequisites.join(', '),
          status: course.status,
          lessons: course.lessons,
        });
      } catch (err) {
        toast.error('Error fetching course');
      }
    };
    fetchCourse();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const removeLesson = (index) => {
    const updatedLessons = formData.lessons.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, lessons: updatedLessons }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${SERVER_URL}courses/update/${id}`,
        {
          ...formData,
          categories: formData.categories.split(',').map((c) => c.trim()),
          prerequisites: formData.prerequisites.split(',').map((p) => p.trim()),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      toast.success('Course updated successfully');
      navigate('/courses');
    } catch (err) {
      toast.error('Failed to update course');
    }
  };

  if (!formData) return <p className="p-6 text-center text-gray-600">Loading course...</p>;

  return (
    <main className="p-6 max-w-4xl mx-auto bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold text-indigo-700 mb-6">Edit Course</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-medium text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">Categories (comma separated)</label>
          <input
            type="text"
            name="categories"
            value={formData.categories}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">Prerequisites (comma separated)</label>
          <input
            type="text"
            name="prerequisites"
            value={formData.prerequisites}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Lessons</h2>
          {formData.lessons.map((lesson, index) => (
            <div
              key={index}
              className="border border-gray-300 rounded p-4 mb-4 bg-gray-50 relative"
            >
              <h3 className="text-md font-medium text-gray-700">{lesson.lessonTitle}</h3>
              <button
                type="button"
                onClick={() => removeLesson(index)}
                className="absolute top-2 right-2 text-red-600 hover:underline text-sm"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
        >
          Save Changes
        </button>
      </form>
    </main>
  );
};

export default EditCoursePage;
