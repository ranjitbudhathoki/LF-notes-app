export interface Note {
  id: number;
  title: string;
  slug: string;
  isPinned: boolean;
  content: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
  categories: Category[];
}

export interface Category {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}
