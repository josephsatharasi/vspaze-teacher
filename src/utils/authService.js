import api from './api';

class AuthService {
  // Check if using production or local API
  static getApiStatus() {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    const isProduction = !apiUrl.includes('localhost');
    return {
      url: apiUrl,
      environment: isProduction ? 'production' : 'local'
    };
  }

  // Student Authentication
  static async loginStudent(email, password) {
    const response = await api.post('/auth/student/login', { email, password });
    if (response.data.success) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('student_auth', JSON.stringify({
        isAuthenticated: true,
        student: response.data.user
      }));
    }
    return response.data;
  }

  // Teacher Authentication
  static async loginTeacher(email, password) {
    const response = await api.post('/auth/faculty/login', { email, password });
    if (response.data.success) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('teacher_auth', JSON.stringify({
        isAuthenticated: true,
        teacher: response.data.user
      }));
    }
    return response.data;
  }

  // Admin Authentication
  static async loginAdmin(email, password) {
    const response = await api.post('/auth/admin/login', { email, password });
    if (response.data.success) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('vspaze_auth', JSON.stringify({
        isAuthenticated: true,
        user: response.data.user
      }));
    }
    return response.data;
  }

  // Logout for all user types
  static logout(userType = 'all') {
    localStorage.removeItem('token');
    if (userType === 'all') {
      localStorage.removeItem('vspaze_auth');
      localStorage.removeItem('student_auth');
      localStorage.removeItem('teacher_auth');
    } else {
      const authKey = userType === 'admin' ? 'vspaze_auth' : `${userType}_auth`;
      localStorage.removeItem(authKey);
    }
  }

  // Check authentication status
  static isAuthenticated(userType) {
    const authKey = userType === 'admin' ? 'vspaze_auth' : `${userType}_auth`;
    const auth = JSON.parse(localStorage.getItem(authKey) || '{}');
    return auth.isAuthenticated || false;
  }

  // Get current user data
  static getCurrentUser(userType) {
    const authKey = userType === 'admin' ? 'vspaze_auth' : `${userType}_auth`;
    const auth = JSON.parse(localStorage.getItem(authKey) || '{}');
    return auth.isAuthenticated ? (auth.user || auth.student || auth.teacher) : null;
  }
}

export default AuthService;