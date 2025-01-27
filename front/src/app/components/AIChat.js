'use client';

import React, { useState } from "react";
import { FaPaperPlane, FaRobot, FaUserCircle } from "react-icons/fa";
import { RiRobot3Line } from "react-icons/ri";

const AIChat = () => {
  const [message, setMessage] = useState("");  
  const [messages, setMessages] = useState([   
    { sender: 'bot', text: 'Hola canelon' },
    { sender: 'user', text: 'Hola perrito' },
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
  
    setMessages(prevMessages => prevMessages.concat({ sender: 'bot', text: message }));
    setMessage(""); 
  };
  
  return (
    <div className="max-w-6xl w-full h-full flex flex-col p-6 bg-gray-100 dark:bg-gray-800 rounded-md border border-gray-300 dark:border-gray-700 mx-auto">
      <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-white dark:bg-gray-900 rounded-md shadow-inner">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.sender === 'bot' && (
              <RiRobot3Line className="w-10 h-10 mr-2" />
            )}
            <div
              className={`px-4 py-2 rounded-lg max-w-xs ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-400 text-white'}`}
              style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
              {msg.text}
            </div>
            {msg.sender === 'user' && (
              <FaUserCircle className="w-10 h-10 ml-2" />
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center space-x-4">
        <textarea
          placeholder="Escriu un missatge..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-grow px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-hidden"/>
        <button
          onClick={handleSendMessage}  
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400">
          <FaPaperPlane className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default AIChat;


