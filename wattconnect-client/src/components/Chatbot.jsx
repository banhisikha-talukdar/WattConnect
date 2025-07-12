import { useState, useRef, useEffect } from "react";
import axios from "axios"; // Re-introducing axios for backend communication
import { Bot, X, Send } from "lucide-react"; // Icons for the UI

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! What's your average monthly electricity bill amount (in ₹)? I can give you tips to reduce it." },
  ]);
  const messagesEndRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const toggleChat = () => setIsOpen(!isOpen);

  // Scroll to bottom on new message or loading state change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]); // Added isLoading to dependencies for scroll on loading start/end

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]); // Add user message immediately
    setInput(""); // Clear input field
    setIsLoading(true); // Set loading true

    try {
      // Send the user's bill amount to the backend
      // The backend will handle constructing the full prompt for Gemini
      const response = await axios.post("http://localhost:5000/api/chatbot", {
        billAmount: userMessage.text, // Sending the bill amount
        // You can add more context here if your backend expects it,
        // e//g., userLocation: "Guwahati, Assam, India"
      });

      const botMessage = { sender: "bot", text: response.data.tips }; // Expecting 'tips' from backend
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chatbot Frontend Error:", error);
      let userFriendlyError = "Sorry, something went wrong while fetching tips.";
      if (error.response && error.response.data && error.response.data.error) {
        userFriendlyError = `Error: ${error.response.data.error}`;
      } else if (error.message) {
        userFriendlyError = `Network error: ${error.message}. Is the backend running?`;
      }
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: userFriendlyError },
      ]);
    } finally {
      setIsLoading(false); // Set loading false
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !isLoading) {
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-10 right-10 w-16 h-16 bg-gradient-to-r from-[#3360ab] to-[#84a4da] hover:from-[#f2950d] hover:to-[#ffd300] text-white rounded-full shadow-lg flex items-center justify-center z-50 transition"
        aria-label="Toggle Chatbot"
      >
        <Bot size={32} />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[360px] sm:w-[400px] h-[460px] bg-white border border-gray-200 rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden font-sans">
          
          {/* Header */}
          <div className="relative bg-gradient-to-r from-[#3360ab] to-[#84a4da] text-white px-4 pt-4 pb-6 rounded-t-3xl">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">You are chatting with WattBot</p>
              <button onClick={toggleChat} aria-label="Close Chat">
                <X size={20} />
              </button>
            </div>
            {/* Wavy divider for header */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none rotate-180">
              <svg viewBox="0 0 500 50" preserveAspectRatio="none" className="w-full h-[20px]">
                <path d="M0.00,0 C150.00,90 350.00,-20 500.00,20 L500.00,0 L0.00,0 Z" style={{ fill: "#f4f6f8" }}></path>
              </svg>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 bg-[#f4f6f8] text-sm text-gray-800 flex flex-col gap-3 overflow-y-auto">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl shadow-sm max-w-[80%] ${
                  msg.sender === "bot" ? "self-start bg-white" : "self-end bg-[#d9e7ff]"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {/* Loading indicator */}
            {isLoading && (
              <div className="self-start bg-white p-3 rounded-xl shadow-sm max-w-[80%]">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} /> {/* Scroll target */}
          </div>

          {/* Input Area */}
          <div className="bg-white p-3 border-t border-gray-200 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isLoading ? "Generating response..." : "Enter your bill amount..."}
              className="flex-1 px-4 py-2 text-sm rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3360ab]"
              disabled={isLoading} // Disable input while loading
              aria-label="Electricity bill input"
            />
            <button
              onClick={sendMessage}
              className="text-black hover:text-[#f2950d] p-2 rounded-full transition-colors duration-200"
              disabled={isLoading} // Disable send button while loading
              aria-label="Send message"
            >
              <Send size={23} className="rotate-45" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
