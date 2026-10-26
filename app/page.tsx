import Image from "next/image";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import TesstCSS from "@/components/tesstCSS";

export default function Home() {
  return (
    <div>
      <Header title="Dashboard" adminName="Admin" />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-4">
          <h1 className="text-2xl font-bold mb-4">Welcome to the Dashboard</h1>
          <p>This is the main content area.</p>
        </div>
      </div>
      <div>
        <TesstCSS />
      </div>
    </div>
  );
}
