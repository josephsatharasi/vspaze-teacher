import React, { useState, useEffect } from 'react';
import { Home, BookOpen, FileText, ClipboardList, Users, Calendar, LogOut, Menu, X, Megaphone } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import MyCourses from './pages/MyCourses';
import Assignments from './pages/Assignments';
import Tests from './pages/Tests';
import Students from './pages/Students';
import Schedule from './pages/Schedule';
import Announcements from './pages/Announcements';
import api from '../utils/api';

const TeacherApp = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [teacherData, setTeacherData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem('teacher_auth') || '{}');
    if (!auth.isAuthenticated) {
      window.location.href = '/teacher-login';
      return;
    }
    setIsAuthenticated(true);
    fetchTeacherData();
  }, []);

  const fetchTeacherData = () => {
    // Use demo data from localStorage
    const auth = JSON.parse(localStorage.getItem('teacher_auth') || '{}');
    setTeacherData(auth.teacher || { name: 'Demo Teacher', specialization: 'Full Stack Development' });
  };

  const handleLogout = () => {
    localStorage.removeItem('teacher_auth');
    window.location.href = '/';
  };

  if (!isAuthenticated) {
    return null;
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'courses', label: 'My Courses', icon: BookOpen },
    { id: 'assignments', label: 'Assignments', icon: FileText },
    { id: 'tests', label: 'Tests', icon: ClipboardList },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
    { id: 'schedule', label: 'Schedule', icon: Calendar }
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard onNavigate={setCurrentPage} />;
      case 'courses': return <MyCourses />;
      case 'assignments': return <Assignments />;
      case 'tests': return <Tests />;
      case 'students': return <Students />;
      case 'announcements': return <Announcements />;
      case 'schedule': return <Schedule />;
      default: return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">V</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Teacher Portal</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 font-bold text-lg">
                {teacherData?.name?.charAt(0) || 'T'}
              </span>
            </div>
            <div>
              <p className="font-semibold text-gray-900">{teacherData?.name || 'Teacher'}</p>
              <p className="text-sm text-gray-600">{teacherData?.specialization || 'Faculty'}</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => { setCurrentPage(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  currentPage === item.id
                    ? 'bg-green-50 text-green-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        <div className="bg-white shadow-sm border-b p-4 flex items-center justify-between lg:hidden">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-semibold">Teacher Portal</span>
          <div className="w-6"></div>
        </div>

        <div className="p-6 overflow-y-auto h-full">
          {renderPage()}
        </div>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default TeacherApp;
