import { getNotesApi } from "@/api/notes";
import { useQuery } from "@tanstack/react-query";
import DOMPurify from "dompurify";
import { Link, useSearchParams } from "react-router";
import { NoteActions } from "./NoteActions";
import SearchAndFilter from "@/components/layout/SearchAndFilter";
import Loader from "@/components/Loader";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from "@/components/ui/pagination";
import { FileText } from "lucide-react";
import { getCategoriesApi } from "@/api/categories";
import type { Category, Note } from "@/config/types";

export default function Notes() {
  console.log("notes rendered");
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
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
    queryKey: ["notes", page, limit, categoryId, sortBy, searchTerm],
    queryFn: () =>
      getNotesApi({
        page,
        limit,
        category: categoryId,
        sortBy,
        search: searchTerm,
      }),
    enabled: !isCategoryLoading,
  });

  useEffect(() => {
    setPage(1);
  }, [categoryId, searchTerm]);

  if (isLoading || isCategoryLoading) {
    return <Loader />;
  }

  const notes: Note[] = notesData?.result || [];
  const meta = notesData?.meta ?? { total: 0, page: 1, limit, totalPages: 1 };

  return (
    <div className="p-4 mx-auto">
      {/* <SearchAndFilter categories={categories} onSearchChange={setSearchTerm} /> */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">All Notes</h2>
          <p className="text-sm text-gray-500">
            {meta.total}
            {meta.total === 1 ? "note" : "notes"}
            {searchTerm && ` matching "${searchTerm}"`}
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
                        {sortBy === "createdAt"
                          ? formatDistanceToNow(new Date(note.createdAt), {
                              addSuffix: true,
                            })
                          : formatDistanceToNow(new Date(note.updatedAt), {
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
            {categories.length === 0
              ? "Categories are empty. Please create a category first before creating notes."
              : "No notes match the selected categories. Try adjusting your filters or create a new note."}
          </p>
        </div>
      )}
    </div>
  );
}
// import { useState } from "react";
// import { formatDistanceToNow } from "date-fns";
// import {
//   Pin,
//   Edit,
//   Trash2,
//   MoreVertical,
//   Copy,
//   FileText,
//   Clock,
//   Tag,
//   Hash,
//   Star,
//   Archive,
//   ArchiveRestore,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
//   DropdownMenuSeparator,
// } from "@/components/ui/dropdown-menu";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import {
//   Pagination,
//   PaginationContent,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "@/components/ui/pagination";
// import { useQuery } from "@tanstack/react-query";
// import { useSearchParams } from "react-router";

// export interface Note {
//   id: string;
//   title: string;
//   content: string;
//   categoryIds: string[];
//   createdAt: string;
//   updatedAt: string;
//   isPinned: boolean;
//   isArchived: boolean;
//   tags: string[];
//   color?: string;
// }

// export interface Category {
//   id: string;
//   name: string;
//   color: string;
//   createdAt: string;
//   description?: string;
// }
// interface NotesGridProps {
//   notes: Note[];
//   selectedNote: Note | null;
//   onSelectNote: (note: Note) => void;
//   onEditNote: () => void;
//   onDeleteNote: (noteId: string) => void;
//   onPinNote: (noteId: string) => void;
//   onDuplicateNote: (noteId: string) => void;
//   onArchiveNote: (noteId: string) => void;
//   categories: Category[];
//   showArchived?: boolean;
// }

// const NOTES_PER_PAGE = 12;

// const Notes = ({
//   notes,
//   onSelectNote,
//   onDeleteNote,
//   onPinNote,
//   onDuplicateNote,
//   onArchiveNote,
//   categories,
//   showArchived = false,
// }: NotesGridProps) => {
//   const [currentPage, setCurrentPage] = useState(1);

//   const getCategoryById = (id: string) =>
//     categories.find((cat) => cat.id === id);

//   const filteredNotes = notes.filter((note) =>
//     showArchived ? note.isArchived : !note.isArchived,
//   );
//   const pinnedNotes = filteredNotes.filter((note) => note.isPinned);
//   const regularNotes = filteredNotes.filter((note) => !note.isPinned);

//   const totalPages = Math.ceil(regularNotes.length / NOTES_PER_PAGE);
//   const startIndex = (currentPage - 1) * NOTES_PER_PAGE;
//   const paginatedNotes = regularNotes.slice(
//     startIndex,
//     startIndex + NOTES_PER_PAGE,
//   );

//   const formatSafeDate = (dateString: string) => {
//     if (!dateString) return "Unknown";

//     const date = new Date(dateString);
//     if (isNaN(date.getTime())) return "Unknown";

//     return formatDistanceToNow(date, { addSuffix: true });
//   };

//   const getWordCount = (text: string) => {
//     return text
//       .trim()
//       .split(/\s+/)
//       .filter((word) => word.length > 0).length;
//   };

//   const NoteCard = ({ note }: { note: Note }) => (
//     <Card
//       onClick={() => onSelectNote(note)}
//       className="cursor-pointer transition-all hover:shadow-lg border-2 border-border hover:border-primary/50 group"
//     >
//       <CardHeader className="pb-2">
//         <div className="flex items-start justify-between">
//           <div className="flex-1 min-w-0">
//             <h3 className="font-semibold text-foreground truncate leading-tight mb-1">
//               {note.title || "Untitled"}
//             </h3>
//             <div className="flex items-center gap-2 text-xs text-muted-foreground">
//               <span className="flex items-center gap-1">
//                 <Hash className="w-3 h-3" />
//                 {getWordCount(note.content)} words
//               </span>
//               <span className="flex items-center gap-1">
//                 <Clock className="w-3 h-3" />
//                 {formatSafeDate(note.updatedAt)}
//               </span>
//             </div>
//           </div>
//           <div className="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
//             {note.isPinned && (
//               <Pin className="w-4 h-4 text-primary fill-current" />
//             )}
//             {note.isArchived && (
//               <Archive className="w-4 h-4 text-muted-foreground" />
//             )}
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   className="h-6 w-6 p-0 hover:bg-muted"
//                 >
//                   <MoreVertical className="w-3 h-3" />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end" className="w-48">
//                 <DropdownMenuItem
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     onSelectNote(note);
//                   }}
//                 >
//                   <Edit className="w-4 h-4 mr-2" />
//                   Edit
//                 </DropdownMenuItem>
//                 <DropdownMenuItem
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     onDuplicateNote(note.id);
//                   }}
//                 >
//                   <Copy className="w-4 h-4 mr-2" />
//                   Duplicate
//                 </DropdownMenuItem>
//                 <DropdownMenuItem
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     onPinNote(note.id);
//                   }}
//                 >
//                   {note.isPinned ? (
//                     <>
//                       <Pin className="w-4 h-4 mr-2" />
//                       Unpin
//                     </>
//                   ) : (
//                     <>
//                       <Star className="w-4 h-4 mr-2" />
//                       Pin
//                     </>
//                   )}
//                 </DropdownMenuItem>
//                 <DropdownMenuItem
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     onArchiveNote(note.id);
//                   }}
//                 >
//                   {note.isArchived ? (
//                     <>
//                       <ArchiveRestore className="w-4 h-4 mr-2" />
//                       Unarchive
//                     </>
//                   ) : (
//                     <>
//                       <Archive className="w-4 h-4 mr-2" />
//                       Archive
//                     </>
//                   )}
//                 </DropdownMenuItem>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     onDeleteNote(note.id);
//                   }}
//                   className="text-destructive focus:text-destructive"
//                 >
//                   <Trash2 className="w-4 h-4 mr-2" />
//                   Delete
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>
//         </div>
//       </CardHeader>

//       <CardContent className="pt-0">
//         <p className="text-sm text-muted-foreground mb-3 line-clamp-3 leading-relaxed">
//           {note.content
//             ? note.content.replace(/[#*`>/\-\d\.]/g, "").slice(0, 120) +
//               (note.content.length > 120 ? "..." : "")
//             : "No content"}
//         </p>

//         <div className="flex items-center justify-between">
//           <div className="flex gap-1 flex-wrap">
//             {note.categoryIds.slice(0, 2).map((categoryId) => {
//               const category = getCategoryById(categoryId);
//               if (!category) return null;
//               return (
//                 <Badge
//                   key={categoryId}
//                   variant="secondary"
//                   className="text-xs px-2 py-0.5"
//                   style={{
//                     backgroundColor: `${category.color}20`,
//                     color: category.color,
//                     borderColor: `${category.color}40`,
//                   }}
//                 >
//                   {category.name}
//                 </Badge>
//               );
//             })}
//             {note.categoryIds.length > 2 && (
//               <Badge variant="outline" className="text-xs px-2 py-0.5">
//                 +{note.categoryIds.length - 2}
//               </Badge>
//             )}
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );

