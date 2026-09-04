import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import Notes from "./Notes.client";

type HomeProps = {
  params: Promise<{ slug: string[] }>;
};

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
