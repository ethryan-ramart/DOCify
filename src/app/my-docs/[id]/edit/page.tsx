import { EditForm } from '@/components/my-docs/edit-form';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { getDocumentById } from '@/lib/data';

import { Metadata } from 'next'
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Edit Document'
}

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const document = await getDocumentById(id);
  if (!document) return notFound();

  return (
    <div className="flex justify-center items-center">
      <main className="w-full h-screen flex flex-col p-10 max-w-screen-lg">
        <Breadcrumb className='mb-4'>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/my-docs">My Docs</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Edit Document</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        {/* Form */}
        <div className='w-full flex justify-center'>
          <EditForm document={document} />
        </div>
      </main>
    </div>
  );
}