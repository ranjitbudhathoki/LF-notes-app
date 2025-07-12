import { getNotesApi } from "@/api/notes";
import { useQuery } from "@tanstack/react-query";
import DOMPurify from "dompurify";
import { Link } from "react-router";
import { NoteActions } from "./NoteActions";
import SearchAndFilter from "@/components/layout/SearchAndFilter";
import Loader from "@/components/Loader";
import { formatDistanceToNow } from "date-fns";
interface Note {
  id: number;
  title: string;
  slug: string;
  content: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
  categories: Category[];
}
interface Category {
  id: number;
  name: string;
  theme: string;
}

export default function Notes() {
  const { data: notesData, isLoading } = useQuery({
    queryKey: ["notes"],
    queryFn: getNotesApi,
  });

  if (isLoading) return <Loader />;
  const notes: Note[] = notesData.result;
  return (
    <div className="space-y-6">
      <SearchAndFilter />
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">All Notes</h2>
          <p className="text-sm text-gray-500">
            {notesData.result.length}{" "}
            {notesData.result.length === 1 ? "note" : "notes"}
          </p>
        </div>
      </div>

      {notes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 ">
          {notes.map((note: Note) => (
            <div key={note.id} className="relative">
              <Link to={`/notes/${note.slug}`}>
                <div className="flex flex-col h-[12rem] bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 transition-shadow cursor-pointer hover:bg-gray-50 hover:shadow-md">
                  <h3 className="font-semibold mb-2 text-gray-900 text-sm sm:text-base flex-shrink-0 pr-8">
                    {note.title}
                  </h3>
                  <div
                    className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-4  flex-grow overflow-hidden"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(note.content),
                    }}
                  ></div>
                  <div className="flex-shrink-0">
                    <div className="flex gap-1 sm:gap-2 mb-2 sm:mb-3 flex-wrap">
                      {note.categories.map((category) => {
                        return (
                          <span
                            key={category.id}
                            style={{
                              backgroundColor: category.theme,
                              color: "#fff",
                            }}
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${category.theme}-300 `}
                          >
                            {category.name}
                          </span>
                        );
                      })}
                    </div>
                    <div className="text-xs text-gray-400">
                      {formatDistanceToNow(new Date(note.createdAt), {
                        addSuffix: true,
                      })}
                    </div>
                  </div>
                </div>
              </Link>
              <div className="absolute top-2 right-2 z-10">
                <NoteActions noteSlug={note.slug} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 sm:py-12">
          <div className="text-gray-400 mb-4">
            <svg
              className="mx-auto h-10 w-10 sm:h-12 sm:w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
            No notes found
          </h3>
          <p className="text-sm text-gray-500 mb-4 px-4">
            No notes match the selected categories. Try adjusting your filters
            or create a new note.
          </p>
          <button className="text-white px-4 py-2 rounded-lg transition-colors text-sm">
            Create New Note
          </button>
        </div>
      )}
    </div>
  );
}
