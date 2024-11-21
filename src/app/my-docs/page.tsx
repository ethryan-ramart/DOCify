import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Suspense } from 'react';
import { AddDocument } from '@/components/my-docs/buttons';
import { Metadata } from 'next';
import SearchInput from "@/components/search";
import { MyDocsTableSkeleton } from "@/components/skeletons";
import MyDocsTable from "@/components/my-docs/table";
import Pagination from "@/components/my-docs/pagination";
import { fetchMyDocumentsPages } from "@/lib/data";

export const metadata: Metadata = {
  title: 'My Docs'
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

  const totalPages = await fetchMyDocumentsPages(query);

  return (
    <div className="flex justify-center items-center">
      <main className="w-full flex flex-col p-10 max-w-screen-lg">
        <Breadcrumb className='mb-4'>
          <BreadcrumbList>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>My Docs</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className='w-full flex flex-col justify-center items-center'>
          <div className="w-full flex justify-between gap-2 max-w-xl">
            <SearchInput placeholder="Search my documents..." />
            <AddDocument />
          </div>
          <Suspense key={query + currentPage} fallback={<MyDocsTableSkeleton />}>
            <MyDocsTable query={query} currentPage={currentPage} totalPages={totalPages} />
          </Suspense>

        </div>
      </main>
    </div>
  );
}
