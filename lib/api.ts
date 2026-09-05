import axios from "axios";
import type { Note, Tag } from "../types/note";

interface NoteResponseProps {
  notes: Note[];
  totalPages: number;
}

export async function fetchNotes(
  search: string,
  page: number,
  perPage: number,
  tag: string | undefined,
): Promise<NoteResponseProps> {
  const response = await axios.get<NoteResponseProps>(
    "https://notehub-public.goit.study/api/notes",
    {
      params: {
        search,
        page,
        perPage,
        tag,
      },
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
      },
    },
  );
  return response.data;
}

export type NoteCreateProps = {
  title: string;
  content: string;
  tag: Tag;
};

export async function createNote(newNote: NoteCreateProps): Promise<Note> {
  const response = await axios.post<Note>(
    "https://notehub-public.goit.study/api/notes",
    {
      title: newNote.title,
      content: newNote.content,
      tag: newNote.tag,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
      },
    },
  );
  return response.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const response = await axios.delete<Note>(
    `https://notehub-public.goit.study/api/notes/${id}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
      },
    },
  );
  return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const response = await axios.get<Note>(
    `https://notehub-public.goit.study/api/notes/${id}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
      },
    },
  );
  return response.data;
}
