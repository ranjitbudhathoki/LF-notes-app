import Header from "@/features/layout/Header";
import SearchBar from "@/features/layout/Search";

export default function HomePage() {
  return (
    <main className="min-h-screen w-full bg-white ">
      <Header />
      <SearchBar />
    </main>
  );
}
