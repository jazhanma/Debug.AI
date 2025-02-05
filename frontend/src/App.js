import { useState } from 'react';
import axios from 'axios';

function App() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDebug = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Sending request to:', process.env.REACT_APP_API_URL);
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/debug/`, {
        code,
        language,
      });
      console.log('Response:', response.data);
      setResult(response.data);
    } catch (error) {
      console.error('Error:', error);
      setError(error.response?.data?.detail || 'An error occurred while debugging the code');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">DebugAI</h1>
          
          <div className="mb-4">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="java">Java</option>
            </select>
          </div>

          <div className="mb-4">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code here..."
              className="w-full h-64 p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <button
            onClick={handleDebug}
            disabled={loading}
            className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Debugging...' : 'Fix Code'}
          </button>

          {result && (
            <div className="mt-8 bg-white shadow rounded-lg p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Fixed Code:</h2>
                <pre className="bg-gray-50 p-4 rounded-md overflow-x-auto">
                  <code>{result.fixed_code}</code>
                </pre>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Explanation:</h2>
                <p className="text-gray-700">{result.explanation}</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">Error Type:</h2>
                <p className="text-gray-700">{result.error_type}</p>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-8 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Error:</strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
