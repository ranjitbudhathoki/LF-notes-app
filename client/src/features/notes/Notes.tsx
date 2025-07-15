import { useEffect, useState } from "react";
import { Pin, FileText, Tag } from "lucide-react";

import { Badge } from "@/components/ui/badge";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";

import { getNotesApi } from "@/api/notes";
import Loader from "@/components/Loader";
import NoteCard from "./NoteCard";
import type { Note } from "@/config/types";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const NOTES_PER_PAGE = 12;

const Notes = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams] = useSearchParams();

  const search = searchParams.get("search") || "";
  const categoryId = searchParams.get("category") || "all";
  const sortBy = searchParams.get("sortBy") || "updatedAt";

  useEffect(() => {
    setCurrentPage(1);
  }, [search, categoryId, sortBy]);

  const { data: notesData, isLoading } = useQuery({
    queryKey: ["notes", currentPage, categoryId, sortBy, search],
    queryFn: () =>
      getNotesApi({
        page: currentPage,
        limit: NOTES_PER_PAGE,
        category: categoryId === "all" ? undefined : categoryId,
        sortBy,
        search,
      }),
  });

  if (isLoading) {
    return <Loader />;
  }

  const notes: Note[] = notesData?.result || [];
  const meta = notesData.meta;

  const pinnedNotes = notes.filter((note) => note.isPinned);
  const regularNotes = notes.filter((note) => !note.isPinned);

  return (
    <div className="p-3 md:p-6 h-full overflow-y-auto bg-background">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Your Notes
          </h2>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-muted-foreground">
              {notes.length} {notes.length === 1 ? "note" : "notes"}
            </Badge>
            {pinnedNotes.length > 0 && (
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {pinnedNotes.length} pinned
              </Badge>
            )}
          </div>
        </div>
      </div>

      {notes.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No notes found
          </h3>
          <p className="text-muted-foreground mb-4">
            Create your first note to get started!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {pinnedNotes.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Pin className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                  Pinned Notes ({pinnedNotes.length})
                </h3>
              </div>
              <div className="grid grid-cols-1  lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {pinnedNotes.map((note) => (
                  <NoteCard key={note.id} note={note} />
                ))}
              </div>
            </div>
          )}

          {regularNotes.length > 0 && (
            <div>
              {pinnedNotes.length > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="w-4 h-4 text-muted-foreground" />
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Other Notes ({regularNotes.length})
                  </h3>
                </div>
              )}
              <div className="grid grid-cols-1  lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {regularNotes.map((note) => (
                  <NoteCard key={note.id} note={note} />
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-center mt-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    className={
                      meta.page === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>
                {[...Array(meta.totalPages)].map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      onClick={() => setCurrentPage(i + 1)}
                      isActive={meta.page === i + 1}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(prev + 1, meta.totalPages),
                      )
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
          </div>
        </div>
      )}
    </div>
  );
};

export default Notes;
