"use client"; 

import React from "react";

import Sidebar from "../app/components/Sidebar";
import Navbar from "../app/components/Navbar";
import ContentArea from "../app/components/ContentArea";

const Page = () => {


  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50">
      <Sidebar />
      <div className="flex flex-col w-full">
        <Navbar />
        <ContentArea />
      </div>
    </div>
  );
};

export default Page;
