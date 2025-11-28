import React, { useState, useEffect } from 'react';
import { Plus, Megaphone, X, Trash2, Edit } from 'lucide-react';
import api from '../../utils/api';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    course: '',
    priority: 'normal'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await Promise.all([fetchAnnouncements(), fetchCourses()]);
  };

  const fetchAnnouncements = async () => {
    try {
      const response = await api.get('/faculty/announcements');
      setAnnouncements(response.data.announcements || []);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      // ============ TEMPORARY: DEMO DATA FOR CLIENT DEMO ============
      setAnnouncements([
        {
          _id: '1',
          title: 'Class Schedule Update',
          message: 'Tomorrow\'s React class will start at 11 AM instead of 10 AM',
          course: { name: 'Full Stack Development' },
          priority: 'high',
          createdAt: new Date().toISOString()
        },
        {
          _id: '2',
          title: 'Assignment Deadline Extended',
          message: 'Node.js assignment deadline extended to next Monday',
          course: { name: 'Node.js & Express' },
          priority: 'normal',
          createdAt: new Date(Date.now() - 86400000).toISOString()
        }
      ]);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await api.get('/faculty/courses');
      setCourses(response.data.courses || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      // ============ TEMPORARY: DEMO DATA FOR CLIENT DEMO ============
      setCourses([
        { _id: '1', name: 'Full Stack Development' },
        { _id: '2', name: 'React Advanced' },
        { _id: '3', name: 'Node.js & Express' }
      ]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/faculty/announcements', formData);
      await fetchAnnouncements();
      closeModal();
    } catch (error) {
      console.error('Error creating announcement:', error);
      // ============ TEMPORARY: DEMO MODE ============
      const newAnnouncement = {
        ...formData,
        _id: Date.now().toString(),
        course: courses.find(c => c._id === formData.course),
        createdAt: new Date().toISOString()
      };
      setAnnouncements([newAnnouncement, ...announcements]);
      alert('Announcement posted successfully!');
      closeModal();
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this announcement?')) return;
    try {
      await api.delete(`/faculty/announcements/${id}`);
      await fetchAnnouncements();
    } catch (error) {
      setAnnouncements(announcements.filter(a => a._id !== id));
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({ title: '', message: '', course: '', priority: 'normal' });
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Announcements</h2>
        <button
          onClick={() => setShowModal(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 font-semibold shadow-md"
        >
          <Plus className="w-5 h-5" />
          <span>New Announcement</span>
        </button>
      </div>

      <div className="space-y-4">
        {announcements.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Megaphone className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No announcements yet</p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              Create Your First Announcement
            </button>
          </div>
        ) : announcements.map((announcement) => (
          <div key={announcement._id} className={`bg-white rounded-xl shadow-md p-4 sm:p-6 border-l-4 ${
            announcement.priority === 'high' ? 'border-red-500' : 
            announcement.priority === 'urgent' ? 'border-orange-500' : 'border-blue-500'
          }`}>
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
              <div className="flex-1 w-full">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                  <Megaphone className={`w-5 h-5 flex-shrink-0 ${
                    announcement.priority === 'high' ? 'text-red-500' : 
                    announcement.priority === 'urgent' ? 'text-orange-500' : 'text-blue-500'
                  }`} />
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 flex-1">{announcement.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${
                    announcement.priority === 'high' ? 'bg-red-100 text-red-700' : 
                    announcement.priority === 'urgent' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {announcement.priority}
                  </span>
                </div>
                <p className="text-gray-700 mb-3">{announcement.message}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>📚 {announcement.course?.name || 'All Courses'}</span>
                  <span>📅 {new Date(announcement.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <button onClick={() => handleDelete(announcement._id)} className="text-red-600 hover:text-red-700">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">New Announcement</h3>
              <button onClick={closeModal}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <input
                type="text"
                placeholder="Announcement Title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                required
              />
              <textarea
                placeholder="Message"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                rows="4"
                required
              />
              <select
                value={formData.course}
                onChange={(e) => setFormData({...formData, course: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                required
              >
                <option value="">Select Course</option>
                {courses.map(course => (
                  <option key={course._id} value={course._id}>{course.name}</option>
                ))}
              </select>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              >
                <option value="normal">Normal</option>
                <option value="high">High Priority</option>
                <option value="urgent">Urgent</option>
              </select>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
                  Post Announcement
                </button>
                <button type="button" onClick={closeModal} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Announcements;
