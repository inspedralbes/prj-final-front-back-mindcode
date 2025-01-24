import React from "react";

const UserCard = () => {
  return (
    <div className=" bg-green-500 w-full flex items-center p-4 border-b border-teal-200">
      <button className="mr-4">
        <span className="text-2xl">&larr;</span>
      </button>
      <h1 className="text-xl font-semibold">User Dashboard</h1>
    </div>
  );  
};

export default UserCard;
