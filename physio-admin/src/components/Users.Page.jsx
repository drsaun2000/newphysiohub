import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  ArrowLeft,
  Search,
  FileText,
  ShieldAlert,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AllUsersPage = () => {
  const SERVER_URL = import.meta.env.VITE_DEV_API_URL;
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}users/getAllUsers`);
      setUsers(res.data.data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.put(
        `${SERVER_URL}users/role/${userId}`,
        { role: newRole },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      fetchUsers();
    } catch (err) {
      console.error('Error updating role:', err);
    }
  };

  const handleBanToggle = async (userId, isBanned) => {
    try {
      await axios.patch(
        `${SERVER_URL}users/ban-toggle`,
        {
          userId,
          isBanned,
          reason: isBanned ? 'Violation of guidelines' : 'Cleared',
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      fetchUsers();
    } catch (err) {
      console.error('Error toggling ban status:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = users.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(users.length / usersPerPage);

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 p-6 overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <ArrowLeft
              className="text-gray-500 cursor-pointer"
              onClick={() => navigate(-1)}
            />
            <h1 className="text-xl font-semibold text-gray-800">All Users</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or role..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-md border border-gray-200 bg-white shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400"
              />
            </div>

            <button
              onClick={() => navigate('/create-user')}
              className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-md shadow hover:bg-indigo-700 transition"
            >
              Create User
            </button>
          </div>
        </div>

        {/* Table */}
        <div>
          <h2 className="text-sm text-gray-500 font-medium mb-4 flex items-center gap-1">
            <FileText className="h-4 w-4 text-indigo-500" />
            Users List
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="p-2">Name</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Mobile</th>
                  <th className="p-2">City</th>
                  <th className="p-2">State</th>
                  <th className="p-2">Role</th>
                  <th className="p-2">Change Role</th>
                  <th className="p-2">Ban/Unban</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers
                  .filter(
                    (user) =>
                      user.name.toLowerCase().includes(search.toLowerCase()) ||
                      user.email.toLowerCase().includes(search.toLowerCase()) ||
                      user.role.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((user) => (
                    <tr key={user._id} className="border-b hover:bg-gray-50">
                      <td className="p-2">{user.name}</td>
                      <td className="p-2">{user.email}</td>
                      <td className="p-2">{user.mobileNumber}</td>
                      <td className="p-2">{user.city}</td>
                      <td className="p-2">{user.state}</td>
                      <td className="p-2 capitalize">{user.role}</td>
                      <td className="p-2">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user._id, e.target.value)}
                          className="p-1 border rounded"
                        >
                          <option value="user">User</option>
                          <option value="instructor">Teacher</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="p-2">
                        <select
                          value={user.isBanned ? 'true' : 'false'}
                          onChange={(e) =>
                            handleBanToggle(user._id, e.target.value === 'true')
                          }
                          className="p-1 border rounded"
                        >
                          <option value="false">Unban</option>
                          <option value="true">Ban</option>
                        </select>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="font-medium">{currentPage} / {totalPages}</span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllUsersPage;
