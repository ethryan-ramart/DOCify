import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { getDocumentById, getUserFavDocsUuid, getUsername } from '@/lib/data';

import { Metadata } from 'next'
import { notFound } from 'next/navigation';
import { DownloadDocument } from '@/components/my-docs/buttons';
import ViewPDF from '@/components/ViewPDF';
import ChatWithPDF from '@/components/ChatWithPDF';
import FavButton2 from '@/components/FavButton2';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { UserIcon } from 'lucide-react';

export const metadata: Metadata = {
  title: 'View Document'
}

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const document = await getDocumentById(id);
  const userFavs = await getUserFavDocsUuid();
  const checkIsFav = () => userFavs.includes(id);
  const isFav = checkIsFav();

  const username = await getUsername(document.user_id);
  const userId = document.user_id;
  if (!document) return notFound();

  return (
    <div className="flex justify-center items-center">
      <main className="w-full h-screen flex flex-col p-10">
        <Breadcrumb className='mb-4'>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/explore">Explore</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{document.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Tabs for mobile */}
        <Tabs defaultValue="document" className="w-full lg:hidden">
          <TabsList className='w-full'>
            <TabsTrigger value="document" className='w-1/2'>Document</TabsTrigger>
            <TabsTrigger value="chat" className='w-1/2'>Chat</TabsTrigger>
          </TabsList>

          <TabsContent value="document" className='h-screen'>
            <div className='w-full flex justify-center mb-4'>
              <Card key={document.id}>
                <CardContent className='mt-6'>
                  <div className='flex items-center space-x-3'>

                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={document.cover_url} alt={`${document.title}-cover`} className="max-h-40 aspect-[9/16]" />


                    <div> {/* right side wrapper */}
                      <div className='flex max-w-32 space-x-2'>
                        <DownloadDocument publicUrl={document.file_url} className="flex-grow" />
                      </div>

                      <div className="flex flex-col space-y-2 mt-4">
                        <CardTitle>{document.title}</CardTitle>
                        {/* <CardDescription>{username}</CardDescription> */}
                        {
                          username && userId
                            ? <CardDescription><Button variant="link" asChild><Link href={`../../profile/${userId}`}><UserIcon className="mr-1" />{username}</Link></Button></CardDescription>
                            : null
                        }
                        <p className="line-clamp-4">{document.description}</p>
                      </div>
                    </div> {/* right side wrapper */}

                  </div>
                </CardContent>
              </Card>
            </div>
            <ViewPDF url={document.file_url} />
          </TabsContent>
          <TabsContent value="chat">
            <div className='w-full min-h=[80vh] max-h-[80vh] lg:w-1/4 lg:fixed lg:right-3 lg:top-16 lg:bottom-8'>
              <ChatWithPDF documentId={document.pinecone_id} />
            </div>
          </TabsContent>
        </Tabs>

        {/* Panels for desktop */}
        <div className='hidden lg:flex lg:flex-row space-x-2 w-full'>
          <div className='w-full lg:w-3/4'>
            <div className='w-full flex justify-start'>
              <Card key={document.id} className='w-96 mb-2'>
                <CardHeader className='relative'>
                  <FavButton2 className="absolute top-4 right-4 text-2xl" isFav={isFav} bookUuid={document.id} />
                </CardHeader>
                <CardContent className='mt-6'>
                  <div className='flex items-center space-x-3'>

                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={document.cover_url} alt={`${document.title}-cover`} className="max-h-40 aspect-[9/16]" />

                    <div> {/* right side wrapper */}
                      <div className='flex max-w-32 space-x-2'>
                        <DownloadDocument publicUrl={document.file_url} className="flex-grow" />
                      </div>

                      <div className="flex flex-col space-y-2 mt-4">
                        <CardTitle>{document.title}</CardTitle>
                        {/* <CardDescription>{username}</CardDescription> */}
                        {
                          username && userId
                            ? <CardDescription><Button variant="link" asChild><Link href={`../../profile/${userId}`}><UserIcon className="mr-1" />{username}</Link></Button></CardDescription>
                            : null
                        }
                        <p className="line-clamp-4">{document.description}</p>
                      </div>
                    </div> {/* right side wrapper */}

                  </div>
                </CardContent>
              </Card>
            </div>
            <ViewPDF url={document.file_url} />
          </div>

          <div className='w-full max-h-[85vh] lg:w-1/4 lg:fixed lg:right-3 lg:top-16 lg:bottom-8'>
            <ChatWithPDF documentId={document.pinecone_id} />
          </div>
        </div>
      </main>
    </div>
  );
}