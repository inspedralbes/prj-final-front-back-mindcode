import React, { useState, useEffect } from "react";
import { getLanguage } from "services/communicationManager.js";
import { useAuthStore } from '../../stores/authStore';

const Sidebar = ({ class_id }) => {
  const [isLlenguatgesOpen, setIsLlenguatgesOpen] = useState(false);
  const [languages, setLanguages] = useState([]);
  const userInfo  = useAuthStore((state) => state.user_info);
  //const classDetails  = useAuthStore((state) => state.setClass);
 
  useEffect(() => {
    async function fetchLanguages() {
      if (!class_id || !userInfo.userId) return; 

      try {
        const data = await getLanguage(class_id);
        setLanguages(data);
      } catch (error) {
        console.error("Error fetching languages:", error);
      }
    }

    fetchLanguages();
  }, [class_id]); 

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
                  <button 
                    key={index} 
                    className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 text-left"
                  >
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
        <button className="w-full px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 text-left">
        📝  Formulario  
        </button>
      </nav>
    </div>
  );
};
/**Generate form by extracting masseges with AI */
export default Sidebar;