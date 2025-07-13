import { getNotesApi } from "@/api/notes";
import { useQuery } from "@tanstack/react-query";
import DOMPurify from "dompurify";
import { Link, useSearchParams } from "react-router";
import { NoteActions } from "./NoteActions";
import SearchAndFilter from "@/components/layout/SearchAndFilter";
import Loader from "@/components/Loader";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { getCategoriesApi } from "@/api/categories";

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
  createdAt: string;
  updatedAt: string;
}

export default function Notes() {
  const [page, setPage] = useState(1);
  const limit = 10;
  const [searchParams] = useSearchParams();
  const categoryName = searchParams.get("category") || "all";
  const sortBy = searchParams.get("sortBy") || "updatedAt";
  const { data: categoriesData, isLoading: isCategoryLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategoriesApi,
  });

  const categories: Category[] = categoriesData?.result || [];
  const categoryId =
    categoryName === "all"
      ? "all"
      : categories.find((cat) => cat.name === categoryName)?.id?.toString() ||
        "all";

  const { data: notesData, isLoading } = useQuery({
    queryKey: ["notes", page, limit, categoryId, sortBy],
    queryFn: () => getNotesApi({ page, limit, category: categoryId, sortBy }),
    enabled: !isCategoryLoading,
  });

  if (isLoading || isCategoryLoading) {
    return <Loader />;
  }

  const notes: Note[] = notesData?.result || [];
  const meta = notesData?.meta ?? { total: 0, page: 1, limit, totalPages: 1 };

  return (
    <div className="space-y-6">
      <SearchAndFilter categories={categories} />
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">All Notes</h2>
          <p className="text-sm text-gray-500">
            {meta.total}
            {meta.total === 1 ? "note" : "notes"}
          </p>
        </div>
      </div>
      {notes.length > 0 ? (
        <>
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
                              className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium"
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
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  className={
                    meta.page === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
              {[...Array(meta.totalPages)].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    onClick={() => setPage(i + 1)}
                    isActive={meta.page === i + 1}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setPage((prev) => Math.min(prev + 1, meta.totalPages))
                  }
                  className={
                    meta.page === meta.totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </>
      ) : (
        <div className="text-center py-8 sm:py-12">
          <div className="text-gray-400 mb-4">
            <FileText className="mx-auto h-10 w-10 sm:h-12 sm:w-12" />{" "}
          </div>
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
            No notes found
          </h3>
          <p className="text-sm text-gray-500 mb-4 px-4">
            No notes match the selected categories. Try adjusting your filters
            or create a new note.
          </p>
          <Button> Create New Note</Button>
        </div>
      )}
    </div>
  );
}
