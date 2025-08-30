'use client'

import { Line } from 'react-chartjs-2';
import { format, subDays, subWeeks, subMonths, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval } from 'date-fns';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';
import { useState, useEffect } from 'react';
import { RiCalendarLine } from 'react-icons/ri';
import { ChevronDown } from 'lucide-react';
import { FaTrophy, FaArrowRight } from 'react-icons/fa';
import { AiOutlineArrowUp, AiOutlineArrowDown } from 'react-icons/ai';
import LottiePlayer from "@/components/animations/LottiePlayer";
import run from "@/components/animations/data/Hi.json";
import useGet from "@/hooks/useGet";
import useGetForDash from "@/hooks/useGetForDash";
import axios from 'axios';
import { responsiveFontSizes } from '@mui/material';
// import Cookies from "js-cookie"
const api_url = process.env.NEXT_PUBLIC_API_BASE_URL
ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

// RecentActivity component
const RecentActivity = () => {
    const activities = [
        {
            image: "/lungs.png",
            title: "Anatomy Upper Quadrant",
            type: "Quiz",
            questionsLeft: 20,
            progress: 48,
        },
        {
            image: "/lungs.png",
            title: "Anatomy Upper Quadrant",
            type: "Quiz",
            questionsLeft: 20,
            progress: 48,
        },
        {
            image: "/lungs.png",
            title: "Anatomy Upper Quadrant",
            type: "Quiz",
            questionsLeft: 20,
            progress: 48,
        }
    ];

    return (
        <div className="p-4 sm:p-6 bg-white rounded-lg border w-full max-w-[300px] mx-auto lg:mx-0">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">Recent Activity</h3>
                <button className="text-purple-600 text-xs flex items-center space-x-2">
                    <span>View All</span>
                    <FaArrowRight size={12} />
                </button>
            </div>

            <div className="space-y-3">
                {activities.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3 hover:bg-gray-100 p-2 rounded-lg">
                        <img
                            src={activity.image}
                            alt={activity.title}
                            className="w-12 h-12 object-cover rounded-md"
                        />
                        <div className="flex-1">
                            <h4 className="font-semibold text-sm">{activity.title}</h4>
                            <p className="text-xs text-gray-500">{activity.type} • {activity.questionsLeft} questions left</p>
                            <div className='flex justify-between items-center mt-1'>
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                    <div
                                        className="bg-green-500 h-1.5 rounded-full"
                                        style={{ width: `${activity.progress}%` }}
                                    />
                                </div>
                                <div className="text-xs text-gray-500 ml-2">{activity.progress}%</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// PerformanceChart component
const PerformanceChart = ({ userData }) => {
    const [timeRange, setTimeRange] = useState('week');
    const [selectedDateRange, setSelectedDateRange] = useState({
        start: subDays(new Date(), 7),
        end: new Date()
    });
    const [dateLabels, setDateLabels] = useState([]);

    

    useEffect(() => {
        let labels = [];
        if (timeRange === 'day') {
            labels = Array.from({ length: 24 }, (_, i) => `${i}:00`);
        } else if (timeRange === 'week') {
            labels = eachDayOfInterval({
                start: selectedDateRange.start,
                end: selectedDateRange.end
            }).map(date => format(date, 'dd MMM'));
        } else if (timeRange === 'month') {
            labels = eachWeekOfInterval({
                start: selectedDateRange.start,
                end: selectedDateRange.end
            }).map(date => `Week ${format(date, 'w')}`);
        } else if (timeRange === 'year') {
            labels = eachMonthOfInterval({
                start: selectedDateRange.start,
                end: selectedDateRange.end
            }).map(date => format(date, 'MMM yyyy'));
        }
        setDateLabels(labels);
    }, [timeRange, selectedDateRange]);

    const processActivityData = () => {
        if (!userData) return { quizzes: [], courses: [] };

        const quizzes = userData.joinedQuizzes || [];
        const courses = userData.coursesEnrolled || [];

        return {
            quizzes: quizzes.map(quiz => {
                try {
                    const dateString = quiz.updatedAt || quiz.createdAt;
                    const date = dateString ? new Date(dateString) : new Date();
                    return { date: date ? date : new Date() };
                } catch {
                    return { date: new Date() };
                }
            }),
            courses: courses.map(course => {
                try {
                    const dateString = course.updatedAt || course.createdAt;
                    const date = dateString ? new Date(dateString) : new Date();
                    return { date: date ? date : new Date() };
                } catch {
                    return { date: new Date() };
                }
            })
        };
    };

    const prepareChartData = () => {
        const activityData = processActivityData();
        
        const countActivities = (activities) => {
            return dateLabels.map(label => {
                let count = 0;
                
                activities.forEach(activity => {
                    const activityDate = activity.date;
                    if (!activityDate) return;

                    try {
                        if (timeRange === 'day') {
                            const hour = label.split(':')[0];
                            if (format(activityDate, 'HH') === hour.padStart(2, '0')) {
                                count++;
                            }
                        } else if (timeRange === 'week') {
                            if (format(activityDate, 'dd MMM') === label) {
                                count++;
                            }
                        } else if (timeRange === 'month') {
                            const weekNum = label.split(' ')[1];
                            if (format(activityDate, 'w') === weekNum) {
                                count++;
                            }
                        } else if (timeRange === 'year') {
                            if (format(activityDate, 'MMM yyyy') === label) {
                                count++;
                            }
                        }
                    } catch (error) {
                        console.error('Error formatting date:', error);
                    }
                });
                
                return count;
            });
        };

        return {
            labels: dateLabels,
            datasets: [
                {
                    label: 'Courses',
                    data: countActivities(activityData.courses),
                    borderColor: 'rgba(75, 0, 130, 1)',
                    backgroundColor: 'rgba(75, 0, 130, 0.1)',
                    fill: true,
                    tension: 0.4,
                },
                {
                    label: 'Quizzes',
                    data: countActivities(activityData.quizzes),
                    borderColor: 'rgba(0, 255, 255, 1)',
                    backgroundColor: 'rgba(0, 255, 255, 0.1)',
                    fill: true,
                    tension: 0.4,
                }
            ]
        };
    };

    const handleTimeRangeChange = (range) => {
        setTimeRange(range);
        let startDate;
        
        switch (range) {
            case 'day':
                startDate = subDays(new Date(), 1);
                break;
            case 'week':
                startDate = subWeeks(new Date(), 1);
                break;
            case 'month':
                startDate = subMonths(new Date(), 1);
                break;
            case 'year':
                startDate = subMonths(new Date(), 12);
                break;
            default:
                startDate = subDays(new Date(), 7);
        }
        
        setSelectedDateRange({
            start: startDate,
            end: new Date()
        });
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: { display: false },
            legend: { display: false },
            tooltip: {
                callbacks: {
                    title: (tooltipItem) => tooltipItem[0].label,
                    label: (context) => `${context.dataset.label}: ${context.raw} activities`
                }
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: timeRange === 'day' ? 'Hour' : 
                          timeRange === 'week' ? 'Day' :
                          timeRange === 'month' ? 'Week' : 'Month',
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Number of Activities',
                },
                min: 0,
                ticks: {
                    stepSize: 1
                }
            }
        }
    };

    if (!userData) {
        return (
            <div className="flex flex-col bg-white p-4 sm:p-6 rounded-lg border mt-4 w-full h-64 justify-center items-center">
                <div className="text-gray-500">Loading user data...</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col bg-white p-4 sm:p-6 rounded-lg border mt-4 w-full">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-2 sm:space-y-0">
                <h3 className="text-lg font-semibold">Learning Activity</h3>
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                    <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                            <span className="w-3 h-3 rounded-sm bg-purple-500 mr-2"></span>
                            <p className="text-xs text-gray-600">Courses</p>
                        </div>
                        <div className="flex items-center">
                            <span className="w-3 h-3 rounded-sm bg-teal-400 mr-2"></span>
                            <p className="text-xs text-gray-600">Quizzes</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center">
                        <button 
                            onClick={() => handleTimeRangeChange('day')} 
                            className={`text-xs px-2 py-1 rounded-l-md ${timeRange === 'day' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'}`}
                        >
                            Day
                        </button>
                        <button 
                            onClick={() => handleTimeRangeChange('week')} 
                            className={`text-xs px-2 py-1 ${timeRange === 'week' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'}`}
                        >
                            Week
                        </button>
                        <button 
                            onClick={() => handleTimeRangeChange('month')} 
                            className={`text-xs px-2 py-1 ${timeRange === 'month' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'}`}
                        >
                            Month
                        </button>
                        <button 
                            onClick={() => handleTimeRangeChange('year')} 
                            className={`text-xs px-2 py-1 rounded-r-md ${timeRange === 'year' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'}`}
                        >
                            Year
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="h-64">
                {dateLabels.length > 0 ? (
                    <Line data={prepareChartData()} options={options} />
                ) : (
                    <div className="flex h-full items-center justify-center text-gray-500">
                        No activity data available for the selected period
                    </div>
                )}
            </div>
        </div>
    );
};

// Leaderboard component

const Leaderboard = ({ data, currentUserId }) => {
  // Process the data to include rank suffixes and identify current user
  const processedData = data.map(entry => ({
      rank: entry.rank,
      rankDisplay: `${entry.rank}${getRankSuffix(entry.rank)}`,
      name: entry.userId.name,
      points: entry.totalScore,
      profilePic: entry.userId.profilePic || '/avatar.png', // Fallback to default avatar
      isCurrentUser: entry.userId._id === currentUserId,
      quizzesPlayed: entry.totalQuizzesPlayed,
      // For demo purposes, we'll randomly assign up/down - in real app you'd compare with previous data
      change: Math.random() > 0.5 ? 'up' : 'down',
      level: entry.userId.level || 'Beginner' // Default to Beginner if not specified
  }));

  // Function to add proper suffix to rank
  function getRankSuffix(rank) {
      if (rank % 100 >= 11 && rank % 100 <= 13) {
          return 'th';
      }
      switch (rank % 10) {
          case 1: return 'st';
          case 2: return 'nd';
          case 3: return 'rd';
          default: return 'th';
      }
  }

  return (
      <div className="flex flex-col p-4 sm:p-6 bg-white rounded-lg border w-full max-w-[300px] mx-auto lg:mx-0">
          <h3 className="text-lg font-semibold mb-4">Leaderboard</h3>
          <div className="space-y-4">
              {processedData.map((entry, index) => (
                  <div key={index}>
                      {index === 0 && (
                          <div className="flex items-start justify-between mb-4">
                              <span className="text-xs sm:text-sm text-gray-400">Rank</span>
                              <span className="text-xs sm:text-sm text-gray-400 w-1/3">Name</span>
                              <span className="text-xs sm:text-sm text-gray-400">Points</span>
                          </div>
                      )}
                      <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-1">
                              {entry.change === 'up' ? (
                                  <AiOutlineArrowUp className="text-green-500" size={14} />
                              ) : (
                                  <AiOutlineArrowDown className="text-red-500" size={14} />
                              )}
                              <span className="text-xs font-semibold">{entry.rankDisplay}</span>
                          </div>
                          <div className="flex items-start space-x-2 w-1/2">
                              <div className='flex flex-col justify-center items-center'>
                                  <img
                                      src={entry.profilePic}
                                      alt="Profile"
                                      className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover"
                                      onError={(e) => {
                                          e.target.onerror = null; 
                                          e.target.src = '/avatar.png';
                                      }}
                                  />
                              </div>
                              <div className='flex flex-col justify-center items-center'>
                                  <span className="text-xs sm:text-sm">
                                      {entry.isCurrentUser ? `${entry.name} (You)` : entry.name}
                                  </span>
                                  <span className="text-[10px] text-gray-500">{entry.level}</span>
                              </div>
                          </div>
                          <span className="text-xs sm:text-sm text-gray-600">{entry.points}</span>
                      </div>
                      {index < processedData.length - 1 && (
                          <div className="border-t border-gray-100 my-2"></div>
                      )}
                  </div>
              ))}
          </div>
      </div>
  );
};

// ProfileCard component
const ProfileCard = ({ name, email, rank, score }) => {
    return (
        <div className="flex flex-col items-center justify-between bg-white rounded-lg border border-[#E2E8F0] p-4 sm:p-6 w-full max-w-[300px] mx-auto lg:mx-0">
            <img
                src="/avatar.png"
                alt="Profile"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4"
            />
            <h2 className="text-lg font-semibold mt-4 text-[#232B2B]">{name}</h2>
            <p className="text-xs sm:text-sm text-[#687494] mt-1">{email}</p>
            <div className='flex w-full bg-[#F6F9FC] rounded-lg py-3 mt-4'>
                <div className='flex flex-col justify-center items-center w-1/2'>
                    <span className="font-semibold text-lg sm:text-xl">{rank}</span>
                    <div className='flex space-x-1 sm:space-x-2 mt-1'>
                        <FaTrophy className="text-yellow-500" size={14} />
                        <p className="text-xs sm:text-sm text-gray-500">Rank</p>
                    </div>
                </div>
                <div className='flex flex-col justify-center items-center w-1/2 border-l'>
                    <span className="font-semibold text-lg sm:text-xl">{score}</span>
                    <div className='flex space-x-1 sm:space-x-2 mt-1'>
                        <FaTrophy className="text-yellow-500" size={14} />
                        <p className="text-xs sm:text-sm text-gray-500">Points</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ActivityTracker component
const ActivityTracker = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [activityData, setActivityData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hoveredDate, setHoveredDate] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const apiData = await useGetForDash(`/users/attendance`);
                setActivityData(apiData.data.data.activity);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching activity data:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, [currentMonth, currentYear]);

    const processActivityData = () => {
        const processedData = {};
        activityData.forEach(item => {
            const date = new Date(item.date);
            const dateString = format(date, 'yyyy-MM-dd');
            processedData[dateString] = item.activityCount;
        });
        return processedData;
    };

    const generateCalendarData = () => {
        const processedData = processActivityData();
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
        const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
        const daysInMonth = lastDayOfMonth.getDate();
        
        const firstDayOfWeek = firstDayOfMonth.getDay();
        const calendar = [];
        let currentWeek = [];
        
        for (let i = 0; i < firstDayOfWeek; i++) {
            currentWeek.push(null);
        }
        
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentYear, currentMonth, day);
            const dateString = format(date, 'yyyy-MM-dd');
            const activityCount = processedData[dateString] || 0;
            
            currentWeek.push({
                day,
                date: dateString,
                activityCount,
                hasActivity: activityCount > 0
            });
            
            if (currentWeek.length === 7) {
                calendar.push(currentWeek);
                currentWeek = [];
            }
        }
        
        if (currentWeek.length > 0) {
            while (currentWeek.length < 7) {
                currentWeek.push(null);
            }
            calendar.push(currentWeek);
        }
        
        return calendar;
    };

    const handlePrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const monthName = new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' });
    const calendarData = generateCalendarData();

    if (loading) {
        return (
            <div className="p-4 sm:p-6 bg-white rounded-lg border mt-4 w-full">
                <div className="flex justify-center items-center h-64">
                    <div className="text-gray-500">Loading activity data...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 bg-white rounded-lg border mt-4 w-full">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-2 sm:space-y-0">
                <h3 className="text-xl font-semibold">Activity Tracker</h3>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={handlePrevMonth}
                            className="text-gray-700 py-1 px-2 sm:px-3 text-sm hover:bg-gray-100 rounded"
                        >
                            &lt;
                        </button>
                        <span className="font-medium">
                            {monthName} {currentYear}
                        </span>
                        <button
                            onClick={handleNextMonth}
                            className="text-gray-700 py-1 px-2 sm:px-3 text-sm hover:bg-gray-100 rounded"
                        >
                            &gt;
                        </button>
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">
                        Total active days: {activityData.length}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-8 gap-1 mt-4 overflow-x-auto">
                <div className="col-span-1 flex flex-col items-start justify-between">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                        <div key={index} className="text-xs text-gray-500 font-medium h-6 sm:h-8 flex items-center">
                            {day}
                        </div>
                    ))}
                </div>

                <div className="col-span-7 grid grid-cols-7 gap-1">
                    {calendarData.map((week, weekIndex) => (
                        <div key={weekIndex} className="contents">
                            {week.map((day, dayIndex) => (
                                <div 
                                    key={dayIndex}
                                    className="relative"
                                    onMouseEnter={() => day && setHoveredDate(day.date)}
                                    onMouseLeave={() => setHoveredDate(null)}
                                >
                                    <div 
                                        className={`h-6 sm:h-8 rounded-sm flex items-center justify-center text-xs 
                                            ${day?.hasActivity ? 'bg-green-500 hover:bg-green-600 text-white' : 
                                            day ? 'bg-gray-100 hover:bg-gray-200' : 'bg-transparent'} 
                                            ${day ? 'cursor-pointer' : ''}`}
                                    >
                                        {day?.day || ''}
                                    </div>
                                    {hoveredDate === day?.date && day?.activityCount > 0 && (
                                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                                            {day.activityCount} activities
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// StatCard component
const StatCard = ({ icon, count, label }) => {
    return (
        <div className="bg-white border p-4 sm:p-6 rounded-lg flex flex-col items-start w-full">
            <div className="text-white rounded-full mb-3 sm:mb-4 flex items-start justify-center">
                <img src={icon} alt="Icon" className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2">{count}</p>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">{label}</p>
        </div>
    );
};

// Main Dashboard component
export default function Dashboard() {
    const [userData, setUserData] = useState({
        quizzesCompleted: [],
        coursesEnrolled: [],
        flashcardsCompleted: [],
        joinedQuizzes: [],
        rank: null,
        totalScore: 0,
        email: "",
        name: ""
    });
    const [leaderboardData, setLeaderboardData] = useState([]);
    const currentUserId = "680538fb67ba1fb79faf35d0"; // This should be the logged-in user's ID
    
    useEffect(() => {
        // Fetch your API data here
        const fetchLeaderboard = async () => {
            try {
                const response = await axios.get(`${api_url}/leaderboard/get`);
                setLeaderboardData(response.data.data); // Assuming your API returns data in the format shown
            } catch (error) {
                console.error('Error fetching leaderboard:', error);
            }
        };
        
        fetchLeaderboard();
    }, []);
    
    const fetchDashboard = async () => {
        const { data, error, status } = await useGet(`/leaderboard/me`);
        if (status === 200 && data) {
            const { user, rank, totalScore } = data;
            setUserData({
                quizzesCompleted: user.quizzesCompleted || [],
                coursesEnrolled: user.coursesEnrolled || [],
                flashcardsCompleted: user.flashcardsCompleted || [],
                joinedQuizzes: user.joinedQuizzes || [],
                email: user.email || "",
                name: user.name || "",
                rank,
                totalScore
            });
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    return (
        <div className="container mx-auto px-4 py-6">
            {/* Main grid layout */}
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Left column (main content) */}
                <div className="flex-1 space-y-6">
                    {/* Header with stats */}
                    <div className="bg-gradient-to-r from-purple-500 to-purple-700 rounded-lg p-4 sm:p-6 flex items-center justify-between">
                        <div className="text-white">
                            <h2 className="text-base sm:text-lg font-light">Total Joined Quizzes</h2>
                            <p className="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2">{userData.joinedQuizzes.length}</p>
                        </div>
                        <LottiePlayer 
                            animationFile={run} 
                            width="100px" 
                            height="80px"
                            className="hidden sm:block"
                        />
                    </div>

                    {/* Stats cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <StatCard
                            icon="/message.png"
                            count={userData.flashcardsCompleted.length}
                            label="My Flashcards"
                        />
                        <StatCard
                            icon="/checklist.png"
                            count={userData.quizzesCompleted.length}
                            label="Quiz Completed"
                        />
                        <StatCard
                            icon="/light.png"
                            count={userData.coursesEnrolled.length}
                            label="Courses Enrolled"
                        />
                    </div>

                    {/* Charts */}
                    <PerformanceChart userData={userData} />
                    <ActivityTracker />
                </div>

                {/* Right column (sidebar) */}
                <div className="w-full lg:w-[350px] space-y-6">
                    <div className="flex flex-col lg:flex-col gap-4">
                        <ProfileCard 
                            name={userData.name} 
                            email={userData.email} 
                            rank={userData.rank} 
                            score={userData.totalScore} 
                        />
                        {/* <Leaderboard /> */}
                        <Leaderboard data={leaderboardData} currentUserId={currentUserId} />
                    </div>
                    {/* <RecentActivity /> */}
                </div>
            </div>
        </div>
    );
}