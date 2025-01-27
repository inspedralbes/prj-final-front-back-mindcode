"use client"; 

import React, { useState } from 'react';
import StPage from '../pages/StPage'; 
import Login from '../pages/Login'; 

const Page = () => {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div>
      {showLogin ? <Login /> : <StPage />}

      <div className="fixed bottom-4 right-4 flex gap-4">
        <button
          onClick={() => setShowLogin(true)}
          className="px-4 py-2 bg-gray-500 text-white rounded"
        >
          Show Login
        </button>
        <button
          onClick={() => setShowLogin(false)}
          className="px-4 py-2 bg-gray-700 text-white rounded"
        >
          Show StPage
        </button>
      </div>
    </div>
  );
};

export default Page;
