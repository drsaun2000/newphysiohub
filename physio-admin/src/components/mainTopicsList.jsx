import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import DeleteConfirmationModal from './modals/delete.confirmation.page';

const MainTopicsListPage = () => {
  const SERVER_URL = import.meta.env.VITE_DEV_API_URL;
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const fetchTopics = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${SERVER_URL}main-topics`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTopics(res.data.data);
    } catch (err) {
      setError('Failed to load main topics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (id) => {
    setSelectedTopicId(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await axios.delete(`${SERVER_URL}main-topics/${selectedTopicId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      toast.success('Topic deleted successfully');
      setDeleteModalOpen(false);
      setSelectedTopicId(null);
      fetchTopics(); // Refresh
    } catch (err) {
      console.error('Failed to delete topic:', err);
      toast.error('Error deleting topic');
      setDeleteModalOpen(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Main Topics</h1>
        <Link
          to="/create-topic"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Create New Topic
        </Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : topics.length === 0 ? (
        <p>No main topics found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left">#</th>
                <th className="border px-4 py-2 text-left">Topic Name</th>
                <th className="border px-4 py-2 text-left">ID</th>
                <th className="border px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {topics.map((topic, index) => (
                <tr key={topic._id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{topic.name}</td>
                  <td className="border px-4 py-2 text-sm text-gray-600">{topic._id}</td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => openDeleteModal(topic._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirmed}
        title="Delete Topic"
        message="Are you sure you want to delete this topic? This action cannot be undone."
      />
    </div>
  );
};

export default MainTopicsListPage;
