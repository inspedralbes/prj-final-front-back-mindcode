import Sidebar from "./components/Sidebar";
import Card from "./components/Card";
import ContentArea from "./components/ContentArea";



const Page = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col w-full">
        <Card />
        <ContentArea />
      </div>
    </div>
  );
};

export default Page;