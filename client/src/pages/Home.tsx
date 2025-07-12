import Header from "@/components/layout/Header";
import { Outlet } from "react-router";

export default function HomePage() {
  return (
    <main className="min-h-screen w-full bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6">
        <Outlet />
      </div>
    </main>
  );
}
