import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ViewCoursePage = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const SERVER_URL = import.meta.env.VITE_DEV_API_URL;

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`${SERVER_URL}courses/get/${id}`);
        setCourse(res.data.data);
      } catch (err) {
        console.error('Failed to fetch course:', err);
      }
    };

    fetchCourse();
  }, [id]);

  if (!course)
    return <p className="p-6 text-center text-gray-600 text-lg">Loading course...</p>;

  return (
    <main className="p-6 max-w-5xl mx-auto bg-white shadow-md rounded-lg">
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold text-indigo-700 border-b-4 border-indigo-500 pb-2">
          {course.title}
        </h1>
      </header>

      {course.coverImageUrl && (
        <img
          src={course.coverImageUrl}
          alt={`${course.title} cover`}
          className="w-full max-h-96 object-cover rounded-md shadow mb-6"
        />
      )}

      <section className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Description</h2>
        <p className="text-gray-700 leading-relaxed">{course.description}</p>
      </section>

      <section className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <strong className="block text-gray-800">Status:</strong>
          <span className="capitalize text-gray-600">{course.status}</span>
        </div>

     <div className="flex items-center gap-3">
        <strong className="block text-gray-800">Teacher:</strong>
      <img src={course.instructorprofilePic}alt={course.instructor.name} className="w-8 h-8 rounded-full" />
      <span>{course.instructor.name} ({course.instructor.email})</span>
    </div>

        <div>
          <strong className="block text-gray-800">Categories:</strong>
          <span className="text-gray-600">
            {course.categories?.join(', ') || 'N/A'}
          </span>
        </div>

        <div>
          <strong className="block text-gray-800">Prerequisites:</strong>
          <span className="text-gray-600">
            {course.prerequisites?.join(', ') || 'None'}
          </span>
        </div>
      </section>

      <section aria-labelledby="lessons-heading" className="mb-6">
        <h2
          id="lessons-heading"
          className="text-xl font-semibold text-gray-700 mb-4"
        >
          Lessons
        </h2>

        <ul className="space-y-4">
          {course.lessons.map((lesson) => (
            <li
              key={lesson._id}
              className="border border-gray-200 rounded-lg p-5 bg-gray-50 shadow-sm"
            >
              <h3 className="text-lg font-bold text-indigo-600 mb-2">
                {lesson.lessonTitle}
              </h3>
              <ul className="list-disc list-inside space-y-1 pl-3">
                {lesson.contents.map((content) => (
                  <li key={content._id} className="text-gray-700 text-sm">
                    <span className="font-semibold capitalize">{content.type}:</span>{' '}
                    {content.title}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
};

export default ViewCoursePage;
