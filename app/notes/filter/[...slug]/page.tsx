import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import Notes from "./Notes.client";
import type { Metadata } from "next";

type HomeProps = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({
  params,
}: HomeProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = slug[0] === "all" ? undefined : slug[0];
  return {
    title: `Notes: ${tag ?? "all tags"}`,
    description: `Notes filtered by ${tag ?? "all tags"}`,
    openGraph: {
      title: `Notes: ${tag ?? "all tags"}`,
      description: `Notes filtered by ${tag ?? "all tags"}`,
      url: `https://notehub.com/notes/filter/${tag}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: tag,
        },
      ],
    },
  };
}

const NotesPage = async ({ params }: HomeProps) => {
  const { slug } = await params;
  const tag = slug[0] === "all" ? undefined : slug[0];

  const search = "";
  const page = 1;
  const perPage = 12;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", search, page, perPage, tag],
    queryFn: () => fetchNotes(search, page, perPage, tag),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Notes tag={tag} />
    </HydrationBoundary>
  );
};

export default NotesPage;
