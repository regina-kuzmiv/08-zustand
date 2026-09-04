"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import Link from "next/link";

import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import SearchBox from "@/components/SearchBox/SearchBox";

import * as services from "@/lib/api";
import { useDebouncedCallback } from "use-debounce";

import css from "./page.module.css";

export default function Notes({ tag }: { tag: string | undefined }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const perPage = 12;

  const { data, isSuccess } = useQuery({
    queryKey: ["notes", search, page, perPage, tag],
    queryFn: () => services.fetchNotes(search, page, perPage, tag),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (isSuccess && data.notes.length === 0) {
      toast.error("No notes found for your request.");
    }
  }, [isSuccess, data]);

  const totalPages = data?.totalPages ?? 0;
  const notes = data?.notes ?? [];

  const handleChange = useDebouncedCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
      setPage(1);
    },
    1000,
  );

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onSearchChange={handleChange} />

        {isSuccess && totalPages > 1 && (
          <Pagination
            currentPage={page}
            onPageChange={setPage}
            totalPages={totalPages}
          />
        )}

        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </header>

      <main>{isSuccess && notes.length > 0 && <NoteList notes={notes} />}</main>
    </div>
  );
}
