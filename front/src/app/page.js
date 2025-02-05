"use client"

import React, { useState } from "react"
import StPage from "../pages/StPage";
import Login from "../pages/Login";
import JoinClass from "../pages/JoinClass";
import CreateClass from "../pages/CreateClass";
import FormClass from "../pages/form";

const Page = () => {
  const [currentPage, setCurrentPage] = useState('login');

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <Login />;
      case 'stpage':
        return <StPage />;
      case 'joinclass':
        return <JoinClass />;
        case 'formclass':
          return <FormClass />;
      case 'createclass':
        return <CreateClass />;
      default:
        return <Login />;

    }
  }

  return (
    <div>
      {renderPage()}

      <div className="fixed bottom-4 right-4 flex gap-4 mb-10">

        <button
          onClick={() => setCurrentPage('login')}
          className="px-4 py-2 bg-gray-400 text-white rounded">
          Login
        </button>

        <button
          onClick={() => setCurrentPage('createclass')}
          className="px-4 py-2 bg-gray-600 text-white rounded">
          Create Class
        </button>

        <button
          onClick={() => setCurrentPage('joinclass')}
          className="px-4 py-2 bg-gray-500 text-white rounded">
          Join Class
        </button>

        <button
          onClick={() => setCurrentPage('formclass')}
          className="px-4 py-2 bg-gray-500 text-white rounded">
          Form Class
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