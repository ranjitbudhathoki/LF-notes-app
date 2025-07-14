import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit } from "lucide-react";
import { Link, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getNoteBySlugApi } from "@/api/notes";
import DOMPurify from "dompurify";
import { Badge } from "@/components/ui/badge";
import Loader from "@/components/Loader";
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
export default function NoteDetail() {
  const { slug } = useParams();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  const { data: noteData, isLoading } = useQuery({
    queryKey: ["note", slug],
    queryFn: () => getNoteBySlugApi(slug!),
  });

  if (isLoading) {
    return <Loader />;
  }

  if (!noteData || !noteData.result) {
    return (
      <div className="max-w-4xl mx-auto mt-4">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/notes">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to All Notes
            </Link>
          </Button>
        </div>
        <Card>
          <CardContent className="text-center py-12">
            <div className="space-y-4">
              <div className="text-6xl font-bold text-gray-400">404</div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Note Not Found
              </h1>
              <p className="text-gray-500 max-w-md mx-auto">
                The note with slug "{slug}" doesn't exist or may have been
                deleted.
              </p>
              <Button asChild className="mt-4">
                <Link to="/notes">View All Notes</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  const note: Note = noteData.result;

  return (
    <div className="max-w-4xl space-y-6 mx-auto mt-4 ">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/notes">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to All Notes
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/notes/${note.slug}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="space-y-2">
            <CardTitle className="text-2xl">{note.title}</CardTitle>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Created {formatDate(note.createdAt)}</span>
              {note.updatedAt !== note.createdAt && (
                <span>Updated {formatDate(note.updatedAt)}</span>
              )}
            </div>
            {note.categories && note.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {note.categories.map((category) => (
                  <Badge key={category.id} variant="secondary">
                    {category.name}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {note.content ? (
            <div
              className="prose"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(note.content),
              }}
            />
          ) : (
            <p className="text-muted-foreground italic">No content</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
