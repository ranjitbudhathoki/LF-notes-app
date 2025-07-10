import Header from "@/features/layout/Header";
import SearchAndFilter from "@/features/layout/SearchAndFilter";

export default function HomePage() {
  return (
    <main className="min-h-screen w-full bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SearchAndFilter />
      </div>
    </main>
  );
}
