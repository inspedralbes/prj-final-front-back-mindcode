export default function NavLinks() {
    return (
      <ul className="space-y-4">
        <li>
          <a
            href="#languages"
            className="flex items-center p-3 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            <span className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm">
              L
            </span>
            <span className="ml-4">Languages</span>
          </a>
        </li>
        <li>
          <a
            href="#games"
            className="flex items-center p-3 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            <span className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm">
              G
            </span>
            <span className="ml-4">Juegos</span>
          </a>
        </li>
      </ul>
    );
  }
  