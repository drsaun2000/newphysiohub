import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Users,
  BookOpen,
  Layers,
  StickyNote,
} from 'lucide-react';

const Dashboard = () => {
  const SERVER_URL = import.meta.env.VITE_DEV_API_URL;

  const [data, setData] = useState({
    users: [],
    quizzes: [],
    courses: [],
    flashcards: [],
  });
  const [pages, setPages] = useState({
    users: 1,
    courses: 1,
  });
  const perPage = 5;

  const fetchData = async () => {
    try {
      const [usersRes, quizzesRes, coursesRes, flashcardsRes] = await Promise.all([
        axios.get(`${SERVER_URL}users/getAllUsers`),
        axios.get(`${SERVER_URL}quizzes`),
        axios.get(`${SERVER_URL}courses/getAllCourses`),
        axios.get(`${SERVER_URL}flashcards/getAllFlashcards`),
      ]);

      setData({
        users: usersRes.data?.data || [],
        quizzes: quizzesRes.data?.data || [],
        courses: coursesRes.data?.data || [],
        flashcards: flashcardsRes.data?.data || [],
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getPaginated = (type) => {
    const start = (pages[type] - 1) * perPage;
    return data[type].slice(start, start + perPage);
  };

  const changePage = (type, direction) => {
    setPages((prev) => ({
      ...prev,
      [type]: Math.max(1, Math.min(prev[type] + direction, Math.ceil(data[type].length / perPage))),
    }));
  };

  const stats = [
    {
      label: 'All Users',
      icon: <Users className="h-6 w-6 text-white" />,
      count: data.users.length,
      bgColor: 'bg-indigo-500',
    },
    {
      label: 'All Quizzes',
      icon: <StickyNote className="h-6 w-6 text-white" />,
      count: data.quizzes.length,
      bgColor: 'bg-purple-500',
    },
    {
      label: 'All Courses',
      icon: <BookOpen className="h-6 w-6 text-white" />,
      count: data.courses.length,
      bgColor: 'bg-green-500',
    },
    {
      label: 'All Flashcards',
      icon: <Layers className="h-6 w-6 text-white" />,
      count: data.flashcards.length,
      bgColor: 'bg-pink-500',
    },
  ];

  const TableCard = ({ title, type }) => {
    const items = getPaginated(type);
    const totalPages = Math.ceil(data[type].length / perPage);
    const currentPage = pages[type];

    return (
      <div className="bg-white border shadow-md rounded-2xl p-6 min-h-[300px]">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">{title}</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600 border-b">
              <th className="py-2">#</th>
              <th className="py-2">Title</th>
              <th className="py-2">Details</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item._id || index} className="border-b text-gray-700">
                <td className="py-2 text-xs">{index + 1 + (currentPage - 1) * perPage}</td>
                <td className="py-2 text-sm font-medium max-w-[200px] truncate">
                  {type === 'users' ? item.name : item.title}
                </td>
                <td className="py-2 text-xs text-gray-500 max-w-[250px] truncate overflow-hidden whitespace-nowrap">
                  {type === 'users' ? item.email : item.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>


        {totalPages > 1 && (
          <div className="mt-4 flex justify-between items-center text-sm">
            <button
              onClick={() => changePage(type, -1)}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded bg-gray-200 disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => changePage(type, 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded bg-gray-200 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="flex items-center p-4 bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition"
          >
            <div className={`p-3 rounded-full ${stat.bgColor} shadow-inner mr-4`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <h3 className="text-xl font-bold text-gray-800">{stat.count}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TableCard title="Recent Users" type="users" />
        <TableCard title="Recent Courses" type="courses" />
      </div>
    </div>
  );
};

export default Dashboard;
