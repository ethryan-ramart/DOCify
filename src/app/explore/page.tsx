import DocumentsPagination from "@/components/explore/DocumentsPagination";
import Pagination from "@/components/my-docs/pagination";
import SearchInput from "@/components/search";
import { fetchDocumentsPages } from "@/lib/data";
import { createClient } from "@/utils/supabase/server";
import { Metadata } from 'next';
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: 'Explore'
}

export default async function ProtectedPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  // TODO: change function to search in all documents
  const totalPages = await fetchDocumentsPages(query);

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="w-full flex justify-center max-w-xl mt-4 px-4">
        <SearchInput placeholder="Search documents and users..." />
      </div>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
      <DocumentsPagination query={query} currentPage={currentPage} />
      <div className="mb-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
