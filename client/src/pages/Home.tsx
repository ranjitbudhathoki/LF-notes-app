import Header from "@/components/layout/Header";
import SearchAndFilter from "@/components/layout/SearchAndFilter";
import Notes from "@/features/notes/Notes";

export default function HomePage() {
  return (
    <main className="min-h-screen w-full bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SearchAndFilter />
        <Notes selectedCategories={new Set()} />
      </div>
    </main>
  );
}
