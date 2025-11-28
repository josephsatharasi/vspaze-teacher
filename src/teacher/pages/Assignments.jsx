import React, { useState, useEffect } from 'react';
import { Plus, FileText, Calendar, X, Edit, Trash2, Users } from 'lucide-react';
import api from '../../utils/api';

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [courses, setCourses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    course: '',
    dueDate: '',
    totalMarks: 100,
    questions: []
  });
  const [showQuestions, setShowQuestions] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState({ question: '', marks: 10 });
  const [viewSubmissions, setViewSubmissions] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [viewAnswers, setViewAnswers] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await Promise.all([fetchAssignments(), fetchCourses()]);
    setLoading(false);
  };

  const fetchAssignments = async () => {
    try {
      const response = await api.get('/faculty/assignments');
      setAssignments(response.data.assignments || []);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      // ============ TEMPORARY: DEMO DATA FOR CLIENT DEMO ============
      setAssignments([
        {
          _id: '1',
          title: 'React Hooks Assignment',
          description: 'Create a todo app using useState and useEffect hooks',
          course: { _id: '1', name: 'Full Stack Development' },
          dueDate: '2024-02-15T00:00:00',
          totalMarks: 100,
          questions: [
            { q: 'Implement useState for managing todo list', marks: 30 },
            { q: 'Use useEffect for localStorage persistence', marks: 30 },
            { q: 'Add delete and edit functionality', marks: 40 }
          ]
        },
        {
          _id: '2',
          title: 'Node.js REST API',
          description: 'Build a RESTful API with Express and MongoDB',
          course: { _id: '3', name: 'Node.js & Express' },
          dueDate: '2024-02-20T00:00:00',
          totalMarks: 100,
          questions: [
            { q: 'Create CRUD endpoints for users', marks: 40 },
            { q: 'Implement authentication middleware', marks: 30 },
            { q: 'Add input validation', marks: 30 }
          ]
        },
        {
          _id: '3',
          title: 'Component Design',
          description: 'Design reusable React components',
          course: { _id: '2', name: 'React Advanced' },
          dueDate: '2024-02-25T00:00:00',
          totalMarks: 50,
          questions: [
            { q: 'Create a reusable Button component', marks: 20 },
            { q: 'Build a Modal component with props', marks: 30 }
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
        await api.put(`/faculty/assignments/${editingId}`, formData);
      } else {
        await api.post('/faculty/assignments', formData);
      }
      await fetchAssignments();
      closeModal();
    } catch (error) {
      alert('Failed to save assignment');
    }
  };

  const handleEdit = (assignment) => {
    setEditingId(assignment._id);
    setFormData({
      title: assignment.title,
      description: assignment.description,
      course: assignment.course._id,
      dueDate: assignment.dueDate.split('T')[0],
      totalMarks: assignment.totalMarks
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this assignment?')) return;
    try {
      await api.delete(`/faculty/assignments/${id}`);
      await fetchAssignments();
    } catch (error) {
      alert('Failed to delete assignment');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setShowQuestions(false);
    setFormData({ title: '', description: '', course: '', dueDate: '', totalMarks: 100, questions: [] });
    setCurrentQuestion({ question: '', marks: 10 });
  };

  const addQuestion = () => {
    if (!currentQuestion.question.trim()) {
      alert('Please enter a question');
      return;
    }
    setFormData({...formData, questions: [...formData.questions, currentQuestion]});
    setCurrentQuestion({ question: '', marks: 10 });
  };

  const removeQuestion = (index) => {
    setFormData({...formData, questions: formData.questions.filter((_, i) => i !== index)});
  };

  const viewAssignmentSubmissions = (assignment) => {
    setViewSubmissions(assignment);
    // Demo submissions with answers and files
    setSubmissions([
      { 
        _id: '1', 
        studentName: 'Rahul Sharma', 
        submittedAt: new Date().toISOString(), 
        status: 'submitted', 
        grade: null,
        answers: assignment.questions?.map((q, i) => ({
          question: q.question || q.q,
          answer: `This is the answer for question ${i + 1}. The student has provided a detailed explanation covering all key points mentioned in the question.`
        })),
        files: [
          { name: 'index.html', type: 'file', code: '<!DOCTYPE html>\n<html>\n<head>\n  <title>My Project</title>\n</head>\n<body>\n  <h1>Hello World</h1>\n  <script src="app.js"></script>\n</body>\n</html>' },
          { name: 'app.js', type: 'file', code: 'console.log("Hello World");\n\nfunction greet(name) {\n  return `Hello ${name}!`;\n}\n\ngreet("Student");' },
          { name: 'styles.css', type: 'file', code: 'body {\n  font-family: Arial, sans-serif;\n  margin: 0;\n  padding: 20px;\n}\n\nh1 {\n  color: #333;\n}' }
        ]
      },
      { 
        _id: '2', 
        studentName: 'Priya Patel', 
        submittedAt: new Date(Date.now() - 86400000).toISOString(), 
        status: 'submitted', 
        grade: 85,
        answers: assignment.questions?.map((q, i) => ({
          question: q.question || q.q,
          answer: `Answer ${i + 1}: Comprehensive response with examples and proper formatting. Student demonstrated good understanding of the concept.`
        })),
        files: [
          { name: 'main.py', type: 'file', code: 'def calculate_sum(a, b):\n    return a + b\n\ndef main():\n    result = calculate_sum(5, 10)\n    print(f"Sum: {result}")\n\nif __name__ == "__main__":\n    main()' },
          { name: 'utils.py', type: 'file', code: 'def validate_input(value):\n    if not isinstance(value, int):\n        raise ValueError("Input must be integer")\n    return True' }
        ]
      },
      { 
        _id: '3', 
        studentName: 'Amit Kumar', 
        submittedAt: new Date(Date.now() - 172800000).toISOString(), 
        status: 'submitted', 
        grade: 92,
        answers: assignment.questions?.map((q, i) => ({
          question: q.question || q.q,
          answer: `Excellent answer for question ${i + 1}. Clear explanation with relevant examples and proper structure.`
        })),
        files: [
          { name: 'App.jsx', type: 'file', code: 'import React, { useState } from "react";\n\nfunction App() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <div>\n      <h1>Counter: {count}</h1>\n      <button onClick={() => setCount(count + 1)}>\n        Increment\n      </button>\n    </div>\n  );\n}\n\nexport default App;' },
          { name: 'index.js', type: 'file', code: 'import React from "react";\nimport ReactDOM from "react-dom";\nimport App from "./App";\n\nReactDOM.render(<App />, document.getElementById("root"));' }
        ]
      }
    ]);
  };

  const gradeSubmission = (submissionId, grade) => {
    setSubmissions(submissions.map(s => s._id === submissionId ? {...s, grade: parseInt(grade)} : s));
    alert('Grade saved successfully!');
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
        <h2 className="text-2xl font-bold text-gray-900">Assignments</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          <Plus className="w-5 h-5" />
          <span>Create Assignment</span>
        </button>
      </div>

      {viewSubmissions ? (
        <div>
          <button onClick={() => setViewSubmissions(null)} className="mb-4 text-blue-600 hover:text-blue-700 font-semibold">
            ← Back to Assignments
          </button>
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{viewSubmissions.title}</h3>
            <p className="text-gray-600 mb-4">{viewSubmissions.description}</p>
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900">Questions:</h4>
              {viewSubmissions.questions?.map((q, idx) => (
                <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-medium">{idx + 1}. {q.question || q.q}</p>
                  <p className="text-sm text-gray-600">Marks: {q.marks}</p>
                </div>
              ))}
            </div>
          </div>
          {viewAnswers ? (
            <div>
              <button onClick={() => setViewAnswers(null)} className="mb-4 text-blue-600 hover:text-blue-700 font-semibold">
                ← Back to Submissions
              </button>
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-4 pb-4 border-b">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{viewAnswers.studentName}</h3>
                    <p className="text-sm text-gray-600">Submitted: {new Date(viewAnswers.submittedAt).toLocaleString()}</p>
                  </div>
                  {viewAnswers.grade && (
                    <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-semibold">
                      Grade: {viewAnswers.grade}/{viewSubmissions.totalMarks}
                    </span>
                  )}
                </div>

                {/* Submitted Files/Code Section */}
                {viewAnswers.files && viewAnswers.files.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      Submitted Files ({viewAnswers.files.length})
                    </h4>
                    <div className="space-y-4">
                      {viewAnswers.files.map((file, idx) => (
                        <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
                          <div className="bg-gray-800 text-white px-4 py-2 flex items-center justify-between">
                            <span className="font-mono text-sm">{file.name}</span>
                            <span className="text-xs bg-gray-700 px-2 py-1 rounded">{file.type}</span>
                          </div>
                          <pre className="bg-gray-50 p-4 overflow-x-auto text-sm">
                            <code className="font-mono text-gray-800">{file.code}</code>
                          </pre>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-6">
                  {viewAnswers.answers?.map((ans, idx) => (
                    <div key={idx} className="border-l-4 border-blue-500 pl-4">
                      <p className="font-semibold text-gray-900 mb-2">Q{idx + 1}. {ans.question}</p>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-700 whitespace-pre-wrap">{ans.answer}</p>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <input
                          type="number"
                          placeholder="Marks"
                          className="px-3 py-1 border rounded-lg w-20 text-sm"
                          max={viewSubmissions.questions[idx]?.marks}
                        />
                        <span className="text-sm text-gray-600">/ {viewSubmissions.questions[idx]?.marks} marks</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Total Grade"
                      defaultValue={viewAnswers.grade || ''}
                      max={viewSubmissions.totalMarks}
                      className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none w-32"
                      onBlur={(e) => e.target.value && gradeSubmission(viewAnswers._id, e.target.value)}
                    />
                    <span className="text-sm text-gray-600">/ {viewSubmissions.totalMarks}</span>
                    <button onClick={() => setViewAnswers(null)} className="ml-auto px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold">
                      Save & Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-semibold mb-4">Student Submissions ({submissions.length})</h3>
              <div className="space-y-4">
                {submissions.map((sub) => (
                  <div key={sub._id} className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-semibold text-gray-900">{sub.studentName}</p>
                        <p className="text-sm text-gray-600">Submitted: {new Date(sub.submittedAt).toLocaleString()}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        sub.grade ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {sub.grade ? `Graded: ${sub.grade}/${viewSubmissions.totalMarks}` : 'Pending'}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                      <input
                        type="number"
                        placeholder="Enter grade"
                        defaultValue={sub.grade || ''}
                        max={viewSubmissions.totalMarks}
                        className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none w-32"
                        onBlur={(e) => e.target.value && gradeSubmission(sub._id, e.target.value)}
                      />
                      <span className="text-sm text-gray-600">/ {viewSubmissions.totalMarks}</span>
                      <button onClick={() => setViewAnswers(sub)} className="sm:ml-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-semibold">
                        View Answers
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : assignments.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">No assignments yet</p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Create Your First Assignment
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignments.map((assignment) => (
          <div key={assignment._id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex space-x-2">
                <button onClick={() => handleEdit(assignment)} className="p-1 hover:bg-blue-50 rounded">
                  <Edit className="w-4 h-4 text-blue-600" />
                </button>
                <button onClick={() => handleDelete(assignment._id)} className="p-1 hover:bg-red-50 rounded">
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{assignment.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{assignment.course?.name}</p>
            <p className="text-sm text-gray-600 mb-4">{assignment.description}</p>
            <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date(assignment.dueDate).toLocaleDateString()}
              </span>
              <span>{assignment.totalMarks} marks</span>
            </div>
            <button onClick={() => viewAssignmentSubmissions(assignment)} className="w-full bg-green-50 text-green-700 py-2 rounded-lg hover:bg-green-100 font-semibold text-sm">
              View Submissions (3)
            </button>
          </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
              <h3 className="text-lg font-semibold">{editingId ? 'Edit' : 'Create'} Assignment</h3>
              <button onClick={closeModal}><X className="w-5 h-5" /></button>
            </div>
            
            {!showQuestions ? (
            <form onSubmit={(e) => { e.preventDefault(); setShowQuestions(true); }} className="p-4 space-y-4">
              <input
                type="text"
                placeholder="Assignment Title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                required
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                rows="3"
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
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
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
                  <h4 className="font-semibold text-gray-900 mb-2">Assignment: {formData.title}</h4>
                  <p className="text-sm text-gray-600">Questions Added: {formData.questions.length}</p>
                </div>

                {formData.questions.length > 0 && (
                  <div className="space-y-2 mb-4">
                    <h5 className="font-semibold text-gray-900">Added Questions:</h5>
                    {formData.questions.map((q, idx) => (
                      <div key={idx} className="bg-gray-50 p-3 rounded-lg flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{idx + 1}. {q.question}</p>
                          <p className="text-xs text-gray-600 mt-1">{q.marks} marks</p>
                        </div>
                        <button onClick={() => removeQuestion(idx)} className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 space-y-3">
                  <h5 className="font-semibold text-gray-900">Add Question</h5>
                  <textarea
                    placeholder="Enter question (descriptive)"
                    value={currentQuestion.question}
                    onChange={(e) => setCurrentQuestion({...currentQuestion, question: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    rows="3"
                  />
                  <input
                    type="number"
                    placeholder="Marks"
                    value={currentQuestion.marks}
                    onChange={(e) => setCurrentQuestion({...currentQuestion, marks: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  />
                  <button onClick={addQuestion} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                    + Add Question
                  </button>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <button onClick={() => setShowQuestions(false)} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300">
                    ← Back
                  </button>
                  <button onClick={handleSubmit} className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 font-semibold">
                    Create Assignment ({formData.questions.length} questions)
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

export default Assignments;
