import UserProfile from "./UserProfile";
import NavLinks from "./NavLinks";
import SettingsLink from "./SettingsLink";

export default function Sidebar() {
  return (
    <div className="w-64 bg-black shadow-lg p-4 flex flex-col">
      {/* User Profile */}
      <UserProfile />

      {/* Navigation Links */}
      <nav className="flex-1">
        <NavLinks />
      </nav>

      {/* Settings */}
      <div className="mt-6">
        <SettingsLink />
      </div>
    </div>
  );
}
