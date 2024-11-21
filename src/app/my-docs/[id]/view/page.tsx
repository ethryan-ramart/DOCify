import { EditForm } from "@/components/my-docs/edit-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getDocumentById, getUsername } from "@/lib/data";

import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  DeleteDocument,
  DownloadDocument,
  UpdateDocument,
} from "@/components/my-docs/buttons";
import ViewPDF from "@/components/ViewPDF";
import ChatWithPDF from "@/components/ChatWithPDF";

export const metadata: Metadata = {
  title: "View Document",
};

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const document = await getDocumentById(id);
  // console.log("Document", document);
  const username = await getUsername(document.user_id);
  if (!document) return notFound();

  return (
    <div className="flex justify-center items-center">
      <main className="w-full h-screen flex flex-col p-10">
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/my-docs">My Docs</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{document.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        {/* Tabs for mobile */}
        <Tabs defaultValue="document" className="w-full lg:hidden">
          <TabsList className="w-full">
            <TabsTrigger value="document" className="w-1/2">
              Document
            </TabsTrigger>
            <TabsTrigger value="chat" className="w-1/2">
              Chat
            </TabsTrigger>
          </TabsList>
          <TabsContent value="document" className="h-screen">
            <div className="w-full flex justify-center mb-4">
              <Card key={document.id}>
                <CardContent className="mt-6">
                  <div className="flex items-center space-x-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={document.cover_url}
                      alt={`${document.title}-cover`}
                      className="max-h-40 aspect-[9/16]"
                    />
                    <div>
                      {" "}
                      {/* right side wrapper */}
                      <div className="flex max-w-32 space-x-2">
                        <DownloadDocument
                          publicUrl={document.file_url}
                          className="flex-grow"
                        />
                        <UpdateDocument
                          id={document.id}
                          className="flex-grow"
                        />
                        <DeleteDocument
                          id={document.id}
                          className="flex-grow"
                        />
                      </div>
                      <div className="flex flex-col space-y-2 mt-4">
                        <CardTitle>{document.title}</CardTitle>
                        <CardDescription>{username}</CardDescription>
                        <p className="line-clamp-4">{document.description}</p>
                      </div>
                    </div>{" "}
                    {/* right side wrapper */}
                  </div>
                </CardContent>
              </Card>
            </div>
            <ViewPDF url={document.file_url} />
          </TabsContent>
          <TabsContent value="chat">
            <div className="w-full min-h=[80vh] max-h-[80vh] md:w-1/4 lg:fixed lg:right-3 lg:top-16 lg:bottom-8">
              <ChatWithPDF documentId={document.pinecone_id} />
            </div>
          </TabsContent>
        </Tabs>

        {/* Panels for desktop */}
        <div className="hidden md:flex md:flex-row space-x-2 w-full">
          <div className="w-full lg:w-3/4">
            <ViewPDF url={document.file_url} />
          </div>

          <div className="w-full max-h-[50vh] lg:w-1/4 lg:fixed lg:right-3 lg:top-16 lg:bottom-8">
            <div className="w-full flex justify-center">
              <Card key={document.id} className="w-full mb-2">
                <CardContent className="relative p-3">
                  <div className="flex items-center space-x-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={document.cover_url}
                      alt={`${document.title}-cover`}
                      className="max-h-40 aspect-[9/16]"
                    />
                    <div>
                      {" "}
                      {/* right side wrapper */}
                      <div className="flex max-w-32 space-x-2">
                        <DownloadDocument
                          publicUrl={document.file_url}
                          className="flex-grow"
                        />
                        <UpdateDocument
                          id={document.id}
                          className="flex-grow"
                        />
                        <DeleteDocument
                          id={document.id}
                          className="flex-grow"
                        />
                      </div>
                      <div className="flex flex-col space-y-2 mt-4">
                        <CardTitle>{document.title}</CardTitle>
                        <CardDescription>{username}</CardDescription>
                        <p className="line-clamp-4">{document.description}</p>
                      </div>
                    </div>{" "}
                    {/* right side wrapper */}
                  </div>
                </CardContent>
              </Card>
            </div>
            <ChatWithPDF documentId={document.pinecone_id} />
          </div>
        </div>
      </main>
    </div>
  );
}
