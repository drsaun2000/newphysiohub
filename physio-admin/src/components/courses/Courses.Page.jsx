import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Search,
  FileText,
  Trash2,
  Pencil,
  Eye,
  Plus,
} from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CoursePage = () => {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [lessonTitle, setLessonTitle] = useState('');
  const [contents, setContents] = useState([{ type: 'video', title: '', url: '' }]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);

  const navigate = useNavigate();
  const SERVER_URL = import.meta.env.VITE_DEV_API_URL;

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}courses/getAllCourses`, {
        withCredentials: true,
      });
      setCourses(res.data.data);
    } catch (err) {
      console.error('Error fetching courses:', err);
    }
  };

  const deleteCourse = async () => {
    try {
      await axios.delete(`${SERVER_URL}courses/delete/${courseToDelete}`, {
        withCredentials: true,
      });
      setCourses(courses.filter((course) => course._id !== courseToDelete));
      setShowDeleteModal(false);
      setCourseToDelete(null);
    } catch (err) {
      console.error('Error deleting course:', err);
    }
  };

  const confirmDeleteCourse = (id) => {
    setCourseToDelete(id);
    setShowDeleteModal(true);
  };

  const handleAddContentField = () => {
    setContents([...contents, { type: 'video', title: '', url: '' }]);
  };

  const handleContentChange = (index, key, value) => {
    const newContents = [...contents];
    newContents[index][key] = value;
    setContents(newContents);
  };

  const handleVideoUpload = async (index, file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post(`${SERVER_URL}quizzes/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      const uploadedUrl = res.data.data.url;

      const newContents = [...contents];
      newContents[index].url = uploadedUrl;
      setContents(newContents);
    } catch (error) {
      console.error('Video upload failed:', error);
    }
  };

  const openModal = (courseId) => {
    setSelectedCourseId(courseId);
    setLessonTitle('');
    setContents([{ type: 'video', title: '', url: '' }]);
    setShowModal(true);
  };

  const handleAddLesson = async () => {
    try {
      const payload = { lessonTitle, contents };
      await axios.post(
        `${SERVER_URL}courses/add-to-course/${selectedCourseId}`,
        payload,
        { withCredentials: true }
      );
      setShowModal(false);
      fetchCourses();
    } catch (err) {
      console.error('Error adding lesson:', err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 p-6 overflow-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <ArrowLeft
              className="text-gray-500 cursor-pointer"
              onClick={() => navigate(-1)}
            />
            <h1 className="text-xl font-semibold text-gray-800">Courses</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-md border border-gray-200 bg-white shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400"
              />
            </div>

            <button
              onClick={() => navigate('/create-course')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm"
            >
              + Create Course
            </button>
          </div>
        </div>

        <h2 className="text-sm text-gray-500 font-medium mb-4 flex items-center gap-1">
          <FileText className="h-4 w-4 text-indigo-500" />
          Published Courses
        </h2>

        <div className="space-y-4">
          {courses
            .filter((course) =>
              course.title.toLowerCase().includes(search.toLowerCase())
            )
            .map((course, idx) => (
              <div
                key={idx}
                className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex justify-between items-start"
              >
                <div className="flex flex-col flex-1">
                  <p className="text-xs font-semibold mb-1 text-blue-500">
                    {course.categories?.[0] || 'Uncategorized'}
                  </p>
                  <h3 className="text-sm font-medium text-gray-800 mb-1 leading-snug">
                    {course.title}
                  </h3>
                  <span className="text-xs text-gray-500">
                    {new Date(course.createdAt).toLocaleDateString()} •{' '}
                    {course.status}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    className="p-1 hover:bg-gray-100 rounded"
                    onClick={() => navigate(`/view-course/${course._id}`)}
                  >
                    <Eye className="h-4 w-4 text-gray-500" />
                  </button>
                  <button
                    className="p-1 hover:bg-gray-100 rounded"
                    onClick={() => navigate(`/edit-course/${course._id}`)}
                  >
                    <Pencil className="h-4 w-4 text-gray-500" />
                  </button>
                  <button
                    className="p-1 hover:bg-gray-100 rounded"
                    onClick={() => openModal(course._id)}
                  >
                    <Plus className="h-4 w-4 text-gray-500" />
                  </button>
                  <button
                    className="p-1 hover:bg-gray-100 rounded"
                    onClick={() => confirmDeleteCourse(course._id)}
                  >
                    <Trash2 className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
              </div>
            ))}
        </div>

        {/* Add Lesson Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-lg">
              <h2 className="text-lg font-semibold mb-4">Add Lesson</h2>

              <input
                type="text"
                value={lessonTitle}
                onChange={(e) => setLessonTitle(e.target.value)}
                placeholder="Lesson Title"
                className="w-full mb-4 px-3 py-2 border rounded"
              />

              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {contents.map((content, index) => (
                  <div key={index} className="space-y-2 border p-3 rounded">
                    <select
                      value={content.type}
                      onChange={(e) =>
                        handleContentChange(index, 'type', e.target.value)
                      }
                      className="w-full px-3 py-2 border rounded"
                    >
                      <option value="video">Video</option>
                      <option value="article">Article</option>
                      <option value="quiz">Quiz</option>
                    </select>
                    <input
                      type="text"
                      value={content.title}
                      onChange={(e) =>
                        handleContentChange(index, 'title', e.target.value)
                      }
                      placeholder="Content Title"
                      className="w-full px-3 py-2 border rounded"
                    />
                    {content.type === 'video' ? (
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) =>
                          e.target.files?.[0] &&
                          handleVideoUpload(index, e.target.files[0])
                        }
                        className="w-full px-3 py-2 border rounded"
                      />
                    ) : (
                      <input
                        type="url"
                        value={content.url}
                        onChange={(e) =>
                          handleContentChange(index, 'url', e.target.value)
                        }
                        placeholder="Content URL"
                        className="w-full px-3 py-2 border rounded"
                      />
                    )}
                  </div>
                ))}
              </div>

              <button
                className="mt-3 text-indigo-600 hover:underline text-sm"
                onClick={handleAddContentField}
              >
                + Add Content
              </button>

              <div className="mt-4 flex justify-end gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm border rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddLesson}
                  className="px-4 py-2 bg-indigo-600 text-white text-sm rounded"
                >
                  Add Lesson
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-sm">
              <h2 className="text-lg font-semibold mb-4 text-red-600">
                Confirm Deletion
              </h2>
              <p className="text-sm text-gray-700 mb-6">
                Are you sure you want to delete this course? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-sm border rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteCourse}
                  className="px-4 py-2 bg-red-600 text-white text-sm rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursePage;
