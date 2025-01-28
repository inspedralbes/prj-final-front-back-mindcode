import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import UserChat from "./components/UserChat";
import AIChat from "./components/AIChat";
import { User } from "lucide-react";

const Page = () => {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50">
      <Sidebar />
      

      <div className="flex flex-col w-full">
        <Navbar />

        <UserChat />
      </div>
      </div>
  );
};

export default Page;