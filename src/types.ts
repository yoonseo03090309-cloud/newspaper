export interface Comment {
  id: string;
  author: string;
  avatar: string; // animal/emoji avatar
  content: string;
  createdAt: string;
}

export interface NewspaperData {
  newspaperTitle: string;
  headline: string;
  subheadline: string;
  paragraphs: string[];
  editorGreetingComment: string;
  editorColumn: string;
  heritageName: string;
  studentName: string;
  drawingDesc: string;
  // This will store the Base64 data of the drawing if the user draws or uploads one.
  drawingImageData?: string;
  theme: "classic" | "modern" | "cute";
  comments: Comment[];
}

export interface HeritagePreset {
  id: string;
  name: string;
  description: string;
  researchNotes: string;
  drawingDesc: string;
  defaultIcon: string;
}
