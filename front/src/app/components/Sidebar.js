import React, { useState, useEffect } from "react";
import { useAuthStore } from '../../stores/authStore';

const URL = process.env.NEXT_PUBLIC_URL;
const Sidebar = () => {
  const [isLlenguatgesOpen, setIsLlenguatgesOpen] = useState(false);
  const [languages, setLanguages] = useState([]);
  const classDetails = useAuthStore((state) => state.class_details);
  const user_info = useAuthStore.getState().user_info
  
  useEffect(() => {
    if (classDetails?.language_info && JSON.stringify(classDetails.language_info) !== JSON.stringify(languages)) {
      setLanguages(classDetails.language_info); 
    }
  }, [classDetails]);

  const handleLanguageClick = async (language, index) => {
  console.log("Lenguaje seleccionado:", language);

  const langObject = typeof language === "string" ? { name: language } : language;
  
  const payload = {
    language_id: (index + 1),
    class_id: (classDetails.class_id),
    verified_user_id: user_info.userId,
    message: `${langObject.name}`
  };

  console.log("payload enviado: ", payload)

    try {
      const response = await fetch(`${URL}/message/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        const errorData = await response.json();  
        console.error("Error response:", errorData);  
        throw new Error(errorData.error || "Failed to send message");
      }
      
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  
  return (
    <div className="bg-gray-200 dark:bg-gray-800 text-black dark:text-white w-1/4 h-full p-4 border-r border-gray-300 dark:border-gray-700">
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-full bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 mx-auto mb-2"></div>
        <h2 className="text-lg font-semibold">ALUMNE</h2>
      </div>
      <nav className="space-y-4">
        <div>
          <button 
            className="w-full px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 text-left"
            onClick={() => setIsLlenguatgesOpen(!isLlenguatgesOpen)}
          >
            📄 Llenguatges
          </button>
          {isLlenguatgesOpen && (
            <div className="ml-4 mt-2 space-y-2">
              {languages.length > 0 ? (
                languages.map((lang, index) => (
                  <button key={index} onClick={() => handleLanguageClick(lang, index)} className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 text-left">
                    {lang}
                  </button>
                ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">No hi ha llenguatges</p>
              )}
            </div>
          )}
        </div>  
        <button className="w-full px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 text-left">
          🎮 Jocs
        </button>
        <button className="w-full px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 text-left">
          ⚙️ Configuració
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
