import React, { useState, useEffect } from 'react';
import { BookOpen, Users, Calendar, Plus, X, Video, Trash2 } from 'lucide-react';
import api from '../../utils/api';

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoForm, setVideoForm] = useState({ title: '', url: '', module: '' });
  const [courseVideos, setCourseVideos] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await api.get('/faculty/courses');
      setCourses(response.data.courses || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchCourseVideos = async (courseId) => {
    try {
      const response = await api.get(`/faculty/courses/${courseId}/videos`);
      setCourseVideos(response.data.videos || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
      setCourseVideos([]);
    }
  };

  const handleCourseClick = async (course) => {
    setSelectedCourse(course);
    await fetchCourseVideos(course._id);
  };

  const handleAddVideo = async () => {
    if (!videoForm.title || !videoForm.url || !videoForm.module) {
      alert('Please fill all fields');
      return;
    }
    try {
      await api.post(`/faculty/courses/${selectedCourse._id}/videos`, videoForm);
      await fetchCourseVideos(selectedCourse._id);
      setShowVideoModal(false);
      setVideoForm({ title: '', url: '', module: '' });
      alert('Video added successfully!');
    } catch (error) {
      alert('Failed to add video');
    }
  };

  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm('Delete this video?')) return;
    try {
      await api.delete(`/faculty/courses/${selectedCourse._id}/videos/${videoId}`);
      await fetchCourseVideos(selectedCourse._id);
    } catch (error) {
      alert('Failed to delete video');
    }
  };

  if (selectedCourse) {
    return (
      <div>
        <button onClick={() => setSelectedCourse(null)} className="mb-4 text-blue-600 hover:text-blue-700 font-semibold">
          ← Back to Courses
        </button>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{selectedCourse.name}</h2>
            <p className="text-gray-600 mt-1">Manage course videos</p>
          </div>
          <button
            onClick={() => setShowVideoModal(true)}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            <Plus className="w-5 h-5" />
            <span>Add Video</span>
          </button>
        </div>

        {courseVideos.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No videos added yet</p>
            <button
              onClick={() => setShowVideoModal(true)}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              Add First Video
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {courseVideos.map((video) => (
              <div key={video._id} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Video className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{video.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">Module: {video.module}</p>
                      <a href={video.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline mt-1 inline-block">
                        {video.url}
                      </a>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteVideo(video._id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showVideoModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-md">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold">Add Video Lesson</h3>
                <button onClick={() => setShowVideoModal(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Video Title</label>
                  <input
                    type="text"
                    value={videoForm.title}
                    onChange={(e) => setVideoForm({...videoForm, title: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    placeholder="e.g., Introduction to React Hooks"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Video URL</label>
                  <input
                    type="url"
                    value={videoForm.url}
                    onChange={(e) => setVideoForm({...videoForm, url: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Module Name</label>
                  <input
                    type="text"
                    value={videoForm.module}
                    onChange={(e) => setVideoForm({...videoForm, module: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    placeholder="e.g., Module 1: Basics"
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleAddVideo}
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 font-semibold"
                  >
                    Add Video
                  </button>
                  <button
                    onClick={() => setShowVideoModal(false)}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">My Courses</h2>

      {courses.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">No courses assigned yet</p>
          <p className="text-sm text-gray-500 mt-2">Contact admin to get courses assigned</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
          <div
            key={course._id}
            onClick={() => handleCourseClick(course)}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-lg transition cursor-pointer"
          >
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{course.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{course.description?.substring(0, 100)}...</p>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                {course.enrolledStudents || 0} students
              </span>
              <span className="flex items-center">
                <Video className="w-4 h-4 mr-1" />
                Click to manage
              </span>
            </div>
          </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCourses;
