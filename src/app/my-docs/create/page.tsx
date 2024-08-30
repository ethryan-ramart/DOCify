import { CreateForm } from '@/components/my-docs/create-form';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Add Document'
}

export default async function Page() {
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
              <BreadcrumbPage>Add Document</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        {/* Form */}
        <div className='w-full flex justify-center'>
          <CreateForm />
        </div>
      </main>
    </div>
  );
}