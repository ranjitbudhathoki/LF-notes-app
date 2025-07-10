import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="flex items-center max-w-7xl mx-auto mt-6 px-4">
      <input
        type="text"
        placeholder="Search notes, content, cateogories...."
        className="border border-gray-300 rounded-md px-4 py-2 mr-2 w-full"
      />
      <Button>
        <Search className="h-5 w-5 text-white" />
      </Button>
    </div>
  );
}
