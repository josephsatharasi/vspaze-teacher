import React, { useState, useEffect } from 'react';
import { Plus, ClipboardList, Calendar, X, Edit, Trash2 } from 'lucide-react';
import api from '../../utils/api';

const Tests = () => {
  const [tests, setTests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [courses, setCourses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    course: '',
    date: '',
    duration: 60,
    totalMarks: 100,
    questions: []
  });
  const [showQuestions, setShowQuestions] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState({
    question: '',
    options: ['', ''],
    correctAnswer: [0],
    marks: 10,
    type: 'single'
  });
  const [editingQuestionIndex, setEditingQuestionIndex] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await Promise.all([fetchTests(), fetchCourses()]);
    setLoading(false);
  };

  const fetchTests = async () => {
    try {
      const response = await api.get('/faculty/tests');
      setTests(response.data.tests || []);
    } catch (error) {
      console.error('Error fetching tests:', error);
      // ============ TEMPORARY: DEMO DATA FOR CLIENT DEMO ============
      setTests([
        {
          _id: '1',
          title: 'React Fundamentals Test',
          description: 'Test on React basics and hooks',
          course: { _id: '1', name: 'Full Stack Development' },
          date: '2024-02-10T00:00:00',
          duration: 60,
          totalMarks: 100,
          questions: [
            {
              question: 'What is JSX?',
              options: ['JavaScript XML', 'Java Syntax Extension', 'JSON XML', 'JavaScript Extension'],
              correctAnswer: 0,
              marks: 10
            },
            {
              question: 'Which hook is used for side effects?',
              options: ['useState', 'useEffect', 'useContext', 'useReducer'],
              correctAnswer: 1,
              marks: 10
            },
            {
              question: 'What does useState return?',
              options: ['A value', 'An array with state and setter', 'An object', 'A function'],
              correctAnswer: 1,
              marks: 10
            }
          ]
        },
        {
          _id: '2',
          title: 'JavaScript ES6 Quiz',
          description: 'Modern JavaScript features',
          course: { _id: '2', name: 'React Advanced' },
          date: '2024-02-18T00:00:00',
          duration: 45,
          totalMarks: 50,
          questions: [
            {
              question: 'What is arrow function syntax?',
              options: ['function() {}', '() => {}', 'func => {}', 'arrow()'],
              correctAnswer: 1,
              marks: 10
            },
            {
              question: 'What does spread operator do?',
              options: ['Multiplies arrays', 'Expands iterables', 'Divides objects', 'None'],
              correctAnswer: 1,
              marks: 10
            }
          ]
        },
        {
          _id: '3',
          title: 'Node.js Basics Test',
          description: 'Backend fundamentals',
          course: { _id: '3', name: 'Node.js & Express' },
          date: '2024-02-22T00:00:00',
          duration: 90,
          totalMarks: 100,
          questions: [
            {
              question: 'What is Express.js?',
              options: ['Database', 'Web framework', 'Testing tool', 'Package manager'],
              correctAnswer: 1,
              marks: 10
            },
            {
              question: 'Which method creates a GET route?',
              options: ['app.route()', 'app.get()', 'app.create()', 'app.fetch()'],
              correctAnswer: 1,
              marks: 10
            },
            {
              question: 'What is middleware in Express?',
              options: ['Database layer', 'Function that processes requests', 'Frontend tool', 'CSS framework'],
              correctAnswer: 1,
              marks: 10
            }
          ]
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
      if (editingId) {
        await api.put(`/faculty/tests/${editingId}`, formData);
      } else {
        await api.post('/faculty/tests', formData);
      }
      await fetchTests();
      closeModal();
    } catch (error) {
      console.error('Error saving test:', error);
      // ============ TEMPORARY: DEMO MODE - Save locally for client demo ============
      const newTest = {
        ...formData,
        _id: Date.now().toString(),
        course: courses.find(c => c._id === formData.course)
      };
      setTests([...tests, newTest]);
      alert('Test created successfully (Demo Mode)');
      closeModal();
    }
  };

  const handleEdit = (test) => {
    setEditingId(test._id);
    setFormData({
      title: test.title,
      description: test.description || '',
      course: test.course._id,
      date: test.date.split('T')[0],
      duration: test.duration,
      totalMarks: test.totalMarks
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this test?')) return;
    try {
      await api.delete(`/faculty/tests/${id}`);
      await fetchTests();
    } catch (error) {
      alert('Failed to delete test');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setShowQuestions(false);
    setFormData({ title: '', description: '', course: '', date: '', duration: 60, totalMarks: 100, questions: [] });
    setCurrentQuestion({ question: '', options: ['', ''], correctAnswer: [0], marks: 10, type: 'single' });
    setEditingQuestionIndex(null);
  };

  const addQuestion = () => {
    if (!currentQuestion.question.trim()) {
      alert('Please enter a question');
      return;
    }
    const filledOptions = currentQuestion.options.filter(opt => opt.trim());
    if (filledOptions.length < 2) {
      alert('Please provide at least 2 options');
      return;
    }
    const questionToAdd = {...currentQuestion, options: filledOptions};
    if (editingQuestionIndex !== null) {
      const updated = [...formData.questions];
      updated[editingQuestionIndex] = questionToAdd;
      setFormData({...formData, questions: updated});
      setEditingQuestionIndex(null);
    } else {
      setFormData({...formData, questions: [...formData.questions, questionToAdd]});
    }
    setCurrentQuestion({ question: '', options: ['', ''], correctAnswer: [0], marks: 10, type: 'single' });
  };

  const editQuestion = (index) => {
    setCurrentQuestion(formData.questions[index]);
    setEditingQuestionIndex(index);
  };

  const removeQuestion = (index) => {
    setFormData({...formData, questions: formData.questions.filter((_, i) => i !== index)});
  };

  const addOption = () => {
    if (currentQuestion.options.length < 6) {
      setCurrentQuestion({...currentQuestion, options: [...currentQuestion.options, '']});
    }
  };

  const removeOption = (index) => {
    if (currentQuestion.options.length > 2) {
      const newOptions = currentQuestion.options.filter((_, i) => i !== index);
      setCurrentQuestion({...currentQuestion, options: newOptions});
    }
  };

  const toggleCorrectAnswer = (index) => {
    if (currentQuestion.type === 'single') {
      setCurrentQuestion({...currentQuestion, correctAnswer: [index]});
    } else {
      const isSelected = currentQuestion.correctAnswer.includes(index);
      const newCorrect = isSelected 
        ? currentQuestion.correctAnswer.filter(i => i !== index)
        : [...currentQuestion.correctAnswer, index];
      setCurrentQuestion({...currentQuestion, correctAnswer: newCorrect});
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Tests</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          <Plus className="w-5 h-5" />
          <span>Create Test</span>
        </button>
      </div>

      {tests.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <ClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">No tests yet</p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Create Your First Test
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map((test) => (
          <div key={test._id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <ClipboardList className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex space-x-2">
                <button onClick={() => handleEdit(test)} className="p-1 hover:bg-blue-50 rounded">
                  <Edit className="w-4 h-4 text-blue-600" />
                </button>
                <button onClick={() => handleDelete(test._id)} className="p-1 hover:bg-red-50 rounded">
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{test.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{test.course?.name}</p>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center justify-between">
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(test.date).toLocaleDateString()}
                </span>
                <span>{test.duration} min</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Total Marks</span>
                <span className="font-semibold">{test.totalMarks}</span>
              </div>
            </div>
          </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
              <h3 className="text-lg font-semibold">{editingId ? 'Edit' : 'Create'} Test</h3>
              <button onClick={closeModal}><X className="w-5 h-5" /></button>
            </div>
            
            {!showQuestions ? (
              <form onSubmit={(e) => { e.preventDefault(); setShowQuestions(true); }} className="p-4 space-y-4">
                <input
                  type="text"
                  placeholder="Test Title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  required
                />
                <textarea
                  placeholder="Description (optional)"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  rows="2"
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
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  required
                />
                <input
                  type="number"
                  placeholder="Duration (minutes)"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  required
                />
                <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold">
                  Next: Add Questions →
                </button>
              </form>
            ) : (
              <div className="p-4 space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Test: {formData.title}</h4>
                  <p className="text-sm text-gray-600">Questions Added: {formData.questions.length}</p>
                </div>

                {/* Added Questions List */}
                {formData.questions.length > 0 && (
                  <div className="space-y-2 mb-4">
                    <h5 className="font-semibold text-gray-900">Added Questions:</h5>
                    {formData.questions.map((q, idx) => (
                      <div key={idx} className="bg-gray-50 p-3 rounded-lg flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-sm">{idx + 1}. {q.question}</p>
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{q.type === 'single' ? 'Single' : 'Multi'}</span>
                          </div>
                          <p className="text-xs text-gray-600">Correct: {q.correctAnswer.map(i => q.options[i]).join(', ')} ({q.marks} marks)</p>
                        </div>
                        <div className="flex gap-1">
                          <button onClick={() => editQuestion(idx)} className="text-blue-600 hover:text-blue-700">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => removeQuestion(idx)} className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add New Question Form */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 space-y-3">
                  <h5 className="font-semibold text-gray-900">{editingQuestionIndex !== null ? 'Edit' : 'Add'} Question</h5>
                  
                  <select
                    value={currentQuestion.type}
                    onChange={(e) => setCurrentQuestion({...currentQuestion, type: e.target.value, correctAnswer: [0]})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  >
                    <option value="single">Single Correct Answer</option>
                    <option value="multi">Multiple Correct Answers</option>
                  </select>

                  <input
                    type="text"
                    placeholder="Enter question"
                    value={currentQuestion.question}
                    onChange={(e) => setCurrentQuestion({...currentQuestion, question: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  />
                  
                  <div className="space-y-2">
                    {currentQuestion.options.map((opt, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type={currentQuestion.type === 'single' ? 'radio' : 'checkbox'}
                          name="correctAnswer"
                          checked={currentQuestion.correctAnswer.includes(idx)}
                          onChange={() => toggleCorrectAnswer(idx)}
                          className="w-4 h-4"
                        />
                        <input
                          type="text"
                          placeholder={`Option ${idx + 1}`}
                          value={opt}
                          onChange={(e) => {
                            const newOptions = [...currentQuestion.options];
                            newOptions[idx] = e.target.value;
                            setCurrentQuestion({...currentQuestion, options: newOptions});
                          }}
                          className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                        />
                        {currentQuestion.options.length > 2 && (
                          <button onClick={() => removeOption(idx)} className="text-red-600 hover:text-red-700">
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    {currentQuestion.options.length < 6 && (
                      <button onClick={addOption} className="text-sm text-blue-600 hover:text-blue-700">
                        + Add Option
                      </button>
                    )}
                  </div>

                  <input
                    type="number"
                    placeholder="Marks"
                    value={currentQuestion.marks}
                    onChange={(e) => setCurrentQuestion({...currentQuestion, marks: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  />
                  <div className="flex gap-2">
                    {editingQuestionIndex !== null && (
                      <button onClick={() => { setCurrentQuestion({ question: '', options: ['', ''], correctAnswer: [0], marks: 10, type: 'single' }); setEditingQuestionIndex(null); }} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300">
                        Cancel
                      </button>
                    )}
                    <button onClick={addQuestion} className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                      {editingQuestionIndex !== null ? 'Update Question' : '+ Add Question'}
                    </button>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <button onClick={() => setShowQuestions(false)} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300">
                    ← Back
                  </button>
                  <button onClick={handleSubmit} className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 font-semibold">
                    Create Test ({formData.questions.length} questions)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Tests;
