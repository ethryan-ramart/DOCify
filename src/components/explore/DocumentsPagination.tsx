import { getFilteredDocuments } from '@/lib/data';
import { MyDocsMobileSkeleton } from "../skeletons";
import DocumentsGrid from "./DocumentsGrid";

export default async function DocumentsPagination({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const documents = await getFilteredDocuments(query, currentPage);

  return (
    <DocumentsGrid documents={documents} />
  );
}
