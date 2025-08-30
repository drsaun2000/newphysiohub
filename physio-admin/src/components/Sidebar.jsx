import React from 'react';
import {
  Home,
  FileText,
  Grid,
  MessageSquare,
  Square,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const menuItems = [
  { icon: <Grid size={18} />, label: 'Dashboard', to: '/dashboard' },
  { icon: <Grid size={18} />, label: 'Users', to: '/users' },
  { icon: <FileText size={18} />, label: 'Quizzes', to: '/quizzes' },
  { icon: <MessageSquare size={18} />, label: 'Flashcards', to: '/flashcard-topics' },
  { icon: <Square size={18} />, label: 'Course', to: '/courses' },
  { icon: <Square size={18} />, label: 'Topic', to: '/topic' },
];

const Sidebar = ({ role = 'Admin', onLogout }) => {
  const location = useLocation();

  return (
    <div className="flex flex-col justify-between min-h-screen w-56 bg-white border-r shadow-sm">
      {/* Top: Logo and Menu */}
      <div>
        <div className="flex items-center justify-center py-6 border-b">
          <Home className="text-purple-600" size={28} />
        </div>

        <nav className="mt-6 flex flex-col gap-1 px-3">
          {menuItems.map(({ to, label, icon }, i) => {
            const isActive = location.pathname === to;
            return (
              <Link
                key={i}
                to={to}
                className={`flex items-center gap-3 px-3 py-2 rounded-md font-medium text-sm transition-all
                ${isActive
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-700 hover:bg-gray-100'}`}
              >
                <span className="text-gray-500">{icon}</span>
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom: Profile & Logout */}
      <div className="flex items-center gap-3 p-4 border-t">
        <img
          src="https://randomuser.me/api/portraits/women/44.jpg"
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-800">{role}</p>
          <p className="text-xs text-gray-500 capitalize">
            {role === 'admin' ? 'Admin' : 'Admin'}
          </p>
          <button
            onClick={onLogout}
            className="text-xs text-red-500 mt-1 hover:underline"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
