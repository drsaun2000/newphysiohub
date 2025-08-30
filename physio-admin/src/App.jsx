import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import './App.css';
import { Toaster } from 'react-hot-toast';
import LoginPage from './components/login.page';
import Sidebar from './components/Sidebar';
import DashboardPage from './components/Dashboard.Page';
import QuizPage from './components/quiz/Quiz.Page.jsx';
import CreateQuizPage from './components/quiz/Create.Quiz.page.jsx';
import EditQuizPage from './components/quiz/Edit.Quiz.Page.jsx';
import AllUsersPage from './components/Users.Page';
import CoursePage from './components/courses/Courses.Page.jsx';
import EditCoursePage from './components/courses/EditCurse.Page.jsx';
import ViewCoursePage from './components/courses/ViewCourse.Page.jsx';
import EditFlashcardPage from './components/flashcards/EditFlashcards.jsx';
import CreateFlashcardPage from './components/flashcards/CreateFlashcard.Page.jsx';
import CreateUserPage from './components/Create.user.page.jsx';
import CreateMainTopicPage from './components/createTopicPage.jsx';
import MainTopicsListPage from './components/mainTopicsList.jsx';
import FlashcardTopicsPage from './components/flashcards/topics.list.jsx';
import FlashcardsByTopicPage from './components/flashcards/flashcardbytopic.jsx';
import CreateCoursePage from './components/courses/createCourses.jsx';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null); // null = checking
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = Cookies.get('token');

    if (token) {
      setIsLoggedIn(true);
      const userCookie = Cookies.get('user');
      const parsedUser = userCookie ? JSON.parse(userCookie) : null;
      setRole(parsedUser?.role || null);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    const userCookie = Cookies.get('user');
    const parsedUser = userCookie ? JSON.parse(userCookie) : null;
    setRole(parsedUser?.role || null);
  };

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('user');
    setIsLoggedIn(false);
    setRole(null);
  };

  if (isLoggedIn === null) return null;

  return (
    <>
    <Toaster position="top-right" reverseOrder={false} />
    <Router>
      {isLoggedIn ? (
        <div className="flex h-screen">
          <Sidebar role={role} onLogout={handleLogout} />
          <div className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/quizzes" element={<QuizPage />} />
              <Route path="/users" element={<AllUsersPage />} />
              <Route path="/create-user" element={<CreateUserPage />} />
              <Route path="/create-quiz" element={<CreateQuizPage />} />
              <Route path="/edit-quiz/:id" element={<EditQuizPage />} />
              <Route path="/courses" element={<CoursePage />} />
              <Route path="/create-course" element={<CreateCoursePage />} />
              <Route path="/edit-course/:id" element={<EditCoursePage />} />
              <Route path="/view-course/:id" element={<ViewCoursePage />} />
           <Route path="/flashcard-topics" element={<FlashcardTopicsPage />} />
            <Route path="/flashcards/:topicId" element={<FlashcardsByTopicPage />} />
            <Route path="/create-flashcard" element={<CreateFlashcardPage />} />
            <Route path="/edit-flashcard/:id" element={<EditFlashcardPage />} />


              <Route path="/create-topic" element={<CreateMainTopicPage />} />
              <Route path="/topic" element={<MainTopicsListPage />} />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </Router>
    </>
  );
}

export default App;
