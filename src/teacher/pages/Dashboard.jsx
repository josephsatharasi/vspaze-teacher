import React, { useState, useEffect } from 'react';
import { Users, BookOpen, FileText, ClipboardList, TrendingUp } from 'lucide-react';
import api from '../../utils/api';

const Dashboard = ({ onNavigate }) => {
  const [stats, setStats] = useState({ courses: 0, students: 0, assignments: 0, tests: 0 });
  const [assignedCourses, setAssignedCourses] = useState([]);
  const [recentAssignments, setRecentAssignments] = useState([]);
  const [recentTests, setRecentTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [coursesRes, assignmentsRes, testsRes, studentsRes] = await Promise.all([
        api.get('/faculty/courses'),
        api.get('/faculty/assignments'),
        api.get('/faculty/tests'),
        api.get('/faculty/students')
      ]);

      const courses = coursesRes.data.courses || [];
      const assignments = assignmentsRes.data.assignments || [];
      const tests = testsRes.data.tests || [];
      const students = studentsRes.data.students || [];

      setAssignedCourses(courses);
      setRecentAssignments(assignments.slice(0, 3));
      setRecentTests(tests.slice(0, 3));
      setStats({
        courses: courses.length,
        students: students.length,
        assignments: assignments.length,
        tests: tests.length
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  const statsCards = [
    { title: 'My Courses', value: stats?.courses || 0, icon: BookOpen, color: 'bg-blue-500' },
    { title: 'Total Students', value: stats?.students || 0, icon: Users, color: 'bg-green-500' },
    { title: 'Assignments', value: stats?.assignments || 0, icon: FileText, color: 'bg-purple-500' },
    { title: 'Tests', value: stats?.tests || 0, icon: ClipboardList, color: 'bg-orange-500' }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Dashboard</h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-4 sm:p-6 border border-gray-100">
              <div className="flex flex-col items-center text-center">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 ${stat.color} rounded-xl flex items-center justify-center mb-3 shadow-lg`}>
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <p className="text-gray-600 text-xs sm:text-sm mb-2 font-medium">{stat.title}</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-gray-100">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-green-600" />
            My Courses
          </h3>
          <div className="space-y-2">
            {assignedCourses.length > 0 ? (
              assignedCourses.map((course, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                  <BookOpen className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{course.name}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4 text-sm">No courses assigned</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-gray-100">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Recent Assignments
          </h3>
          <div className="space-y-2">
            {recentAssignments.length > 0 ? (
              recentAssignments.map((assignment, index) => (
                <div key={index} className="p-2 bg-blue-50 rounded-lg">
                  <p className="text-sm font-semibold text-gray-900 truncate">{assignment.title}</p>
                  <p className="text-xs text-gray-600 mt-1">{assignment.course?.name}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4 text-sm">No assignments yet</p>
            )}
          </div>
          {recentAssignments.length > 0 && (
            <button onClick={() => onNavigate?.('assignments')} className="w-full mt-3 text-sm text-blue-600 hover:text-blue-700 font-semibold">
              View All →
            </button>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-gray-100">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-purple-600" />
            Recent Tests
          </h3>
          <div className="space-y-2">
            {recentTests.length > 0 ? (
              recentTests.map((test, index) => (
                <div key={index} className="p-2 bg-purple-50 rounded-lg">
                  <p className="text-sm font-semibold text-gray-900 truncate">{test.title}</p>
                  <p className="text-xs text-gray-600 mt-1">{test.course?.name}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4 text-sm">No tests yet</p>
            )}
          </div>
          {recentTests.length > 0 && (
            <button onClick={() => onNavigate?.('tests')} className="w-full mt-3 text-sm text-purple-600 hover:text-purple-700 font-semibold">
              View All →
            </button>
          )}
        </div>
      </div>

      <div className="mt-6 bg-white rounded-xl shadow-md p-4 sm:p-6 border border-gray-100">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button onClick={() => onNavigate?.('courses')} className="p-4 bg-gradient-to-r from-green-50 to-green-100 text-green-700 rounded-xl hover:from-green-100 hover:to-green-200 transition-all font-semibold text-left flex items-center gap-3 shadow-sm hover:shadow-md">
            <BookOpen className="w-5 h-5" />
            <span>View Courses</span>
          </button>
          <button onClick={() => onNavigate?.('assignments')} className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all font-semibold text-left flex items-center gap-3 shadow-sm hover:shadow-md">
            <FileText className="w-5 h-5" />
            <span>Create Assignment</span>
          </button>
          <button onClick={() => onNavigate?.('tests')} className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 rounded-xl hover:from-purple-100 hover:to-purple-200 transition-all font-semibold text-left flex items-center gap-3 shadow-sm hover:shadow-md">
            <ClipboardList className="w-5 h-5" />
            <span>Create Test</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
