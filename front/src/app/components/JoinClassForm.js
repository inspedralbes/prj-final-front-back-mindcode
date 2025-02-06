"use client";

import React, { useState } from "react";
import StPage from "../../pages/StPage";
import { joinClass } from "../../services/communicationManager"; // Import joinClass function

const JoinClassForm = ({  }) => {
    const [classCode, setClassCode] = useState(""); // Add state for class code
    const [userId, setUserId] = useState(""); // Add state for user ID
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleJoin = async () => {
        if ( classCode && userId) {
          try {
            console.log("Attempting to join class...");
            const response = await joinClass(classCode, userId);
            console.log("Join class response:", response);
    
            if (response.class_details) {
              setIsAuthenticated(true);
            } else {
              alert("Failed to join class. Please check your details.");
            }
          } catch (error) {
            console.error("Error joining class:", error);
            alert("An error occurred while joining the class.");
          }
        } else {
          alert("Please enter all required fields.");
        }
      };
    
      if (isAuthenticated) {
        return <StPage />;
      }
    return (
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
            <div className="mt-60 flex-col items-center">

                <div className="w-full flex-1 mt-8">
                    <div className="flex flex-col items-center gap-4">
                        <input
                            type="text"
                            placeholder="Class Code"
                            value={classCode}
                            onChange={(e) => setClassCode(e.target.value)}
                            className="w-full max-w-xs p-2 border rounded-lg"
                        />
                        <input
                            type="text"
                            placeholder="User ID"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            className="w-full max-w-xs p-2 border rounded-lg"
                        />
                        <button
                            className="w-40 max-w-xs font-bold shadow-sm rounded-lg py-3 bg-blue-500 text-white flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline"
                            onClick={handleJoin}
                        >
                            Join Class
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default JoinClassForm;