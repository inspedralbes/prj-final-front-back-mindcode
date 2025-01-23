export default function SettingsLink() {
    return (
      <a
        href="#settings"
        className="flex items-center p-3 bg-gray-200 rounded-md hover:bg-gray-300"
      >
        <span className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm">
          ⚙️
        </span>
        <span className="ml-4">Configuración</span>
      </a>
    );
  }
  