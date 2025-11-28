import React, { useState, useEffect } from 'react';
import { Users, Search } from 'lucide-react';
import api from '../../utils/api';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await api.get('/faculty/students');
      setStudents(response.data.students || []);
    } catch (error) {
      console.error('Error fetching students:', error);
      // ============ TEMPORARY: DEMO DATA FOR CLIENT DEMO ============
      setStudents([
        { _id: '1', name: 'Rahul Sharma', email: 'rahul@example.com', enrolledCourses: [{ name: 'Full Stack Development' }], status: 'active' },
        { _id: '2', name: 'Priya Patel', email: 'priya@example.com', enrolledCourses: [{ name: 'React Advanced' }], status: 'active' },
        { _id: '3', name: 'Amit Kumar', email: 'amit@example.com', enrolledCourses: [{ name: 'Node.js & Express' }], status: 'active' },
        { _id: '4', name: 'Sneha Reddy', email: 'sneha@example.com', enrolledCourses: [{ name: 'Full Stack Development' }], status: 'active' },
        { _id: '5', name: 'Vikram Singh', email: 'vikram@example.com', enrolledCourses: [{ name: 'React Advanced' }], status: 'active' }
      ]);
    }
  };

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">My Students</h2>

      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Course</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student._id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4">{student.name}</td>
                <td className="py-3 px-4">{student.email}</td>
                <td className="py-3 px-4">{student.enrolledCourses?.[0]?.name || 'N/A'}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    student.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {student.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Students;
