import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import api from '../utils/api';

const TeacherLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const teacherAuth = JSON.parse(localStorage.getItem('teacher_auth') || '{}');
    if (teacherAuth.isAuthenticated) {
      navigate('/teacher');
    }
  }, [navigate]);

  const DEMO_CREDENTIALS = {
    email: 'teacher@vspaze.com',
    password: 'teacher123'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    // Try API login first
    try {
      const response = await api.post('/auth/faculty/login', formData);
      
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('teacher_auth', JSON.stringify({
          isAuthenticated: true,
          teacher: response.data.user
        }));
        navigate('/teacher');
        return;
      }
    } catch (error) {
      if (error.response?.status === 403) {
        setError(error.response.data.message || 'Account pending approval. Contact admin.');
        return;
      }
      console.log('API login failed, checking demo credentials');
    }

    // Fallback to demo mode
    if (formData.email === DEMO_CREDENTIALS.email && formData.password === DEMO_CREDENTIALS.password) {
      const demoToken = 'demo_teacher_token_' + btoa('teacher@vspaze.com');
      localStorage.setItem('token', demoToken);
      localStorage.setItem('teacher_auth', JSON.stringify({
        isAuthenticated: true,
        teacher: {
          id: 'demo-teacher',
          name: 'Demo Teacher',
          email: 'teacher@vspaze.com',
          assignedCourses: ['Full Stack Development']
        }
      }));
      navigate('/teacher');
    } else {
      setError('Invalid credentials or account not approved.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl w-full max-w-md p-8 border border-green-100">
        <div className="flex items-center justify-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">Teacher Portal</h2>
        <p className="text-gray-600 text-center mb-8">Login to access your dashboard</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value.replace('mailto:', '')})}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                placeholder="your.email@example.com"
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold transition-colors"
          >
            Login
          </button>
        </form>



        <p className="text-center text-gray-500 text-sm mt-4">
          Don't have an account? <a href="/teacher-registration" className="text-green-600 hover:underline">Register here</a>
        </p>
      </div>
    </div>
  );
};

export default TeacherLogin;
