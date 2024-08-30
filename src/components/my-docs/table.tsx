import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { getFilteredUserDocuments } from '@/lib/data';
import Image from 'next/image';
import { UpdateDocument, DeleteDocument, DownloadDocument, ViewDocument } from '@/components/my-docs/buttons';
import { MyDocsMobileSkeleton } from "../skeletons";
import Pagination from "./pagination";

export default async function MyDocsTable({
  query,
  currentPage,
  totalPages,
}: {
  query: string;
  currentPage: number;
  totalPages: number;
}) {
  const documents = await getFilteredUserDocuments(query, currentPage);

  // console.log(query)

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="p-2 md:pt-0">
          {/* <MyDocsMobileSkeleton /> */}

          {/* Mobile view inside here */}
          <div className="md:hidden">
            {documents && documents.length > 0 ?
              documents?.map((document) => (
                <Card key={document.id} className="my-2">
                  <CardHeader>
                    <CardTitle>{document.title}</CardTitle>
                    {/* <CardDescription>{userEmail}</CardDescription> */}
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col justify-center items-center space-y-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={document.cover_url} alt={`${document.title}-cover`} className="max-h-40 aspect-[9/16]" />
                      <p className="line-clamp-4 text-foreground/80">{document.description}</p>
                    </div>
                  </CardContent>
                  <CardFooter className="justify-evenly gap-2">
                    <ViewDocument id={document.id} className="flex-grow" />
                    <DownloadDocument publicUrl={document.file_url} className="flex-grow" />
                    <UpdateDocument id={document.id} className="flex-grow" />
                    <DeleteDocument id={document.id} className="flex-grow" />
                  </CardFooter>
                </Card>
              ))
              :
              <h1>You have no documents!</h1>
            }
          </div>

          {/* Desktop view inside here */}
          {documents && documents.length > 0 ?
            <Table className="hidden md:block">
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <span className="sr-only">Document Cover</span>
                  </TableHead>
                  <TableHead>
                    Title
                  </TableHead>
                  <TableHead>
                    Description
                  </TableHead>
                  <TableHead>
                    Category
                  </TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {
                  documents ?
                    documents?.map((document) => (
                      <TableRow key={document.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Image
                              src={`${document.cover_url}`}
                              className="rounded"
                              width={28}
                              height={28}
                              alt={`${document.title}'s cover`}
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          {document.title}
                        </TableCell>
                        <TableCell>
                          {document.description.length > 50 ? (
                            <>
                              {document.description.slice(0, 50)}...
                            </>
                          ) : (
                            document.description
                          )}
                        </TableCell>
                        <TableCell>
                          {document.category}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-3">
                            <ViewDocument id={document.id} />
                            <DownloadDocument publicUrl={document.file_url} />
                            <UpdateDocument id={document.id} />
                            <DeleteDocument id={document.id} />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                    :
                    <TableRow>
                      <TableCell>
                        No documents found.
                      </TableCell>
                    </TableRow>
                }
              </TableBody>
            </Table>
            :
            <h1>You have no documents!</h1>
          }

          <div className="mt-5 flex w-full justify-center">
            {
              documents && documents.length > 0
                ? <Pagination totalPages={totalPages} />
                : null
            }
          </div>
        </div>
      </div>
    </div>
  );
}
