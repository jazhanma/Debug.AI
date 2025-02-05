import React, { useState, useEffect, useRef } from "react";

function App() {
  // Initialize dark mode from localStorage or default to true
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Update dark mode class and localStorage when isDark changes
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(isDark));
  }, [isDark]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDark(!isDark);
  };

  // Theme state and current mode ("chat" or "code")
  const [mode, setMode] = useState("chat");
  // Chat messages (each message { role, text })
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hello! How can I help you today?" },
  ]);
  // Input state for chat messages
  const [inputMessage, setInputMessage] = useState("");
  // Code analysis state
  const [codeInput, setCodeInput] = useState("");
  const [codeResult, setCodeResult] = useState("");
  // Saved solutions and collapse state
  const [savedSolutions, setSavedSolutions] = useState([
    "Solution 1",
    "Solution 2",
  ]);
  const [isSavedCollapsed, setIsSavedCollapsed] = useState(false);

  // Ref for auto-scrolling chat container to the bottom
  const chatEndRef = useRef(null);

  // Auto-scroll chat to the bottom whenever messages update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Start a new chat (clear current messages)
  const newChat = () => {
    setMessages([]);
  };

  // Clear Chat: remove all current messages
  const clearChat = () => {
    setMessages([]);
  };

  // Clear History: remove saved solutions from sidebar
  const clearHistory = () => {
    setSavedSolutions([]);
  };

  // Send a chat message (triggered via button click or Enter key)
  const sendChatMessage = () => {
    const trimmedMessage = inputMessage.trim();
    if (trimmedMessage === "") return;

    // Append user message
    setMessages((prev) => [
      ...prev,
      { role: "user", text: trimmedMessage },
    ]);
    setInputMessage("");

    // Simulate an AI response (replace with real API call as needed)
    setTimeout(() => {
      const aiReply = { role: "assistant", text: `Echo: ${trimmedMessage}` };
      setMessages((prev) => [...prev, aiReply]);
    }, 1000);
  };

  // Send message using Enter key (without Shift)
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendChatMessage();
    }
  };

  // Simulate code analysis (replace with actual API call if needed)
  const analyzeCode = () => {
    if (codeInput.trim() === "") {
      setCodeResult("Please enter some code.");
      return;
    }
    setCodeResult("Analyzing...");
    setTimeout(() => {
      setCodeResult("Simulated analysis: No issues found.");
    }, 1500);
  };

  return (
    <div className={`min-h-screen ${isDark ? 'dark' : ''}`}>
      <div className="min-h-screen bg-white dark:bg-gray-800 transition-colors duration-200">
        {/* Header */}
        <header className="p-4 bg-gray-100 dark:bg-gray-900 shadow">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Debug Code Assistant
            </h1>
            <button
              onClick={toggleDarkMode}
              className={`px-4 py-2 rounded-lg font-medium ${
                isDark 
                  ? 'bg-gray-700 text-white hover:bg-gray-600' 
                  : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
              } transition-colors duration-200`}
            >
              {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>
          </div>
        </header>

        {/* Main content */}
        <main className="max-w-7xl mx-auto p-4">
          <div className="text-gray-900 dark:text-white">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-gray-900 text-white p-4 flex flex-col">
              <button
                onClick={newChat}
                className="mb-4 bg-green-500 hover:bg-green-400 transition-colors duration-200 py-2 px-4 rounded flex items-center"
              >
                <svg
                  className="w-6 h-6 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                New Chat
              </button>
              <div className="mb-4">
                <label className="block text-sm mb-1">Language Selection</label>
                <select className="w-full p-2 bg-gray-700 rounded">
                  <option>Python</option>
                  <option>JavaScript</option>
                  <option>Java</option>
                  <option>C++</option>
                  <option>Ruby</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm mb-1">File Upload</label>
                <input type="file" className="w-full p-2 bg-gray-700 rounded" />
              </div>
              {/* Collapsible Saved Solutions */}
              <div className="mb-4">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setIsSavedCollapsed(!isSavedCollapsed)}
                >
                  <h3 className="text-xs uppercase text-gray-400">Saved Solutions</h3>
                  <span>{isSavedCollapsed ? "+" : "-"}</span>
                </div>
                {!isSavedCollapsed && (
                  <ul className="list-disc pl-5 text-sm mt-2">
                    {savedSolutions.map((solution, index) => (
                      <li key={index}>{solution}</li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="mt-auto">
                <h3 className="text-xs uppercase text-gray-400 mb-2">Utilities</h3>
                <button
                  onClick={clearHistory}
                  className="w-full bg-gray-700 hover:bg-gray-600 transition-colors duration-200 py-2 px-4 rounded text-sm mb-2"
                >
                  Clear History
                </button>
                <button
                  onClick={clearChat}
                  className="w-full bg-gray-700 hover:bg-gray-600 transition-colors duration-200 py-2 px-4 rounded text-sm"
                >
                  Clear Chat
                </button>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
              {/* Header: Tab Navigation & Theme Toggle */}
              <header className="p-4 bg-white dark:bg-gray-800 shadow flex justify-between items-center">
                <h1 className="text-2xl font-semibold">Debug Code Assistant</h1>
                <div className="flex space-x-2 items-center">
                  <button
                    onClick={() => setMode("chat")}
                    className={`px-4 py-2 rounded ${
                      mode === "chat" ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-900"
                    }`}
                  >
                    Chat
                  </button>
                  <button
                    onClick={() => setMode("code")}
                    className={`px-4 py-2 rounded ${
                      mode === "code" ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-900"
                    }`}
                  >
                    Analyze Code
                  </button>
                </div>
              </header>

              {/* Content Area */}
              <div className="flex-1 overflow-y-auto p-4">
                {mode === "chat" ? (
                  <div id="chatSection" className="flex flex-col h-full">
                    <div id="chat-container" className="flex-1 space-y-4 overflow-y-auto pr-2">
                      {messages.map((msg, index) => (
                        <div
                          key={index}
                          className={`flex ${
                            msg.role === "assistant" ? "justify-start" : "justify-end"
                          }`}
                        >
                          <div
                            className={`max-w-md p-3 rounded-lg shadow-lg ${
                              msg.role === "assistant"
                                ? "bg-gray-700 rounded-bl-none"
                                : "bg-blue-600 rounded-br-none"
                            }`}
                          >
                            {msg.text}
                          </div>
                        </div>
                      ))}
                      <div ref={chatEndRef} />
                    </div>
                    {/* Chat Input */}
                    <footer className="pt-4 border-t border-gray-300">
                      <div className="flex">
                        <textarea
                          value={inputMessage}
                          onChange={(e) => setInputMessage(e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder="Type your message..."
                          className="flex-1 p-3 rounded-l-lg focus:outline-none text-gray-900 resize-none"
                          rows="1"
                        />
                        <button
                          onClick={sendChatMessage}
                          className="bg-blue-600 hover:bg-blue-500 transition-colors duration-200 rounded-r-lg p-3 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                        >
                          Send
                        </button>
                      </div>
                    </footer>
                  </div>
                ) : (
                  <div id="codeSection" className="flex flex-col h-full">
                    <textarea
                      placeholder="Write your code here..."
                      value={codeInput}
                      onChange={(e) => setCodeInput(e.target.value)}
                      className="flex-1 p-4 rounded border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-none"
                    />
                    <div className="mt-4 flex items-center">
                      <button
                        onClick={analyzeCode}
                        className="bg-blue-500 hover:bg-blue-400 transition-colors duration-200 py-2 px-4 rounded"
                      >
                        Analyze Code
                      </button>
                      <select id="codeLanguage" className="ml-4 p-2 bg-gray-100 dark:bg-gray-700 rounded">
                        <option value="python">Python</option>
                        <option value="javascript">JavaScript</option>
                      </select>
                    </div>
                    <div
                      id="codeResult"
                      className="mt-4 p-4 bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded"
                    >
                      {codeResult}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App; 