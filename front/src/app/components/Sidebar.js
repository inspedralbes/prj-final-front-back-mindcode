import React from "react";

const Sidebar = () => {
  return (
    <div className="bg-emerald-100 w-1/4 h-full p-4 border-r border-black-200">
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-full bg-gray-300 mx-auto mb-2"></div>
        <h2 className="text-lg font-semibold">USER</h2>
        <p className="text-sm text-gray-500">Admin</p>
      </div>
      <nav className="space-y-4">
        <button className="w-full px-4 py-2 bg-amber-500 rounded-md hover:bg-gray-300 text-left">
          📄 Languages
        </button>
        <button className="w-full px-4 py-2 bg-blue-200 rounded-md hover:bg-gray-300 text-left">
          🎮 Juegos
        </button>
        <button className="w-full px-4 py-2 bg-pink-200 rounded-md hover:bg-gray-300 text-left">
          ⚙️ Configuración
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
