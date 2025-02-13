import React, { useState, useEffect } from "react";
import { getClass, createLanguage, deleteLanguage } from "services/communicationManager.js";

const SidebarProf = () => {
  const [classList, setClassList] = useState([]);
  const [openClassId, setOpenClassId] = useState(null);
  const [languagesByClass, setLanguagesByClass] = useState({});
  const [newLanguage, setNewLanguage] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [isLlenguatgesOpen, setIsLlenguatgesOpen] = useState(false);
  const [editingLanguage, setEditingLanguage] = useState(null);
  const [editedLanguageName, setEditedLanguageName] = useState("");

  useEffect(() => {
    async function fetchClasses() {
      try {
        const data = await getClass();
        setClassList(data);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    }
    fetchClasses();
  }, []);

  const handleClassClick = (class_id) => {
    setOpenClassId(openClassId === class_id ? null : class_id);
    setIsLlenguatgesOpen(false);
  };

  const handleAddLanguage = async () => {
    if (!newLanguage) return;
    try {
      const response = await createLanguage(newLanguage);
      setLanguagesByClass((prev) => ({
        ...prev,
        [openClassId]: [...(prev[openClassId] || []), response.name],
      }));
      setNewLanguage("");
      setShowInput(false);
    } catch (error) {
      console.error("Error adding new languages:", error);
    }
  };

  const handleDeleteLanguage = (classId, langIndex) => {
    setLanguagesByClass((prev) => ({
      ...prev,
      [classId]: prev[classId].filter((_, index) => index !== langIndex),
    }));
  };

  const handleEditLanguage = (classId, langIndex) => {
    setEditingLanguage({ classId, langIndex });
    setEditedLanguageName(languagesByClass[classId][langIndex]);
  };

  const handleSaveEdit = () => {
    const { classId, langIndex } = editingLanguage;
    setLanguagesByClass((prev) => {
      const updatedLanguages = [...prev[classId]];
      updatedLanguages[langIndex] = editedLanguageName;
      return { ...prev, [classId]: updatedLanguages };
    });
    setEditingLanguage(null);
    setEditedLanguageName("");
  };

  return (
    <div className="bg-gray-200 dark:bg-gray-800 text-black dark:text-white w-1/4 h-full p-4 border-r border-gray-300 dark:border-gray-700">
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-full bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 mx-auto mb-2"></div>
        <h2 className="text-lg font-semibold">PROFESSOR</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">Admin</p>
      </div>

      <nav className="space-y-2">
        {classList.map(({ class_id, class_code }) => (
          <div key={class_id}>
            <button
              className="w-full px-4 py-2 bg-gray-700 hover:bg-blue-500 text-white rounded-md flex justify-between items-center"
              onClick={() => handleClassClick(class_id)}
            >
              {class_code} <span>▼</span>
            </button>

            {openClassId === class_id && (
              <div className="mt-1 space-y-1 pl-2">
                <button
                  className="w-full px-4 py-2 bg-gray-500 hover:bg-gray-600 rounded-md text-white"
                  onClick={() => setIsLlenguatgesOpen(!isLlenguatgesOpen)}
                >
                  📄 Llenguatges
                </button>
                {isLlenguatgesOpen && (
                  <div className="ml-4 mt-2 space-y-2">
                    {languagesByClass[class_id] && languagesByClass[class_id].length > 0 ? (
                      languagesByClass[class_id].map((lang, index) => (
                        <div key={index} className="flex items-center gap-2">
                          {editingLanguage && editingLanguage.classId === class_id && editingLanguage.langIndex === index ? (
                            <input
                              type="text"
                              value={editedLanguageName}
                              onChange={(e) => setEditedLanguageName(e.target.value)}
                              className="w-32 px-2 py-1 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white text-sm"
                            />
                          ) : (
                            <button className="w-3/4 px-3 py-2 bg-green-500 hover:bg-green-700 rounded-md text-white">
                              {lang}
                            </button>
                          )}

                          {editingLanguage && editingLanguage.classId === class_id && editingLanguage.langIndex === index ? (
                            <button onClick={handleSaveEdit} className="px-1 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm">
                              ✅
                            </button>
                          ) : (
                            <button onClick={() => handleEditLanguage(class_id, index)} className="px-1 py-1  size-7 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 text-sm">
                              ✏️
                            </button>
                          )}

                          <button onClick={() => handleDeleteLanguage(class_id, index)} className="px-1 py-1 size-7  bg-red-500 text-white rounded-md hover:bg-red-600 text-sm">
                          <span className="text-white">✖</span>
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400">No hi ha llenguatges</p>
                    )}
                    {!showInput ? (
                      <button
                        className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mt-2"
                        onClick={() => setShowInput(true)}
                      >
                        ➕ Nou llenguatge
                      </button>
                    ) : (
                      <div className="flex gap-2 mt-2">
                        <input
                          type="text"
                          value={newLanguage}
                          onChange={(e) => setNewLanguage(e.target.value)}
                          className="w-32 px-2 py-1 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white text-sm"
                          placeholder="Llenguatge"
                        />
                        <button onClick={handleAddLanguage} className="px-1 py-1 bg-green-500 size-8 text-white rounded-md hover:bg-green-600 text-sm">
                          ✅
                        </button>
                        <button onClick={() => { setShowInput(false); setNewLanguage(""); }} className="px-1 py-1 size-8 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm">
                        <span className="text-white">✖</span>

                        </button>
                      </div>
                    )}
                  </div>
                )}
                <button className="w-full px-4 py-2 bg-gray-500 hover:bg-gray-600 rounded-md text-white">🎓​ Alumnes</button>
                <button className="w-full px-4 py-2 bg-gray-500 hover:bg-gray-600 rounded-md text-white">📊​ Estadístiques</button>
              </div>
            )}
          </div>
        ))}

        {classList.length === 0 && <p className="text-sm text-gray-500 dark:text-gray-400">No hay clases disponibles</p>}
      </nav>
    </div>
  );
};

export default SidebarProf;