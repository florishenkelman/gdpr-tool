import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTheme } from '../context/ThemeContext';
import { taskService } from '../services/taskService';
import { gdprService } from '../services/gdprService';
import { authService } from '../services/authService';
import { Loading } from '../components/common/Common';
import DashboardReport from '../components/report/DashboardReport'
import { PDFDownloadLink } from '@react-pdf/renderer';
import {
  Users,
  CheckCircle,
  Clock,
  BookOpen,
  Activity
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const Dashboard = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Fetch all tasks
  const { data: tasks, isLoading: tasksLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const response = await taskService.getAllTasks();
      return response;
    }
  });

  // Fetch GDPR articles
  const { data: gdprArticles, isLoading: gdprLoading } = useQuery({
    queryKey: ['gdprArticles'],
    queryFn: async () => {
      const response = await gdprService.getAllArticles();
      return response;
    }
  });

  // Fetch users
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await authService.getAllUsers();
      return response;
    }
  });

  if (tasksLoading || gdprLoading || usersLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loading size="lg" />
      </div>
    );
  }

  // Calculate task statistics
  const taskStats = {
    total: tasks?.length || 0,
    completed: tasks?.filter(task => task.status === 'CLOSED').length || 0,
    pending: tasks?.filter(task => task.status === 'IN_PROGRESS').length || 0,
    open: tasks?.filter(task => task.status === 'OPEN').length || 0
  };

  // Prepare stats cards data
  const statsCards = [
    {
      title: 'Total Users',
      value: users?.length || 0,
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Completed Tasks',
      value: taskStats.completed,
      icon: CheckCircle,
      color: 'bg-green-500'
    },
    {
      title: 'Pending Tasks',
      value: taskStats.pending,
      icon: Clock,
      color: 'bg-yellow-500'
    },
    {
      title: 'GDPR Articles',
      value: gdprArticles?.length || 0,
      icon: BookOpen,
      color: 'bg-purple-500'
    }
  ];

  // Calculate task activity data (tasks created per day for the last 7 days)
  const taskActivityData = calculateTaskActivity(tasks || []);

  // Prepare task status distribution data
  const taskStatusData = [
    { name: 'Completed', value: taskStats.completed },
    { name: 'In Progress', value: taskStats.pending },
    { name: 'Not Started', value: taskStats.open }
  ];

  const COLORS = ['#10B981', '#3B82F6', '#EF4444'];

  return (
    <div className={`space-y-6 p-6 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="flex justify-between items-center">
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Dashboard
        </h1>
        <div className="flex space-x-2">
        <PDFDownloadLink
             document={
               <DashboardReport
                 stats={statsCards}
                 taskActivityData={taskActivityData}
                 taskStatusData={taskStatusData}
                 recentTasks={tasks.slice(0, 3)}
                />
              }
             fileName="dashboard-report.pdf"
             >
          {({ loading }) => (
          <button 
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            disabled={loading}
          >
          {loading ? 'Preparing...' : 'Export Report'}
          </button>
          )}
        </PDFDownloadLink>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat) => (
          <div
            key={stat.title}
            className={`rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-200 ${
              isDark ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {stat.title}
                </p>
                <p className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Activity Chart */}
        <div className={`rounded-lg shadow p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className={`text-lg font-medium mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Task Activity
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={taskActivityData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={isDark ? '#374151' : '#E5E7EB'}
                />
                <XAxis
                  dataKey="name"
                  stroke={isDark ? '#9CA3AF' : '#6B7280'}
                />
                <YAxis stroke={isDark ? '#9CA3AF' : '#6B7280'} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                    border: 'none',
                    borderRadius: '0.375rem',
                    color: isDark ? '#FFFFFF' : '#000000'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="tasks"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Task Status Distribution */}
        <div className={`rounded-lg shadow p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className={`text-lg font-medium mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Task Status Distribution
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={taskStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {taskStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                    border: 'none',
                    borderRadius: '0.375rem',
                    color: isDark ? '#FFFFFF' : '#000000'
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => (
                    <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className={`rounded-lg shadow p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className={`text-lg font-medium mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Recent Activity
        </h2>
        <div className="space-y-4">
          {(tasks || []).slice(0, 3).map((task) => (
            <div
              key={task.id}
              className={`flex items-center justify-between border-b pb-4 ${
                isDark ? 'border-gray-700' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center">
                <Activity className="w-5 h-5 text-blue-500 mr-3" />
                <div>
                  <p className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                    {task.title}
                  </p>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Status: {task.status}
                  </p>
                </div>
              </div>
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {new Date(task.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Helper function to calculate task activity for the last 7 days
const calculateTaskActivity = (tasks) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  const activityData = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dayName = days[date.getDay()];
    
    const tasksForDay = tasks.filter(task => {
      const taskDate = new Date(task.createdAt);
      return taskDate.toDateString() === date.toDateString();
    });

    activityData.push({
      name: dayName,
      tasks: tasksForDay.length
    });
  }

  return activityData;
};

export default Dashboard;