//   return (
//     <div className="p-3 md:p-6 h-full overflow-y-auto bg-background">
//       <div className="mb-6">
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
//           <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
//             {showArchived ? (
//               <Archive className="w-5 h-5" />
//             ) : (
//               <FileText className="w-5 h-5" />
//             )}
//             {showArchived ? "Archived Notes" : "Your Notes"}
//           </h2>
//           <div className="flex items-center gap-2">
//             <Badge variant="outline" className="text-muted-foreground">
//               {filteredNotes.length}{" "}
//               {filteredNotes.length === 1 ? "note" : "notes"}
//             </Badge>
//             {pinnedNotes.length > 0 && !showArchived && (
//               <Badge variant="secondary" className="bg-primary/10 text-primary">
//                 {pinnedNotes.length} pinned
//               </Badge>
//             )}
//           </div>
//         </div>
//       </div>

//       {filteredNotes.length === 0 ? (
//         <div className="text-center py-16">
//           <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
//             {showArchived ? (
//               <Archive className="w-8 h-8 text-muted-foreground" />
//             ) : (
//               <FileText className="w-8 h-8 text-muted-foreground" />
//             )}
//           </div>
//           <h3 className="text-lg font-semibold text-foreground mb-2">
//             {showArchived ? "No archived notes" : "No notes found"}
//           </h3>
//           <p className="text-muted-foreground mb-4">
//             {showArchived
//               ? "Archive some notes to see them here."
//               : "Create your first note to get started!"}
//           </p>
//         </div>
//       ) : (
//         <div className="space-y-6">
//           {pinnedNotes.length > 0 && !showArchived && (
//             <div>
//               <div className="flex items-center gap-2 mb-4">
//                 <Pin className="w-4 h-4 text-primary" />
//                 <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
//                   Pinned Notes ({pinnedNotes.length})
//                 </h3>
//               </div>
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//                 {pinnedNotes.map((note) => (
//                   <NoteCard key={note.id} note={note} />
//                 ))}
//               </div>
//             </div>
//           )}

//           {paginatedNotes.length > 0 && (
//             <div>
//               {pinnedNotes.length > 0 && !showArchived && (
//                 <div className="flex items-center gap-2 mb-4">
//                   <Tag className="w-4 h-4 text-muted-foreground" />
//                   <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
//                     Other Notes ({regularNotes.length})
//                   </h3>
//                 </div>
//               )}
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//                 {paginatedNotes.map((note) => (
//                   <NoteCard key={note.id} note={note} />
//                 ))}
//               </div>
//             </div>
//           )}

//           {totalPages > 1 && (
//             <div className="flex justify-center mt-8">
//               <Pagination>
//                 <PaginationContent>
//                   <PaginationItem>
//                     <PaginationPrevious
//                       onClick={() =>
//                         setCurrentPage(Math.max(1, currentPage - 1))
//                       }
//                       className={
//                         currentPage === 1
//                           ? "pointer-events-none opacity-50"
//                           : "cursor-pointer"
//                       }
//                     />
//                   </PaginationItem>
//                   {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                     const page = i + 1;
//                     if (totalPages <= 5) {
//                       return (
//                         <PaginationItem key={page}>
//                           <PaginationLink
//                             onClick={() => setCurrentPage(page)}
//                             isActive={currentPage === page}
//                             className="cursor-pointer"
//                           >
//                             {page}
//                           </PaginationLink>
//                         </PaginationItem>
//                       );
//                     }
//                     // More complex pagination logic for many pages
//                     return null;
//                   })}
//                   <PaginationItem>
//                     <PaginationNext
//                       onClick={() =>
//                         setCurrentPage(Math.min(totalPages, currentPage + 1))
//                       }
//                       className={
//                         currentPage === totalPages
//                           ? "pointer-events-none opacity-50"
//                           : "cursor-pointer"
//                       }
//                     />
//                   </PaginationItem>
//                 </PaginationContent>
//               </Pagination>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Notes;
