"use client"

import React, { useState } from "react"
import StPage from "../pages/StPage";
import Login from "../pages/Login";
import JoinClass from "../pages/JoinClass";


const Page = () => {
  const [currentPage, setCurrentPage ] = useState('login');

  const renderPage = () => {
    switch(currentPage) {
      case 'login':
        return <Login />;
        case 'stpage':
          return <StPage />;
          case 'joinclass':
          return <JoinClass />;
          default:
            return <Login />;

    }
  }

  return(
    <div>
      {renderPage()}

      <div className="fixed bottom-4 right-4 flex gap-4">

        <button
        onClick={() => setCurrentPage('login')}
        className="px-4 py-2 bg-gray-400 text-white rounded">
          Login
        </button>

        <button
        onClick={() => setCurrentPage('joinclass')}
        className="px-4 py-2 bg-gray-500 text-white rounded">
          joinclass
        </button>

        <button
        onClick={() => setCurrentPage('stpage')}
        className="px-4 py-2 bg-gray-600 text-white rounded">
          Student Page
        </button>
      </div>

    </div>
  );
};

export default Page;