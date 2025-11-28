import React, { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';
import api from '../../utils/api';

const Schedule = () => {
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      const response = await api.get('/faculty/schedule');
      setSchedule(response.data.schedule || []);
    } catch (error) {
      console.error('Error fetching schedule:', error);
      // ============ TEMPORARY: DEMO DATA FOR CLIENT DEMO ============
      setSchedule([
        { day: 'Monday', course: 'Full Stack Development', time: '10:00 AM - 12:00 PM' },
        { day: 'Monday', course: 'React Advanced', time: '2:00 PM - 4:00 PM' },
        { day: 'Wednesday', course: 'Node.js & Express', time: '10:00 AM - 12:00 PM' },
        { day: 'Wednesday', course: 'Full Stack Development', time: '3:00 PM - 5:00 PM' },
        { day: 'Friday', course: 'React Advanced', time: '11:00 AM - 1:00 PM' },
        { day: 'Friday', course: 'Node.js & Express', time: '2:00 PM - 4:00 PM' }
      ]);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">My Schedule</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {schedule.length > 0 ? (
          schedule.map((item, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded-full">
                  {item.day}
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{item.course}</h3>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-1" />
                {item.time}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 bg-white rounded-xl shadow-sm p-8 text-center text-gray-500">
            No schedule available
          </div>
        )}
      </div>
    </div>
  );
};

export default Schedule;
