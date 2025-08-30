"use client"
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { RiCalendarLine } from 'react-icons/ri';
import { ChevronDown } from 'lucide-react';
import { format, subDays, subWeeks, subMonths, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, isWithinInterval } from 'date-fns';

const PerformanceChart = ({ userData }) => {
  const [timeRange, setTimeRange] = useState('week');
  const [dateRange, setDateRange] = useState('Daily');
  const [selectedDateRange, setSelectedDateRange] = useState({
    start: subDays(new Date(), 7),
    end: new Date()
  });
  const [dateLabels, setDateLabels] = useState([]);

  // Generate date labels based on selected range
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

  // Process quiz and flashcard data for the chart
  const processActivityData = () => {
    if (!userData) return { quizzes: [], flashcards: [] };

    const quizzes = userData.joinedQuizzes || [];
    const flashcards = userData.flashcardsCompleted || [];

    return {
      quizzes: quizzes.map(quiz => ({
        date: new Date(quiz.updatedAt || quiz.createdAt)
      })),
      flashcards: flashcards.map(flashcard => ({
        date: new Date(flashcard.updatedAt || flashcard.createdAt)
      }))
    };
  };

  // Prepare chart data
  const prepareChartData = () => {
    const activityData = processActivityData();
    
    const countActivities = (activities, label, timeRange) => {
      return dateLabels.map(label => {
        let count = 0;
        
        activities.forEach(activity => {
          const activityDate = activity.date;
          
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
        });
        
        return count;
      });
    };

    return {
      labels: dateLabels,
      datasets: [
        {
          label: 'Flashcards',
          data: countActivities(activityData.flashcards, dateLabels, timeRange),
          borderColor: 'rgba(75, 0, 130, 1)',
          backgroundColor: 'rgba(75, 0, 130, 0.1)',
          fill: true,
          tension: 0.4,
        },
        {
          label: 'Quizzes',
          data: countActivities(activityData.quizzes, dateLabels, timeRange),
          borderColor: 'rgba(0, 255, 255, 1)',
          backgroundColor: 'rgba(0, 255, 255, 0.1)',
          fill: true,
          tension: 0.4,
        }
      ]
    };
  };

  const chartData = prepareChartData();

  // Handle time range change
  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    let startDate;
    
    switch (range) {
      case 'day':
        startDate = subDays(new Date(), 1);
        setDateRange('Hourly');
        break;
      case 'week':
        startDate = subWeeks(new Date(), 1);
        setDateRange('Daily');
        break;
      case 'month':
        startDate = subMonths(new Date(), 1);
        setDateRange('Weekly');
        break;
      case 'year':
        startDate = subMonths(new Date(), 12);
        setDateRange('Monthly');
        break;
      default:
        startDate = subDays(new Date(), 7);
    }
    
    setSelectedDateRange({
      start: startDate,
      end: new Date()
    });
  };

  // Format date range display
  const formatDateRangeDisplay = () => {
    if (timeRange === 'day') {
      return format(selectedDateRange.start, 'dd MMM yyyy');
    }
    return `${format(selectedDateRange.start, 'dd MMM yyyy')} - ${format(selectedDateRange.end, 'dd MMM yyyy')}`;
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: false,
      },
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          title: (tooltipItem) => {
            return tooltipItem[0].label;
          },
          label: (context) => {
            return `${context.dataset.label}: ${context.raw} activities`;
          }
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
      <div className="flex flex-col bg-white p-6 rounded-lg border mt-4 w-[70%] h-80 justify-center items-center">
        <div className="text-gray-500">Loading user data...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white p-6 rounded-lg border mt-4 w-[70%]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Learning Activity</h3>
        <div className="flex items-center">
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <span className="w-4 h-4 rounded-sm bg-purple-500 mr-2"></span>
              <p className="text-xs text-gray-600">Flashcards</p>
            </div>
            <div className="flex items-center">
              <span className="w-4 h-4 rounded-sm bg-teal-400 mr-2"></span>
              <p className="text-xs text-gray-600">Quizzes</p>
            </div>
          </div>
          
          <div className="flex items-center ml-4">
            <button 
              onClick={() => handleTimeRangeChange('day')} 
              className={`text-xs px-3 py-1 rounded-l-md ${timeRange === 'day' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'}`}
            >
              Day
            </button>
            <button 
              onClick={() => handleTimeRangeChange('week')} 
              className={`text-xs px-3 py-1 ${timeRange === 'week' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'}`}
            >
              Week
            </button>
            <button 
              onClick={() => handleTimeRangeChange('month')} 
              className={`text-xs px-3 py-1 ${timeRange === 'month' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'}`}
            >
              Month
            </button>
            <button 
              onClick={() => handleTimeRangeChange('year')} 
              className={`text-xs px-3 py-1 rounded-r-md ${timeRange === 'year' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'}`}
            >
              Year
            </button>
          </div>

          <div className="flex items-center border border-gray-300 rounded-sm p-1 ml-4">
            <RiCalendarLine className="w-4 h-4 text-gray-600 mr-2" />
            <span className="text-xs text-gray-600">{formatDateRangeDisplay()}</span>
          </div>
          
          <div className="flex items-center border border-gray-300 rounded-sm py-1 px-2 ml-2">
            <p className="text-xs text-gray-600 mr-2">{dateRange}</p>
            <ChevronDown size={16} className='text-gray-400' />
          </div>
        </div>
      </div>
      
      <div className="h-64">
        {dateLabels.length > 0 ? (
          <Line data={chartData} options={options} />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-500">
            No activity data available for the selected period
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceChart;