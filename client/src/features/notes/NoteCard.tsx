import { formatDistanceToNow } from "date-fns";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Clock, Hash, Pin } from "lucide-react";
import DOMPurify from "dompurify";
import { NoteActions } from "./NoteActions";
import type { Note } from "@/config/types";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useSearchParams } from "react-router";

const formatSafeDate = (dateString: string) => {
  if (!dateString) return "Unknown";

  const date = new Date(dateString + "Z");
  if (isNaN(date.getTime())) return "Unknown";

  return formatDistanceToNow(date, { addSuffix: true });
};

const getWordCount = (text: string) => {
  return text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
};

const NoteCard = ({ note }: { note: Note }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const sortBy = searchParams.get("sortBy") || "updatedAt";

  return (
    <Card
      className="cursor-pointer transition-all hover:shadow-lg border-2 border-border hover:border-primary/50 group"
      onClick={() => navigate(`${note.slug}`)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate leading-tight mb-1">
              {note.title || "Untitled"}
            </h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Hash className="w-3 h-3" />
                {getWordCount(note.content)} words
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />

                {sortBy === "createdAt"
                  ? formatSafeDate(note.createdAt)
                  : formatSafeDate(note.updatedAt)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 ml-2 ">
            {note.isPinned && (
              <Pin className="w-4 h-4 text-primary fill-current" />
            )}

            <NoteActions note={note} />
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p
          className="text-sm text-muted-foreground mb-3 line-clamp-3 leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(
              note.content
                ? note.content.slice(0, 120) +
                    (note.content.length > 120 ? "..." : "")
                : "No content",
            ),
          }}
        />

        <div className="flex items-center justify-between">
          <div className="flex gap-1 flex-wrap">
            {note.categories.slice(0, 2).map((category) => {
              return (
                <Badge
                  key={category.id}
                  className="text-xs px-2 py-0.5 "
                  style={{
                    backgroundColor: `${category.theme}20`,
                    color: category.theme,
                    borderColor: `${category.theme}40`,
                  }}
                >
                  {category.name}
                </Badge>
              );
            })}
            {note.categories.length > 2 && (
              <Badge className="text-xs px-2 py-0.5">
                +{note.categories.length - 2}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NoteCard;
