export default function UserProfile() {
    return (
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
          <span className="text-lg font-bold">USER</span>
        </div>
        <div>
          <h2 className="text-lg font-semibold">User</h2>
          <p className="text-sm text-gray-500">Alumno</p>
        </div>
      </div>
    );
  }
  